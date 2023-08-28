/**
 * 数字相关
 * @author ydr.me
 * @create 2015-05-11 13:54
 */

/**
 * @module utils/number
 * @reuqires utils/typeis
 */

'use strict';

var typeis = require('./typeis.js');
var dato = require('./dato.js');

var REG_FORMAT = {
    3: /(\d)(?=(\d{3})+$)/g
};
// k,m,g,t,p
// @ref http://searchstorage.techtarget.com/definition/Kilo-mega-giga-tera-peta-and-all-that
var abbrSuffix = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
var REG_BEGIN_0 = /^0+/;
var str62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var map62 = {};

dato.repeat(62, function (index) {
    map62[str62[index]] = index;
});

/**
 * 整数化
 * @param num {*} 待转换对象
 * @param [dftNum=0] {*} 当为 NaN 时的默认值
 * @returns {*}
 */
exports.parseInt = function (num, dftNum) {
    dftNum = dftNum || 0;
    num = parseInt(num, 10);

    return typeis.nan(num) ? dftNum : num;
};

/**
 * 浮点化
 * @param num {*} 待转换对象
 * @param [dftNum=0] {*} 当为 NaN 时的默认值
 * @returns {*}
 */
exports.parseFloat = function (num, dftNum) {
    dftNum = dftNum || 0;
    num = parseFloat(num);

    return typeis.nan(num) ? dftNum : num;
};

/**
 * 数字格式化
 * @param num {String|Number} 数字（字符串）
 * @param [separator=","] {String} 分隔符
 * @param [splitLength=3] {Number} 分隔长度
 * @returns {string} 分割后的字符串
 * @example
 * number.format(123456.789);
 * // => "123,456.789"
 * number.format(123456.789, '-');
 * // => "123-456.789"
 */
exports.format = function (num, separator, splitLength) {
    if (typeis.number(separator)) {
        splitLength = separator;
        separator = ',';
    } else {
        separator = separator || ',';
        splitLength = splitLength || 3;
    }

    var reg = REG_FORMAT[splitLength];

    if (!reg) {
        // /(\d)(?=(\d{3})+$)/g
        reg = REG_FORMAT[splitLength] = new RegExp('(\\d)(?=(\\d{' + splitLength + '})+$)', 'g');
    }

    var arr = String(num).split('.');
    var p1 = arr[0].replace(reg, '$1' + separator);

    return p1 + (arr[1] ? '.' + arr[1] : '');
};

/**
 * 数字缩写
 * @param num {Number} 数值
 * @param [fixedLength=0] {Number} 修正长度
 * @param [step=1000] {Number} 步长
 * @returns {*}
 * @example
 * number.abbr(123456.789);
 * // => "123k"
 * number.abbr(123456.789, 2);
 * // => "123.46k"
 */
exports.abbr = function (num, fixedLength, step) {
    if (num < 1) {
        return num;
    }

    // 123.321 => 123
    num = exports.parseInt(num, 0);
    fixedLength = fixedLength || 0;
    step = step || 1000;

    var i = 0;
    var j = abbrSuffix.length;

    while (num >= step && ++i < j) {
        num = num / step;
    }

    if (i === j) {
        i = j - 1;
    }

    return exports.format(num.toFixed(fixedLength)) + abbrSuffix[i];
};

///**
// * 比较两个长整型数值
// * @param long1 {String|Number} 长整型数值字符串1
// * @param long2 {String|Number} 长整型数值字符串2
// * @param [operator=">"] {String} 比较操作符，默认比较 long1 > long2
// * @returns {*}
// * @example
// * number.than('9999999999999999999999999999999999999999', '9999999999999999999999999999999999999998');
// * // => true
// */
//exports.than = function (long1, long2, operator) {
//    operator = operator || '>';
//    long1 = String(long1).replace(REG_BEGIN_0, '');
//    long2 = String(long2).replace(REG_BEGIN_0, '');
//
//    // 1. 比较长度
//    if (long1.length > long2.length) {
//        return operator === '>';
//    } else if (long1.length < long2.length) {
//        return operator === '<';
//    }
//
//    // 15位是安全值
//    var long1List = exports.format(long1, ',', 15).split(',');
//    var long2List = exports.format(long2, ',', 15).split(',');
//
//    // 2. 遍历比较
//    var ret = false;
//
//    long1List.forEach(function (number1, index) {
//        var number2 = long2List[index];
//
//        if (number1 > number2) {
//            ret = operator === '>';
//            return false;
//        } else if (number1 < number2) {
//            ret = operator === '<';
//            return false;
//        }
//    });
//
//    return ret;
//};


