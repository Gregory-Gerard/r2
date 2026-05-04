<div align="center">
  <img src=".github/logo.png" alt="R2" width="96" height="96" />
  <h1>R2</h1>
  <p><em>Romane &amp; Rémy, a private wedding gallery.</em></p>
</div>

---

A static site that tells the story of one day through chapters of photos. Built as a small monorepo: a Vite app, a shared design system, and a photo pipeline that publishes to S3.

## Quick start

```bash
vp install              # install workspace deps
vp run @r2/website#dev  # run the website
vp run ready            # check, test, build everything
```

> Heads up: this repo uses [Vite+](https://viteplus.dev) (`vp`). Don't reach for `pnpm` / `npm` directly. Lint, format, bundle and test all flow through the VoidZero Rust toolchain: [Oxlint](https://oxc.rs/docs/guide/usage/linter) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) for code quality, [Vite](https://vite.dev)+[Rolldown](https://rolldown.rs) for bundling, [Vitest](https://vitest.dev) for tests.

## Monorepo structure

| Path           | What lives there                                                              |
| -------------- | ----------------------------------------------------------------------------- |
| `apps/website` | The public Vite app. Pages compose `@r2/ui` primitives, organized by feature. |
| `packages/ui`  | Design system. Tailwind v4 tokens, shadcn primitives, compound components.    |
| `tools/photos` | CLI that syncs `.photos/` to S3 and publishes a manifest. See its README.     |

## Photos pipeline

Drop originals into `.photos/<chapter>/<name>-<order>.jpg`. `vp run @r2/photos#sync` hashes each file (the hash is the photo's `id`), generates AVIF + WebP at 4 sizes plus a blurhash via sharp, uploads variants to immutable keys on S3, and writes a single `manifest.json`. A local cache skips unchanged files.

On the app side, a custom Vite plugin (`apps/website/plugins/r2-photos.ts`) fetches the manifest once when Vite starts (dev or build), strips the URLs (encoding 1MB+ of strings we can rebuild from `id` + size + format would be wasteful), and exposes everything as a virtual module `virtual:r2-photos`. The app reads photos synchronously, with zero runtime fetching of metadata.

```
.photos/<chapter>/<name>-<order>.jpg
        │
        ▼  vp run @r2/photos#sync
S3: photos/<id>/w{400,800,1600,2400}.{avif,webp}
S3: manifest.json
        │
        ▼  Vite plugin (dev + build)
virtual:r2-photos  →  photos, photoUrl(id, fmt, size), buildSrcSet(id, fmt)
```

Full walkthrough (cache invalidation, identity, source layout): [`tools/photos/README.md`](tools/photos/README.md).

## CI/CD

Two GitHub Actions workflows:

- **`ci.yml`** runs `vp run ready` (check + test + build) on every push and pull request.
- **`deploy.yml`** triggers on a published GitHub release (or manual dispatch), rebuilds, uploads the `apps/website/dist` artifact, then rsyncs it to the production host. Concurrency-guarded so two releases can't race.

To ship: publish a release on GitHub. To preview without releasing: run the Deploy workflow manually.

## Scripts

```bash
vp run ready                      # check + test + build everything
vp run -r build                   # build all workspaces
vp run @r2/website#preview        # preview the production build
vp run @r2/photos#sync --dry-run  # see what would sync, without uploading
```

---

<sub>Built with Vite+, pnpm, React 19, Tailwind v4 and sharp.</sub>
