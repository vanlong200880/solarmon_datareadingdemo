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

var DeviceService = function (_BaseService) {
	_inherits(DeviceService, _BaseService);

	function DeviceService() {
		_classCallCheck(this, DeviceService);

		return _possibleConstructorReturn(this, (DeviceService.__proto__ || Object.getPrototypeOf(DeviceService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 30/07/2019
  * @param {Object} data
  * @param {function callback} callback 
  */


	_createClass(DeviceService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Device.getList", data, callback);
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
				db.queryForObject("Device.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get list by projct id
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getListDeviceByProject',
		value: function getListDeviceByProject(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Device.getListDeviceByProject", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get list by projct id share
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getListDeviceByProjectShare',
		value: function getListDeviceByProjectShare(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Device.getListDeviceByProjectShare", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get all
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object Device} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getDropDownList',
		value: function getDropDownList(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Device.getDropDownList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object Device} data
   */

	}, {
		key: 'insert',
		value: function insert(data, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.insert("Device.insert", data);
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}

						conn.commit();
						callBack(false, rs);
					} catch (err) {
						console.log("Lỗi rolback", err);
						conn.rollback();
						callBack(true, err);
					}
				});
			} catch (e) {
				console.log('error', e);
				callBack(false, e);
			}
		}

		/**
   * Kiem tra id_device exist 
   * @param {Object} permission 
   */

	}, {
		key: 'checkIdDeviceExist',
		value: function checkIdDeviceExist(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("Device.checkIdDeviceExist", data, callback);
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object Device} data
   */

	}, {
		key: 'saveDeviceShare',
		value: function saveDeviceShare(data, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = null;
						var dataParams = data.dataParams;
						if (Libs.isArrayData(dataParams)) {
							for (var i = 0, len = dataParams.length; i < len; i++) {
								var checkecExits = await db.queryForObject("Device.checkExitsDeviceShare", dataParams[i]);
								if (!checkecExits) {
									rs = await db.insert("Device.saveDeviceShare", dataParams[i]);
								}
							}
						}
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}

						conn.commit();
						callBack(false, rs);
					} catch (err) {
						console.log("Lỗi rolback", err);
						conn.rollback();
						callBack(true, err);
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
   * @param {Object Device} data
   * @param {function callback} callback
   */

	}, {
		key: 'update',
		value: function update(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.update("Device.updateDevice", data);
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
   * @param {Object Device} data
   * @param {function callback} callback
   */

	}, {
		key: 'updateStatus',
		value: function updateStatus(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("Device.updateStatus", data, function (err, rs) {
					return callback(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
   * @description Update is virtual
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Device} data
   * @param {function callback} callback
   */

	}, {
		key: 'updateIsVirtual',
		value: function updateIsVirtual(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				if (data.is_share == 1) {
					db.update("Device.updateIsVirtualMap", data, function (err, rs) {
						return callback(err, rs);
					});
				} else if (data.is_share == 0) {
					db.update("Device.updateIsVirtual", data, function (err, rs) {
						return callback(err, rs);
					});
				} else {
					return callback(false, null);
				}
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
   * @description Update status -1
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Device} data
   * @param {function callback} callback
   */

	}, {
		key: 'delete',
		value: function _delete(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				if (data.is_share == 1) {
					db.delete("Device.deleteDeviceMap", data, function (err, rs) {
						return callback(err, rs);
					});
				} else if (data.is_share == 0) {
					db.delete("Device.delete", data, function (err, rs) {
						return callback(err, rs);
					});
				} else {
					return callback(false, null);
				}
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
						var rs = await db.queryForList("Device.getDetail", param);
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

	return DeviceService;
}(_BaseService3.default);

exports.default = DeviceService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9EZXZpY2VTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkRldmljZVNlcnZpY2UiLCJkYXRhIiwiY2FsbGJhY2siLCJMaWJzIiwiaXNCbGFuayIsImN1cnJlbnRfcm93IiwibWF4X3JlY29yZCIsIkNvbnN0YW50cyIsImNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wIiwiZGIiLCJteVNxTERCIiwicXVlcnlGb3JMaXN0IiwiZSIsImNvbnNvbGUiLCJsb2ciLCJxdWVyeUZvck9iamVjdCIsImNhbGxCYWNrIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJycyIsImluc2VydCIsInJvbGxiYWNrIiwiY29tbWl0IiwiZXJyIiwibG9nZ2VyIiwiZXJyb3IiLCJkYXRhUGFyYW1zIiwiaXNBcnJheURhdGEiLCJpIiwibGVuIiwibGVuZ3RoIiwiY2hlY2tlY0V4aXRzIiwidXBkYXRlIiwiaXNfc2hhcmUiLCJkZWxldGUiLCJwYXJhbSIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFDTUEsYTs7O0FBQ0wsMEJBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzswQkFPUUMsSSxFQUFNQyxRLEVBQVU7QUFDdkIsT0FBSTtBQUNILFFBQUksQ0FBQ0MsS0FBS0MsT0FBTCxDQUFhSCxJQUFiLENBQUwsRUFBeUI7QUFDeEJBLFVBQUtJLFdBQUwsR0FBb0IsT0FBT0osS0FBS0ksV0FBWixJQUEyQixXQUE1QixHQUEyQyxDQUEzQyxHQUErQ0osS0FBS0ksV0FBdkU7QUFDQUosVUFBS0ssVUFBTCxHQUFrQkMsVUFBVU4sSUFBVixDQUFlSyxVQUFqQztBQUNBO0FBQ0RMLFdBQU9FLEtBQUtLLDBCQUFMLENBQWdDUCxJQUFoQyxDQUFQO0FBQ0EsUUFBSVEsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsWUFBSCxDQUFnQixnQkFBaEIsRUFBa0NWLElBQWxDLEVBQXdDQyxRQUF4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QUtZLE1BQUwsQ0FBWUMsS0FBWixDQUFrQmIsQ0FBbEI7QUFDQVYsYUFBUyxLQUFULEVBQWdCVSxDQUFoQjtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzRCQUtVdUIsSyxFQUFPbkIsUSxFQUFVO0FBQzFCLE9BQUk7QUFDSCxRQUFJUCxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHUSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFNBQUk7QUFDSCxVQUFJQyxLQUFLLE1BQU1WLEdBQUdFLFlBQUgsQ0FBZ0Isa0JBQWhCLEVBQW9Dd0IsS0FBcEMsQ0FBZjtBQUNBLFVBQUlsQyxPQUFPa0IsR0FBRyxDQUFILEVBQU0sQ0FBTixDQUFYO0FBQ0FsQixXQUFLQSxJQUFMLEdBQVlrQixHQUFHLENBQUgsQ0FBWjtBQUNBRCxXQUFLSSxNQUFMO0FBQ0FOLGVBQVMsS0FBVCxFQUFnQmYsSUFBaEI7QUFDQSxNQU5ELENBTUUsT0FBT3NCLEdBQVAsRUFBWTtBQUNiVixjQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQlMsR0FBM0I7QUFDQUwsV0FBS0csUUFBTDtBQUNBTCxlQUFTLElBQVQsRUFBZU8sR0FBZjtBQUNBO0FBQ0QsS0FaRDtBQWFBLElBZkQsQ0FlRSxPQUFPQSxHQUFQLEVBQVk7QUFDYixRQUFJTCxJQUFKLEVBQVU7QUFDVEEsVUFBS0csUUFBTDtBQUNBO0FBQ0RMLGFBQVMsSUFBVCxFQUFlTyxHQUFmO0FBQ0E7QUFDRDs7OztFQXhWMEJhLHFCOztrQkEwVmJwQyxhIiwiZmlsZSI6IkRldmljZVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmNsYXNzIERldmljZVNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdGdldExpc3QoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEpKSB7XHJcblx0XHRcdFx0ZGF0YS5jdXJyZW50X3JvdyA9ICh0eXBlb2YgZGF0YS5jdXJyZW50X3JvdyA9PSAndW5kZWZpbmVkJykgPyAwIDogZGF0YS5jdXJyZW50X3JvdztcclxuXHRcdFx0XHRkYXRhLm1heF9yZWNvcmQgPSBDb25zdGFudHMuZGF0YS5tYXhfcmVjb3JkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvckxpc3QoXCJEZXZpY2UuZ2V0TGlzdFwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0ICogQGF1dGhvciB0aGFuaC5iYXlcclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOFxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFVzZXJ9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdGdldFNpemUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvck9iamVjdChcIkRldmljZS5nZXRTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0IGJ5IHByb2pjdCBpZFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdGdldExpc3REZXZpY2VCeVByb2plY3QoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEpKSB7XHJcblx0XHRcdFx0ZGF0YS5jdXJyZW50X3JvdyA9ICh0eXBlb2YgZGF0YS5jdXJyZW50X3JvdyA9PSAndW5kZWZpbmVkJykgPyAwIDogZGF0YS5jdXJyZW50X3JvdztcclxuXHRcdFx0XHRkYXRhLm1heF9yZWNvcmQgPSBDb25zdGFudHMuZGF0YS5tYXhfcmVjb3JkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvckxpc3QoXCJEZXZpY2UuZ2V0TGlzdERldmljZUJ5UHJvamVjdFwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdCBieSBwcm9qY3QgaWQgc2hhcmVcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHQgZ2V0TGlzdERldmljZUJ5UHJvamVjdFNoYXJlKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhKSkge1xyXG5cdFx0XHRcdGRhdGEuY3VycmVudF9yb3cgPSAodHlwZW9mIGRhdGEuY3VycmVudF9yb3cgPT0gJ3VuZGVmaW5lZCcpID8gMCA6IGRhdGEuY3VycmVudF9yb3c7XHJcblx0XHRcdFx0ZGF0YS5tYXhfcmVjb3JkID0gQ29uc3RhbnRzLmRhdGEubWF4X3JlY29yZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiRGV2aWNlLmdldExpc3REZXZpY2VCeVByb2plY3RTaGFyZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgYWxsXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IERldmljZX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdGdldERyb3BEb3duTGlzdChkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIkRldmljZS5nZXREcm9wRG93bkxpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEluc2VydCBkYXRhXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IERldmljZX0gZGF0YVxyXG5cdCAqL1xyXG5cdGluc2VydChkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJEZXZpY2UuaW5zZXJ0XCIsIGRhdGEpO1xyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgcnMpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBLaWVtIHRyYSBpZF9kZXZpY2UgZXhpc3QgXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IHBlcm1pc3Npb24gXHJcblx0ICovXHJcblxyXG5cdCBjaGVja0lkRGV2aWNlRXhpc3QoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvck9iamVjdChcIkRldmljZS5jaGVja0lkRGV2aWNlRXhpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEluc2VydCBkYXRhXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IERldmljZX0gZGF0YVxyXG5cdCAqL1xyXG5cdCBzYXZlRGV2aWNlU2hhcmUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gbnVsbDtcclxuXHRcdFx0XHRcdHZhciBkYXRhUGFyYW1zID0gZGF0YS5kYXRhUGFyYW1zO1xyXG5cdFx0XHRcdFx0aWYoTGlicy5pc0FycmF5RGF0YShkYXRhUGFyYW1zKSl7XHJcblx0XHRcdFx0XHRcdGZvcih2YXIgaSA9IDAsIGxlbiA9IGRhdGFQYXJhbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG5cdFx0XHRcdFx0XHRcdHZhciBjaGVja2VjRXhpdHMgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIkRldmljZS5jaGVja0V4aXRzRGV2aWNlU2hhcmVcIiwgZGF0YVBhcmFtc1tpXSk7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNoZWNrZWNFeGl0cyl7XHJcblx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIkRldmljZS5zYXZlRGV2aWNlU2hhcmVcIiwgZGF0YVBhcmFtc1tpXSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBycyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcclxuXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBEZXZpY2V9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cclxuXHR1cGRhdGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIudXBkYXRlKFwiRGV2aWNlLnVwZGF0ZURldmljZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBzdGF0dXNcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgRGV2aWNlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHR1cGRhdGVTdGF0dXMoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi51cGRhdGUoXCJEZXZpY2UudXBkYXRlU3RhdHVzXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGlzIHZpcnR1YWxcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgRGV2aWNlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHR1cGRhdGVJc1ZpcnR1YWwoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRpZiAoZGF0YS5pc19zaGFyZSA9PSAxKSB7XHJcblx0XHRcdFx0ZGIudXBkYXRlKFwiRGV2aWNlLnVwZGF0ZUlzVmlydHVhbE1hcFwiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGVyciwgcnMpXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZGF0YS5pc19zaGFyZSA9PSAwKSB7XHJcblx0XHRcdFx0ZGIudXBkYXRlKFwiRGV2aWNlLnVwZGF0ZUlzVmlydHVhbFwiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGVyciwgcnMpXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBudWxsKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0XHRcdGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgc3RhdHVzIC0xXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IERldmljZX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0ZGVsZXRlKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0aWYgKGRhdGEuaXNfc2hhcmUgPT0gMSkge1xyXG5cdFx0XHRcdGRiLmRlbGV0ZShcIkRldmljZS5kZWxldGVEZXZpY2VNYXBcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhlcnIsIHJzKVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmIChkYXRhLmlzX3NoYXJlID09IDApIHtcclxuXHRcdFx0XHRkYi5kZWxldGUoXCJEZXZpY2UuZGVsZXRlXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyLCBycylcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBudWxsKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0XHRcdGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCogZ2V0IGRldGFpbFxyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cdGdldERldGFpbChwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiRGV2aWNlLmdldERldGFpbFwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHR2YXIgZGF0YSA9IHJzWzBdWzBdO1xyXG5cdFx0XHRcdFx0ZGF0YS5kYXRhID0gcnNbMV07XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGEpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0aWYgKGNvbm4pIHtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRGV2aWNlU2VydmljZTtcclxuIl19