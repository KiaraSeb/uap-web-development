import 'dotenv/config';

export const env = {
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  RPC_URL: process.env.RPC_URL || "",
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || "",
  PORT: Number(process.env.PORT) || 4000
};
