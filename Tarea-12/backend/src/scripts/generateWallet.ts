import { Wallet } from "ethers";

function generateWallet() {
  const wallet = Wallet.createRandom();

  console.log("====================================");
  console.log("   🚀 Nueva wallet generada");
  console.log("====================================");
  console.log("Dirección:", wallet.address);
  console.log("Clave privada:", wallet.privateKey);
  console.log("------------------------------------");
  console.log("⚠️  Copia la PRIVATE_KEY a tu archivo .env");
  console.log("PRIVATE_KEY=" + wallet.privateKey);
  console.log("====================================");
}

generateWallet();
