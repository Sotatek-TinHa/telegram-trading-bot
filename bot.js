import TelegramBot from "node-telegram-bot-api";
import { createWallet } from "./createWallet.js";
import "dotenv/config";

// Bot init
const BOT_TOKEN = process.env.BOT_TOKEN;
let bot = new TelegramBot(BOT_TOKEN, { polling: true });

// newWallet command
bot.onText(/\/newWallet/, function (msg) {
  console.log("Received an request");

  // Get new wallet mnemonic phrase and wallet address
  const wallet = createWallet();
  console.log(wallet);

  // Send message
  let chatId = msg.chat.id;
  const message = `Please save your 12-word seed phrase: ${wallet.mnemonic.phrase} \n\nYour wallet address: ${wallet.wallet.address}`;
  bot.sendMessage(msg.chat.id, message);

  console.log("Sent the response successfully");
});
