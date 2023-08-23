const { ethers } = require("ethers");
const ERC20ABI = require("./ERC20ABI.json");
const SwapRouterABI = require("./SwapRouterABI.json");
require("dotenv").config();

const QUICKNODE_URL_TESTNET = process.env.QUICKNODE_URL_TESTNET;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const WALLET_SECRET = process.env.WALLET_SECRET;

const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_URL_TESTNET); // Sepolia
const swapRouterAddress = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";

const address0 = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // WETH
const address1 = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"; // UNI

async function main() {
  const wallet = new ethers.Wallet(WALLET_SECRET);
  const connectedWallet = wallet.connect(provider);
  console.log(await provider.getBalance(connectedWallet.address));

  const swapRouterContract = new ethers.Contract(
    swapRouterAddress,
    SwapRouterABI,
    provider
  );

  const inputAmount = 0.1;
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
  console.log(swapRouterContract);
  const transaction = swapRouterContract
    .execute(params, {
      gasLimit: ethers.utils.hexlify(1000000),
    })
    .then((transaction) => {
      console.log(transaction);
    });
}

main();
