# Kuidas tegin — õppedemo terviktöövoog

Samm-sammuline ajakava sellest, **mis tegelikult juhtus** Figma → Storyblok → Astro demo loomisel. Sisaldab levinud lõkse ja parandusi, mis töövoo käigus tekkisid.

> See on **päevik / õpilogi**. Vaikne viitedokumentatsioon on `docs/PLAN.md`, `docs/STORYBLOK-SCHEMA.md`, `CLAUDE.md`.

---

## Eesmärk

Demonstreerida headless CMS töövoogu õpikutest näitega:
- **Disain** Figmas → **schema** Storyblokis → **frontend** Astros
- MVP: blogi 2 lehega (avaleht + üksiku postituse leht)
- Minimaalsuse põhimõte: ainult need väljad/komponendid, mis on **tegelikult vajalikud**

---

## Tehnoloogiad

| Roll | Vahend | Versioon |
|------|--------|----------|
| Disain | Figma | – |
| Sild | Storyblok ametlik Figma plugin | (ei kasutanud — käsitsi schema) |
| CMS | Storyblok (EU region, Community plan) | v3 |
| Frontend | Astro | 6.0.8 |
| Storyblok integratsioon | `@storyblok/astro` | v9.0.0 |
| Lokaalne HTTPS | `vite-plugin-mkcert` | – |

---

## Faas 1 — Figma fail

**Tehtud Claude'i ja figma-console MCP abiga.** Tulemus: Figma fail `Storyblock` (key `dTwBlwL7yFMJZe5STUrEVP`) sai järgmise struktuuri:

```
Storyblock.fig
├─ Page: Tokens          (17 Variables: 5 värvi, 4 fontsize, 6 spacing, 2 radius)
├─ Page: Components      (6 auto-layout komponenti, kõik tokenitega seotud)
│   ├─ Header
│   ├─ Footer
│   ├─ ArticleCard
│   ├─ ArticleList
│   ├─ ArticleHeader
│   └─ RichText
└─ Page: Pages           (2 lehe kompositsiooni)
    ├─ IndexPage (1440×716)
    └─ ArticlePage (1440×1111)
```

**Lõks:** algselt teksti node-d ei wrap'inud (`layoutSizingHorizontal` polnud `FILL`). Parandus: kõikidel auto-layout VERTICAL frame'is olevatel text node-del seada `FILL`.

---

## Faas 2 — Projektifailide seadistus

Loodud kataloogis `/Users/juhokalberg/haapsalu-kolledz/sisuhaldus-figma-storyblock/`:

```
.
├─ CLAUDE.md             — projekti juhend Claude'ile (tehnoloogiad, lõksud)
├─ README.md             — inimese-orienteeritud ülevaade
├─ .env.example          — Storyblok tokenite mall
├─ .gitignore            — Astro/Node/Storyblok exclusions
└─ docs/
   ├─ PLAN.md            — Figma+Storyblok struktuuri spec
   ├─ STORYBLOK-SETUP.md — Empty Space rajalt
   └─ STORYBLOK-SCHEMA.md — Developer Quickstart rajalt
```

---

## Faas 3 — Storyblok space + Astro starter

Storybloki **Developer Quickstart** rada (lihtsam kui Empty Space):

1. https://app.storyblok.com → **Create new space** → Name `Haapsalu Blog Demo`, region **EU**, plan Community
2. Quickstart liides → vali **Developer** (vasakul küljemenüüs "Switch to Developer")
3. Pakuti käsk:
   ```bash
   npx storyblok@latest create --token <SPACE_TOKEN>
   ```
4. CLI küsis:
   - **Technology:** Astro
   - **Path:** `./haapsalu-blog`
5. CLI laadis alla `storyblok/blueprint-core-astro` template'i ja lõi `.env` faili tokeniga.

**Tulemus:** Astro projekt asus alamkataloogis `haapsalu-blog/`. Storybloki ruumis olid juba blueprint'i komponendid: `page`, `grid`, `feature`, `teaser` ja üks story `home`.

---

## Faas 4 — Failide ümberkorraldus (alamkataloog → juur)

Otsus: liigutame Astro projekti **alamkataloogist projekti juurde**, et `CLAUDE.md` ja `docs/` saaksid elada koodi kõrval.

