<div align="center" style="display: flex; flex-direction: column; align-items: center;gap: 0rem">
  <a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/rzl-zone/next-kit/main/logo-circle.png">
    <img src="https://raw.githubusercontent.com/rzl-zone/next-kit/main/logo-circle.png" align="middle" alt="RzlZone Logo" width="110" style="max-width: 100%;" />
  </a>
</div>

<h1 align="center"><strong>Next KIT</strong></h1>

<p align="center"><i>Modern toolkit for scalable Next.js applications.</i></p>

<p align="center">
  <i>
    A flexible and extensible toolkit for building modern, type-safe fullstack applications with Next.js.
  </i><br/>
  <i>Provides reusable, type-safe utilities to speed up your development workflow and keep your codebase clean.</i><br/>
  <strong><i>Built with ❤️ by <a href="https://github.com/rzl-zone" target="_blank" rel="nofollow noreferrer noopener">@rzl-zone</a>.</i></strong>
</p>

<div align="center">
  <p>
    <a href="https://npmjs.com/package/@rzl-zone/next-kit" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/npm/v/@rzl-zone/next-kit?logo=npm&label=Latest%20Version&color=4CAF50&logoColor=CB3837&style=flat-rounded" alt="Latest Version on NPM" />
    </a>
    <a href="https://npmjs.com/package/@rzl-zone/next-kit" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/npm/dt/@rzl-zone/next-kit?logo=npm&label=Total%20Downloads&color=007EC6&logoColor=CB3837&style=flat-rounded" alt="NPM Total Downloads" />
    </a>
    <a href="https://npmjs.com/package/@rzl-zone/next-kit" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/npm/dw/@rzl-zone/next-kit?logo=npm&label=Weekly%20Downloads&color=CB3837&logoColor=CB3837&style=flat-rounded" alt="NPM Weekly Downloads" />
    </a>
    <a href="https://nodejs.org/en/" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/badge/Node.js-20.9.0%2B-green.svg?logo=node.js&color=339933&style=flat-rounded" alt="Node.js" />
    </a>
    <a href="https://github.com/rzl-zone/next-kit/blob/main/CONTRIBUTING.md" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?color=28A745" alt="PRs Welcome" />
    </a>
    <a href="https://github.com/rzl-zone/next-kit/blob/main/LICENSE.md" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg?color=3DA639" alt="GitHub license" />
    </a>
    <a href="https://github.com/rzl-zone/next-kit" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/badge/Repo-on%20GitHub-181717?logo=github" alt="GitHub" />
    </a>
    <a href="https://github.com/orgs/rzl-zone/repositories" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/badge/Org-rzl--zone-24292e?logo=github&style=flat-rounded" alt="Repo on GitHub" />
    </a>
  </p>
</div>

---

> ⚠️ ***This is a BETA Version release.***  
> APIs, naming, or file structures may still change before v1.0.0.

---

> Type-safe utilities, opinionated conventions, and clean abstractions — designed to make your Next.js projects faster, cleaner, and more maintainable.

<h2 id="features">✨ <strong>Features</strong></h2>

- ✅ Type-safe server actions with helpers.  
- 🚀 API response formatter for consistent client/server comms.  
- 🛠️ Utility functions for common patterns (progress-bar-loader, hoc, themes, etc.).  
- ⚙️ Designed for scalability and convention.  

---

<h2 id="installation">⚙️ <strong>Installation</strong></h2>

#### *With NPM*

```bash
npm install @rzl-zone/next-kit
```

#### *With Yarn*

```bash
yarn add @rzl-zone/next-kit
```

#### *With PNPM*

```bash
pnpm add @rzl-zone/next-kit
```

---

<h2 id="detailed-features">💎 <strong>Detailed Features</strong></h2>

### The full <a href="https://rzlzone.vercel.app/docs/next-kit" target="_blank" rel="nofollow noreferrer noopener">Next KIT</a> documentation is **currently under construction** 🏗️.

#### For now, explore the examples or dive into the source — all utilities are documented via **TSDoc** and typed properly.

  ```ts
  // Extras (e.g., getPathname, getSearchParams, etc.)
  import { /* … */ } from "@rzl-zone/next-kit/extra";
  import { /* … */ } from "@rzl-zone/next-kit/extra/action";
  import { /* … */ } from "@rzl-zone/next-kit/extra/context";
  import { /* … */ } from "@rzl-zone/next-kit/extra/pathname";

  // Higher-Order Components (HOC)
  import { /* … */ } from "@rzl-zone/next-kit/hoc";

  // Progress Bar Loader
  import { /* … */ } from "@rzl-zone/next-kit/progress-bar";

  // Themes Mode (dark, light, system)
  // (for App Directory)
  import { /* … */ } from "@rzl-zone/next-kit/themes";
  // (for Pages Directory)
  import { /* … */ } from "@rzl-zone/next-kit/themes/pages-dir";

  // General Utilities
  import { /* … */ } from "@rzl-zone/next-kit/utils";

  // Extra TypeScript Helpers
  import { /* … */ } from "@rzl-zone/next-kit/types";
  ```

  To enable the built-in progress bar styling, import the default CSS, this import can be placed in your layout.tsx or global stylesheet entry, for example:

  1. At layout.tsx:

      ```ts
      import "@rzl-zone/next-kit/progress-bar/default.css";
      ```

  2. At global stylesheet entry (e.g. globals.css):

      ```css
      @import "@rzl-zone/next-kit/progress-bar/default.css";
      ```

