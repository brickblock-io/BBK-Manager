// @flow
import type { AbstractContractT } from 'truffle-contract'

import { useState, useEffect } from 'react'

// Contracts
import contract from 'truffle-contract'
import AccessToken from '@brickblock/smart-contracts/deployed-contracts/AccessToken.json'
import BrickblockToken from '@brickblock/smart-contracts/deployed-contracts/BrickblockToken.json'
import FeeManager from '@brickblock/smart-contracts/deployed-contracts/FeeManager.json'

const bbkContractsMap = {
  AccessToken: contract(AccessToken),
  BrickblockToken: contract(BrickblockToken),
  FeeManager: contract(FeeManager),
}

export type BBKContractsT = $Keys<typeof bbkContractsMap>

type GetContractInstanceT = ({
  contractName: BBKContractsT,
  contractRegistry: ?AbstractContractT,
  web3Provider?: mixed,
}) => { contractInstance: ?AbstractContractT }
export const useContract: GetContractInstanceT = ({
  contractName,
  contractRegistry,
  web3Provider,
}) => {
  const [contractInstance, setContractInstance] = useState(null)

  const contractAbi = bbkContractsMap[contractName]

  useEffect(
    function _setContractInstance() {
      // eslint-disable-next-line no-extra-semi
      ;(async () => {
        try {
          if (web3Provider == null || contractRegistry == null) {
            setContractInstance(null)

            return
          }

          const address = await contractRegistry.getContractAddress(
            contractName
          )

          if (!address || typeof address !== 'string') {
            throw new Error(
              `Couldn't find contract address for '${contractName}' in contract registry`
            )
          }

          await contractAbi.setProvider(web3Provider)

          setContractInstance(await contractAbi.at(address))
        } catch (error) {
          setContractInstance(null)
          throw new Error(
            `getContractInstance() couldn't load contract instance for: '${contractName}'`
          )
        }
      })()
    },
    [contractAbi, contractName, contractRegistry, web3Provider]
  )

  return { contractInstance }
}

export default useContract
