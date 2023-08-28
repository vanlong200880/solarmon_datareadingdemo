var logger=FLLogger.getLogger("SQLMapperLog");
var DBManager = function () {
}
DBManager.connect = function (config) {

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
DBManager.prototype.beginTransaction = function(callback) {
	if(callback){
		sessionFactory.transaction(callback)
	}else{
		return new Promise(function (resolve, reject) {
			try{
				sessionFactory.transaction(function(conn){
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
DBManager.prototype.queryForList = function (sqlId, param, callback) {
	try {
		if(callback){
			sessionFactory.selectList(sqlId, param).then(function (rows) {
				callback(false,rows);
			}, function (err) {
				logger.error(err);
				callback(err);
			});
		}else{
			return sessionFactory.selectList(sqlId, param);
		}
		 
	} catch (error) {
		logger.error(error);
		callback(error);
	}
	return false;

}
DBManager.prototype.query = function (sql, param, callback) {
	try {
		if(callback){
			sessionFactory.query(sql, param).then(function (rows) {
				callback(false,rows);
			}, function (err) {
				logger.error(err);
				callback(err);
			});
		}else{
			return sessionFactory.selectList(sql, param);
		}
		 
	} catch (error) {
		logger.error(error);
		callback(error);
	}
	return false;

}
/**
 * Make an query to DB for a list of objects
 *
 * @param sqlId
 * @param param
 * @return rows
 */
DBManager.prototype.queryForObject = function (sqlId, param, callback) {
	try {
		if(callback){
			sessionFactory.selectOne(sqlId, param).then((row)=> {
				//console.log(user);
				callback(false, row);
			});
		}else{
			return sessionFactory.selectOne(sqlId, param);
		}
	} catch (error) {
		logger.error(error);
		callback(error);
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
DBManager.prototype.insert = function (sqlId, obj, callback) {
	try {
		if(callback){
			sessionFactory.insert(sqlId, obj).then(function (rows) {
				callback(false,rows);
			}, function (err) {
				logger.error(err);
				callback(err);
			});
		}else{
			return sessionFactory.insert(sqlId, obj);
		}
	} catch (error) {
		logger.error(error);
		callback(err);
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
DBManager.prototype.update = function (sqlId, param, callback) {
	try {
		if(callback){
			sessionFactory.update(sqlId, param).then(function (affectedRows) {
				callback(false,affectedRows);
			}, function (err) {
				logger.error(err);
				callback(err);
			});
		}else{
			return sessionFactory.update(sqlId, param);
		}
	} catch (error) {
		logger.error(error);
		callback(error);
	}
}
/**
 *
 * Make an delete call to DB Method Name: delete
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
DBManager.prototype.delete = function (sqlId, param, callback) {
	try {
		if(callback){
			sessionFactory.remove(sqlId, param).then(function (affectedRows) {
				callback(false,affectedRows);
			}, function (err) {
				logger.error(err);
				callback(err);
			});
		}else{
			return sessionFactory.remove(sqlId, param);
		}
	} catch (error) {
		logger.error(error);
		callback(error);
	}
}

module.exports = DBManager;
