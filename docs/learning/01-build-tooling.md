# Build Tooling: Vite, TypeScript Config & the @theme System

> Part of the `docs/learning/` reference series for the Casey Quinn portfolio frontend.

---

## What Problem Does Vite Solve?

Browsers can't run TypeScript or JSX natively. Vite's job is to **transform** your
source code into plain JavaScript and CSS that a browser understands.

Think of it like Maven on the backend — Maven compiles Java, manages dependencies,
and packages your JAR. Vite does the equivalent for frontend code.

Vite operates in two modes:

- **Dev mode** (`npm run dev`): Runs a local server on port 3000. When you save a file,
  Vite hot-reloads just the changed module in the browser — no full page refresh needed.
- **Build mode** (`npm run build`): Bundles everything into optimized static files
  (HTML, CSS, JS) in the `dist/` folder, ready for deployment.

---

## vite.config.ts — Line by Line

```ts
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
})
```

### `defineConfig()`

A function that takes a config object and **returns it unchanged**. Its only purpose is
to give TypeScript autocomplete and type-checking while you write the config. Without it,
`export default { ... }` would work identically — you'd just lose editor hints about
which properties are valid.

### `plugins: [react(), tailwindcss()]`

Vite plugins are conceptually similar to Maven plugins — they hook into the build
pipeline and transform specific file types.

- **`react()`** — Teaches Vite how to transform JSX (the HTML-looking syntax in `.tsx`
  files) into `React.createElement()` calls that the browser can execute.
- **`tailwindcss()`** — Hooks into Vite's CSS pipeline so that when your CSS file uses
  `@import "tailwindcss"`, Tailwind's utility classes get compiled into real CSS.

### `resolve.alias` — How the `@` Path Works

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
},
```

This lets you write:
```ts
import { env } from '@/config';
```
instead of fragile relative paths like:
```ts
import { env } from '../../config';
```

**How it works under the hood:**

1. `__dirname` is a Node.js global that holds the absolute path of the directory
   containing the current file. Since `vite.config.ts` is at the project root,
   `__dirname` might be something like `/home/casey/personal-website-frontend`.

2. `path.resolve()` is a Node.js function that joins path segments into an absolute
   path. It works left-to-right, resolving each segment:
   ```
   path.resolve('/home/casey/personal-website-frontend', 'src')
   → '/home/casey/personal-website-frontend/src'
   ```

3. The alias mapping tells Vite: "whenever you see an import starting with `@/`,
   replace `@` with this absolute path to `src/`."

4. So at build time, `@/config` becomes
   `/home/casey/personal-website-frontend/src/config`.

**Why `path.resolve()` instead of string concatenation?**

`path.resolve()` handles OS differences (forward slashes on Mac/Linux, backslashes on
Windows) and normalizes things like `..` segments. It's the safe way to build file paths
in Node.js.

### `server.port: 3000`

During development, Vite runs a local web server. This sets it to port 3000 instead
of the default 5173. When you run `npm run dev`, your site is at `http://localhost:3000`.

---

## The Two TypeScript Configs

### Why Two?

Your project has code that runs in **two different environments**:

| File | Runs in | Has access to |
|------|---------|---------------|
| Everything in `src/` | **Browser** | `document`, `window`, `fetch`, DOM APIs |
| `vite.config.ts` | **Node.js** (your machine) | `path`, `__dirname`, file system |

TypeScript needs to know which APIs are available in each context. A single config
can't do both — if it included DOM types, TypeScript would let you use `document` in
your Vite config (which would crash). If it excluded DOM types, you couldn't reference
the browser's `window` in your React components.

### tsconfig.json — The Root (does nothing itself)

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

This compiles zero files. It just points to the two sub-configs. This is called
"project references" — it tells the TypeScript compiler there are two separate
compilation contexts.

### tsconfig.app.json — Browser Code

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "target": "ES2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["vite/client"],
    "strict": true,
    "noEmit": true,
    ...
  },
  "include": ["src"]
}
```

Key properties:

- **`lib: ["ES2023", "DOM", "DOM.Iterable"]`** — The `DOM` entry gives TypeScript
  knowledge of browser APIs like `document`, `window`, `HTMLElement`. Without it,
  `document.getElementById('root')` would be a type error.

- **`jsx: "react-jsx"`** — Tells TypeScript that `<div>` in a `.tsx` file is valid
  syntax and should be compiled as React.

- **`paths: { "@/*": ["src/*"] }`** — The TypeScript side of the `@` alias. Vite
  handles the actual path rewriting at build time, but TypeScript needs this too so
  it can type-check your imports. **These must stay in sync with `vite.config.ts`.**

- **`noEmit: true`** — TypeScript only checks types, it doesn't output any files.
  Vite handles the actual compilation. TypeScript is purely a linter here.

- **`strict: true`** — Enables all strict type-checking flags. This is the equivalent
  of running your backend with `-Werror` — it catches more bugs at compile time.

- **`types: ["vite/client"]`** — Gives TypeScript knowledge of Vite-specific features
  like `import.meta.env.VITE_API_BASE_URL`.

### tsconfig.node.json — Build Tool Code

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true,
    ...
  },
  "include": ["vite.config.ts"]
}
```

