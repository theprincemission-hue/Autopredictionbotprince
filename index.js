const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

// 🔐 ENV से tokens लेंगे
const BOT_TOKEN = process.env.BOT_TOKEN;
const API_TOKEN = process.env.API_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// 📡 API function (FIXED HEADERS)
async function getGameData() {
  try {
    const res = await axios.get(
      "https://api.ar-lottery01.com/api/Lottery/GetGameInfo?gameCode=WinGo_1M&language=en",
      {
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
          "Origin": "https://www.jaiclub15.com",
          "Referer": "https://www.jaiclub15.com/",
          "Accept": "application/json, text/plain, */*"
        }
      }
    );

    return res.data;
  } catch (err) {
    return err.response?.data || err.message;
  }
}

// 🚀 /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "✅ Bot Active\nUse /startbot to get data"
  );
});

// 📊 Fetch data
bot.onText(/\/startbot/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "⏳ Fetching data...");

  const data = await getGameData();

  if (typeof data === "object") {
    bot.sendMessage(
      chatId,
      "📊 DATA:\n" + JSON.stringify(data, null, 2)
    );
  } else {
    bot.sendMessage(chatId, "❌ API Error:\n" + data);
  }
});

// 🛑 Error catch
process.on("uncaughtException", (err) => {
  console.log("Error:", err);
});
