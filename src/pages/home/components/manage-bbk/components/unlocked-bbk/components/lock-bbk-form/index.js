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
import type { BalanceT, TransactionsT } from 'types'

type InjectedPropsT = {| classes: { [string]: string } |}

type OwnPropsT = {|
  approveTransactions: TransactionsT,
  handleCleanup: () => void,
  handleSubmit: (amount: string) => void,
  loading: boolean,
  lockTransactions: TransactionsT,
  unlockedBbkBalance: BalanceT,
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const LockBbkForm = (props: PropsT) => {
  const {
    approveTransactions,
    classes,
    handleCleanup,
    handleSubmit,
    loading,
    lockTransactions,
    unlockedBbkBalance,
  } = props

  const hasBalance =
    unlockedBbkBalance.valueAsNumber && unlockedBbkBalance.valueAsNumber > 0

  const [confirmationDialogOpen, toggleConfirmationDialog] = useState(false)
  const [error, setError] = useState(null)

  const _validate = validate.bind({
    hasBalance,
    maxValue: unlockedBbkBalance,
    setError,
  })

  /*
   * The maxLength prop should "just work" when passed to the MUI TextField component directly...
   * ...but it doesn't: https://github.com/mui-org/material-ui/issues/1578#issuecomment-476252934
   * So we need to implement this check ourselves for the time being
   */
  const { value: amount, handleChange } = useInput('', {
    maxLength: 10,
    validate: _validate,
  })

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
                    ? `How many of your ${
                        unlockedBbkBalance.value
                      } unlocked BBK tokens do you want to lock?`
                    : "You don't have any unlocked BBK tokens in your current account"
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
        label="Lock BBK Tokens"
        name="lock-bbk-tokens"
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
        Lock
      </Button>
      <ConfirmationDialog
        amount={amount}
        approveTransactions={approveTransactions}
        handleCleanup={handleCleanup}
        handleLock={handleSubmit}
        loading={loading}
        lockTransactions={lockTransactions}
        open={confirmationDialogOpen}
        toggleConfirmationDialog={toggleConfirmationDialog}
      />
    </form>
  )
}

LockBbkForm.displayName = 'LockBbkForm'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  LockBbkForm
)

export default exportedComponent
