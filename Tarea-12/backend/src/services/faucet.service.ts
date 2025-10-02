import { Request, Response } from "express";
import { faucetContract, publicClient, walletClient } from "../config/contract.config.js";

type HasClaimedResult = boolean;
type BalanceResult = bigint;
type UsersResult = readonly `0x${string}`[];
type AmountResult = bigint;

export const claimTokens = async (req: Request, res: Response) => {
  try {
    const userAddress = (req as any).address;
    if (!userAddress) return res.status(401).json({ error: "Dirección no autorizada" });

    const typedUserAddress = userAddress as `0x${string}`;

    const hasClaimed: HasClaimedResult = await publicClient.readContract({
      address: faucetContract.address,
      abi: faucetContract.abi,
      functionName: "hasAddressClaimed",
      args: [typedUserAddress] as const
    }) as HasClaimedResult;
    if (hasClaimed) return res.status(400).json({ error: "Ya reclamaste tokens" });

    const hash = await walletClient.writeContract({
      address: faucetContract.address,
      abi: faucetContract.abi,
      functionName: "claimTokens",
      args: [] as const
    });

    res.json({ txHash: hash, success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  const { address } = req.params;
  const typedAddress = address as `0x${string}`;

  try {
    const hasClaimed: HasClaimedResult = await publicClient.readContract({
      address: faucetContract.address,
      abi: faucetContract.abi,
      functionName: "hasAddressClaimed",
      args: [typedAddress] as const
    }) as HasClaimedResult;

    const balance: BalanceResult = await publicClient.readContract({
      address: faucetContract.address,
      abi: faucetContract.abi,
      functionName: "balanceOf",
      args: [typedAddress] as const
    }) as BalanceResult;

    const users: UsersResult = await publicClient.readContract({
      address: faucetContract.address,
      abi: faucetContract.abi,
      functionName: "getFaucetUsers",
      args: [] as const
    }) as UsersResult;

    const amount: AmountResult = await publicClient.readContract({
      address: faucetContract.address,
      abi: faucetContract.abi,
      functionName: "getFaucetAmount",
      args: [] as const
    }) as AmountResult;

    res.json({ 
      hasClaimed, 
      balance: balance.toString(),
      users: Array.isArray(users) ? users : [],
      amount: amount.toString()
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};