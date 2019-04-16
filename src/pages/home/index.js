// @flow
import React, { useContext } from 'react'

// Data
import { Web3Context } from 'app'

// Hooks
import { useContractRegistry } from '@brickblock/web3-utils'

// Components
import Grid from '@material-ui/core/Grid'
import ManageAct from './manage-act'
import ManageBbk from './manage-bbk'
import Typography from '@material-ui/core/Typography'
import { Web3Container } from '@brickblock/styleguide'

// Styles & Assets
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ComponentType } from 'react'

type PropsT = {| classes: { [string]: string } |}

export const Home = (props: PropsT) => {
  const {
    currentAccount,
    currentProvider,
    error,
    isUnlocked,
    networkId,
    networkName,
    providerName,
  } = useContext(Web3Context)
  const { contractRegistry } = useContractRegistry(currentProvider)

  const { classes } = props

  return (
    <>
      <Typography
        align="center"
        className={classes.title}
        gutterBottom
        variant="h1"
      >
        BBK Manager
      </Typography>

      <Web3Container
        currentAccount={currentAccount}
        currentProvider={currentProvider}
        error={error}
        isUnlocked={isUnlocked}
        networkId={networkId}
        networkName={networkName}
        providerName={providerName}
      >
        <Grid container spacing={16}>
          <Grid item sm={6} xs={12}>
            <ManageBbk
              contractRegistry={contractRegistry}
              currentAccount={currentAccount}
              currentProvider={currentProvider}
              networkName={networkName}
            />
          </Grid>

          <Grid item sm={6} xs={12}>
            <ManageAct
              contractRegistry={contractRegistry}
              currentAccount={currentAccount}
              currentProvider={currentProvider}
            />
          </Grid>
        </Grid>
      </Web3Container>
    </>
  )
}

Home.displayName = 'Home'

const exportedComponent: ComponentType<{}> = withStyles(styles)(Home)

exportedComponent.displayName = 'HomeHOC'

export default exportedComponent
