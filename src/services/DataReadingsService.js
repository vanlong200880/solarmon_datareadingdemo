import BaseService from './BaseService';
import ModelSensorRT1Entity from '../entities/ModelSensorRT1Entity';
import ModelSensorIMTTaRS485Entity from '../entities/ModelSensorIMTTaRS485Entity';
import ModelSensorIMTSiRS485Entity from '../entities/ModelSensorIMTSiRS485Entity';
import ModelLoggerSMAIM20Entity from '../entities/ModelLoggerSMAIM20Entity';
import ModelInverterSungrowSG110CXEntity from '../entities/ModelInverterSungrowSG110CXEntity';
import ModelInverterSMASTP50Entity from '../entities/ModelInverterSMASTP50Entity';
import ModelInverterSMASHP75Entity from '../entities/ModelInverterSMASHP75Entity';
import ModelInverterGrowattGW80KTL3Entity from '../entities/ModelInverterGrowattGW80KTL3Entity';
import ModelInverterABBPVS100Entity from '../entities/ModelInverterABBPVS100Entity';
import ModelEmeterJanitzaUMG96S2Entity from '../entities/ModelEmeterJanitzaUMG96S2Entity';
import ModelTechedgeEntity from '../entities/ModelTechedgeEntity';
import ModelInverterSMASTP110Entity from '../entities/ModelInverterSMASTP110Entity';
import ModelEmeterVinasinoVSE3T5Entity from '../entities/ModelEmeterVinasinoVSE3T5Entity';
import ModelEmeterGelexEmicME41Entity from '../entities/ModelEmeterGelexEmicME41Entity';
import ModelEmeterVinasinoVSE3T52023Entity from '../entities/ModelEmeterVinasinoVSE3T52023Entity';

class DataReadingsService extends BaseService {
	constructor() {
		super();
	}

