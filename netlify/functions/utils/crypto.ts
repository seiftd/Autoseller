
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

function getEncryptionKey(): Buffer {
    const keyStr = process.env.ENCRYPTION_KEY || 'default-dev-key-at-least-32-chars-long';
    return scryptSync(keyStr, 'salt', 32);
}

/** AES-256-GCM encryption */
export function encryptToken(plaintext: string): string {
    const key = getEncryptionKey();
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/** AES-256-GCM decryption */
export function decryptToken(encrypted: string): string {
    const [ivHex, authTagHex, ciphertextHex] = encrypted.split(':');
    if (!ivHex || !authTagHex || !ciphertextHex) {
        throw new Error('Invalid encrypted token format');
    }

    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const ciphertext = Buffer.from(ciphertextHex, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
}
