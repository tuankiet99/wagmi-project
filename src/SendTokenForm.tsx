import { useState } from 'react'
import {
  useAccount,
  useChainId,
  useConnect,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { sepolia } from 'viem/chains'
import { injected } from 'wagmi/connectors'
import { erc20Abi } from 'viem'

function SendTokenForm() {
  const { address } = useAccount()

  const { connectAsync } = useConnect()
  const { writeContractAsync } = useWriteContract()

  const [tokenAddress, setTokenAddress] = useState('')
  const [targetWallet, setTargetWallet] = useState('')
  const [amount, setAmount] = useState<number>(0)

  const [txHash, setTxHash] = useState('')
  const [completed, setCompleted] = useState(false)

  //NOTE: có thể do contract ko có method balanceOf nên không thể lấy ra được balanceOf
  const { data: contractBalance } = useReadContract({
    address: address as any,
    abi: [
      {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'balanceOf',
    args: [tokenAddress as any],
  })

  console.log({ contractBalance })

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
        }}
      >
        <input
          type="text"
          placeholder="Token address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <h4>Contract balance: {contractBalance?.toString()}</h4>
      </div>

      <input
        type="text"
        placeholder="Target wallet"
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
