// @flow
declare module 'truffle-contract' {
  declare type ContractT = {
    at: (address: string) => Promise<ContractInstanceT>,
    deployed: () => Promise<ContractInstanceT>,
    setProvider: (web3: Object) => Promise<void>,
  }

  declare type ContractInstanceT = {
    abi: {
      sources: $ReadOnlyArray<'abi' | 'interface'>,
      transform: (value: mixed) => mixed,
    },
    ast: { [string]: mixed },
    bytecode: {
      sources: $ReadOnlyArray<
        'bytecode' | 'binary' | 'unlinked_binary' | 'evm.bytecode.object'
      >,
      transform: (value: string) => string,
    },
    compiler: { [string]: mixed },
    contractName: { sources: $ReadOnlyArray<'contractName' | 'contract_name'> },
    deployedBytecode: {
      sources: $ReadOnlyArray<
        'deployedBytecode' | 'runtimeBytecode' | 'evm.deployedBytecode.object'
      >,
      transform: (value: string) => string,
    },
    deployedSourceMap: {
      sources: $ReadOnlyArray<
        'deployedSourceMap' | 'srcmapRuntime' | 'evm.deployedBytecode.sourceMap'
      >,
    },
    devdoc: { [string]: mixed },
    networks: {
      transform: (value: ?string) => {} | string,
    },
    schemaVersion: {
      sources: $ReadOnlyArray<'schemaVersion' | 'schema_version'>,
    },
    source: { [string]: mixed },
    sourceMap: {
      sources: $ReadOnlyArray<
        'sourceMap' | 'srcmap' | 'evm.bytecode.sourceMap'
      >,
    },
    sourcePath: { [string]: mixed },
    updatedAt: {
      sources: $ReadOnlyArray<'updatedAt' | 'updated_at'>,
      transform: (value: mixed) => string,
    },
    userdoc: { [string]: mixed },
  }

  declare type AbstractContractT = {
    [string]: (?string) => Promise<?string>,
  }

  declare module.exports: {
    (contractJson: string): ContractT,
  }
}
