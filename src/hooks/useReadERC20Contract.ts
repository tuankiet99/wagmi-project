import { useMemo } from 'react'
import { IERC20 } from '@space3/web3'
import { useEthersProvider } from './ether/useEthersProvider'

export const useReadERC20Contract = (tokenAddress: string) => {
  const provider = useEthersProvider()

  const contract = useMemo(() => {
    if (!tokenAddress) return null
    return IERC20.connect(tokenAddress, provider)
  }, [provider, tokenAddress])

  return {
    contract,
    contractAddress: tokenAddress,
  }
}
