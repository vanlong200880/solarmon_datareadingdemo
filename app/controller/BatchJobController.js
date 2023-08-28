'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _BatchJobService = require('../services/BatchJobService');

var _BatchJobService2 = _interopRequireDefault(_BatchJobService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BatchJobController = function (_BaseController) {
    _inherits(BatchJobController, _BaseController);

    function BatchJobController() {
        _classCallCheck(this, BatchJobController);

        return _possibleConstructorReturn(this, (BatchJobController.__proto__ || Object.getPrototypeOf(BatchJobController)).call(this));
    }

    /**
     * @description run batch job no communication
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */


    _createClass(BatchJobController, [{
        key: 'runNoCommunication',
        value: function runNoCommunication(res, postData) {
            try {
                var service = new _BatchJobService2.default();
                service.runNoCommunication({}, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                });
            } catch (e) {
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description run batch job reset energy today
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'resetTodayEnergy',
        value: function resetTodayEnergy(res, postData) {
            try {
                var service = new _BatchJobService2.default();
                service.resetTodayEnergy({}, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                });
            } catch (e) {
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description run batch job reset power now
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'resetPowerNow',
        value: function resetPowerNow(res, postData) {
            try {
                var service = new _BatchJobService2.default();
                service.resetPowerNow({}, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                });
            } catch (e) {
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description run batch job reset power now
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'updatedDevicePlant',
        value: function updatedDevicePlant(res, postData) {
            try {
                var service = new _BatchJobService2.default();
                service.updatedDevicePlant({}, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                });
            } catch (e) {
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Get detail item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {}

        /**
         * @description Save action
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {}

        /**
         * @description Get List item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {} res 
         * @param {*} postData 
         */

    }, {
        key: 'getList',
        value: function getList(res, postData) {}

        /**
         * @description Delete item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {}
    }]);

    return BatchJobController;
}(_BaseController3.default);

exports.default = BatchJobController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0JhdGNoSm9iQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJCYXRjaEpvYkNvbnRyb2xsZXIiLCJyZXMiLCJwb3N0RGF0YSIsInNlcnZpY2UiLCJCYXRjaEpvYlNlcnZpY2UiLCJydW5Ob0NvbW11bmljYXRpb24iLCJlcnIiLCJycyIsInJlc0RhdGEiLCJMaWJzIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInNlbmQiLCJlIiwicmVzZXRUb2RheUVuZXJneSIsInJlc2V0UG93ZXJOb3ciLCJ1cGRhdGVkRGV2aWNlUGxhbnQiLCJCYXNlQ29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsa0I7OztBQUNGLGtDQUFjO0FBQUE7O0FBQUE7QUFFYjs7QUFHRDs7Ozs7Ozs7Ozs7MkNBT21CQyxHLEVBQUtDLFEsRUFBVTtBQUM5QixnQkFBSTtBQUNBLG9CQUFJQyxVQUFVLElBQUlDLHlCQUFKLEVBQWQ7QUFDQUQsd0JBQVFFLGtCQUFSLENBQTJCLEVBQTNCLEVBQStCLFVBQVVDLEdBQVYsRUFBZUMsRUFBZixFQUFtQjtBQUM5Qyx3QkFBSUMsVUFBVSxFQUFkO0FBQ0Esd0JBQUksQ0FBQ0YsR0FBTCxFQUFVO0FBQ05FLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixJQUF0QixFQUE0QkMsS0FBS0MsRUFBTCxDQUFRLGdCQUFSLENBQTVCLEVBQXVELEVBQXZELEVBQTJELENBQTNELENBQVY7QUFDSCxxQkFGRCxNQUVPO0FBQ0hKLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLGFBQVIsQ0FBN0IsRUFBcUQsRUFBckQsRUFBeUQsQ0FBekQsQ0FBVjtBQUNIO0FBQ0RYLHdCQUFJWSxJQUFKLENBQVNMLE9BQVQ7QUFDSCxpQkFSRDtBQVNILGFBWEQsQ0FXRSxPQUFPTSxDQUFQLEVBQVU7QUFDUixvQkFBSU4sVUFB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RCxDQUEzRCxDQUFWO0FBQ0gscUJBRkQsTUFFTztBQUNISixrQ0FBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxhQUFSLENBQTdCLEVBQXFELEVBQXJELEVBQXlELENBQXpELENBQVY7QUFDSDtBQUNEWCx3QkFBSVksSUFBSixDQUFTTCxPQUFUO0FBQ0gsaUJBUkQ7QUFTSCxhQVhELENBV0UsT0FBT00sQ0FBUCxFQUFVO0FBQ1Isb0JBQUlOLFVBQVUsRUFBZDtBQUNBQSwwQkFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxZQUFSLENBQTdCLEVBQW9ELEVBQUUsU0FBU0UsSUFBSSxFQUFmLEVBQXBELEVBQXlFLENBQXpFLENBQVY7QUFDQWIsb0JBQUlZLElBQUosQ0FBU0wsT0FBVDtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7Ozs7a0NBT1VQLEcsRUFBS0MsUSxFQUFVLENBRXhCOztBQUtEOzs7Ozs7Ozs7O3lDQU9pQkQsRyxFQUFLQyxRLEVBQVUsQ0FFL0I7O0FBSUQ7Ozs7Ozs7Ozs7Z0NBT1FELEcsRUFBS0MsUSxFQUFVLENBR3RCOztBQUdEOzs7Ozs7Ozs7O3FDQU9hRCxHLEVBQUtDLFEsRUFBVSxDQUUzQjs7OztFQXBLNEJnQix3Qjs7a0JBd0tsQmxCLGtCIiwiZmlsZSI6IkJhdGNoSm9iQ29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQ29udHJvbGxlciBmcm9tICcuLi9jb3JlL0Jhc2VDb250cm9sbGVyJztcbmltcG9ydCBCYXRjaEpvYlNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvQmF0Y2hKb2JTZXJ2aWNlJztcblxuY2xhc3MgQmF0Y2hKb2JDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIHJ1biBiYXRjaCBqb2Igbm8gY29tbXVuaWNhdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIHJ1bk5vQ29tbXVuaWNhdGlvbihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBCYXRjaEpvYlNlcnZpY2UoKTtcbiAgICAgICAgICAgIHNlcnZpY2UucnVuTm9Db21tdW5pY2F0aW9uKHt9LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIFxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBydW4gYmF0Y2ggam9iIHJlc2V0IGVuZXJneSB0b2RheVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICByZXNldFRvZGF5RW5lcmd5KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IEJhdGNoSm9iU2VydmljZSgpO1xuICAgICAgICAgICAgc2VydmljZS5yZXNldFRvZGF5RW5lcmd5KHt9LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBydW4gYmF0Y2ggam9iIHJlc2V0IHBvd2VyIG5vd1xuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICByZXNldFBvd2VyTm93KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IEJhdGNoSm9iU2VydmljZSgpO1xuICAgICAgICAgICAgc2VydmljZS5yZXNldFBvd2VyTm93KHt9LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIFxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBydW4gYmF0Y2ggam9iIHJlc2V0IHBvd2VyIG5vd1xuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICB1cGRhdGVkRGV2aWNlUGxhbnQocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQmF0Y2hKb2JTZXJ2aWNlKCk7XG4gICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZWREZXZpY2VQbGFudCh7fSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBkZXRhaWwgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldERldGFpbChyZXMsIHBvc3REYXRhKSB7XG5cbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBhc3luYyBzYXZlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcblxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0TGlzdChyZXMsIHBvc3REYXRhKSB7XG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIERlbGV0ZSBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcblxuICAgIH1cblxuXG59XG5leHBvcnQgZGVmYXVsdCBCYXRjaEpvYkNvbnRyb2xsZXI7Il19