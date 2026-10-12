import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (to, otp, name = 'User') => {
  const html = `
    <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(11,43,79,0.1);">
      <div style="background:linear-gradient(135deg,#0B2B4F,#1E6A8C);padding:30px;text-align:center;color:#fff;">
        <h1 style="margin:0;font-size:24px;">🏫 Gurukul EduSphere</h1>
        <p style="margin:6px 0 0;opacity:0.85;font-size:13px;">Password Reset OTP</p>
      </div>
      <div style="padding:30px;">
        <p style="font-size:15px;color:#0B2B4F;">Hello <strong>${name}</strong>,</p>
        <p style="color:#5A6B7E;font-size:14px;line-height:1.6;">
          You requested to reset your password. Use the OTP below to proceed:
        </p>
        <div style="background:#F5F9FC;border-radius:14px;padding:22px;text-align:center;margin:20px 0;">
          <p style="margin:0;font-size:12px;color:#5A6B7E;letter-spacing:2px;text-transform:uppercase;">Your OTP</p>
          <h2 style="font-size:38px;letter-spacing:8px;color:#0B2B4F;margin:10px 0;font-weight:800;">${otp}</h2>
          <p style="margin:0;font-size:12px;color:#8B9AAB;">Valid for 10 minutes</p>
        </div>
        <p style="font-size:12px;color:#8B9AAB;line-height:1.6;">
          If you didn't request this, ignore this email.
        </p>
      </div>
      <div style="background:#F5F9FC;padding:16px;text-align:center;font-size:11px;color:#8B9AAB;">
        © ${new Date().getFullYear()} Gurukul EduSphere · Nanded
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: `"Gurukul EduSphere" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Password Reset OTP — Gurukul EduSphere',
    html,
  });
};