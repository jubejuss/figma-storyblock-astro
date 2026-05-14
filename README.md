# Sisuhaldus — Figma → Storyblok → Astro

Õppedemo Haapsalu Kolledži sisuhaldussüsteemide kursusele.

## Live

- **Avalik sait:** https://figma-storyblock-astro.jubejuss.workers.dev/
- **Repo:** https://github.com/jubejuss/figma-storyblock-astro

## Mida demo näitab

Headless CMS terviktöövoog ühe blogi MVP näitel:
1. **Figma** — disain + komponentide määratlus + design tokens (Variables)
2. **Storyblok** — sisuhaldus, Visual Editor, schema-driven content
3. **Astro 6** — frontend SSR, mis tarbib Storybloki Content Delivery API-d
4. **Cloudflare Workers** — pilve-deploy (tasuta tier)

## Skoop (MVP)

- **3 URL'i:** `/` (home), `/postitused/` (article list), `/blog/<slug>` (üksikartikkel)
- **3 Storybloki content type'i:** `article`, `page`, `config` (singleton)
- **6 nestable blokki:** `header`, `nav_link`, `footer`, `article_card`, `article_list`, `rich_text`
- **9 Astro komponenti:** Page, Article, Header, Footer, ArticleCard, ArticleList, ArticleHeader, RichText, Config + Fallback
- **~20 design tokenit:** plain CSS muutujad (mitte Tailwind), sünk Figma `Tokens` lehega

## Dokumentatsioon

- **Õpilogi (kuidas tegelikult tehti, koos lõksudega):** [`docs/Kuidas-tegin.md`](docs/Kuidas-tegin.md) — 10 faasi + 18 lõksu
- **Esitluse kokkuvõte (õppetundi näitamiseks):** [`docs/Esitlus.md`](docs/Esitlus.md)
- **Storyblok schema seadistus:** [`docs/STORYBLOK-SCHEMA.md`](docs/STORYBLOK-SCHEMA.md)
- **Tehniline struktuuri spec:** [`docs/PLAN.md`](docs/PLAN.md)
- **Storyblok space loomine (alternatiivne rada):** [`docs/STORYBLOK-SETUP.md`](docs/STORYBLOK-SETUP.md)

## Detailne juhend Claude'ile

[`CLAUDE.md`](CLAUDE.md) sisaldab projekti seadistust, töövoo reegleid ja levinumate lõksude nimekirja.

## Käivitamine lokaalselt (õpilastele)

```bash
git clone https://github.com/jubejuss/figma-storyblock-astro.git
cd figma-storyblock-astro
cp .env.example .env
# Ava .env, täida STORYBLOK_DELIVERY_API_TOKEN ja STORYBLOK_REGION
npm install
npm run dev
# Ava https://localhost:4322/ (HTTPS, esimesel külastusel "Accept self-signed cert")
```

**Tähtis:** iga õpilane teeb oma Storybloki konto + space ja kasutab oma Preview API tokenit. Schema seadistus on samm-sammult `docs/STORYBLOK-SCHEMA.md`-s.

## Cloud deploy (Cloudflare Workers — tasuta)

```bash
npx wrangler login              # avab brauseri Cloudflare auth'iks
npx wrangler deploy             # küsib subdomain valikut
npx wrangler secret put STORYBLOK_DELIVERY_API_TOKEN   # paste token
npx wrangler secret put STORYBLOK_REGION               # sisesta: eu
```

Vt detaile + 5 levinud lõksu: [`docs/Kuidas-tegin.md`](docs/Kuidas-tegin.md) Faas 10.
