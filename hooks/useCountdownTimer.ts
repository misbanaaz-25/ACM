import { useState, useEffect } from 'react';

// milliseconds ko "00 hr: 00 min: 00 sec" format mein badalta hai
function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hrs)} hr: ${pad(mins)} min: ${pad(secs)} sec`;
}

// Ye hook sirf "countdown timer" ka kaam sambhalta hai:
// - profileEndTime (timestamp) se har second remaining time calculate karna
// - jab time khatam ho jaye, onExpire callback chalana (jo profile ko reset karega)
//
// SRP fix: pehle ye sab setInterval/formatting logic seedha DashboardCard.tsx
// ke andar tha, jisse woh component UI + timer-logic dono handle kar raha tha.
// Ab DashboardCard sirf UI dikhane pe focus karega.
export function useCountdownTimer(profileEndTime: number | null, onExpire: () => void) {
  const [remainingMs, setRemainingMs] = useState<number>(
    profileEndTime ? profileEndTime - Date.now() : 0
  );

  useEffect(() => {
    if (!profileEndTime) {
      setRemainingMs(0);
      return;
    }

    setRemainingMs(profileEndTime - Date.now());

    const interval = setInterval(() => {
      const left = profileEndTime - Date.now();
      setRemainingMs(left);

      // time khatam hote hi profile ko reset karne ke liye parent ko batao
      if (left <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [profileEndTime]);

  const timerLabel = profileEndTime ? formatRemaining(remainingMs) : '00 hr: 00 min: 00 sec';

  return { timerLabel };
}