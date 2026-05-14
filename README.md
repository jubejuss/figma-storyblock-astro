# Sisuhaldus — Figma → Storyblok → Astro

Õppedemo Haapsalu Kolledži sisuhaldussüsteemide kursusele.

## Mida demo näitab

Headless CMS terviktöövoog ühe blogi MVP näitel:
1. **Figma** — disain ja komponentide määratlus
2. **Storyblok Figma plugin** — komponentide skeemi automaatne genereerimine
3. **Storyblok** — sisuhaldus, Visual Editor
4. **Astro 6** — frontend, mis tarbib Storybloki Content Delivery API-d

## Skoop (MVP)

- 2 lehte: blog index (=esileht), article page `/blog/[...slug]`
- 1 content type (`article`) + ~5 nestable bloki
- 6 Figma komponenti
- ~20 design tokenit

- **Õpilogi (kuidas tegelikult tehti, koos lõksudega):** [`docs/Kuidas-tegin.md`](docs/Kuidas-tegin.md)
- **Esitluse kokkuvõte (õppetundi näitamiseks):** [`docs/Esitlus.md`](docs/Esitlus.md)
- Tehniline struktuuri spec: [`docs/PLAN.md`](docs/PLAN.md)
- Storyblok schema seadistus: [`docs/STORYBLOK-SCHEMA.md`](docs/STORYBLOK-SCHEMA.md)

## Detailne juhend Claude'ile

[`CLAUDE.md`](CLAUDE.md) sisaldab projekti seadistust, töövoo reegleid ja levinumate lõksude nimekirja.

## Käivitamine (kui Astro projekt scaffolditud)

```bash
cp .env.example .env  # ja täida tokenid
npm install
npm run dev
```