Key differences from the app config:

- **No `"DOM"` in `lib`** — This code runs in Node.js, not a browser.
  There is no `document` or `window` available.
- **`types: ["node"]`** — Gives TypeScript knowledge of Node.js APIs like
  `path.resolve()`, `__dirname`, and `process.env`.
- **`include: ["vite.config.ts"]`** — Only applies to the Vite config file.

---

## The @theme System in index.css

```css
@import "tailwindcss";

@theme {
  --font-headline: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;

  --color-surface: #0e0e0e;
  --color-primary: #a3a6ff;
  --color-on-surface: #ffffff;
  --color-on-surface-variant: #adaaaa;
  /* ... more tokens ... */
}
```

### `@import "tailwindcss"`

This isn't importing a regular CSS file. The Tailwind Vite plugin **intercepts** this
directive and injects Tailwind's entire utility class system. After this line processes,
generic classes like `bg-red-500`, `text-white`, `flex`, `p-4` all exist.

### `@theme { ... }` — Registering Design Tokens

This is Tailwind v4's way of defining custom design tokens. Each CSS custom property
does **two things simultaneously**:

1. **Creates a CSS variable** you could use anywhere: `color: var(--color-primary)`
2. **Registers with Tailwind** so utility classes are auto-generated.

When you write `--color-primary: #a3a6ff`, Tailwind automatically creates:
- `bg-primary` (background color)
- `text-primary` (text color)
- `border-primary` (border color)
- `ring-primary` (focus ring)
- ...and every other color-related utility.

This is why `text-on-surface-variant` works in your components — because
`--color-on-surface-variant: #adaaaa` is defined in your `@theme` block.
**If you removed that line, the class would break.**

### The Naming Convention

The `surface`, `on-surface`, `primary`, `on-primary` naming comes from Material
Design's color system:

- **`surface`** = a background color (the surface itself)
- **`on-surface`** = the text/icon color to use **on top of** that surface
- **`primary`** = the main accent color
- **`on-primary`** = text color that's readable against `primary`

So `on-primary` (#0f00a4, dark blue) is specifically chosen to be legible when placed
on top of `primary` (#a3a6ff, light indigo). They're paired together by design.

### Font Registration

```css
--font-headline: "Space Grotesk", sans-serif;
--font-body: "Inter", sans-serif;
```

Same principle — these register with Tailwind and create:
- `font-headline` → applies Space Grotesk
- `font-body` → applies Inter

---

## How It All Connects

```
vite.config.ts          →  Vite knows how to build the project
  plugins: [react()]    →  JSX gets compiled to JavaScript
  plugins: [tailwind()] →  @theme tokens become utility classes
  alias: '@' → 'src/'  →  Clean import paths at build time

tsconfig.app.json       →  TypeScript checks browser code
  paths: '@/*'          →  TypeScript understands @ imports
  lib: ["DOM"]          →  TypeScript knows about browser APIs
  jsx: "react-jsx"      →  TypeScript allows <div> syntax

tsconfig.node.json      →  TypeScript checks build config
  types: ["node"]       →  TypeScript knows about path.resolve

index.css               →  Design system tokens
  @import "tailwindcss" →  Base utility classes exist
  @theme { ... }        →  Custom tokens → custom utility classes
```

---

## Key Takeaways

1. **Vite transforms your code for the browser** — TypeScript → JavaScript, JSX →
   createElement calls, @theme tokens → real CSS.
2. **Two TypeScript configs exist because browser ≠ Node.js** — they're different
   runtimes with different available APIs.
3. **The @ alias is defined in two places** that must stay in sync:
   `vite.config.ts` (for build-time resolution) and `tsconfig.app.json` (for
   type-checking).
4. **`@theme` is where design tokens become Tailwind utility classes** — each
   `--color-*` variable auto-generates `bg-*`, `text-*`, `border-*`, etc.