Käsureal:
```bash
# Hangi .env tokeniga väärtus
cat haapsalu-blog/.env  # STORYBLOK_DELIVERY_API_TOKEN=...

# Säilita meie versioonid, kustuta blueprint'i konfliktid
rm haapsalu-blog/.env haapsalu-blog/.env.example haapsalu-blog/.gitignore haapsalu-blog/README.md

# Liiguta ülejäänu juurde
mv haapsalu-blog/* .
mv haapsalu-blog/.prettierrc .
rmdir haapsalu-blog

# Loo meie .env tokeniga
echo 'STORYBLOK_DELIVERY_API_TOKEN=<token>
STORYBLOK_REGION=eu' > .env

npm install
```

**Lõks:** `npm install` lõi `package-lock.json`-i ja installs 902 paketti. Mõnda hoiatust (deprecated `node-domexception`, `glob@10`), kuid mitte fataalsed.

---

## Faas 5 — Astro pool: komponendid + konfiguratsioon

### 5.1 Eemalda blueprint'i demokomponendid

```bash
rm src/storyblok/Feature.astro
rm src/storyblok/Grid.astro
rm src/storyblok/Teaser.astro
# Page.astro jätame (universaalne wrapper)
```

### 5.2 Loo design tokens CSS muutujatena

`src/styles/global.css` — täpselt samade nimetuste ja väärtustega nagu Figma `Tokens` lehel (5 värvi, 4 fontsize, 6 spacing, 2 radius).

### 5.3 Loo 7 uut Astro komponenti

`src/storyblok/`:
- `Header.astro` — logo + nav_items
- `Footer.astro` — copyright
- `ArticleCard.astro` — tõmbab `article` story referentsist andmed
- `ArticleList.astro` — tühi `articles` väli → fallback: kogu `blog/` kausta sisu
- `ArticleHeader.astro` — title + meta + cover_image
- `RichText.astro` — `renderRichText()` Storyblok rich-textile + stiilitud `:global()` selektoritega
- `Article.astro` — content type wrapper, ühendab Header + RichText

### 5.4 Lisa Fallback komponent

```astro
<!-- src/storyblok/Fallback.astro -->
<div class="fallback">
  ⚠ Tundmatu blok: <code>{blok.component}</code>
</div>
```

Põhjus: kui Storyblokis on blokk, mida Astros pole, näeb arendaja kollast hoiatuskasti, mitte tühi leht.

### 5.5 Uuenda `astro.config.mjs`

```js
storyblok({
  accessToken: STORYBLOK_DELIVERY_API_TOKEN,
  bridge: true,
  enableFallbackComponent: true,
  customFallbackComponent: 'storyblok/Fallback',
  components: {
    page: 'storyblok/Page',
    article: 'storyblok/Article',
    header: 'storyblok/Header',
    footer: 'storyblok/Footer',
    article_card: 'storyblok/ArticleCard',
    article_list: 'storyblok/ArticleList',
    article_header: 'storyblok/ArticleHeader',
    rich_text: 'storyblok/RichText',
  },
  // ...
})
```

**Lõks:** `@storyblok/astro` v9-s on fallback süntaks **erinev** vanematest versioonidest. Esimene katse `fallbackComponent: '...'` ei töötanud. Õige variant: `enableFallbackComponent: true` + `customFallbackComponent: '...'`.

### 5.6 Lihtsusta Layout.astro

Eemalda blueprint'i CSS link, lisa Inter font, kasuta meie `global.css`-i.

### 5.7 Käivita dev server

```bash
npm run dev
```

Server hüppab portile 4322 (4321 oli kasutuses): **https://localhost:4322/**. Esimene curl näitas `[ERROR] No component found for blok "teaser"` — Storybloki `home` story sisaldas veel `teaser` blokki, mille me kustutasime. Fallback komponent päästis olukorra.

---

## Faas 6 — Storyblok schema seadistus

### Samm 1: kustuta blueprint'i blokid

**Block Library** → kustuta `grid`, `feature`, `teaser`. `page` jäta alles.

### Samm 2: loo `article` content type — **LÕKS**

**Block Library → + New Block** (asub paremas ülanurgas "Create Folder" kõrval, võib olla brauseri aknas paremalt välja jäänud → vaja akent laiendada).

