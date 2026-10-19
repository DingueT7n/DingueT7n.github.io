import React, { useRef, useState } from "react";
import { asset } from "./ui.jsx";
export default function Header({ profile, u, lang, setLang, theme, setTheme }) {
  const [expanded, setExpanded] = useState(false),
    toggle = useRef(null);
  const links = [
    ["projects", u.navProjects],
    ["experience", u.navExperience],
    ["skills", u.navSkills],
    ["education", u.educationNav],
    ["contact", u.navContact],
  ];
  return (
    <header
      className="header"
      onKeyDown={(e) => {
        if (e.key === "Escape" && expanded) {
          setExpanded(false);
          toggle.current.focus();
        }
      }}
    >
      <div className="header-inner container">
        <a className="brand" href="#top" aria-label={profile.name}>
          <img src={asset(profile.photo.src)} alt="" width="44" height="44" />
          <span>
            <strong>{profile.shortName}</strong>
          </span>
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={expanded}
          aria-controls="primary-navigation"
          onClick={() => setExpanded(!expanded)}
        >
          {u.navMenu}
          <span aria-hidden="true">{expanded ? "×" : "☰"}</span>
        </button>
        <nav
          id="primary-navigation"
          className={expanded ? "navigation is-open" : "navigation"}
          aria-label={u.navMenu}
        >
          {links.map(([id, title]) => (
            <a href={"#" + id} key={id} onClick={() => setExpanded(false)}>
              {title}
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <div
            className="language"
            role="group"
            aria-label="Langue / Language / اللغة"
          >
            {["fr", "en", "ar"].map((l) => (
              <button
                type="button"
                key={l}
                lang={l}
                aria-label={{ fr: "Français", en: "English", ar: "العربية" }[l]}
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
              >
                {l === "ar" ? "ع" : l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            className="theme-toggle"
            aria-label={u.theme}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <span aria-hidden="true">{theme === "light" ? "◐" : "☀"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
