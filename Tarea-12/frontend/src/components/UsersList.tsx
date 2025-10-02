import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { getStatus, getToken } from "../services/api"

export function UsersList() {
  const { address } = useAccount()
  const [users, setUsers] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address || !getToken()) {
      setUsers([])
      setError(null)
      return
    }
    getStatus(address)
      .then((res) => setUsers(res.users || []))
      .catch((err: any) => {
        setError(err.message)
        console.error(err)
      })
  }, [address])

  if (!address) return (
    <div className="card">
      <h3 className="card-header">Usuarios del Faucet</h3>
      <p className="gray-text">Conecta tu wallet para ver usuarios</p>
    </div>
  )
  if (!getToken()) return (
    <div className="card">
      <h3 className="card-header">Usuarios del Faucet</h3>
      <p className="warning-text">Firma el mensaje para ver la lista completa</p>
    </div>
  )
  if (error) return (
    <div className="card">
      <h3 className="card-header">Usuarios del Faucet</h3>
      <p className="error-box">{error}</p>
    </div>
  )

  return (
    <div className="card">
      <h3 className="card-header">Usuarios del Faucet ({users.length})</h3>
      <div className="users-list">
        <ul>
          {users.length > 0 ? (
            users.map((u) => (
              <li key={u}>{u}</li>
            ))
          ) : (
            <li className="empty-list">No hay usuarios aún</li>
          )}
        </ul>
      </div>
    </div>
  )
}