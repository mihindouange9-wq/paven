import { Link } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { BRAND, FOOTER } from "../content/fr";

const PLATFORM: [string, string][] = [["Découvrir", "/app/decouvrir"], ["Compatibilités", "/app/compatibilites"], ["Opportunités", "/app/opportunites"], ["Expansion", "/app/expansion"], ["Entreprises", "/app/entreprises"], ["À propos", "#plateforme"]];

export default function Footer() {
  return (
    <footer className="footer" data-tone="dark">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo tone="dark" title="PAVEN" height={30} />
            <p className="footer__statement">{BRAND.footer}</p>
            <p className="footer__vision">{BRAND.vision}</p>
          </div>
          <nav className="footer__col" aria-label="Plateforme">
            <h2 className="label">Plateforme</h2>
            <ul>{PLATFORM.map(([l, to]) => <li key={l}>{to.startsWith("#") ? <a href={to}>{l}</a> : <Link to={to}>{l}</Link>}</li>)}</ul>
          </nav>
          <div className="footer__col">
            <h2 className="label">Informations</h2>
            <ul>{FOOTER.legal.map((l) => <li key={l}><span>{l}</span></li>)}</ul>
          </div>
          <div className="footer__col">
            <h2 className="label">Langue</h2>
            <ul className="footer__lang">{FOOTER.languages.map((l, i) => <li key={l}><button type="button" aria-pressed={i === 0}>{l}</button></li>)}</ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© 2026 PAVEN · {BRAND.tagline}</p>
          <p>{FOOTER.demo}</p>
        </div>
      </div>
    </footer>
  );
}
