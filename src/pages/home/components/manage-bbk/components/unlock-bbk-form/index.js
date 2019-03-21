// @flow
import React from 'react'

// Hooks
import useInput from '../../../../../../hooks/use-input'

// Components
import { Button } from '@brickblock/styleguide'
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

type OwnPropsT = {|
  handleSubmit: (
    event: SyntheticEvent<HTMLFormElement>,
    amount: string
  ) => void,
  loading: boolean,
  lockedBbkBalance: string,
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const UnlockBbkForm = (props: PropsT) => {
  const { classes, handleSubmit, loading, lockedBbkBalance } = props

  const { value: amount, handleChange } = useInput()

  return (
    <form
      className={classes.wrapper}
      onSubmit={(event: SyntheticEvent<HTMLFormElement>) =>
        handleSubmit(event, amount)
      }
    >
      <TextField
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <Tooltip
                title={`How many of your ${lockedBbkBalance} locked BBK tokens do you want to unlock?`}
              >
                <InfoOutlined color="primary" />
              </Tooltip>
            </InputAdornment>
          ),
        }}
        className={classes.input}
        disabled={loading}
        label="Unlock BBK Tokens"
        name="unlock-bbk-tokens"
        onChange={handleChange}
        placeholder="e.g. 1000"
        type="number"
        value={amount}
      />
      <Button className={classes.button} loading={loading} type="submit">
        Unlock
      </Button>
    </form>
  )
}

UnlockBbkForm.displayName = 'UnlockBbkForm'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  UnlockBbkForm
)

export default exportedComponent
