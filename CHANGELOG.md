# Changelog

## [0.6.3](https://github.com/rzl-zone/next-kit/compare/v0.6.2...v0.6.3) (2025-10-23)


### Bug Fixes

* **chore:** Fixing README.md ([88d4aa4](https://github.com/rzl-zone/next-kit/commit/88d4aa4c33f644a87a60c227e686550b47f63e1e))
* Fixing export "./utils" at package.json ([66b5988](https://github.com/rzl-zone/next-kit/commit/66b598843de9adee0630dc4c7e7a78138a322d4d))

## [0.6.2](https://github.com/rzl-zone/next-kit/compare/v0.6.1...v0.6.2) (2025-10-23)


### Bug Fixes

* **Chore:** Fixing README.md ([c087cba](https://github.com/rzl-zone/next-kit/commit/c087cba98dc9e3bac50c6e5b99784b2ded856868))

## [0.6.1](https://github.com/rzl-zone/next-kit/compare/v0.6.0...v0.6.1) (2025-10-23)


### Bug Fixes

* **Chore:** Fixing script prepublishOnly at package.json ([20394f0](https://github.com/rzl-zone/next-kit/commit/20394f0f47dc9f2c3837c2e4b5eb3e5617300f87))

## [0.6.0](https://github.com/rzl-zone/next-kit/compare/v0.5.2...v0.6.0) (2025-10-23)


### Features

* Add features utility `isRenderedRzlProgress`, `isStartedRzlProgress`, `pauseRzlProgress`, resumeRzlProgress` for control `progress-bar`. ([a6ef859](https://github.com/rzl-zone/next-kit/commit/a6ef859833bc6fdef9ebec71a51e14b6b9cf07a8))
* Add new extra types category for ts developer. ([415318a](https://github.com/rzl-zone/next-kit/commit/415318a0241d388f31cb2fc435b1e8f578a50f71))
* Add new feature `top-loader`. ([1e11ac0](https://github.com/rzl-zone/next-kit/commit/1e11ac0bd8d0e1ae2150f6f151d0a36bd2f664ed))
* Add new utility function category. ([5ff3fc1](https://github.com/rzl-zone/next-kit/commit/5ff3fc15c358d388696347f7bacaab495e4280e4))
* **Chore:** Update peerDependencies for NextJS support version 16.x, update Requirement NodeJs minimum version 20.9.x. update devDeps @rzl-zone/utils-js version 3.9.1 ([533f45c](https://github.com/rzl-zone/next-kit/commit/533f45cdd0ac8f3e9ef63c169e1d0d40b48e80de))
* initial setup ([aa6aee5](https://github.com/rzl-zone/next-kit/commit/aa6aee501021afa76d8e1b74400083a4dc1544a4))
* **Refactor:** Refactor folder `progress-bar`, fix build scripts and tsconfig, and some logic. ([0b486be](https://github.com/rzl-zone/next-kit/commit/0b486be10d25e93625028ccfc36b15fc5a1a6bb8))


### Bug Fixes

* **Chore:** Fixing bug in the lockfile don't match specifiers in package.json. ([f3d5f34](https://github.com/rzl-zone/next-kit/commit/f3d5f3408dd7084f8038d876e929e6bfabce38bf))
* **Chore:** Update deprecated devDeps packages, and uninstall unused packages. ([ebb924d](https://github.com/rzl-zone/next-kit/commit/ebb924dcea2c4aa688a446e6a62316facf7d9367))
* **Chore:** Update devDeps version and fixing some package from devDeps to deps. ([d14ae5a](https://github.com/rzl-zone/next-kit/commit/d14ae5a23f1d203ed8967580b2ddcf4a9c224386))
* **Chore:** Update some .md files, and remove unused config file for build. ([ab98846](https://github.com/rzl-zone/next-kit/commit/ab98846c380d4fb851bb87e8b5d13638bc839cec))
* Clean some unused types wrapped by `Prettify` types. ([3f3b7a1](https://github.com/rzl-zone/next-kit/commit/3f3b7a187317b7117fb35920c7b5485824fdbc21))
* Fixing bug on component displayName at isProdEnv only. ([cb77d14](https://github.com/rzl-zone/next-kit/commit/cb77d142d2d723cd3ef64915a5324233a7a0c97a))
* Fixing bundle when build at new category `utils`. ([b9503f4](https://github.com/rzl-zone/next-kit/commit/b9503f48957336878430c07e8554c1c13fc2858b))
* Fixing error message, tsconfig options, and refactor some structure folder, also fixing some tsDoc. ([3f23985](https://github.com/rzl-zone/next-kit/commit/3f23985f956f094f8663616db6e54e3cc090f58f))
* Fixing exports at package.json, and fix readme.md ([aeb5445](https://github.com/rzl-zone/next-kit/commit/aeb5445214313717e6604d601148cd5d73e5f6a5))
* Fixing exports at package.json, fix "use client" marks at index top-loader, fix readme.md ([de80132](https://github.com/rzl-zone/next-kit/commit/de801325d2f30a05f81af453dcfa9dda75ac95d5))
* Fixing exports path at package.json. ([e678eca](https://github.com/rzl-zone/next-kit/commit/e678eca18461911c6653542ab85620d9bab50d72))
* Fixing exports top-loader/css path, and docs ([53697e1](https://github.com/rzl-zone/next-kit/commit/53697e1222594621cf8f49169d6e28de75b47241))
* Fixing exports top-loader/css path. ([2e1e9fa](https://github.com/rzl-zone/next-kit/commit/2e1e9fa6b53fb06c310c4ae3235afeb0c7a4eae8))
* Fixing exports top-loader/default.css path, and docs ([31beb56](https://github.com/rzl-zone/next-kit/commit/31beb56d44c68e175805f94336748c8bc019b466))
* Fixing generateReferenceIndex for build. ([9619854](https://github.com/rzl-zone/next-kit/commit/9619854fa7da6e27932b37cef64acc64f2eb628e))
* Fixing React is not defined at build time, because forgot import default react. ([120369f](https://github.com/rzl-zone/next-kit/commit/120369fac7aa630a278adcfc4c0fcac12a2f4ba1))
* Fixing tsDoc utilities `isRenderedRzlProgress`, `isStartedRzlProgress`, `pauseRzlProgress`, `resumeRzlProgress` for control `progress-bar`. ([40aa883](https://github.com/rzl-zone/next-kit/commit/40aa883d8e38bc0612382b58f4ca899f3c6f9a79))
* Fixing tsup config and tsconfig, also fix some bug at build script ([e0476cd](https://github.com/rzl-zone/next-kit/commit/e0476cd91c3e78292b7222589491da1e70af68de))
* Fixing types result at extra/context ([a8c2e28](https://github.com/rzl-zone/next-kit/commit/a8c2e282323e9486ff88cb7e70402b72ffb35e69))
* Full reset release-please to use 0.0.1 ([8e13b78](https://github.com/rzl-zone/next-kit/commit/8e13b7857be1e5e409c95f4cd4b95c10a7dffb5f))
* Remove unused displayName for react component internal at `themes` category. ([7ed27a8](https://github.com/rzl-zone/next-kit/commit/7ed27a82b45dedeccc3b52e4b0417d01a2a30ed4))
* Try to fixing bundle build error about  (ecmascript)}["fileURLToPath"] is not a function (2). ([b8b12fa](https://github.com/rzl-zone/next-kit/commit/b8b12fac55bfb58d12ae80167baf530c93b3b8b0))
* Try to fixing bundle build error about  (ecmascript)}["fileURLToPath"] is not a function. ([79f3d61](https://github.com/rzl-zone/next-kit/commit/79f3d61d5554c1fef0a660d97acbd3bbd569ae27))
* TsDoc for `ProvidersThemesApp`. ([350f329](https://github.com/rzl-zone/next-kit/commit/350f329ae9f02a905b47d47a1f33ca2f61f01cf4))
* Update docs at Readme.md. ([9d6d617](https://github.com/rzl-zone/next-kit/commit/9d6d617ac72dc0fbd6d0b63080bf77619d9d8d65))

## [0.5.2](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.5.1...next-kit-v0.5.2) (2025-10-01)


### Bug Fixes

* Fixing exports path at package.json. ([e678eca](https://github.com/rzl-zone/next-kit/commit/e678eca18461911c6653542ab85620d9bab50d72))

## [0.5.1](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.5.0...next-kit-v0.5.1) (2025-09-29)


### Bug Fixes

* Clean some unused types wrapped by `Prettify` types. ([3f3b7a1](https://github.com/rzl-zone/next-kit/commit/3f3b7a187317b7117fb35920c7b5485824fdbc21))
* Fixing tsDoc utilities `isRenderedRzlProgress`, `isStartedRzlProgress`, `pauseRzlProgress`, `resumeRzlProgress` for control `progress-bar`. ([40aa883](https://github.com/rzl-zone/next-kit/commit/40aa883d8e38bc0612382b58f4ca899f3c6f9a79))

## [0.5.0](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.4.1...next-kit-v0.5.0) (2025-09-29)


### Features

* Add features utility `isRenderedRzlProgress`, `isStartedRzlProgress`, `pauseRzlProgress`, resumeRzlProgress` for control `progress-bar`. ([a6ef859](https://github.com/rzl-zone/next-kit/commit/a6ef859833bc6fdef9ebec71a51e14b6b9cf07a8))


### Bug Fixes

* TsDoc for `ProvidersThemesApp`. ([350f329](https://github.com/rzl-zone/next-kit/commit/350f329ae9f02a905b47d47a1f33ca2f61f01cf4))
* Update docs at Readme.md. ([9d6d617](https://github.com/rzl-zone/next-kit/commit/9d6d617ac72dc0fbd6d0b63080bf77619d9d8d65))

## [0.4.1](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.4.0...next-kit-v0.4.1) (2025-09-26)


### Bug Fixes

* **Chore:** Fixing bug in the lockfile don't match specifiers in package.json. ([f3d5f34](https://github.com/rzl-zone/next-kit/commit/f3d5f3408dd7084f8038d876e929e6bfabce38bf))
* **Chore:** Update devDeps version and fixing some package from devDeps to deps. ([d14ae5a](https://github.com/rzl-zone/next-kit/commit/d14ae5a23f1d203ed8967580b2ddcf4a9c224386))

## [0.4.0](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.3.1...next-kit-v0.4.0) (2025-09-26)


### Features

* Add new extra types category for ts developer. ([415318a](https://github.com/rzl-zone/next-kit/commit/415318a0241d388f31cb2fc435b1e8f578a50f71))


### Bug Fixes

* Removing unused displayName for react component internal at `themes` category. ([7ed27a8](https://github.com/rzl-zone/next-kit/commit/7ed27a82b45dedeccc3b52e4b0417d01a2a30ed4))

## [0.3.1](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.3.0...next-kit-v0.3.1) (2025-09-26)


### Bug Fixes

* Fixing bundle when build at new category `utils`. ([b9503f4](https://github.com/rzl-zone/next-kit/commit/b9503f48957336878430c07e8554c1c13fc2858b))

## [0.3.0](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.2.0...next-kit-v0.3.0) (2025-09-26)


### Features

* Add new utility function category. ([5ff3fc1](https://github.com/rzl-zone/next-kit/commit/5ff3fc15c358d388696347f7bacaab495e4280e4))


### Bug Fixes

* **Chore:** Update deprecated devDeps packages, and uninstall unused packages. ([ebb924d](https://github.com/rzl-zone/next-kit/commit/ebb924dcea2c4aa688a446e6a62316facf7d9367))
* **Chore:** Update some .md files, and remove unused config file for build. ([ab98846](https://github.com/rzl-zone/next-kit/commit/ab98846c380d4fb851bb87e8b5d13638bc839cec))

## [0.2.0](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.10...next-kit-v0.2.0) (2025-09-25)


### Features

* **Refactor:** Refactor folder `progress-bar`, fix build scripts and tsconfig, and some logic. ([0b486be](https://github.com/rzl-zone/next-kit/commit/0b486be10d25e93625028ccfc36b15fc5a1a6bb8))


### Bug Fixes

* Fixing bug on component displayName at isProdEnv only. ([cb77d14](https://github.com/rzl-zone/next-kit/commit/cb77d142d2d723cd3ef64915a5324233a7a0c97a))
* Fixing tsup config and tsconfig, also fix some bug at build script ([e0476cd](https://github.com/rzl-zone/next-kit/commit/e0476cd91c3e78292b7222589491da1e70af68de))

## [0.1.10](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.9...next-kit-v0.1.10) (2025-09-24)


### Bug Fixes

* Fixing generateReferenceIndex for build. ([9619854](https://github.com/rzl-zone/next-kit/commit/9619854fa7da6e27932b37cef64acc64f2eb628e))

## [0.1.9](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.8...next-kit-v0.1.9) (2025-09-24)


### Bug Fixes

* Fixing error message, tsconfig options, and refactor some structure folder, also fixing some tsDoc. ([3f23985](https://github.com/rzl-zone/next-kit/commit/3f23985f956f094f8663616db6e54e3cc090f58f))

## [0.1.8](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.7...next-kit-v0.1.8) (2025-09-23)


### Bug Fixes

* Fixing exports top-loader/default.css path, and docs ([31beb56](https://github.com/rzl-zone/next-kit/commit/31beb56d44c68e175805f94336748c8bc019b466))

## [0.1.7](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.6...next-kit-v0.1.7) (2025-09-23)


### Bug Fixes

* Fixing types result at extra/context ([a8c2e28](https://github.com/rzl-zone/next-kit/commit/a8c2e282323e9486ff88cb7e70402b72ffb35e69))

## [0.1.6](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.5...next-kit-v0.1.6) (2025-09-23)


### Bug Fixes

* Fixing exports top-loader/css path, and docs ([53697e1](https://github.com/rzl-zone/next-kit/commit/53697e1222594621cf8f49169d6e28de75b47241))
* Fixing exports top-loader/css path. ([2e1e9fa](https://github.com/rzl-zone/next-kit/commit/2e1e9fa6b53fb06c310c4ae3235afeb0c7a4eae8))

## [0.1.5](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.4...next-kit-v0.1.5) (2025-09-23)


### Bug Fixes

* Fixing exports at package.json, fix "use client" marks at index top-loader, fix readme.md ([de80132](https://github.com/rzl-zone/next-kit/commit/de801325d2f30a05f81af453dcfa9dda75ac95d5))

## [0.1.4](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.3...next-kit-v0.1.4) (2025-09-23)


### Bug Fixes

* Try to fixing bundle build error about  (ecmascript)}["fileURLToPath"] is not a function (2). ([b8b12fa](https://github.com/rzl-zone/next-kit/commit/b8b12fac55bfb58d12ae80167baf530c93b3b8b0))

## [0.1.3](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.2...next-kit-v0.1.3) (2025-09-23)


### Bug Fixes

* Try to fixing bundle build error about  (ecmascript)}["fileURLToPath"] is not a function. ([79f3d61](https://github.com/rzl-zone/next-kit/commit/79f3d61d5554c1fef0a660d97acbd3bbd569ae27))

## [0.1.2](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.1...next-kit-v0.1.2) (2025-09-23)


### Bug Fixes

* Fixing React is not defined at build time, because forgot import default react. ([120369f](https://github.com/rzl-zone/next-kit/commit/120369fac7aa630a278adcfc4c0fcac12a2f4ba1))

## [0.1.1](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.1.0...next-kit-v0.1.1) (2025-09-23)


### Bug Fixes

* Fixing exports at package.json, and fix readme.md ([aeb5445](https://github.com/rzl-zone/next-kit/commit/aeb5445214313717e6604d601148cd5d73e5f6a5))

## [0.1.0](https://github.com/rzl-zone/next-kit/compare/next-kit-v0.0.1...next-kit-v0.1.0) (2025-09-23)


### Features

* Add new feature `top-loader`. ([1e11ac0](https://github.com/rzl-zone/next-kit/commit/1e11ac0bd8d0e1ae2150f6f151d0a36bd2f664ed))

## 0.0.1 (2025-08-05)


### Features

* Initial setup ([aa6aee5](https://github.com/rzl-zone/next-kit/commit/aa6aee501021afa76d8e1b74400083a4dc1544a4))


### Bug Fixes

* Full reset release-please to use 0.0.1 ([8e13b78](https://github.com/rzl-zone/next-kit/commit/8e13b7857be1e5e409c95f4cd4b95c10a7dffb5f))