/**
 * 获取六十二进制数值
 * @param number10
 * @returns {String}
 */
exports.to62 = function (number10) {
    var ret = [];

    var _cal = function _cal() {
        var y = number10 % 62;

        number10 = exports.parseInt(number10 / 62);
        ret.unshift(str62[y]);

        if (number10) {
            _cal();
        }
    };

    _cal();
    return ret.join('');
};

/**
 * 六十二进制转换为十进制
 * @param number62
 * @returns {number}
 */
exports.from62 = function (number62) {
    var ret = 0;
    var len = number62.length;

    dato.repeat(len, function (index) {
        var pos62 = number62[index];
        var pos10 = map62[pos62];

        ret += pos10 * Math.pow(62, len - index - 1);
    });

    return ret;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWxpZGF0b3IvbGlicy9udW1iZXIuanMiXSwibmFtZXMiOlsidHlwZWlzIiwicmVxdWlyZSIsImRhdG8iLCJSRUdfRk9STUFUIiwiYWJiclN1ZmZpeCIsIlJFR19CRUdJTl8wIiwic3RyNjIiLCJtYXA2MiIsInJlcGVhdCIsImluZGV4IiwiZXhwb3J0cyIsInBhcnNlSW50IiwibnVtIiwiZGZ0TnVtIiwibmFuIiwicGFyc2VGbG9hdCIsImZvcm1hdCIsInNlcGFyYXRvciIsInNwbGl0TGVuZ3RoIiwibnVtYmVyIiwicmVnIiwiUmVnRXhwIiwiYXJyIiwiU3RyaW5nIiwic3BsaXQiLCJwMSIsInJlcGxhY2UiLCJhYmJyIiwiZml4ZWRMZW5ndGgiLCJzdGVwIiwiaSIsImoiLCJsZW5ndGgiLCJ0b0ZpeGVkIiwidG82MiIsIm51bWJlcjEwIiwicmV0IiwiX2NhbCIsInkiLCJ1bnNoaWZ0Iiwiam9pbiIsImZyb202MiIsIm51bWJlcjYyIiwibGVuIiwicG9zNjIiLCJwb3MxMCIsIk1hdGgiLCJwb3ciXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFPQTs7Ozs7QUFLQTs7QUFFQSxJQUFJQSxTQUFTQyxRQUFRLGFBQVIsQ0FBYjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsV0FBUixDQUFYOztBQUVBLElBQUlFLGFBQWE7QUFDYixPQUFHO0FBRFUsQ0FBakI7QUFHQTtBQUNBO0FBQ0EsSUFBSUMsYUFBYSxDQUFDLEVBQUQsRUFBSyxHQUFMLEVBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUIsR0FBekIsRUFBOEIsR0FBOUIsRUFBbUMsR0FBbkMsRUFBd0MsR0FBeEMsQ0FBakI7QUFDQSxJQUFJQyxjQUFjLEtBQWxCO0FBQ0EsSUFBSUMsUUFBUSxnRUFBWjtBQUNBLElBQUlDLFFBQVEsRUFBWjs7QUFFQUwsS0FBS00sTUFBTCxDQUFZLEVBQVosRUFBZ0IsVUFBVUMsS0FBVixFQUFpQjtBQUM3QkYsVUFBTUQsTUFBTUcsS0FBTixD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QUFWLEVBQW9CO0FBQy9CLFFBQUlDLE1BQU0sRUFBVjs7QUFFQSxRQUFJQyxPQUFPLFNBQVBBLElBQU8sR0FBWTtBQUNuQixZQUFJQyxJQUFJSCxXQUFXLEVBQW5COztBQUVBQSxtQkFBV3pCLFFBQVFDLFFBQVIsQ0FBaUJ3QixXQUFXLEVBQTVCLENBQVg7QUFDQUMsWUFBSUcsT0FBSixDQUFZakMsTUFBTWdDLENBQU4sQ0FBWjs7QUFFQSxZQUFJSCxRQUFKLEVBQWM7QUFDVkU7QUFDSDtBQUNKLEtBVEQ7O0FBV0FBO0FBQ0EsV0FBT0QsSUFBSUksSUFBSixDQUFTLEVBQVQsQ0FBUDtBQUNILENBaEJEOztBQW1CQTs7Ozs7QUFLQTlCLFFBQVErQixNQUFSLEdBQWlCLFVBQVVDLFFBQVYsRUFBb0I7QUFDakMsUUFBSU4sTUFBTSxDQUFWO0FBQ0EsUUFBSU8sTUFBTUQsU0FBU1YsTUFBbkI7O0FBRUE5QixTQUFLTSxNQUFMLENBQVltQyxHQUFaLEVBQWlCLFVBQVVsQyxLQUFWLEVBQWlCO0FBQzlCLFlBQUltQyxRQUFRRixTQUFTakMsS0FBVCxDQUFaO0FBQ0EsWUFBSW9DLFFBQVF0QyxNQUFNcUMsS0FBTixDQUFaOztBQUVBUixlQUFPUyxRQUFRQyxLQUFLQyxHQUFMLENBQVMsRUFBVCxFQUFhSixNQUFNbEMsS0FBTixHQUFjLENBQTNCLENBQWY7QUFDSCxLQUxEOztBQU9BLFdBQU8yQixHQUFQO0FBQ0gsQ0FaRCIsImZpbGUiOiJudW1iZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIOaVsOWtl+ebuOWFs1xuICogQGF1dGhvciB5ZHIubWVcbiAqIEBjcmVhdGUgMjAxNS0wNS0xMSAxMzo1NFxuICovXG5cblxuLyoqXG4gKiBAbW9kdWxlIHV0aWxzL251bWJlclxuICogQHJldXFpcmVzIHV0aWxzL3R5cGVpc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGVpcyA9IHJlcXVpcmUoJy4vdHlwZWlzLmpzJyk7XG52YXIgZGF0byA9IHJlcXVpcmUoJy4vZGF0by5qcycpO1xuXG52YXIgUkVHX0ZPUk1BVCA9IHtcbiAgICAzOiAvKFxcZCkoPz0oXFxkezN9KSskKS9nXG59O1xuLy8gayxtLGcsdCxwXG4vLyBAcmVmIGh0dHA6Ly9zZWFyY2hzdG9yYWdlLnRlY2h0YXJnZXQuY29tL2RlZmluaXRpb24vS2lsby1tZWdhLWdpZ2EtdGVyYS1wZXRhLWFuZC1hbGwtdGhhdFxudmFyIGFiYnJTdWZmaXggPSBbJycsICdLJywgJ00nLCAnRycsICdUJywgJ1AnLCAnRScsICdaJywgJ1knXTtcbnZhciBSRUdfQkVHSU5fMCA9IC9eMCsvO1xudmFyIHN0cjYyID0gJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcbnZhciBtYXA2MiA9IHt9O1xuXG5kYXRvLnJlcGVhdCg2MiwgZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgbWFwNjJbc3RyNjJbaW5kZXhdXSA9IGluZGV4O1xufSk7XG5cbi8qKlxuICog5pW05pWw5YyWXG4gKiBAcGFyYW0gbnVtIHsqfSDlvoXovazmjaLlr7nosaFcbiAqIEBwYXJhbSBbZGZ0TnVtPTBdIHsqfSDlvZPkuLogTmFOIOaXtueahOm7mOiupOWAvFxuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydHMucGFyc2VJbnQgPSBmdW5jdGlvbiAobnVtLCBkZnROdW0pIHtcbiAgICBkZnROdW0gPSBkZnROdW0gfHwgMDtcbiAgICBudW0gPSBwYXJzZUludChudW0sIDEwKTtcblxuICAgIHJldHVybiB0eXBlaXMubmFuKG51bSkgPyBkZnROdW0gOiBudW07XG59O1xuXG5cbi8qKlxuICog5rWu54K55YyWXG4gKiBAcGFyYW0gbnVtIHsqfSDlvoXovazmjaLlr7nosaFcbiAqIEBwYXJhbSBbZGZ0TnVtPTBdIHsqfSDlvZPkuLogTmFOIOaXtueahOm7mOiupOWAvFxuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydHMucGFyc2VGbG9hdCA9IGZ1bmN0aW9uIChudW0sIGRmdE51bSkge1xuICAgIGRmdE51bSA9IGRmdE51bSB8fCAwO1xuICAgIG51bSA9IHBhcnNlRmxvYXQobnVtKTtcblxuICAgIHJldHVybiB0eXBlaXMubmFuKG51bSkgPyBkZnROdW0gOiBudW07XG59O1xuXG5cbi8qKlxuICog5pWw5a2X5qC85byP5YyWXG4gKiBAcGFyYW0gbnVtIHtTdHJpbmd8TnVtYmVyfSDmlbDlrZfvvIjlrZfnrKbkuLLvvIlcbiAqIEBwYXJhbSBbc2VwYXJhdG9yPVwiLFwiXSB7U3RyaW5nfSDliIbpmpTnrKZcbiAqIEBwYXJhbSBbc3BsaXRMZW5ndGg9M10ge051bWJlcn0g5YiG6ZqU6ZW/5bqmXG4gKiBAcmV0dXJucyB7c3RyaW5nfSDliIblibLlkI7nmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiBudW1iZXIuZm9ybWF0KDEyMzQ1Ni43ODkpO1xuICogLy8gPT4gXCIxMjMsNDU2Ljc4OVwiXG4gKiBudW1iZXIuZm9ybWF0KDEyMzQ1Ni43ODksICctJyk7XG4gKiAvLyA9PiBcIjEyMy00NTYuNzg5XCJcbiAqL1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbiAobnVtLCBzZXBhcmF0b3IsIHNwbGl0TGVuZ3RoKSB7XG4gICAgaWYgKHR5cGVpcy5udW1iZXIoc2VwYXJhdG9yKSkge1xuICAgICAgICBzcGxpdExlbmd0aCA9IHNlcGFyYXRvcjtcbiAgICAgICAgc2VwYXJhdG9yID0gJywnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCAnLCc7XG4gICAgICAgIHNwbGl0TGVuZ3RoID0gc3BsaXRMZW5ndGggfHwgMztcbiAgICB9XG5cbiAgICB2YXIgcmVnID0gUkVHX0ZPUk1BVFtzcGxpdExlbmd0aF07XG5cbiAgICBpZiAoIXJlZykge1xuICAgICAgICAvLyAvKFxcZCkoPz0oXFxkezN9KSskKS9nXG4gICAgICAgIHJlZyA9IFJFR19GT1JNQVRbc3BsaXRMZW5ndGhdID0gbmV3IFJlZ0V4cCgnKFxcXFxkKSg/PShcXFxcZHsnICsgc3BsaXRMZW5ndGggKyAnfSkrJCknLCAnZycpO1xuICAgIH1cblxuICAgIHZhciBhcnIgPSBTdHJpbmcobnVtKS5zcGxpdCgnLicpO1xuICAgIHZhciBwMSA9IGFyclswXS5yZXBsYWNlKHJlZywgJyQxJyArIHNlcGFyYXRvcik7XG5cbiAgICByZXR1cm4gcDEgKyAoYXJyWzFdID8gJy4nICsgYXJyWzFdIDogJycpO1xufTtcblxuXG4vKipcbiAqIOaVsOWtl+e8qeWGmVxuICogQHBhcmFtIG51bSB7TnVtYmVyfSDmlbDlgLxcbiAqIEBwYXJhbSBbZml4ZWRMZW5ndGg9MF0ge051bWJlcn0g5L+u5q2j6ZW/5bqmXG4gKiBAcGFyYW0gW3N0ZXA9MTAwMF0ge051bWJlcn0g5q2l6ZW/XG4gKiBAcmV0dXJucyB7Kn1cbiAqIEBleGFtcGxlXG4gKiBudW1iZXIuYWJicigxMjM0NTYuNzg5KTtcbiAqIC8vID0+IFwiMTIza1wiXG4gKiBudW1iZXIuYWJicigxMjM0NTYuNzg5LCAyKTtcbiAqIC8vID0+IFwiMTIzLjQ2a1wiXG4gKi9cbmV4cG9ydHMuYWJiciA9IGZ1bmN0aW9uIChudW0sIGZpeGVkTGVuZ3RoLCBzdGVwKSB7XG4gICAgaWYgKG51bSA8IDEpIHtcbiAgICAgICAgcmV0dXJuIG51bTtcbiAgICB9XG5cbiAgICAvLyAxMjMuMzIxID0+IDEyM1xuICAgIG51bSA9IGV4cG9ydHMucGFyc2VJbnQobnVtLCAwKTtcbiAgICBmaXhlZExlbmd0aCA9IGZpeGVkTGVuZ3RoIHx8IDA7XG4gICAgc3RlcCA9IHN0ZXAgfHwgMTAwMDtcblxuICAgIHZhciBpID0gMDtcbiAgICB2YXIgaiA9IGFiYnJTdWZmaXgubGVuZ3RoO1xuXG4gICAgd2hpbGUgKG51bSA+PSBzdGVwICYmICsraSA8IGopIHtcbiAgICAgICAgbnVtID0gbnVtIC8gc3RlcDtcbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gaikge1xuICAgICAgICBpID0gaiAtIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4cG9ydHMuZm9ybWF0KG51bS50b0ZpeGVkKGZpeGVkTGVuZ3RoKSkgKyBhYmJyU3VmZml4W2ldO1xufTtcblxuXG4vLy8qKlxuLy8gKiDmr5TovoPkuKTkuKrplb/mlbTlnovmlbDlgLxcbi8vICogQHBhcmFtIGxvbmcxIHtTdHJpbmd8TnVtYmVyfSDplb/mlbTlnovmlbDlgLzlrZfnrKbkuLIxXG4vLyAqIEBwYXJhbSBsb25nMiB7U3RyaW5nfE51bWJlcn0g6ZW/5pW05Z6L5pWw5YC85a2X56ym5LiyMlxuLy8gKiBAcGFyYW0gW29wZXJhdG9yPVwiPlwiXSB7U3RyaW5nfSDmr5TovoPmk43kvZznrKbvvIzpu5jorqTmr5TovoMgbG9uZzEgPiBsb25nMlxuLy8gKiBAcmV0dXJucyB7Kn1cbi8vICogQGV4YW1wbGVcbi8vICogbnVtYmVyLnRoYW4oJzk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTknLCAnOTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OCcpO1xuLy8gKiAvLyA9PiB0cnVlXG4vLyAqL1xuLy9leHBvcnRzLnRoYW4gPSBmdW5jdGlvbiAobG9uZzEsIGxvbmcyLCBvcGVyYXRvcikge1xuLy8gICAgb3BlcmF0b3IgPSBvcGVyYXRvciB8fCAnPic7XG4vLyAgICBsb25nMSA9IFN0cmluZyhsb25nMSkucmVwbGFjZShSRUdfQkVHSU5fMCwgJycpO1xuLy8gICAgbG9uZzIgPSBTdHJpbmcobG9uZzIpLnJlcGxhY2UoUkVHX0JFR0lOXzAsICcnKTtcbi8vXG4vLyAgICAvLyAxLiDmr5TovoPplb/luqZcbi8vICAgIGlmIChsb25nMS5sZW5ndGggPiBsb25nMi5sZW5ndGgpIHtcbi8vICAgICAgICByZXR1cm4gb3BlcmF0b3IgPT09ICc+Jztcbi8vICAgIH0gZWxzZSBpZiAobG9uZzEubGVuZ3RoIDwgbG9uZzIubGVuZ3RoKSB7XG4vLyAgICAgICAgcmV0dXJuIG9wZXJhdG9yID09PSAnPCc7XG4vLyAgICB9XG4vL1xuLy8gICAgLy8gMTXkvY3mmK/lronlhajlgLxcbi8vICAgIHZhciBsb25nMUxpc3QgPSBleHBvcnRzLmZvcm1hdChsb25nMSwgJywnLCAxNSkuc3BsaXQoJywnKTtcbi8vICAgIHZhciBsb25nMkxpc3QgPSBleHBvcnRzLmZvcm1hdChsb25nMiwgJywnLCAxNSkuc3BsaXQoJywnKTtcbi8vXG4vLyAgICAvLyAyLiDpgY3ljobmr5TovoNcbi8vICAgIHZhciByZXQgPSBmYWxzZTtcbi8vXG4vLyAgICBsb25nMUxpc3QuZm9yRWFjaChmdW5jdGlvbiAobnVtYmVyMSwgaW5kZXgpIHtcbi8vICAgICAgICB2YXIgbnVtYmVyMiA9IGxvbmcyTGlzdFtpbmRleF07XG4vL1xuLy8gICAgICAgIGlmIChudW1iZXIxID4gbnVtYmVyMikge1xuLy8gICAgICAgICAgICByZXQgPSBvcGVyYXRvciA9PT0gJz4nO1xuLy8gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4vLyAgICAgICAgfSBlbHNlIGlmIChudW1iZXIxIDwgbnVtYmVyMikge1xuLy8gICAgICAgICAgICByZXQgPSBvcGVyYXRvciA9PT0gJzwnO1xuLy8gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4vLyAgICAgICAgfVxuLy8gICAgfSk7XG4vL1xuLy8gICAgcmV0dXJuIHJldDtcbi8vfTtcblxuXG4vKipcbiAqIOiOt+WPluWFreWNgeS6jOi/m+WItuaVsOWAvFxuICogQHBhcmFtIG51bWJlcjEwXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5leHBvcnRzLnRvNjIgPSBmdW5jdGlvbiAobnVtYmVyMTApIHtcbiAgICB2YXIgcmV0ID0gW107XG5cbiAgICB2YXIgX2NhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHkgPSBudW1iZXIxMCAlIDYyO1xuXG4gICAgICAgIG51bWJlcjEwID0gZXhwb3J0cy5wYXJzZUludChudW1iZXIxMCAvIDYyKTtcbiAgICAgICAgcmV0LnVuc2hpZnQoc3RyNjJbeV0pO1xuXG4gICAgICAgIGlmIChudW1iZXIxMCkge1xuICAgICAgICAgICAgX2NhbCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIF9jYWwoKTtcbiAgICByZXR1cm4gcmV0LmpvaW4oJycpO1xufTtcblxuXG4vKipcbiAqIOWFreWNgeS6jOi/m+WItui9rOaNouS4uuWNgei/m+WItlxuICogQHBhcmFtIG51bWJlcjYyXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnRzLmZyb202MiA9IGZ1bmN0aW9uIChudW1iZXI2Mikge1xuICAgIHZhciByZXQgPSAwO1xuICAgIHZhciBsZW4gPSBudW1iZXI2Mi5sZW5ndGg7XG5cbiAgICBkYXRvLnJlcGVhdChsZW4sIGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgcG9zNjIgPSBudW1iZXI2MltpbmRleF07XG4gICAgICAgIHZhciBwb3MxMCA9IG1hcDYyW3BvczYyXTtcblxuICAgICAgICByZXQgKz0gcG9zMTAgKiBNYXRoLnBvdyg2MiwgbGVuIC0gaW5kZXggLSAxKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXQ7XG59O1xuXG5cblxuIl19