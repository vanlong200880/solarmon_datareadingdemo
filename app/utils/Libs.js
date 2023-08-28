'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var diff = require('deep-diff').diff;
var formatNum = require('format-number');
var logger = FLLogger.getLogger("LibLog");
var date = require('date-and-time');
var NumberToWordsVN = require('read-vn-number');
var NumberToWords = require('number-to-words');
var moment = require("moment");
var roundTo = require('round-to');


var Libs = function Libs() {};
module.exports = Libs;
var tableCode = [{ value: '2ZS', id: '!' }, { value: 'X3p', id: '“' }, { value: 'imE', id: '#' }, { value: 'EUT', id: '$' }, { value: 'XSh', id: '%' }, { value: 'E5P', id: '&' }, { value: 'WEj', id: '‘' }, { value: '45Q', id: '(' }, { value: 'iI1', id: ')' }, { value: 't6x', id: '*' }, { value: 'hd9', id: '+' }, { value: 'jiJ', id: ',' }, { value: 'UPw', id: '-' }, { value: 'AxC', id: '.' }, { value: 'Ywb', id: '/' }, { value: 'aY8', id: '0' }, { value: 'mLR', id: '1' }, { value: 'qae', id: '2' }, { value: 'Xpg', id: '3' }, { value: 'oS3', id: '4' }, { value: 'dTN', id: '5' }, { value: 'jSC', id: '6' }, { value: 'Dfz', id: '7' }, { value: 'Sz1', id: '8' }, { value: 'Qu1', id: '9' }, { value: 'i5E', id: ':' }, { value: 'IQ6', id: ';' }, { value: 'Qnn', id: '<' }, { value: 'ZPA', id: '=' }, { value: 'N9x', id: '>' }, { value: 'oiI', id: '?' }, { value: 'yU3', id: '@' }, { value: '46o', id: 'A' }, { value: '7nE', id: 'B' }, { value: 'wuQ', id: 'C' }, { value: 'O1O', id: 'D' }, { value: 'SKy', id: 'E' }, { value: 'r1H', id: 'F' }, { value: 'aUW', id: 'G' }, { value: 'Tew', id: 'H' }, { value: 'chh', id: 'I' }, { value: '7FA', id: 'J' }, { value: 'ekK', id: 'K' }, { value: 'Ewp', id: 'L' }, { value: 'Oxa', id: 'M' }, { value: 'T6g', id: 'N' }, { value: 'xYx', id: 'O' }, { value: 'gbz', id: 'P' }, { value: 'd4h', id: 'Q' }, { value: '1Ow', id: 'R' }, { value: 'Fw6', id: 'S' }, { value: 'mor', id: 'T' }, { value: 'NDC', id: 'U' }, { value: '7pm', id: 'V' }, { value: 'Rn4', id: 'W' }, { value: 'RVu', id: 'X' }, { value: 'dUW', id: 'Y' }, { value: 'ic8', id: 'Z' }, { value: 'aRm', id: '[' }, { value: 'po7', id: "\\" }, { value: 'tVA', id: ']' }, { value: 'C5a', id: '^' }, { value: 'G0m', id: '_' }, { value: 'WHB', id: '`' }, { value: 'P91', id: 'a' }, { value: 'cDf', id: 'b' }, { value: '5Zp', id: 'c' }, { value: 'pX5', id: 'd' }, { value: 'beG', id: 'e' }, { value: 'sgd', id: 'f' }, { value: '2Dl', id: 'g' }, { value: 'YjH', id: 'h' }, { value: 'SQB', id: 'i' }, { value: 'jJE', id: 'j' }, { value: 'Gtw', id: 'k' }, { value: 'JsK', id: 'l' }, { value: 'qfv', id: 'm' }, { value: '5ty', id: 'n' }, { value: 'BSm', id: 'o' }, { value: 'Fbd', id: 'p' }, { value: 'xO7', id: 'q' }, { value: 'W5R', id: 'r' }, { value: 'ugh', id: 's' }, { value: 'nbs', id: 't' }, { value: 'mgl', id: 'u' }, { value: 'aqL', id: 'v' }, { value: 'QJN', id: 'w' }, { value: 'X9d', id: 'x' }, { value: 'lIB', id: 'y' }, { value: 'Csm', id: 'z' }, { value: 'uQ8', id: '' }, { value: 'EW7', id: '|' }, { value: 'pP9', id: '' }, { value: '5r3', id: '~' }, { value: 'Nq0', id: ' ' }];

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
};

Libs.SHA3 = function (plainText) {
	if (typeof plainText === 'undefined') {
		return plainText;
	}
	var CryptoLib = require('./Crypto.js');
	return CryptoLib.SHA3(plainText);
};

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
};

Libs.decodePassWord = function (ciphTxt, secret_key) {
	try {
		var CryptoLib = require('./Crypto.js');
		var decryptTxt = CryptoLib.decrypt(ciphTxt, secret_key);
		return decryptTxt;
	} catch (e) {
		logger.error(e);
	}
};

Libs.uploadResizeImage = async function (source, destinationPath, fileName) {
	var quality = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
	var w = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	var h = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

	if (!source || !destinationPath || !fileName) return;

	var lastFilePathCharacter = destinationPath.slice(-1);
	if (lastFilePathCharacter === '/') {
		destinationPath = destinationPath.substring(0, destinationPath.length - 1);
	}

	//Tạo thư mục upload nếu chưa tồn tại
	var exist = true;
	try {
		exist = fs.statSync(destinationPath).isDirectory();
	} catch (e) {
		exist = false;
	}
	if (!exist) {
		await Libs.mkdirFolder(destinationPath);
	}
	var path = require('path');
	_jimp2.default.read(source).then(function (lenna) {
		if (w == 0 && h == 0) {
			return lenna.quality(quality).write(path.join(destinationPath, fileName));
		} else {
			return lenna.resize(w, h).quality(quality).write(path.join(destinationPath, fileName));
		}
	}).catch(function (err) {
		console.error(err);
	});
};

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
	var str = '';
	for (var i = 0; i < chars.length; i++) {
		var find = Libs.find(tableCode, 'id', chars[i]);
		if (find) {
			str += find.value;
		}
	}
	return str;
};

/**
 * Taka Decode
 * @param plaintext 
 * @return string
 */

Libs.takaDecode = function (text) {
	if (Libs.isBlank(text)) {
		return text;
	}
	var chars = [],
	    str = '';
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
};

/**
 * Find objects in arrays by value and field
 * @param items
 * @param field
 * @param value
 * @returns
 */
Libs.find = function (items, field, value) {
	if (!items) return null;
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
		return typeof str === 'string' ? str.trim() : str;
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
		if ((typeof str === 'undefined' ? 'undefined' : _typeof(str)) === undefined || str == null || Libs.safeTrim(str) === "") {
			return true;
		}
		return false;
	} catch (e) {
		console.log(e);
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
		} else {
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
};
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
};
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
};

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
};
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
				if (!libs.isBlank(data[key])) if (typeof tableE[key] === 'number') tableE[key] = parseInt(data[key]);else if (typeof tableE[key] === 'string') tableE[key] = libs.safeTrim(data[key]);else tableE[key] = data[key];
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
};

/**
 * create route path for app
 */
Libs.getSubdomainName = function (req) {
	var subdomains = req.subdomains;
	console.log(subdomains);
	var subdomain = "";
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = subdomains[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			subdomain = _step.value;

			console.log(subdomain);
			if (subdomain != "www" && subdomain != domain_name) {
				break;
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
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
};
/**
 * check xem có tồn tại company hay ko
 * @param company_id
 */
Libs.checkExistedCompany = function (company_id) {
	var CompanyModel = require("../models/CompanyModel");
	var companyModel = new CompanyModel();
	var check_existed = companyModel.checkCompanyIdExisted(company_id);
	return check_existed > 0;
};
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
				output = to_json(xlsx, workbook); //JSON.parse(JSON.stringify(me.to_json(wb), 2, 2));
		}
		console.log(output);
		return output;
	} catch (e) {
		console.log(e);
		return false;
	}
};
/**
 * convert data excel to json
 */
var to_json = function to_json(xlsx, workbook) {
	var result = {};
	var sheetIndex = 0;
	workbook.SheetNames.forEach(function (sheetName) {
		var roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if (roa.length > 0) {
			result[sheetIndex++] = roa;
		}
	});
	return result;
};
/**
 * convert data excel to csv
 */
var to_csv = function to_csv(xlsx, workbook) {
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
};
/**
 * convert data to formular
 */
var to_formulae = function to_formulae(xlsx, workbook) {
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
};
/**
 * export json data to excel file
 */
Libs.saveAsExcel = function (fileName, data) {
	try {
		var alasql = require("alasql");
		return alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [data]) == 1;
	} catch (e) {
		console.log(e);
		return false;
	}
};
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
};
Libs.capitalize = function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};
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
	return fs.lstatSync(path_string).isDirectory();
};
Libs.checkFileExits = function checkFileExits(path, fileName) {
	try {
		var fs = require("fs");
		var files = fs.readdirSync(path);
		return files.indexOf(fileName) >= 0;
	} catch (error) {
		return false;
	}
};
//kiểm tra object rỗng or null
Libs.isObjectEmpty = function (obj) {
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	if (obj == null) return true;
	if (obj.length > 0) return false;
	if (obj.length === 0) return true;
	if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== "object") return true;
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}
	return true;
};
//đổi thứ ngày tháng sang milisecond
Libs.convertDateToMilliseconds = function (date, format) {
	//	var d = date.split("-");
	//	console.log(date);
	var f = new Date(date);
	if (null == f || "undefined" === typeof f) return 0;
	return f.getTime();
};
Libs.convertMillisecondsToDate = function (time) {
	var date = new Date(time);
	return date;
};
Libs.convertMillisecondsToDataFormat = function (milliseconds) {
	var isShowHour = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	milliseconds = parseInt(milliseconds);
	if (milliseconds == null || milliseconds == 0) return "";
	var dateObj = new Date(milliseconds);
	var day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
	var month = dateObj.getMonth() + 1 < 10 ? "0" + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;
	var year = dateObj.getFullYear();
	var hour = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
	var minute = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
	var second = dateObj.getSeconds() < 10 ? "0" + dateObj.getSeconds() : dateObj.getSeconds();
	if (isShowHour) return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;else return day + "/" + month + "/" + year;
};
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
};
/**
 * decode to object from token string
 * @param {string} token 
 * @return object
 */
Libs.decodeTokenCrypto = function (token) {
	try {
		if (null == token || (typeof token === 'undefined' ? 'undefined' : _typeof(token)) === undefined) {
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
};

Libs.md5 = function (plainText) {
	if (typeof plainText === 'undefined') {
		return plainText;
	}
	var CryptoLib = require('./Crypto.js');
	return CryptoLib.md5(plainText);
};

Libs.AESEncrypt = function (plainText, secretKey) {
	if (typeof plainText === 'undefined' || typeof secretKey === 'undefined') {
		return plainText;
	}
	var CryptoLib = require('./Crypto.js');
	return CryptoLib.AESEncrypt(plainText, secretKey);
};

Libs.AESDecrypt = function (plainText, secretKey) {
	if (typeof plainText === 'undefined' || typeof secretKey === 'undefined') {
		return plainText;
	}
	var CryptoLib = require('./Crypto.js');
	return CryptoLib.AESDecrypt(plainText, secretKey);
};

Libs.convertEmptyPropToNullProp = function (object) {
	if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) != 'object') return {};
	var obj = {};
	for (var key in object) {
		object[key] = object[key] === '' ? null : object[key];
		if (object[key] != '') {
			obj[key] = object[key];
		} else if (object[key] === 0) {
			obj[key] = object[key];
		}
	}
	return obj;
};
/**
 * Remove Header Data Post:
 * headers object,
 * protocol object,
 * host objects
 * @param {data json} object 
 */
Libs.removeObjectPostJson = function (object) {
	try {
		if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) != 'object') return {};
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
};

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
};
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
Libs.formatNum = function (val) {
	var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#,###.##";
	var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	if (Libs.isBlank(val) || isNaN(val)) {
		return "";
	}
	val = val * 1;
	var comma = ',';
	var decimal = '.';
	var afterDecimalNum = 0; //sau dấu thập phân lấy mấy số
	if (Libs.isBlank(pattern)) {
		pattern = "#,###.##";
	}

	//phân tích pattern
	//chỉ chấp nhận dấu phẩy hoặc dấu .
	var regex = new RegExp("[,.]+", "ig");
	var myArray = void 0;
	var index = 0;
	var afterDecimal = "";
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
		afterDecimalNum = pattern.length - (pattern.lastIndexOf(decimal) + 1);
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
};
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
	var day = inputDate.substring(0, 2);
	var month = inputDate.substring(3, 5);
	var year = inputDate.substring(6, 10);
	return year + "-" + month + "-" + day;
};
Libs.date2Str = function (_date, _format) {
	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return null;
	}
	var day = _date.getDate();
	var month = _date.getMonth();
	var year = _date.getFullYear() + '';
	month += 1;
	day = day.toString().padStart(2, "0");
	month = month.toString().padStart(2, "0");
	var result = _format.toLowerCase();
	result = result.replace('dd', day);
	result = result.replace('mm', month);
	result = result.replace('yyyy', year);
	return result;
};
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
		var day = '',
		    month = '',
		    year = '';
		if (Object.prototype.toString.call(DBDate) == "[object Date]") {
			day = DBDate.getDate().toString().padStart(2, "0");
			month = (DBDate.getMonth() + 1).toString().padStart(2, "0");
			year = DBDate.getFullYear();
		} else {
			var newDate = new Date(DBDate);
			var isValid = newDate.getDate() > 0;
			if (!isValid) {
				return null;
			}
			day = newDate.getDate().toString().padStart(2, "0");
			month = (newDate.getMonth() + 1).toString().padStart(2, "0");
			year = newDate.getFullYear();
		}
		var dateReturn = day + '/' + month + '/' + year;
		console.log("DBDateToInputDate return: ", dateReturn);
		return dateReturn;
	} catch (e) {
		console.log(e);
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
};
Libs.CheckDiffJson = function (item) {
	if (item.path[0] !== 'updated_date' && item.path[0] !== 'updated_by' && item.path[0] !== 'created_date' && item.path[0] !== 'created_by' && item.path[0] !== 'mode' && item.path[0] !== 'is_supper' && item.path[0] !== 'is_paging' && item.path[0] !== 'lang_default' && item.path[0] !== 'current_row' && item.path[0] !== 'max_record' && item.path[0] !== 'currentUser') return true;
	return false;
};
/**
 * Lấy các phần tử thay đổi của 2 object json
 * @param {json object} newItem 
 * @param {json object} oldItem 
 */
Libs.DeepDiffJson = function (newItem, oldItem) {
	try {
		if (!newItem) return;
		if (!oldItem) oldItem = {};
		var diffData = diff(oldItem, newItem);
		var ObjDiff = [];
		if (!diffData) return;
		for (var i = 0; i < diffData.length; i++) {
			var item = diffData[i];
			var itemE = {};
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
		var data_return = "";
		if (ObjDiff.length > 0) data_return = JSON.stringify(ObjDiff); // gia tri luu xuong db
		return data_return;
	} catch (error) {
		console.log(error);
	}
};

Libs.isInteger = function (value) {
	try {
		var val = value;
		if (typeof val === 'undefined' || val == null) return false;
		if (typeof val === 'number') {
			val = val.toString();
		}
		val = val.replace(/^-/, '');
		return (/^(0|[1-9]\d*)$/.test(val)
		);
	} catch (err) {
		return false;
	}
};

/**
 * Lấy số ngày trong tháng
 * @author Minh.Pham 2018-11-28
 */
Libs.getDaysOfMonth = function (year, month) {
	var d = new Date(year, month, 0);
	return d.getDate();
};

/**
 * get Current Year format yy
 */
Libs.getCurrentYY = function () {
	var year = new Date().getFullYear().toString().substr(-2);
	return year;
};
Libs.getCurrentYYMMDD = function () {
	var date = new Date();
	var year = date.getFullYear().toString().substr(-2);
	var month = (date.getMonth() + 1).toString().padStart(2, "0");
	var day = date.getDate().toString().padStart(2, "0");
	return year + month + day;
};
Libs.getCurrentDDMMYYYY = function () {
	var date = new Date();
	var year = date.getFullYear().toString();
	var month = (date.getMonth() + 1).toString().padStart(2, "0");
	var day = date.getDate().toString().padStart(2, "0");
	return day + "/" + month + "/" + year;
};

Libs.buildPathValidateMessage = function (path, message) {
	if (typeof path !== 'string' || typeof message !== 'string') return null;
	if (path.length <= 0) return null;
	var validate = {};
	validate[path] = message;
	return validate;
};

/**
 * Validate ngày sinh theo từng ô input
 * @author thanh.bay 2018-09-25
 * @param  {string} day=""
 * @param  {string} month=""
 * @param  {string} year=""
 */
Libs.validateBirthDay = function () {
	var day = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
	var year = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

	day = typeof day !== 'string' ? "" : day;
	month = typeof month !== 'string' ? "" : month;
	year = typeof year !== 'string' ? "" : year;

	if (day.length > 0 && (month.length <= 0 || year.length <= 0)) return false;
	if (month.length > 0 && year.length <= 0) return false;
	if (year.length <= 0) return false;

	// Chỉ kiểm tra năm
	var checkYear = function checkYear(mYear) {
		var currentYear = new Date().getFullYear();
		if (mYear.length !== 4 || mYear * 1 < 1900 || currentYear * 1 < mYear * 1) return false;
		if (currentYear - mYear > 100) return false;
		return true;
	};

	// kiểm tra tháng và năm
	var checkMonthYear = function checkMonthYear(mMonth, mYear) {
		if (mMonth.length !== 2 || mMonth * 1 > 12 || mMonth * 1 <= 0) return false;
		var currentDate = new Date();
		// Kiểm tra tháng không được lớn hơn tháng hiện tại nếu năm sinh là năm hiện tại
		if (currentDate.getFullYear() == mYear && currentDate.getMonth() * 1 + 1 < mMonth) return false;
		return checkYear(mYear);
	};

	// kiểm tra ngày hợp lệ
	var checkFullDate = function checkFullDate(mDay, mMonth, mYear) {
		var strDate = mDay + "/" + mMonth + "/" + mYear;
		var validate = Libs.validateDate(strDate);
		if (!validate) return false;
		// Kiểm tra có lớn hơn ngày hiện tại
		var mDate = new Date(mYear, mMonth * 1 - 1, mDay);
		var currentDate = new Date(),
		    d = currentDate.setHours(0, 0, 0, 0);
		if (mDate.valueOf() > d) return false;
		return true;
	};

	var check = function check(day, month, year) {
		var type = 0; // yyyy
		if (day.length > 0) {
			type = 1; // dd/mm/yyyy
		} else if (day.length <= 0 && month.length > 0) {
			type = 2; // mm/yyyy
		}

		if (type === 0) {
			return checkYear(year);
		}
		if (type === 1) {
			var vYear = checkYear(year);
			if (!vYear) return false;
			return checkFullDate(day, month, year);
		}
		if (type === 2) {
			return checkMonthYear(month, year);
		}
	};
	return check(day, month, year);
};

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
		} else if (lopera2 > 1) {
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
			if (!(yy % 4) && yy % 100 || !(yy % 400)) {
				lyear = true;
			}
			if (lyear == false && dd >= 29) {
				return false;
			}
			if (lyear == true && dd > 29) {
				return false;
			}
			return true;
		}
	} else {
		return false;
	}
};

Libs.isNumber = function (value) {
	try {
		var val = value;
		if (typeof val === 'undefined' || val == null) return false;
		if (typeof val === 'number') {
			val = val.toString();
		}
		val = val.replace(/^-/, '');
		return (/^[0-9\b]+$/.test(val)
		);
	} catch (err) {
		console.log(err);
		return false;
	}
};

Libs.getCurrentMilliseconds = function () {
	var d = new Date();
	return d.getTime();
};
/**
 * Lay ngay hien tai theo format String
 */
Libs.getCurrentDateFormat = function (formatString) {
	var now = new Date();
	formatString = formatString.toUpperCase();
	var str = date.format(now, formatString);
	return str;
};

Libs.groupByProps = function (objectArray, property) {
	return objectArray.reduce(function (acc, obj) {
		var key = obj[property];
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(obj);
		return acc;
	}, {});
};

/**
 * Lấy tất cả value theo property trong array object (bỏ qua những value nào là null, empty hoặc undefined)
 * @author thanh.bay 2018-11-29
 * @param  {Array} objectArray
 * @param  {String} property
 */
Libs.getValuesArrayByProp = function (objectArray, property) {
	if (!Array.isArray(objectArray)) return [];
	var values = [];
	for (var key in objectArray) {
		var item = objectArray[key],
		    value = item[property];

		if (item && value || value == '0') {
			values.push(value);
		}
	}
	return values;
};

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
	if (age.years > 1) yearString = " tuổi";else yearString = " tuổi";
	if (age.months > 1) monthString = " tháng";else monthString = " tháng";
	if (age.days > 1) dayString = " ngày";else dayString = " ngày";
	if (age.years > 0 && age.months > 0 && age.days > 0) ageString = age.years + yearString + ", " + age.months + monthString + " " + age.days + dayString;
	// ageString = age.months + monthString + " và " + age.days + dayString;
	else if (age.years == 0 && age.months == 0 && age.days > 0) ageString = age.days + dayString;else if (age.years == 0 && age.months == 0 && age.days == 0) ageString = "1" + dayString;else if (age.years > 0 && age.months == 0 && age.days == 0) ageString = age.years + yearString;
		// ageString = "";
		else if (age.years > 0 && age.months > 0 && age.days == 0) ageString = age.years + yearString + " " + age.months + monthString;
			// ageString = age.months + monthString;
			else if (age.years == 0 && age.months > 0 && age.days > 0) ageString = age.months + monthString + " " + age.days + dayString;else if (age.years > 0 && age.months == 0 && age.days > 0) ageString = age.years + yearString + " " + age.days + dayString;
				// ageString = age.days + dayString;
				else if (age.years == 0 && age.months > 0 && age.days == 0) ageString = age.days + dayString;else ageString = "";
	return ageString;
};
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
	if (monthNow >= monthDob) var monthAge = monthNow - monthDob;else {
		yearAge--;
		var monthAge = 12 + monthNow - monthDob;
	}

	if (dateNow >= dateDob) var dateAge = dateNow - dateDob;else {
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
};
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
	    filterArrayBirthday = arrayBirthday.filter(function (item) {
		return !Libs.isBlank(item);
	});
	if (filterArrayBirthday.length > 0 || Libs.isBlank(patientEnity.birthday)) {
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
	    filterArrayRealBirthday = arrayRealBirthday.filter(function (item) {
		return !Libs.isBlank(item);
	});
	if (filterArrayRealBirthday.length > 0 || Libs.isBlank(patientEnity.real_birthday)) {
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
	var address = !Libs.isBlank(patientEnity.address) ? patientEnity.address : "";
	address = !Libs.isBlank(patientEnity.ward_name) ? address + (!Libs.isBlank(address) ? ", " : "") + patientEnity.ward_name : address;
	address = !Libs.isBlank(patientEnity.district_name) ? address + (!Libs.isBlank(address) ? ", " : "") + patientEnity.district_name : address;
	address = !Libs.isBlank(patientEnity.city_name) ? address + (!Libs.isBlank(address) ? ", " : "") + patientEnity.city_name : address;
	address = !Libs.isBlank(patientEnity.country_name) ? address + (!Libs.isBlank(address) ? ", " : "") + patientEnity.country_name : address;

	patientEnity.address = address;
	//Build dia chi tạm trú
	var address1 = !Libs.isBlank(patientEnity.address1) ? patientEnity.address1 : "";
	address1 = !Libs.isBlank(patientEnity.ward_name1) ? address1 + (!Libs.isBlank(address1) ? ", " : "") + patientEnity.ward_name1 : address1;
	address1 = !Libs.isBlank(patientEnity.district_name1) ? address1 + (!Libs.isBlank(address1) ? ", " : "") + patientEnity.district_name1 : address1;
	address1 = !Libs.isBlank(patientEnity.city_name1) ? address1 + (!Libs.isBlank(address1) ? ", " : "") + patientEnity.city_name1 : address1;
	address1 = !Libs.isBlank(patientEnity.country_name1) ? address1 + (!Libs.isBlank(address1) ? ", " : "") + patientEnity.country_name1 : address1;
	patientEnity.address1 = address1;
	return patientEnity;
};
/**
 *Convert money number to VietNam String: đọc số tiền
 *@author Minh.Pham 2018-10-23
*/
Libs.moneytoString = function (total) {
	var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'vi';

	if (total == 0) return "Không đồng";
	total = parseInt(total);
	var sMoney = "";
	if (lang == 'vi') {
		sMoney = NumberToWordsVN.default.read(total);
		sMoney = sMoney + " đồng";
	} else {
		sMoney = NumberToWords.toWords(total);
	}

	if (sMoney.length > 0) {
		var sBeginChar = sMoney.substring(0, 1);
		sBeginChar = sBeginChar.toUpperCase();
		sMoney = sBeginChar + sMoney.substring(1);
	}

	sMoney = sMoney.replace("  ", " ");
	return sMoney;
};

/**
 * Them zero befor number
 */
Libs.padLeft = function (str, number, digit) {
	return Array(number - String(str).length + 1).join(digit || '0') + str;
};
/**
 * Convert datetime(sqlDate, javascript date) to VN string
 * @author Minh.Pham 2018-10-23
 */
Libs.convertDateTimeToVNWord = function (date) {
	date = moment(date);
	var strDate = Libs.padLeft(date.hours(), 2) + " giờ ";
	strDate += Libs.padLeft(date.minutes(), 2) + " phút";
	strDate += ',  ngày ';
	strDate += Libs.padLeft(date.date(), 2) + " tháng ";
	strDate += Libs.padLeft(date.month() + 1, 2) + " năm ";
	strDate += Libs.padLeft(date.year(), 4);
	return strDate;
};
/**
 * Convert date(sqlDate, javascript date) to VN string
 * @author Minh.Pham 2018-10-23
 */
Libs.convertDateToVNWord = function (date) {
	if (!moment(date).isValid()) {
		return "";
	}
	date = moment(date);
	var strDate = 'Ngày ';
	strDate += Libs.padLeft(date.date(), 2) + " tháng ";
	strDate += Libs.padLeft(date.month() + 1, 2) + " năm ";
	strDate += Libs.padLeft(date.year(), 4);
	return strDate;
};
/**
 * Convert date(sqlDate, javascript date) to VN string(fromar YYYY-MM-DD)
 * @author Minh.Pham 2018-10-23
 */
Libs.convertDateToVNWordYYYYMMDD = function (date) {
	var arr = date.split('-');
	var strDate = 'Ngày ';
	strDate += Libs.padLeft(arr[2], 2) + " tháng ";
	strDate += Libs.padLeft(arr[1], 2) + " năm ";
	strDate += Libs.padLeft(arr[0], 4);
	return strDate;
};
Libs.convertAllFormatDateToStr = function (_date, _format) {
	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return '';
	}
	if (_date.includes('/')) {
		return _date;
	}
	var date = moment(_date);
	if (!date._isValid) {
		return _date;
	}
	return date.format(_format.toUpperCase());
};
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
};

/**
 * @description convert date to string
 * @param {array} data 
 * @author: Minh.Pham
 */
Libs.convertSQLDateToStr = function (_date, _format) {
	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return null;
	}
	var date = new Date(_date);
	var result = Libs.convertDateToStr(date, _format);
	return result;
};

Libs.convertDateToStr = function (_date, _format) {
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
};

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
			func(resolve, reject);
		});
	} catch (ex) {
		console.log(ex);
		throw ex;
	}
};
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
			var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
			var checkFileName = fileNameSpit + "(" + number + ")" + "." + ext;
			if (!newFileName) {
				newFileName = fileNameSpit;
			} else {
				checkFileName = newFileName + "(" + number + ")" + "." + ext;
			}
			return Libs.getFileName(fileDir, checkFileName, number, newFileName);
		} else {
			return fileName;
		}
	} catch (error) {
		console.log('Không lấy được tên file: ', error);
		return null;
	}
};
/**
 * Tạo folder fullpath
 * @author: khanh.le
 */
Libs.mkdirFolder = async function (path) {
	var paths = path.split('/');
	var fullPath = '';
	try {
		for (var index = 0; index < paths.length; index++) {
			var folder = paths[index];
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
			var exist = true;
			try {
				exist = fs.existsSync(fullPath);
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
};
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
		var exist = true;
		try {
			exist = fs.statSync(filePath).isDirectory();
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
				} else {
					callback(true);
				}
			});
		} else {
			return new Promise(function (resolve, reject) {
				fs.writeFile(fileUpload, data, function (err) {
					if (err) {
						reject(err);
					} else {
						resolve(true);
					}
				});
			});
		}
	} catch (error) {
		if (callback && typeof callback === 'function') {
			callback(error);
		} else {
			return false;
		}
	}
};
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
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
};
Libs.checkBitOnOff = function (nByte, bitIndex) {
	var result = nByte & parseInt(Math.pow(2, bitIndex));
	return result != 0 ? true : false;
};
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
};
/**
 * Convert Data to DB
 */
Libs.convertAllFormatDate = function (_date) {
	var from_format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DD/MM/YYYY HH:mm";
	var to_format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "YYYY-MM-DD HH:mm";

	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return '';
	}
	var date = moment(_date, from_format);
	if (!date._isValid) {
		return _date;
	}
	return date.format(to_format);
};

/**
 * Chuyển string date thành dạng YYYYMMDD
 * @author Minh.Pham 2018-10-20
 */
Libs.convertStr2DateV02 = function (date, format, _delimiter) {
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
	return dateItems[yearIndex] + month + dateItems[dayIndex];
};
/**
 * Add Days
 */
