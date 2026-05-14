# Figma + Storyblok + Astro struktuuri spec

Täielik MVP spec — Figma fail, Storybloki ruum ja Astro projekt **1:1 vastavuses**: sama nimi Figmas = sama bloki nimi Storyblokis = sama `.astro` faili nimi.

## Figma faili struktuur

Fail: **Storyblock** (`dTwBlwL7yFMJZe5STUrEVP`)

```
📄 Storyblock
├─ Page: Tokens                  ← Variables collection (visuaal pole oluline)
│   ├─ color/background          (#FFFFFF)
│   ├─ color/surface             (#F5F5F5)
│   ├─ color/text                (#111111)
│   ├─ color/text-muted          (#666666)
│   ├─ color/accent              (#2F6BFF)
│   ├─ font/size/body            (16)
│   ├─ font/size/h3              (20)
│   ├─ font/size/h2              (28)
│   ├─ font/size/h1              (40)
│   ├─ spacing/xs                (4)
│   ├─ spacing/sm                (8)
│   ├─ spacing/md                (16)
│   ├─ spacing/lg                (24)
│   ├─ spacing/xl                (32)
│   ├─ spacing/2xl               (64)
│   ├─ radius/sm                 (4)
│   └─ radius/md                 (8)
│
├─ Page: Components              ← Frame'id (auto-layout), kõik tokenitega seotud
│   ├─ Header                    (1200×56,  HORIZONTAL, padding md, space-between)
│   ├─ Footer                    (1200×51,  HORIZONTAL, padding md, center)
│   ├─ ArticleCard               (360×321,  VERTICAL: cover, title, excerpt, meta)
│   ├─ ArticleList               (1200×353, HORIZONTAL grid, 3 ArticleCard)
│   ├─ ArticleHeader             (800×563,  VERTICAL: title, meta, cover)
│   └─ RichText                  (800×321,  demonstratiivne tekst — h2/h3/p/quote)
│
└─ Page: Pages                   ← lehe kompositsioonid (näitamiseks)
    ├─ Frame: IndexPage          (1440×716,  Header → ArticleList → Footer)
    └─ Frame: ArticlePage        (1440×1111, Header → ArticleHeader → RichText → Footer)
```

## Komponentide spec

### Header
- Auto-layout: HORIZONTAL, space-between, padding `md`
- Sisu: Logo (text "Blog", h3, bold) + nav rida (kaks linki: Avaleht, Postitused)
- NB! Tegelik header kasutab `nav_link` nestable blokke, mitte staatilist teksti

### Footer
- Auto-layout: HORIZONTAL, center, padding `md`
- Sisu: copyright text muted-värvis

### ArticleCard
- Auto-layout: VERTICAL, gap `sm`, padding `md`, radius `md`, fill `surface`
- Slots: cover image (16:9), title (h3), excerpt (body muted), meta rida (date · author)

### ArticleList
- Auto-layout: HORIZONTAL grid, gap `lg`, padding `lg`
- Sisaldab 3 ArticleCard'i (näitlikult)

### ArticleHeader
- Auto-layout: VERTICAL, gap `md`
- Slots: title (h1), meta rida (date · author), cover_image (16:9, radius md)

### RichText
- Demonstratiivne richtext renderdus: h2, paragraph, h3, paragraph, quote, paragraph

## Storybloki content types ja blokid

### Content Types (3)

| Tüüp | Roll | Väljad |
|------|------|--------|
| **`article`** | Sisuüksus, oma URL | `title`, `published_at`, `cover_image`, `excerpt`, `body` (richtext), `author_name` |
| **`page`** | Konteiner | `body` (Blocks — sinna lohistatakse nestable blokid) |
| **`config`** | Singleton (globaalsed sätted) | `header` (Blocks: ainult `header`), `footer` (Blocks: ainult `footer`) |

> NB! `page` peab olema **AINULT `body` (Blocks)** väljaga. Kui paned siia article-väljad, lõhud `home` story. See on suurim lõks — vt [`STORYBLOK-SCHEMA.md`](STORYBLOK-SCHEMA.md) hoiatus.

### Nestable blokid (6)

