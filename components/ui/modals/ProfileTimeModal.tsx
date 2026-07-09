import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  visible: boolean;
  profileName: string;
  onClose: () => void;
  onConfirm: (time: { hour: number; minute: number; ampm: 'AM' | 'PM' }) => void;
};

const ITEM_HEIGHT = 36;
const VISIBLE_ITEMS = 3;

// ----- Reusable Wheel Picker (timer.tsx wala hi pattern) -----
type WheelPickerProps = {
  data: (string | number)[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

function WheelPicker({ data, selectedIndex, onChange }: WheelPickerProps) {
  const colors = Colors.light;
  const scrollRef = useRef<ScrollView>(null);
  const paddingCount = Math.floor(VISIBLE_ITEMS / 2);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
  }, []);

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const rawIndex = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(rawIndex, data.length - 1));

    onChange(clampedIndex);
    scrollRef.current?.scrollTo({ y: clampedIndex * ITEM_HEIGHT, animated: true });
  };

  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, overflow: 'hidden' }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * paddingCount }}
      >
        {data.map((item, index) => (
          <View key={index} style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: index === selectedIndex ? 20 : 14,
                fontWeight: index === selectedIndex ? '700' : '400',
                color: index === selectedIndex ? colors.primary : colors.border,
              }}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function ProfileTimeModal({ visible, profileName, onClose, onConfirm }: Props) {
  const { width } = useWindowDimensions();
  const colors = Colors.light;

  const hoursData = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutesData = Array.from({ length: 60 }, (_, i) => i);
  const ampmData = ['AM', 'PM'];

  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('PM');

  const handleConfirm = () => {
    onConfirm({ hour, minute, ampm });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { width: width * 0.85, backgroundColor: colors.white }]}>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Set "{profileName}" active until
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerRow}>
            <WheelPicker
              data={hoursData}
              selectedIndex={hour - 1}
              onChange={(index) => setHour(hoursData[index])}
            />
            <WheelPicker
              data={minutesData}
              selectedIndex={minute}
              onChange={(index) => setMinute(minutesData[index])}
            />
            <WheelPicker
              data={ampmData}
              selectedIndex={ampm === 'AM' ? 0 : 1}
              onChange={(index) => setAmpm(index === 0 ? 'AM' : 'PM')}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.primary }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.setBtn, { backgroundColor: colors.primary }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.setText, { color: colors.white }]}>Set</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '700',
  },
  setBtn: {
    flex: 1,
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
  },
  setText: {
    fontWeight: '700',
  },
});
