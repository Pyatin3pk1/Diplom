import CryptoJS from 'crypto-js';

const secretKey = 'MIIEpAIBAAKCAQEAzNQwRtGZFbq2BOE93hR0SRXoS42G27L2Ewp0AB/J7vtn4WWf';

const decryptText = (ciphertext) => {
    if (!ciphertext) return null;  
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedText;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};
const encryptText = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export { decryptText, encryptText };