/* Marque PAVEN : le symbole est une route qui part d'un marché (la barre) vers un autre (le point).
   Construit sur une grille de 100 : la barre verticale et la route forment un P sans le dire. */

export const RAISIN = "#242124";
export const OFFWHITE = "#F5F2EC";
export const SUNSET = "#E96A4F";

type Tone = "light" | "dark" | "mono-light" | "mono-dark";
const ink = (t: Tone) => (t === "dark" || t === "mono-dark" ? OFFWHITE : RAISIN);
const node = (t: Tone) => (t === "mono-light" ? RAISIN : t === "mono-dark" ? OFFWHITE : SUNSET);

/** Symbole seul, 100 × 100. */
export function Mark({ tone = "light", size = 32, title = "PAVEN", className }: { tone?: Tone; size?: number; title?: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true} className={className}>
      <path d="M28 12v76" stroke={ink(tone)} strokeWidth="14" strokeLinecap="square" fill="none" />
      <path d="M28 19h26a19 19 0 0 1 0 38h-8" stroke={ink(tone)} strokeWidth="14" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <circle cx="73" cy="78" r="10" fill={node(tone)} />
    </svg>
  );
}

/** Logo horizontal : symbole + mot-symbole. */
export function Logo({ tone = "light", height = 28, title = "PAVEN", className }: { tone?: Tone; height?: number; title?: string; className?: string }) {
  const h = height;
  return (
    <svg viewBox="0 0 360 100" height={h} width={h * 3.6} role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true} className={className}>
      <path d="M28 12v76" stroke={ink(tone)} strokeWidth="14" strokeLinecap="square" fill="none" />
      <path d="M28 19h26a19 19 0 0 1 0 38h-8" stroke={ink(tone)} strokeWidth="14" strokeLinecap="square" fill="none" />
      <circle cx="73" cy="78" r="10" fill={node(tone)} />
      <text x="112" y="80" fontFamily="Manrope Variable, Manrope, sans-serif" fontWeight="800" fontSize="78" letterSpacing="-3" fill={ink(tone)}>PAVEN</text>
    </svg>
  );
}
