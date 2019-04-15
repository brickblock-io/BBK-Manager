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
  amount: string,
  approveTransactions: TransactionsT,
  handleCleanup: () => void,
  handleLock: (amount: string) => void,
  loading: boolean,
  lockTransactions: TransactionsT,
  open: boolean,
  toggleConfirmationDialog: boolean => void,
|}

export const ConfirmationDialog = (props: PropsT) => {
  const {
    amount,
    approveTransactions,
    handleCleanup,
    handleLock,
    loading,
    lockTransactions,
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

  const handleSubmit = () => handleLock(amount)

  const currentApproveTx =
    approveTransactions && approveTransactions.find(tx => tx.current)

  const currentLockTx =
    lockTransactions && lockTransactions.find(tx => tx.current)

  if (
    currentLockTx &&
    currentLockTx.status === 'success' &&
    !wasSuccessSnackbarShown
  ) {
    enqueueSnackbar(`Successfully locked ${amount} BBK tokens`, {
      variant: 'success',
    })
    setWasSuccessSnackbarShown(true)

    /*
     * Leave the dialog open a little longer so users can see the success state
     * and specifically the second checkmark icon behind the lock transaction
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
          Do you want to lock {amount} BBK now?
        </Typography>
      </DialogTitle>
      <DialogContent>
        {loading || currentApproveTx || currentLockTx ? (
          <InProgress
            approveTx={currentApproveTx}
            lockTx={currentLockTx}
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
            (!!currentLockTx && currentLockTx.status === 'pending')
          }
          loading={loading}
          onClick={
            currentLockTx && currentLockTx.status === 'success'
              ? handleClose
              : handleSubmit
          }
        >
          {/* Before sending the transactions */}
          {!currentApproveTx && !currentLockTx && `Lock ${amount} BBK`}

          {/* During the approval transaction  */}
          {currentApproveTx && !currentLockTx && `Approving ${amount} BBK...`}

          {/* During the locking transaction  */}
          {currentLockTx &&
            currentLockTx.status === 'pending' &&
            `Locking ${amount} BBK...`}

          {/* After locking transaction succeeded */}
          {currentLockTx && currentLockTx.status === 'success' && 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmationDialog.displayName = 'ConfirmationDialog'

export default ConfirmationDialog
