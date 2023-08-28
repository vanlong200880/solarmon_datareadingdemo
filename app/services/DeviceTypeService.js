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

var DeviceTypeService = function (_BaseService) {
	_inherits(DeviceTypeService, _BaseService);

	function DeviceTypeService() {
		_classCallCheck(this, DeviceTypeService);

		return _possibleConstructorReturn(this, (DeviceTypeService.__proto__ || Object.getPrototypeOf(DeviceTypeService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 30/07/2019
  * @param {Object} data
  * @param {function callback} callback 
  */


	_createClass(DeviceTypeService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("DeviceType.getList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get all
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object DeviceType} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getDropDownList',
		value: function getDropDownList(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("DeviceType.getDropDownList", data, callback);
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
				db.queryForObject("DeviceType.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object DeviceType} data
   */

	}, {
		key: 'insert',
		value: function insert(data, callBack) {
			try {
				var self = this;
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.insert("DeviceType.insert", data);
						var curId = rs.insertId;
						if (!rs) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						// insert table detail
						var dataDetail = data.data;
						if (dataDetail.length > 0) {
							for (var i = 0; i < dataDetail.length; i++) {
								dataDetail[i].id_device_type = curId;
							}
							await db.insert("DeviceType.insertDeviceTypeDetail", { dataDetail: dataDetail });
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
   * @param {Object DeviceType} data
   * @param {function callback} callback
   */

	}, {
		key: 'update',
		value: function update(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.delete("DeviceType.deleteDeviceTypeDetail", data);
					rs = await db.update("DeviceType.updateDeviceType", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					// insert table detail
					var dataDetail = data.data;
					if (dataDetail.length > 0) {
						await db.insert("DeviceType.insertDeviceTypeDetail", { dataDetail: dataDetail });
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
   * @param {Object DeviceType} data
   * @param {function callback} callback
   */

	}, {
		key: 'updateStatus',
		value: function updateStatus(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("DeviceType.updateStatus", data, function (err, rs) {
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
   * @param {Object DeviceType} data
   * @param {function callback} callback
   */

	}, {
		key: 'delete',
		value: function _delete(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("DeviceType.delete", data, function (err, rs) {
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
						var rs = await db.queryForList("DeviceType.getDetail", param);
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

		/**
   * Kiem tra exist 
   * @param {Object} 
   */

	}, {
		key: 'checkExistDeviceTypeUse',
		value: async function checkExistDeviceTypeUse(data) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				return await db.queryForObject("DeviceType.checkExistDeviceTypeUse", data);
			} catch (e) {
				return callback(false, e);
			}
		}
	}]);

	return DeviceTypeService;
}(_BaseService3.default);

exports.default = DeviceTypeService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9EZXZpY2VUeXBlU2VydmljZS5qcyJdLCJuYW1lcyI6WyJEZXZpY2VUeXBlU2VydmljZSIsImRhdGEiLCJjYWxsYmFjayIsIkxpYnMiLCJpc0JsYW5rIiwiY3VycmVudF9yb3ciLCJtYXhfcmVjb3JkIiwiQ29uc3RhbnRzIiwiY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AiLCJkYiIsIm15U3FMREIiLCJxdWVyeUZvckxpc3QiLCJlIiwiY29uc29sZSIsImxvZyIsInF1ZXJ5Rm9yT2JqZWN0IiwiY2FsbEJhY2siLCJzZWxmIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJycyIsImluc2VydCIsImN1cklkIiwiaW5zZXJ0SWQiLCJyb2xsYmFjayIsImRhdGFEZXRhaWwiLCJsZW5ndGgiLCJpIiwiaWRfZGV2aWNlX3R5cGUiLCJjb21taXQiLCJlcnIiLCJkZWxldGUiLCJ1cGRhdGUiLCJsb2dnZXIiLCJlcnJvciIsInBhcmFtIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxpQjs7O0FBQ0wsOEJBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzswQkFPUUMsSSxFQUFNQyxRLEVBQVU7QUFDdkIsT0FBSTtBQUNILFFBQUksQ0FBQ0MsS0FBS0MsT0FBTCxDQUFhSCxJQUFiLENBQUwsRUFBeUI7QUFDeEJBLFVBQUtJLFdBQUwsR0FBb0IsT0FBT0osS0FBS0ksV0FBWixJQUEyQixXQUE1QixHQUEyQyxDQUEzQyxHQUErQ0osS0FBS0ksV0FBdkU7QUFDQUosVUFBS0ssVUFBTCxHQUFrQkMsVUFBVU4sSUFBVixDQUFlSyxVQUFqQztBQUNBO0FBQ0RMLFdBQU9FLEtBQUtLLDBCQUFMLENBQWdDUCxJQUFoQyxDQUFQO0FBQ0EsUUFBSVEsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsWUFBSCxDQUFnQixvQkFBaEIsRUFBc0NWLElBQXRDLEVBQTRD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QUNIQSxXQUFPRSxLQUFLSywwQkFBTCxDQUFnQ1AsSUFBaEMsQ0FBUDtBQUNBLFFBQUlRLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0EsV0FBTyxNQUFNRCxHQUFHTSxjQUFILENBQWtCLG9DQUFsQixFQUF3RGQsSUFBeEQsQ0FBYjtBQUNBLElBSkQsQ0FJRSxPQUFPVyxDQUFQLEVBQVU7QUFDWCxXQUFPVixTQUFTLEtBQVQsRUFBZ0JVLENBQWhCLENBQVA7QUFDQTtBQUNEOzs7O0VBdE84QndCLHFCOztrQkF5T2pCcEMsaUIiLCJmaWxlIjoiRGV2aWNlVHlwZVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmNsYXNzIERldmljZVR5cGVTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHRnZXRMaXN0KGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhKSkge1xyXG5cdFx0XHRcdGRhdGEuY3VycmVudF9yb3cgPSAodHlwZW9mIGRhdGEuY3VycmVudF9yb3cgPT0gJ3VuZGVmaW5lZCcpID8gMCA6IGRhdGEuY3VycmVudF9yb3c7XHJcblx0XHRcdFx0ZGF0YS5tYXhfcmVjb3JkID0gQ29uc3RhbnRzLmRhdGEubWF4X3JlY29yZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiRGV2aWNlVHlwZS5nZXRMaXN0XCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGFsbFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBEZXZpY2VUeXBlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Z2V0RHJvcERvd25MaXN0KGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiRGV2aWNlVHlwZS5nZXREcm9wRG93bkxpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgdGhhbmguYmF5XHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMThcclxuXHQgKiBAcGFyYW0ge09iamVjdCBVc2VyfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRnZXRTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJEZXZpY2VUeXBlLmdldFNpemVcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBJbnNlcnQgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBEZXZpY2VUeXBlfSBkYXRhXHJcblx0ICovXHJcblx0aW5zZXJ0KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiRGV2aWNlVHlwZS5pbnNlcnRcIiwgZGF0YSk7XHJcblx0XHRcdFx0XHR2YXIgY3VySWQgPSBycy5pbnNlcnRJZDtcclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHJcblx0XHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgZGV0YWlsXHJcblx0XHRcdFx0XHRsZXQgZGF0YURldGFpbCA9IGRhdGEuZGF0YTtcclxuXHRcdFx0XHRcdGlmIChkYXRhRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhRGV0YWlsLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YURldGFpbFtpXS5pZF9kZXZpY2VfdHlwZSA9IGN1cklkO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGF3YWl0IGRiLmluc2VydChcIkRldmljZVR5cGUuaW5zZXJ0RGV2aWNlVHlwZURldGFpbFwiLCB7IGRhdGFEZXRhaWwgfSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBEZXZpY2VUeXBlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHJcblx0dXBkYXRlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmRlbGV0ZShcIkRldmljZVR5cGUuZGVsZXRlRGV2aWNlVHlwZURldGFpbFwiLCBkYXRhKTtcclxuXHRcdFx0XHRycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkRldmljZVR5cGUudXBkYXRlRGV2aWNlVHlwZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gaW5zZXJ0IHRhYmxlIGRldGFpbFxyXG5cdFx0XHRcdGxldCBkYXRhRGV0YWlsID0gZGF0YS5kYXRhXHJcblx0XHRcdFx0aWYgKGRhdGFEZXRhaWwubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0YXdhaXQgZGIuaW5zZXJ0KFwiRGV2aWNlVHlwZS5pbnNlcnREZXZpY2VUeXBlRGV0YWlsXCIsIHsgZGF0YURldGFpbCB9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgc3RhdHVzXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IERldmljZVR5cGV9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdHVwZGF0ZVN0YXR1cyhkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnVwZGF0ZShcIkRldmljZVR5cGUudXBkYXRlU3RhdHVzXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBzdGF0dXMgLTFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgRGV2aWNlVHlwZX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0ZGVsZXRlKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuZGVsZXRlKFwiRGV2aWNlVHlwZS5kZWxldGVcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWxcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHRnZXREZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkRldmljZVR5cGUuZ2V0RGV0YWlsXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdHZhciBkYXRhID0gcnNbMF1bMF07XHJcblx0XHRcdFx0XHRkYXRhLmRhdGEgPSByc1sxXTtcclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogS2llbSB0cmEgZXhpc3QgXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IFxyXG5cdCAqL1xyXG5cclxuXHQgYXN5bmMgY2hlY2tFeGlzdERldmljZVR5cGVVc2UoZGF0YSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdHJldHVybiBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIkRldmljZVR5cGUuY2hlY2tFeGlzdERldmljZVR5cGVVc2VcIiwgZGF0YSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBEZXZpY2VUeXBlU2VydmljZTtcclxuIl19