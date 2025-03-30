import { useState } from 'react'
import { encodeFunctionData, erc20Abi, formatUnits } from 'viem'

import { publicClient } from '../../configs/viem.config'
import { useAccount, useReadContract } from 'wagmi'

function Multicall() {
  const { address } = useAccount()
  const [calldata, setCalldata] = useState<string | null>(null)

  const [walletAddresses] = useState<`0x${string}`[]>([
    '0xad9Fb88E511e18454488DD27857621AbF278E088',
    '0xD17De0FE540580c91c362D1b7D3bce6133d17aC8',
    '0x8633417CD928878518A933baCE45415eF1a367Ff',
  ])
  const [tokenAddress, setTokenAddress] = useState<`0x${string}`>()
  const { data: contractDecimals } = useReadContract({
    address: tokenAddress as any,
    abi: erc20Abi,
    functionName: 'decimals',
  })
  const [balances, setBalances] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGetCalldata = () => {
    if (!address) return

    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    })
    setCalldata(data)
  }

  const handleGetBalances = async () => {
    try {
      if (!tokenAddress) {
        return setError('Token address is not set')
      }

      const calls = walletAddresses.map((wallet) => ({
        abi: erc20Abi,
        functionName: 'balanceOf',
        address: tokenAddress,
        args: [wallet],
      }))

      const results = await publicClient.multicall({
        contracts: calls,
      })
      const decodedBalances = results.map((result) => result.result?.toString())

      setBalances(decodedBalances as string[])
      setError(null)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Calldata & Multicall</h1>
      <h4 style={{ textAlign: 'center' }}>Only get balance from Sepolia</h4>

      <div style={{ textAlign: 'center' }}>
        <h3>
          Calldata <b>BalanceOf</b>
        </h3>
        <button onClick={handleGetCalldata}>Get Calldata</button>
        {calldata && <p>Calldata: {calldata}</p>}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3>Multicall Get BalanceOf</h3>
        <div>
          <input
            style={{ width: 400, marginBottom: 10 }}
            type="text"
            placeholder="Enter token address"
            onChange={(e) => setTokenAddress(e.target.value as `0x${string}`)}
          />
          <br />

          <button onClick={handleGetBalances}>Get Balances</button>
        </div>

        {balances.length > 0 && (
          <ul>
            {balances.map((balance, idx) => (
              <li key={idx}>
                Wallet {walletAddresses[idx]}:{' '}
                {formatUnits(
                  (balance as unknown as bigint) ?? 0n,
                  contractDecimals ?? 0,
                )}
              </li>
            ))}
          </ul>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  )
}

export default Multicall
