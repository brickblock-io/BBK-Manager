# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://git.brickblock.sh///compare/v1.2.0...v1.2.1) (2019-05-07)


### Bug Fixes

* downgrade snackbar dependency to latest functioning version (latest version broke the dismiss button) ([8f78374](https://git.brickblock.sh///commit/8f78374))
* **activate-bbk:** fix eternal spinner after denying metamask signature ([b34cedd](https://git.brickblock.sh///commit/b34cedd))


### Chore

* **cleanup:** removed unused ‘use-act-balance-of’ folder ([6041707](https://git.brickblock.sh///commit/6041707))



## [1.2.0](https://git.brickblock.sh///compare/v1.1.1...v1.2.0) (2019-05-07)


### Bug Fixes

* typo in button text ([974b535](https://git.brickblock.sh///commit/974b535))


### Chore

* **build:** added .versionrc file to allow customizing CHANGELOG.md ([b602f73](https://git.brickblock.sh///commit/b602f73))
* update dependencies ([3328660](https://git.brickblock.sh///commit/3328660))
* updated devDependencies ([c262941](https://git.brickblock.sh///commit/c262941))
* **cleanup:** removed unused ‘use-bbk-balances’ folder ([81f1a59](https://git.brickblock.sh///commit/81f1a59))


### Features

* display “Retry” as button text if approve or activate transaction failed ([23d4852](https://git.brickblock.sh///commit/23d4852))
* **BBK:** added loading message informing users that transactions can take a long time and that they shouldn’t close their browser ([0dd6118](https://git.brickblock.sh///commit/0dd6118))
* **error-handling:** improve error reporting by co-locating the sentry calls with the actual code causing the errors ([78bd6e6](https://git.brickblock.sh///commit/78bd6e6))



## [1.1.1](https://git.brickblock.sh/platform/bbk-manager/compare/v1.1.0...v1.1.1) (2019-04-25)



# 1.1.0 (2019-04-18)


### Bug Fixes

* **flow:** fixed flow error in manually typed truffle-contract types ([3c4a112](https://git.brickblock.sh/playground/bbk-manager/commits/3c4a112))
* fixed test job due to missing NODE_PATH definition ([ba6d874](https://git.brickblock.sh/playground/bbk-manager/commits/ba6d874))
* **flow:** updated @brickblock/web3-utils to fix flow errors complaining about non-nullable Web3ProviderT types ([1897a56](https://git.brickblock.sh/playground/bbk-manager/commits/1897a56))
* **locking/unlocking:** fixed form validation and limit max-length to 10 characters because the ‘number-to-words’ package can’t deal with infinitely high numbers ([4cd5bd7](https://git.brickblock.sh/playground/bbk-manager/commits/4cd5bd7))
* temporarily skip hadolint from running in CI because the CI image is missing the binary ([b861e7d](https://git.brickblock.sh/playground/bbk-manager/commits/b861e7d))
* update .yarnclean file to stop breaking the truffle-contract package ([fc772f3](https://git.brickblock.sh/playground/bbk-manager/commits/fc772f3))


### Features

* first working version ([9a27941](https://git.brickblock.sh/playground/bbk-manager/commits/9a27941))
* make app production ready (env vars, stop using linked packages, dependency upgrades, stop using .env file) ([34818a4](https://git.brickblock.sh/playground/bbk-manager/commits/34818a4))
* **act:** implemented convert-act-to-eth form ([d62366a](https://git.brickblock.sh/playground/bbk-manager/commits/d62366a))
* **ErrorBoundary:** improved ErrorBoundary component ([c7f5ba8](https://git.brickblock.sh/playground/bbk-manager/commits/c7f5ba8))
* **logging:** handle error messages in the top-level component only ([3f32de4](https://git.brickblock.sh/playground/bbk-manager/commits/3f32de4))
* **logging:** truncate remaining full addresses for enhanced data privacy when logging to sentry ([ba52b32](https://git.brickblock.sh/playground/bbk-manager/commits/ba52b32))
* **ManageACT:** added error snackbar for displaying potential errors occurring during the sell-act flow ([d859f06](https://git.brickblock.sh/playground/bbk-manager/commits/d859f06))
* update title copy for all boxes ([190b157](https://git.brickblock.sh/playground/bbk-manager/commits/190b157))
