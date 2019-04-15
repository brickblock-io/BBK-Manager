// @flow
import { theme } from '@brickblock/styleguide'

export const styles: { [string]: InlineStyle } = {
  spinner: {
    left: 8,
    position: 'relative',
    top: 2,
  },
  checkIcon: {
    color: theme.palette.success.main,
    left: 5,
    position: 'relative',
    top: 6,
  },
  errorIcon: {
    color: theme.palette.error.main,
    left: 5,
    position: 'relative',
    top: 6,
  },
}

export default styles
