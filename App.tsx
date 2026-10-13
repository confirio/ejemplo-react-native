import React, { useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { ConfirioRoom, type ConfirioEndReason } from '@confirio/react-native-sdk';

// En tu app, el joinUrl lo entrega tu backend después de crear la sala con POST /api/v1/rooms.
// Acá se pega a mano para probar: creá la sala desde "Probar API" en el panel de Confirio.
const JOIN_URL = /^https:\/\/meet\.confirio\.app\/[0-9a-f]{32}(#\S*)?$/i;

// En tu app, el nombre de quien ya inició sesión: la sala no lo vuelve a pedir.
const PARTICIPANT_NAME = 'Ana';

const END_MESSAGES: Record<ConfirioEndReason, string> = {
  left: 'Saliste de la sala.',
  ended: 'La reunión terminó.',
  unavailable: 'La sala ya no está disponible.',
  not_found: 'Esa sala no existe.',
};

export default function App() {
  const [link, setLink] = useState('');
  const [joinUrl, setJoinUrl] = useState<string>();
  const [message, setMessage] = useState<string>();

  if (joinUrl) {
    return (
      <ConfirioRoom
        joinUrl={joinUrl}
        participantName={PARTICIPANT_NAME}
        onEnd={reason => {
          setJoinUrl(undefined);
          setMessage(END_MESSAGES[reason]);
        }}
        style={styles.room}
      />
    );
  }

  const enter = () => {
    const url = link.trim();

    if (!JOIN_URL.test(url)) {
      setMessage('Ese link no es de una sala de Confirio.');
      return;
    }
    setMessage(undefined);
    setJoinUrl(url);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Text style={styles.title}>Entrá a una sala</Text>
        <Text style={styles.help}>
          Pegá acá el link de participante de una sala. Sin cuenta, creá una de prueba en confirio.app con "Probá una sala ahora"; con cuenta, desde "Probar API" en el panel.
        </Text>

        <Text style={styles.label}>Link de la sala</Text>
        <View style={styles.row}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            inputMode="url"
            onChangeText={setLink}
            placeholder="https://meet.confirio.app/…"
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.grow]}
            value={link}
          />
          <Pressable
            accessibilityRole="button"
            onPress={async () => setLink((await Clipboard.getString()).trim())}
            style={styles.secondary}>
            <Text style={styles.secondaryText}>Pegar</Text>
          </Pressable>
        </View>

        <Pressable accessibilityRole="button" onPress={enter} style={styles.primary}>
          <Text style={styles.primaryText}>Entrar</Text>
        </Pressable>

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const colors = {
  background: '#FBFCFD',
  text: '#16263A',
  muted: '#5B6B7E',
  border: '#C9D3DE',
  accent: '#3774B4',
};

const styles = StyleSheet.create({
  room: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20, paddingTop: 32, gap: 8 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700' },
  help: { color: colors.muted, fontSize: 15, lineHeight: 21, marginBottom: 16 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 8 },
  row: { flexDirection: 'row', gap: 8 },
  grow: { flex: 1 },
  input: {
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondary: {
    borderColor: colors.accent,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryText: { color: colors.accent, fontSize: 15, fontWeight: '600' },
  primary: { backgroundColor: colors.accent, borderRadius: 4, marginTop: 20, paddingVertical: 14 },
  primaryText: { color: colors.background, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  message: { color: colors.text, fontSize: 15, marginTop: 16 },
});
