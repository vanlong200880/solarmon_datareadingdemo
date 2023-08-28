/**
 * 随机数
 * @author ydr.me
 * @create 2014-10-30 19:03
 */

'use strict';

var dato = require('./dato.js');
var number = require('./number.js');
var string = require('./string.js');
var allocation = require('./allocation.js');
var regExist = /[aA0]/g;
var dictionaryMap = {
    a: 'abcdefghijklmnopqrstuvwxyz',
    A: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    0: '0123456789'
};
var guidIndex = 0;
var lastGuidTime = 0;

/**
 * 随机数字
 * @param [min=0] {Number} 最小值，默认0
 * @param [max=0] {Number} 最大值，默认0
 * @returns {Number}
 *
 * @example
 * random.number(1, 3);
 * // => 1 or 2 or 3
 */
exports.number = function (min, max) {
    var temp;

    min = number.parseInt(min, 0);
    max = number.parseInt(max, 0);

    if (min === max) {
        return min;
    }

    if (min > max) {
        temp = min;
        min = max;
        max = temp;
    }

    return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * 随机字符串
 * @param [length=6] {Number} 随机字符串长度
 * @param [dictionary='aA0'] {String} 字典
 *
 * @example
 * // 字典对应关系
 * // a => a-z
 * // A => A-Z
 * // 0 => 0-9
 * // 其他字符
 * random.string(6, 'a');
 * // => abcdef
 * random.string(6, '!@#$%^&*()_+');
 * // => @*)&(^
 */
exports.string = function (length, dictionary) {
    var ret = '';
    var pool = '';
    var max;

    length = Math.abs(number.parseInt(length, 6));
    dictionary = String(dictionary || 'a');

    if (dictionary.indexOf('a') > -1) {
        pool += dictionaryMap.a;
    }

    if (dictionary.indexOf('A') > -1) {
        pool += dictionaryMap.A;
    }

    if (dictionary.indexOf('0') > -1) {
        pool += dictionaryMap[0];
    }

    pool += dictionary.replace(regExist, '');
    max = pool.length - 1;

    while (length--) {
        ret += pool[exports.number(0, max)];
    }

    return ret;
};

/**
 * 最短 16 位长度的随机不重复字符串
 * @param [isTimeStamp=false] 是否时间戳形式
 * @param [maxLength=16] 最大长度
 * @returns {String}
 */
exports.guid = function (isTimeStamp, maxLength) {
    var a = [];
    var d = new Date();
    var ret = '';
    var now = d.getTime();
    var args = allocation.args(arguments);
    var suffix = '';
    var minLength = 16;

    switch (args.length) {
        case 0:
            isTimeStamp = false;
            maxLength = minLength;
            break;

        case 1:
            // guid(isTimeStamp);
            if (typeof args[0] === 'boolean') {
                maxLength = minLength;
            }
            // guid(maxLength);
            else {
                    isTimeStamp = false;
                    maxLength = args[0];
                }
            break;
    }

    maxLength = Math.max(maxLength, minLength);

    if (isTimeStamp) {
        if (now !== lastGuidTime) {
            lastGuidTime = now;
            guidIndex = 0;
        }

        now = String(now);
        var timeStampLength = now.length;
        suffix = number.to62(guidIndex++);
        suffix = string.padLeft(suffix, maxLength - timeStampLength, '0');
        ret = now + suffix;
    } else {
        // 4
        var Y = string.padLeft(d.getFullYear(), 4, '0');
        // 2
        var M = string.padLeft(d.getMonth() + 1, 2, '0');
        // 2
        var D = string.padLeft(d.getDate(), 2, '0');
        // 2
        var H = string.padLeft(d.getHours(), 2, '0');
        // 2
        var I = string.padLeft(d.getMinutes(), 2, '0');
        // 2
        var S = string.padLeft(d.getSeconds(), 2, '0');
        //// 3
        //var C = string.padLeft(d.getMilliseconds(), 3, '0');
        //// 9
        //var N = string.padLeft(process.hrtime()[1], 9, '0');

        a.push(Y);
        a.push(M);
        a.push(D);
        a.push(H);
        a.push(I);
        a.push(S);

        var dateTime = a.join('');

        if (dateTime !== lastGuidTime) {
            lastGuidTime = dateTime;
            guidIndex = 0;
        }

        suffix = number.to62(guidIndex++);
        suffix = string.padLeft(suffix, maxLength - 14, '0');
        a.push(suffix);
        ret = a.join('');
    }

    return ret;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWxpZGF0b3IvbGlicy9yYW5kb20uanMiXSwibmFtZXMiOlsiZGF0byIsInJlcXVpcmUiLCJudW1iZXIiLCJzdHJpbmciLCJhbGxvY2F0aW9uIiwicmVnRXhpc3QiLCJkaWN0aW9uYXJ5TWFwIiwiYSIsIkEiLCJndWlkSW5kZXgiLCJsYXN0R3VpZFRpbWUiLCJleHBvcnRzIiwibWluIiwibWF4IiwidGVtcCIsInBhcnNlSW50IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwibGVuZ3RoIiwiZGljdGlvbmFyeSIsInJldCIsInBvb2wiLCJhYnMiLCJTdHJpbmciLCJpbmRleE9mIiwicmVwbGFjZSIsImd1aWQiLCJpc1RpbWVTdGFtcCIsIm1heExlbmd0aCIsImQiLCJEYXRlIiwibm93IiwiZ2V0VGltZSIsImFyZ3MiLCJhcmd1bWVudHMiLCJzdWZmaXgiLCJtaW5MZW5ndGgiLCJ0aW1lU3RhbXBMZW5ndGgiLCJ0bzYyIiwicGFkTGVmdCIsIlkiLCJnZXRGdWxsWWVhciIsIk0iLCJnZXRNb250aCIsIkQiLCJnZXREYXRlIiwiSCIsImdldEhvdXJzIiwiSSIsImdldE1pbnV0ZXMiLCJTIiwiZ2V0U2Vjb25kcyIsInB1c2giLCJkYXRlVGltZSIsImpvaW4iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFNQTs7QUFFQSxJQUFJQSxPQUFPQyxRQUFRLFdBQVIsQ0FBWDtBQUNBLElBQUlDLFNBQVNELFFBQVEsYUFBUixDQUFiO0FBQ0EsSUFBSUUsU0FBU0YsUUFBUSxhQUFSLENBQWI7QUFDQSxJQUFJRyxhQUFhSCxRQUFRLGlCQUFSLENBQWpCO0FBQ0EsSUFBSUksV0FBVyxRQUFmO0FBQ0EsSUFBSUMsZ0JBQWdCO0FBQ2hCQyxPQUFHLDRCQURhO0FBRWhCQyxPQUFHLDRCQUZhO0FBR2hCLE9BQUc7QUFIYSxDQUFwQjtBQUtBLElBQUlDLFlBQVksQ0FBaEI7QUFDQSxJQUFJQyxlQUFlLENBQW5COztBQUdBOzs7Ozs7Ozs7O0FBVUFDLFFBQVFU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SixDQUFQO0FBQ0ExQyxVQUFFOEMsSUFBRixDQUFPRixDQUFQOztBQUVBLFlBQUlHLFdBQVcvQyxFQUFFZ0QsSUFBRixDQUFPLEVBQVAsQ0FBZjs7QUFFQSxZQUFJRCxhQUFhNUMsWUFBakIsRUFBK0I7QUFDM0JBLDJCQUFlNEMsUUFBZjtBQUNBN0Msd0JBQVksQ0FBWjtBQUNIOztBQUVEMkIsaUJBQVNsQyxPQUFPcUMsSUFBUCxDQUFZOUIsV0FBWixDQUFUO0FBQ0EyQixpQkFBU2pDLE9BQU9xQyxPQUFQLENBQWVKLE1BQWYsRUFBdUJQLFlBQVksRUFBbkMsRUFBdUMsR0FBdkMsQ0FBVDtBQUNBdEIsVUFBRThDLElBQUYsQ0FBT2pCLE1BQVA7QUFDQWYsY0FBTWQsRUFBRWdELElBQUYsQ0FBTyxFQUFQLENBQU47QUFDSDs7QUFFRCxXQUFPbEMsR0FBUDtBQUNILENBaEZEIiwiZmlsZSI6InJhbmRvbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICog6ZqP5py65pWwXG4gKiBAYXV0aG9yIHlkci5tZVxuICogQGNyZWF0ZSAyMDE0LTEwLTMwIDE5OjAzXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGF0byA9IHJlcXVpcmUoJy4vZGF0by5qcycpO1xudmFyIG51bWJlciA9IHJlcXVpcmUoJy4vbnVtYmVyLmpzJyk7XG52YXIgc3RyaW5nID0gcmVxdWlyZSgnLi9zdHJpbmcuanMnKTtcbnZhciBhbGxvY2F0aW9uID0gcmVxdWlyZSgnLi9hbGxvY2F0aW9uLmpzJyk7XG52YXIgcmVnRXhpc3QgPSAvW2FBMF0vZztcbnZhciBkaWN0aW9uYXJ5TWFwID0ge1xuICAgIGE6ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicsXG4gICAgQTogJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJyxcbiAgICAwOiAnMDEyMzQ1Njc4OSdcbn07XG52YXIgZ3VpZEluZGV4ID0gMDtcbnZhciBsYXN0R3VpZFRpbWUgPSAwO1xuXG5cbi8qKlxuICog6ZqP5py65pWw5a2XXG4gKiBAcGFyYW0gW21pbj0wXSB7TnVtYmVyfSDmnIDlsI/lgLzvvIzpu5jorqQwXG4gKiBAcGFyYW0gW21heD0wXSB7TnVtYmVyfSDmnIDlpKflgLzvvIzpu5jorqQwXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICpcbiAqIEBleGFtcGxlXG4gKiByYW5kb20ubnVtYmVyKDEsIDMpO1xuICogLy8gPT4gMSBvciAyIG9yIDNcbiAqL1xuZXhwb3J0cy5udW1iZXIgPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICB2YXIgdGVtcDtcblxuICAgIG1pbiA9IG51bWJlci5wYXJzZUludChtaW4sIDApO1xuICAgIG1heCA9IG51bWJlci5wYXJzZUludChtYXgsIDApO1xuXG4gICAgaWYgKG1pbiA9PT0gbWF4KSB7XG4gICAgICAgIHJldHVybiBtaW47XG4gICAgfVxuXG4gICAgaWYgKG1pbiA+IG1heCkge1xuICAgICAgICB0ZW1wID0gbWluO1xuICAgICAgICBtaW4gPSBtYXg7XG4gICAgICAgIG1heCA9IHRlbXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG59O1xuXG5cbi8qKlxuICog6ZqP5py65a2X56ym5LiyXG4gKiBAcGFyYW0gW2xlbmd0aD02XSB7TnVtYmVyfSDpmo/mnLrlrZfnrKbkuLLplb/luqZcbiAqIEBwYXJhbSBbZGljdGlvbmFyeT0nYUEwJ10ge1N0cmluZ30g5a2X5YW4XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIOWtl+WFuOWvueW6lOWFs+ezu1xuICogLy8gYSA9PiBhLXpcbiAqIC8vIEEgPT4gQS1aXG4gKiAvLyAwID0+IDAtOVxuICogLy8g5YW25LuW5a2X56ymXG4gKiByYW5kb20uc3RyaW5nKDYsICdhJyk7XG4gKiAvLyA9PiBhYmNkZWZcbiAqIHJhbmRvbS5zdHJpbmcoNiwgJyFAIyQlXiYqKClfKycpO1xuICogLy8gPT4gQCopJiheXG4gKi9cbmV4cG9ydHMuc3RyaW5nID0gZnVuY3Rpb24gKGxlbmd0aCwgZGljdGlvbmFyeSkge1xuICAgIHZhciByZXQgPSAnJztcbiAgICB2YXIgcG9vbCA9ICcnO1xuICAgIHZhciBtYXg7XG5cbiAgICBsZW5ndGggPSBNYXRoLmFicyhudW1iZXIucGFyc2VJbnQobGVuZ3RoLCA2KSk7XG4gICAgZGljdGlvbmFyeSA9IFN0cmluZyhkaWN0aW9uYXJ5IHx8ICdhJyk7XG5cbiAgICBpZiAoZGljdGlvbmFyeS5pbmRleE9mKCdhJykgPiAtMSkge1xuICAgICAgICBwb29sICs9IGRpY3Rpb25hcnlNYXAuYTtcbiAgICB9XG5cbiAgICBpZiAoZGljdGlvbmFyeS5pbmRleE9mKCdBJykgPiAtMSkge1xuICAgICAgICBwb29sICs9IGRpY3Rpb25hcnlNYXAuQTtcbiAgICB9XG5cbiAgICBpZiAoZGljdGlvbmFyeS5pbmRleE9mKCcwJykgPiAtMSkge1xuICAgICAgICBwb29sICs9IGRpY3Rpb25hcnlNYXBbMF07XG4gICAgfVxuXG4gICAgcG9vbCArPSBkaWN0aW9uYXJ5LnJlcGxhY2UocmVnRXhpc3QsICcnKTtcbiAgICBtYXggPSBwb29sLmxlbmd0aCAtIDE7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgcmV0ICs9IHBvb2xbZXhwb3J0cy5udW1iZXIoMCwgbWF4KV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cblxuLyoqXG4gKiDmnIDnn60gMTYg5L2N6ZW/5bqm55qE6ZqP5py65LiN6YeN5aSN5a2X56ym5LiyXG4gKiBAcGFyYW0gW2lzVGltZVN0YW1wPWZhbHNlXSDmmK/lkKbml7bpl7TmiLPlvaLlvI9cbiAqIEBwYXJhbSBbbWF4TGVuZ3RoPTE2XSDmnIDlpKfplb/luqZcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuZ3VpZCA9IGZ1bmN0aW9uIChpc1RpbWVTdGFtcCwgbWF4TGVuZ3RoKSB7XG4gICAgdmFyIGEgPSBbXTtcbiAgICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIHJldCA9ICcnO1xuICAgIHZhciBub3cgPSBkLmdldFRpbWUoKTtcbiAgICB2YXIgYXJncyA9IGFsbG9jYXRpb24uYXJncyhhcmd1bWVudHMpO1xuICAgIHZhciBzdWZmaXggPSAnJztcbiAgICB2YXIgbWluTGVuZ3RoID0gMTY7XG5cbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGlzVGltZVN0YW1wID0gZmFsc2U7XG4gICAgICAgICAgICBtYXhMZW5ndGggPSBtaW5MZW5ndGg7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAvLyBndWlkKGlzVGltZVN0YW1wKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gbWluTGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZ3VpZChtYXhMZW5ndGgpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaXNUaW1lU3RhbXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBtYXhMZW5ndGggPSBhcmdzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbWF4TGVuZ3RoID0gTWF0aC5tYXgobWF4TGVuZ3RoLCBtaW5MZW5ndGgpO1xuXG4gICAgaWYgKGlzVGltZVN0YW1wKSB7XG4gICAgICAgIGlmIChub3cgIT09IGxhc3RHdWlkVGltZSkge1xuICAgICAgICAgICAgbGFzdEd1aWRUaW1lID0gbm93O1xuICAgICAgICAgICAgZ3VpZEluZGV4ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vdyA9IFN0cmluZyhub3cpO1xuICAgICAgICB2YXIgdGltZVN0YW1wTGVuZ3RoID0gbm93Lmxlbmd0aDtcbiAgICAgICAgc3VmZml4ID0gbnVtYmVyLnRvNjIoZ3VpZEluZGV4KyspO1xuICAgICAgICBzdWZmaXggPSBzdHJpbmcucGFkTGVmdChzdWZmaXgsIG1heExlbmd0aCAtIHRpbWVTdGFtcExlbmd0aCwgJzAnKTtcbiAgICAgICAgcmV0ID0gbm93ICsgc3VmZml4O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIDRcbiAgICAgICAgdmFyIFkgPSBzdHJpbmcucGFkTGVmdChkLmdldEZ1bGxZZWFyKCksIDQsICcwJyk7XG4gICAgICAgIC8vIDJcbiAgICAgICAgdmFyIE0gPSBzdHJpbmcucGFkTGVmdChkLmdldE1vbnRoKCkgKyAxLCAyLCAnMCcpO1xuICAgICAgICAvLyAyXG4gICAgICAgIHZhciBEID0gc3RyaW5nLnBhZExlZnQoZC5nZXREYXRlKCksIDIsICcwJyk7XG4gICAgICAgIC8vIDJcbiAgICAgICAgdmFyIEggPSBzdHJpbmcucGFkTGVmdChkLmdldEhvdXJzKCksIDIsICcwJyk7XG4gICAgICAgIC8vIDJcbiAgICAgICAgdmFyIEkgPSBzdHJpbmcucGFkTGVmdChkLmdldE1pbnV0ZXMoKSwgMiwgJzAnKTtcbiAgICAgICAgLy8gMlxuICAgICAgICB2YXIgUyA9IHN0cmluZy5wYWRMZWZ0KGQuZ2V0U2Vjb25kcygpLCAyLCAnMCcpO1xuICAgICAgICAvLy8vIDNcbiAgICAgICAgLy92YXIgQyA9IHN0cmluZy5wYWRMZWZ0KGQuZ2V0TWlsbGlzZWNvbmRzKCksIDMsICcwJyk7XG4gICAgICAgIC8vLy8gOVxuICAgICAgICAvL3ZhciBOID0gc3RyaW5nLnBhZExlZnQocHJvY2Vzcy5ocnRpbWUoKVsxXSwgOSwgJzAnKTtcblxuICAgICAgICBhLnB1c2goWSk7XG4gICAgICAgIGEucHVzaChNKTtcbiAgICAgICAgYS5wdXNoKEQpO1xuICAgICAgICBhLnB1c2goSCk7XG4gICAgICAgIGEucHVzaChJKTtcbiAgICAgICAgYS5wdXNoKFMpO1xuXG4gICAgICAgIHZhciBkYXRlVGltZSA9IGEuam9pbignJyk7XG5cbiAgICAgICAgaWYgKGRhdGVUaW1lICE9PSBsYXN0R3VpZFRpbWUpIHtcbiAgICAgICAgICAgIGxhc3RHdWlkVGltZSA9IGRhdGVUaW1lO1xuICAgICAgICAgICAgZ3VpZEluZGV4ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN1ZmZpeCA9IG51bWJlci50bzYyKGd1aWRJbmRleCsrKTtcbiAgICAgICAgc3VmZml4ID0gc3RyaW5nLnBhZExlZnQoc3VmZml4LCBtYXhMZW5ndGggLSAxNCwgJzAnKTtcbiAgICAgICAgYS5wdXNoKHN1ZmZpeCk7XG4gICAgICAgIHJldCA9IGEuam9pbignJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbiJdfQ==