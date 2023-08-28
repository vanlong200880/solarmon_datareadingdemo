import BaseService from './BaseService';
import moment from 'moment';
class ClientAnalyticsService extends BaseService {
	constructor() {
		super();

	}

	/**
	* get detail project page Client Analytics
	* @param {*} data 
	* @param {*} callBack 
	*/

	getDataChartProfile(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForObject("ClientAnalytics.getDetail", param);
					if (!rs) {
						conn.rollback();
						callBack(true, {});
						return;
					}

					var getListDeviceInverter = await db.queryForList("ClientAnalytics.getListDeviceInverter", param);
					var dataEnergyMerge = [];
					if (Libs.isArrayData(getListDeviceInverter)) {
						for (var v = 0, len = getListDeviceInverter.length; v < len; v++) {
							getListDeviceInverter[v].start_date = Libs.convertAllFormatDate(param.start_date);
							getListDeviceInverter[v].end_date = Libs.convertAllFormatDate(param.end_date);
							var dataEnergyByDevice = await db.queryForList("ClientAnalytics.dataEnergyByDevice", getListDeviceInverter[v]);

							if (dataEnergyByDevice.length > 0) {
								for (let k = 0, l = dataEnergyByDevice.length; k < l; k++) {
									if (k === 0) {
										dataEnergyByDevice[k].activeEnergy = 0;
									} else {
										var subEnergy = (dataEnergyByDevice[k].today_activeEnergy - dataEnergyByDevice[k - 1].today_activeEnergy) / 1000;
										dataEnergyByDevice[k].activeEnergy = Libs.roundNumber(subEnergy, 1);
									}
								}
								dataEnergyMerge = Object.values([...dataEnergyMerge, ...dataEnergyByDevice].reduce((acc, { time_format, time_full, activePower, activeEnergy, group_day }) => {
									acc[time_format] = {
										time_format,
										time_full,
										activePower: Libs.roundNumber(((acc[time_format] ? acc[time_format].activePower : 0) + activePower), 1),
										activeEnergy: Libs.roundNumber(((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy), 1),
										group_day
									};
									return acc;
								}, {}));
							}
						}
					}
					rs.dataChartProfile = dataEnergyMerge;


					// last 12 months
					var getGroupInverter = await db.queryForList("ClientAnalytics.getGroupDeviceInverter", param);
					if (!getGroupInverter) {
						conn.rollback();
						callBack(false, {});
						return;
					}
					var groupInverter = [];
					if (getGroupInverter.length > 0) {
						for (let i = 0, len = getGroupInverter.length; i < len; i++) {
							groupInverter.push(
								{
									hash_id: param.hash_id,
									id_device_group: getGroupInverter[i].id_device_group,
									start_date: Libs.convertAllFormatDate(param.start_date),
									end_date: Libs.convertAllFormatDate(param.end_date),
									table_name: getGroupInverter[i].table_name
								}
							);
						}
					}

					rs.performanceLast12Months = await db.queryForList("ClientAnalytics.getDataEnergy12Month", { groupInverter });

					// Performance - Last 31 days
					rs.performanceLast30Days = await db.queryForList("ClientAnalytics.getDataEnergy30Days", { groupInverter });

					// Daily Max Power - Last 12 Months
					rs.maxPower12Months = await db.queryForList("ClientAnalytics.getDataMaxPower12Months", { groupInverter });
					conn.commit();
					callBack(false, rs);
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


	getListDeviceByProject(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var getListDevice = await db.queryForList("ClientAnalytics.getListDeviceByProject", param);
					if (!getListDevice) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					if (getListDevice.length > 0) {
						for (let i = 0, len = getListDevice.length; i < len; i++) {
							getListDevice[i].dataParameter = await db.queryForList("ClientAnalytics.getParameterByDevice", getListDevice[i]);
						}
					}

					conn.commit();
					callBack(false, getListDevice);
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



	getChartParameterDevice(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var data = [];
					var dataDevice = param.dataDevice;
					if (!Libs.isArrayData(dataDevice)) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					for (let i = 0, len = dataDevice.length; i < len; i++) {
						var params = {
							filterBy: param.filterBy,
							start_date: Libs.convertAllFormatDate(param.start_date),
							end_date: Libs.convertAllFormatDate(param.end_date),
							data_send_time: param.data_send_time,
							table_name: dataDevice[i].table_name,
							id: dataDevice[i].id
						};
						var dataEnergy = await db.queryForList("ClientAnalytics.getDataChartParameter", params);

						switch (param.filterBy) {
							case '3_day':
							case 'today':
								var arrTime5 = [];
								if (params.filterBy == 'today') {
									// genarete data 5 munites
									if (param.data_send_time == 1) {
										let curDate5 = Libs.convertAllFormatDate(param.end_date);
										var curDateFormat5 = moment(curDate5).format('YYYY-MM-DD 05:00');
										for (var t = 0; t < 168; t++) {
											arrTime5.push({
												time_format: moment(curDateFormat5).add(5 * t, 'minutes').format('YYYY-MM-DD HH:mm'),
												time_full: moment(curDateFormat5).add(5 * t, 'minutes').format('DD/MM/YYYY HH:mm'),
												categories_time: moment(curDateFormat5).add(5 * t, 'minutes').format('HH:mm')
											});
										}
									}


									// genarete data 15 munites
									if (param.data_send_time == 2) {
										let curDate15 = Libs.convertAllFormatDate(param.end_date);
										var curDateFormat15 = moment(curDate15).format('YYYY-MM-DD 05:00');
										for (var n = 0; n < 56; n++) {
											arrTime5.push({
												time_format: moment(curDateFormat15).add(15 * n, 'minutes').format('YYYY-MM-DD HH:mm'),
												time_full: moment(curDateFormat15).add(15 * n, 'minutes').format('DD/MM/YYYY HH:mm'),
												categories_time: moment(curDateFormat15).add(15 * n, 'minutes').format('HH:mm')
											});
										}
									}


									// genarete data 1 hour
									if (param.data_send_time == 3) {
										let curDate1h = Libs.convertAllFormatDate(param.end_date);
										var curDateFormat1h = moment(curDate1h).format('YYYY-MM-DD 05:00');
										for (var n = 0; n < 14; n++) {
											arrTime5.push({
												time_format: moment(curDateFormat1h).add(1 * n, 'hours').format('YYYY-MM-DD HH:mm'),
												time_full: moment(curDateFormat1h).add(1 * n, 'hours').format('DD/MM/YYYY HH:mm'),
												categories_time: moment(curDateFormat1h).add(1 * n, 'hours').format('HH:mm')
											});
										}
									}
								}

								// genarete data 5 munites
								if (params.filterBy == '3_day' && params.data_send_time == 1) {
									let startDate = '', endDate = '';
									for (let i = 0; i < 3; i++) {
										if (i === 0) {
											startDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
											endDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD 19:00');
										} else {
											startDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD HH:mm');
											endDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD 19:00');
										}
	
										var curDateFormat = moment(startDate).format('YYYY-MM-DD 05:00');
										for (var h = 0; h < 168; h++) {
											arrTime5.push({
												time_format: moment(curDateFormat).add(5 * h, 'minutes').format('YYYY-MM-DD HH:mm'),
												time_full: moment(curDateFormat).add(5 * h, 'minutes').format('DD/MM/YYYY HH:mm'),
												categories_time: moment(curDateFormat).add(5 * h, 'minutes').format('D. MMM')
											});
										}
									}
								}

								// genarete data 15 munites
								if (params.filterBy == '3_day' && params.data_send_time == 2) {
									let startDate = '', endDate = '';
									for (let i = 0; i < 3; i++) {
										if (i === 0) {
											startDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
											endDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD 19:00');
										} else {
											startDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD HH:mm');
											endDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD 19:00');
										}
	
										var curDateFormat = moment(startDate).format('YYYY-MM-DD 05:00');
										for (var h = 0; h < 56; h++) {
											arrTime5.push({
												time_format: moment(curDateFormat).add(15 * h, 'minutes').format('YYYY-MM-DD HH:mm'),
												time_full: moment(curDateFormat).add(15 * h, 'minutes').format('DD/MM/YYYY HH:mm'),
												categories_time: moment(curDateFormat).add(15 * h, 'minutes').format('D. MMM')
											});
										}
									}
								}


								// genarete data 1 hour
								if (params.filterBy == '3_day' && params.data_send_time == 3) {
									let startDate = '', endDate = '';
									for (let i = 0; i < 3; i++) {
										if (i === 0) {
											startDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
											endDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD 19:00');
										} else {
											startDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD HH:mm');
											endDate = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD 19:00');
										}
	
										var curDateFormat = moment(startDate).format('YYYY-MM-DD 05:00');
										for (var h = 0; h <= 14; h++) {
											arrTime5.push({
												time_format: moment(curDateFormat).add(1 * h, 'hours').format('YYYY-MM-DD HH:mm'),
												time_full: moment(curDateFormat).add(1 * h, 'hours').format('DD/MM/YYYY HH:mm'),
												categories_time: moment(curDateFormat).add(1 * h, 'hours').format('D. MMM')
											});
										}
									}
								}




								var dataEnergy5 = [];
								switch (dataDevice[i].table_name) {
									case 'model_inverter_SMA_SHP75':
										dataEnergy5 = Object.values([...arrTime5, ...dataEnergy].reduce((acc, {
											time_format, time_full, categories_time, acCurrent, currentPhaseA, currentPhaseB,
											currentPhaseC, voltagePhaseA, voltagePhaseB, voltagePhaseC, activePower, powerFrequency,
											apparentPower, reactivePower, powerFactor, activeEnergy, dcCurrent, dcVoltage,
											dcPower, internalTemperature, heatSinkTemperature, transformerTemperature
										}) => {
											acc[time_full] = {
												time_format: time_format ? time_format : acc[time_full].time_format,
												time_full: time_full ? time_full : acc[time_full].time_full,
												categories_time: categories_time ? categories_time : acc[time_full].categories_time,
												acCurrent: acCurrent ? acCurrent : null,
												currentPhaseA: currentPhaseA ? currentPhaseA : null,
												currentPhaseB: currentPhaseB ? currentPhaseB : null,
												currentPhaseC: currentPhaseC ? currentPhaseC : null,
												voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
												voltagePhaseB: voltagePhaseB ? voltagePhaseB : voltagePhaseB,
												voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
												activePower: activePower ? activePower : null,
												powerFrequency: powerFrequency ? powerFrequency : null,
												apparentPower: apparentPower ? apparentPower : null,
												reactivePower: reactivePower ? reactivePower : null,
												powerFactor: powerFactor ? powerFactor : null,
												activeEnergy: activeEnergy ? activeEnergy : null,
												dcCurrent: dcCurrent ? dcCurrent : null,
												dcVoltage: dcVoltage ? dcVoltage : null,
												dcPower: dcPower ? dcPower : null,
												internalTemperature: internalTemperature ? internalTemperature : null,
												heatSinkTemperature: heatSinkTemperature ? heatSinkTemperature : null,
												transformerTemperature: transformerTemperature ? transformerTemperature : null
											};
											return acc;
										}, {}));

										dataDevice[i].data = dataEnergy5;
										break;

									case 'model_inverter_ABB_PVS100':
										dataEnergy5 = Object.values([...arrTime5, ...dataEnergy].reduce((acc, {
											time_format, time_full, categories_time,
											acCurrent,
											currentPhaseA,
											currentPhaseB,
											currentPhaseC,
											voltagePhaseA,
											voltagePhaseB,
											voltagePhaseC,
											activePower,
											powerFrequency,
											apparentPower,
											reactivePower,
											powerFactor,
											activeEnergy,
											dcCurrent,
											dcVoltage,
											dcPower,
											internalTemperature,
											heatSinkTemperature,
											mppt1Current,
											mppt1Voltage,
											mppt1Power,
											mppt2Current,
											mppt2Voltage,
											mppt2Power,
											mppt3Current,
											mppt3Voltage,
											mppt3Power,
											mppt4Current,
											mppt4Voltage,
											mppt4Power,
											mppt5Current,
											mppt5Voltage,
											mppt5Power,
											mppt6Current,
											mppt6Voltage,
											mppt6Power
										}) => {
											acc[time_full] = {
												time_format: time_format ? time_format : acc[time_full].time_format,
												time_full: time_full ? time_full : acc[time_full].time_full,
												categories_time: categories_time ? categories_time : acc[time_full].categories_time,
												acCurrent: acCurrent ? acCurrent : null,
												currentPhaseA: currentPhaseA ? currentPhaseA : null,
												currentPhaseB: currentPhaseB ? currentPhaseB : null,
												currentPhaseC: currentPhaseC ? currentPhaseC : null,
												voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
												voltagePhaseB: voltagePhaseB ? voltagePhaseB : null,
												voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
												activePower: activePower ? activePower : null,
												powerFrequency: powerFrequency ? powerFrequency : null,
												apparentPower: apparentPower ? apparentPower : null,
												reactivePower: reactivePower ? reactivePower : null,
												powerFactor: powerFactor ? powerFactor : null,
												activeEnergy: activeEnergy ? activeEnergy : null,
												dcCurrent: dcCurrent ? dcCurrent : null,
												dcVoltage: dcVoltage ? dcVoltage : null,
												dcPower: dcPower ? dcPower : null,
												internalTemperature: internalTemperature ? internalTemperature : null,
												heatSinkTemperature: heatSinkTemperature ? heatSinkTemperature : null,
												mppt1Current: mppt1Current ? mppt1Current : null,
												mppt1Voltage: mppt1Voltage ? mppt1Voltage : null,
												mppt1Power: mppt1Power ? mppt1Power : null,
												mppt2Current: mppt2Current ? mppt2Current : null,
												mppt2Voltage: mppt2Voltage ? mppt2Voltage : null,
												mppt2Power: mppt2Power ? mppt2Power : null,
												mppt3Current: mppt3Current ? mppt3Current : null,
												mppt3Voltage: mppt3Voltage ? mppt3Voltage : null,
												mppt3Power: mppt3Power ? mppt3Power : null,
												mppt4Current: mppt4Current ? mppt4Current : null,
												mppt4Voltage: mppt4Voltage ? mppt4Voltage : null,
												mppt4Power: mppt4Power ? mppt4Power : null,
												mppt5Current: mppt5Current ? mppt5Current : null,
												mppt5Voltage: mppt5Voltage ? mppt5Voltage : null,
												mppt5Power: mppt5Power ? mppt5Power : null,
												mppt6Current: mppt6Current ? mppt6Current : null,
												mppt6Voltage: mppt6Voltage ? mppt6Voltage : null,
												mppt6Power: mppt6Power ? mppt6Power : null,
											};
											return acc;
										}, {}));

										dataDevice[i].data = dataEnergy5;
										break;
									case 'model_inverter_SMA_STP50':
										dataEnergy5 = Object.values([...arrTime5, ...dataEnergy].reduce((acc, {
											time_format, time_full, categories_time,
											currentPhaseA,
											currentPhaseB,
											currentPhaseC,
											voltagePhaseA,
											voltagePhaseB,
											voltagePhaseC,
											activePower,
											powerFrequency,
											apparentPower,
											reactivePower,
											powerFactor,
											activeEnergy,
											dailyEnergy,
											dcCurrent,
											dcVoltage,
											dcPower,
											internalTemperature,
											mppt1Current,
											mppt1Voltage,
											mppt1Power,
											mppt2Current,
											mppt2Voltage,
											mppt2Power,
											mppt3Current,
											mppt3Voltage,
											mppt3Power,
											mppt4Current,
											mppt4Voltage,
											mppt4Power,
											mppt5Current,
											mppt5Voltage,
											mppt5Power,
											mppt6Current,
											mppt6Voltage,
											mppt6Power

										}) => {
											acc[time_full] = {
												time_format: time_format ? time_format : acc[time_full].time_format,
												time_full: time_full ? time_full : acc[time_full].time_full,
												categories_time: categories_time ? categories_time : acc[time_full].categories_time,
												currentPhaseA: currentPhaseA ? currentPhaseA : null,
												currentPhaseB: currentPhaseB ? currentPhaseB : null,
												currentPhaseC: currentPhaseC ? currentPhaseC : null,
												voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
												voltagePhaseB: voltagePhaseB ? voltagePhaseB : null,
												voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
												activePower: activePower ? activePower : null,
												powerFrequency: powerFrequency ? powerFrequency : null,
												apparentPower: apparentPower ? apparentPower : null,
												reactivePower: reactivePower ? reactivePower : null,
												powerFactor: powerFactor ? powerFactor : null,
												activeEnergy: activeEnergy ? activeEnergy : null,
												dailyEnergy: dailyEnergy ? dailyEnergy : null,
												dcCurrent: dcCurrent ? dcCurrent : null,
												dcVoltage: dcVoltage ? dcVoltage : null,
												dcPower: dcPower ? dcPower : null,
												internalTemperature: internalTemperature ? internalTemperature : null,
												mppt1Current: mppt1Current ? mppt1Current : null,
												mppt1Voltage: mppt1Voltage ? mppt1Voltage : null,
												mppt1Power: mppt1Power ? mppt1Power : null,
												mppt2Current: mppt2Current ? mppt2Current : null,
												mppt2Voltage: mppt2Voltage ? mppt2Voltage : null,
												mppt2Power: mppt2Power ? mppt2Power : null,
												mppt3Current: mppt3Current ? mppt3Current : null,
												mppt3Voltage: mppt3Voltage ? mppt3Voltage : null,
												mppt3Power: mppt3Power ? mppt3Power : null,
												mppt4Current: mppt4Current ? mppt4Current : null,
												mppt4Voltage: mppt4Voltage ? mppt4Voltage : null,
												mppt4Power: mppt4Power ? mppt4Power : null,
												mppt5Current: mppt5Current ? mppt5Current : null,
												mppt5Voltage: mppt5Voltage ? mppt5Voltage : null,
												mppt5Power: mppt5Power ? mppt5Power : null,
												mppt6Current: mppt6Current ? mppt6Current : null,
												mppt6Voltage: mppt6Voltage ? mppt6Voltage : null,
												mppt6Power: mppt6Power ? mppt6Power : null

											};
											return acc;
										}, {}));

										dataDevice[i].data = dataEnergy5;

										break;
									case 'model_logger_SMA_IM20':
										dataEnergy5 = Object.values([...arrTime5, ...dataEnergy].reduce((acc, {
											time_format, time_full, categories_time,
											manufacturer,
											model,
											serialNumber,
											modbusUnitId
										}) => {
											acc[time_full] = {
												time_format: time_format ? time_format : acc[time_full].time_format,
												time_full: time_full ? time_full : acc[time_full].time_full,
												categories_time: categories_time ? categories_time : acc[time_full].categories_time,
												manufacturer: manufacturer ? manufacturer : null,
												model: model ? model : null,
												serialNumber: serialNumber ? serialNumber : null,
												modbusUnitId: modbusUnitId ? modbusUnitId : null
											};
											return acc;
										}, {}));

										dataDevice[i].data = dataEnergy5;
										break;
									case 'model_sensor_IMT_SiRS485':
										dataEnergy5 = Object.values([...arrTime5, ...dataEnergy].reduce((acc, {
											time_format, time_full, categories_time,
											irradiancePoA,
											cellTemp,
											panelTemp

										}) => {
											acc[time_full] = {
												time_format: time_format ? time_format : acc[time_full].time_format,
												time_full: time_full ? time_full : acc[time_full].time_full,
												categories_time: categories_time ? categories_time : acc[time_full].categories_time,
												irradiancePoA: irradiancePoA ? irradiancePoA : null,
												cellTemp: cellTemp ? cellTemp : null,
												panelTemp: panelTemp ? panelTemp : null

											};
											return acc;
										}, {}));

										dataDevice[i].data = dataEnergy5;
										break;
									case 'model_sensor_IMT_TaRS485':
										dataEnergy5 = Object.values([...arrTime5, ...dataEnergy].reduce((acc, {
											time_format, time_full, categories_time,
											ambientTemp

										}) => {
											acc[time_full] = {
												time_format: time_format ? time_format : acc[time_full].time_format,
												time_full: time_full ? time_full : acc[time_full].time_full,
												categories_time: categories_time ? categories_time : acc[time_full].categories_time,
												ambientTemp: ambientTemp ? ambientTemp : null
											};
											return acc;
										}, {}));

										dataDevice[i].data = dataEnergy5;
										break;
									case 'model_techedge':
										dataEnergy5 = Object.values([...arrTime5, ...dataEnergy].reduce((acc, {
											time_format, time_full, categories_time,
											memPercent,
											memTotal,
											memUsed,
											memAvail,
											memFree,
											diskPercent,
											diskTotal,
											diskUsed,
											diskFree,
											cpuTemp,
											upTime

										}) => {
											acc[time_full] = {
												time_format: time_format ? time_format : acc[time_full].time_format,
												time_full: time_full ? time_full : acc[time_full].time_full,
												categories_time: categories_time ? categories_time : acc[time_full].categories_time,
												memPercent: memPercent ? memPercent : null,
												memTotal: memTotal ? memTotal : null,
												memUsed: memUsed ? memUsed : null,
												memAvail: memAvail ? memAvail : null,
												memFree: memFree ? memFree : null,
												diskPercent: diskPercent ? diskPercent : null,
												diskTotal: diskTotal ? diskTotal : null,
												diskUsed: diskUsed ? diskUsed : null,
												diskFree: diskFree ? diskFree : null,
												cpuTemp: cpuTemp ? cpuTemp : null,
												upTime: upTime ? upTime : null
											};
											return acc;
										}, {}));

										dataDevice[i].data = dataEnergy5;
										break;
									case 'model_inverter_SMA_STP110':
										dataEnergy5 = Object.values([...arrTime5, ...dataEnergy].reduce((acc, {
											time_format, time_full, categories_time,
											acCurrent,
											currentPhaseA,
											currentPhaseB,
											currentPhaseC,
											voltagePhaseA,
											voltagePhaseB,
											voltagePhaseC,
											activePower,
											powerFrequency,
											apparentPower,
											reactivePower,
											powerFactor,
											activeEnergy,
											dcCurrent,
											dcVoltage,
											dcPower,
											cabinetTemperature,
											mppt1Current,
											mppt1Voltage,
											mppt1Power,
											mppt2Current,
											mppt2Voltage,
											mppt2Power,
											mppt3Current,
											mppt3Voltage,
											mppt3Power,
											mppt4Current,
											mppt4Voltage,
											mppt4Power,
											mppt5Current,
											mppt5Voltage,
											mppt5Power,
											mppt6Current,
											mppt6Voltage,
											mppt6Power,
											mppt7Current,
											mppt7Voltage,
											mppt7Power,
											mppt8Current,
											mppt8Voltage,
											mppt8Power,
											mppt9Current,
											mppt9Voltage,
											mppt9Power,
											mppt10Current,
											mppt10Voltage,
											mppt10Power,
											mppt11Current,
											mppt11Voltage,
											mppt11Power,
											mppt12Current,
											mppt12Voltage,
											mppt12Power

										}) => {
											acc[time_full] = {
												time_format: time_format ? time_format : acc[time_full].time_format,
												time_full: time_full ? time_full : acc[time_full].time_full,
												categories_time: categories_time ? categories_time : acc[time_full].categories_time,
												acCurrent: acCurrent ? acCurrent : null,
												currentPhaseA: currentPhaseA ? currentPhaseA : null,
												currentPhaseB: currentPhaseB ? currentPhaseB : null,
												currentPhaseC: currentPhaseC ? currentPhaseC : null,
												voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
												voltagePhaseB: voltagePhaseB ? voltagePhaseB : null,
												voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
												activePower: activePower ? activePower : null,
												powerFrequency: powerFrequency ? powerFrequency : null,
												apparentPower: apparentPower ? apparentPower : null,
												reactivePower: reactivePower ? reactivePower : null,
												powerFactor: powerFactor ? powerFactor : null,
												activeEnergy: activeEnergy ? activeEnergy : null,
												dcCurrent: dcCurrent ? dcCurrent : null,
												dcVoltage: dcVoltage ? dcVoltage : null,
												dcPower: dcPower ? dcPower : null,
												cabinetTemperature: cabinetTemperature ? cabinetTemperature : null,
												mppt1Current: mppt1Current ? mppt1Current : null,
												mppt1Voltage: mppt1Voltage ? mppt1Voltage : null,
												mppt1Power: mppt1Power ? mppt1Power : null,
												mppt2Current: mppt2Current ? mppt2Current : null,
												mppt2Voltage: mppt2Voltage ? mppt2Voltage : null,
												mppt2Power: mppt2Power ? mppt2Power : null,
												mppt3Current: mppt3Current ? mppt3Current : null,
												mppt3Voltage: mppt3Voltage ? mppt3Voltage : null,
												mppt3Power: mppt3Power ? mppt3Power : null,
												mppt4Current: mppt4Current ? mppt4Current : null,
												mppt4Voltage: mppt4Voltage ? mppt4Voltage : null,
												mppt4Power: mppt4Power ? mppt4Power : null,
												mppt5Current: mppt5Current ? mppt5Current : null,
												mppt5Voltage: mppt5Voltage ? mppt5Voltage : null,
												mppt5Power: mppt5Power ? mppt5Power : null,
												mppt6Current: mppt6Current ? mppt6Current : null,
												mppt6Voltage: mppt6Voltage ? mppt6Voltage : null,
												mppt6Power: mppt6Power ? mppt6Power : null,
												mppt7Current: mppt7Current ? mppt7Current : null,
												mppt7Voltage: mppt7Voltage ? mppt7Voltage : null,
												mppt7Power: mppt7Power ? mppt7Power : null,
												mppt8Current: mppt8Current ? mppt8Current : null,
												mppt8Voltage: mppt8Voltage ? mppt8Voltage : null,
												mppt8Power: mppt8Power ? mppt8Power : null,
												mppt9Current: mppt9Current ? mppt9Current : null,
												mppt9Voltage: mppt9Voltage ? mppt9Voltage : null,
												mppt9Power: mppt9Power ? mppt9Power : null,
												mppt10Current: mppt10Current ? mppt10Current : null,
												mppt10Voltage: mppt10Voltage ? mppt10Voltage : null,
												mppt10Power: mppt10Power ? mppt10Power : null,
												mppt11Current: mppt11Current ? mppt11Current : null,
												mppt11Voltage: mppt11Voltage ? mppt11Voltage : null,
												mppt11Power: mppt11Power ? mppt11Power : null,
												mppt12Current: mppt12Current ? mppt12Current : null,
												mppt12Voltage: mppt12Voltage ? mppt12Voltage : null,
												mppt12Power: mppt12Power ? mppt12Power : null
											};
											return acc;
										}, {}));

										dataDevice[i].data = dataEnergy5;
										break;
									case 'model_emeter_Vinasino_VSE3T5':
										dataEnergy5 = Object.values([...arrTime5, ...dataEnergy].reduce((acc, {
											time_format, time_full, categories_time,
											activeEnergy,
											activeEnergyRate1,
											activeEnergyRate2,
											activeEnergyRate3,
											reactiveEnergyInductive,
											reactiveEnergyInductiveRate1,
											reactiveEnergyInductiveRate2,
											reactiveEnergyInductiveRate3,
											reactiveEnergyCapacitive,
											reactiveEnergyCapacitiveRate1,
											reactiveEnergyCapacitiveRate2,
											reactiveEnergyCapacitiveRate3,
											currentPhaseA,
											currentPhaseB,
											currentPhaseC,
											voltagePhaseA,
											voltagePhaseB,
											voltagePhaseC,
											powerFrequency,
											activePower,
											reactivePower,
											powerFactor,
											activePowerPhaseA,
											activePowerPhaseB,
											activePowerPhaseC,
											reactivePowerPhaseA,
											reactivePowerPhaseB,
											reactivePowerPhaseC,
											activePowerMaxDemand,
											activePowerMaxDemandRate1,
											activePowerMaxDemandRate2,
											activePowerMaxDemandRate3,
											powerFactorPhaseA,
											powerFactorPhaseB,
											powerFactorPhaseC,
											CTratioPrimary,
											CTratioSecondary,
											PTratioPrimary,
											PTratioSecondary
										}) => {
											acc[time_full] = {
												time_format: time_format ? time_format : acc[time_full].time_format,
												time_full: time_full ? time_full : acc[time_full].time_full,
												categories_time: categories_time ? categories_time : acc[time_full].categories_time,
												activeEnergy: activeEnergy ? activeEnergy : null,
												activeEnergyRate1: activeEnergyRate1 ? activeEnergyRate1 : null,
												activeEnergyRate2: activeEnergyRate2 ? activeEnergyRate2 : null,
												activeEnergyRate3: activeEnergyRate3 ? activeEnergyRate3 : null,
												reactiveEnergyInductive: reactiveEnergyInductive ? reactiveEnergyInductive : null,
												reactiveEnergyInductiveRate1: reactiveEnergyInductiveRate1 ? reactiveEnergyInductiveRate1 : null,
												reactiveEnergyInductiveRate2: reactiveEnergyInductiveRate2 ? reactiveEnergyInductiveRate2 : null,
												reactiveEnergyInductiveRate3: reactiveEnergyInductiveRate3 ? reactiveEnergyInductiveRate3 : null,
												reactiveEnergyCapacitive: reactiveEnergyCapacitiveRate3 ? reactiveEnergyCapacitiveRate3 : null,
												reactiveEnergyCapacitiveRate1: reactiveEnergyCapacitiveRate1 ? reactiveEnergyCapacitiveRate1 : null,
												reactiveEnergyCapacitiveRate2: reactiveEnergyCapacitiveRate2 ? reactiveEnergyCapacitiveRate2 : null,
												reactiveEnergyCapacitiveRate3: reactiveEnergyCapacitiveRate3 ? reactiveEnergyCapacitiveRate3 : null,
												currentPhaseA: currentPhaseA ? currentPhaseA : null,
												currentPhaseB: currentPhaseB ? currentPhaseB : null,
												currentPhaseC: currentPhaseC ? currentPhaseC : null,
												voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
												voltagePhaseB: voltagePhaseB ? voltagePhaseB : null,
												voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
												powerFrequency: powerFrequency ? powerFrequency : null,
												activePower: activePower ? activePower : null,
												reactivePower: reactivePower ? reactivePower : null,
												powerFactor: powerFactor ? powerFactor : null,
												activePowerPhaseA: activePowerPhaseA ? activePowerPhaseA : null,
												activePowerPhaseB: activePowerPhaseB ? activePowerPhaseB : null,
												activePowerPhaseC: activePowerPhaseC ? activePowerPhaseC : null,
												reactivePowerPhaseA: reactivePowerPhaseA ? reactivePowerPhaseA : null,
												reactivePowerPhaseB: reactivePowerPhaseB ? reactivePowerPhaseB : null,
												reactivePowerPhaseC: reactivePowerPhaseC ? reactivePowerPhaseC : null,
												activePowerMaxDemand: activePowerMaxDemand ? activePowerMaxDemand : null,
												activePowerMaxDemandRate1: activePowerMaxDemandRate1 ? activePowerMaxDemandRate1 : null,
												activePowerMaxDemandRate2: activePowerMaxDemandRate2 ? activePowerMaxDemandRate2 : null,
												activePowerMaxDemandRate3: activePowerMaxDemandRate3 ? activePowerMaxDemandRate3 : null,
												powerFactorPhaseA: powerFactorPhaseA ? powerFactorPhaseA : null,
												powerFactorPhaseB: powerFactorPhaseB ? powerFactorPhaseB : null,
												powerFactorPhaseC: powerFactorPhaseC ? powerFactorPhaseC : null,
												CTratioPrimary: CTratioPrimary ? CTratioPrimary : null,
												CTratioSecondary: CTratioSecondary ? CTratioSecondary : null,
												PTratioPrimary: PTratioPrimary ? PTratioPrimary : null,
												PTratioSecondary: PTratioSecondary ? PTratioSecondary : null
											};
											return acc;
										}, {}));

										dataDevice[i].data = dataEnergy5;
										break;
								}

								break;
							case 'this_month':
							case 'last_month':
							case '12_month':
							case 'lifetime':
								dataDevice[i].data = dataEnergy;
								break;
						}
						data.push(dataDevice[i]);
					}

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
	* get detail project page Client Analytics
	* @param {*} data 
	* @param {*} callBack 
	*/

	getChartAlarm(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForObject("ClientAnalytics.getDetail", param);
					if (!rs) {
						conn.rollback();
						callBack(true, {});
						return;
					}

					// Total Fleet Alerts
					param.id_project = rs.id;
					rs.totalFleetAlarm = await db.queryForList("ClientAnalytics.totalFleetAlarm", param);

					rs.alarmOPened = await db.queryForList("ClientAnalytics.alarmOPened", param);
					var alarmLast12Month = await db.queryForList("ClientAnalytics.alarmLast12Month", param);

					var dataAlarmMonth = [];
					for (let i = 11; i >= 0; i--) {
						dataAlarmMonth.push({
							time_full: moment().add(-i, 'M').format('MM/YYYY'),
							total_alarm: 0
						})
					}
					dataAlarmMonth = Object.values([...dataAlarmMonth, ...alarmLast12Month].reduce((acc, { time_full, total_alarm }) => {
						acc[time_full] = {
							time_full,
							total_alarm: (acc[time_full] ? acc[time_full].total_alarm : 0) + total_alarm,
						};
						return acc;
					}, {}));

					rs.alarmLast12Month = dataAlarmMonth;
					conn.commit();
					callBack(false, rs);
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
}
export default ClientAnalyticsService;
