# Ejemplo de Confirio en React Native

Una app de React Native que abre una sala de Confirio con [`@confirio/react-native-sdk`](https://www.npmjs.com/package/@confirio/react-native-sdk). Pegás el link de participante de una sala y entrás: el nombre lo pone la app, como haría la tuya con el de quien inició sesión.

Por ahora el SDK funciona sólo en Android. La guía completa está en https://confirio.app/docs/movil.html.

## Probalo sin compilar

Bajá la app ya compilada en tu celular Android: [confirio-ejemplo.apk](https://github.com/confirio/ejemplo-react-native/releases/latest/download/confirio-ejemplo.apk) (57 MB). Android te va a pedir permiso para instalar una app que no viene de Play Store.

Para entrar necesitás una sala. Sin cuenta, usá la de prueba: en https://confirio.app tocá "Probá una sala ahora", abrí "Entrar como quien atiende" en la computadora y pegá en la app el link para la otra persona.

## Qué necesitás

- Node 22.11 o posterior.
- Android Studio con un emulador o un celular Android con la depuración USB activada.
- JDK 17.
- Una cuenta de Confirio con una API key. Si todavía no tenés, pedila en https://confirio.app.

## Probalo

```sh
git clone https://github.com/confirio/ejemplo-react-native.git
cd ejemplo-react-native
npm install
npm run android
```

En modo desarrollo la sala tarda en abrir, sobre todo la primera vez, porque Metro procesa el SDK completo. Para ver la velocidad real, compilá en release: `npm run android -- --mode release`.

Para entrar necesitás una sala. Creala de una de estas dos formas:

- Desde el panel de Confirio, en "Probar API": copiá el link de participante.
- Con el script del ejemplo, que la crea con tu API key como lo haría tu backend:

  ```sh
  CONFIRIO_API_KEY=tu-api-key npm run crear-sala
  ```

En la app tocá "Pegar" y "Entrar". Para verte con otra persona, abrí el link de quien modera en el navegador de la computadora.

## Cómo está armado

Todo está en [`App.tsx`](App.tsx). La pantalla de inicio valida el link y después muestra `<ConfirioRoom>`, que entra directo con el nombre que le pasás:

```tsx
<ConfirioRoom
  joinUrl={joinUrl}
  participantName={PARTICIPANT_NAME}
  onEnd={reason => {
    setJoinUrl(undefined);
    setMessage(END_MESSAGES[reason]);
  }}
  style={{ flex: 1 }}
/>
```

En tu app, el `joinUrl` lo entrega tu backend después de crear la sala, como hace [`crear-sala.mjs`](crear-sala.mjs). La API key queda siempre en el backend: nunca la pongas en la app.

Un ajuste de Android que ya está hecho acá:

- En [`AndroidManifest.xml`](android/app/src/main/AndroidManifest.xml) se sacan permisos que traen algunas dependencias y la sala no usa (calendario y servicios de Google). Es opcional.

## Licencia

MIT. El SDK tiene su propia licencia, incluida en el paquete.
