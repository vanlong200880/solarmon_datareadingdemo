/**
 * 加密
 * @author ydr.me
 * @create 2014-11-17 11:18
 */

'use strict';

var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var random = require('./random.js');
var typeis = require('./typeis.js');

/**
 * 字符串的 MD5 计算
 * @param data {*} 待计算的数据
 * @returns {string}
 *
 * @example
 * crypto.md5('123');
 * // => "202cb962ac59075b964b07152d234b70"
 */
exports.md5 = function (data) {
    if (typeis.undefined(data) || typeis.null(data)) {
        data = '';
    } else if (typeis.boolean(data) || typeis.number(data)) {
        data = String(data);
    }

    try {
        return crypto.createHash('md5').update(data).digest('hex');
    } catch (err) {
        return '';
    }
};

/**
 * 字符串 sha1 加密
 * @param data {*} 实体
 * @param [secret] {*} 密钥，可选
 * @returns {*}
 */
exports.sha1 = function (data, secret) {
    if (arguments.length === 2) {
        try {
            return crypto.createHmac('sha1', String(secret)).update(String(data)).digest('hex');
        } catch (err) {
            return '';
        }
    } else {
        try {
            return crypto.createHash('sha1').update(String(data)).digest('hex');
        } catch (err) {
            return err.message;
        }
    }
};

/**
 * 文件内容的 etag 计算
 * @param file {String} 文件绝对路径
 * @param [callback] {Function} 读取文件流进行MD5计算
 * @returns {string}
 */
exports.etag = function (file, callback) {
    var md5;
    var stream;
    var data;

    if (typeis(callback) === 'function') {
        md5 = crypto.createHash('md5');
        stream = fs.ReadStream(file);
        stream.on('data', function (d) {
            md5.update(d);
        });
        stream.on('end', function () {
            var d = md5.digest('hex');

            callback(null, d);
        });
        stream.on('error', callback);
    } else {
        try {
            data = fs.readFileSync(file);
        } catch (err) {
            data = '';
        }

        return exports.md5(data);
    }
};

/**
 * 文件最后修改时间的 md5 计算
 * @param file {String} 文件绝对路径
 * @returns {string} md5 值
 */
exports.lastModified = function (file) {
    var stats;
    var ret;

    try {
        stats = fs.statSync(file);
    } catch (err) {
        stats = null;
    }

    ret = stats ? String(new Date(stats.mtime).getTime()) : '0';

    return exports.md5(ret);
};

/**
 * 编码
 * @param data {String} 原始数据
 * @param secret {String} 密钥
 * @returns {String}
 */
exports.encode = function (data, secret) {
    var cipher = crypto.createCipher('aes192', String(secret));

    try {
        return cipher.update(String(data), 'utf8', 'hex') + cipher.final('hex');
    } catch (err) {
        return '';
    }
};

/**
 * 解码
 * @param data {String} 编码后的数据
 * @param secret {String} 密钥
 * @returns {String}
 */
exports.decode = function (data, secret) {
    var decipher = crypto.createDecipher('aes192', String(secret));

    try {
        return decipher.update(String(data), 'hex', 'utf8') + decipher.final('utf8');
    } catch (err) {
        return '';
    }
};

/**
 * 密码签名与验证
 * @param originalPassword {String} 原始密码
 * @param [signPassword] {String} 签名后的密码： 8（密钥） + 32（密匙） = 40位
 * @return {String|Boolean}
 */
exports.password = function (originalPassword, signPassword) {
    var key = '';
    var cnt = '';
    var entryption = function entryption(key, cnt) {
        // 轮次 sha1
        key = exports.sha1(key, cnt);
        cnt = exports.sha1(cnt, key);
        // md5 加密
        return exports.md5(key + cnt);
    };

    // 密码验证
    if (arguments.length === 2) {
        key = signPassword.slice(0, 8);
        cnt = signPassword.slice(8);

        return entryption(key, originalPassword) === cnt;
    }
    // 密码签名
    else {
            key = random.string(8, '~@#$%^&*()_+{}[]=-<>?/,.|:;');

            return key + entryption(key, originalPassword);
        }
};

