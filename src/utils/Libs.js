

var diff = require('deep-diff').diff;
var formatNum = require('format-number');
var logger = FLLogger.getLogger("LibLog");
var date = require('date-and-time');
var NumberToWordsVN = require('read-vn-number');
var NumberToWords = require('number-to-words')
const moment = require("moment");
const roundTo = require('round-to');
import Jimp from 'jimp';

var Libs = function () {
}
module.exports = Libs;
var tableCode = [
	{ value: '2ZS', id: '!' }, { value: 'X3p', id: '“' }, { value: 'imE', id: '#' }, { value: 'EUT', id: '$' },
	{ value: 'XSh', id: '%' }, { value: 'E5P', id: '&' }, { value: 'WEj', id: '‘' }, { value: '45Q', id: '(' },
	{ value: 'iI1', id: ')' }, { value: 't6x', id: '*' }, { value: 'hd9', id: '+' }, { value: 'jiJ', id: ',' },
	{ value: 'UPw', id: '-' }, { value: 'AxC', id: '.' }, { value: 'Ywb', id: '/' }, { value: 'aY8', id: '0' },
	{ value: 'mLR', id: '1' }, { value: 'qae', id: '2' }, { value: 'Xpg', id: '3' }, { value: 'oS3', id: '4' },
	{ value: 'dTN', id: '5' }, { value: 'jSC', id: '6' }, { value: 'Dfz', id: '7' }, { value: 'Sz1', id: '8' },
	{ value: 'Qu1', id: '9' }, { value: 'i5E', id: ':' }, { value: 'IQ6', id: ';' }, { value: 'Qnn', id: '<' },
	{ value: 'ZPA', id: '=' }, { value: 'N9x', id: '>' }, { value: 'oiI', id: '?' }, { value: 'yU3', id: '@' },
	{ value: '46o', id: 'A' }, { value: '7nE', id: 'B' }, { value: 'wuQ', id: 'C' }, { value: 'O1O', id: 'D' },
	{ value: 'SKy', id: 'E' }, { value: 'r1H', id: 'F' }, { value: 'aUW', id: 'G' }, { value: 'Tew', id: 'H' },
	{ value: 'chh', id: 'I' }, { value: '7FA', id: 'J' }, { value: 'ekK', id: 'K' }, { value: 'Ewp', id: 'L' },
	{ value: 'Oxa', id: 'M' }, { value: 'T6g', id: 'N' }, { value: 'xYx', id: 'O' }, { value: 'gbz', id: 'P' },
	{ value: 'd4h', id: 'Q' }, { value: '1Ow', id: 'R' }, { value: 'Fw6', id: 'S' }, { value: 'mor', id: 'T' },
	{ value: 'NDC', id: 'U' }, { value: '7pm', id: 'V' }, { value: 'Rn4', id: 'W' }, { value: 'RVu', id: 'X' },
	{ value: 'dUW', id: 'Y' }, { value: 'ic8', id: 'Z' }, { value: 'aRm', id: '[' }, { value: 'po7', id: "\\" },
	{ value: 'tVA', id: ']' }, { value: 'C5a', id: '^' }, { value: 'G0m', id: '_' }, { value: 'WHB', id: '`' },
	{ value: 'P91', id: 'a' }, { value: 'cDf', id: 'b' }, { value: '5Zp', id: 'c' }, { value: 'pX5', id: 'd' },
	{ value: 'beG', id: 'e' }, { value: 'sgd', id: 'f' }, { value: '2Dl', id: 'g' }, { value: 'YjH', id: 'h' },
	{ value: 'SQB', id: 'i' }, { value: 'jJE', id: 'j' }, { value: 'Gtw', id: 'k' }, { value: 'JsK', id: 'l' },
	{ value: 'qfv', id: 'm' }, { value: '5ty', id: 'n' }, { value: 'BSm', id: 'o' }, { value: 'Fbd', id: 'p' },
	{ value: 'xO7', id: 'q' }, { value: 'W5R', id: 'r' }, { value: 'ugh', id: 's' }, { value: 'nbs', id: 't' },
	{ value: 'mgl', id: 'u' }, { value: 'aqL', id: 'v' }, { value: 'QJN', id: 'w' }, { value: 'X9d', id: 'x' },
	{ value: 'lIB', id: 'y' }, { value: 'Csm', id: 'z' }, { value: 'uQ8', id: '' }, { value: 'EW7', id: '|' },
	{ value: 'pP9', id: '' }, { value: '5r3', id: '~' }, { value: 'Nq0', id: ' ' }
];


/**
 * @description Generate random string
 * @author: Long.Pham
 * @return str
 */
Libs.generateStrRandom = function (len, charSet) {
	charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?';
	var randomString = '';
	for (var i = 0; i < len; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz, randomPoz + 1);
	}
	return randomString;
}


Libs.SHA3 = function (plainText) {
	if (typeof plainText === 'undefined') {
		return plainText;
	}
	var CryptoLib = require('./Crypto.js');
	return CryptoLib.SHA3(plainText);
}


Libs.encodePassWord = function (plainTxt, secret_key) {
	try {
		var CryptoLib = require('./Crypto.js');
		// var tokenParam = config.server.token_param;
		// var md5Password = Libs.md5(plainTxt);
		var encryptTxt = CryptoLib.encrypt(plainTxt, secret_key);
		return encryptTxt;
	} catch (e) {
		logger.error(e);
	}
}

Libs.decodePassWord = function (ciphTxt, secret_key) {
	try {
		var CryptoLib = require('./Crypto.js');
		var decryptTxt = CryptoLib.decrypt(ciphTxt, secret_key);
		return decryptTxt;
	} catch (e) {
		logger.error(e);
	}
}




Libs.uploadResizeImage = async function (source, destinationPath, fileName, quality = 100, w = 0, h = 0) {
	if (!source || !destinationPath || !fileName) return;

	var lastFilePathCharacter = destinationPath.slice(-1);
	if (lastFilePathCharacter === '/') {
		destinationPath = destinationPath.substring(0, destinationPath.length - 1);
	}

	//Tạo thư mục upload nếu chưa tồn tại
	let exist = true;
	try {
		exist = fs.statSync(destinationPath).isDirectory()
	} catch (e) {
		exist = false;
	}
	if (!exist) {
		await Libs.mkdirFolder(destinationPath);
	}
	var path = require('path');
	Jimp.read(source)
		.then(lenna => {
			if (w == 0 && h == 0) {
				return lenna
					.quality(quality)
					.write(path.join(destinationPath, fileName));
			} else {
				return lenna
					.resize(w, h)
					.quality(quality)
					.write(path.join(destinationPath, fileName));
			}

		})
		.catch(err => {
			console.error(err);
		});
}

















/**
 * Taka Encode
 * @param plaintext 
 * @return string
 */

Libs.takaEncode = function (text) {
	if (Libs.isBlank(text)) {
		return text;
	}
	var chars = text.split('');
	let str = '';
	for (var i = 0; i < chars.length; i++) {
		var find = Libs.find(tableCode, 'id', chars[i]);
		if (find) {
			str += find.value;
		}
	}
	return str;
}


/**
 * Taka Decode
 * @param plaintext 
 * @return string
 */

Libs.takaDecode = function (text) {
	if (Libs.isBlank(text)) {
		return text;
	}
	let chars = [], str = '';
	var start = 0;
	for (var i = 0; i < text.length / 3; i++) {
		chars.push(text.substr(start, 3));
		start += 3;
	}

	for (var i = 0; i < chars.length; i++) {
		var find = Libs.find(tableCode, 'value', chars[i]);
		if (find) {
			str += find.id;
		}
	}
	return str;
}

/**
 * Find objects in arrays by value and field
 * @param items
 * @param field
 * @param value
 * @returns
 */
Libs.find = function (items, field, value) {
	if (!items)
		return null;
	for (var i = 0; i < items.length; i++) {
		if (value == items[i][field]) {
			return items[i];
		}
	}
	return null;
};

/**
 * trim string
 * @param str
 * @returns
 */
Libs.safeTrim = function (str) {
	try {
		return (typeof str === 'string') ? str.trim() : str;
	} catch (e) {
		return "";
	}
};
/**
 * check blank object or string
 * @param str
 * @returns {Boolean}
 */
Libs.isBlank = function (str) {
	try {
		if (typeof str === undefined || str == null || Libs.safeTrim(str) === "") {
			return true;
		}
		return false;
	} catch (e) {
		console.log(e)
		return false;
	}
};
/**
 * read all file in folder and sub folder
 */
Libs.walkSync = function (dir, filelist) {
	var fs = fs || require('fs'),
		files = fs.readdirSync(dir, 'utf8');
	filelist = filelist || [];
	files.forEach(function (file) {
		if (fs.statSync(dir + '/' + file).isDirectory()) {
			filelist = walkSync(dir + '/' + file, filelist);
		}
		else {
			filelist.push(dir + '/' + file);
		}
	});
	return filelist;
};
/**
 * str to md5
 * @param str
 * @returns
 */
// Libs.md5=function(str){
// 	var crypto = require('crypto');
// 	var md5=crypto.createHash('md5').update(str).digest("hex");
// 	return md5;
// }

/**
 * return json result
 * @param unknown $status
 * @param unknown $mess
 * @param unknown $data
 */
Libs.returnJsonResult = function (status, mess, data, total_row) {
	var result = {};
	result.status = status;
	result.mess = mess ? mess : "";
	result.data = data ? data : "";
	result.total_row = total_row ? total_row : 0;
	return result;
}
/**
 * create JWT token
 * @param array
 * @returns string token
 */
