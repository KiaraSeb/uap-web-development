import { Request, Response } from "express";
import { SiweMessage } from "siwe";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const messages: Record<string, string> = {}; 

export const getAuthMessage = async (req: Request, res: Response) => {
  const { address } = req.body;
  const message = new SiweMessage({
    domain: "localhost",
    address,
    statement: "Sign this message to authenticate",
    uri: "http://localhost",
    version: "1",
    chainId: 11155111
  }).prepareMessage();

  messages[address] = message;
  res.json({ message });
};

export const signIn = async (req: Request, res: Response) => {
  const { address, message, signature } = req.body;
  if (!address || !message || !signature) return res.status(400).json({ error: "Missing address, message or signature" });

  const storedMessage = messages[address];
  if (!storedMessage) return res.status(400).json({ error: "No message found for address" });
  if (storedMessage !== message) return res.status(400).json({ error: "Message mismatch" });

  try {
    const siwe = new SiweMessage(message);
    await siwe.validate(signature);
    delete messages[address];  
    const token = jwt.sign({ address }, env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, address });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};