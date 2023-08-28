"use strict";

var MysqlDB = function MysqlDB() {};
MysqlDB.connect = function (config) {};
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
MysqlDB.prototype.beginTransaction = function (callback) {

	if (callback) {
		sessionFactory.transacao(callback);
	} else {
		return new Promise(function (resolve, reject) {
			try {
				sessionFactory.transacao(function (conn) {
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
MysqlDB.prototype.queryForList = function (sqlId, param, callback) {
	try {
		if (callback) {
			sessionFactory.selecioneUm(sqlId, param, function (err, rows) {
				callback(err, rows);
			});
		} else {
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
		if (callback) callback(error);
		return false;
	}
};

/**
 * Make an query to DB for a list of objects
 *
 * @param sqlId
 * @param param
 * @return rows
 */
MysqlDB.prototype.queryForObject = function (sqlId, param, callback) {
	try {
		if (callback) {
			sessionFactory.selecioneUm(sqlId, param, function (err, rows) {
				if (rows == null || typeof rows == "undefined" || rows.length == 0) {
					callback(err, rows);
				} else {
					callback(err, rows[0]);
				}
			});
		} else {
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
		if (callback) callback(error, null);
		return false;
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
MysqlDB.prototype.insert = function (sqlId, obj, callback) {
	try {
		if (callback) {
			sessionFactory.insira(sqlId, obj, function (err, rows) {
				callback(err, rows);
			});
		} else {
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
		if (callback) callback(err);
		return false;
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
MysqlDB.prototype.update = function (sqlId, param, callback) {
	try {
		if (callback) {
			sessionFactory.atualize(sqlId, param, function (err, rows) {
				callback(err, rows);
			});
		} else {
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
		if (callback) callback(error);
		return false;
	}
};

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
		if (callback) {
			sessionFactory.remova(sqlId, param, function (err, rows) {
				callback(err, rows);
			});
		} else {
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
};

module.exports = MysqlDB;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9EQk1hbmFnZXJzL015QmF0aXMvTXlzcWxEQi5qcyJdLCJuYW1lcyI6WyJNeXNxbERCIiwiY29ubmVjdCIsImNvbmZpZyIsInByb3RvdHlwZSIsImJlZ2luVHJhbnNhY3Rpb24iLCJjYWxsYmFjayIsInNlc3Npb25GYWN0b3J5IiwidHJhbnNhY2FvIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjb25uIiwiZXJyIiwicXVlcnlGb3JMaXN0Iiwic3FsSWQiLCJwYXJhbSIsInNlbGVjaW9uZVVtIiwicm93cyIsImVycm9yIiwiY29uc29sZSIsInF1ZXJ5Rm9yT2JqZWN0IiwibGVuZ3RoIiwiaW5zZXJ0Iiwib2JqIiwiaW5zaXJhIiwidXBkYXRlIiwiYXR1YWxpemUiLCJkZWxldGUiLCJyZW1vdmEiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFVBQVUsU0FBVkEsT0FBVSxHQUFZLENBQ3pCLENBREQ7QUFFQUEsUUFBUUMsT0FBUixHQUFrQixVQUFVQyxNQUFWLEVBQWtCLENBRW5DLENBRkQ7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtDQUYsUUFBUUcsU0FBUixDQUFrQkMsZ0JBQWxCLEdBQXFDLFVBQVNDLFFBQVQsRUFBbUI7O0FBRXZELEtBQUdBLFFBQUgsRUFBWTtBQUNYQyxpQkFBZUMsU0FBZixDQUF5QkYsUUFBekI7QUFDQSxFQUZELE1BRUs7QUFDSixTQUFPLElBQUlHLE9BQUosQ0FBWSxVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUM3QyxPQUFHO0FBQ0ZKLG1CQUFlQyxTQUFmLENBQXlCLFVBQVNJLElBQVQsRUFBYztBQUN0Q0YsYUFBUUUsSUFBUjtBQUNBLEtBRkQ7QUFHQSxJQUpELENBSUMsT0FBTUMsR0FBTixFQUFVO0FBQ1ZGLFdBQU9FLEdBQVA7QUFDQTtBQUVELEdBVE0sQ0FBUDtBQVdBO0FBQ0QsQ0FqQkQ7O0FBbUJBOzs7Ozs7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VixRQUF4QixFQUFrQztBQUM1RCxLQUFJO0FBQ0gsTUFBR0EsUUFBSCxFQUFZO0FBQ1hDLGtCQUFlc0IsTUFBZixDQUFzQmQsS0FBdEIsRUFBNkJDLEtBQTdCLEVBQW9DLFVBQVVILEdBQVYsRUFBZUssSUFBZixFQUFxQjtBQUN4RFosYUFBU08sR0FBVCxFQUFjSyxJQUFkO0FBRUEsSUFIRDtBQUlBLEdBTEQsTUFLSztBQUNKLFVBQU8sSUFBSVQsT0FBSixDQUFZLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQzdDSixtQkFBZXNCLE1BQWYsQ0FBc0JkLEtBQXRCLEVBQTZCQyxLQUE3QixFQUFvQyxVQUFVSCxHQUFWLEVBQWVLLElBQWYsRUFBcUI7QUFDeEQsU0FBSUwsR0FBSixFQUFTO0FBQ1JGLGFBQU9FLEdBQVA7QUFDQTtBQUNBO0FBQ0RILGFBQVFRLElBQVI7QUFDQSxLQU5EO0FBT0EsSUFSTSxDQUFQO0FBU0E7QUFFRCxFQWxCRCxDQWtCRSxPQUFPQyxLQUFQLEVBQWM7QUFDZkMsVUFBUUQsS0FBUixDQUFjQSxLQUFkO0FBQ0FiLFdBQVNhLEtBQVQ7QUFDQTtBQUNELENBdkJEOztBQXlCQVcsT0FBT0MsT0FBUCxHQUFpQjlCLE9BQWpCIiwiZmlsZSI6Ik15c3FsREIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTXlzcWxEQiA9IGZ1bmN0aW9uICgpIHtcclxufVxyXG5NeXNxbERCLmNvbm5lY3QgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcblxyXG59XHJcbi8qKlxyXG4gKiBiZWdpbiB0cmFuc2FjdGlvblxyXG4gKiB2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG4gICAgICAgICAgICBkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uKGNvbm4pe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGE9IHtpZDpcIm9rIG9rNTBcIixvcmRlcjoxLHBvaW50OjEwLGdyb3VwX2lkOjEsaXNfYWN0aXZlOjEsaXNfZGVsZXRlOjAsY3JlYXRlZF9ieTpcImFhXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiRGlzZWFzZS5pbnNlcnRcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIXJzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubi5yb2xsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9IHtpZDpcIm9rIG9rNjBcIixvcmRlcjoxLHBvaW50OjEwLGdyb3VwX2lkOjEsaXNfYWN0aXZlOjEsaXNfZGVsZXRlOjAsY3JlYXRlZF9ieTpcImFhXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiRGlzZWFzZS5pbnNlcnRcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIXJzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubi5yb2xsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9IHtpZDpcIm9rIG9rNDBcIixvcmRlcjoxLHBvaW50OjEwLGdyb3VwX2lkOjEsaXNfYWN0aXZlOjEsaXNfZGVsZXRlOjAsY3JlYXRlZF9ieTpcImFhXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiRGlzZWFzZS5pbnNlcnRcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIXJzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubi5yb2xsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidOG6oWkgc2FvIGtow7RuZyDEkeG6v24gxJHDonlcIixycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29ubi5jb21taXQoKTtcclxuICAgICAgICAgICAgICAgIH1jYXRjaChlcnIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29ubi5yb2xsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gKiBAcGFyYW0gY2FsbGJhY2tcclxuICovXHJcbk15c3FsREIucHJvdG90eXBlLmJlZ2luVHJhbnNhY3Rpb249ICBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFxyXG5cdGlmKGNhbGxiYWNrKXtcclxuXHRcdHNlc3Npb25GYWN0b3J5LnRyYW5zYWNhbyhjYWxsYmFjayk7XHJcblx0fWVsc2V7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0XHR0cnl7XHJcblx0XHRcdFx0c2Vzc2lvbkZhY3RvcnkudHJhbnNhY2FvKGZ1bmN0aW9uKGNvbm4pe1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShjb25uKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWNhdGNoKGVycil7XHJcblx0XHRcdFx0cmVqZWN0KGVycik7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1ha2UgYW4gcXVlcnkgdG8gREIgZm9yIGEgbGlzdCBvZiBvYmplY3RzXHJcbiAqXHJcbiAqIEBwYXJhbSBzcWxJZFxyXG4gKiBAcGFyYW0gcGFyYW1cclxuICovXHJcbk15c3FsREIucHJvdG90eXBlLnF1ZXJ5Rm9yTGlzdCA9IGZ1bmN0aW9uIChzcWxJZCwgcGFyYW0sIGNhbGxiYWNrKSB7XHJcblx0dHJ5IHtcclxuXHRcdGlmKGNhbGxiYWNrKXtcclxuXHRcdFx0c2Vzc2lvbkZhY3Rvcnkuc2VsZWNpb25lVW0oc3FsSWQsIHBhcmFtLCBmdW5jdGlvbiAoZXJyLCByb3dzKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soZXJyLCByb3dzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdFx0XHRzZXNzaW9uRmFjdG9yeS5zZWxlY2lvbmVVbShzcWxJZCwgcGFyYW0sIGZ1bmN0aW9uIChlcnIsIHJvd3MpIHtcclxuXHRcdFx0XHRcdGlmIChlcnIpIHtcclxuXHRcdFx0XHRcdFx0cmVqZWN0KGVycik7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJlc29sdmUocm93cyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG5cdFx0aWYoY2FsbGJhY2spXHJcblx0XHRjYWxsYmFjayhlcnJvcik7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIE1ha2UgYW4gcXVlcnkgdG8gREIgZm9yIGEgbGlzdCBvZiBvYmplY3RzXHJcbiAqXHJcbiAqIEBwYXJhbSBzcWxJZFxyXG4gKiBAcGFyYW0gcGFyYW1cclxuICogQHJldHVybiByb3dzXHJcbiAqL1xyXG5NeXNxbERCLnByb3RvdHlwZS5xdWVyeUZvck9iamVjdCA9IGZ1bmN0aW9uIChzcWxJZCwgcGFyYW0sIGNhbGxiYWNrKSB7XHJcblx0dHJ5IHtcclxuXHRcdGlmKGNhbGxiYWNrKXtcclxuXHRcdFx0c2Vzc2lvbkZhY3Rvcnkuc2VsZWNpb25lVW0oc3FsSWQsIHBhcmFtLCBmdW5jdGlvbiAoZXJyLCByb3dzKSB7XHJcblx0XHRcdFx0aWYgKHJvd3MgPT0gbnVsbCB8fCB0eXBlb2YgKHJvd3MpID09IFwidW5kZWZpbmVkXCIgfHwgcm93cy5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soZXJyLCByb3dzKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soZXJyLCByb3dzWzBdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdFx0c2Vzc2lvbkZhY3Rvcnkuc2VsZWNpb25lVW0oc3FsSWQsIHBhcmFtLCBmdW5jdGlvbiAoZXJyLCByb3dzKSB7XHJcblx0XHRcdFx0XHRpZiAoZXJyKSB7XHJcblx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXNvbHZlKHJvd3MpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcclxuXHRcdGlmKGNhbGxiYWNrKVxyXG5cdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKlxyXG4gKiBNYWtlIGFuIEluc2VydCBjYWxsIHRvIERCIE1ldGhvZCBOYW1lOiBpbnNlcnRcclxuICpcclxuICogQHBhcmFtIFNxbElEXHJcbiAqICAgICAgICAgICAgYW4gSW5zZXJ0XHJcbiAqIEBwYXJhbSBvYmpcclxuICogICAgICAgICAgICBwYXJhbWV0ZXIgY2xhc3NcclxuICogQHJldHVybiBpbnQgbnVtIHJvdyBpcyBpbnNlcnRlZCwgbmV3IGlkIHdpbGwgYmUgYXNpZ24gaW4gb2JqXHJcbiAqIEB0aHJvd3MgRXhjZXB0aW9uIC1cclxuICogICAgICAgICAgICAgSWYgYW4gZXJyb3Igb2NjdXJzXHJcbiAqXHJcbiAqL1xyXG5NeXNxbERCLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoc3FsSWQsIG9iaiwgY2FsbGJhY2spIHtcclxuXHR0cnkge1xyXG5cdFx0aWYoY2FsbGJhY2spe1xyXG5cdFx0XHRzZXNzaW9uRmFjdG9yeS5pbnNpcmEoc3FsSWQsIG9iaiwgZnVuY3Rpb24gKGVyciwgcm93cykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGVyciwgcm93cyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdFx0c2Vzc2lvbkZhY3RvcnkuaW5zaXJhKHNxbElkLCBvYmosIGZ1bmN0aW9uIChlcnIsIHJvd3MpIHtcclxuXHRcdFx0XHRcdGlmIChlcnIpIHtcclxuXHRcdFx0XHRcdFx0cmVqZWN0KGVycik7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJlc29sdmUocm93cyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG5cdFx0aWYoY2FsbGJhY2spXHJcblx0XHRjYWxsYmFjayhlcnIpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqXHJcbiAqIE1ha2UgYW4gdXBkYXRlIGNhbGwgdG8gREIgTWV0aG9kIE5hbWU6IHVwZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0gU3FsSURcclxuICogICAgICAgICAgICBhbiBJbnNlcnRcclxuICogQHBhcmFtIG9ialxyXG4gKiAgICAgICAgICAgIHBhcmFtZXRlciBjbGFzc1xyXG4gKiBAcmV0dXJuIGludCBudW1iZXIgb2Ygcm93cyBlZmZlY3RlZFxyXG4gKiBAdGhyb3dzIEV4Y2VwdGlvbiAtXHJcbiAqICAgICAgICAgICAgIElmIGFuIGVycm9yIG9jY3Vyc1xyXG4gKlxyXG4gKi9cclxuTXlzcWxEQi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKHNxbElkLCBwYXJhbSwgY2FsbGJhY2spIHtcclxuXHR0cnkge1xyXG5cdFx0aWYoY2FsbGJhY2spe1xyXG5cdFx0XHRzZXNzaW9uRmFjdG9yeS5hdHVhbGl6ZShzcWxJZCwgcGFyYW0sIGZ1bmN0aW9uIChlcnIsIHJvd3MpIHtcclxuXHRcdFx0XHRjYWxsYmFjayhlcnIsIHJvd3MpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0XHRcdHNlc3Npb25GYWN0b3J5LmF0dWFsaXplKHNxbElkLCBwYXJhbSwgZnVuY3Rpb24gKGVyciwgcm93cykge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmVzb2x2ZShyb3dzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XHJcblx0XHRpZihjYWxsYmFjaylcclxuXHRcdGNhbGxiYWNrKGVycm9yKTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKlxyXG4gKiBNYWtlIGFuIGRlbGV0ZSBjYWxsIHRvIERCIE1ldGhvZCBOYW1lOiBkZWxldGVcclxuICpcclxuICogQHBhcmFtIFNxbElEXHJcbiAqICAgICAgICAgICAgYW4gZGVsZXRlXHJcbiAqIEBwYXJhbSBvYmpcclxuICogICAgICAgICAgICBwYXJhbWV0ZXIgY2xhc3NcclxuICogQHJldHVybiBpbnQgbnVtYmVyIG9mIHJvd3MgZWZmZWN0ZWRcclxuICogQHRocm93cyBFeGNlcHRpb24gLVxyXG4gKiAgICAgICAgICAgICBJZiBhbiBlcnJvciBvY2N1cnNcclxuICpcclxuICovXHJcbk15c3FsREIucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChzcWxJZCwgcGFyYW0sIGNhbGxiYWNrKSB7XHJcblx0dHJ5IHtcclxuXHRcdGlmKGNhbGxiYWNrKXtcclxuXHRcdFx0c2Vzc2lvbkZhY3RvcnkucmVtb3ZhKHNxbElkLCBwYXJhbSwgZnVuY3Rpb24gKGVyciwgcm93cykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGVyciwgcm93cyk7XHJcblx0XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdFx0c2Vzc2lvbkZhY3RvcnkucmVtb3ZhKHNxbElkLCBwYXJhbSwgZnVuY3Rpb24gKGVyciwgcm93cykge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmVzb2x2ZShyb3dzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XHJcblx0XHRjYWxsYmFjayhlcnJvcik7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE15c3FsREI7XHJcbiJdfQ==