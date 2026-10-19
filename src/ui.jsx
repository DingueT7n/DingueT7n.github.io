import React from "react";
export const base = import.meta.env.BASE_URL;
export const asset = (src) =>
  /^https:\/\//.test(src) ? src : base + src.replace(/^\/+/, "");
export function Tags({ items = [] }) {
  return (
    <ul className="tags" aria-label="Technologies">
      {items.map((item) => (
        <li key={item} dir="auto">
          {item}
        </li>
      ))}
    </ul>
  );
}
export function ExternalLink({ href, children, u, className = "" }) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="sr-only"> ({u.newTab})</span>
    </a>
  );
}
export function SectionTitle({ number, label, title, description }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <span aria-hidden="true">{number} / </span>
        {label}
      </p>
      <h2>{title}</h2>
      {description && <p className="section-intro">{description}</p>}
    </div>
  );
}
