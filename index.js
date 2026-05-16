const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// 🔑 Railway से token आएगा
const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// 📡 API function
async function getGameIssue() {
  try {
    const res = await axios.post(
      "https://api.bdg88zf.com/api/webapi/GetGameIssue",
      {
        typeId: 1,
        language: 0,
        random: "40079dcba93a48769c6ee9d4d4fae23f",
        signature: "D12108C4F57C549D82B23A91E0FA20AE",
        timestamp: Math.floor(Date.now() / 1000)
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    return res.data;
  } catch (err) {
    return err.response?.data || err.message;
  }
}

// 🚀 Start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✅ Bot Ready\nUse /result");
});

// 📊 Result command
bot.onText(/\/result/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "⏳ Fetching data...");

  const data = await getGameIssue();

  if (data && data.code === 0) {
    const issue = data.data.issueNumber;
    const result = data.data.result;

    bot.sendMessage(
      chatId,
      `🎯 Period: ${issue}\n🎲 Result: ${result}`
    );
  } else {
    bot.sendMessage(chatId, "❌ API Error:\n" + JSON.stringify(data));
  }
});
