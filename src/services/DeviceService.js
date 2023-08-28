import BaseService from './BaseService';
class DeviceService extends BaseService {
	constructor() {
		super();

	}

	/**
	 * @description Get list
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object} data
	 * @param {function callback} callback 
	 */
	getList(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
				data.max_record = Constants.data.max_record;
			}
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Device.getList", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	 * @description Lấy tổng số dòng
	 * @author thanh.bay
	 * @since 30/07/2018
	 * @param {Object User} data
	 * @param {function callback} callback
	 */
	getSize(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("Device.getSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}


	/**
	 * @description Get list by projct id
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object} data
	 * @param {function callback} callback 
	 */
	getListDeviceByProject(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
				data.max_record = Constants.data.max_record;
			}
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Device.getListDeviceByProject", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}


	/**
	 * @description Get list by projct id share
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object} data
	 * @param {function callback} callback 
	 */
	 getListDeviceByProjectShare(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
				data.max_record = Constants.data.max_record;
			}
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Device.getListDeviceByProjectShare", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}


	/**
	 * @description Get all
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object Device} data
	 * @param {function callback} callback 
	 */
	getDropDownList(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Device.getDropDownList", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}



	/**
	 * @description Insert data
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object Device} data
	 */
	insert(data, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.insert("Device.insert", data);
					if (!rs) {
						conn.rollback();
						callBack(true, {});
						return;
					}

					conn.commit();
					callBack(false, rs);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
				}
			})
		} catch (e) {
			console.log('error', e);
			callBack(false, e);
		}
	}


	/**
	 * Kiem tra id_device exist 
	 * @param {Object} permission 
	 */

	 checkIdDeviceExist(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("Device.checkIdDeviceExist", data, callback);
		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}

	/**
	 * @description Insert data
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object Device} data
	 */
	 saveDeviceShare(data, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = null;
					var dataParams = data.dataParams;
					if(Libs.isArrayData(dataParams)){
						for(var i = 0, len = dataParams.length; i < len; i++){
							var checkecExits = await db.queryForObject("Device.checkExitsDeviceShare", dataParams[i]);
							if(!checkecExits){
								rs = await db.insert("Device.saveDeviceShare", dataParams[i]);
							}
						}
					}
					if (!rs) {
						conn.rollback();
						callBack(true, {});
						return;
					}

					conn.commit();
					callBack(false, rs);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
				}
			})
		} catch (e) {
			console.log('error', e);
			callBack(false, e);
		}
	}


	/**
	 * @description Update data
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Device} data
	 * @param {function callback} callback
	 */

	update(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var rs = await db.update("Device.updateDevice", data);
				if (!rs) {
					conn.rollback();
					callBack(false, {});
					return;
				}

				conn.commit();
				callBack(true, {});
			} catch (err) {
				console.log("Lỗi rolback", err);
				conn.rollback();
				callBack(false, err);
			}
		})
	}



	/**
	 * @description Update status
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Device} data
	 * @param {function callback} callback
	 */
	updateStatus(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("Device.updateStatus", data, (err, rs) => {
				return callback(err, rs)
			});
		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}



	/**
	 * @description Update is virtual
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Device} data
	 * @param {function callback} callback
	 */
	updateIsVirtual(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			if (data.is_share == 1) {
				db.update("Device.updateIsVirtualMap", data, (err, rs) => {
					return callback(err, rs)
				});
			} else if (data.is_share == 0) {
				db.update("Device.updateIsVirtual", data, (err, rs) => {
					return callback(err, rs)
				});
			} else {
				return callback(false, null);
			}

		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}

	/**
	 * @description Update status -1
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Device} data
	 * @param {function callback} callback
	 */
	delete(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			if (data.is_share == 1) {
				db.delete("Device.deleteDeviceMap", data, (err, rs) => {
					return callback(err, rs)
				});

			} else if (data.is_share == 0) {
				db.delete("Device.delete", data, (err, rs) => {
					return callback(err, rs)
				});

			} else {
				return callback(false, null);
			}

		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}

	/**
	* get detail
	* @param {*} data 
	* @param {*} callBack 
	*/
	getDetail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForList("Device.getDetail", param);
					var data = rs[0][0];
					data.data = rs[1];
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
export default DeviceService;
