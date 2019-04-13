// @flow
import React, { useContext } from 'react'

// Data
import { Web3Context } from 'app'

// Hooks
import { useContractRegistry } from '@brickblock/web3'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import ManageAct from './components/manage-act'
import ManageBbk from './components/manage-bbk'
import Typography from '@material-ui/core/Typography'
import { Web3Container } from '@brickblock/styleguide'

// Styles & Assets
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ComponentType } from 'react'

type PropsT = {| classes: { [string]: string } |}

export const Home = (props: PropsT) => {
  const { currentProvider, networkName } = useContext(Web3Context)
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

      <Web3Container>
        {({ currentAccount }) => (
          <Grid className={classes.root} container spacing={16}>
            <Grid item sm={6} xs={12}>
              <ManageBbk
                contractRegistry={contractRegistry}
                currentAccount={currentAccount}
                networkName={networkName}
                web3Provider={currentProvider}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <Card className={classes.wrapper}>
                <CardContent>
                  <ManageAct
                    contractRegistry={contractRegistry}
                    currentAccount={currentAccount}
                    web3Provider={currentProvider}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Web3Container>
    </>
  )
}

Home.displayName = 'Home'

const exportedComponent: ComponentType<{}> = withStyles(styles)(Home)

exportedComponent.displayName = 'HomeHOC'

export default exportedComponent
