import { useMemo } from 'react'
import {
  useAccount,
  useBalance,
  useChainId,
  useClient,
  useConnectorClient,
} from 'wagmi'

import { ConnectButton } from '@rainbow-me/rainbowkit'

function App() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { data } = useBalance({
    address,
  })
  const connectorClient = useConnectorClient()
  const client = useClient()
  console.log({ client: client })
  console.log({ connectorClient: connectorClient.data })

  const balance = useMemo(() => {
    if (!data) return 0
    const decimals = data.decimals
    const symbol = data.symbol
    return Number(BigInt(data?.value)) / Math.pow(10, decimals) + ' ' + symbol
  }, [data])

  return (
    <div className="home-container">
      <ConnectButton />

      <div>
        <h2>Your wallet is: {address}</h2>
        <h2>Your balance is: {balance}</h2>
        <h2>Your chainId is: {chainId}</h2>
      </div>
    </div>
  )
}

export default App
