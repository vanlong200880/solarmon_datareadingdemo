/**
 * 表单验证
 * @author ydr.me
 * @create 2015-07-01 16:57
 * @update 2015-10-19 11:44:25
 */

'use strict';

var howdo = require('howdo');

var klass = require('./class.js');
var dato = require('./dato.js');
var typeis = require('./typeis.js');
var allocation = require('./allocation.js');
var string = require('./string.js');
var Emitter = require('./emitter.js');
var random = require('./random.js');

/**
 * @type {{}}
 * @exmaple
 * {
     *     // val 值
     *     // param 参数值
     *     // done 验证结束回调
     *     minLength: function (val, done, param0, param1, ...) {
     *        // done(null); done(null)表示没有错误
     *        // done('${path}的长度不足xx字符')
     *     }
     * }
 */
var validationMap = {};
var namespace = 'donkey-libs-validation';
var alienIndex = 0;
var defaults = {
    // true: 返回单个错误对象
    // false: 返回错误对象组成的数组
    // 浏览器端，默认为 false
    // 服务器端，默认为 true
    breakOnInvalid: typeof window === 'undefined',
    defaultMsg: '${1}不合法'
};
var Validation = klass.extends(Emitter).create({
    constructor: function constructor(options) {
        var the = this;

        the._options = dato.extend({}, defaults, options);
        the._validateList = [];
        the._validateIndexMap = {};
        the._aliasMap = {};
        the._msgMap = {};
        the._validationMap = {};
        the.className = 'validation';
    },

    /**
     * 为路径设置别名
     * @param path {String} 字段
     * @param [alias] {String} 别名
     * @returns {Validation}
     */
    setAlias: function setAlias(path, alias) {
        var the = this;

        if (typeis(path) === 'object') {
            dato.extend(the._aliasMap, path);
            return the;
        }

        the._aliasMap[path] = alias;
        return the;
    },

    /**
     * 获取字段别名
     * @param path
     * @returns {*}
     */
    getAlias: function getAlias(path) {
        return this._aliasMap[path];
    },

    /**
     * 重设验证消息
     * @param path
     * @param ruleName
     * @param msg
     * @returns {Validation}
     */
    setMsg: function setMsg(path, ruleName, msg) {
        var the = this;

        the._msgMap[path] = the._msgMap[path] || {};
        the._msgMap[path][ruleName] = msg;

        return the;
    },

    /**
     * 注册验证规则，按顺序执行验证
     * @param path {String} 字段
     * @param nameOrfn {String|Function} 验证规则，可以是静态规则，也可以添加规则
     * @returns {Validation}
     */
    addRule: function addRule(path, nameOrfn /*arguments*/) {
        var the = this;
        var args = allocation.args(arguments);
        var params = args.slice(2);
        var index = the._validateIndexMap[path];
        if (typeis.Undefined(index)) {
            index = the._validateIndexMap[path] = the._validateList.length;
            the._validateList.push({
                path: path,
                rules: []
            });
        }

        if (typeis.String(nameOrfn)) {
            var name = nameOrfn;

            if (!validationMap[name]) {
                throw 'can not found `' + name + '` validation';
            }

            the._validateList[index].rules.push({
                name: name,
                params: params,
                fn: validationMap[name],
                id: random.guid()
            });
        } else if (typeis.Function(nameOrfn)) {
            the._validateList[index].rules.push({
                name: namespace + alienIndex++,
                params: params,
                fn: nameOrfn,
                id: random.guid()
            });
        }

        return the;
    },

    /**
     * 获取字段的规则
     * @param [path] {String} 字段
     * @returns {Array}
     */
    getRules: function getRules(path) {
        var the = this;

        if (!path) {
            return the._validateList;
        }

        var rules = [];

        dato.each(the._validateList, function (i, validate) {
            if (path === validate.path) {
                rules = validate.rules;

                return false;
            }
        });

        return rules;
    },

    /**
     * 获取字段验证规则的参数
     * @param path {String} 字段
     * @param name {String} 规则名称
     * @returns {*|Array}}
     */
    getRuleParams: function getRuleParams(path, name) {
        var the = this;
        var rules = the.getRules(path);
        var rule;

        dato.each(rules, function (index, _rule) {
            if (_rule.name === name) {
                rule = _rule;
                return false;
            }
        });

        return rule && rule.params;
    },

    /**
     * 返回待验证的数据
     * @param [path] {String} 字段
     * @returns {*}
     */
    getData: function getData(path) {
        var the = this;

        if (typeis.Array(path)) {
            return dato.select(the.data, path);
        } else if (typeis.String(path)) {
            return the.data[path];
        }

        return the.data;
    },

    /**
     * 设置待验证的数据
     * @param path {String} 数据字段
     * @param val {*} 数据值
     * @returns {Validation}
     */
    setData: function setData(path, val) {
        var the = this;

        the.data[path] = val;

        return the;
    },

    /**
     * 执行单个验证
     * @param data {Object} 待验证的数据
     * @param [path] {String} 指定验证的字段
     * @param [callback] {Function} 验证回调
     * @returns {Validation}
     */
    validateOne: function validateOne(data, path, callback) {
        var args = allocation.args(arguments);

        if (!typeis.String(args[1])) {
            callback = args[1];
            path = Object.keys(data)[0];
        }

        return this.validateSome(data, path, callback);
    },

    /**
     * 执行部分验证
     * @param data {Object} 待验证的数据
     * @param [paths] {String} 指定验证的字段
     * @param [callback] {Function} 验证回调
     * @returns {Validation}
     */
    validateSome: function validateSome(data, paths, callback) {
        var the = this;
        var options = the._options;
        var path = '';
        var args = allocation.args(arguments);
        var pathMap = {};

        if (the._isValidating) {
            return the;
        }

        // validateSome(data, callback)
        if (!typeis.String(args[1]) && !typeis.Array(args[1])) {
            paths = Object.keys(data);
            callback = args[1];
        }

        paths = typeis.String(paths) ? [paths] : paths;

        dato.each(paths, function (index, path) {
            pathMap[path] = 1;
        });

        the._isValidating = true;
        the.data = data;
        var errorLength = 0;
        var firstInvlidError = null;
        var firstInvlidPath = null;

        howdo
        // 遍历验证顺序
        .each(the._validateList, function (i, item, next) {
            if (!(item.path in pathMap)) {
                return next();
            }

            the._validateOne(path = item.path, item.rules, function (err) {
                if (err) {
                    if (!firstInvlidPath) {
                        firstInvlidError = err;
                        firstInvlidPath = item.path;
                    }

                    errorLength++;
                }

                // 有错误 && 失败不断开
                if (err && !options.breakOnInvalid) {
                    err = null;
                }

                next(err);
            });
        }).follow(function () {
            the._isValidating = false;

            if (typeis.Function(callback)) {
                callback.call(the, firstInvlidError, firstInvlidPath);
            }
        });

        return the;
    },

    /**
     * @description Validate all data
     * @author thanh.bay
     * @param data {Object} 待验证的数据
     * @param [paths] {String} 指定验证的字段
     * @param [callback] {Function} 验证回调
     * @returns {Validation}
     */
    validateSomeAll: function validateSomeAll(data, paths, callback) {
        var the = this;
        var options = the._options;
        var path = '';
        var args = allocation.args(arguments);
        var pathMap = {};

        if (the._isValidating) {
            return the;
        }

        // validateSome(data, callback)
        if (!typeis.String(args[1]) && !typeis.Array(args[1])) {
            paths = Object.keys(data);
            callback = args[1];
        }

        paths = typeis.String(paths) ? [paths] : paths;

        dato.each(paths, function (index, path) {
            pathMap[path] = 1;
        });

        the._isValidating = true;
        the.data = data;
        var errorLength = 0;
        var invalidData = {};
        howdo
        // 遍历验证顺序
        .each(the._validateList, function (i, item, next) {
            if (!(item.path in pathMap)) {
                return next();
            }

            the._validateOne(path = item.path, item.rules, function (err) {
                if (err) {
                    invalidData[item.path] = err.message;
                    errorLength++;
                }

                // 有错误 && 失败不断开
                //&& !options.breakOnInvalid 
                // Do not break when invalid
                if (err) {
                    err = null;
                }

                next(err);
            });
        }).follow(function () {
            the._isValidating = false;
            if (typeis.Function(callback)) {
                callback.call(the, invalidData);
            }
        });
        return the;
    },

    /**
     * 执行全部验证
     * @param data {Object} 待验证的数据
     * @param [callback] {Function} 验证回调
     * @returns {Validation}
     */
    validateAll: function validateAll(data, callback) {
        var the = this;
        var paths = [];

        dato.each(the._validateList, function (index, item) {
            paths.push(item.path);
        });

        return the.validateSome(data, paths, callback);
    },

    /**
     * @description validate all data at the same time
     * @param data {Object} 待验证的数据
     * @param [callback] {Function} 验证回调
     * @returns {Validation}
     */
    FLValidateAll: function FLValidateAll(data, callback) {
        var the = this;
        var paths = [];

        dato.each(the._validateList, function (index, item) {
            paths.push(item.path);
        });

        return the.validateSomeAll(data, paths, callback);
    },

    /**
     * 表单验证
     * @param path {String} 字段
     * @param rules {Array} 验证规则
     * @param callback {Function} 验证回调
     * @private
     */
    _validateOne: function _validateOne(path, rules, callback) {
        var the = this;
        var options = the._options;
        var data = the.data;

        /**
         * 验证之前
         * @event beforeValidate
         * @param path {String} 字段
         */
        the.emit('beforeValidate', path);
        var currentRule;
        howdo
        // 遍历验证规则
        .each(rules, function (j, rule, next) {
            var args = [data[path], next];

            currentRule = rule;
            the.emit('validate', path, rule.name);
            args = args.concat(rule.params);
            the.path = path;
            rule.fn.apply(the, args);
        }).follow().try(function () {
            /**
             * 验证成功
             * @event valid
             * @param path {String} 字段
             */
            the.emit('valid', path);

            /**
             * 验证之后
             * @event validate
             * @param path {String} 字段
             */
            the.emit('validate', path);

            if (typeis.Function(callback)) {
                callback.call(the, null);
            }
        }).catch(function (err) {
            var overrideMsg = the._msgMap[path] && the._msgMap[path][currentRule.name];
            var args = [overrideMsg || err || options.defaultMsg, the.getAlias(path) || path];
            args = args.concat(currentRule.params);
            err = new TypeError(string.assign.apply(string, args));
            err.id = currentRule.id;

            /**
             * 验证失败
             * @event invalid
             * @param error {Object} 错误对象
             * @param path {String} 字段
             */
            the.emit('invalid', err, path);

            /**
             * 验证之后
             * @event validate
             * @param path {String} 字段
             */
            the.emit('validate', path);

            if (typeis.Function(callback)) {
                callback.call(the, err);
            }
        });
    }
});

