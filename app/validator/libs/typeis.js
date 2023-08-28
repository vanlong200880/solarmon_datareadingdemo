/**
 * 判断数据类型
 * @author ydr.me
 * @create 2014-11-15 12:54
 * @update 2014年11月19日10:20:51
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var udf = 'undefined';
var REG_URL = /^https?:\/\/([a-z\d-]+\.)+[a-z]{2,5}(:[1-9]\d{0,4})?(\/|\/[\w#!:.?+=&%@!\-\/]+)?$/i;
var REG_EMAIL = /^\w+[-+.\w]*@([a-z\d-]+\.)+[a-z]{2,5}$/i;
var REG_MOMGODB_ID = /^[\da-z]{24}$/;
var REG_INVALID = /invalid/i;
var REG_DATE_DMY = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
var REG_DATE_YMD = /^(\d{4})[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
var REG_DATE_DMYHm = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4} ([012]{0,1}[0-9]:[0-6][0-9])$/;
var REG_DATE_YMDHm = /^(\d{4})[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01]) ([012]{0,1}[0-9]:[0-6][0-9])$/;
// var fs = require('fs');


/**
 * 判断数据类型，结果全部为小写<br>
 * 原始数据类型：boolean、number、string、undefined、symbol
 * @param {*} object 任何对象
 * @returns {string}
 *
 * @example
 * typeis();
 * // => "undefined"
 *
 * typeis(null);
 * // => "null"
 *
 * typeis(1);
 * // => "number"
 *
 * typeis("1");
 * // => "string"
 *
 * typeis(!1);
 * // => "boolean"
 *
 * typeis({});
 * // => "object"
 *
 * typeis([]);
 * // => "array"
 *
 * typeis(/./);
 * // => "regexp"
 *
 * typeis(window);
 * // => "window"
 *
 * typeis(document);
 * // => "document"
 *
 * typeis(document);
 * // => "document"
 *
 * typeis(NaN);
 * // => "nan"
 *
 * typeis(Infinity);
 * // => "number"
 *
 * typeis(function(){});
 * // => "function"
 *
 * typeis(new Image);
 * // => "element"
 *
 * typeis(new Date);
 * // => "date"
 *
 * typeis(document.links);
 * // => "htmlcollection"
 *
 * typeis(document.body.dataset);
 * // => "domstringmap"
 *
 * typeis(document.body.classList);
 * // => "domtokenlist"
 *
 * typeis(document.body.childNodes);
 * // => "nodelist"
 *
 * typeis(document.createAttribute('abc'));
 * // => "attr"
 *
 * typeis(document.createComment('abc'));
 * // => "comment"
 *
 * typeis(new Event('abc'));
 * // => "event"
 *
 * typeis(document.createExpression());
 * // => "xpathexpression"
 *
 * typeis(document.createRange());
 * // => "range"
 *
 * typeis(document.createTextNode(''));
 * // => "text"
 */
var typeis = function typeis(object) {
    if (object !== object) {
        return 'nan';
    } else if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === udf) {
        return udf;
    } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== udf && object === window) {
        return 'window';
    } else if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) !== udf && object === global) {
        return 'global';
    } else if ((typeof document === 'undefined' ? 'undefined' : _typeof(document)) !== udf && object === document) {
        return 'document';
    } else if (object === null) {
        return 'null';
    }

    var ret = Object.prototype.toString.call(object).slice(8, -1).toLowerCase();

    if (/element/.test(ret)) {
        return 'element';
    }
    return ret;
};
var i = 0;
var jud = 'string number function object undefined null nan element regexp boolean array window document global'.split(' ');
var makeStatic = function makeStatic(tp) {
    var tp2 = tp.replace(/^\w/, function (w) {
        return w.toUpperCase();
    });
    /**
     * 快捷判断
     * @name typeis
     * @property string {Function}
     * @property String {Function}
     * @property number {Function}
     * @property Number {Function}
     * @property function {Function}
     * @property Function {Function}
     * @property object {Function}
     * @property Object {Function}
     * @property undefined {Function}
     * @property Undefined {Function}
     * @property null {Function}
     * @property Null {Function}
     * @property nan {Function}
     * @property Nan {Function}
     * @property element {Function}
     * @property Element {Function}
     * @property regexp {Function}
     * @property Regexp {Function}
     * @property boolean {Function}
     * @property Boolean {Function}
     * @property array {Function}
     * @property Array {Function}
     * @property window {Function}
     * @property Window {Function}
     * @property document {Function}
     * @property Document {Function}
     * @property global {Function}
     * @property Global {Function}
     * @returns {boolean}
     */
    typeis[tp] = typeis[tp2] = function (obj) {
        return typeis(obj) === tp;
    };
};

/**
 * 复制静态方法
 */
for (; i < jud.length; i++) {
    makeStatic(jud[i]);
}

/**
 * 判断是否为纯对象
 * @param obj {*}
 * @returns {Boolean}
 *
 * @example
 * type.isPlainObject({a:1});
 * // => true
 */
typeis.plainObject = function (obj) {
    return typeis(obj) === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
};

/**
 * 判断是否为空对象
 * @param obj {*}
 */
typeis.emptyObject = function (obj) {
    return typeis.plainObject(obj) && Object.keys(obj).length === 0;
};

/**
 * 判断是否为 undefine 或 null
 * @param obj
 * @returns {Boolean}
 */
typeis.empty = function (obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === udf || typeis.null(obj);
};

