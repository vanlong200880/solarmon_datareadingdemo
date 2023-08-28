"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require("./BaseController");

var _BaseController3 = _interopRequireDefault(_BaseController2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseAbstractController = function (_BaseController) {
  _inherits(BaseAbstractController, _BaseController);

  function BaseAbstractController() {
    _classCallCheck(this, BaseAbstractController);

    var _this = _possibleConstructorReturn(this, (BaseAbstractController.__proto__ || Object.getPrototypeOf(BaseAbstractController)).call(this));

    if (_this.constructor === BaseAbstractController) {
      // Error Type 1. Abstract class can not be constructed.
      throw new TypeError("Can not construct abstract class.");
    }
    // Check if all instance methods are implemented.
    // if (this.checkPermission === BaseAbstractController.prototype.checkPermission) {
    //   throw new TypeError("Please implement abstract method checkPermission.");
    // }
    // if (this.pageLoadAction === BaseAbstractController.prototype.pageLoadAction) {
    //     throw new TypeError("Please implement abstract method pageLoadAction.");
    //   }
    return _this;
  }

  /**
   * ActionForward onload page 
   * @param httprespone res
   * @param postData
   */


  _createClass(BaseAbstractController, [{
    key: "pageLoadAction",
    value: function pageLoadAction(res, postData) {
      throw new TypeError("Do not call abstract method pageLoadAction from child.");
    }
  }]);

  return BaseAbstractController;
}(_BaseController3.default);

exports.default = BaseAbstractController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL0Jhc2VBYnN0cmFjdENvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiQmFzZUFic3RyYWN0Q29udHJvbGxlciIsImNvbnN0cnVjdG9yIiwiVHlwZUVycm9yIiwicmVzIiwicG9zdERhdGEiLCJCYXNlQ29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLHNCOzs7QUFDSixvQ0FBYztBQUFBOztBQUFBOztBQUVaLFFBQUksTUFBS0MsV0FBTCxLQUFxQkQsc0JBQXpCLEVBQWlEO0FBQy9DO0FBQ0EsWUFBTSxJQUFJRSxTQUFKLENBQWMsbUNBQWQsQ0FBTjtBQUNEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFaWTtBQWFiOztBQUVEOzs7Ozs7Ozs7bUNBS2VDLEcsRUFBS0MsUSxFQUFTO0FBQzVCLFlBQU0sSUFBSUYsU0FBSixDQUFjLHdEQUFkLENBQU47QUFDQTs7OztFQXZCa0NHLHdCOztrQkF5QnRCTCxzQiIsImZpbGUiOiJCYXNlQWJzdHJhY3RDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VDb250cm9sbGVyIGZyb20gJy4vQmFzZUNvbnRyb2xsZXInO1xuY2xhc3MgQmFzZUFic3RyYWN0Q29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAodGhpcy5jb25zdHJ1Y3RvciA9PT0gQmFzZUFic3RyYWN0Q29udHJvbGxlcikge1xuICAgICAgLy8gRXJyb3IgVHlwZSAxLiBBYnN0cmFjdCBjbGFzcyBjYW4gbm90IGJlIGNvbnN0cnVjdGVkLlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbiBub3QgY29uc3RydWN0IGFic3RyYWN0IGNsYXNzLlwiKTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgYWxsIGluc3RhbmNlIG1ldGhvZHMgYXJlIGltcGxlbWVudGVkLlxuICAgIC8vIGlmICh0aGlzLmNoZWNrUGVybWlzc2lvbiA9PT0gQmFzZUFic3RyYWN0Q29udHJvbGxlci5wcm90b3R5cGUuY2hlY2tQZXJtaXNzaW9uKSB7XG4gICAgLy8gICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGxlYXNlIGltcGxlbWVudCBhYnN0cmFjdCBtZXRob2QgY2hlY2tQZXJtaXNzaW9uLlwiKTtcbiAgICAvLyB9XG4gICAgLy8gaWYgKHRoaXMucGFnZUxvYWRBY3Rpb24gPT09IEJhc2VBYnN0cmFjdENvbnRyb2xsZXIucHJvdG90eXBlLnBhZ2VMb2FkQWN0aW9uKSB7XG4gICAgLy8gICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQbGVhc2UgaW1wbGVtZW50IGFic3RyYWN0IG1ldGhvZCBwYWdlTG9hZEFjdGlvbi5cIik7XG4gICAgLy8gICB9XG4gIH1cblxuICAvKipcbiAgICogQWN0aW9uRm9yd2FyZCBvbmxvYWQgcGFnZSBcbiAgICogQHBhcmFtIGh0dHByZXNwb25lIHJlc1xuICAgKiBAcGFyYW0gcG9zdERhdGFcbiAgICovXG4gIHBhZ2VMb2FkQWN0aW9uKHJlcywgcG9zdERhdGEpe1xuXHQgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJEbyBub3QgY2FsbCBhYnN0cmFjdCBtZXRob2QgcGFnZUxvYWRBY3Rpb24gZnJvbSBjaGlsZC5cIik7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEJhc2VBYnN0cmFjdENvbnRyb2xsZXI7Il19