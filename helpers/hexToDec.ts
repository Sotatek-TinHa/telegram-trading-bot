import { ethers } from "ethers";

export const hexToDec = (num: number) => {
  return Number(ethers.utils.formatEther(num.toString())).toFixed(2);
};
