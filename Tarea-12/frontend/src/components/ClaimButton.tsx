import { useAccount, useSignMessage } from "wagmi"
import { getMessage, signin, claimTokens, getStatus } from "../services/api"
import { useState, useEffect } from "react"

export function ClaimButton() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [loading, setLoading] = useState(false)
  const [tx, setTx] = useState<string | null>(null)
  const [hasClaimed, setHasClaimed] = useState(false)
  const [balance, setBalance] = useState<string>("0")

  useEffect(() => {
    if (address) {
      fetchStatus()
    }
  }, [address])

  const fetchStatus = async () => {
    try {
      const status = await getStatus(address!)
      setHasClaimed(status.hasClaimed)
      setBalance(status.balance)
    } catch (err: any) {
      console.error(err.message || "Error en status")
    }
  }

  const handleClaim = async () => {
    if (!address) return alert("Conecta tu wallet")
    if (hasClaimed) return alert("Ya reclamaste tokens")
    setLoading(true)
    try {
      const { message } = await getMessage(address)
      const signature = await signMessageAsync({ message })
      await signin(address, message, signature)
      const res = await claimTokens()
      setTx(res.txHash)
      alert("¡Tokens reclamados!")
      await fetchStatus()
    } catch (err: any) {
      alert(err.message || "Error en el reclamo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-header">Reclamar Tokens</h2>
      <div className="space-y-3 mb-4">
        <p className="gray-text">
          Balance actual: <span className="blue-text font-bold">{balance}</span> tokens
        </p>
        <p className={hasClaimed ? "success-text" : "gray-text"}>
          {hasClaimed ? "✅ Ya reclamaste" : "Puedes reclamar 1,000,000 tokens"}
        </p>
      </div>
      <button 
        onClick={handleClaim} 
        disabled={loading || hasClaimed || !address}
        className={`btn ${loading || hasClaimed || !address ? "" : "btn-success"}`}
      >
        <div className="flex-center">
          {loading && <div className="spinner"></div>}
          {loading ? "Procesando..." : "Reclamar Tokens"}
        </div>
      </button>
      {tx && (
        <p className="mt-4 info-box">
          Tx enviada: <a href={`https://sepolia.etherscan.io/tx/${tx}`} target="_blank" rel="noopener noreferrer" className="etherscan-link">Ver en Etherscan</a>
        </p>
      )}
    </div>
  )
}