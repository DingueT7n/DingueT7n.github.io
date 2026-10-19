import { build } from "esbuild";
import assert from "node:assert/strict";
import fs from "node:fs";
const result = await build({
  stdin: {
    contents: `import React from 'react';import{renderToStaticMarkup}from'react-dom/server';import{Education,Certificates}from'./src/Credentials.jsx';export function render(kind,props){return renderToStaticMarkup(React.createElement(kind==='education'?Education:Certificates,props))}`,
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
const load = (n) =>
  JSON.parse(fs.readFileSync(`public/content/${n}.json`, "utf8"));
for (const lang of ["fr", "en", "ar"]) {
  const tr = (x) => (typeof x === "object" ? x[lang] : x),
    u = load("locales/" + lang);
  const education = render("education", { items: load("education"), tr, u });
  assert.match(education, /Kotlin/);
  assert.match(education, /final-thesis-lte-optimization/);
  assert.equal((education.match(/<details/g) || []).length, 3);
  const certs = render("certificates", {
    items: load("additional").courses,
    tr,
    u,
    lang,
  });
  assert.equal((certs.match(/class="certificate-card"/g) || []).length, 6);
  assert.equal((certs.match(/download=""/g) || []).length, 6);
  assert.ok(certs.includes(tr(load("additional").courses.at(-1).description)));
}
console.log(
  "Passed: education projects, expandable details, six certificates, PDF downloads and coauthor attribution in FR/EN/AR.",
);
