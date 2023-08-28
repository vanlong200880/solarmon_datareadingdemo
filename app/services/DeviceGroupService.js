'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require('./BaseService');

var _BaseService3 = _interopRequireDefault(_BaseService2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeviceGroupService = function (_BaseService) {
	_inherits(DeviceGroupService, _BaseService);

	function DeviceGroupService() {
		_classCallCheck(this, DeviceGroupService);

		return _possibleConstructorReturn(this, (DeviceGroupService.__proto__ || Object.getPrototypeOf(DeviceGroupService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 30/07/2019
  * @param {Object} data
  * @param {function callback} callback 
  */


	_createClass(DeviceGroupService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("DeviceGroup.getList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get all
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object DeviceGroup} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getDropDownList',
		value: function getDropDownList(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("DeviceGroup.getDropDownList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Lấy tổng số dòng
   * @author thanh.bay
   * @since 30/07/2018
   * @param {Object User} data
   * @param {function callback} callback
   */

	}, {
		key: 'getSize',
		value: function getSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("DeviceGroup.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object DeviceGroup} data
   */

	}, {
		key: 'insert',
		value: function insert(data, callBack) {
			try {
				var self = this;
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.insert("DeviceGroup.insert", data);
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
			} catch (e) {
				console.log('error', e);
				callBack(false, e);
			}
		}

		/**
   * @description Update data
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object DeviceGroup} data
   * @param {function callback} callback
   */

	}, {
		key: 'update',
		value: function update(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.update("DeviceGroup.updateDeviceGroup", data);
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

		/**
   * @description Update status
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object DeviceGroup} data
   * @param {function callback} callback
   */

	}, {
		key: 'updateStatus',
		value: function updateStatus(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("DeviceGroup.updateStatus", data, function (err, rs) {
					return callback(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
   * @description Update status -1
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object DeviceGroup} data
   * @param {function callback} callback
   */

	}, {
		key: 'delete',
		value: function _delete(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("DeviceGroup.delete", data, function (err, rs) {
					return callback(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
  * get detail
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: 'getDetail',
		value: function getDetail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.queryForList("DeviceGroup.getDetail", param);
						var data = rs[0][0];
						data.data = rs[1];
						conn.commit();
						callBack(false, data);
					} catch (err) {
						console.log("Lỗi rolback", err);
						conn.rollback();
						callBack(true, err);
					}
				});
			} catch (err) {
				if (conn) {
					conn.rollback();
				}
				callBack(true, err);
			}
		}
	}]);

	return DeviceGroupService;
}(_BaseService3.default);

exports.default = DeviceGroupService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9EZXZpY2VHcm91cFNlcnZpY2UuanMiXSwibmFtZXMiOlsiRGV2aWNlR3JvdXBTZXJ2aWNlIiwiZGF0YSIsImNhbGxiYWNrIiwiTGlicyIsImlzQmxhbmsiLCJjdXJyZW50X3JvdyIsIm1heF9yZWNvcmQiLCJDb25zdGFudHMiLCJjb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcCIsImRiIiwibXlTcUxEQiIsInF1ZXJ5Rm9yTGlzdCIsImUiLCJjb25zb2xlIiwibG9nIiwicXVlcnlGb3JPYmplY3QiLCJjYWxsQmFjayIsInNlbGYiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsInJzIiwiaW5zZXJ0Iiwicm9sbGJhY2siLCJjb21taXQiLCJlcnIiLCJ1cGRhdGUiLCJsb2dnZXIiLCJlcnJvciIsImRlbGV0ZSIsInBhcmFtIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxrQjs7O0FBQ0wsK0JBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzswQkFPUUMsSSxFQUFNQyxRLEVBQVU7QUFDdkIsT0FBSTtBQUNILFFBQUksQ0FBQ0MsS0FBS0MsT0FBTCxDQUFhSCxJQUFiLENBQUwsRUFBeUI7QUFDeEJBLFVBQUtJLFdBQUwsR0FBb0IsT0FBT0osS0FBS0ksV0FBWixJQUEyQixXQUE1QixHQUEyQyxDQUEzQyxHQUErQ0osS0FBS0ksV0FBdkU7QUFDQUosVUFBS0ssVUFBTCxHQUFrQkMsVUFBVU4sSUFBVixDQUFlSyxVQUFqQztBQUNBO0FBQ0RMLFdBQU9FLEtBQUtLLDBCQUFMLENBQWdDUCxJQUFoQyxDQUFQO0FBQ0EsUUFBSVEsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsWUFBSCxDQUFnQixxQkFBaEIsRUFBdUNWLElBQXZDLEVBQTZDQyxRQUE3QztBQUNBLElBUkQsQ0FRRSxPQUFPVSxDQUFQLEVBQVU7QUFDWEMsWUFBUUMsR0FBUixDQUFZ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QUQsV0FBS0ksTUFBTDtBQUNBUCxlQUFTLEtBQVQsRUFBZ0JmLElBQWhCO0FBQ0EsTUFORCxDQU1FLE9BQU91QixHQUFQLEVBQVk7QUFDYlgsY0FBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJVLEdBQTNCO0FBQ0FMLFdBQUtHLFFBQUw7QUFDQU4sZUFBUyxJQUFULEVBQWVRLEdBQWY7QUFDQTtBQUNELEtBWkQ7QUFhQSxJQWZELENBZUUsT0FBT0EsR0FBUCxFQUFZO0FBQ2IsUUFBSUwsSUFBSixFQUFVO0FBQ1RBLFVBQUtHLFFBQUw7QUFDQTtBQUNETixhQUFTLElBQVQsRUFBZVEsR0FBZjtBQUNBO0FBQ0Q7Ozs7RUFuTStCTSxxQjs7a0JBc01sQjlCLGtCIiwiZmlsZSI6IkRldmljZUdyb3VwU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuY2xhc3MgRGV2aWNlR3JvdXBTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHRnZXRMaXN0KGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhKSkge1xyXG5cdFx0XHRcdGRhdGEuY3VycmVudF9yb3cgPSAodHlwZW9mIGRhdGEuY3VycmVudF9yb3cgPT0gJ3VuZGVmaW5lZCcpID8gMCA6IGRhdGEuY3VycmVudF9yb3c7XHJcblx0XHRcdFx0ZGF0YS5tYXhfcmVjb3JkID0gQ29uc3RhbnRzLmRhdGEubWF4X3JlY29yZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiRGV2aWNlR3JvdXAuZ2V0TGlzdFwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBhbGxcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgRGV2aWNlR3JvdXB9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHRnZXREcm9wRG93bkxpc3QoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvckxpc3QoXCJEZXZpY2VHcm91cC5nZXREcm9wRG93bkxpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgdGhhbmguYmF5XHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMThcclxuXHQgKiBAcGFyYW0ge09iamVjdCBVc2VyfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRnZXRTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJEZXZpY2VHcm91cC5nZXRTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gSW5zZXJ0IGRhdGFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgRGV2aWNlR3JvdXB9IGRhdGFcclxuXHQgKi9cclxuXHRpbnNlcnQoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJEZXZpY2VHcm91cC5pbnNlcnRcIiwgZGF0YSk7XHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcclxuXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBkYXRhXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IERldmljZUdyb3VwfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHJcblx0dXBkYXRlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkRldmljZUdyb3VwLnVwZGF0ZURldmljZUdyb3VwXCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHN0YXR1c1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBEZXZpY2VHcm91cH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0dXBkYXRlU3RhdHVzKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIudXBkYXRlKFwiRGV2aWNlR3JvdXAudXBkYXRlU3RhdHVzXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBzdGF0dXMgLTFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgRGV2aWNlR3JvdXB9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdGRlbGV0ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmRlbGV0ZShcIkRldmljZUdyb3VwLmRlbGV0ZVwiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBjYWxsYmFjayhlcnIsIHJzKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0XHRcdGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCogZ2V0IGRldGFpbFxyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cdGdldERldGFpbChwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiRGV2aWNlR3JvdXAuZ2V0RGV0YWlsXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdHZhciBkYXRhID0gcnNbMF1bMF07XHJcblx0XHRcdFx0XHRkYXRhLmRhdGEgPSByc1sxXTtcclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRGV2aWNlR3JvdXBTZXJ2aWNlO1xyXG4iXX0=