#### Place your cursor inside `{ }` or right after the package path `@rzl-zone/next-kit/<put-cursor-here>`, then press Ctrl+Space (Windows/Linux) or Cmd+Space (macOS), or use your editor’s autocomplete shortcut, to see all available functions and types with full TSDoc hints.

---

<h3 id="detailed-features--hint-autocomplete-setup">
  <strong>
    Hint: Autocomplete Setup (Step by Step).
  </strong>
</h3>

#### Make TypeScript & VSCode automatically provide autocomplete for `@rzl-zone/next-kit` without needing triple-slash references in every file, follow steps:

- 1️⃣ **Install @rzl-zone/next-kit.**

  - Make sure the package is installed:

      ```bash
      npm install @rzl-zone/next-kit@latest
      # or
      yarn add @rzl-zone/next-kit@latest
      # or
      pnpm add @rzl-zone/next-kit@latest
      ```

- 2️⃣ **Create a types folder.**

  - Inside your project root, make a folder called `types`:

      ```pgsql
      project-root/
        ├─ src/
        ├─ types/
        │  └─ index.d.ts
        ├─ tsconfig.json
        └─ jsconfig.json
      ```

- 3️⃣ **Add the global reference file.**

  - Create `types/index.d.ts` with this content:

      ```ts
      /// <reference types="@rzl-zone/next-kit" />
      ```

    - This tells TypeScript to include the types from `@rzl-zone/next-kit` globally.
    - You can add more references here if needed, for example:

      ```ts
      /// <reference types="@rzl-zone/next-kit" />

      // eg more references (if needed):
      /// <reference types="node" />
      /// <reference types="react" />
      ```

- 4️⃣ **Update tsconfig.json.**

  - Make sure not to override "types" (or leave it empty) so TypeScript automatically picks up your types folder:

      ```jsonc
      // tsconfig.json
      {
        "compilerOptions": { 
          "strict": true,
          "typeRoots": [
            "./types", 
            "./node_modules/@types"
          ],
          // other your config...
        },
        "include": [
          "src", 
          "types"
        ],
        // other your config...
      }
      ```

    - `typeRoots` tells TS where to look for global type definitions.
    - The `types` folder comes first, so your references override or add to the default `@types` packages.

- 5️⃣ **Update jsconfig.json (for JavaScript projects).**

  - If you also work with JS, do the same:

      ```jsonc
      // jsconfig.json
      {
        "compilerOptions": {
          "checkJs": true,  // Optional, enables type checking 
          "typeRoots": [
            "./types", 
            "./node_modules/@types"
          ],
          // other your config...
        },
        "include": [
          "src", 
          "types"
        ],
        // other your config...
      }
      ```

      >ℹ️ ***Tip:*** *For JS projects, consider adding `"checkJs": true` for better IntelliSense.*

#### **Now, all types from `@rzl-zone/next-kit` are globally available, and you don’t need `"types": ["@rzl-zone/next-kit"]` in tsconfig.json.**

---

<h2 id="type-safety-build-in">🧪 <strong>Type Safety Built In</strong></h2>

All core utilities are written in **TypeScript** with strong generics and inferred types — making your DX smooth and predictable.

---
<h2 id="sponsor-this-package">❤️ <strong>Sponsor this package</strong></h2>

**Help support development:**  
***[👉 **Become a sponsor**](https://github.com/sponsors/rzl-app).***

---

<h2 id="changelog">📝 <strong>Changelog</strong></h2>

**See [CHANGELOG](CHANGELOG.md).**

---

<h2 id="contributing">🤝 <strong>Contributing</strong></h2>

**See [CONTRIBUTING](CONTRIBUTING.md).**

---

<h2 id="security">🔒 <strong>Security</strong></h2>

**Please report issues to [rzlzone.dev@gmail.com](mailto:rzlzone.dev@gmail.com).**

---

<h2 id="recommended-stack">💡 <strong>Recommended Stack</strong></h2>

- ReactJS (18+).
- Next.js 14+ (App Router).
- TypeScript.
- Tailwind CSS (optional but recommended).

---

<h2 id="credits">🙌 <strong>Credits</strong></h2>

**- [Rzl App](https://github.com/rzl-app).**  
**- [All Contributors](https://github.com/rzl-zone/next-kit/graphs/contributors).**

---

<h2 id="license">📜 <strong>License</strong></h2>

**The MIT License (MIT).**  
*Please see **[License File](LICENSE.md)** for more information.*

---

✅ **Enjoy using `@rzl-zone/next-kit`?**  
*Star this repo [⭐](https://github.com/rzl-zone/next-kit) and share it with other JavaScript developers!*

---
