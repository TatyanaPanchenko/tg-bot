export async function getCity(latitude, longitude) {
  try {
    const response = await fetch(
      `https://geocode-maps.yandex.ru/1.x?apikey=6be47d0d-890b-4722-96da-3ef0f9271887&geocode=${latitude},${longitude}&format=json`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
