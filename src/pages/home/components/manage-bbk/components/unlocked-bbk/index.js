// @flow
import React from 'react'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import LockBbkForm from '../lock-bbk-form'
import Typography from '@material-ui/core/Typography'

// Types
import type { BalanceT } from '../../use-bbk-balances-of/reducer'

type PropsT = {|
  classes: { [string]: string },
  handleLock: (event: SyntheticEvent<HTMLFormElement>, amount: string) => void,
  lockTokensLoading: boolean,
  unlockedBalance: ?BalanceT,
|}

export const UnlockedBbk = (props: PropsT) => {
  const { unlockedBalance, classes, handleLock, lockTokensLoading } = props

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
              handleSubmit={handleLock}
              loading={lockTokensLoading}
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
