// @flow
import { theme } from '@brickblock/styleguide'

export const styles: { [string]: { [string]: InlineStyle } } = {
  '@global': {
    'html, body': {
      backgroundColor: theme.palette.common.offWhite,
      color: theme.palette.text.primary,
      fontFamily: 'Source Sans Pro, sans-serif',
      minHeight: '100%',
      textRendering: 'optimizeLegibility',
      width: '100%',
    },
  },
}

export default styles
