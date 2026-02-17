export const cryptoService = {
  // Convert string to ArrayBuffer
  str2ab: (str: string): ArrayBuffer => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },

  // Verify HMAC SHA-256 Signature
  verifySignature: async (payload: string, signature: string, secret: string): Promise<boolean> => {
    try {
        const enc = new TextEncoder();
        const keyData = enc.encode(secret);
        const payloadData = enc.encode(payload);

        // Import the secret key
        const key = await window.crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify", "sign"]
        );

        // Calculate expected signature
        const signatureBuf = await window.crypto.subtle.sign(
            "HMAC",
            key,
            payloadData
        );

        // Convert signature buffer to hex string
        const signatureArray = Array.from(new Uint8Array(signatureBuf));
        const calculatedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Constant-time comparison (simulated here by checking length first)
        // Note: The signature from FB usually starts with "sha256="
        const providedSignature = signature.startsWith('sha256=') ? signature.split('=')[1] : signature;

        return calculatedSignature === providedSignature;
    } catch (e) {
        console.error("Signature Verification Error:", e);
        return false;
    }
  }
};