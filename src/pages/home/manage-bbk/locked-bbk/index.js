// @flow
import React, { useContext } from 'react'

// Data
import { BBKContext } from 'pages/home/manage-bbk'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import UnlockBbkForm from './unlock-bbk-form'
import Typography from '@material-ui/core/Typography'

// Types
type PropsT = {|
  classes: { [string]: string },
|}

export const LockedBbk = (props: PropsT) => {
  const { classes } = props

  const { balances } = useContext(BBKContext)

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h2">
          Your Locked BBK
        </Typography>

        {balances.locked ? (
          <div className={classes.tokenSection}>
            <div className={classes.balance}>
              <b>{balances.locked.value} locked BBK Tokens</b>
              <Typography className={classes.balanceInWords} variant="caption">
                ({balances.locked.valueInWords})
              </Typography>
            </div>
            <UnlockBbkForm />
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
