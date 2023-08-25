import { Wallet, ethers } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();

const FULLNODE_MATIC_MUMBAI = process.env.FULLNODE_MATIC_MUMBAI;
const provider = new ethers.providers.JsonRpcProvider(FULLNODE_MATIC_MUMBAI); // Mumbai

export const createWallet = () => {
  const mnemonic = Wallet.createRandom().mnemonic;
  const wallet = Wallet.fromMnemonic(mnemonic.phrase);
  wallet.connect(provider);
  return { mnemonic, wallet };
};

createWallet();
