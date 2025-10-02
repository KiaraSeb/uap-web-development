import React, { useEffect } from "react"  
import ReactDOM from "react-dom/client"
import { QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/wagmi'
import { queryClient } from './lib/queryClient'
import { loadTokenFromStorage } from './services/api'  
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <App />
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
)


useEffect(() => {
  loadTokenFromStorage()
}, [])