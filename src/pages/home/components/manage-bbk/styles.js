// @flow
import { theme } from '@brickblock/styleguide'

type StylesT = { [string]: InlineStyle }

const styles: StylesT = {
  card: {
    marginBottom: '1rem',
  },
  loading: {
    margin: '1rem 0',
  },
  tokenSection: {
    lineHeight: 0.8,
    margin: '1rem 0',

    // $FlowIgnore because 'InlineStyle' types don't support nesting
    '&:last-child': {
      marginBottom: 0,
    },
  },
  balance: {
    marginBottom: '1rem',
  },
  balanceInWords: {
    color: theme.palette.text.hint,
    fontSize: 14,
    fontWeight: 400,
  },
}

export default styles
