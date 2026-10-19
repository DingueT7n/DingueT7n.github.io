import React from "react";
const base = import.meta.env.BASE_URL;
export function Education({ items, tr, u }) {
  return (
    <div>
      <h3 className="subheading">{u.education}</h3>
      {items.map((x, i) => (
        <article className="education-item" key={x.id || i}>
          <span className="date">{tr(x.date)}</span>
          <h4>{tr(x.degree)}</h4>
          <p>{tr(x.school)}</p>
          {x.project && <h5 className="education-project">{tr(x.project)}</h5>}
          {x.summary && <p>{tr(x.summary)}</p>}
          {x.detail && (
            <details className="education-details">
              <summary>{u.educationDetails}</summary>
              <p>{tr(x.detail)}</p>
            </details>
          )}
          {x.technologies?.length > 0 && (
            <div className="tags">
              {x.technologies.map((tag) => (
                <span key={tag} dir="auto">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {x.github && (
            <a
              className="text-button"
              href={x.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
export function Certificates({ items, tr, u, lang }) {
  return (
    <section className="certificates-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{u.courses}</p>
          <h3>{u.certifications}</h3>
          <p>{u.certIntro}</p>
        </div>
      </div>
      <div className="certificate-grid">
        {items.map((item) => (
          <article className="certificate-card" key={item.id}>
            <a
              href={base + item.image}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${u.viewCertificate} : ${tr(item.title)}`}
            >
              <img
                src={base + item.image}
                alt={tr(item.title)}
                loading="lazy"
                width="480"
                height="340"
              />
            </a>
            <div className="certificate-body">
              <p className="eyebrow">
                {item.kind === "research"
                  ? u.researchCertificate
                  : u.courseCertificate}
              </p>
              <h4>{tr(item.title)}</h4>
              <p className="certificate-meta">
                {item.issuer} ·{" "}
                {new Intl.DateTimeFormat(
                  lang === "ar" ? "ar-u-nu-latn" : lang,
                  { dateStyle: "medium" },
                ).format(new Date(item.date + "T12:00:00Z"))}
              </p>
              <p>{tr(item.description)}</p>
              <div className="certificate-actions">
                <a
                  href={base + item.image}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {u.viewCertificate} ↗
                </a>
                <a href={base + item.pdf} download>
                  {u.downloadPDF} ↓
                </a>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {u.verifyCertificate} ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
