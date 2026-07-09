import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const BLOCKED_CONTACTS = [
  { id: '1', name: 'Lana Steiner', number: '+91 6584357775' },
  { id: '2', name: 'Betsy Considine', number: '+91 6584357775' },
  { id: '3', name: 'Pat Yundt', number: '+91 6584357775' },
  { id: '4', name: "Viola O'Kon", number: '+91 6584357775' },
  { id: '5', name: 'Alberta Schoen', number: '+91 6584357775' },
  { id: '6', name: 'Lynda Bogan', number: '+91 6584357775' },
  { id: '7', name: 'Malcolm Connely', number: '+91 6584357775' },
  { id: '8', name: 'Van Bogisich', number: '+91 6584357775' },
  { id: '9', name: 'Lana Steiner', number: '+91 6584357775' },
];

const textColor = Colors?.light?.text ?? '#1A1A1A';
const subtextColor = Colors?.light?.subtext ?? '#8A8A8A';
const iconCircleColor = Colors?.light?.iconCircle ?? '#C4C4C4';
const cardBorderColor = Colors?.light?.cardBorder ?? '#EDEDED';

export default function BlockedContacts() {
  const router = useRouter();
  const [contacts, setContacts] = useState(BLOCKED_CONTACTS);

  const handleDelete = (id) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.leftSection}>
        <View style={[styles.iconCircle, { borderColor: iconCircleColor }]}>
          <MaterialCommunityIcons name="cancel" size={22} color={iconCircleColor} />
        </View>
        <View style={styles.textSection}>
          <Text style={[styles.name, { color: textColor }]}>{item.name}</Text>
          <Text style={[styles.number, { color: subtextColor }]}>{item.number}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={22} color={textColor} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFE5E5" />
      <LinearGradient
        colors={['#FFE5E5', '#FFFFFF']}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color={textColor} />
          <Text style={[styles.backText, { color: textColor }]}>Back</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: textColor }]}>Blocked Contacts</Text>

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: cardBorderColor }]} />
          )}
          ListEmptyComponent={() => (
            <Text style={[styles.emptyText, { color: subtextColor }]}>
              No blocked contacts yet
            </Text>
          )}
        />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
      width:100,
    fontSize: 16,
    marginLeft: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textSection: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  number: {
    fontSize: 13,
  },
  separator: {
    height: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});