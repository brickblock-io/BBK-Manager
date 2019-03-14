// @flow
import type { Theme } from '@material-ui/core'

type StylesT = Theme => { [string]: InlineStyle }
const styles: StylesT = theme => ({
  contentWrapper: {
    margin: '0 auto',
    maxWidth: 1200,
    padding: '1.5rem',
  },
  headerLink: {
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
  },
  grow: {
    flexGrow: 1,
  },
})

export default styles
