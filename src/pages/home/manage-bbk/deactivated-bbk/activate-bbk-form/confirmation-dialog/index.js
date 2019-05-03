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
import Explanation from './explanation'
import InProgress from './in-progress'
import Typography from '@material-ui/core/Typography'

// Types
import type { TransactionsT } from 'types'

type PropsT = {|
  activateTransactions: TransactionsT,
  amount: string,
  approveTransactions: TransactionsT,
  handleActivate: (amount: string) => void,
  handleCleanup: () => void,
  loading: boolean,
  open: boolean,
  toggleConfirmationDialog: boolean => void,
|}

export const ConfirmationDialog = (props: PropsT) => {
  const {
    amount,
    approveTransactions,
    handleCleanup,
    handleActivate,
    loading,
    activateTransactions,
    open,
    toggleConfirmationDialog,
  } = props

  const { networkName } = useContext(Web3Context)
  const { enqueueSnackbar } = useSnackbar()

  /*
   * FIXME: This is a little hack because something in the hooks-lifecycle is re-rendering this component twice
   * after both transactions succeeded, causing two success-snackbars to be shown. I've tried wrapping this
   * component in React.memo(), but it didn't help :-/
   */
  const [wasSuccessSnackbarShown, setWasSuccessSnackbarShown] = useState(false)

  const handleClose = () => toggleConfirmationDialog(false)

  const handleSubmit = () => handleActivate(amount)

  const currentApproveTx =
    approveTransactions && approveTransactions.find(tx => tx.current)

  const currentActivateTx =
    activateTransactions && activateTransactions.find(tx => tx.current)

  if (
    currentActivateTx &&
    currentActivateTx.status === 'success' &&
    !wasSuccessSnackbarShown
  ) {
    enqueueSnackbar(`Successfully activated ${amount} BBK tokens`, {
      variant: 'success',
    })
    setWasSuccessSnackbarShown(true)

    /*
     * Leave the dialog open a little longer so users can see the success state
     * and specifically the second checkmark icon behind the activate transaction
     * that would otherwise only flicker, feeling like an error
     */
    setTimeout(() => {
      handleClose()
      handleCleanup()
      setWasSuccessSnackbarShown(false)
    }, 3000)
  }

  return (
    <Dialog
      aria-labelledby="confirmation-dialog-title"
      disableBackdropClick
      maxWidth="sm"
      onClose={handleClose}
      open={open}
    >
      <DialogTitle disableTypography>
        <Typography variant="h2">
          Do you want to activate {amount} BBK now?
        </Typography>
      </DialogTitle>
      <DialogContent>
        {loading || currentApproveTx || currentActivateTx ? (
          <InProgress
            activateTx={currentActivateTx}
            approveTx={currentApproveTx}
            networkName={networkName}
          />
        ) : (
          <Explanation amount={amount} />
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose} variant="text">
          Cancel
        </Button>
        <Button
          disabled={
            loading ||
            (!!currentApproveTx && currentApproveTx.status === 'pending') ||
            (!!currentActivateTx && currentActivateTx.status === 'pending')
          }
          loading={loading}
          onClick={
            currentActivateTx && currentActivateTx.status === 'success'
              ? handleClose
              : handleSubmit
          }
        >
          {/* Before sending the transactions */}
          {!currentApproveTx && !currentActivateTx && `Activate ${amount} BBK`}

          {/* During the approval transaction  */}
          {currentApproveTx &&
            !currentActivateTx &&
            `Approving ${amount} BBK...`}

          {/* During the activating transaction  */}
          {currentActivateTx &&
            currentActivateTx.status === 'pending' &&
            `Activating ${amount} BBK...`}

          {/* After activating transaction succeeded */}
          {currentActivateTx &&
            currentActivateTx.status === 'success' &&
            'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmationDialog.displayName = 'ConfirmationDialog'

export default ConfirmationDialog
