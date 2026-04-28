<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`. For example, if you have a custom `dev` script that runs multiple services concurrently, run it with `vp run dev`, not `vp dev` (which always starts Vite's dev server).
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## CI Integration

For GitHub Actions, consider using [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) to replace separate `actions/setup-node`, package-manager setup, cache, and install steps with a single action.

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
    cache: true
- run: vp check
- run: vp test
```

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->

## Project Conventions

- **Don't run the dev server.** A dev server is already running alongside in another terminal. Don't launch `vp dev` / `pnpm dev` to test changes; rely on `vp check` / `tsc` / dev server logs the user shares.

## Code & Architecture Conventions (React / TypeScript)

### File & folder naming

- **kebab-case everywhere.** Files and folders, no exception: `user-card.tsx`, `use-auth.ts`, `format-date.ts`, `api-client/`. No `PascalCase.tsx`, no `camelCase.ts`, no `snake_case`.
- One main export per file. The filename matches the export in kebab-case (`UserCard` lives in `user-card.tsx`).

### Test colocation

- Tests live next to the code they test: `user-card.tsx` + `user-card.test.tsx` in the same folder.
- No separate `__tests__/` or `tests/` directories.
- Same rule for `.spec.ts`, `.stories.tsx`, etc. Colocate.

### Exports

- **Named exports only.** No `export default`, ever, including for React components, pages, and route modules.
- If a framework requires a default export at a specific entry point (e.g. some router conventions), do the named export and re-export as default at the very last line: `export default MyComponent;`. Keep it to that single line.

### Imports

- Use `import type { ... }` for type-only imports. Keep type and value imports separate.
- Prefer path aliases (`@/...`) over long relative chains (`../../../`). Single-level relatives (`./foo`) are fine.
- No barrel `index.ts` files unless there's a real reason (public package boundary). They hurt tree-shaking and tooling perf.

### React components

- Function components as `const`, typed via props type:

  ```tsx
  type UserCardProps = { user: User; onSelect?: (id: string) => void };

  export const UserCard = ({ user, onSelect }: UserCardProps) => { ... };
  ```

- No `React.FC` / `React.FunctionComponent`.
- Props as `type`, not `interface`, unless you genuinely need declaration merging or `extends`.
- Hooks files start with `use-`: `use-auth.ts`, `use-debounced-value.ts`.

### TypeScript

- `strict: true` assumed. No `any`; use `unknown` and narrow.
- No non-null assertions (`!`) unless the invariant is obvious and commented in one line.
- Prefer `type` aliases over `interface` for domain types; keep `interface` for object shapes meant to be extended/merged.

### Project structure

- Group by feature, not by type. `features/auth/` containing components, hooks, server logic, tests, beats `components/`, `hooks/`, `services/` split across the repo.
- Shared primitives go in `packages/` (workspace) or `src/shared/` (single app).