Libs.generateToken = function (arr) {
	try {
		//ini JWT token
		var jwt = require('jsonwebtoken');
		arr['iat'] = Math.floor(Date.now() / 1000);
		arr['exp'] = Math.floor(Date.now() / 1000) + secret_token.timeout * 60;
		arr['expiresIn'] = secret_token.timeout * 60;
		// sign asynchronously
		var token = wait.for(jwt.sign, arr, secret_token.secret_key, { algorithm: 'HS512' });
		return token;
	} catch (e) {
		console.log(e);
		return false;
	}
}
/**
 * decode JWT token
 * @param token string
 * @returns userLoginE if token is valid else false
 */
Libs.decodeToken = function (token) {
	try {
		//ini JWT token
		var jwt = require('jsonwebtoken');
		// verify asynchronously

		var payload = wait.for(jwt.verify, token, secret_token.secret_key, { algorithm: 'HS512' });
		return payload;
	} catch (e) {
		console.log(e);
		return false;
	}
}

/**
 * check user login or not
 @return false if not login, userLogin if is logedin
 */
Libs.isValidHeader = function (req, res) {
	try {
		//check login or not
		var header = req.headers;
		var bearToken = header.authorization;
		var beartokenArr = bearToken.split(" ");
		if (!beartokenArr || beartokenArr.length < 2) {
			res.status(401).end();
			return false;
		}
		var token = this.safeTrim(beartokenArr[1]);
		var userLoginE = this.decodeToken(token);
		if (!userLoginE || userLoginE.length <= 0) {
			//res.writeHead(401);
			//res.send('HTTP/1.0 401 Unauthorized');
			res.status(401).end();
			return false;
		}
		return userLoginE;
	} catch (e) {
		res.status(401).end();
		return false;
	}
}
/**
 * gán data vào table entity
 * @param: tableE table entity
 * @param: data: data nhan dc tu client
 * @param: insert: true su dung trong truong họp insert, false--> update
 */
Libs.assignData = function (tableE, data, user_name, is_insert) {
	try {
		if (data) {

			Object.keys(tableE).forEach(function (key) {
				if (!libs.isBlank(data[key]))
					if (typeof tableE[key] === 'number')
						tableE[key] = parseInt(data[key]);
					else if (typeof tableE[key] === 'string')
						tableE[key] = libs.safeTrim(data[key]);
					else
						tableE[key] = data[key];
			});

			if (is_insert) {
				tableE['created_user'] = user_name;
				tableE['created_date'] = Date.now();
				tableE['updated_user'] = user_name;
			} else {

				tableE['updated_user'] = user_name;
			}
			return tableE;
		}
		return tableE;
	} catch (e) {
		return tableE;
	}
}

/**
 * create route path for app
 */
Libs.getSubdomainName = function (req) {
	var subdomains = req.subdomains;
	console.log(subdomains);
	var subdomain = "";
	for (subdomain of subdomains) {
		console.log(subdomain);
		if (subdomain != "www" && subdomain != domain_name) {
			break;
		}
	}
	console.log(subdomain);
	if (Libs.isBlank(subdomain)) {
		//remove www neu co
		var domain = req.headers.host.replace("www.", ""),
			subdomains = domain.split('.');
		//logger.info(domain);
		if (subdomains.length > 1) {
			subdomain = subdomains[0].split("-").join(" ");
			if (subdomain == domain_name) {
				subdomain = "";
			}
		} else {
			subdomain = "";
		}
	}
	return subdomain;

}
/**
 * check xem có tồn tại company hay ko
 * @param company_id
 */
Libs.checkExistedCompany = function (company_id) {
	var CompanyModel = require("../models/CompanyModel");
	var companyModel = new CompanyModel();
	var check_existed = companyModel.checkCompanyIdExisted(company_id);
	return check_existed > 0;
}
/**
 * read file excel
 * @param: filePath
 * @param: resultType json,csv,form
 */
Libs.readExcel = function (filePath, resultType) {
	try {
		var xlsx = require("xlsx");
		var workbook = xlsx.readFile(filePath);
		var output = "";
		switch (resultType) {
			case "csv":
				output = to_csv(xlsx, workbook);
				break;
			case "form":
				output = to_formulae(xlsx, workbook);
				break;
			default:
				output = to_json(xlsx, workbook);//JSON.parse(JSON.stringify(me.to_json(wb), 2, 2));
		}
		console.log(output);
		return output;
	} catch (e) {
		console.log(e);
		return false;
	}
}
/**
 * convert data excel to json
 */
var to_json = function (xlsx, workbook) {
	var result = {};
	var sheetIndex = 0;
	workbook.SheetNames.forEach(function (sheetName) {
		var roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if (roa.length > 0) {
			result[sheetIndex++] = roa;
		}
	});
	return result;
}
/**
 * convert data excel to csv
 */
var to_csv = function (xlsx, workbook) {
	var result = [];
	workbook.SheetNames.forEach(function (sheetName) {
		var csv = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);
		if (csv.length > 0) {
			result.push("SHEET: " + sheetName);
			result.push("");
			result.push(csv);
		}
	});
	return result.join("\n");
}
/**
 * convert data to formular
 */
var to_formulae = function (xlsx, workbook) {
	var result = [];
	workbook.SheetNames.forEach(function (sheetName) {
		var formulae = xlsx.utils.get_formulae(workbook.Sheets[sheetName]);
		if (formulae.length > 0) {
			result.push("SHEET: " + sheetName);
			result.push("");
			result.push(formulae.join("\n"));
		}
	});
	return result.join("\n");
}
/**
 * export json data to excel file
 */
Libs.saveAsExcel = function (fileName, data) {
	try {
		var alasql = require("alasql");
		return (alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [data])) == 1;
	} catch (e) {
		console.log(e);
		return false;
	}
}
/**
 * export json data to excel file and download excel file
 */
Libs.downloadExcel = function (res, fileName, data) {
	try {
		// generate uniq file name
		var uuid = require('node-uuid');
		// Generate a v4 (random) UUID
		var cachefilepath = ROOT_PATH + "/cache/" + uuid.v4() + ".xlsx";
		if (Libs.saveAsExcel(cachefilepath, data)) {
			res.download(cachefilepath, fileName, function (err) {
				var fs = require('fs');
				// delete file
				fs.unlink(cachefilepath);
				//res.end();
			});
		}
		return false;
	} catch (e) {
		return false;
	}
}
Libs.capitalize = function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * Check is directory
 * @param {string} path_string 
 */
Libs.checkIsPath = function (path_string) {
	// stats.isFile()
	// stats.isDirectory()
	// stats.isBlockDevice()
	// stats.isCharacterDevice()
	// stats.isSymbolicLink()
	// stats.isFIFO()
	// stats.isSocket()
	var fs = require("fs");
	return fs.lstatSync(path_string).isDirectory()
}
Libs.checkFileExits = function checkFileExits(path, fileName) {
	try {
		var fs = require("fs");
		var files = fs.readdirSync(path);
		return files.indexOf(fileName) >= 0;
	} catch (error) {
		return false;
	}


}
//kiểm tra object rỗng or null
Libs.isObjectEmpty = function (obj) {
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	if (obj == null) return true;
	if (obj.length > 0) return false;
	if (obj.length === 0) return true;
	if (typeof obj !== "object") return true;
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}
	return true;
}
//đổi thứ ngày tháng sang milisecond
Libs.convertDateToMilliseconds = function (date, format) {
	//	var d = date.split("-");
	//	console.log(date);
	var f = new Date(date);
	if (null == f || "undefined" === typeof f)
		return 0;
	return f.getTime();
}
Libs.convertMillisecondsToDate = (time) => {
	var date = new Date(time);
	return date;
}
Libs.convertMillisecondsToDataFormat = (milliseconds, isShowHour = true) => {
	milliseconds = parseInt(milliseconds);
	if (milliseconds == null || milliseconds == 0) return "";
	var dateObj = new Date(milliseconds);
	var day = (dateObj.getDate() < 10) ? ("0" + dateObj.getDate()) : dateObj.getDate();
	var month = (dateObj.getMonth() + 1 < 10) ? ("0" + (dateObj.getMonth() + 1)) : (dateObj.getMonth() + 1);
	var year = dateObj.getFullYear();
	var hour = (dateObj.getHours() < 10) ? ("0" + dateObj.getHours()) : dateObj.getHours();
	var minute = (dateObj.getMinutes() < 10) ? ("0" + dateObj.getMinutes()) : dateObj.getMinutes();
	var second = (dateObj.getSeconds() < 10) ? ("0" + dateObj.getSeconds()) : dateObj.getSeconds();
	if (isShowHour)
		return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
	else
		return day + "/" + month + "/" + year
}
/**
 * Generate token string with timeout (seconds).
 * @param object baseData 
 * @param int timeout second
 * @return string
 */
Libs.generateTokenCrypto = function (baseData, timeout) {
	try {
		var CryptoLib = require('./Crypto.js');

		var base64Txt = CryptoLib.base64Encrypt(JSON.stringify(baseData));
		var encryptTxt = CryptoLib.encrypt(base64Txt, config.server.encrypt.secret_key);
		return encryptTxt;
	} catch (e) {
		logger.error(e);
	}
}
/**
 * decode to object from token string
 * @param {string} token 
 * @return object
 */
Libs.decodeTokenCrypto = function (token) {
	try {
		if (null == token || typeof token === undefined) {
			return null;
		}
		var CryptoLib = require('./Crypto.js');
		var decryptTxt = CryptoLib.decrypt(token, config.server.encrypt.secret_key);
		var json = CryptoLib.base64Decrypt(decryptTxt);
		return JSON.parse(json);
	} catch (e) {
		logger.error(e);
		return null;
	}
}

