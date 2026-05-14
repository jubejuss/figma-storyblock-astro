# Figma + Storyblok struktuuri spec

Täielik MVP spec, mille järgi nii Figma fail kui ka Storybloki ruum üles ehitatakse. Hoiame need **1:1 vastavuses** — sama nimi Figmas = sama bloki nimi Storyblokis.

## Figma faili struktuur

Fail: **Storyblock** (`dTwBlwL7yFMJZe5STUrEVP`)

```
📄 Storyblock
├─ Page: Tokens                  ← ainult Variables collection, visuaal pole oluline
│   ├─ color/background
│   ├─ color/surface
│   ├─ color/text
│   ├─ color/text-muted
│   ├─ color/accent
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
├─ Page: Components              ← Figma → Storyblok plugin loeb siit
│   ├─ Header                    (Auto-layout horizontal, padding md, fill container)
│   ├─ Footer                    (Auto-layout horizontal, padding md)
│   ├─ ArticleCard               (Auto-layout vertical: cover, title, excerpt, meta)
│   ├─ ArticleList               (Auto-layout grid 1-3 col, gap lg)
│   ├─ ArticleHeader             (Auto-layout vertical: title, meta, cover)
│   └─ RichText                  (näide-tekst lõikudest, pealkirjadest, tsitaadist)
│
└─ Page: Pages                   ← lehe kompositsioonid (näitamiseks, plugin neid ei loe komponendina)
    ├─ Frame: IndexPage          (1440×900, Header → ArticleList → Footer)
    └─ Frame: ArticlePage        (1440×900, Header → ArticleHeader → RichText → Footer)
```

## Komponentide spec

### Header
- Auto-layout: horizontal, space-between, padding `md`
- Sisu: `Logo` (text "Blog") + nav linkide rida ("Avaleht", "Postitused")
- Fill container width

### Footer
- Auto-layout: horizontal, center, padding `md`
- Sisu: text "© 2026 Haapsalu Kolledž"

### ArticleCard
- Auto-layout: vertical, gap `sm`, padding `md`, radius `md`, fill `surface`
- Slot 1: cover image (16:9, fill width)
- Slot 2: title (h3)
- Slot 3: excerpt (body, max 3 lines)
- Slot 4: meta rida (date · author, body small + muted)

### ArticleList
- Auto-layout: vertical (mobile) / grid horizontal (desktop), gap `lg`
- Sisaldab 3 ArticleCard instantsi (näiteks)

### ArticleHeader
- Auto-layout: vertical, gap `md`
- Slot 1: title (h1)
- Slot 2: meta rida (published_at, author_name)
- Slot 3: cover_image (full width, radius `md`)

### RichText
- Demonstratiivne näide rikateksti renderdusest:
  - Pealkiri (h2)
  - Lõik (body)
  - Pealkiri (h3)
  - Lõik (body)
  - Tsitaat
  - Lõik (body)

## Storybloki bloks pärast sünki

Plugin loob esialgse skeemi automaatselt. Käsitsi viimistlus:

### Content Type: `article`
> Vaikimisi tuleb Nestable. Ava Block Library → article → Schema → muuda **"Is root" = true** ja **"Is nestable" = false**.

| Väli | Tüüp | Märkused |
|------|------|----------|
| `title` | text | required |
| `published_at` | datetime | |
| `cover_image` | asset | filetype: images |
| `excerpt` | textarea | max 200 char |
| `body` | richtext | |
| `author_name` | text | default "Toimetus" |

> `slug` on Storybloki sisseehitatud (story metadata), eraldi välja pole vaja.

### Nestable bloks
Pluginast tulevad esialgu kõik tekstiväljadega. Korrigeeri:

| Blok | Väli | Tüüp |
|------|------|------|
| `header` | `logo_text` | text |
| `header` | `nav_items` | blocks (`nav_link`) |
| `nav_link` | `label` | text |
| `nav_link` | `url` | link |
| `footer` | `copyright` | text |
| `article_card` | `article` | option (single article reference) |
| `article_list` | `articles` | options (multi article reference) |

> NB! `ArticleCard`/`ArticleList` Storyblokis on pigem **dünaamilised**: nad ei salvesta eraldi pealkirja, vaid viitavad `article` story'le.

## Astro mapping

`astro.config.mjs` `components` map:
```js
components: {
  article: 'storyblok/Article',         // article page sisu
  header: 'storyblok/Header',
  footer: 'storyblok/Footer',
  article_card: 'storyblok/ArticleCard',
  article_list: 'storyblok/ArticleList',
  nav_link: 'storyblok/NavLink',
}
```

Failid:
```
src/
├─ pages/
│  ├─ index.astro                    ← küsib /cdn/stories tüübiga article_list või eraldi config story
│  └─ blog/
│     └─ [...slug].astro             ← küsib /cdn/stories/blog/<slug>
└─ storyblok/
   ├─ Article.astro
   ├─ Header.astro
   ├─ Footer.astro
   ├─ ArticleCard.astro
   ├─ ArticleList.astro
   └─ NavLink.astro
```

## Tailwind tokens map

`tailwind.config` (või Tailwind v4 puhul CSS `@theme`):
```css
@theme {
  --color-background: <Figma color/background>;
  --color-surface: <Figma color/surface>;
  --color-text: <Figma color/text>;
  --color-text-muted: <Figma color/text-muted>;
  --color-accent: <Figma color/accent>;

  --font-size-body: 1rem;
  --font-size-h3: 1.25rem;
  --font-size-h2: 1.75rem;
  --font-size-h1: 2.5rem;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 4rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
}
```

Kasuta [`storyblok/design-tokens-figma-plugin`](https://github.com/storyblok/design-tokens-figma-plugin) Variables → JSON ekspordiks ja konverdi Tailwind v4 `@theme` blokiks.
