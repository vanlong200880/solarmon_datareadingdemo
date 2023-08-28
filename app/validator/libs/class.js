/**
 * 类的创建与继承
 * @author ydr.me
 * @create 2014-10-04 15:09
 */

/*===============================
 // 【以前】
 // 创建一个类
 var A = function(){};
 A.prototype.abc = '123';

 // 继承一个类
 var B = function(){
 A.apply(this, arguments);
 };

 B.prototype = new A();
 B.prototype.def = '456';

 // ===>

 //【现在】
 var A = klass.create({
 constructor: function(){},
 abc: '123'
 });
 var B = klass.extends(A).create({
 constructor: function(){},
 def: '456'
 });
 ===============================*/

/**
 * 类方法
 * @module class
 * @requires dato
 * @requires typeis
 */
'use strict';

var dato = require('./dato.js');
var typeis = require('./typeis.js');

var classId = 0;

/**
 * 单继承
 * @param {Function} constructor 子类
 * @param {Function} superConstructor 父类
 * @param {Boolean} [isCopyStatic=false] 是否复制静态方法
 * @link https://github.com/joyent/node/blob/master/lib/util.js#L628
 *
 * @example
 * // 父类
 * var Father = function(){};
 *
 * // 子类
 * var Child = function(){
     *     // 执行一次父类的方法
     *     Father.apply(this, arguments);
     *
     *     // 这里执行子类的方法、属性
     *     this.sth = 123;
     * };
 *
 * klass.inherit(Child, Father);
 *
 * // 这里开始写子类的原型方法
 * Child.prototype.fn = fn;
 */
var inherit = function inherit(constructor, superConstructor, isCopyStatic) {
    constructor.super_ = superConstructor;
    constructor.prototype = Object.create(superConstructor.prototype);

    if (isCopyStatic) {
        dato.extend(true, constructor, superConstructor);
    }
};

/**
 * 创建一个类（构造函数）【旧的方法，会在下一个大版本中废弃】
 * @param {Object} prototypes 原型链
 * @param {Function} [superConstructor=null] 父类
 * @param {Boolean} [isInheritStatic=false] 是否继承父类的静态方法
 * @returns {Function}
 */
var _create = function _create(prototypes, superConstructor, isInheritStatic) {
    if (typeis.Function(prototypes)) {
        prototypes = {
            constructor: prototypes
        };
    }

    if (!typeis.Function(prototypes.constructor)) {
        throw Error('propertypes.constructor must be a function');
    }

    var con = prototypes.constructor;

    prototypes.constructor = null;

    var superConstructorIsAFn = typeis.Function(superConstructor);
    var Class = function Class() {
        var the = this;
        var args = arguments;

        if (superConstructorIsAFn) {
            superConstructor.apply(the, args);
        }

        the.__classId__ = classId++;
        con.apply(the, args);
    };

    if (superConstructorIsAFn) {
        inherit(Class, superConstructor, isInheritStatic);
    }

    dato.each(prototypes, function (key, val) {
        Class.prototype[key] = val;
    });

    /**
     * 原始的 constructor
     * @type {Function}
     * @private
     */
    Class.prototype.__constructor__ = con;

    /**
     * 输出的 constructor
     * @type {Function}
     */
    Class.prototype.constructor = Class;

    return Class;
};

/**
 * 类的构造器
 * @param prototypes
 * @param superConstructor
 * @param isInheritStatic
 * @constructor
 */
var Class = function Class(prototypes, superConstructor, isInheritStatic) {
    var the = this;

    the.p = prototypes;
    the.s = superConstructor;
    the.i = isInheritStatic;
};

Class.prototype = {
    constructor: Class,

    /**
     * 类的创建
     * @param {Object} [prototypes] 原型链
     * @returns {Function}
     */
    create: function create(prototypes) {
        var the = this;

        the.p = prototypes || the.p;

        return _create(the.p, the.s, the.i);
    }
};

/**
 * 类的继承，参考了 es6 的 class 表现
 * 因为 extends 是关键字，在 IE 下会报错，修改为 extend、inherit
 * @param superConstructor
 * @param isInheritStatic
 * @returns {Class}
 */
