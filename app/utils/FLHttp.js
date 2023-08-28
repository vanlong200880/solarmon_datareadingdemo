"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require("./Constants");

var _Constants2 = _interopRequireDefault(_Constants);

var _Libs = require("./Libs");

var _Libs2 = _interopRequireDefault(_Libs);

var _qs = require("qs");

var _qs2 = _interopRequireDefault(_qs);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FLHttp = function () {
    function FLHttp() {
        _classCallCheck(this, FLHttp);
    }

    _createClass(FLHttp, [{
        key: "initialize",

        // constructor(header){
        //     this.header = header;
        // }
        value: function initialize(url, data) {
            var self = this;
            // Setting URL and headers for request
            // var json = JSON.stringify(data);
            var json = data;
            var header = this.header;
            // Return new promise 
            return new Promise(function (resolve, reject) {
                // Do async job
                _axios2.default.post(url, json, header).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    console.log("error:", error);
                    reject(error);
                });
            });
        }
    }, {
        key: "post",
        value: function post(url, params, callBack) {
            var self = this;
            var initializePromise = this.initialize(url, params);
            initializePromise.then(function (result) {
                if (result.status != 200) {
                    callBack(false, {});
                    return;
                }
                if (result != null) {
                    callBack(true, result);
                    return;
                } else {
                    callBack(false, {});
                }
            }, function (status, err) {
                callBack(false, err);
            });
        }
    }, {
        key: "get",
        value: function get(url, callBack) {
            var self = this;
            var header = this.header;
            _axios2.default.get(url, header).then(function (response) {
                callBack(true, response);
            }).catch(function (error) {
                console.log("error:", error);
                callBack(false, error);
            });
        }
    }, {
        key: "setHeader",
        value: function setHeader(_ref) {
            var authStr = _ref.authStr,
                contentType = _ref.contentType,
                method = _ref.method,
                _ref$timeout = _ref.timeout,
                timeout = _ref$timeout === undefined ? 180000 : _ref$timeout;

            var headers = {
                'Content-Type': contentType,
                'Authorization': "Basic " + authStr,
                'method': method
            };
            this.header = { headers: headers, timeout: timeout };
        }
    }]);

    return FLHttp;
}();

