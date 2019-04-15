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
import type { TransactionsT } from 'types'

type PropsT = {|
  amount: string,
  handleCleanup: () => void,
  handleUnlock: (amount: string) => void,
  loading: boolean,
  open: boolean,
  toggleConfirmationDialog: boolean => void,
  unlockTransactions: TransactionsT,
|}

export const ConfirmationDialog = (props: PropsT) => {
  const {
    amount,
    handleCleanup,
    handleUnlock,
    loading,
    unlockTransactions,
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

  const handleSubmit = () => handleUnlock(amount)

  const currentUnlockTx = unlockTransactions.find(tx => tx.current)

  if (
    currentUnlockTx &&
    currentUnlockTx.status === 'success' &&
    !wasSuccessSnackbarShown
  ) {
    enqueueSnackbar(`Successfully unlocked ${amount} BBK tokens`, {
      variant: 'success',
    })
    setWasSuccessSnackbarShown(true)

    /*
     * Leave the dialog open a little longer so users can see the success state
     * of the unlock transaction that would otherwise only flicker, feeling like an error
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
          Do you want to unlock {amount} BBK now?
        </Typography>
      </DialogTitle>
      <DialogContent>
        {loading || currentUnlockTx ? (
          <InProgress networkName={networkName} unlockTx={currentUnlockTx} />
        ) : (
          <>
            Clicking the &quot;Unlock BBK&quot; button will ask you to sign a
            MetaMask transactions that will unlock {amount} BBK tokens from the
            AccessToken contract back into your current account.
            <br />
            <br />
            Unlocked BBK tokens can be freely transferred, but will no longer
            generate ACT tokens.
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose} variant="text">
          Cancel
        </Button>
        <Button
          disabled={
            loading ||
            (!!currentUnlockTx && currentUnlockTx.status === 'pending')
          }
          loading={loading}
          onClick={handleSubmit}
        >
          {/* Before sending the transaction */}
          {!currentUnlockTx && `Unlock ${amount} BBK`}

          {/* During the transaction  */}
          {currentUnlockTx &&
            currentUnlockTx.status === 'pending' &&
            `Unlocking ${amount} BBK...`}

          {/* After transaction succeeded */}
          {currentUnlockTx && currentUnlockTx.status === 'success' && 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmationDialog.displayName = 'ConfirmationDialog'

export default ConfirmationDialog
