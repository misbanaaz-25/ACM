import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const dummyProfiles = [
  { id: '1', type: 'Meeting', time: '17:12', duration: '05 min 05 sec', date: '19-11-2025' },
  { id: '2', type: 'Meeting', time: '17:12', duration: '05 hr 05 min', date: '20-11-2025' },
  { id: '3', type: 'Driving', time: '06:00', duration: '50 min 00 sec', date: '29-11-2025' },
];

export default function ScheduledProfileScreen() {
  const router = useRouter();
  const colors = Colors.light;

  const [profiles, setProfiles] = useState(dummyProfiles);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDeletePress = (id) => {
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const confirmDelete = (id) => {
    setProfiles(profiles.filter((item) => item.id !== id));
    setConfirmDeleteId(null);
  };

  return (
   <>
   <LinearGradient
     colors={[colors.secondary, colors.background]}
     start={{ x: 0, y: 0 }}
     end={{ x: 1, y: 1 }}
     style={styles.container}
   >
      {/* Header */}
      <View style={styles.header}>

        <Text style={[styles.title, { color: colors.text }]}>Scheduled Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {profiles.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}
          >
            {confirmDeleteId === item.id ? (
              // delete confirm wala view - isi card ke andar
              <View>
                <Text style={[styles.confirmText, { color: colors.text }]}>
                  Are you sure, you want to delete this profile?
                </Text>
                <View style={styles.confirmBtnRow}>
                  <TouchableOpacity
                    style={[styles.cancelBtn, { borderColor: colors.primary }]}
                    onPress={cancelDelete}
                  >
                    <Text style={[styles.cancelBtnText, { color: colors.primary }]}>No, Cancel!</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.yesBtn, { backgroundColor: colors.primary }]}
                    onPress={() => confirmDelete(item.id)}
                  >
                    <Text style={[styles.yesBtnText, { color: colors.white }]}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // normal card view
              <View style={styles.cardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.profileType, { color: colors.text }]}>{item.type}</Text>
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                    Time : {item.time}
                  </Text>
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                    Duration mins : {item.duration}
                  </Text>
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                    {item.date}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => handleDeletePress(item.id)}>
                  <Feather name="x" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
   </LinearGradient>
   </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  list: {
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileType: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    marginBottom: 2,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
    textAlign: 'center',
  },
  confirmBtnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderRadius: 99,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  yesBtn: {
    borderRadius: 99,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  yesBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
