'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require('./BaseService');

var _BaseService3 = _interopRequireDefault(_BaseService2);

var _ModelSensorRT1Entity = require('../entities/ModelSensorRT1Entity');

var _ModelSensorRT1Entity2 = _interopRequireDefault(_ModelSensorRT1Entity);

var _ModelSensorIMTTaRS485Entity = require('../entities/ModelSensorIMTTaRS485Entity');

var _ModelSensorIMTTaRS485Entity2 = _interopRequireDefault(_ModelSensorIMTTaRS485Entity);

var _ModelSensorIMTSiRS485Entity = require('../entities/ModelSensorIMTSiRS485Entity');

var _ModelSensorIMTSiRS485Entity2 = _interopRequireDefault(_ModelSensorIMTSiRS485Entity);

var _ModelLoggerSMAIM20Entity = require('../entities/ModelLoggerSMAIM20Entity');

var _ModelLoggerSMAIM20Entity2 = _interopRequireDefault(_ModelLoggerSMAIM20Entity);

var _ModelInverterSungrowSG110CXEntity = require('../entities/ModelInverterSungrowSG110CXEntity');

var _ModelInverterSungrowSG110CXEntity2 = _interopRequireDefault(_ModelInverterSungrowSG110CXEntity);

var _ModelInverterSMASTP50Entity = require('../entities/ModelInverterSMASTP50Entity');

var _ModelInverterSMASTP50Entity2 = _interopRequireDefault(_ModelInverterSMASTP50Entity);

var _ModelInverterSMASHP75Entity = require('../entities/ModelInverterSMASHP75Entity');

var _ModelInverterSMASHP75Entity2 = _interopRequireDefault(_ModelInverterSMASHP75Entity);

var _ModelInverterGrowattGW80KTL3Entity = require('../entities/ModelInverterGrowattGW80KTL3Entity');

var _ModelInverterGrowattGW80KTL3Entity2 = _interopRequireDefault(_ModelInverterGrowattGW80KTL3Entity);

var _ModelInverterABBPVS100Entity = require('../entities/ModelInverterABBPVS100Entity');

var _ModelInverterABBPVS100Entity2 = _interopRequireDefault(_ModelInverterABBPVS100Entity);

var _ModelEmeterJanitzaUMG96S2Entity = require('../entities/ModelEmeterJanitzaUMG96S2Entity');

var _ModelEmeterJanitzaUMG96S2Entity2 = _interopRequireDefault(_ModelEmeterJanitzaUMG96S2Entity);

var _ModelTechedgeEntity = require('../entities/ModelTechedgeEntity');

var _ModelTechedgeEntity2 = _interopRequireDefault(_ModelTechedgeEntity);

var _ModelInverterSMASTP110Entity = require('../entities/ModelInverterSMASTP110Entity');

var _ModelInverterSMASTP110Entity2 = _interopRequireDefault(_ModelInverterSMASTP110Entity);

var _ModelEmeterVinasinoVSE3T5Entity = require('../entities/ModelEmeterVinasinoVSE3T5Entity');

var _ModelEmeterVinasinoVSE3T5Entity2 = _interopRequireDefault(_ModelEmeterVinasinoVSE3T5Entity);

var _ModelEmeterGelexEmicME41Entity = require('../entities/ModelEmeterGelexEmicME41Entity');

var _ModelEmeterGelexEmicME41Entity2 = _interopRequireDefault(_ModelEmeterGelexEmicME41Entity);

var _ModelEmeterVinasinoVSE3T52023Entity = require('../entities/ModelEmeterVinasinoVSE3T52023Entity');

