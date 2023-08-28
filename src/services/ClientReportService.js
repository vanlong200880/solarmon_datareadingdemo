import BaseService from './BaseService';
import moment from 'moment';
class ClientReportService extends BaseService {
	constructor() {
		super();

	}


	/**
	* get detail project page Client Analytics
	* @param {*} data 
	* @param {*} callBack 
	*/
	getDataDailyReportEmail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var listUser = await db.queryForList("ClientReport.getListUserDailyReport", {});

					if(listUser.length > 0){
						// Get list alarm by ids_project
						for (var i = 0; i < listUser.length; i++) {
							var alerts = [];
							if(!Libs.isBlank(listUser[i].ids_project)){
								var idsProjectString = listUser[i].ids_project;
								var idsProject = idsProjectString.split(",");
								if(idsProject.length > 0){
									alerts = await db.queryForList("ClientReport.getAlertsDailyReport", {idsProject});
								}				
							}
							listUser[i].alerts = alerts;
						}
					}

					conn.commit();
					callBack(false, listUser);
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
	getDataReportMonthEmail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var data = [];
					var listProject = await db.queryForList("ClientReport.getListProject", {});
					var itemProject = {};
					if (listProject.length > 0) {
						for (var i = 0; i < listProject.length; i++) {
							itemProject = listProject[i];

							// Get data group inverter
							var dataGroupInverter = await db.queryForList("ClientReport.getDataGroupInverter", itemProject);

							var groupInverter = [];
							if (dataGroupInverter.length > 0) {
								for (let i = 0, len = dataGroupInverter.length; i < len; i++) {
									groupInverter.push(
										{
											hash_id: itemProject.hash_id,
											id_device_group: dataGroupInverter[i].id_device_group,
											table_name: dataGroupInverter[i].table_name
										}
									);
								}
							}

							var dataEnergyMonth = [];
							if (!Libs.isBlank(itemProject.last_day)) {
								for (let i = 1; i <= parseInt(itemProject.last_day); i++) {
									dataEnergyMonth.push({
										time_format: '',
										time_full: '',
										category_time_format: '',
										last_day: '',
										day: i,
										activePower: 0,
										activeEnergy: 0,
										max_activeEnergy: 0,
										min_activeEnergy: 0
									});
								}
							}

							// get data energy by month
							if (groupInverter.length > 0) {
								var dataEnergy = await db.queryForList("ClientReport.dataEnergyMonthEmail", { groupInverter });
								if (dataEnergy) {
									dataEnergyMonth = Object.values([...dataEnergyMonth, ...dataEnergy].reduce((acc, { time_format, time_full, category_time_format, last_day, day, activePower, activeEnergy, max_activeEnergy, min_activeEnergy }) => {
										acc[day] = {
											time_format,
											time_full,
											category_time_format,
											last_day,
											day,
											activePower,
											activeEnergy,
											max_activeEnergy,
											min_activeEnergy
										};
										return acc;
									}, {}));
								}
								itemProject.dataEnergyMonth = dataEnergyMonth;

								let energyMonth = dataEnergyMonth.reduce(function (a, b) {
									return {
										activeEnergy: a.activeEnergy + b.activeEnergy,
										max_activeEnergy: Libs.roundNumber((a.max_activeEnergy + b.max_activeEnergy), 1),
										min_activeEnergy: Libs.roundNumber((a.min_activeEnergy + b.min_activeEnergy), 1)
									};
								});

								itemProject.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy : 0;
								itemProject.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy : 0;
								itemProject.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy : 0;
								itemProject.revenue = Libs.formatNum((energyMonth.activeEnergy * itemProject.config_revenue), '#,###');

							}

							// Get list alert
							var alerts = await db.queryForList("ClientReport.getDataAlertReportMonth", itemProject);
							itemProject.alerts = alerts;
							data.push(itemProject);

						}
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
	getDataReportYearEmail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var data = [];

					var year = moment().format('YYYY');
					var startDateOfTheYear = moment([year]).format('YYYY-MM-DD hh:mm:ss');
					var endDateOfTheYear = moment([year]).endOf('year').format('YYYY-MM-DD hh:mm:ss');
					param.start_date = startDateOfTheYear;
					param.end_date = endDateOfTheYear;
					var listProject = await db.queryForList("ClientReport.getListProjectYearEmail", param);
					var itemProject = {};

					if (listProject.length > 0) {
						for (var i = 0; i < listProject.length; i++) {
							itemProject = listProject[i];
							itemProject.start_date = startDateOfTheYear;
							itemProject.end_date = endDateOfTheYear;

							// Get data group inverter
							var dataGroupInverter = await db.queryForList("ClientReport.getDataGroupInverter", itemProject);
							var groupInverter = [];
							if (dataGroupInverter.length > 0) {
								for (let i = 0, len = dataGroupInverter.length; i < len; i++) {
									groupInverter.push(
										{
											hash_id: itemProject.hash_id,
											id_device_group: dataGroupInverter[i].id_device_group,
											start_date: itemProject.start_date,
											end_date: itemProject.end_date,
											table_name: dataGroupInverter[i].table_name
										}
									);
								}
							}

							var getTotalFeetAlarms = await db.queryForList("ClientReport.getTotalFeetAlarms", itemProject);
							itemProject.totalFeetAlarms = getTotalFeetAlarms;

							// get data alerts
							var alerts = await db.queryForList("ClientReport.getListAlarmYearEmail", itemProject);
							var dataAlerts = [];
							for (let i = 11; i >= 0; i--) {
								dataAlerts.push({
									time_full: moment(itemProject.end_date).add(-i, 'M').format('MM/YYYY'),
									total_alarm: 0
								})
							}
							dataAlerts = Object.values([...dataAlerts, ...alerts].reduce((acc, { time_full, total_alarm }) => {
								acc[time_full] = {
									time_full,
									total_alarm: (acc[time_full] ? acc[time_full].total_alarm : 0) + total_alarm,
								};
								return acc;
							}, {}));

							itemProject.dataAlerts = dataAlerts;


							// Get data energy
							var dataConfigEstimate = await db.queryForObject("ClientReport.getConfigEstimate", itemProject);
							var dataEnergyMonth = [];
							if (!Libs.isBlank(itemProject.last_day)) {
								for (let i = 1; i <= parseInt(12); i++) {
									var estimate_energy = null;
									if (dataConfigEstimate) {
										switch (i) {
											case 1:
												estimate_energy = dataConfigEstimate['jan'];
												break;
											case 2:
												estimate_energy = dataConfigEstimate['feb'];
												break;
											case 3:
												estimate_energy = dataConfigEstimate['mar'];
												break;
											case 4:
												estimate_energy = dataConfigEstimate['apr'];
												break;
											case 5:
												estimate_energy = dataConfigEstimate['may'];
												break;
											case 6:
												estimate_energy = dataConfigEstimate['jun'];
												break;
											case 7:
												estimate_energy = dataConfigEstimate['jul'];
												break;
											case 8:
												estimate_energy = dataConfigEstimate['aug'];
												break;
											case 9:
												estimate_energy = dataConfigEstimate['sep'];
												break;
											case 10:
												estimate_energy = dataConfigEstimate['oct'];
												break;
											case 11:
												estimate_energy = dataConfigEstimate['nov'];
												break;
											case 12:
												estimate_energy = dataConfigEstimate['dec'];
												break;
										}
									}
									dataEnergyMonth.push({
										time_format: '',
										time_full: (i < 10 ? '0' + i : i) + "/" + itemProject.year,
										category_time_format: '',
										last_day: '',
										month: i,
										activePower: null,
										activeEnergy: 0,
										estimate_energy: estimate_energy,
										month_str: null,
										diff_energy: null,
										diff_percent: null,
										sum_activeEnergy: null,
										sum_estimate_energy: null,
										sum_diff_energy: null,
										sum_diff_percent: null

									});
								}
							}


							var dataEnergy = await db.queryForList("ClientReport.dataEnergyYear", { groupInverter });

							if (dataEnergy) {
								dataEnergyMonth = Object.values([...dataEnergyMonth, ...dataEnergy].reduce((acc, { time_format, time_full, category_time_format, month, activePower, activeEnergy, month_str, estimate_energy }) => {
									acc[month] = {
										time_format,
										time_full,
										category_time_format,
										month,
										activePower,
										activeEnergy,
										month_str,
										estimate_energy: (acc[month] ? acc[month].estimate_energy : 0) + estimate_energy,
									};
									return acc;
								}, {}));
							}

							var totalEnergy = 0, pr = 0, totalEstimate = 0;

							if (Libs.isArrayData(dataEnergyMonth)) {
								var length = 0;
								if (itemProject.year == moment().format('YYYY')) {
									length = moment().format('MM');
								} else {
									length = dataEnergyMonth.length
								}



								for (let j = 0, len = dataEnergyMonth.length; j < len; j++) {
									totalEnergy = totalEnergy + dataEnergyMonth[j].activeEnergy;
									totalEstimate = totalEstimate + dataEnergyMonth[j].estimate_energy;
									if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
										let diffEnergy = dataEnergyMonth[j].activeEnergy - dataEnergyMonth[j].estimate_energy;
										dataEnergyMonth[j].diff_energy = Libs.roundNumber(diffEnergy, 0);
										dataEnergyMonth[j].diff_percent = Libs.roundNumber((diffEnergy / dataEnergyMonth[j].activeEnergy) * 100, 1);
									} else {
										dataEnergyMonth[j].diff_energy = null;
										dataEnergyMonth[j].diff_percent = null;
									}

									// Tinh tich luy
									if (j == 0) {
										dataEnergyMonth[j].sum_activeEnergy = dataEnergyMonth[j].activeEnergy;
										dataEnergyMonth[j].sum_estimate_energy = dataEnergyMonth[j].estimate_energy;

										if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
											let diffEnergy = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
											dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(diffEnergy, 0);
											dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber((diffEnergy / dataEnergyMonth[j].activeEnergy) * 100, 1);
										} else {
											dataEnergyMonth[j].sum_diff_energy = null;
											dataEnergyMonth[j].sum_diff_percent = null;
										}
									} else {
										dataEnergyMonth[j].sum_activeEnergy = (dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy) == 0 ? 0 : Libs.roundNumber((dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy), 0);
										dataEnergyMonth[j].sum_estimate_energy = (dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy) == 0 ? 0 : Libs.roundNumber((dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy), 0);
										if (!Libs.isBlank(dataEnergyMonth[j].sum_estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].sum_activeEnergy) && dataEnergyMonth[j].sum_estimate_energy > 0 && dataEnergyMonth[j].sum_activeEnergy > 0) {


											let diffEnergy = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
											dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(diffEnergy, 0);
											dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber((diffEnergy / dataEnergyMonth[j].sum_activeEnergy) * 100, 1);
										} else {
											dataEnergyMonth[j].sum_diff_energy = null;
											dataEnergyMonth[j].sum_diff_percent = null;
										}

									}
								}
							}