exports['extends'] = exports.extend = function (superConstructor, isInheritStatic) {
    return new Class(null, superConstructor, isInheritStatic);
};

/**
 * 类的创建
 * @param {Object} prototypes 原型链
 * @param {Function} [superConstructor=null] 父类
 * @param {Boolean} [isInheritStatic=false] 是否继承父类的静态方法
 * @returns {Function}
 *
 * @example
 * // 1. 创建一个空原型链的类
 * var A = klass.create(fn);
 *
 * // 2. 创建一个有原型链的类
 * var B = klass.create({
     *     constructor: fn,
     *     ...
     * });
 *
 * // 3. 创建一个子类
 * var C = klass.extend(B).create(fn);
 * var D = klass.extend(C).create({
     *     constructor: fn,
     *     ...
     * });
 */
exports.create = function (prototypes, superConstructor, isInheritStatic) {
    var the = this;

    // 上一个级联应该是 extends
    if (the.constructor === Class && the instanceof Class) {
        return the.create(prototypes);
    }

    return new Class(prototypes, superConstructor, isInheritStatic).create();
};

/**
 * 原型转让，将父级的原型复制到子类，
 * 比如写好的一个 Dialog 类有 A、B、C 三个原型方法，
 * 而写好的一个子类 ProductDialog，与 Dialog 的构造参数不一致，无法直接继承，
 * 那么就可以使用原型过渡，子类的 ProductDialog 原本没有 A、B、C 三个实例方法，
 * 只是在内部实例化了一个 Dialog 实例 dialog，那么就可以将 dialog 的原型方法复制到 ProductDialog 实例上
 * 即：`class.transfer(Dialog, ProductDialog, 'dialog')`
 * 结果是：将 Dialog 的原型通过 dialog 实例转让给 ProductDialog
 *
 * @param parentClass {Function|Object} 父级构造函数
 * @param childClass {Function} 子级构造函数
 * @param parentInstanceNameInChild {String} 父级实例在子类的名称
 * @param [filter] {Array} 允许和禁止的公共方法名称
 *
 * @example
 * name 与 ['name'] 匹配
 * name 与 ['!name'] 不匹配
 */
exports.transfer = function (parentClass, childClass, parentInstanceNameInChild, filter) {
    dato.each(parentClass.prototype, function (property) {
        if (!childClass.prototype[property] && _matches(property, filter)) {
            childClass.prototype[property] = function () {
                var the = this;
                var ret = the[parentInstanceNameInChild][property].apply(the[parentInstanceNameInChild], arguments);
                return ret instanceof parentClass ? the : ret;
            };
        }
    });
};

var REG_PRIVATE = /^_/;

/**
 * 判断是否匹配
 * @param name {String} 待匹配字符串
 * @param [names] {Array} 被匹配字符串数组
 * @returns {boolean}
 * @private
 */
