import { build } from "esbuild";
import assert from "node:assert/strict";
const result = await build({
  stdin: {
    contents: `import React from 'react';import{renderToStaticMarkup}from'react-dom/server';import{ProjectLogo,ProjectGallery}from'./src/ProjectMedia.jsx';export function render(kind,props){return renderToStaticMarkup(React.createElement(kind==='logo'?ProjectLogo:ProjectGallery,props))}`,
    resolveDir: process.cwd(),
    loader: "jsx",
  },
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
  define: { "import.meta.env.BASE_URL": '"./"' },
});
// Keep Node built-ins resolvable in the bundled server-rendering harness.
const code =
  "import {createRequire} from 'node:module';const require=createRequire(" +
  JSON.stringify(process.cwd() + "/package.json") +
  ");\n" +
  result.outputFiles[0].text;
const { render } = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);
const tr = (x) => x?.fr ?? x;
const u = {
  gallery: "Images",
  noGallery: "No images yet",
  openImage: "Open image",
  imageUnavailable: "Unavailable",
};
assert.match(
  render("logo", {
    logo: { src: null, alt: "Logo" },
    fallback: "images/default.svg",
    tr,
  }),
  /src="\.\/images\/default.svg"/,
);
assert.match(
  render("logo", {
    logo: { src: "images/custom.svg", alt: "Logo" },
    fallback: "images/default.svg",
    tr,
  }),
  /src="\.\/images\/custom.svg"/,
);
assert.match(render("gallery", { gallery: [], tr, u }), /No images yet/);
const gallery = render("gallery", {
  gallery: [
    {
      src: "images/dashboard.webp",
      alt: { fr: "Tableau" },
      caption: { fr: "Mes indicateurs" },
    },
  ],
  tr,
  u,
});
assert.match(gallery, /alt="Tableau"/);
assert.match(gallery, /href="\.\/images\/dashboard.webp"/);
assert.match(gallery, /Mes indicateurs/);
console.log(
  "Passed: default/custom logo, empty gallery, image link, translated alt and caption.",
);

const project = JSON.parse(
  (await import("node:fs")).readFileSync(
    "public/content/projects.json",
    "utf8",
  ),
).find((p) => p.id === "store");
const storeGallery = render("gallery", {
  gallery: project.gallery,
  images: project.images,
  projectName: project.name,
  tr,
  u,
});
assert.equal((storeGallery.match(/<figure>/g) || []).length, 7);
for (const src of project.images)
  assert.ok(storeGallery.includes('href=".' + src + '"'));
const combined = render("gallery", {
  gallery: [{ src: "images/test.jpg", alt: "Test" }],
  images: ["/images/test.jpg"],
  tr,
  u,
});
assert.equal((combined.match(/<figure>/g) || []).length, 1);
console.log(
  "Passed: seven StoreApp photos, leading slash paths and duplicate removal.",
);