							itemProject.totalEnergy = Libs.roundNumber(totalEnergy, 1);
							itemProject.totalEstimate = Libs.roundNumber(totalEstimate, 1);
							itemProject.pr = Libs.roundNumber(totalEnergy / totalEstimate, 2);
							itemProject.dataEnergyMonth = dataEnergyMonth;
							data.push(itemProject);


							// var groupInverter = [];
							// if (dataGroupInverter.length > 0) {
							// 	for (let i = 0, len = dataGroupInverter.length; i < len; i++) {
							// 		groupInverter.push(
							// 			{
							// 				hash_id: itemProject.hash_id,
							// 				id_device_group: dataGroupInverter[i].id_device_group,
							// 				table_name: dataGroupInverter[i].table_name
							// 			}
							// 		);
							// 	}
							// }

							// var dataEnergyMonth = [];
							// if (!Libs.isBlank(itemProject.last_day)) {
							// 	for (let i = 1; i <= parseInt(itemProject.last_day); i++) {
							// 		dataEnergyMonth.push({
							// 			time_format: '',
							// 			time_full: '',
							// 			category_time_format: '',
							// 			last_day: '',
							// 			day: i,
							// 			activePower: 0,
							// 			activeEnergy: 0,
							// 			max_activeEnergy: 0,
							// 			min_activeEnergy: 0
							// 		});
							// 	}
							// }

