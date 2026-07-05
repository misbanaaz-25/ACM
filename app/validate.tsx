
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFE8E8" />
      <LinearGradient
        colors={['#FFE8E8', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

            <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <View
              style={[
                styles.card,
                {
                  width: width > 500 ? 420 : width * 0.9,
                  paddingVertical: isLandscape ? 12 : 20,
                },
              ]}
            >
              <Text
                style={[
                  styles.subtitle,
                  isLandscape && { marginBottom: 10 },
                ]}
              >
                Please enter OTP you have recieved on your registered mobile no.
              </Text>

              <View style={styles.inputRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryText}>+91</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    isLandscape && { height: 40 },
                  ]}
                  placeholder="xxxxxxxxxx"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobile}
                  onChangeText={setMobile}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder=" Enter OTP"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={otp}
                  onChangeText={setOtp}
                />
              </View>

             <TouchableOpacity
               style={styles.button}
               onPress={() => router.push('/without_profile')}
             >

               <Text style={styles.buttonText}>Validate</Text>
             </TouchableOpacity>


              <TouchableOpacity
                style={[
                  styles.button1,
                  isLandscape && { marginBottom: 8 },
                ]}
                onPress={() => router.push('/resend_OTP')}
              >
                <Text style={styles.buttonText1}>Resend OTP</Text>
              </TouchableOpacity>

              <Text style={styles.footer}>
                Please read our{' '}
                <Text style={styles.link}>term of uses</Text>{' '}
                and{' '}
                <Text style={styles.link}>privacy policy</Text>.
              </Text>
            </View>
         </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
 title: {
   position: 'absolute',
   top: 60,
   left: 20,
   fontSize: 22,
   fontWeight: '700',
   color: '#000',
 },
card: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
  width: '100%',
  maxWidth: 480,
  elevation: 3,
  shadowColor: '#000',
},
 subtitle: {
   fontSize: 13,
   color: '#333',
   marginBottom: 18,
   lineHeight: 20,
 },
  inputRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  countryCode: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  countryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#000',
    height: 48,
  },
  button: {
    backgroundColor: '#D40000',
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button1: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D40000',
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText1: {
    color: '#D40000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  link: {
    color: '#D40000',
    textDecorationLine: 'underline',
    fontWeight: '400',
  },
});