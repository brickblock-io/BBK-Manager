// @flow
import React from 'react'

// Components
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import { Button } from '@brickblock/styleguide'

// Styles & Assets
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ComponentType } from 'react'

type PropsT = {| classes: { [string]: string } |}

export const Home = (props: PropsT) => {
  const { classes } = props

  return (
    <Card className={classes.wrapper}>
      <CardContent>
        <Typography gutterBottom variant="h1">
          <span aria-label="Unicorn Emoji" role="img">
            {'✨ '}
          </span>
          A new beginning
          <span aria-label="Unicorn Emoji" role="img">
            {' ✨'}
          </span>
        </Typography>

        <Typography gutterBottom variant="h2">
          Fresh off the bbk devtools press!
        </Typography>
        <Typography component="div" gutterBottom variant="body1">
          <br />
          Welcome to our sexy boilerplate. And congrats on saving a huge amount
          of time.
          <br />
          This setup has everything you need to go all the way to production:
          <ul className={classes.featureList}>
            <li>Base Layout</li>
            <li>Brickblock Styleguide set up and ready to go</li>
            <li>CI Config</li>
            <li>Dockerfile</li>
            <li>Flow</li>
            <li>Eslint & Prettier Config</li>
            <li>Git hooks to save you from committing or pushing bad code</li>
            <li>Test Setup</li>
            <li>Automated CHANGELOG generation</li>
          </ul>
        </Typography>

        <br />
        <Typography variant="body1">
          <b>You can find more available components in our styleguide</b>
          <span
            aria-label="Down Arrow Emoji"
            className={classes.downArrow}
            role="img"
          >
            {'⬇️'}
          </span>
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button href="https://styleguide.brickblock.io">View Styleguide</Button>
      </CardActions>
    </Card>
  )
}

Home.displayName = 'Home'

const exportedComponent: ComponentType<{}> = withStyles(styles)(Home)

exportedComponent.displayName = 'HomeHOC'

export default exportedComponent