	/**
	 * @description Insert data
	 * @author Long.Pham
	 * @since 10/09/2021
	 * @param {Object model} data
	 */
	insertDataReadings(data, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var dataPayload = data.payload;
					if (!Libs.isObjectEmpty(dataPayload)) {
						Object.keys(dataPayload).forEach(function (el) {
							dataPayload[el] = (dataPayload[el] == '\x00' || dataPayload[el] == '') ? null : dataPayload[el];
						});
					}

					var getDeviceInfo = await db.queryForObject("ModelReadings.getDeviceInfo", data);
					if (Libs.isObjectEmpty(dataPayload) || !getDeviceInfo || Libs.isObjectEmpty(getDeviceInfo) || Libs.isBlank(getDeviceInfo.table_name) || Libs.isBlank(getDeviceInfo.id)) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					let dataEntity = {}, rs = {}, checkExistAlerm = null;
					switch (getDeviceInfo.table_name) {

						case 'model_emeter_GelexEmic_ME41':
							dataEntity = Object.assign({}, new ModelEmeterGelexEmicME41Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							dataEntity.activeEnergy = dataEntity.activeEnergyExport;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 649
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 649,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.view_table
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
									dataEntity.activeEnergyExport = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 649,
										status: 0
									});
								}
							}

							// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelEmeterGelexEmicME41", dataEntity);
								// Update device 
							// 	if (rs) {
							// 		let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
							// 			id_device: getDeviceInfo.id,
							// 			table_name: getDeviceInfo.view_table
							// 		});
							// 		if (lastRowDataUpdated) {
							// 			let deviceUpdated = {
							// 				id: getDeviceInfo.id,
							// 				power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
							// 				energy_today: lastRowDataUpdated.energy_today,
							// 				last_month: lastRowDataUpdated.energy_last_month,
							// 				lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
							// 				last_updated: dataEntity.time
							// 			};
							// 			db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// 		}
							// 	}
							// }

							break;

						case 'model_emeter_Vinasino_VSE3T5':
							dataEntity = Object.assign({}, new ModelEmeterVinasinoVSE3T5Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 626
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 626,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.view_table
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 626,
										status: 0
									});
								}
							}

							// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelEmeterVinasinoVSE3T5", dataEntity);
								// Update device 
							// 	if (rs) {
							// 		let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
							// 			id_device: getDeviceInfo.id,
							// 			table_name: getDeviceInfo.view_table
							// 		});
							// 		if (lastRowDataUpdated) {
							// 			let deviceUpdated = {
							// 				id: getDeviceInfo.id,
							// 				power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
							// 				energy_today: lastRowDataUpdated.energy_today,
							// 				last_month: lastRowDataUpdated.energy_last_month,
							// 				lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
							// 				last_updated: dataEntity.time
							// 			};
							// 			db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// 		}
							// 	}
							// }

							break;


							case 'model_emeter_Vinasino_VSE3T52023':
								dataEntity = Object.assign({}, new ModelEmeterVinasinoVSE3T52023Entity(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 663
								});
	
								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 663,
											start_date: data.timestamp,
											status: 1
										});
									}
	
									// Get last row by device 
									var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
										id_device: getDeviceInfo.id,
										table_name: getDeviceInfo.view_table
									});
									if (lastRow) {
										dataEntity.activeEnergy = lastRow.activeEnergy;
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 663,
											status: 0
										});
									}
								}
	
								// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
									rs = await db.insert("ModelReadings.insertModelEmeterVinasinoVSE3T52023", dataEntity);
									// Update device 
								// 	if (rs) {
								// 		let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 			id_device: getDeviceInfo.id,
								// 			table_name: getDeviceInfo.view_table
								// 		});
								// 		if (lastRowDataUpdated) {
								// 			let deviceUpdated = {
								// 				id: getDeviceInfo.id,
								// 				power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 				energy_today: lastRowDataUpdated.energy_today,
								// 				last_month: lastRowDataUpdated.energy_last_month,
								// 				lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 				last_updated: dataEntity.time
								// 			};
								// 			db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 		}
								// 	}
								// }
	
								break;


						case 'model_inverter_SMA_STP110':
							dataEntity = Object.assign({}, new ModelInverterSMASTP110Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 437
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 437,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.view_table
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 437,
										status: 0
									});
								}
							}

							// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterSMASTP110", dataEntity);
								// Update device 
							// 	if (rs) {
							// 		let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
							// 			id_device: getDeviceInfo.id,
							// 			table_name: getDeviceInfo.view_table
							// 		});
							// 		if (lastRowDataUpdated) {
							// 			let deviceUpdated = {
							// 				id: getDeviceInfo.id,
							// 				power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
							// 				energy_today: lastRowDataUpdated.energy_today,
							// 				last_month: lastRowDataUpdated.energy_last_month,
							// 				lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
							// 				last_updated: dataEntity.time
							// 			};
							// 			db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// 		}
							// 	}
							// }

							break;

						case 'model_inverter_ABB_PVS100':
							dataEntity = Object.assign({}, new ModelInverterABBPVS100Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 428
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 428,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.view_table
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 428,
										status: 0
									});
								}
							}

							// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterABBPVS100", dataEntity);
								// Update device 
							// 	if (rs) {
							// 		let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
							// 			id_device: getDeviceInfo.id,
							// 			table_name: getDeviceInfo.view_table
							// 		});
							// 		if (lastRowDataUpdated) {
							// 			let deviceUpdated = {
							// 				id: getDeviceInfo.id,
							// 				power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
							// 				energy_today: lastRowDataUpdated.energy_today,
							// 				last_month: lastRowDataUpdated.energy_last_month,
							// 				lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
							// 				last_updated: dataEntity.time
							// 			};
							// 			db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// 		}
							// 	}
							// }

							break;
						case 'model_sensor_RT1':
							dataEntity = Object.assign({}, new ModelSensorRT1Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 432
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 432,
										start_date: data.timestamp,
										status: 1
									});
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 432,
										status: 0
									});
								}
							}

							rs = await db.insert("ModelReadings.insertModelSensorRT1", dataEntity);
							// if (rs) {
							// 	// Update device 
							// 	let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
							// 	db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// }
							break;

						case 'model_techedge':
							dataEntity = Object.assign({}, new ModelTechedgeEntity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 435
							});
							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 435,
										start_date: data.timestamp,
										status: 1
									});
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 435,
										status: 0
									});
								}
							}

							rs = await db.insert("ModelReadings.insertModelTechedge", dataEntity);
							// if (rs) {
							// 	// Update device 
							// 	let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
							// 	db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// }
							break;

						case 'model_sensor_IMT_TaRS485':
							dataEntity = Object.assign({}, new ModelSensorIMTTaRS485Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 434
							});
							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 434,
										start_date: data.timestamp,
										status: 1
									});
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 434,
										status: 0
									});
								}
							}

							rs = await db.insert("ModelReadings.insertModelSensorIMTTaRS485", dataEntity);
							// if (rs) {
							// 	// Update device 
							// 	let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
							// 	db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// }
							break;
						case 'model_sensor_IMT_SiRS485':
							dataEntity = Object.assign({}, new ModelSensorIMTSiRS485Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 433
							});
							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 433,
										start_date: data.timestamp,
										status: 1
									});
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 433,
										status: 0
									});
								}
							}

							rs = await db.insert("ModelReadings.insertModelSensorIMTSiRS485", dataEntity);
							// if (rs) {
							// 	// Update device 
							// 	let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
							// 	db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// }
							break;
						case 'model_logger_SMA_IM20':
							dataEntity = Object.assign({}, new ModelLoggerSMAIM20Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 431
							});
							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 431,
										start_date: data.timestamp,
										status: 1
									});
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 431,
										status: 0
									});
								}
							}

							rs = await db.insert("ModelReadings.insertModelLoggerSMAIM20", dataEntity);
							// if (rs) {
							// 	// Update device 
							// 	let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
							// 	db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// }
							break;
						case 'model_inverter_Sungrow_SG110CX':
							break;
						case 'model_inverter_SMA_STP50':
							dataEntity = Object.assign({}, new ModelInverterSMASTP50Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 430
							});
							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 430,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.view_table
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 430,
										status: 0
									});
								}
							}

							// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterSMASTP50", dataEntity);
								// Update device 
							// 	if (rs) {
							// 		let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
							// 			id_device: getDeviceInfo.id,
							// 			table_name: getDeviceInfo.view_table
							// 		});
							// 		if (lastRowDataUpdated) {
							// 			let deviceUpdated = {
							// 				id: getDeviceInfo.id,
							// 				power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
							// 				energy_today: lastRowDataUpdated.energy_today,
							// 				last_month: lastRowDataUpdated.energy_last_month,
							// 				lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
							// 				last_updated: dataEntity.time
							// 			};
							// 			db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// 		}
							// 	}
							// }

							break;
						case 'model_inverter_SMA_SHP75':
							dataEntity = Object.assign({}, new ModelInverterSMASHP75Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 429
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 429,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.table_name
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 429,
										status: 0
									});
								}
							}
							// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterSMASHP75", dataEntity);
								// Update device 
							// 	if (rs) {
							// 		let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
							// 			id_device: getDeviceInfo.id,
							// 			table_name: getDeviceInfo.view_table
							// 		});
							// 		if (lastRowDataUpdated) {
							// 			let deviceUpdated = {
							// 				id: getDeviceInfo.id,
							// 				power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
							// 				energy_today: lastRowDataUpdated.energy_today,
							// 				last_month: lastRowDataUpdated.energy_last_month,
							// 				lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
							// 				last_updated: dataEntity.time
							// 			};
							// 			db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							// 		}
							// 	}
							// }

							break;
						case 'model_inverter_Growatt_GW80KTL3':
							break;
						case 'model_emeter_Janitza_UMG96S2':
							// dataEntity = Object.assign({}, new ModelEmeterJanitzaUMG96S2Entity(), dataPayload);
							// dataEntity.time = data.timestamp;
							// dataEntity.id_device = getDeviceInfo.id;
							// // Check status DISCONNECTED
							// checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
							// 	id_device: getDeviceInfo.id,
							// 	id_error: 427
							// });
							// if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
							// 	// Insert alert error system disconnected
							// 	if (!checkExistAlerm) {
							// 		rs = await db.insert("ModelReadings.insertAlert", {
							// 			id_device: getDeviceInfo.id,
							// 			id_error: 427,
							// 			start_date: data.timestamp,
							// 			status: 1
							// 		});
							// 	}
							// } else {
							// 	// close alarm 
							// 	if (checkExistAlerm) {
							// 		await db.delete("ModelReadings.closeAlarmDisconnected", {
							// 			id: checkExistAlerm.id,
							// 			id_device: getDeviceInfo.id,
							// 			id_error: 427,
							// 			status: 0
							// 		});
							// 	}
							// }

							// rs = await db.insert("ModelReadings.insertModelEmeterJanitzaUMG96S2", dataEntity);
							break;
					}

					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					conn.commit();
					callBack(true, rs);
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
	 * @description Insert alarm
	 * @author Long.Pham
	 * @since 12/09/2021
	 * @param {Object model} data
	 */
	insertAlarmReadings(data, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var getDeviceInfo = await db.queryForObject("ModelReadings.getDeviceInfo", data);
					if (!getDeviceInfo || Libs.isObjectEmpty(getDeviceInfo) || Libs.isBlank(getDeviceInfo.table_name) || Libs.isBlank(getDeviceInfo.id)) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					let rs = {}, checkExistAlerm = null;
					var devStatus = data.devStatus;
					var devEvent = data.devEvent;


					// Check status 
					if (!Libs.isObjectEmpty(devStatus)) {
						switch (getDeviceInfo.table_name) {
							// sent error code 
							case 'model_inverter_SMA_STP110':
							case 'model_inverter_SMA_SHP75':
							case 'model_inverter_ABB_PVS100':
							case 'model_inverter_SMA_STP50':
								// check status 1
								if (devStatus.hasOwnProperty("status1") && !Libs.isBlank(devStatus.status1)) {
									// get error id
									let objParams = { state_key: 'status1', error_code: devStatus.status1 };
									let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
									if (objError) {
										// check alert exists
										checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
										if (!checkExistAlerm) {
											// Insert alert
											rs = await db.insert("ModelReadings.insertAlert", {
												id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
											});

											//  Check sent mail
											if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
												let dataAlertSentMail = {
													error_code: objError.error_code,
													description: objError.description,
													message: objError.message,
													solutions: objError.solutions,
													error_type_name: objError.error_type_name,
													error_level_name: objError.error_level_name,
													device_name: getDeviceInfo.name,
													project_name: getDeviceInfo.project_name,
													full_name: getDeviceInfo.full_name,
													email: getDeviceInfo.email,
													error_date: getDeviceInfo.error_date
												};
												let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
												SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
											}

										}
									}
								}


								// check status 2
								if (devStatus.hasOwnProperty("status2") && !Libs.isBlank(devStatus.status2)) {
									// get error id
									let objParams = { state_key: 'status2', error_code: devStatus.status2 };
									let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
									if (objError) {
										// check alert exists
										checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
										if (!checkExistAlerm) {
											// Insert alert
											rs = await db.insert("ModelReadings.insertAlert", {
												id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
											});

											//  Check sent mail
											if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
												let dataAlertSentMail = {
													error_code: objError.error_code,
													description: objError.description,
													message: objError.message,
													solutions: objError.solutions,
													error_type_name: objError.error_type_name,
													error_level_name: objError.error_level_name,
													device_name: getDeviceInfo.name,
													project_name: getDeviceInfo.project_name,
													full_name: getDeviceInfo.full_name,
													email: getDeviceInfo.email,
													error_date: getDeviceInfo.error_date
												};
												let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
												SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
											}
										}
									}
								}

								// check status 3
								if (devStatus.hasOwnProperty("status3") && !Libs.isBlank(devStatus.status3)) {
									// get error id
									let objParams = { state_key: 'status3', error_code: devStatus.status3 };
									let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
									if (objError) {
										// check alert exists
										checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
										if (!checkExistAlerm) {
											// Insert alert
											rs = await db.insert("ModelReadings.insertAlert", {
												id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
											});

											//  Check sent mail
											if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
												let dataAlertSentMail = {
													error_code: objError.error_code,
													description: objError.description,
													message: objError.message,
													solutions: objError.solutions,
													error_type_name: objError.error_type_name,
													error_level_name: objError.error_level_name,
													device_name: getDeviceInfo.name,
													project_name: getDeviceInfo.project_name,
													full_name: getDeviceInfo.full_name,
													email: getDeviceInfo.email,
													error_date: getDeviceInfo.error_date
												};
												let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
												SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
											}

										}
									}
								}
								break;

							// case 'model_inverter_Sungrow_SG110CX':
							// 	break;

							// Sent error bit
							// case 'model_sensor_RT1':
							// 	break;

							// case 'model_sensor_IMT_SiRS485':
							// 	break;

							// case 'model_sensor_IMT_TaRS485':
							// 	break;

							// case '':
							// 	break;
							// case 'model_techedge':
							// 	break;

							// case 'model_inverter_Growatt_GW80KTL3':
							// 	break;
						}


						// check status 4
						// if (devStatus.hasOwnProperty("status4") && !Libs.isBlank(devStatus.status4)) {
						// 	// get error id
						// 	let objParams = { state_key: 'status4', error_code: devStatus.status4 };
						// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
						// 	if (objError) {
						// 		// check alert exists
						// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
						// 		if (!checkExistAlerm) {
						// 			// Insert alert
						// 			rs = await db.insert("ModelReadings.insertAlert", {
						// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
						// 			});

						// 			//  Check sent mail
						// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
						// 				let dataAlertSentMail = {
						// 					error_code: objError.error_code,
						// 					description: objError.description,
						// 					message: objError.message,
						// 					solutions: objError.solutions,
						// 					error_type_name: objError.error_type_name,
						// 					error_level_name: objError.error_level_name,
						// 					device_name: getDeviceInfo.name,
						// 					project_name: getDeviceInfo.project_name,
						// 					full_name: getDeviceInfo.full_name,
						// 					email: getDeviceInfo.email,
						// 					error_date: getDeviceInfo.error_date
						// 				};
						// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
						// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
						// 			}
						// 		}
						// 	}
						// }

						// // check status 5
						// if (devStatus.hasOwnProperty("status5") && !Libs.isBlank(devStatus.status5)) {
						// 	// get error id
						// 	let objParams = { state_key: 'status5', error_code: devStatus.status5 };
						// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
						// 	if (objError) {
						// 		// check alert exists
						// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
						// 		if (!checkExistAlerm) {
						// 			// Insert alert
						// 			rs = await db.insert("ModelReadings.insertAlert", {
						// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
						// 			});

						// 			//  Check sent mail
						// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
						// 				let dataAlertSentMail = {
						// 					error_code: objError.error_code,
						// 					description: objError.description,
						// 					message: objError.message,
						// 					solutions: objError.solutions,
						// 					error_type_name: objError.error_type_name,
						// 					error_level_name: objError.error_level_name,
						// 					device_name: getDeviceInfo.name,
						// 					project_name: getDeviceInfo.project_name,
						// 					full_name: getDeviceInfo.full_name,
						// 					email: getDeviceInfo.email,
						// 					error_date: getDeviceInfo.error_date
						// 				};
						// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
						// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
						// 			}
						// 		}
						// 	}
						// }


						// // check status 6
						// if (devStatus.hasOwnProperty("status6") && !Libs.isBlank(devStatus.status6)) {
						// 	// get error id
						// 	let objParams = { state_key: 'status6', error_code: devStatus.status6 };
						// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
						// 	if (objError) {
						// 		// check alert exists
						// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
						// 		if (!checkExistAlerm) {
						// 			// Insert alert
						// 			rs = await db.insert("ModelReadings.insertAlert", {
						// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
						// 			});
						// 		}
						// 	}
						// }


						// // check status 7
						// if (devStatus.hasOwnProperty("status7") && !Libs.isBlank(devStatus.status7)) {
						// 	// get error id
						// 	let objParams = { state_key: 'status7', error_code: devStatus.status7 };
						// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
						// 	if (objError) {
						// 		// check alert exists
						// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
						// 		if (!checkExistAlerm) {
						// 			// Insert alert
						// 			rs = await db.insert("ModelReadings.insertAlert", {
						// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
						// 			});

						// 			//  Check sent mail
						// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
						// 				let dataAlertSentMail = {
						// 					error_code: objError.error_code,
						// 					description: objError.description,
						// 					message: objError.message,
						// 					solutions: objError.solutions,
						// 					error_type_name: objError.error_type_name,
						// 					error_level_name: objError.error_level_name,
						// 					device_name: getDeviceInfo.name,
						// 					project_name: getDeviceInfo.project_name,
						// 					full_name: getDeviceInfo.full_name,
						// 					email: getDeviceInfo.email,
						// 					error_date: getDeviceInfo.error_date
						// 				};
						// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
						// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
						// 			}
						// 		}
						// 	}
						// }

					}




					// Check event 
					if (!Libs.isObjectEmpty(devEvent)) {
						switch (getDeviceInfo.table_name) {
							// sent error code 
							case 'model_inverter_SMA_STP50':
								// check event 1
								if (devEvent.hasOwnProperty("event1") && !Libs.isBlank(devEvent.event1)) {
									// get error id
									let objParams = { state_key: 'event1', error_code: devEvent.event1 };
									let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
									if (objError) {
										// check alert exists
										checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
										if (!checkExistAlerm) {
											// Insert alert
											rs = await db.insert("ModelReadings.insertAlert", {
												id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
											});

											//  Check sent mail
											if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
												let dataAlertSentMail = {
													error_code: objError.error_code,
													description: objError.description,
													message: objError.message,
													solutions: objError.solutions,
													error_type_name: objError.error_type_name,
													error_level_name: objError.error_level_name,
													device_name: getDeviceInfo.name,
													project_name: getDeviceInfo.project_name,
													full_name: getDeviceInfo.full_name,
													email: getDeviceInfo.email,
													error_date: getDeviceInfo.error_date
												};
												let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
												SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
											}
										}
									}
								}


								// check event 2
								if (devEvent.hasOwnProperty("event2") && !Libs.isBlank(devEvent.event2)) {
									// get error id
									let objParams = { state_key: 'event2', error_code: devEvent.event2 };
									let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
									if (objError) {
										// check alert exists
										checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
										if (!checkExistAlerm) {
											// Insert alert
											rs = await db.insert("ModelReadings.insertAlert", {
												id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
											});

											//  Check sent mail
											if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
												let dataAlertSentMail = {
													error_code: objError.error_code,
													description: objError.description,
													message: objError.message,
													solutions: objError.solutions,
													error_type_name: objError.error_type_name,
													error_level_name: objError.error_level_name,
													device_name: getDeviceInfo.name,
													project_name: getDeviceInfo.project_name,
													full_name: getDeviceInfo.full_name,
													email: getDeviceInfo.email,
													error_date: getDeviceInfo.error_date
												};
												let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
												SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
											}
										}
									}
								}


								// check event 3
								if (devEvent.hasOwnProperty("event3") && !Libs.isBlank(devEvent.event3)) {
									// get error id
									let objParams = { state_key: 'event3', error_code: devEvent.event3 };
									let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
									if (objError) {
										// check alert exists
										checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
										if (!checkExistAlerm) {
											// Insert alert
											rs = await db.insert("ModelReadings.insertAlert", {
												id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
											});

											//  Check sent mail
											if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
												let dataAlertSentMail = {
													error_code: objError.error_code,
													description: objError.description,
													message: objError.message,
													solutions: objError.solutions,
													error_type_name: objError.error_type_name,
													error_level_name: objError.error_level_name,
													device_name: getDeviceInfo.name,
													project_name: getDeviceInfo.project_name,
													full_name: getDeviceInfo.full_name,
													email: getDeviceInfo.email,
													error_date: getDeviceInfo.error_date
												};
												let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
												SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
											}
										}
									}
								}
								break;

							// Sent bit code
							case 'model_inverter_SMA_STP110':
							case 'model_inverter_ABB_PVS100':
							case 'model_inverter_SMA_SHP75':
								// check event 1
								if (devEvent.hasOwnProperty("event1") && !Libs.isBlank(devEvent.event1)) {
									let arrErrorCode1 = Libs.decimalToErrorCode(devEvent.event1);
									if (arrErrorCode1.length > 0) {
										let paramBit1 = {
											state_key: 'event1',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode1
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit1);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}


								// check event 2
								if (devEvent.hasOwnProperty("event2") && !Libs.isBlank(devEvent.event2)) {
									let arrErrorCode2 = Libs.decimalToErrorCode(devEvent.event2);
									if (arrErrorCode2.length > 0) {
										let paramBit2 = {
											state_key: 'event2',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode2
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit2);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}


								// check event 3
								if (devEvent.hasOwnProperty("event3") && !Libs.isBlank(devEvent.event3)) {
									let arrErrorCode3 = Libs.decimalToErrorCode(devEvent.event3);
									if (arrErrorCode3.length > 0) {
										let paramBit3 = {
											state_key: 'event3',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode3
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit3);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}


								// check event 4
								if (devEvent.hasOwnProperty("event4") && !Libs.isBlank(devEvent.event4)) {
									let arrErrorCode4 = Libs.decimalToErrorCode(devEvent.event4);
									if (arrErrorCode4.length > 0) {
										let paramBit4 = {
											state_key: 'event4',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode4
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit4);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}


								// check event 5
								if (devEvent.hasOwnProperty("event5") && !Libs.isBlank(devEvent.event5)) {
									let arrErrorCode5 = Libs.decimalToErrorCode(devEvent.event5);
									if (arrErrorCode5.length > 0) {
										let paramBit5 = {
											state_key: 'event5',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode5
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit5);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}


								// check event 6
								if (devEvent.hasOwnProperty("event6") && !Libs.isBlank(devEvent.event6)) {
									let arrErrorCode6 = Libs.decimalToErrorCode(devEvent.event6);
									if (arrErrorCode6.length > 0) {
										let paramBit6 = {
											state_key: 'event6',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode6
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit6);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}



								// check event 7
								if (devEvent.hasOwnProperty("event7") && !Libs.isBlank(devEvent.event7)) {
									let arrErrorCode7 = Libs.decimalToErrorCode(devEvent.event7);
									if (arrErrorCode7.length > 0) {
										let paramBit7 = {
											state_key: 'event7',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode7
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit7);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}



								// check event 8
								if (devEvent.hasOwnProperty("event8") && !Libs.isBlank(devEvent.event8)) {
									let arrErrorCode8 = Libs.decimalToErrorCode(devEvent.event8);
									if (arrErrorCode8.length > 0) {
										let paramBit8 = {
											state_key: 'event8',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode8
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit8);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}


								// check event 9
								if (devEvent.hasOwnProperty("event9") && !Libs.isBlank(devEvent.event9)) {
									let arrErrorCode9 = Libs.decimalToErrorCode(devEvent.event9);
									if (arrErrorCode9.length > 0) {
										let paramBit9 = {
											state_key: 'event9',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode9
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit9);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}


								// check event 10
								if (devEvent.hasOwnProperty("event10") && !Libs.isBlank(devEvent.event10)) {
									let arrErrorCode10 = Libs.decimalToErrorCode(devEvent.event10);
									if (arrErrorCode10.length > 0) {
										let paramBit10 = {
											state_key: 'event10',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode10
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit10);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}



								// check event 11
								if (devEvent.hasOwnProperty("event11") && !Libs.isBlank(devEvent.event11)) {
									let arrErrorCode11 = Libs.decimalToErrorCode(devEvent.event11);
									if (arrErrorCode11.length > 0) {
										let paramBit11 = {
											state_key: 'event11',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode11
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit11);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}


								// check event 12
								if (devEvent.hasOwnProperty("event12") && !Libs.isBlank(devEvent.event12)) {
									let arrErrorCode12 = Libs.decimalToErrorCode(devEvent.event12);
									if (arrErrorCode12.length > 0) {
										let paramBit12 = {
											state_key: 'event12',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode12
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit12);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}


								// check event 13
								if (devEvent.hasOwnProperty("event13") && !Libs.isBlank(devEvent.event13)) {
									let arrErrorCode13 = Libs.decimalToErrorCode(devEvent.event13);
									if (arrErrorCode13.length > 0) {
										let paramBit13 = {
											state_key: 'event13',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode13
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit13);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}



								// check event 14
								if (devEvent.hasOwnProperty("event14") && !Libs.isBlank(devEvent.event14)) {
									let arrErrorCode14 = Libs.decimalToErrorCode(devEvent.event14);
									if (arrErrorCode14.length > 0) {
										let paramBit14 = {
											state_key: 'event14',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode14
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit14);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}


								// check event 15
								if (devEvent.hasOwnProperty("event15") && !Libs.isBlank(devEvent.event15)) {
									let arrErrorCode15 = Libs.decimalToErrorCode(devEvent.event15);
									if (arrErrorCode15.length > 0) {
										let paramBit15 = {
											state_key: 'event15',
											id_device_group: getDeviceInfo.id_device_group,
											arrErrorCode: arrErrorCode15
										};

										// Lay danh sach loi tren he thong
										let arrError = await db.queryForList("ModelReadings.getListError", paramBit15);
										if (arrError.length > 0) {
											for (let i = 0; i < arrError.length; i++) {
												checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
													id_device: getDeviceInfo.id,
													id_error: arrError[i].id
												});

												if (!checkExistAlerm) {
													// Insert alert
													db.insert("ModelReadings.insertAlert", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id,
														start_date: data.timestamp,
														status: 1
													});

													//  Check sent mail
													if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
														let dataAlertSentMail = {
															error_code: arrError[i].error_code,
															description: arrError[i].description,
															message: arrError[i].message,
															solutions: arrError[i].solutions,
															error_type_name: arrError[i].error_type_name,
															error_level_name: arrError[i].error_level_name,
															device_name: getDeviceInfo.name,
															project_name: getDeviceInfo.project_name,
															full_name: getDeviceInfo.full_name,
															email: getDeviceInfo.email,
															error_date: getDeviceInfo.error_date
														};

														let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
														SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
													}
												}
											}
										}
									}
								}



								break;

							// Sent error bit
							// case 'model_sensor_RT1':
							// 	break;

							// case 'model_sensor_IMT_SiRS485':
							// 	break;

							// case 'model_sensor_IMT_TaRS485':
							// 	break;

							// case '':
							// 	break;
							// case 'model_techedge':
							// 	break;

							// case 'model_inverter_Growatt_GW80KTL3':
							// 	break;
						}




						// // check event 4
						// if (devEvent.hasOwnProperty("event4") && !Libs.isBlank(devEvent.event4)) {
						// 	// get error id
						// 	let objParams = { state_key: 'event4', error_code: devEvent.event4 };
						// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
						// 	if (objError) {
						// 		// check alert exists
						// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
						// 		if (!checkExistAlerm) {
						// 			// Insert alert
						// 			rs = await db.insert("ModelReadings.insertAlert", {
						// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
						// 			});

						// 			//  Check sent mail
						// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
						// 				let dataAlertSentMail = {
						// 					error_code: objError.error_code,
						// 					description: objError.description,
						// 					message: objError.message,
						// 					solutions: objError.solutions,
						// 					error_type_name: objError.error_type_name,
						// 					error_level_name: objError.error_level_name,
						// 					device_name: getDeviceInfo.name,
						// 					project_name: getDeviceInfo.project_name,
						// 					full_name: getDeviceInfo.full_name,
						// 					email: getDeviceInfo.email,
						// 					error_date: getDeviceInfo.error_date
						// 				};
						// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
						// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
						// 			}

						// 		}
						// 	}
						// }


						// // check event 5
						// if (devEvent.hasOwnProperty("event5") && !Libs.isBlank(devEvent.event5)) {
						// 	// get error id
						// 	let objParams = { state_key: 'event5', error_code: devEvent.event5 };
						// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
						// 	if (objError) {
						// 		// check alert exists
						// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
						// 		if (!checkExistAlerm) {
						// 			// Insert alert
						// 			rs = await db.insert("ModelReadings.insertAlert", {
						// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
						// 			});

						// 			//  Check sent mail
						// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
						// 				let dataAlertSentMail = {
						// 					error_code: objError.error_code,
						// 					description: objError.description,
						// 					message: objError.message,
						// 					solutions: objError.solutions,
						// 					error_type_name: objError.error_type_name,
						// 					error_level_name: objError.error_level_name,
						// 					device_name: getDeviceInfo.name,
						// 					project_name: getDeviceInfo.project_name,
						// 					full_name: getDeviceInfo.full_name,
						// 					email: getDeviceInfo.email,
						// 					error_date: getDeviceInfo.error_date
						// 				};
						// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
						// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
						// 			}
						// 		}
						// 	}
						// }


						// // check event 6
						// if (devEvent.hasOwnProperty("event6") && !Libs.isBlank(devEvent.event6)) {
						// 	// get error id
						// 	let objParams = { state_key: 'event6', error_code: devEvent.event6 };
						// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
						// 	if (objError) {
						// 		// check alert exists
						// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
						// 		if (!checkExistAlerm) {
						// 			// Insert alert
						// 			rs = await db.insert("ModelReadings.insertAlert", {
						// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
						// 			});

						// 			//  Check sent mail
						// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
						// 				let dataAlertSentMail = {
						// 					error_code: objError.error_code,
						// 					description: objError.description,
						// 					message: objError.message,
						// 					solutions: objError.solutions,
						// 					error_type_name: objError.error_type_name,
						// 					error_level_name: objError.error_level_name,
						// 					device_name: getDeviceInfo.name,
						// 					project_name: getDeviceInfo.project_name,
						// 					full_name: getDeviceInfo.full_name,
						// 					email: getDeviceInfo.email,
						// 					error_date: getDeviceInfo.error_date
						// 				};
						// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
						// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
						// 			}
						// 		}
						// 	}
						// }

						// // check event 7
						// if (devEvent.hasOwnProperty("event7") && !Libs.isBlank(devEvent.event7)) {
						// 	// get error id
						// 	let objParams = { state_key: 'event7', error_code: devEvent.event7 };
						// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
						// 	if (objError) {
						// 		// check alert exists
						// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
						// 		if (!checkExistAlerm) {
						// 			// Insert alert
						// 			rs = await db.insert("ModelReadings.insertAlert", {
						// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
						// 			});

						// 			//  Check sent mail
						// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
						// 				let dataAlertSentMail = {
						// 					error_code: objError.error_code,
						// 					description: objError.description,
						// 					message: objError.message,
						// 					solutions: objError.solutions,
						// 					error_type_name: objError.error_type_name,
						// 					error_level_name: objError.error_level_name,
						// 					device_name: getDeviceInfo.name,
						// 					project_name: getDeviceInfo.project_name,
						// 					full_name: getDeviceInfo.full_name,
						// 					email: getDeviceInfo.email,
						// 					error_date: getDeviceInfo.error_date
						// 				};
						// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
						// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
						// 			}
						// 		}
						// 	}
						// }

						// // check event 8
						// if (devEvent.hasOwnProperty("event8") && !Libs.isBlank(devEvent.event8)) {
						// 	// get error id
						// 	let objParams = { state_key: 'event8', error_code: devEvent.event8 };
						// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
						// 	if (objError) {
						// 		// check alert exists
						// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
						// 		if (!checkExistAlerm) {
						// 			// Insert alert
						// 			rs = await db.insert("ModelReadings.insertAlert", {
						// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
						// 			});

						// 			//  Check sent mail
						// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
						// 				let dataAlertSentMail = {
						// 					error_code: objError.error_code,
						// 					description: objError.description,
						// 					message: objError.message,
						// 					solutions: objError.solutions,
						// 					error_type_name: objError.error_type_name,
						// 					error_level_name: objError.error_level_name,
						// 					device_name: getDeviceInfo.name,
						// 					project_name: getDeviceInfo.project_name,
						// 					full_name: getDeviceInfo.full_name,
						// 					email: getDeviceInfo.email,
						// 					error_date: getDeviceInfo.error_date
						// 				};
						// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
						// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
						// 			}
						// 		}
						// 	}
						// }
					}

					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					conn.commit();
					callBack(true, rs);
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

}
export default DataReadingsService;
