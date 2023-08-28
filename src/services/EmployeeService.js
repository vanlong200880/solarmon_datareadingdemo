import BaseService from './BaseService';
class EmployeeService extends BaseService {
	constructor() {
		super();

	}

	/**
	 * @description Update status
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Role} data
	 * @param {function callback} callback
	 */
	updateStatus(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("Employee.updateStatus", data, (err, rs) => {
				return callback(err, rs)
			});
		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}

	
	/**
	 * @description Update status
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Role} data
	 * @param {function callback} callback
	 */
	 updateStatusMailConfig(data, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForObject("Employee.checkMailConfigExist", data);
					if(rs){
						rs = await db.update("Employee.updateStatusMailConfig", data);
					} else {
						rs = await db.insert("Employee.insertMailConfig", data);
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
			console.log('error', e);
			callBack(false, e);
		}

		// try {
		// 	data = Libs.convertEmptyPropToNullProp(data);
		// 	var db = new mySqLDB();
		// 	checkMailConfigExist

		// 	db.update("Employee.updateStatusMailConfig", data, (err, rs) => {
		// 		return callback(err, rs)
		// 	});
		// } catch (e) {
		// 	this.logger.error(e);
		// 	callback(false, e);
		// }
	}

	/**
	 * @description Update status -1
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Role} data
	 * @param {function callback} callback
	 */
	delete(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.delete("Employee.delete", data, (err, rs) => {
				return callback(err, rs)
			});
		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}


