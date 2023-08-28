/**
 * 字符串相关
 * @author ydr.me
 * @create 2015-05-11 10:28
 */

/**
 * @module utils/string
 * @requires utils/dato
 * @requires utils/typeis
 */

'use strict';

var dato = require('./dato.js');
var typeis = require('./typeis.js');

var win = typeof global !== 'undefined' ? global : window;
var escapeHTMLMap = {
    '&amp;': /&/g,
    '&lt;': /</g,
    '&gt;': />/g,
    '&quot;': /"/g,
    '&apos;': /'/g,
    '&#x2f;': /\//g
};
var REG_HTML_CODE = /&#(x)?([\w\d]{0,5});/i;
var unescapeHTMLMap = {
    '&': /&amp;/g,
    '<': /&lt;/g,
    '>': /&gt;/g,
    '"': /&quot;/g,
    '\'': /&apos;/g,
    '/': /&#x2f;/g
};
var REG_REGESP = /[.*+?^=!:${}()|[\]\/\\-]/g;
// var REG_ASSIGN_VARIBLE = /\$\<([^{}]*?)\>/g;
var REG_ASSIGN_VARIBLE = /\$\{([^{}]*?)}/g;
var REG_SEPARATOR = /[-_ ]([a-z])/g;
var REG_HUMP = /[A-Z]/g;
var REG_STAR = /\\\*/g;
var REG_NOT_UTF16_SINGLE = /[^\x00-\xff]{2}/g;
var REG_DOUBLE = /[^\x00-\xff]/g;

/**
 * 转换 HTML 字符串为实体符
 * @param str {String} html 字符串
 * @returns {String}
 */
exports.escapeHTML = function (str) {
    dato.each(escapeHTMLMap, function (src, reg) {
        str = String(str).replace(reg, src);
    });

    return str;
};

/**
 * 转换实体符为 HTML 字符串
 * @param str {String} entry 实体符
 * @returns {String}
 */
exports.unescapeHTML = function (str) {
    // 转换实体数字为实体字母
    str = String(str).replace(REG_HTML_CODE, function (full, hex, code) {
        return String.fromCharCode(parseInt(code, hex ? 16 : 10));
    });

    dato.each(unescapeHTMLMap, function (src, reg) {
        str = str.replace(reg, src);
    });

    return str;
};

/**
 * 转换正则字符串为合法正则
 * @param str {String} 正则字符串
 * @returns {string}
 */
exports.escapeRegExp = function (str) {
    return str.replace(REG_REGESP, '\\$&');
};

/**
 * 分配字符串，参考 es6
 * @param str {String} 字符串模板
 * @returns {String}
 * @example
 * string.assign('Hello ${name}, how are you ${time}?', {
     *     name: 'Bob',
     *     time: 'today'
     * });
 * // => "Hello Bob, how are you today?"
 *
 * string.assign('Hello ${1}, how are you ${2}?', 'Bob', 'today');
 * // => "Hello Bob, how are you today?"
 */
exports.assign = function (str /*arguments*/) {
    var args = arguments;
    var data = {};

    // {}
    if (typeis.object(args[1])) {
        data = args[1];
    }
    // 1, 2...
    else {
            dato.each([].slice.call(args, 1), function (index, val) {
                data[index + 1] = val;
            });
        }
    console.log("str: ", str);
    console.log("REG_ASSIGN_VARIBLE: ", REG_ASSIGN_VARIBLE);
    return str.replace(REG_ASSIGN_VARIBLE, function ($0, $1) {
        console.log("data[$1]: ", data[$1]);
        return String(data[$1]);
    });
};

/**
 * 转换分隔符字符串为驼峰形式
 * @param str {String} 分隔符字符串
 * @param [upperCaseFirstChar=false] {Boolean} 是否大写第一个字母
 * @returns {String}
 *
 * @example
 * string.humprize('moz-border-radius');
 * // => "mozBorderRadius"
 */
exports.humprize = function (str, upperCaseFirstChar) {
    if (!str.length) {
        return str;
    }

    if (upperCaseFirstChar) {
        str = str[0].toUpperCase() + str.substr(1);
    }

    return str.replace(REG_SEPARATOR, function ($0, $1) {
        return $1.toUpperCase();
    });
};

/**
 * 转换驼峰字符串为分隔符字符串
 * @param str {String} 驼峰字符串
 * @param [separator="-"] {String} 分隔符
 * @returns {string}
 * @example
 * string.separatorize('mozBorderRadius');
 * // => "moz-border-radius"
 */
exports.separatorize = function (str, separator) {
    if (!str.length) {
        return str;
    }

    separator = separator || '-';
    str = str[0].toLowerCase() + str.substr(1);

    return str.replace(REG_HUMP, function ($0) {
        return separator + $0.toLowerCase();
    });
};

/**
 * base64 编码
 * @param str {String} 字符串
 * @returns {string}
 */
exports.base64 = function (str) {
    if (typeis.undefined(win.Buffer)) {
        return btoa(encodeURIComponent(str));
    } else {
        return new win.Buffer(str, 'utf8').toString('base64');
    }
};

/**
 * base64 解码
 * @param str {String} 字符串
 * @returns {string}
 */
exports.debase64 = function (str) {
    if (typeis.undefined(win.Buffer)) {
        return decodeURIComponent(atob(str));
    } else {
        return new win.Buffer(str, 'base64').toString('utf8');
    }
};

/**
 * 填充字符串
 * @param isLeft {Boolean} 是否左边
 * @param str {String} 字符串
 * @param [maxLength] {Number} 最大长度，默认为字符串长度
 * @param [padding=" "] {String} 填充字符串
 * @returns {String}
 */
var pad = function pad(isLeft, str, maxLength, padding) {
    var length = str.length;

    padding = padding || ' ';
    maxLength = maxLength || length;

    if (maxLength <= length) {
        return str;
    }

    while (++length <= maxLength) {
        str = isLeft ? padding + str : str + padding;
    }

    return str;
};

/**
 * 左填充
 * @param str {*} 字符串
 * @param [maxLength] {Number} 最大长度，默认为字符串长度
 * @param [padding=" "] {String} 填充字符串
 * @returns {String}
 */
exports.padLeft = function (str, maxLength, padding) {
    return pad(true, String(str), maxLength, padding);
};

/**
 * 右填充
 * @param str {*} 字符串
 * @param [maxLength] {Number} 最大长度，默认为字符串长度
 * @param [padding=" "] {String} 填充字符串
 * @returns {String}
 */
exports.padRight = function (str, maxLength, padding) {
    return pad(false, String(str), maxLength, padding);
};

/**
 * 非点匹配
 * @param str {String} 被匹配字符
 * @param glob {String} 匹配字符
 * @param [ignoreCase=false] {Boolean} 是否忽略大小写
 * @returns {Boolean}
 * @example
 * string.glob('abc.def.com', 'abc.*.com');
 * // => true
 */
exports.glob = function (str, glob, ignoreCase) {
    var reg = new RegExp(exports.escapeRegExp(glob).replace(REG_STAR, '[^.]+?'), ignoreCase ? 'i' : '');

    return reg.test(str);
};

/**
 * 计算字节长度
 * @param string {String} 原始字符串
 * @param [doubleLength=2] {Number} 双字节长度，默认为2
 * @returns {number}
 *
 * @example
 * data.bytes('我123');
 * // => 5
 */
exports.bytes = function (string, doubleLength) {
    string += '';
    doubleLength = doubleLength || 2;

    var i = 0,
        j = string.length,
        k = 0,
        c;

    for (; i < j; i++) {
        c = string.charCodeAt(i);
        k += c >= 0x0001 && c <= 0x007e || 0xff60 <= c && c <= 0xff9f ? 1 : doubleLength;
    }

    return k;
};

/**
 * 计算字符串长度
 * 双字节的字符使用 length 属性计算不准确
 * @ref http://es6.ruanyifeng.com/#docs/string
 * @param str {String} 原始字符串
 * @returns {Number}
 *
 * @example
 * var s = "𠮷";
 * s.length = 2;
 * string.length(s);
 * // => 3
 */
exports.length = function (str) {
    return String(str).replace(REG_NOT_UTF16_SINGLE, '*').length;
};

