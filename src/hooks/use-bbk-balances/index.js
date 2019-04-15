// @flow
import { useEffect, useReducer } from 'react'

// Hooks
import { useContract, useInterval } from '@brickblock/web3-utils'

// Data
import reducer, { initialState } from './reducer'

// Utils
import getLockedBbkBalance from './get-locked-bbk-balance'
import getUnlockedBbkBalance from './get-unlocked-bbk-balance'
import lockBbk from './lock-bbk'
import unlockBbk from './unlock-bbk'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { BalanceT, StateT } from './reducer'
import type { TransactionsT } from 'types'

type UseBbkBalanceOfT = ({
  address: ?string,
  contractRegistry: ?AbstractContractT,
  web3Provider: ?mixed,
}) => {
  AccessToken: ?AbstractContractT,
  BrickblockToken: ?AbstractContractT,
  approveTokensError: ?string,
  approveTokensLoading: boolean,
  approveTokensTransactions: TransactionsT,
  balances: {
    locked: ?BalanceT,
    unlocked: ?BalanceT,
  },
  handleLockTokens: (amount: string) => void,
  handleLockTokensCleanup: () => void,
  handleUnlockTokens: (amount: string) => void,
  handleUnlockTokensCleanup: () => void,
  lockTokensError: ?string,
  lockTokensLoading: boolean,
  lockTokensTransactions: TransactionsT,
  unlockTokensError: ?string,
  unlockTokensLoading: boolean,
  unlockTokensTransactions: TransactionsT,
}

export const useBbkBalanceOf: UseBbkBalanceOfT = ({
  address,
  contractRegistry,
  web3Provider,
}) => {
  const [state, dispatch] = useReducer<StateT, ActionsT>(reducer, initialState)

  const { contractInstance: BrickblockToken } = useContract({
    contractName: 'BrickblockToken',
    contractRegistry,
    web3Provider,
  })

  const { contractInstance: AccessToken } = useContract({
    contractName: 'AccessToken',
    contractRegistry,
    web3Provider,
  })

  /*
   * Handlers
   */
  const handleLockTokens = amount => {
    dispatch({ type: 'lock-tokens', payload: amount })
  }

  const handleLockTokensCleanup = () => {
    dispatch({ type: 'approve-tokens/cleanup' })
    dispatch({ type: 'lock-tokens/cleanup' })
  }

  const handleUnlockTokens = amount => {
    dispatch({ type: 'unlock-tokens', payload: amount })
  }

  const handleUnlockTokensCleanup = () => {
    dispatch({ type: 'unlock-tokens/cleanup' })
  }

  /*
   * Effects
   */
  useEffect(
    function _getUnlockedBbkBalance() {
      getUnlockedBbkBalance({
        BrickblockToken,
        address,
        dispatch,
      })
    },
    [BrickblockToken, address]
  )

  useEffect(
    function _getLockedBbkBalance() {
      getLockedBbkBalance({
        AccessToken,
        address,
        dispatch,
      })
    },
    [AccessToken, address]
  )

  useInterval(() => {
    getLockedBbkBalance({
      AccessToken,
      address,
      dispatch,
      previousBalance: state.locked,
    })
    getUnlockedBbkBalance({
      BrickblockToken,
      address,
      dispatch,
      previousBalance: state.unlocked,
    })
  }, 3000)

  useEffect(
    function _lockBbk() {
      lockBbk({
        AccessToken,
        BrickblockToken,
        address,
        amount: state.lockTokens.amount,
        dispatch,
      })
    },
    [AccessToken, BrickblockToken, address, state.lockTokens.amount]
  )

  useEffect(
    function _unlockBbk() {
      unlockBbk({
        AccessToken,
        address,
        amount: state.unlockTokens.amount,
        dispatch,
      })
    },
    [AccessToken, address, state.unlockTokens.amount]
  )

  return {
    AccessToken,
    BrickblockToken,
    balances: { locked: state.locked, unlocked: state.unlocked },
    handleLockTokens,
    handleLockTokensCleanup,
    handleUnlockTokens,
    handleUnlockTokensCleanup,
    approveTokensError: state.approveTokens ? state.approveTokens.error : '',
    approveTokensLoading: state.approveTokens && state.approveTokens.loading,
    approveTokensTransactions:
      state.approveTokens && state.approveTokens.transactions,
    lockTokensError: state.lockTokens ? state.lockTokens.error : '',
    lockTokensLoading: state.lockTokens && state.lockTokens.loading,
    lockTokensTransactions: state.lockTokens && state.lockTokens.transactions,
    unlockTokensError: state.unlockTokens ? state.unlockTokens.error : '',
    unlockTokensLoading: state.unlockTokens && state.unlockTokens.loading,
    unlockTokensTransactions:
      state.unlockTokens && state.unlockTokens.transactions,
  }
}

export default useBbkBalanceOf
