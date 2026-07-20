// ACM ka API service - yaha saare backend calls honge

const SCL_BASE_URL = 'https://acm.mcarbon.com/ACM_APP_3.4/SclClient';

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

  try {
    const response = await fetch(SCL_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=ISO-8859-1',
      },
      body: xmlBody,
    });

    const responseText = await response.text();

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
      message: 'Network error, please check your internet and try again',
    };
  }
}