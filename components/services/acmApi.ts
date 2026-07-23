// ACM ka API service - yaha saare backend calls honge

import AsyncStorage from '@react-native-async-storage/async-storage';

const SCL_BASE_URL = 'https://acm.mcarbon.com/ACM_APP_3.4/SclClient';
const SUBSCRIBE_URL = 'https://acm.mcarbon.com/ACMService/thirdparty/v1/Subscribe';
const CHANGE_PROFILE_URL = 'https://acm.mcarbon.com/ACMService/thirdparty/v1/ChangeActiveProfile';
const ENCODE_MSISDN_URL = 'https://acm.mcarbon.com/ACMService/encode';
const OTP_CNF_URL = SCL_BASE_URL;

// har request ko unique TID chahiye hota hai, isliye time se generate kar rahe hain
function generateTid(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yy}${mm}${dd}${hh}${min}${ss}`;
}

export interface SendOtpResult {
  success: boolean;
  message: string;
  regionId?: string;
}

// SEND_OTP API - mobile number pe OTP bhejta hai (server confirm hai ki koi change nahi karni)
export async function sendOtp(mobile: string): Promise<SendOtpResult> {
  const tid = generateTid();

  const xmlBody = `<?xml version="1.0" encoding="ISO-8859-1"?>
<SCL>
    <MSG>SEND_OTP</MSG>
    <MSISDN>${mobile}</MSISDN>
    <APP_VER>3.7</APP_VER>
    <OS>AN|35</OS>
    <AUTHKEY>12345</AUTHKEY>
    <TYPE0>NO</TYPE0>
    <TID>${tid}</TID>
    <APP_VER>3.4.0</APP_VER>
