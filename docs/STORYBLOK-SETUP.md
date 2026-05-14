# Storyblok space — seadistamise juhend

Samm-sammuline tšekklist, mille läbides on sul valmis MVP blogi sisuhaldus, mis on kooskõlas meie Figma failiga ([`docs/PLAN.md`](PLAN.md)).

> Eeldus: Figma fail "Storyblock" on valmis (3 lehte: Tokens, Components, Pages — 6 komponenti). Kui pole, jookse esmalt see osa läbi.

---

## 1. Konto ja space

1. Registreeru / logi sisse: https://app.storyblok.com
2. **Create new space**
   - Name: `Haapsalu Blog Demo` (või muu)
   - Region: **EU (Frankfurt)** — peab vastama tokenile, vaikimisi EU sobib Eesti jaoks
   - Plan: **Community (Free)** — piisab demo jaoks (lubab 1 kasutaja, 25 000 API kõnet kuus)
3. Pärast loomist: vali templateks **Empty Space** (tühi). Ära vali "Blog template" — me ehitame ise.

---

## 2. Põhiseaded

**Settings → General**
- Locale: `et` (Estonian) — või `en`, kui demo on inglise keeles. Üks keel piisab MVP-s.

**Settings → Visual Editor**
- *Location (default):* `http://localhost:4321/` (Astro dev port)
- *Preview URLs:* lisa hiljem produktsiooni URL

