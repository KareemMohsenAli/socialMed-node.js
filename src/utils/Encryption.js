import CryptoJS from "crypto-js"
export const Encryption = ({ encData = {}, signature = process.env.ENCRYPTION_SIGNATURE} = {}) => {
    let ciphertext = CryptoJS.AES.encrypt(encData, signature).toString();
    return ciphertext
}


export const Decryption = ({ encData = {}, signature = process.env.ENCRYPTION_SIGNATURE, expiresIn = 60 * 60 } = {}) => {
    let ciphertext = CryptoJS.AES.decrypt(encData, signature).toString();
    let originalText = ciphertext.toString(CryptoJS.enc.Utf8);
    return originalText
}
