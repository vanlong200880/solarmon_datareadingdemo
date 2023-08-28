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

var ClientActivitiesService = function (_BaseService) {
	_inherits(ClientActivitiesService, _BaseService);

	function ClientActivitiesService() {
		_classCallCheck(this, ClientActivitiesService);

		return _possibleConstructorReturn(this, (ClientActivitiesService.__proto__ || Object.getPrototypeOf(ClientActivitiesService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 12/09/2021
  * @param {Object} data
  * @param {function callback} callback 
  */

	_createClass(ClientActivitiesService, [{
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

					var dataDevice = await db.queryForList("ClientActivities.getList", data);
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
				db.queryForObject("ClientActivities.getSize", data, callback);
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
				db.delete("ClientActivities.delete", data, function (err, rs) {
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
					var rs = await db.update("ClientActivities.updateAlert", data);
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
					// var dataArr = data.dataArr;
					await db.update("ClientActivities.closeAll", data);
					conn.commit();
					callBack(true, {});
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(false, err);
				}
			});
		}
	}]);

	return ClientActivitiesService;
}(_BaseService3.default);

exports.default = ClientActivitiesService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9DbGllbnRBY3Rpdml0aWVzU2VydmljZS5qcyJdLCJuYW1lcyI6WyJDbGllbnRBY3Rpdml0aWVzU2VydmljZSIsImRhdGEiLCJjYWxsQmFjayIsImRiIiwibXlTcUxEQiIsImJlZ2luVHJhbnNhY3Rpb24iLCJjb25uIiwiZXJyb3JMZXZlbCIsImVycm9yTGV2ZWxMaXN0IiwibGVuZ3RoIiwiaSIsInB1c2giLCJpZCIsInRvU3RyaW5nIiwiZXJyb3JUeXBlIiwiZXJyb3JUeXBlTGlzdCIsImRhdGFTdGF0dXMiLCJzdGF0dXNMaXN0IiwiZGF0YURldmljZSIsInF1ZXJ5Rm9yTGlzdCIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJyb2xsYmFjayIsImNhbGxiYWNrIiwiTGlicyIsImNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wIiwicXVlcnlGb3JPYmplY3QiLCJlIiwiZGVsZXRlIiwicnMiLCJsb2dnZXIiLCJlcnJvciIsInVwZGF0ZSIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFDTUEsdUI7OztBQUNMLG9DQUFjO0FBQUE7O0FBQUE7QUFHYjs7QUFFRDs7Ozs7Ozs7OzswQkFRUUMsSSxFQUFNQyxRLEVBQVU7QUFDdkIsT0FBSUMsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsTUFBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxRQUFJO0FBQ0gsU0FBSUMsYUFBYU4sS0FBS00sVUFBdEI7QUFDQSxTQUFJQyxpQkFBaUIsRUFBckI7QUFDQSxTQUFJRCxXQUFXRSxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQzFCLFdBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSCxXQUFXRSxNQUEvQixFQUF1Q0MsR0FBdkMsRUFBNEM7QUFDM0NGLHNCQUFlRyxJQUFmLENBQW9CSixXQUFXRyxDQUFYLEVBQWNFLEVBQWxDO0FBQ0E7QUFD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LEVBQWUsRUFBZjtBQUNBLEtBVkQsQ0FVRSxPQUFPbUIsR0FBUCxFQUFZO0FBQ2JDLGFBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCRixHQUEzQjtBQUNBZixVQUFLa0IsUUFBTDtBQUNBdEIsY0FBUyxLQUFULEVBQWdCbUIsR0FBaEI7QUFDQTtBQUNELElBaEJEO0FBaUJBOzs7MkJBRVFwQixJLEVBQU1DLFEsRUFBVTtBQUN4QixPQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxNQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFFBQUk7QUFDSDtBQUNBLFdBQU1ILEdBQUcrQixNQUFILENBQVUsMkJBQVYsRUFBdUNqQyxJQUF2QyxDQUFOO0FBQ0FLLFVBQUtjLE1BQUw7QUFDQWxCLGNBQVMsSUFBVCxFQUFlLEVBQWY7QUFDQSxLQUxELENBS0UsT0FBT21CLEdBQVAsRUFBWTtBQUNiQyxhQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkYsR0FBM0I7QUFDQWYsVUFBS2tCLFFBQUw7QUFDQXRCLGNBQVMsS0FBVCxFQUFnQm1CLEdBQWhCO0FBQ0E7QUFDRCxJQVhEO0FBWUE7Ozs7RUExSW9DYyxxQjs7a0JBNEl2Qm5DLHVCIiwiZmlsZSI6IkNsaWVudEFjdGl2aXRpZXNTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTZXJ2aWNlIGZyb20gJy4vQmFzZVNlcnZpY2UnO1xyXG5jbGFzcyBDbGllbnRBY3Rpdml0aWVzU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0XHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTIvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblxyXG5cdGdldExpc3QoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIGVycm9yTGV2ZWwgPSBkYXRhLmVycm9yTGV2ZWw7XHJcblx0XHRcdFx0dmFyIGVycm9yTGV2ZWxMaXN0ID0gW107XHJcblx0XHRcdFx0aWYgKGVycm9yTGV2ZWwubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvckxldmVsLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGVycm9yTGV2ZWxMaXN0LnB1c2goZXJyb3JMZXZlbFtpXS5pZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEuZXJyb3JMZXZlbExpc3QgPSBlcnJvckxldmVsTGlzdC50b1N0cmluZygpO1xyXG5cclxuXHRcdFx0XHR2YXIgZXJyb3JUeXBlID0gZGF0YS5lcnJvclR5cGU7XHJcblx0XHRcdFx0dmFyIGVycm9yVHlwZUxpc3QgPSBbXTtcclxuXHRcdFx0XHRpZiAoZXJyb3JUeXBlLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JUeXBlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGVycm9yVHlwZUxpc3QucHVzaChlcnJvclR5cGVbaV0uaWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhLmVycm9yVHlwZUxpc3QgPSBlcnJvclR5cGVMaXN0LnRvU3RyaW5nKCk7XHJcblxyXG5cdFx0XHRcdHZhciBkYXRhU3RhdHVzID0gZGF0YS5kYXRhU3RhdHVzO1xyXG5cdFx0XHRcdHZhciBzdGF0dXNMaXN0ID0gW107XHJcblx0XHRcdFx0aWYgKGRhdGFTdGF0dXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhU3RhdHVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHN0YXR1c0xpc3QucHVzaChkYXRhU3RhdHVzW2ldLmlkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YS5zdGF0dXNMaXN0ID0gc3RhdHVzTGlzdC50b1N0cmluZygpO1xyXG5cclxuXHRcdFx0XHR2YXIgZGF0YURldmljZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudEFjdGl2aXRpZXMuZ2V0TGlzdFwiLCBkYXRhKTtcclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhRGV2aWNlKTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEyLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBhbGVydH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0Z2V0U2l6ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQ2xpZW50QWN0aXZpdGllcy5nZXRTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBpc19kZWxldGUgPSAxXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IEFsZXJ0RW50aXR5fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRkZWxldGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5kZWxldGUoXCJDbGllbnRBY3Rpdml0aWVzLmRlbGV0ZVwiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBjYWxsQmFjayhlcnIsIHJzKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgYWxlcnRcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAyMC8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgQWxlcnRFbnRpdHl9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdHVwZGF0ZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi51cGRhdGUoXCJDbGllbnRBY3Rpdml0aWVzLnVwZGF0ZUFsZXJ0XCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0Y2xvc2VBbGwoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0Ly8gdmFyIGRhdGFBcnIgPSBkYXRhLmRhdGFBcnI7XHJcblx0XHRcdFx0YXdhaXQgZGIudXBkYXRlKFwiQ2xpZW50QWN0aXZpdGllcy5jbG9zZUFsbFwiLCBkYXRhKTtcclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBDbGllbnRBY3Rpdml0aWVzU2VydmljZTtcclxuIl19