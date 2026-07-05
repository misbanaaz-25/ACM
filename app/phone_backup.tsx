import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

export default function PhoneBackupScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = width > 500 ? 480 : width * 0.9;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFE8E8" />
      <LinearGradient
        colors={['#FFE8E8', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.pageTitle, { width: cardWidth }]}>Phone Backup</Text>

          {/* Backup card */}
          <View style={[styles.card, { width: cardWidth }]}>
            <View style={styles.iconCircle}>
              <Feather name="upload-cloud" size={36} color="#D40000" />
            </View>

            <Text style={styles.description}>
              Back up all address book to keep your contacts in a safe place
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                Contacts in sim memory <Text style={styles.infoBold}>137</Text>
              </Text>
              <Text style={styles.infoText}>
                Contacts in phonebook memory <Text style={styles.infoBold}>437</Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Back up now</Text>
            </TouchableOpacity>
          </View>

          {/* Previous backup / Restore card */}
          <View style={[styles.card, { width: cardWidth }]}>
            <Text style={styles.previousLabel}>Previous backup</Text>
            <Text style={styles.previousDetail}>1265 contacts : 12/11/23 12:12</Text>

            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Restore</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 60,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#D40000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  infoRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  infoBold: {
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: '#D40000',
    borderRadius: 25,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  previousLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  previousDetail: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
});