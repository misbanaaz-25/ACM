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
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const ITEM_HEIGHT = 36; // har wheel item ki height, sab jagah same use hogi
const VISIBLE_ITEMS = 3; // ek time pe 3 items dikhenge (upar, selected, neeche)

// ----- Reusable Wheel Picker component -----
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

export default function ScheduleModal({ visible, onClose }: Props) {
  const { width } = useWindowDimensions();
  const colors = Colors.light;

  // wheel data arrays
  const hoursData = Array.from({ length: 12 }, (_, i) => i + 1); // 1 se 12
  const minutesData = Array.from({ length: 60 }, (_, i) => i); // 0 se 59
  const ampmData = ['AM', 'PM'];

  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(15);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  const [durationHr, setDurationHr] = useState(7);
  const [durationMin, setDurationMin] = useState(15);

  const [repeatType, setRepeatType] = useState<'' | 'weekly' | 'daily'>('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // duration - max 11 hrs 59 mins tak hi jayega, negative nahi hoga
  const incrementDurationHr = () => setDurationHr((prev) => Math.min(prev + 1, 11));
  const decrementDurationHr = () => setDurationHr((prev) => Math.max(prev - 1, 0));

  const incrementDurationMin = () => setDurationMin((prev) => Math.min(prev + 1, 59));
  const decrementDurationMin = () => setDurationMin((prev) => Math.max(prev - 1, 0));

 const toggleDay = (index: number) => {

   if (selectedDays.includes(index)) {
     setSelectedDays(selectedDays.filter((d) => d !== index));
   } else {
     setSelectedDays([...selectedDays, index]);
   }

 };

  // Daily select krne pe saare 7 din auto-select ho jayenge
  // Weekly select krne pe days reset ho jayenge, taki manually choose kr sako
 const handleSelectDaily = () => {

   if (repeatType === 'daily') {
     setRepeatType('');
     setSelectedDays([]);
     return;
   }

   setRepeatType('daily');
   setSelectedDays([0,1,2,3,4,5,6]);
 };

  const handleSelectWeekly = () => {

    if (repeatType === 'weekly') {
      setRepeatType('');
      return;
    }

    setRepeatType('weekly');
  };


 const handlePlay = () => {

   if (repeatType === '') {
     Alert.alert('Error', 'Please select Daily or Weekly.');
     return;
   }

   if (repeatType === 'weekly' && selectedDays.length === 0) {
     Alert.alert('Error', 'Please select at least one day.');
     return;
   }

   console.log('Preview schedule:', {
     hour,
     minute,
     ampm,
     durationHr,
     durationMin,
     repeatType,
     selectedDays,
   });

 };

 const handleSubmit = () => {

   if (repeatType === '') {
     Alert.alert('Error', 'Please select Daily or Weekly.');
     return;
   }

   if (repeatType === 'weekly' && selectedDays.length === 0) {
     Alert.alert('Error', 'Please select at least one day.');
     return;
   }

   console.log('Schedule submitted:', {
     hour,
     minute,
     ampm,
     durationHr,
     durationMin,
     repeatType,
     selectedDays,
   });

   onClose();
 };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { width: width * 0.85, backgroundColor: colors.background }]}>

          {/* Header - ab sirf "Set Time" hai, "Set Date" hata diya kyunki uska use nahi tha */}
          <View style={styles.header}>
            <Text style={[styles.tabText, { color: colors.primary, fontWeight: '700' }]}>
              Set Time
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Set Time picker - real scroll wheel */}
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

          {/* Set duration */}
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Set duration</Text>
          <Text style={[styles.sectionNote, { color: colors.text }]}>
            Note: Set duration (Max: 11 hrs 59 mins)
          </Text>

          <View style={styles.durationRow}>
            <View style={styles.durationColumn}>
              <Text style={[styles.durationLabel, { color: colors.text }]}>Hr</Text>
              <View style={styles.durationControls}>
                <TouchableOpacity onPress={decrementDurationHr}>
                  <Feather name="minus" size={16} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.durationValue, { color: colors.primary }]}>{durationHr}</Text>
                <TouchableOpacity onPress={incrementDurationHr}>
                  <Feather name="plus" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.durationColumn}>
              <Text style={[styles.durationLabel, { color: colors.text }]}>Min</Text>
              <View style={styles.durationControls}>
                <TouchableOpacity onPress={decrementDurationMin}>
                  <Feather name="minus" size={16} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.durationValue, { color: colors.primary }]}>{durationMin}</Text>
                <TouchableOpacity onPress={incrementDurationMin}>
                  <Feather name="plus" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Repeat profile */}
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Repeat profile</Text>

          <View style={styles.repeatRow}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={handleSelectWeekly}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: repeatType === 'weekly' ? colors.primary : colors.border },
                  repeatType === 'weekly' && { backgroundColor: colors.primary },
                ]}
              >
                {repeatType === 'weekly' && <Feather name="check" size={11} color={colors.white} />}
              </View>
              <Text style={{ color: colors.text }}>Weekly</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={handleSelectDaily}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: repeatType === 'daily' ? colors.primary : colors.border },
                  repeatType === 'daily' && { backgroundColor: colors.primary },
                ]}
              >
                {repeatType === 'daily' && <Feather name="check" size={11} color={colors.white} />}
              </View>
              <Text style={{ color: colors.text }}>Daily</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.daysRow}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleDay(index)}
                style={[
                  styles.dayCircle,
                  { borderColor: colors.border },
                  selectedDays.includes(index) && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    { color: colors.text },
                    selectedDays.includes(index) && { color: colors.white },
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Play and Submit buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.playBtn, { borderColor: colors.primary }]} onPress={handlePlay}>
              <Text style={[styles.playText, { color: colors.primary }]}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
              <Text style={[styles.submitText, { color: colors.white }]}>Submit</Text>
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
  tabText: {
    fontSize: 14,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionNote: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  durationColumn: {
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  durationValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  repeatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  playBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 99,
    paddingVertical: 12,
    alignItems: 'center',
  },
  playText: {
    fontWeight: '700',
  },
  submitBtn: {
    flex: 1,
    borderRadius: 99,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    fontWeight: '700',
  },
});