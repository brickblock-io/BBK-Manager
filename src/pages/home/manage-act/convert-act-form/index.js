// @flow
import React, { useContext, useState } from 'react'

// Data
import { ACTContext } from 'pages/home/manage-act'

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

export const ConvertActToEthForm = (props: PropsT) => {
  const { classes } = props

  /*
   * Hooks
   */
  const {
    state,
    handleConvertActToEth: handleSubmit,
    handleCleanup,
  } = useContext(ACTContext)

  const [confirmationDialogOpen, toggleConfirmationDialog] = useState(false)
  const [error, setError] = useState(null)

  /*
   * Helpers
   */
  const {
    balance,
    convertActToEth: { loading, transactions },
  } = state

  const hasBalance =
    balance && balance.valueAsNumber && balance.valueAsNumber > 0

  const _validate = validate.bind({
    hasBalance,
    maxValue: balance,
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
                        balance && balance.value
                      )} ACT do you want to convert to ETH?`
                    : "You don't have any ACT in your current account"
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
        label="Convert ACT to ETH"
        name="convert-act-to-eth"
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
        Convert
      </Button>
      <ConfirmationDialog
        amount={amount}
        buttonText={`Convert ${amount} ACT to ETH`}
        buttonTextInProgress={`Converting ${amount} ACT to ETH...`}
        handleCleanup={handleCleanup}
        handleSubmit={handleSubmit}
        loading={loading}
        open={confirmationDialogOpen}
        successMessage={`Successfully converted ${amount} ACT tokens`}
        title={`Do you want to convert ${amount} ACT now?`}
        toggleDialog={toggleConfirmationDialog}
        transactions={transactions}
      >
        Clicking the &quot;Convert ACT to ETH&quot; button will ask you to sign
        a MetaMask transactions that will convert {amount} ACT to ETH for a
        ratio of 1000 ACT for 1 ETH.
        <br />
        <br />
        The converted ACT will be deducted from your balance after successful
        conversion into ETH.
      </ConfirmationDialog>
    </form>
  )
}

ConvertActToEthForm.displayName = 'ConvertActToEthForm'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  ConvertActToEthForm
)

exportedComponent.displayName = 'ConvertActToEthFormHOC'

export default exportedComponent
