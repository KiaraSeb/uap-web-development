Esta aplicación demuestra la integración de Web3 en React usando Wagmi y Viem, con un backend Node.js/Express que maneja autenticación JWT y llamadas al smart contract. El frontend es responsive y moderno, con estilos CSS personalizados. Cumple con las mejores prácticas de seguridad (private keys en backend, nonces anti-replay) y UX (estados de carga, manejo de errores).

Funciones clave: claimTokens(), hasAddressClaimed(), getFaucetUsers(), getFaucetAmount(), y ERC20 estándar (balanceOf, transfer).

## Características

### Frontend (React + Vite)
Conexión de wallet con MetaMask (Wagmi v2).
Autenticación SIWE con firma de mensajes.
Reclamo de tokens (1,000,000 por dirección, vía backend proxy).
Visualización de balance, estado de claim y lista de usuarios.
Manejo de errores y estados de carga (spinners, alerts).

### Backend (Express + Viem)
Endpoints protegidos con JWT.
Generación y validación de mensajes SIWE con nonces.
Interacción con smart contract (lecturas con publicClient, escrituras con walletClient).
Middleware de autenticación y manejo de errores.

## Instalación

### Backend
Navega a la carpeta backend/:
cd backend
npm install

Crea .env en la raíz del backend:
textPRIVATE_KEY=0x[tuya-private-key-de-prueba]
JWT_SECRET=tu-super-secreto-jwt
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
CONTRACT_ADDRESS=0x3e2117c19a921507ead57494bbf29032f33c7412
PORT=4000

Ejecuta:
npm run dev 

### Frontend

Navega a la carpeta frontend/:
cd frontend
npm install

Ejecuta:
npm run dev  # Vite dev server

## Uso
Inicia los servidores:
Backend: npm run dev (puerto 4000).
Frontend: npm run dev (puerto 5173).

## Flujo del usuario:

Abre http://localhost:5173.
Conecta MetaMask (elige Sepolia).
Clic en "Reclamar Tokens": Firma el mensaje SIWE en MetaMask.
La transacción se procesa en el backend (ver tx en Etherscan).
Visualiza balance actualizado, estado de claim y lista de usuarios.
