'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require('./BaseService');

var _BaseService3 = _interopRequireDefault(_BaseService2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClientReportService = function (_BaseService) {
	_inherits(ClientReportService, _BaseService);

	function ClientReportService() {
		_classCallCheck(this, ClientReportService);

		return _possibleConstructorReturn(this, (ClientReportService.__proto__ || Object.getPrototypeOf(ClientReportService)).call(this));
	}

	/**
 * get detail project page Client Analytics
 * @param {*} data 
 * @param {*} callBack 
 */


	_createClass(ClientReportService, [{
		key: 'getDataDailyReportEmail',
		value: function getDataDailyReportEmail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var listUser = await db.queryForList("ClientReport.getListUserDailyReport", {});

						if (listUser.length > 0) {
							// Get list alarm by ids_project
							for (var i = 0; i < listUser.length; i++) {
								var alerts = [];
								if (!Libs.isBlank(listUser[i].ids_project)) {
									var idsProjectString = listUser[i].ids_project;
									var idsProject = idsProjectString.split(",");
									if (idsProject.length > 0) {
										alerts = await db.queryForList("ClientReport.getAlertsDailyReport", { idsProject: idsProject });
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

	}, {
		key: 'getDataReportMonthEmail',
		value: function getDataReportMonthEmail(param, callBack) {
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
									for (var _i = 0, len = dataGroupInverter.length; _i < len; _i++) {
										groupInverter.push({
											hash_id: itemProject.hash_id,
											id_device_group: dataGroupInverter[_i].id_device_group,
											table_name: dataGroupInverter[_i].table_name
										});
									}
								}

								var dataEnergyMonth = [];
								if (!Libs.isBlank(itemProject.last_day)) {
									for (var _i2 = 1; _i2 <= parseInt(itemProject.last_day); _i2++) {
										dataEnergyMonth.push({
											time_format: '',
											time_full: '',
											category_time_format: '',
											last_day: '',
											day: _i2,
											activePower: 0,
											activeEnergy: 0,
											max_activeEnergy: 0,
											min_activeEnergy: 0
										});
									}
								}

								// get data energy by month
								if (groupInverter.length > 0) {
									var dataEnergy = await db.queryForList("ClientReport.dataEnergyMonthEmail", { groupInverter: groupInverter });
									if (dataEnergy) {
										dataEnergyMonth = Object.values([].concat(_toConsumableArray(dataEnergyMonth), _toConsumableArray(dataEnergy)).reduce(function (acc, _ref) {
											var time_format = _ref.time_format,
											    time_full = _ref.time_full,
											    category_time_format = _ref.category_time_format,
											    last_day = _ref.last_day,
											    day = _ref.day,
											    activePower = _ref.activePower,
											    activeEnergy = _ref.activeEnergy,
											    max_activeEnergy = _ref.max_activeEnergy,
											    min_activeEnergy = _ref.min_activeEnergy;

											acc[day] = {
												time_format: time_format,
												time_full: time_full,
												category_time_format: category_time_format,
												last_day: last_day,
												day: day,
												activePower: activePower,
												activeEnergy: activeEnergy,
												max_activeEnergy: max_activeEnergy,
												min_activeEnergy: min_activeEnergy
											};
											return acc;
										}, {}));
									}
									itemProject.dataEnergyMonth = dataEnergyMonth;

									var energyMonth = dataEnergyMonth.reduce(function (a, b) {
										return {
											activeEnergy: a.activeEnergy + b.activeEnergy,
											max_activeEnergy: Libs.roundNumber(a.max_activeEnergy + b.max_activeEnergy, 1),
											min_activeEnergy: Libs.roundNumber(a.min_activeEnergy + b.min_activeEnergy, 1)
										};
									});

									itemProject.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy : 0;
									itemProject.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy : 0;
									itemProject.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy : 0;
									itemProject.revenue = Libs.formatNum(energyMonth.activeEnergy * itemProject.config_revenue, '#,###');
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

	}, {
		key: 'getDataReportYearEmail',
		value: function getDataReportYearEmail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var data = [];

						var year = (0, _moment2.default)().format('YYYY');
						var startDateOfTheYear = (0, _moment2.default)([year]).format('YYYY-MM-DD hh:mm:ss');
						var endDateOfTheYear = (0, _moment2.default)([year]).endOf('year').format('YYYY-MM-DD hh:mm:ss');
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
									for (var _i3 = 0, len = dataGroupInverter.length; _i3 < len; _i3++) {
										groupInverter.push({
											hash_id: itemProject.hash_id,
											id_device_group: dataGroupInverter[_i3].id_device_group,
											start_date: itemProject.start_date,
											end_date: itemProject.end_date,
											table_name: dataGroupInverter[_i3].table_name
										});
									}
								}

								var getTotalFeetAlarms = await db.queryForList("ClientReport.getTotalFeetAlarms", itemProject);
								itemProject.totalFeetAlarms = getTotalFeetAlarms;

								// get data alerts
								var alerts = await db.queryForList("ClientReport.getListAlarmYearEmail", itemProject);
								var dataAlerts = [];
								for (var _i4 = 11; _i4 >= 0; _i4--) {
									dataAlerts.push({
										time_full: (0, _moment2.default)(itemProject.end_date).add(-_i4, 'M').format('MM/YYYY'),
										total_alarm: 0
									});
								}
								dataAlerts = Object.values([].concat(_toConsumableArray(dataAlerts), _toConsumableArray(alerts)).reduce(function (acc, _ref2) {
									var time_full = _ref2.time_full,
									    total_alarm = _ref2.total_alarm;

									acc[time_full] = {
										time_full: time_full,
										total_alarm: (acc[time_full] ? acc[time_full].total_alarm : 0) + total_alarm
									};
									return acc;
								}, {}));

								itemProject.dataAlerts = dataAlerts;

								// Get data energy
								var dataConfigEstimate = await db.queryForObject("ClientReport.getConfigEstimate", itemProject);
								var dataEnergyMonth = [];
								if (!Libs.isBlank(itemProject.last_day)) {
									for (var _i5 = 1; _i5 <= parseInt(12); _i5++) {
										var estimate_energy = null;
										if (dataConfigEstimate) {
											switch (_i5) {
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
											time_full: (_i5 < 10 ? '0' + _i5 : _i5) + "/" + itemProject.year,
											category_time_format: '',
											last_day: '',
											month: _i5,
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

								var dataEnergy = await db.queryForList("ClientReport.dataEnergyYear", { groupInverter: groupInverter });

								if (dataEnergy) {
									dataEnergyMonth = Object.values([].concat(_toConsumableArray(dataEnergyMonth), _toConsumableArray(dataEnergy)).reduce(function (acc, _ref3) {
										var time_format = _ref3.time_format,
										    time_full = _ref3.time_full,
										    category_time_format = _ref3.category_time_format,
										    month = _ref3.month,
										    activePower = _ref3.activePower,
										    activeEnergy = _ref3.activeEnergy,
										    month_str = _ref3.month_str,
										    estimate_energy = _ref3.estimate_energy;

										acc[month] = {
											time_format: time_format,
											time_full: time_full,
											category_time_format: category_time_format,
											month: month,
											activePower: activePower,
											activeEnergy: activeEnergy,
											month_str: month_str,
											estimate_energy: (acc[month] ? acc[month].estimate_energy : 0) + estimate_energy
										};
										return acc;
									}, {}));
								}

								var totalEnergy = 0,
								    pr = 0,
								    totalEstimate = 0;

								if (Libs.isArrayData(dataEnergyMonth)) {
									var length = 0;
									if (itemProject.year == (0, _moment2.default)().format('YYYY')) {
										length = (0, _moment2.default)().format('MM');
									} else {
										length = dataEnergyMonth.length;
									}

									for (var j = 0, _len = dataEnergyMonth.length; j < _len; j++) {
										totalEnergy = totalEnergy + dataEnergyMonth[j].activeEnergy;
										totalEstimate = totalEstimate + dataEnergyMonth[j].estimate_energy;
										if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
											var diffEnergy = dataEnergyMonth[j].activeEnergy - dataEnergyMonth[j].estimate_energy;
											dataEnergyMonth[j].diff_energy = Libs.roundNumber(diffEnergy, 0);
											dataEnergyMonth[j].diff_percent = Libs.roundNumber(diffEnergy / dataEnergyMonth[j].activeEnergy * 100, 1);
										} else {
											dataEnergyMonth[j].diff_energy = null;
											dataEnergyMonth[j].diff_percent = null;
										}

										// Tinh tich luy
										if (j == 0) {
											dataEnergyMonth[j].sum_activeEnergy = dataEnergyMonth[j].activeEnergy;
											dataEnergyMonth[j].sum_estimate_energy = dataEnergyMonth[j].estimate_energy;

											if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
												var _diffEnergy = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
												dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(_diffEnergy, 0);
												dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber(_diffEnergy / dataEnergyMonth[j].activeEnergy * 100, 1);
											} else {
												dataEnergyMonth[j].sum_diff_energy = null;
												dataEnergyMonth[j].sum_diff_percent = null;
											}
										} else {
											dataEnergyMonth[j].sum_activeEnergy = dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy == 0 ? 0 : Libs.roundNumber(dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy, 0);
											dataEnergyMonth[j].sum_estimate_energy = dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy == 0 ? 0 : Libs.roundNumber(dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy, 0);
											if (!Libs.isBlank(dataEnergyMonth[j].sum_estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].sum_activeEnergy) && dataEnergyMonth[j].sum_estimate_energy > 0 && dataEnergyMonth[j].sum_activeEnergy > 0) {

												var _diffEnergy2 = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
												dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(_diffEnergy2, 0);
												dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber(_diffEnergy2 / dataEnergyMonth[j].sum_activeEnergy * 100, 1);
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

	}, {
		key: 'getDataReportMonth',
		value: function getDataReportMonth(param, callBack) {
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
							for (var i = 0, len = getGroupInverter.length; i < len; i++) {
								groupInverter.push({
									hash_id: param.hash_id,
									id_device_group: getGroupInverter[i].id_device_group,
									start_date: param.start_date,
									end_date: param.end_date,
									table_name: getGroupInverter[i].table_name
								});
							}
						}

						var dataEnergyMonth = [];
						if (!Libs.isBlank(data.last_day)) {
							for (var _i6 = 1; _i6 <= parseInt(data.last_day); _i6++) {
								dataEnergyMonth.push({
									time_format: '',
									time_full: '',
									category_time_format: '',
									last_day: '',
									day: _i6,
									activePower: 0,
									activeEnergy: 0,
									max_activeEnergy: 0,
									min_activeEnergy: 0
								});
							}
						}

						var dataEnergy = await db.queryForList("ClientReport.dataEnergyMonth", { groupInverter: groupInverter });

						if (dataEnergy) {
							dataEnergyMonth = Object.values([].concat(_toConsumableArray(dataEnergyMonth), _toConsumableArray(dataEnergy)).reduce(function (acc, _ref4) {
								var time_format = _ref4.time_format,
								    time_full = _ref4.time_full,
								    category_time_format = _ref4.category_time_format,
								    last_day = _ref4.last_day,
								    day = _ref4.day,
								    activePower = _ref4.activePower,
								    activeEnergy = _ref4.activeEnergy,
								    max_activeEnergy = _ref4.max_activeEnergy,
								    min_activeEnergy = _ref4.min_activeEnergy;

								acc[day] = {
									time_format: time_format,
									time_full: time_full,
									category_time_format: category_time_format,
									last_day: last_day,
									day: day,
									activePower: activePower,
									activeEnergy: activeEnergy,
									max_activeEnergy: max_activeEnergy,
									min_activeEnergy: min_activeEnergy
								};
								return acc;
							}, {}));
						}

						var energyMonth = dataEnergyMonth.reduce(function (a, b) {
							return {
								activeEnergy: a.activeEnergy + b.activeEnergy,
								max_activeEnergy: Libs.roundNumber(a.max_activeEnergy + b.max_activeEnergy, 1),
								min_activeEnergy: Libs.roundNumber(a.min_activeEnergy + b.min_activeEnergy, 1)
							};
						});

						data.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy : 0;
						data.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy : 0;
						data.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy : 0;
						data.revenue = Libs.formatNum(energyMonth.activeEnergy * data.config_revenue, '#,###');

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

	}, {
		key: 'getDataReportYear',
		value: function getDataReportYear(param, callBack) {
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
						var months = (0, _moment2.default)(endDate).diff(startDate, 'months');

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
							for (var i = 0, len = getGroupInverter.length; i < len; i++) {
								groupInverter.push({
									hash_id: param.hash_id,
									id_device_group: getGroupInverter[i].id_device_group,
									start_date: param.start_date,
									end_date: param.end_date,
									table_name: getGroupInverter[i].table_name
								});
							}
						}

						data.totalFeetAlarms = rs[2];
						var dataAlarms = rs[3];
						var dataAlerts = [];

						for (var _i7 = 0; _i7 <= parseInt(months); _i7++) {
							dataAlerts.push({
								time_full: (0, _moment2.default)(param.start_date).add(_i7, 'M').format('MM/YYYY'),
								total_alarm: 0
							});
						}

						dataAlerts = Object.values([].concat(_toConsumableArray(dataAlerts), _toConsumableArray(dataAlarms)).reduce(function (acc, _ref5) {
							var time_full = _ref5.time_full,
							    total_alarm = _ref5.total_alarm;

							acc[time_full] = {
								time_full: time_full,
								total_alarm: (acc[time_full] ? acc[time_full].total_alarm : 0) + total_alarm
							};
							return acc;
						}, {}));

						data.dataAlarms = dataAlerts;

						var dataConfigEstimate = rs[4].length > 0 ? rs[4][0] : {};
						var dataEnergyMonth = [];

						if (!Libs.isBlank(data.last_day)) {
							for (var _i8 = 0; _i8 <= parseInt(months); _i8++) {
								var estimate_energy = null;
								var n = _i8 + 1;
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
									time_full: (0, _moment2.default)(param.start_date).add(_i8, 'M').format('MM/YYYY'),
									category_time_format: '',
									last_day: '',
									month: (0, _moment2.default)(param.start_date).add(_i8, 'M').format('MM/YYYY'),
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

						var dataEnergy = await db.queryForList("ClientReport.dataEnergyYear", { groupInverter: groupInverter });

						if (dataEnergy) {
							dataEnergyMonth = Object.values([].concat(_toConsumableArray(dataEnergyMonth), _toConsumableArray(dataEnergy)).reduce(function (acc, _ref6) {
								var time_format = _ref6.time_format,
								    time_full = _ref6.time_full,
								    category_time_format = _ref6.category_time_format,
								    month = _ref6.month,
								    activePower = _ref6.activePower,
								    activeEnergy = _ref6.activeEnergy,
								    month_str = _ref6.month_str,
								    estimate_energy = _ref6.estimate_energy,
								    max_activeEnergy = _ref6.max_activeEnergy,
								    min_activeEnergy = _ref6.min_activeEnergy;

								acc[time_full] = {
									time_format: time_format,
									time_full: time_full,
									category_time_format: category_time_format,
									month: month,
									activePower: activePower,
									activeEnergy: activeEnergy,
									month_str: month_str,
									estimate_energy: (acc[time_full] ? acc[time_full].estimate_energy : 0) + estimate_energy,
									max_activeEnergy: max_activeEnergy,
									min_activeEnergy: min_activeEnergy
								};
								return acc;
							}, {}));
						}

						if (Libs.isArrayData(dataEnergyMonth)) {
							for (var j = 0, _len2 = dataEnergyMonth.length; j < _len2; j++) {
								if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
									var diffEnergy = dataEnergyMonth[j].activeEnergy - dataEnergyMonth[j].estimate_energy;
									dataEnergyMonth[j].diff_energy = Libs.roundNumber(diffEnergy, 0);
									dataEnergyMonth[j].diff_percent = Libs.roundNumber(diffEnergy / dataEnergyMonth[j].activeEnergy * 100, 1);
								} else {
									dataEnergyMonth[j].diff_energy = null;
									dataEnergyMonth[j].diff_percent = null;
								}

								// Tinh tich luy
								if (j == 0) {
									dataEnergyMonth[j].sum_activeEnergy = dataEnergyMonth[j].activeEnergy;
									dataEnergyMonth[j].sum_estimate_energy = dataEnergyMonth[j].estimate_energy;

									if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
										var _diffEnergy3 = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
										dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(_diffEnergy3, 0);
										dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber(_diffEnergy3 / dataEnergyMonth[j].activeEnergy * 100, 1);
									} else {
										dataEnergyMonth[j].sum_diff_energy = null;
										dataEnergyMonth[j].sum_diff_percent = null;
									}
								} else {
									dataEnergyMonth[j].sum_activeEnergy = dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy == 0 ? 0 : Libs.roundNumber(dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy, 0);
									dataEnergyMonth[j].sum_estimate_energy = dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy == 0 ? 0 : Libs.roundNumber(dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy, 0);
									if (!Libs.isBlank(dataEnergyMonth[j].sum_estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].sum_activeEnergy) && dataEnergyMonth[j].sum_estimate_energy > 0 && dataEnergyMonth[j].sum_activeEnergy > 0) {

										var _diffEnergy4 = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
										dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(_diffEnergy4, 0);
										dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber(_diffEnergy4 / dataEnergyMonth[j].sum_activeEnergy * 100, 1);
									} else {
										dataEnergyMonth[j].sum_diff_energy = null;
										dataEnergyMonth[j].sum_diff_percent = null;
									}
								}
							}
						}

						var energyMonth = dataEnergyMonth.reduce(function (a, b) {
							return {
								activeEnergy: a.activeEnergy + b.activeEnergy,
								max_activeEnergy: Libs.roundNumber(a.max_activeEnergy + b.max_activeEnergy, 1),
								min_activeEnergy: Libs.roundNumber(a.min_activeEnergy + b.min_activeEnergy, 1)
							};
						});

						data.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy : 0;
						data.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy : 0;
						data.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy : 0;
						data.revenue = Libs.formatNum(energyMonth.activeEnergy * data.config_revenue, '#,###');

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
	}]);

	return ClientReportService;
}(_BaseService3.default);

exports.default = ClientReportService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9DbGllbnRSZXBvcnRTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkNsaWVudFJlcG9ydFNlcnZpY2UiLCJwYXJhbSIsImNhbGxCYWNrIiwiZGIiLCJteVNxTERCIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJsaXN0VXNlciIsInF1ZXJ5Rm9yTGlzdCIsImxlbmd0aCIsImkiLCJhbGVydHMiLCJMaWJzIiwiaXNCbGFuayIsImlkc19wcm9qZWN0IiwiaWRzUHJvamVjdFN0cmluZyIsImlkc1Byb2plY3QiLCJzcGxpdCIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJyb2xsYmFjayIsImRhdGEiLCJsaXN0UHJvamVjdCIsIml0ZW1Qcm9qZWN0IiwiZGF0YUdyb3VwSW52ZXJ0ZXIiLCJncm91cEludmVydGVyIiwibGVuIiwicHVzaCIsImhhc2hfaWQiLCJpZF9kZXZpY2VfZ3JvdXAiLCJ0YWJsZV9uYW1lIiwiZGF0YUVuZXJneU1vbnRoIiwibGFzdF9kYXkiLCJwYXJzZUludCIsInRpbWVfZm9ybWF0IiwidGltZV9mdWxsIiwiY2F0ZWdvcnlfdGltZV9mb3JtYXQiLCJkYXkiLCJhY3RpdmVQb3dlciIsImFjdGl2ZUVuZXJneSIsIm1heF9hY3RpdmVFbmVyZ3kiLCJtaW5fYWN0aXZlRW5lcmd5IiwiZGF0YUVuZXJneSIsIk9iamVjdCIsInZhbHVlcyIsInJlZHVjZSIsImFjYyIsImVuZXJneU1vbnRoIiwiYSIsImIiLCJyb3VuZE51bWJlciIsImlzT2JqZWN0RW1wdHkiLCJyZXZlbnVlIiwiZm9ybWF0TnVtIiwiY29uZmlnX3JldmVudWUiLCJ5ZWFyIiwiZm9ybWF0Iiwic3RhcnREYXRlT2ZUaGVZZWFyIiwiZW5kRGF0ZU9mVGhlWWVhciIsImVuZE9mIiwic3RhcnRfZGF0ZSIsImVuZF9kYXRlIiwiZ2V0VG90YWxGZWV0QWxhcm1zIiwidG90YWxGZWV0QWxhcm1zIiwiZGF0YUFsZXJ0cyIsImFkZCIsInRvdGFsX2FsYXJtIiwiZGF0YUNvbmZpZ0VzdGltYXRlIiwicXVlcnlGb3JPYmplY3QiLCJlc3RpbWF0ZV9lbmVyZ3kiLCJtb250aCIsIm1vbnRoX3N0ciIsImRpZmZfZW5lcmd5IiwiZGlmZl9wZXJjZW50Iiwic3VtX2FjdGl2ZUVuZXJneSIsInN1bV9lc3RpbWF0ZV9lbmVyZ3kiLCJzdW1fZGlmZl9lbmVyZ3kiLCJzdW1fZGlmZl9wZXJjZW50IiwidG90YWxFbmVyZ3kiLCJwciIsInRvdGFsRXN0aW1hdGUiLCJpc0FycmF5RGF0YSIsImoiLCJkaWZmRW5lcmd5IiwiY29udmVydEFsbEZvcm1hdERhdGUiLCJycyIsImdldEdyb3VwSW52ZXJ0ZXIiLCJhbGFybU9QZW5lZCIsInN0YXJ0RGF0ZSIsImVuZERhdGUiLCJtb250aHMiLCJkaWZmIiwiZGF0YUFsYXJtcyIsIm4iLCJCYXNlU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztJQUNNQSxtQjs7O0FBQ0wsZ0NBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUdEOzs7Ozs7Ozs7MENBS3dCQyxLLEVBQU9DLFEsRUFBVTtBQUN4QyxPQUFJO0FBQ0gsUUFBSUMsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxTQUFJO0FBQ0gsVUFBSUMsV0FBVyxNQUFNSixHQUFHSyxZQUFILENBQWdCLHFDQUFoQixFQUF1RCxFQUF2RCxDQUFyQjs7QUFFQSxVQUFHRCxTQUFTRSxNQUFULEdBQWtCLENBQXJCLEVBQXVCO0FBQ3RCO0FBQ0EsWUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILFNBQVNFLE1BQTdCLEVBQXFDQyxHQUFyQyxFQUEwQztBQUN6QyxZQUFJQyxTQUFTLEVBQWI7QUFDQSxZQUFHLENBQUNDLEtBQUtDLE9BQUwsQ0FBYU4sU0FBU0csQ0FBVCxFQUFZSSxXQUF6QixDQUFKLEVBQTBDO0FBQ3pDLGFBQUlDLG1CQUFtQlIsU0FBU0cs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QVAsRUFBWTtBQUNiQyxjQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkYsR0FBM0I7QUFDQWIsV0FBS2dCLFFBQUw7QUFDQXBCLGVBQVMsSUFBVCxFQUFlaUIsR0FBZjtBQUNBO0FBQ0QsS0FsT0Q7QUFtT0EsSUFyT0QsQ0FxT0UsT0FBT0EsR0FBUCxFQUFZO0FBQ2IsUUFBSWIsSUFBSixFQUFVO0FBQ1RBLFVBQUtnQixRQUFMO0FBQ0E7QUFDRHBCLGFBQVMsSUFBVCxFQUFlaUIsR0FBZjtBQUNBO0FBQ0Q7Ozs7RUEveUJnQzZFLHFCOztrQkFrekJuQmhHLG1CIiwiZmlsZSI6IkNsaWVudFJlcG9ydFNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuY2xhc3MgQ2xpZW50UmVwb3J0U2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCogZ2V0IGRldGFpbCBwcm9qZWN0IHBhZ2UgQ2xpZW50IEFuYWx5dGljc1xyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cdGdldERhdGFEYWlseVJlcG9ydEVtYWlsKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgbGlzdFVzZXIgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRSZXBvcnQuZ2V0TGlzdFVzZXJEYWlseVJlcG9ydFwiLCB7fSk7XHJcblxyXG5cdFx0XHRcdFx0aWYobGlzdFVzZXIubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0XHRcdC8vIEdldCBsaXN0IGFsYXJtIGJ5IGlkc19wcm9qZWN0XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdFVzZXIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgYWxlcnRzID0gW107XHJcblx0XHRcdFx0XHRcdFx0aWYoIUxpYnMuaXNCbGFuayhsaXN0VXNlcltpXS5pZHNfcHJvamVjdCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGlkc1Byb2plY3RTdHJpbmcgPSBsaXN0VXNlcltpXS5pZHNfcHJvamVjdDtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBpZHNQcm9qZWN0ID0gaWRzUHJvamVjdFN0cmluZy5zcGxpdChcIixcIik7XHJcblx0XHRcdFx0XHRcdFx0XHRpZihpZHNQcm9qZWN0Lmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhbGVydHMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRSZXBvcnQuZ2V0QWxlcnRzRGFpbHlSZXBvcnRcIiwge2lkc1Byb2plY3R9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRsaXN0VXNlcltpXS5hbGVydHMgPSBhbGVydHM7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGxpc3RVc2VyKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0KiBnZXQgZGV0YWlsIHByb2plY3QgcGFnZSBDbGllbnQgQW5hbHl0aWNzXHJcblx0KiBAcGFyYW0geyp9IGRhdGEgXHJcblx0KiBAcGFyYW0geyp9IGNhbGxCYWNrIFxyXG5cdCovXHJcblx0Z2V0RGF0YVJlcG9ydE1vbnRoRW1haWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBkYXRhID0gW107XHJcblx0XHRcdFx0XHR2YXIgbGlzdFByb2plY3QgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRSZXBvcnQuZ2V0TGlzdFByb2plY3RcIiwge30pO1xyXG5cdFx0XHRcdFx0dmFyIGl0ZW1Qcm9qZWN0ID0ge307XHJcblx0XHRcdFx0XHRpZiAobGlzdFByb2plY3QubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RQcm9qZWN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0aXRlbVByb2plY3QgPSBsaXN0UHJvamVjdFtpXTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gR2V0IGRhdGEgZ3JvdXAgaW52ZXJ0ZXJcclxuXHRcdFx0XHRcdFx0XHR2YXIgZGF0YUdyb3VwSW52ZXJ0ZXIgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRSZXBvcnQuZ2V0RGF0YUdyb3VwSW52ZXJ0ZXJcIiwgaXRlbVByb2plY3QpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR2YXIgZ3JvdXBJbnZlcnRlciA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkYXRhR3JvdXBJbnZlcnRlci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMCwgbGVuID0gZGF0YUdyb3VwSW52ZXJ0ZXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBJbnZlcnRlci5wdXNoKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhhc2hfaWQ6IGl0ZW1Qcm9qZWN0Lmhhc2hfaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGRhdGFHcm91cEludmVydGVyW2ldLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGRhdGFHcm91cEludmVydGVyW2ldLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneU1vbnRoID0gW107XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoaXRlbVByb2plY3QubGFzdF9kYXkpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMTsgaSA8PSBwYXJzZUludChpdGVtUHJvamVjdC5sYXN0X2RheSk7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGgucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogJycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcnlfdGltZV9mb3JtYXQ6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RfZGF5OiAnJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXk6IGksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXI6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1heF9hY3RpdmVFbmVyZ3k6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWluX2FjdGl2ZUVuZXJneTogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGdldCBkYXRhIGVuZXJneSBieSBtb250aFxyXG5cdFx0XHRcdFx0XHRcdGlmIChncm91cEludmVydGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBkYXRhRW5lcmd5ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50UmVwb3J0LmRhdGFFbmVyZ3lNb250aEVtYWlsXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhRW5lcmd5KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aCA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNb250aCwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHsgdGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcnlfdGltZV9mb3JtYXQsIGxhc3RfZGF5LCBkYXksIGFjdGl2ZVBvd2VyLCBhY3RpdmVFbmVyZ3ksIG1heF9hY3RpdmVFbmVyZ3ksIG1pbl9hY3RpdmVFbmVyZ3kgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1tkYXldID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yeV90aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RfZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYXhfYWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWluX2FjdGl2ZUVuZXJneVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0LmRhdGFFbmVyZ3lNb250aCA9IGRhdGFFbmVyZ3lNb250aDtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgZW5lcmd5TW9udGggPSBkYXRhRW5lcmd5TW9udGgucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBhLmFjdGl2ZUVuZXJneSArIGIuYWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1heF9hY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKGEubWF4X2FjdGl2ZUVuZXJneSArIGIubWF4X2FjdGl2ZUVuZXJneSksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1pbl9hY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKGEubWluX2FjdGl2ZUVuZXJneSArIGIubWluX2FjdGl2ZUVuZXJneSksIDEpXHJcblx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtUHJvamVjdC5lbmVyZ3lNb250aCA9ICFMaWJzLmlzT2JqZWN0RW1wdHkoZW5lcmd5TW9udGgpID8gZW5lcmd5TW9udGguYWN0aXZlRW5lcmd5IDogMDtcclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0Lm1heF9hY3RpdmVFbmVyZ3kgPSAhTGlicy5pc09iamVjdEVtcHR5KGVuZXJneU1vbnRoKSA/IGVuZXJneU1vbnRoLm1heF9hY3RpdmVFbmVyZ3kgOiAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbVByb2plY3QubWluX2FjdGl2ZUVuZXJneSA9ICFMaWJzLmlzT2JqZWN0RW1wdHkoZW5lcmd5TW9udGgpID8gZW5lcmd5TW9udGgubWluX2FjdGl2ZUVuZXJneSA6IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtUHJvamVjdC5yZXZlbnVlID0gTGlicy5mb3JtYXROdW0oKGVuZXJneU1vbnRoLmFjdGl2ZUVuZXJneSAqIGl0ZW1Qcm9qZWN0LmNvbmZpZ19yZXZlbnVlKSwgJyMsIyMjJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gR2V0IGxpc3QgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHR2YXIgYWxlcnRzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50UmVwb3J0LmdldERhdGFBbGVydFJlcG9ydE1vbnRoXCIsIGl0ZW1Qcm9qZWN0KTtcclxuXHRcdFx0XHRcdFx0XHRpdGVtUHJvamVjdC5hbGVydHMgPSBhbGVydHM7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YS5wdXNoKGl0ZW1Qcm9qZWN0KTtcclxuXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgcHJvamVjdCBwYWdlIENsaWVudCBBbmFseXRpY3NcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHRnZXREYXRhUmVwb3J0WWVhckVtYWlsKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgZGF0YSA9IFtdO1xyXG5cclxuXHRcdFx0XHRcdHZhciB5ZWFyID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZJyk7XHJcblx0XHRcdFx0XHR2YXIgc3RhcnREYXRlT2ZUaGVZZWFyID0gbW9tZW50KFt5ZWFyXSkuZm9ybWF0KCdZWVlZLU1NLUREIGhoOm1tOnNzJyk7XHJcblx0XHRcdFx0XHR2YXIgZW5kRGF0ZU9mVGhlWWVhciA9IG1vbWVudChbeWVhcl0pLmVuZE9mKCd5ZWFyJykuZm9ybWF0KCdZWVlZLU1NLUREIGhoOm1tOnNzJyk7XHJcblx0XHRcdFx0XHRwYXJhbS5zdGFydF9kYXRlID0gc3RhcnREYXRlT2ZUaGVZZWFyO1xyXG5cdFx0XHRcdFx0cGFyYW0uZW5kX2RhdGUgPSBlbmREYXRlT2ZUaGVZZWFyO1xyXG5cdFx0XHRcdFx0dmFyIGxpc3RQcm9qZWN0ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50UmVwb3J0LmdldExpc3RQcm9qZWN0WWVhckVtYWlsXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdHZhciBpdGVtUHJvamVjdCA9IHt9O1xyXG5cclxuXHRcdFx0XHRcdGlmIChsaXN0UHJvamVjdC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdFByb2plY3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRpdGVtUHJvamVjdCA9IGxpc3RQcm9qZWN0W2ldO1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0LnN0YXJ0X2RhdGUgPSBzdGFydERhdGVPZlRoZVllYXI7XHJcblx0XHRcdFx0XHRcdFx0aXRlbVByb2plY3QuZW5kX2RhdGUgPSBlbmREYXRlT2ZUaGVZZWFyO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBHZXQgZGF0YSBncm91cCBpbnZlcnRlclxyXG5cdFx0XHRcdFx0XHRcdHZhciBkYXRhR3JvdXBJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudFJlcG9ydC5nZXREYXRhR3JvdXBJbnZlcnRlclwiLCBpdGVtUHJvamVjdCk7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGdyb3VwSW52ZXJ0ZXIgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YUdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGRhdGFHcm91cEludmVydGVyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwSW52ZXJ0ZXIucHVzaChcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoYXNoX2lkOiBpdGVtUHJvamVjdC5oYXNoX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBkYXRhR3JvdXBJbnZlcnRlcltpXS5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBpdGVtUHJvamVjdC5zdGFydF9kYXRlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW5kX2RhdGU6IGl0ZW1Qcm9qZWN0LmVuZF9kYXRlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZGF0YUdyb3VwSW52ZXJ0ZXJbaV0udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBnZXRUb3RhbEZlZXRBbGFybXMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRSZXBvcnQuZ2V0VG90YWxGZWV0QWxhcm1zXCIsIGl0ZW1Qcm9qZWN0KTtcclxuXHRcdFx0XHRcdFx0XHRpdGVtUHJvamVjdC50b3RhbEZlZXRBbGFybXMgPSBnZXRUb3RhbEZlZXRBbGFybXM7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGdldCBkYXRhIGFsZXJ0c1xyXG5cdFx0XHRcdFx0XHRcdHZhciBhbGVydHMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRSZXBvcnQuZ2V0TGlzdEFsYXJtWWVhckVtYWlsXCIsIGl0ZW1Qcm9qZWN0KTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgZGF0YUFsZXJ0cyA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAxMTsgaSA+PSAwOyBpLS0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFBbGVydHMucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KGl0ZW1Qcm9qZWN0LmVuZF9kYXRlKS5hZGQoLWksICdNJykuZm9ybWF0KCdNTS9ZWVlZJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRvdGFsX2FsYXJtOiAwXHJcblx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhQWxlcnRzID0gT2JqZWN0LnZhbHVlcyhbLi4uZGF0YUFsZXJ0cywgLi4uYWxlcnRzXS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Z1bGwsIHRvdGFsX2FsYXJtIH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Z1bGxdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRvdGFsX2FsYXJtOiAoYWNjW3RpbWVfZnVsbF0gPyBhY2NbdGltZV9mdWxsXS50b3RhbF9hbGFybSA6IDApICsgdG90YWxfYWxhcm0sXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpdGVtUHJvamVjdC5kYXRhQWxlcnRzID0gZGF0YUFsZXJ0cztcclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIEdldCBkYXRhIGVuZXJneVxyXG5cdFx0XHRcdFx0XHRcdHZhciBkYXRhQ29uZmlnRXN0aW1hdGUgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIkNsaWVudFJlcG9ydC5nZXRDb25maWdFc3RpbWF0ZVwiLCBpdGVtUHJvamVjdCk7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lNb250aCA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGl0ZW1Qcm9qZWN0Lmxhc3RfZGF5KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPD0gcGFyc2VJbnQoMTIpOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVzdGltYXRlX2VuZXJneSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhQ29uZmlnRXN0aW1hdGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzd2l0Y2ggKGkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydqYW4nXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnZmViJ107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ21hciddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgNDpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydhcHInXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDU6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnbWF5J107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSA2OlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ2p1biddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgNzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydqdWwnXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDg6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnYXVnJ107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSA5OlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ3NlcCddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgMTA6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnb2N0J107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAxMTpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydub3YnXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDEyOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ2RlYyddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiAnJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IChpIDwgMTAgPyAnMCcgKyBpIDogaSkgKyBcIi9cIiArIGl0ZW1Qcm9qZWN0LnllYXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcnlfdGltZV9mb3JtYXQ6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RfZGF5OiAnJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtb250aDogaSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5OiBlc3RpbWF0ZV9lbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bW9udGhfc3RyOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRpZmZfZW5lcmd5OiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRpZmZfcGVyY2VudDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdW1fYWN0aXZlRW5lcmd5OiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN1bV9lc3RpbWF0ZV9lbmVyZ3k6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3VtX2RpZmZfZW5lcmd5OiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN1bV9kaWZmX3BlcmNlbnQ6IG51bGxcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBkYXRhRW5lcmd5ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50UmVwb3J0LmRhdGFFbmVyZ3lZZWFyXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFFbmVyZ3kpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aCA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNb250aCwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHsgdGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcnlfdGltZV9mb3JtYXQsIG1vbnRoLCBhY3RpdmVQb3dlciwgYWN0aXZlRW5lcmd5LCBtb250aF9zdHIsIGVzdGltYXRlX2VuZXJneSB9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGFjY1ttb250aF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhdGVnb3J5X3RpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtb250aF9zdHIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5OiAoYWNjW21vbnRoXSA/IGFjY1ttb250aF0uZXN0aW1hdGVfZW5lcmd5IDogMCkgKyBlc3RpbWF0ZV9lbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0dmFyIHRvdGFsRW5lcmd5ID0gMCwgcHIgPSAwLCB0b3RhbEVzdGltYXRlID0gMDtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKExpYnMuaXNBcnJheURhdGEoZGF0YUVuZXJneU1vbnRoKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGxlbmd0aCA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbVByb2plY3QueWVhciA9PSBtb21lbnQoKS5mb3JtYXQoJ1lZWVknKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZW5ndGggPSBtb21lbnQoKS5mb3JtYXQoJ01NJyk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZW5ndGggPSBkYXRhRW5lcmd5TW9udGgubGVuZ3RoXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUVuZXJneU1vbnRoLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRvdGFsRW5lcmd5ID0gdG90YWxFbmVyZ3kgKyBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0b3RhbEVzdGltYXRlID0gdG90YWxFc3RpbWF0ZSArIGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3kpICYmICFMaWJzLmlzQmxhbmsoZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneSA+IDAgJiYgZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGlmZkVuZXJneSA9IGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3kgLSBkYXRhRW5lcmd5TW9udGhbal0uZXN0aW1hdGVfZW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5kaWZmX2VuZXJneSA9IExpYnMucm91bmROdW1iZXIoZGlmZkVuZXJneSwgMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLmRpZmZfcGVyY2VudCA9IExpYnMucm91bmROdW1iZXIoKGRpZmZFbmVyZ3kgLyBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5KSAqIDEwMCwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLmRpZmZfZW5lcmd5ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uZGlmZl9wZXJjZW50ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gVGluaCB0aWNoIGx1eVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaiA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9hY3RpdmVFbmVyZ3kgPSBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneSkgJiYgIUxpYnMuaXNCbGFuayhkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW5lcmd5TW9udGhbal0uZXN0aW1hdGVfZW5lcmd5ID4gMCAmJiBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRpZmZFbmVyZ3kgPSBkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSAtIGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZXN0aW1hdGVfZW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9kaWZmX2VuZXJneSA9IExpYnMucm91bmROdW1iZXIoZGlmZkVuZXJneSwgMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2RpZmZfcGVyY2VudCA9IExpYnMucm91bmROdW1iZXIoKGRpZmZFbmVyZ3kgLyBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5KSAqIDEwMCwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9lbmVyZ3kgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9kaWZmX3BlcmNlbnQgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSA9IChkYXRhRW5lcmd5TW9udGhbaiAtIDFdLnN1bV9hY3RpdmVFbmVyZ3kgKyBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5KSA9PSAwID8gMCA6IExpYnMucm91bmROdW1iZXIoKGRhdGFFbmVyZ3lNb250aFtqIC0gMV0uc3VtX2FjdGl2ZUVuZXJneSArIGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3kpLCAwKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2VzdGltYXRlX2VuZXJneSA9IChkYXRhRW5lcmd5TW9udGhbaiAtIDFdLnN1bV9lc3RpbWF0ZV9lbmVyZ3kgKyBkYXRhRW5lcmd5TW9udGhbal0uZXN0aW1hdGVfZW5lcmd5KSA9PSAwID8gMCA6IExpYnMucm91bmROdW1iZXIoKGRhdGFFbmVyZ3lNb250aFtqIC0gMV0uc3VtX2VzdGltYXRlX2VuZXJneSArIGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3kpLCAwKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW5lcmd5TW9udGhbal0uc3VtX2VzdGltYXRlX2VuZXJneSkgJiYgIUxpYnMuaXNCbGFuayhkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSkgJiYgZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9lc3RpbWF0ZV9lbmVyZ3kgPiAwICYmIGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGlmZkVuZXJneSA9IGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fYWN0aXZlRW5lcmd5IC0gZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9lc3RpbWF0ZV9lbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2RpZmZfZW5lcmd5ID0gTGlicy5yb3VuZE51bWJlcihkaWZmRW5lcmd5LCAwKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9wZXJjZW50ID0gTGlicy5yb3VuZE51bWJlcigoZGlmZkVuZXJneSAvIGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fYWN0aXZlRW5lcmd5KSAqIDEwMCwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9lbmVyZ3kgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9kaWZmX3BlcmNlbnQgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0LnRvdGFsRW5lcmd5ID0gTGlicy5yb3VuZE51bWJlcih0b3RhbEVuZXJneSwgMSk7XHJcblx0XHRcdFx0XHRcdFx0aXRlbVByb2plY3QudG90YWxFc3RpbWF0ZSA9IExpYnMucm91bmROdW1iZXIodG90YWxFc3RpbWF0ZSwgMSk7XHJcblx0XHRcdFx0XHRcdFx0aXRlbVByb2plY3QucHIgPSBMaWJzLnJvdW5kTnVtYmVyKHRvdGFsRW5lcmd5IC8gdG90YWxFc3RpbWF0ZSwgMik7XHJcblx0XHRcdFx0XHRcdFx0aXRlbVByb2plY3QuZGF0YUVuZXJneU1vbnRoID0gZGF0YUVuZXJneU1vbnRoO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGEucHVzaChpdGVtUHJvamVjdCk7XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyB2YXIgZ3JvdXBJbnZlcnRlciA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGlmIChkYXRhR3JvdXBJbnZlcnRlci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRmb3IgKGxldCBpID0gMCwgbGVuID0gZGF0YUdyb3VwSW52ZXJ0ZXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0Z3JvdXBJbnZlcnRlci5wdXNoKFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGhhc2hfaWQ6IGl0ZW1Qcm9qZWN0Lmhhc2hfaWQsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGRhdGFHcm91cEludmVydGVyW2ldLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdHRhYmxlX25hbWU6IGRhdGFHcm91cEludmVydGVyW2ldLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyB2YXIgZGF0YUVuZXJneU1vbnRoID0gW107XHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYgKCFMaWJzLmlzQmxhbmsoaXRlbVByb2plY3QubGFzdF9kYXkpKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRmb3IgKGxldCBpID0gMTsgaSA8PSBwYXJzZUludChpdGVtUHJvamVjdC5sYXN0X2RheSk7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRkYXRhRW5lcmd5TW9udGgucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0dGltZV9mb3JtYXQ6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdHRpbWVfZnVsbDogJycsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0Y2F0ZWdvcnlfdGltZV9mb3JtYXQ6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxhc3RfZGF5OiAnJyxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRkYXk6IGksXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0YWN0aXZlUG93ZXI6IDAsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0YWN0aXZlRW5lcmd5OiAwLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdG1heF9hY3RpdmVFbmVyZ3k6IDAsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bWluX2FjdGl2ZUVuZXJneTogMFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIC8vIGdldCBkYXRhIGVuZXJneSBieSBtb250aFxyXG5cdFx0XHRcdFx0XHRcdC8vIGlmIChncm91cEludmVydGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdHZhciBkYXRhRW5lcmd5ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50UmVwb3J0LmRhdGFFbmVyZ3lNb250aEVtYWlsXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGlmIChkYXRhRW5lcmd5KSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdGRhdGFFbmVyZ3lNb250aCA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNb250aCwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHsgdGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcnlfdGltZV9mb3JtYXQsIGxhc3RfZGF5LCBkYXksIGFjdGl2ZVBvd2VyLCBhY3RpdmVFbmVyZ3ksIG1heF9hY3RpdmVFbmVyZ3ksIG1pbl9hY3RpdmVFbmVyZ3kgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGFjY1tkYXldID0ge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR0aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRjYXRlZ29yeV90aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxhc3RfZGF5LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0ZGF5LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0YWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRhY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRtYXhfYWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bWluX2FjdGl2ZUVuZXJneVxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0fSwge30pKTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyBcdGl0ZW1Qcm9qZWN0LmRhdGFFbmVyZ3lNb250aCA9IGRhdGFFbmVyZ3lNb250aDtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRsZXQgZW5lcmd5TW9udGggPSBkYXRhRW5lcmd5TW9udGgucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0YWN0aXZlRW5lcmd5OiBhLmFjdGl2ZUVuZXJneSArIGIuYWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdG1heF9hY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKGEubWF4X2FjdGl2ZUVuZXJneSArIGIubWF4X2FjdGl2ZUVuZXJneSksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdG1pbl9hY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKGEubWluX2FjdGl2ZUVuZXJneSArIGIubWluX2FjdGl2ZUVuZXJneSksIDEpXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdH07XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRpdGVtUHJvamVjdC5lbmVyZ3lNb250aCA9ICFMaWJzLmlzT2JqZWN0RW1wdHkoZW5lcmd5TW9udGgpID8gZW5lcmd5TW9udGguYWN0aXZlRW5lcmd5OiAwO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aXRlbVByb2plY3QubWF4X2FjdGl2ZUVuZXJneSA9ICFMaWJzLmlzT2JqZWN0RW1wdHkoZW5lcmd5TW9udGgpID8gZW5lcmd5TW9udGgubWF4X2FjdGl2ZUVuZXJneTogMDtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGl0ZW1Qcm9qZWN0Lm1pbl9hY3RpdmVFbmVyZ3kgPSAhTGlicy5pc09iamVjdEVtcHR5KGVuZXJneU1vbnRoKSA/IGVuZXJneU1vbnRoLm1pbl9hY3RpdmVFbmVyZ3k6IDA7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRpdGVtUHJvamVjdC5yZXZlbnVlID0gTGlicy5mb3JtYXROdW0oKGVuZXJneU1vbnRoLmFjdGl2ZUVuZXJneSAqIGl0ZW1Qcm9qZWN0LmNvbmZpZ19yZXZlbnVlKSwgJyMsIyMjJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gLy8gR2V0IGxpc3QgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHQvLyB2YXIgYWxlcnRzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50UmVwb3J0LmdldERhdGFBbGVydFJlcG9ydE1vbnRoXCIsIGl0ZW1Qcm9qZWN0KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBpdGVtUHJvamVjdC5hbGVydHMgPSBhbGVydHM7XHJcblx0XHRcdFx0XHRcdFx0Ly8gZGF0YS5wdXNoKGl0ZW1Qcm9qZWN0KTtcclxuXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0KiBnZXQgZGV0YWlsIHByb2plY3QgcGFnZSBDbGllbnQgQW5hbHl0aWNzXHJcblx0KiBAcGFyYW0geyp9IGRhdGEgXHJcblx0KiBAcGFyYW0geyp9IGNhbGxCYWNrIFxyXG5cdCovXHJcblxyXG5cdGdldERhdGFSZXBvcnRNb250aChwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0cGFyYW0uc3RhcnRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSk7XHJcblx0XHRcdFx0XHRwYXJhbS5lbmRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpO1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50UmVwb3J0LmdldERhdGFSZXBvcnRNb250aFwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSByc1swXVswXTtcclxuXHRcdFx0XHRcdHZhciBncm91cEludmVydGVyID0gW107XHJcblx0XHRcdFx0XHR2YXIgZ2V0R3JvdXBJbnZlcnRlciA9IHJzWzFdO1xyXG5cdFx0XHRcdFx0aWYgKGdldEdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMCwgbGVuID0gZ2V0R3JvdXBJbnZlcnRlci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdGdyb3VwSW52ZXJ0ZXIucHVzaChcclxuXHRcdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aGFzaF9pZDogcGFyYW0uaGFzaF9pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXRHcm91cEludmVydGVyW2ldLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogcGFyYW0uc3RhcnRfZGF0ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kX2RhdGU6IHBhcmFtLmVuZF9kYXRlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXRHcm91cEludmVydGVyW2ldLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lNb250aCA9IFtdO1xyXG5cdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5sYXN0X2RheSkpIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPD0gcGFyc2VJbnQoZGF0YS5sYXN0X2RheSk7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiAnJyxcclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogJycsXHJcblx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yeV90aW1lX2Zvcm1hdDogJycsXHJcblx0XHRcdFx0XHRcdFx0XHRsYXN0X2RheTogJycsXHJcblx0XHRcdFx0XHRcdFx0XHRkYXk6IGksXHJcblx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogMCxcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdG1heF9hY3RpdmVFbmVyZ3k6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRtaW5fYWN0aXZlRW5lcmd5OiAwXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudFJlcG9ydC5kYXRhRW5lcmd5TW9udGhcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cclxuXHRcdFx0XHRcdGlmIChkYXRhRW5lcmd5KSB7XHJcblx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aCA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNb250aCwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHsgdGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcnlfdGltZV9mb3JtYXQsIGxhc3RfZGF5LCBkYXksIGFjdGl2ZVBvd2VyLCBhY3RpdmVFbmVyZ3ksIG1heF9hY3RpdmVFbmVyZ3ksIG1pbl9hY3RpdmVFbmVyZ3kgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGFjY1tkYXldID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yeV90aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdGxhc3RfZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRtYXhfYWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0bWluX2FjdGl2ZUVuZXJneVxyXG5cdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRsZXQgZW5lcmd5TW9udGggPSBkYXRhRW5lcmd5TW9udGgucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBhLmFjdGl2ZUVuZXJneSArIGIuYWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdG1heF9hY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKGEubWF4X2FjdGl2ZUVuZXJneSArIGIubWF4X2FjdGl2ZUVuZXJneSksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdG1pbl9hY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKGEubWluX2FjdGl2ZUVuZXJneSArIGIubWluX2FjdGl2ZUVuZXJneSksIDEpXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRkYXRhLmVuZXJneU1vbnRoID0gIUxpYnMuaXNPYmplY3RFbXB0eShlbmVyZ3lNb250aCkgPyBlbmVyZ3lNb250aC5hY3RpdmVFbmVyZ3kgOiAwO1xyXG5cdFx0XHRcdFx0ZGF0YS5tYXhfYWN0aXZlRW5lcmd5ID0gIUxpYnMuaXNPYmplY3RFbXB0eShlbmVyZ3lNb250aCkgPyBlbmVyZ3lNb250aC5tYXhfYWN0aXZlRW5lcmd5IDogMDtcclxuXHRcdFx0XHRcdGRhdGEubWluX2FjdGl2ZUVuZXJneSA9ICFMaWJzLmlzT2JqZWN0RW1wdHkoZW5lcmd5TW9udGgpID8gZW5lcmd5TW9udGgubWluX2FjdGl2ZUVuZXJneSA6IDA7XHJcblx0XHRcdFx0XHRkYXRhLnJldmVudWUgPSBMaWJzLmZvcm1hdE51bSgoZW5lcmd5TW9udGguYWN0aXZlRW5lcmd5ICogZGF0YS5jb25maWdfcmV2ZW51ZSksICcjLCMjIycpO1xyXG5cclxuXHJcblx0XHRcdFx0XHRkYXRhLmRhdGFFbmVyZ3lNb250aCA9IGRhdGFFbmVyZ3lNb250aDtcclxuXHRcdFx0XHRcdGRhdGEuYWxhcm1PUGVuZWQgPSByc1syXTtcclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0KiBnZXQgZGV0YWlsIHByb2plY3QgcGFnZSBDbGllbnQgQW5hbHl0aWNzXHJcblx0KiBAcGFyYW0geyp9IGRhdGEgXHJcblx0KiBAcGFyYW0geyp9IGNhbGxCYWNrIFxyXG5cdCovXHJcblxyXG5cdGdldERhdGFSZXBvcnRZZWFyKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHQvLyBpZiAocGFyYW0udHlwZSA9PSAxKSB7XHJcblx0XHRcdFx0XHQvLyBcdHZhciB5ZWFyID0gcGFyYW0uZW5kX2RhdGUuc3Vic3RyKC00KTtcclxuXHRcdFx0XHRcdC8vIFx0dmFyIHN0YXJ0RGF0ZU9mVGhlWWVhciA9IG1vbWVudChbeWVhcl0pLmZvcm1hdCgnWVlZWS1NTS1ERCBoaDptbTpzcycpO1xyXG5cdFx0XHRcdFx0Ly8gXHR2YXIgZW5kRGF0ZU9mVGhlWWVhciA9IG1vbWVudChbeWVhcl0pLmVuZE9mKCd5ZWFyJykuZm9ybWF0KCdZWVlZLU1NLUREIGhoOm1tOnNzJyk7XHJcblx0XHRcdFx0XHQvLyBcdHBhcmFtLnN0YXJ0X2RhdGUgPSBzdGFydERhdGVPZlRoZVllYXI7XHJcblx0XHRcdFx0XHQvLyBcdHBhcmFtLmVuZF9kYXRlID0gZW5kRGF0ZU9mVGhlWWVhcjtcclxuXHRcdFx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBcdHBhcmFtLnN0YXJ0X2RhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpO1xyXG5cdFx0XHRcdFx0Ly8gXHRwYXJhbS5lbmRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpO1xyXG5cdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdHBhcmFtLnN0YXJ0X2RhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpO1xyXG5cdFx0XHRcdFx0cGFyYW0uZW5kX2RhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKTtcclxuXHRcdFx0XHRcdHZhciBzdGFydERhdGUgPSBwYXJhbS5zdGFydF9kYXRlO1xyXG5cdFx0XHRcdFx0dmFyIGVuZERhdGUgPSBwYXJhbS5lbmRfZGF0ZTtcclxuXHRcdFx0XHRcdHZhciBtb250aHMgPSBtb21lbnQoZW5kRGF0ZSkuZGlmZihzdGFydERhdGUsICdtb250aHMnKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRSZXBvcnQuZ2V0RGF0YVJlcG9ydFllYXJcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBkYXRhID0gcnNbMF1bMF07XHJcblx0XHRcdFx0XHR2YXIgZ3JvdXBJbnZlcnRlciA9IFtdO1xyXG5cdFx0XHRcdFx0dmFyIGdldEdyb3VwSW52ZXJ0ZXIgPSByc1sxXTtcclxuXHRcdFx0XHRcdGlmIChnZXRHcm91cEludmVydGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGdldEdyb3VwSW52ZXJ0ZXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRncm91cEludmVydGVyLnB1c2goXHJcblx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGhhc2hfaWQ6IHBhcmFtLmhhc2hfaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0R3JvdXBJbnZlcnRlcltpXS5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IHBhcmFtLnN0YXJ0X2RhdGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVuZF9kYXRlOiBwYXJhbS5lbmRfZGF0ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0R3JvdXBJbnZlcnRlcltpXS50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRkYXRhLnRvdGFsRmVldEFsYXJtcyA9IHJzWzJdO1xyXG5cdFx0XHRcdFx0dmFyIGRhdGFBbGFybXMgPSByc1szXTtcclxuXHRcdFx0XHRcdHZhciBkYXRhQWxlcnRzID0gW107XHJcblxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gcGFyc2VJbnQobW9udGhzKTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFBbGVydHMucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQocGFyYW0uc3RhcnRfZGF0ZSkuYWRkKCBpICwgJ00nKS5mb3JtYXQoJ01NL1lZWVknKSxcclxuXHRcdFx0XHRcdFx0XHR0b3RhbF9hbGFybTogMFxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGRhdGFBbGVydHMgPSBPYmplY3QudmFsdWVzKFsuLi5kYXRhQWxlcnRzLCAuLi5kYXRhQWxhcm1zXS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Z1bGwsIHRvdGFsX2FsYXJtIH0pID0+IHtcclxuXHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0dGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdHRvdGFsX2FsYXJtOiAoYWNjW3RpbWVfZnVsbF0gPyBhY2NbdGltZV9mdWxsXS50b3RhbF9hbGFybSA6IDApICsgdG90YWxfYWxhcm0sXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdGRhdGEuZGF0YUFsYXJtcyA9IGRhdGFBbGVydHM7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHR2YXIgZGF0YUNvbmZpZ0VzdGltYXRlID0gcnNbNF0ubGVuZ3RoID4gMCA/IHJzWzRdWzBdIDoge307XHJcblx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneU1vbnRoID0gW107XHJcblxyXG5cclxuXHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEubGFzdF9kYXkpKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IHBhcnNlSW50KG1vbnRocyk7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBlc3RpbWF0ZV9lbmVyZ3kgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBuID0gKGkgKyAxKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YUNvbmZpZ0VzdGltYXRlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRzd2l0Y2ggKG4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnamFuJ107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ2ZlYiddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydtYXInXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSA0OlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnYXByJ107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgNTpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ21heSddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDY6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydqdW4nXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSA3OlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnanVsJ107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgODpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ2F1ZyddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDk6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydzZXAnXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAxMDpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ29jdCddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDExOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnbm92J107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgMTI6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydkZWMnXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiAnJyxcclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KHBhcmFtLnN0YXJ0X2RhdGUpLmFkZCggaSAsICdNJykuZm9ybWF0KCdNTS9ZWVlZJyksXHJcblx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yeV90aW1lX2Zvcm1hdDogJycsXHJcblx0XHRcdFx0XHRcdFx0XHRsYXN0X2RheTogJycsXHJcblx0XHRcdFx0XHRcdFx0XHRtb250aDogbW9tZW50KHBhcmFtLnN0YXJ0X2RhdGUpLmFkZCggaSAsICdNJykuZm9ybWF0KCdNTS9ZWVlZJyksXHJcblx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneTogZXN0aW1hdGVfZW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0bW9udGhfc3RyOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGlmZl9lbmVyZ3k6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRkaWZmX3BlcmNlbnQ6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRzdW1fYWN0aXZlRW5lcmd5OiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0c3VtX2VzdGltYXRlX2VuZXJneTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdHN1bV9kaWZmX2VuZXJneTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdHN1bV9kaWZmX3BlcmNlbnQ6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRtYXhfYWN0aXZlRW5lcmd5OiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0bWluX2FjdGl2ZUVuZXJneTogMFxyXG5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudFJlcG9ydC5kYXRhRW5lcmd5WWVhclwiLCB7IGdyb3VwSW52ZXJ0ZXIgfSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGRhdGFFbmVyZ3kpIHtcclxuXHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoID0gT2JqZWN0LnZhbHVlcyhbLi4uZGF0YUVuZXJneU1vbnRoLCAuLi5kYXRhRW5lcmd5XS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBjYXRlZ29yeV90aW1lX2Zvcm1hdCwgbW9udGgsIGFjdGl2ZVBvd2VyLCBhY3RpdmVFbmVyZ3ksIG1vbnRoX3N0ciwgZXN0aW1hdGVfZW5lcmd5LCBtYXhfYWN0aXZlRW5lcmd5LCBtaW5fYWN0aXZlRW5lcmd5IH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRhY2NbdGltZV9mdWxsXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcnlfdGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRtb250aCxcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5LFx0XHJcblx0XHRcdFx0XHRcdFx0XHRtb250aF9zdHIsXHJcblx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3k6IChhY2NbdGltZV9mdWxsXSA/IGFjY1t0aW1lX2Z1bGxdLmVzdGltYXRlX2VuZXJneSA6IDApICsgZXN0aW1hdGVfZW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0bWF4X2FjdGl2ZUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRcdG1pbl9hY3RpdmVFbmVyZ3lcclxuXHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKExpYnMuaXNBcnJheURhdGEoZGF0YUVuZXJneU1vbnRoKSkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUVuZXJneU1vbnRoLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneSkgJiYgIUxpYnMuaXNCbGFuayhkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW5lcmd5TW9udGhbal0uZXN0aW1hdGVfZW5lcmd5ID4gMCAmJiBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGRpZmZFbmVyZ3kgPSBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5IC0gZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5kaWZmX2VuZXJneSA9IExpYnMucm91bmROdW1iZXIoZGlmZkVuZXJneSwgMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uZGlmZl9wZXJjZW50ID0gTGlicy5yb3VuZE51bWJlcigoZGlmZkVuZXJneSAvIGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3kpICogMTAwLCAxKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLmRpZmZfZW5lcmd5ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5kaWZmX3BlcmNlbnQgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gVGluaCB0aWNoIGx1eVxyXG5cdFx0XHRcdFx0XHRcdGlmIChqID09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fYWN0aXZlRW5lcmd5ID0gZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW5lcmd5TW9udGhbal0uZXN0aW1hdGVfZW5lcmd5KSAmJiAhTGlicy5pc0JsYW5rKGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3kgPiAwICYmIGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBkaWZmRW5lcmd5ID0gZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9hY3RpdmVFbmVyZ3kgLSBkYXRhRW5lcmd5TW9udGhbal0uc3VtX2VzdGltYXRlX2VuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9kaWZmX2VuZXJneSA9IExpYnMucm91bmROdW1iZXIoZGlmZkVuZXJneSwgMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9wZXJjZW50ID0gTGlicy5yb3VuZE51bWJlcigoZGlmZkVuZXJneSAvIGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3kpICogMTAwLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9lbmVyZ3kgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2RpZmZfcGVyY2VudCA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fYWN0aXZlRW5lcmd5ID0gKGRhdGFFbmVyZ3lNb250aFtqIC0gMV0uc3VtX2FjdGl2ZUVuZXJneSArIGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3kpID09IDAgPyAwIDogTGlicy5yb3VuZE51bWJlcigoZGF0YUVuZXJneU1vbnRoW2ogLSAxXS5zdW1fYWN0aXZlRW5lcmd5ICsgZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSksIDApO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9lc3RpbWF0ZV9lbmVyZ3kgPSAoZGF0YUVuZXJneU1vbnRoW2ogLSAxXS5zdW1fZXN0aW1hdGVfZW5lcmd5ICsgZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneSkgPT0gMCA/IDAgOiBMaWJzLnJvdW5kTnVtYmVyKChkYXRhRW5lcmd5TW9udGhbaiAtIDFdLnN1bV9lc3RpbWF0ZV9lbmVyZ3kgKyBkYXRhRW5lcmd5TW9udGhbal0uZXN0aW1hdGVfZW5lcmd5KSwgMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW5lcmd5TW9udGhbal0uc3VtX2VzdGltYXRlX2VuZXJneSkgJiYgIUxpYnMuaXNCbGFuayhkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSkgJiYgZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9lc3RpbWF0ZV9lbmVyZ3kgPiAwICYmIGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBkaWZmRW5lcmd5ID0gZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9hY3RpdmVFbmVyZ3kgLSBkYXRhRW5lcmd5TW9udGhbal0uc3VtX2VzdGltYXRlX2VuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9kaWZmX2VuZXJneSA9IExpYnMucm91bmROdW1iZXIoZGlmZkVuZXJneSwgMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9wZXJjZW50ID0gTGlicy5yb3VuZE51bWJlcigoZGlmZkVuZXJneSAvIGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fYWN0aXZlRW5lcmd5KSAqIDEwMCwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2RpZmZfZW5lcmd5ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9kaWZmX3BlcmNlbnQgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0bGV0IGVuZXJneU1vbnRoID0gZGF0YUVuZXJneU1vbnRoLnJlZHVjZShmdW5jdGlvbiAoYSwgYikge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogYS5hY3RpdmVFbmVyZ3kgKyBiLmFjdGl2ZUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRtYXhfYWN0aXZlRW5lcmd5OiBMaWJzLnJvdW5kTnVtYmVyKChhLm1heF9hY3RpdmVFbmVyZ3kgKyBiLm1heF9hY3RpdmVFbmVyZ3kpLCAxKSxcclxuXHRcdFx0XHRcdFx0XHRtaW5fYWN0aXZlRW5lcmd5OiBMaWJzLnJvdW5kTnVtYmVyKChhLm1pbl9hY3RpdmVFbmVyZ3kgKyBiLm1pbl9hY3RpdmVFbmVyZ3kpLCAxKVxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0ZGF0YS5lbmVyZ3lNb250aCA9ICFMaWJzLmlzT2JqZWN0RW1wdHkoZW5lcmd5TW9udGgpID8gZW5lcmd5TW9udGguYWN0aXZlRW5lcmd5IDogMDtcclxuXHRcdFx0XHRcdGRhdGEubWF4X2FjdGl2ZUVuZXJneSA9ICFMaWJzLmlzT2JqZWN0RW1wdHkoZW5lcmd5TW9udGgpID8gZW5lcmd5TW9udGgubWF4X2FjdGl2ZUVuZXJneSA6IDA7XHJcblx0XHRcdFx0XHRkYXRhLm1pbl9hY3RpdmVFbmVyZ3kgPSAhTGlicy5pc09iamVjdEVtcHR5KGVuZXJneU1vbnRoKSA/IGVuZXJneU1vbnRoLm1pbl9hY3RpdmVFbmVyZ3kgOiAwO1xyXG5cdFx0XHRcdFx0ZGF0YS5yZXZlbnVlID0gTGlicy5mb3JtYXROdW0oKGVuZXJneU1vbnRoLmFjdGl2ZUVuZXJneSAqIGRhdGEuY29uZmlnX3JldmVudWUpLCAnIywjIyMnKTtcclxuXHJcblxyXG5cdFx0XHRcdFx0ZGF0YS5kYXRhRW5lcmd5TW9udGggPSBkYXRhRW5lcmd5TW9udGg7XHJcblxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBDbGllbnRSZXBvcnRTZXJ2aWNlO1xyXG4iXX0=