import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { getStatus, getToken } from "../services/api"

export function FaucetStatus() {
  const { address } = useAccount()
  const [status, setStatus] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address || !getToken()) {
      setStatus(null)
      setError(null)
      return
    }
    getStatus(address)
      .then(setStatus)
      .catch((err: any) => {
        setError(err.message)
        console.error(err)
      })
  }, [address])

  if (!address) return (
    <div className="card">
      <h2 className="card-header">Estado del Faucet</h2>
      <p className="gray-text">Conecta tu wallet primero</p>
    </div>
  )
  if (!getToken()) return (
    <div className="card">
      <h2 className="card-header">Estado del Faucet</h2>
      <p className="warning-text">Firma el mensaje para ver tu estado completo</p>
    </div>
  )
  if (error) return (
    <div className="card">
      <h2 className="card-header">Estado del Faucet</h2>
      <p className="error-box">{error}</p>
    </div>
  )
  if (!status) return (
    <div className="card">
      <h2 className="card-header">Estado del Faucet</h2>
      <p className="gray-text">Cargando estado...</p>
    </div>
  )

  return (
    <div className="card">
      <h2 className="card-header">Estado del Faucet</h2>
      <div className="space-y-3">
        <p className={`flex-center ${status.hasClaimed ? "success-text" : "gray-text"}`}>
          {status.hasClaimed ? "✅ Sí" : "❌ No"} ¿Ya reclamó?
        </p>
        <p className="gray-text">Balance: <span className="blue-text font-bold">{status.balance}</span> tokens</p>
        {status.amount && <p className="gray-text">Cantidad por reclamo: {status.amount} tokens</p>}
      </div>
    </div>
  )
}