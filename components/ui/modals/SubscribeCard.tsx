import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Colors } from '@/constants/theme';

// Subscribe card + welcome modal - main.tsx se yahi cheez hata ke yaha dala hai
export default function SubscribeCard({ cardWidth, onSubscribe }) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const colors = Colors.light;

  return (
    <>
      {/* Subscription card */}
      <View style={[styles.subscribeCard, { width: cardWidth, backgroundColor: colors.white }]}>
        <Text style={[styles.subscribeText, { color: colors.text }]}>
          Subscribe now to personalize and control your calls
        </Text>

        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowWelcomeModal(true)}
        >
          <Text style={[styles.subscribeButtonText, { color: colors.white }]}>Subscribe</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Modal */}
      <Modal
        visible={showWelcomeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWelcomeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: cardWidth, backgroundColor: colors.white }]}>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Hello!{'\n'}As a privileged Airtel customer you have been granted free access to Airtel Call Manager services.
            </Text>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setShowWelcomeModal(false);
                // ye modal band hote hi parent ko batayega ki user subscribe ho gaya
                onSubscribe();
              }}
            >
              <Text style={[styles.modalBtnText, { color: colors.white }]}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  subscribeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  subscribeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
    marginRight: 12,
  },
  subscribeButton: {
    borderRadius: 99,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  subscribeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalBtn: {
    borderRadius: 99,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
