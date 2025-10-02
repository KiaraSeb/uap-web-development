const API_URL = "http://localhost:4000"

let token: string | null = null

export const setToken = (t: string): void => {
  token = t
  localStorage.setItem('jwt', t)
}

export const getToken = (): string | null => token

export const loadTokenFromStorage = (): void => {
  const stored = localStorage.getItem('jwt')
  if (stored) {
    token = stored
  }
}

interface AuthMessageResponse { message: string }
interface AuthSigninResponse { token: string; address: string }
interface FaucetClaimResponse { txHash: string; success: boolean }
interface FaucetStatusResponse { hasClaimed: boolean; balance: string; users: string[]; amount?: string }

const apiFetch = async (url: string, options: RequestInit = {}) => {
  const mergedOptions: RequestInit = {
    mode: 'cors',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }

  const res = await fetch(url, mergedOptions)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Error HTTP ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export async function getMessage(address: string): Promise<AuthMessageResponse> {
  const body = JSON.stringify({ address })
  const data = await apiFetch(`${API_URL}/auth/message`, { method: 'POST', body })
  return data
}

export async function signin(address: string, message: string, signature: string): Promise<AuthSigninResponse> {
  const body = JSON.stringify({ address, message, signature })
  const data = await apiFetch(`${API_URL}/auth/signin`, { method: 'POST', body })
  if (data.token) setToken(data.token)
  return data
}

export async function claimTokens(): Promise<FaucetClaimResponse> {
  if (!getToken()) throw new Error('No hay token de autenticación. Firma primero.')
  return apiFetch(`${API_URL}/faucet/claim`, { method: 'POST' })
}

export async function getStatus(address: string): Promise<FaucetStatusResponse> {
  if (!getToken()) throw new Error('No hay token de autenticación. Firma primero.')
  return apiFetch(`${API_URL}/faucet/status/${address}`)
}