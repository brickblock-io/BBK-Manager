// @flow
import React, { Fragment } from 'react'
import Web3 from 'web3'

// Hooks
import useWeb3 from '../../hooks/use-web3'
import useContractRegistry from '../../hooks/use-contract-registry'

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
  const { currentAccount, currentProvider } = useWeb3(Web3)
  const { contractRegistry } = useContractRegistry(currentProvider)

  const { classes } = props

  return (
    <Fragment>
      <Typography
        align="center"
        className={classes.title}
        gutterBottom
        variant="h1"
      >
        BBK Manager
      </Typography>

      <Web3Container>
        <Grid className={classes.root} container spacing={16}>
          <Grid item sm={6} xs={12}>
            <ManageBbk
              contractRegistry={contractRegistry}
              currentAccount={currentAccount}
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
      </Web3Container>
    </Fragment>
  )
}

Home.displayName = 'Home'

const exportedComponent: ComponentType<{}> = withStyles(styles)(Home)

exportedComponent.displayName = 'HomeHOC'

export default exportedComponent
