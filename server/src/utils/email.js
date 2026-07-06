import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const buildTransport = () => {
  if (env.smtp.host && env.smtp.user) {
    return nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass }
    });
  }

  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transport = buildTransport();
  const info = await transport.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text,
    html
  });

  if (!env.smtp.host && info.message) {
    console.log(`Email preview for ${to}: ${info.message.toString()}`);
  }
  return info;
};

export const emailTemplates = {
  welcome: (name, link) => ({
    subject: 'Welcome to Parentsphere',
    html: `<h2>Welcome, ${name}</h2><p>Your Parentsphere account is ready.</p><p><a href="${link}">Verify your email</a></p>`,
    text: `Welcome to Parentsphere. Verify your email: ${link}`
  }),
  reset: (name, link) => ({
    subject: 'Reset your Parentsphere password',
    html: `<h2>Password reset</h2><p>Hello ${name}, use this secure link to reset your password.</p><p><a href="${link}">Reset password</a></p>`,
    text: `Reset your password: ${link}`
  }),
  booking: (name, counsellor, date, time) => ({
    subject: 'Parentsphere booking confirmed',
    html: `<h2>Booking confirmed</h2><p>Hello ${name}, your session with ${counsellor} is confirmed for ${date} at ${time}.</p>`,
    text: `Booking confirmed with ${counsellor} on ${date} at ${time}.`
  }),
  payment: (name, amount) => ({
    subject: 'Parentsphere payment successful',
    html: `<h2>Payment successful</h2><p>Hello ${name}, we received your payment of ₹${amount}.</p>`,
    text: `Payment successful: INR ${amount}.`
  })
};
