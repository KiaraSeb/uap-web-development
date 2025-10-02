import { ConnectButton } from "./components/ConnectButton"
import { ClaimButton } from "./components/ClaimButton"
import { FaucetStatus } from "./components/FaucetStatus"
import { UsersList } from "./components/UsersList"

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🚰 Faucet App</h1>
          <p className="text-lg text-gray-600">Conecta tu wallet y reclama tokens en Sepolia</p>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-6">
            <ConnectButton />
            <ClaimButton />
          </section>
          <section className="space-y-6">
            <FaucetStatus />
            <UsersList />
          </section>
        </main>
        <footer className="mt-8 footer">
          Desarrollado con Wagmi & Viem | Kiara
        </footer>
      </div>
    </div>
  )
}