/**
 * emitter
 * @author ydr.me
 * @create 2015-11-14 12:32
 */

'use strict';

var allocation = require('./allocation.js');
var dato = require('./dato.js');
var typeis = require('./typeis.js');
var klass = require('./class.js');

var regSpace = /\s+/g;
var emitterId = 0;

var Emitter = klass.create({
    /**
     * @constructor Emitter
     * @type {Function}
     */
    constructor: function constructor() {
        var the = this;

        // 监听的事件 map
        the._emitterListener = {};
        // 全局事件监听列表
        the._emitterCallbacks = [];
        // 监听的事件长度
        the._emitterLimit = 999;
        the.className = 'emitter';
    },
    /**
     * 添加事件回调
     * @method on
     * @param {String} eventType 事件类型，多个事件类型使用空格分开
     * @param {Function} listener 事件回调
     * @returns {Emitter}
     *
     * @example
     * var emitter = new Emitter();
     * emitter.on('hi', fn);
     */
    on: function on(eventType, listener) {
        var the = this;
        var args = allocation.args(arguments);

        if (args.length === 1) {
            listener = args[0];
            eventType = null;
        }

        if (!typeis.function(listener)) {
            return the;
        }

        if (!eventType) {
            the._emitterCallbacks.push(listener);
            return the;
        }

        _middleware(eventType, function (et) {
            if (!the._emitterListener[et]) {
                the._emitterListener[et] = [];
            }

            if (the._emitterListener[et].length === the._emitterLimit) {
                throw new Error('instance event `' + et + '` pool is full as ' + this._emitterLimit);
            }

            if (typeis.function(listener)) {
                the._emitterListener[et].push(listener);
                the.emit('newListener', eventType);
            }
        });

        return the;
    },

    /**
     * 添加事件触发前事件
     * @param eventType {String} 事件，只有 emit beforesomeevent 的事件才可以被监听
     * @param listener {Function} 事件回调
     * @returns {Emitter}
     */
    before: function before(eventType, listener) {
        return this.on('before' + eventType, listener);
    },

    /**
     * 添加事件触发后事件
     * @param eventType {String} 事件，只有 emit beforesomeevent 的事件才可以被监听
     * @param listener {Function} 事件回调
     * @returns {Emitter}
     */
    after: function after(eventType, listener) {
        return this.on('after' + eventType, listener);
    },

    /**
     * 移除事件回调
     * @method un
     * @param {String} eventType 事件类型，多个事件类型使用空格分开
     * @param {Function} [listener] 事件回调，缺省时将移除该事件类型上的所有事件回调
     * @returns {Emitter}
     *
     * @example
     * var emitter = new Emitter();
     * emitter.un('hi', fn);
     * emitter.un('hi');
     */
    un: function un(eventType, listener) {
        var the = this;

        _middleware(eventType, function (et) {
            if (the._emitterListener[et] && listener) {
                dato.each(the._emitterListener, function (index, _listener) {
                    if (listener === _listener) {
                        the._emitterListener.splice(index, 1);
                        the.emit('removeListener', eventType);
                        return false;
                    }
                });
            } else {
                the._emitterListener = [];
            }
        });

        return the;
    },

    /**
     * 事件触发，只要有一个事件返回false，那么就返回false，非链式调用
     * @method emit
     * @param {String} [eventType] 事件类型，多个事件类型使用空格分开
     * @returns {*} 函数执行结果
     *
     * @example
     * var emitter = new Emitter();
     * emitter.emit('hi', 1, 2, 3);
     * emitter.emit('hi', 1, 2);
     * emitter.emit('hi', 1);
     * emitter.emit('hi');
     *
     * // 为 before* 的事件可以被派发到 before 回调
     * // 为 after* 的开头的事件可以被派发到 after 回调
     */
    emit: function emit(eventType /*arguments*/) {
        var the = this;
        var emitArgs = dato.toArray(arguments).slice(1);
        var ret = true;

        _middleware(eventType, function (et) {
            var time = Date.now();

            dato.each(the._emitterCallbacks, function (index, callback) {
                the.alienEmitter = {
                    type: et,
                    timestamp: time,
                    id: emitterId++
                };

                callback.apply(the, emitArgs);
            });

            if (the._emitterListener[et]) {
                dato.each(the._emitterListener[et], function (index, listener) {
                    the.alienEmitter = {
                        type: et,
                        timestamp: time,
                        id: emitterId++
                    };

                    if (listener.apply(the, emitArgs) === false) {
                        ret = false;
                    }
                });
            }
        });

        return ret;
    }
});

