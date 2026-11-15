import Link from "next/link";
import { inr, CATEGORY_LABELS, withShots } from "@/lib/config";
import { VerifiedIcon } from "./Icons";

export function Price({ item, suffix = true }) {
  // Pay as you go (Phone Login: per SMS code).
  if (item.usagePrice) {
    return (
      <span className="price">
        ₹{Number(item.usagePrice.amount).toFixed(2)}
        {suffix ? <span className="subtle"> per {item.usagePrice.unit}</span> : null}
      </span>
    );
  }
  if (item.free) return <span className="price price--free">Free</span>;
  return (
    <span className="price">
      {inr(item.price)}
      {suffix ? <span className="subtle">{item.kind === "app" ? "/mo" : "/yr"}</span> : null}
    </span>
  );
}

/** Who made it: Oyklane gets the seal; a developer, their name. */
export function By({ item }) {
  return item.official ? (
    <span className="by">
      <VerifiedIcon size={13} /> Oyklane
    </span>
  ) : (
    <span className="by">{item.by?.name || "Independent developer"}</span>
  );
}

/** A browser window around a screenshot (or the drawn mock). */
export function Frame({ src, alt = "", url, small = false, className = "", swatch, eager = false }) {
  return (
    <div className="frame">
      <div className={`frame__bar ${small ? "frame__bar--sm" : ""}`} aria-hidden="true">
        <i />
        <i />
        <i />
        {url && <span>{url}</span>}
      </div>
      <div className={`frame__view ${className}`}>{src ? <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} /> : <ThemeMock swatch={swatch} />}</div>
    </div>
  );
}

/** A theme without screenshots, drawn in its own colours. */
export function ThemeMock({ swatch }) {
  const s = swatch || { bg: "#fff", surface: "#f2f2f5", text: "#111", accent: "#1f5fd6" };
  return (
    <div className="mock" style={{ background: s.bg }} aria-hidden="true">
      <div className="mock__bar" style={{ background: s.text, width: "38%" }} />
      <div className="mock__hero" style={{ background: `linear-gradient(135deg, ${s.accent}, ${s.text})` }}>
        <i />
      </div>
      <div className="mock__row">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} style={{ background: s.surface, border: `1px solid ${s.text}14` }} />
        ))}
      </div>
    </div>
  );
}

export function ThemeCard({ item: raw }) {
  const item = withShots(raw);
  return (
    <Link href={`/themes/${item.slug}`} className="tcard">
      <Frame src={item.screenshots?.[0]} swatch={item.swatch} small className="tcard__shot" />
      <div className="tcard__body">
        <div className="tcard__top">
          <h3>{item.name}</h3>
          <Price item={item} />
        </div>
        <p className="small muted clamp2">{item.tagline || CATEGORY_LABELS[item.category]}</p>
        <div className="meta">
          <By item={item} />
          {item.installs ? (
            <>
              <i className="sep" aria-hidden="true" />
              <span className="num">{item.installs.toLocaleString("en-IN")} stores</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function AppCard({ item }) {
  return (
    <Link href={`/apps/${item.slug}`} className="card acard">
      <span className="acard__icon" aria-hidden="true">
        {item.icon ? <img src={item.icon} alt="" /> : <b>{item.name.slice(0, 1)}</b>}
      </span>
      <span className="acard__body">
        <span className="spread" style={{ gap: 8, flexWrap: "nowrap" }}>
          <h3>{item.name}</h3>
          <Price item={item} />
        </span>
        <span className="small muted clamp2">{item.tagline || item.description}</span>
        <span className="meta">
          <By item={item} />
          <i className="sep" aria-hidden="true" />
          <span>{CATEGORY_LABELS[item.category] || item.category}</span>
        </span>
      </span>
    </Link>
  );
}

/** Courier apps being built — one-click connection to the courier's API
 * (rates, label booking, tracking). Shown as "Coming soon", never installable. */
export const COMING_SOON_APPS = [
  { slug: "delhivery", name: "Delhivery", color: "#E1251B", text: "Book Delhivery pickups, print labels and track every shipment from your orders page." },
  { slug: "ithink-logistics", name: "iThink Logistics", color: "#F26B21", text: "Ship with your own iThink Logistics account: compare couriers, book AWBs, print labels and track from your orders page." },
];

export function ComingSoonCard({ item }) {
  return (
    <div className="card acard acard--soon" aria-label={`${item.name} — coming soon`}>
      <span className="acard__icon" aria-hidden="true" style={{ background: item.color }}>
        <b>{item.name.slice(0, 1)}</b>
      </span>
      <span className="acard__body">
        <span className="spread" style={{ gap: 8, flexWrap: "nowrap" }}>
          <h3>{item.name}</h3>
          <span className="badge badge--amber">Coming soon</span>
        </span>
        <span className="small muted clamp2">{item.text}</span>
        <span className="meta">
          <By item={{ official: true }} />
          <i className="sep" aria-hidden="true" />
          <span>{CATEGORY_LABELS.shipping}</span>
        </span>
      </span>
    </div>
  );
}
