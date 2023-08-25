import TelegramBot from "node-telegram-bot-api";
import { getERC20TokenBalance, getETHBalance } from "./functions/getBalance.js";
import { createWallet } from "./functions/createWallet.js";
import * as dotenv from 'dotenv';
dotenv.config();

// Bot init
const BOT_TOKEN = process.env.BOT_TOKEN;
let bot = new TelegramBot(BOT_TOKEN, { polling: true });

const storage = {}

function getUserData(chatId: number) {
  let userData = storage[chatId]
  if (!userData) {
    userData = {
      waitingForUserResponse: false,
      waitingForGetEthBalance: false,
      waitingForGetErc20Balance: false,
    }
    storage[chatId] = userData
  }
  return userData
}

function resetUserData(chatId: number) {
  const userData = getUserData(chatId)
  userData.waitingForUserResponse = false
  userData.waitingForGetEthBalance = false
  userData.waitingForGetErc20Balance = false
}

const mainMenuOption = [
  [{ text: "Generate new wallet", callback_data: "newWallet" }],
  [{ text: "Get Balance", callback_data: "getBalance" }],
  [{ text: "Buy token", callback_data: "buyToken" }],
]

const getBalanceOption = [
  [{ text: "Get ETH Balance", callback_data: "getEthBalance" }],
  [{ text: "Get ERC20 Balance", callback_data: "getErc20Balance" }],
  [{ text: "Back", callback_data: "back" }],
]

const helloMessage = "Hello! I'm Sotabot \nWhat can I help you?";
// start command
bot.onText(/\/start/, function (msg) {
  // Send message
  let chatId: number = msg.chat.id;
  bot.sendMessage(chatId, helloMessage, {
    reply_markup: {
      inline_keyboard: mainMenuOption,
    },
  });
});

bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  switch (data) {
    case "newWallet":
      bot.sendMessage(chatId, "Generating your new wallet ...");

      // Get new wallet mnemonic phrase and wallet address
      const wallet = createWallet();

      // Send message
      const message = `Please save your 12-word seed phrase: ${wallet.mnemonic.phrase} \n\nYour wallet address: ${wallet.wallet.address}`;
      bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: mainMenuOption,
        },
      });
      break;
    case "getBalance":
      const userDataForGetBalance = getUserData(chatId)
      userDataForGetBalance.waitingForUserResponse = true
      bot.sendMessage(chatId, "Please choose one option", {
        reply_markup: {
          inline_keyboard: getBalanceOption,
        },
      });
      break;
    case "getEthBalance":
      const userDataForGetEthBalance = getUserData(chatId)
      userDataForGetEthBalance.waitingForUserResponse = true
      userDataForGetEthBalance.waitingForGetEthBalance = true
      bot.sendMessage(chatId, "What's your wallet address?", {
        reply_markup: {
          force_reply: true,
        },
      });
      break;
    case "getErc20Balance":
      const userDataForGetErc20Balance = getUserData(chatId)
      userDataForGetErc20Balance.waitingForUserResponse = true
      userDataForGetErc20Balance.waitingForGetErc20Balance = true
      bot.sendMessage(chatId, "What's your wallet address?", {
        reply_markup: {
          force_reply: true,
        },
      });
      bot.once('message', async (walletAddress) => {
        bot.sendMessage(chatId, "What's the token ERC20 address?", {
          reply_markup: {
            force_reply: true,
          },
        });
        bot.once('message', async (tokenAddress) => {
          const erc20Balance = await getERC20TokenBalance(walletAddress.text, tokenAddress.text);
          if (erc20Balance) {
            bot.sendMessage(chatId, `Your ETH balance is: ${erc20Balance}`, {
              reply_markup: {
                inline_keyboard: getBalanceOption,
              },
            })
            resetUserData(chatId)
          } else {
            bot.sendMessage(chatId, "Not a valid address")
          }
        });
      });
    break;
    case "buyToken":
      break;
    case "back":
      bot.sendMessage(chatId, helloMessage, {
        reply_markup: {
          inline_keyboard: mainMenuOption,
        },
      });
    default:
      break;
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const data = msg.text

  const userData = getUserData(chatId)
  if (userData && userData.waitingForUserResponse) {
    let messageText = ''
    if (userData.waitingForGetEthBalance) {
      const ethBalance = await getETHBalance(data);
      if (ethBalance) {
        messageText = `Your ETH balance is: ${ethBalance}`
        resetUserData(chatId)
      } else {
        messageText = `${data} is not a valid address`
      }
      bot.sendMessage(chatId, messageText, {
        reply_markup: {
          inline_keyboard: getBalanceOption,
        },
      })
    }
  }
})