/**
 * 判断是否为 URL 格式
 * @param string
 * @returns {Boolean}
 *
 * @example
 * typeis.url('http://123.com/123/456/?a=3#00');
 * // => true
 */
typeis.url = function (string) {
    return typeis(string) === 'string' && REG_URL.test(string);
};

/**
 * 判断是否为 email 格式
 * @param string
 * @returns {Boolean}
 *
 * @example
 * typeis.email('abc@def.com');
 * // => true
 */
typeis.email = function (string) {
    return typeis(string) === 'string' && REG_EMAIL.test(string);
};

/**
 * 判断能否转换为合法Date
 * @param  anything
 * @return {Boolean}
 * @version 1.0
 * 2014年5月2日21:07:33
 */
typeis.validDate = function (anything) {
    return !REG_INVALID.test(new Date(anything).toString());
};

/**
 * 判断对象是否为 Error 实例
 * @param anything
 * @returns {boolean}
 *
 * @example
 * typeis.error(new TypeError());
 * // => true
 */
typeis.error = function (anything) {
    return anything && anything instanceof Error;
};

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////[ ONLY NODEJS ]////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


/**
 * 判断是否为合法的mongodbID
 * @param  anything
 * @return {Boolean}
 * @version 1.0
 * 2014年5月3日23:11:37
 */
typeis.mongoId = function (anything) {
    return (typeof anything === 'undefined' ? 'undefined' : _typeof(anything)) !== udf && _typeof(anything._bsontype) !== udf && anything._bsontype === 'ObjectId' || REG_MOMGODB_ID.test(anything.toString());
};

/**
 * 判断对象是否为空,null/undefined/""
 * @param  any {*} 任何对象
 * @return {Boolean}
 * @version 1.0
 * 2014年5月27日21:33:04
 */
typeis.emptyData = function (any) {
    return typeis.empty(any) || any === '';
};

/**
 * 判断路径是否为目录
 * @param _path
 * @returns {Boolean}
 */
// typeis.directory = function (_path) {
//     var stat;

//     try {
//         stat = fs.statSync(_path);
//     } catch (err) {
//         return !1;
//     }

//     return stat.isDirectory();
// };


/**
 * 判断路径是否为文件
 * @param _path
 * @returns {Boolean}
 */
// typeis.file = function (_path) {
//     var stat;

//     try {
//         stat = fs.statSync(_path);
//     } catch (err) {
//         return !1;
//     }

//     return stat.isFile();
// };


// @link: https://www.zhihu.com/question/19813460/answer/13042143
// A类地址：10.0.0.0--10.255.255.255
// B类地址：172.16.0.0--172.31.255.255
// C类地址：192.168.0.0--192.168.255.255
/**
 * 判断是否为局域网 IP
 * @param ip
 * @returns {boolean}
 */
typeis.localIP = function (ip) {
    ip = String(ip).toUpperCase().trim();

    if (ip.indexOf('::') > -1 || ip === 'localhost' || ip.indexOf('127.0.0.1') > -1) {
        return true;
    }

    var ipList = ip.split('.');
    var part0 = Number(ipList[0]);
    var part1 = Number(ipList[1]);
    //var part2 = Number(ipList[2]);
    //var part3 = Number(ipList[3]);

    // A 类
    if (part0 === 10) {
        return true;
    }

    // B 类
    if (part0 === 172 && part1 > 15 && part1 < 32) {
        return true;
    }

    return part0 === 192 && part1 === 168;
};

/**
 * Check valid date
 * @param {String} date 
 * @param {Boolean} format 
 */