Libs.addDays = function (date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

/**
 * Lấy array từ ngày bắt đầu đến ngày kết thúc
 * @author thanh.bay 2019-06-06
 * @param  {string} startDate (format yyyy-MM-dd)
 * @param  {string} stopDate (format yyyy-MM-dd)
 * @param  {string} format
 */
Libs.getDates = function (startDate, stopDate) {
	var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "YYYY-MM-DD";

	try {
		var dateArray = [],
		    currentDate = new Date(startDate),
		    toDate = new Date(stopDate);

		while (currentDate <= toDate) {
			var _date2 = Libs.convertDateToStr(currentDate, format);
			dateArray.push(_date2);
			currentDate = Libs.addDays(currentDate, 1);
		}
		return dateArray;
	} catch (error) {
		console.log("Libs.getDates:", error);
		return [];
	}
};

/**
 * Lấy array từ tháng đến tháng
 * @author thanh.bay 2019-06-13
 * @param  {string} startDate (format yyyy-MM-dd)
 * @param  {string} stopDate (format yyyy-MM-dd)
 * @param  {string} format="YYYY-MM"
 */
Libs.getMonths = function (startDate, stopDate) {
	var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "YYYY-MM";

	try {
		if (typeof format !== 'string' || typeof format === 'string' && format.length <= 0) {
			return [];
		}
		format = format.toLowerCase();
		var monthArray = [],
		    endDate = new Date(stopDate),
		    currentDate = new Date(startDate + " 00:00:00"),
		    toDate = new Date(endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + Libs.getDaysOfMonth(endDate.getFullYear(), endDate.getMonth() + 1) + " 00:00:00");

		while (currentDate <= toDate) {
			var currentMonth = (currentDate.getMonth() + 1 + "").padStart(2, '0'),
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
};
/**
 * Lấy danh sách năm
 * @author thanh.bay 2019-06-13
 * @param  {string} startDate (format yyyy-MM-dd)
 * @param  {string} stopDate (format yyyy-MM-dd)
 */
Libs.getYears = function (startDate, stopDate) {
	try {
		var yearArray = [],
		    currentYear = new Date(startDate).getFullYear(),
		    toYear = new Date(stopDate).getFullYear();

		while (currentYear <= toYear) {
			yearArray.push(currentYear + "");
			currentYear += 1;
		}
		return yearArray;
	} catch (error) {
		console.log("Libs.getYears:", error);
		return [];
	}
};

/**
  * format date to another format
  * mặc định không truyền vô from format thì hệ thống tự nhận biết
  * nếu muốn chính xác thì truyền vào from format
  * @param {String} _date 
  * @param {String} format 
  * @param {String} from_format 
  */
Libs.dateFormat = function (_date) {
	var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DD/MM/YYYY HH:mm:ss";
	var from_format = arguments[2];

	if (null == _date || typeof _date === 'undefined' || _date == '') {
		return '';
	}
	var date = _date;
	if (typeof from_format == "undefined" || Libs.isBlank(from_format)) {
		var arrFormat = ["YYYY/MM/DD HH:mm:ss", "YYYY-MM-DD HH:mm:ss", "DD/MM/YYYY HH:mm:ss", "DD-MM-YYYY HH:mm:ss", "MM/DD/YYYY HH:mm:ss", "MM-DD-YYYY HH:mm:ss"];
		for (var i = 0; i < arrFormat.length; i++) {
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
};

/**
 * Làm tròn số sau dấu phẩy
 * @author thanh.bay 2018-09-27 11:24
 * @param  {string | float | int} value: giá trị muốn làm tròn
 * @param  {int} fixed=1 : làm tròn đến n số dựa vào giá trị fixed
 */
Libs.fixNumber = function (value) {
	var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

	if (typeof value === 'undefined' || value == null) return null;
	return parseFloat(Number.parseFloat(value).toFixed(fixed));
};
Libs.sum = function () {
	try {
		var total = 0;

		for (var _len = arguments.length, numbers = Array(_len), _key = 0; _key < _len; _key++) {
			numbers[_key] = arguments[_key];
		}

		for (var x = 0; x < numbers.length; x++) {
			total += numbers[x] * 1;
		}
		return total;
	} catch (ex) {
		return NaN;
	}
};
/**
* @description Làm tròn số
* @author Minh.Pham 2018-12-04
* @param number giá trị cần làm tròn
* @param decimal số thập phân
* @type cách làm tròn: -1 làm tròn xuống, 0 làm tòn tự nhiên, 1: làm tròn lên
 */
Libs.roundNumber = function (number) {
	var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	if (decimals == null) decimals = 0;
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
Libs.roundByFormat = function (number, format) {
	var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	return Libs.roundNumber(number, Libs.getDecimalsOfFomat(format), type);
};

/**
* @description Lấy số decimals(phần thập phân) của format
* @author Minh.Pham 2018-12-04
* @param format #,###.## 
 */
Libs.getDecimalsOfFomat = function (format) {
	var decimals = 0;
	if (!Libs.isBlank(format)) {
		try {
			var arr = format.split('.');
			if (arr.length >= 2) {
				decimals = arr[arr.length - 1].length;
			}
		} catch (ex) {}
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
		var f = function f(item, properties) {
			var merge = [];
			for (var key in properties) {
				var prop = properties[key];
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
		});
	} catch (error) {
		console.log("Libs.groupBy:", error);
		return [];
	}
};
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
	    hasProperty = typeof property !== 'undefined' && property != null && property != "";

	var _loop = function _loop(key) {
		var item = array[key],
		    find = list.find(function (i) {
			return hasProperty ? i[property] == item[property] : i == item;
		});
		if (typeof find === 'undefined') {
			list.push(item);
		}
	};

	for (var key in array) {
		_loop(key);
	}
	return list;
};
Libs.serialize = function (obj) {
	var str = [];
	for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	}return str.join("&");
};

Libs.bin2String = function (array) {
	var result = "";
	for (var i = 0; i < array.length; i++) {
		result += String.fromCharCode(parseInt(array[i], 2));
	}
	return result;
};
Libs.string2Bin = function (str) {
	var result = [];
	for (var i = 0; i < str.length; i++) {
		result.push(str.charCodeAt(i).toString(2));
	}
	return result;
};

Libs.bin2Zip = function (binArray, path, fileName) {
	try {
		if (fileName.indexOf('.zip') < 0) {
			fileName += ".zip";
		}
		var file_system = require('fs');
		var archiver = require('archiver');
		var output = file_system.createWriteStream(path + fileName);
		var archive = archiver('zip', {
			zlib: { level: 9 // Sets the compression level.
			} });
		return new Promise(function (resolve, reject) {
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
			archive.on('error', function (err) {
				return reject(err);
			});
			output.on('close', function () {
				return resolve(true);
			});
		});
		// output.on('close', function () {
		// 	// console.log(archive.pointer() + ' total bytes');
		// 	// console.log('archiver has been finalized and the output file descriptor has closed.');
		// });
		// archive.on('error', function(err){
		// 	throw err;
		// });
		// archive.pipe(output);
		archive.bulk([{ expand: true, cwd: 'source', src: ['**'], dest: 'source' }]);
		// archive.finalize();
	} catch (e) {
		console.log(e);
	}
};

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
			var value = Libs.isBlank(currentValue) ? 0 : currentValue * 1;
			return accumulator + value;
		} else {
			var _value = Libs.isBlank(currentValue[property]) ? 0 : currentValue[property] * 1;
			return accumulator + _value;
		}
	}, 0);
};

/**
 * Kiểm tra phần tử tồn tại trong mảng
 * @author LuyenNguyen 2019-06-11
 * @param  {String|int} value
 * @param  {Array} array
 */
Libs.isInArray = function (value, array) {
	return array.indexOf(value) > -1;
};
Libs.toUpperCase = function (str) {
	if (Libs.isBlank(str)) {
		return str;
	}
	return str.toUpperCase();
};

Libs.toLowerCase = function (str) {
	if (Libs.isBlank(str)) {
		return str;
	}
	return str.toLowerCase();
};

Libs.convertStr2DateV01 = function (date, format, _delimiter) {
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
	return dateItems[yearIndex] + '-' + month + '-' + dateItems[dayIndex];
};

Libs.convertStrToDateFullTime = function (date, format, _delimiter) {
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
	return dateItems[yearIndex] + '-' + month + '-' + dateItems[dayIndex] + " " + arrDate[1];
};

Libs.convertStr2YearMonth = function (date, format, _delimiter) {
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
	return dateItems[yearIndex] + '-' + month;
};

Libs.removeUnicode = function (str) {
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
};

