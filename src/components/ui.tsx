import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { countryByCode, partnershipName, VERIFICATIONS } from "../data/mock";
import type { Company, PartnershipTypeId, VerificationLevel } from "../data/types";

/** Libellé de champ, capitales espacées. */
export const Label = ({ children, strong, className = "" }: { children: ReactNode; strong?: boolean; className?: string }) => (
  <span className={`label ${strong ? "label--strong" : ""} ${className}`}>{children}</span>
);

/** Champ du dossier : libellé + valeur. state : filled (buff), empty (hachure), plain. */
export function Field({ label, value, state = "plain", large, className = "" }: { label: ReactNode; value: ReactNode; state?: "plain" | "filled" | "empty"; large?: boolean; className?: string }) {
  return (
    <div className={`field field--${state} ${className}`}>
      <Label>{label}</Label>
      <div className={`field__value ${large ? "field__value--lg" : ""}`}>{state === "empty" ? "—" : value}</div>
    </div>
  );
}

/** Score en cellules de chiffres à largeur fixe. */
export function Score({ value, size = "1.5rem", accent, className = "" }: { value: number; size?: string; accent?: boolean; className?: string }) {
  const digits = String(value).split("");
  return (
    <span className={`score ${accent ? "score--accent" : ""} ${className}`} style={{ fontSize: size }} aria-label={`${value} %`}>
      {digits.map((d, i) => (
        <span key={i} className="score__cell" aria-hidden="true">{d}</span>
      ))}
      <small aria-hidden="true">%</small>
    </span>
  );
}

/** Pays : code + nom. */
export function Country({ code, filled, nameless, className = "" }: { code: string; filled?: boolean; nameless?: boolean; className?: string }) {
  const c = countryByCode(code);
  return (
    <span className={`country ${filled ? "country--filled" : ""} ${className}`}>
      <span className="country__code" aria-hidden="true">{code}</span>
      <span className={nameless ? "sr-only" : undefined}>{c?.name ?? code}</span>
    </span>
  );
}

/** Type de partenariat avec son marqueur constant. */
export function PType({ id, className = "" }: { id: PartnershipTypeId; className?: string }) {
  return (
    <span className={`ptype ${className}`}>
      <i className="ptype__mark" data-k={id} aria-hidden="true" />
      {partnershipName(id)}
    </span>
  );
}

export const Monogram = ({ company, large, dark }: { company: Company; large?: boolean; dark?: boolean }) => (
  <span className={`monogram ${large ? "monogram--lg" : ""} ${dark ? "monogram--dark" : ""}`} aria-hidden="true">{company.monogram}</span>
);

/** Niveaux de vérification. */
export function Verifs({ levels, compact }: { levels: VerificationLevel[]; compact?: boolean }) {
  const all: VerificationLevel[] = ["business", "information", "ready"];
  return (
    <ul style={{ display: "flex", flexWrap: "wrap", gap: compact ? "0.75rem" : "1rem" }}>
      {all.map((l) => (
        <li key={l} className={`verif ${levels.includes(l) ? "" : "verif--off"}`}>
          <i className="verif__dot" aria-hidden="true" />
          {VERIFICATIONS[l].label}
        </li>
      ))}
    </ul>
  );
}

export const Stamp = ({ children, solid, className = "" }: { children: ReactNode; solid?: boolean; className?: string }) => (
  <span className={`stamp ${solid ? "stamp--solid" : ""} ${className}`}>{children}</span>
);

export const Button = ({ to, href, children, primary, light, small, className = "", onClick, type = "button", disabled }: { to?: string; href?: string; children: ReactNode; primary?: boolean; light?: boolean; small?: boolean; className?: string; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }) => {
  const cls = `btn ${primary ? "btn--primary" : ""} ${light ? "btn--light" : ""} ${small ? "btn--small" : ""} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button type={type} className={cls} onClick={onClick} disabled={disabled}>{children}</button>;
};

/** Icône de coche pour les raisons de compatibilité. */
export const Check = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true"><path d="M3.5 8.5l2.8 2.8L12.5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