Libs.md5 = function (plainText) {
	if (typeof plainText === 'undefined') {
		return plainText;
	}
	var CryptoLib = require('./Crypto.js');
	return CryptoLib.md5(plainText);
}

Libs.AESEncrypt = function (plainText, secretKey) {
	if (typeof plainText === 'undefined' || typeof secretKey === 'undefined') {
		return plainText;
	}
	var CryptoLib = require('./Crypto.js');
	return CryptoLib.AESEncrypt(plainText, secretKey);
}


Libs.AESDecrypt = function (plainText, secretKey) {
	if (typeof plainText === 'undefined' || typeof secretKey === 'undefined') {
		return plainText;
	}
	var CryptoLib = require('./Crypto.js');
	return CryptoLib.AESDecrypt(plainText, secretKey);
}


Libs.convertEmptyPropToNullProp = function (object) {
	if (typeof object != 'object') return {};
	let obj = {};
	for (var key in object) {
		object[key] = (object[key] === '') ? null : object[key];
		if ((object[key] != '')) {
			obj[key] = object[key];
		} else if (object[key] === 0) {
			obj[key] = object[key];
		}
	}
	return obj;
}
/**
 * Remove Header Data Post:
 * headers object,
 * protocol object,
 * host objects
 * @param {data json} object 
 */
Libs.removeObjectPostJson = function (object) {
	try {
		if (typeof object != 'object') return {};
		if (object.headers != 'undefined') {
			delete object.headers;
		}
		if (object.protocol != 'undefined') {
			delete object.protocol;
		}
		if (object.host != 'undefined') {
			delete object.host;
		}
		return object;
	} catch (error) {
		console.log("removeObjectPostJson", error);
		logger.error(e);
	}

}

Libs.base64MimeType = function (encoded) {
	var result = null;
	if (typeof encoded !== 'string') {
		return result;
	}
	var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

	if (mime && mime.length) {
		result = mime[1];
	}

	return result;
}
// Libs.formatNum = function (val, options) {
// 	if (options === undefined || options == null || options === '') {
// 		options = {};
// 	}
// 	var opts = {
// 		"negativeType": 'left',
// 		"prefix": '',
// 		"suffix": '',
// 		"integerSeparator": ',',
// 		"decimalsSeparator": '',
// 		"decimal": '.',
// 		"padLeft": -1
// 	};
// 	opts = Object.assign({}, opts, options);
// 	return formatNum(opts)(val);
// }
/**
* format number với option format theo định dạng formatNum của thư viện
* mặc định là #,###.## cách nhau bởi dấu phẩy, lây sau thập phân 2 số
*
* @param {String} val
* @param {String} pattern default #,###.##
* @param {int} round default 0: Làm tròn tự nhiên, -1: làm tròn xuống, 1: làm tròn lên
* @author:  Tichnguyen 2018-11-18 11:16:34 
*/
Libs.formatNum = function (val, pattern = "#,###.##", round = 0) {
	if (Libs.isBlank(val) || isNaN(val)) {
		return "";
	}
	val = val * 1;
	let comma = ','
	let decimal = '.'
	let afterDecimalNum = 0;//sau dấu thập phân lấy mấy số
	if (Libs.isBlank(pattern)) {
		pattern = "#,###.##";
	}

	//phân tích pattern
	//chỉ chấp nhận dấu phẩy hoặc dấu .
	const regex = new RegExp("[,.]+", "ig");
	let myArray;
	let index = 0;
	let afterDecimal = "";
	while ((myArray = regex.exec(pattern)) !== null) {
		//lần đầu là comma
		if (index == 0) {
			comma = myArray[0];
		} else if (comma != myArray[0]) {
			//lần cuối cùng là dấu phân cách số thập phân
			afterDecimal = myArray[0];
		}
		index++;
	}
	//nếu có định dạng sau số thập phân thì tìm quy định mấy số sau số thập phân
	if (afterDecimal != "") {
		decimal = afterDecimal;
		afterDecimalNum = pattern.length - (pattern.lastIndexOf(decimal) + 1)
	}

	var opts = {
		"negativeType": 'left',
		"prefix": '',
		"suffix": '',
		"integerSeparator": comma,
		"decimalsSeparator": '',
		"decimal": decimal,
		"padLeft": -1,
		"round": afterDecimalNum
	};
	//tiến hành làm tròn
	if (round == 1) {
		//làm tròn tự nhiên
		val = roundTo.up(val, afterDecimalNum);
	} else if (round == 0) {
		//làm tròn tự nhiên
		val = roundTo(val, afterDecimalNum);
	} else {
		//làm tròn xuống
		val = roundTo.down(val, afterDecimalNum);
	}

	return formatNum(opts)(val);
}
/**
 * 
 * @param {*} inputDate format dd/MM/yyyy
 * @returns string yyyy-MM-dd
 */
Libs.inputDateToDBDate = function (inputDate) {
	if (inputDate === undefined || inputDate == null || inputDate === '' || typeof inputDate !== 'string') {
		return null;
	}
	var division = inputDate.split('/');
	if (division <= 1) return null;
	if (inputDate.length != 10) return null;
	let day = inputDate.substring(0, 2);
	let month = inputDate.substring(3, 5);
	let year = inputDate.substring(6, 10);
	return year + "-" + month + "-" + day;
}
Libs.date2Str = (_date, _format) => {
	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return null;
	}
	var day = _date.getDate();
	var month = _date.getMonth();
	var year = _date.getFullYear() + '';
	month += 1;
	day = day.toString().padStart(2, "0")
	month = month.toString().padStart(2, "0")
	var result = _format.toLowerCase();
	result = result.replace('dd', day);
	result = result.replace('mm', month);
	result = result.replace('yyyy', year);
	return result;
}
/**
 * 
 * @param {*} DBDate format yyyy-MM-dd
 * @returns string dd/MM/yyyy
 */
Libs.DBDateToInputDate = function (DBDate) {
	if (DBDate === undefined || DBDate == null || DBDate === '') {
		return null;
	}
	try {
		let day = '', month = '', year = '';
		if (Object.prototype.toString.call(DBDate) == "[object Date]") {
			day = DBDate.getDate().toString().padStart(2, "0");
			month = (DBDate.getMonth() + 1).toString().padStart(2, "0");
			year = DBDate.getFullYear();
		} else {
			let newDate = new Date(DBDate);
			let isValid = newDate.getDate() > 0;
			if (!isValid) {
				return null;
			}
			day = newDate.getDate().toString().padStart(2, "0");
			month = (newDate.getMonth() + 1).toString().padStart(2, "0");
			year = newDate.getFullYear();
		}
		let dateReturn = `${day}/${month}/${year}`;
		console.log("DBDateToInputDate return: ", dateReturn);
		return dateReturn;
	} catch (e) {
		console.log(e)
	}

	// var arr = "";
	// if (Object.prototype.toString.call(DBDate) == "[object Date]") {
	// 	var date = new Date(DBDate);
	// 	var stringDate = date.toLocaleDateString("vi-VN");
	// 	arr = stringDate.split('/');
	// 	if (arr.length <= 1) {
	// 		arr = stringDate.split('-');
	// 	}
	// } else if (typeof DBDate === 'string') {
	// 	arr = DBDate.split('-');
	// } else {
	// 	return null;
	// }
	// if (arr.length <= 1) return null;
	// let year = arr[0];
	// let month = arr[1];
	// let day = arr[2];
	// return day.toString().padStart(2, "0") + "/" + month.toString().padStart(2, "0") + "/" + year.toString().padStart(4, "0");
}
Libs.CheckDiffJson = function (item) {
	if (item.path[0] !== 'updated_date'
		&& item.path[0] !== 'updated_by'
		&& item.path[0] !== 'created_date'
		&& item.path[0] !== 'created_by'
		&& item.path[0] !== 'mode'
		&& item.path[0] !== 'is_supper'
		&& item.path[0] !== 'is_paging'
		&& item.path[0] !== 'lang_default'
		&& item.path[0] !== 'current_row'
		&& item.path[0] !== 'max_record'
		&& item.path[0] !== 'currentUser')
		return true;
	return false;
}
/**
 * Lấy các phần tử thay đổi của 2 object json
 * @param {json object} newItem 
 * @param {json object} oldItem 
 */
Libs.DeepDiffJson = function (newItem, oldItem) {
	try {
		if (!newItem) return;
		if (!oldItem) oldItem = {};
		let diffData = diff(oldItem, newItem);
		let ObjDiff = [];
		if (!diffData) return;
		for (let i = 0; i < diffData.length; i++) {
			let item = diffData[i];
			let itemE = {};
			if (item.kind == 'E' && Libs.CheckDiffJson(item)) {
				itemE.path = item.path[0];
				itemE.before = item.lhs;
				itemE.after = item.rhs;
				ObjDiff.push(itemE);
			}
			if (item.kind == 'N' && Libs.CheckDiffJson(item)) {
				itemE.path = item.path[0];
				itemE.before = '';
				itemE.after = item.rhs;
				ObjDiff.push(itemE);
			}
			if (item.kind == 'D' && Libs.CheckDiffJson(item)) {
				itemE.path = item.path[0];
				itemE.before = '';
				itemE.after = item.rhs;
				ObjDiff.push(itemE);
			}
		}
		let data_return = "";
		if (ObjDiff.length > 0)
			data_return = JSON.stringify(ObjDiff); // gia tri luu xuong db
		return data_return;
	} catch (error) {
		console.log(error);
	}
}

Libs.isInteger = function (value) {
	try {
		var val = value;
		if (typeof val === 'undefined' || val == null) return false;
		if (typeof val === 'number') {
			val = val.toString();
		}
		val = val.replace(/^-/, '');
		return /^(0|[1-9]\d*)$/.test(val);
	} catch (err) {
		return false;
	}
}