function _matches(name, names) {
    names = names || [];

    if (REG_PRIVATE.test(name)) {
        return false;
    }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWxpZGF0b3IvbGlicy9jbGFzcy5qcyJdLCJuYW1lcyI6WyJkYXRvIiwicmVxdWlyZSIsInR5cGVpcyIsImNsYXNzSWQiLCJpbmhlcml0IiwiY29uc3RydWN0b3IiLCJzdXBlckNvbnN0cnVjdG9yIiwiaXNDb3B5U3RhdGljIiwic3VwZXJfIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIiwiZXh0ZW5kIiwicHJvdG90eXBlcyIsImlzSW5oZXJpdFN0YXRpYyIsIkZ1bmN0aW9uIiwiRXJyb3IiLCJjb24iLCJzdXBlckNvbnN0cnVjdG9ySXNBRm4iLCJDbGFzcyIsInRoZSIsImFyZ3MiLCJhcmd1bWVudHMiLCJhcHBseSIsIl9fY2xhc3NJZF9fIiwiZWFjaCIsImtleSIsInZhbCIsIl9fY29uc3RydWN0b3JfXyIsInAiLCJzIiwiaSIsImV4cG9ydHMiLCJ0cmFuc2ZlciIsInBhcmVudENsYXNzIiwiY2hpbGRDbGFzcyIsInBhcmVudEluc3RhbmNlTmFtZUluQ2hpbGQiLCJmaWx0ZXIiLCJwcm9wZXJ0eSIsIl9tYXRjaGVzIiwicmV0IiwiUkVHX1BSSVZBVEUiLCJuYW1lIiwibmFtZXMiLCJ0ZXN0IiwibGVuZ3RoIiwibWF0Y2hlZCIsImluZGV4IiwiX25hbWUiLCJmbGFnIiwic2xpY2UiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFNQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBOzs7Ozs7QUFNQTs7QUFFQSxJQUFJQSxPQUFPQyxRQUFRLFdBQVIsQ0FBWDtBQUNBLElBQUlDLFNBQVNELFFBQVEsYUFBUixDQUFiOztBQUVBLElBQUlFLFVBQVUsQ0FBZDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFJQyxVQUFVLFNBQVZBLE9BQVUsQ0FBVUMsV0FBVixFQUF1QkMsZ0JBQXZCLEVBQXlDQyxZQUF6QyxFQUF1RDtBQUNqRUYsZ0JBQVlHLE1BQVosR0FBcUJGLGdCQUFyQjtBQUNBRCxnQkFB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QUNDLE1BQU1FLE1BQVgsRUFBbUI7QUFDZixlQUFPLElBQVA7QUFDSDs7QUFFRCxRQUFJQyxVQUFVLElBQWQ7O0FBRUE5QyxTQUFLeUIsSUFBTCxDQUFVa0IsS0FBVixFQUFpQixVQUFVSSxLQUFWLEVBQWlCQyxLQUFqQixFQUF3QjtBQUNyQyxZQUFJQyxPQUFPRCxNQUFNLENBQU4sQ0FBWDs7QUFFQTtBQUNBLFlBQUlDLFNBQVMsR0FBYixFQUFrQjtBQUNkSCxzQkFBVSxJQUFWOztBQUVBLGdCQUFJSixTQUFTTSxNQUFNRSxLQUFOLENBQVksQ0FBWixDQUFiLEVBQTZCO0FBQ3pCSiwwQkFBVSxLQUFWO0FBQ0EsdUJBQU8sS0FBUDtBQUNIO0FBQ0o7QUFDRDtBQVJBLGFBU0s7QUFDREEsMEJBQVUsS0FBVjs7QUFFQSxvQkFBSUosU0FBU00sS0FBYixFQUFvQjtBQUNoQkYsOEJBQVUsSUFBVjtBQUNBLDJCQUFPLEtBQVA7QUFDSDtBQUNKO0FBQ0osS0FyQkQ7O0FBdUJBLFdBQU9BLE9BQVA7QUFDSCIsImZpbGUiOiJjbGFzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICog57G755qE5Yib5bu65LiO57un5om/XG4gKiBAYXV0aG9yIHlkci5tZVxuICogQGNyZWF0ZSAyMDE0LTEwLTA0IDE1OjA5XG4gKi9cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gLy8g44CQ5Lul5YmN44CRXG4gLy8g5Yib5bu65LiA5Liq57G7XG4gdmFyIEEgPSBmdW5jdGlvbigpe307XG4gQS5wcm90b3R5cGUuYWJjID0gJzEyMyc7XG5cbiAvLyDnu6fmib/kuIDkuKrnsbtcbiB2YXIgQiA9IGZ1bmN0aW9uKCl7XG4gQS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuIH07XG5cbiBCLnByb3RvdHlwZSA9IG5ldyBBKCk7XG4gQi5wcm90b3R5cGUuZGVmID0gJzQ1Nic7XG5cbiAvLyA9PT0+XG5cbiAvL+OAkOeOsOWcqOOAkVxuIHZhciBBID0ga2xhc3MuY3JlYXRlKHtcbiBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKXt9LFxuIGFiYzogJzEyMydcbiB9KTtcbiB2YXIgQiA9IGtsYXNzLmV4dGVuZHMoQSkuY3JlYXRlKHtcbiBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKXt9LFxuIGRlZjogJzQ1NidcbiB9KTtcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuXG4vKipcbiAqIOexu+aWueazlVxuICogQG1vZHVsZSBjbGFzc1xuICogQHJlcXVpcmVzIGRhdG9cbiAqIEByZXF1aXJlcyB0eXBlaXNcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGF0byA9IHJlcXVpcmUoJy4vZGF0by5qcycpO1xudmFyIHR5cGVpcyA9IHJlcXVpcmUoJy4vdHlwZWlzLmpzJyk7XG5cbnZhciBjbGFzc0lkID0gMDtcblxuLyoqXG4gKiDljZXnu6fmib9cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbnN0cnVjdG9yIOWtkOexu1xuICogQHBhcmFtIHtGdW5jdGlvbn0gc3VwZXJDb25zdHJ1Y3RvciDniLbnsbtcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2lzQ29weVN0YXRpYz1mYWxzZV0g5piv5ZCm5aSN5Yi26Z2Z5oCB5pa55rOVXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvYmxvYi9tYXN0ZXIvbGliL3V0aWwuanMjTDYyOFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyDniLbnsbtcbiAqIHZhciBGYXRoZXIgPSBmdW5jdGlvbigpe307XG4gKlxuICogLy8g5a2Q57G7XG4gKiB2YXIgQ2hpbGQgPSBmdW5jdGlvbigpe1xuICAgICAqICAgICAvLyDmiafooYzkuIDmrKHniLbnsbvnmoTmlrnms5VcbiAgICAgKiAgICAgRmF0aGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICpcbiAgICAgKiAgICAgLy8g6L+Z6YeM5omn6KGM5a2Q57G755qE5pa55rOV44CB5bGe5oCnXG4gICAgICogICAgIHRoaXMuc3RoID0gMTIzO1xuICAgICAqIH07XG4gKlxuICoga2xhc3MuaW5oZXJpdChDaGlsZCwgRmF0aGVyKTtcbiAqXG4gKiAvLyDov5nph4zlvIDlp4vlhpnlrZDnsbvnmoTljp/lnovmlrnms5VcbiAqIENoaWxkLnByb3RvdHlwZS5mbiA9IGZuO1xuICovXG52YXIgaW5oZXJpdCA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvciwgc3VwZXJDb25zdHJ1Y3RvciwgaXNDb3B5U3RhdGljKSB7XG4gICAgY29uc3RydWN0b3Iuc3VwZXJfID0gc3VwZXJDb25zdHJ1Y3RvcjtcbiAgICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ29uc3RydWN0b3IucHJvdG90eXBlKTtcblxuICAgIGlmIChpc0NvcHlTdGF0aWMpIHtcbiAgICAgICAgZGF0by5leHRlbmQodHJ1ZSwgY29uc3RydWN0b3IsIHN1cGVyQ29uc3RydWN0b3IpO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiDliJvlu7rkuIDkuKrnsbvvvIjmnoTpgKDlh73mlbDvvInjgJDml6fnmoTmlrnms5XvvIzkvJrlnKjkuIvkuIDkuKrlpKfniYjmnKzkuK3lup/lvIPjgJFcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b3R5cGVzIOWOn+Wei+mTvlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3N1cGVyQ29uc3RydWN0b3I9bnVsbF0g54i257G7XG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpc0luaGVyaXRTdGF0aWM9ZmFsc2VdIOaYr+WQpue7p+aJv+eItuexu+eahOmdmeaAgeaWueazlVxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG52YXIgY3JlYXRlID0gZnVuY3Rpb24gKHByb3RvdHlwZXMsIHN1cGVyQ29uc3RydWN0b3IsIGlzSW5oZXJpdFN0YXRpYykge1xuICAgIGlmICh0eXBlaXMuRnVuY3Rpb24ocHJvdG90eXBlcykpIHtcbiAgICAgICAgcHJvdG90eXBlcyA9IHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yOiBwcm90b3R5cGVzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCF0eXBlaXMuRnVuY3Rpb24ocHJvdG90eXBlcy5jb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ3Byb3BlcnR5cGVzLmNvbnN0cnVjdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIHZhciBjb24gPSBwcm90b3R5cGVzLmNvbnN0cnVjdG9yO1xuXG4gICAgcHJvdG90eXBlcy5jb25zdHJ1Y3RvciA9IG51bGw7XG5cbiAgICB2YXIgc3VwZXJDb25zdHJ1Y3RvcklzQUZuID0gdHlwZWlzLkZ1bmN0aW9uKHN1cGVyQ29uc3RydWN0b3IpO1xuICAgIHZhciBDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoZSA9IHRoaXM7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmIChzdXBlckNvbnN0cnVjdG9ySXNBRm4pIHtcbiAgICAgICAgICAgIHN1cGVyQ29uc3RydWN0b3IuYXBwbHkodGhlLCBhcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoZS5fX2NsYXNzSWRfXyA9IGNsYXNzSWQrKztcbiAgICAgICAgY29uLmFwcGx5KHRoZSwgYXJncyk7XG4gICAgfTtcblxuICAgIGlmIChzdXBlckNvbnN0cnVjdG9ySXNBRm4pIHtcbiAgICAgICAgaW5oZXJpdChDbGFzcywgc3VwZXJDb25zdHJ1Y3RvciwgaXNJbmhlcml0U3RhdGljKTtcbiAgICB9XG5cbiAgICBkYXRvLmVhY2gocHJvdG90eXBlcywgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgICAgIENsYXNzLnByb3RvdHlwZVtrZXldID0gdmFsO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5Y6f5aeL55qEIGNvbnN0cnVjdG9yXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgQ2xhc3MucHJvdG90eXBlLl9fY29uc3RydWN0b3JfXyA9IGNvbjtcblxuICAgIC8qKlxuICAgICAqIOi+k+WHuueahCBjb25zdHJ1Y3RvclxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGFzcztcblxuICAgIHJldHVybiBDbGFzcztcbn07XG5cblxuLyoqXG4gKiDnsbvnmoTmnoTpgKDlmahcbiAqIEBwYXJhbSBwcm90b3R5cGVzXG4gKiBAcGFyYW0gc3VwZXJDb25zdHJ1Y3RvclxuICogQHBhcmFtIGlzSW5oZXJpdFN0YXRpY1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBDbGFzcyA9IGZ1bmN0aW9uIChwcm90b3R5cGVzLCBzdXBlckNvbnN0cnVjdG9yLCBpc0luaGVyaXRTdGF0aWMpIHtcbiAgICB2YXIgdGhlID0gdGhpcztcblxuICAgIHRoZS5wID0gcHJvdG90eXBlcztcbiAgICB0aGUucyA9IHN1cGVyQ29uc3RydWN0b3I7XG4gICAgdGhlLmkgPSBpc0luaGVyaXRTdGF0aWM7XG59O1xuXG5DbGFzcy5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENsYXNzLFxuXG4gICAgLyoqXG4gICAgICog57G755qE5Yib5bu6XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtwcm90b3R5cGVzXSDljp/lnovpk75cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAocHJvdG90eXBlcykge1xuICAgICAgICB2YXIgdGhlID0gdGhpcztcblxuICAgICAgICB0aGUucCA9IHByb3RvdHlwZXMgfHwgdGhlLnA7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZSh0aGUucCwgdGhlLnMsIHRoZS5pKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICog57G755qE57un5om/77yM5Y+C6ICD5LqGIGVzNiDnmoQgY2xhc3Mg6KGo546wXG4gKiDlm6DkuLogZXh0ZW5kcyDmmK/lhbPplK7lrZfvvIzlnKggSUUg5LiL5Lya5oql6ZSZ77yM5L+u5pS55Li6IGV4dGVuZOOAgWluaGVyaXRcbiAqIEBwYXJhbSBzdXBlckNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gaXNJbmhlcml0U3RhdGljXG4gKiBAcmV0dXJucyB7Q2xhc3N9XG4gKi9cbmV4cG9ydHNbJ2V4dGVuZHMnXSA9IGV4cG9ydHMuZXh0ZW5kID0gZnVuY3Rpb24gKHN1cGVyQ29uc3RydWN0b3IsIGlzSW5oZXJpdFN0YXRpYykge1xuICAgIHJldHVybiBuZXcgQ2xhc3MobnVsbCwgc3VwZXJDb25zdHJ1Y3RvciwgaXNJbmhlcml0U3RhdGljKTtcbn07XG5cblxuLyoqXG4gKiDnsbvnmoTliJvlu7pcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b3R5cGVzIOWOn+Wei+mTvlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3N1cGVyQ29uc3RydWN0b3I9bnVsbF0g54i257G7XG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpc0luaGVyaXRTdGF0aWM9ZmFsc2VdIOaYr+WQpue7p+aJv+eItuexu+eahOmdmeaAgeaWueazlVxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyAxLiDliJvlu7rkuIDkuKrnqbrljp/lnovpk77nmoTnsbtcbiAqIHZhciBBID0ga2xhc3MuY3JlYXRlKGZuKTtcbiAqXG4gKiAvLyAyLiDliJvlu7rkuIDkuKrmnInljp/lnovpk77nmoTnsbtcbiAqIHZhciBCID0ga2xhc3MuY3JlYXRlKHtcbiAgICAgKiAgICAgY29uc3RydWN0b3I6IGZuLFxuICAgICAqICAgICAuLi5cbiAgICAgKiB9KTtcbiAqXG4gKiAvLyAzLiDliJvlu7rkuIDkuKrlrZDnsbtcbiAqIHZhciBDID0ga2xhc3MuZXh0ZW5kKEIpLmNyZWF0ZShmbik7XG4gKiB2YXIgRCA9IGtsYXNzLmV4dGVuZChDKS5jcmVhdGUoe1xuICAgICAqICAgICBjb25zdHJ1Y3RvcjogZm4sXG4gICAgICogICAgIC4uLlxuICAgICAqIH0pO1xuICovXG5leHBvcnRzLmNyZWF0ZSA9IGZ1bmN0aW9uIChwcm90b3R5cGVzLCBzdXBlckNvbnN0cnVjdG9yLCBpc0luaGVyaXRTdGF0aWMpIHtcbiAgICB2YXIgdGhlID0gdGhpcztcblxuICAgIC8vIOS4iuS4gOS4que6p+iBlOW6lOivpeaYryBleHRlbmRzXG4gICAgaWYgKHRoZS5jb25zdHJ1Y3RvciA9PT0gQ2xhc3MgJiYgdGhlIGluc3RhbmNlb2YgQ2xhc3MpIHtcbiAgICAgICAgcmV0dXJuIHRoZS5jcmVhdGUocHJvdG90eXBlcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBDbGFzcyhwcm90b3R5cGVzLCBzdXBlckNvbnN0cnVjdG9yLCBpc0luaGVyaXRTdGF0aWMpLmNyZWF0ZSgpO1xufTtcblxuXG4vKipcbiAqIOWOn+Wei+i9rOiuqe+8jOWwhueItue6p+eahOWOn+Wei+WkjeWItuWIsOWtkOexu++8jFxuICog5q+U5aaC5YaZ5aW955qE5LiA5LiqIERpYWxvZyDnsbvmnIkgQeOAgULjgIFDIOS4ieS4quWOn+Wei+aWueazle+8jFxuICog6ICM5YaZ5aW955qE5LiA5Liq5a2Q57G7IFByb2R1Y3REaWFsb2fvvIzkuI4gRGlhbG9nIOeahOaehOmAoOWPguaVsOS4jeS4gOiHtO+8jOaXoOazleebtOaOpee7p+aJv++8jFxuICog6YKj5LmI5bCx5Y+v5Lul5L2/55So5Y6f5Z6L6L+H5rih77yM5a2Q57G755qEIFByb2R1Y3REaWFsb2cg5Y6f5pys5rKh5pyJIEHjgIFC44CBQyDkuInkuKrlrp7kvovmlrnms5XvvIxcbiAqIOWPquaYr+WcqOWGhemDqOWunuS+i+WMluS6huS4gOS4qiBEaWFsb2cg5a6e5L6LIGRpYWxvZ++8jOmCo+S5iOWwseWPr+S7peWwhiBkaWFsb2cg55qE5Y6f5Z6L5pa55rOV5aSN5Yi25YiwIFByb2R1Y3REaWFsb2cg5a6e5L6L5LiKXG4gKiDljbPvvJpgY2xhc3MudHJhbnNmZXIoRGlhbG9nLCBQcm9kdWN0RGlhbG9nLCAnZGlhbG9nJylgXG4gKiDnu5PmnpzmmK/vvJrlsIYgRGlhbG9nIOeahOWOn+Wei+mAmui/hyBkaWFsb2cg5a6e5L6L6L2s6K6p57uZIFByb2R1Y3REaWFsb2dcbiAqXG4gKiBAcGFyYW0gcGFyZW50Q2xhc3Mge0Z1bmN0aW9ufE9iamVjdH0g54i257qn5p6E6YCg5Ye95pWwXG4gKiBAcGFyYW0gY2hpbGRDbGFzcyB7RnVuY3Rpb259IOWtkOe6p+aehOmAoOWHveaVsFxuICogQHBhcmFtIHBhcmVudEluc3RhbmNlTmFtZUluQ2hpbGQge1N0cmluZ30g54i257qn5a6e5L6L5Zyo5a2Q57G755qE5ZCN56ewXG4gKiBAcGFyYW0gW2ZpbHRlcl0ge0FycmF5fSDlhYHorrjlkoznpoHmraLnmoTlhazlhbHmlrnms5XlkI3np7BcbiAqXG4gKiBAZXhhbXBsZVxuICogbmFtZSDkuI4gWyduYW1lJ10g5Yy56YWNXG4gKiBuYW1lIOS4jiBbJyFuYW1lJ10g5LiN5Yy56YWNXG4gKi9cbmV4cG9ydHMudHJhbnNmZXIgPSBmdW5jdGlvbiAocGFyZW50Q2xhc3MsIGNoaWxkQ2xhc3MsIHBhcmVudEluc3RhbmNlTmFtZUluQ2hpbGQsIGZpbHRlcikge1xuICAgIGRhdG8uZWFjaChwYXJlbnRDbGFzcy5wcm90b3R5cGUsIGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICBpZiAoIWNoaWxkQ2xhc3MucHJvdG90eXBlW3Byb3BlcnR5XSAmJiBfbWF0Y2hlcyhwcm9wZXJ0eSwgZmlsdGVyKSkge1xuICAgICAgICAgICAgY2hpbGRDbGFzcy5wcm90b3R5cGVbcHJvcGVydHldID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciB0aGUgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSB0aGVbcGFyZW50SW5zdGFuY2VOYW1lSW5DaGlsZF1bcHJvcGVydHldLmFwcGx5KHRoZVtwYXJlbnRJbnN0YW5jZU5hbWVJbkNoaWxkXSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0IGluc3RhbmNlb2YgcGFyZW50Q2xhc3MgPyB0aGUgOiByZXQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5cbnZhciBSRUdfUFJJVkFURSA9IC9eXy87XG5cbi8qKlxuICog5Yik5pat5piv5ZCm5Yy56YWNXG4gKiBAcGFyYW0gbmFtZSB7U3RyaW5nfSDlvoXljLnphY3lrZfnrKbkuLJcbiAqIEBwYXJhbSBbbmFtZXNdIHtBcnJheX0g6KKr5Yy56YWN5a2X56ym5Liy5pWw57uEXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9tYXRjaGVzKG5hbWUsIG5hbWVzKSB7XG4gICAgbmFtZXMgPSBuYW1lcyB8fCBbXTtcblxuICAgIGlmIChSRUdfUFJJVkFURS50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIW5hbWVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgbWF0Y2hlZCA9IHRydWU7XG5cbiAgICBkYXRvLmVhY2gobmFtZXMsIGZ1bmN0aW9uIChpbmRleCwgX25hbWUpIHtcbiAgICAgICAgdmFyIGZsYWcgPSBfbmFtZVswXTtcblxuICAgICAgICAvLyAhbmFtZVxuICAgICAgICBpZiAoZmxhZyA9PT0gJyEnKSB7XG4gICAgICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKG5hbWUgPT09IF9uYW1lLnNsaWNlKDEpKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBuYW1lXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbWF0Y2hlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gX25hbWUpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtYXRjaGVkO1xufSJdfQ==