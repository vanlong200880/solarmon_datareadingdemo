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

var AbstractManagerController = function (_BaseAbstractControll) {
	_inherits(AbstractManagerController, _BaseAbstractControll);

	function AbstractManagerController() {
		_classCallCheck(this, AbstractManagerController);

		var _this = _possibleConstructorReturn(this, (AbstractManagerController.__proto__ || Object.getPrototypeOf(AbstractManagerController)).call(this));

		if (_this.constructor === AbstractManagerController) {
			// Error Type 1. Abstract class can not be constructed.
			throw new TypeError("Can not construct abstract class.");
		}
		// else (called from child)
		// Check if all instance methods are implemented.
		if (_this.deleteAction === AbstractManagerController.prototype.deleteAction) {
			// Error Type 4. Child has not implemented this abstract method.
			throw new TypeError("Please implement abstract method deleteAction.");
		}
		if (_this.saveAction === AbstractManagerController.prototype.saveAction) {
			// Error Type 4. Child has not implemented this abstract method.
			throw new TypeError("Please implement abstract method saveAction.");
		}

		if (_this.getList === AbstractManagerController.prototype.getList) {
			// Error Type 4. Child has not implemented this abstract method.
			throw new TypeError("Please implement abstract method getList.");
		}

		if (_this.getDetail === AbstractManagerController.prototype.getDetail) {
			// Error Type 4. Child has not implemented this abstract method.
			throw new TypeError("Please implement abstract method getDetail.");
		}
		return _this;
	}

	_createClass(AbstractManagerController, [{
		key: "validate",
		value: function validate() {}

		/**
   * ActionForward deleteAction
   * @param httprespone res
   * @param postData
   */

	}, {
		key: "deleteAction",
		value: function deleteAction(res, postData) {
			throw new TypeError("Do not call abstract method deleteAction from child.");
		}
		/**
     * ActionForward saveAction
     * @param httprespone res
     * @param postData
     */

	}, {
		key: "saveAction",
		value: function saveAction(res, postData) {
			throw new TypeError("Do not call abstract method saveAction from child.");
		}

		/**
   * ActionForward printAction
   * @param httprespone res
   * @param postData
   */

	}, {
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
		/**
     * function getDetail
     * @param objE
     */

	}, {
		key: "getDetail",
		value: function getDetail(objE) {
			throw new TypeError("Do not call abstract method getObject from child.");
		}
	}, {
		key: "checkPermission",
		value: function checkPermission(action) {
			try {
				if (this.userE == null) {
					return false;
				}
				var permission = JSON.parse(this.userE.permissions.permissions);

				if (permission == null) {
					return false;
				}

				var pathReferer = this.pathReferer;
				var projectPath = this.pathReferer.substr(0, 9);
				if (projectPath === '/project/') {
					pathReferer = projectPath + ":id";
				} else if (projectPath === '/private/') {
					pathReferer = projectPath + ":id";
				}

				var auth = permission[pathReferer];
				return Libs.checkBitOnOff(auth.auth, action);
			} catch (e) {
				return false;
			}
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
				// case "deleteAction":
				// 	return this.checkPermission(Constants.auth_mode.DEL);
				// case "saveAction":
				// console.log("postData.screen_mode: ", postData.screen_mode)
				// 	if (postData.hasOwnProperty('screen_mode') && postData.screen_mode == Constants.screen_mode.insert) {
				// 		return this.checkPermission(Constants.auth_mode.NEW);
				// 	}else if(postData.hasOwnProperty('screen_mode') && postData.screen_mode == Constants.screen_mode.update){
				// 		return this.checkPermission(Constants.auth_mode.EDIT);
				// 	}else{
				// 		return false;
				// 	}
				default:
					return true;
			}
		}
	}]);

	return AbstractManagerController;
}(_BaseAbstractController2.default);

