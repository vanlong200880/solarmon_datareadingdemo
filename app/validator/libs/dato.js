/**
 * 数据遍历
 * @author ydr.me
 * 2014-09-14 17:26
 */

'use strict';

var typeis = require('./typeis.js');
var udf;
var canListTypeArr = 'array object nodelist htmlcollection arguments namednodemap'.split(' ');
var REG_BEGIN_0 = /^0+/;
var w = global;

/**
 * 判断对象是否有自己的静态属性
 * @param obj
 * @param key
 * @returns {boolean}
 */
exports.hasStatic = function (obj, key) {
    try {
        return Object.prototype.hasOwnProperty.call(obj, key);
    } catch (err) {
        return false;
    }
};

/**
 * 遍历元素
 * @param {Array/Object} list  数组、可枚举对象
 * @param {Function} callback  回调，返回false时停止遍历
 * @param {Boolean} [reverse=false] 数组倒序
 *
 * @example
 * // 与 jQuery.each 一样
 * // 返回 false 时将退出当前遍历
 * data.each(list, function(key, val){});
 */
exports.each = function (list, callback, reverse) {
    var i;
    var j;

    // 数组 或 类似数组
    if (list && typeis.number(list.length)) {
        if (reverse) {
            for (i = list.length - 1, j = 0; i >= 0; i--) {
                if (callback.call(w, i, list[i]) === false) {
                    break;
                }
            }
        } else {
            for (i = 0, j = list.length; i < j; i++) {
                if (callback.call(w, i, list[i]) === false) {
                    break;
                }
            }
        }
    }
    // 纯对象
    else if (list !== null && list !== udf) {
            for (i in list) {
                if (exports.hasStatic(list, i)) {
                    if (callback.call(w, i, list[i]) === false) {
                        break;
                    }
                }
            }
        }
};

/**
 * 重复运行
 * @param count {Number} 重复次数
 * @param fn {Function} 重复方法
 */
exports.repeat = function (count, fn) {
    var i = -1;

    while (++i < count) {
        if (fn(i, count) === false) {
            break;
        }
    }
};

/**
 * 扩展静态对象
 * @param {Boolean|Object} [isExtendDeep] 是否深度扩展，可省略，默认false
 * @param {Object}  [source] 源对象
 * @param {...Object}  [target] 目标对象，可以是多个
 * @returns {*}
 *
 * @example
 * // 使用方法与 jQuery.extend 一样
 * var o1 = {a: 1};
 * var o2 = {b: 2};
 * var o3 = data.extend(true, o1, o2);
 * // => {a: 1, b: 2}
 * o1 === o3
 * // => true
 *
 * // 如果不想污染原始对象，可以传递一个空对象作为容器
 * var o1 = {a: 1};
 * var o2 = {b: 2};
 * var o3 = data.extend(true, {}, o1, o2);
 * // => {a: 1, b: 2}
 * o1 === o3
 * // => fale
 */
exports.extend = function (isExtendDeep, source, target) {
    var args = arguments;
    var firstArgIsBoolean = typeof args[0] === 'boolean';
    var current = firstArgIsBoolean ? 1 : 0;
    var length = args.length;
    var i;
    var obj;
    var sourceType;
    var objType;

    isExtendDeep = firstArgIsBoolean && args[0] === true;
    source = args[current++];

    for (; current < length; current++) {
        obj = args[current];
        for (i in obj) {
            if (exports.hasStatic(obj, i) && obj[i] !== undefined) {
                sourceType = typeis(source[i]);
                objType = typeis(obj[i]);

                if (objType === 'object' && isExtendDeep) {
                    source[i] = sourceType !== objType ? {} : source[i];
                    exports.extend.call(this, isExtendDeep, source[i], obj[i]);
                } else if (objType === 'array' && isExtendDeep) {
                    source[i] = sourceType !== objType ? [] : source[i];
                    exports.extend.call(this, isExtendDeep, source[i], obj[i]);
                } else {
                    source[i] = obj[i];
                }
            }
        }
    }

    return source;
};

/**
 * 萃取
 * @param data {Object} 传递的数据
 * @param keys {Array} 摘取的键数组
 * @param [filter] {Function} 过滤方法，默认取不为 undefined 键值
 * @returns {Object}
 */
exports.select = function (data, keys, filter) {
    var data2 = {};

    data = data || {};

    filter = filter || function (val) {
        return val !== udf;
    };

    keys.forEach(function (key) {
        if (filter(data[key])) {
            data2[key] = data[key];
        }
    });

    return data2;
};

