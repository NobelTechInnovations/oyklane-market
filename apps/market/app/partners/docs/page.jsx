import Link from "next/link";
import { api } from "@/lib/api";

export const metadata = { title: "Developer guide", description: "How to build, test and sell themes and apps on the Oyklane Store, step by step: setup, the Oyklane CLI, theme structure, the app API, review and getting paid." };

const VERIFY = `// Node: check a webhook from Oyklane
import crypto from "crypto";

function fromOyklane(rawBody, signatureHeader, secret) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(signatureHeader)));
}`;

const INSTALLED = `POST <your install webhook>
X-Oyklane-Event: app.installed
X-Oyklane-Signature: <hex HMAC-SHA256 of the body>

{
  "event": "app.installed",
  "store": { "id": "…", "handle": "my-store", "name": "My Store", "url": "https://…" },
  "apiBase": "https://api.oyklane.com/api/v1",
  "apiKey": "oyk_…",          // only the permissions your listing asked for
  "scopes": ["read_products", "read_orders"],
  "at": "2026-10-08T10:00:00.000Z"
}`;

const INSTALL = `node --version                  # 20 or newer
npm install -g @oyklane/cli
oyklane login                   # your developer email and password`;

const THEME_ENV = `OYKLANE_PROJECT_ID=prj_…         # on your dashboard
OYKLANE_THEME_ID=…                # on your theme's page`;

const APP_ENV = `OYKLANE_PROJECT_ID=prj_…         # on your dashboard
OYKLANE_APP_ID=…                  # on your app's page
OYKLANE_APP_SECRET=oyks_…         # on your app's page
APP_URL=http://localhost:3000
OYKLANE_TEST_API_KEY=oyk_…        # optional: a key from your own test store`;

const THEME_START = `oyklane init my-theme
cd my-theme
# paste your two IDs into .env
oyklane dev                       # http://localhost:9292`;

const THEME_FINISH = `oyklane check                     # the upload rules and the review's safety read
oyklane package                   # only the theme, to dist/theme.zip`;

const APP_START = `oyklane init my-app --app
cd my-app
# paste your IDs and app secret into .env
npm start                         # your app, in this terminal
oyklane dev                       # in a second terminal: a test install`;

const APP_FINISH = `oyklane dev --uninstall           # a test uninstall
oyklane check                     # what your listing still needs for review`;

const LINK = `https://yourapp.com/oyklane?store=my-store&ts=1791450000&signature=<hex>
// signature = HMAC-SHA256("store=my-store&ts=1791450000", your app secret)
// Refuse links older than 5 minutes.`;

const CALL = `curl "https://api.oyklane.com/api/v1/products?page=1&limit=50" \\
  -H "Authorization: Bearer oyk_…"

{ "data": [ … ], "page": 1, "limit": 50, "total": 132 }`;

const TREE = `my-theme/
  layout/theme.liquid            required — wraps every page
  templates/index.json           required — the home page's sections
  templates/product.json         optional — sections around the product page
  templates/collection.json, page.json, contact.json   optional, the same way
  sections/*.liquid              each with a {% schema %} for the editor
  snippets/*.liquid
  assets/*.css, *.js, *.svg
  config/settings_schema.json    required — theme settings in the editor
  config/settings_data.json      required — their starting values
  locales/*.json`;

const LAYOUT = `<!doctype html>
<html lang="en">
<head>
  <title>{{ page_title }}</title>
  <link rel="stylesheet" href="{{ 'theme.css' | asset_url }}">
</head>
<body>
  {% section 'header' %}
  <main>{{ content_for_layout }}</main>
  {% section 'footer' %}
</body>
</html>`;

const SECTION = `<section class="rich-text">
  <h2>{{ section.settings.heading }}</h2>
  <p>{{ section.settings.text }}</p>
  <a href="{{ routes.all_products_url }}">Shop all</a>
</section>

{% schema %}
{
  "name": "Rich text",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Honest products" },
    { "type": "textarea", "id": "text", "label": "Text" },
    { "type": "select", "id": "align", "label": "Alignment", "default": "center",
      "options": [{ "value": "left", "label": "Left" }, { "value": "center", "label": "Centre" }] }
  ]
}
{% endschema %}`;

