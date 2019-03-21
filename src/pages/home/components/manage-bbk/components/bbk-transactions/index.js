// @flow
import React from 'react'

// Hooks
import useBbkTransactions from './use-bbk-transactions'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

// Types
import type { AbstractContractT } from 'truffle-contract'

type PropsT = {|
  AccessToken: ?AbstractContractT,
  BrickblockToken: ?AbstractContractT,
|}

export const BbkTransactions = (props: PropsT) => {
  const { AccessToken, BrickblockToken } = props
  const transactions = useBbkTransactions({ AccessToken, BrickblockToken })

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h2">
          Your BBK Transactions
        </Typography>
        {transactions && transactions.length ? (
          transactions.map(tx => <div key={tx.hash}>{tx.hash}</div>)
        ) : (
          <div>
            <CircularProgress size={30} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

BbkTransactions.displayName = 'BbkTransactions'

export default BbkTransactions
