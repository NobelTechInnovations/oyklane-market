"use client";

import { useEffect, useState } from "react";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://api.oyklane.com").replace(/\/$/, "");
const KEY = "oy-brand";
let known; // undefined: not asked · null: the normal logo · { logo, logoDark, alt }
let asking = null;

function ask() {
  if (!asking) {
    asking = fetch(`${API}/api/auth/brand`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        known = d?.logo ? d : null;
        try {
          sessionStorage.setItem(KEY, JSON.stringify(known));
        } catch {
          /* ignore */
        }
        return known;
      })
      .catch(() => null);
  }
  return asking;
}

/**
 * The occasion logo (Super admin ▸ Website — a Diwali logo, say) in place
 * of the normal one while it's set; otherwise `children`, the normal logo.
 */
export function OccasionLogo({ height = 28, dark = false, className = "", children }) {
  const [b, setB] = useState(null);
  useEffect(() => {
    if (known === undefined) {
      try {
        const saved = sessionStorage.getItem(KEY);
        if (saved) setB(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    } else setB(known);
    let live = true;
    ask().then((v) => live && setB(v));
    return () => {
      live = false;
    };
  }, []);
  if (!b?.logo) return children;
  return <img className={className} src={dark ? b.logoDark || b.logo : b.logo} alt={b.alt || "oyklane"} style={{ height, width: "auto", maxWidth: height * 7, objectFit: "contain", display: "block" }} />;
}
