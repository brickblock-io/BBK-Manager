// @flow
import React from 'react'

// Components
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Button } from '@brickblock/styleguide'
import IconButton from '@material-ui/core/IconButton'
import StyledAppBar from './components/appbar'
import StyledToolbar from './components/toolbar'

// Styles & Assets
import { withStyles } from '@material-ui/core'
import styles from './styles'
import MenuIcon from '@material-ui/icons/Menu'

// Types
import type { Node, ComponentType } from 'react'

type OwnPropsT = {|
  children: Node,
|}

type InjectedPropsT = {| classes: { [string]: string } |}

type PropsT = {| ...OwnPropsT, ...InjectedPropsT |}

export const Layout = (props: PropsT) => {
  const { children, classes } = props

  return (
    <Grid container>
      <Grid item xs={12}>
        <StyledAppBar position="static">
          <StyledToolbar>
            <IconButton aria-label="Menu" color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.grow} color="inherit" variant="h6">
              Brickblock
            </Typography>
            <Button className={classes.headerLink} variant="text">
              A Menu Link
            </Button>
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
