import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Colors } from '@/constants/theme';
import AlertModal from '@/components/ui/modals/AlertModal';
import { useSubscription } from '@/hooks/useSubscription';

// Subscribe card + welcome modal - main.tsx se yahi cheez hata ke yaha dala hai
export default function SubscribeCard({ cardWidth, onSubscribe }) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const colors = Colors.light;

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // SRP fix: encode + subscribe API ka poora logic ab is hook ke andar hai
  // ye component ab sirf UI (card + modal) dikhane pe focus karta hai
  const { subscribe } = useSubscription();

  // Subscribe button dabate hi seedha welcome modal khul jata hai (jaisa pehle tha)
  const handleSubscribePress = () => {
    setShowWelcomeModal(true);
  };

  // "Okay" dabane pe ab hook se poora subscribe flow chalega
  const handleOkayPress = async () => {
    setLoading(true);
    const result = await subscribe();
    setLoading(false);
    setShowWelcomeModal(false);

    if (result.success) {
      // ye parent ko batayega ki user subscribe ho gaya
      onSubscribe();
    } else {
      showAlert('Error', result.message);
    }
  };

  return (
    <>
      {/* Subscription card */}
      <View style={[styles.subscribeCard, { width: cardWidth, backgroundColor: colors.white }]}>
        <Text style={[styles.subscribeText, { color: colors.text }]}>
          Subscribe to access Service of Airtel Call Manager
        </Text>

        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: colors.primary }]}
          onPress={handleSubscribePress}
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
              style={[styles.modalBtn, { backgroundColor: colors.primary }, loading && { opacity: 0.6 }]}
              onPress={handleOkayPress}
              disabled={loading}
            >
              <Text style={[styles.modalBtnText, { color: colors.white }]}>
                {loading ? 'Please wait...' : 'Okay'}
              </Text>
            </TouchableOpacity>
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
  subscribeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  subscribeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    marginRight: 12,
  },
  subscribeButton: {
    borderRadius: 99,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  subscribeButtonText: {
    fontSize: 15,
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
    padding: 24,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 21,
  },
  modalBtn: {
    borderRadius: 99,
    paddingVertical: 12,
    paddingHorizontal: 50,
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});