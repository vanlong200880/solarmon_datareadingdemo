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

var ClientProjectService = function (_BaseService) {
	_inherits(ClientProjectService, _BaseService);

	function ClientProjectService() {
		_classCallCheck(this, ClientProjectService);

		return _possibleConstructorReturn(this, (ClientProjectService.__proto__ || Object.getPrototypeOf(ClientProjectService)).call(this));
	}

	/**
  * @description Get all
  * @author Long.Pham
  * @since 30/07/2019
  * @param {Object GroupAttributes} data
  * @param {function callback} callback 
  */


	_createClass(ClientProjectService, [{
		key: "getAllProjectByEmployeeId",
		value: function getAllProjectByEmployeeId(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var dataProjects = [];
					var scope = await db.queryForList("ClientProject.getAllScope", data);
					if (Libs.isArrayData(scope)) {
						for (var i = 0; i < scope.length; i++) {
							var item = scope[i];
							item.id_employee = data.id_employee;
							var listProjects = await db.queryForList("ClientProject.getAllProjectByEmployeeId", item);
							if (Libs.isArrayData(listProjects) && listProjects.length > 0) {
								item.dataChilds = listProjects;
								dataProjects.push(item);
							}
						}
					}

					conn.commit();
					callBack(false, dataProjects);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
				}
			});
		}

		/**
   * @description Get list project by employee id
   * @author Long.Pham
   * @since 30/09/2021
   * @param {Object ClientProject} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListProjectByEmployee",
		value: function getListProjectByEmployee(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					// var dataProjects = [];
					var dataList = await db.queryForList("ClientProject.getListProjectByEmployee", data);
					if (Libs.isArrayData(dataList)) {
						for (var i = 0; i < dataList.length; i++) {
							// get group device
							var item = dataList[i];
							var deviceGroupInverter = await db.queryForList("ClientProject.getGroupDeviceByProjectId", item);
							// var energy_today = 0, lifetime = 0, activePower = 0, last_month_activeEnergy = 0;
							if (deviceGroupInverter && deviceGroupInverter.length > 0) {}
							// Get data energy 
							// let objDevice = await db.queryForObject("ClientProject.getDataDeviceEnergy", { deviceGroupInverter });
							// if (objDevice) {
							// 	energy_today = objDevice.today_activeEnergy;
							// 	lifetime = objDevice.lifetime;
							// 	activePower = objDevice.activePower;
							// 	last_month_activeEnergy = objDevice.last_month_activeEnergy;

							// }


							// Get irradiance by project
							var irradiance = await db.queryForList("ClientProject.getIrradianceByProjectId", item);
							var irradianceArr = [];
							if (irradiance.length <= 0) {
								irradianceArr = [{ id_project: '', irradiancePoA: null }, { id_project: '', irradiancePoA: null }];
							} else {
								irradianceArr = irradiance;
							}

							if (irradianceArr.length == 1) {
								irradianceArr.push({ id_project: '', irradiancePoA: null });
							}

							dataList[i].alerts = JSON.parse(dataList[i].alarms);
							dataList[i].irradiance = irradianceArr;

							// dataList[i].energy_today = energy_today;
							// dataList[i].lifetime = lifetime;
							// dataList[i].last_month_activeEnergy = last_month_activeEnergy;
							// dataList[i].activePower = Libs.roundNumber((activePower / 1000), 1);

							dataList[i].revenue = dataList[i].lifetime / 1000 * dataList[i].config_revenue;
						}
					}

					conn.commit();
					callBack(false, dataList);
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
   * @since 30/07/2018
   * @param {Object User} data
   * @param {function callback} callback
   */

	}, {
		key: "getListProjectByEmployeeSize",
		value: function getListProjectByEmployeeSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("ClientProject.getListProjectByEmployeeSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get list project summary by employee id
   * @author Long.Pham
   * @since 30/09/2021
   * @param {Object ClientProject} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListPlantSummary",
		value: function getListPlantSummary(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var dataList = await db.queryForList("ClientProject.getListGroupProject", data);
					// if (Libs.isArrayData(dataList)) {
					// 	for (var i = 0; i < dataList.length; i++) {
					// 		var today_energy = 0, total_energy = 0, today_revenue = 0, total_revenue = 0 ,last_month_activeEnergy = 0;

					// 		var item = dataList[i];
					// 		var deviceGroupInverter = await db.queryForList("ClientProject.getListDeviceTypeByGroupProject", item);
					// 		if(deviceGroupInverter.length > 0){
					// 			var getDataEnergySummary = await db.queryForObject("ClientProject.getDataEnergySummary", { deviceGroupInverter });
					// 			if(getDataEnergySummary){
					// 				today_energy = getDataEnergySummary.today_activeEnergy;
					// 				total_energy = getDataEnergySummary.lifetime;
					// 				today_revenue = (today_energy) * 1934;
					// 				total_revenue = (total_energy / 1000) * 1934;
					// 			}
					// 		}

					// 		dataList[i].today_energy = today_energy;
					// 		dataList[i].total_energy = total_energy;
					// 		dataList[i].today_revenue = today_revenue;
					// 		dataList[i].total_revenue = total_revenue;
					// 		dataList[i].last_month_activeEnergy = last_month_activeEnergy;
					// 	}


					// for (var i = 0; i < dataList.length; i++) {
					// 	// get group device
					// 	var item = dataList[i];
					// 	var deviceGroupInverter = await db.queryForList("ClientProject.getGroupDeviceByProjectId", item);
					// 	var energy_today = 0, lifetime = 0, activePower = 0, last_month_activeEnergy = 0;
					// 	if (deviceGroupInverter && deviceGroupInverter.length > 0) {
					// 		// Get data energy 
					// 		let objDevice = await db.queryForObject("ClientProject.getDataDeviceEnergy", { deviceGroupInverter });
					// 		if (objDevice) {
					// 			energy_today = objDevice.today_activeEnergy;
					// 			lifetime = objDevice.lifetime;
					// 			activePower = objDevice.activePower;
					// 			last_month_activeEnergy = objDevice.last_month_activeEnergy;

					// 		}
					// 	}

					// 	// Get irradiance by project
					// 	var irradiance = await db.queryForList("ClientProject.getIrradianceByProjectId", item);
					// 	var irradianceArr = [];
					// 	if(irradiance.length <= 0){
					// 		irradianceArr = [
					// 			{ id_project: '', irradiancePoA: null },
					// 			{ id_project: '', irradiancePoA: null }
					// 		];
					// 	} else {
					// 		irradianceArr = irradiance; 
					// 	}

					// 	if(irradianceArr.length == 1){
					// 		irradianceArr.push({ id_project: '', irradiancePoA: null });
					// 	}


					// 	dataList[i].alerts = JSON.parse(dataList[i].alarms);
					// 	dataList[i].irradiance = irradianceArr;


					// 	dataList[i].energy_today = energy_today;
					// 	dataList[i].lifetime = lifetime;
					// 	dataList[i].last_month_activeEnergy = last_month_activeEnergy;
					// 	dataList[i].activePower = Libs.roundNumber((activePower / 1000), 1);

					// 	dataList[i].revenue = (lifetime / 1000) * dataList[i].config_revenue;
					// }
					// }

					conn.commit();
					callBack(false, dataList);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
				}
			});
		}

		/**
   * @description Get all project by employee id
   * @author Minh.Tuan
   * @since 30/07/2019
   * @param {Object ClientProject} data
   * @param {function callback} callback 
   */
		//  getAllProjectByEmployeeId(data, callback) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.queryForList("ClientProject.getAllProjectByEmployeeId", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }
		/**
   * @description Get list
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object ClientProject} data
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
		// 		db.queryForList("ClientProject.getList", data, callback);
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
		// 		db.queryForObject("ClientProject.getSize", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }

		// /**
		//  * @description Insert data
		//  * @author Long.Pham
		//  * @since 30/07/2019
		//  * @param {Object ClientProject} data
		//  */
		// insertClientProject(data, callBack) {
		// 	try {
		// 		let self = this;
		// 		var db = new mySqLDB();
		// 		db.beginTransaction(async function (conn) {
		// 			try {

		// 				var rs = await db.insert("ClientProject.insertClientProject", data);
		// 				var curId = rs.insertId;

		// 				if (!rs) {
		// 					conn.rollback();
		// 					callBack(false, {});
		// 					return;
		// 				}

		// 				// insert table ClientProject detail
		// 				let dataDetail = data.data;
		// 				if (dataDetail.length > 0) {
		// 					for (let i = 0; i < dataDetail.length; i++) {
		// 						dataDetail[i].id_ClientProject = curId;
		// 					}
		// 					rs = await db.insert("ClientProject.insertClientProjectDetail", { dataDetail });
		// 				}

		// 				let dataEmployees = data.dataEmployees;
		// 				if (dataEmployees.length > 0) {
		// 					for (let i = 0; i < dataEmployees.length; i++) {
		// 						dataEmployees[i].id_ClientProject = curId;
		// 					}
		// 					rs = await db.insert("ClientProject.insertClientProjectEmployeeMap", { dataEmployees });
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
		//  * @param {Object ClientProject} data
		//  * @param {function callback} callback
		//  */
		// updateClientProject(data, callBack) {
		// 	let self = this;
		// 	var db = new mySqLDB();
		// 	db.beginTransaction(async function (conn) {
		// 		try {

		// 			var rs = await db.delete("ClientProject.deleteClientProjectDetail", data);
		// 			rs = await db.delete("ClientProject.deleteEmployeeClientProjectMap", data);
		// 			rs = await db.update("ClientProject.updateClientProject", data);
		// 			if (!rs) {
		// 				conn.rollback();
		// 				callBack(false, {});
		// 				return;
		// 			}

		// 			// insert table ClientProject detail
		// 			let dataDetail = data.data;
		// 			if (dataDetail.length > 0) {
		// 				await db.insert("ClientProject.insertClientProjectDetail", { dataDetail });
		// 			}

		// 			let dataEmployees = data.dataEmployees;
		// 				if (dataEmployees.length > 0) {
		// 					for (let i = 0; i < dataEmployees.length; i++) {
		// 						dataEmployees[i].id_ClientProject = data.id;
		// 					}
		// 					rs = await db.insert("ClientProject.insertClientProjectEmployeeMap", { dataEmployees });
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
		//  * @param {Object ClientProject} data
		//  * @param {function callback} callback
		//  */
		// updateStatus(data, callBack) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.update("ClientProject.updateStatus", data, (err, rs) => {
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
		//  * @param {Object ClientProject} data
		//  * @param {function callback} callback
		//  */
		// delete(data, callBack) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.delete("ClientProject.delete", data, (err, rs) => {
		// 			return callBack(err, rs)
		// 		});
		// 	} catch (e) {
		// 		this.logger.error(e);
		// 		callBack(false, e);
		// 	}
		// }


		// /**
		// * get detail ClientProject
		// * @param {*} data 
		// * @param {*} callBack 
		// */
		// getDetail(param, callBack) {
		// 	try {
		// 		var db = new mySqLDB();
		// 		db.beginTransaction(async function (conn) {
		// 			try {
		// 				var rs = await db.queryForList("ClientProject.getDetail", param);
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

	return ClientProjectService;
}(_BaseService3.default);