/**
 * Lấy số ngày trong tháng
 * @author Minh.Pham 2018-11-28
 */
Libs.getDaysOfMonth = (year, month) => {
	var d = new Date(year, month, 0);
	return d.getDate();
}

/**
 * get Current Year format yy
 */
Libs.getCurrentYY = function () {
	let year = new Date().getFullYear().toString().substr(-2);
	return year;
}
Libs.getCurrentYYMMDD = function () {
	let date = new Date();
	let year = date.getFullYear().toString().substr(-2);
	let month = (date.getMonth() + 1).toString().padStart(2, "0");
	let day = date.getDate().toString().padStart(2, "0");
	return year + month + day;
}
Libs.getCurrentDDMMYYYY = function () {
	let date = new Date();
	let year = date.getFullYear().toString();
	let month = (date.getMonth() + 1).toString().padStart(2, "0");
	let day = date.getDate().toString().padStart(2, "0");
	return day + "/" + month + "/" + year;
}

Libs.buildPathValidateMessage = function (path, message) {
	if (typeof path !== 'string' || typeof message !== 'string')
		return null;
	if (path.length <= 0) return null;
	var validate = {};
	validate[path] = message;
	return validate;
}

/**
 * Validate ngày sinh theo từng ô input
 * @author thanh.bay 2018-09-25
 * @param  {string} day=""
 * @param  {string} month=""
 * @param  {string} year=""
 */
Libs.validateBirthDay = function (day = "", month = "", year = "") {
	day = (typeof day !== 'string') ? "" : day;
	month = (typeof month !== 'string') ? "" : month;
	year = (typeof year !== 'string') ? "" : year;

	if (day.length > 0 && (month.length <= 0 || year.length <= 0)) return false;
	if (month.length > 0 && year.length <= 0) return false;
	if (year.length <= 0) return false;

	// Chỉ kiểm tra năm
	let checkYear = (mYear) => {
		let currentYear = (new Date()).getFullYear();
		if (mYear.length !== 4 || mYear * 1 < 1900 || currentYear * 1 < mYear * 1) return false;
		if ((currentYear - mYear) > 100) return false;
		return true;
	}

	// kiểm tra tháng và năm
	let checkMonthYear = (mMonth, mYear) => {
		if (mMonth.length !== 2 || mMonth * 1 > 12 || mMonth * 1 <= 0) return false;
		let currentDate = new Date();
		// Kiểm tra tháng không được lớn hơn tháng hiện tại nếu năm sinh là năm hiện tại
		if (currentDate.getFullYear() == mYear && (currentDate.getMonth() * 1 + 1) < mMonth) return false;
		return checkYear(mYear);

	}

	// kiểm tra ngày hợp lệ
	let checkFullDate = (mDay, mMonth, mYear) => {
		let strDate = mDay + "/" + mMonth + "/" + mYear;
		let validate = Libs.validateDate(strDate);
		if (!validate) return false;
		// Kiểm tra có lớn hơn ngày hiện tại
		let mDate = new Date(mYear, (mMonth * 1 - 1), mDay);
		let currentDate = new Date(),
			d = currentDate.setHours(0, 0, 0, 0);
		if (mDate.valueOf() > d) return false;
		return true;
	}

	let check = (day, month, year) => {
		let type = 0; // yyyy
		if (day.length > 0) {
			type = 1; // dd/mm/yyyy
		} else if (day.length <= 0 && month.length > 0) {
			type = 2; // mm/yyyy
		}

		if (type === 0) {
			return checkYear(year);
		}
		if (type === 1) {
			let vYear = checkYear(year);
			if (!vYear) return false;
			return checkFullDate(day, month, year);
		}
		if (type === 2) {
			return checkMonthYear(month, year);
		}
	}
	return check(day, month, year);
}

/**
 * validate ngày hợp lệ
 * @author thanh.bay 2018-09-25 11:30
 * @param  {string} date
 * @param  {Boolean} format, format === true thì check theo yMd ngược lại dMy
 */
Libs.validateDate = function (date, format) {
	// Kiểm tra theo format dd/MM/yyyy hoặc dd-MM-yyyy
	var REG_DATE_DMY = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
	// Kiểm tra theo format dd/MM/yyyy hoặc yyyy-MM-dd
	var REG_DATE_YMD = /^(\d{4})[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;

	var dateformat = REG_DATE_DMY;
	if (typeof format !== 'undefined' && format == true) {
		var dateformat = REG_DATE_YMD;
	}

	// Match the date format through regular expression
	if (date.match(dateformat)) {
		//Test which seperator is used '/' or '-'
		var opera1 = date.split('/');
		var opera2 = date.split('-');
		var lopera1 = opera1.length;
		var lopera2 = opera2.length;
		// Extract the string into month, date and year
		if (lopera1 > 1) {
			var pdate = date.split('/');
		}
		else if (lopera2 > 1) {
			var pdate = date.split('-');
		}
		var dd = parseInt(pdate[0]);
		var mm = parseInt(pdate[1]);
		var yy = parseInt(pdate[2]);
		// Create list of days of a month [assume there is no leap year by default]
		var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if (mm == 1 || mm > 2) {
			if (dd > ListofDays[mm - 1]) {
				return false;
			}
			return true;
		}
		if (mm == 2) {
			var lyear = false;
			if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
				lyear = true;
			}
			if ((lyear == false) && (dd >= 29)) {
				return false;
			}
			if ((lyear == true) && (dd > 29)) {
				return false;
			}
			return true;
		}
	}
	else {
		return false;
	}
}

Libs.isNumber = function (value) {
	try {
		var val = value;
		if (typeof val === 'undefined' || val == null) return false;
		if (typeof val === 'number') {
			val = val.toString();
		}
		val = val.replace(/^-/, '');
		return /^[0-9\b]+$/.test(val);
	} catch (err) {
		console.log(err);
		return false;
	}
}

Libs.getCurrentMilliseconds = function () {
	var d = new Date();
	return d.getTime();
}
/**
 * Lay ngay hien tai theo format String
 */
Libs.getCurrentDateFormat = function (formatString) {
	let now = new Date();
	formatString = formatString.toUpperCase();
	let str = date.format(now, formatString);
	return str;
}

Libs.groupByProps = function (objectArray, property) {
	return objectArray.reduce(function (acc, obj) {
		var key = obj[property];
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(obj);
		return acc;
	}, {});
}

/**
 * Lấy tất cả value theo property trong array object (bỏ qua những value nào là null, empty hoặc undefined)
 * @author thanh.bay 2018-11-29
 * @param  {Array} objectArray
 * @param  {String} property
 */
Libs.getValuesArrayByProp = function (objectArray, property) {
	if (!Array.isArray(objectArray)) return [];
	var values = [];
	for (let key in objectArray) {
		let item = objectArray[key],
			value = item[property];

		if ((item && value) || value == '0') {
			values.push(value);
		}
	}
	return values;
}

/**
 * string format
 * vd: let a = Libs.stringAssign("hello $<0> $<1>", ["world","rrr"])
 * @param {string template} str 
 * @param {Array} data 
 * @param {regex} REG_ASSIGN_VARIBLE 
 */
Libs.stringAssign = function (str, data, REG_ASSIGN_VARIBLE) {
	if (Libs.isBlank(REG_ASSIGN_VARIBLE)) {
		REG_ASSIGN_VARIBLE = /\$\<([^{}]*?)\>/g;
	}
	return str.replace(REG_ASSIGN_VARIBLE, function ($0, $1) {
		return String(data[$1]);
	});
};
/**
 * Tính tuổi của 
 * @param dateString : dd/mm/yyyy
 */
Libs.calculateAgeString = function (dateString) {
	var age = {};
	if (typeof dateString !== 'string' || dateString.length <= 0) return "";

	var arrayBirthday = dateString.split("/"),
		day = "",
		month = "",
		year = "",
		yearString = "",
		monthString = "",
		dayString = "",
		ageString = "";

	if (arrayBirthday.length == 3) {
		day = arrayBirthday[0];
		month = arrayBirthday[1];
		year = arrayBirthday[2];
	} else if (arrayBirthday.length == 2) {
		month = arrayBirthday[0];
		year = arrayBirthday[1];
	} else if (arrayBirthday.length == 1) {
		year = arrayBirthday[0];
	} else {
		return "";
	}
	if (this.isBlank(day)) {
		day = "01";
	}
	if (this.isBlank(month)) {
		month = "01";
	}
	if (this.isBlank(year)) {
		day = "1900";
	}
	dateString = [day, month, year].join("/");
	age = Libs.calculateAge(dateString);
	if (age.years > 1) yearString = " tuổi";
	else yearString = " tuổi";
	if (age.months > 1) monthString = " tháng";
	else monthString = " tháng";
	if (age.days > 1) dayString = " ngày";
	else dayString = " ngày";
	if ((age.years > 0) && (age.months > 0) && (age.days > 0))
		ageString = age.years + yearString + ", " + age.months + monthString + " " + age.days + dayString;
	// ageString = age.months + monthString + " và " + age.days + dayString;
	else if ((age.years == 0) && (age.months == 0) && (age.days > 0))
		ageString = age.days + dayString;
	else if ((age.years == 0) && (age.months == 0) && (age.days == 0))
		ageString = "1" + dayString;
	else if ((age.years > 0) && (age.months == 0) && (age.days == 0))
		ageString = age.years + yearString;
	// ageString = "";
	else if ((age.years > 0) && (age.months > 0) && (age.days == 0))
		ageString = age.years + yearString + " " + age.months + monthString;
	// ageString = age.months + monthString;
	else if ((age.years == 0) && (age.months > 0) && (age.days > 0))
		ageString = age.months + monthString + " " + age.days + dayString;
	else if ((age.years > 0) && (age.months == 0) && (age.days > 0))
		ageString = age.years + yearString + " " + age.days + dayString;
	// ageString = age.days + dayString;
	else if ((age.years == 0) && (age.months > 0) && (age.days == 0))
		ageString = age.days + dayString;
	else ageString = "";
	return ageString;
}
/**
 * Tính tuổi của 
 * @param dateString : dd/mm/yyyy
 */
