<div align="center">
  <h1><strong>🧩 <code>@rzl-zone/next-kit</code> 🚀</strong></h1>
</div>

<p align="center">
  <strong>Rzl Next Kit</strong><br/>
  A flexible and extensible toolkit for building fullstack applications with Next.js.<br/>
  Provides reusable, type-safe utilities to speed up your development workflow and keep your codebase clean.<br/>
  <strong>Crafted with care by <a href="https://github.com/rzl-app">@rzl-app</a></strong>
</p>

<div align="center">
  <a href="https://npmjs.com/package/@rzl-zone/next-kit">
    <img src="https://img.shields.io/npm/v/@rzl-zone/next-kit?color=blue&style=flat-rounded" alt="Latest Version on NPM" />
  </a>
  <a href="https://npmjs.com/package/@rzl-zone/next-kit">
    <img src="https://img.shields.io/npm/dt/@rzl-zone/next-kit?style=flat-rounded" alt="Downloads" />
  </a>
  <a href="https://nodejs.org/en/">
    <img src="https://img.shields.io/badge/node-%3E%3D18.18.0-blue.svg?logo=node.js&style=flat-rounded" alt="Node Version" />
  </a>
  <a href="https://github.com/rzl-zone/next-kit/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  </a>
  <a href="https://github.com/rzl-zone/next-kit/blob/main/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
  </a>
  <a href="https://github.com/rzl-zone/next-kit">
    <img src="https://img.shields.io/badge/GitHub-@rzl--zone%2Fnext--kit-181717?logo=github" alt="GitHub Repo" />
  </a>
  <a href="https://github.com/rzl-app">
    <img src="https://img.shields.io/badge/Repo-on%20GitHub-181717?logo=github&style=flat-rounded" alt="Repo on GitHub" />
  </a>
</div>

---

> ⚠️ ***This is a BETA Version release.***  
> APIs, naming, or file structures may still change before v1.0.0.

> Type-safe utilities, opinionated conventions, and clean abstractions — designed to make your Next.js projects faster, cleaner, and more maintainable.

---
 
<h2 id="features">✨ <strong>Features</strong></h2>

- ✅ Type-safe server actions with helpers.  
- 🚀 API response formatter for consistent client/server comms.  
- 🛠️ Utility functions for common patterns (top-loader, hoc, themes, etc.).  
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

  ### **Full documentation <a href="https://docs-rzl-next-kit.vercel.app" target="_blank" rel="nofollow noreferrer noopener">Rzl Next Kit</a> is **currently under construction** 🏗️.**
  #### For now, explore the examples or dive into the source — all utilities are documented via **TSDoc** and typed properly.

  ```ts
  // For Extra (eg: getPathname, getSearchParams, etc).
  import { | } from "@rzl-zone/next-kit/extra"; 
  import { | } from "@rzl-zone/next-kit/extra/action"; 
  import { | } from "@rzl-zone/next-kit/extra/context"; 
  import { | } from "@rzl-zone/next-kit/extra/pathname"; 

  // For Higher-Order Components.
  import { | } from "@rzl-zone/next-kit/hoc"; 

  // For Themes Mode (eg: dark, light, system).
  import { | } from "@rzl-zone/next-kit/themes"; 

  // For Top Loader. 
  import { | } from "@rzl-zone/next-kit/top-loader";
  import { | } from "@rzl-zone/next-kit/top-loader/css"; 
  ```
  #### Place your cursor inside { } or after "@rzl-zone/next-kit/{{ | }}" then press Ctrl+Space to see all available functions/types with full TSDoc hints.
   
  ---
  ### **Hint: Autocomplete Setup (Step by Step)**

  #### Make TypeScript & VSCode automatically provide autocomplete for `@rzl-zone/next-kit` without needing triple-slash references in every file:

  - 1️⃣ **Install @rzl-zone/next-kit.**

    - Make sure the package is installed:

      ```bash
      npm install @rzl-zone/next-kit
      # or
      yarn add @rzl-zone/next-kit
      # or
      pnpm add @rzl-zone/next-kit
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
      /// <reference types="node" />
      /// <reference types="@rzl-zone/next-kit" />
      ``` 

  - 4️⃣ **Update tsconfig.json.**

    - Make sure not to override "types" (or leave it empty) so TypeScript automatically picks up your types folder:

      ```jsonc
      // tsconfig.json
      {
        "compilerOptions": { 
          "typeRoots": ["./types", "./node_modules/@types"],
          // other your config...
        },
        "include": ["src", "types"],
        // other your config...
      }
      ```
      - `typeRoots` tells TS where to look for global type definitions.
      - The `types` folder comes first, so your references override or add to the default `@types` packages

  - 5️⃣ **Update jsconfig.json (for JavaScript projects).**

    - If you also work with JS, do the same:

      ```jsonc
      // jsconfig.json
      {
        "compilerOptions": {
          "checkJs": true,  // Optional, enables type checking 
          "typeRoots": ["./types", "./node_modules/@types"],
          // other your config...
        },
        "include": ["src", "types"],
        // other your config...
      }
      ```
      >ℹ️ ***Tip:*** *For JS projects, consider adding "checkJs": true for better IntelliSense.*
    
   **Now, all types from @rzl-zone/next-kit are globally available, and you don’t need "types": ["@rzl-zone/next-kit"] in tsconfig.json.** 

--- 

<h2 id="type-safety-build-in">🧪 <strong>Type Safety Built In</strong></h2>

All core utilities are written in **TypeScript** with strong generics and inferred types — making your DX smooth and predictable. 

---
<h2 id="sponsor-this-package">❤️ <strong>Sponsor this package</strong></h2>

**Help support development:**    
*[👉 **Become a sponsor**](https://github.com/sponsors/rzl-app)*

---

<h2 id="changelog">📝 <strong>Changelog</strong></h2>

**See [CHANGELOG](CHANGELOG.md).**

---

<h2 id="contributing">🤝 <strong>Contributing</strong></h2>

**See [CONTRIBUTING](CONTRIBUTING.md).**

---

<h2 id="security">🔒 <strong>Security</strong></h2>

**Please report issues to [rizalvindwiky1998@gmail.com](mailto:rizalvindwiky1998@gmail.com).**

---

<h2 id="credits">💡 <strong>Recommended Stack</strong></h2>

- Next.js 14+
- TypeScript
- ReactJS
- Tailwind CSS (optional but recommended)

---

<h2 id="credits">🙌 <strong>Credits</strong></h2>

**- [Rzl App](https://github.com/rzl-app)**  
**- [All Contributors](../../contributors)**

---

<h2 id="license">📜 <strong>License</strong></h2>

**The MIT License (MIT).**    
*Please see **[License File](LICENSE.md)** for more information.*

---

✅ **Enjoy using `@rzl-zone/next-kit`?**  
*Star this repo [⭐](https://github.com/rzl-zone/next-kit) and share it with other JavaScript developers!*

---

