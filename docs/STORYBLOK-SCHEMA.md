# Storyblok schema seadistus (käsitsi, UI-s)

> **Kontekst:** sa läbisid **Developer Quickstart** raja (Storybloki Create new space → Developer mode → `npx storyblok create` Astro starter'iga). Sinu ruumis on juba blueprint'i komponendid: `page`, `grid`, `feature`, `teaser` ja üks story `home`. Astro pool on valmis ja ootab.

**Tulemus pärast kõiki samme:** kolm content type'i (`article`, `page`, `config`), kuus nestable blokki, neli story-t (`home`, `postitused`, `config`, kolm artiklit kaustas `blog/`).

Pärast iga sammu saad värskendada `https://localhost:4322/` (HTTPS, port 4322). Astro renderdab tundmatud blokid kollase **"Tundmatu blok"** hoiatuskastina — see on Fallback komponent, mis aitab debug'ida.

---

## 1. Kustuta blueprint'i mittevajalikud blokid

**Block Library** → kustuta:
- `grid` ❌
- `feature` ❌
- `teaser` ❌

`page` **jätame alles** — see on universaalne lehe wrapper. Aga vaata punkt 2 hoiatust!

---

## 2. ⚠ KRIITILINE HOIATUS — `article` loomine

**Kõige sagedasem viga selles juhendis:** kogemata muudetakse `page` content type'i skeemi, kui mõeldakse hoopis uut `article` blokki teha.

> **Block Library kuvab `page` listis.** Kui klõpsad sellel real, AVAD `page` skeema redaktori. Kui SEAL lisad uusi välju, oled rikkunud `page` content type'i.

### Õige tee: + New Block nupp

1. Mine **Block Library**
2. **PAREMAS ÜLANURGAS** otsi nuppu **+ New Block** ("Create Folder" kõrval)
3. Kui ei näe — laienda brauseri akna laiusi, nupp võib olla paremalt välja jäänud
4. Klõpsa **+ New Block**

Avaneb modal:
- Name: `article`
- Type: ⦿ **Content Type** (mitte Nestable!)

Vajuta Add.

### Lisa 6 välja

| # | Field name | Type | Settings |
|---|------------|------|----------|
| 1 | `title` | Text | Required ✅ |
| 2 | `published_at` | Date/Time | |
| 3 | `cover_image` | Asset | Filetypes: images |
| 4 | `excerpt` | Textarea | Max length 200 |
| 5 | `body` | Richtext | Toolbar: paragraph, h2, h3, bold, italic, link, image, blockquote, list, code |
| 6 | `author_name` | Text | Default: `Toimetus` |

Lõpus **Save & Back**.

### Kui kogemata muutsid `page` skeemat

Sümptom: kui hiljem avad **Content → home**, näed paremal palju article-välju (Title, Published At, Cover Image, Excerpt, Body Richtext, Author Name) — aga peaksid nägema ainult `Body` (Blocks) välja.

**Parandus:**
1. Mine **Block Library → page → Schema** vahekaardile
2. Kustuta KÕIK olemasolevad väljad
3. Lisa **üks** uus väli: `body`, type = **Blocks** (mitte Richtext!)
4. Save

Pärast peaks `home` story redaktor näitama ainult **Body** välja `+ Add Block` nupuga.

---

## 3. Loo 6 Nestable blokki

Iga blok: **Block Library → + New Block** → Type: ⦿ **Nestable Block** → name → Add → lisa väljad.

Soovitatud järjekord (`header` viitab `nav_link`-ile, seega tee see esimesena):

### 3.1 `nav_link`
| Field | Type |
|-------|------|
| `label` | Text |
| `url` | Link |

### 3.2 `header`
| Field | Type | Settings |
|-------|------|----------|
| `logo_text` | Text | Default: `Blog` |
| `nav_items` | **Blocks** | Restrict block types → ainult `nav_link` |

### 3.3 `footer`
| Field | Type | Settings |
|-------|------|----------|
| `copyright` | Text | Default: `© 2026 Haapsalu Kolledž` |

### 3.4 `article_card`
| Field | Type | Settings |
|-------|------|----------|
| `article` | **Single-Option** | Source: Stories, Filter by content type: `article` |

### 3.5 `article_list`
| Field | Type | Settings |
|-------|------|----------|
| `articles` | **Multi-Options** | Source: Stories, Filter by content type: `article` (jäta lugudes tühjaks → Astro tõmbab automaatselt kõik `blog/` kausta artiklid) |

### 3.6 `rich_text`
| Field | Type |
|-------|------|
| `content` | Richtext |

---

## 4. Loo `config` content type ja singleton story

Selle abil saame globaalse header + footer'i, mis kuvatakse iga lehe peal (mitte ainult `home` peal).

### 4.1 Content type

**Block Library → + New Block:**
- Name: `config`
- Type: ⦿ **Content Type**

Väljad:

| Field | Type | Settings |
|-------|------|----------|
| `header` | **Blocks** | Restrict: ainult `header` |
| `footer` | **Blocks** | Restrict: ainult `footer` |

Save.

### 4.2 Loo config story

**Content → + New → Story** (root tasemel, **mitte** kausta sees):
- Name: `Config`
- Slug: `config`
- Content type: `config`

Avaneb redaktor 2 väljaga.

**`header` Blocks väljal** → **+ Add Block** → vali `header`:
- `logo_text`: `Blog`
- `nav_items` → **+ Add nav_link** kaks korda:
  - 1: `label` = `Avaleht`, `url` Link tüüp = `Internal Stories`, vali story `Home` (või kirjuta käsitsi `/`)
  - 2: `label` = `Postitused`, `url` = `/postitused/` (vt allpool — selle URL loome punktis 6)

> ⚠ **Lõks:** Internal Link rippmenüü kuvab kaustad (nt `Blog`) loendis, AGA kaustal pole oma URL'i — klikkimine sellel ei tööta. Vajadusel vaheta link tüüp **URL** (kettlüli ikoon dropdown'is) ja sisesta käsitsi `/postitused/`.

