import { ethers } from "ethers";
import { hexToDec } from "../helpers/hexToDec.js";
import * as dotenv from 'dotenv';
dotenv.config();

const FULLNODE_MATIC_MUMBAI = process.env.FULLNODE_MATIC_MUMBAI;
const provider = new ethers.providers.JsonRpcProvider(FULLNODE_MATIC_MUMBAI); // Mumbai

// Contract ABI to get ERC-20 balance
const tokenAbi = ["function balanceOf(address) view returns (uint256)"];

export const getETHBalance = async (walletAddress: string) => {
  if(ethers.utils.isAddress(walletAddress)) {
    // Get the ETH balance of the address
    const ethBalance = await provider.getBalance(walletAddress);

    return hexToDec(+ethBalance);
  } else {
    return null;
  }
};

export const getERC20TokenBalance = async (walletAddress: string, tokenAddress: string) => {
  if(ethers.utils.isAddress(walletAddress) && ethers.utils.isAddress(tokenAddress)) {
    // Get the balance of the ERC-20 token
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
    const tokenBalance = await tokenContract.balanceOf(walletAddress);
  
    return hexToDec(tokenBalance);
  } else {
    return null;
  }
};
