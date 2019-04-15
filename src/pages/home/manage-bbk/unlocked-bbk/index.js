// @flow
import React, { useContext } from 'react'

// Data
import { BBKContext } from 'pages/home/manage-bbk'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import LockBbkForm from './lock-bbk-form'
import Typography from '@material-ui/core/Typography'

// Types
type PropsT = {|
  classes: { [string]: string },
|}

export const UnlockedBbk = (props: PropsT) => {
  const { classes } = props

  const { balances } = useContext(BBKContext)

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h2">
          Your Unlocked BBK
        </Typography>

        {balances.unlocked ? (
          <div className={classes.tokenSection}>
            <div className={classes.balance}>
              <b>{balances.unlocked.value} unlocked BBK Tokens</b>
              <Typography className={classes.balanceInWords} variant="caption">
                ({balances.unlocked.valueInWords})
              </Typography>
            </div>
            <LockBbkForm />
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
