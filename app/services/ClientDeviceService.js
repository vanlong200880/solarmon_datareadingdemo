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

var ClientDeviceService = function (_BaseService) {
	_inherits(ClientDeviceService, _BaseService);

	function ClientDeviceService() {
		_classCallCheck(this, ClientDeviceService);

		return _possibleConstructorReturn(this, (ClientDeviceService.__proto__ || Object.getPrototypeOf(ClientDeviceService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 12/09/2021
  * @param {Object} data
  * @param {function callback} callback 
  */

	_createClass(ClientDeviceService, [{
		key: "getList",
		value: function getList(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					data.current_date = Libs.convertAllFormatDate(data.current_date);
					var dataDevice = await db.queryForList("ClientDevice.getList", data);
					if (Libs.isArrayData(dataDevice)) {
						for (var i = 0; i < dataDevice.length; i++) {
							var item = dataDevice[i];
							// Get list alert
							var alerts = await db.queryForList("ClientDevice.getAlertByDevice", {
								id_device: item.id,
								id_language: data.id_language
							});
							dataDevice[i].alerts = alerts;

							// Get last updated
							// let objLastUpdate= await db.queryForObject("ClientDevice.getLastUpdated", {
							// 	id_device: item.id,
							// 	id_language: data.id_language,
							// 	table_name: item.table_name
							// });

							// if (objLastUpdate) {
							// 	dataDevice[i].last_updated = objLastUpdate.last_updated;
							// } else {
							// 	dataDevice[i].last_updated = null;
							// }


							// get info power now, energy, lifetime
							switch (item.table_name) {
								case 'model_inverter_SMA_STP110':
								case 'model_inverter_SMA_STP50':
								case 'model_inverter_SMA_SHP75':
								case 'model_inverter_ABB_PVS100':
									var objData = await db.queryForObject("ClientDevice.getDataDeviceEnergy", {
										id_device: item.id,
										id_language: data.id_language,
										table_name: item.table_name,
										current_date: data.current_date
									});
									if (objData) {
										dataDevice[i].power_now = objData.power_now / 1000;
										dataDevice[i].today_energy = objData.today_activeEnergy / 1000;
										dataDevice[i].lifetime = objData.lifetime;
										dataDevice[i].this_month = objData.this_month / 1000;
										// dataDevice[i].last_updated = objData.last_updated;
									} else {
										dataDevice[i].power_now = 0;
										dataDevice[i].today_energy = 0;
										dataDevice[i].lifetime = 0;
										// dataDevice[i].last_updated = null;
									}
									break;
								default:
									dataDevice[i].power_now = null;
									dataDevice[i].today_energy = null;
									dataDevice[i].lifetime = null;

									break;
							}
						}
					}

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
   * @param {Object Device} data
   * @param {function callback} callback
   */

	}, {
		key: "getSize",
		value: function getSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("ClientDevice.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get list
   * @author Long.Pham
   * @since 12/09/2021
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListParameterByDevice",
		value: function getListParameterByDevice(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var dataDevice = await db.queryForList("ClientDevice.getListParameterByDevice", data);

					var getLastRowDataDevice = await db.queryForObject("ClientDevice.getLastRowDataDevice", {
						id_device: data.id,
						id_language: data.id_language,
						table_name: data.table_name
					});
					var moment = require("moment");
					var date = moment().format('DD/MM/YYYY HH:mm:ss');

					if (Libs.isArrayData(dataDevice) && getLastRowDataDevice) {
						for (var i = 0; i < dataDevice.length; i++) {
							dataDevice[i].value = getLastRowDataDevice[dataDevice[i].slug];
							dataDevice[i].last_communication = getLastRowDataDevice['last_communication'];
							dataDevice[i].last_attempt = date;
						}
					}
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
   * @description Get list alert by deivce
   * @author Long.Pham
   * @since 18/09/2021
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListAlertByDevice",
		value: function getListAlertByDevice(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("ClientDevice.getListAlertByDevice", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Lấy tổng số dòng
   * @author long.pham
   * @since 18/09/2021
   * @param {Object alert} data
   * @param {function callback} callback
   */

	}, {
		key: "getListAlertByDeviceSize",
		value: function getListAlertByDeviceSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("ClientDevice.getListAlertByDeviceSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get all
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object GroupAttributes} data
   * @param {function callback} callback 
   */
		// getAllProjectByEmployeeId(data, callBack) {
		// 	var db = new mySqLDB();
		// 	db.beginTransaction(async function (conn) {
		// 		try {
		// 			var dataProjects = [];
		// 			var scope = await db.queryForList("ClientDevice.getAllScope", data);
		// 			if (Libs.isArrayData(scope)) {
		// 				for (var i = 0; i < scope.length; i++) {
		// 					var item = scope[i];
		// 					item.id_employee = data.id_employee;
		// 					var listProjects = await db.queryForList("ClientDevice.getAllProjectByEmployeeId", item);
		// 					if (Libs.isArrayData(listProjects) && listProjects.length > 0) {
		// 						item.dataChilds = listProjects;
		// 						dataProjects.push(item);
		// 					}
		// 				}
		// 			}

		// 			conn.commit();
		// 			callBack(false, dataProjects);
		// 		} catch (err) {
		// 			console.log("Lỗi rolback", err);
		// 			conn.rollback();
		// 			callBack(true, err);
		// 		}
		// 	});
		// }


		// /**
		//  * @description Get list project by employee id
		//  * @author Long.Pham
		//  * @since 30/09/2021
		//  * @param {Object ClientDevice} data
		//  * @param {function callback} callback 
		//  */
		// getListProjectByEmployee(data, callBack) {
		// 	var db = new mySqLDB();
		// 	db.beginTransaction(async function (conn) {
		// 		try {
		// 			// var dataProjects = [];
		// 			var dataList = await db.queryForList("ClientDevice.getListProjectByEmployee", data);
		// 			if (Libs.isArrayData(dataList)) {
		// 				for (var i = 0; i < dataList.length; i++) {

		// 					// get group device
		// 					var item = dataList[i];
		// 					var deviceGroup = await db.queryForList("ClientDevice.getGroupDeviceByProjectId", item);
		// 					var irradiance = [];
		// 					var energy_today = 0, lifetime = 0, revenue = 0;
		// 					if(Libs.isArrayData(deviceGroup)){
		// 						for (var j = 0; j < deviceGroup.length; j++) {
		// 							switch(deviceGroup[j].table_name){
		// 								case 'model_inverter_SMA_STP50':
		// 								case 'model_inverter_SMA_SHP75': 
		// 								case 'model_inverter_ABB_PVS100':
		// 									let objDevice = await db.queryForObject("ClientDevice.getDataDeviceEnergy", {
		// 										id_project: dataList[i].id, 
		// 										id_device_group: deviceGroup[j].id,
		// 										table_name: deviceGroup[j].table_name
		// 									});
		// 									if(objDevice){
		// 										energy_today = energy_today + objDevice.today_activeEnergy;
		// 										lifetime = lifetime + objDevice.lifetime;
		// 									}
		// 								break;
		// 								case 'model_inverter_Sungrow_SG110CX': 
		// 								break;
		// 								case 'model_inverter_Growatt_GW80KTL3': 
		// 								break;
		// 								case 'model_sensor_IMT_SiRS485': 
		// 									let objDeviceIrradiance = await db.queryForList("ClientDevice.getDataDeviceIrradiance", {
		// 										id_project: dataList[i].id, 
		// 										id_device_group: deviceGroup[j].id,
		// 										table_name: deviceGroup[j].table_name
		// 									});
		// 									if(Libs.isArrayData(objDeviceIrradiance)){
		// 										irradiance = objDeviceIrradiance;
		// 									}
		// 								break;
		// 								case 'model_sensor_IMT_TaRS485': 
		// 								break;
		// 							}
		// 						}
		// 					}

		// 					// get alert by site

		// 					let arrAlert = await db.queryForList("ClientDevice.getAlertBySite", {
		// 						id_project: dataList[i].id, 
		// 						id_language: data.id_language
		// 					});

		// 					if(Libs.isArrayData(arrAlert)){
		// 						dataList[i].alerts = arrAlert;
		// 					} else {
		// 						dataList[i].alerts = [];
		// 					}

		// 					dataList[i].energy_today = energy_today;
		// 					dataList[i].lifetime = lifetime;
		// 					dataList[i].revenue = lifetime * dataList[i].config_revenue;
		// 					dataList[i].irradiance = irradiance;


		// 					// 
		// 					// item.id_employee = data.id_employee;
		// 					// var listProjects = await db.queryForList("ClientDevice.getAllProjectByEmployeeId", item);
		// 					// if (Libs.isArrayData(listProjects) && listProjects.length > 0) {
		// 					// 	item.dataChilds = listProjects;
		// 					// 	dataProjects.push(item);
		// 					// }
		// 				}
		// 			}

		// 			conn.commit();
		// 			callBack(false, dataList);
		// 		} catch (err) {
		// 			console.log("Lỗi rolback", err);
		// 			conn.rollback();
		// 			callBack(true, err);
		// 		}
		// 	});

		// 	// try {
		// 	// 	if (!Libs.isBlank(data)) {
		// 	// 		data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
		// 	// 		data.max_record = Constants.data.max_record;
		// 	// 	}
		// 	// 	data = Libs.convertEmptyPropToNullProp(data);
		// 	// 	var db = new mySqLDB();
		// 	// 	db.queryForList("ClientDevice.getListProjectByEmployee", data, callback);
		// 	// } catch (e) {
		// 	// 	console.log(e);
		// 	// 	return callback(false, e);
		// 	// }
		// }


		// /**
		//  * @description Lấy tổng số dòng
		//  * @author Long.Pham
		//  * @since 30/07/2018
		//  * @param {Object User} data
		//  * @param {function callback} callback
		//  */
		// getListProjectByEmployeeSize(data, callback) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.queryForObject("ClientDevice.getListProjectByEmployeeSize", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }

		/**
   * @description Get all project by employee id
   * @author Minh.Tuan
   * @since 30/07/2019
   * @param {Object ClientDevice} data
   * @param {function callback} callback 
   */
		//  getAllProjectByEmployeeId(data, callback) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.queryForList("ClientDevice.getAllProjectByEmployeeId", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }
		/**
   * @description Get list
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object ClientDevice} data
   * @param {function callback} callback 
   */
		// getList(data, callback) {
		// 	try {
		// 		if (!Libs.isBlank(data)) {
		// 			data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
		// 			data.max_record = Constants.data.max_record;
		// 		}
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.queryForList("ClientDevice.getList", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }

		// /**
		//  * @description Lấy tổng số dòng
		//  * @author Long.Pham
		//  * @since 30/07/2018
		//  * @param {Object User} data
		//  * @param {function callback} callback
		//  */
		// getSize(data, callback) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.queryForObject("ClientDevice.getSize", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }

		// /**
		//  * @description Insert data
		//  * @author Long.Pham
		//  * @since 30/07/2019
		//  * @param {Object ClientDevice} data
		//  */
		// insertClientDevice(data, callBack) {
		// 	try {
		// 		let self = this;
		// 		var db = new mySqLDB();
		// 		db.beginTransaction(async function (conn) {
		// 			try {

		// 				var rs = await db.insert("ClientDevice.insertClientDevice", data);
		// 				var curId = rs.insertId;

		// 				if (!rs) {
		// 					conn.rollback();
		// 					callBack(false, {});
		// 					return;
		// 				}

		// 				// insert table ClientDevice detail
		// 				let dataDetail = data.data;
		// 				if (dataDetail.length > 0) {
		// 					for (let i = 0; i < dataDetail.length; i++) {
		// 						dataDetail[i].id_ClientDevice = curId;
		// 					}
		// 					rs = await db.insert("ClientDevice.insertClientDeviceDetail", { dataDetail });
		// 				}

		// 				let dataEmployees = data.dataEmployees;
		// 				if (dataEmployees.length > 0) {
		// 					for (let i = 0; i < dataEmployees.length; i++) {
		// 						dataEmployees[i].id_ClientDevice = curId;
		// 					}
		// 					rs = await db.insert("ClientDevice.insertClientDeviceEmployeeMap", { dataEmployees });
		// 				}

		// 				if (!rs) {
		// 					conn.rollback();
		// 					callBack(false, {});
		// 					return;
		// 				}
		// 				conn.commit();
		// 				callBack(true, {});
		// 			} catch (err) {
		// 				console.log("Lỗi rolback", err);
		// 				conn.rollback();
		// 				callBack(false, err);
		// 			}
		// 		})
		// 	} catch (e) {
		// 		console.log('error', e);
		// 		callBack(false, e);
		// 	}
		// }


		// /**
		//  * @description Update data
		//  * @author Long.Pham
		//  * @since 11/07/2019
		//  * @param {Object ClientDevice} data
		//  * @param {function callback} callback
		//  */
		// updateClientDevice(data, callBack) {
		// 	let self = this;
		// 	var db = new mySqLDB();
		// 	db.beginTransaction(async function (conn) {
		// 		try {

		// 			var rs = await db.delete("ClientDevice.deleteClientDeviceDetail", data);
		// 			rs = await db.delete("ClientDevice.deleteEmployeeClientDeviceMap", data);
		// 			rs = await db.update("ClientDevice.updateClientDevice", data);
		// 			if (!rs) {
		// 				conn.rollback();
		// 				callBack(false, {});
		// 				return;
		// 			}

		// 			// insert table ClientDevice detail
		// 			let dataDetail = data.data;
		// 			if (dataDetail.length > 0) {
		// 				await db.insert("ClientDevice.insertClientDeviceDetail", { dataDetail });
		// 			}

		// 			let dataEmployees = data.dataEmployees;
		// 				if (dataEmployees.length > 0) {
		// 					for (let i = 0; i < dataEmployees.length; i++) {
		// 						dataEmployees[i].id_ClientDevice = data.id;
		// 					}
		// 					rs = await db.insert("ClientDevice.insertClientDeviceEmployeeMap", { dataEmployees });
		// 				}


		// 			conn.commit();
		// 			callBack(true, {});
		// 		} catch (err) {
		// 			console.log("Lỗi rolback", err);
		// 			conn.rollback();
		// 			callBack(false, err);
		// 		}
		// 	})
		// }


		// /**
		//  * @description Update status
		//  * @author Long.Pham
		//  * @since 11/07/2019
		//  * @param {Object ClientDevice} data
		//  * @param {function callback} callback
		//  */
		// updateStatus(data, callBack) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.update("ClientDevice.updateStatus", data, (err, rs) => {
		// 			return callBack(err, rs)
		// 		});
		// 	} catch (e) {
		// 		this.logger.error(e);
		// 		callBack(false, e);
		// 	}
		// }

		// /**
		//  * @description Update is_delete = 1
		//  * @author Long.Pham
		//  * @since 11/07/2019
		//  * @param {Object ClientDevice} data
		//  * @param {function callback} callback
		//  */
		// delete(data, callBack) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.delete("ClientDevice.delete", data, (err, rs) => {
		// 			return callBack(err, rs)
		// 		});
		// 	} catch (e) {
		// 		this.logger.error(e);
		// 		callBack(false, e);
		// 	}
		// }


		// /**
		// * get detail ClientDevice
		// * @param {*} data 
		// * @param {*} callBack 
		// */
		// getDetail(param, callBack) {
		// 	try {
		// 		var db = new mySqLDB();
		// 		db.beginTransaction(async function (conn) {
		// 			try {
		// 				var rs = await db.queryForList("ClientDevice.getDetail", param);
		// 				var data = rs[0][0];
		// 				data.data = rs[1];
		// 				data.dataEmployees = rs[2];
		// 				conn.commit();
		// 				callBack(false, data);
		// 			} catch (err) {
		// 				console.log("Lỗi rolback", err);
		// 				conn.rollback();
		// 				callBack(true, err);
		// 			}
		// 		});
		// 	} catch (err) {
		// 		// console.log('error get material order for voucher out', err);
		// 		if (conn) {
		// 			conn.rollback();
		// 		}
		// 		callBack(true, err);
		// 	}
		// }


	}]);

	return ClientDeviceService;
}(_BaseService3.default);

exports.default = ClientDeviceService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9DbGllbnREZXZpY2VTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkNsaWVudERldmljZVNlcnZpY2UiLCJkYXRhIiwiY2FsbEJhY2siLCJkYiIsIm15U3FMREIiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsImN1cnJlbnRfZGF0ZSIsIkxpYnMiLCJjb252ZXJ0QWxsRm9ybWF0RGF0ZSIsImRhdGFEZXZpY2UiLCJxdWVyeUZvckxpc3QiLCJpc0FycmF5RGF0YSIsImkiLCJsZW5ndGgiLCJpdGVtIiwiYWxlcnRzIiwiaWRfZGV2aWNlIiwiaWQiLCJpZF9sYW5ndWFnZSIsInRhYmxlX25hbWUiLCJvYmpEYXRhIiwicXVlcnlGb3JPYmplY3QiLCJwb3dlcl9ub3ciLCJ0b2RheV9lbmVyZ3kiLCJ0b2RheV9hY3RpdmVFbmVyZ3kiLCJsaWZldGltZSIsInRoaXNfbW9udGgiLCJjb21taXQiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwicm9sbGJhY2siLCJjYWxsYmFjayIsImNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wIiwiZSIsImdldExhc3RSb3dEYXRhRGV2aWNlIiwibW9tZW50IiwicmVxdWlyZSIsImRhdGUiLCJmb3JtYXQiLCJ2YWx1ZSIsInNsdWciLCJsYXN0X2NvbW11bmljYXRpb24iLCJsYXN0X2F0dGVtcHQiLCJpc0JsYW5rIiwiY3VycmVudF9yb3ciLCJtYXhfcmVjb3JkIiwiQ29uc3RhbnRzIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxtQjs7O0FBQ0wsZ0NBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzBCQVFRQyxJLEVBQU1DLFEsRUFBVTtBQUN2QixPQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxNQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFFBQUk7O0FBRUhMLFVBQUtNLFlBQUwsR0FBb0JD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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7RUE5a0JpQ2MscUI7O2tCQW1sQm5CakQsbUIiLCJmaWxlIjoiQ2xpZW50RGV2aWNlU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuY2xhc3MgQ2xpZW50RGV2aWNlU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0XHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTIvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblxyXG5cdGdldExpc3QoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0ZGF0YS5jdXJyZW50X2RhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKGRhdGEuY3VycmVudF9kYXRlKTtcclxuXHRcdFx0XHR2YXIgZGF0YURldmljZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudERldmljZS5nZXRMaXN0XCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGRhdGFEZXZpY2UpKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFEZXZpY2UubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIGl0ZW0gPSBkYXRhRGV2aWNlW2ldO1xyXG5cdFx0XHRcdFx0XHQvLyBHZXQgbGlzdCBhbGVydFxyXG5cdFx0XHRcdFx0XHRsZXQgYWxlcnRzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldEFsZXJ0QnlEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdGlkX2RldmljZTogaXRlbS5pZCxcclxuXHRcdFx0XHRcdFx0XHRpZF9sYW5ndWFnZTogZGF0YS5pZF9sYW5ndWFnZVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5hbGVydHMgPSBhbGVydHM7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBHZXQgbGFzdCB1cGRhdGVkXHJcblx0XHRcdFx0XHRcdC8vIGxldCBvYmpMYXN0VXBkYXRlPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIkNsaWVudERldmljZS5nZXRMYXN0VXBkYXRlZFwiLCB7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWRfZGV2aWNlOiBpdGVtLmlkLFxyXG5cdFx0XHRcdFx0XHQvLyBcdGlkX2xhbmd1YWdlOiBkYXRhLmlkX2xhbmd1YWdlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdHRhYmxlX25hbWU6IGl0ZW0udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHQvLyB9KTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8vIGlmIChvYmpMYXN0VXBkYXRlKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0ZGF0YURldmljZVtpXS5sYXN0X3VwZGF0ZWQgPSBvYmpMYXN0VXBkYXRlLmxhc3RfdXBkYXRlZDtcclxuXHRcdFx0XHRcdFx0Ly8gfSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRkYXRhRGV2aWNlW2ldLmxhc3RfdXBkYXRlZCA9IG51bGw7XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHQvLyBnZXQgaW5mbyBwb3dlciBub3csIGVuZXJneSwgbGlmZXRpbWVcclxuXHRcdFx0XHRcdFx0c3dpdGNoIChpdGVtLnRhYmxlX25hbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQMTEwJzpcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQNTAnOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TSFA3NSc6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfQUJCX1BWUzEwMCc6XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqRGF0YSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQ2xpZW50RGV2aWNlLmdldERhdGFEZXZpY2VFbmVyZ3lcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGl0ZW0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2xhbmd1YWdlOiBkYXRhLmlkX2xhbmd1YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBpdGVtLnRhYmxlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRfZGF0ZTogZGF0YS5jdXJyZW50X2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9iakRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5wb3dlcl9ub3cgPSBvYmpEYXRhLnBvd2VyX25vdyAvIDEwMDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0udG9kYXlfZW5lcmd5ID0gb2JqRGF0YS50b2RheV9hY3RpdmVFbmVyZ3kgLyAxMDAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmxpZmV0aW1lID0gb2JqRGF0YS5saWZldGltZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS50aGlzX21vbnRoID0gb2JqRGF0YS50aGlzX21vbnRoIC8gMTAwMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gZGF0YURldmljZVtpXS5sYXN0X3VwZGF0ZWQgPSBvYmpEYXRhLmxhc3RfdXBkYXRlZDtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0ucG93ZXJfbm93ID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS50b2RheV9lbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmxpZmV0aW1lID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gZGF0YURldmljZVtpXS5sYXN0X3VwZGF0ZWQgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0ucG93ZXJfbm93ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0udG9kYXlfZW5lcmd5ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0ubGlmZXRpbWUgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YURldmljZSk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gTOG6pXkgdOG7lW5nIHPhu5EgZMOybmdcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMi8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgRGV2aWNlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRnZXRTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnREZXZpY2UuZ2V0U2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMi8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHJcblx0Z2V0TGlzdFBhcmFtZXRlckJ5RGV2aWNlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBkYXRhRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldExpc3RQYXJhbWV0ZXJCeURldmljZVwiLCBkYXRhKTtcclxuXHJcblx0XHRcdFx0bGV0IGdldExhc3RSb3dEYXRhRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnREZXZpY2UuZ2V0TGFzdFJvd0RhdGFEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0aWRfZGV2aWNlOiBkYXRhLmlkLFxyXG5cdFx0XHRcdFx0aWRfbGFuZ3VhZ2U6IGRhdGEuaWRfbGFuZ3VhZ2UsXHJcblx0XHRcdFx0XHR0YWJsZV9uYW1lOiBkYXRhLnRhYmxlX25hbWVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRjb25zdCBtb21lbnQgPSByZXF1aXJlKFwibW9tZW50XCIpO1xyXG5cdFx0XHRcdGxldCBkYXRlID0gbW9tZW50KCkuZm9ybWF0KCdERC9NTS9ZWVlZIEhIOm1tOnNzJyk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoTGlicy5pc0FycmF5RGF0YShkYXRhRGV2aWNlKSAmJiBnZXRMYXN0Um93RGF0YURldmljZSl7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFEZXZpY2UubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS52YWx1ZSA9IGdldExhc3RSb3dEYXRhRGV2aWNlW2RhdGFEZXZpY2VbaV0uc2x1Z107XHJcblx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0ubGFzdF9jb21tdW5pY2F0aW9uID0gZ2V0TGFzdFJvd0RhdGFEZXZpY2VbJ2xhc3RfY29tbXVuaWNhdGlvbiddO1xyXG5cdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmxhc3RfYXR0ZW1wdCA9IGRhdGU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFEZXZpY2UpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0IGFsZXJ0IGJ5IGRlaXZjZVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDE4LzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdCBnZXRMaXN0QWxlcnRCeURldmljZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YSkpIHtcclxuXHRcdFx0XHRkYXRhLmN1cnJlbnRfcm93ID0gKHR5cGVvZiBkYXRhLmN1cnJlbnRfcm93ID09ICd1bmRlZmluZWQnKSA/IDAgOiBkYXRhLmN1cnJlbnRfcm93O1xyXG5cdFx0XHRcdGRhdGEubWF4X3JlY29yZCA9IENvbnN0YW50cy5kYXRhLm1heF9yZWNvcmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudERldmljZS5nZXRMaXN0QWxlcnRCeURldmljZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0ICogQGF1dGhvciBsb25nLnBoYW1cclxuXHQgKiBAc2luY2UgMTgvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IGFsZXJ0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHQgZ2V0TGlzdEFsZXJ0QnlEZXZpY2VTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnREZXZpY2UuZ2V0TGlzdEFsZXJ0QnlEZXZpY2VTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGFsbFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBHcm91cEF0dHJpYnV0ZXN9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHQvLyBnZXRBbGxQcm9qZWN0QnlFbXBsb3llZUlkKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdC8vIFx0XHR0cnkge1xyXG5cdC8vIFx0XHRcdHZhciBkYXRhUHJvamVjdHMgPSBbXTtcclxuXHQvLyBcdFx0XHR2YXIgc2NvcGUgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnREZXZpY2UuZ2V0QWxsU2NvcGVcIiwgZGF0YSk7XHJcblx0Ly8gXHRcdFx0aWYgKExpYnMuaXNBcnJheURhdGEoc2NvcGUpKSB7XHJcblx0Ly8gXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNjb3BlLmxlbmd0aDsgaSsrKSB7XHJcblx0Ly8gXHRcdFx0XHRcdHZhciBpdGVtID0gc2NvcGVbaV07XHJcblx0Ly8gXHRcdFx0XHRcdGl0ZW0uaWRfZW1wbG95ZWUgPSBkYXRhLmlkX2VtcGxveWVlO1xyXG5cdC8vIFx0XHRcdFx0XHR2YXIgbGlzdFByb2plY3RzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldEFsbFByb2plY3RCeUVtcGxveWVlSWRcIiwgaXRlbSk7XHJcblx0Ly8gXHRcdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGxpc3RQcm9qZWN0cykgJiYgbGlzdFByb2plY3RzLmxlbmd0aCA+IDApIHtcclxuXHQvLyBcdFx0XHRcdFx0XHRpdGVtLmRhdGFDaGlsZHMgPSBsaXN0UHJvamVjdHM7XHJcblx0Ly8gXHRcdFx0XHRcdFx0ZGF0YVByb2plY3RzLnB1c2goaXRlbSk7XHJcblx0Ly8gXHRcdFx0XHRcdH1cclxuXHQvLyBcdFx0XHRcdH1cclxuXHQvLyBcdFx0XHR9XHJcblxyXG5cdC8vIFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0Ly8gXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFQcm9qZWN0cyk7XHJcblx0Ly8gXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdC8vIFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdC8vIFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9KTtcclxuXHQvLyB9XHJcblxyXG5cclxuXHQvLyAvKipcclxuXHQvLyAgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3QgcHJvamVjdCBieSBlbXBsb3llZSBpZFxyXG5cdC8vICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0Ly8gICogQHNpbmNlIDMwLzA5LzIwMjFcclxuXHQvLyAgKiBAcGFyYW0ge09iamVjdCBDbGllbnREZXZpY2V9IGRhdGFcclxuXHQvLyAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQvLyAgKi9cclxuXHQvLyBnZXRMaXN0UHJvamVjdEJ5RW1wbG95ZWUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHQvLyBcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0Ly8gXHRcdHRyeSB7XHJcblx0Ly8gXHRcdFx0Ly8gdmFyIGRhdGFQcm9qZWN0cyA9IFtdO1xyXG5cdC8vIFx0XHRcdHZhciBkYXRhTGlzdCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudERldmljZS5nZXRMaXN0UHJvamVjdEJ5RW1wbG95ZWVcIiwgZGF0YSk7XHJcblx0Ly8gXHRcdFx0aWYgKExpYnMuaXNBcnJheURhdGEoZGF0YUxpc3QpKSB7XHJcblx0Ly8gXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG5cdC8vIFx0XHRcdFx0XHQvLyBnZXQgZ3JvdXAgZGV2aWNlXHJcblx0Ly8gXHRcdFx0XHRcdHZhciBpdGVtID0gZGF0YUxpc3RbaV07XHJcblx0Ly8gXHRcdFx0XHRcdHZhciBkZXZpY2VHcm91cCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudERldmljZS5nZXRHcm91cERldmljZUJ5UHJvamVjdElkXCIsIGl0ZW0pO1xyXG5cdC8vIFx0XHRcdFx0XHR2YXIgaXJyYWRpYW5jZSA9IFtdO1xyXG5cdC8vIFx0XHRcdFx0XHR2YXIgZW5lcmd5X3RvZGF5ID0gMCwgbGlmZXRpbWUgPSAwLCByZXZlbnVlID0gMDtcclxuXHQvLyBcdFx0XHRcdFx0aWYoTGlicy5pc0FycmF5RGF0YShkZXZpY2VHcm91cCkpe1xyXG5cdC8vIFx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZGV2aWNlR3JvdXAubGVuZ3RoOyBqKyspIHtcclxuXHQvLyBcdFx0XHRcdFx0XHRcdHN3aXRjaChkZXZpY2VHcm91cFtqXS50YWJsZV9uYW1lKXtcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDUwJzpcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NIUDc1JzogXHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0FCQl9QVlMxMDAnOlxyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpEZXZpY2UgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIkNsaWVudERldmljZS5nZXREYXRhRGV2aWNlRW5lcmd5XCIsIHtcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX3Byb2plY3Q6IGRhdGFMaXN0W2ldLmlkLCBcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZGV2aWNlR3JvdXBbal0uaWQsXHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBkZXZpY2VHcm91cFtqXS50YWJsZV9uYW1lXHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0aWYob2JqRGV2aWNlKXtcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVuZXJneV90b2RheSA9IGVuZXJneV90b2RheSArIG9iakRldmljZS50b2RheV9hY3RpdmVFbmVyZ3k7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0XHRsaWZldGltZSA9IGxpZmV0aW1lICsgb2JqRGV2aWNlLmxpZmV0aW1lO1xyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1N1bmdyb3dfU0cxMTBDWCc6IFxyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfR3Jvd2F0dF9HVzgwS1RMMyc6IFxyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9TaVJTNDg1JzogXHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9iakRldmljZUlycmFkaWFuY2UgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnREZXZpY2UuZ2V0RGF0YURldmljZUlycmFkaWFuY2VcIiwge1xyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfcHJvamVjdDogZGF0YUxpc3RbaV0uaWQsIFxyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBkZXZpY2VHcm91cFtqXS5pZCxcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGRldmljZUdyb3VwW2pdLnRhYmxlX25hbWVcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHRpZihMaWJzLmlzQXJyYXlEYXRhKG9iakRldmljZUlycmFkaWFuY2UpKXtcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHRcdGlycmFkaWFuY2UgPSBvYmpEZXZpY2VJcnJhZGlhbmNlO1xyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfVGFSUzQ4NSc6IFxyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHQvLyBcdFx0XHRcdFx0XHRcdH1cclxuXHQvLyBcdFx0XHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0XHRcdH1cclxuXHJcblx0Ly8gXHRcdFx0XHRcdC8vIGdldCBhbGVydCBieSBzaXRlXHJcblxyXG5cdC8vIFx0XHRcdFx0XHRsZXQgYXJyQWxlcnQgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnREZXZpY2UuZ2V0QWxlcnRCeVNpdGVcIiwge1xyXG5cdC8vIFx0XHRcdFx0XHRcdGlkX3Byb2plY3Q6IGRhdGFMaXN0W2ldLmlkLCBcclxuXHQvLyBcdFx0XHRcdFx0XHRpZF9sYW5ndWFnZTogZGF0YS5pZF9sYW5ndWFnZVxyXG5cdC8vIFx0XHRcdFx0XHR9KTtcclxuXHJcblx0Ly8gXHRcdFx0XHRcdGlmKExpYnMuaXNBcnJheURhdGEoYXJyQWxlcnQpKXtcclxuXHQvLyBcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5hbGVydHMgPSBhcnJBbGVydDtcclxuXHQvLyBcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHQvLyBcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5hbGVydHMgPSBbXTtcclxuXHQvLyBcdFx0XHRcdFx0fVxyXG5cclxuXHQvLyBcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uZW5lcmd5X3RvZGF5ID0gZW5lcmd5X3RvZGF5O1xyXG5cdC8vIFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5saWZldGltZSA9IGxpZmV0aW1lO1xyXG5cdC8vIFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5yZXZlbnVlID0gbGlmZXRpbWUgKiBkYXRhTGlzdFtpXS5jb25maWdfcmV2ZW51ZTtcclxuXHQvLyBcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uaXJyYWRpYW5jZSA9IGlycmFkaWFuY2U7XHJcblxyXG5cclxuXHQvLyBcdFx0XHRcdFx0Ly8gXHJcblx0Ly8gXHRcdFx0XHRcdC8vIGl0ZW0uaWRfZW1wbG95ZWUgPSBkYXRhLmlkX2VtcGxveWVlO1xyXG5cdC8vIFx0XHRcdFx0XHQvLyB2YXIgbGlzdFByb2plY3RzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldEFsbFByb2plY3RCeUVtcGxveWVlSWRcIiwgaXRlbSk7XHJcblx0Ly8gXHRcdFx0XHRcdC8vIGlmIChMaWJzLmlzQXJyYXlEYXRhKGxpc3RQcm9qZWN0cykgJiYgbGlzdFByb2plY3RzLmxlbmd0aCA+IDApIHtcclxuXHQvLyBcdFx0XHRcdFx0Ly8gXHRpdGVtLmRhdGFDaGlsZHMgPSBsaXN0UHJvamVjdHM7XHJcblx0Ly8gXHRcdFx0XHRcdC8vIFx0ZGF0YVByb2plY3RzLnB1c2goaXRlbSk7XHJcblx0Ly8gXHRcdFx0XHRcdC8vIH1cclxuXHQvLyBcdFx0XHRcdH1cclxuXHQvLyBcdFx0XHR9XHJcblxyXG5cdC8vIFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0Ly8gXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFMaXN0KTtcclxuXHQvLyBcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0Ly8gXHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0Ly8gXHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdC8vIFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH0pO1xyXG5cclxuXHQvLyBcdC8vIHRyeSB7XHJcblx0Ly8gXHQvLyBcdGlmICghTGlicy5pc0JsYW5rKGRhdGEpKSB7XHJcblx0Ly8gXHQvLyBcdFx0ZGF0YS5jdXJyZW50X3JvdyA9ICh0eXBlb2YgZGF0YS5jdXJyZW50X3JvdyA9PSAndW5kZWZpbmVkJykgPyAwIDogZGF0YS5jdXJyZW50X3JvdztcclxuXHQvLyBcdC8vIFx0XHRkYXRhLm1heF9yZWNvcmQgPSBDb25zdGFudHMuZGF0YS5tYXhfcmVjb3JkO1xyXG5cdC8vIFx0Ly8gXHR9XHJcblx0Ly8gXHQvLyBcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdC8vIFx0Ly8gXHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0Ly8gXHRkYi5xdWVyeUZvckxpc3QoXCJDbGllbnREZXZpY2UuZ2V0TGlzdFByb2plY3RCeUVtcGxveWVlXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHQvLyBcdC8vIH0gY2F0Y2ggKGUpIHtcclxuXHQvLyBcdC8vIFx0Y29uc29sZS5sb2coZSk7XHJcblx0Ly8gXHQvLyBcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHQvLyB9XHJcblx0Ly8gfVxyXG5cclxuXHJcblx0Ly8gLyoqXHJcblx0Ly8gICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0Ly8gICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQvLyAgKiBAc2luY2UgMzAvMDcvMjAxOFxyXG5cdC8vICAqIEBwYXJhbSB7T2JqZWN0IFVzZXJ9IGRhdGFcclxuXHQvLyAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdC8vICAqL1xyXG5cdC8vIGdldExpc3RQcm9qZWN0QnlFbXBsb3llZVNpemUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHQvLyBcdHRyeSB7XHJcblx0Ly8gXHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdC8vIFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0XHRkYi5xdWVyeUZvck9iamVjdChcIkNsaWVudERldmljZS5nZXRMaXN0UHJvamVjdEJ5RW1wbG95ZWVTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHQvLyBcdH0gY2F0Y2ggKGUpIHtcclxuXHQvLyBcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0Ly8gXHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGFsbCBwcm9qZWN0IGJ5IGVtcGxveWVlIGlkXHJcblx0ICogQGF1dGhvciBNaW5oLlR1YW5cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IENsaWVudERldmljZX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdC8vICBnZXRBbGxQcm9qZWN0QnlFbXBsb3llZUlkKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHQvLyBcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdFx0ZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldEFsbFByb2plY3RCeUVtcGxveWVlSWRcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdC8vIFx0fSBjYXRjaCAoZSkge1xyXG5cdC8vIFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHQvLyBcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0XHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IENsaWVudERldmljZX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdC8vIGdldExpc3QoZGF0YSwgY2FsbGJhY2spIHtcclxuXHQvLyBcdHRyeSB7XHJcblx0Ly8gXHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEpKSB7XHJcblx0Ly8gXHRcdFx0ZGF0YS5jdXJyZW50X3JvdyA9ICh0eXBlb2YgZGF0YS5jdXJyZW50X3JvdyA9PSAndW5kZWZpbmVkJykgPyAwIDogZGF0YS5jdXJyZW50X3JvdztcclxuXHQvLyBcdFx0XHRkYXRhLm1heF9yZWNvcmQgPSBDb25zdGFudHMuZGF0YS5tYXhfcmVjb3JkO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdC8vIFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0XHRkYi5xdWVyeUZvckxpc3QoXCJDbGllbnREZXZpY2UuZ2V0TGlzdFwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdC8vIFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblx0Ly8gLyoqXHJcblx0Ly8gICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0Ly8gICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQvLyAgKiBAc2luY2UgMzAvMDcvMjAxOFxyXG5cdC8vICAqIEBwYXJhbSB7T2JqZWN0IFVzZXJ9IGRhdGFcclxuXHQvLyAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdC8vICAqL1xyXG5cdC8vIGdldFNpemUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHQvLyBcdHRyeSB7XHJcblx0Ly8gXHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdC8vIFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0XHRkYi5xdWVyeUZvck9iamVjdChcIkNsaWVudERldmljZS5nZXRTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHQvLyBcdH0gY2F0Y2ggKGUpIHtcclxuXHQvLyBcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0Ly8gXHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHQvLyAvKipcclxuXHQvLyAgKiBAZGVzY3JpcHRpb24gSW5zZXJ0IGRhdGFcclxuXHQvLyAgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdC8vICAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0Ly8gICogQHBhcmFtIHtPYmplY3QgQ2xpZW50RGV2aWNlfSBkYXRhXHJcblx0Ly8gICovXHJcblx0Ly8gaW5zZXJ0Q2xpZW50RGV2aWNlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0Ly8gXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHQvLyBcdFx0XHR0cnkge1xyXG5cclxuXHQvLyBcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmluc2VydChcIkNsaWVudERldmljZS5pbnNlcnRDbGllbnREZXZpY2VcIiwgZGF0YSk7XHJcblx0Ly8gXHRcdFx0XHR2YXIgY3VySWQgPSBycy5pbnNlcnRJZDtcclxuXHJcblx0Ly8gXHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0Ly8gXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHQvLyBcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdC8vIFx0XHRcdFx0fVxyXG5cclxuXHQvLyBcdFx0XHRcdC8vIGluc2VydCB0YWJsZSBDbGllbnREZXZpY2UgZGV0YWlsXHJcblx0Ly8gXHRcdFx0XHRsZXQgZGF0YURldGFpbCA9IGRhdGEuZGF0YTtcclxuXHQvLyBcdFx0XHRcdGlmIChkYXRhRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuXHQvLyBcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhRGV0YWlsLmxlbmd0aDsgaSsrKSB7XHJcblx0Ly8gXHRcdFx0XHRcdFx0ZGF0YURldGFpbFtpXS5pZF9DbGllbnREZXZpY2UgPSBjdXJJZDtcclxuXHQvLyBcdFx0XHRcdFx0fVxyXG5cdC8vIFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIkNsaWVudERldmljZS5pbnNlcnRDbGllbnREZXZpY2VEZXRhaWxcIiwgeyBkYXRhRGV0YWlsIH0pO1xyXG5cdC8vIFx0XHRcdFx0fVxyXG5cclxuXHQvLyBcdFx0XHRcdGxldCBkYXRhRW1wbG95ZWVzID0gZGF0YS5kYXRhRW1wbG95ZWVzO1xyXG5cdC8vIFx0XHRcdFx0aWYgKGRhdGFFbXBsb3llZXMubGVuZ3RoID4gMCkge1xyXG5cdC8vIFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFFbXBsb3llZXMubGVuZ3RoOyBpKyspIHtcclxuXHQvLyBcdFx0XHRcdFx0XHRkYXRhRW1wbG95ZWVzW2ldLmlkX0NsaWVudERldmljZSA9IGN1cklkO1xyXG5cdC8vIFx0XHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiQ2xpZW50RGV2aWNlLmluc2VydENsaWVudERldmljZUVtcGxveWVlTWFwXCIsIHsgZGF0YUVtcGxveWVlcyB9KTtcclxuXHQvLyBcdFx0XHRcdH1cclxuXHJcblx0Ly8gXHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0Ly8gXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHQvLyBcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdC8vIFx0XHRcdFx0fVxyXG5cdC8vIFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHQvLyBcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHQvLyBcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHQvLyBcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdC8vIFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdC8vIFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0Ly8gXHRcdFx0fVxyXG5cdC8vIFx0XHR9KVxyXG5cdC8vIFx0fSBjYXRjaCAoZSkge1xyXG5cdC8vIFx0XHRjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcclxuXHQvLyBcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblxyXG5cdC8vIC8qKlxyXG5cdC8vICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgZGF0YVxyXG5cdC8vICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0Ly8gICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQvLyAgKiBAcGFyYW0ge09iamVjdCBDbGllbnREZXZpY2V9IGRhdGFcclxuXHQvLyAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdC8vICAqL1xyXG5cdC8vIHVwZGF0ZUNsaWVudERldmljZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdC8vIFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdC8vIFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHQvLyBcdFx0dHJ5IHtcclxuXHJcblx0Ly8gXHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuZGVsZXRlKFwiQ2xpZW50RGV2aWNlLmRlbGV0ZUNsaWVudERldmljZURldGFpbFwiLCBkYXRhKTtcclxuXHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLmRlbGV0ZShcIkNsaWVudERldmljZS5kZWxldGVFbXBsb3llZUNsaWVudERldmljZU1hcFwiLCBkYXRhKTtcclxuXHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkNsaWVudERldmljZS51cGRhdGVDbGllbnREZXZpY2VcIiwgZGF0YSk7XHJcblx0Ly8gXHRcdFx0aWYgKCFycykge1xyXG5cdC8vIFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdC8vIFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHQvLyBcdFx0XHRcdHJldHVybjtcclxuXHQvLyBcdFx0XHR9XHJcblxyXG5cdC8vIFx0XHRcdC8vIGluc2VydCB0YWJsZSBDbGllbnREZXZpY2UgZGV0YWlsXHJcblx0Ly8gXHRcdFx0bGV0IGRhdGFEZXRhaWwgPSBkYXRhLmRhdGE7XHJcblx0Ly8gXHRcdFx0aWYgKGRhdGFEZXRhaWwubGVuZ3RoID4gMCkge1xyXG5cdC8vIFx0XHRcdFx0YXdhaXQgZGIuaW5zZXJ0KFwiQ2xpZW50RGV2aWNlLmluc2VydENsaWVudERldmljZURldGFpbFwiLCB7IGRhdGFEZXRhaWwgfSk7XHJcblx0Ly8gXHRcdFx0fVxyXG5cclxuXHQvLyBcdFx0XHRsZXQgZGF0YUVtcGxveWVlcyA9IGRhdGEuZGF0YUVtcGxveWVlcztcclxuXHQvLyBcdFx0XHRcdGlmIChkYXRhRW1wbG95ZWVzLmxlbmd0aCA+IDApIHtcclxuXHQvLyBcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhRW1wbG95ZWVzLmxlbmd0aDsgaSsrKSB7XHJcblx0Ly8gXHRcdFx0XHRcdFx0ZGF0YUVtcGxveWVlc1tpXS5pZF9DbGllbnREZXZpY2UgPSBkYXRhLmlkO1xyXG5cdC8vIFx0XHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiQ2xpZW50RGV2aWNlLmluc2VydENsaWVudERldmljZUVtcGxveWVlTWFwXCIsIHsgZGF0YUVtcGxveWVlcyB9KTtcclxuXHQvLyBcdFx0XHRcdH1cclxuXHJcblxyXG5cdC8vIFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0Ly8gXHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdC8vIFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHQvLyBcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHQvLyBcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH0pXHJcblx0Ly8gfVxyXG5cclxuXHJcblxyXG5cdC8vIC8qKlxyXG5cdC8vICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgc3RhdHVzXHJcblx0Ly8gICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQvLyAgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG5cdC8vICAqIEBwYXJhbSB7T2JqZWN0IENsaWVudERldmljZX0gZGF0YVxyXG5cdC8vICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0Ly8gICovXHJcblx0Ly8gdXBkYXRlU3RhdHVzKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHQvLyBcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdFx0ZGIudXBkYXRlKFwiQ2xpZW50RGV2aWNlLnVwZGF0ZVN0YXR1c1wiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdC8vIFx0XHRcdHJldHVybiBjYWxsQmFjayhlcnIsIHJzKVxyXG5cdC8vIFx0XHR9KTtcclxuXHQvLyBcdH0gY2F0Y2ggKGUpIHtcclxuXHQvLyBcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0Ly8gXHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcblxyXG5cdC8vIC8qKlxyXG5cdC8vICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgaXNfZGVsZXRlID0gMVxyXG5cdC8vICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0Ly8gICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQvLyAgKiBAcGFyYW0ge09iamVjdCBDbGllbnREZXZpY2V9IGRhdGFcclxuXHQvLyAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdC8vICAqL1xyXG5cdC8vIGRlbGV0ZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdC8vIFx0dHJ5IHtcclxuXHQvLyBcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0Ly8gXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRcdGRiLmRlbGV0ZShcIkNsaWVudERldmljZS5kZWxldGVcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHQvLyBcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHQvLyBcdFx0fSk7XHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdC8vIFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHJcblx0Ly8gLyoqXHJcblx0Ly8gKiBnZXQgZGV0YWlsIENsaWVudERldmljZVxyXG5cdC8vICogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdC8vICogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQvLyAqL1xyXG5cdC8vIGdldERldGFpbChwYXJhbSwgY2FsbEJhY2spIHtcclxuXHQvLyBcdHRyeSB7XHJcblx0Ly8gXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHQvLyBcdFx0XHR0cnkge1xyXG5cdC8vIFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldERldGFpbFwiLCBwYXJhbSk7XHJcblx0Ly8gXHRcdFx0XHR2YXIgZGF0YSA9IHJzWzBdWzBdO1xyXG5cdC8vIFx0XHRcdFx0ZGF0YS5kYXRhID0gcnNbMV07XHJcblx0Ly8gXHRcdFx0XHRkYXRhLmRhdGFFbXBsb3llZXMgPSByc1syXTtcclxuXHQvLyBcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0Ly8gXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0Ly8gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0Ly8gXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHQvLyBcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0Ly8gXHRcdFx0fVxyXG5cdC8vIFx0XHR9KTtcclxuXHQvLyBcdH0gY2F0Y2ggKGVycikge1xyXG5cdC8vIFx0XHQvLyBjb25zb2xlLmxvZygnZXJyb3IgZ2V0IG1hdGVyaWFsIG9yZGVyIGZvciB2b3VjaGVyIG91dCcsIGVycik7XHJcblx0Ly8gXHRcdGlmIChjb25uKSB7XHJcblx0Ly8gXHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHJcblxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENsaWVudERldmljZVNlcnZpY2U7XHJcbiJdfQ==