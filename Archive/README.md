# Archive — previous portfolio site

This folder holds the previous version of shuoyuewu.com, kept online at:

- https://shuoyuewu.com/old/CN — Chinese
- https://shuoyuewu.com/old/ENG — English

It is a Vite + React + TypeScript app. The Vite `base` is `/old/`, and the first
path segment after that (`CN` / `ENG`) selects the language. Old-style
`?lang=CN` / `?lang=EN` links still work and are rewritten to the path form.

## Develop

```bash
npm install
npm run dev
```

Then open http://localhost:5173/old/CN/ (Vite serves under the `/old/` base).

## Build

```bash
npm run build
```

`dist/` contains the site ready to be served at `/old/`. `scripts/postbuild.mjs`
pre-generates `CN/`, `ENG/` and their sub-routes so the static host serves them
as real paths, plus a `404.html` SPA fallback.

Deployment is handled by the repository-level GitHub Pages workflow in
`../.github/workflows/deploy.yml`, which places this build under `/old/`.
