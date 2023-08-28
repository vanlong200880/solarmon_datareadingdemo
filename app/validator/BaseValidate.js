"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validation = require("./libs/validation");

var _validation2 = _interopRequireDefault(_validation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseValidate = function () {
    function BaseValidate() {
        _classCallCheck(this, BaseValidate);

        // Check if all instance methods are implemented.
        if (this.setRule === BaseValidate.prototype.setRule) {
            throw new TypeError("Please implement abstract method setRule.");
        }
        if (this.setAlias === BaseValidate.prototype.setAlias) {
            throw new TypeError("Please implement abstract method setAlias.");
        }
        this.v = new _validation2.default();
    }

    _createClass(BaseValidate, [{
        key: "validationAll",
        value: function validationAll(data, callBack) {
            try {
                // data = Libs.convertEmptyPropToNullProp(data);
                this.setAlias();
                this.setRule();
                var self = this;
                return new Promise(function (resolve, reject) {
                    self.v.validateAll(data, function (err, path) {
                        if (callBack && typeof callBack === 'function') {
                            callBack(err, path);
                            return;
                        }
                        if (err) {
                            resolve(err.message);
                        } else {
                            resolve(path);
                        }
                    });
                });
            } catch (e) {
                console.log(e);
                callBack(e);
            }
        }

        /**
         * @description validate a field 
         * @author thanh.bay
         * @since 07/09/2018
         * @param {*} data 
         * @param {*} path 
         * @param {*} callBack 
         */

    }, {
        key: "validateOne",
        value: function validateOne(data, path, callBack) {
            this.setAlias();
            this.setRule();
            var self = this;
            return new Promise(function (resolve, reject) {
                self.v.validateOne(data, path, function (err, rPath) {
                    if (typeof callBack != "undefined" && typeof callBack === 'function') {
                        callBack(err, path);
                    }
                    if (err) {
                        resolve(_defineProperty({}, path, err.message));
                    } else {
                        resolve(_defineProperty({}, path, null));
                    }
                });
            });
        }

        /**
         * @description validate all data at the same time
         * @author thanh.bay
         * @since 06/09/2018
         * @param {*} data 
         */

    }, {
        key: "FLValidationAll",
        value: function FLValidationAll(data, callBack) {
            try {
                // data = Libs.convertEmptyPropToNullProp(data);
                this.setAlias();
                this.setRule();
                var self = this;
                return new Promise(function (resolve, reject) {
                    self.v.FLValidateAll(data, function (errs) {
                        if (typeof callBack != "undefined" && typeof callBack === 'function') {
                            if (Object.keys(errs).length > 0) {
                                var count = 0;
                                for (var key in errs) {
                                    var message = errs[key];
                                    if (message == null) {
                                        count++;
                                    }
                                }
                                if (count == Object.keys(errs).length) {
                                    callBack(null);
                                } else {
                                    callBack(errs);
                                }
                            } else {
                                callBack(null);
                            }
                        }
                        if (Object.keys(errs).length > 0) {
                            var count = 0;
                            for (var _key in errs) {
                                var _message = errs[_key];
                                if (_message == null) {
                                    count++;
                                }
                            }
                            if (count == Object.keys(errs).length) {
                                resolve(null);
                            } else {
                                resolve(errs);
                            }
                        } else {
                            resolve(null);
                        }
                    });
                });
            } catch (e) {
                console.log(e);
                callBack(e);
            }
        }
    }, {
        key: "setRule",
        value: function setRule() {}
    }, {
        key: "setAlias",
        value: function setAlias() {}
        /**
         * @author khanh.le
         * @since 04-07-2018
         * @param {field name} field_name 
         * @param {rule name} rule_name 
         * @param {rule value } rule_value 
         * @param {key message} key_msg 
         */

    }, {
        key: "addRuleForField",
        value: function addRuleForField(field_name, rule_name, rule_value, key_msg) {
            this.v.addRule(field_name, rule_name, rule_value);
            if (key_msg != '') {
                this.v.setMsg(field_name, rule_name, key_msg);
            }
        }
    }]);

    return BaseValidate;
}();

exports.default = BaseValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvQmFzZVZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbIkJhc2VWYWxpZGF0ZSIsInNldFJ1bGUiLCJwcm90b3R5cGUiLCJUeXBlRXJyb3IiLCJzZXRBbGlhcyIsInYiLCJWYWxpZGF0aW9uIiwiZGF0YSIsImNhbGxCYWNrIiwic2VsZiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidmFsaWRhdGVBbGwiLCJlcnIiLCJwYXRoIiwibWVzc2FnZSIsImUiLCJjb25zb2xlIiwibG9nIiwidmFsaWRhdGVPbmUiLCJyUGF0aCIsIkZMVmFsaWRhdGVBbGwiLCJlcnJzIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImNvdW50Iiwia2V5IiwiZmllbGRfbmFtZSIsInJ1bGVfbmFtZSIsInJ1bGVfdmFsdWUiLCJrZXlfbXNnIiwiYWRkUnVsZSIsInNldE1zZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7OztJQUNNQSxZO0FBQ0YsNEJBQWM7QUFBQTs7QUFDVjtBQUNBLFlBQUksS0FBS0MsT0FBTCxLQUFpQkQsYUFBYUUsU0FBYixDQUF1QkQsT0FBNUMsRUFBcUQ7QUFDakQsa0JBQU0sSUFBSUUsU0FBSixDQUFjLDJDQUFkLENBQU47QUFDSDtBQUNELFlBQUksS0FBS0MsUUFBTCxLQUFrQkosYUFBYUUsU0FBYixDQUF1QkUsUUFBN0MsRUFBdUQ7QUFDbkQsa0JBQU0sSUFBSUQsU0FBSixDQUFjLDRDQUFkLENBQU47QUFDSDtBQUNELGFBQUtFLENBQUwsR0FBUyxJQUFJQyxvQkFBSixFQUFUO0FBRUg7Ozs7c0NBQ2FDLEksRUFBTUMsUSxFQUFVO0FBQzFCLGdCQUFJO0FBQ0E7QUFDQSxxQkFBS0osUUFBTDtBQUNBLHFCQUFLSCxPQUFMO0FBQ0Esb0JBQUlRLE9BQU8sSUFBWDtBQUNBLHVCQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUMxQ0gseUJBQUtKLENBQUwsQ0FB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QVI7QUFDSCw2QkFGRCxNQUVPO0FBQ0hBLHdDQUFRWSxJQUFSO0FBQ0g7QUFDSix5QkFiRCxNQWFPO0FBQ0haLG9DQUFRLElBQVI7QUFDSDtBQUNKLHFCQW5DRDtBQW9DSCxpQkFyQ00sQ0FBUDtBQXNDSCxhQTNDRCxDQTJDRSxPQUFPTSxDQUFQLEVBQVU7QUFDUkMsd0JBQVFDLEdBQVIsQ0FBWUYsQ0FBWjtBQUNBVCx5QkFBU1MsQ0FBVDtBQUNIO0FBQ0o7OztrQ0FFUyxDQUVUOzs7bUNBQ1UsQ0FFVjtBQUNEOzs7Ozs7Ozs7Ozt3Q0FRZ0JZLFUsRUFBWUMsUyxFQUFXQyxVLEVBQVlDLE8sRUFBUztBQUN4RCxpQkFBSzNCLENBQUwsQ0FBTzRCLE9BQVAsQ0FBZUosVUFBZixFQUEyQkMsU0FBM0IsRUFBc0NDLFVBQXRDO0FBQ0EsZ0JBQUlDLFdBQVcsRUFBZixFQUFtQjtBQUNmLHFCQUFLM0IsQ0FBTCxDQUFPNkIsTUFBUCxDQUFjTCxVQUFkLEVBQTBCQyxTQUExQixFQUFxQ0UsT0FBckM7QUFDSDtBQUNKOzs7Ozs7a0JBRVVoQyxZIiwiZmlsZSI6IkJhc2VWYWxpZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWYWxpZGF0aW9uIGZyb20gJy4vbGlicy92YWxpZGF0aW9uJztcbmNsYXNzIEJhc2VWYWxpZGF0ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGFsbCBpbnN0YW5jZSBtZXRob2RzIGFyZSBpbXBsZW1lbnRlZC5cbiAgICAgICAgaWYgKHRoaXMuc2V0UnVsZSA9PT0gQmFzZVZhbGlkYXRlLnByb3RvdHlwZS5zZXRSdWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGxlYXNlIGltcGxlbWVudCBhYnN0cmFjdCBtZXRob2Qgc2V0UnVsZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2V0QWxpYXMgPT09IEJhc2VWYWxpZGF0ZS5wcm90b3R5cGUuc2V0QWxpYXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQbGVhc2UgaW1wbGVtZW50IGFic3RyYWN0IG1ldGhvZCBzZXRBbGlhcy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52ID0gbmV3IFZhbGlkYXRpb24oKTtcblxuICAgIH1cbiAgICB2YWxpZGF0aW9uQWxsKGRhdGEsIGNhbGxCYWNrKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuc2V0QWxpYXMoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0UnVsZSgpO1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGYudi52YWxpZGF0ZUFsbChkYXRhLCBmdW5jdGlvbiAoZXJyLCBwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsQmFjayAmJiB0eXBlb2YgKGNhbGxCYWNrKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbEJhY2soZXJyLCBwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNhbGxCYWNrKGUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiB2YWxpZGF0ZSBhIGZpZWxkIFxuICAgICAqIEBhdXRob3IgdGhhbmguYmF5XG4gICAgICogQHNpbmNlIDA3LzA5LzIwMThcbiAgICAgKiBAcGFyYW0geyp9IGRhdGEgXG4gICAgICogQHBhcmFtIHsqfSBwYXRoIFxuICAgICAqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXG4gICAgICovXG4gICAgdmFsaWRhdGVPbmUoZGF0YSwgcGF0aCwgY2FsbEJhY2spIHtcbiAgICAgICAgdGhpcy5zZXRBbGlhcygpO1xuICAgICAgICB0aGlzLnNldFJ1bGUoKTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBzZWxmLnYudmFsaWRhdGVPbmUoZGF0YSwgcGF0aCwgZnVuY3Rpb24gKGVyciwgclBhdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChjYWxsQmFjaykgIT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgKGNhbGxCYWNrKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsQmFjayhlcnIsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBbcGF0aF06IGVyci5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBbcGF0aF06IG51bGwgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiB2YWxpZGF0ZSBhbGwgZGF0YSBhdCB0aGUgc2FtZSB0aW1lXG4gICAgICogQGF1dGhvciB0aGFuaC5iYXlcbiAgICAgKiBAc2luY2UgMDYvMDkvMjAxOFxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YSBcbiAgICAgKi9cbiAgICBGTFZhbGlkYXRpb25BbGwoZGF0YSwgY2FsbEJhY2spIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5zZXRBbGlhcygpO1xuICAgICAgICAgICAgdGhpcy5zZXRSdWxlKCk7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi52LkZMVmFsaWRhdGVBbGwoZGF0YSwgZnVuY3Rpb24gKGVycnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAoY2FsbEJhY2spICE9IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIChjYWxsQmFjaykgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhlcnJzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gZXJycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IGVycnNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291bnQgPT0gT2JqZWN0LmtleXMoZXJycykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxCYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxCYWNrKGVycnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbEJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGVycnMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gZXJycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gZXJyc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291bnQgPT0gT2JqZWN0LmtleXMoZXJycykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlcnJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNhbGxCYWNrKGUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRSdWxlKCkge1xuXG4gICAgfVxuICAgIHNldEFsaWFzKCkge1xuXG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBhdXRob3Iga2hhbmgubGVcbiAgICAgKiBAc2luY2UgMDQtMDctMjAxOFxuICAgICAqIEBwYXJhbSB7ZmllbGQgbmFtZX0gZmllbGRfbmFtZSBcbiAgICAgKiBAcGFyYW0ge3J1bGUgbmFtZX0gcnVsZV9uYW1lIFxuICAgICAqIEBwYXJhbSB7cnVsZSB2YWx1ZSB9IHJ1bGVfdmFsdWUgXG4gICAgICogQHBhcmFtIHtrZXkgbWVzc2FnZX0ga2V5X21zZyBcbiAgICAgKi9cbiAgICBhZGRSdWxlRm9yRmllbGQoZmllbGRfbmFtZSwgcnVsZV9uYW1lLCBydWxlX3ZhbHVlLCBrZXlfbXNnKSB7XG4gICAgICAgIHRoaXMudi5hZGRSdWxlKGZpZWxkX25hbWUsIHJ1bGVfbmFtZSwgcnVsZV92YWx1ZSk7XG4gICAgICAgIGlmIChrZXlfbXNnICE9ICcnKSB7XG4gICAgICAgICAgICB0aGlzLnYuc2V0TXNnKGZpZWxkX25hbWUsIHJ1bGVfbmFtZSwga2V5X21zZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBCYXNlVmFsaWRhdGU7Il19