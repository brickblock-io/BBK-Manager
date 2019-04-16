// @flow
import React, { useContext, useState } from 'react'

// Data
import { Web3Context } from 'app'

// Utils
import { useSnackbar } from 'notistack'

// Components
import { Button } from '@brickblock/styleguide'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import InProgress from './in-progress'
import Typography from '@material-ui/core/Typography'

// Types
import type { Node } from 'react'
import type { TransactionsT } from 'types'

type PropsT = {|
  amount: string,
  buttonText: string,
  buttonTextInProgress: string,
  children: Node,
  handleCleanup: () => void,
  handleSubmit: (amount: string) => void,
  loading: boolean,
  open: boolean,
  successMessage: string,
  title: string,
  toggleDialog: boolean => void,
  transactions: TransactionsT,
|}

export const ConfirmationDialog = React.memo<PropsT>((props: PropsT) => {
  const {
    amount,
    buttonText,
    buttonTextInProgress,
    children,
    handleCleanup,
    handleSubmit,
    loading,
    open,
    successMessage,
    title,
    toggleDialog,
    transactions,
  } = props

  const { networkName } = useContext(Web3Context)
  const { enqueueSnackbar } = useSnackbar()

  /*
   * FIXME: This boolean is necessary to avoid calling the cleanup functions multiple times
   * Something is causing this component to re-render 2 or 3 times after the transaction
   * succeeds. I couldn't figure out what, tried wrapping the component in React.memo()
   * which also didn't help ¯\_(ツ)_/¯
   */
  const [isCleanedUp, setCleanedUp] = useState(false)

  const currentTx = transactions.find(tx => tx.current)

  if (currentTx && currentTx.status === 'success' && !isCleanedUp) {
    enqueueSnackbar(successMessage, { variant: 'success' })

    /*
     * Leave the dialog open a little longer so users can see the success state
     * that would otherwise only flicker, feeling like an error
     */
    setTimeout(() => {
      toggleDialog(false)
      handleCleanup()
    }, 3000)
    setCleanedUp(true)
  }

  return (
    <Dialog
      aria-labelledby="confirmation-dialog-title"
      disableBackdropClick
      maxWidth="sm"
      onClose={() => toggleDialog(false)}
      open={open}
    >
      <DialogTitle disableTypography>
        <Typography variant="h2">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        {loading || currentTx ? (
          <InProgress
            networkName={networkName}
            transaction={currentTx}
            transactionTitle={buttonText}
          />
        ) : (
          <>{children}</>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={loading}
          onClick={() => {
            toggleDialog(false)
          }}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          disabled={loading || (!!currentTx && currentTx.status === 'pending')}
          loading={loading}
          onClick={() => handleSubmit(amount)}
        >
          {/* Before sending the transaction */}
          {!currentTx && buttonText}

          {/* During the transaction  */}
          {currentTx && currentTx.status === 'pending' && buttonTextInProgress}

          {/* After transaction succeeded */}
          {currentTx && currentTx.status === 'success' && 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

ConfirmationDialog.displayName = 'ConfirmationDialog'

export default ConfirmationDialog
