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
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function LoginScreen() {
  const colors = Colors.light;
  const router = useRouter();

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Editable mobile number (OTP step) - tap number to edit, no pencil icon
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [editedMobile, setEditedMobile] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // Step 1: "Get OTP"
  const handleGetOtp = async () => {
    if (mobile.trim() === '') {
      showAlert('Error', 'Please enter your mobile number');
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      showAlert('Error', 'Please enter a valid 10 digit mobile number');
      return;
    }

    // TESTING
    // setLoading(true);
    // const result = await sendOtp(mobile.trim());
    // setLoading(false);

    // if (result.success) {
      setStep('otp');
    // } else {
    //   showAlert('Error', result.message);
    // }
  };

  // Step 2: "Validate"
  const handleValidateOtp = async () => {
    if (otp.trim() === '') {
      showAlert('Error', 'Please enter OTP');
      return;
    }

    if (otp.length !== 4) {
      showAlert('Error', 'OTP must be 4 digits');
      return;
    }

    // TESTING:
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

    // TESTING
    const result = await sendOtp(mobile.trim());
    setLoading(false);

    if (!result.success) {
      showAlert('Error', result.message);
    }
  };

  // Tap on mobile number (OTP step) to start editing directly - no pencil icon
  const handleStartEditMobile = () => {
    if (loading) return;
    setEditedMobile(mobile);
    setIsEditingMobile(true);
  };

  useFocusEffect(
    useCallback(() => {
      setStep('mobile');
      setMobile('');
      setOtp('');
      setEditedMobile('');

      return () => {};
    }, [])
  );

  // Save edited number -> validate -> trigger fresh OTP
  const handleSaveMobile = async () => {
    if (!/^\d{10}$/.test(editedMobile.trim())) {
      showAlert('Error', 'Please enter a valid 10 digit mobile number');
      return;
    }

    setMobile(editedMobile.trim());
    setIsEditingMobile(false);
    setOtp('');

    // TESTING
    // setLoading(true);
    // const result = await sendOtp(editedMobile.trim());
    // setLoading(false);

    // if (!result.success) {
    //   showAlert('Error', result.message);
    // }
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
                  minHeight: step === 'otp' ? 340 : 260,
                  paddingVertical: isLandscape ? 12 : 22,
                  backgroundColor: colors.surface,
                  shadowColor: colors.black,
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
                      placeholderTextColor={colors.textSecondary}
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
                    <Text style={[styles.buttonText, { color: colors.white }]}>
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
                     <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Enter Mobile number"
                      placeholderTextColor={colors.textSecondary}
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
                      placeholder="Enter OTP"
                      placeholderTextColor={colors.textSecondary}
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
                    <Text style={[styles.buttonText, { color: colors.white }]}>
                      {loading ? 'Please wait...' : 'Validate'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button1, { borderColor: colors.primary, backgroundColor: colors.white }, isResendDisabled && { opacity: 0.6 }]}
                    disabled={isResendDisabled}
                    onPress={handleResendOTP}
                  >
                    <Text style={[styles.buttonText1, { color: colors.primary }]}>
                      {isResendDisabled ? `Resend OTP (${timer}s)` : 'Resend OTP'}
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
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 18,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    height: 48,
  },
  countryCode: {
    height: '100%',
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
    height: '100%',
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 14,
    includeFontPadding: false,
  },
  tapToEdit: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  mobileDisplayText: {
    fontWeight: '400',
  },
  button: {
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button1: {
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
  footer: {
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '400',
  },
});
