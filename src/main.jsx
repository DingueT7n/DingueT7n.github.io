import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
const files = [
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
const root = createRoot(document.getElementById("root"));
Promise.all(
  files.map(async (name) => {
    const response = await fetch(
      `${import.meta.env.BASE_URL}content/${name}.json`,
    );
    if (!response.ok) throw new Error(name);
    return [name, await response.json()];
  }),
)
  .then((entries) => root.render(<App data={Object.fromEntries(entries)} />))
  .catch(() =>
    root.render(
      <main className="load-error">
        <h1>Le portfolio est momentanément indisponible.</h1>
        <p>Please reload the page. / يرجى إعادة تحميل الصفحة.</p>
        <button className="button primary" onClick={() => location.reload()}>
          Réessayer / Retry / إعادة المحاولة
        </button>
        <p>
          <a href="mailto:gb.devalaadin@gmail.com">gb.devalaadin@gmail.com</a>
        </p>
      </main>,
    ),
  );