///**
// * 将特殊字符转成 unicode 编码
// * @param str {String}
// * @returns {string}
// */
//exports.toUnicode = function (str) {
//    return str.replace(REG_DOUBLE, function ($0) {
//        return '\\u' + $0.charCodeAt(0).toString(16);
//    });
//};
//
//
///**
// * @link https://github.com/twitter/twemoji/blob/gh-pages/twemoji.amd.js#L571
// * @param unicodeSurrogates
// * @param sep
// * @returns {string}
// */
//function toCodePoint(unicodeSurrogates, sep) {
//    var
//        r = [],
//        c = 0,
//        p = 0,
//        i = 0;
//    while (i < unicodeSurrogates.length) {
//        c = unicodeSurrogates.charCodeAt(i++);
//        if (p) {
//            r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
//            p = 0;
//        } else if (0xD800 <= c && c <= 0xDBFF) {
//            p = c;
//        } else {
//            r.push(c.toString(16));
//        }
//    }
//    return r.join(sep || '-');
//}
//
//
///**
// * Used to both remove the possible variant
// * and to convert utf16 into code points
// * @link https://github.com/twitter/twemoji/blob/gh-pages/twemoji.amd.js#L322
// * @param  icon {string}    the emoji surrogate pair
// * @param  variant {string}    the optional variant char, if any
// */
//function grabTheRightIcon(icon, variant) {
//    // if variant is present as \uFE0F
//    return toCodePoint(
//        variant === '\uFE0F' ?
//            // the icon should not contain it
//            icon.slice(0, -1) :
//            // fix non standard OSX behavior
//            (icon.length === 3 && icon.charAt(1) === '\uFE0F' ?
//            icon.charAt(0) + icon.charAt(2) : icon)
//    );
//}
//
//// RegExp based on emoji's official Unicode standards
//// @link http://www.unicode.org/Public/UNIDATA/EmojiSources.txt
//// @link https://github.com/twitter/twemoji/blob/gh-pages/twemoji.amd.js#L237
//var REG_EMOJI = /((?:\ud83c\udde8\ud83c\uddf3|\ud83c\uddfa\ud83c\uddf8|\ud83c\uddf7\ud83c\uddfa|\ud83c\uddf0\ud83c\uddf7|\ud83c\uddef\ud83c\uddf5|\ud83c\uddee\ud83c\uddf9|\ud83c\uddec\ud83c\udde7|\ud83c\uddeb\ud83c\uddf7|\ud83c\uddea\ud83c\uddf8|\ud83c\udde9\ud83c\uddea|\u0039\ufe0f?\u20e3|\u0038\ufe0f?\u20e3|\u0037\ufe0f?\u20e3|\u0036\ufe0f?\u20e3|\u0035\ufe0f?\u20e3|\u0034\ufe0f?\u20e3|\u0033\ufe0f?\u20e3|\u0032\ufe0f?\u20e3|\u0031\ufe0f?\u20e3|\u0030\ufe0f?\u20e3|\u0023\ufe0f?\u20e3|\ud83d\udeb3|\ud83d\udeb1|\ud83d\udeb0|\ud83d\udeaf|\ud83d\udeae|\ud83d\udea6|\ud83d\udea3|\ud83d\udea1|\ud83d\udea0|\ud83d\ude9f|\ud83d\ude9e|\ud83d\ude9d|\ud83d\ude9c|\ud83d\ude9b|\ud83d\ude98|\ud83d\ude96|\ud83d\ude94|\ud83d\ude90|\ud83d\ude8e|\ud83d\ude8d|\ud83d\ude8b|\ud83d\ude8a|\ud83d\ude88|\ud83d\ude86|\ud83d\ude82|\ud83d\ude81|\ud83d\ude36|\ud83d\ude34|\ud83d\ude2f|\ud83d\ude2e|\ud83d\ude2c|\ud83d\ude27|\ud83d\ude26|\ud83d\ude1f|\ud83d\ude1b|\ud83d\ude19|\ud83d\ude17|\ud83d\ude15|\ud83d\ude11|\ud83d\ude10|\ud83d\ude0e|\ud83d\ude08|\ud83d\ude07|\ud83d\ude00|\ud83d\udd67|\ud83d\udd66|\ud83d\udd65|\ud83d\udd64|\ud83d\udd63|\ud83d\udd62|\ud83d\udd61|\ud83d\udd60|\ud83d\udd5f|\ud83d\udd5e|\ud83d\udd5d|\ud83d\udd5c|\ud83d\udd2d|\ud83d\udd2c|\ud83d\udd15|\ud83d\udd09|\ud83d\udd08|\ud83d\udd07|\ud83d\udd06|\ud83d\udd05|\ud83d\udd04|\ud83d\udd02|\ud83d\udd01|\ud83d\udd00|\ud83d\udcf5|\ud83d\udcef|\ud83d\udced|\ud83d\udcec|\ud83d\udcb7|\ud83d\udcb6|\ud83d\udcad|\ud83d\udc6d|\ud83d\udc6c|\ud83d\udc65|\ud83d\udc2a|\ud83d\udc16|\ud83d\udc15|\ud83d\udc13|\ud83d\udc10|\ud83d\udc0f|\ud83d\udc0b|\ud83d\udc0a|\ud83d\udc09|\ud83d\udc08|\ud83d\udc07|\ud83d\udc06|\ud83d\udc05|\ud83d\udc04|\ud83d\udc03|\ud83d\udc02|\ud83d\udc01|\ud83d\udc00|\ud83c\udfe4|\ud83c\udfc9|\ud83c\udfc7|\ud83c\udf7c|\ud83c\udf50|\ud83c\udf4b|\ud83c\udf33|\ud83c\udf32|\ud83c\udf1e|\ud83c\udf1d|\ud83c\udf1c|\ud83c\udf1a|\ud83c\udf18|\ud83c\udccf|\ud83c\udd8e|\ud83c\udd91|\ud83c\udd92|\ud83c\udd93|\ud83c\udd94|\ud83c\udd95|\ud83c\udd96|\ud83c\udd97|\ud83c\udd98|\ud83c\udd99|\ud83c\udd9a|\ud83d\udc77|\ud83d\udec5|\ud83d\udec4|\ud83d\udec3|\ud83d\udec2|\ud83d\udec1|\ud83d\udebf|\ud83d\udeb8|\ud83d\udeb7|\ud83d\udeb5|\ud83c\ude01|\ud83c\ude32|\ud83c\ude33|\ud83c\ude34|\ud83c\ude35|\ud83c\ude36|\ud83c\ude38|\ud83c\ude39|\ud83c\ude3a|\ud83c\ude50|\ud83c\ude51|\ud83c\udf00|\ud83c\udf01|\ud83c\udf02|\ud83c\udf03|\ud83c\udf04|\ud83c\udf05|\ud83c\udf06|\ud83c\udf07|\ud83c\udf08|\ud83c\udf09|\ud83c\udf0a|\ud83c\udf0b|\ud83c\udf0c|\ud83c\udf0f|\ud83c\udf11|\ud83c\udf13|\ud83c\udf14|\ud83c\udf15|\ud83c\udf19|\ud83c\udf1b|\ud83c\udf1f|\ud83c\udf20|\ud83c\udf30|\ud83c\udf31|\ud83c\udf34|\ud83c\udf35|\ud83c\udf37|\ud83c\udf38|\ud83c\udf39|\ud83c\udf3a|\ud83c\udf3b|\ud83c\udf3c|\ud83c\udf3d|\ud83c\udf3e|\ud83c\udf3f|\ud83c\udf40|\ud83c\udf41|\ud83c\udf42|\ud83c\udf43|\ud83c\udf44|\ud83c\udf45|\ud83c\udf46|\ud83c\udf47|\ud83c\udf48|\ud83c\udf49|\ud83c\udf4a|\ud83c\udf4c|\ud83c\udf4d|\ud83c\udf4e|\ud83c\udf4f|\ud83c\udf51|\ud83c\udf52|\ud83c\udf53|\ud83c\udf54|\ud83c\udf55|\ud83c\udf56|\ud83c\udf57|\ud83c\udf58|\ud83c\udf59|\ud83c\udf5a|\ud83c\udf5b|\ud83c\udf5c|\ud83c\udf5d|\ud83c\udf5e|\ud83c\udf5f|\ud83c\udf60|\ud83c\udf61|\ud83c\udf62|\ud83c\udf63|\ud83c\udf64|\ud83c\udf65|\ud83c\udf66|\ud83c\udf67|\ud83c\udf68|\ud83c\udf69|\ud83c\udf6a|\ud83c\udf6b|\ud83c\udf6c|\ud83c\udf6d|\ud83c\udf6e|\ud83c\udf6f|\ud83c\udf70|\ud83c\udf71|\ud83c\udf72|\ud83c\udf73|\ud83c\udf74|\ud83c\udf75|\ud83c\udf76|\ud83c\udf77|\ud83c\udf78|\ud83c\udf79|\ud83c\udf7a|\ud83c\udf7b|\ud83c\udf80|\ud83c\udf81|\ud83c\udf82|\ud83c\udf83|\ud83c\udf84|\ud83c\udf85|\ud83c\udf86|\ud83c\udf87|\ud83c\udf88|\ud83c\udf89|\ud83c\udf8a|\ud83c\udf8b|\ud83c\udf8c|\ud83c\udf8d|\ud83c\udf8e|\ud83c\udf8f|\ud83c\udf90|\ud83c\udf91|\ud83c\udf92|\ud83c\udf93|\ud83c\udfa0|\ud83c\udfa1|\ud83c\udfa2|\ud83c\udfa3|\ud83c\udfa4|\ud83c\udfa5|\ud83c\udfa6|\ud83c\udfa7|\ud83c\udfa8|\ud83c\udfa9|\ud83c\udfaa|\ud83c\udfab|\ud83c\udfac|\ud83c\udfad|\ud83c\udfae|\ud83c\udfaf|\ud83c\udfb0|\ud83c\udfb1|\ud83c\udfb2|\ud83c\udfb3|\ud83c\udfb4|\ud83c\udfb5|\ud83c\udfb6|\ud83c\udfb7|\ud83c\udfb8|\ud83c\udfb9|\ud83c\udfba|\ud83c\udfbb|\ud83c\udfbc|\ud83c\udfbd|\ud83c\udfbe|\ud83c\udfbf|\ud83c\udfc0|\ud83c\udfc1|\ud83c\udfc2|\ud83c\udfc3|\ud83c\udfc4|\ud83c\udfc6|\ud83c\udfc8|\ud83c\udfca|\ud83c\udfe0|\ud83c\udfe1|\ud83c\udfe2|\ud83c\udfe3|\ud83c\udfe5|\ud83c\udfe6|\ud83c\udfe7|\ud83c\udfe8|\ud83c\udfe9|\ud83c\udfea|\ud83c\udfeb|\ud83c\udfec|\ud83c\udfed|\ud83c\udfee|\ud83c\udfef|\ud83c\udff0|\ud83d\udc0c|\ud83d\udc0d|\ud83d\udc0e|\ud83d\udc11|\ud83d\udc12|\ud83d\udc14|\ud83d\udc17|\ud83d\udc18|\ud83d\udc19|\ud83d\udc1a|\ud83d\udc1b|\ud83d\udc1c|\ud83d\udc1d|\ud83d\udc1e|\ud83d\udc1f|\ud83d\udc20|\ud83d\udc21|\ud83d\udc22|\ud83d\udc23|\ud83d\udc24|\ud83d\udc25|\ud83d\udc26|\ud83d\udc27|\ud83d\udc28|\ud83d\udc29|\ud83d\udc2b|\ud83d\udc2c|\ud83d\udc2d|\ud83d\udc2e|\ud83d\udc2f|\ud83d\udc30|\ud83d\udc31|\ud83d\udc32|\ud83d\udc33|\ud83d\udc34|\ud83d\udc35|\ud83d\udc36|\ud83d\udc37|\ud83d\udc38|\ud83d\udc39|\ud83d\udc3a|\ud83d\udc3b|\ud83d\udc3c|\ud83d\udc3d|\ud83d\udc3e|\ud83d\udc40|\ud83d\udc42|\ud83d\udc43|\ud83d\udc44|\ud83d\udc45|\ud83d\udc46|\ud83d\udc47|\ud83d\udc48|\ud83d\udc49|\ud83d\udc4a|\ud83d\udc4b|\ud83d\udc4c|\ud83d\udc4d|\ud83d\udc4e|\ud83d\udc4f|\ud83d\udc50|\ud83d\udc51|\ud83d\udc52|\ud83d\udc53|\ud83d\udc54|\ud83d\udc55|\ud83d\udc56|\ud83d\udc57|\ud83d\udc58|\ud83d\udc59|\ud83d\udc5a|\ud83d\udc5b|\ud83d\udc5c|\ud83d\udc5d|\ud83d\udc5e|\ud83d\udc5f|\ud83d\udc60|\ud83d\udc61|\ud83d\udc62|\ud83d\udc63|\ud83d\udc64|\ud83d\udc66|\ud83d\udc67|\ud83d\udc68|\ud83d\udc69|\ud83d\udc6a|\ud83d\udc6b|\ud83d\udc6e|\ud83d\udc6f|\ud83d\udc70|\ud83d\udc71|\ud83d\udc72|\ud83d\udc73|\ud83d\udc74|\ud83d\udc75|\ud83d\udc76|\ud83d\udeb4|\ud83d\udc78|\ud83d\udc79|\ud83d\udc7a|\ud83d\udc7b|\ud83d\udc7c|\ud83d\udc7d|\ud83d\udc7e|\ud83d\udc7f|\ud83d\udc80|\ud83d\udc81|\ud83d\udc82|\ud83d\udc83|\ud83d\udc84|\ud83d\udc85|\ud83d\udc86|\ud83d\udc87|\ud83d\udc88|\ud83d\udc89|\ud83d\udc8a|\ud83d\udc8b|\ud83d\udc8c|\ud83d\udc8d|\ud83d\udc8e|\ud83d\udc8f|\ud83d\udc90|\ud83d\udc91|\ud83d\udc92|\ud83d\udc93|\ud83d\udc94|\ud83d\udc95|\ud83d\udc96|\ud83d\udc97|\ud83d\udc98|\ud83d\udc99|\ud83d\udc9a|\ud83d\udc9b|\ud83d\udc9c|\ud83d\udc9d|\ud83d\udc9e|\ud83d\udc9f|\ud83d\udca0|\ud83d\udca1|\ud83d\udca2|\ud83d\udca3|\ud83d\udca4|\ud83d\udca5|\ud83d\udca6|\ud83d\udca7|\ud83d\udca8|\ud83d\udca9|\ud83d\udcaa|\ud83d\udcab|\ud83d\udcac|\ud83d\udcae|\ud83d\udcaf|\ud83d\udcb0|\ud83d\udcb1|\ud83d\udcb2|\ud83d\udcb3|\ud83d\udcb4|\ud83d\udcb5|\ud83d\udcb8|\ud83d\udcb9|\ud83d\udcba|\ud83d\udcbb|\ud83d\udcbc|\ud83d\udcbd|\ud83d\udcbe|\ud83d\udcbf|\ud83d\udcc0|\ud83d\udcc1|\ud83d\udcc2|\ud83d\udcc3|\ud83d\udcc4|\ud83d\udcc5|\ud83d\udcc6|\ud83d\udcc7|\ud83d\udcc8|\ud83d\udcc9|\ud83d\udcca|\ud83d\udccb|\ud83d\udccc|\ud83d\udccd|\ud83d\udcce|\ud83d\udccf|\ud83d\udcd0|\ud83d\udcd1|\ud83d\udcd2|\ud83d\udcd3|\ud83d\udcd4|\ud83d\udcd5|\ud83d\udcd6|\ud83d\udcd7|\ud83d\udcd8|\ud83d\udcd9|\ud83d\udcda|\ud83d\udcdb|\ud83d\udcdc|\ud83d\udcdd|\ud83d\udcde|\ud83d\udcdf|\ud83d\udce0|\ud83d\udce1|\ud83d\udce2|\ud83d\udce3|\ud83d\udce4|\ud83d\udce5|\ud83d\udce6|\ud83d\udce7|\ud83d\udce8|\ud83d\udce9|\ud83d\udcea|\ud83d\udceb|\ud83d\udcee|\ud83d\udcf0|\ud83d\udcf1|\ud83d\udcf2|\ud83d\udcf3|\ud83d\udcf4|\ud83d\udcf6|\ud83d\udcf7|\ud83d\udcf9|\ud83d\udcfa|\ud83d\udcfb|\ud83d\udcfc|\ud83d\udd03|\ud83d\udd0a|\ud83d\udd0b|\ud83d\udd0c|\ud83d\udd0d|\ud83d\udd0e|\ud83d\udd0f|\ud83d\udd10|\ud83d\udd11|\ud83d\udd12|\ud83d\udd13|\ud83d\udd14|\ud83d\udd16|\ud83d\udd17|\ud83d\udd18|\ud83d\udd19|\ud83d\udd1a|\ud83d\udd1b|\ud83d\udd1c|\ud83d\udd1d|\ud83d\udd1e|\ud83d\udd1f|\ud83d\udd20|\ud83d\udd21|\ud83d\udd22|\ud83d\udd23|\ud83d\udd24|\ud83d\udd25|\ud83d\udd26|\ud83d\udd27|\ud83d\udd28|\ud83d\udd29|\ud83d\udd2a|\ud83d\udd2b|\ud83d\udd2e|\ud83d\udd2f|\ud83d\udd30|\ud83d\udd31|\ud83d\udd32|\ud83d\udd33|\ud83d\udd34|\ud83d\udd35|\ud83d\udd36|\ud83d\udd37|\ud83d\udd38|\ud83d\udd39|\ud83d\udd3a|\ud83d\udd3b|\ud83d\udd3c|\ud83d\udd3d|\ud83d\udd50|\ud83d\udd51|\ud83d\udd52|\ud83d\udd53|\ud83d\udd54|\ud83d\udd55|\ud83d\udd56|\ud83d\udd57|\ud83d\udd58|\ud83d\udd59|\ud83d\udd5a|\ud83d\udd5b|\ud83d\uddfb|\ud83d\uddfc|\ud83d\uddfd|\ud83d\uddfe|\ud83d\uddff|\ud83d\ude01|\ud83d\ude02|\ud83d\ude03|\ud83d\ude04|\ud83d\ude05|\ud83d\ude06|\ud83d\ude09|\ud83d\ude0a|\ud83d\ude0b|\ud83d\ude0c|\ud83d\ude0d|\ud83d\ude0f|\ud83d\ude12|\ud83d\ude13|\ud83d\ude14|\ud83d\ude16|\ud83d\ude18|\ud83d\ude1a|\ud83d\ude1c|\ud83d\ude1d|\ud83d\ude1e|\ud83d\ude20|\ud83d\ude21|\ud83d\ude22|\ud83d\ude23|\ud83d\ude24|\ud83d\ude25|\ud83d\ude28|\ud83d\ude29|\ud83d\ude2a|\ud83d\ude2b|\ud83d\ude2d|\ud83d\ude30|\ud83d\ude31|\ud83d\ude32|\ud83d\ude33|\ud83d\ude35|\ud83d\ude37|\ud83d\ude38|\ud83d\ude39|\ud83d\ude3a|\ud83d\ude3b|\ud83d\ude3c|\ud83d\ude3d|\ud83d\ude3e|\ud83d\ude3f|\ud83d\ude40|\ud83d\ude45|\ud83d\ude46|\ud83d\ude47|\ud83d\ude48|\ud83d\ude49|\ud83d\ude4a|\ud83d\ude4b|\ud83d\ude4c|\ud83d\ude4d|\ud83d\ude4e|\ud83d\ude4f|\ud83d\ude80|\ud83d\ude83|\ud83d\ude84|\ud83d\ude85|\ud83d\ude87|\ud83d\ude89|\ud83d\ude8c|\ud83d\ude8f|\ud83d\ude91|\ud83d\ude92|\ud83d\ude93|\ud83d\ude95|\ud83d\ude97|\ud83d\ude99|\ud83d\ude9a|\ud83d\udea2|\ud83d\udea4|\ud83d\udea5|\ud83d\udea7|\ud83d\udea8|\ud83d\udea9|\ud83d\udeaa|\ud83d\udeab|\ud83d\udeac|\ud83d\udead|\ud83d\udeb2|\ud83d\udeb6|\ud83d\udeb9|\ud83d\udeba|\ud83d\udebb|\ud83d\udebc|\ud83d\udebd|\ud83d\udebe|\ud83d\udec0|\ud83c\udde6|\ud83c\udde7|\ud83c\udde8|\ud83c\udde9|\ud83c\uddea|\ud83c\uddeb|\ud83c\uddec|\ud83c\udded|\ud83c\uddee|\ud83c\uddef|\ud83c\uddf0|\ud83c\uddf1|\ud83c\uddf2|\ud83c\uddf3|\ud83c\uddf4|\ud83c\uddf5|\ud83c\uddf6|\ud83c\uddf7|\ud83c\uddf8|\ud83c\uddf9|\ud83c\uddfa|\ud83c\uddfb|\ud83c\uddfc|\ud83c\uddfd|\ud83c\uddfe|\ud83c\uddff|\ud83c\udf0d|\ud83c\udf0e|\ud83c\udf10|\ud83c\udf12|\ud83c\udf16|\ud83c\udf17|\ue50a|\u27b0|\u2797|\u2796|\u2795|\u2755|\u2754|\u2753|\u274e|\u274c|\u2728|\u270b|\u270a|\u2705|\u26ce|\u23f3|\u23f0|\u23ec|\u23eb|\u23ea|\u23e9|\u27bf|\u00a9|\u00ae)|(?:(?:\ud83c\udc04|\ud83c\udd70|\ud83c\udd71|\ud83c\udd7e|\ud83c\udd7f|\ud83c\ude02|\ud83c\ude1a|\ud83c\ude2f|\ud83c\ude37|\u3299|\u303d|\u3030|\u2b55|\u2b50|\u2b1c|\u2b1b|\u2b07|\u2b06|\u2b05|\u2935|\u2934|\u27a1|\u2764|\u2757|\u2747|\u2744|\u2734|\u2733|\u2716|\u2714|\u2712|\u270f|\u270c|\u2709|\u2708|\u2702|\u26fd|\u26fa|\u26f5|\u26f3|\u26f2|\u26ea|\u26d4|\u26c5|\u26c4|\u26be|\u26bd|\u26ab|\u26aa|\u26a1|\u26a0|\u2693|\u267f|\u267b|\u3297|\u2666|\u2665|\u2663|\u2660|\u2653|\u2652|\u2651|\u2650|\u264f|\u264e|\u264d|\u264c|\u264b|\u264a|\u2649|\u2648|\u263a|\u261d|\u2615|\u2614|\u2611|\u260e|\u2601|\u2600|\u25fe|\u25fd|\u25fc|\u25fb|\u25c0|\u25b6|\u25ab|\u25aa|\u24c2|\u231b|\u231a|\u21aa|\u21a9|\u2199|\u2198|\u2197|\u2196|\u2195|\u2194|\u2139|\u2122|\u2049|\u203c|\u2668)([\uFE0E\uFE0F]?)))/g;
//
//
///**
// * 解析字符串为 emoji 表情 img
// * @param str {String} 字符串
// * @param [options] {Object} 配置
// * @returns {String}
// */
//exports.emoji = function (str, options) {
//    options = dato.extend(exports.emoji.defaults, options);
//
//    if (!typeis.Function(options.callback)) {
//        options.callback = function (icon, options, variant) {
//            return ''.concat(options.base, options.size, '/', icon, options.ext);
//        };
//    }
//
//    return str.replace(REG_EMOJI, function (match, icon, variant) {
//        var ret = match;
//        // verify the variant is not the FE0E one
//        // this variant means "emoji as text" and should not
//        // require any action/replacement
//        // http://unicode.org/Public/UNIDATA/StandardizedVariants.html
//        if (variant !== '\uFE0E') {
//            var src = options.callback(
//                grabTheRightIcon(icon, variant),
//                options,
//                variant
//            );
//            if (src) {
//                // recycle the match string replacing the emoji
//                // with its image counter part
//                ret = '<img '.concat(
//                    'class="', options.className, '" ',
//                    'draggable="false" ',
//                    // needs to preserve user original intent
//                    // when variants should be copied and pasted too
//                    'alt="',
//                    match,
//                    '"',
//                    ' src="',
//                    src,
//                    '"'
//                );
//
//                ret = ret.concat('>');
//            }
//        }
//
//        return ret;
//    });
//};
//exports.emoji.defaults = {
//    callback: null,
//    base: 'https://twemoji.maxcdn.com/',
//    ext: '.png',
//    size: '36x36',
//    className: 'emoji'
//};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWxpZGF0b3IvbGlicy9zdHJpbmcuanMiXSwibmFtZXMiOlsiZGF0byIsInJlcXVpcmUiLCJ0eXBlaXMiLCJ3aW4iLCJnbG9iYWwiLCJ3aW5kb3ciLCJlc2NhcGVIVE1MTWFwIiwiUkVHX0hUTUxfQ09ERSIsInVuZXNjYXBlSFRNTE1hcCIsIlJFR19SRUdFU1AiLCJSRUdfQVNTSUdOX1ZBUklCTEUiLCJSRUdfU0VQQVJBVE9SIiwiUkVHX0hVTVAiLCJSRUdfU1RBUiIsIlJFR19OT1RfVVRGMTZfU0lOR0xFIiwiUkVHX0RPVUJMRSIsImV4cG9ydHMiLCJlc2NhcGVIVE1MIiwic3RyIiwiZWFjaCIsInNyYyIsInJlZyIsIlN0cmluZyIsInJlcGxhY2UiLCJ1bmVzY2FwZUhUTUwiLCJmdWxsIiwiaGV4IiwiY29kZSIsImZyb21DaGFyQ29kZSIsInBhcnNlSW50IiwiZXNjYXBlUmVnRXhwIiwiYXNzaWduIiwiYXJncyIsImFyZ3VtZW50cyIsImRhdGEiLCJvYmplY3QiLCJzbGljZSIsImNhbGwiLCJpbmRleCIsInZhbCIsImNvbnNvbGUiLCJsb2ciLCIkMCIsIiQxIiwiaHVtcHJpemUiLCJ1cHBlckNhc2VGaXJzdENoYXIiLCJsZW5ndGgiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0ciIsInNlcGFyYXRvcml6ZSIsInNlcGFyYXRvciIsInRvTG93ZXJDYXNlIiwiYmFzZTY0IiwidW5kZWZpbmVkIiwiQnVmZmVyIiwiYnRvYSIsImVuY29kZVVSSUNvbXBvbmVudCIsInRvU3RyaW5nIiwiZGViYXNlNjQiLCJkZWNvZGVVUklDb21wb25lbnQiLCJhdG9iIiwicGFkIiwiaXNMZWZ0IiwibWF4TGVuZ3RoIiwicGFkZGluZyIsInBhZExlZnQiLCJwYWRSaWdodCIsImdsb2IiLCJpZ25vcmVDYXNlIiwiUmVnRXhwIiwidGVzdCIsImJ5dGVzIiwic3RyaW5nIiwiZG91YmxlTGVuZ3RoIiwiaSIsImoiLCJrIiwiYyIsImNoYXJDb2RlQXQiXSwibWFwcGlu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suebuOWFs1xuICogQGF1dGhvciB5ZHIubWVcbiAqIEBjcmVhdGUgMjAxNS0wNS0xMSAxMDoyOFxuICovXG5cblxuLyoqXG4gKiBAbW9kdWxlIHV0aWxzL3N0cmluZ1xuICogQHJlcXVpcmVzIHV0aWxzL2RhdG9cbiAqIEByZXF1aXJlcyB1dGlscy90eXBlaXNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBkYXRvID0gcmVxdWlyZSgnLi9kYXRvLmpzJyk7XG52YXIgdHlwZWlzID0gcmVxdWlyZSgnLi90eXBlaXMuanMnKTtcblxudmFyIHdpbiA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93O1xudmFyIGVzY2FwZUhUTUxNYXAgPSB7XG4gICAgJyZhbXA7JzogLyYvZyxcbiAgICAnJmx0Oyc6IC88L2csXG4gICAgJyZndDsnOiAvPi9nLFxuICAgICcmcXVvdDsnOiAvXCIvZyxcbiAgICAnJmFwb3M7JzogLycvZyxcbiAgICAnJiN4MmY7JzogL1xcLy9nXG59O1xudmFyIFJFR19IVE1MX0NPREUgPSAvJiMoeCk/KFtcXHdcXGRdezAsNX0pOy9pO1xudmFyIHVuZXNjYXBlSFRNTE1hcCA9IHtcbiAgICAnJic6IC8mYW1wOy9nLFxuICAgICc8JzogLyZsdDsvZyxcbiAgICAnPic6IC8mZ3Q7L2csXG4gICAgJ1wiJzogLyZxdW90Oy9nLFxuICAgICdcXCcnOiAvJmFwb3M7L2csXG4gICAgJy8nOiAvJiN4MmY7L2dcbn07XG52YXIgUkVHX1JFR0VTUCA9IC9bLiorP149IToke30oKXxbXFxdXFwvXFxcXC1dL2c7XG4vLyB2YXIgUkVHX0FTU0lHTl9WQVJJQkxFID0gL1xcJFxcPChbXnt9XSo/KVxcPi9nO1xudmFyIFJFR19BU1NJR05fVkFSSUJMRSA9IC9cXCRcXHsoW157fV0qPyl9L2c7XG52YXIgUkVHX1NFUEFSQVRPUiA9IC9bLV8gXShbYS16XSkvZztcbnZhciBSRUdfSFVNUCA9IC9bQS1aXS9nO1xudmFyIFJFR19TVEFSID0gL1xcXFxcXCovZztcbnZhciBSRUdfTk9UX1VURjE2X1NJTkdMRSA9IC9bXlxceDAwLVxceGZmXXsyfS9nO1xudmFyIFJFR19ET1VCTEUgPSAvW15cXHgwMC1cXHhmZl0vZztcblxuXG4vKipcbiAqIOi9rOaNoiBIVE1MIOWtl+espuS4suS4uuWunuS9k+esplxuICogQHBhcmFtIHN0ciB7U3RyaW5nfSBodG1sIOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5lc2NhcGVIVE1MID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGRhdG8uZWFjaChlc2NhcGVIVE1MTWFwLCBmdW5jdGlvbiAoc3JjLCByZWcpIHtcbiAgICAgICAgc3RyID0gU3RyaW5nKHN0cikucmVwbGFjZShyZWcsIHNyYyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3RyO1xufTtcblxuXG4vKipcbiAqIOi9rOaNouWunuS9k+espuS4uiBIVE1MIOWtl+espuS4slxuICogQHBhcmFtIHN0ciB7U3RyaW5nfSBlbnRyeSDlrp7kvZPnrKZcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMudW5lc2NhcGVIVE1MID0gZnVuY3Rpb24gKHN0cikge1xuICAgIC8vIOi9rOaNouWunuS9k+aVsOWtl+S4uuWunuS9k+Wtl+avjVxuICAgIHN0ciA9IFN0cmluZyhzdHIpLnJlcGxhY2UoUkVHX0hUTUxfQ09ERSwgZnVuY3Rpb24gKGZ1bGwsIGhleCwgY29kZSkge1xuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChjb2RlLCBoZXggPyAxNiA6IDEwKSk7XG4gICAgfSk7XG5cbiAgICBkYXRvLmVhY2godW5lc2NhcGVIVE1MTWFwLCBmdW5jdGlvbiAoc3JjLCByZWcpIHtcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocmVnLCBzcmMpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHN0cjtcbn07XG5cblxuLyoqXG4gKiDovazmjaLmraPliJnlrZfnrKbkuLLkuLrlkIjms5XmraPliJlcbiAqIEBwYXJhbSBzdHIge1N0cmluZ30g5q2j5YiZ5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnRzLmVzY2FwZVJlZ0V4cCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoUkVHX1JFR0VTUCwgJ1xcXFwkJicpO1xufTtcblxuXG4vKipcbiAqIOWIhumFjeWtl+espuS4su+8jOWPguiAgyBlczZcbiAqIEBwYXJhbSBzdHIge1N0cmluZ30g5a2X56ym5Liy5qih5p2/XG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICogQGV4YW1wbGVcbiAqIHN0cmluZy5hc3NpZ24oJ0hlbGxvICR7bmFtZX0sIGhvdyBhcmUgeW91ICR7dGltZX0/Jywge1xuICAgICAqICAgICBuYW1lOiAnQm9iJyxcbiAgICAgKiAgICAgdGltZTogJ3RvZGF5J1xuICAgICAqIH0pO1xuICogLy8gPT4gXCJIZWxsbyBCb2IsIGhvdyBhcmUgeW91IHRvZGF5P1wiXG4gKlxuICogc3RyaW5nLmFzc2lnbignSGVsbG8gJHsxfSwgaG93IGFyZSB5b3UgJHsyfT8nLCAnQm9iJywgJ3RvZGF5Jyk7XG4gKiAvLyA9PiBcIkhlbGxvIEJvYiwgaG93IGFyZSB5b3UgdG9kYXk/XCJcbiAqL1xuZXhwb3J0cy5hc3NpZ24gPSBmdW5jdGlvbiAoc3RyLyphcmd1bWVudHMqLykge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBkYXRhID0ge307XG5cbiAgICAvLyB7fVxuICAgIGlmICh0eXBlaXMub2JqZWN0KGFyZ3NbMV0pKSB7XG4gICAgICAgIGRhdGEgPSBhcmdzWzFdO1xuICAgIH1cbiAgICAvLyAxLCAyLi4uXG4gICAgZWxzZSB7XG4gICAgICAgIGRhdG8uZWFjaChbXS5zbGljZS5jYWxsKGFyZ3MsIDEpLCBmdW5jdGlvbiAoaW5kZXgsIHZhbCkge1xuICAgICAgICAgICAgZGF0YVtpbmRleCArIDFdID0gdmFsO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJzdHI6IFwiLCBzdHIpO1xuICAgIGNvbnNvbGUubG9nKFwiUkVHX0FTU0lHTl9WQVJJQkxFOiBcIiwgUkVHX0FTU0lHTl9WQVJJQkxFKTtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoUkVHX0FTU0lHTl9WQVJJQkxFLCBmdW5jdGlvbiAoJDAsICQxKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZGF0YVskMV06IFwiLCBkYXRhWyQxXSlcbiAgICAgICAgcmV0dXJuIFN0cmluZyhkYXRhWyQxXSk7XG4gICAgfSk7XG59O1xuXG5cbi8qKlxuICog6L2s5o2i5YiG6ZqU56ym5a2X56ym5Liy5Li66am85bOw5b2i5byPXG4gKiBAcGFyYW0gc3RyIHtTdHJpbmd9IOWIhumalOespuWtl+espuS4slxuICogQHBhcmFtIFt1cHBlckNhc2VGaXJzdENoYXI9ZmFsc2VdIHtCb29sZWFufSDmmK/lkKblpKflhpnnrKzkuIDkuKrlrZfmr41cbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKlxuICogQGV4YW1wbGVcbiAqIHN0cmluZy5odW1wcml6ZSgnbW96LWJvcmRlci1yYWRpdXMnKTtcbiAqIC8vID0+IFwibW96Qm9yZGVyUmFkaXVzXCJcbiAqL1xuZXhwb3J0cy5odW1wcml6ZSA9IGZ1bmN0aW9uIChzdHIsIHVwcGVyQ2FzZUZpcnN0Q2hhcikge1xuICAgIGlmICghc3RyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIGlmICh1cHBlckNhc2VGaXJzdENoYXIpIHtcbiAgICAgICAgc3RyID0gc3RyWzBdLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyKDEpO1xuICAgIH1cblxuICAgIHJldHVybiBzdHIucmVwbGFjZShSRUdfU0VQQVJBVE9SLCBmdW5jdGlvbiAoJDAsICQxKSB7XG4gICAgICAgIHJldHVybiAkMS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xufTtcblxuXG4vKipcbiAqIOi9rOaNoumpvOWzsOWtl+espuS4suS4uuWIhumalOespuWtl+espuS4slxuICogQHBhcmFtIHN0ciB7U3RyaW5nfSDpqbzls7DlrZfnrKbkuLJcbiAqIEBwYXJhbSBbc2VwYXJhdG9yPVwiLVwiXSB7U3RyaW5nfSDliIbpmpTnrKZcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKiBAZXhhbXBsZVxuICogc3RyaW5nLnNlcGFyYXRvcml6ZSgnbW96Qm9yZGVyUmFkaXVzJyk7XG4gKiAvLyA9PiBcIm1vei1ib3JkZXItcmFkaXVzXCJcbiAqL1xuZXhwb3J0cy5zZXBhcmF0b3JpemUgPSBmdW5jdGlvbiAoc3RyLCBzZXBhcmF0b3IpIHtcbiAgICBpZiAoIXN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG5cbiAgICBzZXBhcmF0b3IgPSBzZXBhcmF0b3IgfHwgJy0nO1xuICAgIHN0ciA9IHN0clswXS50b0xvd2VyQ2FzZSgpICsgc3RyLnN1YnN0cigxKTtcblxuICAgIHJldHVybiBzdHIucmVwbGFjZShSRUdfSFVNUCwgZnVuY3Rpb24gKCQwKSB7XG4gICAgICAgIHJldHVybiBzZXBhcmF0b3IgKyAkMC50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xufTtcblxuXG4vKipcbiAqIGJhc2U2NCDnvJbnoIFcbiAqIEBwYXJhbSBzdHIge1N0cmluZ30g5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnRzLmJhc2U2NCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICBpZiAodHlwZWlzLnVuZGVmaW5lZCh3aW4uQnVmZmVyKSkge1xuICAgICAgICByZXR1cm4gYnRvYShlbmNvZGVVUklDb21wb25lbnQoc3RyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyB3aW4uQnVmZmVyKHN0ciwgJ3V0ZjgnKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgfVxufTtcblxuXG4vKipcbiAqIGJhc2U2NCDop6PnoIFcbiAqIEBwYXJhbSBzdHIge1N0cmluZ30g5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnRzLmRlYmFzZTY0ID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGlmICh0eXBlaXMudW5kZWZpbmVkKHdpbi5CdWZmZXIpKSB7XG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoYXRvYihzdHIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IHdpbi5CdWZmZXIoc3RyLCAnYmFzZTY0JykudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICog5aGr5YWF5a2X56ym5LiyXG4gKiBAcGFyYW0gaXNMZWZ0IHtCb29sZWFufSDmmK/lkKblt6bovrlcbiAqIEBwYXJhbSBzdHIge1N0cmluZ30g5a2X56ym5LiyXG4gKiBAcGFyYW0gW21heExlbmd0aF0ge051bWJlcn0g5pyA5aSn6ZW/5bqm77yM6buY6K6k5Li65a2X56ym5Liy6ZW/5bqmXG4gKiBAcGFyYW0gW3BhZGRpbmc9XCIgXCJdIHtTdHJpbmd9IOWhq+WFheWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xudmFyIHBhZCA9IGZ1bmN0aW9uIChpc0xlZnQsIHN0ciwgbWF4TGVuZ3RoLCBwYWRkaW5nKSB7XG4gICAgdmFyIGxlbmd0aCA9IHN0ci5sZW5ndGg7XG5cbiAgICBwYWRkaW5nID0gcGFkZGluZyB8fCAnICc7XG4gICAgbWF4TGVuZ3RoID0gbWF4TGVuZ3RoIHx8IGxlbmd0aDtcblxuICAgIGlmIChtYXhMZW5ndGggPD0gbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuXG4gICAgd2hpbGUgKCgrK2xlbmd0aCkgPD0gbWF4TGVuZ3RoKSB7XG4gICAgICAgIHN0ciA9IGlzTGVmdCA/IHBhZGRpbmcgKyBzdHIgOiBzdHIgKyBwYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBzdHI7XG59O1xuXG5cbi8qKlxuICog5bem5aGr5YWFXG4gKiBAcGFyYW0gc3RyIHsqfSDlrZfnrKbkuLJcbiAqIEBwYXJhbSBbbWF4TGVuZ3RoXSB7TnVtYmVyfSDmnIDlpKfplb/luqbvvIzpu5jorqTkuLrlrZfnrKbkuLLplb/luqZcbiAqIEBwYXJhbSBbcGFkZGluZz1cIiBcIl0ge1N0cmluZ30g5aGr5YWF5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5leHBvcnRzLnBhZExlZnQgPSBmdW5jdGlvbiAoc3RyLCBtYXhMZW5ndGgsIHBhZGRpbmcpIHtcbiAgICByZXR1cm4gcGFkKHRydWUsIFN0cmluZyhzdHIpLCBtYXhMZW5ndGgsIHBhZGRpbmcpO1xufTtcblxuXG4vKipcbiAqIOWPs+Whq+WFhVxuICogQHBhcmFtIHN0ciB7Kn0g5a2X56ym5LiyXG4gKiBAcGFyYW0gW21heExlbmd0aF0ge051bWJlcn0g5pyA5aSn6ZW/5bqm77yM6buY6K6k5Li65a2X56ym5Liy6ZW/5bqmXG4gKiBAcGFyYW0gW3BhZGRpbmc9XCIgXCJdIHtTdHJpbmd9IOWhq+WFheWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5wYWRSaWdodCA9IGZ1bmN0aW9uIChzdHIsIG1heExlbmd0aCwgcGFkZGluZykge1xuICAgIHJldHVybiBwYWQoZmFsc2UsIFN0cmluZyhzdHIpLCBtYXhMZW5ndGgsIHBhZGRpbmcpO1xufTtcblxuXG4vKipcbiAqIOmdnueCueWMuemFjVxuICogQHBhcmFtIHN0ciB7U3RyaW5nfSDooqvljLnphY3lrZfnrKZcbiAqIEBwYXJhbSBnbG9iIHtTdHJpbmd9IOWMuemFjeWtl+esplxuICogQHBhcmFtIFtpZ25vcmVDYXNlPWZhbHNlXSB7Qm9vbGVhbn0g5piv5ZCm5b+955Wl5aSn5bCP5YaZXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqIEBleGFtcGxlXG4gKiBzdHJpbmcuZ2xvYignYWJjLmRlZi5jb20nLCAnYWJjLiouY29tJyk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmV4cG9ydHMuZ2xvYiA9IGZ1bmN0aW9uIChzdHIsIGdsb2IsIGlnbm9yZUNhc2UpIHtcbiAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChleHBvcnRzLmVzY2FwZVJlZ0V4cChnbG9iKS5yZXBsYWNlKFJFR19TVEFSLCAnW14uXSs/JyksIGlnbm9yZUNhc2UgPyAnaScgOiAnJyk7XG5cbiAgICByZXR1cm4gcmVnLnRlc3Qoc3RyKTtcbn07XG5cblxuLyoqXG4gKiDorqHnrpflrZfoioLplb/luqZcbiAqIEBwYXJhbSBzdHJpbmcge1N0cmluZ30g5Y6f5aeL5a2X56ym5LiyXG4gKiBAcGFyYW0gW2RvdWJsZUxlbmd0aD0yXSB7TnVtYmVyfSDlj4zlrZfoioLplb/luqbvvIzpu5jorqTkuLoyXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICpcbiAqIEBleGFtcGxlXG4gKiBkYXRhLmJ5dGVzKCfmiJExMjMnKTtcbiAqIC8vID0+IDVcbiAqL1xuZXhwb3J0cy5ieXRlcyA9IGZ1bmN0aW9uIChzdHJpbmcsIGRvdWJsZUxlbmd0aCkge1xuICAgIHN0cmluZyArPSAnJztcbiAgICBkb3VibGVMZW5ndGggPSBkb3VibGVMZW5ndGggfHwgMjtcblxuICAgIHZhciBpID0gMCxcbiAgICAgICAgaiA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgIGsgPSAwLFxuICAgICAgICBjO1xuXG4gICAgZm9yICg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgYyA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBrICs9IChjID49IDB4MDAwMSAmJiBjIDw9IDB4MDA3ZSkgfHwgKDB4ZmY2MCA8PSBjICYmIGMgPD0gMHhmZjlmKSA/IDEgOiBkb3VibGVMZW5ndGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIGs7XG59O1xuXG5cbi8qKlxuICog6K6h566X5a2X56ym5Liy6ZW/5bqmXG4gKiDlj4zlrZfoioLnmoTlrZfnrKbkvb/nlKggbGVuZ3RoIOWxnuaAp+iuoeeul+S4jeWHhuehrlxuICogQHJlZiBodHRwOi8vZXM2LnJ1YW55aWZlbmcuY29tLyNkb2NzL3N0cmluZ1xuICogQHBhcmFtIHN0ciB7U3RyaW5nfSDljp/lp4vlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBzID0gXCLwoK63XCI7XG4gKiBzLmxlbmd0aCA9IDI7XG4gKiBzdHJpbmcubGVuZ3RoKHMpO1xuICogLy8gPT4gM1xuICovXG5leHBvcnRzLmxlbmd0aCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICByZXR1cm4gU3RyaW5nKHN0cikucmVwbGFjZShSRUdfTk9UX1VURjE2X1NJTkdMRSwgJyonKS5sZW5ndGg7XG59O1xuXG5cbi8vLyoqXG4vLyAqIOWwhueJueauiuWtl+espui9rOaIkCB1bmljb2RlIOe8lueggVxuLy8gKiBAcGFyYW0gc3RyIHtTdHJpbmd9XG4vLyAqIEByZXR1cm5zIHtzdHJpbmd9XG4vLyAqL1xuLy9leHBvcnRzLnRvVW5pY29kZSA9IGZ1bmN0aW9uIChzdHIpIHtcbi8vICAgIHJldHVybiBzdHIucmVwbGFjZShSRUdfRE9VQkxFLCBmdW5jdGlvbiAoJDApIHtcbi8vICAgICAgICByZXR1cm4gJ1xcXFx1JyArICQwLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpO1xuLy8gICAgfSk7XG4vL307XG4vL1xuLy9cbi8vLyoqXG4vLyAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS90d2l0dGVyL3R3ZW1vamkvYmxvYi9naC1wYWdlcy90d2Vtb2ppLmFtZC5qcyNMNTcxXG4vLyAqIEBwYXJhbSB1bmljb2RlU3Vycm9nYXRlc1xuLy8gKiBAcGFyYW0gc2VwXG4vLyAqIEByZXR1cm5zIHtzdHJpbmd9XG4vLyAqL1xuLy9mdW5jdGlvbiB0b0NvZGVQb2ludCh1bmljb2RlU3Vycm9nYXRlcywgc2VwKSB7XG4vLyAgICB2YXJcbi8vICAgICAgICByID0gW10sXG4vLyAgICAgICAgYyA9IDAsXG4vLyAgICAgICAgcCA9IDAsXG4vLyAgICAgICAgaSA9IDA7XG4vLyAgICB3aGlsZSAoaSA8IHVuaWNvZGVTdXJyb2dhdGVzLmxlbmd0aCkge1xuLy8gICAgICAgIGMgPSB1bmljb2RlU3Vycm9nYXRlcy5jaGFyQ29kZUF0KGkrKyk7XG4vLyAgICAgICAgaWYgKHApIHtcbi8vICAgICAgICAgICAgci5wdXNoKCgweDEwMDAwICsgKChwIC0gMHhEODAwKSA8PCAxMCkgKyAoYyAtIDB4REMwMCkpLnRvU3RyaW5nKDE2KSk7XG4vLyAgICAgICAgICAgIHAgPSAwO1xuLy8gICAgICAgIH0gZWxzZSBpZiAoMHhEODAwIDw9IGMgJiYgYyA8PSAweERCRkYpIHtcbi8vICAgICAgICAgICAgcCA9IGM7XG4vLyAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgci5wdXNoKGMudG9TdHJpbmcoMTYpKTtcbi8vICAgICAgICB9XG4vLyAgICB9XG4vLyAgICByZXR1cm4gci5qb2luKHNlcCB8fCAnLScpO1xuLy99XG4vL1xuLy9cbi8vLyoqXG4vLyAqIFVzZWQgdG8gYm90aCByZW1vdmUgdGhlIHBvc3NpYmxlIHZhcmlhbnRcbi8vICogYW5kIHRvIGNvbnZlcnQgdXRmMTYgaW50byBjb2RlIHBvaW50c1xuLy8gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vdHdpdHRlci90d2Vtb2ppL2Jsb2IvZ2gtcGFnZXMvdHdlbW9qaS5hbWQuanMjTDMyMlxuLy8gKiBAcGFyYW0gIGljb24ge3N0cmluZ30gICAgdGhlIGVtb2ppIHN1cnJvZ2F0ZSBwYWlyXG4vLyAqIEBwYXJhbSAgdmFyaWFudCB7c3RyaW5nfSAgICB0aGUgb3B0aW9uYWwgdmFyaWFudCBjaGFyLCBpZiBhbnlcbi8vICovXG4vL2Z1bmN0aW9uIGdyYWJUaGVSaWdodEljb24oaWNvbiwgdmFyaWFudCkge1xuLy8gICAgLy8gaWYgdmFyaWFudCBpcyBwcmVzZW50IGFzIFxcdUZFMEZcbi8vICAgIHJldHVybiB0b0NvZGVQb2ludChcbi8vICAgICAgICB2YXJpYW50ID09PSAnXFx1RkUwRicgP1xuLy8gICAgICAgICAgICAvLyB0aGUgaWNvbiBzaG91bGQgbm90IGNvbnRhaW4gaXRcbi8vICAgICAgICAgICAgaWNvbi5zbGljZSgwLCAtMSkgOlxuLy8gICAgICAgICAgICAvLyBmaXggbm9uIHN0YW5kYXJkIE9TWCBiZWhhdmlvclxuLy8gICAgICAgICAgICAoaWNvbi5sZW5ndGggPT09IDMgJiYgaWNvbi5jaGFyQXQoMSkgPT09ICdcXHVGRTBGJyA/XG4vLyAgICAgICAgICAgIGljb24uY2hhckF0KDApICsgaWNvbi5jaGFyQXQoMikgOiBpY29uKVxuLy8gICAgKTtcbi8vfVxuLy9cbi8vLy8gUmVnRXhwIGJhc2VkIG9uIGVtb2ppJ3Mgb2ZmaWNpYWwgVW5pY29kZSBzdGFuZGFyZHNcbi8vLy8gQGxpbmsgaHR0cDovL3d3dy51bmljb2RlLm9yZy9QdWJsaWMvVU5JREFUQS9FbW9qaVNvdXJjZXMudHh0XG4vLy8vIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS90d2l0dGVyL3R3ZW1vamkvYmxvYi9naC1wYWdlcy90d2Vtb2ppLmFtZC5qcyNMMjM3XG4vL3ZhciBSRUdfRU1PSkkgPSAvKCg/OlxcdWQ4M2NcXHVkZGU4XFx1ZDgzY1xcdWRkZjN8XFx1ZDgzY1xcdWRkZmFcXHVkODNjXFx1ZGRmOHxcXHVkODNjXFx1ZGRmN1xcdWQ4M2NcXHVkZGZhfFxcdWQ4M2NcXHVkZGYwXFx1ZDgzY1xcdWRkZjd8XFx1ZDgzY1xcdWRkZWZcXHVkODNjXFx1ZGRmNXxcXHVkODNjXFx1ZGRlZVxcdWQ4M2NcXHVkZGY5fFxcdWQ4M2NcXHVkZGVjXFx1ZDgzY1xcdWRkZTd8XFx1ZDgzY1xcdWRkZWJcXHVkODNjXFx1ZGRmN3xcXHVkODNjXFx1ZGRlYVxcdWQ4M2NcXHVkZGY4fFxcdWQ4M2NcXHVkZGU5XFx1ZDgzY1xcdWRkZWF8XFx1MDAzOVxcdWZlMGY/XFx1MjBlM3xcXHUwMDM4XFx1ZmUwZj9cXHUyMGUzfFxcdTAwMzdcXHVmZTBmP1xcdTIwZTN8XFx1MDAzNlxcdWZlMGY/XFx1MjBlM3xcXHUwMDM1XFx1ZmUwZj9cXHUyMGUzfFxcdTAwMzRcXHVmZTBmP1xcdTIwZTN8XFx1MDAzM1xcdWZlMGY/XFx1MjBlM3xcXHUwMDMyXFx1ZmUwZj9cXHUyMGUzfFxcdTAwMzFcXHVmZTBmP1xcdTIwZTN8XFx1MDAzMFxcdWZlMGY/XFx1MjBlM3xcXHUwMDIzXFx1ZmUwZj9cXHUyMGUzfFxcdWQ4M2RcXHVkZWIzfFxcdWQ4M2RcXHVkZWIxfFxcdWQ4M2RcXHVkZWIwfFxcdWQ4M2RcXHVkZWFmfFxcdWQ4M2RcXHVkZWFlfFxcdWQ4M2RcXHVkZWE2fFxcdWQ4M2RcXHVkZWEzfFxcdWQ4M2RcXHVkZWExfFxcdWQ4M2RcXHVkZWEwfFxcdWQ4M2RcXHVkZTlmfFxcdWQ4M2RcXHVkZTllfFxcdWQ4M2RcXHVkZTlkfFxcdWQ4M2RcXHVkZTljfFxcdWQ4M2RcXHVkZTlifFxcdWQ4M2RcXHVkZTk4fFxcdWQ4M2RcXHVkZTk2fFxcdWQ4M2RcXHVkZTk0fFxcdWQ4M2RcXHVkZTkwfFxcdWQ4M2RcXHVkZThlfFxcdWQ4M2RcXHVkZThkfFxcdWQ4M2RcXHVkZThifFxcdWQ4M2RcXHVkZThhfFxcdWQ4M2RcXHVkZTg4fFxcdWQ4M2RcXHVkZTg2fFxcdWQ4M2RcXHVkZTgyfFxcdWQ4M2RcXHVkZTgxfFxcdWQ4M2RcXHVkZTM2fFxcdWQ4M2RcXHVkZTM0fFxcdWQ4M2RcXHVkZTJmfFxcdWQ4M2RcXHVkZTJlfFxcdWQ4M2RcXHVkZTJjfFxcdWQ4M2RcXHVkZTI3fFxcdWQ4M2RcXHVkZTI2fFxcdWQ4M2RcXHVkZTFmfFxcdWQ4M2RcXHVkZTFifFxcdWQ4M2RcXHVkZTE5fFxcdWQ4M2RcXHVkZTE3fFxcdWQ4M2RcXHVkZTE1fFxcdWQ4M2RcXHVkZTExfFxcdWQ4M2RcXHVkZTEwfFxcdWQ4M2RcXHVkZTBlfFxcdWQ4M2RcXHVkZTA4fFxcdWQ4M2RcXHVkZTA3fFxcdWQ4M2RcXHVkZTAwfFxcdWQ4M2RcXHVkZDY3fFxcdWQ4M2RcXHVkZDY2fFxcdWQ4M2RcXHVkZDY1fFxcdWQ4M2RcXHVkZDY0fFxcdWQ4M2RcXHVkZDYzfFxcdWQ4M2RcXHVkZDYyfFxcdWQ4M2RcXHVkZDYxfFxcdWQ4M2RcXHVkZDYwfFxcdWQ4M2RcXHVkZDVmfFxcdWQ4M2RcXHVkZDVlfFxcdWQ4M2RcXHVkZDVkfFxcdWQ4M2RcXHVkZDVjfFxcdWQ4M2RcXHVkZDJkfFxcdWQ4M2RcXHVkZDJjfFxcdWQ4M2RcXHVkZDE1fFxcdWQ4M2RcXHVkZDA5fFxcdWQ4M2RcXHVkZDA4fFxcdWQ4M2RcXHVkZDA3fFxcdWQ4M2RcXHVkZDA2fFxcdWQ4M2RcXHVkZDA1fFxcdWQ4M2RcXHVkZDA0fFxcdWQ4M2RcXHVkZDAyfFxcdWQ4M2RcXHVkZDAxfFxcdWQ4M2RcXHVkZDAwfFxcdWQ4M2RcXHVkY2Y1fFxcdWQ4M2RcXHVkY2VmfFxcdWQ4M2RcXHVkY2VkfFxcdWQ4M2RcXHVkY2VjfFxcdWQ4M2RcXHVkY2I3fFxcdWQ4M2RcXHVkY2I2fFxcdWQ4M2RcXHVkY2FkfFxcdWQ4M2RcXHVkYzZkfFxcdWQ4M2RcXHVkYzZjfFxcdWQ4M2RcXHVkYzY1fFxcdWQ4M2RcXHVkYzJhfFxcdWQ4M2RcXHVkYzE2fFxcdWQ4M2RcXHVkYzE1fFxcdWQ4M2RcXHVkYzEzfFxcdWQ4M2RcXHVkYzEwfFxcdWQ4M2RcXHVkYzBmfFxcdWQ4M2RcXHVkYzBifFxcdWQ4M2RcXHVkYzBhfFxcdWQ4M2RcXHVkYzA5fFxcdWQ4M2RcXHVkYzA4fFxcdWQ4M2RcXHVkYzA3fFxcdWQ4M2RcXHVkYzA2fFxcdWQ4M2RcXHVkYzA1fFxcdWQ4M2RcXHVkYzA0fFxcdWQ4M2RcXHVkYzAzfFxcdWQ4M2RcXHVkYzAyfFxcdWQ4M2RcXHVkYzAxfFxcdWQ4M2RcXHVkYzAwfFxcdWQ4M2NcXHVkZmU0fFxcdWQ4M2NcXHVkZmM5fFxcdWQ4M2NcXHVkZmM3fFxcdWQ4M2NcXHVkZjdjfFxcdWQ4M2NcXHVkZjUwfFxcdWQ4M2NcXHVkZjRifFxcdWQ4M2NcXHVkZjMzfFxcdWQ4M2NcXHVkZjMyfFxcdWQ4M2NcXHVkZjFlfFxcdWQ4M2NcXHVkZjFkfFxcdWQ4M2NcXHVkZjFjfFxcdWQ4M2NcXHVkZjFhfFxcdWQ4M2NcXHVkZjE4fFxcdWQ4M2NcXHVkY2NmfFxcdWQ4M2NcXHVkZDhlfFxcdWQ4M2NcXHVkZDkxfFxcdWQ4M2NcXHVkZDkyfFxcdWQ4M2NcXHVkZDkzfFxcdWQ4M2NcXHVkZDk0fFxcdWQ4M2NcXHVkZDk1fFxcdWQ4M2NcXHVkZDk2fFxcdWQ4M2NcXHVkZDk3fFxcdWQ4M2NcXHVkZDk4fFxcdWQ4M2NcXHVkZDk5fFxcdWQ4M2NcXHVkZDlhfFxcdWQ4M2RcXHVkYzc3fFxcdWQ4M2RcXHVkZWM1fFxcdWQ4M2RcXHVkZWM0fFxcdWQ4M2RcXHVkZWMzfFxcdWQ4M2RcXHVkZWMyfFxcdWQ4M2RcXHVkZWMxfFxcdWQ4M2RcXHVkZWJmfFxcdWQ4M2RcXHVkZWI4fFxcdWQ4M2RcXHVkZWI3fFxcdWQ4M2RcXHVkZWI1fFxcdWQ4M2NcXHVkZTAxfFxcdWQ4M2NcXHVkZTMyfFxcdWQ4M2NcXHVkZTMzfFxcdWQ4M2NcXHVkZTM0fFxcdWQ4M2NcXHVkZTM1fFxcdWQ4M2NcXHVkZTM2fFxcdWQ4M2NcXHVkZTM4fFxcdWQ4M2NcXHVkZTM5fFxcdWQ4M2NcXHVkZTNhfFxcdWQ4M2NcXHVkZTUwfFxcdWQ4M2NcXHVkZTUxfFxcdWQ4M2NcXHVkZjAwfFxcdWQ4M2NcXHVkZjAxfFxcdWQ4M2NcXHVkZjAyfFxcdWQ4M2NcXHVkZjAzfFxcdWQ4M2NcXHVkZjA0fFxcdWQ4M2NcXHVkZjA1fFxcdWQ4M2NcXHVkZjA2fFxcdWQ4M2NcXHVkZjA3fFxcdWQ4M2NcXHVkZjA4fFxcdWQ4M2NcXHVkZjA5fFxcdWQ4M2NcXHVkZjBhfFxcdWQ4M2NcXHVkZjBifFxcdWQ4M2NcXHVkZjBjfFxcdWQ4M2NcXHVkZjBmfFxcdWQ4M2NcXHVkZjExfFxcdWQ4M2NcXHVkZjEzfFxcdWQ4M2NcXHVkZjE0fFxcdWQ4M2NcXHVkZjE1fFxcdWQ4M2NcXHVkZjE5fFxcdWQ4M2NcXHVkZjFifFxcdWQ4M2NcXHVkZjFmfFxcdWQ4M2NcXHVkZjIwfFxcdWQ4M2NcXHVkZjMwfFxcdWQ4M2NcXHVkZjMxfFxcdWQ4M2NcXHVkZjM0fFxcdWQ4M2NcXHVkZjM1fFxcdWQ4M2NcXHVkZjM3fFxcdWQ4M2NcXHVkZjM4fFxcdWQ4M2NcXHVkZjM5fFxcdWQ4M2NcXHVkZjNhfFxcdWQ4M2NcXHVkZjNifFxcdWQ4M2NcXHVkZjNjfFxcdWQ4M2NcXHVkZjNkfFxcdWQ4M2NcXHVkZjNlfFxcdWQ4M2NcXHVkZjNmfFxcdWQ4M2NcXHVkZjQwfFxcdWQ4M2NcXHVkZjQxfFxcdWQ4M2NcXHVkZjQyfFxcdWQ4M2NcXHVkZjQzfFxcdWQ4M2NcXHVkZjQ0fFxcdWQ4M2NcXHVkZjQ1fFxcdWQ4M2NcXHVkZjQ2fFxcdWQ4M2NcXHVkZjQ3fFxcdWQ4M2NcXHVkZjQ4fFxcdWQ4M2NcXHVkZjQ5fFxcdWQ4M2NcXHVkZjRhfFxcdWQ4M2NcXHVkZjRjfFxcdWQ4M2NcXHVkZjRkfFxcdWQ4M2NcXHVkZjRlfFxcdWQ4M2NcXHVkZjRmfFxcdWQ4M2NcXHVkZjUxfFxcdWQ4M2NcXHVkZjUyfFxcdWQ4M2NcXHVkZjUzfFxcdWQ4M2NcXHVkZjU0fFxcdWQ4M2NcXHVkZjU1fFxcdWQ4M2NcXHVkZjU2fFxcdWQ4M2NcXHVkZjU3fFxcdWQ4M2NcXHVkZjU4fFxcdWQ4M2NcXHVkZjU5fFxcdWQ4M2NcXHVkZjVhfFxcdWQ4M2NcXHVkZjVifFxcdWQ4M2NcXHVkZjVjfFxcdWQ4M2NcXHVkZjVkfFxcdWQ4M2NcXHVkZjVlfFxcdWQ4M2NcXHVkZjVmfFxcdWQ4M2NcXHVkZjYwfFxcdWQ4M2NcXHVkZjYxfFxcdWQ4M2NcXHVkZjYyfFxcdWQ4M2NcXHVkZjYzfFxcdWQ4M2NcXHVkZjY0fFxcdWQ4M2NcXHVkZjY1fFxcdWQ4M2NcXHVkZjY2fFxcdWQ4M2NcXHVkZjY3fFxcdWQ4M2NcXHVkZjY4fFxcdWQ4M2NcXHVkZjY5fFxcdWQ4M2NcXHVkZjZhfFxcdWQ4M2NcXHVkZjZifFxcdWQ4M2NcXHVkZjZjfFxcdWQ4M2NcXHVkZjZkfFxcdWQ4M2NcXHVkZjZlfFxcdWQ4M2NcXHVkZjZmfFxcdWQ4M2NcXHVkZjcwfFxcdWQ4M2NcXHVkZjcxfFxcdWQ4M2NcXHVkZjcyfFxcdWQ4M2NcXHVkZjczfFxcdWQ4M2NcXHVkZjc0fFxcdWQ4M2NcXHVkZjc1fFxcdWQ4M2NcXHVkZjc2fFxcdWQ4M2NcXHVkZjc3fFxcdWQ4M2NcXHVkZjc4fFxcdWQ4M2NcXHVkZjc5fFxcdWQ4M2NcXHVkZjdhfFxcdWQ4M2NcXHVkZjdifFxcdWQ4M2NcXHVkZjgwfFxcdWQ4M2NcXHVkZjgxfFxcdWQ4M2NcXHVkZjgyfFxcdWQ4M2NcXHVkZjgzfFxcdWQ4M2NcXHVkZjg0fFxcdWQ4M2NcXHVkZjg1fFxcdWQ4M2NcXHVkZjg2fFxcdWQ4M2NcXHVkZjg3fFxcdWQ4M2NcXHVkZjg4fFxcdWQ4M2NcXHVkZjg5fFxcdWQ4M2NcXHVkZjhhfFxcdWQ4M2NcXHVkZjhifFxcdWQ4M2NcXHVkZjhjfFxcdWQ4M2NcXHVkZjhkfFxcdWQ4M2NcXHVkZjhlfFxcdWQ4M2NcXHVkZjhmfFxcdWQ4M2NcXHVkZjkwfFxcdWQ4M2NcXHVkZjkxfFxcdWQ4M2NcXHVkZjkyfFxcdWQ4M2NcXHVkZjkzfFxcdWQ4M2NcXHVkZmEwfFxcdWQ4M2NcXHVkZmExfFxcdWQ4M2NcXHVkZmEyfFxcdWQ4M2NcXHVkZmEzfFxcdWQ4M2NcXHVkZmE0fFxcdWQ4M2NcXHVkZmE1fFxcdWQ4M2NcXHVkZmE2fFxcdWQ4M2NcXHVkZmE3fFxcdWQ4M2NcXHVkZmE4fFxcdWQ4M2NcXHVkZmE5fFxcdWQ4M2NcXHVkZmFhfFxcdWQ4M2NcXHVkZmFifFxcdWQ4M2NcXHVkZmFjfFxcdWQ4M2NcXHVkZmFkfFxcdWQ4M2NcXHVkZmFlfFxcdWQ4M2NcXHVkZmFmfFxcdWQ4M2NcXHVkZmIwfFxcdWQ4M2NcXHVkZmIxfFxcdWQ4M2NcXHVkZmIyfFxcdWQ4M2NcXHVkZmIzfFxcdWQ4M2NcXHVkZmI0fFxcdWQ4M2NcXHVkZmI1fFxcdWQ4M2NcXHVkZmI2fFxcdWQ4M2NcXHVkZmI3fFxcdWQ4M2NcXHVkZmI4fFxcdWQ4M2NcXHVkZmI5fFxcdWQ4M2NcXHVkZmJhfFxcdWQ4M2NcXHVkZmJifFxcdWQ4M2NcXHVkZmJjfFxcdWQ4M2NcXHVkZmJkfFxcdWQ4M2NcXHVkZmJlfFxcdWQ4M2NcXHVkZmJmfFxcdWQ4M2NcXHVkZmMwfFxcdWQ4M2NcXHVkZmMxfFxcdWQ4M2NcXHVkZmMyfFxcdWQ4M2NcXHVkZmMzfFxcdWQ4M2NcXHVkZmM0fFxcdWQ4M2NcXHVkZmM2fFxcdWQ4M2NcXHVkZmM4fFxcdWQ4M2NcXHVkZmNhfFxcdWQ4M2NcXHVkZmUwfFxcdWQ4M2NcXHVkZmUxfFxcdWQ4M2NcXHVkZmUyfFxcdWQ4M2NcXHVkZmUzfFxcdWQ4M2NcXHVkZmU1fFxcdWQ4M2NcXHVkZmU2fFxcdWQ4M2NcXHVkZmU3fFxcdWQ4M2NcXHVkZmU4fFxcdWQ4M2NcXHVkZmU5fFxcdWQ4M2NcXHVkZmVhfFxcdWQ4M2NcXHVkZmVifFxcdWQ4M2NcXHVkZmVjfFxcdWQ4M2NcXHVkZmVkfFxcdWQ4M2NcXHVkZmVlfFxcdWQ4M2NcXHVkZmVmfFxcdWQ4M2NcXHVkZmYwfFxcdWQ4M2RcXHVkYzBjfFxcdWQ4M2RcXHVkYzBkfFxcdWQ4M2RcXHVkYzBlfFxcdWQ4M2RcXHVkYzExfFxcdWQ4M2RcXHVkYzEyfFxcdWQ4M2RcXHVkYzE0fFxcdWQ4M2RcXHVkYzE3fFxcdWQ4M2RcXHVkYzE4fFxcdWQ4M2RcXHVkYzE5fFxcdWQ4M2RcXHVkYzFhfFxcdWQ4M2RcXHVkYzFifFxcdWQ4M2RcXHVkYzFjfFxcdWQ4M2RcXHVkYzFkfFxcdWQ4M2RcXHVkYzFlfFxcdWQ4M2RcXHVkYzFmfFxcdWQ4M2RcXHVkYzIwfFxcdWQ4M2RcXHVkYzIxfFxcdWQ4M2RcXHVkYzIyfFxcdWQ4M2RcXHVkYzIzfFxcdWQ4M2RcXHVkYzI0fFxcdWQ4M2RcXHVkYzI1fFxcdWQ4M2RcXHVkYzI2fFxcdWQ4M2RcXHVkYzI3fFxcdWQ4M2RcXHVkYzI4fFxcdWQ4M2RcXHVkYzI5fFxcdWQ4M2RcXHVkYzJifFxcdWQ4M2RcXHVkYzJjfFxcdWQ4M2RcXHVkYzJkfFxcdWQ4M2RcXHVkYzJlfFxcdWQ4M2RcXHVkYzJmfFxcdWQ4M2RcXHVkYzMwfFxcdWQ4M2RcXHVkYzMxfFxcdWQ4M2RcXHVkYzMyfFxcdWQ4M2RcXHVkYzMzfFxcdWQ4M2RcXHVkYzM0fFxcdWQ4M2RcXHVkYzM1fFxcdWQ4M2RcXHVkYzM2fFxcdWQ4M2RcXHVkYzM3fFxcdWQ4M2RcXHVkYzM4fFxcdWQ4M2RcXHVkYzM5fFxcdWQ4M2RcXHVkYzNhfFxcdWQ4M2RcXHVkYzNifFxcdWQ4M2RcXHVkYzNjfFxcdWQ4M2RcXHVkYzNkfFxcdWQ4M2RcXHVkYzNlfFxcdWQ4M2RcXHVkYzQwfFxcdWQ4M2RcXHVkYzQyfFxcdWQ4M2RcXHVkYzQzfFxcdWQ4M2RcXHVkYzQ0fFxcdWQ4M2RcXHVkYzQ1fFxcdWQ4M2RcXHVkYzQ2fFxcdWQ4M2RcXHVkYzQ3fFxcdWQ4M2RcXHVkYzQ4fFxcdWQ4M2RcXHVkYzQ5fFxcdWQ4M2RcXHVkYzRhfFxcdWQ4M2RcXHVkYzRifFxcdWQ4M2RcXHVkYzRjfFxcdWQ4M2RcXHVkYzRkfFxcdWQ4M2RcXHVkYzRlfFxcdWQ4M2RcXHVkYzRmfFxcdWQ4M2RcXHVkYzUwfFxcdWQ4M2RcXHVkYzUxfFxcdWQ4M2RcXHVkYzUyfFxcdWQ4M2RcXHVkYzUzfFxcdWQ4M2RcXHVkYzU0fFxcdWQ4M2RcXHVkYzU1fFxcdWQ4M2RcXHVkYzU2fFxcdWQ4M2RcXHVkYzU3fFxcdWQ4M2RcXHVkYzU4fFxcdWQ4M2RcXHVkYzU5fFxcdWQ4M2RcXHVkYzVhfFxcdWQ4M2RcXHVkYzVifFxcdWQ4M2RcXHVkYzVjfFxcdWQ4M2RcXHVkYzVkfFxcdWQ4M2RcXHVkYzVlfFxcdWQ4M2RcXHVkYzVmfFxcdWQ4M2RcXHVkYzYwfFxcdWQ4M2RcXHVkYzYxfFxcdWQ4M2RcXHVkYzYyfFxcdWQ4M2RcXHVkYzYzfFxcdWQ4M2RcXHVkYzY0fFxcdWQ4M2RcXHVkYzY2fFxcdWQ4M2RcXHVkYzY3fFxcdWQ4M2RcXHVkYzY4fFxcdWQ4M2RcXHVkYzY5fFxcdWQ4M2RcXHVkYzZhfFxcdWQ4M2RcXHVkYzZifFxcdWQ4M2RcXHVkYzZlfFxcdWQ4M2RcXHVkYzZmfFxcdWQ4M2RcXHVkYzcwfFxcdWQ4M2RcXHVkYzcxfFxcdWQ4M2RcXHVkYzcyfFxcdWQ4M2RcXHVkYzczfFxcdWQ4M2RcXHVkYzc0fFxcdWQ4M2RcXHVkYzc1fFxcdWQ4M2RcXHVkYzc2fFxcdWQ4M2RcXHVkZWI0fFxcdWQ4M2RcXHVkYzc4fFxcdWQ4M2RcXHVkYzc5fFxcdWQ4M2RcXHVkYzdhfFxcdWQ4M2RcXHVkYzdifFxcdWQ4M2RcXHVkYzdjfFxcdWQ4M2RcXHVkYzdkfFxcdWQ4M2RcXHVkYzdlfFxcdWQ4M2RcXHVkYzdmfFxcdWQ4M2RcXHVkYzgwfFxcdWQ4M2RcXHVkYzgxfFxcdWQ4M2RcXHVkYzgyfFxcdWQ4M2RcXHVkYzgzfFxcdWQ4M2RcXHVkYzg0fFxcdWQ4M2RcXHVkYzg1fFxcdWQ4M2RcXHVkYzg2fFxcdWQ4M2RcXHVkYzg3fFxcdWQ4M2RcXHVkYzg4fFxcdWQ4M2RcXHVkYzg5fFxcdWQ4M2RcXHVkYzhhfFxcdWQ4M2RcXHVkYzhifFxcdWQ4M2RcXHVkYzhjfFxcdWQ4M2RcXHVkYzhkfFxcdWQ4M2RcXHVkYzhlfFxcdWQ4M2RcXHVkYzhmfFxcdWQ4M2RcXHVkYzkwfFxcdWQ4M2RcXHVkYzkxfFxcdWQ4M2RcXHVkYzkyfFxcdWQ4M2RcXHVkYzkzfFxcdWQ4M2RcXHVkYzk0fFxcdWQ4M2RcXHVkYzk1fFxcdWQ4M2RcXHVkYzk2fFxcdWQ4M2RcXHVkYzk3fFxcdWQ4M2RcXHVkYzk4fFxcdWQ4M2RcXHVkYzk5fFxcdWQ4M2RcXHVkYzlhfFxcdWQ4M2RcXHVkYzlifFxcdWQ4M2RcXHVkYzljfFxcdWQ4M2RcXHVkYzlkfFxcdWQ4M2RcXHVkYzllfFxcdWQ4M2RcXHVkYzlmfFxcdWQ4M2RcXHVkY2EwfFxcdWQ4M2RcXHVkY2ExfFxcdWQ4M2RcXHVkY2EyfFxcdWQ4M2RcXHVkY2EzfFxcdWQ4M2RcXHVkY2E0fFxcdWQ4M2RcXHVkY2E1fFxcdWQ4M2RcXHVkY2E2fFxcdWQ4M2RcXHVkY2E3fFxcdWQ4M2RcXHVkY2E4fFxcdWQ4M2RcXHVkY2E5fFxcdWQ4M2RcXHVkY2FhfFxcdWQ4M2RcXHVkY2FifFxcdWQ4M2RcXHVkY2FjfFxcdWQ4M2RcXHVkY2FlfFxcdWQ4M2RcXHVkY2FmfFxcdWQ4M2RcXHVkY2IwfFxcdWQ4M2RcXHVkY2IxfFxcdWQ4M2RcXHVkY2IyfFxcdWQ4M2RcXHVkY2IzfFxcdWQ4M2RcXHVkY2I0fFxcdWQ4M2RcXHVkY2I1fFxcdWQ4M2RcXHVkY2I4fFxcdWQ4M2RcXHVkY2I5fFxcdWQ4M2RcXHVkY2JhfFxcdWQ4M2RcXHVkY2JifFxcdWQ4M2RcXHVkY2JjfFxcdWQ4M2RcXHVkY2JkfFxcdWQ4M2RcXHVkY2JlfFxcdWQ4M2RcXHVkY2JmfFxcdWQ4M2RcXHVkY2MwfFxcdWQ4M2RcXHVkY2MxfFxcdWQ4M2RcXHVkY2MyfFxcdWQ4M2RcXHVkY2MzfFxcdWQ4M2RcXHVkY2M0fFxcdWQ4M2RcXHVkY2M1fFxcdWQ4M2RcXHVkY2M2fFxcdWQ4M2RcXHVkY2M3fFxcdWQ4M2RcXHVkY2M4fFxcdWQ4M2RcXHVkY2M5fFxcdWQ4M2RcXHVkY2NhfFxcdWQ4M2RcXHVkY2NifFxcdWQ4M2RcXHVkY2NjfFxcdWQ4M2RcXHVkY2NkfFxcdWQ4M2RcXHVkY2NlfFxcdWQ4M2RcXHVkY2NmfFxcdWQ4M2RcXHVkY2QwfFxcdWQ4M2RcXHVkY2QxfFxcdWQ4M2RcXHVkY2QyfFxcdWQ4M2RcXHVkY2QzfFxcdWQ4M2RcXHVkY2Q0fFxcdWQ4M2RcXHVkY2Q1fFxcdWQ4M2RcXHVkY2Q2fFxcdWQ4M2RcXHVkY2Q3fFxcdWQ4M2RcXHVkY2Q4fFxcdWQ4M2RcXHVkY2Q5fFxcdWQ4M2RcXHVkY2RhfFxcdWQ4M2RcXHVkY2RifFxcdWQ4M2RcXHVkY2RjfFxcdWQ4M2RcXHVkY2RkfFxcdWQ4M2RcXHVkY2RlfFxcdWQ4M2RcXHVkY2RmfFxcdWQ4M2RcXHVkY2UwfFxcdWQ4M2RcXHVkY2UxfFxcdWQ4M2RcXHVkY2UyfFxcdWQ4M2RcXHVkY2UzfFxcdWQ4M2RcXHVkY2U0fFxcdWQ4M2RcXHVkY2U1fFxcdWQ4M2RcXHVkY2U2fFxcdWQ4M2RcXHVkY2U3fFxcdWQ4M2RcXHVkY2U4fFxcdWQ4M2RcXHVkY2U5fFxcdWQ4M2RcXHVkY2VhfFxcdWQ4M2RcXHVkY2VifFxcdWQ4M2RcXHVkY2VlfFxcdWQ4M2RcXHVkY2YwfFxcdWQ4M2RcXHVkY2YxfFxcdWQ4M2RcXHVkY2YyfFxcdWQ4M2RcXHVkY2YzfFxcdWQ4M2RcXHVkY2Y0fFxcdWQ4M2RcXHVkY2Y2fFxcdWQ4M2RcXHVkY2Y3fFxcdWQ4M2RcXHVkY2Y5fFxcdWQ4M2RcXHVkY2ZhfFxcdWQ4M2RcXHVkY2ZifFxcdWQ4M2RcXHVkY2ZjfFxcdWQ4M2RcXHVkZDAzfFxcdWQ4M2RcXHVkZDBhfFxcdWQ4M2RcXHVkZDBifFxcdWQ4M2RcXHVkZDBjfFxcdWQ4M2RcXHVkZDBkfFxcdWQ4M2RcXHVkZDBlfFxcdWQ4M2RcXHVkZDBmfFxcdWQ4M2RcXHVkZDEwfFxcdWQ4M2RcXHVkZDExfFxcdWQ4M2RcXHVkZDEyfFxcdWQ4M2RcXHVkZDEzfFxcdWQ4M2RcXHVkZDE0fFxcdWQ4M2RcXHVkZDE2fFxcdWQ4M2RcXHVkZDE3fFxcdWQ4M2RcXHVkZDE4fFxcdWQ4M2RcXHVkZDE5fFxcdWQ4M2RcXHVkZDFhfFxcdWQ4M2RcXHVkZDFifFxcdWQ4M2RcXHVkZDFjfFxcdWQ4M2RcXHVkZDFkfFxcdWQ4M2RcXHVkZDFlfFxcdWQ4M2RcXHVkZDFmfFxcdWQ4M2RcXHVkZDIwfFxcdWQ4M2RcXHVkZDIxfFxcdWQ4M2RcXHVkZDIyfFxcdWQ4M2RcXHVkZDIzfFxcdWQ4M2RcXHVkZDI0fFxcdWQ4M2RcXHVkZDI1fFxcdWQ4M2RcXHVkZDI2fFxcdWQ4M2RcXHVkZDI3fFxcdWQ4M2RcXHVkZDI4fFxcdWQ4M2RcXHVkZDI5fFxcdWQ4M2RcXHVkZDJhfFxcdWQ4M2RcXHVkZDJifFxcdWQ4M2RcXHVkZDJlfFxcdWQ4M2RcXHVkZDJmfFxcdWQ4M2RcXHVkZDMwfFxcdWQ4M2RcXHVkZDMxfFxcdWQ4M2RcXHVkZDMyfFxcdWQ4M2RcXHVkZDMzfFxcdWQ4M2RcXHVkZDM0fFxcdWQ4M2RcXHVkZDM1fFxcdWQ4M2RcXHVkZDM2fFxcdWQ4M2RcXHVkZDM3fFxcdWQ4M2RcXHVkZDM4fFxcdWQ4M2RcXHVkZDM5fFxcdWQ4M2RcXHVkZDNhfFxcdWQ4M2RcXHVkZDNifFxcdWQ4M2RcXHVkZDNjfFxcdWQ4M2RcXHVkZDNkfFxcdWQ4M2RcXHVkZDUwfFxcdWQ4M2RcXHVkZDUxfFxcdWQ4M2RcXHVkZDUyfFxcdWQ4M2RcXHVkZDUzfFxcdWQ4M2RcXHVkZDU0fFxcdWQ4M2RcXHVkZDU1fFxcdWQ4M2RcXHVkZDU2fFxcdWQ4M2RcXHVkZDU3fFxcdWQ4M2RcXHVkZDU4fFxcdWQ4M2RcXHVkZDU5fFxcdWQ4M2RcXHVkZDVhfFxcdWQ4M2RcXHVkZDVifFxcdWQ4M2RcXHVkZGZifFxcdWQ4M2RcXHVkZGZjfFxcdWQ4M2RcXHVkZGZkfFxcdWQ4M2RcXHVkZGZlfFxcdWQ4M2RcXHVkZGZmfFxcdWQ4M2RcXHVkZTAxfFxcdWQ4M2RcXHVkZTAyfFxcdWQ4M2RcXHVkZTAzfFxcdWQ4M2RcXHVkZTA0fFxcdWQ4M2RcXHVkZTA1fFxcdWQ4M2RcXHVkZTA2fFxcdWQ4M2RcXHVkZTA5fFxcdWQ4M2RcXHVkZTBhfFxcdWQ4M2RcXHVkZTBifFxcdWQ4M2RcXHVkZTBjfFxcdWQ4M2RcXHVkZTBkfFxcdWQ4M2RcXHVkZTBmfFxcdWQ4M2RcXHVkZTEyfFxcdWQ4M2RcXHVkZTEzfFxcdWQ4M2RcXHVkZTE0fFxcdWQ4M2RcXHVkZTE2fFxcdWQ4M2RcXHVkZTE4fFxcdWQ4M2RcXHVkZTFhfFxcdWQ4M2RcXHVkZTFjfFxcdWQ4M2RcXHVkZTFkfFxcdWQ4M2RcXHVkZTFlfFxcdWQ4M2RcXHVkZTIwfFxcdWQ4M2RcXHVkZTIxfFxcdWQ4M2RcXHVkZTIyfFxcdWQ4M2RcXHVkZTIzfFxcdWQ4M2RcXHVkZTI0fFxcdWQ4M2RcXHVkZTI1fFxcdWQ4M2RcXHVkZTI4fFxcdWQ4M2RcXHVkZTI5fFxcdWQ4M2RcXHVkZTJhfFxcdWQ4M2RcXHVkZTJifFxcdWQ4M2RcXHVkZTJkfFxcdWQ4M2RcXHVkZTMwfFxcdWQ4M2RcXHVkZTMxfFxcdWQ4M2RcXHVkZTMyfFxcdWQ4M2RcXHVkZTMzfFxcdWQ4M2RcXHVkZTM1fFxcdWQ4M2RcXHVkZTM3fFxcdWQ4M2RcXHVkZTM4fFxcdWQ4M2RcXHVkZTM5fFxcdWQ4M2RcXHVkZTNhfFxcdWQ4M2RcXHVkZTNifFxcdWQ4M2RcXHVkZTNjfFxcdWQ4M2RcXHVkZTNkfFxcdWQ4M2RcXHVkZTNlfFxcdWQ4M2RcXHVkZTNmfFxcdWQ4M2RcXHVkZTQwfFxcdWQ4M2RcXHVkZTQ1fFxcdWQ4M2RcXHVkZTQ2fFxcdWQ4M2RcXHVkZTQ3fFxcdWQ4M2RcXHVkZTQ4fFxcdWQ4M2RcXHVkZTQ5fFxcdWQ4M2RcXHVkZTRhfFxcdWQ4M2RcXHVkZTRifFxcdWQ4M2RcXHVkZTRjfFxcdWQ4M2RcXHVkZTRkfFxcdWQ4M2RcXHVkZTRlfFxcdWQ4M2RcXHVkZTRmfFxcdWQ4M2RcXHVkZTgwfFxcdWQ4M2RcXHVkZTgzfFxcdWQ4M2RcXHVkZTg0fFxcdWQ4M2RcXHVkZTg1fFxcdWQ4M2RcXHVkZTg3fFxcdWQ4M2RcXHVkZTg5fFxcdWQ4M2RcXHVkZThjfFxcdWQ4M2RcXHVkZThmfFxcdWQ4M2RcXHVkZTkxfFxcdWQ4M2RcXHVkZTkyfFxcdWQ4M2RcXHVkZTkzfFxcdWQ4M2RcXHVkZTk1fFxcdWQ4M2RcXHVkZTk3fFxcdWQ4M2RcXHVkZTk5fFxcdWQ4M2RcXHVkZTlhfFxcdWQ4M2RcXHVkZWEyfFxcdWQ4M2RcXHVkZWE0fFxcdWQ4M2RcXHVkZWE1fFxcdWQ4M2RcXHVkZWE3fFxcdWQ4M2RcXHVkZWE4fFxcdWQ4M2RcXHVkZWE5fFxcdWQ4M2RcXHVkZWFhfFxcdWQ4M2RcXHVkZWFifFxcdWQ4M2RcXHVkZWFjfFxcdWQ4M2RcXHVkZWFkfFxcdWQ4M2RcXHVkZWIyfFxcdWQ4M2RcXHVkZWI2fFxcdWQ4M2RcXHVkZWI5fFxcdWQ4M2RcXHVkZWJhfFxcdWQ4M2RcXHVkZWJifFxcdWQ4M2RcXHVkZWJjfFxcdWQ4M2RcXHVkZWJkfFxcdWQ4M2RcXHVkZWJlfFxcdWQ4M2RcXHVkZWMwfFxcdWQ4M2NcXHVkZGU2fFxcdWQ4M2NcXHVkZGU3fFxcdWQ4M2NcXHVkZGU4fFxcdWQ4M2NcXHVkZGU5fFxcdWQ4M2NcXHVkZGVhfFxcdWQ4M2NcXHVkZGVifFxcdWQ4M2NcXHVkZGVjfFxcdWQ4M2NcXHVkZGVkfFxcdWQ4M2NcXHVkZGVlfFxcdWQ4M2NcXHVkZGVmfFxcdWQ4M2NcXHVkZGYwfFxcdWQ4M2NcXHVkZGYxfFxcdWQ4M2NcXHVkZGYyfFxcdWQ4M2NcXHVkZGYzfFxcdWQ4M2NcXHVkZGY0fFxcdWQ4M2NcXHVkZGY1fFxcdWQ4M2NcXHVkZGY2fFxcdWQ4M2NcXHVkZGY3fFxcdWQ4M2NcXHVkZGY4fFxcdWQ4M2NcXHVkZGY5fFxcdWQ4M2NcXHVkZGZhfFxcdWQ4M2NcXHVkZGZifFxcdWQ4M2NcXHVkZGZjfFxcdWQ4M2NcXHVkZGZkfFxcdWQ4M2NcXHVkZGZlfFxcdWQ4M2NcXHVkZGZmfFxcdWQ4M2NcXHVkZjBkfFxcdWQ4M2NcXHVkZjBlfFxcdWQ4M2NcXHVkZjEwfFxcdWQ4M2NcXHVkZjEyfFxcdWQ4M2NcXHVkZjE2fFxcdWQ4M2NcXHVkZjE3fFxcdWU1MGF8XFx1MjdiMHxcXHUyNzk3fFxcdTI3OTZ8XFx1Mjc5NXxcXHUyNzU1fFxcdTI3NTR8XFx1Mjc1M3xcXHUyNzRlfFxcdTI3NGN8XFx1MjcyOHxcXHUyNzBifFxcdTI3MGF8XFx1MjcwNXxcXHUyNmNlfFxcdTIzZjN8XFx1MjNmMHxcXHUyM2VjfFxcdTIzZWJ8XFx1MjNlYXxcXHUyM2U5fFxcdTI3YmZ8XFx1MDBhOXxcXHUwMGFlKXwoPzooPzpcXHVkODNjXFx1ZGMwNHxcXHVkODNjXFx1ZGQ3MHxcXHVkODNjXFx1ZGQ3MXxcXHVkODNjXFx1ZGQ3ZXxcXHVkODNjXFx1ZGQ3ZnxcXHVkODNjXFx1ZGUwMnxcXHVkODNjXFx1ZGUxYXxcXHVkODNjXFx1ZGUyZnxcXHVkODNjXFx1ZGUzN3xcXHUzMjk5fFxcdTMwM2R8XFx1MzAzMHxcXHUyYjU1fFxcdTJiNTB8XFx1MmIxY3xcXHUyYjFifFxcdTJiMDd8XFx1MmIwNnxcXHUyYjA1fFxcdTI5MzV8XFx1MjkzNHxcXHUyN2ExfFxcdTI3NjR8XFx1Mjc1N3xcXHUyNzQ3fFxcdTI3NDR8XFx1MjczNHxcXHUyNzMzfFxcdTI3MTZ8XFx1MjcxNHxcXHUyNzEyfFxcdTI3MGZ8XFx1MjcwY3xcXHUyNzA5fFxcdTI3MDh8XFx1MjcwMnxcXHUyNmZkfFxcdTI2ZmF8XFx1MjZmNXxcXHUyNmYzfFxcdTI2ZjJ8XFx1MjZlYXxcXHUyNmQ0fFxcdTI2YzV8XFx1MjZjNHxcXHUyNmJlfFxcdTI2YmR8XFx1MjZhYnxcXHUyNmFhfFxcdTI2YTF8XFx1MjZhMHxcXHUyNjkzfFxcdTI2N2Z8XFx1MjY3YnxcXHUzMjk3fFxcdTI2NjZ8XFx1MjY2NXxcXHUyNjYzfFxcdTI2NjB8XFx1MjY1M3xcXHUyNjUyfFxcdTI2NTF8XFx1MjY1MHxcXHUyNjRmfFxcdTI2NGV8XFx1MjY0ZHxcXHUyNjRjfFxcdTI2NGJ8XFx1MjY0YXxcXHUyNjQ5fFxcdTI2NDh8XFx1MjYzYXxcXHUyNjFkfFxcdTI2MTV8XFx1MjYxNHxcXHUyNjExfFxcdTI2MGV8XFx1MjYwMXxcXHUyNjAwfFxcdTI1ZmV8XFx1MjVmZHxcXHUyNWZjfFxcdTI1ZmJ8XFx1MjVjMHxcXHUyNWI2fFxcdTI1YWJ8XFx1MjVhYXxcXHUyNGMyfFxcdTIzMWJ8XFx1MjMxYXxcXHUyMWFhfFxcdTIxYTl8XFx1MjE5OXxcXHUyMTk4fFxcdTIxOTd8XFx1MjE5NnxcXHUyMTk1fFxcdTIxOTR8XFx1MjEzOXxcXHUyMTIyfFxcdTIwNDl8XFx1MjAzY3xcXHUyNjY4KShbXFx1RkUwRVxcdUZFMEZdPykpKS9nO1xuLy9cbi8vXG4vLy8qKlxuLy8gKiDop6PmnpDlrZfnrKbkuLLkuLogZW1vamkg6KGo5oOFIGltZ1xuLy8gKiBAcGFyYW0gc3RyIHtTdHJpbmd9IOWtl+espuS4slxuLy8gKiBAcGFyYW0gW29wdGlvbnNdIHtPYmplY3R9IOmFjee9rlxuLy8gKiBAcmV0dXJucyB7U3RyaW5nfVxuLy8gKi9cbi8vZXhwb3J0cy5lbW9qaSA9IGZ1bmN0aW9uIChzdHIsIG9wdGlvbnMpIHtcbi8vICAgIG9wdGlvbnMgPSBkYXRvLmV4dGVuZChleHBvcnRzLmVtb2ppLmRlZmF1bHRzLCBvcHRpb25zKTtcbi8vXG4vLyAgICBpZiAoIXR5cGVpcy5GdW5jdGlvbihvcHRpb25zLmNhbGxiYWNrKSkge1xuLy8gICAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBmdW5jdGlvbiAoaWNvbiwgb3B0aW9ucywgdmFyaWFudCkge1xuLy8gICAgICAgICAgICByZXR1cm4gJycuY29uY2F0KG9wdGlvbnMuYmFzZSwgb3B0aW9ucy5zaXplLCAnLycsIGljb24sIG9wdGlvbnMuZXh0KTtcbi8vICAgICAgICB9O1xuLy8gICAgfVxuLy9cbi8vICAgIHJldHVybiBzdHIucmVwbGFjZShSRUdfRU1PSkksIGZ1bmN0aW9uIChtYXRjaCwgaWNvbiwgdmFyaWFudCkge1xuLy8gICAgICAgIHZhciByZXQgPSBtYXRjaDtcbi8vICAgICAgICAvLyB2ZXJpZnkgdGhlIHZhcmlhbnQgaXMgbm90IHRoZSBGRTBFIG9uZVxuLy8gICAgICAgIC8vIHRoaXMgdmFyaWFudCBtZWFucyBcImVtb2ppIGFzIHRleHRcIiBhbmQgc2hvdWxkIG5vdFxuLy8gICAgICAgIC8vIHJlcXVpcmUgYW55IGFjdGlvbi9yZXBsYWNlbWVudFxuLy8gICAgICAgIC8vIGh0dHA6Ly91bmljb2RlLm9yZy9QdWJsaWMvVU5JREFUQS9TdGFuZGFyZGl6ZWRWYXJpYW50cy5odG1sXG4vLyAgICAgICAgaWYgKHZhcmlhbnQgIT09ICdcXHVGRTBFJykge1xuLy8gICAgICAgICAgICB2YXIgc3JjID0gb3B0aW9ucy5jYWxsYmFjayhcbi8vICAgICAgICAgICAgICAgIGdyYWJUaGVSaWdodEljb24oaWNvbiwgdmFyaWFudCksXG4vLyAgICAgICAgICAgICAgICBvcHRpb25zLFxuLy8gICAgICAgICAgICAgICAgdmFyaWFudFxuLy8gICAgICAgICAgICApO1xuLy8gICAgICAgICAgICBpZiAoc3JjKSB7XG4vLyAgICAgICAgICAgICAgICAvLyByZWN5Y2xlIHRoZSBtYXRjaCBzdHJpbmcgcmVwbGFjaW5nIHRoZSBlbW9qaVxuLy8gICAgICAgICAgICAgICAgLy8gd2l0aCBpdHMgaW1hZ2UgY291bnRlciBwYXJ0XG4vLyAgICAgICAgICAgICAgICByZXQgPSAnPGltZyAnLmNvbmNhdChcbi8vICAgICAgICAgICAgICAgICAgICAnY2xhc3M9XCInLCBvcHRpb25zLmNsYXNzTmFtZSwgJ1wiICcsXG4vLyAgICAgICAgICAgICAgICAgICAgJ2RyYWdnYWJsZT1cImZhbHNlXCIgJyxcbi8vICAgICAgICAgICAgICAgICAgICAvLyBuZWVkcyB0byBwcmVzZXJ2ZSB1c2VyIG9yaWdpbmFsIGludGVudFxuLy8gICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gdmFyaWFudHMgc2hvdWxkIGJlIGNvcGllZCBhbmQgcGFzdGVkIHRvb1xuLy8gICAgICAgICAgICAgICAgICAgICdhbHQ9XCInLFxuLy8gICAgICAgICAgICAgICAgICAgIG1hdGNoLFxuLy8gICAgICAgICAgICAgICAgICAgICdcIicsXG4vLyAgICAgICAgICAgICAgICAgICAgJyBzcmM9XCInLFxuLy8gICAgICAgICAgICAgICAgICAgIHNyYyxcbi8vICAgICAgICAgICAgICAgICAgICAnXCInXG4vLyAgICAgICAgICAgICAgICApO1xuLy9cbi8vICAgICAgICAgICAgICAgIHJldCA9IHJldC5jb25jYXQoJz4nKTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgcmV0dXJuIHJldDtcbi8vICAgIH0pO1xuLy99O1xuLy9leHBvcnRzLmVtb2ppLmRlZmF1bHRzID0ge1xuLy8gICAgY2FsbGJhY2s6IG51bGwsXG4vLyAgICBiYXNlOiAnaHR0cHM6Ly90d2Vtb2ppLm1heGNkbi5jb20vJyxcbi8vICAgIGV4dDogJy5wbmcnLFxuLy8gICAgc2l6ZTogJzM2eDM2Jyxcbi8vICAgIGNsYXNzTmFtZTogJ2Vtb2ppJ1xuLy99O1xuXG4iXX0=