import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import PlayIcon from '@/components/ui/Icon/play_icon';
import PauseIcon from '@/components/ui/Icon/pause_icon';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MAX_BAR_SLOTS = 35;

export default function RecordingModal({ visible, onClose }: Props) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');

  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [profileName, setProfileName] = useState('');
  const [bars, setBars] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!visible) {
      resetRecording();
    }
  }, [visible]);

  const normalizeMetering = (db: number) => {
    const minDb = -60;
    const clamped = Math.max(minDb, Math.min(0, db));
    return (clamped - minDb) / (0 - minDb);
  };

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

      const recordingOptions = {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      };

      const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);

      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording && status.metering !== undefined) {
          const normalized = normalizeMetering(status.metering);
          setBars((prev) => [...prev, normalized]);
        }
      });

      setRecording(newRecording);
      setRecordingState('recording');
      setRecordingSeconds(0);
      setBars([]);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Start recording error:', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      if (timerRef.current) clearInterval(timerRef.current);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setRecordedUri(uri);
      setRecording(null);
      setRecordingState('recorded');
    } catch (err) {
      console.error('Stop recording error:', err);
    }
  };

  const playRecording = async () => {
    try {
      if (!recordedUri) return;

      if (isPlaying) {
        if (soundRef.current) {
          await soundRef.current.pauseAsync();
        }
        setIsPlaying(false);
        return;
      }

      if (soundRef.current) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        return;
      }

      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await sound.playAsync();
      setIsPlaying(true);
    } catch (err) {
      console.error('Play recording error:', err);
    }
  };

  const resetRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (err) {
      console.log('Reset error:', err);
    }

    setRecording(null);
    setRecordingState('idle');
    setRecordedUri(null);
    setRecordingSeconds(0);
    setBars([]);
    setIsPlaying(false);
  };

  const renderWaveform = (filledColor: string, emptyColor: string, showEmptySlots: boolean) => {
    const totalSlots = showEmptySlots ? MAX_BAR_SLOTS : bars.length || 1;

    return (
      <View style={styles.waveformRow}>
        {Array.from({ length: totalSlots }).map((_, index) => {
          const hasData = index < bars.length;
          const heightPercent = hasData ? Math.max(0.15, bars[index]) : 0.15;

          return (
            <View
              key={index}
              style={[
                styles.waveBar,
                {
                  height: 60 * heightPercent,
                  backgroundColor: hasData ? filledColor : emptyColor,
                },
              ]}
            />
          );
        })}
      </View>
    );
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
            <View style={styles.idleWrapper}>
              <TouchableOpacity style={styles.micBtn} onPress={startRecording}>
                <Feather name="mic" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.micText}>
                Tap on the microphone to start recording personalized voice message
              </Text>
            </View>
          )}

          {/* RECORDING STATE */}
          {recordingState === 'recording' && (
            <View>
              <View style={styles.waveformContainer}>
                {renderWaveform(Colors.light.primary, Colors.light.border, true)}

                <TouchableOpacity style={styles.actionInline} onPress={stopRecording}>
                  <Text style={styles.stopText}>Stop</Text>
                  <PauseIcon size={20} color={Colors.light.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.timer}>
                00:{String(recordingSeconds).padStart(2, '0')} sec
              </Text>
            </View>
          )}

          {/* RECORDED STATE */}
          {recordingState === 'recorded' && (
            <View>
              <View style={styles.waveformContainer}>
                {renderWaveform(Colors.light.primary, Colors.light.primary, false)}

                <TouchableOpacity style={styles.actionInline} onPress={playRecording}>
                  <Text style={styles.playText}>{isPlaying ? 'Pause' : 'Play'}</Text>
                  <PlayIcon size={20} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.recordedFooter}>
                <Text style={styles.timer}>
                  00:{String(recordingSeconds).padStart(2, '0')} sec
                </Text>

                <TouchableOpacity onPress={resetRecording}>
                  <Text style={styles.resetText}>Record Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* CREATE BUTTON */}
          <TouchableOpacity
            disabled={profileName.trim() === '' || recordingState !== 'recorded'}
            style={[
              styles.createBtn,
              (profileName.trim() === '' || recordingState !== 'recorded') && { opacity: 0.5 },
            ]}
            onPress={() => {
              console.log('Profile created:', profileName, recordedUri);
              setProfileName('');
              resetRecording();
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
    width: '90%',
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
    color: Colors.light.primary,
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

  idleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },

  micBtn: {
    backgroundColor: Colors.light.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  micText: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  waveformRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 60,
  },

  waveBar: {
    width: 3,
    borderRadius: 2,
  },

  actionInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 10,
  },

  stopText: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  playText: {
    color: Colors.light.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  resetText: {
    color: Colors.light.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  timer: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 8,
  },

  recordedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  createBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 99,
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