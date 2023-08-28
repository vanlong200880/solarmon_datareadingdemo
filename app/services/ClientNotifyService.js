"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require("./BaseService");

var _BaseService3 = _interopRequireDefault(_BaseService2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClientNotifyService = function (_BaseService) {
	_inherits(ClientNotifyService, _BaseService);

	function ClientNotifyService() {
		_classCallCheck(this, ClientNotifyService);

		return _possibleConstructorReturn(this, (ClientNotifyService.__proto__ || Object.getPrototypeOf(ClientNotifyService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 12/09/2021
  * @param {Object} data
  * @param {function callback} callback 
  */

	_createClass(ClientNotifyService, [{
		key: "getList",
		value: function getList(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var errorLevel = data.errorLevel;
					var errorLevelList = [];
					if (errorLevel.length > 0) {
						for (var i = 0; i < errorLevel.length; i++) {
							errorLevelList.push(errorLevel[i].id);
						}
					}
					data.errorLevelList = errorLevelList.toString();

					var errorType = data.errorType;
					var errorTypeList = [];
					if (errorType.length > 0) {
						for (var _i = 0; _i < errorType.length; _i++) {
							errorTypeList.push(errorType[_i].id);
						}
					}
					data.errorTypeList = errorTypeList.toString();

					var dataStatus = data.dataStatus;
					var statusList = [];
					if (dataStatus.length > 0) {
						for (var _i2 = 0; _i2 < dataStatus.length; _i2++) {
							statusList.push(dataStatus[_i2].id);
						}
					}
					data.statusList = statusList.toString();

					var dataDevice = await db.queryForList("ClientNotify.getList", data);
					conn.commit();
					callBack(false, dataDevice);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
				}
			});
		}

		/**
   * @description Lấy tổng số dòng
   * @author Long.Pham
   * @since 12/09/2021
   * @param {Object alert} data
   * @param {function callback} callback
   */

	}, {
		key: "getSize",
		value: function getSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("ClientNotify.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Update is_delete = 1
   * @author Long.Pham
   * @since 11/09/2021
   * @param {Object AlertEntity} data
   * @param {function callback} callback
   */

	}, {
		key: "delete",
		value: function _delete(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("ClientNotify.delete", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
      * @description Update alert
      * @author Long.Pham
      * @since 20/09/2021
      * @param {Object AlertEntity} data
      * @param {function callback} callback
      */

	}, {
		key: "update",
		value: function update(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.update("ClientNotify.updateAlert", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					conn.commit();
					callBack(true, {});
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(false, err);
				}
			});
		}
	}, {
		key: "closeAll",
		value: function closeAll(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var dataArr = data.dataArr;
					var rs = await db.delete("ClientNotify.closeAll", { dataArr: dataArr });
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}
					conn.commit();
					callBack(true, rs);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(false, err);
				}
			});
		}

		/**
   * @description Lấy tổng số dòng
   * @author Long.Pham
   * @since 12/09/2021
   * @param {Object alert} data
   * @param {function callback} callback
   */

	}, {
		key: "getNotifySize",
		value: function getNotifySize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("ClientNotify.getNotifySize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}
	}]);

	return ClientNotifyService;
}(_BaseService3.default);

