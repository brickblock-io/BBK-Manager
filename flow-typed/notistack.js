// @flow
declare module 'notistack' {
  declare type EnqueueSnackbarT = (
    message: string,
    options?: {|
      autoHideDuration?: number,
      persist?: boolean,
      preventDuplicate?: boolean,
      variant?: 'default' | 'error' | 'success' | 'warning' | 'info',
    |}
  ) => void

  declare module.exports: {
    enqueueSnackbar: EnqueueSnackbarT,
  }
}
