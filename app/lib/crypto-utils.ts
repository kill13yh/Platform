import crypto from 'crypto';

export function encryptData(data: string, password: string) {
  const key = crypto.scryptSync(password, 'salt', 24);
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptData(encrypted: string, password: string) {
  const key = crypto.scryptSync(password, 'salt', 24);
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