**`footer` Blocks väljal** → **+ Add Block** → vali `footer`:
- `copyright`: `© 2026 Haapsalu Kolledž`

**Publish.**

---

## 5. Uuenda `home` story sisu

Blueprint lõi `home` story `page` content type'iga. Praegu sisaldab see `teaser` blokki, mille me Sammu 1-s kustutasime.

**Content → home:**

1. Kustuta kõik vanad blokid (`teaser`, `grid` jne — kuvatakse punase hoiatusena "Unknown component")
2. **+ Add Block** → vali `article_list`
   - `articles`: **jäta tühjaks** → Astro tõmbab automaatselt `blog/` kausta
3. **NB! ÄRA lisa header/footer** siia. Need tulevad `config` story-st, Layout.astro renderdab need automaatselt.

### Preview URL — paranda port

Samal lehel kerige alla **"Setup Visual Editor"** sektsioonini:
- Muuda **Preview URL**: `https://localhost:3000/` → **`https://localhost:4322/`** (HTTPS, port 4322 — Astro dev server valis selle, kuna 4321 oli kasutuses)
- **Save URL**

**Publish** kogu home story.

---

## 6. Loo `/postitused/` story (eraldi blog index)

Probleem: `/blog/` URL ei tööta, sest Storybloki **kaust** `blog/` pole iseseisev story.

**Content → + New → Story** (ROOT tasemel, **mitte** kausta sees):
- Name: `Postitused`
- Slug: `postitused` (NB! mitte `blog` — see konflikt kausta nimega ja Storyblok keeldub)
- Content type: `page`

Body Blocks → **+ Add Block** → vali `article_list` (jäta `articles` tühjaks).

**Publish.**

Pärast seda saad URL'i **https://localhost:4322/postitused/** — sama vaade kui esileht, aga eraldi URL nav linki jaoks.

---

## 7. Loo `blog/` kaust + 3 näidisartiklit

### 7.1 Kaust

