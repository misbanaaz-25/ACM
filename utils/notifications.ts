import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications(): Promise<(() => void) | undefined> {


  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }

  // User se permission maango notification bhejne ke liye
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission denied');
    return;
  }

  console.log('Notification permission granted');


  try {
    const tokenResponse = await Notifications.getDevicePushTokenAsync();
    console.log('FCM Device Token:', tokenResponse.data);


  } catch (err) {
    console.log('Error getting device push token:', err);
  }



  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received:', notification.request.content);
    }
  );


  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('Notification clicked:', response.notification.request.content);
    }
  );


  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}