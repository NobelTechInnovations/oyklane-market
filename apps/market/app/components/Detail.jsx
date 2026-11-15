import Link from "next/link";
import { getUrl, inr, CATEGORY_LABELS, withShots } from "@/lib/config";
import { Frame, Price, By } from "./Cards";
import { ChevronIcon } from "./Icons";

/** A theme's or app's page: pictures, what it is, and the buy box. */
export function Detail({ item: raw, preview }) {
  const item = withShots(raw);
  const theme = item.kind === "theme";
  const shots = item.screenshots || [];
  const section = theme ? "Themes" : "Apps";
  return (
    <div className="wrap detail">
      <div style={{ minWidth: 0 }}>
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Oyklane Store</Link>
          <ChevronIcon size={13} />
          <Link href={theme ? "/themes" : "/apps"}>{section}</Link>
          <ChevronIcon size={13} />
          <span aria-current="page">{item.name}</span>
        </nav>
        <div className="detail__head">
          {!theme && (
            <span className="acard__icon" aria-hidden="true">
              {item.icon ? <img src={item.icon} alt="" /> : <b>{item.name.slice(0, 1)}</b>}
            </span>
          )}
          <div style={{ minWidth: 0 }}>
            <h1>{item.name}</h1>
            <div className="meta" style={{ fontSize: 13.5, marginTop: 8 }}>
              <span>By</span> <By item={item} />
              <i className="sep" aria-hidden="true" />
              <span>{CATEGORY_LABELS[item.category] || item.category}</span>
              {item.installs ? (
                <>
                  <i className="sep" aria-hidden="true" />
                  <span className="num">Used by {item.installs.toLocaleString("en-IN")} stores</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
        {item.tagline && <p className="detail__tag">{item.tagline}</p>}
        {theme ? (
          <div className="gallery">
            <Frame src={shots[0]} alt={`${item.name} theme, home page`} swatch={item.swatch} url="yourbrand.com" className="gallery__main" eager />
            {shots.length > 1 && (
              <div className="gallery__thumbs">
                {shots.slice(1).map((s, i) => (
                  <img key={s} src={s} alt={`${item.name} theme, page ${i + 2}`} loading="lazy" />
                ))}
              </div>
            )}
          </div>
        ) : (
          shots.length > 0 && (
            <div className="gallery__thumbs" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", marginTop: 28 }}>
              {shots.map((s, i) => (
                <img key={s} src={s} alt={`${item.name}, screenshot ${i + 1}`} loading="lazy" />
              ))}
            </div>
          )
        )}
        {item.description && (
          <section className="panel">
            <h2>About {item.name}</h2>
            <p className="prose">{item.description}</p>
          </section>
        )}
        {!theme && item.scopeLabels?.length > 0 && (
          <section className="panel">
            <h2>What it can do in your store</h2>
            <ul className="ticks">
              {item.scopeLabels.map((s) => (
                <li key={s}>{s}</li>
              ))}
              {item.embeds && <li>Add a script to your store's pages (not checkout)</li>}
            </ul>
          </section>
        )}
        {theme && (
          <section className="panel">
            <h2>Included with every Oyklane theme</h2>
            <ul className="ticks">
              <li>Change colours, fonts, sections and layouts without code</li>
              <li>Works with every Oyklane feature — checkout, UPI, COD, reviews</li>
              <li>Fast on phones, ready for Google</li>
            </ul>
          </section>
        )}
        {item.changelog && (
          <section className="panel">
            <h2>What's new in {item.version}</h2>
            <p className="prose">{item.changelog}</p>
          </section>
        )}
      </div>

      <aside className="buybox">
        <div className="card card--pad">
          <div className="buybox__price">
            <Price item={item} />
          </div>
          {!item.free && <p className="buybox__note">{item.usagePrice ? "Free to install. Billed per use with your Oyklane plan. + GST." : theme ? "A year, for one store. + GST. Updates included. Refund within 7 days of installing." : "A month, billed with your Oyklane plan. + GST. Cancel any time."}</p>}
          <div className="stack" style={{ marginTop: 20 }}>
            <a className="btn btn--accent btn--lg btn--block" href={getUrl(item.kind, item.slug)}>
              {item.free ? `Add to my store` : theme ? `Buy for ${inr(item.price)}` : `Install`}
            </a>
            {theme && preview && (
              <a className="btn btn--lg btn--block" href={`${preview.base}/?themeId=${encodeURIComponent(preview.themeId)}`} target="_blank" rel="noopener noreferrer">
                View live demo
              </a>
            )}
          </div>
          {theme && preview && (
            <p className="small" style={{ textAlign: "center", marginTop: 14 }}>
              <Link className="link-accent" href={`/themes/${item.slug}/preview`}>
                Preview every page side by side
              </Link>
            </p>
          )}
          <p className="small subtle" style={{ textAlign: "center", marginTop: 10 }}>
            You'll confirm in your Oyklane admin.
          </p>
          <hr />
          <dl className="facts">
            <div>
              <dt>Developer</dt>
              <dd>{item.official ? "Oyklane" : item.by?.website ? <a href={item.by.website} target="_blank" rel="noopener noreferrer">{item.by.name}</a> : item.by?.name}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{CATEGORY_LABELS[item.category] || item.category}</dd>
            </div>
            {item.version && (
              <div>
                <dt>Version</dt>
                <dd className="num">{item.version}</dd>
              </div>
            )}
            {item.installs ? (
              <div>
                <dt>Used by</dt>
                <dd className="num">{item.installs.toLocaleString("en-IN")} stores</dd>
              </div>
            ) : null}
            {item.supportEmail && (
              <div>
                <dt>Support</dt>
                <dd>
                  <a href={`mailto:${item.supportEmail}`}>{item.supportEmail}</a>
                </dd>
              </div>
            )}
            {item.privacyUrl && (
              <div>
                <dt>Privacy</dt>
                <dd>
                  <a href={item.privacyUrl} target="_blank" rel="noopener noreferrer">
                    Privacy policy
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </aside>
    </div>
  );
}
