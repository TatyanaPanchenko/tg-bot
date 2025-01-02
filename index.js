require("dotenv").config();

// import { getCity } from "./request.js";
const {
  Bot,
  GrammyError,
  HttpError,
  InlineKeyboard,
  Keyboard,
} = require("grammy");

async function getCity(longitude, latitude) {
  try {
    const location = await fetch(
      `https://geocode-maps.yandex.ru/1.x?apikey=6be47d0d-890b-4722-96da-3ef0f9271887&geocode=${longitude},${latitude}&format=json&kind=locality`
    )
      .then((result) => result.json())
      .then((data) => {
        return data;
      });
    return await location;
  } catch (error) {
    console.error(error);
  }
}

const bot = new Bot(process.env.BOT_API_KEY);

bot.command("start", async (ctx) => {
  const startKeyboard = new InlineKeyboard().webApp(
    "Старт",
    "https://miniapp-1138f.web.app/"
  );

  await ctx.reply(
    "Отправляйте свою геопозицию для более точного поиска, запускайте приложение по кнопке Старт, выбирайте подходящее время и получайте рекомендации ивентов.",
    {
      reply_markup: startKeyboard,
      request_location: true,
    }
  );
});

bot.on("message", async (ctx) => {
  const result = await getCity(
    ctx.message.location.longitude,
    ctx.message.location.latitude
  ).then((geo) => {
    return geo.response;
  });
  let urlParams = new URLSearchParams({
    location: "123",
  });
  // `${result?.GeoObjectCollection?.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country?.AddressLine}`
  // data.response.GeoObjectCollection.featureMember[0].GeoObject
  //       .metaDataProperty.GeocoderMetaData.AddressDetails.Country.AddressLine
  // if (ctx.message.location) {
  await ctx.reply(
    `Ваше местоположение: ${result?.GeoObjectCollection?.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country?.AddressLine}, ${ctx.message.location.longitude}, ${ctx.message.location.latitude}`
  );
  // }
  const startKeyboard = new InlineKeyboard().webApp(
    "Старт",
    "https://miniapp-1138f.web.app/"
    //   `https://miniapp-1138f.web.app/?$location=${result?.GeoObjectCollection?.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country?.AddressLine}`
  );
  await ctx.reply(
    "Запускайте приложение по кнопке Старт, выбирайте подходящее время и получайте рекомендации ивентов.",
    {
      reply_markup: startKeyboard,
      reply_parameters: { message_id: ctx.msg.message_id },
    }
  );
});

bot.on("message", async (ctx) => {
  await bot.sendMessage(
    ctx.chat.id,
    `Широта: ${ctx.location.latitude}\nДолгота: ${ctx.location.longitude}`
  );
});
// tg.sendData(key);

// const shareKeyboard = new Keyboard()
//   .requestLocation("Геолокация")
//   .requestContact("Контакт")
//   .requestPoll("Опрос")
//   .placeholder("Я хочу поделиться...")
//   .resized();
// bot.command("share", async (ctx) => {
//   await ctx.reply("Какими данными хочешь поделиться?", {
//     reply_markup: shareKeyboard,
//   });
// });

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
