"use strict";

var logger = FLLogger.getLogger("SQLMapperLog");
var DBManager = function DBManager() {};
DBManager.connect = function (config) {};
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
DBManager.prototype.beginTransaction = function (callback) {
	if (callback) {
		sessionFactory.transaction(callback);
	} else {
		return new Promise(function (resolve, reject) {
			try {
				sessionFactory.transaction(function (conn) {
					resolve(conn);
				});
			} catch (err) {
				reject(err);
			}
		});
	}
};

/**
 * Make an query to DB for a list of objects
 *
 * @param sqlId
 * @param param
 */
DBManager.prototype.queryForList = function (sqlId, param, callback) {
	try {
		if (callback) {
			sessionFactory.selectList(sqlId, param).then(function (rows) {
				callback(false, rows);
			}, function (err) {
				logger.error(err);
				callback(err);
			});
		} else {
			return sessionFactory.selectList(sqlId, param);
		}
	} catch (error) {
		logger.error(error);
		callback(error);
	}
	return false;
};
DBManager.prototype.query = function (sql, param, callback) {
	try {
		if (callback) {
			sessionFactory.query(sql, param).then(function (rows) {
				callback(false, rows);
			}, function (err) {
				logger.error(err);
				callback(err);
			});
		} else {
			return sessionFactory.selectList(sql, param);
		}
	} catch (error) {
		logger.error(error);
		callback(error);
	}
	return false;
};
/**
 * Make an query to DB for a list of objects
 *
 * @param sqlId
 * @param param
 * @return rows
 */
DBManager.prototype.queryForObject = function (sqlId, param, callback) {
	try {
		if (callback) {
			sessionFactory.selectOne(sqlId, param).then(function (row) {
				//console.log(user);
				callback(false, row);
			});
		} else {
			return sessionFactory.selectOne(sqlId, param);
		}
	} catch (error) {
		logger.error(error);
		callback(error);
	}
};
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
		if (callback) {
			sessionFactory.insert(sqlId, obj).then(function (rows) {
				callback(false, rows);
			}, function (err) {
				logger.error(err);
				callback(err);
			});
		} else {
			return sessionFactory.insert(sqlId, obj);
		}
	} catch (error) {
		logger.error(error);
		callback(err);
	}
};

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
		if (callback) {
			sessionFactory.update(sqlId, param).then(function (affectedRows) {
				callback(false, affectedRows);
			}, function (err) {
				logger.error(err);
				callback(err);
			});
		} else {
			return sessionFactory.update(sqlId, param);
		}
	} catch (error) {
		logger.error(error);
		callback(error);
	}
};
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
		if (callback) {
			sessionFactory.remove(sqlId, param).then(function (affectedRows) {
				callback(false, affectedRows);
			}, function (err) {
				logger.error(err);
				callback(err);
			});
		} else {
			return sessionFactory.remove(sqlId, param);
		}
	} catch (error) {
		logger.error(error);
		callback(error);
	}
};

