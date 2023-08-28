'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _JobClearLog = require('./JobClearLog');

var _JobClearLog2 = _interopRequireDefault(_JobClearLog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CronJob = require('cron').CronJob;

var Jobs = function () {
    function Jobs() {
        _classCallCheck(this, Jobs);
    }

    _createClass(Jobs, [{
        key: 'start',
        value: function start() {
            new CronJob('* * * */10 * *', function () {
                var job = new _JobClearLog2.default();
                job.clearLogByType("log_request");
            }, null, true, '');
            new CronJob('* * * */10 * *', function () {
                var job = new _JobClearLog2.default();
                job.clearLogByType("log_login");
            }, null, true, '');
            new CronJob('* * * */5 * *', function () {
                var job = new _JobClearLog2.default();
                job.clearLog();
            }, null, true, '');
        }
    }]);

    return Jobs;
}();

exports.default = Jobs;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXRjaEpvYi9Kb2JzLmpzIl0sIm5hbWVzIjpbIkNyb25Kb2IiLCJyZXF1aXJlIiwiSm9icyIsImpvYiIsIkpvYkNsZWFyTG9nIiwiY2xlYXJMb2dCeVR5cGUiLCJjbGVhckxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7QUFEQSxJQUFJQSxVQUFVQyxRQUFRLE1BQVIsRUFBZ0JELE9BQTlCOztJQUdxQkUsSTs7Ozs7OztnQ0FDVDtBQUNKLGdCQUFJRixPQUFKLENBQVksZ0JBQVosRUFBOEIsWUFBWTtBQUN0QyxvQkFBSUcsTUFBTSxJQUFJQyxxQkFBSixFQUFWO0FBQ0FELG9CQUFJRSxjQUFKLENBQW1CLGFBQW5CO0FBQ0gsYUFIRCxFQUdHLElBSEgsRUFHUyxJQUhULEVBR2UsRUFIZjtBQUlBLGdCQUFJTCxPQUFKLENBQVksZ0JBQVosRUFBOEIsWUFBWTtBQUN0QyxvQkFBSUcsTUFBTSxJQUFJQyxxQkFBSixFQUFWO0FBQ0FELG9CQUFJRSxjQUFKLENBQW1CLFdBQW5CO0FBQ0gsYUFIRCxFQUdHLElBSEgsRUFHUyxJQUhULEVBR2UsRUFIZjtBQUlBLGdCQUFJTCxPQUFKLENBQVksZUFBWixFQUE2QixZQUFZO0FBQ3JDLG9CQUFJRyxNQUFNLElBQUlDLHFCQUFKLEVBQVY7QUFDQUQsb0JBQUlHLFFBQUo7QUFDSCxhQUhELEVBR0csSUFISCxFQUdTLElBSFQsRUFHZSxFQUhmO0FBSUg7Ozs7OztrQkFkZ0JKLEkiLCJmaWxlIjoiSm9icy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBDcm9uSm9iID0gcmVxdWlyZSgnY3JvbicpLkNyb25Kb2I7XG5pbXBvcnQgSm9iQ2xlYXJMb2cgZnJvbSAnLi9Kb2JDbGVhckxvZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpvYnMge1xuICAgIHN0YXJ0KCkge1xuICAgICAgICBuZXcgQ3JvbkpvYignKiAqICogKi8xMCAqIConLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgam9iID0gbmV3IEpvYkNsZWFyTG9nKCk7XG4gICAgICAgICAgICBqb2IuY2xlYXJMb2dCeVR5cGUoXCJsb2dfcmVxdWVzdFwiKTtcbiAgICAgICAgfSwgbnVsbCwgdHJ1ZSwgJycpO1xuICAgICAgICBuZXcgQ3JvbkpvYignKiAqICogKi8xMCAqIConLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgam9iID0gbmV3IEpvYkNsZWFyTG9nKCk7XG4gICAgICAgICAgICBqb2IuY2xlYXJMb2dCeVR5cGUoXCJsb2dfbG9naW5cIik7XG4gICAgICAgIH0sIG51bGwsIHRydWUsICcnKTtcbiAgICAgICAgbmV3IENyb25Kb2IoJyogKiAqICovNSAqIConLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgam9iID0gbmV3IEpvYkNsZWFyTG9nKCk7XG4gICAgICAgICAgICBqb2IuY2xlYXJMb2coKTtcbiAgICAgICAgfSwgbnVsbCwgdHJ1ZSwgJycpO1xuICAgIH1cbn0iXX0=