# Esitluse kokkuvõte — Figma → Storyblok → Astro

> Demonstratsioonimärkmed õppetundi. Iga sektsioon = ~3-5 minutit räägitavat sisu.

---

## 0. Pildikene enne alustamist

**Headless CMS = sisu ja esitlus on lahutatud.**

```
┌───────────┐     ┌────────────┐     ┌──────────┐     ┌────────────┐
│  DESIGN   │ ──► │   SCHEMA   │ ──► │  CONTENT │ ──► │  FRONTEND  │
│  Figma    │     │  Storyblok │     │ Storyblok│     │    Astro   │
│           │     │   bloks    │     │  stories │     │  React-ish │
└───────────┘     └────────────┘     └──────────┘     └────────────┘
   disainer       tehnoloogiline     sisuhaldaja        arendaja
                  vahendaja
```

Klassikalises (monoliitses) lahenduses (WordPress) on need 3 paremat osa **kõik üks asi**. Headless lahendab need lahti — disainer ei pea tegelema CMS-iga, arendaja ei pea tegelema sisuhaldajaga.

---

## 1. Disain — Figma fail [3 min]

Avage Figma fail `Storyblock`.

**Näita:**
- **Tokens leht** — 17 muutujat (5 värvi, 4 fontsize, 6 spacing, 2 radius)
  → "see on disaini DNA, kõik komponendid kasutavad neid"
- **Components leht** — 6 komponenti auto-layoutiga
  → "iga komponent peab vastama ühele Storybloki blokile, nimetus 1:1"
- **Pages leht** — 2 kompositsiooni (IndexPage + ArticlePage)
  → "see on visuaalne 'prototüüp' — meil pole vaja Figmast pikslitäpsuse Astrosse"

**Õppepunkt:** disain ei tähenda enam staatilist pilti. See on **mõjusõnastik**, mille arendaja ja sisuhaldaja jagavad.

---

## 2. CMS-i sild — Storyblok bloks [3 min]

Avage **Storyblok → Block Library**. 

**Näita 3 tüüpi:**

| Tüüp | Roll | Näide |
|------|------|-------|
| **Content Type** | Iseseisev sisuüksus, oma URL | `article`, `page`, `config` |
| **Nestable** | Komponent teiste sees | `header`, `footer`, `article_card`, `nav_link`, `rich_text` |

**Mängi läbi:**
1. Klõpsa `article` → näita 6 välja (title, published_at, ...)
2. Klõpsa `header` → näita kuidas `nav_items` on **Blocks** tüüpi, mis lubab ainult `nav_link`-e

**Õppepunkt:** Storybloki bloks moodustavad **sõnastiku**, mida sisuhaldaja kasutab nagu lego-tükke. Iga blokk on disainis defineeritud komponent.

---

## 3. Sisu — Storyblok stories [3 min]

Avage **Content**.

**Näita struktuuri:**
- `home` (page) — kasutab `article_list` blokki
- `config` (config) — globaalne header + footer
- `postitused` (page) — `/postitused/` URL, sama article_list
- `blog/` kaust — kolme artikli sisuga

**Mängi läbi:**
1. Ava `blog/esimene-postitus` — näita 6 välja täidetuna
2. Lülita richtext väljal **paragraph → h2** — näita kuidas redaktor on WYSIWYG aga sisu hoitakse strukturaalselt (mitte HTML-na)

**Õppepunkt:** sisuhaldaja ei tegele HTML/CSS-iga. Ta valib blokke, täidab välju ja vajutab Publish. Sisu on **andmena** salvestatud (JSON), mitte renderdatud lehena.

---

## 4. Frontend — Astro renderdus [3 min]

Ava brauseris **https://localhost:4322/**.

**Näita lehekülgede vahel liikumist:**
- Avaleht → 3 artiklikaarti
- Klõpsa kaardile → ühelt artiklilt
- Klõpsa "Postitused" → eraldi list-leht

**Avaldi terminalis koodi:**
```bash
src/storyblok/
├─ Header.astro       (← header blok Storyblokis)
├─ Footer.astro       (← footer blok)
├─ ArticleCard.astro  (← article_card)
├─ ArticleList.astro
├─ Article.astro      (← article content type)
├─ RichText.astro
└─ ...
```

**Näita üks komponent (`ArticleCard.astro`):**
- See võtab `blok` prop'i (Storybloki andmed JSON-ina)
- Renderdab HTML kasutades CSS muutujaid (`var(--color-text)`)
- `{...storyblokEditable(blok)}` annab Visual Editori võimaluse

**Õppepunkt:** Astro komponent = **Storybloki bloki visuaalne kuju**. Üks-ühele suhe. Kui disainer muudab Figmas, arendaja muudab `.astro` failis, sisuhaldaja muudab Storybloki redaktoris — kõik sünkroonis.

---

## 5. Tähelepanu väärt tehnikad [2 min]

**Design tokens 1:1 sünk:**
- Figma `color/accent` = CSS `--color-accent: #2f6bff`
- Muudad Figmas → kopeerid `src/styles/global.css` faili → kõik komponendid uuenevad

**Global singleton (`config` story):**
- Üks koht header + footer'i halduseks
- Layout.astro tõmbab selle ja renderdab iga lehe peal
- Sisuhaldaja muudab logo või menüü → kogu sait uueneb

**Reference fields (`article_list` → `articles`):**
- Storyblokis valid story-d, mis viidatakse
- Astro tõmbab automaatselt nende sisu (kaks API kõnet, esimene story, teine viidatud)

**Live Preview bridge:**
- Storyblokis Visual Editor näitab localhost iframe'i
- Muudad välja redaktoris → iframe värskeneb **ilma reload-ita**
- Klõpsad iframe'is komponendil → Storybloki vorm avaneb õige bloki peal

---

## 6. Kokkuvõte / vestluse algatamine [2 min]

**Mida me õppisime:**

1. **Disain** ja **kood** ei pea olema piksli-pärast samad. Komponentide nimetused ja struktuur on olulisemad.
2. **Schema-driven content** — andmemudel disainitakse enne kui koodi kirjutatakse.
3. **Sisuhaldaja autonoomia** — ei vaja arendajat lehe muutmiseks.
4. **Arendaja autonoomia** — ei vaja sisuhaldajat raamistiku muutmiseks.
5. **Trade-off:** rohkem osi käia (Storyblok, Astro, deploy) vs. üks suur monoliit (WordPress).

**Aruteluküsimused:**
- Millal **ei** valiks headless'i? (väikesed projektid, kus admin on ka arendaja)
- Mis juhtub, kui CMS sulgub? (sisu on portable JSON, aga UI tuleb uuesti ehitada)
- Kuidas SEO sõbralik? (SSR/SSG vastutab Astro — vaata `output: 'server'` config'is)

---

## Lingid esitluses näitamiseks

- **Sait:** https://localhost:4322/
- **Storyblok:** https://app.storyblok.com/#/me/spaces/<SPACE_ID>
- **Figma:** Storyblock fail
- **Kood:** projekti juur (`src/storyblok/`, `src/layouts/`, `astro.config.mjs`)
- **Õpilogi:** [`docs/Kuidas-tegin.md`](Kuidas-tegin.md)

---

## Demo-checklist enne esitlust

- [ ] Dev server jookseb: `npm run dev`
- [ ] Storyblokis on sisu publish'itud (mitte ainult Draft)
- [ ] Brauseri tabid: localhost + Storyblok + Figma kõik avatud
- [ ] Slug `postitused` (mitte `blog`) on kasutuses
- [ ] Visual Editor preview URL = `https://localhost:4322/`
