import Link from "next/link";
import { api } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/config";
import { ThemeCard, AppCard } from "./Cards";
import { ChevronIcon, SearchIcon } from "./Icons";

const PRICES = [
  ["all", "Any price"],
  ["free", "Free"],
  ["paid", "Paid"],
];
const SORTS = [
  ["popular", "Popular"],
  ["newest", "Newest"],
  ["price", "Price"],
];

function href(base, current, patch) {
  const q = new URLSearchParams();
  const next = { ...current, ...patch };
  for (const [k, v] of Object.entries(next)) if (v && !(k === "price" && v === "all") && !(k === "sort" && v === "popular")) q.set(k, v);
  const s = q.toString();
  return s ? `${base}?${s}` : base;
}

/** Themes or apps (or both, for search), with filters in the URL. */
export async function Browse({ kind, searchParams, base, title, intro }) {
  const sp = await searchParams;
  const current = { price: sp.price || "all", category: sp.category || "", sort: sp.sort || "popular", q: sp.q || "" };
  const qs = new URLSearchParams({ ...(kind && { kind }), price: current.price, sort: current.sort, ...(current.category && { category: current.category }), ...(current.q && { q: current.q }) });
  const data = await api(`/api/market/public/browse?${qs}`).catch(() => ({ items: [], categories: { theme: [], app: [] } }));
  const themes = data.items.filter((i) => i.kind === "theme");
  const apps = data.items.filter((i) => i.kind === "app");
  const categories = kind ? data.categories[kind] : [];
  const n = data.items.length;
  const label = current.category ? CATEGORY_LABELS[current.category] || current.category : null;
  return (
    <>
      <div className="page-head">
        <div className="wrap page-head__in">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Oyklane Store</Link>
            <ChevronIcon size={13} />
            {label ? <Link href={href(base, current, { category: "" })}>{title}</Link> : <span aria-current="page">{title}</span>}
            {label && (
              <>
                <ChevronIcon size={13} />
                <span aria-current="page">{label}</span>
              </>
            )}
          </nav>
          <h1>{label ? `${label} ${kind === "app" ? "apps" : "themes"}` : title}</h1>
          {intro && <p>{intro}</p>}
          {!kind && (
            <form className="search" action={base} role="search" style={{ marginTop: 20 }}>
              <SearchIcon />
              <label htmlFor="q" className="sr-only">
                Search themes and apps
              </label>
              <input id="q" name="q" defaultValue={current.q} placeholder="Search themes and apps" />
              <button className="btn btn--primary">Search</button>
            </form>
          )}
        </div>
      </div>
      <div className="wrap">
        <div className="layout-browse">
          <aside className="filters" aria-label="Filters">
            {categories.length > 0 && (
              <div>
                <h4>Category</h4>
                <Link href={href(base, current, { category: "" })} aria-current={!current.category ? "page" : undefined}>
                  All {kind === "app" ? "apps" : "themes"}
                </Link>
                {categories.map((c) => (
                  <Link key={c} href={href(base, current, { category: c })} aria-current={current.category === c ? "page" : undefined}>
                    {CATEGORY_LABELS[c] || c}
                  </Link>
                ))}
              </div>
            )}
            <div>
              <h4>Price</h4>
              {PRICES.map(([v, text]) => (
                <Link key={v} href={href(base, current, { price: v })} aria-current={current.price === v ? "page" : undefined}>
                  {text}
                </Link>
              ))}
            </div>
          </aside>
          <div style={{ minWidth: 0 }}>
            <div className="toolbar">
              <p>
                <b>{n}</b> {n === 1 ? "result" : "results"}
                {current.q ? ` for “${current.q}”` : ""}
              </p>
              <div className="sortby" role="group" aria-label="Sort">
                <span>Sort by</span>
                {SORTS.map(([v, text]) => (
                  <Link key={v} href={href(base, current, { sort: v })} aria-current={current.sort === v ? "page" : undefined}>
                    {text}
                  </Link>
                ))}
              </div>
            </div>
            {n === 0 && (
              <div className="empty">
                <h3>Nothing matches</h3>
                <p>Try another category or price, or <Link className="link-accent" href={base}>clear the filters</Link>.</p>
              </div>
            )}
            {themes.length > 0 && (
              <>
                {!kind && <h2 className="sub-head">Themes <span>{themes.length}</span></h2>}
                <div className="grid grid--themes">
                  {themes.map((t) => (
                    <ThemeCard key={t.id} item={t} />
                  ))}
                </div>
              </>
            )}
            {apps.length > 0 && (
              <div style={{ marginTop: themes.length ? 48 : 0 }}>
                {!kind && <h2 className="sub-head">Apps <span>{apps.length}</span></h2>}
                <div className="grid grid--apps">
                  {apps.map((a) => (
                    <AppCard key={a.id} item={a} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
