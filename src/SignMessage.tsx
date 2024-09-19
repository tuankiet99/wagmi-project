import { MouseEvent, useEffect, useState } from 'react'
import { recoverMessageAddress } from 'viem'
import { useSignMessage } from 'wagmi'

function SignMessage() {
  const [message, setMessage] = useState('')
  const [recoveredAddress, setRecoveredAddress] = useState<any>()
  const {
    data: signMessageData,
    error,
    isPending,
    signMessage,
    variables,
  } = useSignMessage()

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    signMessage({ message })
  }

  useEffect(() => {
    ;(async () => {
      if (variables?.message && signMessageData) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData,
        })
        setRecoveredAddress(recoveredAddress)
      }
    })()
  }, [signMessageData, variables?.message])

  return (
    <div style={{ maxWidth: '500px' }}>
      <h1 className="title">Sign Message</h1>

      <form>
        <label htmlFor="message">Enter a message to sign</label> <hr />
        <textarea
          id="message"
          name="message"
          placeholder="Please enter the message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <hr />
        <button disabled={isPending} onClick={handleSubmit}>
          {isPending ? 'Check Wallet' : 'Sign Message'}
        </button>
      </form>

      {signMessageData && (
        <div style={{ whiteSpace: 'initial' }}>
          <div>
            <strong>Recovered Address:</strong> {recoveredAddress}
          </div>
          <hr />
          <div>
            <strong>Signature:</strong>
            <p style={{ wordWrap: 'break-word', margin: 0 }}>
              {signMessageData}
            </p>
          </div>
        </div>
      )}
      {error && <div>{error.message}</div>}
    </div>
  )
}

export default SignMessage