/**
 * 转换对象为一个纯数组，只要对象有length属性即可
 * @param {Object} [obj] 对象
 * @param {Boolean} [isConvertWhole] 是否转换整个对象为数组中的第0个元素，当该对象无length属性时，默认false
 * @returns {Array}
 *
 * @example
 * var o = {0:"foo", 1:"bar", length: 2}
 * data.toArray(o);
 * // => ["foo", "bar"]
 *
 * var a1 = [1, 2, 3];
 * // 转换后的数组是之前的副本
 * var a2 = data.toArray(a1);
 * // => [1, 2, 3]
 * a2 === a1;
 * // => false
 */
exports.toArray = function (obj, isConvertWhole) {
    var ret = [];
    var i = 0;
    var j;
    var objType = typeis(obj);

    if (canListTypeArr.indexOf(objType) > -1 && typeis(obj.length) === 'number' && obj.length >= 0) {
        for (j = obj.length; i < j; i++) {
            ret.push(obj[i]);
        }
    } else if (obj && isConvertWhole) {
        ret.push(obj);
    }

    return ret;
};

/**
 * 对象1级比较，找出相同和不同的键
 * @param obj1 {Object|Array}
 * @param obj2 {Object|Array}
 * @returns {Object}
 *
 * @example
 * data.compare({a:1,b:2,c:3}, {a:1,d:4});
 * // =>
 * // {
     * //    same: ["a"],
     * //    only: [
     * //       ["b", "c"],
     * //       ["d"]
     * //    ],
     * //    different: ["b", "c", "d"]
     * // }
 */
exports.compare = function (obj1, obj2) {
    var obj1Type = typeis(obj1);
    var obj2Type = typeis(obj2);
    var obj1Only = [];
    var obj2Only = [];
    var same = [];

    // 类型不同
    if (obj1Type !== obj2Type) {
        return null;
    }

    // 对象
    if (obj1Type === 'object' || obj1Type === 'array') {
        exports.each(obj1, function (key, val) {
            if (obj2[key] !== val) {
                obj1Only.push(key);
            } else {
                same.push(key);
            }
        });

        exports.each(obj2, function (key, val) {
            if (obj1[key] !== val) {
                obj2Only.push(key);
            }
        });

        return {
            same: same,
            only: [obj1Only, obj2Only],
            different: obj1Only.concat(obj2Only)
        };
    } else {
        return null;
    }
};

/**
 * 比较两个长整型数值
 * @param long1 {String} 长整型数值字符串1
 * @param long2 {String} 长整型数值字符串2
 * @param [operator=">"] {String} 比较操作符，默认比较 long1 > long2
 * @returns {*}
 */
exports.than = function (long1, long2, operator) {
    operator = operator || '>';
    long1 = String(long1).replace(REG_BEGIN_0, '');
    long2 = String(long2).replace(REG_BEGIN_0, '');

    // 1. 比较长度
    if (long1.length > long2.length) {
        return operator === '>';
    } else if (long1.length < long2.length) {
        return operator === '<';
    }

    var long1List = exports.humanize(long1, ',', 15).split(',');
    var long2List = exports.humanize(long2, ',', 15).split(',');

    //[
    // '123456',
    // '789012345678901',
    // '234567890123456',
    // '789012345678901',
    // '234567890123457'
    // ]

    // 2. 比较数组长度
    if (long1List.length > long2List.length) {
        return operator === '>';
    } else if (long1List.length < long2List.length) {
        return operator === '<';
    }

    // 3. 遍历比较
    var ret = false;

    exports.each(long1List, function (index, number1) {
        var number2 = long2List[index];

        if (number1 > number2) {
            ret = operator === '>';
            return false;
        } else if (number1 < number2) {
            ret = operator === '<';
            return false;
        }
    });

    return ret;
};

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////[ ONLY NODEJS ]////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

var path = require('path');
var qs = require('querystring');
var encryption = require('./encryption.js');

/**
 * 获取 gravatar
 * @param email {String} 邮箱
 * @param [options] {Object} 配置
 * @param [options.origin="http://gravatar.duoshuo.com/avatar/"] {String} 服务器
 * @param [options.size=100] {Number} 尺寸
 * @param [options.default="retro"] {Number} 默认头像
 * @param [options.forcedefault=false] {*} 是否忽略默认头像
 * @param [options.rating=null] {*} 评级
 * @returns {string}
 */