| Blok | Väljad |
|------|--------|
| `header` | `logo_text` (Text), `nav_items` (Blocks → ainult `nav_link`) |
| `nav_link` | `label` (Text), `url` (Link) |
| `footer` | `copyright` (Text) |
| `article_card` | `article` (Single-Option → Stories, filter `article`) |
| `article_list` | `articles` (Multi-Options → Stories, filter `article`). Tühi = Astro tõmbab `blog/` kausta automaatselt. |
| `rich_text` | `content` (Richtext) |

> `article_header` ei vaja eraldi blokki — `Article.astro` ehitab selle otse `article` story väljadest.

## Storybloki sisu (stories)

```
/                              → page-tüüpi `home`           → body: [header, article_list, footer] (vana, kuni Faas 8) → body: [article_list] (uus, Faas 8 järel)
/postitused/                   → page-tüüpi `postitused`     → body: [article_list]
/config                        → config-tüüpi `config`       → header + footer (singleton, Layout.astro fetchib)
/blog/esimene-postitus         → article-tüüpi `esimene-postitus`
/blog/teine-postitus           → article-tüüpi `teine-postitus`
/blog/kolmas-postitus          → article-tüüpi `kolmas-postitus`
```

> `blog/` on **kaust**, mille `Default content type = article`. Kaust ise pole URL — vt allpool route-id.

## Astro projekti struktuur

```
src/
├─ pages/
│  └─ [...slug].astro              ← ÜKS universaalne route. Catches: /, /postitused/, /blog/<slug>
├─ layouts/
│  └─ Layout.astro                 ← fetchib config story, renderdab header + footer
├─ styles/
│  └─ global.css                   ← plain CSS muutujad (sünk Figma Tokens)
└─ storyblok/                      ← komponendid (1:1 Storybloki blokkidega)
   ├─ Page.astro                   ← page content type wrapper (renderdab body Blocks)
   ├─ Article.astro                ← article content type wrapper (kombineerib ArticleHeader + RichText)
   ├─ Header.astro                 ← header nestable blok
   ├─ Footer.astro                 ← footer nestable blok
   ├─ ArticleCard.astro            ← article_card nestable blok
   ├─ ArticleList.astro            ← article_list nestable blok
   ├─ ArticleHeader.astro          ← (renderdab article story metadata, pole eraldi blokk)
   ├─ RichText.astro               ← rich_text nestable blok
   ├─ Config.astro                 ← config content type placeholder (Visual Editor jaoks)
   └─ Fallback.astro               ← tundmatud blokid → kollane hoiatuskast
```

## astro.config.mjs — components map

```js
storyblok({
  bridge: true,
  enableFallbackComponent: true,                          // v9 süntaks
  customFallbackComponent: 'storyblok/Fallback',
  components: {
    page: 'storyblok/Page',
    article: 'storyblok/Article',
    config: 'storyblok/Config',
    header: 'storyblok/Header',
    footer: 'storyblok/Footer',
    article_card: 'storyblok/ArticleCard',
    article_list: 'storyblok/ArticleList',
    article_header: 'storyblok/ArticleHeader',
    rich_text: 'storyblok/RichText',
  },
})
```

> **Lõks:** `nav_link` POLE siin loendis, sest seda renderdab `Header.astro` otse (ei kasuta `<StoryblokComponent>` `nav_link` jaoks). See on optimization — säästame ühe per-link rendering call'i.

## Design tokens — Figma → CSS

Lihtne kopeerimine `Figma Variables` → `src/styles/global.css` `:root`:

```css
:root {
	--color-background: #ffffff;
	--color-surface: #f5f5f5;
	--color-text: #111111;
	--color-text-muted: #666666;
	--color-accent: #2f6bff;

	--font-size-body: 16px;
	--font-size-h3: 20px;
	--font-size-h2: 28px;
	--font-size-h1: 40px;

	--space-xs: 4px;
	--space-sm: 8px;
	--space-md: 16px;
	--space-lg: 24px;
	--space-xl: 32px;
	--space-2xl: 64px;

	--radius-sm: 4px;
	--radius-md: 8px;
}
```

Komponentides kasuta: `padding: var(--space-md)`, `color: var(--color-text)` jne. **Ei Tailwindit, ei sass'i** — lihtne ja explicit.

> Kui tahad Figmast automatiseerida, vaata [storyblok/design-tokens-figma-plugin](https://github.com/storyblok/design-tokens-figma-plugin) (Variables → JSON). Käsitsi kopeerimine on demos kiirem.
