import React, { useState } from "react";
const base = import.meta.env.BASE_URL;
const asset = (src) =>
  /^https:\/\//.test(src) ? src : base + src.replace(/^\/+/, "");
export function ProjectLogo({ logo, fallback, tr }) {
  const [failed, setFailed] = useState(false);
  const source = !failed && logo?.src ? logo.src : fallback;
  return (
    <img
      className="project-logo"
      src={asset(source)}
      alt={tr(logo?.alt) || ""}
      width="56"
      height="56"
      onError={() => setFailed(true)}
    />
  );
}
function GalleryImage({ item, tr, u }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure>
      {failed ? (
        <p role="status">{u.imageUnavailable}</p>
      ) : (
        <a
          href={asset(item.src)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${u.openImage} : ${tr(item.alt)}`}
        >
          <img
            src={asset(item.src)}
            alt={tr(item.alt)}
            width="1280"
            height="800"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        </a>
      )}
      {item.caption && <figcaption>{tr(item.caption)}</figcaption>}
    </figure>
  );
}
export function ProjectGallery({
  gallery = [],
  images = [],
  projectName = "",
  tr,
  u,
}) {
  const seen = new Set();
  const items = [
    ...gallery,
    ...images.map((src, index) => ({
      src,
      alt: `${tr(projectName) || u.gallery} — ${index + 1}`,
    })),
  ].filter((item) => {
    const key = asset(item.src);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return (
    <section className="project-gallery">
      <h3>{u.gallery}</h3>
      {items.length ? (
        <div className="gallery-grid">
          {items.map((item) => (
            <GalleryImage key={item.src} item={item} tr={tr} u={u} />
          ))}
        </div>
      ) : (
        <p className="gallery-empty">{u.noGallery}</p>
      )}
    </section>
  );
}
