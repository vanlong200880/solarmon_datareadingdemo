"use strict";

// Config cache 
var options = {
    stdTTL: 0,
    checkperiod: 999999,
    errorOnMissing: false,
    useClones: true,
    deleteOnExpire: true
};

var redis = require("redis");
var client = redis.createClient({ detect_buffers: true });

client.on("error", function (err) {
    console.log("Error " + err);
});

var ManageRedisCache = function ManageRedisCache() {};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9SZWRpc0NhY2hlLmpzIl0sIm5hbWVzIjpbIm9wdGlvbnMiLCJzdGRUVEwiLCJjaGVja3BlcmlvZCIsImVycm9yT25NaXNzaW5nIiwidXNlQ2xvbmVzIiwiZGVsZXRlT25FeHBpcmUiLCJyZWRpcyIsInJlcXVpcmUiLCJjbGllbnQiLCJjcmVhdGVDbGllbnQiLCJkZXRlY3RfYnVmZmVycyIsIm9uIiwiZXJyIiwiY29uc29sZSIsImxvZyIsIk1hbmFnZVJlZGlzQ2FjaGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0EsSUFBSUEsVUFBVTtBQUNWQyxZQUFRLENBREU7QUFFVkMsaUJBQWEsTUFGSDtBQUdWQyxvQkFBZ0IsS0FITjtBQUlWQyxlQUFXLElBSkQ7QUFLVkMsb0JBQWdCO0FBTE4sQ0FBZDs7QUFRQSxJQUFJQyxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNGLE1BQU1HLFlBQU4sQ0FBbUIsRUFBQ0MsZ0JBQWdCLElBQWpCLEVBQW5CLENBQWI7O0FBRUFGLE9BQU9HLEVBQVAsQ0FBVSxPQUFWLEVBQW1CLFVBQVVDLEdBQVYsRUFBZTtBQUM5QkMsWUFBUUMsR0FBUixDQUFZLFdBQVdGLEdBQXZCO0FBQ0gsQ0FGRDs7QUFJQSxJQUFJRyxtQkFBbUIsU0FBbkJBLGdCQUFtQixHQUFZLENBQUUsQ0FBckM7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkYsZ0JBQWpCOztBQUVBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJSZWRpc0NhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29uZmlnIGNhY2hlIFxudmFyIG9wdGlvbnMgPSB7XG4gICAgc3RkVFRMOiAwLFxuICAgIGNoZWNrcGVyaW9kOiA5OTk5OTksXG4gICAgZXJyb3JPbk1pc3Npbmc6IGZhbHNlLFxuICAgIHVzZUNsb25lczogdHJ1ZSxcbiAgICBkZWxldGVPbkV4cGlyZTogdHJ1ZVxufTtcblxudmFyIHJlZGlzID0gcmVxdWlyZShcInJlZGlzXCIpO1xudmFyIGNsaWVudCA9IHJlZGlzLmNyZWF0ZUNsaWVudCh7ZGV0ZWN0X2J1ZmZlcnM6IHRydWV9KTtcblxuY2xpZW50Lm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24gKGVycikge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgXCIgKyBlcnIpO1xufSk7XG5cbnZhciBNYW5hZ2VSZWRpc0NhY2hlID0gZnVuY3Rpb24gKCkge31cbm1vZHVsZS5leHBvcnRzID0gTWFuYWdlUmVkaXNDYWNoZTtcblxuLyoqXG4gKiBTZXQgY2FjaGVcbiAqIEBwYXJhbSBrZXksIGRhdGFcbiAqL1xuLy8gTWFuYWdlQ2FjaGUuc2V0Q2FjaGUgPSBmdW5jdGlvbiAoa2V5LCBvYmopIHtcbi8vICAgICB2YXIgc3RhdHVzID0gZmFsc2U7XG4vLyAgICAgVGFrYUNhY2hlLnNldChrZXksIG9iaiwgZnVuY3Rpb24gKGVyciwgc3VjY2Vzcykge1xuLy8gICAgICAgICBpZiAoIWVyciAmJiBzdWNjZXNzKSB7XG4vLyAgICAgICAgICAgICBzdGF0dXMgPSB0cnVlO1xuLy8gICAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgICAgcmV0dXJuIHN0YXR1cztcbi8vIH1cblxuXG4vLyAvKipcbi8vICAqIEdldCBjYWNoZVxuLy8gICogQHBhcmFtIGtleVxuLy8gICogQCBkYXRhQ2FjaGUgXG4vLyAgKi9cbi8vIE1hbmFnZUNhY2hlLmdldENhY2hlID0gZnVuY3Rpb24gKGtleSkge1xuLy8gICAgIHZhciBkYXRhQ2FjaGUgPSBbXTtcbi8vICAgICB0cnl7XG4vLyAgICAgICAgIGRhdGFDYWNoZSA9IFRha2FDYWNoZS5nZXQoIGtleSwgdHJ1ZSApO1xuLy8gICAgIH0gY2F0Y2goIGVyciApe1xuLy8gICAgICAgICAvLyBFTk9URk9VTkQ6IEtleSBgbm90LWV4aXN0aW5nLWtleWAgbm90IGZvdW5kXG4vLyAgICAgICAgIGRhdGFDYWNoZSA9IFtdO1xuLy8gICAgIH1cbi8vICAgICAvLyBUYWthQ2FjaGUuZ2V0KGtleSwgZnVuY3Rpb24gKGVyciwgdmFsdWUpIHtcbi8vICAgICAvLyAgICAgaWYgKCFlcnIpIHtcbi8vICAgICAvLyAgICAgICAgIGlmICh2YWx1ZSA9PSB1bmRlZmluZWQpIHtcbi8vICAgICAvLyAgICAgICAgICAgICBkYXRhQ2FjaGUgPSBbXTtcbi8vICAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgLy8gICAgICAgICAgICAgZGF0YUNhY2hlID0gdmFsdWU7XG4vLyAgICAgLy8gICAgICAgICB9XG4vLyAgICAgLy8gICAgIH1cbi8vICAgICAvLyB9KTtcbi8vICAgICByZXR1cm4gZGF0YUNhY2hlO1xuLy8gfVxuXG4vLyAvKipcbi8vICAqIEdldCBsaXN0IGtleXNcbi8vICAqIEBwYXJhbSBrZXlcbi8vICAqIEAgZGF0YUNhY2hlIFxuLy8gICovXG4vLyBNYW5hZ2VDYWNoZS5nZXRMaXN0S2V5cyA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICAvLyBhc3luY1xuLy8gICAgIFRha2FDYWNoZS5rZXlzKCBmdW5jdGlvbiggZXJyLCBteWtleXMgKXtcbi8vICAgICAgICAgaWYoICFlcnIgKXtcbi8vICAgICAgICAgY29uc29sZS5sb2coIG15a2V5cyApO1xuLy8gICAgICAgICAvLyBbIFwiYWxsXCIsIFwibXlcIiwgXCJrZXlzXCIsIFwiZm9vXCIsIFwiYmFyXCIgXVxuLy8gICAgICAgICB9XG4vLyAgICAgfSk7XG4vLyB9XG5cblxuXG5cblxuXG5cbiJdfQ==