const SCOPES = [
  ["read_products", "Read products, categories and collections"],
  ["write_products", "Create, edit and delete products, categories and collections"],
  ["read_inventory", "Read stock levels"],
  ["write_inventory", "Change stock levels"],
  ["read_orders", "Read orders"],
  ["write_orders", "Ship orders (add tracking)"],
  ["import_orders", "Import past orders (no payment, stock or messages)"],
  ["read_customers", "Read customers"],
  ["write_customers", "Create and edit customers"],
  ["read_discounts", "Read discounts"],
  ["write_discounts", "Create discounts"],
];

const ENDPOINTS = [
  ["GET", "/shop", "—", "The store's name, handle and currency"],
  ["GET", "/products, /products/:id", "read_products", "Filter with ?q= ?status= ?sku= ?handle="],
  ["POST, PATCH, DELETE", "/products", "write_products", "Create, edit, delete"],
  ["GET, POST", "/categories, /collections", "read_products / write_products", ""],
  ["GET", "/inventory", "read_inventory", "Stock per variant"],
  ["POST", "/inventory/adjust", "write_inventory", "Add or take away stock"],
  ["GET", "/orders, /orders/:id", "read_orders", ""],
  ["POST", "/orders/:id/fulfillments", "write_orders", "Mark shipped with courier and tracking"],
  ["POST", "/orders/import", "import_orders", "Past orders from another platform"],
  ["GET, POST, PATCH", "/customers", "read_customers / write_customers", ""],
  ["GET, POST", "/discounts", "read_discounts / write_discounts", ""],
];

const TOC = [
  ["flow", "How it works"],
  ["setup", "Set up"],
  ["build-theme", "Build a theme"],
  ["build-app", "Build an app"],
  ["themes", "Themes"],
  ["liquid", "Liquid reference"],
  ["apps", "Apps"],
  ["api", "API"],
  ["review", "Review"],
];

