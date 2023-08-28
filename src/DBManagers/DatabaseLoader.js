/**
 * http://usejsdoc.org/
 */
//ini db manager
//elasticsearch DB
var elasPath = appPath + 'DBManagers/Elasticsearch';
var mySqlPath = appPath + 'DBManagers/MyBatis';
//var mySqlPath = rootPath + '/src/DBManagers/MyBatis';
var redisPath = appPath + 'DBManagers/Redis';
var path = require('path');
var DbLoader = function () {

}
DbLoader.use = function (app) {
	if (Libs.checkFileExits(elasPath, 'ElasProvider.js')) {
		//		elasticsearch
		DbLoader.loadElastic(app);
		console.log("elasticsearch module loaded");
	} else {
		console.log("no elasticsearch module loaded");
	}
	if (Libs.checkFileExits(mySqlPath, 'MysqlDB.js')) {
		//		mysql DB
		DbLoader.loadMybatis(app);
		console.log("mysql module loaded");
	} else {
		console.log("no mysql module loaded");
	}
	// 	if (Libs.checkFileExits(redisPath, 'RedisProvider.js')) {
	// //		redis DB
	// 		DbLoader.loadRedis(app);
	// 		console.log("redis module loaded");
	// 	}else{
	// 		console.log("no redis module loaded");
	// 	}
}
DbLoader.loadElastic = function (app) {
	global.elastic = require(elasPath + '/ElasProvider.js');
	elastic.connect({host: config.elasticSearch.host});
}
DbLoader.loadMybatis = function (app) {
	try {
		// require(mySqlPath + '/MyBatisConfig.js');

		// var dir_xml = mySqlPath+'/resourceMap/';
		var dir_xml = path.join(mySqlPath, config.mybatis.dir_mapper);
		var mysql = require('mysql');
		global.pool = mysql.createPool(config.mysql);
		pool.on('enqueue', function () {
			console.log('Waiting for available connection slot');
		});
		// var mybatis = require(path.join(mySqlPath, 'mybatisnodejs'));
		// app.use(mybatis.Contexto.domainMiddleware);
		// app.use(mybatis.Contexto.middlewareOnError);
		// var sessionFactory = new mybatis.Principal().processe(dir_xml);
		//command lai
		var mybatis = require(path.join(mySqlPath, 'mybatis-node'));
		app.use(mybatis.domainMiddleware);
		app.use(mybatis.middlewareOnError);
		const sessionFactory  = new mybatis.Main(pool).process(dir_xml);

		global.sessionFactory = sessionFactory;
		//var DB = require(path.join(mySqlPath, "MysqlDB.js"));
		var DB = require(path.join(mySqlPath, "DBManager.js"));
		global.mySqLDB = DB;
	} catch (e) {
		console.log(e);
	}
}
// DbLoader.loadRedis = function (app) {
// 	global.redisLog = FLLogger.getLogger("redis");
// 	require(redisPath + '/RedisConfig.js');
// 	var redis = require(redisPath + '/RedisProvider.js');
// 	redis.init(redisConfig);
// 	global.redis = redis;
// 		// redis.setSingle("nodejs","node value");
// 		// redis.getSingle('nodejs');
// 	//	redis.delSingle("nodejs");
// 	//	var objE = {id:1001,name:'lamcui',city:'HCM'};
// 	//	var objE1 = {id:1002,name:'ngan',city:'HCM'};
// 	//	redis.set(objE,'NV','id',['city']);
// 	//	redis.set(objE1,'NV','id',['city']);
// 	//	redis.del(objE1,'NV','id',['city']);
// }
module.exports = DbLoader;