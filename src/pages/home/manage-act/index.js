// @flow
import React from 'react'

// Data
import useAct from './use-act'
import { initialState } from './use-act/reducer'

// Utils
import reportError from 'utils/report-error'
import { truncateHash } from '@brickblock/web3-utils'
import { useSnackbar } from 'notistack'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import SellActForEthForm from './sell-act-for-eth-form'
import Typography from '@material-ui/core/Typography'

// Styles
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ACTContextT } from './use-act'
import type { ComponentType } from 'react'
import type { AbstractContractT } from 'truffle-contract'
import type { CurrentProviderT } from 'types'

export const ACTContext = React.createContext<ACTContextT>({
  handleSellActForEth: () => {},
  handleCleanup: () => {},
  state: initialState,
})

type InjectedPropsT = {| classes: { [string]: string } |}

type OwnPropsT = {|
  contractRegistry: ?AbstractContractT,
  currentAccount: ?string,
  currentProvider: ?CurrentProviderT,
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const ManageAct = (props: PropsT) => {
  const { classes, contractRegistry, currentAccount, currentProvider } = props

  const actContext = useAct({
    address: currentAccount,
    contractRegistry,
    currentProvider,
  })

  const {
    state: { balance, sellActForEth },
  } = actContext
  const { enqueueSnackbar } = useSnackbar()

  if (!contractRegistry || !currentAccount || !currentProvider) {
    return 'Loading...'
  }

  if (balance && balance.error) {
    enqueueSnackbar(balance.error, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't fetch ACT balance for '${truncateHash(
          currentAccount
          // $FlowIgnore because we're checking for existence of balance.error above
        )}': ${String(balance.error)}`
      )
    )
  }

  if (sellActForEth.error) {
    enqueueSnackbar(sellActForEth.error, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't sell ACT for '${truncateHash(currentAccount)}': ${String(
          sellActForEth.error
        )}`
      )
    )
  }

  return (
    <ACTContext.Provider value={actContext}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h2">
            Your ACT
          </Typography>

          {balance && !balance.error ? (
            <div className={classes.tokenSection}>
              <div className={classes.balance}>
                <b>{balance.value} ACT Tokens</b>
                <Typography
                  className={classes.balanceInWords}
                  variant="caption"
                >
                  ({balance.valueInWords})
                </Typography>
              </div>
              <SellActForEthForm />
            </div>
          ) : (
            <div className={classes.loading}>
              <CircularProgress size={30} />
            </div>
          )}
        </CardContent>
      </Card>
    </ACTContext.Provider>
  )
}

ManageAct.displayName = 'ManageAct'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  ManageAct
)

export default exportedComponent