export default async function Docs() {
  const share = Math.round(((await api("/api/market/public/browse?kind=theme").catch(() => null))?.partnerShare ?? 0.8) * 100);
  const flow = [
    ["Create a developer account", "Sign up with your email. Add your name or company, website and the UPI ID your earnings are paid to. You get a Project ID."],
    ["Add a listing", "Choose theme or app, name it and set a price (free, or ₹99 and up). You get a Theme ID or App ID straight away, with nothing to upload yet."],
    ["Build on your computer", "The Oyklane CLI runs your theme or tests your app locally, so you don't upload every change."],
    ["Upload it", "Themes: upload the .zip the CLI makes and click through it on our demo store. Apps: put your app on your own server and add a release."],
    ["Send it for review", "You can have one theme or app in review at a time. We check it works, is honest and asks only for what it needs. If something needs fixing, you get a note."],
    ["Listed on the Oyklane Store", "Approved listings show on the Oyklane Store, where sellers find them and install them in one click."],
    ["Get paid", `You keep ${share}% of every theme sale and renewal and of every paid app month, paid to your UPI ID. A theme sale is paid once its 7-day refund window has closed.`],
  ];
  return (
    <div className="wrap dash narrow" style={{ maxWidth: 900 }}>
      <div>
        <Link className="small muted" href="/partners">
          ← For developers
        </Link>
        <h1 style={{ fontSize: 34, marginTop: 8 }}>Developer guide</h1>
        <p className="muted">How to build, test and sell themes and apps for Oyklane stores, step by step.</p>
        <nav aria-label="On this page" className="row" style={{ gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {TOC.map(([id, label]) => (
            <a key={id} className="badge" href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="card card--pad stack" id="flow">
        <h2>How it works</h2>
        <p className="muted">
          Oyklane is an e-commerce platform for Indian brands. Sellers run their store from the Oyklane admin and add themes and apps from the Oyklane Store. You
          build them; Oyklane hosts the listing, takes the seller's payment and pays you your share.
        </p>
        <ol className="stack" style={{ paddingLeft: 20, margin: 0 }}>
          {flow.map(([title, text]) => (
            <li key={title}>
              <b>{title}.</b> <span className="muted">{text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="card card--pad stack" id="setup">
        <h2>Set up</h2>
        <p className="muted">You do this once, for themes and apps alike.</p>
        <ol className="stack" style={{ paddingLeft: 20, margin: 0 }}>
          <li>
            Install <a href="https://nodejs.org">Node.js</a> 20 or newer.
          </li>
          <li>
            <Link href="/partners/signup">Create your developer account</Link>. Your Project ID is on your dashboard.
          </li>
          <li>Install the Oyklane CLI and sign in:</li>
        </ol>
        <pre>{INSTALL}</pre>
        <ul className="ticks">
          <li>
            <b>Project ID</b> — one for your account. <b>Theme ID</b> or <b>App ID</b> — one for each listing.
          </li>
          <li>A project on your computer is one theme or one app, so its .env has one of those IDs, never both.</li>
          <li>Your sign-in is saved in your home folder, readable only by you. It opens these tools and nothing else: not your listings, earnings or account.</li>
          <li>Keep .env out of git. New projects already ignore it.</li>
        </ul>
      </div>

      <div className="card card--pad stack" id="build-theme">
        <h2>Build a theme, step by step</h2>
        <ol className="stack" style={{ paddingLeft: 20, margin: 0 }}>
          <li>
            <b>Add the listing.</b> On your dashboard choose <Link href="/partners/listings/new?kind=theme">New theme</Link>. You don't upload anything yet. Its page shows your Theme ID.
          </li>
          <li>
            <b>Start the project.</b> This makes a small working theme to build on:
            <pre>{THEME_START}</pre>
            <pre>{THEME_ENV}</pre>
          </li>
          <li>
            <b>Build it.</b> Your theme runs on your computer with the same engine stores use, and the page reloads when you save. Your code isn't sent anywhere. Oyklane supplies sample store data and
            its own product, cart and checkout pages. Only config/settings_data.json is sent, so those pages take your colours and fonts. Cart and account actions don't run locally.
          </li>
          <li>
            <b>Check and package it.</b> The zip holds only layout, templates, sections, snippets, assets, config and locales. Your .env, package.json and node_modules stay out.
            <pre>{THEME_FINISH}</pre>
          </li>
          <li>
            <b>Upload.</b> On your theme's page, upload dist/theme.zip as version 1.0.0. It goes straight onto our demo store, so you can click through every page with real products.
          </li>
          <li>
            <b>Finish the listing.</b> Add a description of 80 characters or more, at least one screenshot, your price, and your payout UPI ID if it's paid.
          </li>
          <li>
            <b>Send it for review.</b> You'll get a note if something needs fixing.
          </li>
          <li>
            <b>Release updates.</b> Change your code, run oyklane package, upload 1.0.1 and send it for review. Sellers choose whether to take it. It updates their theme in place: your code changes, their
            layouts in templates/*.json and their settings stay.
          </li>
        </ol>
      </div>

      <div className="card card--pad stack" id="build-app">
        <h2>Build an app, step by step</h2>
        <p className="muted">An app is your own web app on your own server, so there's no zip. The CLI stands in for Oyklane while you build, with the same events and signatures a real install sends.</p>
        <ol className="stack" style={{ paddingLeft: 20, margin: 0 }}>
          <li>
            <b>Add the listing.</b> On your dashboard choose <Link href="/partners/listings/new?kind=app">New app</Link>. Its page shows your App ID and app secret.
          </li>
          <li>
            <b>Start the project.</b> This makes a small working app, with signature checks already written:
            <pre>{APP_START}</pre>
            <pre>{APP_ENV}</pre>
          </li>
          <li>
            <b>Build it.</b> oyklane dev sends your local app a signed app.installed event for a made-up test store, checks it refuses a forged one, and prints the link a seller would open. Nothing here touches a
            real store.
          </li>
          <li>
            <b>Call the API.</b> Make your own test store at store.oyklane.com, create an API key in Settings ▸ API (a Pro plan feature), and put it in OYKLANE_TEST_API_KEY. It reaches your app as the event's apiKey, so
            your code calls the API just as it will for a real store.
          </li>
          <li>
            <b>Test removal.</b> Your app should forget the store's key.
            <pre>{APP_FINISH}</pre>
          </li>
          <li>
            <b>Put it online.</b> Host your app over https. On your app's page, set the app link, install webhook and the permissions it needs.
          </li>
          <li>
            <b>Finish the listing.</b> Add a description, screenshots, support email, privacy policy and price. oyklane check lists what's still missing. Then add a release, such as 1.0.0.
          </li>
          <li>
            <b>Send it for review.</b> You'll get a note if something needs fixing.
          </li>
          <li>
            <b>Release updates.</b> Your server is yours, so changes go live when you deploy them. Add a release when you want the change on your listing, and send it for review.
          </li>
        </ol>
      </div>

      <div className="card card--pad stack" id="themes">
        <h2>Themes</h2>
        <p className="muted">
          Oyklane themes are Liquid, the same shape as Oyklane's own (Classic, Modern, Atelier, Fresh, Lumière). Your theme draws the home page, the header and
          footer, and the sections sellers place around pages. The platform draws product, collection, search, cart, checkout, account, order, blog and
          contact pages in your theme's colours and fonts, so checkout and payments work the same in every store.
        </p>
        <pre>{TREE}</pre>
        <h3>Layout</h3>
        <pre>{LAYOUT}</pre>
        <h3>Sections</h3>
        <p className="muted small">
          A section is a Liquid file with a <code>{"{% schema %}"}</code> listing its settings (and blocks, for repeatable items). Sellers add, reorder and edit
          sections in the visual editor; templates/index.json sets which sections the home page starts with.
        </p>
        <pre>{SECTION}</pre>
        <h3>Product, collection, page and contact pages</h3>
        <p className="muted small">
          These pages keep the platform's own main section (<code>sys-product</code>, <code>sys-collection</code>, <code>sys-page</code>,{" "}
          <code>sys-contact</code>), and your sections can go around it — add <code>templates/product.json</code> and so on for a starting layout. Cart and
          checkout can't be changed.
        </p>
        <h3>Rules</h3>
        <ul className="ticks">
          <li>Up to 6 MB unzipped, 512 KB a file, 600 files. Text files only: .liquid .json .css .js .svg .txt. oyklane check tells you before you upload.</li>
          <li>Every Liquid and JSON file is checked on upload; problems are listed file by file.</li>
          <li>
            Print <code>{"{{ powered_by }}"}</code> in your footer and <code>{"{{ content_for_layout }}"}</code> in your layout.
          </li>
          <li>
            Build every link from <code>routes</code> (e.g. <code>{"{{ routes.cart_url }}"}</code>), never a fixed path — stores run on their own domains.
          </li>
          <li>A paid theme's code is locked in the seller's store; they customise it in the editor.</li>
          <li>A paid theme is one payment for a year, on one store, installed with a purchase code tied to that seller and domain. Sellers renew to keep installing and updating it.</li>
          <li>Sellers can refund a theme themselves within 7 days of installing it. It happens at once, and your share of that sale comes back off your earnings.</li>
        </ul>
      </div>

      <div className="card card--pad stack" id="liquid">
        <h2>Liquid reference</h2>
        <h3>Objects on every page</h3>
        <ul className="ticks">
          <li>
            <code>shop</code> — name, handle, currency, support_email, support_phone, logo
          </li>
          <li>
            <code>routes</code> — root_url, all_products_url, collections_url, cart_url, cart_add_url, search_url, account_url, blog_url, contact_url, pages_url…
          </li>
          <li>
            <code>collections</code> (by handle), <code>all_products</code>, <code>best_sellers</code>, <code>blog</code>, <code>linklists</code> (menus)
          </li>
          <li>
            <code>cart</code>, <code>customer</code> (when signed in), <code>page_title</code>
          </li>
          <li>
            <code>settings</code> — your theme settings; inside a section, <code>section.settings</code> and <code>block.settings</code>
          </li>
        </ul>
        <h3>Oyklane filters and tags</h3>
        <ul className="ticks">
          <li>
            <code>{"{{ product.price | money }}"}</code> and <code>money_without_trailing_zeros</code> — prices in the store's currency
          </li>
          <li>
            <code>{"{{ 'theme.css' | asset_url }}"}</code> — a file from your assets/ folder
          </li>
          <li>
            <code>image_url</code>, <code>placeholder_svg</code>, <code>color_on</code> (black or white text for a background colour)
          </li>
          <li>
            <code>{"{% section 'name' %}"}</code> — places a section in the layout
          </li>
        </ul>
        <p className="muted small">Standard Liquid tags and filters work as usual (if, for, assign, capture, date, escape, url_encode…).</p>
      </div>

      <div className="card card--pad stack" id="apps">
        <h2>Apps</h2>
        <p className="muted">
          An app is your own web app, on your own server. When a store installs it, Oyklane makes an API key for that store with only the permissions your
          listing asks for, and sends it to your install webhook. Sellers open your app from their Apps page.
        </p>
        <h3>What you set on the listing</h3>
        <ul className="ticks">
          <li>
            <b>App link</b> (https) — where sellers land when they open your app.
          </li>
          <li>
            <b>Install webhook</b> (https) — install and uninstall events are posted here, signed with your app secret.
          </li>
          <li>
            <b>Permissions</b> — the API scopes your app needs (below). Ask only for what it uses.
          </li>
          <li>
            <b>Storefront script</b> (optional, https) — added to every page of stores that install your app, never checkout or payment pages.
          </li>
          <li>
            <b>Support email and privacy policy</b> — needed for review.
          </li>
        </ul>
        <h3>Install webhook</h3>
        <pre>{INSTALLED}</pre>
        <p className="muted small">
          When it's removed you get <code>app.uninstalled</code> and the key stops working. Keep each store's key safe on your server.
        </p>
        <h3>Checking it's really from Oyklane</h3>
        <pre>{VERIFY}</pre>
        <h3>Opening your app</h3>
        <pre>{LINK}</pre>
        <h3>Pricing</h3>
        <p className="muted small">Free, or a monthly price (₹99 or more) billed with the seller's Oyklane plan. You get {share}% of every month that's paid.</p>
      </div>

      <div className="card card--pad stack" id="api">
        <h2>API</h2>
        <p className="muted small">
          Send the key as <code>Authorization: Bearer oyk_…</code>. Lists are paginated with <code>?page=</code> and <code>?limit=</code> (up to 100), newest
          first. Up to 240 requests a minute per key. Errors come back as <code>{'{ "error": "…" }'}</code> with a 4xx status.
        </p>
        <pre>{CALL}</pre>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Path</th>
                <th>Scope</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map(([m, p, s, n]) => (
                <tr key={`${m}${p}`}>
                  <td>{m}</td>
                  <td>
                    <code>{p}</code>
                  </td>
                  <td>{s}</td>
                  <td className="muted">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>Scopes</h3>
        <ul className="ticks">
          {SCOPES.map(([k, v]) => (
            <li key={k}>
              <code>{k}</code> — {v}
            </li>
          ))}
        </ul>
      </div>

      <div className="card card--pad stack" id="review">
        <h2>Review</h2>
        <p className="muted">You can have one thing in review at a time, theme or app, including new versions. Send the next one once we've decided on the last.</p>
        <ul className="ticks">
          <li>It works on phones and desktops, and every page loads.</li>
          <li>No tracking or scripts the listing doesn't mention; nothing that asks shoppers for payment details.</li>
          <li>An honest description and screenshots — no claims you can't back up.</li>
          <li>For apps: permissions only for what the app does; a support email and a privacy policy.</li>
        </ul>
        <p className="small muted">
          Questions? <a href="mailto:partners@oyklane.com">partners@oyklane.com</a>
        </p>
      </div>
    </div>
  );
}
