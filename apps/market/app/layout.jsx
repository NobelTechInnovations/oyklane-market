import "./globals.css";
import Link from "next/link";
import { currentPartner } from "@/lib/api";
import { ADMIN_ORIGIN, MAIN_SITE, SITE_URL } from "@/lib/config";
import { OyklaneLogo } from "./components/OyklaneLogo";
import { NavLinks } from "./components/NavLinks";
import { UtmCapture } from "./components/UtmCapture";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Oyklane Store — themes and apps for your store", template: "%s · Oyklane Store" },
  description: "Themes and apps for Oyklane stores — free and paid, by Oyklane and independent developers. Preview every page before you install.",
  openGraph: { type: "website", siteName: "Oyklane Store" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0f14" },
  ],
};

const BROWSE = [
  ["/themes", "Themes"],
  ["/apps", "Apps"],
  ["/partners", "For developers"],
];

export default async function RootLayout({ children }) {
  const partner = await currentPartner();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@500;600&display=swap" />
      </head>
      <body>
        <header className="nav">
          <div className="wrap nav__in">
            <Link href="/" className="brand" aria-label="Oyklane Store home">
              <OyklaneLogo height={26} />
              <small>Store</small>
            </Link>
            <NavLinks className="nav__links" links={BROWSE} />
            <div className="nav__right">
              <a className="link hide-sm" href={`${ADMIN_ORIGIN}/admin`}>
                Seller login
              </a>
              {partner ? (
                <Link className="btn btn--sm" href="/partners/dashboard">
                  Developer dashboard
                </Link>
              ) : (
                <Link className="btn btn--sm" href="/partners/login">
                  Developer login
                </Link>
              )}
            </div>
          </div>
          <NavLinks className="tabs-sm" links={[...BROWSE, [`${ADMIN_ORIGIN}/admin`, "Seller login", true]]} />
        </header>
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="wrap footer__cols">
            <div className="footer__brand">
              <OyklaneLogo height={24} />
              <p>Themes and apps for Oyklane stores, by Oyklane and independent developers. Preview everything before you install.</p>
            </div>
            <div>
              <h4>Browse</h4>
              <ul>
                <li><Link href="/themes">Themes</Link></li>
                <li><Link href="/themes?price=free">Free themes</Link></li>
                <li><Link href="/apps">Apps</Link></li>
              </ul>
            </div>
            <div>
              <h4>Developers</h4>
              <ul>
                <li><Link href="/partners">Build for Oyklane</Link></li>
                <li><Link href="/partners/docs">Developer docs</Link></li>
                <li><Link href={partner ? "/partners/dashboard" : "/partners/login"}>{partner ? "Developer dashboard" : "Developer login"}</Link></li>
              </ul>
            </div>
            <div>
              <h4>Oyklane</h4>
              <ul>
                <li><a href={MAIN_SITE}>oyklane.com</a></li>
                <li><a href={`${ADMIN_ORIGIN}/admin`}>Seller login</a></li>
                <li><a href={`${MAIN_SITE}/terms`}>Terms</a></li>
                <li><a href={`${MAIN_SITE}/privacy`}>Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="wrap footer__base">© {new Date().getFullYear()} Oyklane. All rights reserved.</div>
        </footer>
        <UtmCapture site="market" apiUrl={(process.env.NEXT_PUBLIC_API_URL || "https://api.oyklane.com").replace(/\/$/, "")} />
      </body>
    </html>
  );
}
