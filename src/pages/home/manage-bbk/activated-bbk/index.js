// @flow
import React, { useContext } from 'react'

// Data
import { BBKContext } from 'pages/home/manage-bbk'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeactivateBbkForm from './deactivate-bbk-form'
import Typography from '@material-ui/core/Typography'

// Types
type PropsT = {|
  classes: { [string]: string },
|}

export const ActivatedBbk = (props: PropsT) => {
  const { classes } = props

  const { balances } = useContext(BBKContext)

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h2">
          Deactivate BBK
        </Typography>

        {balances.activated ? (
          <div className={classes.tokenSection}>
            <div className={classes.balance}>
              <b>{balances.activated.value} active BBK Tokens</b>
              <Typography className={classes.balanceInWords} variant="caption">
                ({balances.activated.valueInWords})
              </Typography>
            </div>
            <DeactivateBbkForm />
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

ActivatedBbk.displayName = 'ActivatedBbk'

export default ActivatedBbk
