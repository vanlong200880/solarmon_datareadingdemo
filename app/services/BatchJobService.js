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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BatchJobService = function (_BaseService) {
	_inherits(BatchJobService, _BaseService);

	function BatchJobService() {
		_classCallCheck(this, BatchJobService);

		return _possibleConstructorReturn(this, (BatchJobService.__proto__ || Object.getPrototypeOf(BatchJobService)).call(this));
	}

	/**
 * run batch job no comminication
 * @param {*} data 
 * @param {*} callBack 
 */


	_createClass(BatchJobService, [{
		key: 'runNoCommunication',
		value: function runNoCommunication(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var startDate = (0, _moment2.default)().format('YYYY-MM-DD') + " 05:30:00";
						var endDate = (0, _moment2.default)().format('YYYY-MM-DD') + " 17:30:00";
						var startDiff = (0, _moment2.default)().isAfter(startDate);
						var endDiff = (0, _moment2.default)().isBefore(endDate);
						if (!startDiff || !endDiff) {
							conn.rollback();
							callBack(true, {});
							return;
						}

						// when don’t receive any package from gateway for 10mins. -> Lý do: router4G issue/sim expired/cúp điện/... 
						var allDevice = await db.queryForList("BatchJob.getAllDevice", { type: 'gw' });
						if (allDevice.length > 0) {
							for (var i = 0; i < allDevice.length; i++) {
								var item = allDevice[i];
								var lastRowItem = await db.queryForObject("BatchJob.getLastRowItem", item);
								// Check error exits no communication
								var id_error = null;
								switch (item.table_name) {
									case 'model_techedge':
										id_error = 635;
										break;

								}

								if (lastRowItem && !Libs.isBlank(lastRowItem.max_time) && lastRowItem.diff >= 10) {
									if (!Libs.isBlank(id_error)) {
										var checkExistAlerm = await db.queryForObject("BatchJob.checkExistAlerm", {
											id_device: item.id,
											id_error: id_error
										});
										if (!checkExistAlerm) {
											await db.insert("BatchJob.insertAlert", {
												id_device: item.id,
												id_error: id_error,
												start_date: lastRowItem.max_time,
												status: 1
											});
										}
									}
								} else {
									// auto close no communication
									if (!Libs.isBlank(id_error)) {
										var _checkExistAlerm = await db.queryForObject("BatchJob.checkExistAlerm", {
											id_device: item.id,
											id_error: id_error
										});

										if (_checkExistAlerm) {
											await db.update("BatchJob.closeAlarm", {
												id: _checkExistAlerm.id,
												id_device: item.id,
												id_error: id_error,
												status: 0
											});
										}
									}
								}
							}
						}

						// - Không nhận thêm các gói tin nào từ thiết bị (trừ gw) trong 10ph;
						// - Inverter, meter, sensor, Manager 
						// - Message Lost communication 
						var allDeviceIMSM = await db.queryForList("BatchJob.getAllDevice", { type: 'inverter-meter-sensor-manager' });
						if (allDeviceIMSM.length > 0) {
							for (var j = 0; j < allDeviceIMSM.length; j++) {
								var itemIMSM = allDeviceIMSM[j];
								var lastRowItemIMSM = await db.queryForObject("BatchJob.getLastRowItem", itemIMSM);
								// Check error exits no communication
								var id_error_imsm = null;
								switch (itemIMSM.table_name) {
									case 'model_emeter_Janitza_UMG96S2':
										id_error_imsm = 627;
										break;
									case 'model_inverter_ABB_PVS100':
										id_error_imsm = 628;
										break;
									case 'model_inverter_Growatt_GW80KTL3':
										break;
									case 'model_inverter_SMA_SHP75':
										id_error_imsm = 629;
										break;
									case 'model_inverter_SMA_STP50':
										id_error_imsm = 630;
										break;
									case 'model_inverter_Sungrow_SG110CX':
										break;
									case 'model_logger_SMA_IM20':
										id_error_imsm = 631;
										break;
									case 'model_sensor_RT1':
										id_error_imsm = 632;
										break;
									case 'model_sensor_IMT_SiRS485':
										id_error_imsm = 633;
										break;
									case 'model_sensor_IMT_TaRS485':
										id_error_imsm = 634;
										break;
									case 'model_inverter_SMA_STP110':
										id_error_imsm = 636;
										break;
									case 'model_emeter_Vinasino_VSE3T5':
										id_error_imsm = 637;
										break;
								}

								if (lastRowItemIMSM && !Libs.isBlank(lastRowItemIMSM.max_time) && lastRowItemIMSM.diff >= 10) {
									if (!Libs.isBlank(id_error)) {
										var checkExistAlermIMSM = await db.queryForObject("BatchJob.checkExistAlerm", {
											id_device: itemIMSM.id,
											id_error: id_error_imsm
										});
										if (!checkExistAlermIMSM) {
											await db.insert("BatchJob.insertAlert", {
												id_device: itemIMSM.id,
												id_error: id_error_imsm,
												start_date: lastRowItemIMSM.max_time,
												status: 1
											});
										}
									}
								} else {
									// auto close no communication
									if (!Libs.isBlank(id_error_imsm)) {
										var _checkExistAlermIMSM = await db.queryForObject("BatchJob.checkExistAlerm", {
											id_device: itemIMSM.id,
											id_error: id_error_imsm
										});

										if (_checkExistAlermIMSM) {
											await db.update("BatchJob.closeAlarm", {
												id: _checkExistAlermIMSM.id,
												id_device: itemIMSM.id,
												id_error: id_error_imsm,
												status: 0
											});
										}
									}
								}
							}
						}

						// 

						conn.commit();
						callBack(false, {});
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
  * run batch job reset energy today
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: 'resetTodayEnergy',
		value: function resetTodayEnergy(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.update("BatchJob.resetTodayEnergy", { energy_today: null });
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}
						conn.commit();
						callBack(false, {});
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
  * run batch job reset power now
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: 'resetPowerNow',
		value: function resetPowerNow(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.update("BatchJob.resetPowerNow", { power_now: null });
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}
						conn.commit();
						callBack(false, {});
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
  * run batch job update device data
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: 'updatedDevicePlant',
		value: function updatedDevicePlant(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var listDevice = await db.queryForList("BatchJob.getListDevice", {});
						var dataDeviceUpdate = [];
						if (listDevice.length > 0) {
							for (var i = 0; i < listDevice.length; i++) {
								if (listDevice[i].id_device_type == 1 || listDevice[i].id_device_type == 4) {
									// Device inverter, meter
									var lastRowDataUpdated = await db.queryForObject("BatchJob.getDataUpdateDevice", {
										id_device: listDevice[i].id,
										table_name: listDevice[i].table_name,
										id_device_type: listDevice[i].id_device_type
									});
									if (lastRowDataUpdated) {
										dataDeviceUpdate.push({
											id: listDevice[i].id,
											power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
											energy_today: lastRowDataUpdated.energy_today,
											last_month: lastRowDataUpdated.energy_last_month,
											lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
											last_updated: lastRowDataUpdated.time
										});
									}
								} else {
									// Device not inverter
									var dataLastUpdate = await db.queryForObject("BatchJob.getDataLastUpdate", {
										id_device: listDevice[i].id,
										table_name: listDevice[i].table_name,
										id_device_type: listDevice[i].id_device_type
									});
									if (dataLastUpdate) {
										dataDeviceUpdate.push({
											id: listDevice[i].id,
											power_now: null,
											energy_today: null,
											last_month: null,
											lifetime: null,
											last_updated: dataLastUpdate.time
										});
									}
								}
							}
						}
						if (dataDeviceUpdate.length > 0) {
							await db.update("BatchJob.updatedDevicePlant", { dataDeviceUpdate: dataDeviceUpdate });
						}

						conn.commit();
						callBack(false, {});
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

	return BatchJobService;
}(_BaseService3.default);

exports.default = BatchJobService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9CYXRjaEpvYlNlcnZpY2UuanMiXSwibmFtZXMiOlsiQmF0Y2hKb2JTZXJ2aWNlIiwicGFyYW0iLCJjYWxsQmFjayIsImRiIiwibXlTcUxEQiIsImJlZ2luVHJhbnNhY3Rpb24iLCJjb25uIiwic3RhcnREYXRlIiwiZm9ybWF0IiwiZW5kRGF0ZSIsInN0YXJ0RGlmZiIsImlzQWZ0ZXIiLCJlbmREaWZmIiwiaXNCZWZvcmUiLCJyb2xsYmFjayIsImFsbERldmljZSIsInF1ZXJ5Rm9yTGlzdCIsInR5cGUiLCJsZW5ndGgiLCJpIiwiaXRlbSIsImxhc3RSb3dJdGVtIiwicXVlcnlGb3JPYmplY3QiLCJpZF9lcnJvciIsInRhYmxlX25hbWUiLCJMaWJzIiwiaXNCbGFuayIsIm1heF90aW1lIiwiZGlmZiIsImNoZWNrRXhpc3RBbGVybSIsImlkX2RldmljZSIsImlkIiwiaW5zZXJ0Iiwic3RhcnRfZGF0ZSIsInN0YXR1cyIsInVwZGF0ZSIsImFsbERldmljZUlNU00iLCJqIiwiaXRlbUlNU00iLCJsYXN0Um93SXRlbUlNU00iLCJpZF9lcnJvcl9pbXNtIiwiY2hlY2tFeGlzdEFsZXJtSU1TTSIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJycyIsImVuZXJneV90b2RheSIsInBvd2VyX25vdyIsImxpc3REZXZpY2UiLCJkYXRhRGV2aWNlVXBkYXRlIiwiaWRfZGV2aWNlX3R5cGUiLCJsYXN0Um93RGF0YVVwZGF0ZWQiLCJwdXNoIiwiYWN0aXZlUG93ZXIiLCJsYXN0X21vbnRoIiwiZW5lcmd5X2xhc3RfbW9udGgiLCJsaWZldGltZSIsImFjdGl2ZUVuZXJneSIsImxhc3RfdXBkYXRlZCIsInRpbWUiLCJkYXRhTGFzdFVwZGF0ZSIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNNQSxlOzs7QUFDTCw0QkFBYztBQUFBOztBQUFBO0FBR2I7O0FBR0Q7Ozs7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Q0EsTUFuREQsQ0FtREUsT0FBT3lDLEdBQVAsRUFBWTtBQUNiQyxjQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkYsR0FBM0I7QUFDQXJDLFdBQUtRLFFBQUw7QUFDQVosZUFBUyxJQUFULEVBQWV5QyxHQUFmO0FBQ0E7QUFDRCxLQXpERDtBQTBEQSxJQTVERCxDQTRERSxPQUFPQSxHQUFQLEVBQVk7QUFDYixRQUFJckMsSUFBSixFQUFVO0FBQ1RBLFVBQUtRLFFBQUw7QUFDQTtBQUNEWixhQUFTLElBQVQsRUFBZXlDLEdBQWY7QUFDQTtBQUNEOzs7O0VBclU0Qm1CLHFCOztrQkF3VWY5RCxlIiwiZmlsZSI6IkJhdGNoSm9iU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5jbGFzcyBCYXRjaEpvYlNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQqIHJ1biBiYXRjaCBqb2Igbm8gY29tbWluaWNhdGlvblxyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cdHJ1bk5vQ29tbXVuaWNhdGlvbihwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHN0YXJ0RGF0ZSA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCcpICsgXCIgMDU6MzA6MDBcIjtcclxuXHRcdFx0XHRcdHZhciBlbmREYXRlID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJykgKyBcIiAxNzozMDowMFwiO1xyXG5cdFx0XHRcdFx0dmFyIHN0YXJ0RGlmZiA9IG1vbWVudCgpLmlzQWZ0ZXIoc3RhcnREYXRlKTtcclxuXHRcdFx0XHRcdHZhciBlbmREaWZmID0gbW9tZW50KCkuaXNCZWZvcmUoZW5kRGF0ZSk7XHJcblx0XHRcdFx0XHRpZiAoIXN0YXJ0RGlmZiB8fCAhZW5kRGlmZikge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIHdoZW4gZG9u4oCZdCByZWNlaXZlIGFueSBwYWNrYWdlIGZyb20gZ2F0ZXdheSBmb3IgMTBtaW5zLiAtPiBMw70gZG86IHJvdXRlcjRHIGlzc3VlL3NpbSBleHBpcmVkL2PDunAgxJFp4buHbi8uLi4gXHJcblx0XHRcdFx0XHR2YXIgYWxsRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQmF0Y2hKb2IuZ2V0QWxsRGV2aWNlXCIsIHsgdHlwZTogJ2d3JyB9KTtcclxuXHRcdFx0XHRcdGlmIChhbGxEZXZpY2UubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFsbERldmljZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBpdGVtID0gYWxsRGV2aWNlW2ldO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBsYXN0Um93SXRlbSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQmF0Y2hKb2IuZ2V0TGFzdFJvd0l0ZW1cIiwgaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgZXJyb3IgZXhpdHMgbm8gY29tbXVuaWNhdGlvblxyXG5cdFx0XHRcdFx0XHRcdHZhciBpZF9lcnJvciA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0c3dpdGNoIChpdGVtLnRhYmxlX25hbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3RlY2hlZGdlJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3IgPSA2MzU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93SXRlbSAmJiAhTGlicy5pc0JsYW5rKGxhc3RSb3dJdGVtLm1heF90aW1lKSAmJiBsYXN0Um93SXRlbS5kaWZmID49IDEwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhpZF9lcnJvcikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQmF0Y2hKb2IuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGl0ZW0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGlkX2Vycm9yXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmluc2VydChcIkJhdGNoSm9iLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogaXRlbS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBpZF9lcnJvcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGxhc3RSb3dJdGVtLm1heF90aW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gYXV0byBjbG9zZSBubyBjb21tdW5pY2F0aW9uXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhpZF9lcnJvcikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQmF0Y2hKb2IuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGl0ZW0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGlkX2Vycm9yXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLnVwZGF0ZShcIkJhdGNoSm9iLmNsb3NlQWxhcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogaXRlbS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBpZF9lcnJvcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdC8vIC0gS2jDtG5nIG5o4bqtbiB0aMOqbSBjw6FjIGfDs2kgdGluIG7DoG8gdOG7qyB0aGnhur90IGLhu4sgKHRy4burIGd3KSB0cm9uZyAxMHBoO1xyXG5cdFx0XHRcdFx0Ly8gLSBJbnZlcnRlciwgbWV0ZXIsIHNlbnNvciwgTWFuYWdlciBcclxuXHRcdFx0XHRcdC8vIC0gTWVzc2FnZSBMb3N0IGNvbW11bmljYXRpb24gXHJcblx0XHRcdFx0XHR2YXIgYWxsRGV2aWNlSU1TTSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkJhdGNoSm9iLmdldEFsbERldmljZVwiLCB7IHR5cGU6ICdpbnZlcnRlci1tZXRlci1zZW5zb3ItbWFuYWdlcicgfSk7XHJcblx0XHRcdFx0XHRpZiAoYWxsRGV2aWNlSU1TTS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgYWxsRGV2aWNlSU1TTS5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdGxldCBpdGVtSU1TTSA9IGFsbERldmljZUlNU01bal07XHJcblx0XHRcdFx0XHRcdFx0dmFyIGxhc3RSb3dJdGVtSU1TTSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQmF0Y2hKb2IuZ2V0TGFzdFJvd0l0ZW1cIiwgaXRlbUlNU00pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIGVycm9yIGV4aXRzIG5vIGNvbW11bmljYXRpb25cclxuXHRcdFx0XHRcdFx0XHR2YXIgaWRfZXJyb3JfaW1zbSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0c3dpdGNoIChpdGVtSU1TTS50YWJsZV9uYW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9lbWV0ZXJfSmFuaXR6YV9VTUc5NlMyJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3JfaW1zbSA9IDYyNztcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9BQkJfUFZTMTAwJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3JfaW1zbSA9IDYyODtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9Hcm93YXR0X0dXODBLVEwzJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU0hQNzUnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcl9pbXNtID0gNjI5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFA1MCc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yX2ltc20gPSA2MzA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU3VuZ3Jvd19TRzExMENYJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9sb2dnZXJfU01BX0lNMjAnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcl9pbXNtID0gNjMxO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9SVDEnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcl9pbXNtID0gNjMyO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfU2lSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yX2ltc20gPSA2MzM7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9UYVJTNDg1JzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3JfaW1zbSA9IDYzNDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQMTEwJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3JfaW1zbSA9IDYzNjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9lbWV0ZXJfVmluYXNpbm9fVlNFM1Q1JzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3JfaW1zbSA9IDYzNztcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvd0l0ZW1JTVNNICYmICFMaWJzLmlzQmxhbmsobGFzdFJvd0l0ZW1JTVNNLm1heF90aW1lKSAmJiBsYXN0Um93SXRlbUlNU00uZGlmZiA+PSAxMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoaWRfZXJyb3IpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBjaGVja0V4aXN0QWxlcm1JTVNNID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJCYXRjaEpvYi5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogaXRlbUlNU00uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGlkX2Vycm9yX2ltc21cclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtSU1TTSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmluc2VydChcIkJhdGNoSm9iLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogaXRlbUlNU00uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogaWRfZXJyb3JfaW1zbSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGxhc3RSb3dJdGVtSU1TTS5tYXhfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGF1dG8gY2xvc2Ugbm8gY29tbXVuaWNhdGlvblxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoaWRfZXJyb3JfaW1zbSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGNoZWNrRXhpc3RBbGVybUlNU00gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIkJhdGNoSm9iLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBpdGVtSU1TTS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogaWRfZXJyb3JfaW1zbVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm1JTVNNKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIudXBkYXRlKFwiQmF0Y2hKb2IuY2xvc2VBbGFybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtSU1TTS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogaXRlbUlNU00uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogaWRfZXJyb3JfaW1zbSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdC8vIFxyXG5cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0aWYgKGNvbm4pIHtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0KiBydW4gYmF0Y2ggam9iIHJlc2V0IGVuZXJneSB0b2RheVxyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cdHJlc2V0VG9kYXlFbmVyZ3kocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkJhdGNoSm9iLnJlc2V0VG9kYXlFbmVyZ3lcIiwgeyBlbmVyZ3lfdG9kYXk6IG51bGwgfSk7XHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0KiBydW4gYmF0Y2ggam9iIHJlc2V0IHBvd2VyIG5vd1xyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cdHJlc2V0UG93ZXJOb3cocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkJhdGNoSm9iLnJlc2V0UG93ZXJOb3dcIiwgeyBwb3dlcl9ub3c6IG51bGwgfSk7XHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCogcnVuIGJhdGNoIGpvYiB1cGRhdGUgZGV2aWNlIGRhdGFcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHR1cGRhdGVkRGV2aWNlUGxhbnQocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBsaXN0RGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQmF0Y2hKb2IuZ2V0TGlzdERldmljZVwiLCB7fSk7XHJcblx0XHRcdFx0XHR2YXIgZGF0YURldmljZVVwZGF0ZSA9IFtdO1xyXG5cdFx0XHRcdFx0aWYgKGxpc3REZXZpY2UubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3REZXZpY2UubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAobGlzdERldmljZVtpXS5pZF9kZXZpY2VfdHlwZSA9PSAxIHx8IGxpc3REZXZpY2VbaV0uaWRfZGV2aWNlX3R5cGUgPT0gNCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRGV2aWNlIGludmVydGVyLCBtZXRlclxyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGxhc3RSb3dEYXRhVXBkYXRlZCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQmF0Y2hKb2IuZ2V0RGF0YVVwZGF0ZURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogbGlzdERldmljZVtpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogbGlzdERldmljZVtpXS50YWJsZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfdHlwZTogbGlzdERldmljZVtpXS5pZF9kZXZpY2VfdHlwZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvd0RhdGFVcGRhdGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VVcGRhdGUucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGxpc3REZXZpY2VbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVuZXJneV90b2RheTogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV90b2RheSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0X21vbnRoOiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X2xhc3RfbW9udGgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0X3VwZGF0ZWQ6IGxhc3RSb3dEYXRhVXBkYXRlZC50aW1lXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBEZXZpY2Ugbm90IGludmVydGVyXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgZGF0YUxhc3RVcGRhdGUgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIkJhdGNoSm9iLmdldERhdGFMYXN0VXBkYXRlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBsaXN0RGV2aWNlW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBsaXN0RGV2aWNlW2ldLnRhYmxlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV90eXBlOiBsaXN0RGV2aWNlW2ldLmlkX2RldmljZV90eXBlXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhTGFzdFVwZGF0ZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlVXBkYXRlLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBsaXN0RGV2aWNlW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyX25vdzogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbmVyZ3lfdG9kYXk6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGFzdF9tb250aDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaWZldGltZTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0X3VwZGF0ZWQ6IGRhdGFMYXN0VXBkYXRlLnRpbWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihkYXRhRGV2aWNlVXBkYXRlLmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdFx0XHRhd2FpdCBkYi51cGRhdGUoXCJCYXRjaEpvYi51cGRhdGVkRGV2aWNlUGxhbnRcIiwgeyBkYXRhRGV2aWNlVXBkYXRlIH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBCYXRjaEpvYlNlcnZpY2U7XHJcbiJdfQ==