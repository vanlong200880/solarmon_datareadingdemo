"use strict";

// Config cache 
var options = {
    stdTTL: 0,
    checkperiod: 999999,
    errorOnMissing: false,
    useClones: true,
    deleteOnExpire: true
};

var NodeCache = require("node-cache");
var TakaCache = new NodeCache(options);
var ManageCache = function ManageCache() {};
module.exports = ManageCache;

/**
 * Set cache
 * @param key, data
 */
ManageCache.setCache = function (key, obj) {
    var status = false;
    TakaCache.set(key, obj, function (err, success) {
        if (!err && success) {
            status = true;
        }
    });
    return status;
};

/**
 * Get cache
 * @param key
 * @ dataCache 
 */
ManageCache.getCache = function (key) {
    var dataCache = [];
    try {
        dataCache = TakaCache.get(key, true);
    } catch (err) {
        // ENOTFOUND: Key `not-existing-key` not found
        dataCache = [];
    }
    // TakaCache.get(key, function (err, value) {
    //     if (!err) {
    //         if (value == undefined) {
    //             dataCache = [];
    //         } else {
    //             dataCache = value;
    //         }
    //     }
    // });
    return dataCache;
};

/**
 * Get list keys
 * @param key
 * @ dataCache 
 */
ManageCache.getListKeys = function () {
    // async
    TakaCache.keys(function (err, mykeys) {
        if (!err) {
            console.log(mykeys);
            // [ "all", "my", "keys", "foo", "bar" ]
        }
    });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9Ob2RlQ2FjaGUuanMiXSwibmFtZXMiOlsib3B0aW9ucyIsInN0ZFRUTCIsImNoZWNrcGVyaW9kIiwiZXJyb3JPbk1pc3NpbmciLCJ1c2VDbG9uZXMiLCJkZWxldGVPbkV4cGlyZSIsIk5vZGVDYWNoZSIsInJlcXVpcmUiLCJUYWthQ2FjaGUiLCJNYW5hZ2VDYWNoZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJzZXRDYWNoZSIsImtleSIsIm9iaiIsInN0YXR1cyIsInNldCIsImVyciIsInN1Y2Nlc3MiLCJnZXRDYWNoZSIsImRhdGFDYWNoZSIsImdldCIsImdldExpc3RLZXlzIiwia2V5cyIsIm15a2V5cyIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQSxJQUFJQSxVQUFVO0FBQ1ZDLFlBQVEsQ0FERTtBQUVWQyxpQkFBYSxNQUZIO0FBR1ZDLG9CQUFnQixLQUhOO0FBSVZDLGVBQVcsSUFKRDtBQUtWQyxvQkFBZ0I7QUFMTixDQUFkOztBQVFBLElBQUlDLFlBQVlDLFFBQVEsWUFBUixDQUFoQjtBQUNBLElBQU1DLFlBQVksSUFBSUYsU0FBSixDQUFjTixPQUFkLENBQWxCO0FBQ0EsSUFBSVMsY0FBYyxTQUFkQSxXQUFjLEdBQVksQ0FBRSxDQUFoQztBQUNBQyxPQUFPQyxPQUFQLEdBQWlCRixXQUFqQjs7QUFFQTs7OztBQUlBQSxZQUFZRyxRQUFaLEdBQXVCLFVBQVVDLEdBQVYsRUFBZUMsR0FBZixFQUFvQjtBQUN2QyxRQUFJQyxTQUFTLEtBQWI7QUFDQVAsY0FBVVEsR0FBVixDQUFjSCxHQUFkLEVBQW1CQyxHQUFuQixFQUF3QixVQUFVRyxHQUFWLEVBQWVDLE9BQWYsRUFBd0I7QUFDNUMsWUFBSSxDQUFDRCxHQUFELElBQVFDLE9BQVosRUFBcUI7QUFDakJILHFCQUFTLElBQVQ7QUFDSDtBQUNKLEtBSkQ7QUFLQSxXQUFPQSxNQUFQO0FBQ0gsQ0FSRDs7QUFXQTs7Ozs7QUFLQU4sWUFBWVUsUUFBWixHQUF1QixVQUFVTixHQUFWLEVBQWU7QUFDbEMsUUFBSU8sWUFBWSxFQUFoQjtBQUNBLFFBQUc7QUFDQ0Esb0JBQVlaLFVBQVVhLEdBQVYsQ0FBZVIsR0FBZixFQUFvQixJQUFwQixDQUFaO0FBQ0gsS0FGRCxDQUVFLE9BQU9JLEdBQVAsRUFBWTtBQUNWO0FBQ0FHLG9CQUFZLEVBQVo7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQU9BLFNBQVA7QUFDSCxDQWxCRDs7QUFvQkE7Ozs7O0FBS0FYLFlBQVlhLFdBQVosR0FBMEIsWUFBWTtBQUNsQztBQUNBZCxjQUFVZSxJQUFWLENBQWdCLFVBQVVOLEdBQVYsRUFBZU8sTUFBZixFQUF1QjtBQUNuQyxZQUFJLENBQUNQLEdBQUwsRUFBVTtBQUNWUSxvQkFBUUMsR0FBUixDQUFhRixNQUFiO0FBQ0E7QUFDQztBQUNKLEtBTEQ7QUFNSCxDQVJEIiwiZmlsZSI6Ik5vZGVDYWNoZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbmZpZyBjYWNoZSBcbnZhciBvcHRpb25zID0ge1xuICAgIHN0ZFRUTDogMCxcbiAgICBjaGVja3BlcmlvZDogOTk5OTk5LFxuICAgIGVycm9yT25NaXNzaW5nOiBmYWxzZSxcbiAgICB1c2VDbG9uZXM6IHRydWUsXG4gICAgZGVsZXRlT25FeHBpcmU6IHRydWVcbn07XG5cbnZhciBOb2RlQ2FjaGUgPSByZXF1aXJlKFwibm9kZS1jYWNoZVwiKTtcbmNvbnN0IFRha2FDYWNoZSA9IG5ldyBOb2RlQ2FjaGUob3B0aW9ucyk7XG52YXIgTWFuYWdlQ2FjaGUgPSBmdW5jdGlvbiAoKSB7fVxubW9kdWxlLmV4cG9ydHMgPSBNYW5hZ2VDYWNoZTtcblxuLyoqXG4gKiBTZXQgY2FjaGVcbiAqIEBwYXJhbSBrZXksIGRhdGFcbiAqL1xuTWFuYWdlQ2FjaGUuc2V0Q2FjaGUgPSBmdW5jdGlvbiAoa2V5LCBvYmopIHtcbiAgICB2YXIgc3RhdHVzID0gZmFsc2U7XG4gICAgVGFrYUNhY2hlLnNldChrZXksIG9iaiwgZnVuY3Rpb24gKGVyciwgc3VjY2Vzcykge1xuICAgICAgICBpZiAoIWVyciAmJiBzdWNjZXNzKSB7XG4gICAgICAgICAgICBzdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0YXR1cztcbn1cblxuXG4vKipcbiAqIEdldCBjYWNoZVxuICogQHBhcmFtIGtleVxuICogQCBkYXRhQ2FjaGUgXG4gKi9cbk1hbmFnZUNhY2hlLmdldENhY2hlID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBkYXRhQ2FjaGUgPSBbXTtcbiAgICB0cnl7XG4gICAgICAgIGRhdGFDYWNoZSA9IFRha2FDYWNoZS5nZXQoIGtleSwgdHJ1ZSApO1xuICAgIH0gY2F0Y2goIGVyciApe1xuICAgICAgICAvLyBFTk9URk9VTkQ6IEtleSBgbm90LWV4aXN0aW5nLWtleWAgbm90IGZvdW5kXG4gICAgICAgIGRhdGFDYWNoZSA9IFtdO1xuICAgIH1cbiAgICAvLyBUYWthQ2FjaGUuZ2V0KGtleSwgZnVuY3Rpb24gKGVyciwgdmFsdWUpIHtcbiAgICAvLyAgICAgaWYgKCFlcnIpIHtcbiAgICAvLyAgICAgICAgIGlmICh2YWx1ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAvLyAgICAgICAgICAgICBkYXRhQ2FjaGUgPSBbXTtcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgZGF0YUNhY2hlID0gdmFsdWU7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9KTtcbiAgICByZXR1cm4gZGF0YUNhY2hlO1xufVxuXG4vKipcbiAqIEdldCBsaXN0IGtleXNcbiAqIEBwYXJhbSBrZXlcbiAqIEAgZGF0YUNhY2hlIFxuICovXG5NYW5hZ2VDYWNoZS5nZXRMaXN0S2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBhc3luY1xuICAgIFRha2FDYWNoZS5rZXlzKCBmdW5jdGlvbiggZXJyLCBteWtleXMgKXtcbiAgICAgICAgaWYoICFlcnIgKXtcbiAgICAgICAgY29uc29sZS5sb2coIG15a2V5cyApO1xuICAgICAgICAvLyBbIFwiYWxsXCIsIFwibXlcIiwgXCJrZXlzXCIsIFwiZm9vXCIsIFwiYmFyXCIgXVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuXG5cblxuXG5cbiJdfQ==