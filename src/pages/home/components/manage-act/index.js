// @flow
import React, { Fragment } from 'react'

// Hooks
import useActBalanceOf from './use-act-balance-of'

// Utils
import reportError from 'utils/report-error'
import { truncateHash } from '@brickblock/web3-utils'

// Components
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

// Styles
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ComponentType } from 'react'
import type { AbstractContractT } from 'truffle-contract'

type InjectedPropsT = {| classes: { [string]: string } |}

type OwnPropsT = {|
  contractRegistry: ?AbstractContractT,
  currentAccount: ?string,
  web3Provider: ?mixed,
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const ManageAct = (props: PropsT) => {
  const { classes, contractRegistry, currentAccount, web3Provider } = props

  const { balance } = useActBalanceOf({
    address: currentAccount,
    contractRegistry,
    web3Provider,
  })

  if (!contractRegistry || !currentAccount || !web3Provider) {
    return 'Loading...'
  }

  if (balance && balance.error) {
    reportError(
      new Error(
        `Couldn't fetch locked ACT balance for '${truncateHash(
          currentAccount
        )}': ${String(balance.error)}`
      )
    )
  }

  return (
    <Fragment>
      <Typography gutterBottom variant="h2">
        Your ACT
      </Typography>

      {balance && !balance.error ? (
        <div className={classes.tokenSection}>
          <b>{balance.value} ACT Tokens</b>
          <Typography className={classes.balanceInWords} variant="caption">
            ({balance.valueInWords})
          </Typography>
        </div>
      ) : (
        <div className={classes.loading}>
          <CircularProgress size={30} />{' '}
        </div>
      )}
    </Fragment>
  )
}

ManageAct.displayName = 'ManageAct'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  ManageAct
)

export default exportedComponent
