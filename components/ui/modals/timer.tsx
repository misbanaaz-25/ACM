import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ScheduleModal({ visible, onClose }: Props) {
  const { width } = useWindowDimensions();
  const colors = Colors.light;

  const [activeTab, setActiveTab] = useState('time'); // 'date' ya 'time'

  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(15);
  const [ampm, setAmpm] = useState('AM');

  const [durationHr, setDurationHr] = useState(7);
  const [durationMin, setDurationMin] = useState(15);

  const [repeatType, setRepeatType] = useState(''); // 'weekly' ya 'daily'
  const [selectedDays, setSelectedDays] = useState([]);

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const toggleDay = (index) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter((d) => d !== index));
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { width: width * 0.85, backgroundColor: colors.background }]}>

          {/* Header with tabs and close button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setActiveTab('date')}>
              <Text style={[styles.tabText, { color: colors.text }, activeTab === 'date' && { color: colors.primary, fontWeight: '700' }]}>
                Set Date
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab('time')}>
              <Text style={[styles.tabText, { color: colors.text }, activeTab === 'time' && { color: colors.primary, fontWeight: '700' }]}>
                Set Time
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Set Time picker */}
          {activeTab === 'time' && (
            <View style={styles.pickerRow}>
              <View style={styles.pickerColumn}>
                <TouchableOpacity onPress={() => setHour(hour - 1)}>
                  <Text style={[styles.pickerSmall, { color: colors.border }]}>{hour - 1}</Text>
                </TouchableOpacity>
                <Text style={[styles.pickerSelected, { color: colors.primary }]}>{hour}</Text>
                <TouchableOpacity onPress={() => setHour(hour + 1)}>
                  <Text style={[styles.pickerSmall, { color: colors.border }]}>{hour + 1}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.pickerColumn}>
                <TouchableOpacity onPress={() => setMinute(minute - 1)}>
                  <Text style={[styles.pickerSmall, { color: colors.border }]}>{minute - 1}</Text>
                </TouchableOpacity>
                <Text style={[styles.pickerSelected, { color: colors.primary }]}>{minute}</Text>
                <TouchableOpacity onPress={() => setMinute(minute + 1)}>
                  <Text style={[styles.pickerSmall, { color: colors.border }]}>{minute + 1}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.pickerColumn}>
                <TouchableOpacity onPress={() => setAmpm(ampm === 'AM' ? 'PM' : 'AM')}>
                  <Text style={[styles.pickerSmall, { color: colors.border }]}>
                    {ampm === 'AM' ? 'PM' : 'AM'}
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.pickerSelected, { color: colors.primary }]}>{ampm}</Text>
                <TouchableOpacity onPress={() => setAmpm(ampm === 'AM' ? 'PM' : 'AM')}>
                  <Text style={[styles.pickerSmall, { color: colors.border }]}>
                    {ampm === 'AM' ? 'PM' : 'AM'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Set Date picker - abhi simple placeholder, baad mein detail karenge */}
          {activeTab === 'date' && (
            <View style={styles.pickerRow}>
              <Text style={{ color: colors.text }}>Date picker yaha aayega</Text>
            </View>
          )}

          {/* Set duration */}
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Set duration</Text>
          <Text style={[styles.sectionNote, { color: colors.text }]}>
            Note: Set duration (Max: 11 hrs 59 mins)
          </Text>

          <View style={styles.durationRow}>
            <View style={styles.durationColumn}>
              <Text style={[styles.durationLabel, { color: colors.text }]}>Hr</Text>
              <View style={styles.durationControls}>
                <TouchableOpacity onPress={() => setDurationHr(durationHr - 1)}>
                  <Feather name="minus" size={16} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.durationValue, { color: colors.primary }]}>{durationHr}</Text>
                <TouchableOpacity onPress={() => setDurationHr(durationHr + 1)}>
                  <Feather name="plus" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.durationColumn}>
              <Text style={[styles.durationLabel, { color: colors.text }]}>Min</Text>
              <View style={styles.durationControls}>
                <TouchableOpacity onPress={() => setDurationMin(durationMin - 1)}>
                  <Feather name="minus" size={16} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.durationValue, { color: colors.primary }]}>{durationMin}</Text>
                <TouchableOpacity onPress={() => setDurationMin(durationMin + 1)}>
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
              onPress={() => setRepeatType('weekly')}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: colors.border },
                  repeatType === 'weekly' && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              />
              <Text style={{ color: colors.text }}>Weekly</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setRepeatType('daily')}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: colors.border },
                  repeatType === 'daily' && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              />
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
            <TouchableOpacity style={[styles.playBtn, { borderColor: colors.primary }]}>
              <Text style={[styles.playText, { color: colors.primary }]}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]}>
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
  pickerColumn: {
    alignItems: 'center',
  },
  pickerSmall: {
    fontSize: 14,
    marginVertical: 4,
  },
  pickerSelected: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 4,
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
    borderWidth: 1,
    borderRadius: 3,
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