var _ModelEmeterVinasinoVSE3T52023Entity2 = _interopRequireDefault(_ModelEmeterVinasinoVSE3T52023Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataReadingsService = function (_BaseService) {
	_inherits(DataReadingsService, _BaseService);

	function DataReadingsService() {
		_classCallCheck(this, DataReadingsService);

		return _possibleConstructorReturn(this, (DataReadingsService.__proto__ || Object.getPrototypeOf(DataReadingsService)).call(this));
	}

	/**
  * @description Insert data
  * @author Long.Pham
  * @since 10/09/2021
  * @param {Object model} data
  */


	_createClass(DataReadingsService, [{
		key: 'insertDataReadings',
		value: function insertDataReadings(data, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var dataPayload = data.payload;
						if (!Libs.isObjectEmpty(dataPayload)) {
							Object.keys(dataPayload).forEach(function (el) {
								dataPayload[el] = dataPayload[el] == '\x00' || dataPayload[el] == '' ? null : dataPayload[el];
							});
						}

						var getDeviceInfo = await db.queryForObject("ModelReadings.getDeviceInfo", data);
						if (Libs.isObjectEmpty(dataPayload) || !getDeviceInfo || Libs.isObjectEmpty(getDeviceInfo) || Libs.isBlank(getDeviceInfo.table_name) || Libs.isBlank(getDeviceInfo.id)) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						var dataEntity = {},
						    rs = {},
						    checkExistAlerm = null;
						switch (getDeviceInfo.table_name) {

							case 'model_emeter_GelexEmic_ME41':
								dataEntity = Object.assign({}, new _ModelEmeterGelexEmicME41Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelEmeterVinasinoVSE3T5Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelEmeterVinasinoVSE3T52023Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelInverterSMASTP110Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelInverterABBPVS100Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelSensorRT1Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelTechedgeEntity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelSensorIMTTaRS485Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelSensorIMTSiRS485Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelLoggerSMAIM20Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelInverterSMASTP50Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelInverterSMASHP75Entity2.default(), dataPayload);
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

	}, {
		key: 'insertAlarmReadings',
		value: function insertAlarmReadings(data, callBack) {
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

						var rs = {},
						    checkExistAlerm = null;
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
										var objParams = { state_key: 'status1', error_code: devStatus.status1 };
										var objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
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
													var dataAlertSentMail = {
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
													var html = reportRender.render("alert/mail_alert", dataAlertSentMail);
													SentMail.SentMailHTML(null, dataAlertSentMail.email, 'Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name, html);
												}
											}
										}
									}

									// check status 2
									if (devStatus.hasOwnProperty("status2") && !Libs.isBlank(devStatus.status2)) {
										// get error id
										var _objParams = { state_key: 'status2', error_code: devStatus.status2 };
										var _objError = await db.queryForObject("ModelReadings.getErrorInfo", _objParams);
										if (_objError) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: _objError.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: _objError.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(_objError.id_error_level) && _objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var _dataAlertSentMail = {
														error_code: _objError.error_code,
														description: _objError.description,
														message: _objError.message,
														solutions: _objError.solutions,
														error_type_name: _objError.error_type_name,
														error_level_name: _objError.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var _html = reportRender.render("alert/mail_alert", _dataAlertSentMail);
													SentMail.SentMailHTML(null, _dataAlertSentMail.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail.project_name, _html);
												}
											}
										}
									}

									// check status 3
									if (devStatus.hasOwnProperty("status3") && !Libs.isBlank(devStatus.status3)) {
										// get error id
										var _objParams2 = { state_key: 'status3', error_code: devStatus.status3 };
										var _objError2 = await db.queryForObject("ModelReadings.getErrorInfo", _objParams2);
										if (_objError2) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: _objError2.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: _objError2.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(_objError2.id_error_level) && _objError2.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var _dataAlertSentMail2 = {
														error_code: _objError2.error_code,
														description: _objError2.description,
														message: _objError2.message,
														solutions: _objError2.solutions,
														error_type_name: _objError2.error_type_name,
														error_level_name: _objError2.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var _html2 = reportRender.render("alert/mail_alert", _dataAlertSentMail2);
													SentMail.SentMailHTML(null, _dataAlertSentMail2.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail2.project_name, _html2);
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
										var _objParams3 = { state_key: 'event1', error_code: devEvent.event1 };
										var _objError3 = await db.queryForObject("ModelReadings.getErrorInfo", _objParams3);
										if (_objError3) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: _objError3.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: _objError3.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(_objError3.id_error_level) && _objError3.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var _dataAlertSentMail3 = {
														error_code: _objError3.error_code,
														description: _objError3.description,
														message: _objError3.message,
														solutions: _objError3.solutions,
														error_type_name: _objError3.error_type_name,
														error_level_name: _objError3.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var _html3 = reportRender.render("alert/mail_alert", _dataAlertSentMail3);
													SentMail.SentMailHTML(null, _dataAlertSentMail3.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail3.project_name, _html3);
												}
											}
										}
									}

									// check event 2
									if (devEvent.hasOwnProperty("event2") && !Libs.isBlank(devEvent.event2)) {
										// get error id
										var _objParams4 = { state_key: 'event2', error_code: devEvent.event2 };
										var _objError4 = await db.queryForObject("ModelReadings.getErrorInfo", _objParams4);
										if (_objError4) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: _objError4.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: _objError4.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(_objError4.id_error_level) && _objError4.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var _dataAlertSentMail4 = {
														error_code: _objError4.error_code,
														description: _objError4.description,
														message: _objError4.message,
														solutions: _objError4.solutions,
														error_type_name: _objError4.error_type_name,
														error_level_name: _objError4.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var _html4 = reportRender.render("alert/mail_alert", _dataAlertSentMail4);
													SentMail.SentMailHTML(null, _dataAlertSentMail4.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail4.project_name, _html4);
												}
											}
										}
									}

									// check event 3
									if (devEvent.hasOwnProperty("event3") && !Libs.isBlank(devEvent.event3)) {
										// get error id
										var _objParams5 = { state_key: 'event3', error_code: devEvent.event3 };
										var _objError5 = await db.queryForObject("ModelReadings.getErrorInfo", _objParams5);
										if (_objError5) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: _objError5.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: _objError5.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(_objError5.id_error_level) && _objError5.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var _dataAlertSentMail5 = {
														error_code: _objError5.error_code,
														description: _objError5.description,
														message: _objError5.message,
														solutions: _objError5.solutions,
														error_type_name: _objError5.error_type_name,
														error_level_name: _objError5.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var _html5 = reportRender.render("alert/mail_alert", _dataAlertSentMail5);
													SentMail.SentMailHTML(null, _dataAlertSentMail5.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail5.project_name, _html5);
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
										var arrErrorCode1 = Libs.decimalToErrorCode(devEvent.event1);
										if (arrErrorCode1.length > 0) {
											var paramBit1 = {
												state_key: 'event1',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode1
											};

											// Lay danh sach loi tren he thong
											var arrError = await db.queryForList("ModelReadings.getListError", paramBit1);
											if (arrError.length > 0) {
												for (var i = 0; i < arrError.length; i++) {
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
															var _dataAlertSentMail6 = {
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

															var _html6 = reportRender.render("alert/mail_alert", _dataAlertSentMail6);
															SentMail.SentMailHTML(null, _dataAlertSentMail6.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail6.project_name, _html6);
														}
													}
												}
											}
										}
									}

									// check event 2
									if (devEvent.hasOwnProperty("event2") && !Libs.isBlank(devEvent.event2)) {
										var arrErrorCode2 = Libs.decimalToErrorCode(devEvent.event2);
										if (arrErrorCode2.length > 0) {
											var paramBit2 = {
												state_key: 'event2',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode2
											};

											// Lay danh sach loi tren he thong
											var _arrError = await db.queryForList("ModelReadings.getListError", paramBit2);
											if (_arrError.length > 0) {
												for (var _i = 0; _i < _arrError.length; _i++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError[_i].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError[_i].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError[_i].id_error_level) && _arrError[_i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail7 = {
																error_code: _arrError[_i].error_code,
																description: _arrError[_i].description,
																message: _arrError[_i].message,
																solutions: _arrError[_i].solutions,
																error_type_name: _arrError[_i].error_type_name,
																error_level_name: _arrError[_i].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html7 = reportRender.render("alert/mail_alert", _dataAlertSentMail7);
															SentMail.SentMailHTML(null, _dataAlertSentMail7.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail7.project_name, _html7);
														}
													}
												}
											}
										}
									}

									// check event 3
									if (devEvent.hasOwnProperty("event3") && !Libs.isBlank(devEvent.event3)) {
										var arrErrorCode3 = Libs.decimalToErrorCode(devEvent.event3);
										if (arrErrorCode3.length > 0) {
											var paramBit3 = {
												state_key: 'event3',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode3
											};

											// Lay danh sach loi tren he thong
											var _arrError2 = await db.queryForList("ModelReadings.getListError", paramBit3);
											if (_arrError2.length > 0) {
												for (var _i2 = 0; _i2 < _arrError2.length; _i2++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError2[_i2].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError2[_i2].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError2[_i2].id_error_level) && _arrError2[_i2].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail8 = {
																error_code: _arrError2[_i2].error_code,
																description: _arrError2[_i2].description,
																message: _arrError2[_i2].message,
																solutions: _arrError2[_i2].solutions,
																error_type_name: _arrError2[_i2].error_type_name,
																error_level_name: _arrError2[_i2].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html8 = reportRender.render("alert/mail_alert", _dataAlertSentMail8);
															SentMail.SentMailHTML(null, _dataAlertSentMail8.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail8.project_name, _html8);
														}
													}
												}
											}
										}
									}

									// check event 4
									if (devEvent.hasOwnProperty("event4") && !Libs.isBlank(devEvent.event4)) {
										var arrErrorCode4 = Libs.decimalToErrorCode(devEvent.event4);
										if (arrErrorCode4.length > 0) {
											var paramBit4 = {
												state_key: 'event4',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode4
											};

											// Lay danh sach loi tren he thong
											var _arrError3 = await db.queryForList("ModelReadings.getListError", paramBit4);
											if (_arrError3.length > 0) {
												for (var _i3 = 0; _i3 < _arrError3.length; _i3++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError3[_i3].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError3[_i3].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError3[_i3].id_error_level) && _arrError3[_i3].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail9 = {
																error_code: _arrError3[_i3].error_code,
																description: _arrError3[_i3].description,
																message: _arrError3[_i3].message,
																solutions: _arrError3[_i3].solutions,
																error_type_name: _arrError3[_i3].error_type_name,
																error_level_name: _arrError3[_i3].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html9 = reportRender.render("alert/mail_alert", _dataAlertSentMail9);
															SentMail.SentMailHTML(null, _dataAlertSentMail9.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail9.project_name, _html9);
														}
													}
												}
											}
										}
									}

									// check event 5
									if (devEvent.hasOwnProperty("event5") && !Libs.isBlank(devEvent.event5)) {
										var arrErrorCode5 = Libs.decimalToErrorCode(devEvent.event5);
										if (arrErrorCode5.length > 0) {
											var paramBit5 = {
												state_key: 'event5',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode5
											};

											// Lay danh sach loi tren he thong
											var _arrError4 = await db.queryForList("ModelReadings.getListError", paramBit5);
											if (_arrError4.length > 0) {
												for (var _i4 = 0; _i4 < _arrError4.length; _i4++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError4[_i4].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError4[_i4].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError4[_i4].id_error_level) && _arrError4[_i4].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail10 = {
																error_code: _arrError4[_i4].error_code,
																description: _arrError4[_i4].description,
																message: _arrError4[_i4].message,
																solutions: _arrError4[_i4].solutions,
																error_type_name: _arrError4[_i4].error_type_name,
																error_level_name: _arrError4[_i4].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html10 = reportRender.render("alert/mail_alert", _dataAlertSentMail10);
															SentMail.SentMailHTML(null, _dataAlertSentMail10.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail10.project_name, _html10);
														}
													}
												}
											}
										}
									}

									// check event 6
									if (devEvent.hasOwnProperty("event6") && !Libs.isBlank(devEvent.event6)) {
										var arrErrorCode6 = Libs.decimalToErrorCode(devEvent.event6);
										if (arrErrorCode6.length > 0) {
											var paramBit6 = {
												state_key: 'event6',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode6
											};

											// Lay danh sach loi tren he thong
											var _arrError5 = await db.queryForList("ModelReadings.getListError", paramBit6);
											if (_arrError5.length > 0) {
												for (var _i5 = 0; _i5 < _arrError5.length; _i5++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError5[_i5].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError5[_i5].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError5[_i5].id_error_level) && _arrError5[_i5].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail11 = {
																error_code: _arrError5[_i5].error_code,
																description: _arrError5[_i5].description,
																message: _arrError5[_i5].message,
																solutions: _arrError5[_i5].solutions,
																error_type_name: _arrError5[_i5].error_type_name,
																error_level_name: _arrError5[_i5].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html11 = reportRender.render("alert/mail_alert", _dataAlertSentMail11);
															SentMail.SentMailHTML(null, _dataAlertSentMail11.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail11.project_name, _html11);
														}
													}
												}
											}
										}
									}

									// check event 7
									if (devEvent.hasOwnProperty("event7") && !Libs.isBlank(devEvent.event7)) {
										var arrErrorCode7 = Libs.decimalToErrorCode(devEvent.event7);
										if (arrErrorCode7.length > 0) {
											var paramBit7 = {
												state_key: 'event7',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode7
											};

											// Lay danh sach loi tren he thong
											var _arrError6 = await db.queryForList("ModelReadings.getListError", paramBit7);
											if (_arrError6.length > 0) {
												for (var _i6 = 0; _i6 < _arrError6.length; _i6++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError6[_i6].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError6[_i6].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError6[_i6].id_error_level) && _arrError6[_i6].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail12 = {
																error_code: _arrError6[_i6].error_code,
																description: _arrError6[_i6].description,
																message: _arrError6[_i6].message,
																solutions: _arrError6[_i6].solutions,
																error_type_name: _arrError6[_i6].error_type_name,
																error_level_name: _arrError6[_i6].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html12 = reportRender.render("alert/mail_alert", _dataAlertSentMail12);
															SentMail.SentMailHTML(null, _dataAlertSentMail12.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail12.project_name, _html12);
														}
													}
												}
											}
										}
									}

									// check event 8
									if (devEvent.hasOwnProperty("event8") && !Libs.isBlank(devEvent.event8)) {
										var arrErrorCode8 = Libs.decimalToErrorCode(devEvent.event8);
										if (arrErrorCode8.length > 0) {
											var paramBit8 = {
												state_key: 'event8',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode8
											};

											// Lay danh sach loi tren he thong
											var _arrError7 = await db.queryForList("ModelReadings.getListError", paramBit8);
											if (_arrError7.length > 0) {
												for (var _i7 = 0; _i7 < _arrError7.length; _i7++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError7[_i7].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError7[_i7].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError7[_i7].id_error_level) && _arrError7[_i7].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail13 = {
																error_code: _arrError7[_i7].error_code,
																description: _arrError7[_i7].description,
																message: _arrError7[_i7].message,
																solutions: _arrError7[_i7].solutions,
																error_type_name: _arrError7[_i7].error_type_name,
																error_level_name: _arrError7[_i7].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html13 = reportRender.render("alert/mail_alert", _dataAlertSentMail13);
															SentMail.SentMailHTML(null, _dataAlertSentMail13.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail13.project_name, _html13);
														}
													}
												}
											}
										}
									}

									// check event 9
									if (devEvent.hasOwnProperty("event9") && !Libs.isBlank(devEvent.event9)) {
										var arrErrorCode9 = Libs.decimalToErrorCode(devEvent.event9);
										if (arrErrorCode9.length > 0) {
											var paramBit9 = {
												state_key: 'event9',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode9
											};

											// Lay danh sach loi tren he thong
											var _arrError8 = await db.queryForList("ModelReadings.getListError", paramBit9);
											if (_arrError8.length > 0) {
												for (var _i8 = 0; _i8 < _arrError8.length; _i8++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError8[_i8].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError8[_i8].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError8[_i8].id_error_level) && _arrError8[_i8].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail14 = {
																error_code: _arrError8[_i8].error_code,
																description: _arrError8[_i8].description,
																message: _arrError8[_i8].message,
																solutions: _arrError8[_i8].solutions,
																error_type_name: _arrError8[_i8].error_type_name,
																error_level_name: _arrError8[_i8].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html14 = reportRender.render("alert/mail_alert", _dataAlertSentMail14);
															SentMail.SentMailHTML(null, _dataAlertSentMail14.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail14.project_name, _html14);
														}
													}
												}
											}
										}
									}

									// check event 10
									if (devEvent.hasOwnProperty("event10") && !Libs.isBlank(devEvent.event10)) {
										var arrErrorCode10 = Libs.decimalToErrorCode(devEvent.event10);
										if (arrErrorCode10.length > 0) {
											var paramBit10 = {
												state_key: 'event10',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode10
											};

											// Lay danh sach loi tren he thong
											var _arrError9 = await db.queryForList("ModelReadings.getListError", paramBit10);
											if (_arrError9.length > 0) {
												for (var _i9 = 0; _i9 < _arrError9.length; _i9++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError9[_i9].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError9[_i9].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError9[_i9].id_error_level) && _arrError9[_i9].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail15 = {
																error_code: _arrError9[_i9].error_code,
																description: _arrError9[_i9].description,
																message: _arrError9[_i9].message,
																solutions: _arrError9[_i9].solutions,
																error_type_name: _arrError9[_i9].error_type_name,
																error_level_name: _arrError9[_i9].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html15 = reportRender.render("alert/mail_alert", _dataAlertSentMail15);
															SentMail.SentMailHTML(null, _dataAlertSentMail15.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail15.project_name, _html15);
														}
													}
												}
											}
										}
									}

									// check event 11
									if (devEvent.hasOwnProperty("event11") && !Libs.isBlank(devEvent.event11)) {
										var arrErrorCode11 = Libs.decimalToErrorCode(devEvent.event11);
										if (arrErrorCode11.length > 0) {
											var paramBit11 = {
												state_key: 'event11',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode11
											};

											// Lay danh sach loi tren he thong
											var _arrError10 = await db.queryForList("ModelReadings.getListError", paramBit11);
											if (_arrError10.length > 0) {
												for (var _i10 = 0; _i10 < _arrError10.length; _i10++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError10[_i10].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError10[_i10].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError10[_i10].id_error_level) && _arrError10[_i10].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail16 = {
																error_code: _arrError10[_i10].error_code,
																description: _arrError10[_i10].description,
																message: _arrError10[_i10].message,
																solutions: _arrError10[_i10].solutions,
																error_type_name: _arrError10[_i10].error_type_name,
																error_level_name: _arrError10[_i10].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html16 = reportRender.render("alert/mail_alert", _dataAlertSentMail16);
															SentMail.SentMailHTML(null, _dataAlertSentMail16.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail16.project_name, _html16);
														}
													}
												}
											}
										}
									}

									// check event 12
									if (devEvent.hasOwnProperty("event12") && !Libs.isBlank(devEvent.event12)) {
										var arrErrorCode12 = Libs.decimalToErrorCode(devEvent.event12);
										if (arrErrorCode12.length > 0) {
											var paramBit12 = {
												state_key: 'event12',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode12
											};

											// Lay danh sach loi tren he thong
											var _arrError11 = await db.queryForList("ModelReadings.getListError", paramBit12);
											if (_arrError11.length > 0) {
												for (var _i11 = 0; _i11 < _arrError11.length; _i11++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError11[_i11].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError11[_i11].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError11[_i11].id_error_level) && _arrError11[_i11].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail17 = {
																error_code: _arrError11[_i11].error_code,
																description: _arrError11[_i11].description,
																message: _arrError11[_i11].message,
																solutions: _arrError11[_i11].solutions,
																error_type_name: _arrError11[_i11].error_type_name,
																error_level_name: _arrError11[_i11].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html17 = reportRender.render("alert/mail_alert", _dataAlertSentMail17);
															SentMail.SentMailHTML(null, _dataAlertSentMail17.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail17.project_name, _html17);
														}
													}
												}
											}
										}
									}

									// check event 13
									if (devEvent.hasOwnProperty("event13") && !Libs.isBlank(devEvent.event13)) {
										var arrErrorCode13 = Libs.decimalToErrorCode(devEvent.event13);
										if (arrErrorCode13.length > 0) {
											var paramBit13 = {
												state_key: 'event13',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode13
											};

											// Lay danh sach loi tren he thong
											var _arrError12 = await db.queryForList("ModelReadings.getListError", paramBit13);
											if (_arrError12.length > 0) {
												for (var _i12 = 0; _i12 < _arrError12.length; _i12++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError12[_i12].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError12[_i12].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError12[_i12].id_error_level) && _arrError12[_i12].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail18 = {
																error_code: _arrError12[_i12].error_code,
																description: _arrError12[_i12].description,
																message: _arrError12[_i12].message,
																solutions: _arrError12[_i12].solutions,
																error_type_name: _arrError12[_i12].error_type_name,
																error_level_name: _arrError12[_i12].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html18 = reportRender.render("alert/mail_alert", _dataAlertSentMail18);
															SentMail.SentMailHTML(null, _dataAlertSentMail18.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail18.project_name, _html18);
														}
													}
												}
											}
										}
									}

									// check event 14
									if (devEvent.hasOwnProperty("event14") && !Libs.isBlank(devEvent.event14)) {
										var arrErrorCode14 = Libs.decimalToErrorCode(devEvent.event14);
										if (arrErrorCode14.length > 0) {
											var paramBit14 = {
												state_key: 'event14',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode14
											};

											// Lay danh sach loi tren he thong
											var _arrError13 = await db.queryForList("ModelReadings.getListError", paramBit14);
											if (_arrError13.length > 0) {
												for (var _i13 = 0; _i13 < _arrError13.length; _i13++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError13[_i13].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError13[_i13].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError13[_i13].id_error_level) && _arrError13[_i13].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail19 = {
																error_code: _arrError13[_i13].error_code,
																description: _arrError13[_i13].description,
																message: _arrError13[_i13].message,
																solutions: _arrError13[_i13].solutions,
																error_type_name: _arrError13[_i13].error_type_name,
																error_level_name: _arrError13[_i13].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html19 = reportRender.render("alert/mail_alert", _dataAlertSentMail19);
															SentMail.SentMailHTML(null, _dataAlertSentMail19.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail19.project_name, _html19);
														}
													}
												}
											}
										}
									}

									// check event 15
									if (devEvent.hasOwnProperty("event15") && !Libs.isBlank(devEvent.event15)) {
										var arrErrorCode15 = Libs.decimalToErrorCode(devEvent.event15);
										if (arrErrorCode15.length > 0) {
											var paramBit15 = {
												state_key: 'event15',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode15
											};

											// Lay danh sach loi tren he thong
											var _arrError14 = await db.queryForList("ModelReadings.getListError", paramBit15);
											if (_arrError14.length > 0) {
												for (var _i14 = 0; _i14 < _arrError14.length; _i14++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError14[_i14].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError14[_i14].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError14[_i14].id_error_level) && _arrError14[_i14].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail20 = {
																error_code: _arrError14[_i14].error_code,
																description: _arrError14[_i14].description,
																message: _arrError14[_i14].message,
																solutions: _arrError14[_i14].solutions,
																error_type_name: _arrError14[_i14].error_type_name,
																error_level_name: _arrError14[_i14].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html20 = reportRender.render("alert/mail_alert", _dataAlertSentMail20);
															SentMail.SentMailHTML(null, _dataAlertSentMail20.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail20.project_name, _html20);
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
	}]);

	return DataReadingsService;
}(_BaseService3.default);

