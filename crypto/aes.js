const crypto = require('crypto')

const IV = crypto.randomBytes(16);
const KEY = "DEMO_PRIVATE_KEY"


const encrypt = (data) => {
    const cipher = crypto.createCipheriv("aes-128-cbc", KEY, Buffer.from(IV));
    cipher.setAutoPadding(true);
    return cipher.update(data, "utf8", "hex") + cipher.final("hex") + IV.toString("hex");
}

const decrypt = (data) => {
    data = data.toString();
    const iv = data.slice(-32);
    data = data.slice(0, -32);

    const decipher = crypto.createDecipheriv("aes-128-cbc", KEY, Buffer.from(iv, "hex"));
    decipher.setAutoPadding(true);
    return decipher.update(data, "hex", "utf8") + decipher.final("utf8");
}

module.exports = {
    encrypt,
    decrypt
}
