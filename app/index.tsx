import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import AlertModal from '@/components/ui/modals/AlertModal'
import { sendOtp } from '@/components/services/acmApi';

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useFocusEffect(useCallback(() => {
      setMobile('');
    }, [])
  );

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  //logic of validation
   const validateMobile = async () => {

    if (mobile.trim() === '') {
      showAlert('Error', 'Please enter your mobile number');
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      showAlert('Error', 'Please enter a valid 10 digit mobile number');
      return;
    }

     // API calling.....
       setLoading(true);
       const result = await sendOtp(mobile.trim());
       setLoading(false);

     if (result.success) {
        router.push({ pathname: '/validate', params: { mobile: mobile.trim() } });
                } else {
       showAlert('Error', result.message);
     }
    };

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <LinearGradient
      colors={['#FFE8E8', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff5f5" />

     <KeyboardAvoidingView
       style={styles.keyboard}
       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
     >
       <View
         style={[
           styles.container,
           isLandscape && styles.landscapeContainer,
         ]}
       >
         <Text style={styles.title}>Login</Text>

         <View
           style={[
             styles.card,
             {
               width: width > 500 ? 480 : width * 0.9,
             },
           ]}
         >
           <Text style={styles.subtitle}>
             Please enter your 10 digit mobile number to get one time password (OTP)
           </Text>

           <View style={styles.inputRow}>
             <View style={styles.countryCode}>
               <Text style={styles.countryText}>+91</Text>
             </View>

             <TextInput
               style={styles.input}
               placeholder="Enter Mobile number"
               placeholderTextColor="#aaa"
               keyboardType="phone-pad"
               maxLength={10}
               value={mobile}
               onChangeText={setMobile}
               editable={!loading}
             />
           </View>

           <TouchableOpacity
             style={[styles.button, loading && styles.buttonDisabled]}
             onPress={validateMobile}
             disabled={loading}
           >
             <Text style={styles.buttonText}>
               {loading ? 'Please wait...' : 'Get OTP'}
             </Text>
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
      <AlertModal
               visible={alertVisible}
               title={alertTitle}
               message={alertMessage}
               onClose={() => setAlertVisible(false)}
             />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  // Landscape ke liye
  landscapeContainer: {
    justifyContent: 'center',
    paddingTop: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 25,
  },

  card: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
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
    marginBottom: 18,
  },

  countryCode: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },

  countryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#000',
  },

  button: {
    backgroundColor: '#D40000',
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },

  link: {
    color: '#D40000',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});