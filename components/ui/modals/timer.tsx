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
import AlertModal from '@/components/ui/modals/AlertModal';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaveDate?: (date: string) => void;
  onSubmitTime?: (data: {
    hour: number;
    minute: number;
    ampm: 'AM' | 'PM';
    durationHr: number;
    durationMin: number;
    repeatType: '' | 'weekly' | 'daily';
    selectedDays: number[];
  }) => void;
};

const ITEM_HEIGHT = 36;
const VISIBLE_ITEMS = 3;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const calendarDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const repeatDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function WheelPicker({ data, selectedIndex, onChange }: {
  data: (string | number)[];
  selectedIndex: number;
  onChange: (index: number) => void;
}) {
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

export default function ScheduleModal({ visible, onClose, onSaveDate, onSubmitTime }: Props) {
  const { width } = useWindowDimensions();
  const colors = Colors.light;

  const [activeTab, setActiveTab] = useState<'date' | 'time'>('time');

  const hoursData = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutesData = Array.from({ length: 60 }, (_, i) => i);
  const ampmData = ['AM', 'PM'];

  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(15);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  const [durationHr, setDurationHr] = useState(7);
  const [durationMin, setDurationMin] = useState(15);

  const [repeatType, setRepeatType] = useState<'' | 'weekly' | 'daily'>('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

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

  const handleSelectDaily = () => {
    if (repeatType === 'daily') {
      setRepeatType('');
      setSelectedDays([]);
      return;
    }
    setRepeatType('daily');
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
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
      showAlert('Error', 'Please select the days.');
      return;
    }
    if (repeatType === 'weekly' && selectedDays.length === 0) {
      showAlert('Error', 'Please select at least one day.');
      return;
    }

    console.log('Preview schedule:', { hour, minute, ampm, durationHr, durationMin, repeatType, selectedDays });
    onClose();
  };

  const handleSubmit = () => {
    if (repeatType === '') {
      showAlert('Error', 'Please select the days.');
      return;
    }
    if (repeatType === 'weekly' && selectedDays.length === 0) {
      showAlert('Error', 'Please select at least one day.');
      return;
    }

    onSubmitTime?.({ hour, minute, ampm, durationHr, durationMin, repeatType, selectedDays });

    setHour(7);
    setMinute(15);
    setAmpm('AM');
    setDurationHr(7);
    setDurationMin(15);
    setRepeatType('');
    setSelectedDays([]);
    onClose();
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let d = 1; d <= totalDaysInMonth; d++) days.push(d);
    return days;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const handleSelectDay = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleCancelDate = () => {
    setSelectedDate(null);
    onClose();
  };

  const handleSaveDate = () => {
    if (!selectedDate) {
      showAlert('Select Date', 'Please select a date before saving.');
      return;
    }
    onSaveDate?.(formatDate(selectedDate));
    setSelectedDate(null);
    onClose();
  };

  const calendarDays = getCalendarDays();

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.container, { width: width * 0.85, backgroundColor: colors.background }]}>

            {/* Header - centered tabs, fixed close icon */}
            <View style={styles.header}>
              <View style={styles.headerSide} />

              <View style={styles.tabsRow}>
                <TouchableOpacity onPress={() => setActiveTab('date')}>
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === 'date' ? colors.primary : colors.text },
                      activeTab === 'date' && styles.tabTextActive,
                    ]}
                  >
                    Set Date
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('time')} style={styles.tabButton}>
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === 'time' ? colors.primary : colors.text },
                      activeTab === 'time' && styles.tabTextActive,
                    ]}
                  >
                    Set Time
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.headerSide, styles.headerRight]}>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* ---------- SET DATE TAB CONTENT ---------- */}
            {activeTab === 'date' && (
              <>
                <View style={styles.monthRow}>
                  <TouchableOpacity onPress={goToPrevMonth}>
                    <Feather name="chevron-left" size={20} color={colors.primary} />
                  </TouchableOpacity>

                  <Text style={[styles.monthText, { color: colors.text }]}>
                    {monthNames[currentMonth]} {currentYear}
                  </Text>

                  <TouchableOpacity onPress={goToNextMonth}>
                    <Feather name="chevron-right" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.dayLabelsRow}>
                  {calendarDayLabels.map((label, index) => (
                    <Text key={index} style={[styles.dayLabelText, { color: colors.border }]}>
                      {label}
                    </Text>
                  ))}
                </View>

                <View style={styles.calendarGrid}>
                  {calendarDays.map((day, index) => (
                    <View key={index} style={styles.dayCell}>
                      {day !== null && (
                        <TouchableOpacity
                          onPress={() => handleSelectDay(day)}
                          style={[
                            styles.dayCircle,
                            { borderColor: colors.border },
                            isSelected(day) && { backgroundColor: colors.primary, borderColor: colors.primary },
                          ]}
                        >
                          <Text
                            numberOfLines={1}
                            style={[
                              { color: colors.text, fontSize: 13 },
                              isSelected(day) && { color: colors.white },
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>

                {selectedDate && (
                  <Text style={[styles.selectedText, { color: colors.primary }]}>
                    Selected: {formatDate(selectedDate)}
                  </Text>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.playBtn, { borderColor: colors.primary }]} onPress={handleCancelDate}>
                    <Text style={[styles.playText, { color: colors.primary }]}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleSaveDate}>
                    <Text style={[styles.submitText, { color: colors.white }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ---------- SET TIME TAB CONTENT ---------- */}
            {activeTab === 'time' && (
              <>
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

                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Repeat profile</Text>

                <View style={styles.repeatRow}>
                  <TouchableOpacity style={styles.checkboxRow} onPress={handleSelectWeekly}>
                    <View
                      style={[
                        styles.checkbox,
                        { borderColor: repeatType === 'weekly' ? colors.primary : colors.border },
                        repeatType === 'weekly' && { backgroundColor: colors.primary },
                      ]}
                    >
                      {repeatType === 'weekly' && <Feather name="check" size={11} color={colors.white} />}
                    </View>
                    <Text style={{ color: colors.text, fontSize: 14, lineHeight: 25, width: 50 }}>Weekly</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.checkboxRow} onPress={handleSelectDaily}>
                    <View
                      style={[
                        styles.checkbox,
                        { borderColor: repeatType === 'daily' ? colors.primary : colors.border },
                        repeatType === 'daily' && { backgroundColor: colors.primary },
                      ]}
                    >
                      {repeatType === 'daily' && <Feather name="check" size={11} color={colors.white} />}
                    </View>
                    <Text style={{ color: colors.text, fontSize: 14, lineHeight: 20, width: 40 }}>Daily</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.daysRow}>
                  {repeatDayLabels.map((day, index) => (
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

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.playBtn, { borderColor: colors.primary }]} onPress={handlePlay}>
                    <Text style={[styles.playText, { color: colors.primary }]}>Play</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
                    <Text style={[styles.submitText, { color: colors.white }]}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

          </View>
        </View>
      </Modal>

      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  headerSide: {
    width: 20,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  tabButton: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
     width:100,
    fontSize: 14,
    textAlign: 'center',
  },
  tabTextActive: {
    width:100,
    fontWeight: '700',

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
    fontSize: 14,
    width: 30,
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
    gap: 16,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
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
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  monthText: {
    fontSize: 15,
    fontWeight: '700',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayLabelText: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    marginBottom: 6,
  },
  selectedText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
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