 //ye hai layout.tsx
 import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useNotificationSetup } from '../hooks/useNotificationSetup';

export default function RootLayout() {

   useNotificationSetup();
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar style="auto" />
    </>
  );
}