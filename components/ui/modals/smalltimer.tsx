import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '@/constants/theme';
import AlertModal from '@/components/ui/modals/AlertModal';
import DurationErrorIllustration from '@/components/ui/Icon/DurationErrorIllustration';

interface SmallTimerProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (hour: number, minute: number) => void;
  onStart: (hour: number, minute: number) => void;
  initialHour?: number;
  initialMinute?: number;
}

const MAX_HOUR = 11;
const MAX_MINUTE = 59;
const MIN_DURATION_MINUTES = 5; // yaha se easily change kar sakte ho future mein

export default function SmallTimer({
  visible,
  onStart,
  onClose,
  onSubmit,
  initialHour = 0,
  initialMinute = 0,
}: SmallTimerProps) {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  useEffect(() => {
    if (visible) {
      setHour(initialHour);
      setMinute(initialMinute);
    }
  }, [visible, initialHour, initialMinute]);

  const [alertVisible, setAlertVisible] = useState(false);

  // Hour stepper
  const incrementHour = () => {
    setHour((prev) => (prev < MAX_HOUR ? prev + 1 : 0));
  };
  const decrementHour = () => {
    setHour((prev) => (prev > 0 ? prev - 1 : MAX_HOUR));
  };

  // Minute stepper
  const incrementMinute = () => {
    setMinute((prev) => (prev < MAX_MINUTE ? prev + 1 : 0));
  };
  const decrementMinute = () => {
    setMinute((prev) => (prev > 0 ? prev - 1 : MAX_MINUTE));
  };

  // total duration minutes mein nikal liya check karne ke liye
  const totalMinutes = hour * 60 + minute;

  const handlePlay = () => {
    if (totalMinutes < MIN_DURATION_MINUTES) {
      setAlertVisible(true);
      return;
    }
    onStart(hour, minute);
    onClose();
  };

  const handleSubmit = () => {
    if (totalMinutes < MIN_DURATION_MINUTES) {
      setAlertVisible(true);
      return;
    }
    onSubmit(hour, minute);
    onClose();
  };

  const pad = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            {/* Close icon */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Set Time</Text>

            <View style={styles.timeRow}>
              {/* Hour column */}
              <View style={styles.timeColumn}>
                <Text style={styles.label}>Hr</Text>
                <TouchableOpacity onPress={incrementHour}>
                  <Text style={styles.stepArrow}>▲</Text>
                </TouchableOpacity>
                <Text style={styles.timeValue}>{pad(hour)}</Text>
                <TouchableOpacity onPress={decrementHour}>
                  <Text style={styles.stepArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* Minute column */}
              <View style={styles.timeColumn}>
                <Text style={styles.label}>Min</Text>
                <TouchableOpacity onPress={incrementMinute}>
                  <Text style={styles.stepArrow}>▲</Text>
                </TouchableOpacity>
                <Text style={styles.timeValue}>{pad(minute)}</Text>
                <TouchableOpacity onPress={decrementMinute}>
                  <Text style={styles.stepArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.note}>
              Note: Set duration (Max: 11 hrs 59 mins)
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.playBtn} onPress={handlePlay}>
                <Text style={styles.playText}>Play</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AlertModal
        visible={alertVisible}
        title="Error!"
        message={`Minimum duration of a profile should be ${MIN_DURATION_MINUTES} minutes.`}
        onClose={() => setAlertVisible(false)}
        illustration={<DurationErrorIllustration width={140} height={140} />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  closeText: {
    fontSize: 18,
    color: Colors.light.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 12,
  },
  timeColumn: {
    alignItems: 'center',
  },
  label: {
    width: '100%',
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  stepArrow: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    paddingVertical: 4,
  },
  timeValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.primary,
    marginVertical: 4,
  },
  note: {
    width: '100%',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  playBtn: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  playText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: Colors.light.primary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    color: Colors.light.background,
    fontWeight: '600',
  },
});