							// // get data energy by month
							// if (groupInverter.length > 0) {
							// 	var dataEnergy = await db.queryForList("ClientReport.dataEnergyMonthEmail", { groupInverter });
							// 	if (dataEnergy) {
							// 		dataEnergyMonth = Object.values([...dataEnergyMonth, ...dataEnergy].reduce((acc, { time_format, time_full, category_time_format, last_day, day, activePower, activeEnergy, max_activeEnergy, min_activeEnergy }) => {
							// 			acc[day] = {
							// 				time_format,
							// 				time_full,
							// 				category_time_format,
							// 				last_day,
							// 				day,
							// 				activePower,
							// 				activeEnergy,
							// 				max_activeEnergy,
							// 				min_activeEnergy
							// 			};
							// 			return acc;
							// 		}, {}));
							// 	}
							// 	itemProject.dataEnergyMonth = dataEnergyMonth;

							// 	let energyMonth = dataEnergyMonth.reduce(function (a, b) {
							// 		return {
							// 			activeEnergy: a.activeEnergy + b.activeEnergy,
							// 			max_activeEnergy: Libs.roundNumber((a.max_activeEnergy + b.max_activeEnergy), 1),
							// 			min_activeEnergy: Libs.roundNumber((a.min_activeEnergy + b.min_activeEnergy), 1)
							// 		};
							// 	});