exports.default = AbstractManagerController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL0Fic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciIsImNvbnN0cnVjdG9yIiwiVHlwZUVycm9yIiwiZGVsZXRlQWN0aW9uIiwicHJvdG90eXBlIiwic2F2ZUFjdGlvbiIsImdldExpc3QiLCJnZXREZXRhaWwiLCJyZXMiLCJwb3N0RGF0YSIsIm9iakUiLCJhY3Rpb24iLCJ1c2VyRSIsInBlcm1pc3Npb24iLCJKU09OIiwicGFyc2UiLCJwZXJtaXNzaW9ucyIsInBhdGhSZWZlcmVyIiwicHJvamVjdFBhdGgiLCJzdWJzdHIiLCJhdXRoIiwiTGlicyIsImNoZWNrQml0T25PZmYiLCJlIiwibWV0aG9kIiwiaXNCbGFuayIsImNoZWNrUGVybWlzc2lvbiIsIkNvbnN0YW50cyIsImF1dGhfbW9kZSIsIlBERiIsIkVYQ0VMIiwiUFJJTlQiLCJCYXNlQWJzdHJhY3RDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFDTUEseUI7OztBQUNMLHNDQUFjO0FBQUE7O0FBQUE7O0FBRWIsTUFBSSxNQUFLQyxXQUFMLEtBQXFCRCx5QkFBekIsRUFBb0Q7QUFDbkQ7QUFDQSxTQUFNLElBQUlFLFNBQUosQ0FBYyxtQ0FBZCxDQUFOO0FBQ0E7QUFDRDtBQUNBO0FBQ0EsTUFBSSxNQUFLQyxZQUFMLEtBQXNCSCwwQkFBMEJJLFNBQTFCLENBQW9DRCxZQUE5RCxFQUE0RTtBQUMzRTtBQUNBLFNBQU0sSUFBSUQsU0FBSixDQUFjLGdEQUFkLENBQU47QUFDQTtBQUNELE1BQUksTUFBS0csVUFBTCxLQUFvQkwsMEJBQTBCSSxTQUExQixDQUFvQ0MsVUFBNUQsRUFBd0U7QUFDdkU7QUFDQSxTQUFNLElBQUlILFNBQUosQ0FBYyw4Q0FBZCxDQUFOO0FBQ0E7O0FBRUQsTUFBSSxNQUFLSSxPQUFMLEtBQWlCTiwwQkFBMEJJLFNBQTFCLENBQW9DRSxPQUF6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IEJhc2VBYnN0cmFjdENvbnRyb2xsZXIgZnJvbSBcIi4vQmFzZUFic3RyYWN0Q29udHJvbGxlclwiO1xuY2xhc3MgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciBleHRlbmRzIEJhc2VBYnN0cmFjdENvbnRyb2xsZXIge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdGlmICh0aGlzLmNvbnN0cnVjdG9yID09PSBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyKSB7XG5cdFx0XHQvLyBFcnJvciBUeXBlIDEuIEFic3RyYWN0IGNsYXNzIGNhbiBub3QgYmUgY29uc3RydWN0ZWQuXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2FuIG5vdCBjb25zdHJ1Y3QgYWJzdHJhY3QgY2xhc3MuXCIpO1xuXHRcdH1cblx0XHQvLyBlbHNlIChjYWxsZWQgZnJvbSBjaGlsZClcblx0XHQvLyBDaGVjayBpZiBhbGwgaW5zdGFuY2UgbWV0aG9kcyBhcmUgaW1wbGVtZW50ZWQuXG5cdFx0aWYgKHRoaXMuZGVsZXRlQWN0aW9uID09PSBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyLnByb3RvdHlwZS5kZWxldGVBY3Rpb24pIHtcblx0XHRcdC8vIEVycm9yIFR5cGUgNC4gQ2hpbGQgaGFzIG5vdCBpbXBsZW1lbnRlZCB0aGlzIGFic3RyYWN0IG1ldGhvZC5cblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJQbGVhc2UgaW1wbGVtZW50IGFic3RyYWN0IG1ldGhvZCBkZWxldGVBY3Rpb24uXCIpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5zYXZlQWN0aW9uID09PSBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyLnByb3RvdHlwZS5zYXZlQWN0aW9uKSB7XG5cdFx0XHQvLyBFcnJvciBUeXBlIDQuIENoaWxkIGhhcyBub3QgaW1wbGVtZW50ZWQgdGhpcyBhYnN0cmFjdCBtZXRob2QuXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGxlYXNlIGltcGxlbWVudCBhYnN0cmFjdCBtZXRob2Qgc2F2ZUFjdGlvbi5cIik7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuZ2V0TGlzdCA9PT0gQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0TGlzdCkge1xuXHRcdFx0Ly8gRXJyb3IgVHlwZSA0LiBDaGlsZCBoYXMgbm90IGltcGxlbWVudGVkIHRoaXMgYWJzdHJhY3QgbWV0aG9kLlxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIlBsZWFzZSBpbXBsZW1lbnQgYWJzdHJhY3QgbWV0aG9kIGdldExpc3QuXCIpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmdldERldGFpbCA9PT0gQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0RGV0YWlsKSB7XG5cdFx0XHQvLyBFcnJvciBUeXBlIDQuIENoaWxkIGhhcyBub3QgaW1wbGVtZW50ZWQgdGhpcyBhYnN0cmFjdCBtZXRob2QuXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGxlYXNlIGltcGxlbWVudCBhYnN0cmFjdCBtZXRob2QgZ2V0RGV0YWlsLlwiKTtcblx0XHR9XG5cdH1cblx0dmFsaWRhdGUoKSB7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBBY3Rpb25Gb3J3YXJkIGRlbGV0ZUFjdGlvblxuXHQgKiBAcGFyYW0gaHR0cHJlc3BvbmUgcmVzXG5cdCAqIEBwYXJhbSBwb3N0RGF0YVxuXHQgKi9cblx0ZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiRG8gbm90IGNhbGwgYWJzdHJhY3QgbWV0aG9kIGRlbGV0ZUFjdGlvbiBmcm9tIGNoaWxkLlwiKTtcblx0fVxuXHQvKipcblx0ICAgKiBBY3Rpb25Gb3J3YXJkIHNhdmVBY3Rpb25cblx0ICAgKiBAcGFyYW0gaHR0cHJlc3BvbmUgcmVzXG5cdCAgICogQHBhcmFtIHBvc3REYXRhXG5cdCAgICovXG5cdHNhdmVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJEbyBub3QgY2FsbCBhYnN0cmFjdCBtZXRob2Qgc2F2ZUFjdGlvbiBmcm9tIGNoaWxkLlwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBY3Rpb25Gb3J3YXJkIHByaW50QWN0aW9uXG5cdCAqIEBwYXJhbSBodHRwcmVzcG9uZSByZXNcblx0ICogQHBhcmFtIHBvc3REYXRhXG5cdCAqL1xuXHRwcmludEFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIkRvIG5vdCBjYWxsIGFic3RyYWN0IG1ldGhvZCBwcmludEFjdGlvbiBmcm9tIGNoaWxkLlwiKTtcblx0fVxuXHQvKipcblx0ICogQWN0aW9uRm9yd2FyZCBleHBvcnRFeGNlbFxuXHQgKiBAcGFyYW0gaHR0cHJlc3BvbmUgcmVzXG5cdCAqIEBwYXJhbSBwb3N0RGF0YVxuXHQgKi9cblx0ZXhwb3J0RXhjZWwocmVzLCBwb3N0RGF0YSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJEbyBub3QgY2FsbCBhYnN0cmFjdCBtZXRob2QgZXhwb3J0RXhjZWwgZnJvbSBjaGlsZC5cIik7XG5cdH1cblx0LyoqXG5cdCAqIEFjdGlvbkZvcndhcmQgZXhwb3J0UGRmXG5cdCAqIEBwYXJhbSBodHRwcmVzcG9uZSByZXNcblx0ICogQHBhcmFtIHBvc3REYXRhXG5cdCAqL1xuXHRleHBvcnRQZGYocmVzLCBwb3N0RGF0YSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJEbyBub3QgY2FsbCBhYnN0cmFjdCBtZXRob2QgZXhwb3J0UGRmIGZyb20gY2hpbGQuXCIpO1xuXHR9XG5cdC8qKlxuXHQgICAqIGZ1bmN0aW9uIGdldExpc3Rcblx0ICAgKiBAcGFyYW0gb2JqRVxuXHQgICAqL1xuXHRnZXRMaXN0KG9iakUpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiRG8gbm90IGNhbGwgYWJzdHJhY3QgbWV0aG9kIGdldExpc3QgZnJvbSBjaGlsZC5cIik7XG5cdH1cblx0LyoqXG5cdCAgICogZnVuY3Rpb24gZ2V0RGV0YWlsXG5cdCAgICogQHBhcmFtIG9iakVcblx0ICAgKi9cblx0Z2V0RGV0YWlsKG9iakUpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiRG8gbm90IGNhbGwgYWJzdHJhY3QgbWV0aG9kIGdldE9iamVjdCBmcm9tIGNoaWxkLlwiKTtcblx0fVxuXHRjaGVja1Blcm1pc3Npb24oYWN0aW9uKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICh0aGlzLnVzZXJFID09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0bGV0IHBlcm1pc3Npb24gPSBKU09OLnBhcnNlKHRoaXMudXNlckUucGVybWlzc2lvbnMucGVybWlzc2lvbnMpO1xuXG5cdFx0XHRpZiAocGVybWlzc2lvbiA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHBhdGhSZWZlcmVyID0gdGhpcy5wYXRoUmVmZXJlcjtcblx0XHRcdHZhciBwcm9qZWN0UGF0aCA9IHRoaXMucGF0aFJlZmVyZXIuc3Vic3RyKDAsIDkpO1xuXHRcdFx0aWYocHJvamVjdFBhdGggPT09ICcvcHJvamVjdC8nKXtcblx0XHRcdFx0cGF0aFJlZmVyZXIgPSBwcm9qZWN0UGF0aCArIFwiOmlkXCI7XG5cdFx0XHR9IGVsc2UgaWYocHJvamVjdFBhdGggPT09ICcvcHJpdmF0ZS8nKXtcblx0XHRcdFx0cGF0aFJlZmVyZXIgPSBwcm9qZWN0UGF0aCArIFwiOmlkXCI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGxldCBhdXRoID0gcGVybWlzc2lvbltwYXRoUmVmZXJlcl07XG5cdFx0XHRyZXR1cm4gTGlicy5jaGVja0JpdE9uT2ZmKGF1dGguYXV0aCwgYWN0aW9uKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdGNoZWNrUGVybWlzc2lvbnMobWV0aG9kLCBwb3N0RGF0YSkge1xuXHRcdGlmIChMaWJzLmlzQmxhbmsobWV0aG9kKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRzd2l0Y2ggKG1ldGhvZCkge1xuXHRcdFx0Y2FzZSBcImV4cG9ydFBkZlwiOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jaGVja1Blcm1pc3Npb24oQ29uc3RhbnRzLmF1dGhfbW9kZS5QREYpO1xuXHRcdFx0Y2FzZSBcImV4cG9ydEV4Y2VsXCI6XG5cdFx0XHRcdHJldHVybiB0aGlzLmNoZWNrUGVybWlzc2lvbihDb25zdGFudHMuYXV0aF9tb2RlLkVYQ0VMKTtcblx0XHRcdGNhc2UgXCJwcmludEFjdGlvblwiOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jaGVja1Blcm1pc3Npb24oQ29uc3RhbnRzLmF1dGhfbW9kZS5QUklOVCk7XG5cdFx0XHQvLyBjYXNlIFwiZGVsZXRlQWN0aW9uXCI6XG5cdFx0XHQvLyBcdHJldHVybiB0aGlzLmNoZWNrUGVybWlzc2lvbihDb25zdGFudHMuYXV0aF9tb2RlLkRFTCk7XG5cdFx0XHQvLyBjYXNlIFwic2F2ZUFjdGlvblwiOlxuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJwb3N0RGF0YS5zY3JlZW5fbW9kZTogXCIsIHBvc3REYXRhLnNjcmVlbl9tb2RlKVxuXHRcdFx0Ly8gXHRpZiAocG9zdERhdGEuaGFzT3duUHJvcGVydHkoJ3NjcmVlbl9tb2RlJykgJiYgcG9zdERhdGEuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLmluc2VydCkge1xuXHRcdFx0Ly8gXHRcdHJldHVybiB0aGlzLmNoZWNrUGVybWlzc2lvbihDb25zdGFudHMuYXV0aF9tb2RlLk5FVyk7XG5cdFx0XHQvLyBcdH1lbHNlIGlmKHBvc3REYXRhLmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIHBvc3REYXRhLnNjcmVlbl9tb2RlID09IENvbnN0YW50cy5zY3JlZW5fbW9kZS51cGRhdGUpe1xuXHRcdFx0Ly8gXHRcdHJldHVybiB0aGlzLmNoZWNrUGVybWlzc2lvbihDb25zdGFudHMuYXV0aF9tb2RlLkVESVQpO1xuXHRcdFx0Ly8gXHR9ZWxzZXtcblx0XHRcdC8vIFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHQvLyBcdH1cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlcjsiXX0=