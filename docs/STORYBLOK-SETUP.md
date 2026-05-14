# Storyblok space — ALTERNATIIVNE seadistamise juhend

> **⚠ See on alternatiivne rada — "Empty Space" lähenemine.** Demos kasutati tegelikult **"Developer Quickstart"** rada (mis on lihtsam ja kiirem). Vt põhirada: [`STORYBLOK-SCHEMA.md`](STORYBLOK-SCHEMA.md).
>
> See dokument on alles dokumenteerimise huvides — võimalik et keegi tahab käsitsi Empty Space rajale minna ja teha kõik nullist (näiteks kui pole võimalik kasutada Storybloki CLI-t).

---

## Eeldused

- Figma fail "Storyblock" on valmis (3 lehte: Tokens, Components, Pages — 6 komponenti)
- Sul on Astro projekt eraldi (Astro starter, mitte Storybloki blueprint)

---

## 1. Konto ja space

1. Registreeru / logi sisse: https://app.storyblok.com
2. **Create new space**
   - Name: `Haapsalu Blog Demo` (või muu)
   - Region: **EU (Frankfurt)**
   - Plan: **Community (Free)** — piisab demo jaoks
3. Pärast loomist: vali templateks **Empty Space** (tühi). Ära vali "Blog template" — me ehitame ise.

---

## 2. Põhiseaded

**Settings → General**
- Locale: `et` (Estonian) — või `en`. Üks keel piisab MVP-s.

**Settings → Visual Editor → Location (default):**
- `https://localhost:4322/` (Astro dev server HTTPS port; HTTP 4321 ei tööta mkcert sertifikaadi tõttu)

**Settings → Access Tokens:**
- Vajame **Preview** taseme tokenit (näeb draft + published)

---

## 3. Bloks / komponendid (kaks teed)

### Tee A — Figma plugin (teoreetiliselt soovitatav, kiirem)

1. Figma → **Resources → Plugins → "Figma to Storyblok"** ([Community link](https://www.figma.com/community/plugin/1506962248112177026/figma-to-storyblok))
2. Plugin → **Authenticate** Storyblokiga
3. Vali Space
4. Figma faili `Components` lehel → vali kõik 6 raami → **Sync to Storyblok**
5. Plugin loob 6 Nestable blokki Block Library's

> NB! Tegelikult selles demos plugin'i ei kasutatud — schema tehti käsitsi. Plugini käitumine võib olla ettearvamatu (nimed, väljatüübid).

### Tee B — käsitsi (kasutati selles demos)

Loo Block Library's iga blokk eraldi. Detailne juhend väljadega: [`STORYBLOK-SCHEMA.md`](STORYBLOK-SCHEMA.md) sammud 2-4.

---

## 4. Schema struktuur

**Content Types (3):**
- `article` — sisuüksus, 6 välja
- `page` — konteiner, üks väli `body` (Blocks)
- `config` — singleton, header + footer Blocks väljadega

**Nestable blokid (6):** `header`, `nav_link`, `footer`, `article_card`, `article_list`, `rich_text`.

Vt iga bloki täielikku spec'i: [`STORYBLOK-SCHEMA.md`](STORYBLOK-SCHEMA.md).

> ⚠ **KRIITILINE LÕKS** "Tee A" puhul: plugin teeb kõik **Nestable**-na. `article`, `page`, `config` peavad olema **Content Type**. Pead käsitsi muutma Block Library's iga oma blokki.

---

## 5. Esmane sisu

**Content:**
- Story `home` (content type `page`) — body sisaldab `article_list`
- Story `postitused` (content type `page`) — sama, eraldi URL nav linki jaoks
- Story `config` (content type `config`) — header + footer globaalsed
- Kaust `blog/` (default content type `article`) — sees 3 artikli story-t

Vt sammud: [`STORYBLOK-SCHEMA.md`](STORYBLOK-SCHEMA.md#5-uuenda-home-story-sisu).

---

## 6. Tokenid ja .env

**Settings → Access Tokens → + Generate new token:**
- Name: `astro-dev`
- Level: **Preview**
- Scope: kõik

Kopeeri token. Astro projektis:

```bash
cp .env.example .env
```

`.env`:
```bash
STORYBLOK_DELIVERY_API_TOKEN=<sinu Preview token>
STORYBLOK_REGION=eu
```

---

## 7. Kontroll-test

Vt täis tšeklisti: [`STORYBLOK-SCHEMA.md`](STORYBLOK-SCHEMA.md#9-kontroll-test).

URL-id, mida peab töötama: `/`, `/postitused/`, `/blog/<slug>`.

---

**Kui see on tehtud,** vt edasisi samme: Cloudflare deploy → [`Kuidas-tegin.md`](Kuidas-tegin.md#faas-10--cloudflare-workers-deploy-).
