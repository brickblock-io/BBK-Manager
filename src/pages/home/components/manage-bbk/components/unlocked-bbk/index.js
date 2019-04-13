// @flow
import React from 'react'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import LockBbkForm from './components/lock-bbk-form'
import Typography from '@material-ui/core/Typography'

// Types
import type { BalanceT } from 'hooks/use-bbk-balances/reducer'
import type { TransactionsT } from 'types'

type PropsT = {|
  approveTransactions: TransactionsT,
  classes: { [string]: string },
  handleCleanup: () => void,
  handleLock: (amount: string) => void,
  loading: boolean,
  lockTransactions: TransactionsT,
  unlockedBalance: ?BalanceT,
|}

export const UnlockedBbk = (props: PropsT) => {
  const {
    unlockedBalance,
    classes,
    handleLock,
    handleCleanup,
    loading,
    approveTransactions,
    lockTransactions,
  } = props

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h2">
          Your Unlocked BBK
        </Typography>

        {unlockedBalance ? (
          <div className={classes.tokenSection}>
            <div className={classes.balance}>
              <b>{unlockedBalance.value} unlocked BBK Tokens</b>
              <Typography className={classes.balanceInWords} variant="caption">
                ({unlockedBalance.valueInWords})
              </Typography>
            </div>
            <LockBbkForm
              approveTransactions={approveTransactions}
              handleCleanup={handleCleanup}
              handleSubmit={handleLock}
              loading={loading}
              lockTransactions={lockTransactions}
              unlockedBbkBalance={unlockedBalance.value}
            />
          </div>
        ) : (
          <div className={classes.loading}>
            <CircularProgress size={30} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

UnlockedBbk.displayName = 'LockedBbk'

export default UnlockedBbk