/**
 * 注册静态验证规则
 * @param name {String} 规则名称
 * @param fn {Function} 规则回调
 *
 * @example
 * Validation.addRule('number', function (val, done, param0, param1, ...) {
 *    done(/^\d+$/.test(val) ? null : '${path}必须是数字');
 * });
 */
Validation.addRule = function (name, fn /*arguments*/) {
    validationMap[name] = fn;
};

/**
 * 返回静态规则
 * @param [name] {String} 规则名
 * @returns {Object|Function}
 */
Validation.getRule = function (name) {
    return name ? validationMap[name] : validationMap;
};

require('./_validation-rules.js')(Validation);
Validation.defaults = defaults;
module.exports = Validation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWxpZGF0b3IvbGlicy92YWxpZGF0aW9uLmpzIl0sIm5hbWVzIjpbImhvd2RvIiwicmVxdWlyZSIsImtsYXNzIiwiZGF0byIsInR5cGVpcyIsImFsbG9jYXRpb24iLCJzdHJpbmciLCJFbWl0dGVyIiwicmFuZG9tIiwidmFsaWRhdGlvbk1hcCIsIm5hbWVzcGFjZSIsImFsaWVuSW5kZXgiLCJkZWZhdWx0cyIsImJyZWFrT25JbnZhbGlkIiwid2luZG93IiwiZGVmYXVsdE1zZyIsIlZhbGlkYXRpb24iLCJleHRlbmRzIiwiY3JlYXRlIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwidGhlIiwiX29wdGlvbnMiLCJleHRlbmQiLCJfdmFsaWRhdGVMaXN0IiwiX3ZhbGlkYXRlSW5kZXhNYXAiLCJfYWxpYXNNYXAiLCJfbXNnTWFwIiwiX3ZhbGlkYXRpb25NYXAiLCJjbGFzc05hbWUiLCJzZXRBbGlhcyIsInBhdGgiLCJhbGlhcyIsImdldEFsaWFzIiwic2V0TXNnIiwicnVsZU5hbWUiLCJtc2ciLCJhZGRSdWxlIiwibmFtZU9yZm4iLCJhcmdzIiwiYXJndW1lbnRzIiwicGFyYW1zIiwic2xpY2UiLCJpbmRleCIsIlVuZGVmaW5lZCIsImxlbmd0aCIsInB1c2giLCJydWxlcyIsIlN0cmluZyIsIm5hbWUiLCJmbiIsImlkIiwiZ3VpZCIsIkZ1bmN0aW9uIiwiZ2V0UnVsZXMiLCJlYWNoIiwiaSIsInZhbGlkYXRlIiwiZ2V0UnVsZVBhcmFtcyIsInJ1bGUiLCJfcnVsZSIsImdldERhdGEiLCJBcnJheSIsInNlbGVjdCIsImRhdGEiLCJzZXREYXRhIiwidmFsIiwidmFsaWRhdGVPbmUiLCJjYWxsYmFjayIsIk9iamVjdCIsImtleXMiLCJ2YWxpZGF0ZVNvbWUiLCJwYXRocyIsInBhdGhNYXAiLCJfaXNWYWxpZGF0aW5nIiwiZXJyb3JMZW5ndGgiLCJmaXJzdEludmxpZEVycm9yIiwiZmlyc3RJbnZsaWRQYXRoIiwiaXRlbSIsIm5leHQiLCJfdmFsaWRhdGVPbmUiLCJlcnIiLCJmb2xsb3ciLCJjYWxsIiwidmFsaWRhdGVTb21lQWxsIiwiaW52YWxpZERhdGEiLCJtZXNzYWdlIiwidmFsaWRhdGVBbGwiLCJGTFZhbGlkYXRlQWxsIiwiZW1pdCIsImN1cnJlbnRSdWxlIiwiaiIsImNvbmNhdCIsImFwcGx5IiwidHJ5IiwiY2F0Y2giLCJvdmVycmlkZU1zZyIsIlR5cGVFcnJvciIsImFzc2lnbiIsImdldFJ1bGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQVFBOztBQUVBLElBQUlBLFFBQVFDLFFBQVEsT0FBUixDQUFaOztBQUVBLElBQUlDLFFBQVFELFFBQVEsWUFBUixDQUFaO0FBQ0EsSUFBSUUsT0FBT0YsUUFBUSxXQUFSLENBQVg7QUFDQSxJQUFJRyxTQUFTSCxRQUFRLGFBQVIsQ0FBYjtBQUNBLElBQUlJLGFBQWFKLFFBQVEsaUJBQVIsQ0FBakI7QUFDQSxJQUFJSyxTQUFTTCxRQUFRLGFBQVIsQ0FBYjtBQUNBLElBQUlNLFVBQVVOLFFBQVEsY0FBUixDQUFkO0FBQ0EsSUFBSU8sU0FBU1AsUUFBUSxhQUFSLENBQWI7O0FBR0E7Ozs7Ozs7Ozs7Ozs7QUFhQSxJQUFJUSxnQkFBZ0IsRUFBcEI7QUFDQSxJQUFJQyxZQUFZLHdCQUFoQjtBQUNBLElBQUlDLGFBQWEsQ0FBakI7QUFDQSxJQUFJQyxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsb0JBQWdCLE9BQU9DLE1BQVAsS0FBa0IsV0FMdkI7QUFNWEMsZ0JBQVk7QUFORCxDQUFmO0FBUUEsSUFBSUMsYUFBYWQsTUFBTWUsT0FBTixDQUFjVixPQUFkLEVBQXVCVyxNQUF2QixDQUE4QjtBQUMzQ0MsaUJBQWEscUJBQVVDLE9BQVYsRUFBbUI7QUFDNUIsWUFBSUMsTUFBTSxJQUFWOztBQUVBQSxZQUFJQyxRQUFKLEdBQWVuQixLQUFLb0IsTUFBTCxDQUFZLEVBQVosRUFBZ0JYLFFBQWhCLEVBQTBCUSxPQUExQixDQUFmO0FBQ0FDLFlBQUlHLGFB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QyxZQUFZdkMsRUFBckI7O0FBRUE7Ozs7OztBQU1BOUIsZ0JBQUlvRSxJQUFKLENBQVMsU0FBVCxFQUFvQlIsR0FBcEIsRUFBeUJsRCxJQUF6Qjs7QUFFQTs7Ozs7QUFLQVYsZ0JBQUlvRSxJQUFKLENBQVMsVUFBVCxFQUFxQjFELElBQXJCOztBQUVBLGdCQUFJM0IsT0FBT2lELFFBQVAsQ0FBZ0JlLFFBQWhCLENBQUosRUFBK0I7QUFDM0JBLHlCQUFTZSxJQUFULENBQWM5RCxHQUFkLEVBQW1CNEQsR0FBbkI7QUFDSDtBQUNKLFNBeERMO0FBeURIO0FBdGMwQyxDQUE5QixDQUFqQjs7QUF5Y0E7Ozs7Ozs7Ozs7QUFVQWpFLFdBQVdxQixPQUFYLEdBQXFCLFVBQVVZLElBQVYsRUFBZ0JDLEVBQWhCLENBQWtCLGFBQWxCLEVBQWlDO0FBQ2xEekMsa0JBQWN3QyxJQUFkLElBQXNCQyxFQUF0QjtBQUNILENBRkQ7O0FBS0E7Ozs7O0FBS0FsQyxXQUFXbUYsT0FBWCxHQUFxQixVQUFVbEQsSUFBVixFQUFnQjtBQUNqQyxXQUFPQSxPQUFPeEMsY0FBY3dDLElBQWQsQ0FBUCxHQUE2QnhDLGFBQXBDO0FBQ0gsQ0FGRDs7QUFJQVIsUUFBUSx3QkFBUixFQUFrQ2UsVUFBbEM7QUFDQUEsV0FBV0osUUFBWCxHQUFzQkEsUUFBdEI7QUFDQXdGLE9BQU9DLE9BQVAsR0FBaUJyRixVQUFqQiIsImZpbGUiOiJ2YWxpZGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiDooajljZXpqozor4FcbiAqIEBhdXRob3IgeWRyLm1lXG4gKiBAY3JlYXRlIDIwMTUtMDctMDEgMTY6NTdcbiAqIEB1cGRhdGUgMjAxNS0xMC0xOSAxMTo0NDoyNVxuICovXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaG93ZG8gPSByZXF1aXJlKCdob3dkbycpO1xuXG52YXIga2xhc3MgPSByZXF1aXJlKCcuL2NsYXNzLmpzJyk7XG52YXIgZGF0byA9IHJlcXVpcmUoJy4vZGF0by5qcycpO1xudmFyIHR5cGVpcyA9IHJlcXVpcmUoJy4vdHlwZWlzLmpzJyk7XG52YXIgYWxsb2NhdGlvbiA9IHJlcXVpcmUoJy4vYWxsb2NhdGlvbi5qcycpO1xudmFyIHN0cmluZyA9IHJlcXVpcmUoJy4vc3RyaW5nLmpzJyk7XG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlci5qcycpO1xudmFyIHJhbmRvbSA9IHJlcXVpcmUoJy4vcmFuZG9tLmpzJyk7XG5cblxuLyoqXG4gKiBAdHlwZSB7e319XG4gKiBAZXhtYXBsZVxuICoge1xuICAgICAqICAgICAvLyB2YWwg5YC8XG4gICAgICogICAgIC8vIHBhcmFtIOWPguaVsOWAvFxuICAgICAqICAgICAvLyBkb25lIOmqjOivgee7k+adn+Wbnuiwg1xuICAgICAqICAgICBtaW5MZW5ndGg6IGZ1bmN0aW9uICh2YWwsIGRvbmUsIHBhcmFtMCwgcGFyYW0xLCAuLi4pIHtcbiAgICAgKiAgICAgICAgLy8gZG9uZShudWxsKTsgZG9uZShudWxsKeihqOekuuayoeaciemUmeivr1xuICAgICAqICAgICAgICAvLyBkb25lKCcke3BhdGh955qE6ZW/5bqm5LiN6LazeHjlrZfnrKYnKVxuICAgICAqICAgICB9XG4gICAgICogfVxuICovXG52YXIgdmFsaWRhdGlvbk1hcCA9IHt9O1xudmFyIG5hbWVzcGFjZSA9ICdkb25rZXktbGlicy12YWxpZGF0aW9uJztcbnZhciBhbGllbkluZGV4ID0gMDtcbnZhciBkZWZhdWx0cyA9IHtcbiAgICAvLyB0cnVlOiDov5Tlm57ljZXkuKrplJnor6/lr7nosaFcbiAgICAvLyBmYWxzZTog6L+U5Zue6ZSZ6K+v5a+56LGh57uE5oiQ55qE5pWw57uEXG4gICAgLy8g5rWP6KeI5Zmo56uv77yM6buY6K6k5Li6IGZhbHNlXG4gICAgLy8g5pyN5Yqh5Zmo56uv77yM6buY6K6k5Li6IHRydWVcbiAgICBicmVha09uSW52YWxpZDogdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcsXG4gICAgZGVmYXVsdE1zZzogJyR7MX3kuI3lkIjms5UnXG59O1xudmFyIFZhbGlkYXRpb24gPSBrbGFzcy5leHRlbmRzKEVtaXR0ZXIpLmNyZWF0ZSh7XG4gICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aGUgPSB0aGlzO1xuXG4gICAgICAgIHRoZS5fb3B0aW9ucyA9IGRhdG8uZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIHRoZS5fdmFsaWRhdGVMaXN0ID0gW107XG4gICAgICAgIHRoZS5fdmFsaWRhdGVJbmRleE1hcCA9IHt9O1xuICAgICAgICB0aGUuX2FsaWFzTWFwID0ge307XG4gICAgICAgIHRoZS5fbXNnTWFwID0ge307XG4gICAgICAgIHRoZS5fdmFsaWRhdGlvbk1hcCA9IHt9O1xuICAgICAgICB0aGUuY2xhc3NOYW1lID0gJ3ZhbGlkYXRpb24nO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIOS4uui3r+W+hOiuvue9ruWIq+WQjVxuICAgICAqIEBwYXJhbSBwYXRoIHtTdHJpbmd9IOWtl+autVxuICAgICAqIEBwYXJhbSBbYWxpYXNdIHtTdHJpbmd9IOWIq+WQjVxuICAgICAqIEByZXR1cm5zIHtWYWxpZGF0aW9ufVxuICAgICAqL1xuICAgIHNldEFsaWFzOiBmdW5jdGlvbiAocGF0aCwgYWxpYXMpIHtcbiAgICAgICAgdmFyIHRoZSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHR5cGVpcyhwYXRoKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGRhdG8uZXh0ZW5kKHRoZS5fYWxpYXNNYXAsIHBhdGgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoZS5fYWxpYXNNYXBbcGF0aF0gPSBhbGlhcztcbiAgICAgICAgcmV0dXJuIHRoZTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiDojrflj5blrZfmrrXliKvlkI1cbiAgICAgKiBAcGFyYW0gcGF0aFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGdldEFsaWFzOiBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWxpYXNNYXBbcGF0aF07XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICog6YeN6K6+6aqM6K+B5raI5oGvXG4gICAgICogQHBhcmFtIHBhdGhcbiAgICAgKiBAcGFyYW0gcnVsZU5hbWVcbiAgICAgKiBAcGFyYW0gbXNnXG4gICAgICogQHJldHVybnMge1ZhbGlkYXRpb259XG4gICAgICovXG4gICAgc2V0TXNnOiBmdW5jdGlvbiAocGF0aCwgcnVsZU5hbWUsIG1zZykge1xuICAgICAgICB2YXIgdGhlID0gdGhpcztcblxuICAgICAgICB0aGUuX21zZ01hcFtwYXRoXSA9IHRoZS5fbXNnTWFwW3BhdGhdIHx8IHt9O1xuICAgICAgICB0aGUuX21zZ01hcFtwYXRoXVtydWxlTmFtZV0gPSBtc2c7XG5cbiAgICAgICAgcmV0dXJuIHRoZTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiDms6jlhozpqozor4Hop4TliJnvvIzmjInpobrluo/miafooYzpqozor4FcbiAgICAgKiBAcGFyYW0gcGF0aCB7U3RyaW5nfSDlrZfmrrVcbiAgICAgKiBAcGFyYW0gbmFtZU9yZm4ge1N0cmluZ3xGdW5jdGlvbn0g6aqM6K+B6KeE5YiZ77yM5Y+v5Lul5piv6Z2Z5oCB6KeE5YiZ77yM5Lmf5Y+v5Lul5re75Yqg6KeE5YiZXG4gICAgICogQHJldHVybnMge1ZhbGlkYXRpb259XG4gICAgICovXG4gICAgYWRkUnVsZTogZnVuY3Rpb24gKHBhdGgsIG5hbWVPcmZuLyphcmd1bWVudHMqLykge1xuICAgICAgICB2YXIgdGhlID0gdGhpcztcbiAgICAgICAgdmFyIGFyZ3MgPSBhbGxvY2F0aW9uLmFyZ3MoYXJndW1lbnRzKTtcbiAgICAgICAgdmFyIHBhcmFtcyA9IGFyZ3Muc2xpY2UoMik7XG4gICAgICAgIHZhciBpbmRleCA9IHRoZS5fdmFsaWRhdGVJbmRleE1hcFtwYXRoXTtcbiAgICAgICAgaWYgKHR5cGVpcy5VbmRlZmluZWQoaW5kZXgpKSB7XG4gICAgICAgICAgICBpbmRleCA9IHRoZS5fdmFsaWRhdGVJbmRleE1hcFtwYXRoXSA9IHRoZS5fdmFsaWRhdGVMaXN0Lmxlbmd0aDtcbiAgICAgICAgICAgIHRoZS5fdmFsaWRhdGVMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgcnVsZXM6IFtdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlaXMuU3RyaW5nKG5hbWVPcmZuKSkge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBuYW1lT3JmbjtcblxuICAgICAgICAgICAgaWYgKCF2YWxpZGF0aW9uTWFwW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ2NhbiBub3QgZm91bmQgYCcgKyBuYW1lICsgJ2AgdmFsaWRhdGlvbic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoZS5fdmFsaWRhdGVMaXN0W2luZGV4XS5ydWxlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICAgICAgICAgIGZuOiB2YWxpZGF0aW9uTWFwW25hbWVdLFxuICAgICAgICAgICAgICAgIGlkOiByYW5kb20uZ3VpZCgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlaXMuRnVuY3Rpb24obmFtZU9yZm4pKSB7XG4gICAgICAgICAgICB0aGUuX3ZhbGlkYXRlTGlzdFtpbmRleF0ucnVsZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZXNwYWNlICsgYWxpZW5JbmRleCsrLFxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICAgICAgICAgIGZuOiBuYW1lT3JmbixcbiAgICAgICAgICAgICAgICBpZDogcmFuZG9tLmd1aWQoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhlO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIOiOt+WPluWtl+auteeahOinhOWImVxuICAgICAqIEBwYXJhbSBbcGF0aF0ge1N0cmluZ30g5a2X5q61XG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldFJ1bGVzOiBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICB2YXIgdGhlID0gdGhpcztcblxuICAgICAgICBpZiAoIXBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGUuX3ZhbGlkYXRlTGlzdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBydWxlcyA9IFtdO1xuXG4gICAgICAgIGRhdG8uZWFjaCh0aGUuX3ZhbGlkYXRlTGlzdCwgZnVuY3Rpb24gKGksIHZhbGlkYXRlKSB7XG4gICAgICAgICAgICBpZiAocGF0aCA9PT0gdmFsaWRhdGUucGF0aCkge1xuICAgICAgICAgICAgICAgIHJ1bGVzID0gdmFsaWRhdGUucnVsZXM7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBydWxlcztcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiDojrflj5blrZfmrrXpqozor4Hop4TliJnnmoTlj4LmlbBcbiAgICAgKiBAcGFyYW0gcGF0aCB7U3RyaW5nfSDlrZfmrrVcbiAgICAgKiBAcGFyYW0gbmFtZSB7U3RyaW5nfSDop4TliJnlkI3np7BcbiAgICAgKiBAcmV0dXJucyB7KnxBcnJheX19XG4gICAgICovXG4gICAgZ2V0UnVsZVBhcmFtczogZnVuY3Rpb24gKHBhdGgsIG5hbWUpIHtcbiAgICAgICAgdmFyIHRoZSA9IHRoaXM7XG4gICAgICAgIHZhciBydWxlcyA9IHRoZS5nZXRSdWxlcyhwYXRoKTtcbiAgICAgICAgdmFyIHJ1bGU7XG5cbiAgICAgICAgZGF0by5lYWNoKHJ1bGVzLCBmdW5jdGlvbiAoaW5kZXgsIF9ydWxlKSB7XG4gICAgICAgICAgICBpZiAoX3J1bGUubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgICAgIHJ1bGUgPSBfcnVsZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBydWxlICYmIHJ1bGUucGFyYW1zO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIOi/lOWbnuW+hemqjOivgeeahOaVsOaNrlxuICAgICAqIEBwYXJhbSBbcGF0aF0ge1N0cmluZ30g5a2X5q61XG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgdmFyIHRoZSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHR5cGVpcy5BcnJheShwYXRoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdG8uc2VsZWN0KHRoZS5kYXRhLCBwYXRoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlaXMuU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhlLmRhdGFbcGF0aF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhlLmRhdGE7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICog6K6+572u5b6F6aqM6K+B55qE5pWw5o2uXG4gICAgICogQHBhcmFtIHBhdGgge1N0cmluZ30g5pWw5o2u5a2X5q61XG4gICAgICogQHBhcmFtIHZhbCB7Kn0g5pWw5o2u5YC8XG4gICAgICogQHJldHVybnMge1ZhbGlkYXRpb259XG4gICAgICovXG4gICAgc2V0RGF0YTogZnVuY3Rpb24gKHBhdGgsIHZhbCkge1xuICAgICAgICB2YXIgdGhlID0gdGhpcztcblxuICAgICAgICB0aGUuZGF0YVtwYXRoXSA9IHZhbDtcblxuICAgICAgICByZXR1cm4gdGhlO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIOaJp+ihjOWNleS4qumqjOivgVxuICAgICAqIEBwYXJhbSBkYXRhIHtPYmplY3R9IOW+hemqjOivgeeahOaVsOaNrlxuICAgICAqIEBwYXJhbSBbcGF0aF0ge1N0cmluZ30g5oyH5a6a6aqM6K+B55qE5a2X5q61XG4gICAgICogQHBhcmFtIFtjYWxsYmFja10ge0Z1bmN0aW9ufSDpqozor4Hlm57osINcbiAgICAgKiBAcmV0dXJucyB7VmFsaWRhdGlvbn1cbiAgICAgKi9cbiAgICB2YWxpZGF0ZU9uZTogZnVuY3Rpb24gKGRhdGEsIHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBhcmdzID0gYWxsb2NhdGlvbi5hcmdzKGFyZ3VtZW50cyk7XG5cbiAgICAgICAgaWYgKCF0eXBlaXMuU3RyaW5nKGFyZ3NbMV0pKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGFyZ3NbMV07XG4gICAgICAgICAgICBwYXRoID0gT2JqZWN0LmtleXMoZGF0YSlbMF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZVNvbWUoZGF0YSwgcGF0aCwgY2FsbGJhY2spO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIOaJp+ihjOmDqOWIhumqjOivgVxuICAgICAqIEBwYXJhbSBkYXRhIHtPYmplY3R9IOW+hemqjOivgeeahOaVsOaNrlxuICAgICAqIEBwYXJhbSBbcGF0aHNdIHtTdHJpbmd9IOaMh+WumumqjOivgeeahOWtl+autVxuICAgICAqIEBwYXJhbSBbY2FsbGJhY2tdIHtGdW5jdGlvbn0g6aqM6K+B5Zue6LCDXG4gICAgICogQHJldHVybnMge1ZhbGlkYXRpb259XG4gICAgICovXG4gICAgdmFsaWRhdGVTb21lOiBmdW5jdGlvbiAoZGF0YSwgcGF0aHMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciB0aGUgPSB0aGlzO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoZS5fb3B0aW9ucztcbiAgICAgICAgdmFyIHBhdGggPSAnJztcbiAgICAgICAgdmFyIGFyZ3MgPSBhbGxvY2F0aW9uLmFyZ3MoYXJndW1lbnRzKTtcbiAgICAgICAgdmFyIHBhdGhNYXAgPSB7fTtcblxuICAgICAgICBpZiAodGhlLl9pc1ZhbGlkYXRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZGF0ZVNvbWUoZGF0YSwgY2FsbGJhY2spXG4gICAgICAgIGlmICghdHlwZWlzLlN0cmluZyhhcmdzWzFdKSAmJiAhdHlwZWlzLkFycmF5KGFyZ3NbMV0pKSB7XG4gICAgICAgICAgICBwYXRocyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBhcmdzWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF0aHMgPSB0eXBlaXMuU3RyaW5nKHBhdGhzKSA/IFtwYXRoc10gOiBwYXRocztcblxuICAgICAgICBkYXRvLmVhY2gocGF0aHMsIGZ1bmN0aW9uIChpbmRleCwgcGF0aCkge1xuICAgICAgICAgICAgcGF0aE1hcFtwYXRoXSA9IDE7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoZS5faXNWYWxpZGF0aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhlLmRhdGEgPSBkYXRhO1xuICAgICAgICB2YXIgZXJyb3JMZW5ndGggPSAwO1xuICAgICAgICB2YXIgZmlyc3RJbnZsaWRFcnJvciA9IG51bGw7XG4gICAgICAgIHZhciBmaXJzdEludmxpZFBhdGggPSBudWxsO1xuXG4gICAgICAgIGhvd2RvXG4gICAgICAgICAgICAvLyDpgY3ljobpqozor4Hpobrluo9cbiAgICAgICAgICAgIC5lYWNoKHRoZS5fdmFsaWRhdGVMaXN0LCBmdW5jdGlvbiAoaSwgaXRlbSwgbmV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghKGl0ZW0ucGF0aCBpbiBwYXRoTWFwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoZS5fdmFsaWRhdGVPbmUocGF0aCA9IGl0ZW0ucGF0aCwgaXRlbS5ydWxlcywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZpcnN0SW52bGlkUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0SW52bGlkRXJyb3IgPSBlcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RJbnZsaWRQYXRoID0gaXRlbS5wYXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvckxlbmd0aCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pyJ6ZSZ6K+vICYmIOWksei0peS4jeaWreW8gFxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyICYmICFvcHRpb25zLmJyZWFrT25JbnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mb2xsb3coZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoZS5faXNWYWxpZGF0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZWlzLkZ1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoZSwgZmlyc3RJbnZsaWRFcnJvciwgZmlyc3RJbnZsaWRQYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gVmFsaWRhdGUgYWxsIGRhdGFcbiAgICAgKiBAYXV0aG9yIHRoYW5oLmJheVxuICAgICAqIEBwYXJhbSBkYXRhIHtPYmplY3R9IOW+hemqjOivgeeahOaVsOaNrlxuICAgICAqIEBwYXJhbSBbcGF0aHNdIHtTdHJpbmd9IOaMh+WumumqjOivgeeahOWtl+autVxuICAgICAqIEBwYXJhbSBbY2FsbGJhY2tdIHtGdW5jdGlvbn0g6aqM6K+B5Zue6LCDXG4gICAgICogQHJldHVybnMge1ZhbGlkYXRpb259XG4gICAgICovXG4gICAgdmFsaWRhdGVTb21lQWxsOiBmdW5jdGlvbiAoZGF0YSwgcGF0aHMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciB0aGUgPSB0aGlzO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoZS5fb3B0aW9ucztcbiAgICAgICAgdmFyIHBhdGggPSAnJztcbiAgICAgICAgdmFyIGFyZ3MgPSBhbGxvY2F0aW9uLmFyZ3MoYXJndW1lbnRzKTtcbiAgICAgICAgdmFyIHBhdGhNYXAgPSB7fTtcblxuICAgICAgICBpZiAodGhlLl9pc1ZhbGlkYXRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZGF0ZVNvbWUoZGF0YSwgY2FsbGJhY2spXG4gICAgICAgIGlmICghdHlwZWlzLlN0cmluZyhhcmdzWzFdKSAmJiAhdHlwZWlzLkFycmF5KGFyZ3NbMV0pKSB7XG4gICAgICAgICAgICBwYXRocyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBhcmdzWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF0aHMgPSB0eXBlaXMuU3RyaW5nKHBhdGhzKSA/IFtwYXRoc10gOiBwYXRocztcbiAgICAgICAgXG4gICAgICAgIGRhdG8uZWFjaChwYXRocywgZnVuY3Rpb24gKGluZGV4LCBwYXRoKSB7XG4gICAgICAgICAgICBwYXRoTWFwW3BhdGhdID0gMTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGUuX2lzVmFsaWRhdGluZyA9IHRydWU7XG4gICAgICAgIHRoZS5kYXRhID0gZGF0YTtcbiAgICAgICAgdmFyIGVycm9yTGVuZ3RoID0gMDtcbiAgICAgICAgdmFyIGludmFsaWREYXRhID0ge31cbiAgICAgICAgaG93ZG9cbiAgICAgICAgICAgIC8vIOmBjeWOhumqjOivgemhuuW6j1xuICAgICAgICAgICAgLmVhY2godGhlLl92YWxpZGF0ZUxpc3QsIGZ1bmN0aW9uIChpLCBpdGVtLCBuZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoaXRlbS5wYXRoIGluIHBhdGhNYXApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhlLl92YWxpZGF0ZU9uZShwYXRoID0gaXRlbS5wYXRoLCBpdGVtLnJ1bGVzLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWREYXRhW2l0ZW0ucGF0aF0gPSBlcnIubWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTGVuZ3RoKys7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyDmnInplJnor68gJiYg5aSx6LSl5LiN5pat5byAXG4gICAgICAgICAgICAgICAgICAgIC8vJiYgIW9wdGlvbnMuYnJlYWtPbkludmFsaWQgXG4gICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdCBicmVhayB3aGVuIGludmFsaWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZm9sbG93KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGUuX2lzVmFsaWRhdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlaXMuRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhlLCBpbnZhbGlkRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOaJp+ihjOWFqOmDqOmqjOivgVxuICAgICAqIEBwYXJhbSBkYXRhIHtPYmplY3R9IOW+hemqjOivgeeahOaVsOaNrlxuICAgICAqIEBwYXJhbSBbY2FsbGJhY2tdIHtGdW5jdGlvbn0g6aqM6K+B5Zue6LCDXG4gICAgICogQHJldHVybnMge1ZhbGlkYXRpb259XG4gICAgICovXG4gICAgdmFsaWRhdGVBbGw6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgdGhlID0gdGhpcztcbiAgICAgICAgdmFyIHBhdGhzID0gW107XG5cbiAgICAgICAgZGF0by5lYWNoKHRoZS5fdmFsaWRhdGVMaXN0LCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcbiAgICAgICAgICAgIHBhdGhzLnB1c2goaXRlbS5wYXRoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoZS52YWxpZGF0ZVNvbWUoZGF0YSwgcGF0aHMsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIHZhbGlkYXRlIGFsbCBkYXRhIGF0IHRoZSBzYW1lIHRpbWVcbiAgICAgKiBAcGFyYW0gZGF0YSB7T2JqZWN0fSDlvoXpqozor4HnmoTmlbDmja5cbiAgICAgKiBAcGFyYW0gW2NhbGxiYWNrXSB7RnVuY3Rpb259IOmqjOivgeWbnuiwg1xuICAgICAqIEByZXR1cm5zIHtWYWxpZGF0aW9ufVxuICAgICAqL1xuICAgIEZMVmFsaWRhdGVBbGw6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgdGhlID0gdGhpcztcbiAgICAgICAgdmFyIHBhdGhzID0gW107XG5cbiAgICAgICAgZGF0by5lYWNoKHRoZS5fdmFsaWRhdGVMaXN0LCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcbiAgICAgICAgICAgIHBhdGhzLnB1c2goaXRlbS5wYXRoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoZS52YWxpZGF0ZVNvbWVBbGwoZGF0YSwgcGF0aHMsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6KGo5Y2V6aqM6K+BXG4gICAgICogQHBhcmFtIHBhdGgge1N0cmluZ30g5a2X5q61XG4gICAgICogQHBhcmFtIHJ1bGVzIHtBcnJheX0g6aqM6K+B6KeE5YiZXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0g6aqM6K+B5Zue6LCDXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfdmFsaWRhdGVPbmU6IGZ1bmN0aW9uIChwYXRoLCBydWxlcywgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHRoZSA9IHRoaXM7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhlLl9vcHRpb25zO1xuICAgICAgICB2YXIgZGF0YSA9IHRoZS5kYXRhO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpqozor4HkuYvliY1cbiAgICAgICAgICogQGV2ZW50IGJlZm9yZVZhbGlkYXRlXG4gICAgICAgICAqIEBwYXJhbSBwYXRoIHtTdHJpbmd9IOWtl+autVxuICAgICAgICAgKi9cbiAgICAgICAgdGhlLmVtaXQoJ2JlZm9yZVZhbGlkYXRlJywgcGF0aCk7XG4gICAgICAgIHZhciBjdXJyZW50UnVsZTtcbiAgICAgICAgaG93ZG9cbiAgICAgICAgICAgIC8vIOmBjeWOhumqjOivgeinhOWImVxuICAgICAgICAgICAgLmVhY2gocnVsZXMsIGZ1bmN0aW9uIChqLCBydWxlLCBuZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbZGF0YVtwYXRoXSwgbmV4dF07XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50UnVsZSA9IHJ1bGU7XG4gICAgICAgICAgICAgICAgdGhlLmVtaXQoJ3ZhbGlkYXRlJywgcGF0aCwgcnVsZS5uYW1lKTtcbiAgICAgICAgICAgICAgICBhcmdzID0gYXJncy5jb25jYXQocnVsZS5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIHRoZS5wYXRoID0gcGF0aDtcbiAgICAgICAgICAgICAgICBydWxlLmZuLmFwcGx5KHRoZSwgYXJncyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZvbGxvdygpXG4gICAgICAgICAgICAudHJ5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDpqozor4HmiJDlip9cbiAgICAgICAgICAgICAgICAgKiBAZXZlbnQgdmFsaWRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcGF0aCB7U3RyaW5nfSDlrZfmrrVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB0aGUuZW1pdCgndmFsaWQnLCBwYXRoKTtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIOmqjOivgeS5i+WQjlxuICAgICAgICAgICAgICAgICAqIEBldmVudCB2YWxpZGF0ZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBwYXRoIHtTdHJpbmd9IOWtl+autVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHRoZS5lbWl0KCd2YWxpZGF0ZScsIHBhdGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVpcy5GdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGUsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHZhciBvdmVycmlkZU1zZyA9IHRoZS5fbXNnTWFwW3BhdGhdICYmIHRoZS5fbXNnTWFwW3BhdGhdW2N1cnJlbnRSdWxlLm5hbWVdO1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gW292ZXJyaWRlTXNnIHx8IGVyciB8fCBvcHRpb25zLmRlZmF1bHRNc2csIHRoZS5nZXRBbGlhcyhwYXRoKSB8fCBwYXRoXTtcbiAgICAgICAgICAgICAgICBhcmdzID0gYXJncy5jb25jYXQoY3VycmVudFJ1bGUucGFyYW1zKTtcbiAgICAgICAgICAgICAgICBlcnIgPSBuZXcgVHlwZUVycm9yKHN0cmluZy5hc3NpZ24uYXBwbHkoc3RyaW5nLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgZXJyLmlkID0gY3VycmVudFJ1bGUuaWQ7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDpqozor4HlpLHotKVcbiAgICAgICAgICAgICAgICAgKiBAZXZlbnQgaW52YWxpZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBlcnJvciB7T2JqZWN0fSDplJnor6/lr7nosaFcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcGF0aCB7U3RyaW5nfSDlrZfmrrVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB0aGUuZW1pdCgnaW52YWxpZCcsIGVyciwgcGF0aCk7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDpqozor4HkuYvlkI5cbiAgICAgICAgICAgICAgICAgKiBAZXZlbnQgdmFsaWRhdGVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcGF0aCB7U3RyaW5nfSDlrZfmrrVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB0aGUuZW1pdCgndmFsaWRhdGUnLCBwYXRoKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlaXMuRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhlLCBlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIOazqOWGjOmdmeaAgemqjOivgeinhOWImVxuICogQHBhcmFtIG5hbWUge1N0cmluZ30g6KeE5YiZ5ZCN56ewXG4gKiBAcGFyYW0gZm4ge0Z1bmN0aW9ufSDop4TliJnlm57osINcbiAqXG4gKiBAZXhhbXBsZVxuICogVmFsaWRhdGlvbi5hZGRSdWxlKCdudW1iZXInLCBmdW5jdGlvbiAodmFsLCBkb25lLCBwYXJhbTAsIHBhcmFtMSwgLi4uKSB7XG4gKiAgICBkb25lKC9eXFxkKyQvLnRlc3QodmFsKSA/IG51bGwgOiAnJHtwYXRofeW/hemhu+aYr+aVsOWtlycpO1xuICogfSk7XG4gKi9cblZhbGlkYXRpb24uYWRkUnVsZSA9IGZ1bmN0aW9uIChuYW1lLCBmbi8qYXJndW1lbnRzKi8pIHtcbiAgICB2YWxpZGF0aW9uTWFwW25hbWVdID0gZm47XG59O1xuXG5cbi8qKlxuICog6L+U5Zue6Z2Z5oCB6KeE5YiZXG4gKiBAcGFyYW0gW25hbWVdIHtTdHJpbmd9IOinhOWImeWQjVxuICogQHJldHVybnMge09iamVjdHxGdW5jdGlvbn1cbiAqL1xuVmFsaWRhdGlvbi5nZXRSdWxlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZSA/IHZhbGlkYXRpb25NYXBbbmFtZV0gOiB2YWxpZGF0aW9uTWFwO1xufTtcblxucmVxdWlyZSgnLi9fdmFsaWRhdGlvbi1ydWxlcy5qcycpKFZhbGlkYXRpb24pO1xuVmFsaWRhdGlvbi5kZWZhdWx0cyA9IGRlZmF1bHRzO1xubW9kdWxlLmV4cG9ydHMgPSBWYWxpZGF0aW9uO1xuIl19