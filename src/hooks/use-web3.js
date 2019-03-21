// @flow
import { useState, useEffect } from 'react'

// Hooks
import useInterval from './use-interval'

// Types
export type CurrentAccountT = 'loading' | string | null

export type EthereumNetworkMapT = {|
  '1': 'mainnet',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
  '4447': 'truffle',
  '4448': 'ganache',
  '5': 'goerli', // used in our truffle configs as default
|}

export type NetworkIdT = $Keys<EthereumNetworkMapT> | 'loading' | null

export type WalletUnlockStatusT = 'loading' | boolean | null

export type Web3ProviderT = 'loading' | 'metaMask' | 'unknown' | null

const errors = {
  METAMASK_ACCESS_REJECTED:
    "You rejected the account access request. You won't be able to execute transactions.",
}

export function useWeb3(Web3: *) {
  const [providerName, setProviderName] = useState<Web3ProviderT>('loading')
  const [currentProvider, setCurrentProvider] = useState(null)
  const [web3Instance, setWeb3Instance] = useState(null)
  const [networkId, setNetworkId] = useState<NetworkIdT>('loading')
  const [isUnlocked, setIsUnlocked] = useState<WalletUnlockStatusT>('loading')
  const [currentAccount, setCurrentAccount] = useState<CurrentAccountT>(
    'loading'
  )
  const [web3Error, setWeb3Error] = useState(null)

  useEffect(
    function _requestMetaMaskAccess() {
      if (providerName && providerName !== 'loading') {
        window.ethereum
          .enable()
          .then(() => {
            setIsUnlocked(true)

            if (window.ethereum.selectedAddress) {
              setCurrentAccount(window.ethereum.selectedAddress)
              setWeb3Error(null)

              return
            } else {
              throw new Error(
                "ethereum.selectedAddress is undefined - this shouldn't be possible at this stage 🤔"
              )
            }
          })

          .catch(() => {
            setWeb3Error(errors.METAMASK_ACCESS_REJECTED)
            setCurrentAccount(null)
          })
      }
    },
    [providerName]
  )

  useInterval(() => {
    if (window.ethereum == null) {
      setProviderName(null)
      setNetworkId(null)
      setIsUnlocked(null)
      setCurrentAccount(null)

      return
    }

    if (providerName === 'metaMask') {
      if (currentAccount !== 'loading') {
        Promise.all([
          window.ethereum._metamask.isUnlocked(),
          window.ethereum._metamask.isApproved(),
        ])
          .then(([_isUnlocked, _isApproved]) => {
            const _isEnabled = window.ethereum._metamask.isEnabled()

            setIsUnlocked(_isUnlocked)

            // If the wallet has been locked during a session => delete user account data
            if (!_isUnlocked) {
              setCurrentAccount(null)
            }

            // If wallet is unlocked, but MetaMask access was NOT approved => delete user account data
            if (_isUnlocked && !_isApproved) {
              setWeb3Error(errors.METAMASK_ACCESS_REJECTED)
              setCurrentAccount(null)
            }

            // If wallet is unlocked, and user approved MetaMask access, but MetaMask is NOT enabled => re-enable account access
            if (_isUnlocked && _isApproved && !_isEnabled) {
              window.ethereum
                .enable()
                .then(() => {
                  setCurrentAccount(window.ethereum.selectedAddress)

                  return
                })
                .catch(() => {
                  setWeb3Error("Couldn't connect to your MetaMask")
                })
            }

            // If wallet is unlocked, and user approved MetaMask access, and MetaMask is enabled => set accounts
            if (_isUnlocked && _isApproved && _isEnabled) {
              setCurrentAccount(window.ethereum.selectedAddress)
            }

            return { isApproved: _isApproved, isUnlocked: _isUnlocked }
          })
          .catch(() => {
            setWeb3Error("Couldn't fetch your current account from MetaMask")
          })
      }
    }
  }, 1000)

  useEffect(function _setProviderNameAndNetworkId() {
    if (typeof window.ethereum !== 'undefined') {
      setNetworkId(window.ethereum.networkVersion)

      if (window.ethereum.isMetaMask) {
        setProviderName('metaMask')
      } else {
        setProviderName('unknown')
      }
    } else {
      setNetworkId(null)
      setProviderName(null)
    }
  }, [])

  useEffect(function _setCurrentProvider() {
    if (window.web3 != null && window.web3.currentProvider != null) {
      setCurrentProvider(window.web3.currentProvider)
    } else {
      setCurrentProvider(null)
    }
  }, [])

  useEffect(
    function _createWeb3Instance() {
      if (currentProvider != null) {
        setWeb3Instance(new Web3(currentProvider))
      } else {
        setWeb3Instance(null)
      }
    },
    [Web3, currentProvider]
  )

  return {
    networkId,
    providerName,
    currentAccount,
    currentProvider,
    web3Error,
    web3Instance,
    isUnlocked,
  }
}

export default useWeb3
