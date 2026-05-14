# Storyblok schema seadistus (käsitsi, UI-s)

> See on **kontekstipõhine** juhend — eeldab, et sa läbisid **Developer Quickstart** raja ja sinu ruumis on juba blueprint'i komponendid: `page`, `grid`, `feature`, `teaser`. Astro pool on valmis ja ootab.

Pärast iga sammu saad kohe näha tulemust `https://localhost:4322/` peal. Astro renderdab tundmatud blokid kollase "Tundmatu blok" hoiatuskastina.

---

## 1. Kustuta blueprint'i mittevajalikud blokid

**Block Library** → kustuta:
- `grid` ❌
- `feature` ❌
- `teaser` ❌

`page` jätame alles — see on universaalne lehe wrapper, kasutame Avalehe jaoks.

---

## 2. Loo `article` (Content Type)

**Block Library → + New Block:**
- Name: `article`
- Type: ⦿ **Content Type** (mitte Nestable — see on KRIITILINE)

Lisa väljad:

| # | Field name | Type | Settings |
|---|------------|------|----------|
| 1 | `title` | Text | Required ✅ |
| 2 | `published_at` | Date/Time | |
| 3 | `cover_image` | Asset | Filetypes: images |
| 4 | `excerpt` | Textarea | Max length 200 |
| 5 | `body` | Richtext | Toolbar: paragraph, h2, h3, bold, italic, link, image, blockquote, list, code |
| 6 | `author_name` | Text | Default: `Toimetus` |

---

## 3. Loo Nestable blokid (6 tk)

Iga blok: **Block Library → + New Block** → Type: ⦿ **Nestable Block**

### 3.1 `header`
| Field | Type | Settings |
|-------|------|----------|
| `logo_text` | Text | Default: `Blog` |
| `nav_items` | Blocks | Allow only: `nav_link` |

### 3.2 `nav_link`
| Field | Type |
|-------|------|
| `label` | Text |
| `url` | Link |

### 3.3 `footer`
| Field | Type | Settings |
|-------|------|----------|
| `copyright` | Text | Default: `© 2026 Haapsalu Kolledž` |

### 3.4 `article_card`
| Field | Type | Settings |
|-------|------|----------|
| `article` | Single-Option | Source: **Stories**, Filter type: `article` |

### 3.5 `article_list`
| Field | Type | Settings |
|-------|------|----------|
| `articles` | Multi-Options | Source: **Stories**, Filter type: `article` (jäta tühjaks → näitab automaatselt kõiki) |

### 3.6 `rich_text`
| Field | Type |
|-------|------|
| `content` | Richtext |

> `article_header` ei vaja eraldi blokki — `Article.astro` ehitab selle otse `article` story väljadest.

---

## 4. Uuenda `home` story sisu

Blueprint lõi `home` story `page` content type'iga. Praegu sisaldab see `teaser` blokki, mida me kustutasime — pead asendama.

**Content → home:**

`body` (blocks) sisu, ülevalt alla:
1. **+ Add block** → `header`
   - logo_text: `Blog`
   - nav_items: 2 × `nav_link`
     - 1: label=`Avaleht`, url=`/`
     - 2: label=`Postitused`, url=`/blog`
2. **+ Add block** → `article_list` (`articles` tühi — siis tõmbab kõik `blog/` kaustast)
3. **+ Add block** → `footer`

**Publish** (mitte ainult Save — vaja published_at jaoks).

---

## 5. Loo `blog/` kaust + 3 näidisartiklit

1. **Content** → **+ Folder** → Name: `blog`, Slug: `blog`
   - **Default content type:** `article`
2. Sisene kausta `blog`, loo 3 lugu:
   - `blog/esimene-postitus`
   - `blog/teine-postitus`
   - `blog/kolmas-postitus`

Iga loo täida väljad (kasvõi paari sõnaga). Riputa kaanepilt (asset). **Publish.**

---

## 6. Visual Editor preview URL

**Settings → Visual Editor → Location (default):**
```
https://localhost:4322/
```

(See on HTTPS port, mille Astro dev server valis. Kui sul on `:4321` vaba, sealt tuleb tegelikult.)

URL pattern'id pole demos kohustuslikud — universaalne `[...slug].astro` route teeb õige asja, kui Visual Editor saadab `slug` kui story full_slug.

---

## 7. Kontroll

| Test | Oodatud tulemus |
|------|-----------------|
| Lae `https://localhost:4322/` | Header + 3 artikli kaarti gridis + Footer |
| Lae `https://localhost:4322/blog/esimene-postitus` | Artikli pealkiri + meta + kaanepilt + richtext sisu |
| Klõpsa Storyblokis Visual Editori avada `home` peal | Sait avaneb iframe'is. Kollast hoiatuskasti EI tohi enam olla. |

---

## 8. Sage tõrkeotsing

| Sümptom | Põhjus | Lahendus |
|---------|--------|----------|
| Kollane "Tundmatu blok: X" | Blokk eksisteerib Storyblokis aga puudub Astros | Lisa `src/storyblok/X.astro` + registreeri `astro.config.mjs` |
| 404 lehel `/blog/esimene-postitus` | Story on Save'itud, mitte Publish'itud | Vajuta **Publish** nupp (preview token näeb draft sisu, aga slug peab eksisteerima) |
| Cover image ei kuva | Storyblok asset URL format | Kasuta `cover_image.filename`, mitte `.url` (juba tehtud `ArticleCard.astro`-s) |
| ArticleList tühi | Storyblokis pole `blog/` kausta või lood pole `article` content type | Kontrolli kausta seadeid: Default content type peab olema `article` |
| Visual Editor "white screen" | Bridge ei laadinud | `bridge: true` astro.config.mjs's (juba seatud) |

---

**Kui kõik kolm punkti 7-st rohelised**, ütle siin. Liigume edasi: kaanepiltide üleslaadimine, või Figma → Storyblok plugini katsetus (kui tahad), või SSR build seadistus (Vercel/Netlify deploy).
