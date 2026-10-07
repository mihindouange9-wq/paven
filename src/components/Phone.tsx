import type { ReactNode } from "react";

/** Un smartphone dessiné en CSS ; l'écran est une vraie interface, pas une image. */
export default function Phone({ children, label, className = "" }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <div className={`phone ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <div className="phone__screen">
        <span className="phone__island" />
        <div className="phone__content">{children}</div>
        <span className="phone__home" />
      </div>
    </div>
  );
}