</SCL>`;

  console.log('[sendOtp] REQUEST ->', { url: SCL_BASE_URL, mobile, tid, xmlBody });

  try {
    const response = await fetch(SCL_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=ISO-8859-1',
      },
      body: xmlBody,
    });

    const responseText = await response.text();

    console.log('[sendOtp] RESPONSE <-', { status: response.status, responseText });

    // response XML mein aata hai, regex se values nikal rahe hain
    const statusMatch = responseText.match(/<STATUS>(.*?)<\/STATUS>/);
    const disMsgMatch = responseText.match(/<DISMSG>(.*?)<\/DISMSG>/);
    const regionMatch = responseText.match(/<REGIONID>(.*?)<\/REGIONID>/);

    const status = statusMatch ? statusMatch[1] : '';
    const disMsg = disMsgMatch ? disMsgMatch[1] : 'Something went wrong, please try again';

    if (status === 'TRUE') {
      return {
        success: true,
        message: disMsg,
        regionId: regionMatch ? regionMatch[1] : undefined,
      };
    }

    return {
      success: false,
      message: disMsg,
    };
  } catch (error) {
    console.log('sendOtp error:', error);
    return {
      success: false,
      message: 'something went wrong,please try again',
    };
  }
}

export interface SubscribeResult {
  success: boolean;
  message: string;
  maskedMsisdn?: string;
}

// Subscribe API (JSON based)
export async function subscribeUser(mobile: string): Promise<SubscribeResult> {
  const tid = generateTid();

  const requestBody = {
    tid: tid,
    os: 'Android|11.0.1',
  };

  console.log('[subscribeUser] REQUEST ->', {
    url: SUBSCRIBE_URL,
    headers: { Msisdn: mobile, Circle: 'UW' },
    body: requestBody,
  });

  try {
    const response = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Msisdn': mobile,
        'Circle': 'UW',
        'Authorization': 'AcmThanksApp',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('[subscribeUser] RESPONSE <-', { status: response.status, data });

    if (data.statusCode === 200 && data.maskedMsisdn) {
      return {
        success: true,
        message: data.msg || 'Subscribed successfully',
        maskedMsisdn: data.maskedMsisdn,
      };
    }

    return {
      success: false,
      message: data.msg || 'Subscription failed, please try again',
    };
  } catch (error) {
    console.log('subscribeUser error:', error);
    return {
      success: false,
      message: 'something went wrong, please try again',
    };
  }
}

export interface ChangeProfileResult {
  success: boolean;
  message: string;
}

export interface EncodeMsisdnResult {
  success: boolean;
  message: string;
  encodedMsisdn?: string;
}

//  ChangeActiveProfile API (JSON based)
export async function changeActiveProfile(
  profileName: string,
  duration: string
): Promise<ChangeProfileResult> {
  // pehle saved maskedMsisdn nikalna hoga, jo subscribe ke time save hua tha
  const maskedMsisdn = await AsyncStorage.getItem('maskedMsisdn');

  if (!maskedMsisdn) {
    console.log('[changeActiveProfile] BLOCKED -> no maskedMsisdn found in AsyncStorage');
    return {
      success: false,
      message: 'Please subscribe first before activating a profile',
    };
  }

  const tid = generateTid();

  const requestBody = {
    tid: tid,
    os: 'Android|11.0.1',
    name: profileName,
    duration: duration,
  };

  console.log('[changeActiveProfile] REQUEST ->', {
    url: CHANGE_PROFILE_URL,
    headers: { maskedMsisdn },
    body: requestBody,
  });

  try {
    const response = await fetch(CHANGE_PROFILE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'maskedMsisdn': maskedMsisdn,
        'Authorization': 'AcmThanksApp',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('[changeActiveProfile] RESPONSE <-', { status: response.status, data });

    if (data.statusCode === 200) {
      return {
        success: true,
        message: data.msg || 'Profile activated successfully',
      };
    }

    return {
      success: false,
      message: data.msg || 'Could not activate profile, please try again',
    };
  } catch (error) {
    console.log('changeActiveProfile error:', error);
    return {
      success: false,
      message: 'Network error, please check your internet and try again',
    };
  }
}

// Encode API - raw mobile number ko encoded MSISDN mein convert karta hai (baaki SCL APIs ko yahi encoded value chahiye hoti hai)
export async function encodeMsisdn(
  mobile: string
): Promise<EncodeMsisdnResult> {
  console.log('[encodeMsisdn] REQUEST ->', { url: ENCODE_MSISDN_URL, mobile });

  try {
    const response = await fetch(ENCODE_MSISDN_URL, {
      method: 'GET',
      headers: {
        msisdn: mobile,
      },
    });

    const encodedValue = await response.text();

    console.log('[encodeMsisdn] RESPONSE <-', { status: response.status, encodedValue });

    if (response.ok) {
      return {
        success: true,
        message: 'MSISDN encoded successfully',
        encodedMsisdn: encodedValue,
      };
    }

    return {
      success: false,
      message: 'Encoding failed',
    };
  } catch (error) {
    console.log('encodeMsisdn error:', error);

    return {
      success: false,
      message: 'Network error',
    };
  }
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  encodedMsisdn?: string;
}

// OTP_CNF API - user ne jo OTP dala hai usko server se verify karta hai
// NOTE: response ka asli format abhi bhi <RESULT>/<DISMSG> nahi, balki alag hai (GET_SUBS_DATA_RSP, RESULT=SUCCESS, MSISDN encoded aata hai) - ye parsing baad mein fix karni hai
export async function verifyOtp(mobile: string, otp: string): Promise<VerifyOtpResult> {
  const tid = generateTid();

  const xmlBody = `<?xml version="1.0" encoding="ISO-8859-1"?>
<SCL>
    <MSG>OTP_CNF</MSG>
    <MSISDN>${mobile}</MSISDN>
    <OS>AN|35</OS>
    <AUTHKEY>12345</AUTHKEY>
    <OTP>${otp}</OTP>
    <TID>${tid}</TID>
    <APP_VER>3.4.0</APP_VER>
</SCL>`;

  console.log('[verifyOtp] REQUEST ->', { url: OTP_CNF_URL, mobile, otp, tid, xmlBody });

  try {
    const response = await fetch(OTP_CNF_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=ISO-8859-1',
      },
      body: xmlBody,
    });

    const responseText = await response.text();

    console.log('[verifyOtp] RESPONSE <-', { status: response.status, responseText });


    const resultMatch = responseText.match(/<RESULT>(.*?)<\/RESULT>/);
    const msisdnMatch = responseText.match(/<MSISDN>(.*?)<\/MSISDN>/);

    const result = resultMatch ? resultMatch[1] : '';
    const encodedMsisdn = msisdnMatch ? msisdnMatch[1] : undefined;

    if (result === 'SUCCESS') {
      return { success: true, message: 'OTP verified successfully', encodedMsisdn };
    }

    return { success: false, message: 'Invalid OTP, please try again' };
  } catch (error) {
    console.log('verifyOtp error:', error);
    return { success: false, message: 'something went wrong,please try again' };
  }
}

//------change active profile new---

export interface ChangeProfileSclResult {
  success: boolean;
  message: string;
}

export async function changeActiveProfileScl(
  encodedMsisdn: string,
  profileType: string
): Promise<ChangeProfileSclResult> {
  const tid = generateTid();

  const xmlBody = `<?xml version="1.0" encoding="ISO-8859-1"?>