exports.default = FLHttp;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9GTEh0dHAuanMiXSwibmFtZXMiOlsiRkxIdHRwIiwidXJsIiwiZGF0YSIsInNlbGYiLCJqc29uIiwiaGVhZGVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJheGlvcyIsInBvc3QiLCJ0aGVuIiwicmVzcG9uc2UiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsInBhcmFtcyIsImNhbGxCYWNrIiwiaW5pdGlhbGl6ZVByb21pc2UiLCJpbml0aWFsaXplIiwicmVzdWx0Iiwic3RhdHVzIiwiZXJyIiwiZ2V0IiwiYXV0aFN0ciIsImNvbnRlbnRUeXBlIiwibWV0aG9kIiwidGltZW91dCIsImhlYWRlcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0lBQ3FCQSxNOzs7Ozs7OztBQUNqQjtBQUNBO0FBQ0E7bUNBQ1dDLEcsRUFBS0MsSSxFQUFNO0FBQ2xCLGdCQUFJQyxPQUFPLElBQVg7QUFDQTtBQUNBO0FBQ0EsZ0JBQUlDLE9BQU9GLElBQVg7QUFDQSxnQkFBSUcsU0FBUyxLQUFLQSxNQUFsQjtBQUNBO0FBQ0EsbUJBQU8sSUFBSUMsT0FBSixDQUFZLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQzFDO0FBQ0FDLGdDQUFNQyxJQUFOLENBQVdULEdBQVgsRUFBZ0JHLElBQWhCLEVBQXNCQyxNQUF0QixFQUNLTSxJQURMLENBQ1UsVUFBVUMsUUFBVixFQUFvQjtBQUN0QkwsNEJBQVFLLFFBQVI7QUFDSCxpQkFITCxFQUlLQyxLQUpMLENBSVcsVUFBVUMsS0FBVixFQUFpQjtBQUNwQkMsNEJBQVFDLEdBQVIsQ0FBWSxRQUFaLEVBQXFCRixLQUFyQjtBQUNBTiwyQkFBT00sS0FBUDtBQUNILGlCQVBMO0FBUUgsYUFWTSxDQUFQO0FBV0g7Ozs2QkFDSWIsRyxFQUFLZ0IsTSxFQUFRQyxRLEVBQVU7QUFDeEIsZ0JBQUlmLE9BQU8sSUFBWDtBQUNBLGdCQUFJZ0Isb0JBQW9CLEtBQUtDLFVBQUwsQ0FBZ0JuQixHQUFoQixFQUFxQmdCLE1BQXJCLENBQXhCO0FBQ0FFLDhCQUFrQlIsSUFBbEIsQ0FBdUIsVUFBVVUsTUFBVixFQUFrQjtBQUNyQyxvQkFBSUEsT0FBT0MsTUFBUCxJQUFpQixHQUFyQixFQUEwQjtBQUN0QkosNkJBQVMsS0FBVCxFQUFnQixFQUFoQjtBQUNBO0FBQ0g7QUFDRCxvQkFBSUcsVUFBVSxJQUFkLEVBQW9CO0FBQ2hCSCw2QkFBUyxJQUFULEVBQWVHLE1BQWY7QUFDQTtBQUNILGlCQUhELE1BR087QUFDSEgsNkJBQVMsS0FBVCxFQUFnQixFQUFoQjtBQUNIO0FBQ0osYUFYRCxFQVdHLFVBQVVJLE1BQVYsRUFBa0JDLEdBQWxCLEVBQXVCO0FBQ3RCTCx5QkFBUyxLQUFULEVBQWdCSyxHQUFoQjtBQUNILGFBYkQ7QUFjSDs7OzRCQUNHdEIsRyxFQUFLaUIsUSxFQUFVO0FBQ2YsZ0JBQUlmLE9BQU8sSUFBWDtBQUNBLGdCQUFJRSxTQUFTLEtBQUtBLE1BQWxCO0FBQ0FJLDRCQUFNZSxHQUFOLENBQVV2QixHQUFWLEVBQWVJLE1BQWYsRUFDQ00sSUFERCxDQUNNLFVBQVVDLFFBQVYsRUFBb0I7QUFDdEJNLHlCQUFTLElBQVQsRUFBZU4sUUFBZjtBQUNILGFBSEQsRUFJQ0MsS0FKRCxDQUlPLFVBQVVDLEtBQVYsRUFBaUI7QUFDcEJDLHdCQUFRQyxHQUFSLENBQVksUUFBWixFQUFxQkYsS0FBckI7QUFDQUkseUJBQVMsS0FBVCxFQUFnQkosS0FBaEI7QUFDSCxhQVBEO0FBUUg7Ozt3Q0FFMEQ7QUFBQSxnQkFBL0NXLE9BQStDLFFBQS9DQSxPQUErQztBQUFBLGdCQUF0Q0MsV0FBc0MsUUFBdENBLFdBQXNDO0FBQUEsZ0JBQXpCQyxNQUF5QixRQUF6QkEsTUFBeUI7QUFBQSxvQ0FBakJDLE9BQWlCO0FBQUEsZ0JBQWpCQSxPQUFpQixnQ0FBVCxNQUFTOztBQUN2RCxnQkFBSUMsVUFBVTtBQUNWLGdDQUFnQkgsV0FETjtBQUVWLGlDQUFpQixXQUFTRCxPQUZoQjtBQUdWLDBCQUFVRTtBQUhBLGFBQWQ7QUFLQSxpQkFBS3RCLE1BQUwsR0FBYyxFQUFFd0IsU0FBU0EsT0FBWCxFQUFtQkQsU0FBU0EsT0FBNUIsRUFBZDtBQUNIOzs7Ozs7a0JBN0RnQjVCLE0iLCJmaWxlIjoiRkxIdHRwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbnN0YW50cyBmcm9tIFwiLi9Db25zdGFudHNcIjtcbmltcG9ydCBMaWJzIGZyb20gXCIuL0xpYnNcIjtcbmltcG9ydCBxcyBmcm9tICdxcyc7XG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRkxIdHRwIHtcbiAgICAvLyBjb25zdHJ1Y3RvcihoZWFkZXIpe1xuICAgIC8vICAgICB0aGlzLmhlYWRlciA9IGhlYWRlcjtcbiAgICAvLyB9XG4gICAgaW5pdGlhbGl6ZSh1cmwsIGRhdGEpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBTZXR0aW5nIFVSTCBhbmQgaGVhZGVycyBmb3IgcmVxdWVzdFxuICAgICAgICAvLyB2YXIganNvbiA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICB2YXIganNvbiA9IGRhdGE7XG4gICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLmhlYWRlcjtcbiAgICAgICAgLy8gUmV0dXJuIG5ldyBwcm9taXNlIFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgLy8gRG8gYXN5bmMgam9iXG4gICAgICAgICAgICBheGlvcy5wb3N0KHVybCwganNvbiwgaGVhZGVyKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjpcIixlcnJvcilcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgcG9zdCh1cmwsIHBhcmFtcywgY2FsbEJhY2spIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaW5pdGlhbGl6ZVByb21pc2UgPSB0aGlzLmluaXRpYWxpemUodXJsLCBwYXJhbXMpO1xuICAgICAgICBpbml0aWFsaXplUHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzICE9IDIwMCkge1xuICAgICAgICAgICAgICAgIGNhbGxCYWNrKGZhbHNlLCB7fSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY2FsbEJhY2sodHJ1ZSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxCYWNrKGZhbHNlLCB7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uIChzdGF0dXMsIGVycikge1xuICAgICAgICAgICAgY2FsbEJhY2soZmFsc2UsIGVycik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQodXJsLCBjYWxsQmFjaykge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLmhlYWRlcjtcbiAgICAgICAgYXhpb3MuZ2V0KHVybCwgaGVhZGVyKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNhbGxCYWNrKHRydWUsIHJlc3BvbnNlKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjpcIixlcnJvcilcbiAgICAgICAgICAgIGNhbGxCYWNrKGZhbHNlLCBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBzZXRIZWFkZXIoeyBhdXRoU3RyLCBjb250ZW50VHlwZSwgbWV0aG9kLCB0aW1lb3V0PTE4MDAwMH0pIHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogY29udGVudFR5cGUsXG4gICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IFwiQmFzaWMgXCIrYXV0aFN0cixcbiAgICAgICAgICAgICdtZXRob2QnOiBtZXRob2RcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhlYWRlciA9IHsgaGVhZGVyczogaGVhZGVycyx0aW1lb3V0OiB0aW1lb3V0IH07XG4gICAgfVxufVxuXG4iXX0=