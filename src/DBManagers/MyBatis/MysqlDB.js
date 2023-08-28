var MysqlDB = function () {
}
MysqlDB.connect = function (config) {

}
/**
 * begin transaction
 * var db = new mySqLDB();
            db.beginTransaction(async function(conn){
                
                try{
                    var data= {id:"ok ok50",order:1,point:10,group_id:1,is_active:1,is_delete:0,created_by:"aa"}
                    var rs = await db.insert("Disease.insert", data);
                    if(!rs){
                        conn.rollback();
                        return;
                    }
                    data= {id:"ok ok60",order:1,point:10,group_id:1,is_active:1,is_delete:0,created_by:"aa"}
                    var rs = await db.insert("Disease.insert", data);
                    if(!rs){
                        conn.rollback();
                        return;
                    }
                    data= {id:"ok ok40",order:1,point:10,group_id:1,is_active:1,is_delete:0,created_by:"aa"}
                    var rs = await db.insert("Disease.insert", data);
                    if(!rs){
                        conn.rollback();
                        return;
                    }
                    console.log("tại sao không đến đây",rs);
                    conn.commit();
                }catch(err){
                    console.log("Lỗi rolback",err);
                    conn.rollback();
                }
                
            });
 * @param callback
 */
MysqlDB.prototype.beginTransaction=  function(callback) {
	
	if(callback){
		sessionFactory.transacao(callback);
	}else{
		return new Promise(function (resolve, reject) {
			try{
				sessionFactory.transacao(function(conn){
					resolve(conn);
				});
			}catch(err){
				reject(err);
			}
			
		});
		
	}
}

/**
 * Make an query to DB for a list of objects
 *
 * @param sqlId
 * @param param
 */
MysqlDB.prototype.queryForList = function (sqlId, param, callback) {
	try {
		if(callback){
			sessionFactory.selecioneUm(sqlId, param, function (err, rows) {
				callback(err, rows);
			});
		}else{
			return new Promise(function (resolve, reject) {
				sessionFactory.selecioneUm(sqlId, param, function (err, rows) {
					if (err) {
						reject(err);
						return;
					}
					resolve(rows);
				});
				
			});
		}
		
	} catch (error) {
		console.error(error);
		if(callback)
		callback(error);
		return false;
	}

}

/**
 * Make an query to DB for a list of objects
 *
 * @param sqlId
 * @param param
 * @return rows
 */
MysqlDB.prototype.queryForObject = function (sqlId, param, callback) {
	try {
		if(callback){
			sessionFactory.selecioneUm(sqlId, param, function (err, rows) {
				if (rows == null || typeof (rows) == "undefined" || rows.length == 0) {
					callback(err, rows);
				} else {
					callback(err, rows[0]);
				}
			});
		}else{
			return new Promise(function (resolve, reject) {
				sessionFactory.selecioneUm(sqlId, param, function (err, rows) {
					if (err) {
						reject(err);
						return;
					}
					resolve(rows);
				});
				
			});
		}
		
	} catch (error) {
		console.error(error);
		if(callback)
		callback(error, null);
		return false;
	}

}

/**
 *
 * Make an Insert call to DB Method Name: insert
 *
 * @param SqlID
 *            an Insert
 * @param obj
 *            parameter class
 * @return int num row is inserted, new id will be asign in obj
 * @throws Exception -
 *             If an error occurs
 *
 */
MysqlDB.prototype.insert = function (sqlId, obj, callback) {
	try {
		if(callback){
			sessionFactory.insira(sqlId, obj, function (err, rows) {
				callback(err, rows);
			});
		}else{
			return new Promise(function (resolve, reject) {
				sessionFactory.insira(sqlId, obj, function (err, rows) {
					if (err) {
						reject(err);
						return;
					}
					resolve(rows);
				});
				
			});
		}
		
	} catch (error) {
		console.error(error);
		if(callback)
		callback(err);
		return false;
	}
}

/**
 *
 * Make an update call to DB Method Name: update
 *
 * @param SqlID
 *            an Insert
 * @param obj
 *            parameter class
 * @return int number of rows effected
 * @throws Exception -
 *             If an error occurs
 *
 */
MysqlDB.prototype.update = function (sqlId, param, callback) {
	try {
		if(callback){
			sessionFactory.atualize(sqlId, param, function (err, rows) {
				callback(err, rows);
			});
		}else{
			return new Promise(function (resolve, reject) {
				sessionFactory.atualize(sqlId, param, function (err, rows) {
					if (err) {
						reject(err);
						return;
					}
					resolve(rows);
				});
			});
		}
		
	} catch (error) {
		console.error(error);
		if(callback)
		callback(error);
		return false;
	}
}

/**
 *
 * Make an delete call to DB Method Name: delete
 *
 * @param SqlID
 *            an delete
 * @param obj
 *            parameter class
 * @return int number of rows effected
 * @throws Exception -
 *             If an error occurs
 *
 */
MysqlDB.prototype.delete = function (sqlId, param, callback) {
	try {
		if(callback){
			sessionFactory.remova(sqlId, param, function (err, rows) {
				callback(err, rows);
	
			});
		}else{
			return new Promise(function (resolve, reject) {
				sessionFactory.remova(sqlId, param, function (err, rows) {
					if (err) {
						reject(err);
						return;
					}
					resolve(rows);
				});
			});
		}
		
	} catch (error) {
		console.error(error);
		callback(error);
	}
}

module.exports = MysqlDB;