Tüüp: ⦿ **Content Type** (mitte Nestable — KRIITILINE).

6 välja:
| Field | Type | Settings |
|-------|------|----------|
| `title` | Text | Required |
| `published_at` | Date/Time | – |
| `cover_image` | Asset | Filetypes: images |
| `excerpt` | Textarea | Max 200 |
| `body` | Richtext | Toolbar: paragraph, h2, h3, bold, italic, link, image, blockquote, list |
| `author_name` | Text | Default `Toimetus` |

**⚠ Tegelik lõks:** ekslikult muudeti `page` content type'i skeem (lisati artiklile sarnased väljad). Tulemus: `home` story redaktor näitas paremal `Title/Published At/Cover Image/Excerpt/Body/Author Name` (article fields) **`page` content type'is**.

**Parandus:**
- **Block Library → page → Schema**
- Kustuta KÕIK olemasolevad väljad
- Lisa **üks** väli: `body`, tüüp **Blocks** (mitte Richtext!)
- Save

Pärast paranduse: `home` story redaktor näitas paremal ainult **Body** välja `+ Add Block` nupuga. ✅

### Samm 3: loo 6 nestable blokki

| Blok | Field | Type | Settings |
|------|-------|------|----------|
| `nav_link` | `label` | Text | |
| `nav_link` | `url` | Link | |
| `header` | `logo_text` | Text | Default `Blog` |
| `header` | `nav_items` | Blocks | Restrict: ainult `nav_link` |
| `footer` | `copyright` | Text | Default `© 2026 Haapsalu Kolledž` |
| `article_card` | `article` | Single-Option | Source: Stories, filter type `article` |
| `article_list` | `articles` | Multi-Options | Source: Stories, filter type `article` |
| `rich_text` | `content` | Richtext | |

### Samm 4: uuenda `home` story sisu

**Content → home:**
1. Kustuta vanad `Teaser` ja `Grid` blokid
2. **+ Add Block** kolm korda:
   - `header` (logo_text=`Blog`, nav_items=2x `nav_link`)
   - `article_list` (`articles` tühjaks → fallback ArticleList.astros tõmbab `blog/` kausta sisu)
   - `footer` (copyright)
3. **Preview URL** sealsamas (Setup Visual Editor sektsioon): muuda `https://localhost:3000/` → **`https://localhost:4322/`** → Save URL
4. **Publish**

### Samm 5: `blog/` kaust + 3 artiklit

**Content → + Folder:**
- Name: `Blog`, Slug: `blog`, **Default content type: `article`** (kriitiline)

Kausta sisse 3 story-d:
- `esimene-postitus`
- `teine-postitus`
- `kolmas-postitus` *(üks slug sai algselt typoga: `see-on-kolmas-postirtus` → parandatud käsitsi Config tab → Slug)*

Iga artikkel: täida 6 välja, lisa kaanepilt (upload Asset), **Publish**.

---

## Faas 7 — Bugiparandused pärast esimest täielikku renderdust

### 7.1 Header URL'id katki

Esimene curl peale Sammu 5 näitas:
```html
<a href="//blog/">Postitused</a>     ← KAKS kaldkriipsu!
<a href="/home">Avaleht</a>          ← Peaks olema "/"
```

**Põhjus:** `Header.astro` lisas alati prefiksi `/`:
```astro
<a href={`/${item.url.cached_url}`}>
```
Aga Storyblok andis:
- Internal Story `home` → `cached_url = "home"` → `/home` (vale, `home` on saidi root)
- URL link `/blog/` → `cached_url = "/blog/"` → `//blog/` (topelt-`/`)

**Parandus:** uus `resolveLink()` funktsioon:
```js
function resolveLink(url) {
  if (!url) return '#';
  if (url.linktype === 'url' || url.url) return url.url || url.cached_url;
  const slug = url.cached_url || '';
  if (!slug || slug === 'home') return '/';
  return slug.startsWith('/') ? slug : `/${slug}`;
}
```

Tulemus: `Avaleht` → `/`, `Postitused` → `/blog/`. ✅

### 7.2 Kosmeetilised parandused Storyblokis

- Lisada `nav_items` `home` story `header` blokis (Avaleht + Postitused linkidega)
- Paranda slug typo
- Lisada puuduv `author_name` teise artiklisse

