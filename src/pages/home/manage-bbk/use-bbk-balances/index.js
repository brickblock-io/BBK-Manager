// @flow
import { useEffect, useReducer } from 'react'

// Hooks
import { useContract, useInterval } from '@brickblock/web3-utils'

// Data
import reducer, { initialState } from './reducer'

// Utils
import getActivatedBbkBalance from './get-activated-bbk-balance'
import getDeactivatedBbkBalance from './get-deactivated-bbk-balance'
import activateBbk from './activate-bbk'
import deactivateBbk from './deactivate-bbk'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { StateT } from './reducer'
import type { BalanceT, TransactionsT, CurrentProviderT } from 'types'

export type BBKContextT = {|
  AccessToken: ?AbstractContractT,
  BrickblockToken: ?AbstractContractT,
  activateTokensError: ?string,
  activateTokensLoading: boolean,
  activateTokensTransactions: TransactionsT,
  approveTokensError: ?string,
  approveTokensLoading: boolean,
  approveTokensTransactions: TransactionsT,
  balances: {
    activated: ?BalanceT,
    deactivated: ?BalanceT,
  },
  deactivateTokensError: ?string,
  deactivateTokensLoading: boolean,
  deactivateTokensTransactions: TransactionsT,
  handleActivateTokens: (amount: string) => void,
  handleActivateTokensCleanup: () => void,
  handleDeactivateTokens: (amount: string) => void,
  handleDeactivateTokensCleanup: () => void,
|}

type UseBbkBalanceOfT = ({
  address: ?string,
  contractRegistry: ?AbstractContractT,
  currentProvider: ?CurrentProviderT,
}) => BBKContextT
export const useBbkBalanceOf: UseBbkBalanceOfT = ({
  address,
  contractRegistry,
  currentProvider,
}) => {
  const [state, dispatch] = useReducer<StateT, ActionsT>(reducer, initialState)

  const { contractInstance: BrickblockToken } = useContract({
    contractName: 'BrickblockToken',
    contractRegistry,
    currentProvider,
  })

  const { contractInstance: AccessToken } = useContract({
    contractName: 'AccessToken',
    contractRegistry,
    currentProvider,
  })

  /*
   * Handlers
   */
  const handleActivateTokens = amount => {
    dispatch({ type: 'activate-tokens', payload: amount })
  }

  const handleActivateTokensCleanup = () => {
    dispatch({ type: 'approve-tokens/cleanup' })
    dispatch({ type: 'activate-tokens/cleanup' })
  }

  const handleDeactivateTokens = amount => {
    dispatch({ type: 'deactivate-tokens', payload: amount })
  }

  const handleDeactivateTokensCleanup = () => {
    dispatch({ type: 'deactivate-tokens/cleanup' })
  }

  /*
   * Effects
   */
  useEffect(
    function _getDeactivatedBbkBalance() {
      getDeactivatedBbkBalance({
        BrickblockToken,
        address,
        dispatch,
      })
    },
    [BrickblockToken, address]
  )

  useEffect(
    function _getActivatedBbkBalance() {
      getActivatedBbkBalance({
        AccessToken,
        address,
        dispatch,
      })
    },
    [AccessToken, address]
  )

  useInterval(() => {
    getActivatedBbkBalance({
      AccessToken,
      address,
      dispatch,
      previousBalance: state.activated,
    })
    getDeactivatedBbkBalance({
      BrickblockToken,
      address,
      dispatch,
      previousBalance: state.deactivated,
    })
  }, 3000)

  useEffect(
    function _activateBbk() {
      activateBbk({
        AccessToken,
        BrickblockToken,
        address,
        amount: state.activateTokens.amount,
        dispatch,
      })
    },
    [AccessToken, BrickblockToken, address, state.activateTokens.amount]
  )

  useEffect(
    function _deactivateBbk() {
      deactivateBbk({
        AccessToken,
        address,
        amount: state.deactivateTokens.amount,
        dispatch,
      })
    },
    [AccessToken, address, state.deactivateTokens.amount]
  )

  return {
    AccessToken,
    BrickblockToken,
    balances: { activated: state.activated, deactivated: state.deactivated },
    handleActivateTokens,
    handleActivateTokensCleanup,
    handleDeactivateTokens,
    handleDeactivateTokensCleanup,
    approveTokensError: state.approveTokens ? state.approveTokens.error : '',
    approveTokensLoading: state.approveTokens && state.approveTokens.loading,
    approveTokensTransactions:
      state.approveTokens && state.approveTokens.transactions,
    activateTokensError: state.activateTokens ? state.activateTokens.error : '',
    activateTokensLoading: state.activateTokens && state.activateTokens.loading,
    activateTokensTransactions:
      state.activateTokens && state.activateTokens.transactions,
    deactivateTokensError: state.deactivateTokens
      ? state.deactivateTokens.error
      : '',
    deactivateTokensLoading:
      state.deactivateTokens && state.deactivateTokens.loading,
    deactivateTokensTransactions:
      state.deactivateTokens && state.deactivateTokens.transactions,
  }
}

export default useBbkBalanceOf