**Content → + Folder** (root tasemel):
- Name: `Blog`
- Slug: `blog` (auto)
- **Default content type: `article`** ← ⚠ KRIITILINE (UI ei sunni seda)

### 7.2 Artiklid

Sisene loodud `blog` kausta → **+ New → Story** kolm korda:
- `Esimene postitus` (slug auto = `esimene-postitus`)
- `Teine postitus`
- `Kolmas postitus`

Iga artikli puhul täida 6 välja:
- `title` — pealkiri
- `published_at` — kuupäev
- `cover_image` — **+ Add Asset** → upload pilt (nt [picsum.photos/800/450](https://picsum.photos/800/450))
- `excerpt` — paari sõnaga kokkuvõte
- `body` (richtext) — paar lõiku näidet (proovi h2 ja blockquote ka)
- `author_name` — `Toimetus` või su nimi

Iga artikkel: **Publish** (mitte ainult Save Draft).

> ⚠ Slug auto-genereeritakse nime põhjal. Kontrolli — kui sinu sisestus oli ä/ö/õ-ga, võib Storyblok asendada vale. Vajadusel Configure → Slug → muuda käsitsi.

---

## 8. Storyblok → Astro Live Preview seadistus

**Settings → Visual Editor → Preview URLs:**
- `https://localhost:4322/` (arendus)
- (Hiljem kui deploy'ti Cloudflare'i:) `https://figma-storyblock-astro.<sinu-subdomain>.workers.dev/`

URL pattern'id pole demos kohustuslikud — universaalne `[...slug].astro` route teeb õige asja, kui Visual Editor saadab `slug` kui story full_slug.

---

## 9. Kontroll-test

Käi need URL'id läbi brauseris:

| URL | Oodatud tulemus |
|-----|-----------------|
| `https://localhost:4322/` | Header (config) + 3 ArticleCard'i (`article_list` automaatne) + Footer (config) |
| `https://localhost:4322/postitused/` | Sama vaade, eraldi URL |
| `https://localhost:4322/blog/esimene-postitus` | Header + artikli pealkiri + meta + kaanepilt + richtext + Footer |
| Storyblokis: ava `home` Visual Editor | Sait iframe'is. **Kollast hoiatuskasti EI tohi olla.** |

---

## 10. Sage tõrkeotsing

| Sümptom | Põhjus | Lahendus |
|---------|--------|----------|
| Kollane "Tundmatu blok: X" | Blokk Storyblokis aga puudub Astros | Lisa `src/storyblok/X.astro` + registreeri `astro.config.mjs` |
| `home` story näitab article-välju, mitte Body Blocks | Skeem rikutud (vt Sammu 2 hoiatus) | Block Library → page → Schema → kustuta kõik, lisa `body` Blocks |
| 404 lehel `/blog/<slug>` | Story on Save'itud, mitte Publish'itud | Vajuta **Publish** |
| `/blog/` annab "Story not found" | Kaust pole iseseisev story | Loo `postitused` page story (Samm 6) |
| Cover image ei kuva | Astro proovib lugeda valet välja | Kasuta `cover_image.filename`, mitte `.url` (juba tehtud `ArticleCard.astro`-s) |
| ArticleList tühi | Storyblokis pole `blog/` kausta või lood pole `article` | Kontrolli kausta seadeid: Default content type = `article` |
| Visual Editor "white screen" | Bridge ei laadinud | `bridge: true` `astro.config.mjs`-is (juba seatud) |
| Nav linki URL `/home` või `//blog/` | Algses koodis oli naivne `/` prefiks | Vt `Header.astro` `resolveLink()` funktsiooni (juba parandatud) |
| Internal Link ei luba kausta valida | Folder pole story | Vaheta link tüüp **URL**-iks, sisesta käsitsi `/postitused/` |

---

**Kui kõik 4 punkti 9-st (kontroll-test) on rohelised**, oled valmis. Vt edasisi samme [`Kuidas-tegin.md`](Kuidas-tegin.md) Faasidest 10 (Cloudflare deploy) edasi.
