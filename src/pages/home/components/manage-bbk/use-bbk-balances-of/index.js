// @flow
import { useEffect, useReducer } from 'react'

// Hooks
import { useContract } from '../../../../../hooks/use-contract'

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
import type { StateT } from './reducer'

type UseBbkBalanceOfT = ({
  address: ?string,
  contractRegistry: ?AbstractContractT,
  web3Provider: ?mixed,
}) => {
  AccessToken: ?AbstractContractT,
  BrickblockToken: ?AbstractContractT,
  balances: StateT,
  handleLockTokens: (
    event: SyntheticEvent<HTMLFormElement>,
    amount: string
  ) => void,
  handleUnlockTokens: (
    event: SyntheticEvent<HTMLFormElement>,
    amount: string
  ) => void,
  lockTokensError: ?string,
  lockTokensLoading: boolean,
  unlockTokensError: ?string,
  unlockTokensLoading: boolean,
}

export const useBbkBalanceOf: UseBbkBalanceOfT = ({
  address,
  contractRegistry,
  web3Provider,
}) => {
  const [balances, dispatch] = useReducer<StateT, ActionsT>(
    reducer,
    initialState
  )

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

  useEffect(
    () => getUnlockedBbkBalance({ BrickblockToken, address, dispatch }),
    [BrickblockToken, address]
  )

  useEffect(() => getLockedBbkBalance({ AccessToken, address, dispatch }), [
    AccessToken,
    address,
  ])

  useEffect(
    () =>
      lockBbk({
        AccessToken,
        BrickblockToken,
        address,
        amount: balances.lockTokens.amount,
        dispatch,
      }),
    [AccessToken, BrickblockToken, address, balances.lockTokens.amount]
  )

  useEffect(
    () =>
      unlockBbk({
        AccessToken,
        address,
        amount: balances.unlockTokens.amount,
        dispatch,
      }),
    [AccessToken, address, balances.unlockTokens.amount]
  )

  const handleLockTokens = (event, amount) => {
    event.preventDefault()
    dispatch({ type: 'lock-tokens', payload: amount })
    throw new Error("Let's see if this sentry thing works!!")
  }

  const handleUnlockTokens = (event, amount) => {
    event.preventDefault()
    dispatch({ type: 'unlock-tokens', payload: amount })
  }

  return {
    AccessToken,
    BrickblockToken,
    balances,
    handleLockTokens,
    handleUnlockTokens,
    lockTokensError: balances.lockTokens ? balances.lockTokens.error : '',
    lockTokensLoading: !!balances.lockTokens && balances.lockTokens.loading,
    unlockTokensError: balances.unlockTokens ? balances.unlockTokens.error : '',
    unlockTokensLoading:
      !!balances.unlockTokens && balances.unlockTokens.loading,
  }
}

export default useBbkBalanceOf
