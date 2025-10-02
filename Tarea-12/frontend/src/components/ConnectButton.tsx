import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { useState } from "react"

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connectAsync } = useConnect()
  const { disconnect } = useDisconnect()
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setError(null)
    try {
      await connectAsync({ connector: injected({ target: "metaMask" }) })
    } catch (err: any) {
      console.error(err)
      if (err.name === "ProviderNotFoundError") {
        setError("MetaMask no detectado. Instálalo desde metamask.io")
      } else {
        setError("Error al conectar: " + (err.message || "Intenta de nuevo"))
      }
    }
  }

  return (
    <div className="card">
      <h2 className="card-header">Conexión de Wallet</h2>
      {isConnected ? (
        <div className="space-y-3">
          <p className="success-text font-medium">
            ✅ Conectado: <span className="break-all">{address}</span>
          </p>
          <button 
            onClick={() => disconnect()} 
            className="btn btn-danger"
          >
            Desconectar
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button 
            onClick={handleConnect}
            className="btn btn-primary"
          >
            Conectar MetaMask
          </button>
          {error && <p className="error-box">{error}</p>}
        </div>
      )}
    </div>
  )
}