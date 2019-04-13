// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

// eslint-disable-next-line jest/expect-expect
test('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
