import BaseService from './BaseService';
class ClientProjectService extends BaseService {
	constructor() {
		super();

	}

	/**
	 * @description Get all
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object GroupAttributes} data
	 * @param {function callback} callback 
	 */
	getAllProjectByEmployeeId(data, callBack) {
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
	getListProjectByEmployee(data, callBack) {
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
						if (deviceGroupInverter && deviceGroupInverter.length > 0) {
							// Get data energy 
							// let objDevice = await db.queryForObject("ClientProject.getDataDeviceEnergy", { deviceGroupInverter });
							// if (objDevice) {
							// 	energy_today = objDevice.today_activeEnergy;
							// 	lifetime = objDevice.lifetime;
							// 	activePower = objDevice.activePower;
							// 	last_month_activeEnergy = objDevice.last_month_activeEnergy;

							// }
						}

						// Get irradiance by project
						var irradiance = await db.queryForList("ClientProject.getIrradianceByProjectId", item);
						var irradianceArr = [];
						if(irradiance.length <= 0){
							irradianceArr = [
								{ id_project: '', irradiancePoA: null },
								{ id_project: '', irradiancePoA: null }
							];
						} else {
							irradianceArr = irradiance; 
						}

						if(irradianceArr.length == 1){
							irradianceArr.push({ id_project: '', irradiancePoA: null });
						}

					
						dataList[i].alerts = JSON.parse(dataList[i].alarms);
						dataList[i].irradiance = irradianceArr;


						// dataList[i].energy_today = energy_today;
						// dataList[i].lifetime = lifetime;
						// dataList[i].last_month_activeEnergy = last_month_activeEnergy;
						// dataList[i].activePower = Libs.roundNumber((activePower / 1000), 1);
						
						dataList[i].revenue = (dataList[i].lifetime / 1000) * dataList[i].config_revenue;
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
	getListProjectByEmployeeSize(data, callback) {
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
	 getListPlantSummary(data, callBack) {
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



}
export default ClientProjectService;
