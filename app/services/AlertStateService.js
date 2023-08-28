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

var AlertStateService = function (_BaseService) {
	_inherits(AlertStateService, _BaseService);

	function AlertStateService() {
		_classCallCheck(this, AlertStateService);

		return _possibleConstructorReturn(this, (AlertStateService.__proto__ || Object.getPrototypeOf(AlertStateService)).call(this));
	}

	/**
     * @description Get list
     * @author Long.Pham
     * @since 30/07/2019
     * @param {Object AlertState} data
     * @param {function callback} callback 
     */


	_createClass(AlertStateService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("AlertState.getList", data, callback);
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
				db.queryForObject("AlertState.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
      * @description Insert data
      * @author Long.Pham
      * @since 30/07/2019
      * @param {Object AlertState} data
      */

	}, {
		key: 'insertAlertState',
		value: function insertAlertState(data, callBack) {
			try {
				var self = this;
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {

						var rs = await db.insert("AlertState.insertAlertState", data);
						var curId = rs.insertId;

						if (!rs) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						// insert table AlertState detail
						var dataDetail = data.data;
						if (dataDetail.length > 0) {
							for (var i = 0; i < dataDetail.length; i++) {
								dataDetail[i].id_error_state = curId;
							}
							rs = await db.insert("AlertState.insertAlertStateDetail", { dataDetail: dataDetail });
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
				console.log('error', e);
				callBack(false, e);
			}
		}

		/**
      * @description Update data
      * @author Long.Pham
      * @since 11/07/2019
      * @param {Object AlertState} data
      * @param {function callback} callback
      */

	}, {
		key: 'updateAlertState',
		value: function updateAlertState(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var rs = await db.delete("AlertState.deleteAlertStateDetail", data);
					rs = await db.update("AlertState.updateAlertState", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					// insert table AlertState detail
					var dataDetail = data.data;
					if (dataDetail.length > 0) {
						await db.insert("AlertState.insertAlertStateDetail", { dataDetail: dataDetail });
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
      * @param {Object AlertState} data
      * @param {function callback} callback
      */

	}, {
		key: 'updateStatus',
		value: function updateStatus(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("AlertState.updateStatus", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
      * @description Update is_delete = 1
      * @author Long.Pham
      * @since 11/07/2019
      * @param {Object AlertState} data
      * @param {function callback} callback
      */

	}, {
		key: 'delete',
		value: function _delete(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("AlertState.delete", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
  * get detail AlertState
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
						var rs = await db.queryForList("AlertState.getDetail", param);
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
				// console.log('error get material order for voucher out', err);
				if (conn) {
					conn.rollback();
				}
				callBack(true, err);
			}
		}

		/**
   * @description Get all
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object AlertState} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getDropDownList',
		value: function getDropDownList(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("AlertState.getDropDownList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}
	}]);

	return AlertStateService;
}(_BaseService3.default);

exports.default = AlertStateService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9BbGVydFN0YXRlU2VydmljZS5qcyJdLCJuYW1lcyI6WyJBbGVydFN0YXRlU2VydmljZSIsImRhdGEiLCJjYWxsYmFjayIsIkxpYnMiLCJpc0JsYW5rIiwiY3VycmVudF9yb3ciLCJtYXhfcmVjb3JkIiwiQ29uc3RhbnRzIiwiY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AiLCJkYiIsIm15U3FMREIiLCJxdWVyeUZvckxpc3QiLCJlIiwiY29uc29sZSIsImxvZyIsInF1ZXJ5Rm9yT2JqZWN0IiwiY2FsbEJhY2siLCJzZWxmIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJycyIsImluc2VydCIsImN1cklkIiwiaW5zZXJ0SWQiLCJyb2xsYmFjayIsImRhdGFEZXRhaWwiLCJsZW5ndGgiLCJpIiwiaWRfZXJyb3Jfc3RhdGUiLCJjb21taXQiLCJlcnIiLCJkZWxldGUiLCJ1cGRhdGUiLCJsb2dnZXIiLCJlcnJvciIsInBhcmFtIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxpQjs7O0FBQ0wsOEJBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzswQkFPUUMsSSxFQUFNQyxRLEVBQVU7QUFDdkIsT0FBSTtBQUNILFFBQUksQ0FBQ0MsS0FBS0MsT0FBTCxDQUFhSCxJQUFiLENBQUwsRUFBeUI7QUFDeEJBLFVBQUtJLFdBQUwsR0FBb0IsT0FBT0osS0FBS0ksV0FBWixJQUEyQixXQUE1QixHQUEyQyxDQUEzQyxHQUErQ0osS0FBS0ksV0FBdkU7QUFDQUosVUFBS0ssVUFBTCxHQUFrQkMsVUFBVU4sSUFBVixDQUFlSyxVQUFqQztBQUNBO0FBQ0RMLFdBQU9FLEtBQUtLLDBCQUFMLENBQWdDUCxJQUFoQyxDQUFQO0FBQ0EsUUFBSVEsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsWUFBSCxDQUFnQixvQkFBaEIsRUFBc0NWLElBQXRDLEVBQTRD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LENBQVo7QUFDQSxXQUFPVixTQUFTLEtBQVQsRUFBZ0JVLENBQWhCLENBQVA7QUFDQTtBQUNEOzs7O0VBL044QndCLHFCOztrQkFrT2pCcEMsaUIiLCJmaWxlIjoiQWxlcnRTdGF0ZVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmNsYXNzIEFsZXJ0U3RhdGVTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdCBBbGVydFN0YXRlfSBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuICAgICAqL1xyXG5cdGdldExpc3QoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEpKSB7XHJcblx0XHRcdFx0ZGF0YS5jdXJyZW50X3JvdyA9ICh0eXBlb2YgZGF0YS5jdXJyZW50X3JvdyA9PSAndW5kZWZpbmVkJykgPyAwIDogZGF0YS5jdXJyZW50X3JvdztcclxuXHRcdFx0XHRkYXRhLm1heF9yZWNvcmQgPSBDb25zdGFudHMuZGF0YS5tYXhfcmVjb3JkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvckxpc3QoXCJBbGVydFN0YXRlLmdldExpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMzAvMDcvMjAxOFxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFVzZXJ9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0Z2V0U2l6ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQWxlcnRTdGF0ZS5nZXRTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBJbnNlcnQgZGF0YVxyXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdCBBbGVydFN0YXRlfSBkYXRhXHJcbiAgICAgKi9cclxuXHRpbnNlcnRBbGVydFN0YXRlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmluc2VydChcIkFsZXJ0U3RhdGUuaW5zZXJ0QWxlcnRTdGF0ZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRcdHZhciBjdXJJZCA9IHJzLmluc2VydElkO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgQWxlcnRTdGF0ZSBkZXRhaWxcclxuXHRcdFx0XHRcdGxldCBkYXRhRGV0YWlsID0gZGF0YS5kYXRhO1xyXG5cdFx0XHRcdFx0aWYgKGRhdGFEZXRhaWwubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFEZXRhaWwubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRGV0YWlsW2ldLmlkX2Vycm9yX3N0YXRlID0gY3VySWQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJBbGVydFN0YXRlLmluc2VydEFsZXJ0U3RhdGVEZXRhaWxcIiwgeyBkYXRhRGV0YWlsIH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcicsIGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGRhdGFcclxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG4gICAgICogQHBhcmFtIHtPYmplY3QgQWxlcnRTdGF0ZX0gZGF0YVxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuICAgICAqL1xyXG5cdHVwZGF0ZUFsZXJ0U3RhdGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuZGVsZXRlKFwiQWxlcnRTdGF0ZS5kZWxldGVBbGVydFN0YXRlRGV0YWlsXCIsIGRhdGEpO1xyXG5cdFx0XHRcdHJzID0gYXdhaXQgZGIudXBkYXRlKFwiQWxlcnRTdGF0ZS51cGRhdGVBbGVydFN0YXRlXCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgQWxlcnRTdGF0ZSBkZXRhaWxcclxuXHRcdFx0XHRsZXQgZGF0YURldGFpbCA9IGRhdGEuZGF0YTtcclxuXHRcdFx0XHRpZiAoZGF0YURldGFpbC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRhd2FpdCBkYi5pbnNlcnQoXCJBbGVydFN0YXRlLmluc2VydEFsZXJ0U3RhdGVEZXRhaWxcIiwgeyBkYXRhRGV0YWlsIH0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHN0YXR1c1xyXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdCBBbGVydFN0YXRlfSBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG4gICAgICovXHJcblx0dXBkYXRlU3RhdHVzKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIudXBkYXRlKFwiQWxlcnRTdGF0ZS51cGRhdGVTdGF0dXNcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgaXNfZGVsZXRlID0gMVxyXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdCBBbGVydFN0YXRlfSBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG4gICAgICovXHJcblx0ZGVsZXRlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuZGVsZXRlKFwiQWxlcnRTdGF0ZS5kZWxldGVcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0KiBnZXQgZGV0YWlsIEFsZXJ0U3RhdGVcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHRnZXREZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkFsZXJ0U3RhdGUuZ2V0RGV0YWlsXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdHZhciBkYXRhID0gcnNbMF1bMF07XHJcblx0XHRcdFx0XHRkYXRhLmRhdGEgPSByc1sxXTtcclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnZXJyb3IgZ2V0IG1hdGVyaWFsIG9yZGVyIGZvciB2b3VjaGVyIG91dCcsIGVycik7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGFsbFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBBbGVydFN0YXRlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0IGdldERyb3BEb3duTGlzdChkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIkFsZXJ0U3RhdGUuZ2V0RHJvcERvd25MaXN0XCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBBbGVydFN0YXRlU2VydmljZTtcclxuIl19