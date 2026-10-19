import fs from "node:fs";
import path from "node:path";
const root = "public/content";
const languages = ["fr", "en", "ar"];
const load = (name) =>
  JSON.parse(fs.readFileSync(`${root}/${name}.json`, "utf8"));
const fail = (message) => {
  throw new Error(message);
};
function localized(value, label) {
  if (typeof value === "string") return;
  if (!value || languages.some((l) => !(l in value)))
    fail(`Missing translation: ${label}`);
}
const profile = load("profile");
for (const key of ["title", "intro", "summary", "location", "note"])
  localized(profile[key], key);
for (const l of languages) {
  if (!fs.existsSync("public/" + profile.resume[l])) fail("Missing CV " + l);
}
for (const collection of ["projects", "experience"]) {
  const ids = new Set();
  for (const item of load(collection)) {
    if (!item.id || ids.has(item.id))
      fail("Missing/duplicate id: " + collection);
    ids.add(item.id);
    for (const key of collection === "projects"
      ? ["name", "type", "headline", "summary", "challenge", "contributions"]
      : ["company", "role", "location", "points"])
      localized(item[key], `${item.id}.${key}`);
    if (collection === "projects") {
      if (
        !load("project-settings").categories.some((c) => c.id === item.category)
      )
        fail("Invalid category");
      if (!Array.isArray(item.stack)) fail("Invalid stack");
      for (const url of Object.values(item.links)) {
        if (url && !/^https:\/\//.test(url)) fail("Use HTTPS project links");
      }
      if (item.image && !fs.existsSync(path.join("public", item.image)))
        fail("Missing image " + item.image);
    }
  }
}
const keys = Object.keys(load("locales/fr")).sort().join();
for (const l of languages) {
  if (
    Object.keys(load("locales/" + l))
      .sort()
      .join() !== keys
  )
    fail("UI locale keys differ: " + l);
}
for (const f of ["skills", "education", "additional"]) load(f);
console.log(
  "Content validated: translations, IDs, categories, links, images and CVs.",
);

function media(src, label) {
  if (!src) return;
  if (/^https:\/\//.test(src)) return;
  if (
    path.isAbsolute(src) ||
    src.includes("..") ||
    !fs.existsSync(path.join("public", src))
  )
    fail("Invalid local media: " + label);
}
media(load("project-settings").defaultLogo, "default logo");
for (const item of load("projects")) {
  media(item.logo?.src, item.id + " logo");
  localized(item.logo?.alt, item.id + " logo alt");
  if (!Array.isArray(item.gallery) || !Array.isArray(item.details))
    fail("Missing gallery/details " + item.id);
  for (const image of item.gallery) {
    if (!image.src) fail("Missing gallery source");
    media(image.src, item.id);
    localized(image.alt, item.id + " image alt");
    if (image.caption) localized(image.caption, "caption");
  }
  for (const section of item.details) {
    localized(section.title, "detail title");
    localized(section.body, "detail body");
  }
}
console.log("Project logos, galleries and technical details validated.");
media(profile.photo.src, "profile photo");
localized(profile.photo.alt, "photo alt");
if (!profile.heroCard.items.length) fail("Empty hero card");
for (const item of profile.heroCard.items) {
  localized(item.title, "hero title");
  if (!item.subtitle) fail("Missing hero subtitle");
}
for (const item of load("projects"))
  for (const repo of item.repositories || []) {
    localized(repo.label, "repository label");
    if (!/^https:\/\//.test(repo.url)) fail("Repository URL must use HTTPS");
  }
console.log("Portrait, hero card and repository links validated.");
for (const item of load("education")) {
  for (const key of ["school", "date", "degree"])
    localized(item[key], "education " + key);
  for (const key of ["project", "summary", "detail"])
    if (item[key]) localized(item[key], "education " + key);
  if (item.github && !/^https:\/\//.test(item.github))
    fail("Invalid education GitHub");
}
const certificateIds = new Set();
for (const item of load("additional").courses) {
  if (!item.id || certificateIds.has(item.id))
    fail("Duplicate/missing certificate id");
  certificateIds.add(item.id);
  localized(item.title, "certificate title");
  localized(item.description, "certificate description");
  for (const key of ["image", "pdf"]) {
    if (!item[key]) fail("Missing certificate media");
    media(item[key], item.id);
  }
  if (item.url && !/^https:\/\//.test(item.url))
    fail("Invalid certificate URL");
  if (!["course", "research"].includes(item.kind))
    fail("Invalid certificate kind");
}
console.log("Education and certificate records validated.");

for (const project of load("projects")) {
  if (project.images !== undefined && !Array.isArray(project.images))
    fail("images must be an array");
  for (const src of project.images || []) {
    if (typeof src !== "string" || !src) fail("Invalid project image");
    media(src.replace(/^\/+/, ""), project.id + " images");
  }
}
console.log("Project images arrays validated.");
