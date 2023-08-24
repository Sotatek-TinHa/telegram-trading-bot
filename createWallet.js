import { Wallet, ethers } from "ethers";
import "dotenv/config";

const QUICKNODE_URL_TESTNET = process.env.QUICKNODE_URL_TESTNET;
const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_URL_TESTNET); // Mumbai

export const createWallet = () => {
  const mnemonic = Wallet.createRandom().mnemonic;
  const wallet = Wallet.fromMnemonic(mnemonic.phrase);
  wallet.connect(provider);
  return { mnemonic, wallet };
};

createWallet();
