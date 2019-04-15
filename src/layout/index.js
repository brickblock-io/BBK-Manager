// @flow
import React, { useContext } from 'react'

// Data
import { Web3Context } from 'app'

// Utils
import { etherscanAddressLink, truncateHash } from '@brickblock/web3-utils'

// Components
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Button } from '@brickblock/styleguide'
import StyledAppBar from './components/appbar'
import StyledToolbar from './components/toolbar'

// Styles & Assets
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { Node, ComponentType } from 'react'

type OwnPropsT = {|
  children: Node,
|}

type InjectedPropsT = {| classes: { [string]: string } |}

type PropsT = {| ...OwnPropsT, ...InjectedPropsT |}

export const Layout = (props: PropsT) => {
  const { children, classes } = props

  const { currentAccount, networkName } = useContext(Web3Context)

  return (
    <Grid container>
      <Grid item xs={12}>
        <StyledAppBar position="static">
          <StyledToolbar>
            <Typography className={classes.grow} color="inherit" variant="h6">
              Brickblock
            </Typography>

            {currentAccount && networkName ? (
              <Button
                className={classes.headerLink}
                href={etherscanAddressLink(currentAccount, networkName)}
                variant="text"
              >
                Current Account:&nbsp;
                {currentAccount !== 'loading'
                  ? truncateHash(currentAccount)
                  : 'loading...'}
              </Button>
            ) : (
              `No Active Ethereum Account`
            )}
          </StyledToolbar>
        </StyledAppBar>

        <div className={classes.contentWrapper}>{children}</div>
      </Grid>
    </Grid>
  )
}

Layout.displayName = 'Layout'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(Layout)

exportedComponent.displayName = 'LayoutHOC'

export default exportedComponent
