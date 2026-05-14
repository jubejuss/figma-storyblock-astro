# Sisuhaldus — Figma → Storyblok → Astro

Õppedemo Haapsalu Kolledži sisuhaldussüsteemide kursusele. Eesmärk: näidata terviklikku **headless CMS töövoogu** disainerist arendajani.

## Tehnoloogiad

- **Disain:** Figma (fail "Storyblock", key `dTwBlwL7yFMJZe5STUrEVP`)
- **Sild:** Storyblok ametlik Figma plugin ([Figma Community](https://www.figma.com/community/plugin/1506962248112177026/figma-to-storyblok))
- **CMS:** Storyblok (Visual Editor + REST/CDN API)
- **Frontend:** Astro 6 + `@storyblok/astro` v6.2.0+ (Node 22.13+)
- **Stiil:** Tailwind v4 (`@tailwindcss/vite`, `@import "tailwindcss"`)

## Projekti seis

**Faas:** disain (Figma).
- [ ] Figma fail "Storyblock" — komponendid + 2 lehekompositsiooni
- [ ] Figma → Storyblok plugin sünk
- [ ] Storybloki content type `article` käsitsi seadistamine (vaikimisi tuleb Nestable, peab muutma)
- [ ] Astro projekt scaffolditud
- [ ] `@storyblok/astro` integratsioon + bridge
- [ ] Live Preview seadistus

## Minimaalne MVP scope

**Lehed (2):** blog index (=esileht `/`), article page `/blog/[...slug]`.

**Storybloki content type (1):** `article`
| Väli | Tüüp |
|------|------|
| `title` | text |
| `slug` | auto |
| `published_at` | datetime |
| `cover_image` | asset |
| `excerpt` | textarea |
| `body` | richtext |
| `author_name` | text |

**Komponendid (6):** `Header`, `Footer`, `ArticleCard`, `ArticleList`, `ArticleHeader`, `RichText`.

**Design tokens (~20):** vt `docs/PLAN.md`.

Vt täielikku spec: [`docs/PLAN.md`](docs/PLAN.md).
Storyblok space loomine (algajatele): [`docs/STORYBLOK-SETUP.md`](docs/STORYBLOK-SETUP.md).
Schema seadistus pärast Developer Quickstart-i: [`docs/STORYBLOK-SCHEMA.md`](docs/STORYBLOK-SCHEMA.md).

## Töövoog Figmas (kriitilised reeglid)

1. **Kasuta `Frame`-i, MITTE `Group`-i.** Plugin ei tunne `Group`-i.
2. **Nimed PascalCase + semantilised:** `ArticleCard`, mitte `Frame 42`.
3. **Auto-layout kõikjal** — see saab Storybloki nestable struktuuriks.
4. **Üks loogiline komponent = üks Figma component.** Ära paki kümmet asja ühte raami.
5. **Tokens eraldi** — Figma `Variables` ei sünkroniseeru põhipluginaga. Selleks on [`storyblok/design-tokens-figma-plugin`](https://github.com/storyblok/design-tokens-figma-plugin).

## Storybloki seadistus pärast plugini sünki

- Plugin loob KÕIK bloks-id Nestable-na. **`article` tuleb käsitsi muuta Content Type'iks** (Block Library → Edit → "Is root").
- Kontrolli väljatüüpe — plugin paneb sageli kõik tekstiks; rikatekst, asset, datetime tuleb käsitsi seada.
- `body` peab olema **richtext** ja `cover_image` **asset** tüüpi.

## Astro setup (kui jõuame)

```bash
npm create astro@latest .
npm install @storyblok/astro
```

`astro.config.mjs`:
```js
import storyblok from '@storyblok/astro';

export default defineConfig({
  integrations: [storyblok({
    accessToken: import.meta.env.STORYBLOK_DELIVERY_API_TOKEN,
    components: {
      article: 'storyblok/Article',
      header: 'storyblok/Header',
      footer: 'storyblok/Footer',
      // ...
    },
    bridge: true,
  })],
});
```

**Live Preview nõuded:**
- `bridge: true` integratsioonis
- `{...storyblokEditable(blok)}` iga komponendi juurelemendil
- Draft sisu nägemiseks SSR — `export const prerender = false` lehe peal

## Kataloogi konventsioonid

- **Üks** dünaamiline route fail per "type" — kasuta `[type]/[slug].astro` mustrit, **mitte** eraldi `uudised/[slug].astro` ja `sundmused/[slug].astro` (vt globaalne CLAUDE.md — Vite chunk collision `@tailwindcss/node`-iga).
- WP slugid (kui tuleb segahybrid) võivad olla mitte-ASCII — guarda `getStaticPaths` `/^[\x20-\x7E]+$/`-ga (kuigi Storyblok ise teeb ASCII slugid).

## Käsud

```bash
# Figma plugin (käsitsi)
# Figma → Plugins → "Figma to Storyblok" → autenti → vali Frame'id → Sync

# Astro dev (kui scaffolditud)
npm run dev

# Storyblok CLI (TS tüübid)
npx storyblok pull-components --space <SPACE_ID>
```

## Levinumad lõksud

- **Plugin teeb kõik Nestable-ks** → Content Type tuleb käsitsi seada
- **Live Preview ei tööta** → `bridge: true` + `storyblokEditable` puudu
- **Draft sisu ei näe Astros** → `prerender = false` puudu või access token on `published`-only
- **Pildid ei lae** → kontrolli, et asset on tõesti Storybloki Asset Library's, mitte ainult väljal
- **Richtext renderdab `[object Object]`** → vaja `renderRichText()` `@storyblok/astro/utils`-ist

## Viited

- Storyblok docs: https://www.storyblok.com/docs/guides/astro
- Bloks concept: https://www.storyblok.com/docs/concepts/blocks
- Figma plugin tipid: https://www.storyblok.com/mp/optimize-design-figma-to-storyblok-plugin
- Astro CMS guide: https://docs.astro.build/en/guides/cms/storyblok/