exports.default = ClientNotifyService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9DbGllbnROb3RpZnlTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkNsaWVudE5vdGlmeVNlcnZpY2UiLCJkYXRhIiwiY2FsbEJhY2siLCJkYiIsIm15U3FMREIiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsImVycm9yTGV2ZWwiLCJlcnJvckxldmVsTGlzdCIsImxlbmd0aCIsImkiLCJwdXNoIiwiaWQiLCJ0b1N0cmluZyIsImVycm9yVHlwZSIsImVycm9yVHlwZUxpc3QiLCJkYXRhU3RhdHVzIiwic3RhdHVzTGlzdCIsImRhdGFEZXZpY2UiLCJxdWVyeUZvckxpc3QiLCJjb21taXQiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwicm9sbGJhY2siLCJjYWxsYmFjayIsIkxpYnMiLCJjb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcCIsInF1ZXJ5Rm9yT2JqZWN0IiwiZSIsImRlbGV0ZSIsInJzIiwibG9nZ2VyIiwiZXJyb3IiLCJ1cGRhdGUiLCJkYXRhQXJyIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxtQjs7O0FBQ0wsZ0NBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzBCQVFRQyxJLEVBQU1DLFEsRUFBVTtBQUN2QixPQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxNQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFFBQUk7QUFDSCxTQUFJQyxhQUFhTixLQUFLTSxVQUF0QjtBQUNBLFNBQUlDLGlCQUFpQixFQUFyQjtBQUNBLFNBQUdELFdBQVdFLE1BQVgsR0FBb0IsQ0FBdkIsRUFBeUI7QUFDeEIsV0FBSSxJQUFJQyxJQUFJLENBQVosRUFBZUEsSUFBSUgsV0FBV0UsTUFBOUIsRUFBc0NDLEdBQXRDLEVBQTBDO0FBQ3pDRixzQkFBZUcsSUFBZixDQUFvQkosV0FBV0csQ0FBWCxFQUFjRSxFQUFsQztBQUNBO0FB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LFNBQVMsS0FBVCxFQUFnQkksQ0FBaEIsQ0FBUDtBQUNBO0FBQ0Q7Ozs7RUFsS2dDTyxxQjs7a0JBb0tuQnBDLG1CIiwiZmlsZSI6IkNsaWVudE5vdGlmeVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmNsYXNzIENsaWVudE5vdGlmeVNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEyLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cclxuXHRnZXRMaXN0KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBlcnJvckxldmVsID0gZGF0YS5lcnJvckxldmVsO1xyXG5cdFx0XHRcdHZhciBlcnJvckxldmVsTGlzdCA9IFtdO1xyXG5cdFx0XHRcdGlmKGVycm9yTGV2ZWwubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZXJyb3JMZXZlbC5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0XHRcdGVycm9yTGV2ZWxMaXN0LnB1c2goZXJyb3JMZXZlbFtpXS5pZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEuZXJyb3JMZXZlbExpc3QgPSBlcnJvckxldmVsTGlzdC50b1N0cmluZygpO1xyXG5cclxuXHRcdFx0XHR2YXIgZXJyb3JUeXBlID0gZGF0YS5lcnJvclR5cGU7XHJcblx0XHRcdFx0dmFyIGVycm9yVHlwZUxpc3QgPSBbXTtcclxuXHRcdFx0XHRpZihlcnJvclR5cGUubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZXJyb3JUeXBlLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRcdFx0ZXJyb3JUeXBlTGlzdC5wdXNoKGVycm9yVHlwZVtpXS5pZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEuZXJyb3JUeXBlTGlzdCA9IGVycm9yVHlwZUxpc3QudG9TdHJpbmcoKTtcclxuXHJcblx0XHRcdFx0dmFyIGRhdGFTdGF0dXMgPSBkYXRhLmRhdGFTdGF0dXM7XHJcblx0XHRcdFx0dmFyIHN0YXR1c0xpc3QgPSBbXTtcclxuXHRcdFx0XHRpZihkYXRhU3RhdHVzLmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGRhdGFTdGF0dXMubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdFx0XHRzdGF0dXNMaXN0LnB1c2goZGF0YVN0YXR1c1tpXS5pZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEuc3RhdHVzTGlzdCA9IHN0YXR1c0xpc3QudG9TdHJpbmcoKTtcclxuXHJcblx0XHRcdFx0dmFyIGRhdGFEZXZpY2UgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnROb3RpZnkuZ2V0TGlzdFwiLCBkYXRhKTtcclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhRGV2aWNlKTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEyLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBhbGVydH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0Z2V0U2l6ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQ2xpZW50Tm90aWZ5LmdldFNpemVcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGlzX2RlbGV0ZSA9IDFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgQWxlcnRFbnRpdHl9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdGRlbGV0ZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmRlbGV0ZShcIkNsaWVudE5vdGlmeS5kZWxldGVcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgYWxlcnRcclxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMjAvMDkvMjAyMVxyXG4gICAgICogQHBhcmFtIHtPYmplY3QgQWxlcnRFbnRpdHl9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcbiAgICAgKi9cclxuXHQgdXBkYXRlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkNsaWVudE5vdGlmeS51cGRhdGVBbGVydFwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGNsb3NlQWxsKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBkYXRhQXJyID0gZGF0YS5kYXRhQXJyO1xyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmRlbGV0ZShcIkNsaWVudE5vdGlmeS5jbG9zZUFsbFwiLCB7ZGF0YUFycn0pO1xyXG5cdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgcnMpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRcclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gTOG6pXkgdOG7lW5nIHPhu5EgZMOybmdcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMi8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgYWxlcnR9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdCBnZXROb3RpZnlTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnROb3RpZnkuZ2V0Tm90aWZ5U2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBDbGllbnROb3RpZnlTZXJ2aWNlO1xyXG4iXX0=