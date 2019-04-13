// @flow
import React, { useState } from 'react'

// Hooks
import useInput from 'hooks/use-input'

// Utils
import { toWords } from 'number-to-words'
import validate from './validate'

// Components
import { Button } from '@brickblock/styleguide'
import ConfirmationDialog from './components/confirmation-dialog'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

// Styles
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ComponentType } from 'react'
import type { TransactionsT } from 'types'

type InjectedPropsT = {| classes: { [string]: string } |}

type OwnPropsT = {|
  handleCleanup: () => void,
  handleSubmit: (amount: string) => void,
  loading: boolean,
  lockedBbkBalance: string,
  unlockTransactions: TransactionsT,
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const UnlockBbkForm = (props: PropsT) => {
  const {
    classes,
    handleCleanup,
    handleSubmit,
    loading,
    lockedBbkBalance,
    unlockTransactions,
  } = props

  const hasBalance = lockedBbkBalance && lockedBbkBalance !== '0'

  const [confirmationDialogOpen, toggleConfirmationDialog] = useState(false)
  const [error, setError] = useState(null)

  const _validate = validate.bind({
    hasBalance,
    maxValue: lockedBbkBalance,
    setError,
  })

  const { value: amount, handleChange } = useInput('', { validate: _validate })

  const amountInWords: ?string =
    amount && amount.length ? toWords(parseInt(amount)) : ''

  return (
    <form
      className={classes.wrapper}
      onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (_validate(amount)) {
          toggleConfirmationDialog(true)
        }
      }}
    >
      <TextField
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <Tooltip
                title={
                  hasBalance
                    ? `How many of your ${lockedBbkBalance} locked BBK tokens do you want to unlock?`
                    : "You don't have any locked BBK tokens in your current account"
                }
              >
                <InfoOutlined color={hasBalance ? 'primary' : 'disabled'} />
              </Tooltip>
            </InputAdornment>
          ),
        }}
        className={classes.input}
        disabled={loading || !hasBalance}
        error={!!error}
        helperText={error || amountInWords}
        label="Unlock BBK Tokens"
        name="unlock-bbk-tokens"
        onChange={handleChange}
        placeholder="e.g. 1000"
        type="number"
        value={amount}
      />
      <Button
        className={classes.button}
        disabled={!hasBalance || loading}
        loading={loading}
        type="submit"
      >
        Unlock
      </Button>
      <ConfirmationDialog
        amount={amount}
        handleCleanup={handleCleanup}
        handleUnlock={handleSubmit}
        loading={loading}
        open={confirmationDialogOpen}
        toggleConfirmationDialog={toggleConfirmationDialog}
        unlockTransactions={unlockTransactions}
      />
    </form>
  )
}

UnlockBbkForm.displayName = 'UnlockBbkForm'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  UnlockBbkForm
)

export default exportedComponent