	/**
	 * @description Insert data
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object Floor} data
	 */
	insertEmployee(data, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.insert("Employee.insertEmployee", data);
					var curId = rs.insertId;
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}
					// insert table employee role map
					let role_data = data.role_data
					if (Libs.isArrayData(role_data) && role_data.length > 0) {
						for (var i = 0; i < role_data.length; i++) {
							role_data[i].id_employee = curId;
						}
						await db.insert("Employee.insertEmployeeRoleMap", { role_data });
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
			console.log('error', e);
			callBack(false, e);
		}
	}


	/**
	 * Kiem tra staff exist 
	 * @param {Object} permission 
	 */

	checkEmployeeExistByEmail(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("Employee.checkEmployeeExistByEmail", data, callback);
		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}


	/**
	 * check staff exist
	 * @param {object} data 
	 * @param {Function} callback 
	 */
	checkLogin(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("Employee.getEmployeeLogin", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	 * get staff permission
	 * @param {Object} data 
	 */
	async getEmployeePermissions(data) {
		try {
			var mapping = {};
			mapping.id_company = data.id_company;
			mapping.id_employee = data.id;
			mapping.id_roles = data.id_roles;
			mapping.lang = data.lang;
			mapping.id_language = data.id_language;
			var db = new mySqLDB();
			let rows = await db.queryForList("Employee.getEmployeePermissions", mapping);
			if (!rows) {
				return false;
			}
			let result = [];
			rows.forEach(row => {
				let p = JSON.parse(JSON.stringify(row));
				result.push(p);
			});
			return result;
		} catch (e) {
			console.log(e);
			return false
		}
	}



	/**
	 * get list language by id company
	 * @param {Object} data 
	 */
	async getListLanguage(data) {
		try {
			var mapping = {};
			mapping.id_company = data.id_company;
			var db = new mySqLDB();
			let rows = await db.queryForList("Employee.getListLanguage", mapping);
			if (!rows) {
				return false;
			}
			let result = [];
			rows.forEach(row => {
				let p = JSON.parse(JSON.stringify(row));
				result.push(p);
			});
			return result;
		} catch (e) {
			console.log(e);
			return false
		}
	}


	/**
	 * Kiem tra staff exist 
	 * @param {Object} permission 
	*/

	checkEmployeeForgotPassword(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("Employee.checkEmployeeForgotPassword", data, callback);
		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}


	/**
	 * @description Update password
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object User} data
	 * @param {function callback} callback
	 */
	async resetPassword(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			let rs = await db.update("Employee.resetChangePassword", data, callback);
			return rs;
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}



	/**
	 * Build object permission to array key path
	 * @param {Array} permission 
	 */
	buildPermission(permission) {
		if (null == permission || typeof permission === 'undefined') {
			return null;
		}
		let ps = {}
		for (let i = 0; i < permission.length; i++) {
			let per = permission[i];
			ps[per.module_path] = { 
				id: per.id, 
				auth: per.auths, 
				title: per.screen_name, 
				module_path: per.module_path, 
				group_type: per.group_type, 
				class_icon: per.class_icon,
				parent: per.parent 
			};
		}
		return ps;
	}


	/**
	* get detail employee update profile
	* @param {*} data 
	* @param {*} callBack 
	*/

	getDetailUpdateProfile(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("Employee.getDetailUpdateProfile", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	* get detail employee
	* @param {*} data 
	* @param {*} callBack 
	*/

	getDetail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForList("Employee.getDetail", param);
					var data = rs[0][0];
					data.role_data = rs[1];
					data.regency_data = rs[2];

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
	 * @description Update data
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Department} data
	 * @param {function callback} callback
	 */
	updateEmployee(data, callBack) {
		let self = this;
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var rs = await db.delete("Employee.deleteEmployeeRoleMap", data);
				if (Libs.isBlank(data.password)) {
					rs = await db.update("Employee.update", data);
				} else {
					rs = await db.update("Employee.updateAndPassword", data);
				}


				// insert table employee role map
				let role_data = data.role_data
				if (Libs.isArrayData(role_data) && role_data.length > 0) {
					for (var i = 0; i < role_data.length; i++) {
						role_data[i].id_employee = data.id;
					}
					rs = await db.insert("Employee.insertEmployeeRoleMap", { role_data });
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
	}



	/**
	 * @description Update profile
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Supplier} data
	 * @param {function callback} callback
	 */
	updateProfile(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("Employee.updateProfile", data, (err, rs) => {
				return callback(err, rs)
			});
		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}



	/**
	 * Kiem tra employee exist by id_company, email 
	 * @param {Object} permission 
	 */
	async checkEmployeeExist(data) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			return await db.queryForObject("Employee.checkEmployeeExist", data);
		} catch (e) {
			return callback(false, e);
		}
	}

	/**
	 * @description Update password
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object User} data
	 * @param {function callback} callback
	 */
	async updateEmployeePassword(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			let rs = await db.update("Employee.updateEmployeePassword", data, callback);
			return rs;
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}



	/**
	 * set cache
	 * @param {StaffEntity} userE 
	 * @param {Object} permissions 
	 */
	async setCachePermission(userE, permissions) {
		try {
			let _index = config.elasticSearch.index;
			let _type = Constants.elastic_type.permission_cache;
			await elastic.setAsync(_index, _type, {
				id: userE.email,
				permissions: JSON.stringify(permissions)
			});
			return true;
		} catch (e) {
			console.log(e);
			return false
		}
	}

	/**
	 * get permission cache
	 * @param {StaffEntity} userE 
	 */
	async getCachePermission(userE) {
		try {
			if (!userE) {
				return false;
			}

			let _index = config.elasticSearch.index;
			let _type = Constants.elastic_type.permission_cache;
			let rs = await elastic.getAsync(_index, _type, userE.email);
			return rs;
		} catch (e) {
			console.log(e);
			return false
		}
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
			db.queryForList("Employee.getList", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}


	
	/**
	 * @description Get list
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object} data
	 * @param {function callback} callback 
	 */
	 getListProjectConfigMail(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
				data.max_record = Constants.data.max_record;
			}
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Employee.getListProjectConfigMail", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}
	/**
	 * @description Get list
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object} data
	 * @param {function callback} callback 
	 */
	getListAll(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
				data.max_record = Constants.data.max_record;
			}
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Employee.getListAll", data, callback);
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
			db.queryForObject("Employee.getSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}


	
	// /**
	//  * @description Lấy tổng số dòng
	//  * @author Long.Pham
	//  * @since 30/07/2018
	//  * @param {Object User} data
	//  * @param {function callback} callback
	//  */
	getListProjectConfigMailSize(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("Employee.getListProjectConfigMailSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}


}
export default EmployeeService;
