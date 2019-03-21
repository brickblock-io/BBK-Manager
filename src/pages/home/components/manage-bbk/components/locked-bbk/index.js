// @flow
import React from 'react'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import UnlockBbkForm from '../unlock-bbk-form'
import Typography from '@material-ui/core/Typography'

// Types
import type { BalanceT } from '../../use-bbk-balances-of/reducer'

type PropsT = {|
  classes: { [string]: string },
  handleUnlock: (
    event: SyntheticEvent<HTMLFormElement>,
    amount: string
  ) => void,
  lockedBalance: ?BalanceT,
  unlockTokensLoading: boolean,
|}

export const LockedBbk = (props: PropsT) => {
  const { lockedBalance, classes, handleUnlock, unlockTokensLoading } = props

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
              handleSubmit={handleUnlock}
              loading={unlockTokensLoading}
              lockedBbkBalance={lockedBalance.value}
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
