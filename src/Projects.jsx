import React, { useEffect, useRef, useState } from "react";
import { asset, Tags, ExternalLink, SectionTitle } from "./ui.jsx";
import { ProjectLogo, ProjectGallery } from "./ProjectMedia.jsx";
export function Projects({ projects, settings, tr, u }) {
  const [selected, setSelected] = useState(null),
    dialog = useRef(null),
    trigger = useRef(null),
    closeButton = useRef(null);
  useEffect(() => {
    if (!selected) return;
    const el = dialog.current;
    el.showModal();
    el.scrollTop = 0;
    closeButton.current.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      if (el.open) el.close();
    };
  }, [selected]);
  const open = (project, event) => {
    trigger.current = event.currentTarget;
    setSelected(project);
  };
  const close = () => {
    dialog.current.close();
    setSelected(null);
    trigger.current?.focus();
  };
  const featured = settings.featuredIds
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean);
  const academic = projects.filter((p) => settings.academicIds.includes(p.id));
  const others = projects.filter(
    (p) =>
      !settings.featuredIds.includes(p.id) &&
      !settings.academicIds.includes(p.id),
  );
  const card = (project, index) => {
    const photo = project.gallery?.[0]?.src || project.images?.[0];
    return (
      <article
        className={`featured-project ${photo ? "has-screenshot" : ""}`}
        key={project.id}
      >
        <div className="project-preview">
          {photo ? (
            <a
              href={asset(photo)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${u.openImage} — ${tr(project.name)} (${u.newTab})`}
            >
              <div className="preview-chrome" aria-hidden="true">
                <span>● ● ●</span>
                <span>{tr(project.name)}</span>
              </div>
              <img
                src={asset(photo)}
                alt={`${u.projectScreenshots} — ${tr(project.name)}`}
                width={project.previewDimensions?.width || 1280}
                height={project.previewDimensions?.height || 720}
                loading="lazy"
              />
              <span className="preview-hint">{u.openImage} ↗</span>
            </a>
          ) : (
            <div className="project-identity">
              <ProjectLogo
                logo={{
                  ...project.logo,
                  src: project.logo?.src || project.image,
                }}
                fallback={settings.defaultLogo}
                tr={tr}
              />
              <span className="project-monogram" dir="auto">
                {tr(project.displayName || project.name)}
              </span>
              <p>{tr(project.headline)}</p>
            </div>
          )}
        </div>
        <div className="project-story">
          <p className="eyebrow">
            <span aria-hidden="true">0{index + 1} / </span>
            {tr(project.type)}
          </p>
          <h3>{tr(project.name)}</h3>
          <p>{tr(project.summary)}</p>
          <Tags items={project.stack.slice(0, 5)} />
          <button
            className="button primary"
            aria-label={`${u.viewStudy} — ${tr(project.name)}`}
            onClick={(e) => open(project, e)}
          >
            {u.viewStudy}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </article>
    );
  };
  const row = (project) => (
    <article className="project-row" key={project.id}>
      <ProjectLogo
        logo={project.logo}
        fallback={settings.defaultLogo}
        tr={tr}
      />
      <div>
        <p className="eyebrow">{tr(project.type)}</p>
        <h4>{tr(project.name)}</h4>
        <p>{tr(project.summary)}</p>
        <Tags items={project.stack.slice(0, 4)} />
      </div>
      <button
        className="row-action"
        aria-label={`${u.details} — ${tr(project.name)}`}
        onClick={(e) => open(project, e)}
      >
        {u.details}
        <span aria-hidden="true"> ↗</span>
      </button>
    </article>
  );
  return (
    <section id="projects" className="section container">
      <SectionTitle
        number="01"
        label={u.navProjects}
        title={u.featuredTitle}
        description={u.featuredIntro}
      />
      <div className="featured-projects">{featured.map(card)}</div>
      <div className="more-projects">
        <h3>{u.otherProjects}</h3>
        {others.map(row)}
      </div>
      <div className="academic-projects">
        <p className="eyebrow">{u.academicFocus}</p>
        <h3>{u.academicProjects}</h3>
        <p>{u.academicIntro}</p>
        <details className="academic-disclosure">
          <summary>
            {u.showAcademic}
            <span aria-hidden="true"> +</span>
          </summary>
          <div>{academic.map(row)}</div>
        </details>
      </div>
      <dialog
        ref={dialog}
        className="project-dialog"
        aria-labelledby="project-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="dialog-toolbar">
          <span>{u.projectOverview}</span>
          <button
            className="button secondary"
            ref={closeButton}
            onClick={close}
          >
            {u.close}
            <span aria-hidden="true">×</span>
          </button>
        </div>
        {selected && (
          <div className="dialog-content">
            <p className="eyebrow">{tr(selected.type)}</p>
            <h2 id="project-title">{tr(selected.name)}</h2>
            <p>{tr(selected.summary)}</p>
            <Tags items={selected.stack} />
            <div className="project-resource-links">
              {selected.links.demo && (
                <ExternalLink
                  href={selected.links.demo}
                  u={u}
                  className="button primary"
                >
                  {u.demo}
                </ExternalLink>
              )}
              {selected.links.source && (
                <ExternalLink
                  href={selected.links.source}
                  u={u}
                  className="button secondary"
                >
                  {u.source}
                </ExternalLink>
              )}
              {selected.repositories?.map((repo) => (
                <ExternalLink
                  key={repo.url}
                  href={repo.url}
                  u={u}
                  className="button secondary"
                >
                  {tr(repo.label)}
                </ExternalLink>
              ))}
            </div>
            <h3>{u.challenge}</h3>
            <p>{tr(selected.challenge)}</p>
            <h3>{u.contributions}</h3>
            <ul className="contribution-list">
              {tr(selected.contributions).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            {selected.details?.length > 0 && (
              <section className="technical-details">
                <h3>{u.technicalDetails}</h3>
                {selected.details.map((item, i) => (
                  <article key={i}>
                    <h4>{tr(item.title)}</h4>
                    <p>{tr(item.body)}</p>
                  </article>
                ))}
              </section>
            )}
            {(selected.gallery?.length > 0 || selected.images?.length > 0) && (
              <ProjectGallery
                key={selected.id}
                gallery={selected.gallery}
                images={selected.images}
                projectName={selected.name}
                tr={tr}
                u={u}
              />
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
