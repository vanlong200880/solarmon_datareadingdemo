// Config cache 
var options = {
    stdTTL: 0,
    checkperiod: 999999,
    errorOnMissing: false,
    useClones: true,
    deleteOnExpire: true
};

var redis = require("redis");
var client = redis.createClient({detect_buffers: true});

client.on("error", function (err) {
    console.log("Error " + err);
});

var ManageRedisCache = function () {}
module.exports = ManageRedisCache;

/**
 * Set cache
 * @param key, data
 */
// ManageCache.setCache = function (key, obj) {
//     var status = false;
//     TakaCache.set(key, obj, function (err, success) {
//         if (!err && success) {
//             status = true;
//         }
//     });
//     return status;
// }


// /**
//  * Get cache
//  * @param key
//  * @ dataCache 
//  */
// ManageCache.getCache = function (key) {
//     var dataCache = [];
//     try{
//         dataCache = TakaCache.get( key, true );
//     } catch( err ){
//         // ENOTFOUND: Key `not-existing-key` not found
//         dataCache = [];
//     }
//     // TakaCache.get(key, function (err, value) {
//     //     if (!err) {
//     //         if (value == undefined) {
//     //             dataCache = [];
//     //         } else {
//     //             dataCache = value;
//     //         }
//     //     }
//     // });
//     return dataCache;
// }

// /**
//  * Get list keys
//  * @param key
//  * @ dataCache 
//  */
// ManageCache.getListKeys = function () {
//     // async
//     TakaCache.keys( function( err, mykeys ){
//         if( !err ){
//         console.log( mykeys );
//         // [ "all", "my", "keys", "foo", "bar" ]
//         }
//     });
// }







