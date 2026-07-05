import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function CreateProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photo, setPhoto] = useState(null);

  const avatarSize = Math.min(width * 0.32, 120);
  const cardWidth = Math.min(width * 0.9, 420);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSkip = () => router.push('/without_profile');
  const handleNext = () => router.push('/home');

  return (
    <LinearGradient colors={['#FFE8E8', '#FFFFFF']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.header, { width: cardWidth }]}>
            <Text style={styles.headerTitle}>Create profile</Text>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={pickImage}>
              <View
                style={[
                  styles.avatarCircle,
                  {
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: avatarSize / 2,
                  },
                ]}
              >
                {photo ? (
                  <Image
                    source={{ uri: photo }}
                    style={{
                      width: avatarSize,
                      height: avatarSize,
                      borderRadius: avatarSize / 2,
                    }}
                  />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={28} color="#6B6B6B" />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* First Name */}
          <View style={[styles.fieldGroup, { width: cardWidth }]}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter First name"
              placeholderTextColor="#A8A8A8"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Last Name */}
          <View style={[styles.fieldGroup, { width: cardWidth }]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Last name"
              placeholderTextColor="#A8A8A8"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, { width: cardWidth }]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ED1C24',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarCircle: {
    backgroundColor: '#D8C7C9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  fieldGroup: { marginBottom: 20 },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1A1A1A',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ED1C24',
    borderRadius: 99,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});