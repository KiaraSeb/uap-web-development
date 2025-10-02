import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { env } from "./env.js";
import FaucetToken from "../abi/FaucetToken.json" assert { type: "json" };

const PRIVATE_KEY = env.PRIVATE_KEY as `0x${string}`;
const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS as `0x${string}`;

const account = privateKeyToAccount(PRIVATE_KEY);

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(env.RPC_URL)
});

export const walletClient = createWalletClient({
  chain: sepolia,
  account,
  transport: http(env.RPC_URL)
});

export const faucetContract = {
  address: CONTRACT_ADDRESS,
  abi: FaucetToken.abi
};