module.exports = DBManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9EQk1hbmFnZXJzL015QmF0aXMvREJNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImxvZ2dlciIsIkZMTG9nZ2VyIiwiZ2V0TG9nZ2VyIiwiREJNYW5hZ2VyIiwiY29ubmVjdCIsImNvbmZpZyIsInByb3RvdHlwZSIsImJlZ2luVHJhbnNhY3Rpb24iLCJjYWxsYmFjayIsInNlc3Npb25GYWN0b3J5IiwidHJhbnNhY3Rpb24iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNvbm4iLCJlcnIiLCJxdWVyeUZvckxpc3QiLCJzcWxJZCIsInBhcmFtIiwic2VsZWN0TGlzdCIsInRoZW4iLCJyb3dzIiwiZXJyb3IiLCJxdWVyeSIsInNxbCIsInF1ZXJ5Rm9yT2JqZWN0Iiwic2VsZWN0T25lIiwicm93IiwiaW5zZXJ0Iiwib2JqIiwidXBkYXRlIiwiYWZmZWN0ZWRSb3dzIiwiZGVsZXRlIiwicmVtb3ZlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxTQUFPQyxTQUFTQyxTQUFULENBQW1CLGNBQW5CLENBQVg7QUFDQSxJQUFJQyxZQUFZLFNBQVpBLFNBQVksR0FBWSxDQUMzQixDQUREO0FBRUFBLFVBQVVDLE9BQVYsR0FBb0IsVUFBVUMsTUFBVixFQUFrQixDQUVyQyxDQUZEO0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQ0FGLFVBQVVHLFNBQVYsQ0FBb0JDLGdCQUFwQixHQUF1QyxVQUFTQyxRQUFULEVBQW1CO0FBQ3pELEtBQUdBLFFBQUgsRUFBWTtBQUNYQyxpQkFBZUMsV0FBZixDQUEyQkYsUUFBM0I7QUFDQSxFQUZELE1BRUs7QUFDSixTQUFPLElBQUlHLE9BQUosQ0FBWSxVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUM3QyxPQUFHO0FBQ0ZKLG1CQUFlQyxXQUFmLENBQTJCLFVBQVNJLElBQVQsRUFBYztBQUN4Q0YsYUFBUUUsSUFBUjtBQUNBLEtBRkQ7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QXdCO0FBQ2hFdkIsYUFBUyxLQUFULEVBQWV1QixZQUFmO0FBQ0EsSUFGRCxFQUVHLFVBQVVoQixHQUFWLEVBQWU7QUFDakJmLFdBQU9zQixLQUFQLENBQWFQLEdBQWI7QUFDQVAsYUFBU08sR0FBVDtBQUNBLElBTEQ7QUFNQSxHQVBELE1BT0s7QUFDSixVQUFPTixlQUFld0IsTUFBZixDQUFzQmhCLEtBQXRCLEVBQTZCQyxLQUE3QixDQUFQO0FBQ0E7QUFDRCxFQVhELENBV0UsT0FBT0ksS0FBUCxFQUFjO0FBQ2Z0QixTQUFPc0IsS0FBUCxDQUFhQSxLQUFiO0FBQ0FkLFdBQVNjLEtBQVQ7QUFDQTtBQUNELENBaEJEOztBQWtCQVksT0FBT0MsT0FBUCxHQUFpQmhDLFNBQWpCIiwiZmlsZSI6IkRCTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBsb2dnZXI9RkxMb2dnZXIuZ2V0TG9nZ2VyKFwiU1FMTWFwcGVyTG9nXCIpO1xyXG52YXIgREJNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xyXG59XHJcbkRCTWFuYWdlci5jb25uZWN0ID0gZnVuY3Rpb24gKGNvbmZpZykge1xyXG5cclxufVxyXG4vKipcclxuICogYmVnaW4gdHJhbnNhY3Rpb25cclxuICogdmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuICAgICAgICAgICAgZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbihjb25uKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhPSB7aWQ6XCJvayBvazUwXCIsb3JkZXI6MSxwb2ludDoxMCxncm91cF9pZDoxLGlzX2FjdGl2ZToxLGlzX2RlbGV0ZTowLGNyZWF0ZWRfYnk6XCJhYVwifVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBycyA9IGF3YWl0IGRiLmluc2VydChcIkRpc2Vhc2UuaW5zZXJ0XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFycyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm4ucm9sbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkYXRhPSB7aWQ6XCJvayBvazYwXCIsb3JkZXI6MSxwb2ludDoxMCxncm91cF9pZDoxLGlzX2FjdGl2ZToxLGlzX2RlbGV0ZTowLGNyZWF0ZWRfYnk6XCJhYVwifVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBycyA9IGF3YWl0IGRiLmluc2VydChcIkRpc2Vhc2UuaW5zZXJ0XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFycyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm4ucm9sbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkYXRhPSB7aWQ6XCJvayBvazQwXCIsb3JkZXI6MSxwb2ludDoxMCxncm91cF9pZDoxLGlzX2FjdGl2ZToxLGlzX2RlbGV0ZTowLGNyZWF0ZWRfYnk6XCJhYVwifVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBycyA9IGF3YWl0IGRiLmluc2VydChcIkRpc2Vhc2UuaW5zZXJ0XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFycyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm4ucm9sbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInThuqFpIHNhbyBraMO0bmcgxJHhur9uIMSRw6J5XCIscnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbm4uY29tbWl0KCk7XHJcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZXJyKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIixlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbm4ucm9sbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICogQHBhcmFtIGNhbGxiYWNrXHJcbiAqL1xyXG5EQk1hbmFnZXIucHJvdG90eXBlLmJlZ2luVHJhbnNhY3Rpb24gPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdGlmKGNhbGxiYWNrKXtcclxuXHRcdHNlc3Npb25GYWN0b3J5LnRyYW5zYWN0aW9uKGNhbGxiYWNrKVxyXG5cdH1lbHNle1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdFx0dHJ5e1xyXG5cdFx0XHRcdHNlc3Npb25GYWN0b3J5LnRyYW5zYWN0aW9uKGZ1bmN0aW9uKGNvbm4pe1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShjb25uKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWNhdGNoKGVycil7XHJcblx0XHRcdFx0cmVqZWN0KGVycik7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1ha2UgYW4gcXVlcnkgdG8gREIgZm9yIGEgbGlzdCBvZiBvYmplY3RzXHJcbiAqXHJcbiAqIEBwYXJhbSBzcWxJZFxyXG4gKiBAcGFyYW0gcGFyYW1cclxuICovXHJcbkRCTWFuYWdlci5wcm90b3R5cGUucXVlcnlGb3JMaXN0ID0gZnVuY3Rpb24gKHNxbElkLCBwYXJhbSwgY2FsbGJhY2spIHtcclxuXHR0cnkge1xyXG5cdFx0aWYoY2FsbGJhY2spe1xyXG5cdFx0XHRzZXNzaW9uRmFjdG9yeS5zZWxlY3RMaXN0KHNxbElkLCBwYXJhbSkudGhlbihmdW5jdGlvbiAocm93cykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGZhbHNlLHJvd3MpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0bG9nZ2VyLmVycm9yKGVycik7XHJcblx0XHRcdFx0Y2FsbGJhY2soZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHNlc3Npb25GYWN0b3J5LnNlbGVjdExpc3Qoc3FsSWQsIHBhcmFtKTtcclxuXHRcdH1cclxuXHRcdCBcclxuXHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0bG9nZ2VyLmVycm9yKGVycm9yKTtcclxuXHRcdGNhbGxiYWNrKGVycm9yKTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG5cclxufVxyXG5EQk1hbmFnZXIucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKHNxbCwgcGFyYW0sIGNhbGxiYWNrKSB7XHJcblx0dHJ5IHtcclxuXHRcdGlmKGNhbGxiYWNrKXtcclxuXHRcdFx0c2Vzc2lvbkZhY3RvcnkucXVlcnkoc3FsLCBwYXJhbSkudGhlbihmdW5jdGlvbiAocm93cykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGZhbHNlLHJvd3MpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0bG9nZ2VyLmVycm9yKGVycik7XHJcblx0XHRcdFx0Y2FsbGJhY2soZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHNlc3Npb25GYWN0b3J5LnNlbGVjdExpc3Qoc3FsLCBwYXJhbSk7XHJcblx0XHR9XHJcblx0XHQgXHJcblx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdGxvZ2dlci5lcnJvcihlcnJvcik7XHJcblx0XHRjYWxsYmFjayhlcnJvcik7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxuXHJcbn1cclxuLyoqXHJcbiAqIE1ha2UgYW4gcXVlcnkgdG8gREIgZm9yIGEgbGlzdCBvZiBvYmplY3RzXHJcbiAqXHJcbiAqIEBwYXJhbSBzcWxJZFxyXG4gKiBAcGFyYW0gcGFyYW1cclxuICogQHJldHVybiByb3dzXHJcbiAqL1xyXG5EQk1hbmFnZXIucHJvdG90eXBlLnF1ZXJ5Rm9yT2JqZWN0ID0gZnVuY3Rpb24gKHNxbElkLCBwYXJhbSwgY2FsbGJhY2spIHtcclxuXHR0cnkge1xyXG5cdFx0aWYoY2FsbGJhY2spe1xyXG5cdFx0XHRzZXNzaW9uRmFjdG9yeS5zZWxlY3RPbmUoc3FsSWQsIHBhcmFtKS50aGVuKChyb3cpPT4ge1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2codXNlcik7XHJcblx0XHRcdFx0Y2FsbGJhY2soZmFsc2UsIHJvdyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBzZXNzaW9uRmFjdG9yeS5zZWxlY3RPbmUoc3FsSWQsIHBhcmFtKTtcclxuXHRcdH1cclxuXHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0bG9nZ2VyLmVycm9yKGVycm9yKTtcclxuXHRcdGNhbGxiYWNrKGVycm9yKTtcclxuXHR9XHJcblxyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBNYWtlIGFuIEluc2VydCBjYWxsIHRvIERCIE1ldGhvZCBOYW1lOiBpbnNlcnRcclxuICpcclxuICogQHBhcmFtIFNxbElEXHJcbiAqICAgICAgICAgICAgYW4gSW5zZXJ0XHJcbiAqIEBwYXJhbSBvYmpcclxuICogICAgICAgICAgICBwYXJhbWV0ZXIgY2xhc3NcclxuICogQHJldHVybiBpbnQgbnVtIHJvdyBpcyBpbnNlcnRlZCwgbmV3IGlkIHdpbGwgYmUgYXNpZ24gaW4gb2JqXHJcbiAqIEB0aHJvd3MgRXhjZXB0aW9uIC1cclxuICogICAgICAgICAgICAgSWYgYW4gZXJyb3Igb2NjdXJzXHJcbiAqXHJcbiAqL1xyXG5EQk1hbmFnZXIucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChzcWxJZCwgb2JqLCBjYWxsYmFjaykge1xyXG5cdHRyeSB7XHJcblx0XHRpZihjYWxsYmFjayl7XHJcblx0XHRcdHNlc3Npb25GYWN0b3J5Lmluc2VydChzcWxJZCwgb2JqKS50aGVuKGZ1bmN0aW9uIChyb3dzKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soZmFsc2Uscm93cyk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoZXJyKTtcclxuXHRcdFx0XHRjYWxsYmFjayhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gc2Vzc2lvbkZhY3RvcnkuaW5zZXJ0KHNxbElkLCBvYmopO1xyXG5cdFx0fVxyXG5cdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRsb2dnZXIuZXJyb3IoZXJyb3IpO1xyXG5cdFx0Y2FsbGJhY2soZXJyKTtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKlxyXG4gKiBNYWtlIGFuIHVwZGF0ZSBjYWxsIHRvIERCIE1ldGhvZCBOYW1lOiB1cGRhdGVcclxuICpcclxuICogQHBhcmFtIFNxbElEXHJcbiAqICAgICAgICAgICAgYW4gSW5zZXJ0XHJcbiAqIEBwYXJhbSBvYmpcclxuICogICAgICAgICAgICBwYXJhbWV0ZXIgY2xhc3NcclxuICogQHJldHVybiBpbnQgbnVtYmVyIG9mIHJvd3MgZWZmZWN0ZWRcclxuICogQHRocm93cyBFeGNlcHRpb24gLVxyXG4gKiAgICAgICAgICAgICBJZiBhbiBlcnJvciBvY2N1cnNcclxuICpcclxuICovXHJcbkRCTWFuYWdlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKHNxbElkLCBwYXJhbSwgY2FsbGJhY2spIHtcclxuXHR0cnkge1xyXG5cdFx0aWYoY2FsbGJhY2spe1xyXG5cdFx0XHRzZXNzaW9uRmFjdG9yeS51cGRhdGUoc3FsSWQsIHBhcmFtKS50aGVuKGZ1bmN0aW9uIChhZmZlY3RlZFJvd3MpIHtcclxuXHRcdFx0XHRjYWxsYmFjayhmYWxzZSxhZmZlY3RlZFJvd3MpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0bG9nZ2VyLmVycm9yKGVycik7XHJcblx0XHRcdFx0Y2FsbGJhY2soZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHNlc3Npb25GYWN0b3J5LnVwZGF0ZShzcWxJZCwgcGFyYW0pO1xyXG5cdFx0fVxyXG5cdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRsb2dnZXIuZXJyb3IoZXJyb3IpO1xyXG5cdFx0Y2FsbGJhY2soZXJyb3IpO1xyXG5cdH1cclxufVxyXG4vKipcclxuICpcclxuICogTWFrZSBhbiBkZWxldGUgY2FsbCB0byBEQiBNZXRob2QgTmFtZTogZGVsZXRlXHJcbiAqXHJcbiAqIEBwYXJhbSBTcWxJRFxyXG4gKiAgICAgICAgICAgIGFuIEluc2VydFxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqICAgICAgICAgICAgcGFyYW1ldGVyIGNsYXNzXHJcbiAqIEByZXR1cm4gaW50IG51bWJlciBvZiByb3dzIGVmZmVjdGVkXHJcbiAqIEB0aHJvd3MgRXhjZXB0aW9uIC1cclxuICogICAgICAgICAgICAgSWYgYW4gZXJyb3Igb2NjdXJzXHJcbiAqXHJcbiAqL1xyXG5EQk1hbmFnZXIucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChzcWxJZCwgcGFyYW0sIGNhbGxiYWNrKSB7XHJcblx0dHJ5IHtcclxuXHRcdGlmKGNhbGxiYWNrKXtcclxuXHRcdFx0c2Vzc2lvbkZhY3RvcnkucmVtb3ZlKHNxbElkLCBwYXJhbSkudGhlbihmdW5jdGlvbiAoYWZmZWN0ZWRSb3dzKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soZmFsc2UsYWZmZWN0ZWRSb3dzKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihlcnIpO1xyXG5cdFx0XHRcdGNhbGxiYWNrKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBzZXNzaW9uRmFjdG9yeS5yZW1vdmUoc3FsSWQsIHBhcmFtKTtcclxuXHRcdH1cclxuXHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0bG9nZ2VyLmVycm9yKGVycm9yKTtcclxuXHRcdGNhbGxiYWNrKGVycm9yKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gREJNYW5hZ2VyO1xyXG4iXX0=