**Settings → Access Tokens** (vt [punkt 7](#7-tokenid-ja-env))
- Märgi tegelased: peame kasutama **Preview** tokenit (näeb draft + published) Astro arenduses

---

## 3. Bloks / komponendid (kaks teed)

### Tee A — Figma plugin (soovitatav, kiirem)

1. Figma → **Resources → Plugins → "Figma to Storyblok"** ([Community link](https://www.figma.com/community/plugin/1506962248112177026/figma-to-storyblok))
2. Plugin → **Authenticate** Storyblokiga
3. Vali **Space:** `Haapsalu Blog Demo`
4. Figma faili `Components` lehel → vali kõik 6 raami (Header, Footer, ArticleCard, ArticleList, ArticleHeader, RichText) → **Sync to Storyblok**
5. Plugin loob:
   - 6 *Nestable* bloki Block Library's
   - Iga blokile pildi-eelvaate Asset Library's

### Tee B — käsitsi (kui plugin ei tööta)

Loo Block Library's iga blokk eraldi (Settings → Block Library → New Block).

---

## 4. Schema viimistlus (KRIITILINE samm pluginast)

**Plugin teeb kõik Nestable-na.** Article peab olema Content Type. Mine **Block Library**:

### 4.1 Loo `article` Content Type

> Plugin EI loo Content Type'i — Article on tervik artikli mudel, mitte komponent. Loo see käsitsi.

**Block Library → + New Block:**
- Name: `article`
- Type: ⦿ **Content Type** (mitte Nestable!)

Lisa väljad:

| Field name | Field type | Settings |
|------------|------------|----------|
| `title` | Text | Required: ✅ |
| `published_at` | Date/Time | |
| `cover_image` | Asset | Filetypes: `images` |
| `excerpt` | Textarea | Max length: 200 |
| `body` | Richtext | Allowed elements: paragraph, heading 2-3, bold, italic, link, image, blockquote, list, code |
| `author_name` | Text | Default: `Toimetus` |

### 4.2 Kohanda nestable blokid (pluginast tulnud)

| Blok | Field name | Field type |
|------|------------|------------|
| `header` | `logo_text` | Text |
| `header` | `nav_items` | Blocks (allow only `nav_link`) |
| `nav_link` | `label` | Text |
| `nav_link` | `url` | Link |
| `footer` | `copyright` | Text |
| `article_card` | `article` | Single-Option → Source: Stories → Filter type: `article` |
| `article_list` | `articles` | Multi-Options → Source: Stories → Filter type: `article` |
| `rich_text` | `content` | Richtext |
| `article_header` | (autoclaim — väljad tulevad `article` story'st viite kaudu) | — |

> `ArticleHeader` on tegelikult `article` story esitlusvaade — ei pea eraldi väljadega bloki olema, kasuta otse `article` Content Type'i.

---

## 5. Sisu — esialgsed story-d

Loo paar näidisartiklit, et oleks midagi näidata.

**Content → + Story:**

### Story 1: `home` (page)
- Type: kasutame `article_list` nestable bloki — aga vaja on Page wrapper
- LIHTSAM lähenemine: tee teine Content Type **`page`** ühe väljaga `body` (blocks). See annab vabaduse paigutada sinna `header`, `article_list`, `footer`.
- Sisu:
  ```
  body:
    - header (logo_text: "Blog", nav_items: [Avaleht, Postitused])
    - article_list (articles: [art-1, art-2, art-3])
    - footer (copyright: "© 2026 Haapsalu Kolledž")
  ```

### Story 2-4: 3 artiklit kausta `blog/`
Loo kaust **`blog`** (Content → New folder), default content type: `article`. Siis 3 lugu:
- `blog/esimene-postitus`
- `blog/teine-postitus`
- `blog/kolmas-postitus`

Iga artikkel: täida title, published_at, cover_image (lae üles ükskõik mis test-pilt), excerpt, body (paari lõikuga), author_name.

> **Slug** genereerib Storyblok automaatselt nime järgi. Eesti tähed asendatakse (ä→a jne).

---

## 6. Visual Editor seadistus

**Settings → Visual Editor → Preview URLs:**
- `http://localhost:4321/` — vaikimisi
- Selle juures lisa URL pattern:
  - Content Type `page` → `http://localhost:4321/{slug}`
  - Content Type `article` → `http://localhost:4321/{full_slug}` (kuna kaust `blog/` annab `blog/esimene-postitus`)

Kui Astro pole veel jooksmas, see ei tööta — aga seadeid saad ette panna.

---

## 7. Tokenid ja .env

**Settings → Access Tokens → + Generate new token:**
- Name: `astro-dev`
- Level: **Preview** (näeb draft + published)
- Scope: kõik

Kopeeri token. Astro projektis:

```bash
cp .env.example .env
```

`.env`:
```bash
STORYBLOK_DELIVERY_API_TOKEN=<kopeeritud preview token>
STORYBLOK_SPACE_ID=<Settings → General leheküljel ülaservas>
```

---

## 8. Kontrolli, et kõik on paigas

Tšekk-loend enne Astro liidestust:

- [ ] Space loodud, region EU
- [ ] 6 nestable blokki + 1 content type (`article`) + 1 content type (`page`) Block Library's
- [ ] `article` väljad: title, published_at, cover_image, excerpt, body (richtext), author_name
- [ ] 3 näidisartiklit kaustas `blog/`
- [ ] 1 home story (`page` content type)
- [ ] Preview token loodud ja `.env` failis

---

## 9. Levinumad lõksud

| Probleem | Põhjus | Lahendus |
|----------|--------|----------|
| Plugin tegi kõik Nestable-ks | Vaikekäitumine | Vt [4.1](#41-loo-article-content-type) — `article` käsi käsitsi |
| Slug on `Esimene-postitus` (suurtähtedega) | Storyblok võtab nime põhjal | Muuda käsitsi → `esimene-postitus` |
| Cover image ei kuva Astros | Storyblok asset URL on `https://a.storyblok.com/...` | Kasuta täis-URLi `blok.cover_image.filename`, mitte `.url` |
| Visual Editor "white screen" | Bridge skript pole laetud või CORS | Astros peab olema `bridge: true` ja iframe lubatud |
| `published_at` ei tule API vastusesse | Väli on tühi | Storyblokis story → täida väli ja vajuta **Publish** (mitte ainult Save) |

---

**Kui see on tehtud,** ütle siin chatis ja liigume edasi Astro projekti scaffolding'uga (`npm create astro@latest .` + `@storyblok/astro` integratsioon).