exports.default = ClientProjectService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9DbGllbnRQcm9qZWN0U2VydmljZS5qcyJdLCJuYW1lcyI6WyJDbGllbnRQcm9qZWN0U2VydmljZSIsImRhdGEiLCJjYWxsQmFjayIsImRiIiwibXlTcUxEQiIsImJlZ2luVHJhbnNhY3Rpb24iLCJjb25uIiwiZGF0YVByb2plY3RzIiwic2NvcGUiLCJxdWVyeUZvckxpc3QiLCJMaWJzIiwiaXNBcnJheURhdGEiLCJpIiwibGVuZ3RoIiwiaXRlbSIsImlkX2VtcGxveWVlIiwibGlzdFByb2plY3RzIiwiZGF0YUNoaWxkcyIsInB1c2giLCJjb21taXQiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwicm9sbGJhY2siLCJkYXRhTGlzdCIsImRldmljZUdyb3VwSW52ZXJ0ZXIiLCJpcnJhZGlhbmNlIiwiaXJyYWRpYW5jZUFyciIsImlkX3Byb2plY3QiLCJpcnJhZGlhbmNlUG9BIiwiYWxlcnRzIiwiSlNPTiIsInBhcnNlIiwiYWxhcm1zIiwicmV2ZW51ZSIsImxpZmV0aW1lIiwiY29uZmlnX3JldmVudWUiLCJjYWxsYmFjayIsImNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wIiwicXVlcnlGb3JPYmplY3QiLCJlIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxvQjs7O0FBQ0wsaUNBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7Ozs0Q0FPMEJDLEksRUFBTUMsUSxFQUFVO0FBQ3pDLE9BQUlDLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE1BQUdFLGdCQUFILENBQW9CLGdCQUFnQkMsSUFBaEIsRUFBc0I7QUFDekMsUUFBSTtBQUNILFNBQUlDLGVBQWUsRUFBbkI7QUFDQSxTQUFJQyxRQUFRLE1BQU1MLEdBQUdNLFlBQUgsQ0FBZ0IsMkJBQWhCLEVBQTZDUixJQUE3QyxDQUFsQjtBQUNBLFNBQUlTLEtBQUtDLFdBQUwsQ0FBaUJILEtBQWpCLENBQUosRUFB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QUFDQTtBQUNBO0FBQ0E7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztFQWhka0NxQixxQjs7a0JBcWRwQnpDLG9CIiwiZmlsZSI6IkNsaWVudFByb2plY3RTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTZXJ2aWNlIGZyb20gJy4vQmFzZVNlcnZpY2UnO1xyXG5jbGFzcyBDbGllbnRQcm9qZWN0U2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBhbGxcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgR3JvdXBBdHRyaWJ1dGVzfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Z2V0QWxsUHJvamVjdEJ5RW1wbG95ZWVJZChkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR2YXIgZGF0YVByb2plY3RzID0gW107XHJcblx0XHRcdFx0dmFyIHNjb3BlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50UHJvamVjdC5nZXRBbGxTY29wZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShzY29wZSkpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2NvcGUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIGl0ZW0gPSBzY29wZVtpXTtcclxuXHRcdFx0XHRcdFx0aXRlbS5pZF9lbXBsb3llZSA9IGRhdGEuaWRfZW1wbG95ZWU7XHJcblx0XHRcdFx0XHRcdHZhciBsaXN0UHJvamVjdHMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRQcm9qZWN0LmdldEFsbFByb2plY3RCeUVtcGxveWVlSWRcIiwgaXRlbSk7XHJcblx0XHRcdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGxpc3RQcm9qZWN0cykgJiYgbGlzdFByb2plY3RzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRpdGVtLmRhdGFDaGlsZHMgPSBsaXN0UHJvamVjdHM7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YVByb2plY3RzLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFQcm9qZWN0cyk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3QgcHJvamVjdCBieSBlbXBsb3llZSBpZFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBDbGllbnRQcm9qZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Z2V0TGlzdFByb2plY3RCeUVtcGxveWVlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdC8vIHZhciBkYXRhUHJvamVjdHMgPSBbXTtcclxuXHRcdFx0XHR2YXIgZGF0YUxpc3QgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRQcm9qZWN0LmdldExpc3RQcm9qZWN0QnlFbXBsb3llZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShkYXRhTGlzdCkpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0Ly8gZ2V0IGdyb3VwIGRldmljZVxyXG5cdFx0XHRcdFx0XHR2YXIgaXRlbSA9IGRhdGFMaXN0W2ldO1xyXG5cdFx0XHRcdFx0XHR2YXIgZGV2aWNlR3JvdXBJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudFByb2plY3QuZ2V0R3JvdXBEZXZpY2VCeVByb2plY3RJZFwiLCBpdGVtKTtcclxuXHRcdFx0XHRcdFx0Ly8gdmFyIGVuZXJneV90b2RheSA9IDAsIGxpZmV0aW1lID0gMCwgYWN0aXZlUG93ZXIgPSAwLCBsYXN0X21vbnRoX2FjdGl2ZUVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdGlmIChkZXZpY2VHcm91cEludmVydGVyICYmIGRldmljZUdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIEdldCBkYXRhIGVuZXJneSBcclxuXHRcdFx0XHRcdFx0XHQvLyBsZXQgb2JqRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnRQcm9qZWN0LmdldERhdGFEZXZpY2VFbmVyZ3lcIiwgeyBkZXZpY2VHcm91cEludmVydGVyIH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGlmIChvYmpEZXZpY2UpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGVuZXJneV90b2RheSA9IG9iakRldmljZS50b2RheV9hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRsaWZldGltZSA9IG9iakRldmljZS5saWZldGltZTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGFjdGl2ZVBvd2VyID0gb2JqRGV2aWNlLmFjdGl2ZVBvd2VyO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0bGFzdF9tb250aF9hY3RpdmVFbmVyZ3kgPSBvYmpEZXZpY2UubGFzdF9tb250aF9hY3RpdmVFbmVyZ3k7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gR2V0IGlycmFkaWFuY2UgYnkgcHJvamVjdFxyXG5cdFx0XHRcdFx0XHR2YXIgaXJyYWRpYW5jZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudFByb2plY3QuZ2V0SXJyYWRpYW5jZUJ5UHJvamVjdElkXCIsIGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHR2YXIgaXJyYWRpYW5jZUFyciA9IFtdO1xyXG5cdFx0XHRcdFx0XHRpZihpcnJhZGlhbmNlLmxlbmd0aCA8PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRpcnJhZGlhbmNlQXJyID0gW1xyXG5cdFx0XHRcdFx0XHRcdFx0eyBpZF9wcm9qZWN0OiAnJywgaXJyYWRpYW5jZVBvQTogbnVsbCB9LFxyXG5cdFx0XHRcdFx0XHRcdFx0eyBpZF9wcm9qZWN0OiAnJywgaXJyYWRpYW5jZVBvQTogbnVsbCB9XHJcblx0XHRcdFx0XHRcdFx0XTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpcnJhZGlhbmNlQXJyID0gaXJyYWRpYW5jZTsgXHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmKGlycmFkaWFuY2VBcnIubGVuZ3RoID09IDEpe1xyXG5cdFx0XHRcdFx0XHRcdGlycmFkaWFuY2VBcnIucHVzaCh7IGlkX3Byb2plY3Q6ICcnLCBpcnJhZGlhbmNlUG9BOiBudWxsIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmFsZXJ0cyA9IEpTT04ucGFyc2UoZGF0YUxpc3RbaV0uYWxhcm1zKTtcclxuXHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uaXJyYWRpYW5jZSA9IGlycmFkaWFuY2VBcnI7XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gZGF0YUxpc3RbaV0uZW5lcmd5X3RvZGF5ID0gZW5lcmd5X3RvZGF5O1xyXG5cdFx0XHRcdFx0XHQvLyBkYXRhTGlzdFtpXS5saWZldGltZSA9IGxpZmV0aW1lO1xyXG5cdFx0XHRcdFx0XHQvLyBkYXRhTGlzdFtpXS5sYXN0X21vbnRoX2FjdGl2ZUVuZXJneSA9IGxhc3RfbW9udGhfYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHQvLyBkYXRhTGlzdFtpXS5hY3RpdmVQb3dlciA9IExpYnMucm91bmROdW1iZXIoKGFjdGl2ZVBvd2VyIC8gMTAwMCksIDEpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0ucmV2ZW51ZSA9IChkYXRhTGlzdFtpXS5saWZldGltZSAvIDEwMDApICogZGF0YUxpc3RbaV0uY29uZmlnX3JldmVudWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhTGlzdCk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHRcclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gTOG6pXkgdOG7lW5nIHPhu5EgZMOybmdcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE4XHJcblx0ICogQHBhcmFtIHtPYmplY3QgVXNlcn0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0Z2V0TGlzdFByb2plY3RCeUVtcGxveWVlU2l6ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQ2xpZW50UHJvamVjdC5nZXRMaXN0UHJvamVjdEJ5RW1wbG95ZWVTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdCBwcm9qZWN0IHN1bW1hcnkgYnkgZW1wbG95ZWUgaWRcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgQ2xpZW50UHJvamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdCBnZXRMaXN0UGxhbnRTdW1tYXJ5KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBkYXRhTGlzdCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudFByb2plY3QuZ2V0TGlzdEdyb3VwUHJvamVjdFwiLCBkYXRhKTtcclxuXHRcdFx0XHQvLyBpZiAoTGlicy5pc0FycmF5RGF0YShkYXRhTGlzdCkpIHtcclxuXHRcdFx0XHQvLyBcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHQvLyBcdFx0dmFyIHRvZGF5X2VuZXJneSA9IDAsIHRvdGFsX2VuZXJneSA9IDAsIHRvZGF5X3JldmVudWUgPSAwLCB0b3RhbF9yZXZlbnVlID0gMCAsbGFzdF9tb250aF9hY3RpdmVFbmVyZ3kgPSAwO1xyXG5cclxuXHRcdFx0XHQvLyBcdFx0dmFyIGl0ZW0gPSBkYXRhTGlzdFtpXTtcclxuXHRcdFx0XHQvLyBcdFx0dmFyIGRldmljZUdyb3VwSW52ZXJ0ZXIgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRQcm9qZWN0LmdldExpc3REZXZpY2VUeXBlQnlHcm91cFByb2plY3RcIiwgaXRlbSk7XHJcblx0XHRcdFx0Ly8gXHRcdGlmKGRldmljZUdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0Ly8gXHRcdFx0dmFyIGdldERhdGFFbmVyZ3lTdW1tYXJ5ID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnRQcm9qZWN0LmdldERhdGFFbmVyZ3lTdW1tYXJ5XCIsIHsgZGV2aWNlR3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHQvLyBcdFx0XHRpZihnZXREYXRhRW5lcmd5U3VtbWFyeSl7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHR0b2RheV9lbmVyZ3kgPSBnZXREYXRhRW5lcmd5U3VtbWFyeS50b2RheV9hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHR0b3RhbF9lbmVyZ3kgPSBnZXREYXRhRW5lcmd5U3VtbWFyeS5saWZldGltZTtcclxuXHRcdFx0XHQvLyBcdFx0XHRcdHRvZGF5X3JldmVudWUgPSAodG9kYXlfZW5lcmd5KSAqIDE5MzQ7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHR0b3RhbF9yZXZlbnVlID0gKHRvdGFsX2VuZXJneSAvIDEwMDApICogMTkzNDtcclxuXHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0Ly8gXHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gXHRcdGRhdGFMaXN0W2ldLnRvZGF5X2VuZXJneSA9IHRvZGF5X2VuZXJneTtcclxuXHRcdFx0XHQvLyBcdFx0ZGF0YUxpc3RbaV0udG90YWxfZW5lcmd5ID0gdG90YWxfZW5lcmd5O1xyXG5cdFx0XHRcdC8vIFx0XHRkYXRhTGlzdFtpXS50b2RheV9yZXZlbnVlID0gdG9kYXlfcmV2ZW51ZTtcclxuXHRcdFx0XHQvLyBcdFx0ZGF0YUxpc3RbaV0udG90YWxfcmV2ZW51ZSA9IHRvdGFsX3JldmVudWU7XHJcblx0XHRcdFx0Ly8gXHRcdGRhdGFMaXN0W2ldLmxhc3RfbW9udGhfYWN0aXZlRW5lcmd5ID0gbGFzdF9tb250aF9hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0Ly8gXHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdC8vIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdC8vIFx0Ly8gZ2V0IGdyb3VwIGRldmljZVxyXG5cdFx0XHRcdFx0Ly8gXHR2YXIgaXRlbSA9IGRhdGFMaXN0W2ldO1xyXG5cdFx0XHRcdFx0Ly8gXHR2YXIgZGV2aWNlR3JvdXBJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudFByb2plY3QuZ2V0R3JvdXBEZXZpY2VCeVByb2plY3RJZFwiLCBpdGVtKTtcclxuXHRcdFx0XHRcdC8vIFx0dmFyIGVuZXJneV90b2RheSA9IDAsIGxpZmV0aW1lID0gMCwgYWN0aXZlUG93ZXIgPSAwLCBsYXN0X21vbnRoX2FjdGl2ZUVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHQvLyBcdGlmIChkZXZpY2VHcm91cEludmVydGVyICYmIGRldmljZUdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0Ly8gXHRcdC8vIEdldCBkYXRhIGVuZXJneSBcclxuXHRcdFx0XHRcdC8vIFx0XHRsZXQgb2JqRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnRQcm9qZWN0LmdldERhdGFEZXZpY2VFbmVyZ3lcIiwgeyBkZXZpY2VHcm91cEludmVydGVyIH0pO1xyXG5cdFx0XHRcdFx0Ly8gXHRcdGlmIChvYmpEZXZpY2UpIHtcclxuXHRcdFx0XHRcdC8vIFx0XHRcdGVuZXJneV90b2RheSA9IG9iakRldmljZS50b2RheV9hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHQvLyBcdFx0XHRsaWZldGltZSA9IG9iakRldmljZS5saWZldGltZTtcclxuXHRcdFx0XHRcdC8vIFx0XHRcdGFjdGl2ZVBvd2VyID0gb2JqRGV2aWNlLmFjdGl2ZVBvd2VyO1xyXG5cdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF9tb250aF9hY3RpdmVFbmVyZ3kgPSBvYmpEZXZpY2UubGFzdF9tb250aF9hY3RpdmVFbmVyZ3k7XHJcblxyXG5cdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdC8vIFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIFx0Ly8gR2V0IGlycmFkaWFuY2UgYnkgcHJvamVjdFxyXG5cdFx0XHRcdFx0Ly8gXHR2YXIgaXJyYWRpYW5jZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudFByb2plY3QuZ2V0SXJyYWRpYW5jZUJ5UHJvamVjdElkXCIsIGl0ZW0pO1xyXG5cdFx0XHRcdFx0Ly8gXHR2YXIgaXJyYWRpYW5jZUFyciA9IFtdO1xyXG5cdFx0XHRcdFx0Ly8gXHRpZihpcnJhZGlhbmNlLmxlbmd0aCA8PSAwKXtcclxuXHRcdFx0XHRcdC8vIFx0XHRpcnJhZGlhbmNlQXJyID0gW1xyXG5cdFx0XHRcdFx0Ly8gXHRcdFx0eyBpZF9wcm9qZWN0OiAnJywgaXJyYWRpYW5jZVBvQTogbnVsbCB9LFxyXG5cdFx0XHRcdFx0Ly8gXHRcdFx0eyBpZF9wcm9qZWN0OiAnJywgaXJyYWRpYW5jZVBvQTogbnVsbCB9XHJcblx0XHRcdFx0XHQvLyBcdFx0XTtcclxuXHRcdFx0XHRcdC8vIFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIFx0XHRpcnJhZGlhbmNlQXJyID0gaXJyYWRpYW5jZTsgXHJcblx0XHRcdFx0XHQvLyBcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBcdGlmKGlycmFkaWFuY2VBcnIubGVuZ3RoID09IDEpe1xyXG5cdFx0XHRcdFx0Ly8gXHRcdGlycmFkaWFuY2VBcnIucHVzaCh7IGlkX3Byb2plY3Q6ICcnLCBpcnJhZGlhbmNlUG9BOiBudWxsIH0pO1xyXG5cdFx0XHRcdFx0Ly8gXHR9XHJcblxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBcdGRhdGFMaXN0W2ldLmFsZXJ0cyA9IEpTT04ucGFyc2UoZGF0YUxpc3RbaV0uYWxhcm1zKTtcclxuXHRcdFx0XHRcdC8vIFx0ZGF0YUxpc3RbaV0uaXJyYWRpYW5jZSA9IGlycmFkaWFuY2VBcnI7XHJcblxyXG5cclxuXHRcdFx0XHRcdC8vIFx0ZGF0YUxpc3RbaV0uZW5lcmd5X3RvZGF5ID0gZW5lcmd5X3RvZGF5O1xyXG5cdFx0XHRcdFx0Ly8gXHRkYXRhTGlzdFtpXS5saWZldGltZSA9IGxpZmV0aW1lO1xyXG5cdFx0XHRcdFx0Ly8gXHRkYXRhTGlzdFtpXS5sYXN0X21vbnRoX2FjdGl2ZUVuZXJneSA9IGxhc3RfbW9udGhfYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0Ly8gXHRkYXRhTGlzdFtpXS5hY3RpdmVQb3dlciA9IExpYnMucm91bmROdW1iZXIoKGFjdGl2ZVBvd2VyIC8gMTAwMCksIDEpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIFx0ZGF0YUxpc3RbaV0ucmV2ZW51ZSA9IChsaWZldGltZSAvIDEwMDApICogZGF0YUxpc3RbaV0uY29uZmlnX3JldmVudWU7XHJcblx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhTGlzdCk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgYWxsIHByb2plY3QgYnkgZW1wbG95ZWUgaWRcclxuXHQgKiBAYXV0aG9yIE1pbmguVHVhblxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgQ2xpZW50UHJvamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdC8vICBnZXRBbGxQcm9qZWN0QnlFbXBsb3llZUlkKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHQvLyBcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdFx0ZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50UHJvamVjdC5nZXRBbGxQcm9qZWN0QnlFbXBsb3llZUlkXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHQvLyBcdH0gY2F0Y2ggKGUpIHtcclxuXHQvLyBcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0Ly8gXHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBDbGllbnRQcm9qZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Ly8gZ2V0TGlzdChkYXRhLCBjYWxsYmFjaykge1xyXG5cdC8vIFx0dHJ5IHtcclxuXHQvLyBcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YSkpIHtcclxuXHQvLyBcdFx0XHRkYXRhLmN1cnJlbnRfcm93ID0gKHR5cGVvZiBkYXRhLmN1cnJlbnRfcm93ID09ICd1bmRlZmluZWQnKSA/IDAgOiBkYXRhLmN1cnJlbnRfcm93O1xyXG5cdC8vIFx0XHRcdGRhdGEubWF4X3JlY29yZCA9IENvbnN0YW50cy5kYXRhLm1heF9yZWNvcmQ7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0Ly8gXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudFByb2plY3QuZ2V0TGlzdFwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdC8vIFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblx0Ly8gLyoqXHJcblx0Ly8gICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0Ly8gICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQvLyAgKiBAc2luY2UgMzAvMDcvMjAxOFxyXG5cdC8vICAqIEBwYXJhbSB7T2JqZWN0IFVzZXJ9IGRhdGFcclxuXHQvLyAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdC8vICAqL1xyXG5cdC8vIGdldFNpemUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHQvLyBcdHRyeSB7XHJcblx0Ly8gXHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdC8vIFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0XHRkYi5xdWVyeUZvck9iamVjdChcIkNsaWVudFByb2plY3QuZ2V0U2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdC8vIFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblx0Ly8gLyoqXHJcblx0Ly8gICogQGRlc2NyaXB0aW9uIEluc2VydCBkYXRhXHJcblx0Ly8gICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQvLyAgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdC8vICAqIEBwYXJhbSB7T2JqZWN0IENsaWVudFByb2plY3R9IGRhdGFcclxuXHQvLyAgKi9cclxuXHQvLyBpbnNlcnRDbGllbnRQcm9qZWN0KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0Ly8gXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHQvLyBcdFx0XHR0cnkge1xyXG5cclxuXHQvLyBcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmluc2VydChcIkNsaWVudFByb2plY3QuaW5zZXJ0Q2xpZW50UHJvamVjdFwiLCBkYXRhKTtcclxuXHQvLyBcdFx0XHRcdHZhciBjdXJJZCA9IHJzLmluc2VydElkO1xyXG5cclxuXHQvLyBcdFx0XHRcdGlmICghcnMpIHtcclxuXHQvLyBcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdC8vIFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdC8vIFx0XHRcdFx0XHRyZXR1cm47XHJcblx0Ly8gXHRcdFx0XHR9XHJcblxyXG5cdC8vIFx0XHRcdFx0Ly8gaW5zZXJ0IHRhYmxlIENsaWVudFByb2plY3QgZGV0YWlsXHJcblx0Ly8gXHRcdFx0XHRsZXQgZGF0YURldGFpbCA9IGRhdGEuZGF0YTtcclxuXHQvLyBcdFx0XHRcdGlmIChkYXRhRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuXHQvLyBcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhRGV0YWlsLmxlbmd0aDsgaSsrKSB7XHJcblx0Ly8gXHRcdFx0XHRcdFx0ZGF0YURldGFpbFtpXS5pZF9DbGllbnRQcm9qZWN0ID0gY3VySWQ7XHJcblx0Ly8gXHRcdFx0XHRcdH1cclxuXHQvLyBcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJDbGllbnRQcm9qZWN0Lmluc2VydENsaWVudFByb2plY3REZXRhaWxcIiwgeyBkYXRhRGV0YWlsIH0pO1xyXG5cdC8vIFx0XHRcdFx0fVxyXG5cclxuXHQvLyBcdFx0XHRcdGxldCBkYXRhRW1wbG95ZWVzID0gZGF0YS5kYXRhRW1wbG95ZWVzO1xyXG5cdC8vIFx0XHRcdFx0aWYgKGRhdGFFbXBsb3llZXMubGVuZ3RoID4gMCkge1xyXG5cdC8vIFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFFbXBsb3llZXMubGVuZ3RoOyBpKyspIHtcclxuXHQvLyBcdFx0XHRcdFx0XHRkYXRhRW1wbG95ZWVzW2ldLmlkX0NsaWVudFByb2plY3QgPSBjdXJJZDtcclxuXHQvLyBcdFx0XHRcdFx0fVxyXG5cdC8vIFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIkNsaWVudFByb2plY3QuaW5zZXJ0Q2xpZW50UHJvamVjdEVtcGxveWVlTWFwXCIsIHsgZGF0YUVtcGxveWVlcyB9KTtcclxuXHQvLyBcdFx0XHRcdH1cclxuXHJcblx0Ly8gXHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0Ly8gXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHQvLyBcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdC8vIFx0XHRcdFx0fVxyXG5cdC8vIFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHQvLyBcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHQvLyBcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHQvLyBcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdC8vIFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdC8vIFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0Ly8gXHRcdFx0fVxyXG5cdC8vIFx0XHR9KVxyXG5cdC8vIFx0fSBjYXRjaCAoZSkge1xyXG5cdC8vIFx0XHRjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcclxuXHQvLyBcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblxyXG5cdC8vIC8qKlxyXG5cdC8vICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgZGF0YVxyXG5cdC8vICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0Ly8gICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQvLyAgKiBAcGFyYW0ge09iamVjdCBDbGllbnRQcm9qZWN0fSBkYXRhXHJcblx0Ly8gICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQvLyAgKi9cclxuXHQvLyB1cGRhdGVDbGllbnRQcm9qZWN0KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0Ly8gXHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdC8vIFx0XHR0cnkge1xyXG5cclxuXHQvLyBcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5kZWxldGUoXCJDbGllbnRQcm9qZWN0LmRlbGV0ZUNsaWVudFByb2plY3REZXRhaWxcIiwgZGF0YSk7XHJcblx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5kZWxldGUoXCJDbGllbnRQcm9qZWN0LmRlbGV0ZUVtcGxveWVlQ2xpZW50UHJvamVjdE1hcFwiLCBkYXRhKTtcclxuXHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkNsaWVudFByb2plY3QudXBkYXRlQ2xpZW50UHJvamVjdFwiLCBkYXRhKTtcclxuXHQvLyBcdFx0XHRpZiAoIXJzKSB7XHJcblx0Ly8gXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdC8vIFx0XHRcdFx0cmV0dXJuO1xyXG5cdC8vIFx0XHRcdH1cclxuXHJcblx0Ly8gXHRcdFx0Ly8gaW5zZXJ0IHRhYmxlIENsaWVudFByb2plY3QgZGV0YWlsXHJcblx0Ly8gXHRcdFx0bGV0IGRhdGFEZXRhaWwgPSBkYXRhLmRhdGE7XHJcblx0Ly8gXHRcdFx0aWYgKGRhdGFEZXRhaWwubGVuZ3RoID4gMCkge1xyXG5cdC8vIFx0XHRcdFx0YXdhaXQgZGIuaW5zZXJ0KFwiQ2xpZW50UHJvamVjdC5pbnNlcnRDbGllbnRQcm9qZWN0RGV0YWlsXCIsIHsgZGF0YURldGFpbCB9KTtcclxuXHQvLyBcdFx0XHR9XHJcblxyXG5cdC8vIFx0XHRcdGxldCBkYXRhRW1wbG95ZWVzID0gZGF0YS5kYXRhRW1wbG95ZWVzO1xyXG5cdC8vIFx0XHRcdFx0aWYgKGRhdGFFbXBsb3llZXMubGVuZ3RoID4gMCkge1xyXG5cdC8vIFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFFbXBsb3llZXMubGVuZ3RoOyBpKyspIHtcclxuXHQvLyBcdFx0XHRcdFx0XHRkYXRhRW1wbG95ZWVzW2ldLmlkX0NsaWVudFByb2plY3QgPSBkYXRhLmlkO1xyXG5cdC8vIFx0XHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiQ2xpZW50UHJvamVjdC5pbnNlcnRDbGllbnRQcm9qZWN0RW1wbG95ZWVNYXBcIiwgeyBkYXRhRW1wbG95ZWVzIH0pO1xyXG5cdC8vIFx0XHRcdFx0fVxyXG5cclxuXHJcblx0Ly8gXHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHQvLyBcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0Ly8gXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdC8vIFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdC8vIFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0fSlcclxuXHQvLyB9XHJcblxyXG5cclxuXHJcblx0Ly8gLyoqXHJcblx0Ly8gICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBzdGF0dXNcclxuXHQvLyAgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdC8vICAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0Ly8gICogQHBhcmFtIHtPYmplY3QgQ2xpZW50UHJvamVjdH0gZGF0YVxyXG5cdC8vICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0Ly8gICovXHJcblx0Ly8gdXBkYXRlU3RhdHVzKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHQvLyBcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdFx0ZGIudXBkYXRlKFwiQ2xpZW50UHJvamVjdC51cGRhdGVTdGF0dXNcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHQvLyBcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHQvLyBcdFx0fSk7XHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdC8vIFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHQvLyAvKipcclxuXHQvLyAgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGlzX2RlbGV0ZSA9IDFcclxuXHQvLyAgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdC8vICAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0Ly8gICogQHBhcmFtIHtPYmplY3QgQ2xpZW50UHJvamVjdH0gZGF0YVxyXG5cdC8vICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0Ly8gICovXHJcblx0Ly8gZGVsZXRlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHQvLyBcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdFx0ZGIuZGVsZXRlKFwiQ2xpZW50UHJvamVjdC5kZWxldGVcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHQvLyBcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHQvLyBcdFx0fSk7XHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdC8vIFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHJcblx0Ly8gLyoqXHJcblx0Ly8gKiBnZXQgZGV0YWlsIENsaWVudFByb2plY3RcclxuXHQvLyAqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQvLyAqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ly8gKi9cclxuXHQvLyBnZXREZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0Ly8gXHRcdFx0dHJ5IHtcclxuXHQvLyBcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudFByb2plY3QuZ2V0RGV0YWlsXCIsIHBhcmFtKTtcclxuXHQvLyBcdFx0XHRcdHZhciBkYXRhID0gcnNbMF1bMF07XHJcblx0Ly8gXHRcdFx0XHRkYXRhLmRhdGEgPSByc1sxXTtcclxuXHQvLyBcdFx0XHRcdGRhdGEuZGF0YUVtcGxveWVlcyA9IHJzWzJdO1xyXG5cdC8vIFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHQvLyBcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhKTtcclxuXHQvLyBcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHQvLyBcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdC8vIFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdC8vIFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHQvLyBcdFx0XHR9XHJcblx0Ly8gXHRcdH0pO1xyXG5cdC8vIFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0Ly8gXHRcdC8vIGNvbnNvbGUubG9nKCdlcnJvciBnZXQgbWF0ZXJpYWwgb3JkZXIgZm9yIHZvdWNoZXIgb3V0JywgZXJyKTtcclxuXHQvLyBcdFx0aWYgKGNvbm4pIHtcclxuXHQvLyBcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcblxyXG5cclxuXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50UHJvamVjdFNlcnZpY2U7XHJcbiJdfQ==