exports.default = DataReadingsService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9EYXRhUmVhZGluZ3NTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkRhdGFSZWFkaW5nc1NlcnZpY2UiLCJkYXRhIiwiY2FsbEJhY2siLCJkYiIsIm15U3FMREIiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsImRhdGFQYXlsb2FkIiwicGF5bG9hZCIsIkxpYnMiLCJpc09iamVjdEVtcHR5IiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJlbCIsImdldERldmljZUluZm8iLCJxdWVyeUZvck9iamVjdCIsImlzQmxhbmsiLCJ0YWJsZV9uYW1lIiwiaWQiLCJyb2xsYmFjayIsImRhdGFFbnRpdHkiLCJycyIsImNoZWNrRXhpc3RBbGVybSIsImFzc2lnbiIsIk1vZGVsRW1ldGVyR2VsZXhFbWljTUU0MUVudGl0eSIsInRpbWUiLCJ0aW1lc3RhbXAiLCJpZF9kZXZpY2UiLCJhY3RpdmVFbmVyZ3kiLCJhY3RpdmVFbmVyZ3lFeHBvcnQiLCJpZF9lcnJvciIsInN0YXR1cyIsImluc2VydCIsInN0YXJ0X2RhdGUiLCJsYXN0Um93Iiwidmlld190YWJsZSIsImRlbGV0ZSIsIk1vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDVFbnRpdHkiLCJNb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1MjAyM0VudGl0eSIsIk1vZGVsSW52ZXJ0ZXJTTUFTVFAxMTBFbnRpdHkiLCJNb2RlbEludmVydGVyQUJCUFZTMTAwRW50aXR5IiwiTW9kZWxTZW5zb3JSVDFFbnRpdHkiLCJNb2RlbFRlY2hlZGdlRW50aXR5IiwiTW9kZWxTZW5zb3JJTVRUYVJTNDg1RW50aXR5IiwiTW9kZWxTZW5zb3JJTVRTaVJTNDg1RW50aXR5IiwiTW9kZWxMb2dnZXJTTUFJTTIwRW50aXR5IiwiTW9kZWxJbnZlcnRlclNNQVNUUDUwRW50aXR5IiwiTW9kZWxJbnZlcnRlclNNQVNIUDc1RW50aXR5IiwiY29tbWl0IiwiZXJyIiwiY29uc29sZSIsImxvZyIsImUiLCJkZXZTdGF0dXMiLCJkZXZFdmVudCIsImhhc093blByb3BlcnR5Iiwic3RhdHVzMSIsIm9ialBhcmFtcyIsInN0YXRlX2tleSIsImVycm9yX2NvZGUiLCJvYmpFcnJvciIsImlkX2Vycm9yX2xldmVsIiwiZW1haWwiLCJkYXRhQWxlcnRTZW50TWFpbCIsImRlc2NyaXB0aW9uIiwibWVzc2FnZSIsInNvbHV0aW9ucyIsImVycm9yX3R5cGVfbmFtZSIsImVycm9yX2xldmVsX25hbWUiLCJkZXZpY2VfbmFtZSIsIm5hbWUiLCJwcm9qZWN0X25hbWUiLCJmdWxsX25hbWUiLCJlcnJvcl9kYXRlIiwiaHRtbCIsInJlcG9ydFJlbmRlciIsInJlbmRlciIsIlNlbnRNYWlsIiwiU2VudE1haWxIVE1MIiwic3RhdHVzMiIsInN0YXR1czMiLCJldmVudDEiLCJldmVudDIiLCJldmVudDMiLCJhcnJFcnJvckNvZGUxIiwiZGVjaW1hbFRvRXJyb3JDb2RlIiwibGVuZ3RoIiwicGFyYW1CaXQxIiwiaWRfZGV2aWNlX2dyb3VwIiwiYXJyRXJyb3JDb2RlIiwiYXJyRXJyb3IiLCJxdWVyeUZvckxpc3QiLCJpIiwiYXJyRXJyb3JDb2RlMiIsInBhcmFtQml0MiIsImFyckVycm9yQ29kZTMiLCJwYXJhbUJpdDMiLCJldmVudDQiLCJhcnJFcnJvckNvZGU0IiwicGFyYW1CaXQ0IiwiZXZlbnQ1IiwiYXJyRXJyb3JDb2RlNSIsInBhcmFtQml0NSIsImV2ZW50NiIsImFyckVycm9yQ29kZTYiLCJwYXJhbUJpdDYiLCJldmVudDciLCJhcnJFcnJvckNvZGU3IiwicGFyYW1CaXQ3IiwiZXZlbnQ4IiwiYXJyRXJyb3JDb2RlOCIsInBhcmFtQml0OCIsImV2ZW50OSIsImFyckVycm9yQ29kZTkiLCJwYXJhbUJpdDkiLCJldmVudDEwIiwiYXJyRXJyb3JDb2RlMTAiLCJwYXJhbUJpdDEwIiwiZXZlbnQxMSIsImFyckVycm9yQ29kZTExIiwicGFyYW1CaXQxMSIsImV2ZW50MTIiLCJhcnJFcnJvckNvZGUxMiIsInBhcmFtQml0MTIiLCJldmVudDEzIiwiYXJyRXJyb3JDb2RlMTMiLCJwYXJhbUJpdDEzIiwiZXZlbnQxNCIsImFyckVycm9yQ29kZTE0IiwicGFyYW1CaXQxNCIsImV2ZW50MTUiLCJhcnJFcnJvckNvZGUxNSIsInBhcmFtQml0MTUiLCJCYXNlU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLG1COzs7QUFDTCxnQ0FBYztBQUFBOztBQUFBO0FBRWI7O0FBRUQ7Ozs7Ozs7Ozs7cUNBTW1CQyxJLEVBQU1DLFEsRUFBVTtBQUNsQyxPQUFJO0FBQ0gsUUFBSUMsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxTQUFJO0FBQ0gsVUFBSUMsY0FBY04sS0FBS08sT0FBdkI7QUFDQSxVQUFJLENBQUNDLEtBQUtDLGFBQUwsQ0FBbUJILFdBQW5CLENBQUwsRUFBc0M7QUFDckNJLGNBQU9DLElBQVAsQ0FBWUwsV0FBWixFQUF5Qk0sT0FBekIsQ0FBaUMsVUFBVUMsRUFBVixFQUFjO0FBQzlDUCxvQkFBWU8sRUFBWixJQUFtQlAsWUFBWU8sRUFBWixLQUFtQixNQUFuQixJQUE2QlAsWUFBWU8sRUFBWixLQUFtQixFQUFqRCxHQUF1RCxJQUF2RCxHQUE4RFAsWUFBWU8sRUFBWixDQUFoRjtBQUNBLFFBRkQ7QUFHQTs7QUFFRCxVQUFJQyxnQkFBZ0IsTUFBTVosR0FBR2EsY0FBSCxDQUFrQiw2QkFBbEIsRUFBaURmLElBQWpELENBQTFCO0FBQ0EsVUFBSVEsS0FBS0MsYUFBTCxDQUFtQkgsV0FBbkIsS0FBbUMsQ0FBQ1EsYUFBcEMsSUFBcUROLEtBQUtDLGFBQUwsQ0FBbUJLLGFBQW5CLENBQXJELElBQTBGTixLQUFLUSxP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QUFSLENBQVksYUFBWixFQUEyQkYsR0FBM0I7QUFDQTVDLFdBQUtjLFFBQUw7QUFDQWxCLGVBQVMsS0FBVCxFQUFnQmdELEdBQWhCO0FBQ0E7QUFDRCxLQXI2Q0Q7QUFzNkNBLElBeDZDRCxDQXc2Q0UsT0FBT0csQ0FBUCxFQUFVO0FBQ1hGLFlBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxDQUFyQjtBQUNBbkQsYUFBUyxLQUFULEVBQWdCbUQsQ0FBaEI7QUFDQTtBQUNEOzs7O0VBenBFZ0NpRixxQjs7a0JBNHBFbkJ0SSxtQiIsImZpbGUiOiJEYXRhUmVhZGluZ3NTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTZXJ2aWNlIGZyb20gJy4vQmFzZVNlcnZpY2UnO1xyXG5pbXBvcnQgTW9kZWxTZW5zb3JSVDFFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxTZW5zb3JSVDFFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxTZW5zb3JJTVRUYVJTNDg1RW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsU2Vuc29ySU1UVGFSUzQ4NUVudGl0eSc7XHJcbmltcG9ydCBNb2RlbFNlbnNvcklNVFNpUlM0ODVFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxTZW5zb3JJTVRTaVJTNDg1RW50aXR5JztcclxuaW1wb3J0IE1vZGVsTG9nZ2VyU01BSU0yMEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbExvZ2dlclNNQUlNMjBFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxJbnZlcnRlclN1bmdyb3dTRzExMENYRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsSW52ZXJ0ZXJTdW5ncm93U0cxMTBDWEVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxJbnZlcnRlclNNQVNUUDUwRW50aXR5JztcclxuaW1wb3J0IE1vZGVsSW52ZXJ0ZXJTTUFTSFA3NUVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEludmVydGVyU01BU0hQNzVFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxJbnZlcnRlckdyb3dhdHRHVzgwS1RMM0VudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEludmVydGVyR3Jvd2F0dEdXODBLVEwzRW50aXR5JztcclxuaW1wb3J0IE1vZGVsSW52ZXJ0ZXJBQkJQVlMxMDBFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxJbnZlcnRlckFCQlBWUzEwMEVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEVtZXRlckphbml0emFVTUc5NlMyRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsRW1ldGVySmFuaXR6YVVNRzk2UzJFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxUZWNoZWRnZUVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbFRlY2hlZGdlRW50aXR5JztcclxuaW1wb3J0IE1vZGVsSW52ZXJ0ZXJTTUFTVFAxMTBFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxJbnZlcnRlclNNQVNUUDExMEVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1RW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDVFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxFbWV0ZXJHZWxleEVtaWNNRTQxRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsRW1ldGVyR2VsZXhFbWljTUU0MUVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1MjAyM0VudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1MjAyM0VudGl0eSc7XHJcblxyXG5jbGFzcyBEYXRhUmVhZGluZ3NTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBJbnNlcnQgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEwLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBtb2RlbH0gZGF0YVxyXG5cdCAqL1xyXG5cdGluc2VydERhdGFSZWFkaW5ncyhkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgZGF0YVBheWxvYWQgPSBkYXRhLnBheWxvYWQ7XHJcblx0XHRcdFx0XHRpZiAoIUxpYnMuaXNPYmplY3RFbXB0eShkYXRhUGF5bG9hZCkpIHtcclxuXHRcdFx0XHRcdFx0T2JqZWN0LmtleXMoZGF0YVBheWxvYWQpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YVBheWxvYWRbZWxdID0gKGRhdGFQYXlsb2FkW2VsXSA9PSAnXFx4MDAnIHx8IGRhdGFQYXlsb2FkW2VsXSA9PSAnJykgPyBudWxsIDogZGF0YVBheWxvYWRbZWxdO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR2YXIgZ2V0RGV2aWNlSW5mbyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXREZXZpY2VJbmZvXCIsIGRhdGEpO1xyXG5cdFx0XHRcdFx0aWYgKExpYnMuaXNPYmplY3RFbXB0eShkYXRhUGF5bG9hZCkgfHwgIWdldERldmljZUluZm8gfHwgTGlicy5pc09iamVjdEVtcHR5KGdldERldmljZUluZm8pIHx8IExpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLnRhYmxlX25hbWUpIHx8IExpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmlkKSkge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRsZXQgZGF0YUVudGl0eSA9IHt9LCBycyA9IHt9LCBjaGVja0V4aXN0QWxlcm0gPSBudWxsO1xyXG5cdFx0XHRcdFx0c3dpdGNoIChnZXREZXZpY2VJbmZvLnRhYmxlX25hbWUpIHtcclxuXHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2VtZXRlcl9HZWxleEVtaWNfTUU0MSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEVtZXRlckdlbGV4RW1pY01FNDFFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA9IGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5RXhwb3J0O1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA2NDlcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDY0OSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gR2V0IGxhc3Qgcm93IGJ5IGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBsYXN0Um93ID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldExhc3RSb3dEYXRhXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnZpZXdfdGFibGVcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3cpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPSBsYXN0Um93LmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3lFeHBvcnQgPSBsYXN0Um93LmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDY0OSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxFbWV0ZXJHZWxleEVtaWNNRTQxXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnZpZXdfdGFibGVcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9lbWV0ZXJfVmluYXNpbm9fVlNFM1Q1JzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDVFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjI2XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA2MjYsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIEdldCBsYXN0IHJvdyBieSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGFzdFJvdyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMYXN0Um93RGF0YVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby52aWV3X3RhYmxlXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID0gbGFzdFJvdy5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA2MjYsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDVcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdGxldCBsYXN0Um93RGF0YVVwZGF0ZWQgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RGF0YVVwZGF0ZURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udmlld190YWJsZVxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0aWYgKGxhc3RSb3dEYXRhVXBkYXRlZCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxldCBkZXZpY2VVcGRhdGVkID0ge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWQ6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRwb3dlcl9ub3c6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRlbmVyZ3lfdG9kYXk6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfdG9kYXksXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsYXN0X21vbnRoOiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X2xhc3RfbW9udGgsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsaWZldGltZTogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWVcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2VtZXRlcl9WaW5hc2lub19WU0UzVDUyMDIzJzpcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNTIwMjNFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjYzXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjYzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBHZXQgbGFzdCByb3cgYnkgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbGFzdFJvdyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMYXN0Um93RGF0YVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udmlld190YWJsZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3cpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA9IGxhc3RSb3cuYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDY2MyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1MjAyM1wiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0aWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0bGV0IGxhc3RSb3dEYXRhVXBkYXRlZCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXREYXRhVXBkYXRlRGV2aWNlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udmlld190YWJsZVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxldCBkZXZpY2VVcGRhdGVkID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZDogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRlbmVyZ3lfdG9kYXk6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfdG9kYXksXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxhc3RfbW9udGg6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfbGFzdF9tb250aCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWVcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHRcdC8vIH1cclxuXHRcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFAxMTAnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxJbnZlcnRlclNNQVNUUDExMEVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzdcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzNyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gR2V0IGxhc3Qgcm93IGJ5IGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBsYXN0Um93ID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldExhc3RSb3dEYXRhXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnZpZXdfdGFibGVcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3cpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPSBsYXN0Um93LmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzNyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxJbnZlcnRlclNNQVNUUDExMFwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0bGV0IGxhc3RSb3dEYXRhVXBkYXRlZCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXREYXRhVXBkYXRlRGV2aWNlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby52aWV3X3RhYmxlXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRpZiAobGFzdFJvd0RhdGFVcGRhdGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZDogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdHBvd2VyX25vdzogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGVuZXJneV90b2RheTogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV90b2RheSxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxhc3RfbW9udGg6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfbGFzdF9tb250aCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxpZmV0aW1lOiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5ID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZVxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfQUJCX1BWUzEwMCc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEludmVydGVyQUJCUFZTMTAwRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQyOFxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDI4LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBHZXQgbGFzdCByb3cgYnkgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGxhc3RSb3cgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGFzdFJvd0RhdGFcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udmlld190YWJsZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvdykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA9IGxhc3RSb3cuYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDI4LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGlmICghTGlicy5pc0JsYW5rKGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEludmVydGVyQUJCUFZTMTAwXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnZpZXdfdGFibGVcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9SVDEnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxTZW5zb3JSVDFFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMyXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbFNlbnNvclJUMVwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRsZXQgZGV2aWNlVXBkYXRlZCA9IHsgaWQ6IGdldERldmljZUluZm8uaWQsIHBvd2VyX25vdzogbnVsbCwgZW5lcmd5X3RvZGF5OiBudWxsLCBsYXN0X21vbnRoOiBudWxsLCBsaWZldGltZTogbnVsbCwgbGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWUgfTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3RlY2hlZGdlJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsVGVjaGVkZ2VFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM1XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzNSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsVGVjaGVkZ2VcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7IGlkOiBnZXREZXZpY2VJbmZvLmlkLCBwb3dlcl9ub3c6IG51bGwsIGVuZXJneV90b2RheTogbnVsbCwgbGFzdF9tb250aDogbnVsbCwgbGlmZXRpbWU6IG51bGwsIGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lIH07XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9zZW5zb3JfSU1UX1RhUlM0ODUnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxTZW5zb3JJTVRUYVJTNDg1RW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzNFxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbFNlbnNvcklNVFRhUlM0ODVcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7IGlkOiBnZXREZXZpY2VJbmZvLmlkLCBwb3dlcl9ub3c6IG51bGwsIGVuZXJneV90b2RheTogbnVsbCwgbGFzdF9tb250aDogbnVsbCwgbGlmZXRpbWU6IG51bGwsIGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lIH07XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfU2lSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbFNlbnNvcklNVFNpUlM0ODVFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMzXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsU2Vuc29ySU1UU2lSUzQ4NVwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRsZXQgZGV2aWNlVXBkYXRlZCA9IHsgaWQ6IGdldERldmljZUluZm8uaWQsIHBvd2VyX25vdzogbnVsbCwgZW5lcmd5X3RvZGF5OiBudWxsLCBsYXN0X21vbnRoOiBudWxsLCBsaWZldGltZTogbnVsbCwgbGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWUgfTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfbG9nZ2VyX1NNQV9JTTIwJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsTG9nZ2VyU01BSU0yMEVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzFcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxMb2dnZXJTTUFJTTIwXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGxldCBkZXZpY2VVcGRhdGVkID0geyBpZDogZ2V0RGV2aWNlSW5mby5pZCwgcG93ZXJfbm93OiBudWxsLCBlbmVyZ3lfdG9kYXk6IG51bGwsIGxhc3RfbW9udGg6IG51bGwsIGxpZmV0aW1lOiBudWxsLCBsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZSB9O1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0ZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TdW5ncm93X1NHMTEwQ1gnOlxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQNTAnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxJbnZlcnRlclNNQVNUUDUwRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMFxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIEdldCBsYXN0IHJvdyBieSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGFzdFJvdyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMYXN0Um93RGF0YVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby52aWV3X3RhYmxlXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID0gbGFzdFJvdy5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsSW52ZXJ0ZXJTTUFTVFA1MFwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0bGV0IGxhc3RSb3dEYXRhVXBkYXRlZCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXREYXRhVXBkYXRlRGV2aWNlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby52aWV3X3RhYmxlXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRpZiAobGFzdFJvd0RhdGFVcGRhdGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZDogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdHBvd2VyX25vdzogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGVuZXJneV90b2RheTogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV90b2RheSxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxhc3RfbW9udGg6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfbGFzdF9tb250aCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxpZmV0aW1lOiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5ID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZVxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU0hQNzUnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxJbnZlcnRlclNNQVNIUDc1RW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQyOVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDI5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBHZXQgbGFzdCByb3cgYnkgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGxhc3RSb3cgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGFzdFJvd0RhdGFcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvdykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA9IGxhc3RSb3cuYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDI5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsSW52ZXJ0ZXJTTUFTSFA3NVwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0bGV0IGxhc3RSb3dEYXRhVXBkYXRlZCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXREYXRhVXBkYXRlRGV2aWNlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby52aWV3X3RhYmxlXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRpZiAobGFzdFJvd0RhdGFVcGRhdGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZDogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdHBvd2VyX25vdzogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGVuZXJneV90b2RheTogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV90b2RheSxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxhc3RfbW9udGg6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfbGFzdF9tb250aCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxpZmV0aW1lOiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5ID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZVxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9Hcm93YXR0X0dXODBLVEwzJzpcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfZW1ldGVyX0phbml0emFfVU1HOTZTMic6XHJcblx0XHRcdFx0XHRcdFx0Ly8gZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEVtZXRlckphbml0emFVTUc5NlMyRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHQvLyBkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHQvLyBkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gLy8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdC8vIGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aWRfZXJyb3I6IDQyN1xyXG5cdFx0XHRcdFx0XHRcdC8vIH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkX2Vycm9yOiA0MjcsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZF9lcnJvcjogNDI3LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEVtZXRlckphbml0emFVTUc5NlMyXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHJzKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdFx0XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBJbnNlcnQgYWxhcm1cclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMi8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgbW9kZWx9IGRhdGFcclxuXHQgKi9cclxuXHRpbnNlcnRBbGFybVJlYWRpbmdzKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBnZXREZXZpY2VJbmZvID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERldmljZUluZm9cIiwgZGF0YSk7XHJcblx0XHRcdFx0XHRpZiAoIWdldERldmljZUluZm8gfHwgTGlicy5pc09iamVjdEVtcHR5KGdldERldmljZUluZm8pIHx8IExpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLnRhYmxlX25hbWUpIHx8IExpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmlkKSkge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRsZXQgcnMgPSB7fSwgY2hlY2tFeGlzdEFsZXJtID0gbnVsbDtcclxuXHRcdFx0XHRcdHZhciBkZXZTdGF0dXMgPSBkYXRhLmRldlN0YXR1cztcclxuXHRcdFx0XHRcdHZhciBkZXZFdmVudCA9IGRhdGEuZGV2RXZlbnQ7XHJcblxyXG5cclxuXHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBcclxuXHRcdFx0XHRcdGlmICghTGlicy5pc09iamVjdEVtcHR5KGRldlN0YXR1cykpIHtcclxuXHRcdFx0XHRcdFx0c3dpdGNoIChnZXREZXZpY2VJbmZvLnRhYmxlX25hbWUpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBzZW50IGVycm9yIGNvZGUgXHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDExMCc6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NIUDc1JzpcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9BQkJfUFZTMTAwJzpcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQNTAnOlxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgc3RhdHVzIDFcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZTdGF0dXMuaGFzT3duUHJvcGVydHkoXCJzdGF0dXMxXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2U3RhdHVzLnN0YXR1czEpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdzdGF0dXMxJywgZXJyb3JfY29kZTogZGV2U3RhdHVzLnN0YXR1czEgfTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBzdGF0dXMgMlxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldlN0YXR1cy5oYXNPd25Qcm9wZXJ0eShcInN0YXR1czJcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZTdGF0dXMuc3RhdHVzMikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ3N0YXR1czInLCBlcnJvcl9jb2RlOiBkZXZTdGF0dXMuc3RhdHVzMiB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBzdGF0dXMgM1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldlN0YXR1cy5oYXNPd25Qcm9wZXJ0eShcInN0YXR1czNcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZTdGF0dXMuc3RhdHVzMykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ3N0YXR1czMnLCBlcnJvcl9jb2RlOiBkZXZTdGF0dXMuc3RhdHVzMyB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU3VuZ3Jvd19TRzExMENYJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBTZW50IGVycm9yIGJpdFxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX3NlbnNvcl9SVDEnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfU2lSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9UYVJTNDg1JzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICcnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfdGVjaGVkZ2UnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX2ludmVydGVyX0dyb3dhdHRfR1c4MEtUTDMnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHQvLyBjaGVjayBzdGF0dXMgNFxyXG5cdFx0XHRcdFx0XHQvLyBpZiAoZGV2U3RhdHVzLmhhc093blByb3BlcnR5KFwic3RhdHVzNFwiKSAmJiAhTGlicy5pc0JsYW5rKGRldlN0YXR1cy5zdGF0dXM0KSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ3N0YXR1czQnLCBlcnJvcl9jb2RlOiBkZXZTdGF0dXMuc3RhdHVzNCB9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdC8vIC8vIGNoZWNrIHN0YXR1cyA1XHJcblx0XHRcdFx0XHRcdC8vIGlmIChkZXZTdGF0dXMuaGFzT3duUHJvcGVydHkoXCJzdGF0dXM1XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2U3RhdHVzLnN0YXR1czUpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnc3RhdHVzNScsIGVycm9yX2NvZGU6IGRldlN0YXR1cy5zdGF0dXM1IH07XHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdC8vIC8vIGNoZWNrIHN0YXR1cyA2XHJcblx0XHRcdFx0XHRcdC8vIGlmIChkZXZTdGF0dXMuaGFzT3duUHJvcGVydHkoXCJzdGF0dXM2XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2U3RhdHVzLnN0YXR1czYpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnc3RhdHVzNicsIGVycm9yX2NvZGU6IGRldlN0YXR1cy5zdGF0dXM2IH07XHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHQvLyAvLyBjaGVjayBzdGF0dXMgN1xyXG5cdFx0XHRcdFx0XHQvLyBpZiAoZGV2U3RhdHVzLmhhc093blByb3BlcnR5KFwic3RhdHVzN1wiKSAmJiAhTGlicy5pc0JsYW5rKGRldlN0YXR1cy5zdGF0dXM3KSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ3N0YXR1czcnLCBlcnJvcl9jb2RlOiBkZXZTdGF0dXMuc3RhdHVzNyB9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZXZlbnQgXHJcblx0XHRcdFx0XHRpZiAoIUxpYnMuaXNPYmplY3RFbXB0eShkZXZFdmVudCkpIHtcclxuXHRcdFx0XHRcdFx0c3dpdGNoIChnZXREZXZpY2VJbmZvLnRhYmxlX25hbWUpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBzZW50IGVycm9yIGNvZGUgXHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDUwJzpcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDFcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50MVwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ2V2ZW50MScsIGVycm9yX2NvZGU6IGRldkV2ZW50LmV2ZW50MSB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgMlxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQyXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQyKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnZXZlbnQyJywgZXJyb3JfY29kZTogZGV2RXZlbnQuZXZlbnQyIH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAzXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDNcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDMpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdldmVudDMnLCBlcnJvcl9jb2RlOiBkZXZFdmVudC5ldmVudDMgfTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gU2VudCBiaXQgY29kZVxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFAxMTAnOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0FCQl9QVlMxMDAnOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TSFA3NSc6XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAxXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDFcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDEpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGUxID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTEubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDEgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDEnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAyXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDJcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGUyID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQyKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDIgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDInLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlMlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAzXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDNcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDMpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGUzID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQzKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDMgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDMnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlM1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCA0XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDRcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDQpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGU0ID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQ0KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTQubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDQgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDQnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlNFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCA1XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDVcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGU1ID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQ1KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTUubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDUgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDUnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlNVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCA2XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDZcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDYpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGU2ID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQ2KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTYubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDYgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDYnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlNlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDYpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgN1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ3XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ3KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlNyA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50Nyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGU3Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQ3ID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQ3JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQ3KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDhcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50OFwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50OCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTggPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlOC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0OCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50OCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGU4XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0OCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDlcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50OVwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50OSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTkgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlOS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0OSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50OScsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGU5XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0OSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDEwXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDEwXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQxMCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTEwID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQxMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGUxMC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0MTAgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDEwJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTEwXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0MTApO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgMTFcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50MTFcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDExKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlMTEgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDExKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTExLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQxMSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50MTEnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlMTFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQxMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDEyXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDEyXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQxMikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTEyID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQxMik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGUxMi5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0MTIgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDEyJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTEyXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0MTIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAxM1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQxM1wiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MTMpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGUxMyA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50MTMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlMTMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDEzID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQxMycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGUxM1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDEzKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDE0XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDE0XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQxNCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTE0ID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQxNCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGUxNC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0MTQgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDE0JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTE0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0MTQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAxNVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQxNVwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MTUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGUxNSA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50MTUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlMTUubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDE1ID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQxNScsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGUxNVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDE1KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBTZW50IGVycm9yIGJpdFxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX3NlbnNvcl9SVDEnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfU2lSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9UYVJTNDg1JzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICcnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfdGVjaGVkZ2UnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX2ludmVydGVyX0dyb3dhdHRfR1c4MEtUTDMnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHRcdC8vIC8vIGNoZWNrIGV2ZW50IDRcclxuXHRcdFx0XHRcdFx0Ly8gaWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ0XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ0KSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ2V2ZW50NCcsIGVycm9yX2NvZGU6IGRldkV2ZW50LmV2ZW50NCB9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gLy8gY2hlY2sgZXZlbnQgNVxyXG5cdFx0XHRcdFx0XHQvLyBpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDVcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDUpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnZXZlbnQ1JywgZXJyb3JfY29kZTogZGV2RXZlbnQuZXZlbnQ1IH07XHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdC8vIC8vIGNoZWNrIGV2ZW50IDZcclxuXHRcdFx0XHRcdFx0Ly8gaWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ2XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ2KSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ2V2ZW50NicsIGVycm9yX2NvZGU6IGRldkV2ZW50LmV2ZW50NiB9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdC8vIC8vIGNoZWNrIGV2ZW50IDdcclxuXHRcdFx0XHRcdFx0Ly8gaWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ3XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ3KSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ2V2ZW50NycsIGVycm9yX2NvZGU6IGRldkV2ZW50LmV2ZW50NyB9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdC8vIC8vIGNoZWNrIGV2ZW50IDhcclxuXHRcdFx0XHRcdFx0Ly8gaWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ4XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ4KSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ2V2ZW50OCcsIGVycm9yX2NvZGU6IGRldkV2ZW50LmV2ZW50OCB9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCBycyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcicsIGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBEYXRhUmVhZGluZ3NTZXJ2aWNlO1xyXG4iXX0=