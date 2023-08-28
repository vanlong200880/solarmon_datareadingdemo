'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _DataReadingsService = require('../services/DataReadingsService');

var _DataReadingsService2 = _interopRequireDefault(_DataReadingsService);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataReadingsController = function (_AbstractManagerContr) {
    _inherits(DataReadingsController, _AbstractManagerContr);

    function DataReadingsController() {
        _classCallCheck(this, DataReadingsController);

        return _possibleConstructorReturn(this, (DataReadingsController.__proto__ || Object.getPrototypeOf(DataReadingsController)).apply(this, arguments));
    }

    _createClass(DataReadingsController, [{
        key: 'getDataRaw',


        /**
         * @description Get data raw
         * @author Long.Pham
         * @since 10/09/2021
         * @param {*} res 
         * @param {*} postData 
         */
        value: function getDataRaw(res, postData) {
            try {
                var service = new _DataReadingsService2.default();
                var status = postData.status.toUpperCase();
                var _resData = {};
                // console.log("status: ", postData.status, " - deviceID: ", postData.deviceID, "- time: ", postData.timestamp);
                // const logger = FLLogger.getLogger(postData.deviceID);
                // logger.error(postData);

                switch (status) {
                    case 'DISCONNECTED':
                    case 'OK':
                        // Save data to database
                        if (!Libs.isBlank(postData.deviceID)) {
                            (0, _sync2.default)(function () {
                                service.insertDataReadings(postData, function (err, rs) {
                                    if (rs && err) {
                                        _resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), {}, 0);
                                    } else {
                                        _resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                    }
                                    res.send(_resData);
                                });
                            });
                        } else {
                            // save error device not exits
                            _resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                            res.send(_resData);
                        }
                        break;
                    default:
                        // Save error disconnected
                        _resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                        res.send(_resData);
                        break;
                }
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Get data alarm
         * @author Long.Pham
         * @since 11/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDataAlarm',
        value: function getDataAlarm(res, postData) {
            try {
                var service = new _DataReadingsService2.default();
                var status = !Libs.isBlank(postData.status) ? postData.status.toUpperCase() : null;
                var _resData2 = {};
                // console.log("postData: ", postData);
                switch (status) {
                    case 'OK':
                        // Save data to database
                        if (!Libs.isBlank(postData.deviceID)) {
                            (0, _sync2.default)(function () {
                                service.insertAlarmReadings(postData, function (err, rs) {
                                    if (rs && err) {
                                        _resData2 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), {}, 0);
                                    } else {
                                        _resData2 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                    }
                                    res.send(_resData2);
                                });
                            });
                        } else {
                            // save error device not exits
                            _resData2 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                            res.send(_resData2);
                        }
                        break;
                    default:
                        // Save error disconnected
                        _resData2 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                        res.send(_resData2);
                        break;
                }
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Get List item
         * @author Long.Pham
         * @since 10/09/2021
         * @param {} res 
         * @param {*} postData 
         */

    }, {
        key: 'getList',
        value: function getList(res, postData) {}

        /**
         * @description Get detail item
         * @author Long.Pham
         * @since 10/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {}

        /**
         * @description Delete item
         * @author Long.Pham
         * @since 10/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {}

        /**
         * @description Save action
         * @author Long.Pham
         * @since 10/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {}
    }]);

    return DataReadingsController;
}(_AbstractManagerController2.default);

exports.default = DataReadingsController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0RhdGFSZWFkaW5nc0NvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiRGF0YVJlYWRpbmdzQ29udHJvbGxlciIsInJlcyIsInBvc3REYXRhIiwic2VydmljZSIsIkRhdGFSZWFkaW5nc1NlcnZpY2UiLCJzdGF0dXMiLCJ0b1VwcGVyQ2FzZSIsInJlc0RhdGEiLCJMaWJzIiwiaXNCbGFuayIsImRldmljZUlEIiwiaW5zZXJ0RGF0YVJlYWRpbmdzIiwiZXJyIiwicnMiLCJyZXR1cm5Kc29uUmVzdWx0IiwiaTE4biIsIl9fIiwic2VuZCIsImUiLCJpbnNlcnRBbGFybVJlYWRpbmdzIiwiQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxzQjs7Ozs7Ozs7Ozs7OztBQUVGOzs7Ozs7O21DQU9XQyxHLEVBQUtDLFEsRUFBVTtBQUN0QixnQkFBSTtBQUNBLG9CQUFJQyxVQUFVLElBQUlDLDZCQUFKLEVBQWQ7QUFDQSxvQkFBSUMsU0FBVUgsU0FBU0csTUFBVixDQUFrQkMsV0FBbEIsRUFBYjtBQUNBLG9CQUFJQyxXQUFVLEVBQWQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0JBQVFGLE1BQVI7QUFDSSx5QkFBSyxjQUFMO0FBQ0EseUJBQUssSUFBTDtBQUNJO0FBQ0EsNEJBQUksQ0FBQ0csS0FBS0MsT0FBTCxDQUFhUCxTQUFTUSxRQUF0QixDQUFMLEVBQXNDO0FBQ2xDLGdEQUFLLFlBQVk7QUFDYlAsd0NBQVFRLGtCQUFSLENBQTJCVCxRQUEzQixFQUFxQyxVQUFVVSxHQUFWLEVBQWVDLEVBQWYsRUFBbUI7QUFDcEQsd0NBQUlBLE1BQU1ELEdBQVYsRUFBZTtBQUNYTCxtREFBVUMsS0FBS00sZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEJDLEtBQUtDLEVBQUwsQ0FBUSxxQkFBUixDQUE1QixFQUE0RCxFQUE1RCxFQUFnRSxDQUFoRSxD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QUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxZQUFSLENBQTdCLEVBQW9ELEVBQUUsU0FBU0UsSUFBSSxFQUFmLEVBQXBELEVBQXlFLENBQXpFLENBQWQ7QUFDQWpCLG9CQUFJZ0IsSUFBSixDQUFTVixPQUFUO0FBQ0g7QUFDSjs7QUFJRDs7Ozs7Ozs7OztnQ0FPUU4sRyxFQUFLQyxRLEVBQVUsQ0FDdEI7O0FBRUQ7Ozs7Ozs7Ozs7a0NBT1VELEcsRUFBS0MsUSxFQUFVLENBQ3hCOztBQUVEOzs7Ozs7Ozs7O3FDQU9hRCxHLEVBQUtDLFEsRUFBVSxDQUUzQjs7QUFFRDs7Ozs7Ozs7Ozt5Q0FPaUJELEcsRUFBS0MsUSxFQUFVLENBRS9COzs7O0VBaEpnQ2tCLG1DOztrQkFtSnRCcEIsc0IiLCJmaWxlIjoiRGF0YVJlYWRpbmdzQ29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlcic7XG5pbXBvcnQgRGF0YVJlYWRpbmdzU2VydmljZSBmcm9tICcuLi9zZXJ2aWNlcy9EYXRhUmVhZGluZ3NTZXJ2aWNlJztcbmltcG9ydCBTeW5jIGZyb20gJ3N5bmMnO1xuXG5jbGFzcyBEYXRhUmVhZGluZ3NDb250cm9sbGVyIGV4dGVuZHMgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGRhdGEgcmF3XG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTAvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGF0YVJhdyhyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBEYXRhUmVhZGluZ3NTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gKHBvc3REYXRhLnN0YXR1cykudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIGxldCByZXNEYXRhID0ge307XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInN0YXR1czogXCIsIHBvc3REYXRhLnN0YXR1cywgXCIgLSBkZXZpY2VJRDogXCIsIHBvc3REYXRhLmRldmljZUlELCBcIi0gdGltZTogXCIsIHBvc3REYXRhLnRpbWVzdGFtcCk7XG4gICAgICAgICAgICAvLyBjb25zdCBsb2dnZXIgPSBGTExvZ2dlci5nZXRMb2dnZXIocG9zdERhdGEuZGV2aWNlSUQpO1xuICAgICAgICAgICAgLy8gbG9nZ2VyLmVycm9yKHBvc3REYXRhKTtcblxuICAgICAgICAgICAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdESVNDT05ORUNURUQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ09LJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2F2ZSBkYXRhIHRvIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKHBvc3REYXRhLmRldmljZUlEKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5pbnNlcnREYXRhUmVhZGluZ3MocG9zdERhdGEsIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChycyAmJiBlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfU1VDQ0VTUycpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSBlcnJvciBkZXZpY2Ugbm90IGV4aXRzXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhdmUgZXJyb3IgZGlzY29ubmVjdGVkXG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBkYXRhIGFsYXJtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGF0YUFsYXJtKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IERhdGFSZWFkaW5nc1NlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBzdGF0dXMgPSAhTGlicy5pc0JsYW5rKHBvc3REYXRhLnN0YXR1cykgPyAocG9zdERhdGEuc3RhdHVzKS50b1VwcGVyQ2FzZSgpIDogbnVsbDtcbiAgICAgICAgICAgIGxldCByZXNEYXRhID0ge307XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBvc3REYXRhOiBcIiwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdPSyc6XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhdmUgZGF0YSB0byBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhwb3N0RGF0YS5kZXZpY2VJRCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuaW5zZXJ0QWxhcm1SZWFkaW5ncyhwb3N0RGF0YSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJzICYmIGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIGVycm9yIGRldmljZSBub3QgZXhpdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2F2ZSBlcnJvciBkaXNjb25uZWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDEwLzA5LzIwMjFcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0TGlzdChyZXMsIHBvc3REYXRhKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBkZXRhaWwgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDEwLzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldERldGFpbChyZXMsIHBvc3REYXRhKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIERlbGV0ZSBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTAvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDEwLzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGFzeW5jIHNhdmVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuXG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCBEYXRhUmVhZGluZ3NDb250cm9sbGVyOyJdfQ==