///////////////////////////////////////////////////////////////////////////
//var str = '123';
//console.log(exports.md5(str));

//var file = path.join(__dirname, '../index.js');
//var d = exports.etag(file);
//console.log(d);
//
//exports.etag(file, function (err, md5) {
//    console.log(err);
//    console.log(md5);
//});

//var a = '123';
//var k = '456';
//var e = exports.encode(a, k);
//console.log(e);
//var d = exports.decode(e, k);
//console.log(d);
//console.log(exports.sha1(a));
//console.log(exports.sha1(a, k));
//var p1 = '123';
//var cp1 = exports.password(p1);
//var cp2 = exports.password(p1);
//console.log('原始密码：', p1);
//console.log('密码签名1：', cp1);
//console.log('密码签名2：', cp2);
//console.log(cp);
//console.log(p2);

//console.log('系统纳秒1：', random.guid());
//console.log('系统纳秒2：', random.guid());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWxpZGF0b3IvbGlicy9lbmNyeXB0aW9uLmpzIl0sIm5hbWVzIjpbInBhdGgiLCJyZXF1aXJlIiwiZnMiLCJjcnlwdG8iLCJyYW5kb20iLCJ0eXBlaXMiLCJleHBvcnRzIiwibWQ1IiwiZGF0YSIsInVuZGVmaW5lZCIsIm51bGwiLCJib29sZWFuIiwibnVtYmVyIiwiU3RyaW5nIiwiY3JlYXRlSGFzaCIsInVwZGF0ZSIsImRpZ2VzdCIsImVyciIsInNoYTEiLCJzZWNyZXQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJjcmVhdGVIbWFjIiwibWVzc2FnZSIsImV0YWciLCJmaWxlIiwiY2FsbGJhY2siLCJzdHJlYW0iLCJSZWFkU3RyZWFtIiwib24iLCJkIiwicmVhZEZpbGVTeW5jIiwibGFzdE1vZGlmaWVkIiwic3RhdHMiLCJyZXQiLCJzdGF0U3luYyIsIkRhdGUiLCJtdGltZSIsImdldFRpbWUiLCJlbmNvZGUiLCJjaXBoZXIiLCJjcmVhdGVDaXBoZXIiLCJmaW5hbCIsImRlY29kZSIsImRlY2lwaGVyIiwiY3JlYXRlRGVjaXBoZXIiLCJwYXNzd29yZCIsIm9yaWdpbmFsUGFzc3dvcmQiLCJzaWduUGFzc3dvcmQiLCJrZXkiLCJjbnQiLCJlbnRyeXB0aW9uIiwic2xpY2UiLCJzdHJpbmciXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFNQTs7QUFFQSxJQUFJQSxPQUFPQyxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlDLEtBQUtELFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUUsU0FBU0YsUUFBUSxRQUFSLENBQWI7QUFDQSxJQUFJRyxTQUFTSCxRQUFRLGFBQVIsQ0FBYjtBQUNBLElBQUlJLFNBQVNKLFFBQVEsYUFBUixDQUFiOztBQUdBOzs7Ozs7Ozs7QUFTQUssUUFBUUMsR0FBUixHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUIsUUFBSUgsT0FBT0ksU0FBUCxDQUFpQkQsSUFBakIsS0FBMEJILE9BQU9LLElBQVAsQ0FBWUYsSUFB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LENBQWFnQyxHQUFiLEVBQWtCRCxHQUFsQixDQUFOO0FBQ0E7QUFDQSxlQUFPM0MsUUFBUUMsR0FBUixDQUFZMEMsTUFBTUMsR0FBbEIsQ0FBUDtBQUNILEtBTkQ7O0FBUUE7QUFDQSxRQUFJOUIsVUFBVUMsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUN4QjRCLGNBQU1ELGFBQWFJLEtBQWIsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBTjtBQUNBRixjQUFNRixhQUFhSSxLQUFiLENBQW1CLENBQW5CLENBQU47O0FBRUEsZUFBT0QsV0FBV0YsR0FBWCxFQUFnQkYsZ0JBQWhCLE1BQXNDRyxHQUE3QztBQUNIO0FBQ0Q7QUFOQSxTQU9LO0FBQ0RELGtCQUFNN0MsT0FBT2lELE1BQVAsQ0FBYyxDQUFkLEVBQWlCLDZCQUFqQixDQUFOOztBQUVBLG1CQUFPSixNQUFNRSxXQUFXRixHQUFYLEVBQWdCRixnQkFBaEIsQ0FBYjtBQUNIO0FBQ0osQ0F4QkQ7O0FBMkJBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJmaWxlIjoiZW5jcnlwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICog5Yqg5a+GXG4gKiBAYXV0aG9yIHlkci5tZVxuICogQGNyZWF0ZSAyMDE0LTExLTE3IDExOjE4XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG52YXIgcmFuZG9tID0gcmVxdWlyZSgnLi9yYW5kb20uanMnKTtcbnZhciB0eXBlaXMgPSByZXF1aXJlKCcuL3R5cGVpcy5qcycpO1xuXG5cbi8qKlxuICog5a2X56ym5Liy55qEIE1ENSDorqHnrpdcbiAqIEBwYXJhbSBkYXRhIHsqfSDlvoXorqHnrpfnmoTmlbDmja5cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKlxuICogQGV4YW1wbGVcbiAqIGNyeXB0by5tZDUoJzEyMycpO1xuICogLy8gPT4gXCIyMDJjYjk2MmFjNTkwNzViOTY0YjA3MTUyZDIzNGI3MFwiXG4gKi9cbmV4cG9ydHMubWQ1ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAodHlwZWlzLnVuZGVmaW5lZChkYXRhKSB8fCB0eXBlaXMubnVsbChkYXRhKSkge1xuICAgICAgICBkYXRhID0gJyc7XG4gICAgfSBlbHNlIGlmICh0eXBlaXMuYm9vbGVhbihkYXRhKSB8fCB0eXBlaXMubnVtYmVyKGRhdGEpKSB7XG4gICAgICAgIGRhdGEgPSBTdHJpbmcoZGF0YSk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoZGF0YSkuZGlnZXN0KCdoZXgnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiDlrZfnrKbkuLIgc2hhMSDliqDlr4ZcbiAqIEBwYXJhbSBkYXRhIHsqfSDlrp7kvZNcbiAqIEBwYXJhbSBbc2VjcmV0XSB7Kn0g5a+G6ZKl77yM5Y+v6YCJXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZXhwb3J0cy5zaGExID0gZnVuY3Rpb24gKGRhdGEsIHNlY3JldCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhtYWMoJ3NoYTEnLCBTdHJpbmcoc2VjcmV0KSkudXBkYXRlKFN0cmluZyhkYXRhKSkuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKFN0cmluZyhkYXRhKSkuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbi8qKlxuICog5paH5Lu25YaF5a6555qEIGV0YWcg6K6h566XXG4gKiBAcGFyYW0gZmlsZSB7U3RyaW5nfSDmlofku7bnu53lr7not6/lvoRcbiAqIEBwYXJhbSBbY2FsbGJhY2tdIHtGdW5jdGlvbn0g6K+75Y+W5paH5Lu25rWB6L+b6KGMTUQ16K6h566XXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnRzLmV0YWcgPSBmdW5jdGlvbiAoZmlsZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgbWQ1O1xuICAgIHZhciBzdHJlYW07XG4gICAgdmFyIGRhdGE7XG5cbiAgICBpZiAodHlwZWlzKGNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBtZDUgPSBjcnlwdG8uY3JlYXRlSGFzaCgnbWQ1Jyk7XG4gICAgICAgIHN0cmVhbSA9IGZzLlJlYWRTdHJlYW0oZmlsZSk7XG4gICAgICAgIHN0cmVhbS5vbignZGF0YScsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICBtZDUudXBkYXRlKGQpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZCA9IG1kNS5kaWdlc3QoJ2hleCcpO1xuXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHN0cmVhbS5vbignZXJyb3InLCBjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGF0YSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cG9ydHMubWQ1KGRhdGEpO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiDmlofku7bmnIDlkI7kv67mlLnml7bpl7TnmoQgbWQ1IOiuoeeul1xuICogQHBhcmFtIGZpbGUge1N0cmluZ30g5paH5Lu257ud5a+56Lev5b6EXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBtZDUg5YC8XG4gKi9cbmV4cG9ydHMubGFzdE1vZGlmaWVkID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgICB2YXIgc3RhdHM7XG4gICAgdmFyIHJldDtcblxuICAgIHRyeSB7XG4gICAgICAgIHN0YXRzID0gZnMuc3RhdFN5bmMoZmlsZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHN0YXRzID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXQgPSBzdGF0cyA/IFN0cmluZyhuZXcgRGF0ZShzdGF0cy5tdGltZSkuZ2V0VGltZSgpKSA6ICcwJztcblxuICAgIHJldHVybiBleHBvcnRzLm1kNShyZXQpO1xufTtcblxuXG4vKipcbiAqIOe8lueggVxuICogQHBhcmFtIGRhdGEge1N0cmluZ30g5Y6f5aeL5pWw5o2uXG4gKiBAcGFyYW0gc2VjcmV0IHtTdHJpbmd9IOWvhumSpVxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5lbmNvZGUgPSBmdW5jdGlvbiAoZGF0YSwgc2VjcmV0KSB7XG4gICAgdmFyIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXIoJ2FlczE5MicsIFN0cmluZyhzZWNyZXQpKTtcblxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjaXBoZXIudXBkYXRlKFN0cmluZyhkYXRhKSwgJ3V0ZjgnLCAnaGV4JykgKyBjaXBoZXIuZmluYWwoJ2hleCcpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxufTtcblxuXG4vKipcbiAqIOino+eggVxuICogQHBhcmFtIGRhdGEge1N0cmluZ30g57yW56CB5ZCO55qE5pWw5o2uXG4gKiBAcGFyYW0gc2VjcmV0IHtTdHJpbmd9IOWvhumSpVxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5kZWNvZGUgPSBmdW5jdGlvbiAoZGF0YSwgc2VjcmV0KSB7XG4gICAgdmFyIGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyKCdhZXMxOTInLCBTdHJpbmcoc2VjcmV0KSk7XG5cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gZGVjaXBoZXIudXBkYXRlKFN0cmluZyhkYXRhKSwgJ2hleCcsICd1dGY4JykgKyBkZWNpcGhlci5maW5hbCgndXRmOCcpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxufTtcblxuXG4vKipcbiAqIOWvhueggeetvuWQjeS4jumqjOivgVxuICogQHBhcmFtIG9yaWdpbmFsUGFzc3dvcmQge1N0cmluZ30g5Y6f5aeL5a+G56CBXG4gKiBAcGFyYW0gW3NpZ25QYXNzd29yZF0ge1N0cmluZ30g562+5ZCN5ZCO55qE5a+G56CB77yaIDjvvIjlr4bpkqXvvIkgKyAzMu+8iOWvhuWMme+8iSA9IDQw5L2NXG4gKiBAcmV0dXJuIHtTdHJpbmd8Qm9vbGVhbn1cbiAqL1xuZXhwb3J0cy5wYXNzd29yZCA9IGZ1bmN0aW9uIChvcmlnaW5hbFBhc3N3b3JkLCBzaWduUGFzc3dvcmQpIHtcbiAgICB2YXIga2V5ID0gJyc7XG4gICAgdmFyIGNudCA9ICcnO1xuICAgIHZhciBlbnRyeXB0aW9uID0gZnVuY3Rpb24gKGtleSwgY250KSB7XG4gICAgICAgIC8vIOi9ruasoSBzaGExXG4gICAgICAgIGtleSA9IGV4cG9ydHMuc2hhMShrZXksIGNudCk7XG4gICAgICAgIGNudCA9IGV4cG9ydHMuc2hhMShjbnQsIGtleSk7XG4gICAgICAgIC8vIG1kNSDliqDlr4ZcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMubWQ1KGtleSArIGNudCk7XG4gICAgfTtcblxuICAgIC8vIOWvhueggemqjOivgVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGtleSA9IHNpZ25QYXNzd29yZC5zbGljZSgwLCA4KTtcbiAgICAgICAgY250ID0gc2lnblBhc3N3b3JkLnNsaWNlKDgpO1xuXG4gICAgICAgIHJldHVybiBlbnRyeXB0aW9uKGtleSwgb3JpZ2luYWxQYXNzd29yZCkgPT09IGNudDtcbiAgICB9XG4gICAgLy8g5a+G56CB562+5ZCNXG4gICAgZWxzZSB7XG4gICAgICAgIGtleSA9IHJhbmRvbS5zdHJpbmcoOCwgJ35AIyQlXiYqKClfK3t9W109LTw+Py8sLnw6OycpO1xuXG4gICAgICAgIHJldHVybiBrZXkgKyBlbnRyeXB0aW9uKGtleSwgb3JpZ2luYWxQYXNzd29yZCk7XG4gICAgfVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vdmFyIHN0ciA9ICcxMjMnO1xuLy9jb25zb2xlLmxvZyhleHBvcnRzLm1kNShzdHIpKTtcblxuLy92YXIgZmlsZSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9pbmRleC5qcycpO1xuLy92YXIgZCA9IGV4cG9ydHMuZXRhZyhmaWxlKTtcbi8vY29uc29sZS5sb2coZCk7XG4vL1xuLy9leHBvcnRzLmV0YWcoZmlsZSwgZnVuY3Rpb24gKGVyciwgbWQ1KSB7XG4vLyAgICBjb25zb2xlLmxvZyhlcnIpO1xuLy8gICAgY29uc29sZS5sb2cobWQ1KTtcbi8vfSk7XG5cbi8vdmFyIGEgPSAnMTIzJztcbi8vdmFyIGsgPSAnNDU2Jztcbi8vdmFyIGUgPSBleHBvcnRzLmVuY29kZShhLCBrKTtcbi8vY29uc29sZS5sb2coZSk7XG4vL3ZhciBkID0gZXhwb3J0cy5kZWNvZGUoZSwgayk7XG4vL2NvbnNvbGUubG9nKGQpO1xuLy9jb25zb2xlLmxvZyhleHBvcnRzLnNoYTEoYSkpO1xuLy9jb25zb2xlLmxvZyhleHBvcnRzLnNoYTEoYSwgaykpO1xuLy92YXIgcDEgPSAnMTIzJztcbi8vdmFyIGNwMSA9IGV4cG9ydHMucGFzc3dvcmQocDEpO1xuLy92YXIgY3AyID0gZXhwb3J0cy5wYXNzd29yZChwMSk7XG4vL2NvbnNvbGUubG9nKCfljp/lp4vlr4bnoIHvvJonLCBwMSk7XG4vL2NvbnNvbGUubG9nKCflr4bnoIHnrb7lkI0x77yaJywgY3AxKTtcbi8vY29uc29sZS5sb2coJ+WvhueggeetvuWQjTLvvJonLCBjcDIpO1xuLy9jb25zb2xlLmxvZyhjcCk7XG4vL2NvbnNvbGUubG9nKHAyKTtcblxuLy9jb25zb2xlLmxvZygn57O757uf57qz56eSMe+8micsIHJhbmRvbS5ndWlkKCkpO1xuLy9jb25zb2xlLmxvZygn57O757uf57qz56eSMu+8micsIHJhbmRvbS5ndWlkKCkpO1xuIl19