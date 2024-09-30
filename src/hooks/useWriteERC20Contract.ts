import { useMemo } from 'react'
import { IERC20 } from '@space3/web3'
import { useEthersSigner } from './ether/useEthersSigner'

export const useWriteERC20Contract = (tokenAddress: string) => {
  const signer = useEthersSigner()

  const contract = useMemo(() => {
    if (!tokenAddress) return null
    return IERC20.connect(tokenAddress, signer)
  }, [signer, tokenAddress])

  return {
    contract,
  }
}
