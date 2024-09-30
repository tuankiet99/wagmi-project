import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useWriteERC20Contract } from '../hooks/useWriteERC20Contract'

function SendTokenFormSpace3() {
  const { address } = useAccount()
  const [tokenAddress, setTokenAddress] = useState('')
  const [targetWallet, setTargetWallet] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [txHash, setTxHash] = useState('')
  const [completed, setCompleted] = useState(false)

  // const [balance, setBalance] = useState()
  // const [decimals, setDecimals] = useState()

  const { contract } = useWriteERC20Contract(tokenAddress)

  const handleSubmit = async () => {
    try {
      if (!contract) return
      const tx = await contract.transfer(
        targetWallet,
        BigInt(amount) * BigInt(Math.pow(10, 18)),
      )

      setTxHash(tx.hash)
      setCompleted(true)
      console.log('Transaction hash:', tx.hash)
    } catch (error) {
      console.error(error)
    }
  }

  // useEffect(() => {
  //   const fetchTokenDetails = async () => {
  //     if (!contract) return

  //     const balance = await contract.balanceOf(address as any)
  //     const decimals = await contract.decimals(address as any) // Decimals fn not support for IERC20, only support ERC20
  //   }
  //   fetchTokenDetails()
  // }, [])

  return (
    <div className="send-token-form">
      <h1 className="title">Send Token by Space3/Web3 SDK</h1>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <input
          type="text"
          placeholder="Token address"
          style={{ width: 400 }}
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        {/* <h4>
          Contract balance:{' '}
          {formatUnits(balance ?? 0n, decimals ?? 0)}
        </h4> */}
      </div>

      <input
        type="text"
        placeholder="Target wallet"
        style={{ width: 400 }}
        value={targetWallet}
        onChange={(e) => setTargetWallet(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={handleSubmit}>Send Token</button>

      {completed && (
        <div>
          <p>Thank you for your payment.</p>
          <p>Your tx hash: {txHash}</p>
        </div>
      )}
    </div>
  )
}

export default SendTokenFormSpace3
