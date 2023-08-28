import BaseService from './BaseService';
class ClientNotifyService extends BaseService {
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
				var errorLevel = data.errorLevel;
				var errorLevelList = [];
				if(errorLevel.length > 0){
					for(let i = 0; i < errorLevel.length; i++){
						errorLevelList.push(errorLevel[i].id);
					}
				}
				data.errorLevelList = errorLevelList.toString();

				var errorType = data.errorType;
				var errorTypeList = [];
				if(errorType.length > 0){
					for(let i = 0; i < errorType.length; i++){
						errorTypeList.push(errorType[i].id);
					}
				}
				data.errorTypeList = errorTypeList.toString();

				var dataStatus = data.dataStatus;
				var statusList = [];
				if(dataStatus.length > 0){
					for(let i = 0; i < dataStatus.length; i++){
						statusList.push(dataStatus[i].id);
					}
				}
				data.statusList = statusList.toString();

				var dataDevice = await db.queryForList("ClientNotify.getList", data);
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
	 * @param {Object alert} data
	 * @param {function callback} callback
	 */
	getSize(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("ClientNotify.getSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}


	/**
	 * @description Update is_delete = 1
	 * @author Long.Pham
	 * @since 11/09/2021
	 * @param {Object AlertEntity} data
	 * @param {function callback} callback
	 */
	delete(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.delete("ClientNotify.delete", data, (err, rs) => {
				return callBack(err, rs)
			});
		} catch (e) {
			this.logger.error(e);
			callBack(false, e);
		}
	}

	/**
     * @description Update alert
     * @author Long.Pham
     * @since 20/09/2021
     * @param {Object AlertEntity} data
     * @param {function callback} callback
     */
	 update(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var rs = await db.update("ClientNotify.updateAlert", data);
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

	closeAll(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var dataArr = data.dataArr;
				var rs = await db.delete("ClientNotify.closeAll", {dataArr});
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
		})
	}

	
	/**
	 * @description Lấy tổng số dòng
	 * @author Long.Pham
	 * @since 12/09/2021
	 * @param {Object alert} data
	 * @param {function callback} callback
	 */
	 getNotifySize(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("ClientNotify.getNotifySize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}
}
export default ClientNotifyService;