typeis.date = function (date, format) {
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

        if (format) {
            dd = parseInt(pdate[2]);
            mm = parseInt(pdate[1]);
            yy = parseInt(pdate[0]);
        }

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

typeis.dateTimeToMinute = function (date, format) {
    var dateformat = REG_DATE_DMYHm;
    if (typeof format !== 'undefined' && format == true) {
        var dateformat = REG_DATE_YMDHm;
    }

    // Match the date format through regular expression
    if (date.match(dateformat)) {
        //Test which seperator is used '/' or '-'
        var opera1 = date.split('/'),
            opera2 = date.split('-'),
            lopera1 = opera1.length,
            lopera2 = opera2.length,
            time = "";
        // Extract the string into month, date and year
        if (lopera1 > 1) {
            var pdate = date.split('/');
        } else if (lopera2 > 1) {
            var pdate = date.split('-');
        }
        var split = pdate[2].split(" ");
        time = split[1];
        var dd = parseInt(pdate[0]),
            mm = parseInt(pdate[1]),
            yy = parseInt(split[0]),
            hh = parseInt(time[1].split(":")[0]),
            m = parseInt(time[1].split(":")[1]);

        if (format) {
            dd = parseInt(split[0]);
            mm = parseInt(pdate[1]);
            yy = parseInt(pdate[0]);
        }

        var isValid = checkValidDate(dd, mm, yy);
        if (!isValid) {
            return false;
        }
        if (hh > 24) {
            return false;
        }
        if (m > 60) {
            return false;
        }
        return true;
    } else {
        return false;
    }
};

var checkValidDate = function checkValidDate(dd, mm, yy) {
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
};

/**
 * @name string
 * @name number
 * @name function
 * @name object
 * @name undefined
 * @name null
 * @name nan
 * @name element
 * @name regexp
 * @name boolean
 * @name array
 * @name window
 * @name document
 * @name global
 * @type {Function}
 */
module.exports = typeis;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWxpZGF0b3IvbGlicy90eXBlaXMuanMiXSwibmFtZXMiOlsidWRmIiwiUkVHX1VSTCIsIlJFR19FTUFJTCIsIlJFR19NT01HT0RCX0lEIiwiUkVHX0lOVkFMSUQiLCJSRUdfREFURV9ETVkiLCJSRUdfREFURV9ZTUQiLCJSRUdfREFURV9ETVlIbSIsIlJFR19EQVRFX1lNREhtIiwidHlwZWlzIiwib2JqZWN0Iiwid2luZG93IiwiZ2xvYmFsIiwiZG9jdW1lbnQiLCJyZXQiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwidGVzdCIsImkiLCJqdWQiLCJzcGxpdCIsIm1ha2VTdGF0aWMiLCJ0cCIsInRwMiIsInJlcGxhY2UiLCJ3IiwidG9VcHBlckNhc2UiLCJvYmoiLCJsZW5ndGgiLCJwbGFpbk9iamVjdCIsImdldFByb3RvdHlwZU9mIiwiZW1wdHlPYmplY3QiLCJrZXlzIiwiZW1wdHkiLCJudWxsIiwidXJsIiwic3RyaW5nIiwiZW1haWwiLCJ2YWxpZERhdGUiLCJhbnl0aGluZyIsIkRhdGUiLCJlcnJvciIsIkVycm9yIiwibW9uZ29JZCIsIl9ic29udHlwZSIsImVtcHR5RGF0YSIsImFueSIsImxvY2FsSVAiLCJpcCIsIlN0cmluZyIsInRyaW0iLCJpbmRleE9mIiwiaXBMaXN0IiwicGFydDAiLCJOdW1iZXIiLCJwYXJ0MSIsImRhdGUiLCJmb3JtYXQiLCJkYXRlZm9ybWF0IiwibWF0Y2giLCJvcGVyYTEiLCJvcGVyYTIiLCJsb3BlcmExIiwibG9wZXJhMiIsInBkYXRlIiwiZGQiLCJwYXJzZUludCIsIm1tIiwieXkiLCJMaXN0b2ZEYXlzIiwibHllYXIiLCJkYXRlVGltZVRvTWludXRlIiwidGltZSIsImhoIiwibSIsImlzVmFsaWQiLCJjaGVja1ZhbGlkRGF0ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FBUUE7Ozs7QUFF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sbvlnotcbiAqIEBhdXRob3IgeWRyLm1lXG4gKiBAY3JlYXRlIDIwMTQtMTEtMTUgMTI6NTRcbiAqIEB1cGRhdGUgMjAxNOW5tDEx5pyIMTnml6UxMDoyMDo1MVxuICovXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdWRmID0gJ3VuZGVmaW5lZCc7XG52YXIgUkVHX1VSTCA9IC9eaHR0cHM/OlxcL1xcLyhbYS16XFxkLV0rXFwuKStbYS16XXsyLDV9KDpbMS05XVxcZHswLDR9KT8oXFwvfFxcL1tcXHcjITouPys9JiVAIVxcLVxcL10rKT8kL2k7XG52YXIgUkVHX0VNQUlMID0gL15cXHcrWy0rLlxcd10qQChbYS16XFxkLV0rXFwuKStbYS16XXsyLDV9JC9pO1xudmFyIFJFR19NT01HT0RCX0lEID0gL15bXFxkYS16XXsyNH0kLztcbnZhciBSRUdfSU5WQUxJRCA9IC9pbnZhbGlkL2k7XG52YXIgUkVHX0RBVEVfRE1ZID0gL14oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pW1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV1cXGR7NH0kLztcbnZhciBSRUdfREFURV9ZTUQgPSAvXihcXGR7NH0pW1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC87XG52YXIgUkVHX0RBVEVfRE1ZSG0gPSAvXigwP1sxLTldfFsxMl1bMC05XXwzWzAxXSlbXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXVxcZHs0fSAoWzAxMl17MCwxfVswLTldOlswLTZdWzAtOV0pJC87XG52YXIgUkVHX0RBVEVfWU1ESG0gPSAvXihcXGR7NH0pW1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pIChbMDEyXXswLDF9WzAtOV06WzAtNl1bMC05XSkkLztcbi8vIHZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cblxuLyoqXG4gKiDliKTmlq3mlbDmja7nsbvlnovvvIznu5Pmnpzlhajpg6jkuLrlsI/lhpk8YnI+XG4gKiDljp/lp4vmlbDmja7nsbvlnovvvJpib29sZWFu44CBbnVtYmVy44CBc3RyaW5n44CBdW5kZWZpbmVk44CBc3ltYm9sXG4gKiBAcGFyYW0geyp9IG9iamVjdCDku7vkvZXlr7nosaFcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKlxuICogQGV4YW1wbGVcbiAqIHR5cGVpcygpO1xuICogLy8gPT4gXCJ1bmRlZmluZWRcIlxuICpcbiAqIHR5cGVpcyhudWxsKTtcbiAqIC8vID0+IFwibnVsbFwiXG4gKlxuICogdHlwZWlzKDEpO1xuICogLy8gPT4gXCJudW1iZXJcIlxuICpcbiAqIHR5cGVpcyhcIjFcIik7XG4gKiAvLyA9PiBcInN0cmluZ1wiXG4gKlxuICogdHlwZWlzKCExKTtcbiAqIC8vID0+IFwiYm9vbGVhblwiXG4gKlxuICogdHlwZWlzKHt9KTtcbiAqIC8vID0+IFwib2JqZWN0XCJcbiAqXG4gKiB0eXBlaXMoW10pO1xuICogLy8gPT4gXCJhcnJheVwiXG4gKlxuICogdHlwZWlzKC8uLyk7XG4gKiAvLyA9PiBcInJlZ2V4cFwiXG4gKlxuICogdHlwZWlzKHdpbmRvdyk7XG4gKiAvLyA9PiBcIndpbmRvd1wiXG4gKlxuICogdHlwZWlzKGRvY3VtZW50KTtcbiAqIC8vID0+IFwiZG9jdW1lbnRcIlxuICpcbiAqIHR5cGVpcyhkb2N1bWVudCk7XG4gKiAvLyA9PiBcImRvY3VtZW50XCJcbiAqXG4gKiB0eXBlaXMoTmFOKTtcbiAqIC8vID0+IFwibmFuXCJcbiAqXG4gKiB0eXBlaXMoSW5maW5pdHkpO1xuICogLy8gPT4gXCJudW1iZXJcIlxuICpcbiAqIHR5cGVpcyhmdW5jdGlvbigpe30pO1xuICogLy8gPT4gXCJmdW5jdGlvblwiXG4gKlxuICogdHlwZWlzKG5ldyBJbWFnZSk7XG4gKiAvLyA9PiBcImVsZW1lbnRcIlxuICpcbiAqIHR5cGVpcyhuZXcgRGF0ZSk7XG4gKiAvLyA9PiBcImRhdGVcIlxuICpcbiAqIHR5cGVpcyhkb2N1bWVudC5saW5rcyk7XG4gKiAvLyA9PiBcImh0bWxjb2xsZWN0aW9uXCJcbiAqXG4gKiB0eXBlaXMoZG9jdW1lbnQuYm9keS5kYXRhc2V0KTtcbiAqIC8vID0+IFwiZG9tc3RyaW5nbWFwXCJcbiAqXG4gKiB0eXBlaXMoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QpO1xuICogLy8gPT4gXCJkb210b2tlbmxpc3RcIlxuICpcbiAqIHR5cGVpcyhkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXMpO1xuICogLy8gPT4gXCJub2RlbGlzdFwiXG4gKlxuICogdHlwZWlzKGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZSgnYWJjJykpO1xuICogLy8gPT4gXCJhdHRyXCJcbiAqXG4gKiB0eXBlaXMoZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgnYWJjJykpO1xuICogLy8gPT4gXCJjb21tZW50XCJcbiAqXG4gKiB0eXBlaXMobmV3IEV2ZW50KCdhYmMnKSk7XG4gKiAvLyA9PiBcImV2ZW50XCJcbiAqXG4gKiB0eXBlaXMoZG9jdW1lbnQuY3JlYXRlRXhwcmVzc2lvbigpKTtcbiAqIC8vID0+IFwieHBhdGhleHByZXNzaW9uXCJcbiAqXG4gKiB0eXBlaXMoZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKSk7XG4gKiAvLyA9PiBcInJhbmdlXCJcbiAqXG4gKiB0eXBlaXMoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcbiAqIC8vID0+IFwidGV4dFwiXG4gKi9cbnZhciB0eXBlaXMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgaWYgKG9iamVjdCAhPT0gb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiAnbmFuJztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmplY3QgPT09IHVkZikge1xuICAgICAgICByZXR1cm4gdWRmO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdWRmICYmIG9iamVjdCA9PT0gd2luZG93KSB7XG4gICAgICAgIHJldHVybiAnd2luZG93JztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IHVkZiAmJiBvYmplY3QgPT09IGdsb2JhbCkge1xuICAgICAgICByZXR1cm4gJ2dsb2JhbCc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IHVkZiAmJiBvYmplY3QgPT09IGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiAnZG9jdW1lbnQnO1xuICAgIH0gZWxzZSBpZiAob2JqZWN0ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnbnVsbCc7XG4gICAgfVxuXG4gICAgdmFyIHJldCA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKC9lbGVtZW50Ly50ZXN0KHJldCkpIHtcbiAgICAgICAgcmV0dXJuICdlbGVtZW50JztcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn07XG52YXIgaSA9IDA7XG52YXIganVkID0gJ3N0cmluZyBudW1iZXIgZnVuY3Rpb24gb2JqZWN0IHVuZGVmaW5lZCBudWxsIG5hbiBlbGVtZW50IHJlZ2V4cCBib29sZWFuIGFycmF5IHdpbmRvdyBkb2N1bWVudCBnbG9iYWwnLnNwbGl0KCcgJyk7XG52YXIgbWFrZVN0YXRpYyA9IGZ1bmN0aW9uICh0cCkge1xuICAgIHZhciB0cDIgPSB0cC5yZXBsYWNlKC9eXFx3LywgZnVuY3Rpb24gKHcpIHtcbiAgICAgICAgcmV0dXJuIHcudG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiDlv6vmjbfliKTmlq1cbiAgICAgKiBAbmFtZSB0eXBlaXNcbiAgICAgKiBAcHJvcGVydHkgc3RyaW5nIHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgU3RyaW5nIHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgbnVtYmVyIHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgTnVtYmVyIHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgZnVuY3Rpb24ge0Z1bmN0aW9ufVxuICAgICAqIEBwcm9wZXJ0eSBGdW5jdGlvbiB7RnVuY3Rpb259XG4gICAgICogQHByb3BlcnR5IG9iamVjdCB7RnVuY3Rpb259XG4gICAgICogQHByb3BlcnR5IE9iamVjdCB7RnVuY3Rpb259XG4gICAgICogQHByb3BlcnR5IHVuZGVmaW5lZCB7RnVuY3Rpb259XG4gICAgICogQHByb3BlcnR5IFVuZGVmaW5lZCB7RnVuY3Rpb259XG4gICAgICogQHByb3BlcnR5IG51bGwge0Z1bmN0aW9ufVxuICAgICAqIEBwcm9wZXJ0eSBOdWxsIHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgbmFuIHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgTmFuIHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgZWxlbWVudCB7RnVuY3Rpb259XG4gICAgICogQHByb3BlcnR5IEVsZW1lbnQge0Z1bmN0aW9ufVxuICAgICAqIEBwcm9wZXJ0eSByZWdleHAge0Z1bmN0aW9ufVxuICAgICAqIEBwcm9wZXJ0eSBSZWdleHAge0Z1bmN0aW9ufVxuICAgICAqIEBwcm9wZXJ0eSBib29sZWFuIHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgQm9vbGVhbiB7RnVuY3Rpb259XG4gICAgICogQHByb3BlcnR5IGFycmF5IHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgQXJyYXkge0Z1bmN0aW9ufVxuICAgICAqIEBwcm9wZXJ0eSB3aW5kb3cge0Z1bmN0aW9ufVxuICAgICAqIEBwcm9wZXJ0eSBXaW5kb3cge0Z1bmN0aW9ufVxuICAgICAqIEBwcm9wZXJ0eSBkb2N1bWVudCB7RnVuY3Rpb259XG4gICAgICogQHByb3BlcnR5IERvY3VtZW50IHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgZ2xvYmFsIHtGdW5jdGlvbn1cbiAgICAgKiBAcHJvcGVydHkgR2xvYmFsIHtGdW5jdGlvbn1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0eXBlaXNbdHBdID0gdHlwZWlzW3RwMl0gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0eXBlaXMob2JqKSA9PT0gdHA7XG4gICAgfTtcbn07XG5cblxuLyoqXG4gKiDlpI3liLbpnZnmgIHmlrnms5VcbiAqL1xuZm9yICg7IGkgPCBqdWQubGVuZ3RoOyBpKyspIHtcbiAgICBtYWtlU3RhdGljKGp1ZFtpXSk7XG59XG5cblxuLyoqXG4gKiDliKTmlq3mmK/lkKbkuLrnuq/lr7nosaFcbiAqIEBwYXJhbSBvYmogeyp9XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqXG4gKiBAZXhhbXBsZVxuICogdHlwZS5pc1BsYWluT2JqZWN0KHthOjF9KTtcbiAqIC8vID0+IHRydWVcbiAqL1xudHlwZWlzLnBsYWluT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiB0eXBlaXMob2JqKSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikgPT09IE9iamVjdC5wcm90b3R5cGU7XG59O1xuXG5cbi8qKlxuICog5Yik5pat5piv5ZCm5Li656m65a+56LGhXG4gKiBAcGFyYW0gb2JqIHsqfVxuICovXG50eXBlaXMuZW1wdHlPYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVpcy5wbGFpbk9iamVjdChvYmopICYmIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufTtcblxuXG4vKipcbiAqIOWIpOaWreaYr+WQpuS4uiB1bmRlZmluZSDmiJYgbnVsbFxuICogQHBhcmFtIG9ialxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbnR5cGVpcy5lbXB0eSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gdWRmIHx8IHR5cGVpcy5udWxsKG9iaik7XG59O1xuXG5cbi8qKlxuICog5Yik5pat5piv5ZCm5Li6IFVSTCDmoLzlvI9cbiAqIEBwYXJhbSBzdHJpbmdcbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICpcbiAqIEBleGFtcGxlXG4gKiB0eXBlaXMudXJsKCdodHRwOi8vMTIzLmNvbS8xMjMvNDU2Lz9hPTMjMDAnKTtcbiAqIC8vID0+IHRydWVcbiAqL1xudHlwZWlzLnVybCA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICByZXR1cm4gdHlwZWlzKHN0cmluZykgPT09ICdzdHJpbmcnICYmIFJFR19VUkwudGVzdChzdHJpbmcpO1xufTtcblxuXG4vKipcbiAqIOWIpOaWreaYr+WQpuS4uiBlbWFpbCDmoLzlvI9cbiAqIEBwYXJhbSBzdHJpbmdcbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICpcbiAqIEBleGFtcGxlXG4gKiB0eXBlaXMuZW1haWwoJ2FiY0BkZWYuY29tJyk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbnR5cGVpcy5lbWFpbCA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICByZXR1cm4gdHlwZWlzKHN0cmluZykgPT09ICdzdHJpbmcnICYmIFJFR19FTUFJTC50ZXN0KHN0cmluZyk7XG59O1xuXG5cbi8qKlxuICog5Yik5pat6IO95ZCm6L2s5o2i5Li65ZCI5rOVRGF0ZVxuICogQHBhcmFtICBhbnl0aGluZ1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEB2ZXJzaW9uIDEuMFxuICogMjAxNOW5tDXmnIgy5pelMjE6MDc6MzNcbiAqL1xudHlwZWlzLnZhbGlkRGF0ZSA9IGZ1bmN0aW9uIChhbnl0aGluZykge1xuICAgIHJldHVybiAhUkVHX0lOVkFMSUQudGVzdChuZXcgRGF0ZShhbnl0aGluZykudG9TdHJpbmcoKSk7XG59O1xuXG5cbi8qKlxuICog5Yik5pat5a+56LGh5piv5ZCm5Li6IEVycm9yIOWunuS+i1xuICogQHBhcmFtIGFueXRoaW5nXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqXG4gKiBAZXhhbXBsZVxuICogdHlwZWlzLmVycm9yKG5ldyBUeXBlRXJyb3IoKSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbnR5cGVpcy5lcnJvciA9IGZ1bmN0aW9uIChhbnl0aGluZykge1xuICAgIHJldHVybiBhbnl0aGluZyAmJiAoYW55dGhpbmcgaW5zdGFuY2VvZiBFcnJvcik7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9bIE9OTFkgTk9ERUpTIF0vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLyoqXG4gKiDliKTmlq3mmK/lkKbkuLrlkIjms5XnmoRtb25nb2RiSURcbiAqIEBwYXJhbSAgYW55dGhpbmdcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAdmVyc2lvbiAxLjBcbiAqIDIwMTTlubQ15pyIM+aXpTIzOjExOjM3XG4gKi9cbnR5cGVpcy5tb25nb0lkID0gZnVuY3Rpb24gKGFueXRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhbnl0aGluZyAhPT0gdWRmICYmIHR5cGVvZiBhbnl0aGluZy5fYnNvbnR5cGUgIT09IHVkZiAmJlxuICAgICAgICBhbnl0aGluZy5fYnNvbnR5cGUgPT09ICdPYmplY3RJZCcgfHwgUkVHX01PTUdPREJfSUQudGVzdChhbnl0aGluZy50b1N0cmluZygpKTtcbn07XG5cblxuLyoqXG4gKiDliKTmlq3lr7nosaHmmK/lkKbkuLrnqbosbnVsbC91bmRlZmluZWQvXCJcIlxuICogQHBhcmFtICBhbnkgeyp9IOS7u+S9leWvueixoVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEB2ZXJzaW9uIDEuMFxuICogMjAxNOW5tDXmnIgyN+aXpTIxOjMzOjA0XG4gKi9cbnR5cGVpcy5lbXB0eURhdGEgPSBmdW5jdGlvbiAoYW55KSB7XG4gICAgcmV0dXJuIHR5cGVpcy5lbXB0eShhbnkpIHx8IGFueSA9PT0gJyc7XG59O1xuXG5cbi8qKlxuICog5Yik5pat6Lev5b6E5piv5ZCm5Li655uu5b2VXG4gKiBAcGFyYW0gX3BhdGhcbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICovXG4vLyB0eXBlaXMuZGlyZWN0b3J5ID0gZnVuY3Rpb24gKF9wYXRoKSB7XG4vLyAgICAgdmFyIHN0YXQ7XG5cbi8vICAgICB0cnkge1xuLy8gICAgICAgICBzdGF0ID0gZnMuc3RhdFN5bmMoX3BhdGgpO1xuLy8gICAgIH0gY2F0Y2ggKGVycikge1xuLy8gICAgICAgICByZXR1cm4gITE7XG4vLyAgICAgfVxuXG4vLyAgICAgcmV0dXJuIHN0YXQuaXNEaXJlY3RvcnkoKTtcbi8vIH07XG5cblxuLyoqXG4gKiDliKTmlq3ot6/lvoTmmK/lkKbkuLrmlofku7ZcbiAqIEBwYXJhbSBfcGF0aFxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbi8vIHR5cGVpcy5maWxlID0gZnVuY3Rpb24gKF9wYXRoKSB7XG4vLyAgICAgdmFyIHN0YXQ7XG5cbi8vICAgICB0cnkge1xuLy8gICAgICAgICBzdGF0ID0gZnMuc3RhdFN5bmMoX3BhdGgpO1xuLy8gICAgIH0gY2F0Y2ggKGVycikge1xuLy8gICAgICAgICByZXR1cm4gITE7XG4vLyAgICAgfVxuXG4vLyAgICAgcmV0dXJuIHN0YXQuaXNGaWxlKCk7XG4vLyB9O1xuXG5cbi8vIEBsaW5rOiBodHRwczovL3d3dy56aGlodS5jb20vcXVlc3Rpb24vMTk4MTM0NjAvYW5zd2VyLzEzMDQyMTQzXG4vLyBB57G75Zyw5Z2A77yaMTAuMC4wLjAtLTEwLjI1NS4yNTUuMjU1XG4vLyBC57G75Zyw5Z2A77yaMTcyLjE2LjAuMC0tMTcyLjMxLjI1NS4yNTVcbi8vIEPnsbvlnLDlnYDvvJoxOTIuMTY4LjAuMC0tMTkyLjE2OC4yNTUuMjU1XG4vKipcbiAqIOWIpOaWreaYr+WQpuS4uuWxgOWfn+e9kSBJUFxuICogQHBhcmFtIGlwXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xudHlwZWlzLmxvY2FsSVAgPSBmdW5jdGlvbiAoaXApIHtcbiAgICBpcCA9IFN0cmluZyhpcCkudG9VcHBlckNhc2UoKS50cmltKCk7XG5cbiAgICBpZiAoaXAuaW5kZXhPZignOjonKSA+IC0xIHx8IGlwID09PSAnbG9jYWxob3N0JyB8fCBpcC5pbmRleE9mKCcxMjcuMC4wLjEnKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBpcExpc3QgPSBpcC5zcGxpdCgnLicpO1xuICAgIHZhciBwYXJ0MCA9IE51bWJlcihpcExpc3RbMF0pO1xuICAgIHZhciBwYXJ0MSA9IE51bWJlcihpcExpc3RbMV0pO1xuICAgIC8vdmFyIHBhcnQyID0gTnVtYmVyKGlwTGlzdFsyXSk7XG4gICAgLy92YXIgcGFydDMgPSBOdW1iZXIoaXBMaXN0WzNdKTtcblxuICAgIC8vIEEg57G7XG4gICAgaWYgKHBhcnQwID09PSAxMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBCIOexu1xuICAgIGlmIChwYXJ0MCA9PT0gMTcyICYmIHBhcnQxID4gMTUgJiYgcGFydDEgPCAzMikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFydDAgPT09IDE5MiAmJiBwYXJ0MSA9PT0gMTY4O1xufTtcblxuLyoqXG4gKiBDaGVjayB2YWxpZCBkYXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0ZSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZm9ybWF0IFxuICovXG50eXBlaXMuZGF0ZSA9IGZ1bmN0aW9uIChkYXRlLCBmb3JtYXQpIHtcbiAgICB2YXIgZGF0ZWZvcm1hdCA9IFJFR19EQVRFX0RNWTtcbiAgICBpZiAodHlwZW9mIGZvcm1hdCAhPT0gJ3VuZGVmaW5lZCcgJiYgZm9ybWF0ID09IHRydWUpIHtcbiAgICAgICAgdmFyIGRhdGVmb3JtYXQgPSBSRUdfREFURV9ZTUQ7XG4gICAgfVxuICAgIFxuICAgIC8vIE1hdGNoIHRoZSBkYXRlIGZvcm1hdCB0aHJvdWdoIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgIGlmIChkYXRlLm1hdGNoKGRhdGVmb3JtYXQpKSB7XG4gICAgICAgIC8vVGVzdCB3aGljaCBzZXBlcmF0b3IgaXMgdXNlZCAnLycgb3IgJy0nXG4gICAgICAgIHZhciBvcGVyYTEgPSBkYXRlLnNwbGl0KCcvJyk7XG4gICAgICAgIHZhciBvcGVyYTIgPSBkYXRlLnNwbGl0KCctJyk7XG4gICAgICAgIHZhciBsb3BlcmExID0gb3BlcmExLmxlbmd0aDtcbiAgICAgICAgdmFyIGxvcGVyYTIgPSBvcGVyYTIubGVuZ3RoO1xuICAgICAgICAvLyBFeHRyYWN0IHRoZSBzdHJpbmcgaW50byBtb250aCwgZGF0ZSBhbmQgeWVhclxuICAgICAgICBpZiAobG9wZXJhMSA+IDEpIHtcbiAgICAgICAgICAgIHZhciBwZGF0ZSA9IGRhdGUuc3BsaXQoJy8nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChsb3BlcmEyID4gMSkge1xuICAgICAgICAgICAgdmFyIHBkYXRlID0gZGF0ZS5zcGxpdCgnLScpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZCA9IHBhcnNlSW50KHBkYXRlWzBdKTtcbiAgICAgICAgdmFyIG1tID0gcGFyc2VJbnQocGRhdGVbMV0pO1xuICAgICAgICB2YXIgeXkgPSBwYXJzZUludChwZGF0ZVsyXSk7XG5cbiAgICAgICAgaWYgKGZvcm1hdCkge1xuICAgICAgICAgICAgZGQgPSBwYXJzZUludChwZGF0ZVsyXSk7XG4gICAgICAgICAgICBtbSA9IHBhcnNlSW50KHBkYXRlWzFdKTtcbiAgICAgICAgICAgIHl5ID0gcGFyc2VJbnQocGRhdGVbMF0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgbGlzdCBvZiBkYXlzIG9mIGEgbW9udGggW2Fzc3VtZSB0aGVyZSBpcyBubyBsZWFwIHllYXIgYnkgZGVmYXVsdF1cbiAgICAgICAgdmFyIExpc3RvZkRheXMgPSBbMzEsIDI4LCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMV07XG4gICAgICAgIGlmIChtbSA9PSAxIHx8IG1tID4gMikge1xuICAgICAgICAgICAgaWYgKGRkID4gTGlzdG9mRGF5c1ttbSAtIDFdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1tID09IDIpIHtcbiAgICAgICAgICAgIHZhciBseWVhciA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKCghKHl5ICUgNCkgJiYgeXkgJSAxMDApIHx8ICEoeXkgJSA0MDApKSB7XG4gICAgICAgICAgICAgICAgbHllYXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChseWVhciA9PSBmYWxzZSkgJiYgKGRkID49IDI5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgobHllYXIgPT0gdHJ1ZSkgJiYgKGRkID4gMjkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbnR5cGVpcy5kYXRlVGltZVRvTWludXRlID0gZnVuY3Rpb24gKGRhdGUsIGZvcm1hdCkge1xuICAgIHZhciBkYXRlZm9ybWF0ID0gUkVHX0RBVEVfRE1ZSG07XG4gICAgaWYgKHR5cGVvZiBmb3JtYXQgIT09ICd1bmRlZmluZWQnICYmIGZvcm1hdCA9PSB0cnVlKSB7XG4gICAgICAgIHZhciBkYXRlZm9ybWF0ID0gUkVHX0RBVEVfWU1ESG07XG4gICAgfVxuXG4gICAgLy8gTWF0Y2ggdGhlIGRhdGUgZm9ybWF0IHRocm91Z2ggcmVndWxhciBleHByZXNzaW9uXG4gICAgaWYgKGRhdGUubWF0Y2goZGF0ZWZvcm1hdCkpIHtcbiAgICAgICAgLy9UZXN0IHdoaWNoIHNlcGVyYXRvciBpcyB1c2VkICcvJyBvciAnLSdcbiAgICAgICAgdmFyIG9wZXJhMSA9IGRhdGUuc3BsaXQoJy8nKSxcbiAgICAgICAgICAgIG9wZXJhMiA9IGRhdGUuc3BsaXQoJy0nKSxcbiAgICAgICAgICAgIGxvcGVyYTEgPSBvcGVyYTEubGVuZ3RoLFxuICAgICAgICAgICAgbG9wZXJhMiA9IG9wZXJhMi5sZW5ndGgsXG4gICAgICAgICAgICB0aW1lID0gXCJcIjtcbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgc3RyaW5nIGludG8gbW9udGgsIGRhdGUgYW5kIHllYXJcbiAgICAgICAgaWYgKGxvcGVyYTEgPiAxKSB7XG4gICAgICAgICAgICB2YXIgcGRhdGUgPSBkYXRlLnNwbGl0KCcvJyk7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChsb3BlcmEyID4gMSkge1xuICAgICAgICAgICAgdmFyIHBkYXRlID0gZGF0ZS5zcGxpdCgnLScpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzcGxpdCA9IChwZGF0ZVsyXSkuc3BsaXQoXCIgXCIpO1xuICAgICAgICB0aW1lID0gc3BsaXRbMV07XG4gICAgICAgIHZhciBkZCA9IHBhcnNlSW50KHBkYXRlWzBdKSxcbiAgICAgICAgICAgIG1tID0gcGFyc2VJbnQocGRhdGVbMV0pLFxuICAgICAgICAgICAgeXkgPSBwYXJzZUludChzcGxpdFswXSksXG4gICAgICAgICAgICBoaCA9IHBhcnNlSW50KHRpbWVbMV0uc3BsaXQoXCI6XCIpWzBdKSxcbiAgICAgICAgICAgIG0gPSBwYXJzZUludCh0aW1lWzFdLnNwbGl0KFwiOlwiKVsxXSk7XG5cbiAgICAgICAgaWYgKGZvcm1hdCkge1xuICAgICAgICAgICAgZGQgPSBwYXJzZUludChzcGxpdFswXSk7XG4gICAgICAgICAgICBtbSA9IHBhcnNlSW50KHBkYXRlWzFdKTtcbiAgICAgICAgICAgIHl5ID0gcGFyc2VJbnQocGRhdGVbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlzVmFsaWQgPSBjaGVja1ZhbGlkRGF0ZShkZCwgbW0sIHl5KTtcbiAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhoID4gMjQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobSA+IDYwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG52YXIgY2hlY2tWYWxpZERhdGUgPSBmdW5jdGlvbiAoZGQsIG1tLCB5eSkge1xuICAgIC8vIENyZWF0ZSBsaXN0IG9mIGRheXMgb2YgYSBtb250aCBbYXNzdW1lIHRoZXJlIGlzIG5vIGxlYXAgeWVhciBieSBkZWZhdWx0XVxuICAgIHZhciBMaXN0b2ZEYXlzID0gWzMxLCAyOCwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdO1xuICAgIGlmIChtbSA9PSAxIHx8IG1tID4gMikge1xuICAgICAgICBpZiAoZGQgPiBMaXN0b2ZEYXlzW21tIC0gMV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG1tID09IDIpIHtcbiAgICAgICAgdmFyIGx5ZWFyID0gZmFsc2U7XG4gICAgICAgIGlmICgoISh5eSAlIDQpICYmIHl5ICUgMTAwKSB8fCAhKHl5ICUgNDAwKSkge1xuICAgICAgICAgICAgbHllYXIgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgobHllYXIgPT0gZmFsc2UpICYmIChkZCA+PSAyOSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKGx5ZWFyID09IHRydWUpICYmIChkZCA+IDI5KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuXG4vKipcbiAqIEBuYW1lIHN0cmluZ1xuICogQG5hbWUgbnVtYmVyXG4gKiBAbmFtZSBmdW5jdGlvblxuICogQG5hbWUgb2JqZWN0XG4gKiBAbmFtZSB1bmRlZmluZWRcbiAqIEBuYW1lIG51bGxcbiAqIEBuYW1lIG5hblxuICogQG5hbWUgZWxlbWVudFxuICogQG5hbWUgcmVnZXhwXG4gKiBAbmFtZSBib29sZWFuXG4gKiBAbmFtZSBhcnJheVxuICogQG5hbWUgd2luZG93XG4gKiBAbmFtZSBkb2N1bWVudFxuICogQG5hbWUgZ2xvYmFsXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gdHlwZWlzO1xuIl19