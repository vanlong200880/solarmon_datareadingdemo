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

var DeviceParameterService = function (_BaseService) {
	_inherits(DeviceParameterService, _BaseService);

	function DeviceParameterService() {
		_classCallCheck(this, DeviceParameterService);

		return _possibleConstructorReturn(this, (DeviceParameterService.__proto__ || Object.getPrototypeOf(DeviceParameterService)).call(this));
	}

	/**
     * @description Get list
     * @author Long.Pham
     * @since 30/07/2019
     * @param {Object DeviceParameter} data
     * @param {function callback} callback 
     */


	_createClass(DeviceParameterService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("DeviceParameter.getList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Lấy tổng số dòng
   * @author Long.Pham
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
				db.queryForObject("DeviceParameter.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
      * @description Insert data
      * @author Long.Pham
      * @since 30/07/2019
      * @param {Object DeviceParameter} data
      */

	}, {
		key: 'insertDeviceParameter',
		value: function insertDeviceParameter(data, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {

						var rs = await db.insert("DeviceParameter.insertDeviceParameter", data);
						if (!rs) {
							conn.rollback();
							callBack(false, {});
							return;
						}

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
				console.log('DeviceParameter', e);
				callBack(false, e);
			}
		}

		/**
      * @description Update data
      * @author Long.Pham
      * @since 11/07/2019
      * @param {Object DeviceParameter} data
      * @param {function callback} callback
      */

	}, {
		key: 'updateDeviceParameter',
		value: function updateDeviceParameter(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.update("DeviceParameter.updateDeviceParameter", data);
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
      * @param {Object DeviceParameter} data
      * @param {function callback} callback
      */

	}, {
		key: 'updateStatus',
		value: function updateStatus(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("DeviceParameter.updateStatus", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.DeviceParameter(e);
				callBack(false, e);
			}
		}

		/**
      * @description Update is_delete = 1
      * @author Long.Pham
      * @since 11/07/2019
      * @param {Object DeviceParameter} data
      * @param {function callback} callback
      */

	}, {
		key: 'delete',
		value: function _delete(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("DeviceParameter.delete", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.DeviceParameter(e);
				callBack(false, e);
			}
		}

		/**
  * get detail DeviceParameter
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
						var rs = await db.queryForObject("DeviceParameter.getDetail", param);
						conn.commit();
						callBack(false, rs);
					} catch (err) {
						console.log("Lỗi rolback", err);
						conn.rollback();
						callBack(true, err);
					}
				});
			} catch (err) {
				// console.log('DeviceParameter get material order for voucher out', err);
				if (conn) {
					conn.rollback();
				}
				callBack(true, err);
			}
		}
	}]);

	return DeviceParameterService;
}(_BaseService3.default);

exports.default = DeviceParameterService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9EZXZpY2VQYXJhbWV0ZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkRldmljZVBhcmFtZXRlclNlcnZpY2UiLCJkYXRhIiwiY2FsbGJhY2siLCJMaWJzIiwiaXNCbGFuayIsImN1cnJlbnRfcm93IiwibWF4X3JlY29yZCIsIkNvbnN0YW50cyIsImNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wIiwiZGIiLCJteVNxTERCIiwicXVlcnlGb3JMaXN0IiwiZSIsImNvbnNvbGUiLCJsb2ciLCJxdWVyeUZvck9iamVjdCIsImNhbGxCYWNrIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJycyIsImluc2VydCIsInJvbGxiYWNrIiwiY29tbWl0IiwiZXJyIiwic2VsZiIsInVwZGF0ZSIsImxvZ2dlciIsIkRldmljZVBhcmFtZXRlciIsImRlbGV0ZSIsInBhcmFtIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxzQjs7O0FBQ0wsbUNBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzswQkFPUUMsSSxFQUFNQyxRLEVBQVU7QUFDdkIsT0FBSTtBQUNILFFBQUksQ0FBQ0MsS0FBS0MsT0FBTCxDQUFhSCxJQUFiLENBQUwsRUFBeUI7QUFDeEJBLFVBQUtJLFdBQUwsR0FBb0IsT0FBT0osS0FBS0ksV0FBWixJQUEyQixXQUE1QixHQUEyQyxDQUEzQyxHQUErQ0osS0FBS0ksV0FBdkU7QUFDQUosVUFBS0ssVUFBTCxHQUFrQkMsVUFBVU4sSUFBVixDQUFlSyxVQUFqQztBQUNBO0FBQ0RMLFdBQU9FLEtBQUtLLDBCQUFMLENBQWdDUCxJQUFoQyxDQUFQO0FBQ0EsUUFBSVEsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsWUFBSCxDQUFnQix5QkFBaEIsRUFBMkNWLElBQTNDLEVBQWlEQyxRQUFqRDtBQUNBLElBUkQsQ0FRRSxPQUFPVSxDQUFQLEVBQVU7QUFD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O0VBdExtQ08scUI7O2tCQXdMdEI5QixzQiIsImZpbGUiOiJEZXZpY2VQYXJhbWV0ZXJTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTZXJ2aWNlIGZyb20gJy4vQmFzZVNlcnZpY2UnO1xyXG5jbGFzcyBEZXZpY2VQYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdCBEZXZpY2VQYXJhbWV0ZXJ9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG4gICAgICovXHJcblx0Z2V0TGlzdChkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YSkpIHtcclxuXHRcdFx0XHRkYXRhLmN1cnJlbnRfcm93ID0gKHR5cGVvZiBkYXRhLmN1cnJlbnRfcm93ID09ICd1bmRlZmluZWQnKSA/IDAgOiBkYXRhLmN1cnJlbnRfcm93O1xyXG5cdFx0XHRcdGRhdGEubWF4X3JlY29yZCA9IENvbnN0YW50cy5kYXRhLm1heF9yZWNvcmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIkRldmljZVBhcmFtZXRlci5nZXRMaXN0XCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gTOG6pXkgdOG7lW5nIHPhu5EgZMOybmdcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG4gICAgICogQHNpbmNlIDMwLzA3LzIwMThcclxuXHQgKiBAcGFyYW0ge09iamVjdCBVc2VyfSBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdGdldFNpemUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvck9iamVjdChcIkRldmljZVBhcmFtZXRlci5nZXRTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBJbnNlcnQgZGF0YVxyXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdCBEZXZpY2VQYXJhbWV0ZXJ9IGRhdGFcclxuICAgICAqL1xyXG5cdGluc2VydERldmljZVBhcmFtZXRlcihkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblxyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiRGV2aWNlUGFyYW1ldGVyLmluc2VydERldmljZVBhcmFtZXRlclwiLCBkYXRhKTtcclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0RldmljZVBhcmFtZXRlcicsIGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGRhdGFcclxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG4gICAgICogQHBhcmFtIHtPYmplY3QgRGV2aWNlUGFyYW1ldGVyfSBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG4gICAgICovXHJcblx0dXBkYXRlRGV2aWNlUGFyYW1ldGVyKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkRldmljZVBhcmFtZXRlci51cGRhdGVEZXZpY2VQYXJhbWV0ZXJcIiwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHN0YXR1c1xyXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdCBEZXZpY2VQYXJhbWV0ZXJ9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcbiAgICAgKi9cclxuXHR1cGRhdGVTdGF0dXMoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi51cGRhdGUoXCJEZXZpY2VQYXJhbWV0ZXIudXBkYXRlU3RhdHVzXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxCYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5EZXZpY2VQYXJhbWV0ZXIoZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBpc19kZWxldGUgPSAxXHJcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0IERldmljZVBhcmFtZXRlcn0gZGF0YVxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuICAgICAqL1xyXG5cdGRlbGV0ZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmRlbGV0ZShcIkRldmljZVBhcmFtZXRlci5kZWxldGVcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLkRldmljZVBhcmFtZXRlcihlKTtcclxuXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCogZ2V0IGRldGFpbCBEZXZpY2VQYXJhbWV0ZXJcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHRnZXREZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiRGV2aWNlUGFyYW1ldGVyLmdldERldGFpbFwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHJzKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdEZXZpY2VQYXJhbWV0ZXIgZ2V0IG1hdGVyaWFsIG9yZGVyIGZvciB2b3VjaGVyIG91dCcsIGVycik7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IERldmljZVBhcmFtZXRlclNlcnZpY2U7XHJcbiJdfQ==