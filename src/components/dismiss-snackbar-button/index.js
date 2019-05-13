// @flow
import React from 'react'

// Hooks
import { useSnackbar } from 'notistack'

// Components
import { Button } from '@brickblock/styleguide'

// Types
type PropsT = {|
  id: string,
|}

export const DismissSnackbarButton = (props: PropsT) => {
  const { id } = props
  const { closeSnackbar } = useSnackbar()

  return (
    <Button
      onClick={() => closeSnackbar(id)}
      size="small"
      style={{ color: 'white' }}
      variant="text"
    >
      {'Dismiss'}
    </Button>
  )
}

DismissSnackbarButton.displayName = 'DismissSnackbarButton'

export default DismissSnackbarButton