/**
 * 事件传输
 * @param source {Object} 事件来源
 * @param target {Object} 事件目标
 * @param [types] {Array} 允许和禁止的事件类型
 *
 * @example
 * name 与 ['name'] 匹配
 * name 与 ['!name'] 不匹配
 */
Emitter.pipe = function (source, target, types) {
    source.on(function () {
        var type = this.alienEmitter.type;

        if (_matches(type, types)) {
            var args = dato.toArray(arguments);

            args.unshift(this.alienEmitter.type);
            target.emit.apply(target, args);
        }
    });
};

module.exports = Emitter;

/**
 * 中间件，处理事件分发
 * @param {String} eventTypes 事件类型
 * @param {Function} callback 回调处理
 * @private
 */
function _middleware(eventTypes, callback) {
    dato.each(eventTypes.trim().split(regSpace), function (index, eventType) {
        callback(eventType);
    });
}

/**
 * 判断是否匹配
 * @param name {String} 待匹配字符串
 * @param [names] {Array} 被匹配字符串数组
 * @returns {boolean}
 * @private
 */
function _matches(name, names) {
    names = names || [];

    if (!names.length) {
        return true;
    }

    var matched = true;

    dato.each(names, function (index, _name) {
        var flag = _name[0];

        // !name
        if (flag === '!') {
            matched = true;

            if (name === _name.slice(1)) {
                matched = false;
                return false;
            }
        }
        // name
        else {
                matched = false;

                if (name === _name) {
                    matched = true;
                    return false;
                }
            }
    });

    return matched;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWxpZGF0b3IvbGlicy9lbWl0dGVyLmpzIl0sIm5hbWVzIjpbImFsbG9jYXRpb24iLCJyZXF1aXJlIiwiZGF0byIsInR5cGVpcyIsImtsYXNzIiwicmVnU3BhY2UiLCJlbWl0dGVySWQiLCJFbWl0dGVyIiwiY3JlYXRlIiwiY29uc3RydWN0b3IiLCJ0aGUiLCJfZW1pdHRlckxpc3RlbmVyIiwiX2VtaXR0ZXJDYWxsYmFja3MiLCJfZW1pdHRlckxpbWl0IiwiY2xhc3NOYW1lIiwib24iLCJldmVudFR5cGUiLCJsaXN0ZW5lciIsImFyZ3MiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJmdW5jdGlvbiIsInB1c2giLCJfbWlkZGxld2FyZSIsImV0IiwiRXJyb3IiLCJlbWl0IiwiYmVmb3JlIiwiYWZ0ZXIiLCJ1biIsImVhY2giLCJpbmRleCIsIl9saXN0ZW5lciIsInNwbGljZSIsImVtaXRBcmdzIiwidG9BcnJheSIsInNsaWNlIiwicmV0IiwidGltZSIsIkRhdGUiLCJub3ciLCJjYWxsYmFjayIsImFsaWVuRW1pdHRlciIsInR5cGUiLCJ0aW1lc3RhbXAiLCJpZCIsImFwcGx5IiwicGlwZSIsInNvdXJjZSIsInRhcmdldCIsInR5cGVzIiwiX21hdGNoZXMiLCJ1bnNoaWZ0IiwibW9kdWxlIiwiZXhwb3J0cyIsImV2ZW50VHlwZXMiLCJ0cmltIiwic3BsaXQiLCJuYW1lIiwibmFtZXMiLCJtYXRjaGVkIiwiX25hbWUiLCJmbGFnIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBT0E7O0FBRUEsSUFBSUEsYUFBYUMsUUFBUSxpQkFBUixDQUFqQjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsV0FBUixDQUFYO0FBQ0EsSUFBSUUsU0FBU0YsUUFBUSxhQUFSLENBQWI7QUFDQSxJQUFJRyxRQUFRSCxRQUFRLFlBQVIsQ0FBWjs7QUFFQSxJQUFJSSxXQUFXLE1BQWY7QUFDQSxJQUFJQyxZQUFZLENBQWhCOztBQUdBLElBQUlDLFVBQVVILE1BQU1JLE1B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LENBQU4sQ0FBWDs7QUFFQTtBQUNBLFlBQUlDLFNBQVMsR0FBYixFQUFrQjtBQUNkRixzQkFBVSxJQUFWOztBQUVBLGdCQUFJRixTQUFTRyxNQUFNekIsS0FBTixDQUFZLENBQVosQ0FBYixFQUE2QjtBQUN6QndCLDBCQUFVLEtBQVY7QUFDQSx1QkFBTyxLQUFQO0FBQ0g7QUFDSjtBQUNEO0FBUkEsYUFTSztBQUNEQSwwQkFBVSxLQUFWOztBQUVBLG9CQUFJRixTQUFTRyxLQUFiLEVBQW9CO0FBQ2hCRCw4QkFBVSxJQUFWO0FBQ0EsMkJBQU8sS0FBUDtBQUNIO0FBQ0o7QUFDSixLQXJCRDs7QUF1QkEsV0FBT0EsT0FBUDtBQUNIIiwiZmlsZSI6ImVtaXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGVtaXR0ZXJcbiAqIEBhdXRob3IgeWRyLm1lXG4gKiBAY3JlYXRlIDIwMTUtMTEtMTQgMTI6MzJcbiAqL1xuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGFsbG9jYXRpb24gPSByZXF1aXJlKCcuL2FsbG9jYXRpb24uanMnKTtcbnZhciBkYXRvID0gcmVxdWlyZSgnLi9kYXRvLmpzJyk7XG52YXIgdHlwZWlzID0gcmVxdWlyZSgnLi90eXBlaXMuanMnKTtcbnZhciBrbGFzcyA9IHJlcXVpcmUoJy4vY2xhc3MuanMnKTtcblxudmFyIHJlZ1NwYWNlID0gL1xccysvZztcbnZhciBlbWl0dGVySWQgPSAwO1xuXG5cbnZhciBFbWl0dGVyID0ga2xhc3MuY3JlYXRlKHtcbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3IgRW1pdHRlclxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhlID0gdGhpcztcblxuICAgICAgICAvLyDnm5HlkKznmoTkuovku7YgbWFwXG4gICAgICAgIHRoZS5fZW1pdHRlckxpc3RlbmVyID0ge307XG4gICAgICAgIC8vIOWFqOWxgOS6i+S7tuebkeWQrOWIl+ihqFxuICAgICAgICB0aGUuX2VtaXR0ZXJDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgLy8g55uR5ZCs55qE5LqL5Lu26ZW/5bqmXG4gICAgICAgIHRoZS5fZW1pdHRlckxpbWl0ID0gOTk5O1xuICAgICAgICB0aGUuY2xhc3NOYW1lID0gJ2VtaXR0ZXInO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5re75Yqg5LqL5Lu25Zue6LCDXG4gICAgICogQG1ldGhvZCBvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGUg5LqL5Lu257G75Z6L77yM5aSa5Liq5LqL5Lu257G75Z6L5L2/55So56m65qC85YiG5byAXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIg5LqL5Lu25Zue6LCDXG4gICAgICogQHJldHVybnMge0VtaXR0ZXJ9XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICAgKiBlbWl0dGVyLm9uKCdoaScsIGZuKTtcbiAgICAgKi9cbiAgICBvbjogZnVuY3Rpb24gKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIHRoZSA9IHRoaXM7XG4gICAgICAgIHZhciBhcmdzID0gYWxsb2NhdGlvbi5hcmdzKGFyZ3VtZW50cyk7XG5cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IGFyZ3NbMF07XG4gICAgICAgICAgICBldmVudFR5cGUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0eXBlaXMuZnVuY3Rpb24obGlzdGVuZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFldmVudFR5cGUpIHtcbiAgICAgICAgICAgIHRoZS5fZW1pdHRlckNhbGxiYWNrcy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIHJldHVybiB0aGU7XG4gICAgICAgIH1cblxuICAgICAgICBfbWlkZGxld2FyZShldmVudFR5cGUsIGZ1bmN0aW9uIChldCkge1xuICAgICAgICAgICAgaWYgKCF0aGUuX2VtaXR0ZXJMaXN0ZW5lcltldF0pIHtcbiAgICAgICAgICAgICAgICB0aGUuX2VtaXR0ZXJMaXN0ZW5lcltldF0gPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoZS5fZW1pdHRlckxpc3RlbmVyW2V0XS5sZW5ndGggPT09IHRoZS5fZW1pdHRlckxpbWl0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnN0YW5jZSBldmVudCBgJyArIGV0ICsgJ2AgcG9vbCBpcyBmdWxsIGFzICcgKyB0aGlzLl9lbWl0dGVyTGltaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZWlzLmZ1bmN0aW9uKGxpc3RlbmVyKSkge1xuICAgICAgICAgICAgICAgIHRoZS5fZW1pdHRlckxpc3RlbmVyW2V0XS5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB0aGUuZW1pdCgnbmV3TGlzdGVuZXInLCBldmVudFR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhlO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIOa3u+WKoOS6i+S7tuinpuWPkeWJjeS6i+S7tlxuICAgICAqIEBwYXJhbSBldmVudFR5cGUge1N0cmluZ30g5LqL5Lu277yM5Y+q5pyJIGVtaXQgYmVmb3Jlc29tZWV2ZW50IOeahOS6i+S7tuaJjeWPr+S7peiiq+ebkeWQrFxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciB7RnVuY3Rpb259IOS6i+S7tuWbnuiwg1xuICAgICAqIEByZXR1cm5zIHtFbWl0dGVyfVxuICAgICAqL1xuICAgIGJlZm9yZTogZnVuY3Rpb24gKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub24oJ2JlZm9yZScgKyBldmVudFR5cGUsIGxpc3RlbmVyKTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiDmt7vliqDkuovku7bop6blj5HlkI7kuovku7ZcbiAgICAgKiBAcGFyYW0gZXZlbnRUeXBlIHtTdHJpbmd9IOS6i+S7tu+8jOWPquaciSBlbWl0IGJlZm9yZXNvbWVldmVudCDnmoTkuovku7bmiY3lj6/ku6Xooqvnm5HlkKxcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIge0Z1bmN0aW9ufSDkuovku7blm57osINcbiAgICAgKiBAcmV0dXJucyB7RW1pdHRlcn1cbiAgICAgKi9cbiAgICBhZnRlcjogZnVuY3Rpb24gKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub24oJ2FmdGVyJyArIGV2ZW50VHlwZSwgbGlzdGVuZXIpO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIOenu+mZpOS6i+S7tuWbnuiwg1xuICAgICAqIEBtZXRob2QgdW5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlIOS6i+S7tuexu+Wei++8jOWkmuS4quS6i+S7tuexu+Wei+S9v+eUqOepuuagvOWIhuW8gFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtsaXN0ZW5lcl0g5LqL5Lu25Zue6LCD77yM57y655yB5pe25bCG56e76Zmk6K+l5LqL5Lu257G75Z6L5LiK55qE5omA5pyJ5LqL5Lu25Zue6LCDXG4gICAgICogQHJldHVybnMge0VtaXR0ZXJ9XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICAgKiBlbWl0dGVyLnVuKCdoaScsIGZuKTtcbiAgICAgKiBlbWl0dGVyLnVuKCdoaScpO1xuICAgICAqL1xuICAgIHVuOiBmdW5jdGlvbiAoZXZlbnRUeXBlLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgdGhlID0gdGhpcztcblxuICAgICAgICBfbWlkZGxld2FyZShldmVudFR5cGUsIGZ1bmN0aW9uIChldCkge1xuICAgICAgICAgICAgaWYgKHRoZS5fZW1pdHRlckxpc3RlbmVyW2V0XSAmJiBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGRhdG8uZWFjaCh0aGUuX2VtaXR0ZXJMaXN0ZW5lciwgZnVuY3Rpb24gKGluZGV4LCBfbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyID09PSBfbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZS5fZW1pdHRlckxpc3RlbmVyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGUuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCBldmVudFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZS5fZW1pdHRlckxpc3RlbmVyID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGU7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICog5LqL5Lu26Kem5Y+R77yM5Y+q6KaB5pyJ5LiA5Liq5LqL5Lu26L+U5ZueZmFsc2XvvIzpgqPkuYjlsLHov5Tlm55mYWxzZe+8jOmdnumTvuW8j+iwg+eUqFxuICAgICAqIEBtZXRob2QgZW1pdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbZXZlbnRUeXBlXSDkuovku7bnsbvlnovvvIzlpJrkuKrkuovku7bnsbvlnovkvb/nlKjnqbrmoLzliIblvIBcbiAgICAgKiBAcmV0dXJucyB7Kn0g5Ye95pWw5omn6KGM57uT5p6cXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICAgKiBlbWl0dGVyLmVtaXQoJ2hpJywgMSwgMiwgMyk7XG4gICAgICogZW1pdHRlci5lbWl0KCdoaScsIDEsIDIpO1xuICAgICAqIGVtaXR0ZXIuZW1pdCgnaGknLCAxKTtcbiAgICAgKiBlbWl0dGVyLmVtaXQoJ2hpJyk7XG4gICAgICpcbiAgICAgKiAvLyDkuLogYmVmb3JlKiDnmoTkuovku7blj6/ku6XooqvmtL7lj5HliLAgYmVmb3JlIOWbnuiwg1xuICAgICAqIC8vIOS4uiBhZnRlciog55qE5byA5aS055qE5LqL5Lu25Y+v5Lul6KKr5rS+5Y+R5YiwIGFmdGVyIOWbnuiwg1xuICAgICAqL1xuICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudFR5cGUvKmFyZ3VtZW50cyovKSB7XG4gICAgICAgIHZhciB0aGUgPSB0aGlzO1xuICAgICAgICB2YXIgZW1pdEFyZ3MgPSBkYXRvLnRvQXJyYXkoYXJndW1lbnRzKS5zbGljZSgxKTtcbiAgICAgICAgdmFyIHJldCA9IHRydWU7XG5cbiAgICAgICAgX21pZGRsZXdhcmUoZXZlbnRUeXBlLCBmdW5jdGlvbiAoZXQpIHtcbiAgICAgICAgICAgIHZhciB0aW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgZGF0by5lYWNoKHRoZS5fZW1pdHRlckNhbGxiYWNrcywgZnVuY3Rpb24gKGluZGV4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRoZS5hbGllbkVtaXR0ZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGV0LFxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWUsXG4gICAgICAgICAgICAgICAgICAgIGlkOiBlbWl0dGVySWQrK1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGUsIGVtaXRBcmdzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhlLl9lbWl0dGVyTGlzdGVuZXJbZXRdKSB7XG4gICAgICAgICAgICAgICAgZGF0by5lYWNoKHRoZS5fZW1pdHRlckxpc3RlbmVyW2V0XSwgZnVuY3Rpb24gKGluZGV4LCBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICB0aGUuYWxpZW5FbWl0dGVyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZW1pdHRlcklkKytcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIuYXBwbHkodGhlLCBlbWl0QXJncykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn0pO1xuXG5cbi8qKlxuICog5LqL5Lu25Lyg6L6TXG4gKiBAcGFyYW0gc291cmNlIHtPYmplY3R9IOS6i+S7tuadpea6kFxuICogQHBhcmFtIHRhcmdldCB7T2JqZWN0fSDkuovku7bnm67moIdcbiAqIEBwYXJhbSBbdHlwZXNdIHtBcnJheX0g5YWB6K645ZKM56aB5q2i55qE5LqL5Lu257G75Z6LXG4gKlxuICogQGV4YW1wbGVcbiAqIG5hbWUg5LiOIFsnbmFtZSddIOWMuemFjVxuICogbmFtZSDkuI4gWychbmFtZSddIOS4jeWMuemFjVxuICovXG5FbWl0dGVyLnBpcGUgPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQsIHR5cGVzKSB7XG4gICAgc291cmNlLm9uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0aGlzLmFsaWVuRW1pdHRlci50eXBlO1xuXG4gICAgICAgIGlmIChfbWF0Y2hlcyh0eXBlLCB0eXBlcykpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gZGF0by50b0FycmF5KGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGFyZ3MudW5zaGlmdCh0aGlzLmFsaWVuRW1pdHRlci50eXBlKTtcbiAgICAgICAgICAgIHRhcmdldC5lbWl0LmFwcGx5KHRhcmdldCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIOS4remXtOS7tu+8jOWkhOeQhuS6i+S7tuWIhuWPkVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50VHlwZXMg5LqL5Lu257G75Z6LXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayDlm57osIPlpITnkIZcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9taWRkbGV3YXJlKGV2ZW50VHlwZXMsIGNhbGxiYWNrKSB7XG4gICAgZGF0by5lYWNoKGV2ZW50VHlwZXMudHJpbSgpLnNwbGl0KHJlZ1NwYWNlKSwgZnVuY3Rpb24gKGluZGV4LCBldmVudFR5cGUpIHtcbiAgICAgICAgY2FsbGJhY2soZXZlbnRUeXBlKTtcbiAgICB9KTtcbn1cblxuXG4vKipcbiAqIOWIpOaWreaYr+WQpuWMuemFjVxuICogQHBhcmFtIG5hbWUge1N0cmluZ30g5b6F5Yy56YWN5a2X56ym5LiyXG4gKiBAcGFyYW0gW25hbWVzXSB7QXJyYXl9IOiiq+WMuemFjeWtl+espuS4suaVsOe7hFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfbWF0Y2hlcyhuYW1lLCBuYW1lcykge1xuICAgIG5hbWVzID0gbmFtZXMgfHwgW107XG5cbiAgICBpZiAoIW5hbWVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgbWF0Y2hlZCA9IHRydWU7XG5cbiAgICBkYXRvLmVhY2gobmFtZXMsIGZ1bmN0aW9uIChpbmRleCwgX25hbWUpIHtcbiAgICAgICAgdmFyIGZsYWcgPSBfbmFtZVswXTtcblxuICAgICAgICAvLyAhbmFtZVxuICAgICAgICBpZiAoZmxhZyA9PT0gJyEnKSB7XG4gICAgICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKG5hbWUgPT09IF9uYW1lLnNsaWNlKDEpKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBuYW1lXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbWF0Y2hlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gX25hbWUpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtYXRjaGVkO1xufVxuXG5cbiJdfQ==