<SCL>
    <MESSAGETYPE>CHANGE_ACTIVE_PROFILE_REQ</MESSAGETYPE>
    <MSISDN>${encodedMsisdn}</MSISDN>
    <PROFILETYPE>${profileType}</PROFILETYPE>
    <APP_VER>3.4</APP_VER>
    <TIME></TIME>
    <ACTIVELISTTYPE>WHITE</ACTIVELISTTYPE>
    <TRANSACTION_ID>${tid}</TRANSACTION_ID>
    <AUTHKEY>12345</AUTHKEY>
    <LANGUAGE>ENGLISH</LANGUAGE>
    <KEYWORD>ACM_APP</KEYWORD>
    <RESULT_REQ>YES</RESULT_REQ>
    <OS>AN|35</OS>
</SCL>`;

  console.log('[changeActiveProfileScl] REQUEST ->', { url: SCL_BASE_URL, encodedMsisdn, profileType, tid, xmlBody });

  try {
    const response = await fetch(SCL_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=ISO-8859-1',
      },
      body: xmlBody,
    });

    const responseText = await response.text();

    console.log('[changeActiveProfileScl] RESPONSE <-', { status: response.status, responseText });

    // server yahan RESULT/DISMSG nahi, MSG aur REQ_RESULT tags bhejta hai
    const msgMatch = responseText.match(/<MSG>(.*?)<\/MSG>/);
    const reqResultMatch = responseText.match(/<REQ_RESULT>(.*?)<\/REQ_RESULT>/);

    const msg = msgMatch ? msgMatch[1] : 'Something went wrong, please try again';
    const reqResult = reqResultMatch ? reqResultMatch[1] : '';

    if (reqResult === 'SUCC') {
      return { success: true, message: msg };
    }

    return { success: false, message: msg };
  } catch (error) {
    console.log('changeActiveProfileScl error:', error);
    return { success: false, message: 'Something went wrong, please try again' };
  }
}

//------subscribe new (XML/SCL based) ---
// NAYI Subscribe API - purani JSON wali subscribeUser se alag hai
// Iske liye pehle encodeMsisdn se encoded MSISDN nikalna zaroori hai, tabhi ye call ho sakti hai
export interface SubscribeSclResult {
  success: boolean;
  message: string;
}

export async function subscribeUserScl(
  encodedMsisdn: string
): Promise<SubscribeSclResult> {
  const tid = generateTid();

  const xmlBody = `<?xml version="1.0" encoding="ISO-8859-1"?>
<SCL>
    <MESSAGETYPE>NEW_USER_REGISTER_REQ</MESSAGETYPE>
    <MSISDN>${encodedMsisdn}</MSISDN>
    <TRANSACTION_ID>${tid}</TRANSACTION_ID>
    <KEYWORD>ACM_APP</KEYWORD>
    <LANGUAGE>ENGLISH</LANGUAGE>
    <SERVICE_NAME>ACM</SERVICE_NAME>
    <APP_VER>3.4</APP_VER>
    <OS>AN|35</OS>
    <AUTHKEY>12345</AUTHKEY>
    <SERVICE_CODE>1234</SERVICE_CODE>
    <REQTYPE>ACM</REQTYPE>
</SCL>`;

  console.log('[subscribeUserScl] REQUEST ->', { url: SCL_BASE_URL, encodedMsisdn, tid, xmlBody });

  try {
    const response = await fetch(SCL_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=ISO-8859-1',
      },
      body: xmlBody,
    });

    const responseText = await response.text();

    console.log('[subscribeUserScl] RESPONSE <-', { status: response.status, responseText });

    // is API mein bhi MSG aur REQ_RESULT tags aate hain (jaise changeActiveProfileScl mein)
    const msgMatch = responseText.match(/<MSG>(.*?)<\/MSG>/);
    const reqResultMatch = responseText.match(/<REQ_RESULT>(.*?)<\/REQ_RESULT>/);

    const msg = msgMatch ? msgMatch[1] : 'Something went wrong, please try again';
    const reqResult = reqResultMatch ? reqResultMatch[1] : '';

    if (reqResult === 'SUCC') {
      return { success: true, message: msg };
    }

    return { success: false, message: msg };
  } catch (error) {
    console.log('subscribeUserScl error:', error);
    return { success: false, message: 'Network error, please check your internet and try again' };
  }
}