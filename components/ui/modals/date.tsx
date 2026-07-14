import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import AlertModal from '@/components/ui/modals/AlertModal';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (date: string) => void;
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function DateModal({ visible, onClose, onSave }: Props) {
  const { width } = useWindowDimensions();
  const colors = Colors.light;

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  // navigate to months next and previous
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

  // calendar grid banane ke liye - month ke din + khali padding cells
  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: (number | null)[] = [];

    // month start se pehle ke khali cells
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      days.push(d);
    }

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

  const handleCancel = () => {
    setSelectedDate(null);
    onClose();
  };

  const handleSave = () => {
    if (!selectedDate) {
        setShowAlert(true);
      return;
    }
    onSave(formatDate(selectedDate));
    setSelectedDate(null);
    onClose();
  };

  const calendarDays = getCalendarDays();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { width: width * 0.85, backgroundColor: colors.background }]}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: colors.primary, fontWeight: '700' }]}>
              Select Date
            </Text>

            <TouchableOpacity onPress={handleCancel}>
              <Feather name="x" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Month navigation */}
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

          {/* Day labels row */}
          <View style={styles.dayLabelsRow}>
            {dayLabels.map((label, index) => (
              <Text key={index} style={[styles.dayLabelText, { color: colors.border }]}>
                {label}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
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
                  style={[{ color: colors.text, fontSize: 13 },
                      isSelected(day) && { color: colors.white },]}>{day}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
          {/* Selected date confirmation */}
          {selectedDate && (<Text style={[styles.selectedText, { color: colors.primary }]}>
              Selected: {formatDate(selectedDate)}
              </Text>
          )}

          {/* Cancel and Save buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.primary }]} onPress={handleCancel}>
              <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
              <Text style={[styles.saveText, { color: colors.white }]}>Save</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
      <AlertModal
        visible={showAlert}
        title="Select Date"
        message="Please select a date before saving."
        onClose={() => setShowAlert(false)}
      />
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
  headerText: {
    fontSize: 14,
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
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 99,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    borderRadius: 99,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: {
    fontWeight: '700',
  },
});