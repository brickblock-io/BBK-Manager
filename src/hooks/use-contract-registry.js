// @flow
import type { AbstractContractT } from 'truffle-contract'

import { useState, useEffect } from 'react'

// Contracts
import contract from 'truffle-contract'
import ContractRegistry from '@brickblock/smart-contracts/deployed-contracts/ContractRegistry.json'

type GetContractInstanceT = (
  web3Provider: mixed
) => {
  contractRegistry: ?AbstractContractT,
  contractRegistryError: ?string,
}
export const useContractRegistry: GetContractInstanceT = web3Provider => {
  const [contractRegistry, setContractRegistry] = useState(null)
  const [contractRegistryError, setError] = useState(null)

  useEffect(
    function _setContractRegistryEffevt() {
      // eslint-disable-next-line no-extra-semi
      ;(async () => {
        try {
          if (web3Provider == null) {
            setContractRegistry(null)

            return
          }

          const contractRegistryAbi = contract(ContractRegistry)

          await contractRegistryAbi.setProvider(web3Provider)

          setContractRegistry(await contractRegistryAbi.deployed())

          setError(null)
        } catch (error) {
          setError("Couldn't load contract registry")
          setContractRegistry(null)
        }
      })()
    },
    [web3Provider]
  )

  return { contractRegistry, contractRegistryError }
}

export default useContractRegistry