**Lõks Storyblokis:** kui klõpsata `nav_link` `url` väljal "Internal Stories" rippmenüü, nähtub `Blog` kaust loendis, **AGA kaustal pole Storyblokis URLi** (folder isn't a story). Lahendus: lülitada link tüüp **URL** (chain-ikoon dropdown'ist) ja sisestada käsitsi `/blog/`.

---

## Faas 8 — Global config ✅

Probleem: header ja footer kuvati ainult `home` lehel, sest nad olid `home` story sisu osa. Üksiku artikli lehel polnud neid.

Lahendus: **`config` singleton story** pattern.

### 8.1 Koodi muudatus (Layout.astro)

Layout tõmbab `/cdn/stories/config` ja renderdab header/footer slot'i ümber:
```astro
const sb = useStoryblokApi();
let config = null;
try {
  const { data } = await sb.get('cdn/stories/config', { version: 'draft' });
  config = data?.story?.content ?? null;
} catch { /* config pole veel loodud */ }
```

Bodyl:
```astro
{config?.header?.map((h) => <StoryblokComponent blok={h} />)}
<slot />
{config?.footer?.map((f) => <StoryblokComponent blok={f} />)}
```

### 8.2 Storyblok UI

1. **Block Library → + New Block** → name `config`, type **Content Type**
   - Väli `header` (Blocks, restrict ainult `header`)
   - Väli `footer` (Blocks, restrict ainult `footer`)
2. **Content → + New Story** (root) → name `Config`, slug `config`, type `config`
   - Lisa header blok (sama sisu mis `home`-s)
   - Lisa footer blok
   - **Publish**
3. **Content → home** → kustuta `header` ja `footer` blokid (jätta ainult `article_list`)
   - **Publish**

Tulemus: iga leht saab Layout-ist header/footer ühest allikast. Storybloki editor saab kõike ühest kohast hallata.

### 8.3 Lõks: `/config` URL kuvas tundmatu blokki

`/config` lehel ilmus kollane "Tundmatu blok: config", sest Visual Editor avab config story-t ka iframe'is. Lahendus: lisada `Config.astro` komponent (placeholder, ei renderda lehe sisu), registreerida `astro.config.mjs` failis:

```astro
<!-- src/storyblok/Config.astro -->
<div class="config-placeholder">
  <h2>⚙️ Config story</h2>
  <p>Seda kasutatakse globaalselt — header/footer renderdatakse iga lehe peal.</p>
</div>
```

---

## Faas 9 — Blog index story ✅

Probleem: `/blog/` URL andis HTTP 404 — Storybloki kaust `blog/` pole iseseisev story, vaja eraldi indeks-lehte.

### 9.1 Storyblok UI

**Content → + New → Story** (ROOT tasemel, MITTE kausta sees):
- Name: `Blog`
- Slug: `blog`
- Content type: `page`

**⚠ Lõks:** Storyblok keeldus dubleerimast slug `blog` (kuna kaust sama slug-iga juba olemas).

**Parandus:** kasutati slug `postitused` (eesti keeles ka loomulikum). Body field → `+ Add Block` → `article_list` (väli `articles` jäeti tühjaks → Astro fallback toob `blog/` kausta sisu).

**Publish.**

### 9.2 Nav link uuendamine

`config` story `header` blokis → `nav_link` "Postitused" → URL muudetud `/blog/` → `/postitused/`.

### 9.3 Pedagoogiline märkus

See ongi headless CMS "minus" võrreldes WordPressi automaatse arhiivilehega: kaustad ei oma URL-i ise, vaja eraldi indeks-story. Annab paindlikkust (indeks võib sisaldada mistahes blokke, mitte ainult automaatset loendit), aga nõuab teadmist.

**Lõpptulemus:**
| URL | Sisu |
|-----|------|
| `/` | Header + 3 ArticleCard'i (`article_list` automaatne fallback) + Footer |
| `/postitused/` | Sama vaade, eraldi URL |
| `/blog/<slug>` | Header + Article (title + meta + cover + richtext) + Footer |

---

## Faas 10 — Cloudflare Workers deploy ✅

Eesmärk: avalik URL õpilastele ja esitluseks.

