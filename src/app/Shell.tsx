import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { Logo, Mark } from "../brand/Logo";
import { Monogram } from "../components/ui";
import { APP_NAV } from "../content/fr";
import { companyById, USER } from "../data/mock";
import "./app.css";

/** Coquille de l'espace PAVEN : rail de navigation, barre d'en-tête, page. Mode Operate, même monde que la landing. */
export default function Shell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const me = companyById(USER.company);
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className={`app ${open ? "is-open" : ""}`}>
      <a className="skip-link" href="#page">Aller au contenu</a>
      <aside className="app__rail" aria-label="Navigation de l'espace">
        <NavLink to="/" className="app__brand" aria-label="PAVEN, retour au site"><Logo height={24} title="" /></NavLink>
        <nav className="app__nav">
          {APP_NAV.map((n) => (
            <NavLink key={n.id} to={n.path} end={n.path === "/app"} className={({ isActive }) => `app__link ${isActive ? "is-active" : ""}`}>
              <i className="app__link-mark" aria-hidden="true" />{n.label}
            </NavLink>
          ))}
          <NavLink to="/app/analytique" className={({ isActive }) => `app__link ${isActive ? "is-active" : ""}`}><i className="app__link-mark" aria-hidden="true" />Analytique</NavLink>
        </nav>
        <div className="app__me">
          <Monogram company={me} dark />
          <div><strong>{me.name}</strong><span>{USER.name} · {USER.role}</span></div>
        </div>
      </aside>

      <div className="app__main">
        <header className="app__bar">
          <button type="button" className="app__toggle" aria-expanded={open} aria-controls="rail" onClick={() => setOpen((v) => !v)}>
            <span className="sr-only">{open ? "Fermer la navigation" : "Ouvrir la navigation"}</span><i /><i />
          </button>
          <NavLink to="/app" className="app__bar-brand" aria-label="Vue d'ensemble"><Mark size={22} title="" /></NavLink>
          <label className="app__search">
            <Search size={16} aria-hidden="true" />
            <input type="search" placeholder="Rechercher une entreprise, un marché, un secteur" aria-label="Rechercher" />
          </label>
          <button type="button" className="app__bell" aria-label="Notifications : 3 nouvelles"><Bell size={18} /><span className="app__bell-n tabular">3</span></button>
        </header>
        <main id="page" className="app__page">
          <Outlet />
        </main>
        <p className="app__demo">Espace de démonstration : entreprises, scores et conversations sont fictifs.</p>
      </div>
      {open ? <button type="button" className="app__scrim" aria-label="Fermer la navigation" onClick={() => setOpen(false)} /> : null}
    </div>
  );
}