exports.gravatar = function (email, options) {
    options = options || {};
    email = email.toLowerCase();

    if (!options.origin) {
        options.origin = 'http://cn.gravatar.com/avatar/';
    }

    options.origin += encryption.md5(email) + '?';

    if (!options.size) {
        options.size = 100;
    }

    if (!options.default) {
        //options.default = 'http://s.ydr.me/p/i/avatar.png';
        options.default = 'retro';
    }

    if (options.forcedefault) {
        options.forcedefault = 'y';
    } else {
        options.forcedefault = false;
    }

    var query = {
        s: options.size
    };

    if (options.default) {
        query.d = options.default;
    }

    if (options.forcedefault) {
        query.f = options.forcedefault;
    }

    if (options.rating) {
        query.r = options.rating;
    }

    return options.origin + qs.stringify(query);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWxpZGF0b3IvbGlicy9kYXRvLmpzIl0sIm5hbWVzIjpbInR5cGVpcyIsInJlcXVpcmUiLCJ1ZGYiLCJjYW5MaXN0VHlwZUFyciIsInNwbGl0IiwiUkVHX0JFR0lOXzAiLCJ3IiwiZ2xvYmFsIiwiZXhwb3J0cyIsImhhc1N0YXRpYyIsIm9iaiIsImtleSIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImVyciIsImVhY2giLCJsaXN0IiwiY2FsbGJhY2siLCJyZXZlcnNlIiwiaSIsImoiLCJudW1iZXIiLCJsZW5ndGgiLCJyZXBlYXQiLCJjb3VudCIsImZuIiwiZXh0ZW5kIiwiaXNFeHRlbmREZWVwIiwic291cmNlIiwidGFyZ2V0IiwiYXJncyIsImFyZ3VtZW50cyIsImZpcnN0QXJnSXNCb29sZWFuIiwiY3VycmVudCIsInNvdXJjZVR5cGUiLCJvYmpUeXBlIiwidW5kZWZpbmVkIiwic2VsZWN0IiwiZGF0YSIsImtleXMiLCJmaWx0ZXIiLCJkYXRhMiIsInZhbCIsImZvckVhY2giLCJ0b0FycmF5IiwiaXNDb252ZXJ0V2hvbGUiLCJyZXQiLCJpbmRleE9mIiwicHVzaCIsImNvbXBhcmUiLCJvYmoxIiwib2JqMiIsIm9iajFUeXBlIiwib2JqMlR5cGUiLCJvYmoxT25seSIsIm9iajJPbmx5Iiwic2FtZSIsIm9ubHkiLCJkaWZmZXJlbnQiLCJjb25jYXQiLCJ0aGFuIiwibG9uZzEiLCJsb25nMiIsIm9wZXJhdG9yIiwiU3RyaW5nIiwicmVwbGFjZSIsImxvbmcxTGlzdCIsImh1bWFuaXplIiwibG9uZzJMaXN0IiwiaW5kZXgiLCJudW1iZXIxIiwibnVtYmVyMiIsInBhdGgiLCJxcyIsImVuY3J5cHRpb24iLCJncmF2YXRhciIsImVtYWlsIiwib3B0aW9ucyIsInRvTG93ZXJDYXNlIiwib3JpZ2luIiwibWQ1Iiwic2l6ZSIsImRlZmF1bHQiLCJmb3JjZWRlZmF1bHQiLCJxdWVyeSIsInMiLCJkIiwi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cUI7QUFDakJFLGNBQU1FLENBQU4sR0FBVVQsUUFBUUssT0FBbEI7QUFDSDs7QUFFRCxRQUFJTCxRQUFRTSxZQUFaLEVBQTBCO0FBQ3RCQyxjQUFNRyxDQUFOLEdBQVVWLFFBQVFNLFlBQWxCO0FBQ0g7O0FBRUQsUUFBSU4sUUFBUVcsTUFBWixFQUFvQjtBQUNoQkosY0FBTUssQ0FBTixHQUFVWixRQUFRVyxNQUFsQjtBQUNIOztBQUVELFdBQU9YLFFBQVFFLE1BQVIsR0FBaUJOLEdBQUdpQixTQUFILENBQWFOLEtBQWIsQ0FBeEI7QUFDSCxDQTFDRCIsImZpbGUiOiJkYXRvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiDmlbDmja7pgY3ljoZcbiAqIEBhdXRob3IgeWRyLm1lXG4gKiAyMDE0LTA5LTE0IDE3OjI2XG4gKi9cblxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlaXMgPSByZXF1aXJlKCcuL3R5cGVpcy5qcycpO1xudmFyIHVkZjtcbnZhciBjYW5MaXN0VHlwZUFyciA9ICdhcnJheSBvYmplY3Qgbm9kZWxpc3QgaHRtbGNvbGxlY3Rpb24gYXJndW1lbnRzIG5hbWVkbm9kZW1hcCcuc3BsaXQoJyAnKTtcbnZhciBSRUdfQkVHSU5fMCA9IC9eMCsvO1xudmFyIHcgPSBnbG9iYWw7XG5cblxuLyoqXG4gKiDliKTmlq3lr7nosaHmmK/lkKbmnInoh6rlt7HnmoTpnZnmgIHlsZ7mgKdcbiAqIEBwYXJhbSBvYmpcbiAqIEBwYXJhbSBrZXlcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnRzLmhhc1N0YXRpYyA9IGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcblxuXG4vKipcbiAqIOmBjeWOhuWFg+e0oFxuICogQHBhcmFtIHtBcnJheS9PYmplY3R9IGxpc3QgIOaVsOe7hOOAgeWPr+aemuS4vuWvueixoVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgIOWbnuiwg++8jOi/lOWbnmZhbHNl5pe25YGc5q2i6YGN5Y6GXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtyZXZlcnNlPWZhbHNlXSDmlbDnu4TlgJLluo9cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8g5LiOIGpRdWVyeS5lYWNoIOS4gOagt1xuICogLy8g6L+U5ZueIGZhbHNlIOaXtuWwhumAgOWHuuW9k+WJjemBjeWOhlxuICogZGF0YS5lYWNoKGxpc3QsIGZ1bmN0aW9uKGtleSwgdmFsKXt9KTtcbiAqL1xuZXhwb3J0cy5lYWNoID0gZnVuY3Rpb24gKGxpc3QsIGNhbGxiYWNrLCByZXZlcnNlKSB7XG4gICAgdmFyIGk7XG4gICAgdmFyIGo7XG5cbiAgICAvLyDmlbDnu4Qg5oiWIOexu+S8vOaVsOe7hFxuICAgIGlmIChsaXN0ICYmIHR5cGVpcy5udW1iZXIobGlzdC5sZW5ndGgpKSB7XG4gICAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aCAtIDEsIGogPSAwOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHcsIGksIGxpc3RbaV0pID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBqID0gbGlzdC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh3LCBpLCBsaXN0W2ldKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIOe6r+WvueixoVxuICAgIGVsc2UgaWYgKGxpc3QgIT09IG51bGwgJiYgbGlzdCAhPT0gdWRmKSB7XG4gICAgICAgIGZvciAoaSBpbiBsaXN0KSB7XG4gICAgICAgICAgICBpZiAoZXhwb3J0cy5oYXNTdGF0aWMobGlzdCwgaSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh3LCBpLCBsaXN0W2ldKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuXG4vKipcbiAqIOmHjeWkjei/kOihjFxuICogQHBhcmFtIGNvdW50IHtOdW1iZXJ9IOmHjeWkjeasoeaVsFxuICogQHBhcmFtIGZuIHtGdW5jdGlvbn0g6YeN5aSN5pa55rOVXG4gKi9cbmV4cG9ydHMucmVwZWF0ID0gZnVuY3Rpb24gKGNvdW50LCBmbikge1xuICAgIHZhciBpID0gLTE7XG5cbiAgICB3aGlsZSAoKytpIDwgY291bnQpIHtcbiAgICAgICAgaWYgKGZuKGksIGNvdW50KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG4vKipcbiAqIOaJqeWxlemdmeaAgeWvueixoVxuICogQHBhcmFtIHtCb29sZWFufE9iamVjdH0gW2lzRXh0ZW5kRGVlcF0g5piv5ZCm5rex5bqm5omp5bGV77yM5Y+v55yB55Wl77yM6buY6K6kZmFsc2VcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW3NvdXJjZV0g5rqQ5a+56LGhXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gIFt0YXJnZXRdIOebruagh+Wvueixoe+8jOWPr+S7peaYr+WkmuS4qlxuICogQHJldHVybnMgeyp9XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIOS9v+eUqOaWueazleS4jiBqUXVlcnkuZXh0ZW5kIOS4gOagt1xuICogdmFyIG8xID0ge2E6IDF9O1xuICogdmFyIG8yID0ge2I6IDJ9O1xuICogdmFyIG8zID0gZGF0YS5leHRlbmQodHJ1ZSwgbzEsIG8yKTtcbiAqIC8vID0+IHthOiAxLCBiOiAyfVxuICogbzEgPT09IG8zXG4gKiAvLyA9PiB0cnVlXG4gKlxuICogLy8g5aaC5p6c5LiN5oOz5rGh5p+T5Y6f5aeL5a+56LGh77yM5Y+v5Lul5Lyg6YCS5LiA5Liq56m65a+56LGh5L2c5Li65a655ZmoXG4gKiB2YXIgbzEgPSB7YTogMX07XG4gKiB2YXIgbzIgPSB7YjogMn07XG4gKiB2YXIgbzMgPSBkYXRhLmV4dGVuZCh0cnVlLCB7fSwgbzEsIG8yKTtcbiAqIC8vID0+IHthOiAxLCBiOiAyfVxuICogbzEgPT09IG8zXG4gKiAvLyA9PiBmYWxlXG4gKi9cbmV4cG9ydHMuZXh0ZW5kID0gZnVuY3Rpb24gKGlzRXh0ZW5kRGVlcCwgc291cmNlLCB0YXJnZXQpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgZmlyc3RBcmdJc0Jvb2xlYW4gPSB0eXBlb2YgKGFyZ3NbMF0pID09PSAnYm9vbGVhbic7XG4gICAgdmFyIGN1cnJlbnQgPSBmaXJzdEFyZ0lzQm9vbGVhbiA/IDEgOiAwO1xuICAgIHZhciBsZW5ndGggPSBhcmdzLmxlbmd0aDtcbiAgICB2YXIgaTtcbiAgICB2YXIgb2JqO1xuICAgIHZhciBzb3VyY2VUeXBlO1xuICAgIHZhciBvYmpUeXBlO1xuXG4gICAgaXNFeHRlbmREZWVwID0gZmlyc3RBcmdJc0Jvb2xlYW4gJiYgYXJnc1swXSA9PT0gdHJ1ZTtcbiAgICBzb3VyY2UgPSBhcmdzW2N1cnJlbnQrK107XG5cbiAgICBmb3IgKDsgY3VycmVudCA8IGxlbmd0aDsgY3VycmVudCsrKSB7XG4gICAgICAgIG9iaiA9IGFyZ3NbY3VycmVudF07XG4gICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChleHBvcnRzLmhhc1N0YXRpYyhvYmosIGkpICYmIG9ialtpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc291cmNlVHlwZSA9IHR5cGVpcyhzb3VyY2VbaV0pO1xuICAgICAgICAgICAgICAgIG9ialR5cGUgPSB0eXBlaXMob2JqW2ldKTtcblxuICAgICAgICAgICAgICAgIGlmIChvYmpUeXBlID09PSAnb2JqZWN0JyAmJiBpc0V4dGVuZERlZXApIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlW2ldID0gc291cmNlVHlwZSAhPT0gb2JqVHlwZSA/IHt9IDogc291cmNlW2ldO1xuICAgICAgICAgICAgICAgICAgICBleHBvcnRzLmV4dGVuZC5jYWxsKHRoaXMsIGlzRXh0ZW5kRGVlcCwgc291cmNlW2ldLCBvYmpbaV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqVHlwZSA9PT0gJ2FycmF5JyAmJiBpc0V4dGVuZERlZXApIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlW2ldID0gc291cmNlVHlwZSAhPT0gb2JqVHlwZSA/IFtdIDogc291cmNlW2ldO1xuICAgICAgICAgICAgICAgICAgICBleHBvcnRzLmV4dGVuZC5jYWxsKHRoaXMsIGlzRXh0ZW5kRGVlcCwgc291cmNlW2ldLCBvYmpbaV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZVtpXSA9IG9ialtpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc291cmNlO1xufTtcblxuXG4vKipcbiAqIOiQg+WPllxuICogQHBhcmFtIGRhdGEge09iamVjdH0g5Lyg6YCS55qE5pWw5o2uXG4gKiBAcGFyYW0ga2V5cyB7QXJyYXl9IOaRmOWPlueahOmUruaVsOe7hFxuICogQHBhcmFtIFtmaWx0ZXJdIHtGdW5jdGlvbn0g6L+H5ruk5pa55rOV77yM6buY6K6k5Y+W5LiN5Li6IHVuZGVmaW5lZCDplK7lgLxcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbmV4cG9ydHMuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEsIGtleXMsIGZpbHRlcikge1xuICAgIHZhciBkYXRhMiA9IHt9O1xuXG4gICAgZGF0YSA9IGRhdGEgfHwge307XG5cbiAgICBmaWx0ZXIgPSBmaWx0ZXIgfHwgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsICE9PSB1ZGY7XG4gICAgfTtcblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChmaWx0ZXIoZGF0YVtrZXldKSkge1xuICAgICAgICAgICAgZGF0YTJba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGEyO1xufTtcblxuXG4vKipcbiAqIOi9rOaNouWvueixoeS4uuS4gOS4que6r+aVsOe7hO+8jOWPquimgeWvueixoeaciWxlbmd0aOWxnuaAp+WNs+WPr1xuICogQHBhcmFtIHtPYmplY3R9IFtvYmpdIOWvueixoVxuICogQHBhcmFtIHtCb29sZWFufSBbaXNDb252ZXJ0V2hvbGVdIOaYr+WQpui9rOaNouaVtOS4quWvueixoeS4uuaVsOe7hOS4reeahOesrDDkuKrlhYPntKDvvIzlvZPor6Xlr7nosaHml6BsZW5ndGjlsZ7mgKfml7bvvIzpu5jorqRmYWxzZVxuICogQHJldHVybnMge0FycmF5fVxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgbyA9IHswOlwiZm9vXCIsIDE6XCJiYXJcIiwgbGVuZ3RoOiAyfVxuICogZGF0YS50b0FycmF5KG8pO1xuICogLy8gPT4gW1wiZm9vXCIsIFwiYmFyXCJdXG4gKlxuICogdmFyIGExID0gWzEsIDIsIDNdO1xuICogLy8g6L2s5o2i5ZCO55qE5pWw57uE5piv5LmL5YmN55qE5Ymv5pysXG4gKiB2YXIgYTIgPSBkYXRhLnRvQXJyYXkoYTEpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKiBhMiA9PT0gYTE7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5leHBvcnRzLnRvQXJyYXkgPSBmdW5jdGlvbiAob2JqLCBpc0NvbnZlcnRXaG9sZSkge1xuICAgIHZhciByZXQgPSBbXTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGo7XG4gICAgdmFyIG9ialR5cGUgPSB0eXBlaXMob2JqKTtcblxuICAgIGlmIChjYW5MaXN0VHlwZUFyci5pbmRleE9mKG9ialR5cGUpID4gLTEgJiYgdHlwZWlzKG9iai5sZW5ndGgpID09PSAnbnVtYmVyJyAmJiBvYmoubGVuZ3RoID49IDApIHtcbiAgICAgICAgZm9yIChqID0gb2JqLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgcmV0LnB1c2gob2JqW2ldKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2JqICYmIGlzQ29udmVydFdob2xlKSB7XG4gICAgICAgIHJldC5wdXNoKG9iaik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cblxuLyoqXG4gKiDlr7nosaEx57qn5q+U6L6D77yM5om+5Ye655u45ZCM5ZKM5LiN5ZCM55qE6ZSuXG4gKiBAcGFyYW0gb2JqMSB7T2JqZWN0fEFycmF5fVxuICogQHBhcmFtIG9iajIge09iamVjdHxBcnJheX1cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKlxuICogQGV4YW1wbGVcbiAqIGRhdGEuY29tcGFyZSh7YToxLGI6MixjOjN9LCB7YToxLGQ6NH0pO1xuICogLy8gPT5cbiAqIC8vIHtcbiAgICAgKiAvLyAgICBzYW1lOiBbXCJhXCJdLFxuICAgICAqIC8vICAgIG9ubHk6IFtcbiAgICAgKiAvLyAgICAgICBbXCJiXCIsIFwiY1wiXSxcbiAgICAgKiAvLyAgICAgICBbXCJkXCJdXG4gICAgICogLy8gICAgXSxcbiAgICAgKiAvLyAgICBkaWZmZXJlbnQ6IFtcImJcIiwgXCJjXCIsIFwiZFwiXVxuICAgICAqIC8vIH1cbiAqL1xuZXhwb3J0cy5jb21wYXJlID0gZnVuY3Rpb24gKG9iajEsIG9iajIpIHtcbiAgICB2YXIgb2JqMVR5cGUgPSB0eXBlaXMob2JqMSk7XG4gICAgdmFyIG9iajJUeXBlID0gdHlwZWlzKG9iajIpO1xuICAgIHZhciBvYmoxT25seSA9IFtdO1xuICAgIHZhciBvYmoyT25seSA9IFtdO1xuICAgIHZhciBzYW1lID0gW107XG5cbiAgICAvLyDnsbvlnovkuI3lkIxcbiAgICBpZiAob2JqMVR5cGUgIT09IG9iajJUeXBlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIOWvueixoVxuICAgIGlmIChvYmoxVHlwZSA9PT0gJ29iamVjdCcgfHwgb2JqMVR5cGUgPT09ICdhcnJheScpIHtcbiAgICAgICAgZXhwb3J0cy5lYWNoKG9iajEsIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgICAgICAgICAgaWYgKG9iajJba2V5XSAhPT0gdmFsKSB7XG4gICAgICAgICAgICAgICAgb2JqMU9ubHkucHVzaChrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzYW1lLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwb3J0cy5lYWNoKG9iajIsIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgICAgICAgICAgaWYgKG9iajFba2V5XSAhPT0gdmFsKSB7XG4gICAgICAgICAgICAgICAgb2JqMk9ubHkucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2FtZTogc2FtZSxcbiAgICAgICAgICAgIG9ubHk6IFtcbiAgICAgICAgICAgICAgICBvYmoxT25seSxcbiAgICAgICAgICAgICAgICBvYmoyT25seVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGRpZmZlcmVudDogb2JqMU9ubHkuY29uY2F0KG9iajJPbmx5KVxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiDmr5TovoPkuKTkuKrplb/mlbTlnovmlbDlgLxcbiAqIEBwYXJhbSBsb25nMSB7U3RyaW5nfSDplb/mlbTlnovmlbDlgLzlrZfnrKbkuLIxXG4gKiBAcGFyYW0gbG9uZzIge1N0cmluZ30g6ZW/5pW05Z6L5pWw5YC85a2X56ym5LiyMlxuICogQHBhcmFtIFtvcGVyYXRvcj1cIj5cIl0ge1N0cmluZ30g5q+U6L6D5pON5L2c56ym77yM6buY6K6k5q+U6L6DIGxvbmcxID4gbG9uZzJcbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnRzLnRoYW4gPSBmdW5jdGlvbiAobG9uZzEsIGxvbmcyLCBvcGVyYXRvcikge1xuICAgIG9wZXJhdG9yID0gb3BlcmF0b3IgfHwgJz4nO1xuICAgIGxvbmcxID0gU3RyaW5nKGxvbmcxKS5yZXBsYWNlKFJFR19CRUdJTl8wLCAnJyk7XG4gICAgbG9uZzIgPSBTdHJpbmcobG9uZzIpLnJlcGxhY2UoUkVHX0JFR0lOXzAsICcnKTtcblxuICAgIC8vIDEuIOavlOi+g+mVv+W6plxuICAgIGlmIChsb25nMS5sZW5ndGggPiBsb25nMi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdG9yID09PSAnPic7XG4gICAgfSBlbHNlIGlmIChsb25nMS5sZW5ndGggPCBsb25nMi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdG9yID09PSAnPCc7XG4gICAgfVxuXG4gICAgdmFyIGxvbmcxTGlzdCA9IGV4cG9ydHMuaHVtYW5pemUobG9uZzEsICcsJywgMTUpLnNwbGl0KCcsJyk7XG4gICAgdmFyIGxvbmcyTGlzdCA9IGV4cG9ydHMuaHVtYW5pemUobG9uZzIsICcsJywgMTUpLnNwbGl0KCcsJyk7XG5cbiAgICAvL1tcbiAgICAvLyAnMTIzNDU2JyxcbiAgICAvLyAnNzg5MDEyMzQ1Njc4OTAxJyxcbiAgICAvLyAnMjM0NTY3ODkwMTIzNDU2JyxcbiAgICAvLyAnNzg5MDEyMzQ1Njc4OTAxJyxcbiAgICAvLyAnMjM0NTY3ODkwMTIzNDU3J1xuICAgIC8vIF1cblxuICAgIC8vIDIuIOavlOi+g+aVsOe7hOmVv+W6plxuICAgIGlmIChsb25nMUxpc3QubGVuZ3RoID4gbG9uZzJMaXN0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3BlcmF0b3IgPT09ICc+JztcbiAgICB9IGVsc2UgaWYgKGxvbmcxTGlzdC5sZW5ndGggPCBsb25nMkxpc3QubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcGVyYXRvciA9PT0gJzwnO1xuICAgIH1cblxuICAgIC8vIDMuIOmBjeWOhuavlOi+g1xuICAgIHZhciByZXQgPSBmYWxzZTtcblxuICAgIGV4cG9ydHMuZWFjaChsb25nMUxpc3QsIGZ1bmN0aW9uIChpbmRleCwgbnVtYmVyMSkge1xuICAgICAgICB2YXIgbnVtYmVyMiA9IGxvbmcyTGlzdFtpbmRleF07XG5cbiAgICAgICAgaWYgKG51bWJlcjEgPiBudW1iZXIyKSB7XG4gICAgICAgICAgICByZXQgPSBvcGVyYXRvciA9PT0gJz4nO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKG51bWJlcjEgPCBudW1iZXIyKSB7XG4gICAgICAgICAgICByZXQgPSBvcGVyYXRvciA9PT0gJzwnO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmV0O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vWyBPTkxZIE5PREVKUyBdLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBxcyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XG52YXIgZW5jcnlwdGlvbiA9IHJlcXVpcmUoJy4vZW5jcnlwdGlvbi5qcycpO1xuXG5cbi8qKlxuICog6I635Y+WIGdyYXZhdGFyXG4gKiBAcGFyYW0gZW1haWwge1N0cmluZ30g6YKu566xXG4gKiBAcGFyYW0gW29wdGlvbnNdIHtPYmplY3R9IOmFjee9rlxuICogQHBhcmFtIFtvcHRpb25zLm9yaWdpbj1cImh0dHA6Ly9ncmF2YXRhci5kdW9zaHVvLmNvbS9hdmF0YXIvXCJdIHtTdHJpbmd9IOacjeWKoeWZqFxuICogQHBhcmFtIFtvcHRpb25zLnNpemU9MTAwXSB7TnVtYmVyfSDlsLrlr7hcbiAqIEBwYXJhbSBbb3B0aW9ucy5kZWZhdWx0PVwicmV0cm9cIl0ge051bWJlcn0g6buY6K6k5aS05YOPXG4gKiBAcGFyYW0gW29wdGlvbnMuZm9yY2VkZWZhdWx0PWZhbHNlXSB7Kn0g5piv5ZCm5b+955Wl6buY6K6k5aS05YOPXG4gKiBAcGFyYW0gW29wdGlvbnMucmF0aW5nPW51bGxdIHsqfSDor4TnuqdcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuZ3JhdmF0YXIgPSBmdW5jdGlvbiAoZW1haWwsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBlbWFpbCA9IGVtYWlsLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBpZiAoIW9wdGlvbnMub3JpZ2luKSB7XG4gICAgICAgIG9wdGlvbnMub3JpZ2luID0gJ2h0dHA6Ly9jbi5ncmF2YXRhci5jb20vYXZhdGFyLyc7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5vcmlnaW4gKz0gZW5jcnlwdGlvbi5tZDUoZW1haWwpICsgJz8nO1xuXG4gICAgaWYgKCFvcHRpb25zLnNpemUpIHtcbiAgICAgICAgb3B0aW9ucy5zaXplID0gMTAwO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5kZWZhdWx0KSB7XG4gICAgICAgIC8vb3B0aW9ucy5kZWZhdWx0ID0gJ2h0dHA6Ly9zLnlkci5tZS9wL2kvYXZhdGFyLnBuZyc7XG4gICAgICAgIG9wdGlvbnMuZGVmYXVsdCA9ICdyZXRybyc7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZm9yY2VkZWZhdWx0KSB7XG4gICAgICAgIG9wdGlvbnMuZm9yY2VkZWZhdWx0ID0gJ3knO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMuZm9yY2VkZWZhdWx0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHF1ZXJ5ID0ge1xuICAgICAgICBzOiBvcHRpb25zLnNpemVcbiAgICB9O1xuXG4gICAgaWYgKG9wdGlvbnMuZGVmYXVsdCkge1xuICAgICAgICBxdWVyeS5kID0gb3B0aW9ucy5kZWZhdWx0O1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmZvcmNlZGVmYXVsdCkge1xuICAgICAgICBxdWVyeS5mID0gb3B0aW9ucy5mb3JjZWRlZmF1bHQ7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucmF0aW5nKSB7XG4gICAgICAgIHF1ZXJ5LnIgPSBvcHRpb25zLnJhdGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucy5vcmlnaW4gKyBxcy5zdHJpbmdpZnkocXVlcnkpO1xufTtcblxuXG5cblxuIl19