### 10.1 Git init + GitHub repo

```bash
git init
# Per-repo config (mitte globaalne — koolitöö, mitte tööandja)
git config user.email "jubejuss@tlu.ee"
git config user.name "Juho Kalberg"

# Lisa failid (NB! .env on gitignore-is, ei satu commitisse)
git add -A
git commit -m "Initial commit"

# Public repo GitHubis
gh repo create figma-storyblock-astro --public --source=. --remote=origin --push
```

URL: https://github.com/jubejuss/figma-storyblock-astro

### 10.2 Cloudflare adapter

```bash
npx astro add cloudflare --yes
# Eemalda kasutamata Vercel/Netlify
rm vercel.json netlify.toml
npm uninstall @astrojs/vercel @astrojs/netlify
```

Astro add lisab `wrangler.jsonc`. Muuda seal `name` (default tuli package.jsonist):
```jsonc
"name": "figma-storyblock-astro"
```

### 10.3 Deploy + secrets

```bash
# Esimene deploy (loob worker'i + reserveerib subdomain)
npx wrangler login        # avab brauseri Cloudflare auth'iks
npx wrangler deploy        # küsib subdomain valikut

# Lisa Storyblok credentials (Cloudflare side encrypted secrets)
npx wrangler secret put STORYBLOK_DELIVERY_API_TOKEN
# Paste token kui küsib

npx wrangler secret put STORYBLOK_REGION
# Sisesta: eu
```

URL: https://figma-storyblock-astro.jubejuss.workers.dev/

### 10.4 Lõksud Cloudflare deploy'l (palju!)

**Lõks 1: Secret name typo**
Esimene katse: `wrangler secret put` küsib **secret name esimeseks arg-iks**. Ekslikult anti tokeni väärtus nimena (`wrangler secret put FCyfy5qy...`). Tulemus: secret nime järgi vale, worker ei leia `STORYBLOK_DELIVERY_API_TOKEN`-it → Error 1101 (Worker threw exception).

Parandus: `wrangler secret delete <vale-nimi>` ja siis õigesti `wrangler secret put STORYBLOK_DELIVERY_API_TOKEN`.

**Lõks 2: Per-worker secrets**
Wrangler.jsonc `name` muutus blueprint-blank-astro → figma-storyblock-astro. Sellega tekkis **uus worker**, vana jäi alles. Secret'id on **per-worker**, uuel pole.

Parandus: pärast worker'i ümbernimetamist seada secret'id uuesti uuele worker'ile.

**Lõks 3: package.json nimi mõjutab KV namespace nime**
@astrojs/cloudflare adapter loob auto sessioni KV namespace, mille nimi on `<package-name>-session`. Kui rename'isid ainult `wrangler.jsonc`-i mitte `package.json`-i, KV nimi jäi vana → konflikt olemasoleva namespace'iga.

Parandus: rename ka `package.json` `"name"` väli + kustuta `dist/` ja `.wrangler/` cache + rebuild.

**Lõks 4: `wrangler delete --name` ei tööta**
Wrangler v4-s `delete` kasutab positsioneerimist, mitte `--name` flag'i. Õige: `wrangler delete blueprint-blank-astro`. Vale `--name` flag'iga: ignoreeritakse JA Wrangler võib kustutada CURRENT worker'i (`wrangler.jsonc`-ist), mis on **figma-storyblock-astro** → tulemus "There is nothing here yet".

Parandus: kustuta dashboardist (turvalisem) või kasuta positsioonarg-i.

**Lõks 5: dist/ ja .wrangler cache vana nimega**
Pärast nime muutmist `package.json`-is, vana build (`dist/`) ja Wrangler-i lokaalne cache (`.wrangler/`) sisaldasid endiselt vana nime. Deploy proovis luua vana nimega KV → konflikt.

Parandus:
```bash
rm -rf dist .wrangler
npm run build
npx wrangler deploy
```

### 10.5 Visual Editor preview URL — uuenda

Storyblok → **Settings → Visual Editor → Preview URLs** → lisa Cloudflare URL kõrvuti localhost'iga:
- `https://localhost:4322/` (arendus)
- `https://figma-storyblock-astro.jubejuss.workers.dev/` (produktsioon)

Sisuhaldaja saab valida, kus preview avada.

---

