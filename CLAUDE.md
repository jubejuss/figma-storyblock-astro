# Sisuhaldus — Figma → Storyblok → Astro

Õppedemo Haapsalu Kolledži sisuhaldussüsteemide kursusele. Eesmärk: näidata terviklikku **headless CMS töövoogu** disainerist arendajani.

## Tehnoloogiad (kontrollitud, töötab)

| Roll | Vahend | Versioon |
|------|--------|----------|
| Disain | Figma | – |
| CMS | Storyblok (Community plan, EU region) | – |
| Frontend | Astro | 6.0.8 |
| Storyblok integratsioon | `@storyblok/astro` | 9.0.0 |
| Cloud deploy | Cloudflare Workers via `@astrojs/cloudflare` | 13.5+ |
| Lokaalne HTTPS | `vite-plugin-mkcert` | – |
| Stiil | **Plain CSS muutujad** (`src/styles/global.css`) — **mitte Tailwind** | – |

## Projekti seis (kõik faasid valmis)

- ✅ Figma fail "Storyblock" (3 lehte, 6 komponenti, 17 tokens)
- ✅ Storyblok ruum (3 content types: `article`, `page`, `config` + 6 nestable bloki)
- ✅ Astro projekt jookseb `https://localhost:4322/` (HTTPS, mkcert sert)
- ✅ Cloud URL: https://figma-storyblock-astro.jubejuss.workers.dev/
- ✅ GitHub repo: https://github.com/jubejuss/figma-storyblock-astro
- ✅ Live Preview / Visual Editor

## Minimaalne MVP scope

