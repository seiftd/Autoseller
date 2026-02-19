import { AuditLog } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';

// In a real backend, this key would be in a secure Vault or Environment Variable.
// For this client-side demo, we derive it from a static secret or user password.
const APP_SECRET_KEY = import.meta.env.VITE_APP_SECRET || 'REPLYGENIE_SUPER_SECRET_KEY_2025';

export const securityService = {

  // --- ENCRYPTION (AES-GCM) ---
  async encrypt(text: string): Promise<string> {
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
      console.warn("Crypto not available in this environment");
      return text;
    }
    try {
      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw", enc.encode(APP_SECRET_KEY), { name: "PBKDF2" }, false, ["deriveKey"]
      );

      const key = await window.crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: enc.encode("replygenie_salt"), iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        enc.encode(text)
      );

      // Return IV + Encrypted Data as Hex
      const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
      const encryptedHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
      return `${ivHex}:${encryptedHex}`;
    } catch (e) {
      console.error("Encryption Failed", e);
      throw new Error("Encryption Failed");
    }
  },

  async decrypt(cipherText: string): Promise<string> {
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
      return cipherText;
    }
    try {
      const [ivHex, encryptedHex] = cipherText.split(':');
      if (!ivHex || !encryptedHex) return cipherText;

      const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      const encryptedData = new Uint8Array(encryptedHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw", enc.encode(APP_SECRET_KEY), { name: "PBKDF2" }, false, ["deriveKey"]
      );

      const key = await window.crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: enc.encode("replygenie_salt"), iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encryptedData
      );

      return new TextDecoder().decode(decrypted);
    } catch (e) {
      console.error("Decryption Failed", e);
      return cipherText;
    }
  },

  // --- AUDIT LOGGING ---
  logAction: (action: string, targetId?: string, details?: any) => {
    const user = authService.getCurrentUser();
    if (!user) return;

    const log: AuditLog = {
      id: (typeof window !== 'undefined' && window.crypto?.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36),
      userId: user.id,
      action,
      targetId,
      timestamp: Date.now(),
      details: details,
      ipAddress: 'Client-Side',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'
    };

    storageService.addAuditLog(log);
  },

  // --- SECURITY CHECKS ---

  validateTenantAccess: (resourceUserId: string): boolean => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true; // Admins access all
    return currentUser.id === resourceUserId;
  }
};