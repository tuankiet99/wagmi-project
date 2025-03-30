import { useState } from 'react'
import {
  useAccount,
  useConnect,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { sepolia } from 'viem/chains'
import { injected } from 'wagmi/connectors'
import { erc20Abi, formatUnits } from 'viem'

function SendTokenForm() {
  const { address } = useAccount()

  const { connectAsync } = useConnect()
  const { writeContractAsync } = useWriteContract()

  const [tokenAddress, setTokenAddress] = useState('')
  const [targetWallet, setTargetWallet] = useState('')
  const [amount, setAmount] = useState<number>(0)

  const [txHash, setTxHash] = useState('')
  const [completed, setCompleted] = useState(false)

  const { data: contractBalance } = useReadContract({
    address: tokenAddress as any,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as any],
  })

  const { data: contractDecimals } = useReadContract({
    address: tokenAddress as any,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  const { data: contractSymbol } = useReadContract({
    address: tokenAddress as any,
    abi: erc20Abi,
    functionName: 'symbol',
  })

  const handleSubmit = async () => {
    try {
      if (!address) {
        await connectAsync({ chainId: sepolia.id, connector: injected() })
      }

      const data = await writeContractAsync({
        chainId: sepolia.id,
        address: tokenAddress as any,
        functionName: 'transfer',
        abi: [
          {
            inputs: [
              { internalType: 'address', name: 'recipient', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        args: [targetWallet as any, BigInt(amount) * BigInt(Math.pow(10, 18))],
      })
      setCompleted(true)
      setTxHash(data)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="send-token-form">
      <h1 className="title">Send Token</h1>

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
        <h4>
          Contract balance:{' '}
          {formatUnits(contractBalance ?? 0n, contractDecimals ?? 0)}{' '}
          {contractSymbol}
        </h4>
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

export default SendTokenForm