Libs.calculateAge = function (dateString) {
	var now = new Date();
	var today = new Date(now.getYear(), now.getMonth(), now.getDate());
	var yearNow = now.getYear();
	var monthNow = now.getMonth();
	var dateNow = now.getDate();
	var strSplit = dateString.split('/');
	var dob = new Date(strSplit[2], strSplit[1] - 1, strSplit[0]);
	var yearDob = dob.getYear();
	var monthDob = dob.getMonth();
	var dateDob = dob.getDate();
	var age = {};
	var yearAge = yearNow - yearDob;
	if (monthNow >= monthDob)
		var monthAge = monthNow - monthDob;
	else {
		yearAge--;
		var monthAge = 12 + monthNow - monthDob;
	}

	if (dateNow >= dateDob)
		var dateAge = dateNow - dateDob;
	else {
		monthAge--;
		var dateAge = 31 + dateNow - dateDob;
		if (monthAge < 0) {
			monthAge = 11;
			yearAge--;
		}
	}
	age = {
		years: yearAge,
		months: monthAge,
		days: dateAge
	};
	return age;
}
/**
 * Build thông tin bệnh nhân, tính tuổi + địa chỉ
 * @param {patientEnity} patientEnity 
 */
Libs.buildPatientInfo = function (patientEnity) {
	// format data before display 
	patientEnity.sex_id = patientEnity.sex;
	if (!Libs.isBlank(patientEnity.sex)) {
		patientEnity.sex_num = patientEnity.sex;
		if (patientEnity.sex == Constants.gender.male) {
			patientEnity.sex = i18n.__("gender.male");
		} else if (patientEnity.sex == Constants.gender.female) {
			patientEnity.sex = i18n.__("gender.female");
		} else if (patientEnity.sex == Constants.gender.unknown) {
			patientEnity.sex = i18n.__("gender.unknown");
		} else {
			patientEnity.sex = "";
		}
	} else {
		patientEnity.sex = "";
		patientEnity.sex_num = -1;
	}
	patientEnity.sex_name = patientEnity.sex;

	if (!Libs.isBlank(patientEnity.birthday_day)) {
		var birthday_day = patientEnity.birthday_day;
		patientEnity.birthday_day = birthday_day.toString().padStart(2, "0");
	}
	if (!Libs.isBlank(patientEnity.birthday_month)) {
		var birthday_month = patientEnity.birthday_month;
		patientEnity.birthday_month = birthday_month.toString().padStart(2, "0");
	}
	if (!Libs.isBlank(patientEnity.birthday_year)) {
		var birthday_year = patientEnity.birthday_year;
		patientEnity.birthday_year = birthday_year.toString().padStart(4, "0");
	}

	var arrayBirthday = [patientEnity.birthday_day, patientEnity.birthday_month, patientEnity.birthday_year],
		filterArrayBirthday = arrayBirthday.filter(item => { return !Libs.isBlank(item) });
	if ((filterArrayBirthday.length > 0) || Libs.isBlank(patientEnity.birthday)) {
		patientEnity.birthday = filterArrayBirthday.join("/");
	}


	if (!Libs.isBlank(patientEnity.real_birthday_day)) {
		var real_birthday_day = patientEnity.real_birthday_day;
		patientEnity.real_birthday_day = real_birthday_day.toString().padStart(2, "0");
	}
	if (!Libs.isBlank(patientEnity.real_birthday_month)) {
		var real_birthday_month = patientEnity.real_birthday_month;
		patientEnity.real_birthday_month = real_birthday_month.toString().padStart(2, "0");
	}
	if (!Libs.isBlank(patientEnity.real_birthday_year)) {
		var real_birthday_year = patientEnity.real_birthday_year;
		patientEnity.real_birthday_year = real_birthday_year.toString().padStart(4, "0");
	}

	var arrayRealBirthday = [patientEnity.real_birthday_day, patientEnity.real_birthday_month, patientEnity.real_birthday_year],
		filterArrayRealBirthday = arrayRealBirthday.filter(item => { return !Libs.isBlank(item) });
	if ((filterArrayRealBirthday.length > 0) || Libs.isBlank(patientEnity.real_birthday)) {
		patientEnity.real_birthday = filterArrayRealBirthday.join("/");
		patientEnity.full_real_birthday = filterArrayRealBirthday.join("/");
	} else {
		patientEnity.full_real_birthday = patientEnity.real_birthday;
	}



	//tinh tuổi bệnh nhân
	patientEnity.age = Libs.calculateAgeString(patientEnity.birthday);
	//Tính tuổi thật bệnh nhân
	patientEnity.real_age = Libs.calculateAgeString(patientEnity.real_birthday);
	var phone = [];
	if (!Libs.isBlank(patientEnity.phone)) {
		if (typeof patientEnity.phone === 'string') {
			phone = patientEnity.phone.split(",");
		}
	}
	patientEnity.phone = phone;
	patientEnity = Libs.buildAddressPatient(patientEnity);
	return patientEnity;
};
/**
 * Build dia chi của bệnh nhân
 */
Libs.buildAddressPatient = function (patientEnity) {
	//Build địa chỉ thường trú
	var address = (!Libs.isBlank(patientEnity.address)) ? patientEnity.address : "";
	address = (!Libs.isBlank(patientEnity.ward_name)) ? address + (!Libs.isBlank(address) ? ", " : "") + patientEnity.ward_name : address;
	address = (!Libs.isBlank(patientEnity.district_name)) ? address + (!Libs.isBlank(address) ? ", " : "") + patientEnity.district_name : address;
	address = (!Libs.isBlank(patientEnity.city_name)) ? address + (!Libs.isBlank(address) ? ", " : "") + patientEnity.city_name : address;
	address = (!Libs.isBlank(patientEnity.country_name)) ? address + (!Libs.isBlank(address) ? ", " : "") + patientEnity.country_name : address;

	patientEnity.address = address;
	//Build dia chi tạm trú
	var address1 = (!Libs.isBlank(patientEnity.address1)) ? patientEnity.address1 : "";
	address1 = (!Libs.isBlank(patientEnity.ward_name1)) ? address1 + (!Libs.isBlank(address1) ? ", " : "") + patientEnity.ward_name1 : address1;
	address1 = (!Libs.isBlank(patientEnity.district_name1)) ? address1 + (!Libs.isBlank(address1) ? ", " : "") + patientEnity.district_name1 : address1;
	address1 = (!Libs.isBlank(patientEnity.city_name1)) ? address1 + (!Libs.isBlank(address1) ? ", " : "") + patientEnity.city_name1 : address1;
	address1 = (!Libs.isBlank(patientEnity.country_name1)) ? address1 + (!Libs.isBlank(address1) ? ", " : "") + patientEnity.country_name1 : address1;
	patientEnity.address1 = address1;
	return patientEnity;
}
/**
 *Convert money number to VietNam String: đọc số tiền
 *@author Minh.Pham 2018-10-23
*/
Libs.moneytoString = function (total, lang = 'vi') {
	if (total == 0)
		return "Không đồng";
	total = parseInt(total);
	let sMoney = "";
	if (lang == 'vi') {
		sMoney = NumberToWordsVN.default.read(total);
		sMoney = sMoney + " đồng";
	} else {
		sMoney = NumberToWords.toWords(total);
	}

	if (sMoney.length > 0) {
		let sBeginChar = sMoney.substring(0, 1);
		sBeginChar = sBeginChar.toUpperCase();
		sMoney = sBeginChar + sMoney.substring(1);
	}

	sMoney = sMoney.replace("  ", " ");
	return sMoney;
}

/**
 * Them zero befor number
 */
Libs.padLeft = function (str, number, digit) {
	return Array(number - String(str).length + 1).join(digit || '0') + str;
}
/**
 * Convert datetime(sqlDate, javascript date) to VN string
 * @author Minh.Pham 2018-10-23
 */
Libs.convertDateTimeToVNWord = function (date) {
	date = moment(date);
	let strDate = Libs.padLeft(date.hours(), 2) + " giờ ";
	strDate += Libs.padLeft(date.minutes(), 2) + " phút";
	strDate += ',  ngày ';
	strDate += Libs.padLeft(date.date(), 2) + " tháng ";
	strDate += Libs.padLeft((date.month() + 1), 2) + " năm ";
	strDate += Libs.padLeft(date.year(), 4);
	return strDate;
}
/**
 * Convert date(sqlDate, javascript date) to VN string
 * @author Minh.Pham 2018-10-23
 */
Libs.convertDateToVNWord = function (date) {
	if (!moment(date).isValid()) {
		return "";
	}
	date = moment(date);
	let strDate = 'Ngày ';
	strDate += Libs.padLeft(date.date(), 2) + " tháng ";
	strDate += Libs.padLeft((date.month() + 1), 2) + " năm ";
	strDate += Libs.padLeft(date.year(), 4);
	return strDate;
}
/**
 * Convert date(sqlDate, javascript date) to VN string(fromar YYYY-MM-DD)
 * @author Minh.Pham 2018-10-23
 */
