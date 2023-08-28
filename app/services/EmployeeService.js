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

var EmployeeService = function (_BaseService) {
	_inherits(EmployeeService, _BaseService);

	function EmployeeService() {
		_classCallCheck(this, EmployeeService);

		return _possibleConstructorReturn(this, (EmployeeService.__proto__ || Object.getPrototypeOf(EmployeeService)).call(this));
	}

	/**
  * @description Update status
  * @author Long.Pham
  * @since 11/07/2019
  * @param {Object Role} data
  * @param {function callback} callback
  */


	_createClass(EmployeeService, [{
		key: "updateStatus",
		value: function updateStatus(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("Employee.updateStatus", data, function (err, rs) {
					return callback(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
   * @description Update status
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Role} data
   * @param {function callback} callback
   */

	}, {
		key: "updateStatusMailConfig",
		value: function updateStatusMailConfig(data, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.queryForObject("Employee.checkMailConfigExist", data);
						if (rs) {
							rs = await db.update("Employee.updateStatusMailConfig", data);
						} else {
							rs = await db.insert("Employee.insertMailConfig", data);
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

			// try {
			// 	data = Libs.convertEmptyPropToNullProp(data);
			// 	var db = new mySqLDB();
			// 	checkMailConfigExist

			// 	db.update("Employee.updateStatusMailConfig", data, (err, rs) => {
			// 		return callback(err, rs)
			// 	});
			// } catch (e) {
			// 	this.logger.error(e);
			// 	callback(false, e);
			// }
		}

		/**
   * @description Update status -1
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Role} data
   * @param {function callback} callback
   */

	}, {
		key: "delete",
		value: function _delete(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("Employee.delete", data, function (err, rs) {
					return callback(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object Floor} data
   */

	}, {
		key: "insertEmployee",
		value: function insertEmployee(data, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.insert("Employee.insertEmployee", data);
						var curId = rs.insertId;
						if (!rs) {
							conn.rollback();
							callBack(false, {});
							return;
						}
						// insert table employee role map
						var role_data = data.role_data;
						if (Libs.isArrayData(role_data) && role_data.length > 0) {
							for (var i = 0; i < role_data.length; i++) {
								role_data[i].id_employee = curId;
							}
							await db.insert("Employee.insertEmployeeRoleMap", { role_data: role_data });
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
   * Kiem tra staff exist 
   * @param {Object} permission 
   */

	}, {
		key: "checkEmployeeExistByEmail",
		value: function checkEmployeeExistByEmail(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("Employee.checkEmployeeExistByEmail", data, callback);
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
   * check staff exist
   * @param {object} data 
   * @param {Function} callback 
   */

	}, {
		key: "checkLogin",
		value: function checkLogin(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("Employee.getEmployeeLogin", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * get staff permission
   * @param {Object} data 
   */

	}, {
		key: "getEmployeePermissions",
		value: async function getEmployeePermissions(data) {
			try {
				var mapping = {};
				mapping.id_company = data.id_company;
				mapping.id_employee = data.id;
				mapping.id_roles = data.id_roles;
				mapping.lang = data.lang;
				mapping.id_language = data.id_language;
				var db = new mySqLDB();
				var rows = await db.queryForList("Employee.getEmployeePermissions", mapping);
				if (!rows) {
					return false;
				}
				var result = [];
				rows.forEach(function (row) {
					var p = JSON.parse(JSON.stringify(row));
					result.push(p);
				});
				return result;
			} catch (e) {
				console.log(e);
				return false;
			}
		}

		/**
   * get list language by id company
   * @param {Object} data 
   */

	}, {
		key: "getListLanguage",
		value: async function getListLanguage(data) {
			try {
				var mapping = {};
				mapping.id_company = data.id_company;
				var db = new mySqLDB();
				var rows = await db.queryForList("Employee.getListLanguage", mapping);
				if (!rows) {
					return false;
				}
				var result = [];
				rows.forEach(function (row) {
					var p = JSON.parse(JSON.stringify(row));
					result.push(p);
				});
				return result;
			} catch (e) {
				console.log(e);
				return false;
			}
		}

		/**
   * Kiem tra staff exist 
   * @param {Object} permission 
  */

	}, {
		key: "checkEmployeeForgotPassword",
		value: function checkEmployeeForgotPassword(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("Employee.checkEmployeeForgotPassword", data, callback);
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
   * @description Update password
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object User} data
   * @param {function callback} callback
   */

	}, {
		key: "resetPassword",
		value: async function resetPassword(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				var rs = await db.update("Employee.resetChangePassword", data, callback);
				return rs;
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * Build object permission to array key path
   * @param {Array} permission 
   */

	}, {
		key: "buildPermission",
		value: function buildPermission(permission) {
			if (null == permission || typeof permission === 'undefined') {
				return null;
			}
			var ps = {};
			for (var i = 0; i < permission.length; i++) {
				var per = permission[i];
				ps[per.module_path] = {
					id: per.id,
					auth: per.auths,
					title: per.screen_name,
					module_path: per.module_path,
					group_type: per.group_type,
					class_icon: per.class_icon,
					parent: per.parent
				};
			}
			return ps;
		}

		/**
  * get detail employee update profile
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: "getDetailUpdateProfile",
		value: function getDetailUpdateProfile(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("Employee.getDetailUpdateProfile", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
  * get detail employee
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: "getDetail",
		value: function getDetail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.queryForList("Employee.getDetail", param);
						var data = rs[0][0];
						data.role_data = rs[1];
						data.regency_data = rs[2];

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
   * @description Update data
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Department} data
   * @param {function callback} callback
   */

	}, {
		key: "updateEmployee",
		value: function updateEmployee(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.delete("Employee.deleteEmployeeRoleMap", data);
					if (Libs.isBlank(data.password)) {
						rs = await db.update("Employee.update", data);
					} else {
						rs = await db.update("Employee.updateAndPassword", data);
					}

					// insert table employee role map
					var role_data = data.role_data;
					if (Libs.isArrayData(role_data) && role_data.length > 0) {
						for (var i = 0; i < role_data.length; i++) {
							role_data[i].id_employee = data.id;
						}
						rs = await db.insert("Employee.insertEmployeeRoleMap", { role_data: role_data });
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
		}

		/**
   * @description Update profile
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Supplier} data
   * @param {function callback} callback
   */

	}, {
		key: "updateProfile",
		value: function updateProfile(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("Employee.updateProfile", data, function (err, rs) {
					return callback(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
   * Kiem tra employee exist by id_company, email 
   * @param {Object} permission 
   */

	}, {
		key: "checkEmployeeExist",
		value: async function checkEmployeeExist(data) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				return await db.queryForObject("Employee.checkEmployeeExist", data);
			} catch (e) {
				return callback(false, e);
			}
		}

		/**
   * @description Update password
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object User} data
   * @param {function callback} callback
   */

	}, {
		key: "updateEmployeePassword",
		value: async function updateEmployeePassword(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				var rs = await db.update("Employee.updateEmployeePassword", data, callback);
				return rs;
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * set cache
   * @param {StaffEntity} userE 
   * @param {Object} permissions 
   */

	}, {
		key: "setCachePermission",
		value: async function setCachePermission(userE, permissions) {
			try {
				var _index = config.elasticSearch.index;
				var _type = Constants.elastic_type.permission_cache;
				await elastic.setAsync(_index, _type, {
					id: userE.email,
					permissions: JSON.stringify(permissions)
				});
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		}

		/**
   * get permission cache
   * @param {StaffEntity} userE 
   */

	}, {
		key: "getCachePermission",
		value: async function getCachePermission(userE) {
			try {
				if (!userE) {
					return false;
				}

				var _index = config.elasticSearch.index;
				var _type = Constants.elastic_type.permission_cache;
				var rs = await elastic.getAsync(_index, _type, userE.email);
				return rs;
			} catch (e) {
				console.log(e);
				return false;
			}
		}

		/**
   * @description Get list
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: "getList",
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Employee.getList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get list
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListProjectConfigMail",
		value: function getListProjectConfigMail(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Employee.getListProjectConfigMail", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}
		/**
   * @description Get list
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListAll",
		value: function getListAll(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Employee.getListAll", data, callback);
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
		key: "getSize",
		value: function getSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("Employee.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		// /**
		//  * @description Lấy tổng số dòng
		//  * @author Long.Pham
		//  * @since 30/07/2018
		//  * @param {Object User} data
		//  * @param {function callback} callback
		//  */

	}, {
		key: "getListProjectConfigMailSize",
		value: function getListProjectConfigMailSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("Employee.getListProjectConfigMailSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}
	}]);

	return EmployeeService;
}(_BaseService3.default);

exports.default = EmployeeService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9FbXBsb3llZVNlcnZpY2UuanMiXSwibmFtZXMiOlsiRW1wbG95ZWVTZXJ2aWNlIiwiZGF0YSIsImNhbGxiYWNrIiwiTGlicyIsImNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wIiwiZGIiLCJteVNxTERCIiwidXBkYXRlIiwiZXJyIiwicnMiLCJlIiwibG9nZ2VyIiwiZXJyb3IiLCJjYWxsQmFjayIsImJlZ2luVHJhbnNhY3Rpb24iLCJjb25uIiwicXVlcnlGb3JPYmplY3QiLCJpbnNlcnQiLCJyb2xsYmFjayIsImNvbW1pdCIsImNvbnNvbGUiLCJsb2ciLCJkZWxldGUiLCJjdXJJZCIsImluc2VydElkIiwicm9sZV9kYXRhIiwiaXNBcnJheURhdGEiLCJsZW5ndGgiLCJpIiwiaWRfZW1wbG95ZWUiLCJtYXBwaW5nIiwiaWRfY29tcGFueSIsImlkIiwiaWRfcm9sZXMiLCJsYW5nIiwiaWRfbGFuZ3VhZ2UiLCJyb3dzIiwicXVlcnlGb3JMaXN0IiwicmVzdWx0IiwiZm9yRWFjaCIsInAiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJyb3ciLCJwdXNoIiwicGVybWlzc2lvbiIsInBzIiwicGVyIiwibW9kdWxlX3BhdGgiLCJhdXRoIiwiYXV0aHMiLCJ0aXRsZSIsInNjcmVlbl9uYW1lIiwiZ3JvdXBfdHlwZSIsImNsYXNzX2ljb24iLCJwYXJlbnQiLCJwYXJhbSIsInJlZ2VuY3lfZGF0YSIsInNlbGYiLCJpc0JsYW5rIiwicGFzc3dvcmQiLCJ1c2VyRSIsInBlcm1pc3Npb25zIiwiX2luZGV4IiwiY29uZmlnIiwiZWxhc3RpY1NlYXJjaCIsImluZGV4IiwiX3R5cGUiLCJDb25zdGFudHMiLCJlbGFzdGljX3R5cGUiLCJwZXJtaXNzaW9uX2NhY2hlIiwiZWxhc3RpYyIsInNldEFzeW5jIiwiZW1haWwiLCJnZXRBc3luYyIsImN1cnJlbnRfcm93IiwibWF4X3JlY29yZCIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoi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Q0EsV0FBT1IsU0FBUyxLQUFULEVBQWdCUSxDQUFoQixDQUFQO0FBQ0E7QUFDRDs7OztFQXBsQjRCb0UscUI7O2tCQXdsQmY5RSxlIiwiZmlsZSI6IkVtcGxveWVlU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuY2xhc3MgRW1wbG95ZWVTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHN0YXR1c1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBSb2xlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHR1cGRhdGVTdGF0dXMoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi51cGRhdGUoXCJFbXBsb3llZS51cGRhdGVTdGF0dXNcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRcclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHN0YXR1c1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBSb2xlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHQgdXBkYXRlU3RhdHVzTWFpbENvbmZpZyhkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIkVtcGxveWVlLmNoZWNrTWFpbENvbmZpZ0V4aXN0XCIsIGRhdGEpO1xyXG5cdFx0XHRcdFx0aWYocnMpe1xyXG5cdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkVtcGxveWVlLnVwZGF0ZVN0YXR1c01haWxDb25maWdcIiwgZGF0YSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIkVtcGxveWVlLmluc2VydE1haWxDb25maWdcIiwgZGF0YSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyB0cnkge1xyXG5cdFx0Ly8gXHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdC8vIFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdC8vIFx0Y2hlY2tNYWlsQ29uZmlnRXhpc3RcclxuXHJcblx0XHQvLyBcdGRiLnVwZGF0ZShcIkVtcGxveWVlLnVwZGF0ZVN0YXR1c01haWxDb25maWdcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdC8vIFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyLCBycylcclxuXHRcdC8vIFx0fSk7XHJcblx0XHQvLyB9IGNhdGNoIChlKSB7XHJcblx0XHQvLyBcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0Ly8gXHRjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHQvLyB9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHN0YXR1cyAtMVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBSb2xlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRkZWxldGUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5kZWxldGUoXCJFbXBsb3llZS5kZWxldGVcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEluc2VydCBkYXRhXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IEZsb29yfSBkYXRhXHJcblx0ICovXHJcblx0aW5zZXJ0RW1wbG95ZWUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiRW1wbG95ZWUuaW5zZXJ0RW1wbG95ZWVcIiwgZGF0YSk7XHJcblx0XHRcdFx0XHR2YXIgY3VySWQgPSBycy5pbnNlcnRJZDtcclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgZW1wbG95ZWUgcm9sZSBtYXBcclxuXHRcdFx0XHRcdGxldCByb2xlX2RhdGEgPSBkYXRhLnJvbGVfZGF0YVxyXG5cdFx0XHRcdFx0aWYgKExpYnMuaXNBcnJheURhdGEocm9sZV9kYXRhKSAmJiByb2xlX2RhdGEubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJvbGVfZGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdHJvbGVfZGF0YVtpXS5pZF9lbXBsb3llZSA9IGN1cklkO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGF3YWl0IGRiLmluc2VydChcIkVtcGxveWVlLmluc2VydEVtcGxveWVlUm9sZU1hcFwiLCB7IHJvbGVfZGF0YSB9KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcicsIGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogS2llbSB0cmEgc3RhZmYgZXhpc3QgXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IHBlcm1pc3Npb24gXHJcblx0ICovXHJcblxyXG5cdGNoZWNrRW1wbG95ZWVFeGlzdEJ5RW1haWwoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvck9iamVjdChcIkVtcGxveWVlLmNoZWNrRW1wbG95ZWVFeGlzdEJ5RW1haWxcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIGNoZWNrIHN0YWZmIGV4aXN0XHJcblx0ICogQHBhcmFtIHtvYmplY3R9IGRhdGEgXHJcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Y2hlY2tMb2dpbihkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiRW1wbG95ZWUuZ2V0RW1wbG95ZWVMb2dpblwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogZ2V0IHN0YWZmIHBlcm1pc3Npb25cclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBcclxuXHQgKi9cclxuXHRhc3luYyBnZXRFbXBsb3llZVBlcm1pc3Npb25zKGRhdGEpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBtYXBwaW5nID0ge307XHJcblx0XHRcdG1hcHBpbmcuaWRfY29tcGFueSA9IGRhdGEuaWRfY29tcGFueTtcclxuXHRcdFx0bWFwcGluZy5pZF9lbXBsb3llZSA9IGRhdGEuaWQ7XHJcblx0XHRcdG1hcHBpbmcuaWRfcm9sZXMgPSBkYXRhLmlkX3JvbGVzO1xyXG5cdFx0XHRtYXBwaW5nLmxhbmcgPSBkYXRhLmxhbmc7XHJcblx0XHRcdG1hcHBpbmcuaWRfbGFuZ3VhZ2UgPSBkYXRhLmlkX2xhbmd1YWdlO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRsZXQgcm93cyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkVtcGxveWVlLmdldEVtcGxveWVlUGVybWlzc2lvbnNcIiwgbWFwcGluZyk7XHJcblx0XHRcdGlmICghcm93cykge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgcmVzdWx0ID0gW107XHJcblx0XHRcdHJvd3MuZm9yRWFjaChyb3cgPT4ge1xyXG5cdFx0XHRcdGxldCBwID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyb3cpKTtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChwKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogZ2V0IGxpc3QgbGFuZ3VhZ2UgYnkgaWQgY29tcGFueVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFxyXG5cdCAqL1xyXG5cdGFzeW5jIGdldExpc3RMYW5ndWFnZShkYXRhKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgbWFwcGluZyA9IHt9O1xyXG5cdFx0XHRtYXBwaW5nLmlkX2NvbXBhbnkgPSBkYXRhLmlkX2NvbXBhbnk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGxldCByb3dzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiRW1wbG95ZWUuZ2V0TGlzdExhbmd1YWdlXCIsIG1hcHBpbmcpO1xyXG5cdFx0XHRpZiAoIXJvd3MpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHJlc3VsdCA9IFtdO1xyXG5cdFx0XHRyb3dzLmZvckVhY2gocm93ID0+IHtcclxuXHRcdFx0XHRsZXQgcCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocm93KSk7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2gocCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogS2llbSB0cmEgc3RhZmYgZXhpc3QgXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IHBlcm1pc3Npb24gXHJcblx0Ki9cclxuXHJcblx0Y2hlY2tFbXBsb3llZUZvcmdvdFBhc3N3b3JkKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJFbXBsb3llZS5jaGVja0VtcGxveWVlRm9yZ290UGFzc3dvcmRcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgcGFzc3dvcmRcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgVXNlcn0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0YXN5bmMgcmVzZXRQYXNzd29yZChkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGxldCBycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkVtcGxveWVlLnJlc2V0Q2hhbmdlUGFzc3dvcmRcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0XHRyZXR1cm4gcnM7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBCdWlsZCBvYmplY3QgcGVybWlzc2lvbiB0byBhcnJheSBrZXkgcGF0aFxyXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHBlcm1pc3Npb24gXHJcblx0ICovXHJcblx0YnVpbGRQZXJtaXNzaW9uKHBlcm1pc3Npb24pIHtcclxuXHRcdGlmIChudWxsID09IHBlcm1pc3Npb24gfHwgdHlwZW9mIHBlcm1pc3Npb24gPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHBzID0ge31cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGVybWlzc2lvbi5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgcGVyID0gcGVybWlzc2lvbltpXTtcclxuXHRcdFx0cHNbcGVyLm1vZHVsZV9wYXRoXSA9IHsgXHJcblx0XHRcdFx0aWQ6IHBlci5pZCwgXHJcblx0XHRcdFx0YXV0aDogcGVyLmF1dGhzLCBcclxuXHRcdFx0XHR0aXRsZTogcGVyLnNjcmVlbl9uYW1lLCBcclxuXHRcdFx0XHRtb2R1bGVfcGF0aDogcGVyLm1vZHVsZV9wYXRoLCBcclxuXHRcdFx0XHRncm91cF90eXBlOiBwZXIuZ3JvdXBfdHlwZSwgXHJcblx0XHRcdFx0Y2xhc3NfaWNvbjogcGVyLmNsYXNzX2ljb24sXHJcblx0XHRcdFx0cGFyZW50OiBwZXIucGFyZW50IFxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBzO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCogZ2V0IGRldGFpbCBlbXBsb3llZSB1cGRhdGUgcHJvZmlsZVxyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cclxuXHRnZXREZXRhaWxVcGRhdGVQcm9maWxlKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJFbXBsb3llZS5nZXREZXRhaWxVcGRhdGVQcm9maWxlXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgZW1wbG95ZWVcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHJcblx0Z2V0RGV0YWlsKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJFbXBsb3llZS5nZXREZXRhaWxcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSByc1swXVswXTtcclxuXHRcdFx0XHRcdGRhdGEucm9sZV9kYXRhID0gcnNbMV07XHJcblx0XHRcdFx0XHRkYXRhLnJlZ2VuY3lfZGF0YSA9IHJzWzJdO1xyXG5cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBkYXRhXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IERlcGFydG1lbnR9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdHVwZGF0ZUVtcGxveWVlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmRlbGV0ZShcIkVtcGxveWVlLmRlbGV0ZUVtcGxveWVlUm9sZU1hcFwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoTGlicy5pc0JsYW5rKGRhdGEucGFzc3dvcmQpKSB7XHJcblx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkVtcGxveWVlLnVwZGF0ZVwiLCBkYXRhKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi51cGRhdGUoXCJFbXBsb3llZS51cGRhdGVBbmRQYXNzd29yZFwiLCBkYXRhKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgZW1wbG95ZWUgcm9sZSBtYXBcclxuXHRcdFx0XHRsZXQgcm9sZV9kYXRhID0gZGF0YS5yb2xlX2RhdGFcclxuXHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShyb2xlX2RhdGEpICYmIHJvbGVfZGF0YS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJvbGVfZGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRyb2xlX2RhdGFbaV0uaWRfZW1wbG95ZWUgPSBkYXRhLmlkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJFbXBsb3llZS5pbnNlcnRFbXBsb3llZVJvbGVNYXBcIiwgeyByb2xlX2RhdGEgfSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBwcm9maWxlXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFN1cHBsaWVyfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHR1cGRhdGVQcm9maWxlKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIudXBkYXRlKFwiRW1wbG95ZWUudXBkYXRlUHJvZmlsZVwiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBjYWxsYmFjayhlcnIsIHJzKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0XHRcdGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogS2llbSB0cmEgZW1wbG95ZWUgZXhpc3QgYnkgaWRfY29tcGFueSwgZW1haWwgXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IHBlcm1pc3Npb24gXHJcblx0ICovXHJcblx0YXN5bmMgY2hlY2tFbXBsb3llZUV4aXN0KGRhdGEpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRyZXR1cm4gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJFbXBsb3llZS5jaGVja0VtcGxveWVlRXhpc3RcIiwgZGF0YSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHBhc3N3b3JkXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFVzZXJ9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdGFzeW5jIHVwZGF0ZUVtcGxveWVlUGFzc3dvcmQoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRsZXQgcnMgPSBhd2FpdCBkYi51cGRhdGUoXCJFbXBsb3llZS51cGRhdGVFbXBsb3llZVBhc3N3b3JkXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdFx0cmV0dXJuIHJzO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogc2V0IGNhY2hlXHJcblx0ICogQHBhcmFtIHtTdGFmZkVudGl0eX0gdXNlckUgXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IHBlcm1pc3Npb25zIFxyXG5cdCAqL1xyXG5cdGFzeW5jIHNldENhY2hlUGVybWlzc2lvbih1c2VyRSwgcGVybWlzc2lvbnMpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGxldCBfaW5kZXggPSBjb25maWcuZWxhc3RpY1NlYXJjaC5pbmRleDtcclxuXHRcdFx0bGV0IF90eXBlID0gQ29uc3RhbnRzLmVsYXN0aWNfdHlwZS5wZXJtaXNzaW9uX2NhY2hlO1xyXG5cdFx0XHRhd2FpdCBlbGFzdGljLnNldEFzeW5jKF9pbmRleCwgX3R5cGUsIHtcclxuXHRcdFx0XHRpZDogdXNlckUuZW1haWwsXHJcblx0XHRcdFx0cGVybWlzc2lvbnM6IEpTT04uc3RyaW5naWZ5KHBlcm1pc3Npb25zKVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIGdldCBwZXJtaXNzaW9uIGNhY2hlXHJcblx0ICogQHBhcmFtIHtTdGFmZkVudGl0eX0gdXNlckUgXHJcblx0ICovXHJcblx0YXN5bmMgZ2V0Q2FjaGVQZXJtaXNzaW9uKHVzZXJFKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoIXVzZXJFKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgX2luZGV4ID0gY29uZmlnLmVsYXN0aWNTZWFyY2guaW5kZXg7XHJcblx0XHRcdGxldCBfdHlwZSA9IENvbnN0YW50cy5lbGFzdGljX3R5cGUucGVybWlzc2lvbl9jYWNoZTtcclxuXHRcdFx0bGV0IHJzID0gYXdhaXQgZWxhc3RpYy5nZXRBc3luYyhfaW5kZXgsIF90eXBlLCB1c2VyRS5lbWFpbCk7XHJcblx0XHRcdHJldHVybiBycztcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0XHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Z2V0TGlzdChkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YSkpIHtcclxuXHRcdFx0XHRkYXRhLmN1cnJlbnRfcm93ID0gKHR5cGVvZiBkYXRhLmN1cnJlbnRfcm93ID09ICd1bmRlZmluZWQnKSA/IDAgOiBkYXRhLmN1cnJlbnRfcm93O1xyXG5cdFx0XHRcdGRhdGEubWF4X3JlY29yZCA9IENvbnN0YW50cy5kYXRhLm1heF9yZWNvcmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIkVtcGxveWVlLmdldExpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHRcclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHQgZ2V0TGlzdFByb2plY3RDb25maWdNYWlsKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhKSkge1xyXG5cdFx0XHRcdGRhdGEuY3VycmVudF9yb3cgPSAodHlwZW9mIGRhdGEuY3VycmVudF9yb3cgPT0gJ3VuZGVmaW5lZCcpID8gMCA6IGRhdGEuY3VycmVudF9yb3c7XHJcblx0XHRcdFx0ZGF0YS5tYXhfcmVjb3JkID0gQ29uc3RhbnRzLmRhdGEubWF4X3JlY29yZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiRW1wbG95ZWUuZ2V0TGlzdFByb2plY3RDb25maWdNYWlsXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdGdldExpc3RBbGwoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEpKSB7XHJcblx0XHRcdFx0ZGF0YS5jdXJyZW50X3JvdyA9ICh0eXBlb2YgZGF0YS5jdXJyZW50X3JvdyA9PSAndW5kZWZpbmVkJykgPyAwIDogZGF0YS5jdXJyZW50X3JvdztcclxuXHRcdFx0XHRkYXRhLm1heF9yZWNvcmQgPSBDb25zdGFudHMuZGF0YS5tYXhfcmVjb3JkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvckxpc3QoXCJFbXBsb3llZS5nZXRMaXN0QWxsXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMThcclxuXHQgKiBAcGFyYW0ge09iamVjdCBVc2VyfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRnZXRTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJFbXBsb3llZS5nZXRTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0XHJcblx0Ly8gLyoqXHJcblx0Ly8gICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0Ly8gICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQvLyAgKiBAc2luY2UgMzAvMDcvMjAxOFxyXG5cdC8vICAqIEBwYXJhbSB7T2JqZWN0IFVzZXJ9IGRhdGFcclxuXHQvLyAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdC8vICAqL1xyXG5cdGdldExpc3RQcm9qZWN0Q29uZmlnTWFpbFNpemUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvck9iamVjdChcIkVtcGxveWVlLmdldExpc3RQcm9qZWN0Q29uZmlnTWFpbFNpemVcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFbXBsb3llZVNlcnZpY2U7XHJcbiJdfQ==