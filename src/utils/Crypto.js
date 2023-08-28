var crypto = require('crypto');
var CryptoJS = require('crypto-js');
var CryptoLib = function(){};
module.exports = CryptoLib;

CryptoLib.SHA3 = function SHA3(plainText) {
    return CryptoJS.SHA3(plainText, { outputLength: 512 }).toString(CryptoJS.enc.Hex);
}

/**
 * Encrypt to string by method "aes-256-ctr"
 * @param {*} text 
 * @return string
 */
CryptoLib.encrypt = function(text, secret_key){
    var cipher = crypto.createCipher(config.server.encrypt.algorithm, secret_key);
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

/**
 * Decypt to from encrypt from method "aes-256-ctr"
 * @param {*} ciph 
 * return string
 */
 CryptoLib.decrypt = function(ciph, secret_key){
    var decipher = crypto.createDecipher(config.server.encrypt.algorithm, secret_key);
    var dec = decipher.update(ciph,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}









CryptoLib.encryptBySecretKey = function(text,secret_key){
    var cipher = crypto.createCipher(config.server.encrypt.algorithm);
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}



CryptoLib.decryptBySecretKey = function(ciph,secret_key){
    var decipher = crypto.createDecipher(config.server.encrypt.algorithm);
    var dec = decipher.update(ciph,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}
/**
 * encrypt text to base64
 * @param plaintext 
 * @return string
 */
CryptoLib.base64Encrypt = function(plaintext){
    var base64Txt = Buffer.from(plaintext).toString('base64');
    return base64Txt;
}
/**
 * decrypt to plain text from base64
 * @param {*} ciph 
 * @return string
 */
CryptoLib.base64Decrypt = function(ciph){
    var txt = Buffer.from(ciph, 'base64').toString('utf-8');
    return txt;
}
/**
 * Encrypt plain string to md5 string
 * @param {*} str 
 * @return string
 */
CryptoLib.md5 = function md5(str){
    var md5=crypto.createHash("md5");  
    md5.update(str);  
    var str=md5.digest('hex');  
    return str.toUpperCase();  //32 ký tự viết hoa  
}

/**
 * AES Encrypt plain string to AES string
 * @param {*} str 
 * @return string
 */
CryptoLib.AESEncrypt = function AESEncrypt(str, secretKey ){
    var string = CryptoJS.AES.encrypt(str, secretKey).toString();
    return string;
}


/**
 * AES Decrypt plain string to AES string
 * @param {*} str 
 * @return string
 */
CryptoLib.AESDecrypt = function AESDecrypt(str, secretKey ){
    var bytes = CryptoJS.AES.decrypt(str.toString(), secretKey);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}


// var md5 = md5('hello world','test');
// console.log(md5);
// var hw = encrypt("hello world")
// console.log(hw);
// // outputs hello world
// console.log(decrypt(hw));