Libs.convertDateToVNWordYYYYMMDD = function (date) {
	let arr = date.split('-');
	let strDate = 'Ngày ';
	strDate += Libs.padLeft(arr[2], 2) + " tháng ";
	strDate += Libs.padLeft(arr[1], 2) + " năm ";
	strDate += Libs.padLeft(arr[0], 4);
	return strDate;
}
Libs.convertAllFormatDateToStr = (_date, _format) => {
	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return '';
	}
	if (_date.includes('/')) {
		return _date;
	}
	let date = moment(_date);
	if (!date._isValid) {
		return _date;
	}
	return date.format(_format.toUpperCase());
}
/**
 * Convert date(sqlDate, javascript date) to VN string
 * @author Minh.Pham 2018-10-23
 */
Libs.convertDateDB = function (date, format) {
	return moment(date).format(format);
	// let strDate = 'ngày ';
	// strDate += Libs.padLeft(date.date(), 2) + " tháng ";
	// strDate += Libs.padLeft((date.month() + 1), 2) + " năm ";
	// strDate += Libs.padLeft(date.year(), 4);
	// return strDate;
}

/**
 * @description convert date to string
 * @param {array} data 
 * @author: Minh.Pham
 */
Libs.convertSQLDateToStr = (_date, _format) => {
	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return null;
	}
	var date = new Date(_date);
	var result = Libs.convertDateToStr(date, _format);
	return result;
}

Libs.convertDateToStr = (_date, _format) => {
	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return null;
	}
	var day = _date.getDate();
	var month = _date.getMonth();
	var year = _date.getFullYear() + '';
	month += 1;
	if (day < 10) {
		day = '0' + day;
	}
	if (month < 10) {
		month = '0' + month;
	}
	var result = _format.toLowerCase();
	result = result.replace('dd', day);
	result = result.replace('mm', month);
	result = result.replace('yyyy', year);
	return result;
}

/*
 * đóng gói promise để dùng await 
 * vd: let users = await Libs.callWithPromise((resolve, reject)=>{
 * UserService.instance.getDropDownList({}, (arrData) => {
 * 		if(arrData){ resolve(arrData)}
 * 		else{ reject(false)}
 *    }, false);
 * });
 * @param {func} func 
 */
Libs.callWithPromise = function (func) {
	try {
		return new Promise(function (resolve, reject) {
			func(resolve, reject)
		})
	} catch (ex) {
		console.log(ex)
		throw ex
	}
}
/**
 * Kiểm tra tên file có tồn tại trong thư mục hay không, nếu có sẽ tăng lên (n+) ngược lại sẽ lấy tên file cũ
 * Sử dụng: Libs.getFileName(fileDir, fileName, 0);
 * @param string fileDir: Đường dẫn đến thư mục
 * @param string fileName: Tên file
 * @param int number: số tăng lên nếu tên file giống nhau, ban đầu gọi set = 0
 * @param string newFileName: Tên file mới, khi gọi không cần set biến này, sử dụng để lấy tên file ban đầu dùng để kiểm tra tên file tồn tại
 * @author LuyenNguyen 2018-10-28
 * @return string file name
 */
Libs.getFileName = function (fileDir, fileName, number, newFileName) {
	try {
		if (!fileDir || !fileName) return;
		var lastFileDirCharacter = fileDir.slice(-1);
		var curFilePath = fileDir + "/" + fileName;
		if (lastFileDirCharacter === '/') {
			curFilePath = fileDir + fileName;
		}
		if (fs.existsSync(curFilePath)) {
			number = number + 1;
			var fileNameSpit = fileName.split('.').slice(0, -1).join('.');
			var ext = fileName.substr((fileName.lastIndexOf('.') + 1));
			var checkFileName = fileNameSpit + "(" + number + ")" + "." + ext;
			if (!newFileName) {
				newFileName = fileNameSpit;
			}
			else {
				checkFileName = newFileName + "(" + number + ")" + "." + ext;
			}
			return Libs.getFileName(fileDir, checkFileName, number, newFileName);
		}
		else {
			return fileName;
		}
	}
	catch (error) {
		console.log('Không lấy được tên file: ', error);
		return null;
	}
}
/**
 * Tạo folder fullpath
 * @author: khanh.le
 */
Libs.mkdirFolder = async function (path) {
	let paths = path.split('/');
	let fullPath = '';
	try {
		for (let index = 0; index < paths.length; index++) {
			const folder = paths[index];
			if (Libs.isBlank(folder)) {
				fullPath = "/";
				continue;
			}
			if (fullPath === '') {
				fullPath = folder;
			} else {
				if (fullPath === '/') {
					fullPath = fullPath + folder;
				} else {
					fullPath = fullPath + '/' + folder;
				}

			}
			let exist = true;
			try {
				exist = fs.existsSync(fullPath)
			} catch (e) {
				exist = false;
			}
			if (!exist) {
				fs.mkdirSync(fullPath);
			}
		}
	} catch (error) {
		this.logger.error(error);
	}

}
/**
 * Upload file
 * @param string filePath: Đường dẫn đến thư mục upload
 * @param string fileName: Tên file
 * @param string|buffer data(data[, options]): Dữ liệu dạng String hoặc Buffer để ghi vào File,
 * trong đó options: Tham số này là một đối tượng giữ {encoding, mode, flag}.
 * Theo mặc định, mã hóa là utf8, mode là giá trị 0666 và flag là 'w'
 * @param function callback: nhận một tham số là err và được sử dụng để trả về một lỗi nếu xảy ra bất kỳ lỗi nào trong hoạt động ghi file
 * @author LuyenNguyen 2018-10-28
 */


Libs.uploadFile = async function (filePath, fileName, data, callback) {
	try {
		if (!filePath || !fileName) return;
		var lastFilePathCharacter = filePath.slice(-1);
		if (lastFilePathCharacter === '/') {
			filePath = filePath.substring(0, filePath.length - 1);
		}
		//Tạo thư mục upload nếu chưa tồn tại
		let exist = true;
		try {
			exist = fs.statSync(filePath).isDirectory()
		} catch (e) {
			exist = false;
		}
		if (!exist) {
			await Libs.mkdirFolder(filePath);
		}
		var fileUpload = filePath + "/" + fileName;
		if (callback && typeof callback === 'function') {
			fs.writeFile(fileUpload, data, function (err) {
				if (err) {
					callback(err);
				}
				else {
					callback(true);
				}
			});
		}
		else {
			return new Promise(function (resolve, reject) {
				fs.writeFile(fileUpload, data, function (err) {
					if (err) {
						reject(err);
					}
					else {
						resolve(true);
					}
				});
			});
		}
	}
	catch (error) {
		if (callback && typeof callback === 'function') {
			callback(error);
		}
		else {
			return false;
		}
	}
}
/**
 * remove file
 * @param string filePath: Đường dẫn đến thư mục upload
 * @param string fileName: Tên file
 * @author LuyenNguyen 2018-10-28
 * @return boolean
 */
Libs.removeFile = function (filePath, fileName) {
	try {
		if (!filePath || !fileName) return;
		var lasFilePathCharacter = filePath.slice(-1);
		var curFilePath = filePath + "/" + fileName;
		if (lasFilePathCharacter === '/') {
			curFilePath = filePath + fileName;
		}
		if (fs.existsSync(curFilePath)) {
			fs.unlinkSync(curFilePath);
			return true;
		}
		else {
			return false;
		}
	}
	catch (error) {
		return false;
	}
}
Libs.checkBitOnOff = (nByte, bitIndex) => {
	let result = nByte & parseInt(Math.pow(2, bitIndex));
	return result != 0 ? true : false;
}
/**
 * @description Kiểm tra mãng array có tồn tại và có dữ liệu hay không
 * @param Array arr
 * @author: Luyen Nguyen
 * @return boolean
 */
Libs.isArrayData = function (arr) {
	if (Libs.isBlank(arr)) return false;
	if (!Array.isArray(arr)) return false;
	return true;
}
/**
 * Convert Data to DB
 */
Libs.convertAllFormatDate = (_date, from_format = "DD/MM/YYYY HH:mm", to_format = "YYYY-MM-DD HH:mm") => {
	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return '';
	}
	let date = moment(_date, from_format);
	if (!date._isValid) {
		return _date;
	}
	return date.format(to_format);
}

/**
 * Chuyển string date thành dạng YYYYMMDD
 * @author Minh.Pham 2018-10-20
 */
Libs.convertStr2DateV02 = (date, format, _delimiter) => {
	if (null == date || typeof date === 'undefined' || date == '') {
		return null;
	}
	var formatLowerCase = format.toLowerCase();
	var formatItems = formatLowerCase.split(_delimiter);
	var dateItems = date.split(_delimiter);
	var monthIndex = formatItems.indexOf("mm");
	var dayIndex = formatItems.indexOf("dd");
	var yearIndex = formatItems.indexOf("yyyy");
	var month = parseInt(dateItems[monthIndex]);
	return dateItems[yearIndex] + (month) + dateItems[dayIndex];
}
/**
 * Add Days
 */
