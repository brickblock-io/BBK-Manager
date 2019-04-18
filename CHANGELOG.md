# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
