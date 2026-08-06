import { useEffect } from 'react';
import { setupNotifications } from '../utils/notifications';

export function useNotificationSetup() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    setupNotifications().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cleanup?.();
    };
  }, []);
}