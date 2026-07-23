import { useState, useEffect } from 'react';
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
import AlertModal from '@/components/ui/modals/AlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOtp, verifyOtp } from '@/components/services/acmApi';
import { Colors } from '@/constants/theme';

// ⚠️ TESTING VERSION - API calls comment kiye hue hain, taaki bina real OTP ke flow test kar sako
// Real testing/demo ke waqt saare comments hata dena aur original API calls wapas laga dena

export default function LoginScreen() {
  const colors = Colors.light;
  const router = useRouter();

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // Step 1: "Get OTP" dabane par
  const handleGetOtp = async () => {
    if (mobile.trim() === '') {
      showAlert('Error', 'Please enter your mobile number');
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      showAlert('Error', 'Please enter a valid 10 digit mobile number');
      return;
    }

    // TESTING: API call skip kiya hai, seedha step change kar rahe hain
    // setLoading(true);
    // const result = await sendOtp(mobile.trim());
    // setLoading(false);

    // if (result.success) {
      setStep('otp');
    // } else {
    //   showAlert('Error', result.message);
    // }
  };

  // Step 2: "Validate" dabane par
  const handleValidateOtp = async () => {
    if (otp.trim() === '') {
      showAlert('Error', 'Please enter OTP');
      return;
    }

    if (otp.length !== 4) {
      showAlert('Error', 'OTP must be 4 digits');
      return;
    }

    // TESTING: verifyOtp API skip kiya hai, seedha navigate kar rahe hain
    // setLoading(true);
    // const otpResult = await verifyOtp(mobile.trim(), otp.trim());

    // if (!otpResult.success) {
    //   setLoading(false);
    //   showAlert('Error', otpResult.message);
    //   return;
    // }

    await AsyncStorage.setItem('mobileNumber', mobile.trim());

    // if (otpResult.encodedMsisdn) {
    //   await AsyncStorage.setItem('maskedMsisdn', otpResult.encodedMsisdn);
    // }

    setLoading(false);
    router.push('/main');
  };

  const handleResendOTP = async () => {
    setIsResendDisabled(true);
    setTimer(30);
    setLoading(true);

    // TESTING: resend bhi skip kar sakti ho, but rehne dete hain agar real test karna ho isko
    const result = await sendOtp(mobile.trim());
    setLoading(false);

    if (!result.success) {
      showAlert('Error', result.message);
    }
  };

  // "Change number" - wapas step 1 pe le jayega, OTP field clear kar dega
  const handleChangeNumber = () => {
    setStep('mobile');
    setOtp('');
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
              {step === 'mobile' ? (
                <>
                  <Text style={[styles.subtitle, { color: colors.text }]}>
                    Please enter your 10 digit mobile number to get one time password (OTP)
                  </Text>

                  <View style={[styles.inputRow, { borderColor: colors.border }]}>
                    <View style={[styles.countryCode, { backgroundColor: colors.secondary, borderRightColor: colors.border }]}>
                      <Text style={[styles.countryText, { color: colors.text }]}>+91</Text>
                    </View>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
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
                    style={[styles.button, { backgroundColor: colors.primary }, loading && { opacity: 0.6 }]}
                    onPress={handleGetOtp}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? 'Please wait...' : 'Get OTP'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={[styles.subtitle, { color: colors.text }]}>
                    Please enter OTP you have received on your registered mobile no.
                  </Text>

                  <View style={[styles.inputRow, { borderColor: colors.border }]}>
                    <View style={[styles.countryCode, { backgroundColor: colors.secondary, borderRightColor: colors.border }]}>
                      <Text style={[styles.countryText, { color: colors.text }]}>+91</Text>
                    </View>
                    <Text style={[styles.input, { color: colors.text, textAlignVertical: 'center' }]}>
                      {mobile}
                    </Text>
                  </View>

                  <View style={[styles.inputRow, { borderColor: colors.border }]}>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Enter OTP"
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
                    onPress={handleValidateOtp}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? 'Please wait...' : 'Validate'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button1, { borderColor: colors.primary }, isResendDisabled && { opacity: 0.6 }]}
                    disabled={isResendDisabled}
                    onPress={handleResendOTP}
                  >
                    <Text style={[styles.buttonText1, { color: colors.primary }]}>
                      {isResendDisabled ? `Resend OTP (${timer}s)` : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleChangeNumber} disabled={loading}>
                    <Text style={[styles.changeNumberText, { color: colors.primary }]}>
                      Change mobile number
                    </Text>
                  </TouchableOpacity>
                </>
              )}

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
    marginBottom: 12,
  },
  buttonText1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeNumberText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textDecorationLine: 'underline',
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
