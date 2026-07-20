import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '@/constants/theme';

type AlertModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  illustration?: React.ReactNode; // optional - jab pass hoga tabhi dikhega
};

export default function AlertModal({
  visible,
  title,
  message,
  onClose,
  illustration,
}: AlertModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {illustration && (
            <View style={styles.illustrationBox}>
              {illustration}
            </View>
          )}

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.light.background,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  illustrationBox: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    width: '100%',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 99,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});