							// 	itemProject.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy: 0;
							// 	itemProject.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy: 0;
							// 	itemProject.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy: 0;
							// 	itemProject.revenue = Libs.formatNum((energyMonth.activeEnergy * itemProject.config_revenue), '#,###');

							// }

							// // Get list alert
							// var alerts = await db.queryForList("ClientReport.getDataAlertReportMonth", itemProject);
							// itemProject.alerts = alerts;
							// data.push(itemProject);

						}
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

	getDataReportMonth(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					param.start_date = Libs.convertAllFormatDate(param.start_date);
					param.end_date = Libs.convertAllFormatDate(param.end_date);
					var rs = await db.queryForList("ClientReport.getDataReportMonth", param);
					if (!rs) {
						conn.rollback();
						callBack(true, {});
						return;
					}

					var data = rs[0][0];
					var groupInverter = [];
					var getGroupInverter = rs[1];
					if (getGroupInverter.length > 0) {
						for (let i = 0, len = getGroupInverter.length; i < len; i++) {
							groupInverter.push(
								{
									hash_id: param.hash_id,
									id_device_group: getGroupInverter[i].id_device_group,
									start_date: param.start_date,
									end_date: param.end_date,
									table_name: getGroupInverter[i].table_name
								}
							);
						}
					}

					var dataEnergyMonth = [];
					if (!Libs.isBlank(data.last_day)) {
						for (let i = 1; i <= parseInt(data.last_day); i++) {
							dataEnergyMonth.push({
								time_format: '',
								time_full: '',
								category_time_format: '',
								last_day: '',
								day: i,
								activePower: 0,
								activeEnergy: 0,
								max_activeEnergy: 0,
								min_activeEnergy: 0
							});
						}
					}

					var dataEnergy = await db.queryForList("ClientReport.dataEnergyMonth", { groupInverter });

					if (dataEnergy) {
						dataEnergyMonth = Object.values([...dataEnergyMonth, ...dataEnergy].reduce((acc, { time_format, time_full, category_time_format, last_day, day, activePower, activeEnergy, max_activeEnergy, min_activeEnergy }) => {
							acc[day] = {
								time_format,
								time_full,
								category_time_format,
								last_day,
								day,
								activePower,
								activeEnergy,
								max_activeEnergy,
								min_activeEnergy
							};
							return acc;
						}, {}));
					}

					let energyMonth = dataEnergyMonth.reduce(function (a, b) {
						return {
							activeEnergy: a.activeEnergy + b.activeEnergy,
							max_activeEnergy: Libs.roundNumber((a.max_activeEnergy + b.max_activeEnergy), 1),
							min_activeEnergy: Libs.roundNumber((a.min_activeEnergy + b.min_activeEnergy), 1)
						};
					});

					data.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy : 0;
					data.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy : 0;
					data.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy : 0;
					data.revenue = Libs.formatNum((energyMonth.activeEnergy * data.config_revenue), '#,###');


					data.dataEnergyMonth = dataEnergyMonth;
					data.alarmOPened = rs[2];
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

	getDataReportYear(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					// if (param.type == 1) {
					// 	var year = param.end_date.substr(-4);
					// 	var startDateOfTheYear = moment([year]).format('YYYY-MM-DD hh:mm:ss');
					// 	var endDateOfTheYear = moment([year]).endOf('year').format('YYYY-MM-DD hh:mm:ss');
					// 	param.start_date = startDateOfTheYear;
					// 	param.end_date = endDateOfTheYear;
					// } else {
					// 	param.start_date = Libs.convertAllFormatDate(param.start_date);
					// 	param.end_date = Libs.convertAllFormatDate(param.end_date);
					// }

					param.start_date = Libs.convertAllFormatDate(param.start_date);
					param.end_date = Libs.convertAllFormatDate(param.end_date);
					var startDate = param.start_date;
					var endDate = param.end_date;
					var months = moment(endDate).diff(startDate, 'months');

					var rs = await db.queryForList("ClientReport.getDataReportYear", param);
					if (!rs) {
						conn.rollback();
						callBack(true, {});
						return;
					}

					var data = rs[0][0];
					var groupInverter = [];
					var getGroupInverter = rs[1];
					if (getGroupInverter.length > 0) {
						for (let i = 0, len = getGroupInverter.length; i < len; i++) {
							groupInverter.push(
								{
									hash_id: param.hash_id,
									id_device_group: getGroupInverter[i].id_device_group,
									start_date: param.start_date,
									end_date: param.end_date,
									table_name: getGroupInverter[i].table_name
								}
							);
						}
					}


					data.totalFeetAlarms = rs[2];
					var dataAlarms = rs[3];
					var dataAlerts = [];

					for (let i = 0; i <= parseInt(months); i++) {
						dataAlerts.push({
							time_full: moment(param.start_date).add( i , 'M').format('MM/YYYY'),
							total_alarm: 0
						})
					}

					dataAlerts = Object.values([...dataAlerts, ...dataAlarms].reduce((acc, { time_full, total_alarm }) => {
						acc[time_full] = {
							time_full,
							total_alarm: (acc[time_full] ? acc[time_full].total_alarm : 0) + total_alarm,
						};
						return acc;
					}, {}));

					data.dataAlarms = dataAlerts;



					var dataConfigEstimate = rs[4].length > 0 ? rs[4][0] : {};
					var dataEnergyMonth = [];


					if (!Libs.isBlank(data.last_day)) {
						for (let i = 0; i <= parseInt(months); i++) {
							var estimate_energy = null;
							var n = (i + 1);
							if (dataConfigEstimate) {
								switch (n) {
									case 1:
										estimate_energy = dataConfigEstimate['jan'];
										break;
									case 2:
										estimate_energy = dataConfigEstimate['feb'];
										break;
									case 3:
										estimate_energy = dataConfigEstimate['mar'];
										break;
									case 4:
										estimate_energy = dataConfigEstimate['apr'];
										break;
									case 5:
										estimate_energy = dataConfigEstimate['may'];
										break;
									case 6:
										estimate_energy = dataConfigEstimate['jun'];
										break;
									case 7:
										estimate_energy = dataConfigEstimate['jul'];
										break;
									case 8:
										estimate_energy = dataConfigEstimate['aug'];
										break;
									case 9:
										estimate_energy = dataConfigEstimate['sep'];
										break;
									case 10:
										estimate_energy = dataConfigEstimate['oct'];
										break;
									case 11:
										estimate_energy = dataConfigEstimate['nov'];
										break;
									case 12:
										estimate_energy = dataConfigEstimate['dec'];
										break;
								}
							}

							dataEnergyMonth.push({
								time_format: '',
								time_full: moment(param.start_date).add( i , 'M').format('MM/YYYY'),
								category_time_format: '',
								last_day: '',
								month: moment(param.start_date).add( i , 'M').format('MM/YYYY'),
								activePower: null,
								activeEnergy: 0,
								estimate_energy: estimate_energy,
								month_str: null,
								diff_energy: null,
								diff_percent: null,
								sum_activeEnergy: null,
								sum_estimate_energy: null,
								sum_diff_energy: null,
								sum_diff_percent: null,
								max_activeEnergy: 0,
								min_activeEnergy: 0

							});
						}
					}


					var dataEnergy = await db.queryForList("ClientReport.dataEnergyYear", { groupInverter });

					if (dataEnergy) {
						dataEnergyMonth = Object.values([...dataEnergyMonth, ...dataEnergy].reduce((acc, { time_format, time_full, category_time_format, month, activePower, activeEnergy, month_str, estimate_energy, max_activeEnergy, min_activeEnergy }) => {
							acc[time_full] = {
								time_format,
								time_full,
								category_time_format,
								month,
								activePower,
								activeEnergy,	
								month_str,
								estimate_energy: (acc[time_full] ? acc[time_full].estimate_energy : 0) + estimate_energy,
								max_activeEnergy,
								min_activeEnergy
							};
							return acc;
						}, {}));
					}

					if (Libs.isArrayData(dataEnergyMonth)) {
						for (let j = 0, len = dataEnergyMonth.length; j < len; j++) {
							if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
								let diffEnergy = dataEnergyMonth[j].activeEnergy - dataEnergyMonth[j].estimate_energy;
								dataEnergyMonth[j].diff_energy = Libs.roundNumber(diffEnergy, 0);
								dataEnergyMonth[j].diff_percent = Libs.roundNumber((diffEnergy / dataEnergyMonth[j].activeEnergy) * 100, 1);
							} else {
								dataEnergyMonth[j].diff_energy = null;
								dataEnergyMonth[j].diff_percent = null;
							}

							// Tinh tich luy
							if (j == 0) {
								dataEnergyMonth[j].sum_activeEnergy = dataEnergyMonth[j].activeEnergy;
								dataEnergyMonth[j].sum_estimate_energy = dataEnergyMonth[j].estimate_energy;

								if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
									let diffEnergy = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
									dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(diffEnergy, 0);
									dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber((diffEnergy / dataEnergyMonth[j].activeEnergy) * 100, 1);
								} else {
									dataEnergyMonth[j].sum_diff_energy = null;
									dataEnergyMonth[j].sum_diff_percent = null;
								}
							} else {
								dataEnergyMonth[j].sum_activeEnergy = (dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy) == 0 ? 0 : Libs.roundNumber((dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy), 0);
								dataEnergyMonth[j].sum_estimate_energy = (dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy) == 0 ? 0 : Libs.roundNumber((dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy), 0);
								if (!Libs.isBlank(dataEnergyMonth[j].sum_estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].sum_activeEnergy) && dataEnergyMonth[j].sum_estimate_energy > 0 && dataEnergyMonth[j].sum_activeEnergy > 0) {


									let diffEnergy = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
									dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(diffEnergy, 0);
									dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber((diffEnergy / dataEnergyMonth[j].sum_activeEnergy) * 100, 1);
								} else {
									dataEnergyMonth[j].sum_diff_energy = null;
									dataEnergyMonth[j].sum_diff_percent = null;
								}

							}
						}
					}


					let energyMonth = dataEnergyMonth.reduce(function (a, b) {
						return {
							activeEnergy: a.activeEnergy + b.activeEnergy,
							max_activeEnergy: Libs.roundNumber((a.max_activeEnergy + b.max_activeEnergy), 1),
							min_activeEnergy: Libs.roundNumber((a.min_activeEnergy + b.min_activeEnergy), 1)
						};
					});

					data.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy : 0;
					data.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy : 0;
					data.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy : 0;
					data.revenue = Libs.formatNum((energyMonth.activeEnergy * data.config_revenue), '#,###');


					data.dataEnergyMonth = dataEnergyMonth;

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

}
export default ClientReportService;
