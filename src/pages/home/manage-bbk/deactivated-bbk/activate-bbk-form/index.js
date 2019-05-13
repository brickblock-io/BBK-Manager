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
import NumberField from 'pages/home/number-field'
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

export const ActivateBbkForm = (props: PropsT) => {
  const { classes } = props

  const {
    approveTokensTransactions: approveTransactions,
    approveTokensLoading,
    balances,
    handleActivateTokens: handleSubmit,
    handleActivateTokensCleanup: handleCleanup,
    activateTokensLoading,
    activateTokensTransactions: activateTransactions,
  } = useContext(BBKContext)

  const loading = approveTokensLoading || activateTokensLoading

  const hasBalance =
    balances.deactivated &&
    balances.deactivated.valueAsNumber &&
    balances.deactivated.valueAsNumber > 0

  const [confirmationDialogOpen, toggleConfirmationDialog] = useState(false)
  const [error, setError] = useState(null)

  const _validate = validate.bind({
    hasBalance,
    maxValue: balances.deactivated,
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
                        balances.deactivated && balances.deactivated.value
                      )} deactivated BBK tokens do you want to activate?`
                    : "You don't have any deactivated BBK tokens in your current account"
                }
              >
                <InfoOutlined color={hasBalance ? 'primary' : 'disabled'} />
              </Tooltip>
            </InputAdornment>
          ),
          inputComponent: NumberField,
        }}
        className={classes.input}
        disabled={loading || !hasBalance}
        error={!!error}
        helperText={error || amountInWords}
        label="Activate BBK Tokens"
        name="activate-bbk-tokens"
        onChange={handleChange}
        placeholder="e.g. 1000"
        value={amount}
      />
      <Button
        className={classes.button}
        disabled={!hasBalance || loading}
        loading={loading}
        type="submit"
      >
        Activate
      </Button>
      <ConfirmationDialog
        activateTransactions={activateTransactions}
        amount={amount}
        approveTransactions={approveTransactions}
        handleActivate={handleSubmit}
        handleCleanup={handleCleanup}
        loading={loading}
        open={confirmationDialogOpen}
        toggleConfirmationDialog={toggleConfirmationDialog}
      />
    </form>
  )
}

ActivateBbkForm.displayName = 'ActivateBbkForm'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  ActivateBbkForm
)

exportedComponent.displayName = 'ActivateBbkFormHOC'

export default exportedComponent
