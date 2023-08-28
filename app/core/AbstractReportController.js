"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseAbstractController = require("./BaseAbstractController");

var _BaseAbstractController2 = _interopRequireDefault(_BaseAbstractController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AbstractReportController = function (_BaseAbstractControll) {
	_inherits(AbstractReportController, _BaseAbstractControll);

	function AbstractReportController() {
		_classCallCheck(this, AbstractReportController);

		var _this = _possibleConstructorReturn(this, (AbstractReportController.__proto__ || Object.getPrototypeOf(AbstractReportController)).call(this));

		if (_this.constructor === AbstractReportController) {
			throw new TypeError("Can not construct abstract class.");
		}
		if (_this.getList === AbstractReportController.prototype.getList) {
			throw new TypeError("Please implement abstract method getList.");
		}

		if (_this.printAction === AbstractReportController.prototype.printAction) {
			throw new TypeError("Please implement abstract method printAction.");
		}

		if (_this.exportExcel === AbstractReportController.prototype.exportExcel) {
			throw new TypeError("Please implement abstract method getList.");
		}

		if (_this.exportPdf === AbstractReportController.prototype.exportPdf) {
			throw new TypeError("Please implement abstract method getList.");
		}

		return _this;
	}

	/**
  * ActionForward printAction
  * @param httprespone res
  * @param postData
  */


	_createClass(AbstractReportController, [{
		key: "printAction",
		value: function printAction(res, postData) {
			throw new TypeError("Do not call abstract method printAction from child.");
		}
		/**
   * ActionForward exportExcel
   * @param httprespone res
   * @param postData
   */

	}, {
		key: "exportExcel",
		value: function exportExcel(res, postData) {
			throw new TypeError("Do not call abstract method exportExcel from child.");
		}
		/**
   * ActionForward exportPdf
   * @param httprespone res
   * @param postData
   */

	}, {
		key: "exportPdf",
		value: function exportPdf(res, postData) {
			throw new TypeError("Do not call abstract method exportPdf from child.");
		}
		/**
     * function getList
     * @param objE
     */

	}, {
		key: "getList",
		value: function getList(objE) {
			throw new TypeError("Do not call abstract method getList from child.");
		}
	}, {
		key: "checkPermission",
		value: function checkPermission(action) {
			if (this.userE == null) {
				console.log("null user");
				return false;
			}
			var permission = this.userE.permissions;
			if (permission == null) {
				console.log("null permission");
				return false;
			}
			var auth = permission[this.pathReferer];
			//console.log("auth: ",auth)
			return Libs.checkBitOnOff(auth, action);
		}
	}, {
		key: "checkPermissions",
		value: function checkPermissions(method, postData) {
			if (Libs.isBlank(method)) {
				return false;
			}
			switch (method) {
				case "exportPdf":
					return this.checkPermission(Constants.auth_mode.PDF);
				case "exportExcel":
					return this.checkPermission(Constants.auth_mode.EXCEL);
				case "printAction":
					return this.checkPermission(Constants.auth_mode.PRINT);
				default:
					return true;
			}
		}
	}]);

	return AbstractReportController;
}(_BaseAbstractController2.default);

exports.default = AbstractReportController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL0Fic3RyYWN0UmVwb3J0Q29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJBYnN0cmFjdFJlcG9ydENvbnRyb2xsZXIiLCJjb25zdHJ1Y3RvciIsIlR5cGVFcnJvciIsImdldExpc3QiLCJwcm90b3R5cGUiLCJwcmludEFjdGlvbiIsImV4cG9ydEV4Y2VsIiwiZXhwb3J0UGRmIiwicmVzIiwicG9zdERhdGEiLCJvYmpFIiwiYWN0aW9uIiwidXNlckUiLCJjb25zb2xlIiwibG9nIiwicGVybWlzc2lvbiIsInBlcm1pc3Npb25zIiwiYXV0aCIsInBhdGhSZWZlcmVyIiwiTGlicyIsImNoZWNrQml0T25PZmYiLCJtZXRob2QiLCJpc0JsYW5rIiwiY2hlY2tQZXJtaXNzaW9uIiwiQ29uc3RhbnRzIiwiYXV0aF9tb2RlIiwiUERGIiwiRVhDRUwiLCJQUklOVCIsIkJhc2VBYnN0cmFjdENvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSx3Qjs7O0FBQ0wscUNBQWM7QUFBQTs7QUFBQTs7QUFFYixNQUFJLE1BQUtDLFdBQUwsS0FBcUJELHdCQUF6QixFQUFtRDtBQUNsRCxTQUFNLElBQUlFLFNBQUosQ0FBYyxtQ0FBZCxDQUFOO0FBQ0E7QUFDRCxNQUFJLE1BQUtDLE9BQUwsS0FBaUJILHlCQUF5QkksU0FBekIsQ0FBbUNELE9BQXhELEVBQWlFO0FBQ2hFLFNBQU0sSUFBSUQsU0FBSixDQUFjLDJDQUFkLENBQU47QUFDQTs7QUFFRCxNQUFJLE1BQUtHLFdBQUwsS0FBcUJMLHlCQUF5QkksU0FBekIsQ0FBbUNDLFdBQTVELEVBQXlFO0FBQ3hFLFNBQU0sSUFBSUgsU0FBSixDQUFjLCtDQUFkLENBQU47QUFDQTs7QUFFRCxNQUFJLE1BQUtJLFdBQUwsS0FBcUJOLHlCQUF5QkksU0FBekIsQ0FBbUNFLFdBQTVELEVBQXlFO0FBQ3hFLFNBQU0sSUFBSUosU0FBSixDQUFjLDJDQUFkLENBQU47QUFDQTs7QUFFRCxNQUFJLE1BQUtLLFNBQUwsS0FBbUJQLHlCQUF5QkksU0FBekIsQ0FBbUNHLFNBQTFELEVBQXFFO0FBQ3BFLFNBQU0sSUFBSUwsU0FBSixDQUFjLDJDQUFkLENBQU47QUFDQTs7QUFuQlk7QUFxQmI7O0FBRUQ7Ozs7Ozs7Ozs4QkFLWU0sRyxFQUFLQyxRLEVBQVU7QUFDMUIsU0FBTSxJQUFJUCxTQUFKLENBQWMscURBQWQsQ0FBTjtBQUNBO0FBQ0Q7Ozs7Ozs7OzhCQUtZTSxHLEVBQUtDLFEsRUFBVTtBQUMxQixTQUFNLElBQUlQLFNBQUosQ0FBYyxxREFBZCxDQUFOO0FBQ0E7QUFDRDs7Ozs7Ozs7NEJBS1VNLEcsRUFBS0MsUSxFQUFVO0FBQ3hCLFNBQU0sSUFBSVAsU0FBSixDQUFjLG1EQUFkLENBQU47QUFDQTtBQUNEOzs7Ozs7OzBCQUlRUSxJLEVBQU07QUFDYixTQUFNLElBQUlSLFNBQUosQ0FBYyxpREFBZCxDQUFOO0FBQ0E7OztrQ0FDZVMsTSxFQUFRO0FBQ3ZCLE9BQUksS0FBS0MsS0FBTCxJQUFjLElBQWxCLEVBQXdCO0FBQ3ZCQyxZQUFRQyxHQUFSLENBQVksV0FBWjtBQUNDLFdBQU8sS0FBUDtBQUNEO0FBQ0QsT0FBSUMsYUFBYSxLQUFLSCxLQUFMLENBQVdJLFdBQTVCO0FBQ0EsT0FBSUQsY0FBYyxJQUFsQixFQUF3QjtBQUN2QkYsWUFBUUMsR0FBUixDQUFZLGlCQUFaO0FBQ0MsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxPQUFJRyxPQUFPRixXQUFXLEtBQUtHLFdBQWhCLENBQVg7QUFDQTtBQUNBLFVBQU9DLEtBQUtDLGFBQUwsQ0FBbUJILElBQW5CLEVBQXlCTixNQUF6QixDQUFQO0FBQ0E7OzttQ0FDZ0JVLE0sRUFBT1osUSxFQUFTO0FBQ2hDLE9BQUdVLEtBQUtHLE9BQUwsQ0FBYUQsTUFBYixDQUFILEVBQXdCO0FBQ3ZCLFdBQU8sS0FBUDtBQUNBO0FBQ0QsV0FBT0EsTUFBUDtBQUNDLFNBQUssV0FBTDtBQUNDLFlBQU8sS0FBS0UsZUFBTCxDQUFxQkMsVUFBVUMsU0FBVixDQUFvQkMsR0FBekMsQ0FBUDtBQUNELFNBQUssYUFBTDtBQUNDLFlBQU8sS0FBS0gsZUFBTCxDQUFxQkMsVUFBVUMsU0FBVixDQUFvQkUsS0FBekMsQ0FBUDtBQUNELFNBQUssYUFBTDtBQUNDLFlBQU8sS0FBS0osZUFBTCxDQUFxQkMsVUFBVUMsU0FBVixDQUFvQkcsS0FBekMsQ0FBUDtBQUNEO0FBQ0MsWUFBTyxJQUFQO0FBUkY7QUFVQTs7OztFQW5GcUNDLGdDOztrQkFxRnhCN0Isd0IiLCJmaWxlIjoiQWJzdHJhY3RSZXBvcnRDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VBYnN0cmFjdENvbnRyb2xsZXIgZnJvbSBcIi4vQmFzZUFic3RyYWN0Q29udHJvbGxlclwiO1xuY2xhc3MgQWJzdHJhY3RSZXBvcnRDb250cm9sbGVyIGV4dGVuZHMgQmFzZUFic3RyYWN0Q29udHJvbGxlciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0aWYgKHRoaXMuY29uc3RydWN0b3IgPT09IEFic3RyYWN0UmVwb3J0Q29udHJvbGxlcikge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbiBub3QgY29uc3RydWN0IGFic3RyYWN0IGNsYXNzLlwiKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuZ2V0TGlzdCA9PT0gQWJzdHJhY3RSZXBvcnRDb250cm9sbGVyLnByb3RvdHlwZS5nZXRMaXN0KSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGxlYXNlIGltcGxlbWVudCBhYnN0cmFjdCBtZXRob2QgZ2V0TGlzdC5cIik7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucHJpbnRBY3Rpb24gPT09IEFic3RyYWN0UmVwb3J0Q29udHJvbGxlci5wcm90b3R5cGUucHJpbnRBY3Rpb24pIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJQbGVhc2UgaW1wbGVtZW50IGFic3RyYWN0IG1ldGhvZCBwcmludEFjdGlvbi5cIik7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuZXhwb3J0RXhjZWwgPT09IEFic3RyYWN0UmVwb3J0Q29udHJvbGxlci5wcm90b3R5cGUuZXhwb3J0RXhjZWwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJQbGVhc2UgaW1wbGVtZW50IGFic3RyYWN0IG1ldGhvZCBnZXRMaXN0LlwiKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5leHBvcnRQZGYgPT09IEFic3RyYWN0UmVwb3J0Q29udHJvbGxlci5wcm90b3R5cGUuZXhwb3J0UGRmKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGxlYXNlIGltcGxlbWVudCBhYnN0cmFjdCBtZXRob2QgZ2V0TGlzdC5cIik7XG5cdFx0fVxuXG5cdH1cblx0XG5cdC8qKlxuXHQgKiBBY3Rpb25Gb3J3YXJkIHByaW50QWN0aW9uXG5cdCAqIEBwYXJhbSBodHRwcmVzcG9uZSByZXNcblx0ICogQHBhcmFtIHBvc3REYXRhXG5cdCAqL1xuXHRwcmludEFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIkRvIG5vdCBjYWxsIGFic3RyYWN0IG1ldGhvZCBwcmludEFjdGlvbiBmcm9tIGNoaWxkLlwiKTtcblx0fVxuXHQvKipcblx0ICogQWN0aW9uRm9yd2FyZCBleHBvcnRFeGNlbFxuXHQgKiBAcGFyYW0gaHR0cHJlc3BvbmUgcmVzXG5cdCAqIEBwYXJhbSBwb3N0RGF0YVxuXHQgKi9cblx0ZXhwb3J0RXhjZWwocmVzLCBwb3N0RGF0YSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJEbyBub3QgY2FsbCBhYnN0cmFjdCBtZXRob2QgZXhwb3J0RXhjZWwgZnJvbSBjaGlsZC5cIik7XG5cdH1cblx0LyoqXG5cdCAqIEFjdGlvbkZvcndhcmQgZXhwb3J0UGRmXG5cdCAqIEBwYXJhbSBodHRwcmVzcG9uZSByZXNcblx0ICogQHBhcmFtIHBvc3REYXRhXG5cdCAqL1xuXHRleHBvcnRQZGYocmVzLCBwb3N0RGF0YSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJEbyBub3QgY2FsbCBhYnN0cmFjdCBtZXRob2QgZXhwb3J0UGRmIGZyb20gY2hpbGQuXCIpO1xuXHR9XG5cdC8qKlxuXHQgICAqIGZ1bmN0aW9uIGdldExpc3Rcblx0ICAgKiBAcGFyYW0gb2JqRVxuXHQgICAqL1xuXHRnZXRMaXN0KG9iakUpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiRG8gbm90IGNhbGwgYWJzdHJhY3QgbWV0aG9kIGdldExpc3QgZnJvbSBjaGlsZC5cIik7XG5cdH1cblx0Y2hlY2tQZXJtaXNzaW9uKGFjdGlvbikge1xuXHRcdGlmICh0aGlzLnVzZXJFID09IG51bGwpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwibnVsbCB1c2VyXCIpXG5cdFx0ICByZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGxldCBwZXJtaXNzaW9uID0gdGhpcy51c2VyRS5wZXJtaXNzaW9ucztcblx0XHRpZiAocGVybWlzc2lvbiA9PSBudWxsKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIm51bGwgcGVybWlzc2lvblwiKVxuXHRcdCAgcmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRsZXQgYXV0aCA9IHBlcm1pc3Npb25bdGhpcy5wYXRoUmVmZXJlcl07XG5cdFx0Ly9jb25zb2xlLmxvZyhcImF1dGg6IFwiLGF1dGgpXG5cdFx0cmV0dXJuIExpYnMuY2hlY2tCaXRPbk9mZihhdXRoLCBhY3Rpb24pO1xuXHR9XG5cdGNoZWNrUGVybWlzc2lvbnMobWV0aG9kLHBvc3REYXRhKXtcblx0XHRpZihMaWJzLmlzQmxhbmsobWV0aG9kKSl7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHN3aXRjaChtZXRob2Qpe1xuXHRcdFx0Y2FzZSBcImV4cG9ydFBkZlwiOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jaGVja1Blcm1pc3Npb24oQ29uc3RhbnRzLmF1dGhfbW9kZS5QREYpO1xuXHRcdFx0Y2FzZSBcImV4cG9ydEV4Y2VsXCI6XG5cdFx0XHRcdHJldHVybiB0aGlzLmNoZWNrUGVybWlzc2lvbihDb25zdGFudHMuYXV0aF9tb2RlLkVYQ0VMKTtcblx0XHRcdGNhc2UgXCJwcmludEFjdGlvblwiOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jaGVja1Blcm1pc3Npb24oQ29uc3RhbnRzLmF1dGhfbW9kZS5QUklOVCk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0UmVwb3J0Q29udHJvbGxlcjsiXX0=