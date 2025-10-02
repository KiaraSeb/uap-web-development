import { createPublicClient, http, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { env } from "../config/env.js";
import FaucetToken from "../abi/FaucetToken.json" assert { type: "json" };

async function checkBalance() {
  try {
    const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`);

    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(env.RPC_URL),
    });

    // 🔹 Balance en ETH
    const balanceWei = await publicClient.getBalance({ address: account.address });
    const balanceEth = formatEther(balanceWei);

    console.log("====================================");
    console.log("   🔍 Verificación de Wallet Backend");
    console.log("====================================");
    console.log("Dirección:", account.address);
    console.log("Balance ETH (Sepolia):", balanceEth, "ETH");

    // 🔹 Balance del token FaucetToken
    const balanceToken = await publicClient.readContract({
      address: env.CONTRACT_ADDRESS as `0x${string}`,
      abi: FaucetToken.abi,
      functionName: "balanceOf",
      args: [account.address],
    });

    console.log("Balance FaucetToken:", (balanceToken as bigint).toString());

    // 🔹 Verificación: ¿ya reclamó tokens?
    const hasClaimed = await publicClient.readContract({
      address: env.CONTRACT_ADDRESS as `0x${string}`,
      abi: FaucetToken.abi,
      functionName: "hasAddressClaimed",
      args: [account.address],
    });

    console.log("¿Ya reclamó tokens?:", hasClaimed ? "✅ Sí" : "❌ No");

    // 🔹 Listado de usuarios que ya interactuaron con el faucet
    const faucetUsers = await publicClient.readContract({
      address: env.CONTRACT_ADDRESS as `0x${string}`,
      abi: FaucetToken.abi,
      functionName: "getFaucetUsers",
      args: [],
    });

    console.log("------------------------------------");
    console.log("Usuarios que ya interactuaron con el faucet:");
    if (Array.isArray(faucetUsers) && faucetUsers.length > 0) {
      faucetUsers.forEach((u, i) => console.log(`${i + 1}. ${u}`));
    } else {
      console.log("⚠️ Ningún usuario ha reclamado aún.");
    }

    console.log("====================================");
  } catch (error) {
    console.error("❌ Error al consultar balance:", error);
  }
}

checkBalance();
