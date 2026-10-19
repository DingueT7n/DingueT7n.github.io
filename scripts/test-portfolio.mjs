import { build } from "esbuild";
import assert from "node:assert/strict";
import fs from "node:fs";
const result = await build({
  stdin: {
    contents: `import React from 'react';import{renderToStaticMarkup}from'react-dom/server';import App from './src/App.jsx';export function render(data){return renderToStaticMarkup(React.createElement(App,{data}))}`,
    resolveDir: process.cwd(),
    loader: "jsx",
  },
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
  define: { "import.meta.env.BASE_URL": '"./"' },
});
const code =
  "import {createRequire} from 'node:module';const require=createRequire(" +
  JSON.stringify(process.cwd() + "/package.json") +
  ");\n" +
  result.outputFiles[0].text;
const { render } = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);
const names = [
  "project-settings",
  "profile",
  "projects",
  "experience",
  "skills",
  "education",
  "additional",
  "locales/fr",
  "locales/en",
  "locales/ar",
];
const data = Object.fromEntries(
  names.map((n) => [
    n,
    JSON.parse(fs.readFileSync("public/content/" + n + ".json", "utf8")),
  ]),
);
for (const lang of ["fr", "en", "ar"]) {
  globalThis.location = { href: "https://example.test/?lang=" + lang };
  const html = render(data);
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  for (const id of [
    "projects",
    "experience",
    "skills",
    "education",
    "contact",
    "certificates",
  ])
    assert.equal(
      (html.match(new RegExp('id="' + id + '"', "g")) || []).length,
      1,
    );
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-controls="primary-navigation"/);
  assert.match(html, /StoreApp\/HomeScreen.jpg/);
  assert.ok(html.includes(data.profile.resume[lang]));
  assert.match(html, /mailto:gb.devalaadin@gmail.com/);
  assert.match(html, /tel:\+33770840647/);
  const urls = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map((m) => m[1]);
  for (const url of urls)
    if (url.startsWith("./"))
      assert.ok(fs.existsSync("public/" + url.slice(2)), url);
  const settings = data["project-settings"];
  assert.equal(settings.featuredIds.length, 3);
  for (const id of [...settings.featuredIds, ...settings.academicIds])
    assert.ok(data.projects.some((p) => p.id === id));
}
const luminance = (hex) => {
  const v = hex
    .replace("#", "")
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const contrast = (a, b) => {
  const l = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (l[0] + 0.05) / (l[1] + 0.05);
};
for (const pair of [
  ["#53645b", "#f7f8f3"],
  ["#245b46", "#ffffff"],
  ["#c0cdbf", "#17251f"],
  ["#c2db9c", "#17251f"],
  ["#d2dfce", "#234b39"],
])
  assert.ok(contrast(...pair) >= 4.5, pair.join("/"));
for (const pair of [
  ["#6c8073", "#ffffff"],
  ["#8ba18e", "#17251f"],
])
  assert.ok(contrast(...pair) >= 3);
console.log(
  "Passed: FR/EN/AR semantic structure, navigation targets, screenshot/CV files, project grouping and selected color contrasts. Browser interaction and full WCAG compliance not assessed.",
);
