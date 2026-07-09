import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function RecordingModal({ visible, onClose }: Props) {
  const [recording, setRecording] = useState<any>(null);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');

  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [profileName, setProfileName] = useState('');
  const timerRef = useRef<any>(null);
  const { width } = useWindowDimensions();
  const cardWidth = width > 500 ? 480 : width * 0.9;

  useEffect(() => {
    if (!visible) {
      resetRecording();
    }
  }, [visible]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Microphone permission chahiye recording ke liye');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setRecordingState('recording');
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      clearInterval(timerRef.current);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setRecordedUri(uri);
      setRecording(null);
      setRecordingState('recorded');
    } catch (err) {
      console.log(err);
    }
  };

  const playRecording = async () => {
    try {
      if (!recordedUri) return;

      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      await sound.playAsync();
    } catch (err) {
      console.log(err);
    }
  };

  const resetRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }
    } catch (err) {
      console.log('Reset error:', err);
    }

    setRecording(null);
    setRecordingState('idle');
    setRecordedUri(null);
    setRecordingSeconds(0);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>

        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Custom Profile</Text>

            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Profile Name Input */}
          <TextInput
            placeholder="Add profile name"
            value={profileName}
            onChangeText={setProfileName}
            style={styles.input}
          />

          {/* IDLE STATE */}
          {recordingState === 'idle' && (
            <TouchableOpacity
              style={[styles.micBtn, { width: width * 0.5 }]}
              onPress={startRecording}
            >
              <Feather name="mic" size={24} color="#fff" />
              <Text style={styles.micText}>Tap to start recording</Text>
            </TouchableOpacity>
          )}

          {/* RECORDING STATE */}
          {recordingState === 'recording' && (
            <View style={styles.center}>
              <TouchableOpacity onPress={stopRecording}>
                <Text style={styles.stopText}>Stop</Text>
              </TouchableOpacity>

              <Text style={styles.timer}>
                00:{String(recordingSeconds).padStart(2, '0')}
              </Text>
            </View>
          )}

          {/* RECORDED STATE */}
          {recordingState === 'recorded' && (
            <View style={styles.center}>

              <TouchableOpacity onPress={playRecording}>
                <Text style={styles.playText}>Play</Text>
              </TouchableOpacity>

              <Text style={styles.timer}>
                00:{String(recordingSeconds).padStart(2, '0')}
              </Text>

              <TouchableOpacity onPress={resetRecording}>
                <Text style={styles.resetText}>Record Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* CREATE BUTTON */}
         <TouchableOpacity
           disabled={profileName.trim() === '' || recordingState !== 'recorded'}
           style={[
             styles.createBtn,
             (profileName.trim() === '' || recordingState !== 'recorded') && { opacity: 0.5 }
           ]}
           onPress={() => {
             console.log('Profile created:', profileName, recordedUri);
               setProfileName('');   //Name clear
               resetRecording();     // Recording reset

             onClose();
           }}
         >
           <Text style={styles.createText}>Create Profile</Text>
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
  },

  container: {
    backgroundColor: Colors.light.background,
    borderRadius: 25,

    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 14,
    color: Colors.light.text,
  },

  micBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  micText: {
    color: Colors.light.white,
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },

  stopText: {
    color: Colors.light.error,
    fontSize: 16,
    fontWeight: '600',
  },

  playText: {
    color: Colors.light.success,
    fontSize: 16,
    fontWeight: '600',
  },

  resetText: {
    color: Colors.light.primary,
    marginTop: 10,
    fontSize: 14,
    width:200,
    marginLeft: 110,
  },

  timer: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 10,
  },

  createBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
    width: '100%',
  },

  createText: {
    color: Colors.light.white,
    fontWeight: '600',
    fontSize: 15,
  },
});