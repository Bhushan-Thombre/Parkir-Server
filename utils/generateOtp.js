import twilio from 'twilio';
import asyncHandler from 'express-async-handler';

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOtp = asyncHandler(async (req, res) => {
  try {
    const { countryCode, mobile } = req.body;

    const otpResponse = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+${countryCode}${mobile}`,
        channel: 'sms',
      });
    res.status(200);
    res.json(otpResponse);
  } catch (error) {
    res.status(400);
    throw new Error('Failed to send OTP');
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  try {
    const { countryCode, mobile, otp } = req.body;

    const verifiedResponse = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+${countryCode}${mobile}`,
        code: otp,
      });
    res.status(200);
    res.json(verifiedResponse);
  } catch (error) {
    res.status(400);
    throw new Error('Failed to verify code');
  }
});

export { sendOtp, verifyOtp };
