import crypto from 'crypto';

const algo = 'aes-256-cbc';

const getEncryptionKey = (): string => {
  // Fetch the encryption key from the environment variables
  const eKey = process.env.E_KEY;

  if (!eKey) {
    throw new Error('Encryption key not found in environment variables.');
  }

  return eKey;
};

const encryptData = (data: string, key: string, iv: Buffer) => {
  const cipher = crypto.createCipheriv(algo, Buffer.from(key, 'hex'), iv);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
};

const decryptData = (encryptedData: string, key: string, iv: Buffer) => {
  const decipher = crypto.createDecipheriv(algo, Buffer.from(key, 'hex'), iv);
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
};

export const encryptionUtils = { getEncryptionKey, encryptData, decryptData };
