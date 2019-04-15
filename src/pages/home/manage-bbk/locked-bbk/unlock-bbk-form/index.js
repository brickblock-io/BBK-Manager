// @flow
import React, { useContext, useState } from 'react'

// Data
import { BBKContext } from 'pages/home/manage-bbk'

// Hooks
import useInput from 'hooks/use-input'

// Utils
import { toWords } from 'number-to-words'
import validate from './validate'

// Components
import { Button } from '@brickblock/styleguide'
import ConfirmationDialog from './confirmation-dialog'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

// Styles
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ComponentType } from 'react'

type InjectedPropsT = {| classes: { [string]: string } |}

type OwnPropsT = {||}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const UnlockBbkForm = (props: PropsT) => {
  const { classes } = props

  const {
    balances,
    handleUnlockTokens: handleSubmit,
    handleUnlockTokensCleanup: handleCleanup,
    unlockTokensLoading: loading,
    unlockTokensTransactions: unlockTransactions,
  } = useContext(BBKContext)

  const hasBalance =
    balances.locked &&
    balances.locked.valueAsNumber &&
    balances.locked.valueAsNumber > 0

  const [confirmationDialogOpen, toggleConfirmationDialog] = useState(false)
  const [error, setError] = useState(null)

  const _validate = validate.bind({
    hasBalance,
    maxValue: balances.locked,
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
                    ? `How many of your ${String(
                        balances.locked && balances.locked.value
                      )} locked BBK tokens do you want to unlock?`
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

exportedComponent.displayName = 'UnlockBbkFormHOC'

export default exportedComponent