Libs.addDays = function (date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

/**
 * Lấy array từ ngày bắt đầu đến ngày kết thúc
 * @author thanh.bay 2019-06-06
 * @param  {string} startDate (format yyyy-MM-dd)
 * @param  {string} stopDate (format yyyy-MM-dd)
 * @param  {string} format
 */
Libs.getDates = function (startDate, stopDate, format = "YYYY-MM-DD") {
	try {
		var dateArray = [],
			currentDate = new Date(startDate),
			toDate = new Date(stopDate);

		while (currentDate <= toDate) {
			let date = Libs.convertDateToStr(currentDate, format);
			dateArray.push(date);
			currentDate = Libs.addDays(currentDate, 1);
		}
		return dateArray;
	} catch (error) {
		console.log("Libs.getDates:", error);
		return [];
	}

}

/**
 * Lấy array từ tháng đến tháng
 * @author thanh.bay 2019-06-13
 * @param  {string} startDate (format yyyy-MM-dd)
 * @param  {string} stopDate (format yyyy-MM-dd)
 * @param  {string} format="YYYY-MM"
 */
Libs.getMonths = function (startDate, stopDate, format = "YYYY-MM") {
	try {
		if (typeof format !== 'string' || (typeof format === 'string' && format.length <= 0)) {
			return [];
		}
		format = format.toLowerCase();
		var monthArray = [],
			endDate = new Date(stopDate),
			currentDate = (new Date(startDate + " 00:00:00")),
			toDate = (new Date(((endDate.getFullYear()) + "-" + (endDate.getMonth() + 1) + "-" + Libs.getDaysOfMonth(endDate.getFullYear(), (endDate.getMonth() + 1))) + " 00:00:00"));

		while (currentDate <= toDate) {
			let currentMonth = ((currentDate.getMonth() + 1) + "").padStart(2, '0'),
				currentYear = currentDate.getFullYear() + "",
				value = format.replace("mm", currentMonth).replace("yyyy", currentYear);
			monthArray.push(value);
			currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
		}
		return monthArray;
	} catch (error) {
		console.log("Libs.getMonths:", error);
		return [];
	}
}
/**
 * Lấy danh sách năm
 * @author thanh.bay 2019-06-13
 * @param  {string} startDate (format yyyy-MM-dd)
 * @param  {string} stopDate (format yyyy-MM-dd)
 */
Libs.getYears = function (startDate, stopDate) {
	try {
		var yearArray = [],
			currentYear = (new Date(startDate)).getFullYear(),
			toYear = (new Date(stopDate)).getFullYear();

		while (currentYear <= toYear) {
			yearArray.push(currentYear + "");
			currentYear += 1;
		}
		return yearArray;
	} catch (error) {
		console.log("Libs.getYears:", error);
		return [];
	}

}

/**
  * format date to another format
  * mặc định không truyền vô from format thì hệ thống tự nhận biết
  * nếu muốn chính xác thì truyền vào from format
  * @param {String} _date 
  * @param {String} format 
  * @param {String} from_format 
  */
Libs.dateFormat = (_date, format = "DD/MM/YYYY HH:mm:ss", from_format) => {
	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return '';
	}
	let date = _date;
	if (typeof from_format == "undefined" || Libs.isBlank(from_format)) {
		let arrFormat = ["YYYY/MM/DD HH:mm:ss", "YYYY-MM-DD HH:mm:ss", "DD/MM/YYYY HH:mm:ss", "DD-MM-YYYY HH:mm:ss", "MM/DD/YYYY HH:mm:ss", "MM-DD-YYYY HH:mm:ss"]
		for (let i = 0; i < arrFormat.length; i++) {
			date = moment(_date, arrFormat[i]);
			if (date._isValid) {
				return date.format(format);
			}
		}
	} else {
		if (from_format.toLowerCase() == 'utc') {
			date = moment(_date);
		} else date = moment(_date, from_format);
		if (!date._isValid) {
			return _date;
		}
		return date.format(format);
	}
	return _date;
}

/**
 * Làm tròn số sau dấu phẩy
 * @author thanh.bay 2018-09-27 11:24
 * @param  {string | float | int} value: giá trị muốn làm tròn
 * @param  {int} fixed=1 : làm tròn đến n số dựa vào giá trị fixed
 */
Libs.fixNumber = function (value, fixed = 1) {
	if (typeof value === 'undefined' || value == null) return null;
	return parseFloat(Number.parseFloat(value).toFixed(fixed));
}
Libs.sum = function (...numbers) {
	try {
		var total = 0;
		for (var x = 0; x < numbers.length; x++) {
			total += numbers[x] * 1;
		}
		return total;
	} catch (ex) {
		return NaN
	}
}
/**
* @description Làm tròn số
* @author Minh.Pham 2018-12-04
* @param number giá trị cần làm tròn
* @param decimal số thập phân
* @type cách làm tròn: -1 làm tròn xuống, 0 làm tòn tự nhiên, 1: làm tròn lên
 */
Libs.roundNumber = function (number, decimals = 0, type = 0) {
	if (decimals == null)
		decimals = 0;
	switch (type) {
		case -1:
			return roundTo.down(number, decimals);
		case 1:
			return roundTo.up(number, decimals);
		default:
			return roundTo(number, decimals);
	}
};
/**
* @description Làm tròn số theo format
* @author Minh.Pham 2018-12-04
* @param number giá trị cần làm tròn
* @param format #,###.## 
* @type cách làm tròn: -1 làm tròn xuống, 0 làm tòn tự nhiên, 1: làm tròn lên
 */
Libs.roundByFormat = function (number, format, type = 0) {
	return Libs.roundNumber(number, Libs.getDecimalsOfFomat(format), type);
};

/**
* @description Lấy số decimals(phần thập phân) của format
* @author Minh.Pham 2018-12-04
* @param format #,###.## 
 */
Libs.getDecimalsOfFomat = function (format) {
	let decimals = 0;
	if (!Libs.isBlank(format)) {
		try {
			let arr = format.split('.');
			if (arr.length >= 2) {
				decimals = arr[arr.length - 1].length;
			}
		} catch (ex) {

		}
	}
	return decimals;
};
/**
 * Group array object bằng nhiều property, trả và mảng 2 chiều
 * @author thanh.bay 2019-01-08
 * @param  {Array} array
 * @param  {Array} properties
 */
Libs.groupBy = function (array, properties) {
	try {
		if (!Array.isArray(array)) {
			return [];
		}
		if (!Array.isArray(properties)) {
			return array;
		}
		var f = function (item, properties) {
			let merge = [];
			for (let key in properties) {
				let prop = properties[key];
				if (typeof prop === 'string' && item[prop]) {
					merge.push(item[prop]);
				}
			}
			return merge;
		},
			groups = {};

		array.forEach(function (o) {
			var group = JSON.stringify(f(o, properties));
			groups[group] = groups[group] || [];
			groups[group].push(o);
		});
		return Object.keys(groups).map(function (group) {
			return groups[group];
		})
	} catch (error) {
		console.log("Libs.groupBy:", error);
		return [];
	}
}
/**
 * Lấy unique value array
 * @author thanh.bay 2019-02-22
 * @param  {Array} array
 * @param  {String} property
 */
Libs.unique = function (array, property) {
	if (!Array.isArray(array)) {
		return [];
	}
	var list = [],
		hasProperty = (typeof property !== 'undefined' && property != null && property != "");
	for (let key in array) {
		let item = array[key],
			find = list.find(i => {
				return hasProperty ? (i[property] == item[property]) : (i == item);
			});
		if (typeof find === 'undefined') {
			list.push(item);
		}
	}
	return list;
}
Libs.serialize = function (obj) {
	var str = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	return str.join("&");
}

Libs.bin2String = function (array) {
	var result = "";
	for (var i = 0; i < array.length; i++) {
		result += String.fromCharCode(parseInt(array[i], 2));
	}
	return result;
}
Libs.string2Bin = function (str) {
	var result = [];
	for (var i = 0; i < str.length; i++) {
		result.push(str.charCodeAt(i).toString(2));
	}
	return result;
}

Libs.bin2Zip = function (binArray, path, fileName) {
	try {
		if (fileName.indexOf('.zip') < 0) {
			fileName += ".zip";
		}
		var file_system = require('fs');
		var archiver = require('archiver');
		var output = file_system.createWriteStream(path + fileName);
		var archive = archiver('zip', {
			zlib: { level: 9 } // Sets the compression level.
		});
		return new Promise((resolve, reject) => {
			archive.pipe(output);
			// archive.file(path, { name: fileName });
			// archive
			//   .directory(path, false)
			//   .on('error', err => reject(err))
			//   .pipe(output)
			// ;
			archive.append(binArray, {
				name: 'file'
			});
			archive.finalize();
			archive.on('error', (err) => reject(err));
			output.on('close', () => resolve(true));
		});
		// output.on('close', function () {
		// 	// console.log(archive.pointer() + ' total bytes');
		// 	// console.log('archiver has been finalized and the output file descriptor has closed.');
		// });
		// archive.on('error', function(err){
		// 	throw err;
		// });
		// archive.pipe(output);
		archive.bulk([
			{ expand: true, cwd: 'source', src: ['**'], dest: 'source' }
		]);
		// archive.finalize();
	} catch (e) {
		console.log(e)
	}
}

/**
 * Tổng cộng tất cả giá trị trong array, trường hợp có truyền property vào array sẽ được hiểu là array object. và hàm sẽ tổng tất cả value trong object theo property đã truyền.
 * Ngược lại property rỗng thì được hiểu là array có value là số
 * @author thanh.bay 2019-04-04
 * @param  {Array} array
 * @param  {String} property
 */
Libs.sumByProp = function (array, property) {
	return array.reduce(function (accumulator, currentValue) {
		if (Libs.isBlank(currentValue[property])) {
			let value = Libs.isBlank(currentValue) ? 0 : (currentValue * 1)
			return (accumulator + value)
		} else {
			let value = Libs.isBlank(currentValue[property]) ? 0 : (currentValue[property] * 1)
			return (accumulator + value)
		}
	}, 0);
}

/**
 * Kiểm tra phần tử tồn tại trong mảng
 * @author LuyenNguyen 2019-06-11
 * @param  {String|int} value
 * @param  {Array} array
 */
