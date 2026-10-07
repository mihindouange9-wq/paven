import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { NAV } from "../content/fr";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <header className={`header ${solid || open ? "is-solid" : ""} ${open ? "is-open" : ""}`}>
      <div className="container header__bar">
        <a className="header__logo" href="#accueil" aria-label="PAVEN, retour à l'accueil" onClick={() => setOpen(false)}>
          <Logo title="" height={26} />
        </a>
        <nav className="header__nav" aria-label="Navigation principale">
          {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <div className="header__actions">
          <span className="header__lang" aria-label="Langue">
            <button type="button" aria-pressed="true">FR</button>
            <button type="button" aria-pressed="false" title="Version anglaise à venir">EN</button>
          </span>
          <Link className="btn btn--small header__cta" to="/app">Ouvrir l'espace</Link>
        </div>
        <button className="header__toggle" type="button" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((v) => !v)}>
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          <i /><i />
        </button>
      </div>
      <nav id="menu-mobile" className="header__sheet" aria-label="Menu" hidden={!open}>
        <div className="container">
          {NAV.map((n) => <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>)}
          <Link to="/app" className="header__sheet-cta" onClick={() => setOpen(false)}>Ouvrir l'espace PAVEN</Link>
        </div>
      </nav>
    </header>
  );
}
