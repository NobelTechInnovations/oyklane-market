import Link from "next/link";
import { api } from "@/lib/api";
import { ThemeCard, AppCard, Frame } from "./components/Cards";
import { SearchIcon } from "./components/Icons";
import { withShots, CATEGORY_LABELS } from "@/lib/config";

const POPULAR = [
  ["/themes?category=fashion", "Fashion"],
  ["/themes?category=food", "Food & grocery"],
  ["/themes?category=jewellery", "Jewellery"],
  ["/themes?price=free", "Free themes"],
  ["/apps?category=marketing", "Marketing apps"],
];

export default async function Home() {
  const [themes, apps] = await Promise.all([api("/api/market/public/browse?kind=theme").catch(() => ({ items: [] })), api("/api/market/public/browse?kind=app").catch(() => ({ items: [] }))]);
  const shot = themes.items.map(withShots).filter((t) => t.screenshots?.[0]);
  const main = shot[0];
  // The phone: a theme's own mobile shot if it has one, else the next theme.
  const mobile = shot.find((t) => t.screenshots.some((s) => /mobile/.test(s)));
  const phone = mobile ? mobile.screenshots.find((s) => /mobile/.test(s)) : shot[1]?.screenshots[0];
  const industries = Object.entries(
    themes.items.reduce((m, t) => ((m[t.category] = (m[t.category] || 0) + 1), m), {})
  ).sort((a, b) => b[1] - a[1]);
  const freeThemes = themes.items.filter((t) => t.free).length;
  return (
    <>
      <section className="hero hero--x">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <h1>Themes and apps for your Oyklane store</h1>
            <p className="lead">Free and paid, by Oyklane and independent developers. Preview every page of a theme with real products before you install it.</p>
            <form className="search" action="/search" role="search">
              <SearchIcon />
              <label htmlFor="q" className="sr-only">
                Search themes and apps
              </label>
              <input id="q" name="q" placeholder="Search “saree”, “reviews”, “WhatsApp”…" />
              <button className="btn btn--primary">Search</button>
            </form>
            <div className="popular">
              <span>Popular:</span>
              {POPULAR.map(([href, text]) => (
                <Link key={href} className="chip" href={href}>
                  {text}
                </Link>
              ))}
            </div>
          </div>
          {main && (
            <div className="hero__art" aria-hidden="true">
              <Frame src={main.screenshots[0]} url="yourbrand.com" eager />
              {phone && (
                <div className="phone">
                  <div className="phone__screen">
                    <img src={phone} alt="" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="wrap">
          <ul className="facts-strip">
            <li>
              <b>{themes.items.length}</b>
              <span>Themes, {freeThemes} of them free</span>
            </li>
            <li>
              <b>{apps.items.length}</b>
              <span>Apps for selling more</span>
            </li>
            <li>
              <b>Every page</b>
              <span>Previewed with real products</span>
            </li>
            <li>
              <b>7 days</b>
              <span>To get a refund on a paid theme</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <div>
              <h2>Themes</h2>
              <p>Every theme previews with real products — home, collections, product pages, cart and more.</p>
            </div>
            <Link className="btn" href="/themes">
              View all themes
            </Link>
          </div>
          <div className="grid grid--themes">
            {themes.items.slice(0, 8).map((t) => (
              <ThemeCard key={t.id} item={t} />
            ))}
          </div>
        </div>
      </section>

      {industries.length > 1 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section__head">
              <div>
                <h2>Themes by industry</h2>
                <p>Made for how brands really sell — from fashion and food to phones and books.</p>
              </div>
            </div>
            <nav className="industries" aria-label="Themes by industry">
              {industries.map(([c, count]) => (
                <Link key={c} href={`/themes?category=${encodeURIComponent(c)}`}>
                  {CATEGORY_LABELS[c] || c}
                  <span>{count}</span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      )}

      <section className="section section--tint">
        <div className="wrap">
          <div className="section__head">
            <div>
              <h2>Apps</h2>
              <p>Add reviews, WhatsApp, payments by UPI QR, Google & Meta channels and more.</p>
            </div>
            <Link className="btn" href="/apps">
              View all apps
            </Link>
          </div>
          <div className="grid grid--apps">
            {apps.items.slice(0, 9).map((a) => (
              <AppCard key={a.id} item={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="band">
            <div>
              <h2>Build themes and apps. Keep {Math.round((themes.partnerShare ?? 0.8) * 100)}% of every sale.</h2>
              <p>List free or paid themes and apps for brands selling on Oyklane. We handle payments and licences — you get paid by UPI.</p>
            </div>
            <div className="row">
              <Link className="btn btn--accent btn--lg" href="/partners/signup">
                Become a developer
              </Link>
              <Link className="btn btn--on-ink btn--lg" href="/partners">
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
