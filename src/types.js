// @flow
export type TransactionT = {|
  current?: boolean,
  hash: string,
  status: 'pending' | 'success' | 'error',
|}

export type TransactionsT = $ReadOnlyArray<TransactionT>

export type BalanceT = {|
  error: ?string,
  value: string,
  valueAsNumber: number,
  valueInWords?: string,
|}

export type ERC20TransferTransactionT = {|
  blockHash: string,
  blockNumber: string,
  confirmations: string,
  contractAddress: string,
  cumulativeGasUsed: string,
  from: string,
  gas: string,
  gasPrice: string,
  gasUsed: string,
  hash: string,
  input: string,
  nonce: string,
  timeStamp: string,
  to: string,
  tokenDecimal: string,
  tokenName: string,
  tokenSymbol: string,
  transactionIndex: string,
  type: { name: string, params: ?$ReadOnlyArray<mixed> },
  value: string,
|}

export type TransactionReceiptT = {|
  blockHash: string,
  blockNumber: number,
  contractAddress: ?string,
  cumulativeGasUsed: number,
  from: string,
  gasUsed: number,
  logs: mixed,
  logsBloom: string,
  rawLogs: mixed,
  status: boolean,
  to: string,
  transactionHash: string,
  transactionIndex: number,
|}

export type CurrentProviderT = 'loading' | Proxy<Web3ProviderT> | null

export type Web3ProviderT = {|
  _metamask: Proxy<{
    isApproved: Promise<boolean>,
    isEnabled: Promise<boolean>,
    isUnlocked: Promise<boolean>,
  }>,
  autoRefreshOnNetworkChange: boolean,
  enable: Promise<void>,
  networkVersion: string,
  selectedAddress: string,
|}
