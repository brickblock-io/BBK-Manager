// @flow
import React, { useContext } from 'react'

// Data
import { BBKContext } from 'pages/home/manage-bbk'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import ActivateBbkForm from './activate-bbk-form'
import Typography from '@material-ui/core/Typography'

// Types
type PropsT = {|
  classes: { [string]: string },
|}

export const DeactivatedBbk = (props: PropsT) => {
  const { classes } = props

  const { balances } = useContext(BBKContext)

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h2">
          Activate BBK
        </Typography>

        {balances.deactivated ? (
          <div className={classes.tokenSection}>
            <div className={classes.balance}>
              <b>{balances.deactivated.value} inactive BBK Tokens</b>
              <Typography className={classes.balanceInWords} variant="caption">
                ({balances.deactivated.valueInWords})
              </Typography>
            </div>
            <ActivateBbkForm />
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

DeactivatedBbk.displayName = 'ActivatedBbk'

export default DeactivatedBbk
