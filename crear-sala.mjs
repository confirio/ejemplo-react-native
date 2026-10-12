// Crea una sala como lo haría tu backend y muestra los dos links.
// Uso: CONFIRIO_API_KEY=tu-api-key npm run crear-sala
import ConfirioServer from 'confirio-sdk/server';

const apiKey = process.env.CONFIRIO_API_KEY;
if (!apiKey) {
  console.error('Falta CONFIRIO_API_KEY: creá una API key en el panel de Confirio.');
  process.exit(1);
}

try {
  const room = await new ConfirioServer({ apiKey }).createRoom({ name: 'Ejemplo React Native' });
  console.log('Para la app (participante):    ', room.joinUrl);
  console.log('Para el navegador (quien modera):', room.hostUrl);
} catch (error) {
  console.error('No se pudo crear la sala:', error.message);
  process.exit(1);
}
