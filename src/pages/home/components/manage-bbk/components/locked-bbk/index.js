// @flow
import React from 'react'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import UnlockBbkForm from './components/unlock-bbk-form'
import Typography from '@material-ui/core/Typography'

// Types
import type { BalanceT } from 'hooks/use-bbk-balances/reducer'
import type { TransactionsT } from 'types'

type PropsT = {|
  classes: { [string]: string },
  handleCleanup: () => void,
  handleUnlock: (amount: string) => void,
  loading: boolean,
  lockedBalance: ?BalanceT,
  unlockTransactions: TransactionsT,
|}

export const LockedBbk = (props: PropsT) => {
  const {
    lockedBalance,
    classes,
    handleCleanup,
    handleUnlock,
    loading,
    unlockTransactions,
  } = props

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h2">
          Your Locked BBK
        </Typography>

        {lockedBalance ? (
          <div className={classes.tokenSection}>
            <div className={classes.balance}>
              <b>{lockedBalance.value} locked BBK Tokens</b>
              <Typography className={classes.balanceInWords} variant="caption">
                ({lockedBalance.valueInWords})
              </Typography>
            </div>
            <UnlockBbkForm
              handleCleanup={handleCleanup}
              handleSubmit={handleUnlock}
              loading={loading}
              lockedBbkBalance={lockedBalance.value}
              unlockTransactions={unlockTransactions}
            />
          </div>
        ) : (
          <div className={classes.loading}>
            <CircularProgress size={30} />{' '}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

LockedBbk.displayName = 'LockedBbk'

export default LockedBbk