Libs.decimalToErrorCode = function (decimal) {
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
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9MaWJzLmpzIl0sIm5hbWVzIjpbImRpZmYiLCJyZXF1aXJlIiwiZm9ybWF0TnVtIiwibG9nZ2VyIiwiRkxMb2dnZXIiLCJnZXRMb2dnZXIiLCJkYXRlIiwiTnVtYmVyVG9Xb3Jkc1ZOIiwiTnVtYmVyVG9Xb3JkcyIsIm1vbWVudCIsInJvdW5kVG8iLCJMaWJzIiwibW9kdWxlIiwiZXhwb3J0cyIsInRhYmxlQ29kZSIsInZhbHVlIiwiaWQiLCJnZW5lcmF0ZVN0clJhbmRvbSIsImxlbiIsImNoYXJTZXQiLCJyYW5kb21TdHJpbmciLCJpIiwicmFuZG9tUG96IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwibGVuZ3RoIiwic3Vic3RyaW5nIiwiU0hBMyIsInBsYWluVGV4dCIsIkNyeXB0b0xpYiIsImVuY29kZVBhc3NXb3JkIiwicGxhaW5UeHQiLCJzZWNyZXRfa2V5IiwiZW5jcnlwdFR4dCIsImVuY3J5cHQiLCJlIiwiZXJyb3IiLCJkZWNvZGVQYXNzV29yZCIsImNpcGhUeHQiLCJkZWNyeXB0VHh0IiwiZGVjcnlwdCIsInVwbG9hZFJlc2l6ZUltYWdlIiwic291cmNlIiwiZGVzdGluYXRpb25QYXRoIiwiZmlsZU5hbWUiLCJxdWFsaXR5IiwidyIsImgiLCJsYXN0RmlsZVBhdGhDaGFyYWN0ZXIiLCJzbGljZSIsImV4aXN0IiwiZnMiLCJzdGF0U3luYyIsImlzRGlyZWN0b3J5IiwibWtkaXJGb2xkZXIiLCJwYXRoIiwiSmltcCIsInJlYWQiLCJ0aGVuIiwibGVubmEiLCJ3cml0ZSIsImpvaW4iLCJyZXNpemUiLCJjYXRjaCIsImNvbnNvbGUiLCJlcnIiLCJ0YWthRW5jb2RlIiwidGV4dCIsImlzQmxhbmsiLCJjaGFycyIsInNwbGl0Iiwic3RyIiwiZmluZCIsInRha2FEZWNvZGUiLCJzdGFydCIsInB1c2giLCJzdWJzdHIiLCJpdGVtcyIsImZpZWxkIiwic2FmZVRyaW0iLCJ0cmltIiwidW5kZWZpbmVkIiwibG9nIiwid2Fsa1N5bmMiLCJkaXIiLCJmaWxlbGlzdCIsImZpbGVzIiwicmVhZGRpclN5bmMiLCJmb3JFYWNoIiwiZmlsZSIsInJldHVybkpzb25SZXN1bHQiLCJzdGF0dXMiLCJtZXNzIiwiZGF0YSIsInRvdGFsX3JvdyIsInJlc3VsdCIsImdlbmVyYXRlVG9rZW4iLCJhcnIiLCJqd3QiLCJEYXRlIiwibm93Iiwic2VjcmV0X3Rva2VuIiwidGltZW91dCIsInRva2VuIiwid2FpdCIsImZvciIsInNpZ24iLCJhbGdvcml0aG0iLCJkZWNvZGVUb2tlbiIsInBheWxvYWQiLCJ2ZXJpZnkiLCJpc1ZhbGlkSGVhZGVyIiwicmVxIiwicmVzIiwiaGVhZGVyIiwiaGVhZGVycyIsImJlYXJUb2tlbiIsImF1dGhvcml6YXRpb24iLCJiZWFydG9rZW5BcnIiLCJlbmQiLCJ1c2VyTG9naW5FIiwiYXNzaWduRGF0YSIsInRhYmxlRSIsInVzZXJfbmFtZSIsImlzX2luc2VydCIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJsaWJzIiwicGFyc2VJbnQiLCJnZXRTdWJkb21haW5OYW1lIiwic3ViZG9tYWlucyIsInN1YmRvbWFpbiIsImRvbWFpbl9uYW1lIiwiZG9tYWluIiwiaG9zdCIsInJlcGxhY2UiLCJjaGVja0V4aXN0ZWRDb21wYW55IiwiY29tcGFueV9pZCIsIkNvbXBhbnlNb2RlbCIsImNvbXBhbnlNb2RlbCIsImNoZWNrX2V4aXN0ZWQiLCJjaGVja0NvbXBhbnlJZEV4aXN0ZWQiLCJyZWFkRXhjZWwiLCJmaWxlUGF0aCIsInJlc3VsdFR5cGUiLCJ4bHN4Iiwid29ya2Jvb2siLCJyZWFkRmlsZSIsIm91dHB1dCIsInRvX2NzdiIsInRvX2Zvcm11bGFlIiwidG9fanNvbiIsInNoZWV0SW5kZXgiLCJTaGVldE5hbWVzIiwic2hlZXROYW1lIiwicm9hIiwidXRpbHMiLCJzaGVldF90b19yb3dfb2JqZWN0X2FycmF5IiwiU2hlZXRzIiwiY3N2Iiwic2hlZXRfdG9fY3N2IiwiZm9ybXVsYWUiLCJnZXRfZm9ybXVsYWUiLCJzYXZlQXNFeGNlbCIsImFsYXNxbCIsImRvd25sb2FkRXhjZWwiLCJ1dWlkIiwiY2FjaGVmaWxlcGF0aCIsIlJPT1RfUEFUSCIsInY0IiwiZG93bmxvYWQiLCJ1bmxpbmsiLCJjYXBpdGFsaXplIiwiY2FwaXRhbGl6ZUZpcnN0TGV0dGVyIiwic3RyaW5nIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJjaGVja0lzUGF0aCIsInBhdGhfc3RyaW5nIiwibHN0YXRTeW5jIiwiY2hlY2tGaWxlRXhpdHMiLCJpbmRleE9mIiwiaXNPYmplY3RFbXB0eSIsIm9iaiIsImhhc093blByb3BlcnR5IiwicHJvdG90eXBlIiwiY2FsbCIsImNvbnZlcnREYXRlVG9NaWxsaXNlY29uZHMiLCJmb3JtYXQiLCJmIiwiZ2V0VGltZSIsImNvbnZlcnRNaWxsaXNlY29uZHNUb0RhdGUiLCJ0aW1lIiwiY29udmVydE1pbGxpc2Vjb25kc1RvRGF0YUZvcm1hdCIsIm1pbGxpc2Vjb25kcyIsImlzU2hvd0hvdXIiLCJkYXRlT2JqIiwiZGF5IiwiZ2V0RGF0ZSIsIm1vbnRoIiwiZ2V0TW9udGgiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW51dGUiLCJnZXRNaW51dGVzIiwic2Vjb25kIiwiZ2V0U2Vjb25kcyIsImdlbmVyYXRlVG9rZW5DcnlwdG8iLCJiYXNlRGF0YSIsImJhc2U2NFR4dCIsImJhc2U2NEVuY3J5cHQiLCJKU09OIiwic3RyaW5naWZ5IiwiY29uZmlnIiwic2VydmVyIiwiZGVjb2RlVG9rZW5DcnlwdG8iLCJqc29uIiwiYmFzZTY0RGVjcnlwdCIsInBhcnNlIiwibWQ1IiwiQUVTRW5jcnlwdCIsInNlY3JldEtleSIsIkFFU0RlY3J5cHQiLCJjb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcCIsIm9iamVjdCIsInJlbW92ZU9iamVjdFBvc3RKc29uIiwicHJvdG9jb2wiLCJiYXNlNjRNaW1lVHlwZSIsImVuY29kZWQiLCJtaW1lIiwibWF0Y2giLCJ2YWwiLCJwYXR0ZXJuIiwicm91bmQiLCJpc05hTiIsImNvbW1hIiwiZGVjaW1hbCIsImFmdGVyRGVjaW1hbE51bSIsInJlZ2V4IiwiUmVnRXhwIiwibXlBcnJheSIsImluZGV4IiwiYWZ0ZXJEZWNpbWFsIiwiZXhlYyIsImxhc3RJbmRleE9mIiwib3B0cyIsInVwIiwiZG93biIsImlucHV0RGF0ZVRvREJEYXRlIiwiaW5wdXREYXRlIiwiZGl2aXNpb24iLCJkYXRlMlN0ciIsIl9kYXRlIiwiX2Zvcm1hdCIsInRvU3RyaW5nIiwicGFkU3RhcnQiLCJ0b0xvd2VyQ2FzZSIsIkRCRGF0ZVRvSW5wdXREYXRlIiwiREJEYXRlIiwibmV3RGF0ZSIsImlzVmFsaWQiLCJkYXRlUmV0dXJuIiwiQ2hlY2tEaWZmSnNvbiIsIml0ZW0iLCJEZWVwRGlmZkpzb24iLCJuZXdJdGVtIiwib2xkSXRlbSIsImRpZmZEYXRhIiwiT2JqRGlmZiIsIml0ZW1FIiwia2luZCIsImJlZm9yZSIsImxocyIsImFmdGVyIiwicmhzIiwiZGF0YV9yZXR1cm4iLCJpc0ludGVnZXIiLCJ0ZXN0IiwiZ2V0RGF5c09mTW9udGgiLCJkIiwiZ2V0Q3VycmVudFlZIiwiZ2V0Q3VycmVudFlZTU1ERCIsImdldEN1cnJlbnRERE1NWVlZWSIsImJ1aWxkUGF0aFZhbGlkYXRlTWVzc2FnZSIsIm1lc3NhZ2UiLCJ2YWxpZGF0ZSIsInZhbGlkYXRlQmlydGhEYXkiLCJjaGVja1llYXIiLCJtWWVhciIsImN1cnJlbnRZZWFyIiwiY2hlY2tNb250aFllYXIiLCJtTW9udGgiLCJjdXJyZW50RGF0ZSIsImNoZWNrRnVsbERhdGUiLCJtRGF5Iiwic3RyRGF0ZSIsInZhbGlkYXRlRGF0ZSIsIm1EYXRlIiwic2V0SG91cnMiLCJ2YWx1ZU9mIiwiY2hlY2siLCJ0eXBlIiwidlllYXIiLCJSRUdfREFURV9ETVkiLCJSRUdfREFURV9ZTUQiLCJkYXRlZm9ybWF0Iiwib3BlcmExIiwib3BlcmEyIiwibG9wZXJhMSIsImxvcGVyYTIiLCJwZGF0ZSIsImRkIiwibW0iLCJ5eSIsIkxpc3RvZkRheXMiLCJseWVhciIsImlzTnVtYmVyIiwiZ2V0Q3VycmVudE1pbGxpc2Vjb25kcyIsImdldEN1cnJlbnREYXRlRm9ybWF0IiwiZm9ybWF0U3RyaW5nIiwiZ3JvdXBCeVByb3BzIiwib2JqZWN0QXJyYXkiLCJwcm9wZXJ0eSIsInJlZHVjZSIsImFjYyIsImdldFZhbHVlc0FycmF5QnlQcm9wIiwiQXJyYXkiLCJpc0FycmF5IiwidmFsdWVzIiwic3RyaW5nQXNzaWduIiwiUkVHX0FTU0lHTl9WQVJJQkxFIiwiJDAiLCIkMSIsIlN0cmluZyIsImNhbGN1bGF0ZUFnZVN0cmluZyIsImRhdGVTdHJpbmciLCJhZ2UiLCJhcnJheUJpcnRoZGF5IiwieWVhclN0cmluZyIsIm1vbnRoU3RyaW5nIiwiZGF5U3RyaW5nIiwiYWdlU3RyaW5nIiwiY2FsY3VsYXRlQWdlIiwieWVhcnMiLCJtb250aHMiLCJkYXlzIiwidG9kYXkiLCJnZXRZZWFyIiwieWVhck5vdyIsIm1vbnRoTm93IiwiZGF0ZU5vdyIsInN0clNwbGl0IiwiZG9iIiwieWVhckRvYiIsIm1vbnRoRG9iIiwiZGF0ZURvYiIsInllYXJBZ2UiLCJtb250aEFnZSIsImRhdGVBZ2UiLCJidWlsZFBhdGllbnRJbmZvIiwicGF0aWVudEVuaXR5Iiwic2V4X2lkIiwic2V4Iiwic2V4X251bSIsIkNvbnN0YW50cyIsImdlbmRlciIsIm1hbGUiLCJpMThuIiwiX18iLCJmZW1hbGUiLCJ1bmtub3duIiwic2V4X25hbWUiLCJiaXJ0aGRheV9kYXkiLCJiaXJ0aGRheV9tb250aCIsImJpcnRoZGF5X3llYXIiLCJmaWx0ZXJBcnJheUJpcnRoZGF5IiwiZmlsdGVyIiwiYmlydGhkYXkiLCJyZWFsX2JpcnRoZGF5X2RheSIsInJlYWxfYmlydGhkYXlfbW9udGgiLCJyZWFsX2JpcnRoZGF5X3llYXIiLCJhcnJheVJlYWxCaXJ0aGRheSIsImZpbHRlckFycmF5UmVhbEJpcnRoZGF5IiwicmVhbF9iaXJ0aGRheSIsImZ1bGxfcmVhbF9iaXJ0aGRheSIsInJlYWxfYWdlIiwicGhvbmUiLCJidWlsZEFkZHJlc3NQYXRpZW50IiwiYWRkcmVzcyIsIndhcmRfbmFtZSIsImRpc3RyaWN0X25hbWUiLCJjaXR5X25hbWUiLCJjb3VudHJ5X25hbWUiLCJhZGRyZXNzMSIsIndhcmRfbmFtZTEiLCJkaXN0cmljdF9uYW1lMSIsImNpdHlfbmFtZTEiLCJjb3VudHJ5X25hbWUxIiwibW9uZXl0b1N0cmluZyIsInRvdGFsIiwibGFuZyIsInNNb25leSIsImRlZmF1bHQiLCJ0b1dvcmRzIiwic0JlZ2luQ2hhciIsInBhZExlZnQiLCJudW1iZXIiLCJkaWdpdCIsImNvbnZlcnREYXRlVGltZVRvVk5Xb3JkIiwiaG91cnMiLCJtaW51dGVzIiwiY29udmVydERhdGVUb1ZOV29yZCIsImNvbnZlcnREYXRlVG9WTldvcmRZWVlZTU1ERCIsImNvbnZlcnRBbGxGb3JtYXREYXRlVG9TdHIiLCJpbmNsdWRlcyIsIl9pc1ZhbGlkIiwiY29udmVydERhdGVEQiIsImNvbnZlcnRTUUxEYXRlVG9TdHIiLCJjb252ZXJ0RGF0ZVRvU3RyIiwiY2FsbFdpdGhQcm9taXNlIiwiZnVuYyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXgiLCJnZXRGaWxlTmFtZSIsImZpbGVEaXIiLCJuZXdGaWxlTmFtZSIsImxhc3RGaWxlRGlyQ2hhcmFjdGVyIiwiY3VyRmlsZVBhdGgiLCJleGlzdHNTeW5jIiwiZmlsZU5hbWVTcGl0IiwiZXh0IiwiY2hlY2tGaWxlTmFtZSIsInBhdGhzIiwiZnVsbFBhdGgiLCJmb2xkZXIiLCJta2RpclN5bmMiLCJ1cGxvYWRGaWxlIiwiY2FsbGJhY2siLCJmaWxlVXBsb2FkIiwid3JpdGVGaWxlIiwicmVtb3ZlRmlsZSIsImxhc0ZpbGVQYXRoQ2hhcmFjdGVyIiwidW5saW5rU3luYyIsImNoZWNrQml0T25PZmYiLCJuQnl0ZSIsImJpdEluZGV4IiwicG93IiwiaXNBcnJheURhdGEiLCJjb252ZXJ0QWxsRm9ybWF0RGF0ZSIsImZyb21fZm9ybWF0IiwidG9fZm9ybWF0IiwiY29udmVydFN0cjJEYXRlVjAyIiwiX2RlbGltaXRlciIsImZvcm1hdExvd2VyQ2FzZSIsImZvcm1hdEl0ZW1zIiwiZGF0ZUl0ZW1zIiwibW9udGhJbmRleCIsImRheUluZGV4IiwieWVhckluZGV4IiwiYWRkRGF5cyIsInNldERhdGUiLCJnZXREYXRlcyIsInN0YXJ0RGF0ZSIsInN0b3BEYXRlIiwiZGF0ZUFycmF5IiwidG9EYXRlIiwiZ2V0TW9udGhzIiwibW9udGhBcnJheSIsImVuZERhdGUiLCJjdXJyZW50TW9udGgiLCJzZXRNb250aCIsImdldFllYXJzIiwieWVhckFycmF5IiwidG9ZZWFyIiwiZGF0ZUZvcm1hdCIsImFyckZvcm1hdCIsImZpeE51bWJlciIsImZpeGVkIiwicGFyc2VGbG9hdCIsIk51bWJlciIsInRvRml4ZWQiLCJzdW0iLCJudW1iZXJzIiwieCIsIk5hTiIsInJvdW5kTnVtYmVyIiwiZGVjaW1hbHMiLCJyb3VuZEJ5Rm9ybWF0IiwiZ2V0RGVjaW1hbHNPZkZvbWF0IiwiZ3JvdXBCeSIsImFycmF5IiwicHJvcGVydGllcyIsIm1lcmdlIiwicHJvcCIsImdyb3VwcyIsIm8iLCJncm91cCIsIm1hcCIsInVuaXF1ZSIsImxpc3QiLCJoYXNQcm9wZXJ0eSIsInNlcmlhbGl6ZSIsInAiLCJlbmNvZGVVUklDb21wb25lbnQiLCJiaW4yU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwic3RyaW5nMkJpbiIsImNoYXJDb2RlQXQiLCJiaW4yWmlwIiwiYmluQXJyYXkiLCJmaWxlX3N5c3RlbSIsImFyY2hpdmVyIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJhcmNoaXZlIiwiemxpYiIsImxldmVsIiwicGlwZSIsImFwcGVuZCIsIm5hbWUiLCJmaW5hbGl6ZSIsIm9uIiwiYnVsayIsImV4cGFuZCIsImN3ZCIsInNyYyIsImRlc3QiLCJzdW1CeVByb3AiLCJhY2N1bXVsYXRvciIsImN1cnJlbnRWYWx1ZSIsImlzSW5BcnJheSIsImNvbnZlcnRTdHIyRGF0ZVYwMSIsImNvbnZlcnRTdHJUb0RhdGVGdWxsVGltZSIsImFyckRhdGUiLCJjb252ZXJ0U3RyMlllYXJNb250aCIsInJlbW92ZVVuaWNvZGUiLCJkZWNpbWFsVG9FcnJvckNvZGUiLCJhcnJFcnJvckNvZGUiLCJkZWNpbWFsU3RyaW5nIiwiZGVjaW1hbEFyciIsImFzc2lnbiIsImJpdDAiLCJlcnJvcl9jb2RlIiwiYml0MSIsImJpdDIiLCJiaXQzIiwiYml0NCIsImJpdDUiLCJiaXQ2IiwiYml0NyIsImJpdDgiLCJiaXQ5IiwiYml0MTAiLCJiaXQxMSIsImJpdDEyIiwiYml0MTMiLCJiaXQxNCIsImJpdDE1IiwiYml0MTYiLCJiaXQxNyIsImJpdDE4IiwiYml0MTkiLCJiaXQyMCIsImJpdDIxIiwiYml0MjIiLCJiaXQyMyIsImJpdDI0IiwiYml0MjUiLCJiaXQyNiIsImJpdDI3IiwiYml0MjgiLCJiaXQyOSIsImJpdDMwIiwiYml0MzEiXSwibWFwcGluZ3MiOiI7Ozs7QUFVQTs7Ozs7O0FBUkEsSUFBSUEsT0FBT0MsUUFBUSxXQUFSLEVBQXFCRCxJQUFoQztBQUNBLElBQUlFLFlBQVlELFFBQVEsZUFBUixDQUFoQjtBQUNBLElBQUlFLFNBQVNDLFNBQVNDLFNBQVQsQ0FBbUIsUUFBbkIsQ0FBYjtBQUNBLElBQUlDLE9BQU9MLFFBQVEsZUFBUixDQUFYO0FBQ0EsSUFBSU0sa0JBQWtCTixRQUFRLGdCQUFSLENBQXRCO0FBQ0EsSUFBSU8sZ0JBQWdCUCxRQUFRLGlCQUFSLENBQXBCO0FBQ0EsSUFBTVEsU0FBU1IsUUFBUSxRQUFSLENBQWY7QUFDQSxJQUFNUyxVQUFVVCxRQUFRLFVBQVIsQ0FBaEI7OztBQUdBLElBQUlVLE9BQU8sU0FBUEEsSUFBTyxHQUFZLENBQ3RCLENBREQ7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQkYsSUFBakI7QUFDQSxJQUFJRyxZQUFZLENBQ2YsRUFBRUMsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBRGUsRUFDWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFEWixFQUN1QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFEdkMsRUFDa0UsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBRGxFLEVBRWYsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBRmUsRUFFWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFGWixFQUV1QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFGdkMsRUFFa0UsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBRmxFLEVBR2YsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBSGUsRUFHWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFIWixFQUd1QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFIdkMsRUFHa0UsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBSGxFLEVBSWYsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBSmUsRUFJWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFKWixFQUl1QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFKdkMsRUFJa0UsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBSmxFLEVBS2YsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBTGUsRUFLWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFMWixFQUt1QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFMdkMsRUFLa0UsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBTGxFLEVBTWYsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBTmUsRUFNWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFOWixFQU11QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFOdkMsRUFNa0UsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBTmxFLEVBT2YsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBUGUsRUFPWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFQWixFQU91QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFQdkMsRUFPa0UsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBUGxFLEVBUWYsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBUmUsRUFRWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFSWixFQVF1QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFSdkMsRUFRa0UsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBUmxFLEVBU2YsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBVGUsRUFTWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFUWixFQVN1QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFUdkMsRUFTa0UsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBVGxFLEVBVWYsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBVmUsRUFVWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFWWixFQVV1QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFWdkMsRUFVa0UsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBVmxFLEVBV2YsRUFBRUQsT0FBTyxLQUFULEVBQWdCQyxJQUFJLEdBQXBCLEVBWGUsRUFXWSxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFYWixFQVd1QyxFQUFFRCxPQUFPLEtBQVQsRUFBZ0JDLElBQUksR0FBcEIsRUFYdkMsRUFX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LEVBQWQsRUFBbEI7QUFDQTtBQUNELEtBQUkrQixRQUFRbEMsV0FBV0EsV0FBV3RnQixNQUFYLEdBQW9CLEVBQS9CLENBQVo7QUFDQSxLQUFJLENBQUNmLEtBQUswRCxPQUFMLENBQWE2ZixLQUFiLENBQUQsSUFBd0JoYyxTQUFTZ2MsS0FBVCxNQUFvQixDQUFoRCxFQUFtRDtBQUNsRHBDLGVBQWFsZCxJQUFiLENBQWtCLEVBQUV1ZCxZQUFZLEVBQWQsRUFBbEI7QUFDQTs7QUFFRCxRQUFPTCxZQUFQO0FBQ0EsQ0EzSUQiLCJmaWxlIjoiTGlicy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG52YXIgZGlmZiA9IHJlcXVpcmUoJ2RlZXAtZGlmZicpLmRpZmY7XG52YXIgZm9ybWF0TnVtID0gcmVxdWlyZSgnZm9ybWF0LW51bWJlcicpO1xudmFyIGxvZ2dlciA9IEZMTG9nZ2VyLmdldExvZ2dlcihcIkxpYkxvZ1wiKTtcbnZhciBkYXRlID0gcmVxdWlyZSgnZGF0ZS1hbmQtdGltZScpO1xudmFyIE51bWJlclRvV29yZHNWTiA9IHJlcXVpcmUoJ3JlYWQtdm4tbnVtYmVyJyk7XG52YXIgTnVtYmVyVG9Xb3JkcyA9IHJlcXVpcmUoJ251bWJlci10by13b3JkcycpXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKFwibW9tZW50XCIpO1xuY29uc3Qgcm91bmRUbyA9IHJlcXVpcmUoJ3JvdW5kLXRvJyk7XG5pbXBvcnQgSmltcCBmcm9tICdqaW1wJztcblxudmFyIExpYnMgPSBmdW5jdGlvbiAoKSB7XG59XG5tb2R1bGUuZXhwb3J0cyA9IExpYnM7XG52YXIgdGFibGVDb2RlID0gW1xuXHR7IHZhbHVlOiAnMlpTJywgaWQ6ICchJyB9LCB7IHZhbHVlOiAnWDNwJywgaWQ6ICfigJwnIH0sIHsgdmFsdWU6ICdpbUUnLCBpZDogJyMnIH0sIHsgdmFsdWU6ICdFVVQnLCBpZDogJyQnIH0sXG5cdHsgdmFsdWU6ICdYU2gnLCBpZDogJyUnIH0sIHsgdmFsdWU6ICdFNVAnLCBpZDogJyYnIH0sIHsgdmFsdWU6ICdXRWonLCBpZDogJ+KAmCcgfSwgeyB2YWx1ZTogJzQ1UScsIGlkOiAnKCcgfSxcblx0eyB2YWx1ZTogJ2lJMScsIGlkOiAnKScgfSwgeyB2YWx1ZTogJ3Q2eCcsIGlkOiAnKicgfSwgeyB2YWx1ZTogJ2hkOScsIGlkOiAnKycgfSwgeyB2YWx1ZTogJ2ppSicsIGlkOiAnLCcgfSxcblx0eyB2YWx1ZTogJ1VQdycsIGlkOiAnLScgfSwgeyB2YWx1ZTogJ0F4QycsIGlkOiAnLicgfSwgeyB2YWx1ZTogJ1l3YicsIGlkOiAnLycgfSwgeyB2YWx1ZTogJ2FZOCcsIGlkOiAnMCcgfSxcblx0eyB2YWx1ZTogJ21MUicsIGlkOiAnMScgfSwgeyB2YWx1ZTogJ3FhZScsIGlkOiAnMicgfSwgeyB2YWx1ZTogJ1hwZycsIGlkOiAnMycgfSwgeyB2YWx1ZTogJ29TMycsIGlkOiAnNCcgfSxcblx0eyB2YWx1ZTogJ2RUTicsIGlkOiAnNScgfSwgeyB2YWx1ZTogJ2pTQycsIGlkOiAnNicgfSwgeyB2YWx1ZTogJ0RmeicsIGlkOiAnNycgfSwgeyB2YWx1ZTogJ1N6MScsIGlkOiAnOCcgfSxcblx0eyB2YWx1ZTogJ1F1MScsIGlkOiAnOScgfSwgeyB2YWx1ZTogJ2k1RScsIGlkOiAnOicgfSwgeyB2YWx1ZTogJ0lRNicsIGlkOiAnOycgfSwgeyB2YWx1ZTogJ1FubicsIGlkOiAnPCcgfSxcblx0eyB2YWx1ZTogJ1pQQScsIGlkOiAnPScgfSwgeyB2YWx1ZTogJ045eCcsIGlkOiAnPicgfSwgeyB2YWx1ZTogJ29pSScsIGlkOiAnPycgfSwgeyB2YWx1ZTogJ3lVMycsIGlkOiAnQCcgfSxcblx0eyB2YWx1ZTogJzQ2bycsIGlkOiAnQScgfSwgeyB2YWx1ZTogJzduRScsIGlkOiAnQicgfSwgeyB2YWx1ZTogJ3d1UScsIGlkOiAnQycgfSwgeyB2YWx1ZTogJ08xTycsIGlkOiAnRCcgfSxcblx0eyB2YWx1ZTogJ1NLeScsIGlkOiAnRScgfSwgeyB2YWx1ZTogJ3IxSCcsIGlkOiAnRicgfSwgeyB2YWx1ZTogJ2FVVycsIGlkOiAnRycgfSwgeyB2YWx1ZTogJ1RldycsIGlkOiAnSCcgfSxcblx0eyB2YWx1ZTogJ2NoaCcsIGlkOiAnSScgfSwgeyB2YWx1ZTogJzdGQScsIGlkOiAnSicgfSwgeyB2YWx1ZTogJ2VrSycsIGlkOiAnSycgfSwgeyB2YWx1ZTogJ0V3cCcsIGlkOiAnTCcgfSxcblx0eyB2YWx1ZTogJ094YScsIGlkOiAnTScgfSwgeyB2YWx1ZTogJ1Q2ZycsIGlkOiAnTicgfSwgeyB2YWx1ZTogJ3hZeCcsIGlkOiAnTycgfSwgeyB2YWx1ZTogJ2dieicsIGlkOiAnUCcgfSxcblx0eyB2YWx1ZTogJ2Q0aCcsIGlkOiAnUScgfSwgeyB2YWx1ZTogJzFPdycsIGlkOiAnUicgfSwgeyB2YWx1ZTogJ0Z3NicsIGlkOiAnUycgfSwgeyB2YWx1ZTogJ21vcicsIGlkOiAnVCcgfSxcblx0eyB2YWx1ZTogJ05EQycsIGlkOiAnVScgfSwgeyB2YWx1ZTogJzdwbScsIGlkOiAnVicgfSwgeyB2YWx1ZTogJ1JuNCcsIGlkOiAnVycgfSwgeyB2YWx1ZTogJ1JWdScsIGlkOiAnWCcgfSxcblx0eyB2YWx1ZTogJ2RVVycsIGlkOiAnWScgfSwgeyB2YWx1ZTogJ2ljOCcsIGlkOiAnWicgfSwgeyB2YWx1ZTogJ2FSbScsIGlkOiAnWycgfSwgeyB2YWx1ZTogJ3BvNycsIGlkOiBcIlxcXFxcIiB9LFxuXHR7IHZhbHVlOiAndFZBJywgaWQ6ICddJyB9LCB7IHZhbHVlOiAnQzVhJywgaWQ6ICdeJyB9LCB7IHZhbHVlOiAnRzBtJywgaWQ6ICdfJyB9LCB7IHZhbHVlOiAnV0hCJywgaWQ6ICdgJyB9LFxuXHR7IHZhbHVlOiAnUDkxJywgaWQ6ICdhJyB9LCB7IHZhbHVlOiAnY0RmJywgaWQ6ICdiJyB9LCB7IHZhbHVlOiAnNVpwJywgaWQ6ICdjJyB9LCB7IHZhbHVlOiAncFg1JywgaWQ6ICdkJyB9LFxuXHR7IHZhbHVlOiAnYmVHJywgaWQ6ICdlJyB9LCB7IHZhbHVlOiAnc2dkJywgaWQ6ICdmJyB9LCB7IHZhbHVlOiAnMkRsJywgaWQ6ICdnJyB9LCB7IHZhbHVlOiAnWWpIJywgaWQ6ICdoJyB9LFxuXHR7IHZhbHVlOiAnU1FCJywgaWQ6ICdpJyB9LCB7IHZhbHVlOiAnakpFJywgaWQ6ICdqJyB9LCB7IHZhbHVlOiAnR3R3JywgaWQ6ICdrJyB9LCB7IHZhbHVlOiAnSnNLJywgaWQ6ICdsJyB9LFxuXHR7IHZhbHVlOiAncWZ2JywgaWQ6ICdtJyB9LCB7IHZhbHVlOiAnNXR5JywgaWQ6ICduJyB9LCB7IHZhbHVlOiAnQlNtJywgaWQ6ICdvJyB9LCB7IHZhbHVlOiAnRmJkJywgaWQ6ICdwJyB9LFxuXHR7IHZhbHVlOiAneE83JywgaWQ6ICdxJyB9LCB7IHZhbHVlOiAnVzVSJywgaWQ6ICdyJyB9LCB7IHZhbHVlOiAndWdoJywgaWQ6ICdzJyB9LCB7IHZhbHVlOiAnbmJzJywgaWQ6ICd0JyB9LFxuXHR7IHZhbHVlOiAnbWdsJywgaWQ6ICd1JyB9LCB7IHZhbHVlOiAnYXFMJywgaWQ6ICd2JyB9LCB7IHZhbHVlOiAnUUpOJywgaWQ6ICd3JyB9LCB7IHZhbHVlOiAnWDlkJywgaWQ6ICd4JyB9LFxuXHR7IHZhbHVlOiAnbElCJywgaWQ6ICd5JyB9LCB7IHZhbHVlOiAnQ3NtJywgaWQ6ICd6JyB9LCB7IHZhbHVlOiAndVE4JywgaWQ6ICcnIH0sIHsgdmFsdWU6ICdFVzcnLCBpZDogJ3wnIH0sXG5cdHsgdmFsdWU6ICdwUDknLCBpZDogJycgfSwgeyB2YWx1ZTogJzVyMycsIGlkOiAnficgfSwgeyB2YWx1ZTogJ05xMCcsIGlkOiAnICcgfVxuXTtcblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSByYW5kb20gc3RyaW5nXG4gKiBAYXV0aG9yOiBMb25nLlBoYW1cbiAqIEByZXR1cm4gc3RyXG4gKi9cbkxpYnMuZ2VuZXJhdGVTdHJSYW5kb20gPSBmdW5jdGlvbiAobGVuLCBjaGFyU2V0KSB7XG5cdGNoYXJTZXQgPSBjaGFyU2V0IHx8ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSFAIyQlXiYqPyc7XG5cdHZhciByYW5kb21TdHJpbmcgPSAnJztcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdHZhciByYW5kb21Qb3ogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0Lmxlbmd0aCk7XG5cdFx0cmFuZG9tU3RyaW5nICs9IGNoYXJTZXQuc3Vic3RyaW5nKHJhbmRvbVBveiwgcmFuZG9tUG96ICsgMSk7XG5cdH1cblx0cmV0dXJuIHJhbmRvbVN0cmluZztcbn1cblxuXG5MaWJzLlNIQTMgPSBmdW5jdGlvbiAocGxhaW5UZXh0KSB7XG5cdGlmICh0eXBlb2YgcGxhaW5UZXh0ID09PSAndW5kZWZpbmVkJykge1xuXHRcdHJldHVybiBwbGFpblRleHQ7XG5cdH1cblx0dmFyIENyeXB0b0xpYiA9IHJlcXVpcmUoJy4vQ3J5cHRvLmpzJyk7XG5cdHJldHVybiBDcnlwdG9MaWIuU0hBMyhwbGFpblRleHQpO1xufVxuXG5cbkxpYnMuZW5jb2RlUGFzc1dvcmQgPSBmdW5jdGlvbiAocGxhaW5UeHQsIHNlY3JldF9rZXkpIHtcblx0dHJ5IHtcblx0XHR2YXIgQ3J5cHRvTGliID0gcmVxdWlyZSgnLi9DcnlwdG8uanMnKTtcblx0XHQvLyB2YXIgdG9rZW5QYXJhbSA9IGNvbmZpZy5zZXJ2ZXIudG9rZW5fcGFyYW07XG5cdFx0Ly8gdmFyIG1kNVBhc3N3b3JkID0gTGlicy5tZDUocGxhaW5UeHQpO1xuXHRcdHZhciBlbmNyeXB0VHh0ID0gQ3J5cHRvTGliLmVuY3J5cHQocGxhaW5UeHQsIHNlY3JldF9rZXkpO1xuXHRcdHJldHVybiBlbmNyeXB0VHh0O1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0bG9nZ2VyLmVycm9yKGUpO1xuXHR9XG59XG5cbkxpYnMuZGVjb2RlUGFzc1dvcmQgPSBmdW5jdGlvbiAoY2lwaFR4dCwgc2VjcmV0X2tleSkge1xuXHR0cnkge1xuXHRcdHZhciBDcnlwdG9MaWIgPSByZXF1aXJlKCcuL0NyeXB0by5qcycpO1xuXHRcdHZhciBkZWNyeXB0VHh0ID0gQ3J5cHRvTGliLmRlY3J5cHQoY2lwaFR4dCwgc2VjcmV0X2tleSk7XG5cdFx0cmV0dXJuIGRlY3J5cHRUeHQ7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRsb2dnZXIuZXJyb3IoZSk7XG5cdH1cbn1cblxuXG5cblxuTGlicy51cGxvYWRSZXNpemVJbWFnZSA9IGFzeW5jIGZ1bmN0aW9uIChzb3VyY2UsIGRlc3RpbmF0aW9uUGF0aCwgZmlsZU5hbWUsIHF1YWxpdHkgPSAxMDAsIHcgPSAwLCBoID0gMCkge1xuXHRpZiAoIXNvdXJjZSB8fCAhZGVzdGluYXRpb25QYXRoIHx8ICFmaWxlTmFtZSkgcmV0dXJuO1xuXG5cdHZhciBsYXN0RmlsZVBhdGhDaGFyYWN0ZXIgPSBkZXN0aW5hdGlvblBhdGguc2xpY2UoLTEpO1xuXHRpZiAobGFzdEZpbGVQYXRoQ2hhcmFjdGVyID09PSAnLycpIHtcblx0XHRkZXN0aW5hdGlvblBhdGggPSBkZXN0aW5hdGlvblBhdGguc3Vic3RyaW5nKDAsIGRlc3RpbmF0aW9uUGF0aC5sZW5ndGggLSAxKTtcblx0fVxuXG5cdC8vVOG6oW8gdGjGsCBt4bulYyB1cGxvYWQgbuG6v3UgY2jGsGEgdOG7k24gdOG6oWlcblx0bGV0IGV4aXN0ID0gdHJ1ZTtcblx0dHJ5IHtcblx0XHRleGlzdCA9IGZzLnN0YXRTeW5jKGRlc3RpbmF0aW9uUGF0aCkuaXNEaXJlY3RvcnkoKVxuXHR9IGNhdGNoIChlKSB7XG5cdFx0ZXhpc3QgPSBmYWxzZTtcblx0fVxuXHRpZiAoIWV4aXN0KSB7XG5cdFx0YXdhaXQgTGlicy5ta2RpckZvbGRlcihkZXN0aW5hdGlvblBhdGgpO1xuXHR9XG5cdHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXHRKaW1wLnJlYWQoc291cmNlKVxuXHRcdC50aGVuKGxlbm5hID0+IHtcblx0XHRcdGlmICh3ID09IDAgJiYgaCA9PSAwKSB7XG5cdFx0XHRcdHJldHVybiBsZW5uYVxuXHRcdFx0XHRcdC5xdWFsaXR5KHF1YWxpdHkpXG5cdFx0XHRcdFx0LndyaXRlKHBhdGguam9pbihkZXN0aW5hdGlvblBhdGgsIGZpbGVOYW1lKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gbGVubmFcblx0XHRcdFx0XHQucmVzaXplKHcsIGgpXG5cdFx0XHRcdFx0LnF1YWxpdHkocXVhbGl0eSlcblx0XHRcdFx0XHQud3JpdGUocGF0aC5qb2luKGRlc3RpbmF0aW9uUGF0aCwgZmlsZU5hbWUpKTtcblx0XHRcdH1cblxuXHRcdH0pXG5cdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0fSk7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuLyoqXG4gKiBUYWthIEVuY29kZVxuICogQHBhcmFtIHBsYWludGV4dCBcbiAqIEByZXR1cm4gc3RyaW5nXG4gKi9cblxuTGlicy50YWthRW5jb2RlID0gZnVuY3Rpb24gKHRleHQpIHtcblx0aWYgKExpYnMuaXNCbGFuayh0ZXh0KSkge1xuXHRcdHJldHVybiB0ZXh0O1xuXHR9XG5cdHZhciBjaGFycyA9IHRleHQuc3BsaXQoJycpO1xuXHRsZXQgc3RyID0gJyc7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZmluZCA9IExpYnMuZmluZCh0YWJsZUNvZGUsICdpZCcsIGNoYXJzW2ldKTtcblx0XHRpZiAoZmluZCkge1xuXHRcdFx0c3RyICs9IGZpbmQudmFsdWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBzdHI7XG59XG5cblxuLyoqXG4gKiBUYWthIERlY29kZVxuICogQHBhcmFtIHBsYWludGV4dCBcbiAqIEByZXR1cm4gc3RyaW5nXG4gKi9cblxuTGlicy50YWthRGVjb2RlID0gZnVuY3Rpb24gKHRleHQpIHtcblx0aWYgKExpYnMuaXNCbGFuayh0ZXh0KSkge1xuXHRcdHJldHVybiB0ZXh0O1xuXHR9XG5cdGxldCBjaGFycyA9IFtdLCBzdHIgPSAnJztcblx0dmFyIHN0YXJ0ID0gMDtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aCAvIDM7IGkrKykge1xuXHRcdGNoYXJzLnB1c2godGV4dC5zdWJzdHIoc3RhcnQsIDMpKTtcblx0XHRzdGFydCArPSAzO1xuXHR9XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGFycy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBmaW5kID0gTGlicy5maW5kKHRhYmxlQ29kZSwgJ3ZhbHVlJywgY2hhcnNbaV0pO1xuXHRcdGlmIChmaW5kKSB7XG5cdFx0XHRzdHIgKz0gZmluZC5pZDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBGaW5kIG9iamVjdHMgaW4gYXJyYXlzIGJ5IHZhbHVlIGFuZCBmaWVsZFxuICogQHBhcmFtIGl0ZW1zXG4gKiBAcGFyYW0gZmllbGRcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnNcbiAqL1xuTGlicy5maW5kID0gZnVuY3Rpb24gKGl0ZW1zLCBmaWVsZCwgdmFsdWUpIHtcblx0aWYgKCFpdGVtcylcblx0XHRyZXR1cm4gbnVsbDtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuXHRcdGlmICh2YWx1ZSA9PSBpdGVtc1tpXVtmaWVsZF0pIHtcblx0XHRcdHJldHVybiBpdGVtc1tpXTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIHRyaW0gc3RyaW5nXG4gKiBAcGFyYW0gc3RyXG4gKiBAcmV0dXJuc1xuICovXG5MaWJzLnNhZmVUcmltID0gZnVuY3Rpb24gKHN0cikge1xuXHR0cnkge1xuXHRcdHJldHVybiAodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpID8gc3RyLnRyaW0oKSA6IHN0cjtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG59O1xuLyoqXG4gKiBjaGVjayBibGFuayBvYmplY3Qgb3Igc3RyaW5nXG4gKiBAcGFyYW0gc3RyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuTGlicy5pc0JsYW5rID0gZnVuY3Rpb24gKHN0cikge1xuXHR0cnkge1xuXHRcdGlmICh0eXBlb2Ygc3RyID09PSB1bmRlZmluZWQgfHwgc3RyID09IG51bGwgfHwgTGlicy5zYWZlVHJpbShzdHIpID09PSBcIlwiKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS5sb2coZSlcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG4vKipcbiAqIHJlYWQgYWxsIGZpbGUgaW4gZm9sZGVyIGFuZCBzdWIgZm9sZGVyXG4gKi9cbkxpYnMud2Fsa1N5bmMgPSBmdW5jdGlvbiAoZGlyLCBmaWxlbGlzdCkge1xuXHR2YXIgZnMgPSBmcyB8fCByZXF1aXJlKCdmcycpLFxuXHRcdGZpbGVzID0gZnMucmVhZGRpclN5bmMoZGlyLCAndXRmOCcpO1xuXHRmaWxlbGlzdCA9IGZpbGVsaXN0IHx8IFtdO1xuXHRmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlKSB7XG5cdFx0aWYgKGZzLnN0YXRTeW5jKGRpciArICcvJyArIGZpbGUpLmlzRGlyZWN0b3J5KCkpIHtcblx0XHRcdGZpbGVsaXN0ID0gd2Fsa1N5bmMoZGlyICsgJy8nICsgZmlsZSwgZmlsZWxpc3QpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGZpbGVsaXN0LnB1c2goZGlyICsgJy8nICsgZmlsZSk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGZpbGVsaXN0O1xufTtcbi8qKlxuICogc3RyIHRvIG1kNVxuICogQHBhcmFtIHN0clxuICogQHJldHVybnNcbiAqL1xuLy8gTGlicy5tZDU9ZnVuY3Rpb24oc3RyKXtcbi8vIFx0dmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuLy8gXHR2YXIgbWQ1PWNyeXB0by5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoc3RyKS5kaWdlc3QoXCJoZXhcIik7XG4vLyBcdHJldHVybiBtZDU7XG4vLyB9XG5cbi8qKlxuICogcmV0dXJuIGpzb24gcmVzdWx0XG4gKiBAcGFyYW0gdW5rbm93biAkc3RhdHVzXG4gKiBAcGFyYW0gdW5rbm93biAkbWVzc1xuICogQHBhcmFtIHVua25vd24gJGRhdGFcbiAqL1xuTGlicy5yZXR1cm5Kc29uUmVzdWx0ID0gZnVuY3Rpb24gKHN0YXR1cywgbWVzcywgZGF0YSwgdG90YWxfcm93KSB7XG5cdHZhciByZXN1bHQgPSB7fTtcblx0cmVzdWx0LnN0YXR1cyA9IHN0YXR1cztcblx0cmVzdWx0Lm1lc3MgPSBtZXNzID8gbWVzcyA6IFwiXCI7XG5cdHJlc3VsdC5kYXRhID0gZGF0YSA/IGRhdGEgOiBcIlwiO1xuXHRyZXN1bHQudG90YWxfcm93ID0gdG90YWxfcm93ID8gdG90YWxfcm93IDogMDtcblx0cmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogY3JlYXRlIEpXVCB0b2tlblxuICogQHBhcmFtIGFycmF5XG4gKiBAcmV0dXJucyBzdHJpbmcgdG9rZW5cbiAqL1xuTGlicy5nZW5lcmF0ZVRva2VuID0gZnVuY3Rpb24gKGFycikge1xuXHR0cnkge1xuXHRcdC8vaW5pIEpXVCB0b2tlblxuXHRcdHZhciBqd3QgPSByZXF1aXJlKCdqc29ud2VidG9rZW4nKTtcblx0XHRhcnJbJ2lhdCddID0gTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCk7XG5cdFx0YXJyWydleHAnXSA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICsgc2VjcmV0X3Rva2VuLnRpbWVvdXQgKiA2MDtcblx0XHRhcnJbJ2V4cGlyZXNJbiddID0gc2VjcmV0X3Rva2VuLnRpbWVvdXQgKiA2MDtcblx0XHQvLyBzaWduIGFzeW5jaHJvbm91c2x5XG5cdFx0dmFyIHRva2VuID0gd2FpdC5mb3Ioand0LnNpZ24sIGFyciwgc2VjcmV0X3Rva2VuLnNlY3JldF9rZXksIHsgYWxnb3JpdGhtOiAnSFM1MTInIH0pO1xuXHRcdHJldHVybiB0b2tlbjtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuLyoqXG4gKiBkZWNvZGUgSldUIHRva2VuXG4gKiBAcGFyYW0gdG9rZW4gc3RyaW5nXG4gKiBAcmV0dXJucyB1c2VyTG9naW5FIGlmIHRva2VuIGlzIHZhbGlkIGVsc2UgZmFsc2VcbiAqL1xuTGlicy5kZWNvZGVUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbikge1xuXHR0cnkge1xuXHRcdC8vaW5pIEpXVCB0b2tlblxuXHRcdHZhciBqd3QgPSByZXF1aXJlKCdqc29ud2VidG9rZW4nKTtcblx0XHQvLyB2ZXJpZnkgYXN5bmNocm9ub3VzbHlcblxuXHRcdHZhciBwYXlsb2FkID0gd2FpdC5mb3Ioand0LnZlcmlmeSwgdG9rZW4sIHNlY3JldF90b2tlbi5zZWNyZXRfa2V5LCB7IGFsZ29yaXRobTogJ0hTNTEyJyB9KTtcblx0XHRyZXR1cm4gcGF5bG9hZDtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG4vKipcbiAqIGNoZWNrIHVzZXIgbG9naW4gb3Igbm90XG4gQHJldHVybiBmYWxzZSBpZiBub3QgbG9naW4sIHVzZXJMb2dpbiBpZiBpcyBsb2dlZGluXG4gKi9cbkxpYnMuaXNWYWxpZEhlYWRlciA9IGZ1bmN0aW9uIChyZXEsIHJlcykge1xuXHR0cnkge1xuXHRcdC8vY2hlY2sgbG9naW4gb3Igbm90XG5cdFx0dmFyIGhlYWRlciA9IHJlcS5oZWFkZXJzO1xuXHRcdHZhciBiZWFyVG9rZW4gPSBoZWFkZXIuYXV0aG9yaXphdGlvbjtcblx0XHR2YXIgYmVhcnRva2VuQXJyID0gYmVhclRva2VuLnNwbGl0KFwiIFwiKTtcblx0XHRpZiAoIWJlYXJ0b2tlbkFyciB8fCBiZWFydG9rZW5BcnIubGVuZ3RoIDwgMikge1xuXHRcdFx0cmVzLnN0YXR1cyg0MDEpLmVuZCgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHR2YXIgdG9rZW4gPSB0aGlzLnNhZmVUcmltKGJlYXJ0b2tlbkFyclsxXSk7XG5cdFx0dmFyIHVzZXJMb2dpbkUgPSB0aGlzLmRlY29kZVRva2VuKHRva2VuKTtcblx0XHRpZiAoIXVzZXJMb2dpbkUgfHwgdXNlckxvZ2luRS5sZW5ndGggPD0gMCkge1xuXHRcdFx0Ly9yZXMud3JpdGVIZWFkKDQwMSk7XG5cdFx0XHQvL3Jlcy5zZW5kKCdIVFRQLzEuMCA0MDEgVW5hdXRob3JpemVkJyk7XG5cdFx0XHRyZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB1c2VyTG9naW5FO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmVzLnN0YXR1cyg0MDEpLmVuZCgpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuLyoqXG4gKiBnw6FuIGRhdGEgdsOgbyB0YWJsZSBlbnRpdHlcbiAqIEBwYXJhbTogdGFibGVFIHRhYmxlIGVudGl0eVxuICogQHBhcmFtOiBkYXRhOiBkYXRhIG5oYW4gZGMgdHUgY2xpZW50XG4gKiBAcGFyYW06IGluc2VydDogdHJ1ZSBzdSBkdW5nIHRyb25nIHRydW9uZyBo4buNcCBpbnNlcnQsIGZhbHNlLS0+IHVwZGF0ZVxuICovXG5MaWJzLmFzc2lnbkRhdGEgPSBmdW5jdGlvbiAodGFibGVFLCBkYXRhLCB1c2VyX25hbWUsIGlzX2luc2VydCkge1xuXHR0cnkge1xuXHRcdGlmIChkYXRhKSB7XG5cblx0XHRcdE9iamVjdC5rZXlzKHRhYmxlRSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdGlmICghbGlicy5pc0JsYW5rKGRhdGFba2V5XSkpXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiB0YWJsZUVba2V5XSA9PT0gJ251bWJlcicpXG5cdFx0XHRcdFx0XHR0YWJsZUVba2V5XSA9IHBhcnNlSW50KGRhdGFba2V5XSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIHRhYmxlRVtrZXldID09PSAnc3RyaW5nJylcblx0XHRcdFx0XHRcdHRhYmxlRVtrZXldID0gbGlicy5zYWZlVHJpbShkYXRhW2tleV0pO1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHRhYmxlRVtrZXldID0gZGF0YVtrZXldO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChpc19pbnNlcnQpIHtcblx0XHRcdFx0dGFibGVFWydjcmVhdGVkX3VzZXInXSA9IHVzZXJfbmFtZTtcblx0XHRcdFx0dGFibGVFWydjcmVhdGVkX2RhdGUnXSA9IERhdGUubm93KCk7XG5cdFx0XHRcdHRhYmxlRVsndXBkYXRlZF91c2VyJ10gPSB1c2VyX25hbWU7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHRhYmxlRVsndXBkYXRlZF91c2VyJ10gPSB1c2VyX25hbWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGFibGVFO1xuXHRcdH1cblx0XHRyZXR1cm4gdGFibGVFO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIHRhYmxlRTtcblx0fVxufVxuXG4vKipcbiAqIGNyZWF0ZSByb3V0ZSBwYXRoIGZvciBhcHBcbiAqL1xuTGlicy5nZXRTdWJkb21haW5OYW1lID0gZnVuY3Rpb24gKHJlcSkge1xuXHR2YXIgc3ViZG9tYWlucyA9IHJlcS5zdWJkb21haW5zO1xuXHRjb25zb2xlLmxvZyhzdWJkb21haW5zKTtcblx0dmFyIHN1YmRvbWFpbiA9IFwiXCI7XG5cdGZvciAoc3ViZG9tYWluIG9mIHN1YmRvbWFpbnMpIHtcblx0XHRjb25zb2xlLmxvZyhzdWJkb21haW4pO1xuXHRcdGlmIChzdWJkb21haW4gIT0gXCJ3d3dcIiAmJiBzdWJkb21haW4gIT0gZG9tYWluX25hbWUpIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRjb25zb2xlLmxvZyhzdWJkb21haW4pO1xuXHRpZiAoTGlicy5pc0JsYW5rKHN1YmRvbWFpbikpIHtcblx0XHQvL3JlbW92ZSB3d3cgbmV1IGNvXG5cdFx0dmFyIGRvbWFpbiA9IHJlcS5oZWFkZXJzLmhvc3QucmVwbGFjZShcInd3dy5cIiwgXCJcIiksXG5cdFx0XHRzdWJkb21haW5zID0gZG9tYWluLnNwbGl0KCcuJyk7XG5cdFx0Ly9sb2dnZXIuaW5mbyhkb21haW4pO1xuXHRcdGlmIChzdWJkb21haW5zLmxlbmd0aCA+IDEpIHtcblx0XHRcdHN1YmRvbWFpbiA9IHN1YmRvbWFpbnNbMF0uc3BsaXQoXCItXCIpLmpvaW4oXCIgXCIpO1xuXHRcdFx0aWYgKHN1YmRvbWFpbiA9PSBkb21haW5fbmFtZSkge1xuXHRcdFx0XHRzdWJkb21haW4gPSBcIlwiO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdWJkb21haW4gPSBcIlwiO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gc3ViZG9tYWluO1xuXG59XG4vKipcbiAqIGNoZWNrIHhlbSBjw7MgdOG7k24gdOG6oWkgY29tcGFueSBoYXkga29cbiAqIEBwYXJhbSBjb21wYW55X2lkXG4gKi9cbkxpYnMuY2hlY2tFeGlzdGVkQ29tcGFueSA9IGZ1bmN0aW9uIChjb21wYW55X2lkKSB7XG5cdHZhciBDb21wYW55TW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWxzL0NvbXBhbnlNb2RlbFwiKTtcblx0dmFyIGNvbXBhbnlNb2RlbCA9IG5ldyBDb21wYW55TW9kZWwoKTtcblx0dmFyIGNoZWNrX2V4aXN0ZWQgPSBjb21wYW55TW9kZWwuY2hlY2tDb21wYW55SWRFeGlzdGVkKGNvbXBhbnlfaWQpO1xuXHRyZXR1cm4gY2hlY2tfZXhpc3RlZCA+IDA7XG59XG4vKipcbiAqIHJlYWQgZmlsZSBleGNlbFxuICogQHBhcmFtOiBmaWxlUGF0aFxuICogQHBhcmFtOiByZXN1bHRUeXBlIGpzb24sY3N2LGZvcm1cbiAqL1xuTGlicy5yZWFkRXhjZWwgPSBmdW5jdGlvbiAoZmlsZVBhdGgsIHJlc3VsdFR5cGUpIHtcblx0dHJ5IHtcblx0XHR2YXIgeGxzeCA9IHJlcXVpcmUoXCJ4bHN4XCIpO1xuXHRcdHZhciB3b3JrYm9vayA9IHhsc3gucmVhZEZpbGUoZmlsZVBhdGgpO1xuXHRcdHZhciBvdXRwdXQgPSBcIlwiO1xuXHRcdHN3aXRjaCAocmVzdWx0VHlwZSkge1xuXHRcdFx0Y2FzZSBcImNzdlwiOlxuXHRcdFx0XHRvdXRwdXQgPSB0b19jc3YoeGxzeCwgd29ya2Jvb2spO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJmb3JtXCI6XG5cdFx0XHRcdG91dHB1dCA9IHRvX2Zvcm11bGFlKHhsc3gsIHdvcmtib29rKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRvdXRwdXQgPSB0b19qc29uKHhsc3gsIHdvcmtib29rKTsvL0pTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobWUudG9fanNvbih3YiksIDIsIDIpKTtcblx0XHR9XG5cdFx0Y29uc29sZS5sb2cob3V0cHV0KTtcblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG4vKipcbiAqIGNvbnZlcnQgZGF0YSBleGNlbCB0byBqc29uXG4gKi9cbnZhciB0b19qc29uID0gZnVuY3Rpb24gKHhsc3gsIHdvcmtib29rKSB7XG5cdHZhciByZXN1bHQgPSB7fTtcblx0dmFyIHNoZWV0SW5kZXggPSAwO1xuXHR3b3JrYm9vay5TaGVldE5hbWVzLmZvckVhY2goZnVuY3Rpb24gKHNoZWV0TmFtZSkge1xuXHRcdHZhciByb2EgPSB4bHN4LnV0aWxzLnNoZWV0X3RvX3Jvd19vYmplY3RfYXJyYXkod29ya2Jvb2suU2hlZXRzW3NoZWV0TmFtZV0pO1xuXHRcdGlmIChyb2EubGVuZ3RoID4gMCkge1xuXHRcdFx0cmVzdWx0W3NoZWV0SW5kZXgrK10gPSByb2E7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogY29udmVydCBkYXRhIGV4Y2VsIHRvIGNzdlxuICovXG52YXIgdG9fY3N2ID0gZnVuY3Rpb24gKHhsc3gsIHdvcmtib29rKSB7XG5cdHZhciByZXN1bHQgPSBbXTtcblx0d29ya2Jvb2suU2hlZXROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChzaGVldE5hbWUpIHtcblx0XHR2YXIgY3N2ID0geGxzeC51dGlscy5zaGVldF90b19jc3Yod29ya2Jvb2suU2hlZXRzW3NoZWV0TmFtZV0pO1xuXHRcdGlmIChjc3YubGVuZ3RoID4gMCkge1xuXHRcdFx0cmVzdWx0LnB1c2goXCJTSEVFVDogXCIgKyBzaGVldE5hbWUpO1xuXHRcdFx0cmVzdWx0LnB1c2goXCJcIik7XG5cdFx0XHRyZXN1bHQucHVzaChjc3YpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiByZXN1bHQuam9pbihcIlxcblwiKTtcbn1cbi8qKlxuICogY29udmVydCBkYXRhIHRvIGZvcm11bGFyXG4gKi9cbnZhciB0b19mb3JtdWxhZSA9IGZ1bmN0aW9uICh4bHN4LCB3b3JrYm9vaykge1xuXHR2YXIgcmVzdWx0ID0gW107XG5cdHdvcmtib29rLlNoZWV0TmFtZXMuZm9yRWFjaChmdW5jdGlvbiAoc2hlZXROYW1lKSB7XG5cdFx0dmFyIGZvcm11bGFlID0geGxzeC51dGlscy5nZXRfZm9ybXVsYWUod29ya2Jvb2suU2hlZXRzW3NoZWV0TmFtZV0pO1xuXHRcdGlmIChmb3JtdWxhZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXN1bHQucHVzaChcIlNIRUVUOiBcIiArIHNoZWV0TmFtZSk7XG5cdFx0XHRyZXN1bHQucHVzaChcIlwiKTtcblx0XHRcdHJlc3VsdC5wdXNoKGZvcm11bGFlLmpvaW4oXCJcXG5cIikpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiByZXN1bHQuam9pbihcIlxcblwiKTtcbn1cbi8qKlxuICogZXhwb3J0IGpzb24gZGF0YSB0byBleGNlbCBmaWxlXG4gKi9cbkxpYnMuc2F2ZUFzRXhjZWwgPSBmdW5jdGlvbiAoZmlsZU5hbWUsIGRhdGEpIHtcblx0dHJ5IHtcblx0XHR2YXIgYWxhc3FsID0gcmVxdWlyZShcImFsYXNxbFwiKTtcblx0XHRyZXR1cm4gKGFsYXNxbCgnU0VMRUNUICogSU5UTyBYTFNYKFwiJyArIGZpbGVOYW1lICsgJ1wiLHtoZWFkZXJzOnRydWV9KSBGUk9NID8nLCBbZGF0YV0pKSA9PSAxO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG4vKipcbiAqIGV4cG9ydCBqc29uIGRhdGEgdG8gZXhjZWwgZmlsZSBhbmQgZG93bmxvYWQgZXhjZWwgZmlsZVxuICovXG5MaWJzLmRvd25sb2FkRXhjZWwgPSBmdW5jdGlvbiAocmVzLCBmaWxlTmFtZSwgZGF0YSkge1xuXHR0cnkge1xuXHRcdC8vIGdlbmVyYXRlIHVuaXEgZmlsZSBuYW1lXG5cdFx0dmFyIHV1aWQgPSByZXF1aXJlKCdub2RlLXV1aWQnKTtcblx0XHQvLyBHZW5lcmF0ZSBhIHY0IChyYW5kb20pIFVVSURcblx0XHR2YXIgY2FjaGVmaWxlcGF0aCA9IFJPT1RfUEFUSCArIFwiL2NhY2hlL1wiICsgdXVpZC52NCgpICsgXCIueGxzeFwiO1xuXHRcdGlmIChMaWJzLnNhdmVBc0V4Y2VsKGNhY2hlZmlsZXBhdGgsIGRhdGEpKSB7XG5cdFx0XHRyZXMuZG93bmxvYWQoY2FjaGVmaWxlcGF0aCwgZmlsZU5hbWUsIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0dmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcblx0XHRcdFx0Ly8gZGVsZXRlIGZpbGVcblx0XHRcdFx0ZnMudW5saW5rKGNhY2hlZmlsZXBhdGgpO1xuXHRcdFx0XHQvL3Jlcy5lbmQoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cbkxpYnMuY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbn1cbi8qKlxuICogQ2hlY2sgaXMgZGlyZWN0b3J5XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aF9zdHJpbmcgXG4gKi9cbkxpYnMuY2hlY2tJc1BhdGggPSBmdW5jdGlvbiAocGF0aF9zdHJpbmcpIHtcblx0Ly8gc3RhdHMuaXNGaWxlKClcblx0Ly8gc3RhdHMuaXNEaXJlY3RvcnkoKVxuXHQvLyBzdGF0cy5pc0Jsb2NrRGV2aWNlKClcblx0Ly8gc3RhdHMuaXNDaGFyYWN0ZXJEZXZpY2UoKVxuXHQvLyBzdGF0cy5pc1N5bWJvbGljTGluaygpXG5cdC8vIHN0YXRzLmlzRklGTygpXG5cdC8vIHN0YXRzLmlzU29ja2V0KClcblx0dmFyIGZzID0gcmVxdWlyZShcImZzXCIpO1xuXHRyZXR1cm4gZnMubHN0YXRTeW5jKHBhdGhfc3RyaW5nKS5pc0RpcmVjdG9yeSgpXG59XG5MaWJzLmNoZWNrRmlsZUV4aXRzID0gZnVuY3Rpb24gY2hlY2tGaWxlRXhpdHMocGF0aCwgZmlsZU5hbWUpIHtcblx0dHJ5IHtcblx0XHR2YXIgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5cdFx0dmFyIGZpbGVzID0gZnMucmVhZGRpclN5bmMocGF0aCk7XG5cdFx0cmV0dXJuIGZpbGVzLmluZGV4T2YoZmlsZU5hbWUpID49IDA7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblxufVxuLy9raeG7g20gdHJhIG9iamVjdCBy4buXbmcgb3IgbnVsbFxuTGlicy5pc09iamVjdEVtcHR5ID0gZnVuY3Rpb24gKG9iaikge1xuXHR2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXHRpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuXHRpZiAob2JqLmxlbmd0aCA+IDApIHJldHVybiBmYWxzZTtcblx0aWYgKG9iai5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xuXHRpZiAodHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHRydWU7XG5cdGZvciAodmFyIGtleSBpbiBvYmopIHtcblx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHJldHVybiBmYWxzZTtcblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cbi8vxJHhu5VpIHRo4bupIG5nw6B5IHRow6FuZyBzYW5nIG1pbGlzZWNvbmRcbkxpYnMuY29udmVydERhdGVUb01pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uIChkYXRlLCBmb3JtYXQpIHtcblx0Ly9cdHZhciBkID0gZGF0ZS5zcGxpdChcIi1cIik7XG5cdC8vXHRjb25zb2xlLmxvZyhkYXRlKTtcblx0dmFyIGYgPSBuZXcgRGF0ZShkYXRlKTtcblx0aWYgKG51bGwgPT0gZiB8fCBcInVuZGVmaW5lZFwiID09PSB0eXBlb2YgZilcblx0XHRyZXR1cm4gMDtcblx0cmV0dXJuIGYuZ2V0VGltZSgpO1xufVxuTGlicy5jb252ZXJ0TWlsbGlzZWNvbmRzVG9EYXRlID0gKHRpbWUpID0+IHtcblx0dmFyIGRhdGUgPSBuZXcgRGF0ZSh0aW1lKTtcblx0cmV0dXJuIGRhdGU7XG59XG5MaWJzLmNvbnZlcnRNaWxsaXNlY29uZHNUb0RhdGFGb3JtYXQgPSAobWlsbGlzZWNvbmRzLCBpc1Nob3dIb3VyID0gdHJ1ZSkgPT4ge1xuXHRtaWxsaXNlY29uZHMgPSBwYXJzZUludChtaWxsaXNlY29uZHMpO1xuXHRpZiAobWlsbGlzZWNvbmRzID09IG51bGwgfHwgbWlsbGlzZWNvbmRzID09IDApIHJldHVybiBcIlwiO1xuXHR2YXIgZGF0ZU9iaiA9IG5ldyBEYXRlKG1pbGxpc2Vjb25kcyk7XG5cdHZhciBkYXkgPSAoZGF0ZU9iai5nZXREYXRlKCkgPCAxMCkgPyAoXCIwXCIgKyBkYXRlT2JqLmdldERhdGUoKSkgOiBkYXRlT2JqLmdldERhdGUoKTtcblx0dmFyIG1vbnRoID0gKGRhdGVPYmouZ2V0TW9udGgoKSArIDEgPCAxMCkgPyAoXCIwXCIgKyAoZGF0ZU9iai5nZXRNb250aCgpICsgMSkpIDogKGRhdGVPYmouZ2V0TW9udGgoKSArIDEpO1xuXHR2YXIgeWVhciA9IGRhdGVPYmouZ2V0RnVsbFllYXIoKTtcblx0dmFyIGhvdXIgPSAoZGF0ZU9iai5nZXRIb3VycygpIDwgMTApID8gKFwiMFwiICsgZGF0ZU9iai5nZXRIb3VycygpKSA6IGRhdGVPYmouZ2V0SG91cnMoKTtcblx0dmFyIG1pbnV0ZSA9IChkYXRlT2JqLmdldE1pbnV0ZXMoKSA8IDEwKSA/IChcIjBcIiArIGRhdGVPYmouZ2V0TWludXRlcygpKSA6IGRhdGVPYmouZ2V0TWludXRlcygpO1xuXHR2YXIgc2Vjb25kID0gKGRhdGVPYmouZ2V0U2Vjb25kcygpIDwgMTApID8gKFwiMFwiICsgZGF0ZU9iai5nZXRTZWNvbmRzKCkpIDogZGF0ZU9iai5nZXRTZWNvbmRzKCk7XG5cdGlmIChpc1Nob3dIb3VyKVxuXHRcdHJldHVybiBkYXkgKyBcIi9cIiArIG1vbnRoICsgXCIvXCIgKyB5ZWFyICsgXCIgXCIgKyBob3VyICsgXCI6XCIgKyBtaW51dGUgKyBcIjpcIiArIHNlY29uZDtcblx0ZWxzZVxuXHRcdHJldHVybiBkYXkgKyBcIi9cIiArIG1vbnRoICsgXCIvXCIgKyB5ZWFyXG59XG4vKipcbiAqIEdlbmVyYXRlIHRva2VuIHN0cmluZyB3aXRoIHRpbWVvdXQgKHNlY29uZHMpLlxuICogQHBhcmFtIG9iamVjdCBiYXNlRGF0YSBcbiAqIEBwYXJhbSBpbnQgdGltZW91dCBzZWNvbmRcbiAqIEByZXR1cm4gc3RyaW5nXG4gKi9cbkxpYnMuZ2VuZXJhdGVUb2tlbkNyeXB0byA9IGZ1bmN0aW9uIChiYXNlRGF0YSwgdGltZW91dCkge1xuXHR0cnkge1xuXHRcdHZhciBDcnlwdG9MaWIgPSByZXF1aXJlKCcuL0NyeXB0by5qcycpO1xuXG5cdFx0dmFyIGJhc2U2NFR4dCA9IENyeXB0b0xpYi5iYXNlNjRFbmNyeXB0KEpTT04uc3RyaW5naWZ5KGJhc2VEYXRhKSk7XG5cdFx0dmFyIGVuY3J5cHRUeHQgPSBDcnlwdG9MaWIuZW5jcnlwdChiYXNlNjRUeHQsIGNvbmZpZy5zZXJ2ZXIuZW5jcnlwdC5zZWNyZXRfa2V5KTtcblx0XHRyZXR1cm4gZW5jcnlwdFR4dDtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGxvZ2dlci5lcnJvcihlKTtcblx0fVxufVxuLyoqXG4gKiBkZWNvZGUgdG8gb2JqZWN0IGZyb20gdG9rZW4gc3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gXG4gKiBAcmV0dXJuIG9iamVjdFxuICovXG5MaWJzLmRlY29kZVRva2VuQ3J5cHRvID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRyeSB7XG5cdFx0aWYgKG51bGwgPT0gdG9rZW4gfHwgdHlwZW9mIHRva2VuID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHR2YXIgQ3J5cHRvTGliID0gcmVxdWlyZSgnLi9DcnlwdG8uanMnKTtcblx0XHR2YXIgZGVjcnlwdFR4dCA9IENyeXB0b0xpYi5kZWNyeXB0KHRva2VuLCBjb25maWcuc2VydmVyLmVuY3J5cHQuc2VjcmV0X2tleSk7XG5cdFx0dmFyIGpzb24gPSBDcnlwdG9MaWIuYmFzZTY0RGVjcnlwdChkZWNyeXB0VHh0KTtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShqc29uKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGxvZ2dlci5lcnJvcihlKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5MaWJzLm1kNSA9IGZ1bmN0aW9uIChwbGFpblRleHQpIHtcblx0aWYgKHR5cGVvZiBwbGFpblRleHQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmV0dXJuIHBsYWluVGV4dDtcblx0fVxuXHR2YXIgQ3J5cHRvTGliID0gcmVxdWlyZSgnLi9DcnlwdG8uanMnKTtcblx0cmV0dXJuIENyeXB0b0xpYi5tZDUocGxhaW5UZXh0KTtcbn1cblxuTGlicy5BRVNFbmNyeXB0ID0gZnVuY3Rpb24gKHBsYWluVGV4dCwgc2VjcmV0S2V5KSB7XG5cdGlmICh0eXBlb2YgcGxhaW5UZXh0ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygc2VjcmV0S2V5ID09PSAndW5kZWZpbmVkJykge1xuXHRcdHJldHVybiBwbGFpblRleHQ7XG5cdH1cblx0dmFyIENyeXB0b0xpYiA9IHJlcXVpcmUoJy4vQ3J5cHRvLmpzJyk7XG5cdHJldHVybiBDcnlwdG9MaWIuQUVTRW5jcnlwdChwbGFpblRleHQsIHNlY3JldEtleSk7XG59XG5cblxuTGlicy5BRVNEZWNyeXB0ID0gZnVuY3Rpb24gKHBsYWluVGV4dCwgc2VjcmV0S2V5KSB7XG5cdGlmICh0eXBlb2YgcGxhaW5UZXh0ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygc2VjcmV0S2V5ID09PSAndW5kZWZpbmVkJykge1xuXHRcdHJldHVybiBwbGFpblRleHQ7XG5cdH1cblx0dmFyIENyeXB0b0xpYiA9IHJlcXVpcmUoJy4vQ3J5cHRvLmpzJyk7XG5cdHJldHVybiBDcnlwdG9MaWIuQUVTRGVjcnlwdChwbGFpblRleHQsIHNlY3JldEtleSk7XG59XG5cblxuTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcblx0aWYgKHR5cGVvZiBvYmplY3QgIT0gJ29iamVjdCcpIHJldHVybiB7fTtcblx0bGV0IG9iaiA9IHt9O1xuXHRmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG5cdFx0b2JqZWN0W2tleV0gPSAob2JqZWN0W2tleV0gPT09ICcnKSA/IG51bGwgOiBvYmplY3Rba2V5XTtcblx0XHRpZiAoKG9iamVjdFtrZXldICE9ICcnKSkge1xuXHRcdFx0b2JqW2tleV0gPSBvYmplY3Rba2V5XTtcblx0XHR9IGVsc2UgaWYgKG9iamVjdFtrZXldID09PSAwKSB7XG5cdFx0XHRvYmpba2V5XSA9IG9iamVjdFtrZXldO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gb2JqO1xufVxuLyoqXG4gKiBSZW1vdmUgSGVhZGVyIERhdGEgUG9zdDpcbiAqIGhlYWRlcnMgb2JqZWN0LFxuICogcHJvdG9jb2wgb2JqZWN0LFxuICogaG9zdCBvYmplY3RzXG4gKiBAcGFyYW0ge2RhdGEganNvbn0gb2JqZWN0IFxuICovXG5MaWJzLnJlbW92ZU9iamVjdFBvc3RKc29uID0gZnVuY3Rpb24gKG9iamVjdCkge1xuXHR0cnkge1xuXHRcdGlmICh0eXBlb2Ygb2JqZWN0ICE9ICdvYmplY3QnKSByZXR1cm4ge307XG5cdFx0aWYgKG9iamVjdC5oZWFkZXJzICE9ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRkZWxldGUgb2JqZWN0LmhlYWRlcnM7XG5cdFx0fVxuXHRcdGlmIChvYmplY3QucHJvdG9jb2wgIT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGRlbGV0ZSBvYmplY3QucHJvdG9jb2w7XG5cdFx0fVxuXHRcdGlmIChvYmplY3QuaG9zdCAhPSAndW5kZWZpbmVkJykge1xuXHRcdFx0ZGVsZXRlIG9iamVjdC5ob3N0O1xuXHRcdH1cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0UG9zdEpzb25cIiwgZXJyb3IpO1xuXHRcdGxvZ2dlci5lcnJvcihlKTtcblx0fVxuXG59XG5cbkxpYnMuYmFzZTY0TWltZVR5cGUgPSBmdW5jdGlvbiAoZW5jb2RlZCkge1xuXHR2YXIgcmVzdWx0ID0gbnVsbDtcblx0aWYgKHR5cGVvZiBlbmNvZGVkICE9PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblx0dmFyIG1pbWUgPSBlbmNvZGVkLm1hdGNoKC9kYXRhOihbYS16QS1aMC05XStcXC9bYS16QS1aMC05LS4rXSspLiosLiovKTtcblxuXHRpZiAobWltZSAmJiBtaW1lLmxlbmd0aCkge1xuXHRcdHJlc3VsdCA9IG1pbWVbMV07XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuLy8gTGlicy5mb3JtYXROdW0gPSBmdW5jdGlvbiAodmFsLCBvcHRpb25zKSB7XG4vLyBcdGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucyA9PSBudWxsIHx8IG9wdGlvbnMgPT09ICcnKSB7XG4vLyBcdFx0b3B0aW9ucyA9IHt9O1xuLy8gXHR9XG4vLyBcdHZhciBvcHRzID0ge1xuLy8gXHRcdFwibmVnYXRpdmVUeXBlXCI6ICdsZWZ0Jyxcbi8vIFx0XHRcInByZWZpeFwiOiAnJyxcbi8vIFx0XHRcInN1ZmZpeFwiOiAnJyxcbi8vIFx0XHRcImludGVnZXJTZXBhcmF0b3JcIjogJywnLFxuLy8gXHRcdFwiZGVjaW1hbHNTZXBhcmF0b3JcIjogJycsXG4vLyBcdFx0XCJkZWNpbWFsXCI6ICcuJyxcbi8vIFx0XHRcInBhZExlZnRcIjogLTFcbi8vIFx0fTtcbi8vIFx0b3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdHMsIG9wdGlvbnMpO1xuLy8gXHRyZXR1cm4gZm9ybWF0TnVtKG9wdHMpKHZhbCk7XG4vLyB9XG4vKipcbiogZm9ybWF0IG51bWJlciB24bubaSBvcHRpb24gZm9ybWF0IHRoZW8gxJHhu4tuaCBk4bqhbmcgZm9ybWF0TnVtIGPhu6dhIHRoxrAgdmnhu4duXG4qIG3hurdjIMSR4buLbmggbMOgICMsIyMjLiMjIGPDoWNoIG5oYXUgYuG7n2kgZOG6pXUgcGjhuql5LCBsw6J5IHNhdSB0aOG6rXAgcGjDom4gMiBz4buRXG4qXG4qIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiogQHBhcmFtIHtTdHJpbmd9IHBhdHRlcm4gZGVmYXVsdCAjLCMjIy4jI1xuKiBAcGFyYW0ge2ludH0gcm91bmQgZGVmYXVsdCAwOiBMw6BtIHRyw7JuIHThu7Egbmhpw6puLCAtMTogbMOgbSB0csOybiB4deG7kW5nLCAxOiBsw6BtIHRyw7JuIGzDqm5cbiogQGF1dGhvcjogIFRpY2huZ3V5ZW4gMjAxOC0xMS0xOCAxMToxNjozNCBcbiovXG5MaWJzLmZvcm1hdE51bSA9IGZ1bmN0aW9uICh2YWwsIHBhdHRlcm4gPSBcIiMsIyMjLiMjXCIsIHJvdW5kID0gMCkge1xuXHRpZiAoTGlicy5pc0JsYW5rKHZhbCkgfHwgaXNOYU4odmFsKSkge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cdHZhbCA9IHZhbCAqIDE7XG5cdGxldCBjb21tYSA9ICcsJ1xuXHRsZXQgZGVjaW1hbCA9ICcuJ1xuXHRsZXQgYWZ0ZXJEZWNpbWFsTnVtID0gMDsvL3NhdSBk4bqldSB0aOG6rXAgcGjDom4gbOG6pXkgbeG6pXkgc+G7kVxuXHRpZiAoTGlicy5pc0JsYW5rKHBhdHRlcm4pKSB7XG5cdFx0cGF0dGVybiA9IFwiIywjIyMuIyNcIjtcblx0fVxuXG5cdC8vcGjDom4gdMOtY2ggcGF0dGVyblxuXHQvL2No4buJIGNo4bqlcCBuaOG6rW4gZOG6pXUgcGjhuql5IGhv4bq3YyBk4bqldSAuXG5cdGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChcIlssLl0rXCIsIFwiaWdcIik7XG5cdGxldCBteUFycmF5O1xuXHRsZXQgaW5kZXggPSAwO1xuXHRsZXQgYWZ0ZXJEZWNpbWFsID0gXCJcIjtcblx0d2hpbGUgKChteUFycmF5ID0gcmVnZXguZXhlYyhwYXR0ZXJuKSkgIT09IG51bGwpIHtcblx0XHQvL2zhuqduIMSR4bqndSBsw6AgY29tbWFcblx0XHRpZiAoaW5kZXggPT0gMCkge1xuXHRcdFx0Y29tbWEgPSBteUFycmF5WzBdO1xuXHRcdH0gZWxzZSBpZiAoY29tbWEgIT0gbXlBcnJheVswXSkge1xuXHRcdFx0Ly9s4bqnbiBjdeG7kWkgY8O5bmcgbMOgIGThuqV1IHBow6JuIGPDoWNoIHPhu5EgdGjhuq1wIHBow6JuXG5cdFx0XHRhZnRlckRlY2ltYWwgPSBteUFycmF5WzBdO1xuXHRcdH1cblx0XHRpbmRleCsrO1xuXHR9XG5cdC8vbuG6v3UgY8OzIMSR4buLbmggZOG6oW5nIHNhdSBz4buRIHRo4bqtcCBwaMOibiB0aMOsIHTDrG0gcXV5IMSR4buLbmggbeG6pXkgc+G7kSBzYXUgc+G7kSB0aOG6rXAgcGjDom5cblx0aWYgKGFmdGVyRGVjaW1hbCAhPSBcIlwiKSB7XG5cdFx0ZGVjaW1hbCA9IGFmdGVyRGVjaW1hbDtcblx0XHRhZnRlckRlY2ltYWxOdW0gPSBwYXR0ZXJuLmxlbmd0aCAtIChwYXR0ZXJuLmxhc3RJbmRleE9mKGRlY2ltYWwpICsgMSlcblx0fVxuXG5cdHZhciBvcHRzID0ge1xuXHRcdFwibmVnYXRpdmVUeXBlXCI6ICdsZWZ0Jyxcblx0XHRcInByZWZpeFwiOiAnJyxcblx0XHRcInN1ZmZpeFwiOiAnJyxcblx0XHRcImludGVnZXJTZXBhcmF0b3JcIjogY29tbWEsXG5cdFx0XCJkZWNpbWFsc1NlcGFyYXRvclwiOiAnJyxcblx0XHRcImRlY2ltYWxcIjogZGVjaW1hbCxcblx0XHRcInBhZExlZnRcIjogLTEsXG5cdFx0XCJyb3VuZFwiOiBhZnRlckRlY2ltYWxOdW1cblx0fTtcblx0Ly90aeG6v24gaMOgbmggbMOgbSB0csOyblxuXHRpZiAocm91bmQgPT0gMSkge1xuXHRcdC8vbMOgbSB0csOybiB04buxIG5oacOqblxuXHRcdHZhbCA9IHJvdW5kVG8udXAodmFsLCBhZnRlckRlY2ltYWxOdW0pO1xuXHR9IGVsc2UgaWYgKHJvdW5kID09IDApIHtcblx0XHQvL2zDoG0gdHLDsm4gdOG7sSBuaGnDqm5cblx0XHR2YWwgPSByb3VuZFRvKHZhbCwgYWZ0ZXJEZWNpbWFsTnVtKTtcblx0fSBlbHNlIHtcblx0XHQvL2zDoG0gdHLDsm4geHXhu5FuZ1xuXHRcdHZhbCA9IHJvdW5kVG8uZG93bih2YWwsIGFmdGVyRGVjaW1hbE51bSk7XG5cdH1cblxuXHRyZXR1cm4gZm9ybWF0TnVtKG9wdHMpKHZhbCk7XG59XG4vKipcbiAqIFxuICogQHBhcmFtIHsqfSBpbnB1dERhdGUgZm9ybWF0IGRkL01NL3l5eXlcbiAqIEByZXR1cm5zIHN0cmluZyB5eXl5LU1NLWRkXG4gKi9cbkxpYnMuaW5wdXREYXRlVG9EQkRhdGUgPSBmdW5jdGlvbiAoaW5wdXREYXRlKSB7XG5cdGlmIChpbnB1dERhdGUgPT09IHVuZGVmaW5lZCB8fCBpbnB1dERhdGUgPT0gbnVsbCB8fCBpbnB1dERhdGUgPT09ICcnIHx8IHR5cGVvZiBpbnB1dERhdGUgIT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0dmFyIGRpdmlzaW9uID0gaW5wdXREYXRlLnNwbGl0KCcvJyk7XG5cdGlmIChkaXZpc2lvbiA8PSAxKSByZXR1cm4gbnVsbDtcblx0aWYgKGlucHV0RGF0ZS5sZW5ndGggIT0gMTApIHJldHVybiBudWxsO1xuXHRsZXQgZGF5ID0gaW5wdXREYXRlLnN1YnN0cmluZygwLCAyKTtcblx0bGV0IG1vbnRoID0gaW5wdXREYXRlLnN1YnN0cmluZygzLCA1KTtcblx0bGV0IHllYXIgPSBpbnB1dERhdGUuc3Vic3RyaW5nKDYsIDEwKTtcblx0cmV0dXJuIHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBkYXk7XG59XG5MaWJzLmRhdGUyU3RyID0gKF9kYXRlLCBfZm9ybWF0KSA9PiB7XG5cdGlmIChudWxsID09IF9kYXRlIHx8IHR5cGVvZiBfZGF0ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgX2RhdGUgPT0gJycpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHR2YXIgZGF5ID0gX2RhdGUuZ2V0RGF0ZSgpO1xuXHR2YXIgbW9udGggPSBfZGF0ZS5nZXRNb250aCgpO1xuXHR2YXIgeWVhciA9IF9kYXRlLmdldEZ1bGxZZWFyKCkgKyAnJztcblx0bW9udGggKz0gMTtcblx0ZGF5ID0gZGF5LnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpXG5cdG1vbnRoID0gbW9udGgudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIilcblx0dmFyIHJlc3VsdCA9IF9mb3JtYXQudG9Mb3dlckNhc2UoKTtcblx0cmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoJ2RkJywgZGF5KTtcblx0cmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoJ21tJywgbW9udGgpO1xuXHRyZXN1bHQgPSByZXN1bHQucmVwbGFjZSgneXl5eScsIHllYXIpO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7Kn0gREJEYXRlIGZvcm1hdCB5eXl5LU1NLWRkXG4gKiBAcmV0dXJucyBzdHJpbmcgZGQvTU0veXl5eVxuICovXG5MaWJzLkRCRGF0ZVRvSW5wdXREYXRlID0gZnVuY3Rpb24gKERCRGF0ZSkge1xuXHRpZiAoREJEYXRlID09PSB1bmRlZmluZWQgfHwgREJEYXRlID09IG51bGwgfHwgREJEYXRlID09PSAnJykge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHRyeSB7XG5cdFx0bGV0IGRheSA9ICcnLCBtb250aCA9ICcnLCB5ZWFyID0gJyc7XG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChEQkRhdGUpID09IFwiW29iamVjdCBEYXRlXVwiKSB7XG5cdFx0XHRkYXkgPSBEQkRhdGUuZ2V0RGF0ZSgpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpO1xuXHRcdFx0bW9udGggPSAoREJEYXRlLmdldE1vbnRoKCkgKyAxKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcblx0XHRcdHllYXIgPSBEQkRhdGUuZ2V0RnVsbFllYXIoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IG5ld0RhdGUgPSBuZXcgRGF0ZShEQkRhdGUpO1xuXHRcdFx0bGV0IGlzVmFsaWQgPSBuZXdEYXRlLmdldERhdGUoKSA+IDA7XG5cdFx0XHRpZiAoIWlzVmFsaWQpIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRkYXkgPSBuZXdEYXRlLmdldERhdGUoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcblx0XHRcdG1vbnRoID0gKG5ld0RhdGUuZ2V0TW9udGgoKSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpO1xuXHRcdFx0eWVhciA9IG5ld0RhdGUuZ2V0RnVsbFllYXIoKTtcblx0XHR9XG5cdFx0bGV0IGRhdGVSZXR1cm4gPSBgJHtkYXl9LyR7bW9udGh9LyR7eWVhcn1gO1xuXHRcdGNvbnNvbGUubG9nKFwiREJEYXRlVG9JbnB1dERhdGUgcmV0dXJuOiBcIiwgZGF0ZVJldHVybik7XG5cdFx0cmV0dXJuIGRhdGVSZXR1cm47XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRjb25zb2xlLmxvZyhlKVxuXHR9XG5cblx0Ly8gdmFyIGFyciA9IFwiXCI7XG5cdC8vIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoREJEYXRlKSA9PSBcIltvYmplY3QgRGF0ZV1cIikge1xuXHQvLyBcdHZhciBkYXRlID0gbmV3IERhdGUoREJEYXRlKTtcblx0Ly8gXHR2YXIgc3RyaW5nRGF0ZSA9IGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKFwidmktVk5cIik7XG5cdC8vIFx0YXJyID0gc3RyaW5nRGF0ZS5zcGxpdCgnLycpO1xuXHQvLyBcdGlmIChhcnIubGVuZ3RoIDw9IDEpIHtcblx0Ly8gXHRcdGFyciA9IHN0cmluZ0RhdGUuc3BsaXQoJy0nKTtcblx0Ly8gXHR9XG5cdC8vIH0gZWxzZSBpZiAodHlwZW9mIERCRGF0ZSA9PT0gJ3N0cmluZycpIHtcblx0Ly8gXHRhcnIgPSBEQkRhdGUuc3BsaXQoJy0nKTtcblx0Ly8gfSBlbHNlIHtcblx0Ly8gXHRyZXR1cm4gbnVsbDtcblx0Ly8gfVxuXHQvLyBpZiAoYXJyLmxlbmd0aCA8PSAxKSByZXR1cm4gbnVsbDtcblx0Ly8gbGV0IHllYXIgPSBhcnJbMF07XG5cdC8vIGxldCBtb250aCA9IGFyclsxXTtcblx0Ly8gbGV0IGRheSA9IGFyclsyXTtcblx0Ly8gcmV0dXJuIGRheS50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKSArIFwiL1wiICsgbW9udGgudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIikgKyBcIi9cIiArIHllYXIudG9TdHJpbmcoKS5wYWRTdGFydCg0LCBcIjBcIik7XG59XG5MaWJzLkNoZWNrRGlmZkpzb24gPSBmdW5jdGlvbiAoaXRlbSkge1xuXHRpZiAoaXRlbS5wYXRoWzBdICE9PSAndXBkYXRlZF9kYXRlJ1xuXHRcdCYmIGl0ZW0ucGF0aFswXSAhPT0gJ3VwZGF0ZWRfYnknXG5cdFx0JiYgaXRlbS5wYXRoWzBdICE9PSAnY3JlYXRlZF9kYXRlJ1xuXHRcdCYmIGl0ZW0ucGF0aFswXSAhPT0gJ2NyZWF0ZWRfYnknXG5cdFx0JiYgaXRlbS5wYXRoWzBdICE9PSAnbW9kZSdcblx0XHQmJiBpdGVtLnBhdGhbMF0gIT09ICdpc19zdXBwZXInXG5cdFx0JiYgaXRlbS5wYXRoWzBdICE9PSAnaXNfcGFnaW5nJ1xuXHRcdCYmIGl0ZW0ucGF0aFswXSAhPT0gJ2xhbmdfZGVmYXVsdCdcblx0XHQmJiBpdGVtLnBhdGhbMF0gIT09ICdjdXJyZW50X3Jvdydcblx0XHQmJiBpdGVtLnBhdGhbMF0gIT09ICdtYXhfcmVjb3JkJ1xuXHRcdCYmIGl0ZW0ucGF0aFswXSAhPT0gJ2N1cnJlbnRVc2VyJylcblx0XHRyZXR1cm4gdHJ1ZTtcblx0cmV0dXJuIGZhbHNlO1xufVxuLyoqXG4gKiBM4bqleSBjw6FjIHBo4bqnbiB04butIHRoYXkgxJHhu5VpIGPhu6dhIDIgb2JqZWN0IGpzb25cbiAqIEBwYXJhbSB7anNvbiBvYmplY3R9IG5ld0l0ZW0gXG4gKiBAcGFyYW0ge2pzb24gb2JqZWN0fSBvbGRJdGVtIFxuICovXG5MaWJzLkRlZXBEaWZmSnNvbiA9IGZ1bmN0aW9uIChuZXdJdGVtLCBvbGRJdGVtKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFuZXdJdGVtKSByZXR1cm47XG5cdFx0aWYgKCFvbGRJdGVtKSBvbGRJdGVtID0ge307XG5cdFx0bGV0IGRpZmZEYXRhID0gZGlmZihvbGRJdGVtLCBuZXdJdGVtKTtcblx0XHRsZXQgT2JqRGlmZiA9IFtdO1xuXHRcdGlmICghZGlmZkRhdGEpIHJldHVybjtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRpZmZEYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgaXRlbSA9IGRpZmZEYXRhW2ldO1xuXHRcdFx0bGV0IGl0ZW1FID0ge307XG5cdFx0XHRpZiAoaXRlbS5raW5kID09ICdFJyAmJiBMaWJzLkNoZWNrRGlmZkpzb24oaXRlbSkpIHtcblx0XHRcdFx0aXRlbUUucGF0aCA9IGl0ZW0ucGF0aFswXTtcblx0XHRcdFx0aXRlbUUuYmVmb3JlID0gaXRlbS5saHM7XG5cdFx0XHRcdGl0ZW1FLmFmdGVyID0gaXRlbS5yaHM7XG5cdFx0XHRcdE9iakRpZmYucHVzaChpdGVtRSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaXRlbS5raW5kID09ICdOJyAmJiBMaWJzLkNoZWNrRGlmZkpzb24oaXRlbSkpIHtcblx0XHRcdFx0aXRlbUUucGF0aCA9IGl0ZW0ucGF0aFswXTtcblx0XHRcdFx0aXRlbUUuYmVmb3JlID0gJyc7XG5cdFx0XHRcdGl0ZW1FLmFmdGVyID0gaXRlbS5yaHM7XG5cdFx0XHRcdE9iakRpZmYucHVzaChpdGVtRSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaXRlbS5raW5kID09ICdEJyAmJiBMaWJzLkNoZWNrRGlmZkpzb24oaXRlbSkpIHtcblx0XHRcdFx0aXRlbUUucGF0aCA9IGl0ZW0ucGF0aFswXTtcblx0XHRcdFx0aXRlbUUuYmVmb3JlID0gJyc7XG5cdFx0XHRcdGl0ZW1FLmFmdGVyID0gaXRlbS5yaHM7XG5cdFx0XHRcdE9iakRpZmYucHVzaChpdGVtRSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBkYXRhX3JldHVybiA9IFwiXCI7XG5cdFx0aWYgKE9iakRpZmYubGVuZ3RoID4gMClcblx0XHRcdGRhdGFfcmV0dXJuID0gSlNPTi5zdHJpbmdpZnkoT2JqRGlmZik7IC8vIGdpYSB0cmkgbHV1IHh1b25nIGRiXG5cdFx0cmV0dXJuIGRhdGFfcmV0dXJuO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0fVxufVxuXG5MaWJzLmlzSW50ZWdlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHR0cnkge1xuXHRcdHZhciB2YWwgPSB2YWx1ZTtcblx0XHRpZiAodHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcgfHwgdmFsID09IG51bGwpIHJldHVybiBmYWxzZTtcblx0XHRpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcblx0XHRcdHZhbCA9IHZhbC50b1N0cmluZygpO1xuXHRcdH1cblx0XHR2YWwgPSB2YWwucmVwbGFjZSgvXi0vLCAnJyk7XG5cdFx0cmV0dXJuIC9eKDB8WzEtOV1cXGQqKSQvLnRlc3QodmFsKTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbi8qKlxuICogTOG6pXkgc+G7kSBuZ8OgeSB0cm9uZyB0aMOhbmdcbiAqIEBhdXRob3IgTWluaC5QaGFtIDIwMTgtMTEtMjhcbiAqL1xuTGlicy5nZXREYXlzT2ZNb250aCA9ICh5ZWFyLCBtb250aCkgPT4ge1xuXHR2YXIgZCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKTtcblx0cmV0dXJuIGQuZ2V0RGF0ZSgpO1xufVxuXG4vKipcbiAqIGdldCBDdXJyZW50IFllYXIgZm9ybWF0IHl5XG4gKi9cbkxpYnMuZ2V0Q3VycmVudFlZID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpLnN1YnN0cigtMik7XG5cdHJldHVybiB5ZWFyO1xufVxuTGlicy5nZXRDdXJyZW50WVlNTUREID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cdGxldCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkuc3Vic3RyKC0yKTtcblx0bGV0IG1vbnRoID0gKGRhdGUuZ2V0TW9udGgoKSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpO1xuXHRsZXQgZGF5ID0gZGF0ZS5nZXREYXRlKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIik7XG5cdHJldHVybiB5ZWFyICsgbW9udGggKyBkYXk7XG59XG5MaWJzLmdldEN1cnJlbnRERE1NWVlZWSA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRsZXQgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpO1xuXHRsZXQgbW9udGggPSAoZGF0ZS5nZXRNb250aCgpICsgMSkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIik7XG5cdGxldCBkYXkgPSBkYXRlLmdldERhdGUoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcblx0cmV0dXJuIGRheSArIFwiL1wiICsgbW9udGggKyBcIi9cIiArIHllYXI7XG59XG5cbkxpYnMuYnVpbGRQYXRoVmFsaWRhdGVNZXNzYWdlID0gZnVuY3Rpb24gKHBhdGgsIG1lc3NhZ2UpIHtcblx0aWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJyB8fCB0eXBlb2YgbWVzc2FnZSAhPT0gJ3N0cmluZycpXG5cdFx0cmV0dXJuIG51bGw7XG5cdGlmIChwYXRoLmxlbmd0aCA8PSAwKSByZXR1cm4gbnVsbDtcblx0dmFyIHZhbGlkYXRlID0ge307XG5cdHZhbGlkYXRlW3BhdGhdID0gbWVzc2FnZTtcblx0cmV0dXJuIHZhbGlkYXRlO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIG5nw6B5IHNpbmggdGhlbyB04burbmcgw7QgaW5wdXRcbiAqIEBhdXRob3IgdGhhbmguYmF5IDIwMTgtMDktMjVcbiAqIEBwYXJhbSAge3N0cmluZ30gZGF5PVwiXCJcbiAqIEBwYXJhbSAge3N0cmluZ30gbW9udGg9XCJcIlxuICogQHBhcmFtICB7c3RyaW5nfSB5ZWFyPVwiXCJcbiAqL1xuTGlicy52YWxpZGF0ZUJpcnRoRGF5ID0gZnVuY3Rpb24gKGRheSA9IFwiXCIsIG1vbnRoID0gXCJcIiwgeWVhciA9IFwiXCIpIHtcblx0ZGF5ID0gKHR5cGVvZiBkYXkgIT09ICdzdHJpbmcnKSA/IFwiXCIgOiBkYXk7XG5cdG1vbnRoID0gKHR5cGVvZiBtb250aCAhPT0gJ3N0cmluZycpID8gXCJcIiA6IG1vbnRoO1xuXHR5ZWFyID0gKHR5cGVvZiB5ZWFyICE9PSAnc3RyaW5nJykgPyBcIlwiIDogeWVhcjtcblxuXHRpZiAoZGF5Lmxlbmd0aCA+IDAgJiYgKG1vbnRoLmxlbmd0aCA8PSAwIHx8IHllYXIubGVuZ3RoIDw9IDApKSByZXR1cm4gZmFsc2U7XG5cdGlmIChtb250aC5sZW5ndGggPiAwICYmIHllYXIubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcblx0aWYgKHllYXIubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcblxuXHQvLyBDaOG7iSBraeG7g20gdHJhIG7Eg21cblx0bGV0IGNoZWNrWWVhciA9IChtWWVhcikgPT4ge1xuXHRcdGxldCBjdXJyZW50WWVhciA9IChuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpO1xuXHRcdGlmIChtWWVhci5sZW5ndGggIT09IDQgfHwgbVllYXIgKiAxIDwgMTkwMCB8fCBjdXJyZW50WWVhciAqIDEgPCBtWWVhciAqIDEpIHJldHVybiBmYWxzZTtcblx0XHRpZiAoKGN1cnJlbnRZZWFyIC0gbVllYXIpID4gMTAwKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBraeG7g20gdHJhIHRow6FuZyB2w6AgbsSDbVxuXHRsZXQgY2hlY2tNb250aFllYXIgPSAobU1vbnRoLCBtWWVhcikgPT4ge1xuXHRcdGlmIChtTW9udGgubGVuZ3RoICE9PSAyIHx8IG1Nb250aCAqIDEgPiAxMiB8fCBtTW9udGggKiAxIDw9IDApIHJldHVybiBmYWxzZTtcblx0XHRsZXQgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdC8vIEtp4buDbSB0cmEgdGjDoW5nIGtow7RuZyDEkcaw4bujYyBs4bubbiBoxqFuIHRow6FuZyBoaeG7h24gdOG6oWkgbuG6v3UgbsSDbSBzaW5oIGzDoCBuxINtIGhp4buHbiB04bqhaVxuXHRcdGlmIChjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpID09IG1ZZWFyICYmIChjdXJyZW50RGF0ZS5nZXRNb250aCgpICogMSArIDEpIDwgbU1vbnRoKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIGNoZWNrWWVhcihtWWVhcik7XG5cblx0fVxuXG5cdC8vIGtp4buDbSB0cmEgbmfDoHkgaOG7o3AgbOG7h1xuXHRsZXQgY2hlY2tGdWxsRGF0ZSA9IChtRGF5LCBtTW9udGgsIG1ZZWFyKSA9PiB7XG5cdFx0bGV0IHN0ckRhdGUgPSBtRGF5ICsgXCIvXCIgKyBtTW9udGggKyBcIi9cIiArIG1ZZWFyO1xuXHRcdGxldCB2YWxpZGF0ZSA9IExpYnMudmFsaWRhdGVEYXRlKHN0ckRhdGUpO1xuXHRcdGlmICghdmFsaWRhdGUpIHJldHVybiBmYWxzZTtcblx0XHQvLyBLaeG7g20gdHJhIGPDsyBs4bubbiBoxqFuIG5nw6B5IGhp4buHbiB04bqhaVxuXHRcdGxldCBtRGF0ZSA9IG5ldyBEYXRlKG1ZZWFyLCAobU1vbnRoICogMSAtIDEpLCBtRGF5KTtcblx0XHRsZXQgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpLFxuXHRcdFx0ZCA9IGN1cnJlbnREYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuXHRcdGlmIChtRGF0ZS52YWx1ZU9mKCkgPiBkKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRsZXQgY2hlY2sgPSAoZGF5LCBtb250aCwgeWVhcikgPT4ge1xuXHRcdGxldCB0eXBlID0gMDsgLy8geXl5eVxuXHRcdGlmIChkYXkubGVuZ3RoID4gMCkge1xuXHRcdFx0dHlwZSA9IDE7IC8vIGRkL21tL3l5eXlcblx0XHR9IGVsc2UgaWYgKGRheS5sZW5ndGggPD0gMCAmJiBtb250aC5sZW5ndGggPiAwKSB7XG5cdFx0XHR0eXBlID0gMjsgLy8gbW0veXl5eVxuXHRcdH1cblxuXHRcdGlmICh0eXBlID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gY2hlY2tZZWFyKHllYXIpO1xuXHRcdH1cblx0XHRpZiAodHlwZSA9PT0gMSkge1xuXHRcdFx0bGV0IHZZZWFyID0gY2hlY2tZZWFyKHllYXIpO1xuXHRcdFx0aWYgKCF2WWVhcikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIGNoZWNrRnVsbERhdGUoZGF5LCBtb250aCwgeWVhcik7XG5cdFx0fVxuXHRcdGlmICh0eXBlID09PSAyKSB7XG5cdFx0XHRyZXR1cm4gY2hlY2tNb250aFllYXIobW9udGgsIHllYXIpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gY2hlY2soZGF5LCBtb250aCwgeWVhcik7XG59XG5cbi8qKlxuICogdmFsaWRhdGUgbmfDoHkgaOG7o3AgbOG7h1xuICogQGF1dGhvciB0aGFuaC5iYXkgMjAxOC0wOS0yNSAxMTozMFxuICogQHBhcmFtICB7c3RyaW5nfSBkYXRlXG4gKiBAcGFyYW0gIHtCb29sZWFufSBmb3JtYXQsIGZvcm1hdCA9PT0gdHJ1ZSB0aMOsIGNoZWNrIHRoZW8geU1kIG5nxrDhu6NjIGzhuqFpIGRNeVxuICovXG5MaWJzLnZhbGlkYXRlRGF0ZSA9IGZ1bmN0aW9uIChkYXRlLCBmb3JtYXQpIHtcblx0Ly8gS2nhu4NtIHRyYSB0aGVvIGZvcm1hdCBkZC9NTS95eXl5IGhv4bq3YyBkZC1NTS15eXl5XG5cdHZhciBSRUdfREFURV9ETVkgPSAvXigwP1sxLTldfFsxMl1bMC05XXwzWzAxXSlbXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXVxcZHs0fSQvO1xuXHQvLyBLaeG7g20gdHJhIHRoZW8gZm9ybWF0IGRkL01NL3l5eXkgaG/hurdjIHl5eXktTU0tZGRcblx0dmFyIFJFR19EQVRFX1lNRCA9IC9eKFxcZHs0fSlbXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuXHR2YXIgZGF0ZWZvcm1hdCA9IFJFR19EQVRFX0RNWTtcblx0aWYgKHR5cGVvZiBmb3JtYXQgIT09ICd1bmRlZmluZWQnICYmIGZvcm1hdCA9PSB0cnVlKSB7XG5cdFx0dmFyIGRhdGVmb3JtYXQgPSBSRUdfREFURV9ZTUQ7XG5cdH1cblxuXHQvLyBNYXRjaCB0aGUgZGF0ZSBmb3JtYXQgdGhyb3VnaCByZWd1bGFyIGV4cHJlc3Npb25cblx0aWYgKGRhdGUubWF0Y2goZGF0ZWZvcm1hdCkpIHtcblx0XHQvL1Rlc3Qgd2hpY2ggc2VwZXJhdG9yIGlzIHVzZWQgJy8nIG9yICctJ1xuXHRcdHZhciBvcGVyYTEgPSBkYXRlLnNwbGl0KCcvJyk7XG5cdFx0dmFyIG9wZXJhMiA9IGRhdGUuc3BsaXQoJy0nKTtcblx0XHR2YXIgbG9wZXJhMSA9IG9wZXJhMS5sZW5ndGg7XG5cdFx0dmFyIGxvcGVyYTIgPSBvcGVyYTIubGVuZ3RoO1xuXHRcdC8vIEV4dHJhY3QgdGhlIHN0cmluZyBpbnRvIG1vbnRoLCBkYXRlIGFuZCB5ZWFyXG5cdFx0aWYgKGxvcGVyYTEgPiAxKSB7XG5cdFx0XHR2YXIgcGRhdGUgPSBkYXRlLnNwbGl0KCcvJyk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGxvcGVyYTIgPiAxKSB7XG5cdFx0XHR2YXIgcGRhdGUgPSBkYXRlLnNwbGl0KCctJyk7XG5cdFx0fVxuXHRcdHZhciBkZCA9IHBhcnNlSW50KHBkYXRlWzBdKTtcblx0XHR2YXIgbW0gPSBwYXJzZUludChwZGF0ZVsxXSk7XG5cdFx0dmFyIHl5ID0gcGFyc2VJbnQocGRhdGVbMl0pO1xuXHRcdC8vIENyZWF0ZSBsaXN0IG9mIGRheXMgb2YgYSBtb250aCBbYXNzdW1lIHRoZXJlIGlzIG5vIGxlYXAgeWVhciBieSBkZWZhdWx0XVxuXHRcdHZhciBMaXN0b2ZEYXlzID0gWzMxLCAyOCwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdO1xuXHRcdGlmIChtbSA9PSAxIHx8IG1tID4gMikge1xuXHRcdFx0aWYgKGRkID4gTGlzdG9mRGF5c1ttbSAtIDFdKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobW0gPT0gMikge1xuXHRcdFx0dmFyIGx5ZWFyID0gZmFsc2U7XG5cdFx0XHRpZiAoKCEoeXkgJSA0KSAmJiB5eSAlIDEwMCkgfHwgISh5eSAlIDQwMCkpIHtcblx0XHRcdFx0bHllYXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKChseWVhciA9PSBmYWxzZSkgJiYgKGRkID49IDI5KSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAoKGx5ZWFyID09IHRydWUpICYmIChkZCA+IDI5KSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbkxpYnMuaXNOdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0dHJ5IHtcblx0XHR2YXIgdmFsID0gdmFsdWU7XG5cdFx0aWYgKHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnIHx8IHZhbCA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdFx0aWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG5cdFx0XHR2YWwgPSB2YWwudG9TdHJpbmcoKTtcblx0XHR9XG5cdFx0dmFsID0gdmFsLnJlcGxhY2UoL14tLywgJycpO1xuXHRcdHJldHVybiAvXlswLTlcXGJdKyQvLnRlc3QodmFsKTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuTGlicy5nZXRDdXJyZW50TWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgZCA9IG5ldyBEYXRlKCk7XG5cdHJldHVybiBkLmdldFRpbWUoKTtcbn1cbi8qKlxuICogTGF5IG5nYXkgaGllbiB0YWkgdGhlbyBmb3JtYXQgU3RyaW5nXG4gKi9cbkxpYnMuZ2V0Q3VycmVudERhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0U3RyaW5nKSB7XG5cdGxldCBub3cgPSBuZXcgRGF0ZSgpO1xuXHRmb3JtYXRTdHJpbmcgPSBmb3JtYXRTdHJpbmcudG9VcHBlckNhc2UoKTtcblx0bGV0IHN0ciA9IGRhdGUuZm9ybWF0KG5vdywgZm9ybWF0U3RyaW5nKTtcblx0cmV0dXJuIHN0cjtcbn1cblxuTGlicy5ncm91cEJ5UHJvcHMgPSBmdW5jdGlvbiAob2JqZWN0QXJyYXksIHByb3BlcnR5KSB7XG5cdHJldHVybiBvYmplY3RBcnJheS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgb2JqKSB7XG5cdFx0dmFyIGtleSA9IG9ialtwcm9wZXJ0eV07XG5cdFx0aWYgKCFhY2Nba2V5XSkge1xuXHRcdFx0YWNjW2tleV0gPSBbXTtcblx0XHR9XG5cdFx0YWNjW2tleV0ucHVzaChvYmopO1xuXHRcdHJldHVybiBhY2M7XG5cdH0sIHt9KTtcbn1cblxuLyoqXG4gKiBM4bqleSB04bqldCBj4bqjIHZhbHVlIHRoZW8gcHJvcGVydHkgdHJvbmcgYXJyYXkgb2JqZWN0IChi4buPIHF1YSBuaOG7r25nIHZhbHVlIG7DoG8gbMOgIG51bGwsIGVtcHR5IGhv4bq3YyB1bmRlZmluZWQpXG4gKiBAYXV0aG9yIHRoYW5oLmJheSAyMDE4LTExLTI5XG4gKiBAcGFyYW0gIHtBcnJheX0gb2JqZWN0QXJyYXlcbiAqIEBwYXJhbSAge1N0cmluZ30gcHJvcGVydHlcbiAqL1xuTGlicy5nZXRWYWx1ZXNBcnJheUJ5UHJvcCA9IGZ1bmN0aW9uIChvYmplY3RBcnJheSwgcHJvcGVydHkpIHtcblx0aWYgKCFBcnJheS5pc0FycmF5KG9iamVjdEFycmF5KSkgcmV0dXJuIFtdO1xuXHR2YXIgdmFsdWVzID0gW107XG5cdGZvciAobGV0IGtleSBpbiBvYmplY3RBcnJheSkge1xuXHRcdGxldCBpdGVtID0gb2JqZWN0QXJyYXlba2V5XSxcblx0XHRcdHZhbHVlID0gaXRlbVtwcm9wZXJ0eV07XG5cblx0XHRpZiAoKGl0ZW0gJiYgdmFsdWUpIHx8IHZhbHVlID09ICcwJykge1xuXHRcdFx0dmFsdWVzLnB1c2godmFsdWUpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdmFsdWVzO1xufVxuXG4vKipcbiAqIHN0cmluZyBmb3JtYXRcbiAqIHZkOiBsZXQgYSA9IExpYnMuc3RyaW5nQXNzaWduKFwiaGVsbG8gJDwwPiAkPDE+XCIsIFtcIndvcmxkXCIsXCJycnJcIl0pXG4gKiBAcGFyYW0ge3N0cmluZyB0ZW1wbGF0ZX0gc3RyIFxuICogQHBhcmFtIHtBcnJheX0gZGF0YSBcbiAqIEBwYXJhbSB7cmVnZXh9IFJFR19BU1NJR05fVkFSSUJMRSBcbiAqL1xuTGlicy5zdHJpbmdBc3NpZ24gPSBmdW5jdGlvbiAoc3RyLCBkYXRhLCBSRUdfQVNTSUdOX1ZBUklCTEUpIHtcblx0aWYgKExpYnMuaXNCbGFuayhSRUdfQVNTSUdOX1ZBUklCTEUpKSB7XG5cdFx0UkVHX0FTU0lHTl9WQVJJQkxFID0gL1xcJFxcPChbXnt9XSo/KVxcPi9nO1xuXHR9XG5cdHJldHVybiBzdHIucmVwbGFjZShSRUdfQVNTSUdOX1ZBUklCTEUsIGZ1bmN0aW9uICgkMCwgJDEpIHtcblx0XHRyZXR1cm4gU3RyaW5nKGRhdGFbJDFdKTtcblx0fSk7XG59O1xuLyoqXG4gKiBUw61uaCB0deG7lWkgY+G7p2EgXG4gKiBAcGFyYW0gZGF0ZVN0cmluZyA6IGRkL21tL3l5eXlcbiAqL1xuTGlicy5jYWxjdWxhdGVBZ2VTdHJpbmcgPSBmdW5jdGlvbiAoZGF0ZVN0cmluZykge1xuXHR2YXIgYWdlID0ge307XG5cdGlmICh0eXBlb2YgZGF0ZVN0cmluZyAhPT0gJ3N0cmluZycgfHwgZGF0ZVN0cmluZy5sZW5ndGggPD0gMCkgcmV0dXJuIFwiXCI7XG5cblx0dmFyIGFycmF5QmlydGhkYXkgPSBkYXRlU3RyaW5nLnNwbGl0KFwiL1wiKSxcblx0XHRkYXkgPSBcIlwiLFxuXHRcdG1vbnRoID0gXCJcIixcblx0XHR5ZWFyID0gXCJcIixcblx0XHR5ZWFyU3RyaW5nID0gXCJcIixcblx0XHRtb250aFN0cmluZyA9IFwiXCIsXG5cdFx0ZGF5U3RyaW5nID0gXCJcIixcblx0XHRhZ2VTdHJpbmcgPSBcIlwiO1xuXG5cdGlmIChhcnJheUJpcnRoZGF5Lmxlbmd0aCA9PSAzKSB7XG5cdFx0ZGF5ID0gYXJyYXlCaXJ0aGRheVswXTtcblx0XHRtb250aCA9IGFycmF5QmlydGhkYXlbMV07XG5cdFx0eWVhciA9IGFycmF5QmlydGhkYXlbMl07XG5cdH0gZWxzZSBpZiAoYXJyYXlCaXJ0aGRheS5sZW5ndGggPT0gMikge1xuXHRcdG1vbnRoID0gYXJyYXlCaXJ0aGRheVswXTtcblx0XHR5ZWFyID0gYXJyYXlCaXJ0aGRheVsxXTtcblx0fSBlbHNlIGlmIChhcnJheUJpcnRoZGF5Lmxlbmd0aCA9PSAxKSB7XG5cdFx0eWVhciA9IGFycmF5QmlydGhkYXlbMF07XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblx0aWYgKHRoaXMuaXNCbGFuayhkYXkpKSB7XG5cdFx0ZGF5ID0gXCIwMVwiO1xuXHR9XG5cdGlmICh0aGlzLmlzQmxhbmsobW9udGgpKSB7XG5cdFx0bW9udGggPSBcIjAxXCI7XG5cdH1cblx0aWYgKHRoaXMuaXNCbGFuayh5ZWFyKSkge1xuXHRcdGRheSA9IFwiMTkwMFwiO1xuXHR9XG5cdGRhdGVTdHJpbmcgPSBbZGF5LCBtb250aCwgeWVhcl0uam9pbihcIi9cIik7XG5cdGFnZSA9IExpYnMuY2FsY3VsYXRlQWdlKGRhdGVTdHJpbmcpO1xuXHRpZiAoYWdlLnllYXJzID4gMSkgeWVhclN0cmluZyA9IFwiIHR14buVaVwiO1xuXHRlbHNlIHllYXJTdHJpbmcgPSBcIiB0deG7lWlcIjtcblx0aWYgKGFnZS5tb250aHMgPiAxKSBtb250aFN0cmluZyA9IFwiIHRow6FuZ1wiO1xuXHRlbHNlIG1vbnRoU3RyaW5nID0gXCIgdGjDoW5nXCI7XG5cdGlmIChhZ2UuZGF5cyA+IDEpIGRheVN0cmluZyA9IFwiIG5nw6B5XCI7XG5cdGVsc2UgZGF5U3RyaW5nID0gXCIgbmfDoHlcIjtcblx0aWYgKChhZ2UueWVhcnMgPiAwKSAmJiAoYWdlLm1vbnRocyA+IDApICYmIChhZ2UuZGF5cyA+IDApKVxuXHRcdGFnZVN0cmluZyA9IGFnZS55ZWFycyArIHllYXJTdHJpbmcgKyBcIiwgXCIgKyBhZ2UubW9udGhzICsgbW9udGhTdHJpbmcgKyBcIiBcIiArIGFnZS5kYXlzICsgZGF5U3RyaW5nO1xuXHQvLyBhZ2VTdHJpbmcgPSBhZ2UubW9udGhzICsgbW9udGhTdHJpbmcgKyBcIiB2w6AgXCIgKyBhZ2UuZGF5cyArIGRheVN0cmluZztcblx0ZWxzZSBpZiAoKGFnZS55ZWFycyA9PSAwKSAmJiAoYWdlLm1vbnRocyA9PSAwKSAmJiAoYWdlLmRheXMgPiAwKSlcblx0XHRhZ2VTdHJpbmcgPSBhZ2UuZGF5cyArIGRheVN0cmluZztcblx0ZWxzZSBpZiAoKGFnZS55ZWFycyA9PSAwKSAmJiAoYWdlLm1vbnRocyA9PSAwKSAmJiAoYWdlLmRheXMgPT0gMCkpXG5cdFx0YWdlU3RyaW5nID0gXCIxXCIgKyBkYXlTdHJpbmc7XG5cdGVsc2UgaWYgKChhZ2UueWVhcnMgPiAwKSAmJiAoYWdlLm1vbnRocyA9PSAwKSAmJiAoYWdlLmRheXMgPT0gMCkpXG5cdFx0YWdlU3RyaW5nID0gYWdlLnllYXJzICsgeWVhclN0cmluZztcblx0Ly8gYWdlU3RyaW5nID0gXCJcIjtcblx0ZWxzZSBpZiAoKGFnZS55ZWFycyA+IDApICYmIChhZ2UubW9udGhzID4gMCkgJiYgKGFnZS5kYXlzID09IDApKVxuXHRcdGFnZVN0cmluZyA9IGFnZS55ZWFycyArIHllYXJTdHJpbmcgKyBcIiBcIiArIGFnZS5tb250aHMgKyBtb250aFN0cmluZztcblx0Ly8gYWdlU3RyaW5nID0gYWdlLm1vbnRocyArIG1vbnRoU3RyaW5nO1xuXHRlbHNlIGlmICgoYWdlLnllYXJzID09IDApICYmIChhZ2UubW9udGhzID4gMCkgJiYgKGFnZS5kYXlzID4gMCkpXG5cdFx0YWdlU3RyaW5nID0gYWdlLm1vbnRocyArIG1vbnRoU3RyaW5nICsgXCIgXCIgKyBhZ2UuZGF5cyArIGRheVN0cmluZztcblx0ZWxzZSBpZiAoKGFnZS55ZWFycyA+IDApICYmIChhZ2UubW9udGhzID09IDApICYmIChhZ2UuZGF5cyA+IDApKVxuXHRcdGFnZVN0cmluZyA9IGFnZS55ZWFycyArIHllYXJTdHJpbmcgKyBcIiBcIiArIGFnZS5kYXlzICsgZGF5U3RyaW5nO1xuXHQvLyBhZ2VTdHJpbmcgPSBhZ2UuZGF5cyArIGRheVN0cmluZztcblx0ZWxzZSBpZiAoKGFnZS55ZWFycyA9PSAwKSAmJiAoYWdlLm1vbnRocyA+IDApICYmIChhZ2UuZGF5cyA9PSAwKSlcblx0XHRhZ2VTdHJpbmcgPSBhZ2UuZGF5cyArIGRheVN0cmluZztcblx0ZWxzZSBhZ2VTdHJpbmcgPSBcIlwiO1xuXHRyZXR1cm4gYWdlU3RyaW5nO1xufVxuLyoqXG4gKiBUw61uaCB0deG7lWkgY+G7p2EgXG4gKiBAcGFyYW0gZGF0ZVN0cmluZyA6IGRkL21tL3l5eXlcbiAqL1xuTGlicy5jYWxjdWxhdGVBZ2UgPSBmdW5jdGlvbiAoZGF0ZVN0cmluZykge1xuXHR2YXIgbm93ID0gbmV3IERhdGUoKTtcblx0dmFyIHRvZGF5ID0gbmV3IERhdGUobm93LmdldFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCkpO1xuXHR2YXIgeWVhck5vdyA9IG5vdy5nZXRZZWFyKCk7XG5cdHZhciBtb250aE5vdyA9IG5vdy5nZXRNb250aCgpO1xuXHR2YXIgZGF0ZU5vdyA9IG5vdy5nZXREYXRlKCk7XG5cdHZhciBzdHJTcGxpdCA9IGRhdGVTdHJpbmcuc3BsaXQoJy8nKTtcblx0dmFyIGRvYiA9IG5ldyBEYXRlKHN0clNwbGl0WzJdLCBzdHJTcGxpdFsxXSAtIDEsIHN0clNwbGl0WzBdKTtcblx0dmFyIHllYXJEb2IgPSBkb2IuZ2V0WWVhcigpO1xuXHR2YXIgbW9udGhEb2IgPSBkb2IuZ2V0TW9udGgoKTtcblx0dmFyIGRhdGVEb2IgPSBkb2IuZ2V0RGF0ZSgpO1xuXHR2YXIgYWdlID0ge307XG5cdHZhciB5ZWFyQWdlID0geWVhck5vdyAtIHllYXJEb2I7XG5cdGlmIChtb250aE5vdyA+PSBtb250aERvYilcblx0XHR2YXIgbW9udGhBZ2UgPSBtb250aE5vdyAtIG1vbnRoRG9iO1xuXHRlbHNlIHtcblx0XHR5ZWFyQWdlLS07XG5cdFx0dmFyIG1vbnRoQWdlID0gMTIgKyBtb250aE5vdyAtIG1vbnRoRG9iO1xuXHR9XG5cblx0aWYgKGRhdGVOb3cgPj0gZGF0ZURvYilcblx0XHR2YXIgZGF0ZUFnZSA9IGRhdGVOb3cgLSBkYXRlRG9iO1xuXHRlbHNlIHtcblx0XHRtb250aEFnZS0tO1xuXHRcdHZhciBkYXRlQWdlID0gMzEgKyBkYXRlTm93IC0gZGF0ZURvYjtcblx0XHRpZiAobW9udGhBZ2UgPCAwKSB7XG5cdFx0XHRtb250aEFnZSA9IDExO1xuXHRcdFx0eWVhckFnZS0tO1xuXHRcdH1cblx0fVxuXHRhZ2UgPSB7XG5cdFx0eWVhcnM6IHllYXJBZ2UsXG5cdFx0bW9udGhzOiBtb250aEFnZSxcblx0XHRkYXlzOiBkYXRlQWdlXG5cdH07XG5cdHJldHVybiBhZ2U7XG59XG4vKipcbiAqIEJ1aWxkIHRow7RuZyB0aW4gYuG7h25oIG5ow6JuLCB0w61uaCB0deG7lWkgKyDEkeG7i2EgY2jhu4lcbiAqIEBwYXJhbSB7cGF0aWVudEVuaXR5fSBwYXRpZW50RW5pdHkgXG4gKi9cbkxpYnMuYnVpbGRQYXRpZW50SW5mbyA9IGZ1bmN0aW9uIChwYXRpZW50RW5pdHkpIHtcblx0Ly8gZm9ybWF0IGRhdGEgYmVmb3JlIGRpc3BsYXkgXG5cdHBhdGllbnRFbml0eS5zZXhfaWQgPSBwYXRpZW50RW5pdHkuc2V4O1xuXHRpZiAoIUxpYnMuaXNCbGFuayhwYXRpZW50RW5pdHkuc2V4KSkge1xuXHRcdHBhdGllbnRFbml0eS5zZXhfbnVtID0gcGF0aWVudEVuaXR5LnNleDtcblx0XHRpZiAocGF0aWVudEVuaXR5LnNleCA9PSBDb25zdGFudHMuZ2VuZGVyLm1hbGUpIHtcblx0XHRcdHBhdGllbnRFbml0eS5zZXggPSBpMThuLl9fKFwiZ2VuZGVyLm1hbGVcIik7XG5cdFx0fSBlbHNlIGlmIChwYXRpZW50RW5pdHkuc2V4ID09IENvbnN0YW50cy5nZW5kZXIuZmVtYWxlKSB7XG5cdFx0XHRwYXRpZW50RW5pdHkuc2V4ID0gaTE4bi5fXyhcImdlbmRlci5mZW1hbGVcIik7XG5cdFx0fSBlbHNlIGlmIChwYXRpZW50RW5pdHkuc2V4ID09IENvbnN0YW50cy5nZW5kZXIudW5rbm93bikge1xuXHRcdFx0cGF0aWVudEVuaXR5LnNleCA9IGkxOG4uX18oXCJnZW5kZXIudW5rbm93blwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGF0aWVudEVuaXR5LnNleCA9IFwiXCI7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHBhdGllbnRFbml0eS5zZXggPSBcIlwiO1xuXHRcdHBhdGllbnRFbml0eS5zZXhfbnVtID0gLTE7XG5cdH1cblx0cGF0aWVudEVuaXR5LnNleF9uYW1lID0gcGF0aWVudEVuaXR5LnNleDtcblxuXHRpZiAoIUxpYnMuaXNCbGFuayhwYXRpZW50RW5pdHkuYmlydGhkYXlfZGF5KSkge1xuXHRcdHZhciBiaXJ0aGRheV9kYXkgPSBwYXRpZW50RW5pdHkuYmlydGhkYXlfZGF5O1xuXHRcdHBhdGllbnRFbml0eS5iaXJ0aGRheV9kYXkgPSBiaXJ0aGRheV9kYXkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIik7XG5cdH1cblx0aWYgKCFMaWJzLmlzQmxhbmsocGF0aWVudEVuaXR5LmJpcnRoZGF5X21vbnRoKSkge1xuXHRcdHZhciBiaXJ0aGRheV9tb250aCA9IHBhdGllbnRFbml0eS5iaXJ0aGRheV9tb250aDtcblx0XHRwYXRpZW50RW5pdHkuYmlydGhkYXlfbW9udGggPSBiaXJ0aGRheV9tb250aC50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcblx0fVxuXHRpZiAoIUxpYnMuaXNCbGFuayhwYXRpZW50RW5pdHkuYmlydGhkYXlfeWVhcikpIHtcblx0XHR2YXIgYmlydGhkYXlfeWVhciA9IHBhdGllbnRFbml0eS5iaXJ0aGRheV95ZWFyO1xuXHRcdHBhdGllbnRFbml0eS5iaXJ0aGRheV95ZWFyID0gYmlydGhkYXlfeWVhci50b1N0cmluZygpLnBhZFN0YXJ0KDQsIFwiMFwiKTtcblx0fVxuXG5cdHZhciBhcnJheUJpcnRoZGF5ID0gW3BhdGllbnRFbml0eS5iaXJ0aGRheV9kYXksIHBhdGllbnRFbml0eS5iaXJ0aGRheV9tb250aCwgcGF0aWVudEVuaXR5LmJpcnRoZGF5X3llYXJdLFxuXHRcdGZpbHRlckFycmF5QmlydGhkYXkgPSBhcnJheUJpcnRoZGF5LmZpbHRlcihpdGVtID0+IHsgcmV0dXJuICFMaWJzLmlzQmxhbmsoaXRlbSkgfSk7XG5cdGlmICgoZmlsdGVyQXJyYXlCaXJ0aGRheS5sZW5ndGggPiAwKSB8fCBMaWJzLmlzQmxhbmsocGF0aWVudEVuaXR5LmJpcnRoZGF5KSkge1xuXHRcdHBhdGllbnRFbml0eS5iaXJ0aGRheSA9IGZpbHRlckFycmF5QmlydGhkYXkuam9pbihcIi9cIik7XG5cdH1cblxuXG5cdGlmICghTGlicy5pc0JsYW5rKHBhdGllbnRFbml0eS5yZWFsX2JpcnRoZGF5X2RheSkpIHtcblx0XHR2YXIgcmVhbF9iaXJ0aGRheV9kYXkgPSBwYXRpZW50RW5pdHkucmVhbF9iaXJ0aGRheV9kYXk7XG5cdFx0cGF0aWVudEVuaXR5LnJlYWxfYmlydGhkYXlfZGF5ID0gcmVhbF9iaXJ0aGRheV9kYXkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIik7XG5cdH1cblx0aWYgKCFMaWJzLmlzQmxhbmsocGF0aWVudEVuaXR5LnJlYWxfYmlydGhkYXlfbW9udGgpKSB7XG5cdFx0dmFyIHJlYWxfYmlydGhkYXlfbW9udGggPSBwYXRpZW50RW5pdHkucmVhbF9iaXJ0aGRheV9tb250aDtcblx0XHRwYXRpZW50RW5pdHkucmVhbF9iaXJ0aGRheV9tb250aCA9IHJlYWxfYmlydGhkYXlfbW9udGgudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIik7XG5cdH1cblx0aWYgKCFMaWJzLmlzQmxhbmsocGF0aWVudEVuaXR5LnJlYWxfYmlydGhkYXlfeWVhcikpIHtcblx0XHR2YXIgcmVhbF9iaXJ0aGRheV95ZWFyID0gcGF0aWVudEVuaXR5LnJlYWxfYmlydGhkYXlfeWVhcjtcblx0XHRwYXRpZW50RW5pdHkucmVhbF9iaXJ0aGRheV95ZWFyID0gcmVhbF9iaXJ0aGRheV95ZWFyLnRvU3RyaW5nKCkucGFkU3RhcnQoNCwgXCIwXCIpO1xuXHR9XG5cblx0dmFyIGFycmF5UmVhbEJpcnRoZGF5ID0gW3BhdGllbnRFbml0eS5yZWFsX2JpcnRoZGF5X2RheSwgcGF0aWVudEVuaXR5LnJlYWxfYmlydGhkYXlfbW9udGgsIHBhdGllbnRFbml0eS5yZWFsX2JpcnRoZGF5X3llYXJdLFxuXHRcdGZpbHRlckFycmF5UmVhbEJpcnRoZGF5ID0gYXJyYXlSZWFsQmlydGhkYXkuZmlsdGVyKGl0ZW0gPT4geyByZXR1cm4gIUxpYnMuaXNCbGFuayhpdGVtKSB9KTtcblx0aWYgKChmaWx0ZXJBcnJheVJlYWxCaXJ0aGRheS5sZW5ndGggPiAwKSB8fCBMaWJzLmlzQmxhbmsocGF0aWVudEVuaXR5LnJlYWxfYmlydGhkYXkpKSB7XG5cdFx0cGF0aWVudEVuaXR5LnJlYWxfYmlydGhkYXkgPSBmaWx0ZXJBcnJheVJlYWxCaXJ0aGRheS5qb2luKFwiL1wiKTtcblx0XHRwYXRpZW50RW5pdHkuZnVsbF9yZWFsX2JpcnRoZGF5ID0gZmlsdGVyQXJyYXlSZWFsQmlydGhkYXkuam9pbihcIi9cIik7XG5cdH0gZWxzZSB7XG5cdFx0cGF0aWVudEVuaXR5LmZ1bGxfcmVhbF9iaXJ0aGRheSA9IHBhdGllbnRFbml0eS5yZWFsX2JpcnRoZGF5O1xuXHR9XG5cblxuXG5cdC8vdGluaCB0deG7lWkgYuG7h25oIG5ow6JuXG5cdHBhdGllbnRFbml0eS5hZ2UgPSBMaWJzLmNhbGN1bGF0ZUFnZVN0cmluZyhwYXRpZW50RW5pdHkuYmlydGhkYXkpO1xuXHQvL1TDrW5oIHR14buVaSB0aOG6rXQgYuG7h25oIG5ow6JuXG5cdHBhdGllbnRFbml0eS5yZWFsX2FnZSA9IExpYnMuY2FsY3VsYXRlQWdlU3RyaW5nKHBhdGllbnRFbml0eS5yZWFsX2JpcnRoZGF5KTtcblx0dmFyIHBob25lID0gW107XG5cdGlmICghTGlicy5pc0JsYW5rKHBhdGllbnRFbml0eS5waG9uZSkpIHtcblx0XHRpZiAodHlwZW9mIHBhdGllbnRFbml0eS5waG9uZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHBob25lID0gcGF0aWVudEVuaXR5LnBob25lLnNwbGl0KFwiLFwiKTtcblx0XHR9XG5cdH1cblx0cGF0aWVudEVuaXR5LnBob25lID0gcGhvbmU7XG5cdHBhdGllbnRFbml0eSA9IExpYnMuYnVpbGRBZGRyZXNzUGF0aWVudChwYXRpZW50RW5pdHkpO1xuXHRyZXR1cm4gcGF0aWVudEVuaXR5O1xufTtcbi8qKlxuICogQnVpbGQgZGlhIGNoaSBj4bunYSBi4buHbmggbmjDom5cbiAqL1xuTGlicy5idWlsZEFkZHJlc3NQYXRpZW50ID0gZnVuY3Rpb24gKHBhdGllbnRFbml0eSkge1xuXHQvL0J1aWxkIMSR4buLYSBjaOG7iSB0aMaw4budbmcgdHLDulxuXHR2YXIgYWRkcmVzcyA9ICghTGlicy5pc0JsYW5rKHBhdGllbnRFbml0eS5hZGRyZXNzKSkgPyBwYXRpZW50RW5pdHkuYWRkcmVzcyA6IFwiXCI7XG5cdGFkZHJlc3MgPSAoIUxpYnMuaXNCbGFuayhwYXRpZW50RW5pdHkud2FyZF9uYW1lKSkgPyBhZGRyZXNzICsgKCFMaWJzLmlzQmxhbmsoYWRkcmVzcykgPyBcIiwgXCIgOiBcIlwiKSArIHBhdGllbnRFbml0eS53YXJkX25hbWUgOiBhZGRyZXNzO1xuXHRhZGRyZXNzID0gKCFMaWJzLmlzQmxhbmsocGF0aWVudEVuaXR5LmRpc3RyaWN0X25hbWUpKSA/IGFkZHJlc3MgKyAoIUxpYnMuaXNCbGFuayhhZGRyZXNzKSA/IFwiLCBcIiA6IFwiXCIpICsgcGF0aWVudEVuaXR5LmRpc3RyaWN0X25hbWUgOiBhZGRyZXNzO1xuXHRhZGRyZXNzID0gKCFMaWJzLmlzQmxhbmsocGF0aWVudEVuaXR5LmNpdHlfbmFtZSkpID8gYWRkcmVzcyArICghTGlicy5pc0JsYW5rKGFkZHJlc3MpID8gXCIsIFwiIDogXCJcIikgKyBwYXRpZW50RW5pdHkuY2l0eV9uYW1lIDogYWRkcmVzcztcblx0YWRkcmVzcyA9ICghTGlicy5pc0JsYW5rKHBhdGllbnRFbml0eS5jb3VudHJ5X25hbWUpKSA/IGFkZHJlc3MgKyAoIUxpYnMuaXNCbGFuayhhZGRyZXNzKSA/IFwiLCBcIiA6IFwiXCIpICsgcGF0aWVudEVuaXR5LmNvdW50cnlfbmFtZSA6IGFkZHJlc3M7XG5cblx0cGF0aWVudEVuaXR5LmFkZHJlc3MgPSBhZGRyZXNzO1xuXHQvL0J1aWxkIGRpYSBjaGkgdOG6oW0gdHLDulxuXHR2YXIgYWRkcmVzczEgPSAoIUxpYnMuaXNCbGFuayhwYXRpZW50RW5pdHkuYWRkcmVzczEpKSA/IHBhdGllbnRFbml0eS5hZGRyZXNzMSA6IFwiXCI7XG5cdGFkZHJlc3MxID0gKCFMaWJzLmlzQmxhbmsocGF0aWVudEVuaXR5LndhcmRfbmFtZTEpKSA/IGFkZHJlc3MxICsgKCFMaWJzLmlzQmxhbmsoYWRkcmVzczEpID8gXCIsIFwiIDogXCJcIikgKyBwYXRpZW50RW5pdHkud2FyZF9uYW1lMSA6IGFkZHJlc3MxO1xuXHRhZGRyZXNzMSA9ICghTGlicy5pc0JsYW5rKHBhdGllbnRFbml0eS5kaXN0cmljdF9uYW1lMSkpID8gYWRkcmVzczEgKyAoIUxpYnMuaXNCbGFuayhhZGRyZXNzMSkgPyBcIiwgXCIgOiBcIlwiKSArIHBhdGllbnRFbml0eS5kaXN0cmljdF9uYW1lMSA6IGFkZHJlc3MxO1xuXHRhZGRyZXNzMSA9ICghTGlicy5pc0JsYW5rKHBhdGllbnRFbml0eS5jaXR5X25hbWUxKSkgPyBhZGRyZXNzMSArICghTGlicy5pc0JsYW5rKGFkZHJlc3MxKSA/IFwiLCBcIiA6IFwiXCIpICsgcGF0aWVudEVuaXR5LmNpdHlfbmFtZTEgOiBhZGRyZXNzMTtcblx0YWRkcmVzczEgPSAoIUxpYnMuaXNCbGFuayhwYXRpZW50RW5pdHkuY291bnRyeV9uYW1lMSkpID8gYWRkcmVzczEgKyAoIUxpYnMuaXNCbGFuayhhZGRyZXNzMSkgPyBcIiwgXCIgOiBcIlwiKSArIHBhdGllbnRFbml0eS5jb3VudHJ5X25hbWUxIDogYWRkcmVzczE7XG5cdHBhdGllbnRFbml0eS5hZGRyZXNzMSA9IGFkZHJlc3MxO1xuXHRyZXR1cm4gcGF0aWVudEVuaXR5O1xufVxuLyoqXG4gKkNvbnZlcnQgbW9uZXkgbnVtYmVyIHRvIFZpZXROYW0gU3RyaW5nOiDEkeG7jWMgc+G7kSB0aeG7gW5cbiAqQGF1dGhvciBNaW5oLlBoYW0gMjAxOC0xMC0yM1xuKi9cbkxpYnMubW9uZXl0b1N0cmluZyA9IGZ1bmN0aW9uICh0b3RhbCwgbGFuZyA9ICd2aScpIHtcblx0aWYgKHRvdGFsID09IDApXG5cdFx0cmV0dXJuIFwiS2jDtG5nIMSR4buTbmdcIjtcblx0dG90YWwgPSBwYXJzZUludCh0b3RhbCk7XG5cdGxldCBzTW9uZXkgPSBcIlwiO1xuXHRpZiAobGFuZyA9PSAndmknKSB7XG5cdFx0c01vbmV5ID0gTnVtYmVyVG9Xb3Jkc1ZOLmRlZmF1bHQucmVhZCh0b3RhbCk7XG5cdFx0c01vbmV5ID0gc01vbmV5ICsgXCIgxJHhu5NuZ1wiO1xuXHR9IGVsc2Uge1xuXHRcdHNNb25leSA9IE51bWJlclRvV29yZHMudG9Xb3Jkcyh0b3RhbCk7XG5cdH1cblxuXHRpZiAoc01vbmV5Lmxlbmd0aCA+IDApIHtcblx0XHRsZXQgc0JlZ2luQ2hhciA9IHNNb25leS5zdWJzdHJpbmcoMCwgMSk7XG5cdFx0c0JlZ2luQ2hhciA9IHNCZWdpbkNoYXIudG9VcHBlckNhc2UoKTtcblx0XHRzTW9uZXkgPSBzQmVnaW5DaGFyICsgc01vbmV5LnN1YnN0cmluZygxKTtcblx0fVxuXG5cdHNNb25leSA9IHNNb25leS5yZXBsYWNlKFwiICBcIiwgXCIgXCIpO1xuXHRyZXR1cm4gc01vbmV5O1xufVxuXG4vKipcbiAqIFRoZW0gemVybyBiZWZvciBudW1iZXJcbiAqL1xuTGlicy5wYWRMZWZ0ID0gZnVuY3Rpb24gKHN0ciwgbnVtYmVyLCBkaWdpdCkge1xuXHRyZXR1cm4gQXJyYXkobnVtYmVyIC0gU3RyaW5nKHN0cikubGVuZ3RoICsgMSkuam9pbihkaWdpdCB8fCAnMCcpICsgc3RyO1xufVxuLyoqXG4gKiBDb252ZXJ0IGRhdGV0aW1lKHNxbERhdGUsIGphdmFzY3JpcHQgZGF0ZSkgdG8gVk4gc3RyaW5nXG4gKiBAYXV0aG9yIE1pbmguUGhhbSAyMDE4LTEwLTIzXG4gKi9cbkxpYnMuY29udmVydERhdGVUaW1lVG9WTldvcmQgPSBmdW5jdGlvbiAoZGF0ZSkge1xuXHRkYXRlID0gbW9tZW50KGRhdGUpO1xuXHRsZXQgc3RyRGF0ZSA9IExpYnMucGFkTGVmdChkYXRlLmhvdXJzKCksIDIpICsgXCIgZ2nhu50gXCI7XG5cdHN0ckRhdGUgKz0gTGlicy5wYWRMZWZ0KGRhdGUubWludXRlcygpLCAyKSArIFwiIHBow7p0XCI7XG5cdHN0ckRhdGUgKz0gJywgIG5nw6B5ICc7XG5cdHN0ckRhdGUgKz0gTGlicy5wYWRMZWZ0KGRhdGUuZGF0ZSgpLCAyKSArIFwiIHRow6FuZyBcIjtcblx0c3RyRGF0ZSArPSBMaWJzLnBhZExlZnQoKGRhdGUubW9udGgoKSArIDEpLCAyKSArIFwiIG7Eg20gXCI7XG5cdHN0ckRhdGUgKz0gTGlicy5wYWRMZWZ0KGRhdGUueWVhcigpLCA0KTtcblx0cmV0dXJuIHN0ckRhdGU7XG59XG4vKipcbiAqIENvbnZlcnQgZGF0ZShzcWxEYXRlLCBqYXZhc2NyaXB0IGRhdGUpIHRvIFZOIHN0cmluZ1xuICogQGF1dGhvciBNaW5oLlBoYW0gMjAxOC0xMC0yM1xuICovXG5MaWJzLmNvbnZlcnREYXRlVG9WTldvcmQgPSBmdW5jdGlvbiAoZGF0ZSkge1xuXHRpZiAoIW1vbWVudChkYXRlKS5pc1ZhbGlkKCkpIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXHRkYXRlID0gbW9tZW50KGRhdGUpO1xuXHRsZXQgc3RyRGF0ZSA9ICdOZ8OgeSAnO1xuXHRzdHJEYXRlICs9IExpYnMucGFkTGVmdChkYXRlLmRhdGUoKSwgMikgKyBcIiB0aMOhbmcgXCI7XG5cdHN0ckRhdGUgKz0gTGlicy5wYWRMZWZ0KChkYXRlLm1vbnRoKCkgKyAxKSwgMikgKyBcIiBuxINtIFwiO1xuXHRzdHJEYXRlICs9IExpYnMucGFkTGVmdChkYXRlLnllYXIoKSwgNCk7XG5cdHJldHVybiBzdHJEYXRlO1xufVxuLyoqXG4gKiBDb252ZXJ0IGRhdGUoc3FsRGF0ZSwgamF2YXNjcmlwdCBkYXRlKSB0byBWTiBzdHJpbmcoZnJvbWFyIFlZWVktTU0tREQpXG4gKiBAYXV0aG9yIE1pbmguUGhhbSAyMDE4LTEwLTIzXG4gKi9cbkxpYnMuY29udmVydERhdGVUb1ZOV29yZFlZWVlNTUREID0gZnVuY3Rpb24gKGRhdGUpIHtcblx0bGV0IGFyciA9IGRhdGUuc3BsaXQoJy0nKTtcblx0bGV0IHN0ckRhdGUgPSAnTmfDoHkgJztcblx0c3RyRGF0ZSArPSBMaWJzLnBhZExlZnQoYXJyWzJdLCAyKSArIFwiIHRow6FuZyBcIjtcblx0c3RyRGF0ZSArPSBMaWJzLnBhZExlZnQoYXJyWzFdLCAyKSArIFwiIG7Eg20gXCI7XG5cdHN0ckRhdGUgKz0gTGlicy5wYWRMZWZ0KGFyclswXSwgNCk7XG5cdHJldHVybiBzdHJEYXRlO1xufVxuTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZVRvU3RyID0gKF9kYXRlLCBfZm9ybWF0KSA9PiB7XG5cdGlmIChudWxsID09IF9kYXRlIHx8IHR5cGVvZiBfZGF0ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgX2RhdGUgPT0gJycpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblx0aWYgKF9kYXRlLmluY2x1ZGVzKCcvJykpIHtcblx0XHRyZXR1cm4gX2RhdGU7XG5cdH1cblx0bGV0IGRhdGUgPSBtb21lbnQoX2RhdGUpO1xuXHRpZiAoIWRhdGUuX2lzVmFsaWQpIHtcblx0XHRyZXR1cm4gX2RhdGU7XG5cdH1cblx0cmV0dXJuIGRhdGUuZm9ybWF0KF9mb3JtYXQudG9VcHBlckNhc2UoKSk7XG59XG4vKipcbiAqIENvbnZlcnQgZGF0ZShzcWxEYXRlLCBqYXZhc2NyaXB0IGRhdGUpIHRvIFZOIHN0cmluZ1xuICogQGF1dGhvciBNaW5oLlBoYW0gMjAxOC0xMC0yM1xuICovXG5MaWJzLmNvbnZlcnREYXRlREIgPSBmdW5jdGlvbiAoZGF0ZSwgZm9ybWF0KSB7XG5cdHJldHVybiBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdCk7XG5cdC8vIGxldCBzdHJEYXRlID0gJ25nw6B5ICc7XG5cdC8vIHN0ckRhdGUgKz0gTGlicy5wYWRMZWZ0KGRhdGUuZGF0ZSgpLCAyKSArIFwiIHRow6FuZyBcIjtcblx0Ly8gc3RyRGF0ZSArPSBMaWJzLnBhZExlZnQoKGRhdGUubW9udGgoKSArIDEpLCAyKSArIFwiIG7Eg20gXCI7XG5cdC8vIHN0ckRhdGUgKz0gTGlicy5wYWRMZWZ0KGRhdGUueWVhcigpLCA0KTtcblx0Ly8gcmV0dXJuIHN0ckRhdGU7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIGNvbnZlcnQgZGF0ZSB0byBzdHJpbmdcbiAqIEBwYXJhbSB7YXJyYXl9IGRhdGEgXG4gKiBAYXV0aG9yOiBNaW5oLlBoYW1cbiAqL1xuTGlicy5jb252ZXJ0U1FMRGF0ZVRvU3RyID0gKF9kYXRlLCBfZm9ybWF0KSA9PiB7XG5cdGlmIChudWxsID09IF9kYXRlIHx8IHR5cGVvZiBfZGF0ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgX2RhdGUgPT0gJycpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHR2YXIgZGF0ZSA9IG5ldyBEYXRlKF9kYXRlKTtcblx0dmFyIHJlc3VsdCA9IExpYnMuY29udmVydERhdGVUb1N0cihkYXRlLCBfZm9ybWF0KTtcblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuTGlicy5jb252ZXJ0RGF0ZVRvU3RyID0gKF9kYXRlLCBfZm9ybWF0KSA9PiB7XG5cdGlmIChudWxsID09IF9kYXRlIHx8IHR5cGVvZiBfZGF0ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgX2RhdGUgPT0gJycpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHR2YXIgZGF5ID0gX2RhdGUuZ2V0RGF0ZSgpO1xuXHR2YXIgbW9udGggPSBfZGF0ZS5nZXRNb250aCgpO1xuXHR2YXIgeWVhciA9IF9kYXRlLmdldEZ1bGxZZWFyKCkgKyAnJztcblx0bW9udGggKz0gMTtcblx0aWYgKGRheSA8IDEwKSB7XG5cdFx0ZGF5ID0gJzAnICsgZGF5O1xuXHR9XG5cdGlmIChtb250aCA8IDEwKSB7XG5cdFx0bW9udGggPSAnMCcgKyBtb250aDtcblx0fVxuXHR2YXIgcmVzdWx0ID0gX2Zvcm1hdC50b0xvd2VyQ2FzZSgpO1xuXHRyZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnZGQnLCBkYXkpO1xuXHRyZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnbW0nLCBtb250aCk7XG5cdHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCd5eXl5JywgeWVhcik7XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qXG4gKiDEkcOzbmcgZ8OzaSBwcm9taXNlIMSR4buDIGTDuW5nIGF3YWl0IFxuICogdmQ6IGxldCB1c2VycyA9IGF3YWl0IExpYnMuY2FsbFdpdGhQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gKiBVc2VyU2VydmljZS5pbnN0YW5jZS5nZXREcm9wRG93bkxpc3Qoe30sIChhcnJEYXRhKSA9PiB7XG4gKiBcdFx0aWYoYXJyRGF0YSl7IHJlc29sdmUoYXJyRGF0YSl9XG4gKiBcdFx0ZWxzZXsgcmVqZWN0KGZhbHNlKX1cbiAqICAgIH0sIGZhbHNlKTtcbiAqIH0pO1xuICogQHBhcmFtIHtmdW5jfSBmdW5jIFxuICovXG5MaWJzLmNhbGxXaXRoUHJvbWlzZSA9IGZ1bmN0aW9uIChmdW5jKSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdGZ1bmMocmVzb2x2ZSwgcmVqZWN0KVxuXHRcdH0pXG5cdH0gY2F0Y2ggKGV4KSB7XG5cdFx0Y29uc29sZS5sb2coZXgpXG5cdFx0dGhyb3cgZXhcblx0fVxufVxuLyoqXG4gKiBLaeG7g20gdHJhIHTDqm4gZmlsZSBjw7MgdOG7k24gdOG6oWkgdHJvbmcgdGjGsCBt4bulYyBoYXkga2jDtG5nLCBu4bq/dSBjw7Mgc+G6vSB0xINuZyBsw6puIChuKykgbmfGsOG7o2MgbOG6oWkgc+G6vSBs4bqleSB0w6puIGZpbGUgY8WpXG4gKiBT4butIGThu6VuZzogTGlicy5nZXRGaWxlTmFtZShmaWxlRGlyLCBmaWxlTmFtZSwgMCk7XG4gKiBAcGFyYW0gc3RyaW5nIGZpbGVEaXI6IMSQxrDhu51uZyBk4bqrbiDEkeG6v24gdGjGsCBt4bulY1xuICogQHBhcmFtIHN0cmluZyBmaWxlTmFtZTogVMOqbiBmaWxlXG4gKiBAcGFyYW0gaW50IG51bWJlcjogc+G7kSB0xINuZyBsw6puIG7hur91IHTDqm4gZmlsZSBnaeG7kW5nIG5oYXUsIGJhbiDEkeG6p3UgZ+G7jWkgc2V0ID0gMFxuICogQHBhcmFtIHN0cmluZyBuZXdGaWxlTmFtZTogVMOqbiBmaWxlIG3hu5tpLCBraGkgZ+G7jWkga2jDtG5nIGPhuqduIHNldCBiaeG6v24gbsOgeSwgc+G7rSBk4bulbmcgxJHhu4MgbOG6pXkgdMOqbiBmaWxlIGJhbiDEkeG6p3UgZMO5bmcgxJHhu4Mga2nhu4NtIHRyYSB0w6puIGZpbGUgdOG7k24gdOG6oWlcbiAqIEBhdXRob3IgTHV5ZW5OZ3V5ZW4gMjAxOC0xMC0yOFxuICogQHJldHVybiBzdHJpbmcgZmlsZSBuYW1lXG4gKi9cbkxpYnMuZ2V0RmlsZU5hbWUgPSBmdW5jdGlvbiAoZmlsZURpciwgZmlsZU5hbWUsIG51bWJlciwgbmV3RmlsZU5hbWUpIHtcblx0dHJ5IHtcblx0XHRpZiAoIWZpbGVEaXIgfHwgIWZpbGVOYW1lKSByZXR1cm47XG5cdFx0dmFyIGxhc3RGaWxlRGlyQ2hhcmFjdGVyID0gZmlsZURpci5zbGljZSgtMSk7XG5cdFx0dmFyIGN1ckZpbGVQYXRoID0gZmlsZURpciArIFwiL1wiICsgZmlsZU5hbWU7XG5cdFx0aWYgKGxhc3RGaWxlRGlyQ2hhcmFjdGVyID09PSAnLycpIHtcblx0XHRcdGN1ckZpbGVQYXRoID0gZmlsZURpciArIGZpbGVOYW1lO1xuXHRcdH1cblx0XHRpZiAoZnMuZXhpc3RzU3luYyhjdXJGaWxlUGF0aCkpIHtcblx0XHRcdG51bWJlciA9IG51bWJlciArIDE7XG5cdFx0XHR2YXIgZmlsZU5hbWVTcGl0ID0gZmlsZU5hbWUuc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLicpO1xuXHRcdFx0dmFyIGV4dCA9IGZpbGVOYW1lLnN1YnN0cigoZmlsZU5hbWUubGFzdEluZGV4T2YoJy4nKSArIDEpKTtcblx0XHRcdHZhciBjaGVja0ZpbGVOYW1lID0gZmlsZU5hbWVTcGl0ICsgXCIoXCIgKyBudW1iZXIgKyBcIilcIiArIFwiLlwiICsgZXh0O1xuXHRcdFx0aWYgKCFuZXdGaWxlTmFtZSkge1xuXHRcdFx0XHRuZXdGaWxlTmFtZSA9IGZpbGVOYW1lU3BpdDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRjaGVja0ZpbGVOYW1lID0gbmV3RmlsZU5hbWUgKyBcIihcIiArIG51bWJlciArIFwiKVwiICsgXCIuXCIgKyBleHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gTGlicy5nZXRGaWxlTmFtZShmaWxlRGlyLCBjaGVja0ZpbGVOYW1lLCBudW1iZXIsIG5ld0ZpbGVOYW1lKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmlsZU5hbWU7XG5cdFx0fVxuXHR9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUubG9nKCdLaMO0bmcgbOG6pXkgxJHGsOG7o2MgdMOqbiBmaWxlOiAnLCBlcnJvcik7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cbi8qKlxuICogVOG6oW8gZm9sZGVyIGZ1bGxwYXRoXG4gKiBAYXV0aG9yOiBraGFuaC5sZVxuICovXG5MaWJzLm1rZGlyRm9sZGVyID0gYXN5bmMgZnVuY3Rpb24gKHBhdGgpIHtcblx0bGV0IHBhdGhzID0gcGF0aC5zcGxpdCgnLycpO1xuXHRsZXQgZnVsbFBhdGggPSAnJztcblx0dHJ5IHtcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgcGF0aHMubGVuZ3RoOyBpbmRleCsrKSB7XG5cdFx0XHRjb25zdCBmb2xkZXIgPSBwYXRoc1tpbmRleF07XG5cdFx0XHRpZiAoTGlicy5pc0JsYW5rKGZvbGRlcikpIHtcblx0XHRcdFx0ZnVsbFBhdGggPSBcIi9cIjtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZnVsbFBhdGggPT09ICcnKSB7XG5cdFx0XHRcdGZ1bGxQYXRoID0gZm9sZGVyO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKGZ1bGxQYXRoID09PSAnLycpIHtcblx0XHRcdFx0XHRmdWxsUGF0aCA9IGZ1bGxQYXRoICsgZm9sZGVyO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZ1bGxQYXRoID0gZnVsbFBhdGggKyAnLycgKyBmb2xkZXI7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0bGV0IGV4aXN0ID0gdHJ1ZTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGV4aXN0ID0gZnMuZXhpc3RzU3luYyhmdWxsUGF0aClcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0ZXhpc3QgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICghZXhpc3QpIHtcblx0XHRcdFx0ZnMubWtkaXJTeW5jKGZ1bGxQYXRoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhpcy5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuXHR9XG5cbn1cbi8qKlxuICogVXBsb2FkIGZpbGVcbiAqIEBwYXJhbSBzdHJpbmcgZmlsZVBhdGg6IMSQxrDhu51uZyBk4bqrbiDEkeG6v24gdGjGsCBt4bulYyB1cGxvYWRcbiAqIEBwYXJhbSBzdHJpbmcgZmlsZU5hbWU6IFTDqm4gZmlsZVxuICogQHBhcmFtIHN0cmluZ3xidWZmZXIgZGF0YShkYXRhWywgb3B0aW9uc10pOiBE4buvIGxp4buHdSBk4bqhbmcgU3RyaW5nIGhv4bq3YyBCdWZmZXIgxJHhu4MgZ2hpIHbDoG8gRmlsZSxcbiAqIHRyb25nIMSRw7Mgb3B0aW9uczogVGhhbSBz4buRIG7DoHkgbMOgIG3hu5l0IMSR4buRaSB0xrDhu6NuZyBnaeG7ryB7ZW5jb2RpbmcsIG1vZGUsIGZsYWd9LlxuICogVGhlbyBt4bq3YyDEkeG7i25oLCBtw6MgaMOzYSBsw6AgdXRmOCwgbW9kZSBsw6AgZ2nDoSB0cuG7iyAwNjY2IHbDoCBmbGFnIGzDoCAndydcbiAqIEBwYXJhbSBmdW5jdGlvbiBjYWxsYmFjazogbmjhuq1uIG3hu5l0IHRoYW0gc+G7kSBsw6AgZXJyIHbDoCDEkcaw4bujYyBz4butIGThu6VuZyDEkeG7gyB0cuG6oyB24buBIG3hu5l0IGzhu5dpIG7hur91IHjhuqN5IHJhIGLhuqV0IGvhu7MgbOG7l2kgbsOgbyB0cm9uZyBob+G6oXQgxJHhu5luZyBnaGkgZmlsZVxuICogQGF1dGhvciBMdXllbk5ndXllbiAyMDE4LTEwLTI4XG4gKi9cblxuXG5MaWJzLnVwbG9hZEZpbGUgPSBhc3luYyBmdW5jdGlvbiAoZmlsZVBhdGgsIGZpbGVOYW1lLCBkYXRhLCBjYWxsYmFjaykge1xuXHR0cnkge1xuXHRcdGlmICghZmlsZVBhdGggfHwgIWZpbGVOYW1lKSByZXR1cm47XG5cdFx0dmFyIGxhc3RGaWxlUGF0aENoYXJhY3RlciA9IGZpbGVQYXRoLnNsaWNlKC0xKTtcblx0XHRpZiAobGFzdEZpbGVQYXRoQ2hhcmFjdGVyID09PSAnLycpIHtcblx0XHRcdGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxlbmd0aCAtIDEpO1xuXHRcdH1cblx0XHQvL1ThuqFvIHRoxrAgbeG7pWMgdXBsb2FkIG7hur91IGNoxrBhIHThu5NuIHThuqFpXG5cdFx0bGV0IGV4aXN0ID0gdHJ1ZTtcblx0XHR0cnkge1xuXHRcdFx0ZXhpc3QgPSBmcy5zdGF0U3luYyhmaWxlUGF0aCkuaXNEaXJlY3RvcnkoKVxuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGV4aXN0ID0gZmFsc2U7XG5cdFx0fVxuXHRcdGlmICghZXhpc3QpIHtcblx0XHRcdGF3YWl0IExpYnMubWtkaXJGb2xkZXIoZmlsZVBhdGgpO1xuXHRcdH1cblx0XHR2YXIgZmlsZVVwbG9hZCA9IGZpbGVQYXRoICsgXCIvXCIgKyBmaWxlTmFtZTtcblx0XHRpZiAoY2FsbGJhY2sgJiYgdHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRmcy53cml0ZUZpbGUoZmlsZVVwbG9hZCwgZGF0YSwgZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soZXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjYWxsYmFjayh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdFx0ZnMud3JpdGVGaWxlKGZpbGVVcGxvYWQsIGRhdGEsIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGNhbGxiYWNrICYmIHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Y2FsbGJhY2soZXJyb3IpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cbn1cbi8qKlxuICogcmVtb3ZlIGZpbGVcbiAqIEBwYXJhbSBzdHJpbmcgZmlsZVBhdGg6IMSQxrDhu51uZyBk4bqrbiDEkeG6v24gdGjGsCBt4bulYyB1cGxvYWRcbiAqIEBwYXJhbSBzdHJpbmcgZmlsZU5hbWU6IFTDqm4gZmlsZVxuICogQGF1dGhvciBMdXllbk5ndXllbiAyMDE4LTEwLTI4XG4gKiBAcmV0dXJuIGJvb2xlYW5cbiAqL1xuTGlicy5yZW1vdmVGaWxlID0gZnVuY3Rpb24gKGZpbGVQYXRoLCBmaWxlTmFtZSkge1xuXHR0cnkge1xuXHRcdGlmICghZmlsZVBhdGggfHwgIWZpbGVOYW1lKSByZXR1cm47XG5cdFx0dmFyIGxhc0ZpbGVQYXRoQ2hhcmFjdGVyID0gZmlsZVBhdGguc2xpY2UoLTEpO1xuXHRcdHZhciBjdXJGaWxlUGF0aCA9IGZpbGVQYXRoICsgXCIvXCIgKyBmaWxlTmFtZTtcblx0XHRpZiAobGFzRmlsZVBhdGhDaGFyYWN0ZXIgPT09ICcvJykge1xuXHRcdFx0Y3VyRmlsZVBhdGggPSBmaWxlUGF0aCArIGZpbGVOYW1lO1xuXHRcdH1cblx0XHRpZiAoZnMuZXhpc3RzU3luYyhjdXJGaWxlUGF0aCkpIHtcblx0XHRcdGZzLnVubGlua1N5bmMoY3VyRmlsZVBhdGgpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cbkxpYnMuY2hlY2tCaXRPbk9mZiA9IChuQnl0ZSwgYml0SW5kZXgpID0+IHtcblx0bGV0IHJlc3VsdCA9IG5CeXRlICYgcGFyc2VJbnQoTWF0aC5wb3coMiwgYml0SW5kZXgpKTtcblx0cmV0dXJuIHJlc3VsdCAhPSAwID8gdHJ1ZSA6IGZhbHNlO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gS2nhu4NtIHRyYSBtw6NuZyBhcnJheSBjw7MgdOG7k24gdOG6oWkgdsOgIGPDsyBk4buvIGxp4buHdSBoYXkga2jDtG5nXG4gKiBAcGFyYW0gQXJyYXkgYXJyXG4gKiBAYXV0aG9yOiBMdXllbiBOZ3V5ZW5cbiAqIEByZXR1cm4gYm9vbGVhblxuICovXG5MaWJzLmlzQXJyYXlEYXRhID0gZnVuY3Rpb24gKGFycikge1xuXHRpZiAoTGlicy5pc0JsYW5rKGFycikpIHJldHVybiBmYWxzZTtcblx0aWYgKCFBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBmYWxzZTtcblx0cmV0dXJuIHRydWU7XG59XG4vKipcbiAqIENvbnZlcnQgRGF0YSB0byBEQlxuICovXG5MaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlID0gKF9kYXRlLCBmcm9tX2Zvcm1hdCA9IFwiREQvTU0vWVlZWSBISDptbVwiLCB0b19mb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW1cIikgPT4ge1xuXHRpZiAobnVsbCA9PSBfZGF0ZSB8fCB0eXBlb2YgX2RhdGUgPT09ICd1bmRlZmluZWQnIHx8IF9kYXRlID09ICcnKSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cdGxldCBkYXRlID0gbW9tZW50KF9kYXRlLCBmcm9tX2Zvcm1hdCk7XG5cdGlmICghZGF0ZS5faXNWYWxpZCkge1xuXHRcdHJldHVybiBfZGF0ZTtcblx0fVxuXHRyZXR1cm4gZGF0ZS5mb3JtYXQodG9fZm9ybWF0KTtcbn1cblxuLyoqXG4gKiBDaHV54buDbiBzdHJpbmcgZGF0ZSB0aMOgbmggZOG6oW5nIFlZWVlNTUREXG4gKiBAYXV0aG9yIE1pbmguUGhhbSAyMDE4LTEwLTIwXG4gKi9cbkxpYnMuY29udmVydFN0cjJEYXRlVjAyID0gKGRhdGUsIGZvcm1hdCwgX2RlbGltaXRlcikgPT4ge1xuXHRpZiAobnVsbCA9PSBkYXRlIHx8IHR5cGVvZiBkYXRlID09PSAndW5kZWZpbmVkJyB8fCBkYXRlID09ICcnKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0dmFyIGZvcm1hdExvd2VyQ2FzZSA9IGZvcm1hdC50b0xvd2VyQ2FzZSgpO1xuXHR2YXIgZm9ybWF0SXRlbXMgPSBmb3JtYXRMb3dlckNhc2Uuc3BsaXQoX2RlbGltaXRlcik7XG5cdHZhciBkYXRlSXRlbXMgPSBkYXRlLnNwbGl0KF9kZWxpbWl0ZXIpO1xuXHR2YXIgbW9udGhJbmRleCA9IGZvcm1hdEl0ZW1zLmluZGV4T2YoXCJtbVwiKTtcblx0dmFyIGRheUluZGV4ID0gZm9ybWF0SXRlbXMuaW5kZXhPZihcImRkXCIpO1xuXHR2YXIgeWVhckluZGV4ID0gZm9ybWF0SXRlbXMuaW5kZXhPZihcInl5eXlcIik7XG5cdHZhciBtb250aCA9IHBhcnNlSW50KGRhdGVJdGVtc1ttb250aEluZGV4XSk7XG5cdHJldHVybiBkYXRlSXRlbXNbeWVhckluZGV4XSArIChtb250aCkgKyBkYXRlSXRlbXNbZGF5SW5kZXhdO1xufVxuLyoqXG4gKiBBZGQgRGF5c1xuICovXG5MaWJzLmFkZERheXMgPSBmdW5jdGlvbiAoZGF0ZSwgZGF5cykge1xuXHR2YXIgcmVzdWx0ID0gbmV3IERhdGUoZGF0ZSk7XG5cdHJlc3VsdC5zZXREYXRlKHJlc3VsdC5nZXREYXRlKCkgKyBkYXlzKTtcblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBM4bqleSBhcnJheSB04burIG5nw6B5IGLhuq90IMSR4bqndSDEkeG6v24gbmfDoHkga+G6v3QgdGjDumNcbiAqIEBhdXRob3IgdGhhbmguYmF5IDIwMTktMDYtMDZcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RhcnREYXRlIChmb3JtYXQgeXl5eS1NTS1kZClcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RvcERhdGUgKGZvcm1hdCB5eXl5LU1NLWRkKVxuICogQHBhcmFtICB7c3RyaW5nfSBmb3JtYXRcbiAqL1xuTGlicy5nZXREYXRlcyA9IGZ1bmN0aW9uIChzdGFydERhdGUsIHN0b3BEYXRlLCBmb3JtYXQgPSBcIllZWVktTU0tRERcIikge1xuXHR0cnkge1xuXHRcdHZhciBkYXRlQXJyYXkgPSBbXSxcblx0XHRcdGN1cnJlbnREYXRlID0gbmV3IERhdGUoc3RhcnREYXRlKSxcblx0XHRcdHRvRGF0ZSA9IG5ldyBEYXRlKHN0b3BEYXRlKTtcblxuXHRcdHdoaWxlIChjdXJyZW50RGF0ZSA8PSB0b0RhdGUpIHtcblx0XHRcdGxldCBkYXRlID0gTGlicy5jb252ZXJ0RGF0ZVRvU3RyKGN1cnJlbnREYXRlLCBmb3JtYXQpO1xuXHRcdFx0ZGF0ZUFycmF5LnB1c2goZGF0ZSk7XG5cdFx0XHRjdXJyZW50RGF0ZSA9IExpYnMuYWRkRGF5cyhjdXJyZW50RGF0ZSwgMSk7XG5cdFx0fVxuXHRcdHJldHVybiBkYXRlQXJyYXk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5sb2coXCJMaWJzLmdldERhdGVzOlwiLCBlcnJvcik7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cbn1cblxuLyoqXG4gKiBM4bqleSBhcnJheSB04burIHRow6FuZyDEkeG6v24gdGjDoW5nXG4gKiBAYXV0aG9yIHRoYW5oLmJheSAyMDE5LTA2LTEzXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0YXJ0RGF0ZSAoZm9ybWF0IHl5eXktTU0tZGQpXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0b3BEYXRlIChmb3JtYXQgeXl5eS1NTS1kZClcbiAqIEBwYXJhbSAge3N0cmluZ30gZm9ybWF0PVwiWVlZWS1NTVwiXG4gKi9cbkxpYnMuZ2V0TW9udGhzID0gZnVuY3Rpb24gKHN0YXJ0RGF0ZSwgc3RvcERhdGUsIGZvcm1hdCA9IFwiWVlZWS1NTVwiKSB7XG5cdHRyeSB7XG5cdFx0aWYgKHR5cGVvZiBmb3JtYXQgIT09ICdzdHJpbmcnIHx8ICh0eXBlb2YgZm9ybWF0ID09PSAnc3RyaW5nJyAmJiBmb3JtYXQubGVuZ3RoIDw9IDApKSB7XG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXHRcdGZvcm1hdCA9IGZvcm1hdC50b0xvd2VyQ2FzZSgpO1xuXHRcdHZhciBtb250aEFycmF5ID0gW10sXG5cdFx0XHRlbmREYXRlID0gbmV3IERhdGUoc3RvcERhdGUpLFxuXHRcdFx0Y3VycmVudERhdGUgPSAobmV3IERhdGUoc3RhcnREYXRlICsgXCIgMDA6MDA6MDBcIikpLFxuXHRcdFx0dG9EYXRlID0gKG5ldyBEYXRlKCgoZW5kRGF0ZS5nZXRGdWxsWWVhcigpKSArIFwiLVwiICsgKGVuZERhdGUuZ2V0TW9udGgoKSArIDEpICsgXCItXCIgKyBMaWJzLmdldERheXNPZk1vbnRoKGVuZERhdGUuZ2V0RnVsbFllYXIoKSwgKGVuZERhdGUuZ2V0TW9udGgoKSArIDEpKSkgKyBcIiAwMDowMDowMFwiKSk7XG5cblx0XHR3aGlsZSAoY3VycmVudERhdGUgPD0gdG9EYXRlKSB7XG5cdFx0XHRsZXQgY3VycmVudE1vbnRoID0gKChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSkgKyBcIlwiKS5wYWRTdGFydCgyLCAnMCcpLFxuXHRcdFx0XHRjdXJyZW50WWVhciA9IGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCkgKyBcIlwiLFxuXHRcdFx0XHR2YWx1ZSA9IGZvcm1hdC5yZXBsYWNlKFwibW1cIiwgY3VycmVudE1vbnRoKS5yZXBsYWNlKFwieXl5eVwiLCBjdXJyZW50WWVhcik7XG5cdFx0XHRtb250aEFycmF5LnB1c2godmFsdWUpO1xuXHRcdFx0Y3VycmVudERhdGUgPSBuZXcgRGF0ZShjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gbW9udGhBcnJheTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmxvZyhcIkxpYnMuZ2V0TW9udGhzOlwiLCBlcnJvcik7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG4vKipcbiAqIEzhuqV5IGRhbmggc8OhY2ggbsSDbVxuICogQGF1dGhvciB0aGFuaC5iYXkgMjAxOS0wNi0xM1xuICogQHBhcmFtICB7c3RyaW5nfSBzdGFydERhdGUgKGZvcm1hdCB5eXl5LU1NLWRkKVxuICogQHBhcmFtICB7c3RyaW5nfSBzdG9wRGF0ZSAoZm9ybWF0IHl5eXktTU0tZGQpXG4gKi9cbkxpYnMuZ2V0WWVhcnMgPSBmdW5jdGlvbiAoc3RhcnREYXRlLCBzdG9wRGF0ZSkge1xuXHR0cnkge1xuXHRcdHZhciB5ZWFyQXJyYXkgPSBbXSxcblx0XHRcdGN1cnJlbnRZZWFyID0gKG5ldyBEYXRlKHN0YXJ0RGF0ZSkpLmdldEZ1bGxZZWFyKCksXG5cdFx0XHR0b1llYXIgPSAobmV3IERhdGUoc3RvcERhdGUpKS5nZXRGdWxsWWVhcigpO1xuXG5cdFx0d2hpbGUgKGN1cnJlbnRZZWFyIDw9IHRvWWVhcikge1xuXHRcdFx0eWVhckFycmF5LnB1c2goY3VycmVudFllYXIgKyBcIlwiKTtcblx0XHRcdGN1cnJlbnRZZWFyICs9IDE7XG5cdFx0fVxuXHRcdHJldHVybiB5ZWFyQXJyYXk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5sb2coXCJMaWJzLmdldFllYXJzOlwiLCBlcnJvcik7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cbn1cblxuLyoqXG4gICogZm9ybWF0IGRhdGUgdG8gYW5vdGhlciBmb3JtYXRcbiAgKiBt4bq3YyDEkeG7i25oIGtow7RuZyB0cnV54buBbiB2w7QgZnJvbSBmb3JtYXQgdGjDrCBo4buHIHRo4buRbmcgdOG7sSBuaOG6rW4gYmnhur90XG4gICogbuG6v3UgbXXhu5FuIGNow61uaCB4w6FjIHRow6wgdHJ1eeG7gW4gdsOgbyBmcm9tIGZvcm1hdFxuICAqIEBwYXJhbSB7U3RyaW5nfSBfZGF0ZSBcbiAgKiBAcGFyYW0ge1N0cmluZ30gZm9ybWF0IFxuICAqIEBwYXJhbSB7U3RyaW5nfSBmcm9tX2Zvcm1hdCBcbiAgKi9cbkxpYnMuZGF0ZUZvcm1hdCA9IChfZGF0ZSwgZm9ybWF0ID0gXCJERC9NTS9ZWVlZIEhIOm1tOnNzXCIsIGZyb21fZm9ybWF0KSA9PiB7XG5cdGlmIChudWxsID09IF9kYXRlIHx8IHR5cGVvZiBfZGF0ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgX2RhdGUgPT0gJycpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblx0bGV0IGRhdGUgPSBfZGF0ZTtcblx0aWYgKHR5cGVvZiBmcm9tX2Zvcm1hdCA9PSBcInVuZGVmaW5lZFwiIHx8IExpYnMuaXNCbGFuayhmcm9tX2Zvcm1hdCkpIHtcblx0XHRsZXQgYXJyRm9ybWF0ID0gW1wiWVlZWS9NTS9ERCBISDptbTpzc1wiLCBcIllZWVktTU0tREQgSEg6bW06c3NcIiwgXCJERC9NTS9ZWVlZIEhIOm1tOnNzXCIsIFwiREQtTU0tWVlZWSBISDptbTpzc1wiLCBcIk1NL0REL1lZWVkgSEg6bW06c3NcIiwgXCJNTS1ERC1ZWVlZIEhIOm1tOnNzXCJdXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJGb3JtYXQubGVuZ3RoOyBpKyspIHtcblx0XHRcdGRhdGUgPSBtb21lbnQoX2RhdGUsIGFyckZvcm1hdFtpXSk7XG5cdFx0XHRpZiAoZGF0ZS5faXNWYWxpZCkge1xuXHRcdFx0XHRyZXR1cm4gZGF0ZS5mb3JtYXQoZm9ybWF0KTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKGZyb21fZm9ybWF0LnRvTG93ZXJDYXNlKCkgPT0gJ3V0YycpIHtcblx0XHRcdGRhdGUgPSBtb21lbnQoX2RhdGUpO1xuXHRcdH0gZWxzZSBkYXRlID0gbW9tZW50KF9kYXRlLCBmcm9tX2Zvcm1hdCk7XG5cdFx0aWYgKCFkYXRlLl9pc1ZhbGlkKSB7XG5cdFx0XHRyZXR1cm4gX2RhdGU7XG5cdFx0fVxuXHRcdHJldHVybiBkYXRlLmZvcm1hdChmb3JtYXQpO1xuXHR9XG5cdHJldHVybiBfZGF0ZTtcbn1cblxuLyoqXG4gKiBMw6BtIHRyw7JuIHPhu5Egc2F1IGThuqV1IHBo4bqpeVxuICogQGF1dGhvciB0aGFuaC5iYXkgMjAxOC0wOS0yNyAxMToyNFxuICogQHBhcmFtICB7c3RyaW5nIHwgZmxvYXQgfCBpbnR9IHZhbHVlOiBnacOhIHRy4buLIG114buRbiBsw6BtIHRyw7JuXG4gKiBAcGFyYW0gIHtpbnR9IGZpeGVkPTEgOiBsw6BtIHRyw7JuIMSR4bq/biBuIHPhu5EgZOG7sWEgdsOgbyBnacOhIHRy4buLIGZpeGVkXG4gKi9cbkxpYnMuZml4TnVtYmVyID0gZnVuY3Rpb24gKHZhbHVlLCBmaXhlZCA9IDEpIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdmFsdWUgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdHJldHVybiBwYXJzZUZsb2F0KE51bWJlci5wYXJzZUZsb2F0KHZhbHVlKS50b0ZpeGVkKGZpeGVkKSk7XG59XG5MaWJzLnN1bSA9IGZ1bmN0aW9uICguLi5udW1iZXJzKSB7XG5cdHRyeSB7XG5cdFx0dmFyIHRvdGFsID0gMDtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IG51bWJlcnMubGVuZ3RoOyB4KyspIHtcblx0XHRcdHRvdGFsICs9IG51bWJlcnNbeF0gKiAxO1xuXHRcdH1cblx0XHRyZXR1cm4gdG90YWw7XG5cdH0gY2F0Y2ggKGV4KSB7XG5cdFx0cmV0dXJuIE5hTlxuXHR9XG59XG4vKipcbiogQGRlc2NyaXB0aW9uIEzDoG0gdHLDsm4gc+G7kVxuKiBAYXV0aG9yIE1pbmguUGhhbSAyMDE4LTEyLTA0XG4qIEBwYXJhbSBudW1iZXIgZ2nDoSB0cuG7iyBj4bqnbiBsw6BtIHRyw7JuXG4qIEBwYXJhbSBkZWNpbWFsIHPhu5EgdGjhuq1wIHBow6JuXG4qIEB0eXBlIGPDoWNoIGzDoG0gdHLDsm46IC0xIGzDoG0gdHLDsm4geHXhu5FuZywgMCBsw6BtIHTDsm4gdOG7sSBuaGnDqm4sIDE6IGzDoG0gdHLDsm4gbMOqblxuICovXG5MaWJzLnJvdW5kTnVtYmVyID0gZnVuY3Rpb24gKG51bWJlciwgZGVjaW1hbHMgPSAwLCB0eXBlID0gMCkge1xuXHRpZiAoZGVjaW1hbHMgPT0gbnVsbClcblx0XHRkZWNpbWFscyA9IDA7XG5cdHN3aXRjaCAodHlwZSkge1xuXHRcdGNhc2UgLTE6XG5cdFx0XHRyZXR1cm4gcm91bmRUby5kb3duKG51bWJlciwgZGVjaW1hbHMpO1xuXHRcdGNhc2UgMTpcblx0XHRcdHJldHVybiByb3VuZFRvLnVwKG51bWJlciwgZGVjaW1hbHMpO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gcm91bmRUbyhudW1iZXIsIGRlY2ltYWxzKTtcblx0fVxufTtcbi8qKlxuKiBAZGVzY3JpcHRpb24gTMOgbSB0csOybiBz4buRIHRoZW8gZm9ybWF0XG4qIEBhdXRob3IgTWluaC5QaGFtIDIwMTgtMTItMDRcbiogQHBhcmFtIG51bWJlciBnacOhIHRy4buLIGPhuqduIGzDoG0gdHLDsm5cbiogQHBhcmFtIGZvcm1hdCAjLCMjIy4jIyBcbiogQHR5cGUgY8OhY2ggbMOgbSB0csOybjogLTEgbMOgbSB0csOybiB4deG7kW5nLCAwIGzDoG0gdMOybiB04buxIG5oacOqbiwgMTogbMOgbSB0csOybiBsw6puXG4gKi9cbkxpYnMucm91bmRCeUZvcm1hdCA9IGZ1bmN0aW9uIChudW1iZXIsIGZvcm1hdCwgdHlwZSA9IDApIHtcblx0cmV0dXJuIExpYnMucm91bmROdW1iZXIobnVtYmVyLCBMaWJzLmdldERlY2ltYWxzT2ZGb21hdChmb3JtYXQpLCB0eXBlKTtcbn07XG5cbi8qKlxuKiBAZGVzY3JpcHRpb24gTOG6pXkgc+G7kSBkZWNpbWFscyhwaOG6p24gdGjhuq1wIHBow6JuKSBj4bunYSBmb3JtYXRcbiogQGF1dGhvciBNaW5oLlBoYW0gMjAxOC0xMi0wNFxuKiBAcGFyYW0gZm9ybWF0ICMsIyMjLiMjIFxuICovXG5MaWJzLmdldERlY2ltYWxzT2ZGb21hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcblx0bGV0IGRlY2ltYWxzID0gMDtcblx0aWYgKCFMaWJzLmlzQmxhbmsoZm9ybWF0KSkge1xuXHRcdHRyeSB7XG5cdFx0XHRsZXQgYXJyID0gZm9ybWF0LnNwbGl0KCcuJyk7XG5cdFx0XHRpZiAoYXJyLmxlbmd0aCA+PSAyKSB7XG5cdFx0XHRcdGRlY2ltYWxzID0gYXJyW2Fyci5sZW5ndGggLSAxXS5sZW5ndGg7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZXgpIHtcblxuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGVjaW1hbHM7XG59O1xuLyoqXG4gKiBHcm91cCBhcnJheSBvYmplY3QgYuG6sW5nIG5oaeG7gXUgcHJvcGVydHksIHRy4bqjIHbDoCBt4bqjbmcgMiBjaGnhu4F1XG4gKiBAYXV0aG9yIHRoYW5oLmJheSAyMDE5LTAxLTA4XG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyYXlcbiAqIEBwYXJhbSAge0FycmF5fSBwcm9wZXJ0aWVzXG4gKi9cbkxpYnMuZ3JvdXBCeSA9IGZ1bmN0aW9uIChhcnJheSwgcHJvcGVydGllcykge1xuXHR0cnkge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHByb3BlcnRpZXMpKSB7XG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fVxuXHRcdHZhciBmID0gZnVuY3Rpb24gKGl0ZW0sIHByb3BlcnRpZXMpIHtcblx0XHRcdGxldCBtZXJnZSA9IFtdO1xuXHRcdFx0Zm9yIChsZXQga2V5IGluIHByb3BlcnRpZXMpIHtcblx0XHRcdFx0bGV0IHByb3AgPSBwcm9wZXJ0aWVzW2tleV07XG5cdFx0XHRcdGlmICh0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycgJiYgaXRlbVtwcm9wXSkge1xuXHRcdFx0XHRcdG1lcmdlLnB1c2goaXRlbVtwcm9wXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBtZXJnZTtcblx0XHR9LFxuXHRcdFx0Z3JvdXBzID0ge307XG5cblx0XHRhcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChvKSB7XG5cdFx0XHR2YXIgZ3JvdXAgPSBKU09OLnN0cmluZ2lmeShmKG8sIHByb3BlcnRpZXMpKTtcblx0XHRcdGdyb3Vwc1tncm91cF0gPSBncm91cHNbZ3JvdXBdIHx8IFtdO1xuXHRcdFx0Z3JvdXBzW2dyb3VwXS5wdXNoKG8pO1xuXHRcdH0pO1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyhncm91cHMpLm1hcChmdW5jdGlvbiAoZ3JvdXApIHtcblx0XHRcdHJldHVybiBncm91cHNbZ3JvdXBdO1xuXHRcdH0pXG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5sb2coXCJMaWJzLmdyb3VwQnk6XCIsIGVycm9yKTtcblx0XHRyZXR1cm4gW107XG5cdH1cbn1cbi8qKlxuICogTOG6pXkgdW5pcXVlIHZhbHVlIGFycmF5XG4gKiBAYXV0aG9yIHRoYW5oLmJheSAyMDE5LTAyLTIyXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyYXlcbiAqIEBwYXJhbSAge1N0cmluZ30gcHJvcGVydHlcbiAqL1xuTGlicy51bmlxdWUgPSBmdW5jdGlvbiAoYXJyYXksIHByb3BlcnR5KSB7XG5cdGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblx0dmFyIGxpc3QgPSBbXSxcblx0XHRoYXNQcm9wZXJ0eSA9ICh0eXBlb2YgcHJvcGVydHkgIT09ICd1bmRlZmluZWQnICYmIHByb3BlcnR5ICE9IG51bGwgJiYgcHJvcGVydHkgIT0gXCJcIik7XG5cdGZvciAobGV0IGtleSBpbiBhcnJheSkge1xuXHRcdGxldCBpdGVtID0gYXJyYXlba2V5XSxcblx0XHRcdGZpbmQgPSBsaXN0LmZpbmQoaSA9PiB7XG5cdFx0XHRcdHJldHVybiBoYXNQcm9wZXJ0eSA/IChpW3Byb3BlcnR5XSA9PSBpdGVtW3Byb3BlcnR5XSkgOiAoaSA9PSBpdGVtKTtcblx0XHRcdH0pO1xuXHRcdGlmICh0eXBlb2YgZmluZCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGxpc3Q7XG59XG5MaWJzLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uIChvYmopIHtcblx0dmFyIHN0ciA9IFtdO1xuXHRmb3IgKHZhciBwIGluIG9iailcblx0XHRpZiAob2JqLmhhc093blByb3BlcnR5KHApKSB7XG5cdFx0XHRzdHIucHVzaChlbmNvZGVVUklDb21wb25lbnQocCkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChvYmpbcF0pKTtcblx0XHR9XG5cdHJldHVybiBzdHIuam9pbihcIiZcIik7XG59XG5cbkxpYnMuYmluMlN0cmluZyA9IGZ1bmN0aW9uIChhcnJheSkge1xuXHR2YXIgcmVzdWx0ID0gXCJcIjtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGFycmF5W2ldLCAyKSk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cbkxpYnMuc3RyaW5nMkJpbiA9IGZ1bmN0aW9uIChzdHIpIHtcblx0dmFyIHJlc3VsdCA9IFtdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuXHRcdHJlc3VsdC5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDIpKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5MaWJzLmJpbjJaaXAgPSBmdW5jdGlvbiAoYmluQXJyYXksIHBhdGgsIGZpbGVOYW1lKSB7XG5cdHRyeSB7XG5cdFx0aWYgKGZpbGVOYW1lLmluZGV4T2YoJy56aXAnKSA8IDApIHtcblx0XHRcdGZpbGVOYW1lICs9IFwiLnppcFwiO1xuXHRcdH1cblx0XHR2YXIgZmlsZV9zeXN0ZW0gPSByZXF1aXJlKCdmcycpO1xuXHRcdHZhciBhcmNoaXZlciA9IHJlcXVpcmUoJ2FyY2hpdmVyJyk7XG5cdFx0dmFyIG91dHB1dCA9IGZpbGVfc3lzdGVtLmNyZWF0ZVdyaXRlU3RyZWFtKHBhdGggKyBmaWxlTmFtZSk7XG5cdFx0dmFyIGFyY2hpdmUgPSBhcmNoaXZlcignemlwJywge1xuXHRcdFx0emxpYjogeyBsZXZlbDogOSB9IC8vIFNldHMgdGhlIGNvbXByZXNzaW9uIGxldmVsLlxuXHRcdH0pO1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRhcmNoaXZlLnBpcGUob3V0cHV0KTtcblx0XHRcdC8vIGFyY2hpdmUuZmlsZShwYXRoLCB7IG5hbWU6IGZpbGVOYW1lIH0pO1xuXHRcdFx0Ly8gYXJjaGl2ZVxuXHRcdFx0Ly8gICAuZGlyZWN0b3J5KHBhdGgsIGZhbHNlKVxuXHRcdFx0Ly8gICAub24oJ2Vycm9yJywgZXJyID0+IHJlamVjdChlcnIpKVxuXHRcdFx0Ly8gICAucGlwZShvdXRwdXQpXG5cdFx0XHQvLyA7XG5cdFx0XHRhcmNoaXZlLmFwcGVuZChiaW5BcnJheSwge1xuXHRcdFx0XHRuYW1lOiAnZmlsZSdcblx0XHRcdH0pO1xuXHRcdFx0YXJjaGl2ZS5maW5hbGl6ZSgpO1xuXHRcdFx0YXJjaGl2ZS5vbignZXJyb3InLCAoZXJyKSA9PiByZWplY3QoZXJyKSk7XG5cdFx0XHRvdXRwdXQub24oJ2Nsb3NlJywgKCkgPT4gcmVzb2x2ZSh0cnVlKSk7XG5cdFx0fSk7XG5cdFx0Ly8gb3V0cHV0Lm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcblx0XHQvLyBcdC8vIGNvbnNvbGUubG9nKGFyY2hpdmUucG9pbnRlcigpICsgJyB0b3RhbCBieXRlcycpO1xuXHRcdC8vIFx0Ly8gY29uc29sZS5sb2coJ2FyY2hpdmVyIGhhcyBiZWVuIGZpbmFsaXplZCBhbmQgdGhlIG91dHB1dCBmaWxlIGRlc2NyaXB0b3IgaGFzIGNsb3NlZC4nKTtcblx0XHQvLyB9KTtcblx0XHQvLyBhcmNoaXZlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycil7XG5cdFx0Ly8gXHR0aHJvdyBlcnI7XG5cdFx0Ly8gfSk7XG5cdFx0Ly8gYXJjaGl2ZS5waXBlKG91dHB1dCk7XG5cdFx0YXJjaGl2ZS5idWxrKFtcblx0XHRcdHsgZXhwYW5kOiB0cnVlLCBjd2Q6ICdzb3VyY2UnLCBzcmM6IFsnKionXSwgZGVzdDogJ3NvdXJjZScgfVxuXHRcdF0pO1xuXHRcdC8vIGFyY2hpdmUuZmluYWxpemUoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpXG5cdH1cbn1cblxuLyoqXG4gKiBU4buVbmcgY+G7mW5nIHThuqV0IGPhuqMgZ2nDoSB0cuG7iyB0cm9uZyBhcnJheSwgdHLGsOG7nW5nIGjhu6NwIGPDsyB0cnV54buBbiBwcm9wZXJ0eSB2w6BvIGFycmF5IHPhur0gxJHGsOG7o2MgaGnhu4N1IGzDoCBhcnJheSBvYmplY3QuIHbDoCBow6BtIHPhur0gdOG7lW5nIHThuqV0IGPhuqMgdmFsdWUgdHJvbmcgb2JqZWN0IHRoZW8gcHJvcGVydHkgxJHDoyB0cnV54buBbi5cbiAqIE5nxrDhu6NjIGzhuqFpIHByb3BlcnR5IHLhu5duZyB0aMOsIMSRxrDhu6NjIGhp4buDdSBsw6AgYXJyYXkgY8OzIHZhbHVlIGzDoCBz4buRXG4gKiBAYXV0aG9yIHRoYW5oLmJheSAyMDE5LTA0LTA0XG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyYXlcbiAqIEBwYXJhbSAge1N0cmluZ30gcHJvcGVydHlcbiAqL1xuTGlicy5zdW1CeVByb3AgPSBmdW5jdGlvbiAoYXJyYXksIHByb3BlcnR5KSB7XG5cdHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtdWxhdG9yLCBjdXJyZW50VmFsdWUpIHtcblx0XHRpZiAoTGlicy5pc0JsYW5rKGN1cnJlbnRWYWx1ZVtwcm9wZXJ0eV0pKSB7XG5cdFx0XHRsZXQgdmFsdWUgPSBMaWJzLmlzQmxhbmsoY3VycmVudFZhbHVlKSA/IDAgOiAoY3VycmVudFZhbHVlICogMSlcblx0XHRcdHJldHVybiAoYWNjdW11bGF0b3IgKyB2YWx1ZSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IHZhbHVlID0gTGlicy5pc0JsYW5rKGN1cnJlbnRWYWx1ZVtwcm9wZXJ0eV0pID8gMCA6IChjdXJyZW50VmFsdWVbcHJvcGVydHldICogMSlcblx0XHRcdHJldHVybiAoYWNjdW11bGF0b3IgKyB2YWx1ZSlcblx0XHR9XG5cdH0sIDApO1xufVxuXG4vKipcbiAqIEtp4buDbSB0cmEgcGjhuqduIHThu60gdOG7k24gdOG6oWkgdHJvbmcgbeG6o25nXG4gKiBAYXV0aG9yIEx1eWVuTmd1eWVuIDIwMTktMDYtMTFcbiAqIEBwYXJhbSAge1N0cmluZ3xpbnR9IHZhbHVlXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyYXlcbiAqL1xuTGlicy5pc0luQXJyYXkgPSBmdW5jdGlvbiAodmFsdWUsIGFycmF5KSB7XG5cdHJldHVybiBhcnJheS5pbmRleE9mKHZhbHVlKSA+IC0xO1xufVxuTGlicy50b1VwcGVyQ2FzZSA9IGZ1bmN0aW9uIChzdHIpIHtcblx0aWYgKExpYnMuaXNCbGFuayhzdHIpKSB7XG5cdFx0cmV0dXJuIHN0cjtcblx0fVxuXHRyZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7XG59XG5cbkxpYnMudG9Mb3dlckNhc2UgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdGlmIChMaWJzLmlzQmxhbmsoc3RyKSkge1xuXHRcdHJldHVybiBzdHI7XG5cdH1cblx0cmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xufVxuXG5MaWJzLmNvbnZlcnRTdHIyRGF0ZVYwMSA9IChkYXRlLCBmb3JtYXQsIF9kZWxpbWl0ZXIpID0+IHtcblx0aWYgKG51bGwgPT0gZGF0ZSB8fCB0eXBlb2YgZGF0ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgZGF0ZSA9PSAnJykge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHZhciBmb3JtYXRMb3dlckNhc2UgPSBmb3JtYXQudG9Mb3dlckNhc2UoKTtcblx0dmFyIGZvcm1hdEl0ZW1zID0gZm9ybWF0TG93ZXJDYXNlLnNwbGl0KF9kZWxpbWl0ZXIpO1xuXHR2YXIgZGF0ZUl0ZW1zID0gZGF0ZS5zcGxpdChfZGVsaW1pdGVyKTtcblx0dmFyIG1vbnRoSW5kZXggPSBmb3JtYXRJdGVtcy5pbmRleE9mKFwibW1cIik7XG5cdHZhciBkYXlJbmRleCA9IGZvcm1hdEl0ZW1zLmluZGV4T2YoXCJkZFwiKTtcblx0dmFyIHllYXJJbmRleCA9IGZvcm1hdEl0ZW1zLmluZGV4T2YoXCJ5eXl5XCIpO1xuXHQvL3ZhciBtb250aCA9IHBhcnNlSW50KGRhdGVJdGVtc1ttb250aEluZGV4XSk7XG5cdHZhciBtb250aCA9IGRhdGVJdGVtc1ttb250aEluZGV4XTtcblx0cmV0dXJuIGRhdGVJdGVtc1t5ZWFySW5kZXhdICsgJy0nICsgKG1vbnRoKSArICctJyArIGRhdGVJdGVtc1tkYXlJbmRleF07XG59XG5cblxuTGlicy5jb252ZXJ0U3RyVG9EYXRlRnVsbFRpbWUgPSAoZGF0ZSwgZm9ybWF0LCBfZGVsaW1pdGVyKSA9PiB7XG5cdGlmIChudWxsID09IGRhdGUgfHwgdHlwZW9mIGRhdGUgPT09ICd1bmRlZmluZWQnIHx8IGRhdGUgPT0gJycpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHR2YXIgYXJyRGF0ZSA9IGRhdGUuc3BsaXQoXCIgXCIpO1xuXHR2YXIgZm9ybWF0TG93ZXJDYXNlID0gZm9ybWF0LnRvTG93ZXJDYXNlKCk7XG5cdHZhciBmb3JtYXRJdGVtcyA9IGZvcm1hdExvd2VyQ2FzZS5zcGxpdChfZGVsaW1pdGVyKTtcblx0dmFyIGRhdGVJdGVtcyA9IGFyckRhdGVbMF0uc3BsaXQoX2RlbGltaXRlcik7XG5cdHZhciBtb250aEluZGV4ID0gZm9ybWF0SXRlbXMuaW5kZXhPZihcIm1tXCIpO1xuXHR2YXIgZGF5SW5kZXggPSBmb3JtYXRJdGVtcy5pbmRleE9mKFwiZGRcIik7XG5cdHZhciB5ZWFySW5kZXggPSBmb3JtYXRJdGVtcy5pbmRleE9mKFwieXl5eVwiKTtcblx0Ly92YXIgbW9udGggPSBwYXJzZUludChkYXRlSXRlbXNbbW9udGhJbmRleF0pO1xuXHR2YXIgbW9udGggPSBkYXRlSXRlbXNbbW9udGhJbmRleF07XG5cdHJldHVybiBkYXRlSXRlbXNbeWVhckluZGV4XSArICctJyArIChtb250aCkgKyAnLScgKyBkYXRlSXRlbXNbZGF5SW5kZXhdICsgXCIgXCIgKyBhcnJEYXRlWzFdO1xufVxuXG5cbkxpYnMuY29udmVydFN0cjJZZWFyTW9udGggPSAoZGF0ZSwgZm9ybWF0LCBfZGVsaW1pdGVyKSA9PiB7XG5cdGlmIChudWxsID09IGRhdGUgfHwgdHlwZW9mIGRhdGUgPT09ICd1bmRlZmluZWQnIHx8IGRhdGUgPT0gJycpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHR2YXIgZm9ybWF0TG93ZXJDYXNlID0gZm9ybWF0LnRvTG93ZXJDYXNlKCk7XG5cdHZhciBmb3JtYXRJdGVtcyA9IGZvcm1hdExvd2VyQ2FzZS5zcGxpdChfZGVsaW1pdGVyKTtcblx0dmFyIGRhdGVJdGVtcyA9IGRhdGUuc3BsaXQoX2RlbGltaXRlcik7XG5cdHZhciBtb250aEluZGV4ID0gZm9ybWF0SXRlbXMuaW5kZXhPZihcIm1tXCIpO1xuXHR2YXIgZGF5SW5kZXggPSBmb3JtYXRJdGVtcy5pbmRleE9mKFwiZGRcIik7XG5cdHZhciB5ZWFySW5kZXggPSBmb3JtYXRJdGVtcy5pbmRleE9mKFwieXl5eVwiKTtcblx0Ly92YXIgbW9udGggPSBwYXJzZUludChkYXRlSXRlbXNbbW9udGhJbmRleF0pO1xuXHR2YXIgbW9udGggPSBkYXRlSXRlbXNbbW9udGhJbmRleF07XG5cdHJldHVybiBkYXRlSXRlbXNbeWVhckluZGV4XSArICctJyArIChtb250aCk7XG59XG5cbkxpYnMucmVtb3ZlVW5pY29kZSA9IChzdHIpID0+IHtcblx0c3RyID0gc3RyLnRvTG93ZXJDYXNlKCk7XG5cdHN0ciA9IHN0ci5yZXBsYWNlKC/DoHzDoXzhuqF84bqjfMOjfMOifOG6p3zhuqV84bqtfOG6qXzhuqt8xIN84bqxfOG6r3zhurd84bqzfOG6tS9nLCBcImFcIik7XG5cdHN0ciA9IHN0ci5yZXBsYWNlKC/DqHzDqXzhurl84bq7fOG6vXzDqnzhu4F84bq/fOG7h3zhu4N84buFL2csIFwiZVwiKTtcblx0c3RyID0gc3RyLnJlcGxhY2UoL8OsfMOtfOG7i3zhu4l8xKkvZywgXCJpXCIpO1xuXHRzdHIgPSBzdHIucmVwbGFjZSgvw7J8w7N84buNfOG7j3zDtXzDtHzhu5N84buRfOG7mXzhu5V84buXfMahfOG7nXzhu5t84bujfOG7n3zhu6EvZywgXCJvXCIpO1xuXHRzdHIgPSBzdHIucmVwbGFjZSgvw7l8w7p84bulfOG7p3zFqXzGsHzhu6t84bupfOG7sXzhu6184buvL2csIFwidVwiKTtcblx0c3RyID0gc3RyLnJlcGxhY2UoL+G7s3zDvXzhu7V84bu3fOG7uS9nLCBcInlcIik7XG5cdHN0ciA9IHN0ci5yZXBsYWNlKC/EkS9nLCBcImRcIik7XG5cblx0c3RyID0gc3RyLnJlcGxhY2UoL8OAfMOBfOG6oHzhuqJ8w4N8w4J84bqmfOG6pHzhuqx84bqofOG6qnzEgnzhurB84bqufOG6tnzhurJ84bq0L2csIFwiQVwiKTtcblx0c3RyID0gc3RyLnJlcGxhY2UoL8OIfMOJfOG6uHzhurp84bq8fMOKfOG7gHzhur584buGfOG7gnzhu4QvZywgXCJFXCIpO1xuXHRzdHIgPSBzdHIucmVwbGFjZSgvw4x8w4184buKfOG7iHzEqC9nLCBcIklcIik7XG5cdHN0ciA9IHN0ci5yZXBsYWNlKC/DknzDk3zhu4x84buOfMOVfMOUfOG7knzhu5B84buYfOG7lHzhu5Z8xqB84bucfOG7mnzhu6J84buefOG7oC9nLCBcIk9cIik7XG5cdHN0ciA9IHN0ci5yZXBsYWNlKC/DmXzDmnzhu6R84bumfMWofMavfOG7qnzhu6h84buwfOG7rHzhu64vZywgXCJVXCIpO1xuXHRzdHIgPSBzdHIucmVwbGFjZSgv4buyfMOdfOG7tHzhu7Z84bu4L2csIFwiWVwiKTtcblx0c3RyID0gc3RyLnJlcGxhY2UoL8SQL2csIFwiRFwiKTtcblxuXHRzdHIgPSBzdHIucmVwbGFjZSgvIXxAfOKAnHzigJ18JXxcXF58XFwqfFxcKHxcXCl8XFwrfFxcPXxcXDx8XFw+fFxcP3xcXC98LHxcXC58XFw6fFxcO3xcXCd8IHxcXFwifFxcJnxcXCN8XFxbfFxcXXx+fOKAk3wkfF8vZywgXCItXCIpO1xuXG5cdHN0ciA9IHN0ci5yZXBsYWNlKC8tKy0vZywgXCItXCIpOyAvL3RoYXkgdGjhur8gMi0gdGjDoG5oIDEtXG5cdHN0ciA9IHN0ci5yZXBsYWNlKC9eXFwtK3xcXC0rJC9nLCBcIlwiKTtcblxuXHRyZXR1cm4gc3RyO1xufVxuXG5MaWJzLmRlY2ltYWxUb0Vycm9yQ29kZSA9IChkZWNpbWFsKSA9PiB7XG5cdHZhciBhcnJFcnJvckNvZGUgPSBbXTtcblx0aWYgKExpYnMuaXNCbGFuayhkZWNpbWFsKSkgcmV0dXJuIGFyckVycm9yQ29kZTtcblx0dmFyIGRlY2ltYWxTdHJpbmcgPSBkZWNpbWFsLnRvU3RyaW5nKDIpO1xuXHR2YXIgZGVjaW1hbEFyciA9IE9iamVjdC5hc3NpZ24oW10sIGRlY2ltYWxTdHJpbmcpO1xuXG5cdGlmIChkZWNpbWFsQXJyLmxlbmd0aCA8PSAwKSByZXR1cm4gYXJyRXJyb3JDb2RlO1xuXG5cdC8vIDEwMTFcblx0dmFyIGJpdDAgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMV07XG5cdGlmICghTGlicy5pc0JsYW5rKGJpdDApICYmIHBhcnNlSW50KGJpdDApID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAwIH0pO1xuXHR9XG5cdHZhciBiaXQxID0gZGVjaW1hbEFycltkZWNpbWFsQXJyLmxlbmd0aCAtIDJdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxKSAmJiBwYXJzZUludChiaXQxKSA9PT0gMSkge1xuXHRcdGFyckVycm9yQ29kZS5wdXNoKHsgZXJyb3JfY29kZTogMSB9KTtcblx0fVxuXHR2YXIgYml0MiA9IGRlY2ltYWxBcnJbZGVjaW1hbEFyci5sZW5ndGggLSAzXTtcblx0aWYgKCFMaWJzLmlzQmxhbmsoYml0MikgJiYgcGFyc2VJbnQoYml0MikgPT09IDEpIHtcblx0XHRhcnJFcnJvckNvZGUucHVzaCh7IGVycm9yX2NvZGU6IDIgfSk7XG5cdH1cblx0dmFyIGJpdDMgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gNF07XG5cdGlmICghTGlicy5pc0JsYW5rKGJpdDMpICYmIHBhcnNlSW50KGJpdDMpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAzIH0pO1xuXHR9XG5cdHZhciBiaXQ0ID0gZGVjaW1hbEFycltkZWNpbWFsQXJyLmxlbmd0aCAtIDVdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQ0KSAmJiBwYXJzZUludChiaXQ0KSA9PT0gMSkge1xuXHRcdGFyckVycm9yQ29kZS5wdXNoKHsgZXJyb3JfY29kZTogNCB9KTtcblx0fVxuXHR2YXIgYml0NSA9IGRlY2ltYWxBcnJbZGVjaW1hbEFyci5sZW5ndGggLSA2XTtcblx0aWYgKCFMaWJzLmlzQmxhbmsoYml0NSkgJiYgcGFyc2VJbnQoYml0NSkgPT09IDEpIHtcblx0XHRhcnJFcnJvckNvZGUucHVzaCh7IGVycm9yX2NvZGU6IDUgfSk7XG5cdH1cblx0dmFyIGJpdDYgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gN107XG5cdGlmICghTGlicy5pc0JsYW5rKGJpdDYpICYmIHBhcnNlSW50KGJpdDYpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiA2IH0pO1xuXHR9XG5cdHZhciBiaXQ3ID0gZGVjaW1hbEFycltkZWNpbWFsQXJyLmxlbmd0aCAtIDhdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQ3KSAmJiBwYXJzZUludChiaXQ3KSA9PT0gMSkge1xuXHRcdGFyckVycm9yQ29kZS5wdXNoKHsgZXJyb3JfY29kZTogNyB9KTtcblx0fVxuXHR2YXIgYml0OCA9IGRlY2ltYWxBcnJbZGVjaW1hbEFyci5sZW5ndGggLSA5XTtcblx0aWYgKCFMaWJzLmlzQmxhbmsoYml0OCkgJiYgcGFyc2VJbnQoYml0OCkgPT09IDEpIHtcblx0XHRhcnJFcnJvckNvZGUucHVzaCh7IGVycm9yX2NvZGU6IDggfSk7XG5cdH1cblx0dmFyIGJpdDkgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMTBdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQ5KSAmJiBwYXJzZUludChiaXQ5KSA9PT0gMSkge1xuXHRcdGFyckVycm9yQ29kZS5wdXNoKHsgZXJyb3JfY29kZTogOSB9KTtcblx0fVxuXHR2YXIgYml0MTAgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMTFdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxMCkgJiYgcGFyc2VJbnQoYml0MTApID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAxMCB9KTtcblx0fVxuXHR2YXIgYml0MTEgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMTJdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxMSkgJiYgcGFyc2VJbnQoYml0MTEpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAxMSB9KTtcblx0fVxuXHR2YXIgYml0MTIgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMTNdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxMikgJiYgcGFyc2VJbnQoYml0MTIpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAxMiB9KTtcblx0fVxuXHR2YXIgYml0MTMgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMTRdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxMykgJiYgcGFyc2VJbnQoYml0MTMpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAxMyB9KTtcblx0fVxuXHR2YXIgYml0MTQgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMTVdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxNCkgJiYgcGFyc2VJbnQoYml0MTQpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAxNCB9KTtcblx0fVxuXHR2YXIgYml0MTUgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMTZdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxNSkgJiYgcGFyc2VJbnQoYml0MTUpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAxNSB9KTtcblx0fVxuXHR2YXIgYml0MTYgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMTddO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxNikgJiYgcGFyc2VJbnQoYml0MTYpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAxNiB9KTtcblx0fVxuXHR2YXIgYml0MTcgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMThdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxNykgJiYgcGFyc2VJbnQoYml0MTcpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAxNyB9KTtcblx0fVxuXHR2YXIgYml0MTggPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMTldO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxOCkgJiYgcGFyc2VJbnQoYml0MTgpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAxOCB9KTtcblx0fVxuXHR2YXIgYml0MTkgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMjBdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQxOSkgJiYgcGFyc2VJbnQoYml0MTkpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAxOSB9KTtcblx0fVxuXHR2YXIgYml0MjAgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMjFdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQyMCkgJiYgcGFyc2VJbnQoYml0MjApID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAyMCB9KTtcblx0fVxuXHR2YXIgYml0MjEgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMjJdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQyMSkgJiYgcGFyc2VJbnQoYml0MjEpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAyMSB9KTtcblx0fVxuXHR2YXIgYml0MjIgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMjNdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQyMikgJiYgcGFyc2VJbnQoYml0MjIpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAyMiB9KTtcblx0fVxuXHR2YXIgYml0MjMgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMjRdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQyMykgJiYgcGFyc2VJbnQoYml0MjMpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAyMyB9KTtcblx0fVxuXHR2YXIgYml0MjQgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMjVdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQyNCkgJiYgcGFyc2VJbnQoYml0MjQpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAyNCB9KTtcblx0fVxuXHR2YXIgYml0MjUgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMjZdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQyNSkgJiYgcGFyc2VJbnQoYml0MjUpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAyNSB9KTtcblx0fVxuXHR2YXIgYml0MjYgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMjddO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQyNikgJiYgcGFyc2VJbnQoYml0MjYpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAyNiB9KTtcblx0fVxuXHR2YXIgYml0MjcgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMjhdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQyNykgJiYgcGFyc2VJbnQoYml0MjcpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAyNyB9KTtcblx0fVxuXHR2YXIgYml0MjggPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMjldO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQyOCkgJiYgcGFyc2VJbnQoYml0MjgpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAyOCB9KTtcblx0fVxuXHR2YXIgYml0MjkgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMzBdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQyOSkgJiYgcGFyc2VJbnQoYml0MjkpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAyOSB9KTtcblx0fVxuXHR2YXIgYml0MzAgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMzFdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQzMCkgJiYgcGFyc2VJbnQoYml0MzApID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAzMCB9KTtcblx0fVxuXHR2YXIgYml0MzEgPSBkZWNpbWFsQXJyW2RlY2ltYWxBcnIubGVuZ3RoIC0gMzJdO1xuXHRpZiAoIUxpYnMuaXNCbGFuayhiaXQzMSkgJiYgcGFyc2VJbnQoYml0MzEpID09PSAxKSB7XG5cdFx0YXJyRXJyb3JDb2RlLnB1c2goeyBlcnJvcl9jb2RlOiAzMSB9KTtcblx0fVxuXG5cdHJldHVybiBhcnJFcnJvckNvZGU7XG59XG4iXX0=