**Lehed (3 URL'i):**
- `/` — esileht (`home` story), kuvab ArticleList
- `/postitused/` — eraldi index leht (story slug=`postitused`), sama ArticleList
- `/blog/<slug>` — üksikartikkel (`article` content type, kausta `blog/` sees)

**Storybloki content types (3):**

| Tüüp | Roll |
|------|------|
| `article` | Sisuüksus: title, published_at, cover_image, excerpt, body (richtext), author_name |
| `page` | Konteiner (üks väli `body` Blocks) — home + postitused |
| `config` | Singleton — header + footer globaalselt, fetchitakse Layout.astros |

**Nestable blokid (6):** `header`, `nav_link`, `footer`, `article_card`, `article_list`, `rich_text`.

**Astro komponendid (9 `.astro` faili):**
`src/storyblok/`: Page, Article, Header, Footer, ArticleCard, ArticleList, ArticleHeader, RichText, Config + Fallback.

**Design tokens (~20):** plain CSS muutujad `src/styles/global.css`-s, sünk Figma `Tokens` lehega.

Vt täielikku spec: [`docs/PLAN.md`](docs/PLAN.md).  
Storybloki UI seadistus: [`docs/STORYBLOK-SCHEMA.md`](docs/STORYBLOK-SCHEMA.md).  
Õpilogi (kuidas tehti, lõksudega): [`docs/Kuidas-tegin.md`](docs/Kuidas-tegin.md).

## Töövoog Figmas (kriitilised reeglid, kui ehitad uuesti)

1. **Kasuta `Frame`-i, MITTE `Group`-i.**
2. **Nimed PascalCase + semantilised:** `ArticleCard`, mitte `Frame 42`.
3. **Auto-layout kõikjal.**
4. **Üks loogiline komponent = üks Figma component.**
5. **Variables eraldi lehel** — kasuta tokenitele Variables (mitte raw väärtused stiilides).

## Storybloki UI — kriitilised lõksud

- ⚠ **`page` skeemat KOGEMATA muudetud**: kõige sagedasem viga. Kui hakkad `article` Content Type'i looma, **ÄRA AVA** olemasolevat `page` blokki. Tee uus blokk pluss "+ New Block" nupust.
- ⚠ **Plugin/blueprint teeb kõik Nestable-na** → Content Type tuleb käsitsi seada (vali ⦿ Content Type kui blokki teed).
- ⚠ **Folder Default content type** unustatakse. Loo `blog` kaust → seadista default = `article`.
- ⚠ **Nav_link Internal Link** ei luba kausta valida → vaheta link tüüp **URL**-iks ja sisesta käsitsi.

## Astro projekti seadistus (kui ehitad nullist)

```bash
# Tee 1: Storybloki Developer Quickstart (soovitav, kiireim)
# 1. Loo Storyblok space, vali Developer mode
# 2. Käivita Storybloki antud käsk:
npx storyblok@latest create --token <SPACE_TOKEN>
# 3. Vali Astro, vali kataloog (nt `./` või alamkataloog)

# Tee 2: nullist
npm create astro@latest .
npm install @storyblok/astro
npx astro add cloudflare
```

`astro.config.mjs` toimiv konfiguratsioon (vt projekti juur):
- `bridge: true` — Live Preview tugi
- `enableFallbackComponent: true` + `customFallbackComponent: 'storyblok/Fallback'` — v9 süntaks, **NB!** vanemates dokkides on `fallbackComponent: '...'` — see ei tööta v9-s
- `output: 'server'` (SSR, vajalik draft sisu nägemiseks Visual Editor'is)
- `adapter: cloudflare()` (Workers deploy)

## Cloudflare deploy

```bash
npx wrangler login
npx wrangler deploy

# Secrets (Cloudflare side, NB! mitte segi ajada secret nime ja väärtusega)
npx wrangler secret put STORYBLOK_DELIVERY_API_TOKEN   # sisesta token kui küsib
npx wrangler secret put STORYBLOK_REGION                # sisesta: eu
```

Vt detailset Cloudflare lõksude loendit: [`docs/Kuidas-tegin.md`](docs/Kuidas-tegin.md#faas-10--cloudflare-workers-deploy-) (5 levinud lõksu).

## Käsud arenduses

```bash
npm run dev               # https://localhost:4322/ (HTTPS)
npm run build             # build dist/ (Cloudflare Workers format)
npx wrangler deploy       # deploy dist'ist Cloudflare-i
npx wrangler tail         # live logid produktsioonist (debug)
npx wrangler secret list  # vaata secret'eid (produktsioonis)
```

## Konventsioonid

- **Üks** dünaamiline route fail per "type" — `[...slug].astro` katab kõik (home, postitused, blog/*).
- **CSS:** plain CSS, ei Tailwindit. Tokenid `src/styles/global.css` `:root`-is. Komponentides kasuta `var(--color-text)` jne.
- **Iga Astro komponent saab `blok` ja optsionaalselt `story` props** + `{...storyblokEditable(blok)}` juurelemendil (Visual Editor).
- **`.env`** sisaldab `STORYBLOK_DELIVERY_API_TOKEN` ja `STORYBLOK_REGION=eu`. Lokaalses arenduses täidab vite, produktsioonis Cloudflare secrets.

## Levinumad lõksud (terviklik nimekiri õpilogis)

18 lõksu kokku — täielik tabel: [`docs/Kuidas-tegin.md`](docs/Kuidas-tegin.md#õpitud-lõksud-kokkuvõte).

**Top 5, mis enim katkestab arendust:**
1. `page` skeemat ekslikult muudetud `article`-i loomise käigus
2. `fallbackComponent: 'X'` ei tööta v9-s — vaja `enableFallbackComponent: true` + `customFallbackComponent`
3. Cloudflare deploy: secret name typo (token *väärtus* nimena)
4. KV namespace konflikt (package.json `name` jäi vana → adapter teeb vana nimega KV)
5. `wrangler delete --name X` v4-s ei tööta, kasuta positsioonarg-i või dashboardit

## Õpilastele

Iga õpilane teeb oma Storyblok konto + space + tokeni. Sammuhaaval juhend on `docs/Kuidas-tegin.md`. Schema seadistus: `docs/STORYBLOK-SCHEMA.md`.

## Viited

- Storyblok Astro guide: https://www.storyblok.com/docs/guides/astro
- Storyblok Blocks: https://www.storyblok.com/docs/concepts/blocks
- Astro Cloudflare adapter: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Cloudflare Workers Free: https://developers.cloudflare.com/workers/platform/limits/
