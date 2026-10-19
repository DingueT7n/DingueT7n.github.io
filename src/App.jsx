import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import { Projects } from "./Projects.jsx";
import { Education, Certificates } from "./Credentials.jsx";
import { asset, Tags, ExternalLink, SectionTitle } from "./ui.jsx";
const preference = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};
const remember = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};
export default function App({ data }) {
  const [lang, setLang] = useState(() => {
    const value =
      new URL(location.href).searchParams.get("lang") ||
      preference("portfolio-lang", "fr");
    return ["fr", "en", "ar"].includes(value) ? value : "fr";
  });
  const [theme, setTheme] = useState(() =>
      preference("portfolio-theme", "light") === "dark" ? "dark" : "light",
    ),
    [copyStatus, setCopyStatus] = useState("");
  const p = data.profile,
    u = data["locales/" + lang],
    tr = (value) =>
      value && typeof value === "object" && !Array.isArray(value)
        ? (value[lang] ?? value.fr)
        : value;
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.theme = theme;
    remember("portfolio-lang", lang);
    remember("portfolio-theme", theme);
    document.title = `${p.shortName} — ${tr(p.title)}`;
    document.querySelector('meta[name="description"]').content = tr(p.summary);
    document.querySelector('meta[name="theme-color"]').content =
      theme === "dark" ? "#17251f" : "#f7f8f3";
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }, [lang, theme]);
  const date = (value) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-u-nu-latn" : lang, {
      month: "short",
      year: "numeric",
    }).format(new Date(value + "-01T12:00:00Z"));
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(p.email);
      setCopyStatus(u.copied);
    } catch {
      setCopyStatus(u.copyError);
    }
  };
  return (
    <>
      <a className="skip" href="#main">
        {u.skip}
      </a>
      <Header
        profile={p}
        u={u}
        lang={lang}
        setLang={(value) => {
          setLang(value);
          setCopyStatus("");
        }}
        theme={theme}
        setTheme={setTheme}
      />
      <main id="main" tabIndex="-1">
        <section className="hero container" id="top">
          <div className="hero-content">
            <p className="eyebrow">{u.heroEyebrow}</p>
            <p className="intro-name">{p.name}</p>
            <h1>{tr(p.title)}</h1>
            <p className="hero-subtitle">{u.heroSubtitle}</p>
            <p className="hero-summary">{tr(p.summary)}</p>
            <div className="actions">
              <a className="button primary" href="#projects">
                {u.viewProjects}
                <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button secondary"
                href={asset(p.resume[lang])}
                download
              >
                {u.downloadCV}
                <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note">{tr(p.note)}</p>
          </div>
          <aside className="profile-panel">
            <div className="portrait-wrap">
              <img
                src={asset(p.photo.src)}
                alt={tr(p.photo.alt)}
                width="600"
                height="600"
                fetchPriority="high"
              />
            </div>
            <div className="profile-caption">
              <p className="location">{tr(p.location)}</p>
              <h2>{u.focusTitle}</h2>
              <p>{u.focusBody}</p>
              <div className="academic-note">
                <h3>{u.academicFocus}</h3>
                <p>{u.academicBody}</p>
              </div>
            </div>
          </aside>
        </section>
        <Projects
          projects={data.projects}
          settings={data["project-settings"]}
          tr={tr}
          u={u}
        />
        <section id="experience" className="experience-section section">
          <div className="container experience-layout">
            <SectionTitle
              number="02"
              label={u.navExperience}
              title={u.experienceTitle}
            />
            <div className="timeline">
              {data.experience.map((x) => (
                <article key={x.id}>
                  <p className="date">
                    {x.period ? (
                      tr(x.period)
                    ) : (
                      <>
                        {date(x.startDate)}
                        {x.startDate !== x.endDate &&
                          " — " + (x.endDate ? date(x.endDate) : u.present)}
                      </>
                    )}
                  </p>
                  <h3>{tr(x.role)}</h3>
                  <p className="company">{tr(x.company)}</p>
                  <p className="work-location">{tr(x.location)}</p>
                  <ul>
                    {tr(x.points).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="skills" className="section container">
          <SectionTitle
            number="03"
            label={u.navSkills}
            title={u.skillsTitle}
            description={u.skillsIntro}
          />
          <div className="skills-grid">
            {data.skills.map((group, i) => (
              <article key={i}>
                <p className="eyebrow">
                  {i === 3 ? u.academicSkills : u.professionalSkills}
                </p>
                <h3>{tr(group.name)}</h3>
                <Tags items={group.items} />
              </article>
            ))}
          </div>
        </section>
        <section id="education" className="section education-section">
          <div className="container">
            <SectionTitle
              number="04"
              label={u.educationNav}
              title={u.educationTitle}
              description={u.educationIntro}
            />
            <div className="education-layout">
              <Education items={data.education} tr={tr} u={u} />
              <aside className="education-aside">
                <h3>{u.languages}</h3>
                <ul className="languages-list">
                  {tr(data.additional.languages).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <a className="text-link" href="#certificates">
                  {u.seeCertificates} ↓
                </a>
              </aside>
            </div>
            <details id="certificates" className="credentials-disclosure">
              <summary>
                {u.seeCredentials}
                <span aria-hidden="true"> +</span>
              </summary>
              <Certificates
                items={data.additional.courses}
                tr={tr}
                u={u}
                lang={lang}
              />
            </details>
          </div>
        </section>
        <section id="contact" className="contact section">
          <div className="container">
            <p className="eyebrow">05 / {u.navContact}</p>
            <h2>{u.contactHeading}</h2>
            <p>{u.contactIntro}</p>
            <div className="contact-layout">
              <div>
                <a
                  className="contact-email"
                  href={"mailto:" + p.email}
                  dir="ltr"
                >
                  {p.email}
                </a>
                <button className="copy-button" onClick={copy}>
                  {u.copyEmail}
                </button>
                <p className="copy-status" role="status">
                  {copyStatus}
                </p>
              </div>
              <a className="button light" href={asset(p.resume[lang])} download>
                {u.downloadCV}
                <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="contact-bottom">
              <span>{tr(p.location)}</span>
              <a href={"tel:" + p.phone} dir="ltr">
                {p.phone}
              </a>
              <ExternalLink href={p.github} u={u}>
                GitHub
              </ExternalLink>
              <ExternalLink href={p.linkedin} u={u}>
                LinkedIn
              </ExternalLink>
            </div>
          </div>
        </section>
      </main>
      <footer className="container">
        <p>
          © {new Date().getFullYear()} {p.shortName}
        </p>
        <p>{u.footer}</p>
        <a href="#top" aria-label={u.backTop}>
          ↑
        </a>
      </footer>
    </>
  );
}
