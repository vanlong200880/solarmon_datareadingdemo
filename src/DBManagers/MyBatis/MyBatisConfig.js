/**
* http://usejsdocorg/
*/
/**
 * Mysql config
 */
global.mysqlConfig = {
 hostname     :'localhost',
 host     :'localhost',
 port     :3306,
 username     : 'root',
 user		: 'root',
 password     :'root',
 database     : 'cms',
 connectionLimit : 20000, //The maximum number of connections to create at once. (Default: 10)
 typeCast : false,
 multipleStatements: true,
 queueLimit:0,//The maximum number of connection requests the pool will queue before returning an error from getConnection. If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
 acquireTimeout: 10000,//The milliseconds before a timeout occurs during the connection acquisition. This is slightly different from connectTimeout, because acquiring a pool connection does not always involve making a connection. (Default: 10000)
 waitForConnections:true
};
