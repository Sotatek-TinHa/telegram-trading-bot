import { ethers } from "ethers";
import SwapRouterABI from "../abis/SwapRouterABI.json";
import ERC20ABI from "../abis/ERC20ABI.json";

const FULLNODE_MATIC_MUMBAI = process.env.FULLNODE_MATIC_MUMBAI;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const WALLET_SECRET = process.env.WALLET_SECRET;

const provider = new ethers.providers.JsonRpcProvider(FULLNODE_MATIC_MUMBAI); // Mumbai
const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

const address0 = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"; // WMATIC Mumbai
const address1 = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa"; // WETH Mumbai

async function main() {
  const wallet = new ethers.Wallet(WALLET_SECRET);
  const connectedWallet = wallet.connect(provider);

  const swapRouterContract = new ethers.Contract(
    swapRouterAddress,
    SwapRouterABI,
    provider
  );

  const inputAmount = 1;
  const amountIn = ethers.utils.parseUnits(inputAmount.toString(), 18);

  const approvalAmount = amountIn.toString();
  const tokenContract0 = new ethers.Contract(address0, ERC20ABI, provider);
  await tokenContract0
    .connect(connectedWallet)
    .approve(swapRouterAddress, approvalAmount); // approvalResponse

  const params = {
    tokenIn: address0,
    tokenOut: address1,
    fee: 3000,
    recipient: WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  const transaction = swapRouterContract
    .connect(connectedWallet)
    .exactInputSingle(params, {
      gasLimit: ethers.utils.hexlify(1000000),
    })
    .then((transaction) => {
      console.log(transaction);
    });
}

main();
