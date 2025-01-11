require("dotenv").config();

// import { getCity } from "./request.js";
const {
  Bot,
  GrammyError,
  HttpError,
  InlineKeyboard,
  Keyboard,
} = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.command("start", async (ctx) => {
  const startKeyboard = new InlineKeyboard().webApp(
    "Старт",
    "https://miniapp-1138f.web.app/"
  );

  await ctx.reply(
    "Запускайте приложение по кнопке Старт, выбирайте подходящее время и получайте рекомендации ивентов.",
    {
      reply_markup: startKeyboard,
    }
  );
});

bot.on("message", async (ctx) => {
  const startKeyboard = new InlineKeyboard().webApp(
    "Старт",
    "https://miniapp-1138f.web.app/"
  );
  await ctx.reply(
    "Запускайте приложение по кнопке Старт, выбирайте подходящее время и получайте рекомендации ивентов.",
    {
      reply_markup: startKeyboard,
      reply_parameters: { message_id: ctx.msg.message_id },
    }
  );
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handing update ${ctx.update.update_id}`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error is request", e.descrition);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram", e);
  } else {
    console.error("Unknown error", e);
  }
});
bot.start();
