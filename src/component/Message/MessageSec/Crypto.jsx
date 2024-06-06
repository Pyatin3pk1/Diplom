import CryptoJS from 'crypto-js';

const secretKey = 'your-secret-key';

const decryptText = (ciphertext) => {
    if (!ciphertext) return null;  // Добавим проверку на пустую строку
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedText;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};

export { decryptText };