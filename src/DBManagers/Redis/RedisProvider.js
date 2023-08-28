/**
 * http://usejsdoc.org/
 */
var redis = require("redis");
var RedisProvider = function(){
	
}
RedisProvider.init=function(config){
	var client = redis.createClient(config);
	this.client = client;
	client.on('connect', function() {
		console.log('connected');
	});
	client.on("error", function (err) {
		console.log("Error " + err);
	});
	// this.client.get('staff_1', function(err, reply) {
	// 	if (err) {
	// 		console.log(err);
	// 		throw err;
	// 	}
	// 	console.log('GET result ->' + reply);
	// });	
}
/**
 * @param 
 * objE: entity
 * alias: tên alias của entity
 * tên property khóa chính objE
 * array property index  
 */
RedisProvider.set=function(objE, alias, primaryKey, indexKeys,callback){
	var key = this.generateKey(objE, alias, primaryKey);
	var idxKeys = this.generateIdxKeys(objE,alias,primaryKey,indexKeys);
	for(var idxKey in idxKeys){
		this.client.sadd(idxKey,idxKeys[idxKey]);
	}
	this.client.hmset(key,objE,function(err, reply) {
		if(typeof callback ==='function'){
			callback(err, reply);			
		}
	});
}
RedisProvider.del=function(objE, alias, primaryKey, indexKeys,callback){
	var key = this.generateKey(objE, alias, primaryKey);
	var idxKeys = this.generateIdxKeys(objE,alias,primaryKey,indexKeys);
	for(var idxKey in idxKeys){
		this.client.srem(idxKey,idxKeys[idxKey]);
	}
	this.client.del(key,function(err, reply) {
		if(typeof callback ==='function'){
			callback(err, reply);			
		}
	})
}
RedisProvider.lPush=function(key,value,callback){
	this.client.lpush(key,value,function(err, reply) {
		if(typeof callback ==='function'){
			callback(err, reply);			
		}
	})
}
RedisProvider.rPop=function(key,callback){
	this.client.rpop(key,function(err, reply) {
		if(typeof callback ==='function'){
			callback(err, reply);			
		}
	})
}
RedisProvider.zadd=function(key,score,value,callback){
	this.client.zadd(key,score,value,function(err, reply) {
		if(typeof callback ==='function'){
			callback(err, reply);			
		}
	})
}
RedisProvider.zrem=function(key,value,callback){
	this.client.zrem(key,value,function(err, reply) {
		if(typeof callback ==='Function'){
			callback(err, reply);			
		}
	})
}
RedisProvider.setSingle=function(key,value){
	this.client.set(key, value, redis.print);
}
RedisProvider.getSingle=function(key){
	this.client.get(key, function(err, reply) {
		if (err) {
			console.log(err);
			throw err;
		}
		console.log('GET result ->' + reply);
	});
}

RedisProvider.delSingle=function(key){
	this.client.del(key);
}

RedisProvider.generateKey=function (objE,alias,primaryKey){
	try{
		return alias+"_"+primaryKey+":"+objE[primaryKey];
	}
	catch (e) {
		// TODO: handle exception
		redisLog.error(e);
		return "";
	}
}
RedisProvider.generateIdxKeys=function (objE,alias,primaryKey,indexKeys){
	var idxKeys = {};
	for ( var index in indexKeys) {
		try{
			var idxKey = "IX_"+alias+"_"+indexKeys[index]+":"+objE[indexKeys[index]];
			idxKeys[idxKey]=alias+"_"+primaryKey+":"+objE[primaryKey];
			console.log(idxKey);
		}
		catch (e) {
			// TODO: handle exception
			redisLog.error(e);
		}
	}
	return idxKeys;
}
module.exports = RedisProvider;
