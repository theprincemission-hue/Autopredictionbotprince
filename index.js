const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// 🔐 Environment variables (Railway se aayenge)
const BOT_TOKEN = process.env.BOT_TOKEN;
const API_TOKEN = process.env.API_TOKEN;

if (!BOT_TOKEN || !API_TOKEN) {
  console.error("❌ Missing BOT_TOKEN or API_TOKEN");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// 📡 API call
async function getGameData() {
  try {
    const res = await axios.get(
      "https://api.ar-lottery01.com/api/Lottery/GetGameInfo?gameCode=WinGo_1M&language=en",
      {
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    return res.data;
  } catch (err) {
    return err.response?.data || err.message;
  }
}

// 🚀 Commands
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✅ Bot Ready\nUse /startbot");
});

bot.onText(/\/startbot/, async (msg) => {
  const chatId = msg.chat.id;

  const data = await getGameData();

  if (!data || typeof data === "string") {
    bot.sendMessage(chatId, "❌ API Error:\n" + data);
    return;
  }

  bot.sendMessage(chatId, "📊 DATA:\n" + JSON.stringify(data, null, 2));
});
