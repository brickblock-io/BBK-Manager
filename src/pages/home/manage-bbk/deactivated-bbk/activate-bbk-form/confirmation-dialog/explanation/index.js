// @flow
import React from 'react'

// Types
type PropsT = {|
  amount: string,
|}

export const Explanation = (props: PropsT) => {
  const { amount } = props

  return (
    <>
      Clicking the &quot;Activate BBK&quot; button will ask you to sign{' '}
      <b>two</b> MetaMask transactions:
      <ol>
        <li>
          Approving our AccessToken contract to activate {amount} BBK tokens on
          your behalf
        </li>
        <li>
          Actually activating {amount} BBK tokens into the AccessToken contract
        </li>
      </ol>
      This 2-step process is necessary for our BrickblockToken and AccessToken
      contracts to remain ERC20-compliant. You can find more background
      information on why the first approval transaction is required in&nbsp;
      <a
        href="https://medium.com/ethex-market/erc20-approve-allow-explained-88d6de921ce9"
        rel="noopener noreferrer"
        target="_blank"
      >
        this blog post
      </a>
    </>
  )
}

Explanation.displayName = 'Explanation'

export default Explanation
