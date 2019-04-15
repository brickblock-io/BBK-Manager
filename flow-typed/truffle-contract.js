// @flow
declare module 'truffle-contract' {
  declare type ContractT = {
    at: (address: string) => Promise<AbstractContractT>,
    deployed: () => Promise<AbstractContractT>,
    setProvider: (web3: Object) => Promise<void>,
  }

  declare type AbstractContractT = {
    [string]: (?string) => Promise<?string>,
  }

  declare module.exports: {
    (contractJson: string): ContractT,
  }
}
