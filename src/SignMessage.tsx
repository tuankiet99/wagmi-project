import { MouseEvent, useState } from 'react'
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
  } = useSignMessage()
  const [signature, setSignature] = useState('')

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    signMessage({ message })
  }

  const handleRecoverAddress = async () => {
    if (message && signature) {
      const recoveredAddress = await recoverMessageAddress({
        message,
        signature: signature as any,
      })
      setRecoveredAddress(recoveredAddress)
    }
  }

  return (
    <div style={{ maxWidth: '600px' }}>
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
            <strong>Signature:</strong>
            <p style={{ wordWrap: 'break-word', margin: 0 }}>
              {signMessageData}
            </p>
          </div>
          <hr />
          <label htmlFor="signature">
            Enter the signature to recover address
          </label>
          <textarea
            id="signature"
            style={{ width: 500, height: 100 }}
            placeholder="Please enter the signature"
            onChange={(e) => setSignature(e.target.value)}
          />
          <button onClick={handleRecoverAddress}>Recover Address</button>
          {recoveredAddress && (
            <div>
              <strong>Recovered Address:</strong> {recoveredAddress}
            </div>
          )}
        </div>
      )}
      {error && <div>{error.message}</div>}
    </div>
  )
}

export default SignMessage
