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
import ConfirmationDialog from 'components/confirmation-dialog'
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

export const DeactivateBbkForm = (props: PropsT) => {
  const { classes } = props

  const {
    balances,
    handleDeactivateTokens: handleSubmit,
    handleDeactivateTokensCleanup: handleCleanup,
    deactivateTokensLoading: loading,
    deactivateTokensTransactions: transactions,
  } = useContext(BBKContext)

  const hasBalance =
    balances.activated &&
    balances.activated.valueAsNumber &&
    balances.activated.valueAsNumber > 0

  const [confirmationDialogOpen, toggleConfirmationDialog] = useState(false)
  const [error, setError] = useState(null)

  const _validate = validate.bind({
    hasBalance,
    maxValue: balances.activated,
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
                        balances.activated && balances.activated.value
                      )} activated BBK tokens do you want to deactivate?`
                    : "You don't have any activated BBK tokens in your current account"
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
        label="Deactivate BBK Tokens"
        name="deactivate-bbk-tokens"
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
        Deactivate
      </Button>
      <ConfirmationDialog
        amount={amount}
        buttonText={`Deactivate ${amount} BBK`}
        buttonTextInProgress={`Deactivating ${amount} BBK...`}
        handleCleanup={handleCleanup}
        handleSubmit={handleSubmit}
        loading={loading}
        open={confirmationDialogOpen}
        successMessage={`Successfully deactivated ${amount} BBK tokens`}
        title={`Do you want to deactivate ${amount} BBK now?`}
        toggleDialog={toggleConfirmationDialog}
        transactions={transactions}
      >
        Clicking the &quot;Deactivate&quot; button will ask you to sign a
        MetaMask transactions that will deactivate {amount} BBK tokens from the
        AccessToken contract back into your current account.
        <br />
        <br />
        Deactivated BBK tokens can be freely transferred, but will no longer
        generate ACT tokens.
      </ConfirmationDialog>
    </form>
  )
}

DeactivateBbkForm.displayName = 'DeactivateBbkForm'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  DeactivateBbkForm
)

exportedComponent.displayName = 'DeactivateBbkFormHOC'

export default exportedComponent
