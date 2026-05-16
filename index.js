const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const BOT_TOKEN = "PASTE_YOUR_BOT_TOKEN";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

async function getData() {
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
          "Content-Type": "application/json"
        },
        timeout: 5000
      }
    );

    return res.data;
  } catch (err) {
    return "ERROR: " + err.message;
  }
}

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Bot Ready ✅\nUse /result");
});

bot.onText(/\/result/, async (msg) => {
  const data = await getData();

  if (typeof data === "string") {
    bot.sendMessage(msg.chat.id, data);
    return;
  }

  bot.sendMessage(msg.chat.id, JSON.stringify(data));
});
