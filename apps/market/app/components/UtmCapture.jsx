"use client";

import { useEffect } from "react";

const KEYS = ["source", "medium", "campaign", "term", "content"];

/**
 * Where this visitor came from, for Oyklane's own Acquisition report:
 * the latest UTM-tagged (or referred) landing is kept in the `oy_utm`
 * cookie on .oyklane.com, so sign-up at store.oyklane.com can send it;
 * and one visit per browser session is counted at /api/public/visit.
 */
export function UtmCapture({ site, apiUrl }) {
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const utm = Object.fromEntries(KEYS.map((k) => [k, q.get(`utm_${k}`) || ""]).filter(([, v]) => v));
      if (!utm.source && q.get("gclid")) Object.assign(utm, { source: "google", medium: "cpc" });
      if (!utm.source && q.get("fbclid")) Object.assign(utm, { source: "facebook", medium: "social" });
      const ref = document.referrer && !/(^|\.)oyklane\.com$/i.test(new URL(document.referrer).hostname) ? document.referrer : "";
      const host = window.location.hostname;
      const shared = /(^|\.)oyklane\.com$/i.test(host) ? "; domain=.oyklane.com" : "";
      if (utm.source || ref) {
        const value = { ...utm, referrer: ref || undefined, landing: window.location.pathname, at: new Date().toISOString() };
        document.cookie = `oy_utm=${encodeURIComponent(JSON.stringify(value))}${shared}; path=/; max-age=${90 * 86400}; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
      }
      if (sessionStorage.getItem("oy_visit")) return;
      sessionStorage.setItem("oy_visit", "1");
      fetch(`${apiUrl}/api/public/visit`, { method: "POST", headers: { "content-type": "text/plain" }, body: JSON.stringify({ site, ...utm, referrer: ref }), keepalive: true }).catch(() => {});
    } catch {}
  }, [site, apiUrl]);
  return null;
}
