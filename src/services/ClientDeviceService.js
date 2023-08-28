import BaseService from './BaseService';
class ClientDeviceService extends BaseService {
	constructor() {
		super();

	}

	/**
	 * @description Get list
	 * @author Long.Pham
	 * @since 12/09/2021
	 * @param {Object} data
	 * @param {function callback} callback 
	 */

	getList(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				
				data.current_date = Libs.convertAllFormatDate(data.current_date);
				var dataDevice = await db.queryForList("ClientDevice.getList", data);
				if (Libs.isArrayData(dataDevice)) {
					for (var i = 0; i < dataDevice.length; i++) {
						var item = dataDevice[i];
						// Get list alert
						let alerts = await db.queryForList("ClientDevice.getAlertByDevice", {
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
								let objData = await db.queryForObject("ClientDevice.getDataDeviceEnergy", {
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
	getSize(data, callback) {
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

	getListParameterByDevice(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var dataDevice = await db.queryForList("ClientDevice.getListParameterByDevice", data);

				let getLastRowDataDevice = await db.queryForObject("ClientDevice.getLastRowDataDevice", {
					id_device: data.id,
					id_language: data.id_language,
					table_name: data.table_name
				});
				const moment = require("moment");
				let date = moment().format('DD/MM/YYYY HH:mm:ss');
				
				if(Libs.isArrayData(dataDevice) && getLastRowDataDevice){
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
	 getListAlertByDevice(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
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
	 getListAlertByDeviceSize(data, callback) {
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



}
export default ClientDeviceService;
