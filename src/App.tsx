import { useMemo } from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import SendTokenForm from './SendTokenForm'
import SignMessage from './SignMessage'

function App() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balanceData } = useBalance({ address })

  const balance = useMemo(() => {
    if (!balanceData) return 0
    const decimals = balanceData.decimals
    const symbol = balanceData.symbol
    return (
      Number(BigInt(balanceData?.value)) / Math.pow(10, decimals) + ' ' + symbol
    )
  }, [balanceData])

  return (
    <div className="home-container">
      <ConnectButton />

      <div className="wallet-details">
        <h1 className="title">Wallet details</h1>
        <h3>Your wallet: {address}</h3>
        <h3>Your balance: {balance}</h3>
        <h3>Your chainId: {chainId}</h3>
      </div>

      <SendTokenForm />

      {isConnected && <SignMessage />}
    </div>
  )
}

export default App
