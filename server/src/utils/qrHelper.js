import QRCode from 'qrcode';

// Character set for human-friendly short IDs (avoiding confusing chars like 0/O, 1/I/l)
const CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Generate a random short alphanumeric ID (e.g. "P3MghF")
 */
export const generateShortId = (length = 6) => {
  let result = '';
  const charsetLength = CHARSET.length;
  for (let i = 0; i < length; i++) {
    result += CHARSET.charAt(Math.floor(Math.random() * charsetLength));
  }
  return result;
};

/**
 * Ensures destination URL includes valid protocol (http:// or https://)
 */
export const normalizeUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

/**
 * Generates a base64 Data URL for the QR code pointing to targetUrl
 */
export const generateQrDataUrl = async (targetUrl) => {
  return QRCode.toDataURL(targetUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 2,
    scale: 10,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });
};

/**
 * Generates a PNG Buffer for direct image download
 */
export const generateQrBuffer = async (targetUrl) => {
  return QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 2,
    scale: 10,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });
};