Libs.isInArray = function (value, array) {
	return array.indexOf(value) > -1;
}
Libs.toUpperCase = function (str) {
	if (Libs.isBlank(str)) {
		return str;
	}
	return str.toUpperCase();
}

Libs.toLowerCase = function (str) {
	if (Libs.isBlank(str)) {
		return str;
	}
	return str.toLowerCase();
}

Libs.convertStr2DateV01 = (date, format, _delimiter) => {
	if (null == date || typeof date === 'undefined' || date == '') {
		return null;
	}
	var formatLowerCase = format.toLowerCase();
	var formatItems = formatLowerCase.split(_delimiter);
	var dateItems = date.split(_delimiter);
	var monthIndex = formatItems.indexOf("mm");
	var dayIndex = formatItems.indexOf("dd");
	var yearIndex = formatItems.indexOf("yyyy");
	//var month = parseInt(dateItems[monthIndex]);
	var month = dateItems[monthIndex];
	return dateItems[yearIndex] + '-' + (month) + '-' + dateItems[dayIndex];
}


Libs.convertStrToDateFullTime = (date, format, _delimiter) => {
	if (null == date || typeof date === 'undefined' || date == '') {
		return null;
	}
	var arrDate = date.split(" ");
	var formatLowerCase = format.toLowerCase();
	var formatItems = formatLowerCase.split(_delimiter);
	var dateItems = arrDate[0].split(_delimiter);
	var monthIndex = formatItems.indexOf("mm");
	var dayIndex = formatItems.indexOf("dd");
	var yearIndex = formatItems.indexOf("yyyy");
	//var month = parseInt(dateItems[monthIndex]);
	var month = dateItems[monthIndex];
	return dateItems[yearIndex] + '-' + (month) + '-' + dateItems[dayIndex] + " " + arrDate[1];
}


Libs.convertStr2YearMonth = (date, format, _delimiter) => {
	if (null == date || typeof date === 'undefined' || date == '') {
		return null;
	}
	var formatLowerCase = format.toLowerCase();
	var formatItems = formatLowerCase.split(_delimiter);
	var dateItems = date.split(_delimiter);
	var monthIndex = formatItems.indexOf("mm");
	var dayIndex = formatItems.indexOf("dd");
	var yearIndex = formatItems.indexOf("yyyy");
	//var month = parseInt(dateItems[monthIndex]);
	var month = dateItems[monthIndex];
	return dateItems[yearIndex] + '-' + (month);
}

Libs.removeUnicode = (str) => {
	str = str.toLowerCase();
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	str = str.replace(/đ/g, "d");

	str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
	str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
	str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
	str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
	str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
	str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
	str = str.replace(/Đ/g, "D");

	str = str.replace(/!|@|“|”|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|–|$|_/g, "-");

	str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
	str = str.replace(/^\-+|\-+$/g, "");

	return str;
}

Libs.decimalToErrorCode = (decimal) => {
	var arrErrorCode = [];
	if (Libs.isBlank(decimal)) return arrErrorCode;
	var decimalString = decimal.toString(2);
	var decimalArr = Object.assign([], decimalString);

	if (decimalArr.length <= 0) return arrErrorCode;

	// 1011
	var bit0 = decimalArr[decimalArr.length - 1];
	if (!Libs.isBlank(bit0) && parseInt(bit0) === 1) {
		arrErrorCode.push({ error_code: 0 });
	}
	var bit1 = decimalArr[decimalArr.length - 2];
	if (!Libs.isBlank(bit1) && parseInt(bit1) === 1) {
		arrErrorCode.push({ error_code: 1 });
	}
	var bit2 = decimalArr[decimalArr.length - 3];
	if (!Libs.isBlank(bit2) && parseInt(bit2) === 1) {
		arrErrorCode.push({ error_code: 2 });
	}
	var bit3 = decimalArr[decimalArr.length - 4];
	if (!Libs.isBlank(bit3) && parseInt(bit3) === 1) {
		arrErrorCode.push({ error_code: 3 });
	}
	var bit4 = decimalArr[decimalArr.length - 5];
	if (!Libs.isBlank(bit4) && parseInt(bit4) === 1) {
		arrErrorCode.push({ error_code: 4 });
	}
	var bit5 = decimalArr[decimalArr.length - 6];
	if (!Libs.isBlank(bit5) && parseInt(bit5) === 1) {
		arrErrorCode.push({ error_code: 5 });
	}
	var bit6 = decimalArr[decimalArr.length - 7];
	if (!Libs.isBlank(bit6) && parseInt(bit6) === 1) {
		arrErrorCode.push({ error_code: 6 });
	}
	var bit7 = decimalArr[decimalArr.length - 8];
	if (!Libs.isBlank(bit7) && parseInt(bit7) === 1) {
		arrErrorCode.push({ error_code: 7 });
	}
	var bit8 = decimalArr[decimalArr.length - 9];
	if (!Libs.isBlank(bit8) && parseInt(bit8) === 1) {
		arrErrorCode.push({ error_code: 8 });
	}
	var bit9 = decimalArr[decimalArr.length - 10];
	if (!Libs.isBlank(bit9) && parseInt(bit9) === 1) {
		arrErrorCode.push({ error_code: 9 });
	}
	var bit10 = decimalArr[decimalArr.length - 11];
	if (!Libs.isBlank(bit10) && parseInt(bit10) === 1) {
		arrErrorCode.push({ error_code: 10 });
	}
	var bit11 = decimalArr[decimalArr.length - 12];
	if (!Libs.isBlank(bit11) && parseInt(bit11) === 1) {
		arrErrorCode.push({ error_code: 11 });
	}
	var bit12 = decimalArr[decimalArr.length - 13];
	if (!Libs.isBlank(bit12) && parseInt(bit12) === 1) {
		arrErrorCode.push({ error_code: 12 });
	}
	var bit13 = decimalArr[decimalArr.length - 14];
	if (!Libs.isBlank(bit13) && parseInt(bit13) === 1) {
		arrErrorCode.push({ error_code: 13 });
	}
	var bit14 = decimalArr[decimalArr.length - 15];
	if (!Libs.isBlank(bit14) && parseInt(bit14) === 1) {
		arrErrorCode.push({ error_code: 14 });
	}
	var bit15 = decimalArr[decimalArr.length - 16];
	if (!Libs.isBlank(bit15) && parseInt(bit15) === 1) {
		arrErrorCode.push({ error_code: 15 });
	}
	var bit16 = decimalArr[decimalArr.length - 17];
	if (!Libs.isBlank(bit16) && parseInt(bit16) === 1) {
		arrErrorCode.push({ error_code: 16 });
	}
	var bit17 = decimalArr[decimalArr.length - 18];
	if (!Libs.isBlank(bit17) && parseInt(bit17) === 1) {
		arrErrorCode.push({ error_code: 17 });
	}
	var bit18 = decimalArr[decimalArr.length - 19];
	if (!Libs.isBlank(bit18) && parseInt(bit18) === 1) {
		arrErrorCode.push({ error_code: 18 });
	}
	var bit19 = decimalArr[decimalArr.length - 20];
	if (!Libs.isBlank(bit19) && parseInt(bit19) === 1) {
		arrErrorCode.push({ error_code: 19 });
	}
	var bit20 = decimalArr[decimalArr.length - 21];
	if (!Libs.isBlank(bit20) && parseInt(bit20) === 1) {
		arrErrorCode.push({ error_code: 20 });
	}
	var bit21 = decimalArr[decimalArr.length - 22];
	if (!Libs.isBlank(bit21) && parseInt(bit21) === 1) {
		arrErrorCode.push({ error_code: 21 });
	}
	var bit22 = decimalArr[decimalArr.length - 23];
	if (!Libs.isBlank(bit22) && parseInt(bit22) === 1) {
		arrErrorCode.push({ error_code: 22 });
	}
	var bit23 = decimalArr[decimalArr.length - 24];
	if (!Libs.isBlank(bit23) && parseInt(bit23) === 1) {
		arrErrorCode.push({ error_code: 23 });
	}
	var bit24 = decimalArr[decimalArr.length - 25];
	if (!Libs.isBlank(bit24) && parseInt(bit24) === 1) {
		arrErrorCode.push({ error_code: 24 });
	}
	var bit25 = decimalArr[decimalArr.length - 26];
	if (!Libs.isBlank(bit25) && parseInt(bit25) === 1) {
		arrErrorCode.push({ error_code: 25 });
	}
	var bit26 = decimalArr[decimalArr.length - 27];
	if (!Libs.isBlank(bit26) && parseInt(bit26) === 1) {
		arrErrorCode.push({ error_code: 26 });
	}
	var bit27 = decimalArr[decimalArr.length - 28];
	if (!Libs.isBlank(bit27) && parseInt(bit27) === 1) {
		arrErrorCode.push({ error_code: 27 });
	}
	var bit28 = decimalArr[decimalArr.length - 29];
	if (!Libs.isBlank(bit28) && parseInt(bit28) === 1) {
		arrErrorCode.push({ error_code: 28 });
	}
	var bit29 = decimalArr[decimalArr.length - 30];
	if (!Libs.isBlank(bit29) && parseInt(bit29) === 1) {
		arrErrorCode.push({ error_code: 29 });
	}
	var bit30 = decimalArr[decimalArr.length - 31];
	if (!Libs.isBlank(bit30) && parseInt(bit30) === 1) {
		arrErrorCode.push({ error_code: 30 });
	}
	var bit31 = decimalArr[decimalArr.length - 32];
	if (!Libs.isBlank(bit31) && parseInt(bit31) === 1) {
		arrErrorCode.push({ error_code: 31 });
	}

	return arrErrorCode;
}
