import { useState , useEffect, useCallback } from 'react';
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
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter ,useLocalSearchParams } from 'expo-router';
import AlertModal from '@/components/ui/modals/AlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOtp, verifyOtp} from '@/components/services/acmApi';
import { Colors } from '@/constants/theme';

export default function LoginScreen() {
  const colors = Colors.light;

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const router = useRouter();
  const { mobile: mobileParam } = useLocalSearchParams<{ mobile?: string }>();


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

 useFocusEffect(
   useCallback(() => {
     const restoreMobile = async () => {
       // agar URL se number nahi mila (jaise back button se aane par), toh AsyncStorage se le lo
       if (mobileParam) {
         setMobile(mobileParam);
       } else {
         const saved = await AsyncStorage.getItem('mobileNumber');
         setMobile(saved || '');
       }
       setOtp('');
     };
     restoreMobile();
   }, [mobileParam])
 );

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

//logic of validation
const validateOTP = async () => {

  // pehle saari local validations - koi bhi fail ho toh yahi rukna hai, API call nahi honi chahiye
  if (mobile.trim() === '') {
    showAlert('Error', 'Please enter mobile number');
    return;
  }

  if (mobile.length !== 10) {
    showAlert('Error', 'Mobile number must be 10 digits');
    return;
  }

  if (otp.trim() === '') {
    showAlert('Error', 'Please enter OTP');
    return;
  }

  if (otp.length !== 4) {
    showAlert('Error', 'OTP must be 4 digits');
    return;
  }

  setLoading(true);

  // step 1: OTP ko server se verify karo - is response mein encoded MSISDN bhi milta hai,
  // isliye alag se encodeMsisdn call karne ki zaroorat nahi hai ab
//   const otpResult = await verifyOtp(mobile.trim(), otp.trim());
//
//   if (!otpResult.success) {
//     setLoading(false);
//     showAlert('Error', otpResult.message);
//     return;
//   }
//
//   // mobile number save kar rahe hain taaki baad me Settings/Subscribe ke time use ho sake
//   await AsyncStorage.setItem('mobileNumber', mobile.trim());
//
//   // encoded MSISDN bhi seedha yahin save kar rahe hain - agli baar Subscribe API ko yahi chahiye hogi
//   if (otpResult.encodedMsisdn) {
//     await AsyncStorage.setItem('maskedMsisdn', otpResult.encodedMsisdn);
//   }
//
//   setLoading(false);

  router.push('/main');
};

const handleResendOTP = async () => {

  if (mobile.trim() === '') {
    showAlert('Error','Please enter mobile number');
    return;
  }

  if (mobile.length !== 10) {
    showAlert('Error', 'Mobile number must be 10 digits');
    return;
  }

  setIsResendDisabled(true);
  setTimer(30);

  setLoading(true);

  const result = await sendOtp(mobile.trim());

  setLoading(false);

  if (!result.success) {
    showAlert('Error', result.message);
    return;
  }
};

 useEffect(() => {
   let interval: ReturnType<typeof setInterval>;

   if (timer > 0) {
     interval = setInterval(() => {
       setTimer((prev) => prev - 1);
     }, 1000);
   } else {
     setIsResendDisabled(false);
   }

   return () => {
     if (interval) clearInterval(interval);
   };
 }, [timer]);



  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.secondary} />
      <LinearGradient
        colors={[colors.secondary, colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

            <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>Login</Text>

            <View
              style={[
                styles.card,
                {
                  width: width > 500 ? 420 : width * 0.9,
                  paddingVertical: isLandscape ? 12 : 20,
                  backgroundColor: colors.white,
                },
              ]}
            >
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.text },
                  isLandscape && { marginBottom: 10 },
                ]}
              >
                Please enter OTP you have recieved on your registered mobile no.
              </Text>

              <View style={[styles.inputRow, { borderColor: colors.border }]}>
                <View style={[styles.countryCode, { backgroundColor: colors.secondary, borderRightColor: colors.border }]}>
                  <Text style={[styles.countryText, { color: colors.text }]}>+91</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text },
                    isLandscape && { height: 40 },
                  ]}
                  placeholder="xxxxxxxxxx"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobile}
                  onChangeText={setMobile}
                  editable={!loading}
                />
              </View>

              <View style={[styles.inputRow, { borderColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder=" Enter OTP"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                  editable={!loading}
                />
              </View>

             <TouchableOpacity
               style={[styles.button, { backgroundColor: colors.primary }, loading && { opacity: 0.6 }]}
               onPress={validateOTP}
               disabled={loading}
             >

               <Text style={styles.buttonText}>
                 {loading ? 'Please wait...' : 'Validate'}
               </Text>
             </TouchableOpacity>

             <TouchableOpacity
                style={[
                  styles.button1,
                  { borderColor: colors.primary },
                  isLandscape && { marginBottom: 8 },
                  isResendDisabled && { opacity: 0.6 },
                ]}
                disabled={isResendDisabled}
                onPress={handleResendOTP}
              >
                <Text style={[styles.buttonText1, { color: colors.primary }]}>
                  {isResendDisabled
                    ? `Resend OTP (${timer}s)`
                    : 'Resend OTP'}
                </Text>
              </TouchableOpacity>

              <Text style={[styles.footer, { color: colors.text }]}>
                Please read our{' '}
                <Text style={[styles.link, { color: colors.primary }]}>term of uses</Text>{' '}
                and{' '}
                <Text style={[styles.link, { color: colors.primary }]}>privacy policy</Text>.
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
 },
card: {
  borderRadius: 16,
  padding: 20,
  width: '100%',
  maxWidth: 480,
  elevation: 3,
  shadowColor: '#000',
},
 subtitle: {
   fontSize: 13,
   marginBottom: 18,
   lineHeight: 20,
 },
  inputRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  countryCode: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  countryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    height: 48,
  },
  button: {
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
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '400',
  },
});
