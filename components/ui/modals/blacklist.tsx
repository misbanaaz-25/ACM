import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function BlacklistModal({ visible, onClose }: Props) {
  const { width } = useWindowDimensions();
  const colors = Colors.light;

  // step handle krne k lie - pehle options, phir number entry
  const [step, setStep] = useState<'options' | 'enterNumber'>('options');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleClose = () => {
    setStep('options'); // reset kr do taki next time fir se options se start ho
    setPhoneNumber('');
    onClose();
  };

  const handleAdd = () => {
    if (phoneNumber.trim() === '') return;
    console.log('Added to blacklist:', countryCode, phoneNumber);
    setPhoneNumber('');
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      {step === 'options' ? (
        // ----- Step 1: Add to blacklist by (options) -----
        <View style={styles.modalOverlay}>
          <View style={[styles.optionsBox, { backgroundColor: colors.white }]}>
            <Text style={[styles.optionsTitle, { color: colors.text }]}>Add to blacklist by</Text>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => setStep('enterNumber')}
            >
              <Feather name="credit-card" size={20} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.text }]}>Enter manually</Text>
            </TouchableOpacity>

            <View style={[styles.optionDivider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.optionRow} onPress={() => {}}>
              <Feather name="smartphone" size={20} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.text }]}>Add From phonebook</Text>
            </TouchableOpacity>

            <View style={[styles.optionDivider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.optionRow} onPress={() => {}}>
              <Feather name="phone-call" size={20} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.text }]}>Add from call log</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // ----- Step 2: Enter number manually -----
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.container, { width: width * 0.88, backgroundColor: colors.background }]}>

            <Text style={[styles.title, { color: colors.primary }]}>
              Enter the number you want to add to blacklist
            </Text>

            <View style={[styles.inputRow, { borderColor: colors.border }]}>
              <Text style={[styles.codeText, { color: colors.text }]}>{countryCode}</Text>
              <Feather name="chevron-down" size={16} color={colors.text} />

              <View style={[styles.separator, { backgroundColor: colors.border }]} />

              <TextInput
                style={[styles.numberInput, { color: colors.text }]}
                placeholder="Enter Number"
                placeholderTextColor={colors.border}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.primary }]}
                onPress={handleClose}
              >
                <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
                onPress={handleAdd}
              >
                <Text style={[styles.addText, { color: colors.white }]}>Add to Blacklist</Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ----- options popup styles -----
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsBox: {
    borderRadius: 20,
    padding: 20,
    width: '85%',
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionDivider: {
    height: 1,
  },
  // ----- enter number popup styles -----
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
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 8,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    width: 1,
    height: 20,
    marginHorizontal: 8,
  },
  numberInput: {
    flex: 1,
    fontSize: 14,
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
  addBtn: {
    flex: 2,
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addText: {
    fontWeight: '700',
    fontSize: 13,
  },
});