require("dotenv").config();
const {
  Bot,
  GrammyError,
  HtmlError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.command("start", async (ctx) => {
  const startKeyboard = new InlineKeyboard().webApp(
    "Старт",
    "https://magiccoffee-d17d0.web.app/"
  );
  await ctx.reply(
    "Запускай приложение по кнопке Старт, выбирай подходящее время и получай рекомендации ивентов.",
    {
      reply_markup: startKeyboard,
    }
  );
});

bot.on("message", async (ctx) => {
  const startKeyboard = new InlineKeyboard()
    .text("Старт", "start")
    .webApp("Старт", "https://magiccoffee-d17d0.web.app/");
  await ctx.reply(
    "Запускай приложение по кнопке Старт, выбирай подходящее время и получай рекомендации ивентов.",
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
  } else if (e instanceof HtmlError) {
    console.error("Could not contact Telegram", e);
  } else {
    console.error("Unknown error", e);
  }
});
bot.start();
