import BaseService from './BaseService';
class DeviceParameterService extends BaseService {
	constructor() {
		super();

	}

	/**
     * @description Get list
     * @author Long.Pham
     * @since 30/07/2019
     * @param {Object DeviceParameter} data
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
			db.queryForList("DeviceParameter.getList", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	 * @description Lấy tổng số dòng
	 * @author Long.Pham
     * @since 30/07/2018
	 * @param {Object User} data
     * @param {function callback} callback
	 */
	getSize(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("DeviceParameter.getSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
     * @description Insert data
     * @author Long.Pham
     * @since 30/07/2019
     * @param {Object DeviceParameter} data
     */
	insertDeviceParameter(data, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var rs = await db.insert("DeviceParameter.insertDeviceParameter", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

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
		} catch (e) {
			console.log('DeviceParameter', e);
			callBack(false, e);
		}
	}


	/**
     * @description Update data
     * @author Long.Pham
     * @since 11/07/2019
     * @param {Object DeviceParameter} data
     * @param {function callback} callback
     */
	updateDeviceParameter(data, callBack) {
		let self = this;
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var rs = await db.update("DeviceParameter.updateDeviceParameter", data);
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
     * @param {Object DeviceParameter} data
     * @param {function callback} callback
     */
	updateStatus(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("DeviceParameter.updateStatus", data, (err, rs) => {
				return callBack(err, rs)
			});
		} catch (e) {
			this.logger.DeviceParameter(e);
			callBack(false, e);
		}
	}

	/**
     * @description Update is_delete = 1
     * @author Long.Pham
     * @since 11/07/2019
     * @param {Object DeviceParameter} data
     * @param {function callback} callback
     */
	delete(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.delete("DeviceParameter.delete", data, (err, rs) => {
				return callBack(err, rs)
			});
		} catch (e) {
			this.logger.DeviceParameter(e);
			callBack(false, e);
		}
	}


	/**
	* get detail DeviceParameter
	* @param {*} data 
	* @param {*} callBack 
	*/
	getDetail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForObject("DeviceParameter.getDetail", param);
					conn.commit();
					callBack(false, rs);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
				}
			});
		} catch (err) {
			// console.log('DeviceParameter get material order for voucher out', err);
			if (conn) {
				conn.rollback();
			}
			callBack(true, err);
		}
	}
}
export default DeviceParameterService;