## Õpitud lõksud kokkuvõte

| # | Lõks | Põhjus | Parandus |
|---|------|--------|----------|
| 1 | `figma.currentPage = X` viskab vea | Dynamic-page access nõuab async API | `await figma.setCurrentPageAsync(X)` |
| 2 | Tekst ei wrap'i Figma frame'i sees | Default `layoutSizingHorizontal = 'HUG'` | Seada `FILL` text node-l |
| 3 | Plugin teeb kõik *Nestable* blokid | Storyblok plugini vaikekäitumine | Käsitsi Block Library's muuta `Is root = true` |
| 4 | `page` skeemat muudeti `article` skeemaks | Ekslikult avati `page` Schema asemel et luua uut blokki | Restoreed `page` ainult ühele `body` (Blocks) väljale |
| 5 | `fallbackComponent: 'X'` ei tööta | V9-s teine süntaks | `enableFallbackComponent: true` + `customFallbackComponent` |
| 6 | Nav linkide URL-id katki (`//blog/`, `/home`) | Naivne `/` prefiks alati | Smart `resolveLink()` helper |
| 7 | Internal Link ei luba kaustale lingida | Folder pole Storyblok'is "story", pole URLi | Vahetada link tüüp → URL, sisestada `/blog/` |
| 8 | Header/Footer ainult `home`-l, mitte artiklitel | Need olid `home` body sisuosaks | Eralda **config** singleton story Layout'isse |
| 9 | Slug auto-genereeritakse nime põhjal | Storyblok tunneb ainult ASCII | Parandada käsitsi (Config tab → Slug) |
| 10 | Folder Default content type unustatakse | UI ei märgi seda kohustuslikuks | Seada `Blog` kausta default = `article` |
| 11 | `/config` URL kuvas tundmatu blokki | Visual Editor avab config story-t iframe'is | Lisada `Config.astro` placeholder + registreerida |
| 12 | Kausta URL `/blog/` andis 404 | Folder pole iseseisev story | Loo eraldi `page` story (slug `postitused`), sisaldab `article_list` |
| 13 | Storyblok keelas slug `blog` dubleerimist | Folder sama slug-iga juba olemas | Kasuta alternatiivset slug-i (`postitused`) ja uuenda nav linke |
| 14 | Worker Error 1101 — secret name vale | `wrangler secret put FCyfy...` (token *väärtus* nimena) | `wrangler secret put STORYBLOK_DELIVERY_API_TOKEN` (õige nimi) |
| 15 | Uus worker pärast rename'i, vana secret'id | Secret'id on per-worker | Sea secret'id uuele worker'ile uuesti |
| 16 | KV namespace konflikt deploy'l | `package.json` `"name"` jäi vana, KV nimi = `<name>-session` | Uuenda ka `package.json` + rebuild |
| 17 | `wrangler delete --name X` kustutas vale worker'i | V4-s `delete` on positsiooniline arg, `--name` ignoreeritakse | Kasuta `wrangler delete <nimi>` või dashboard |
| 18 | "There is nothing here yet" pärast deploy't | Worker oli kustutatud, subdomain reserveeritud | Re-deploy + sea secret'id uuesti |

---

## Edasised sammud (kui demos jätkub)

- [ ] Live Preview test Storybloki Visual Editori kaudu (logo_text muuda → koheselt iframe'is näha)
- [ ] Lisada `og:image`, `meta description` (kasuta `excerpt` välja)
- [ ] SSR build test: `npm run build` → kontrolli, et adapter (Vercel) töötab
- [ ] Deploy Vercelisse / Netlifysse
- [ ] Figma → Storyblok plugini katsetus (kas pluginast loodud schema kattub meie käsitsi loodud omaga?)
- [ ] Sisutüübid keelte jaoks (i18n), kui demos kasvab

---

**Allikad:**
- `docs/PLAN.md` — Figma + Storyblok 1:1 struktuuri spec
- `docs/STORYBLOK-SCHEMA.md` — käsiraamat Storybloki UI seadistuseks
- `CLAUDE.md` — projekti seadistus Claude'ile
- [Storyblok Astro juhend](https://www.storyblok.com/docs/guides/astro)
- [Storyblok Block concepts](https://www.storyblok.com/docs/concepts/blocks)
