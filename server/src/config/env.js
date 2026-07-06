import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/parentsphere',
  accessSecret: process.env.JWT_ACCESS_SECRET || 'parentsphere_dev_access_secret_change_me',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'parentsphere_dev_refresh_secret_change_me',
  accessExpires: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  refreshExpires: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Parentsphere <no-reply@parentsphere.local>'
  },
  openaiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayCurrency: process.env.RAZORPAY_CURRENCY || 'INR'
};
