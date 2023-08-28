'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LoggerEntity = require('../entities/LoggerEntity');

var _LoggerEntity2 = _interopRequireDefault(_LoggerEntity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events');
var LOGTYPE = {
    login: 1,
    request: 2,
    insert: 3,
    update: 4,
    delete: 5,
    export: 6,
    print: 7
};

var FLEvent = function (_EventEmitter) {
    _inherits(FLEvent, _EventEmitter);

    function FLEvent() {
        _classCallCheck(this, FLEvent);

        return _possibleConstructorReturn(this, (FLEvent.__proto__ || Object.getPrototypeOf(FLEvent)).call(this));
    }

    _createClass(FLEvent, [{
        key: 'log',
        value: function log(logType, param) {
            try {
                var type = this.getElasTypeLog(logType, param.table_name);
                if (param.content) {
                    param.content.log_type = logType;
                }
                elastic.setIgnoreIdKey(config.elasticSearch.index, type, param.content);
            } catch (ex) {
                console.trace(ex);
            }
        }
    }, {
        key: 'getElasTypeLog',
        value: function getElasTypeLog(logType, tableName) {
            if (Libs.isBlank(tableName)) {
                if (logType == LOGTYPE.login) {
                    return "log_login";
                }
                return "log_request";
            }
            return "log_" + tableName;
        }
    }]);

    return FLEvent;
}(EventEmitter);
// const ev = new FLEvent();
// /**
//  * @param {interger} logType
//  * @param {LoggerEntity} param
//  */
// ev.on('log', (logType, param)=>{
//     ev.log(logType,param);
// })
// ev.emit('log', 'a', 'bien ban');


exports.default = FLEvent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9GTEV2ZW50LmpzIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsInJlcXVpcmUiLCJMT0dUWVBFIiwibG9naW4iLCJyZXF1ZXN0IiwiaW5zZXJ0IiwidXBkYXRlIiwiZGVsZXRlIiwiZXhwb3J0IiwicHJpbnQiLCJGTEV2ZW50IiwibG9nVHlwZSIsInBhcmFtIiwidHlwZSIsImdldEVsYXNUeXBlTG9nIiwidGFibGVfbmFtZSIsImNvbnRlbnQiLCJsb2dfdHlwZSIsImVsYXN0aWMiLCJzZXRJZ25vcmVJZEtleSIsImNvbmZpZyIsImVsYXN0aWNTZWFyY2giLCJpbmRleCIsImV4IiwiY29uc29sZSIsInRyYWNlIiwidGFibGVOYW1lIiwiTGlicyIsImlzQmxhbmsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7OztBQVZBLElBQU1BLGVBQWVDLFFBQVEsUUFBUixDQUFyQjtBQUNBLElBQU1DLFVBQVU7QUFDWkMsV0FBTyxDQURLO0FBRVpDLGFBQVMsQ0FGRztBQUdaQyxZQUFRLENBSEk7QUFJWkMsWUFBUSxDQUpJO0FBS1pDLFlBQVEsQ0FMSTtBQU1aQyxZQUFRLENBTkk7QUFPWkMsV0FBTztBQVBLLENBQWhCOztJQVVxQkMsTzs7O0FBQ2pCLHVCQUFhO0FBQUE7O0FBQUE7QUFFWjs7Ozs0QkFDR0MsTyxFQUFTQyxLLEVBQU07QUFDZixnQkFBRztBQUNDLG9CQUFJQyxPQUFPLEtBQUtDLGNBQUwsQ0FBb0JILE9BQXBCLEVBQTZCQyxNQUFNRyxVQUFuQyxDQUFYO0FBQ0Esb0JBQUdILE1BQU1JLE9BQVQsRUFBaUI7QUFDYkosMEJBQU1JLE9BQU4sQ0FBY0MsUUFBZCxHQUF5Qk4sT0FBekI7QUFDSDtBQUNETyx3QkFBUUMsY0FBUixDQUF1QkMsT0FBT0MsYUFBUCxDQUFxQkMsS0FBNUMsRUFBbURULElBQW5ELEVBQXdERCxNQUFNSSxPQUE5RDtBQUNILGFBTkQsQ0FNQyxPQUFNTyxFQUFOLEVBQVM7QUFDTkMsd0JBQVFDLEtBQVIsQ0FBY0YsRUFBZDtBQUNIO0FBQ0o7Ozt1Q0FDY1osTyxFQUFTZSxTLEVBQVU7QUFDOUIsZ0JBQUdDLEtBQUtDLE9BQUwsQ0FBYUYsU0FBYixDQUFILEVBQTJCO0FBQ3ZCLG9CQUFHZixXQUFTVCxRQUFRQyxLQUFwQixFQUEwQjtBQUN0QiwyQkFBTyxXQUFQO0FBQ0g7QUFDRCx1QkFBTyxhQUFQO0FBQ0g7QUFDRCxtQkFBTyxTQUFPdUIsU0FBZDtBQUNIOzs7O0VBdkJnQzFCLFk7QUF5QnJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O2tCQWpDcUJVLE8iLCJmaWxlIjoiRkxFdmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuY29uc3QgTE9HVFlQRSA9IHtcbiAgICBsb2dpbjogMSxcbiAgICByZXF1ZXN0OiAyLFxuICAgIGluc2VydDogMyxcbiAgICB1cGRhdGU6IDQsXG4gICAgZGVsZXRlOiA1LFxuICAgIGV4cG9ydDogNixcbiAgICBwcmludDogNyxcbn1cbmltcG9ydCBMb2dnZXJFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTG9nZ2VyRW50aXR5J1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRkxFdmVudCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKVxuICAgIH1cbiAgICBsb2cobG9nVHlwZSwgcGFyYW0pe1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IHRoaXMuZ2V0RWxhc1R5cGVMb2cobG9nVHlwZSwgcGFyYW0udGFibGVfbmFtZSlcbiAgICAgICAgICAgIGlmKHBhcmFtLmNvbnRlbnQpe1xuICAgICAgICAgICAgICAgIHBhcmFtLmNvbnRlbnQubG9nX3R5cGUgPSBsb2dUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxhc3RpYy5zZXRJZ25vcmVJZEtleShjb25maWcuZWxhc3RpY1NlYXJjaC5pbmRleCwgdHlwZSxwYXJhbS5jb250ZW50KTtcbiAgICAgICAgfWNhdGNoKGV4KXtcbiAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoZXgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldEVsYXNUeXBlTG9nKGxvZ1R5cGUsIHRhYmxlTmFtZSl7XG4gICAgICAgIGlmKExpYnMuaXNCbGFuayh0YWJsZU5hbWUpKXtcbiAgICAgICAgICAgIGlmKGxvZ1R5cGU9PUxPR1RZUEUubG9naW4pe1xuICAgICAgICAgICAgICAgIHJldHVybiBcImxvZ19sb2dpblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFwibG9nX3JlcXVlc3RcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJsb2dfXCIrdGFibGVOYW1lO1xuICAgIH1cbn1cbi8vIGNvbnN0IGV2ID0gbmV3IEZMRXZlbnQoKTtcbi8vIC8qKlxuLy8gICogQHBhcmFtIHtpbnRlcmdlcn0gbG9nVHlwZVxuLy8gICogQHBhcmFtIHtMb2dnZXJFbnRpdHl9IHBhcmFtXG4vLyAgKi9cbi8vIGV2Lm9uKCdsb2cnLCAobG9nVHlwZSwgcGFyYW0pPT57XG4vLyAgICAgZXYubG9nKGxvZ1R5cGUscGFyYW0pO1xuLy8gfSlcbi8vIGV2LmVtaXQoJ2xvZycsICdhJywgJ2JpZW4gYmFuJyk7XG4iXX0=