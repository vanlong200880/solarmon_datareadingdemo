"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClearLog = function () {
    function ClearLog() {
        _classCallCheck(this, ClearLog);
    }

    _createClass(ClearLog, [{
        key: "clearLogByType",


        /**
         * clear log theo type truyền vào
         * @param {*} type 
         */
        value: function clearLogByType(type) {
            //TODO: query clear log on elasticsearch
            var self = this;
            var index = config.elasticSearch.index;
            var query = elastic.buildQuery(index, type, 0, {}, [], [], false, 10000, null);
            elastic.search(query, function (err, res) {
                if (!err) {
                    var data = res.data;
                    self.deleteByQuery(data, index, type);
                }
            });
        }

        /**
         * clear log theo type định nghĩa sẵn
         */

    }, {
        key: "clearLog",
        value: function clearLog() {
            //TODO: query clear log on elasticsearch
            var self = this;
            var index = config.elasticSearch.index;

            var _loop = function _loop() {
                var type = "log_" + Constants.tables_name[key];
                query = elastic.buildQuery(index, type, 0, {}, [], [], false, 10000, null);

                elastic.search(query, function (err, res) {
                    if (!err) {
                        var data = res.data;
                        self.deleteByQuery(data, index, type);
                    }
                });
            };

            for (var key in Constants.tables_name) {
                var query;

                _loop();
            }
        }

        /**
         * tiến hành delete bằng elastic search
         * @param {*} data 
         * @param {*} index 
         * @param {*} type 
         */

    }, {
        key: "deleteByQuery",
        value: function deleteByQuery(data, index, type) {
            var self = this;
            if (Libs.isArrayData(data)) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var time = self.convertEventTime(item.event_time);
                    var now = new Date();
                    if (!Libs.isBlank(time) && now.getTime() - Libs.convertDateToMilliseconds(time) > config.elasticSearch.logExpire) {
                        var deleteQuery = self.buildDeleteQuery(type, item.id);
                        elastic.deleteByQuery(index, type, deleteQuery);
                    }
                }
            }
        }

        /**
         * chuyển event_time lấy từ elastic để so sánh với ngày hiện tại
         * @param {*} eventTime 
         */

    }, {
        key: "convertEventTime",
        value: function convertEventTime(eventTime) {
            if (Libs.isBlank(eventTime)) return null;
            var day = eventTime.substring(6, 8);
            var month = eventTime.substring(4, 6);
            var year = eventTime.substring(0, 4);
            var hour = eventTime.substring(8, 10);
            var min = eventTime.substring(10, 12);
            var sec = eventTime.substring(12);
            var time = year + "-" + month + "-" + day;
            time += " " + hour + ":" + min;
            return time;
        }

        /**
         * build delete query cho elastic
         * @param {*} type 
         * @param {*} id 
         */

    }, {
        key: "buildDeleteQuery",
        value: function buildDeleteQuery(type, id) {
            var deleteQuery = {
                "bool": {
                    "must": [{
                        "term": {
                            "_type": type
                        }
                    }, {
                        "term": {
                            "_id": id
                        }
                    }]
                }
            };
            return deleteQuery;
        }
    }]);

    return ClearLog;
}();

exports.default = ClearLog;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXRjaEpvYi9Kb2JDbGVhckxvZy5qcyJdLCJuYW1lcyI6WyJDbGVhckxvZyIsInR5cGUiLCJzZWxmIiwiaW5kZXgiLCJjb25maWciLCJlbGFzdGljU2VhcmNoIiwicXVlcnkiLCJlbGFzdGljIiwiYnVpbGRRdWVyeSIsInNlYXJjaCIsImVyciIsInJlcyIsImRhdGEiLCJkZWxldGVCeVF1ZXJ5IiwiQ29uc3RhbnRzIiwidGFibGVzX25hbWUiLCJrZXkiLCJMaWJzIiwiaXNBcnJheURhdGEiLCJpIiwibGVuZ3RoIiwiaXRlbSIsInRpbWUiLCJjb252ZXJ0RXZlbnRUaW1lIiwiZXZlbnRfdGltZSIsIm5vdyIsIkRhdGUiLCJpc0JsYW5rIiwiZ2V0VGltZSIsImNvbnZlcnREYXRlVG9NaWxsaXNlY29uZHMiLCJsb2dFeHBpcmUiLCJkZWxldGVRdWVyeSIsImJ1aWxkRGVsZXRlUXVlcnkiLCJpZCIsImV2ZW50VGltZSIsImRheSIsInN1YnN0cmluZyIsIm1vbnRoIiwieWVhciIsImhvdXIiLCJtaW4iLCJzZWMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLFE7Ozs7Ozs7OztBQUVqQjs7Ozt1Q0FJZUMsSSxFQUFNO0FBQ2pCO0FBQ0EsZ0JBQUlDLE9BQU8sSUFBWDtBQUNBLGdCQUFJQyxRQUFRQyxPQUFPQyxhQUFQLENBQXFCRixLQUFqQztBQUNBLGdCQUFJRyxRQUFRQyxRQUFRQyxVQUFSLENBQW1CTCxLQUFuQixFQUEwQkYsSUFBMUIsRUFBZ0MsQ0FBaEMsRUFBbUMsRUFBbkMsRUFBdUMsRUFBdkMsRUFBMkMsRUFBM0MsRUFBK0MsS0FBL0MsRUFBc0QsS0FBdEQsRUFBNkQsSUFBN0QsQ0FBWjtBQUNBTSxvQkFBUUUsTUFBUixDQUFlSCxLQUFmLEVBQXNCLFVBQVVJLEdBQVYsRUFBZUMsR0FBZixFQUFvQjtBQUN0QyxvQkFBSSxDQUFDRCxHQUFMLEVBQVU7QUFDTix3QkFBSUUsT0FBT0QsSUFBSUMsSUFBZjtBQUNBVix5QkFBS1cs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O3lDQUtpQnJCLEksRUFBTWdDLEUsRUFBSTtBQUN2QixnQkFBSUYsY0FBYztBQUNkLHdCQUFRO0FBQ0osNEJBQVEsQ0FDSjtBQUNJLGdDQUFRO0FBQ0oscUNBQVM5QjtBQURMO0FBRFoscUJBREksRUFNSjtBQUNJLGdDQUFRO0FBQ0osbUNBQU9nQztBQURIO0FBRFoscUJBTkk7QUFESjtBQURNLGFBQWxCO0FBZ0JBLG1CQUFPRixXQUFQO0FBQ0g7Ozs7OztrQkFwR2dCL0IsUSIsImZpbGUiOiJKb2JDbGVhckxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIENsZWFyTG9nIHtcblxuICAgIC8qKlxuICAgICAqIGNsZWFyIGxvZyB0aGVvIHR5cGUgdHJ1eeG7gW4gdsOgb1xuICAgICAqIEBwYXJhbSB7Kn0gdHlwZSBcbiAgICAgKi9cbiAgICBjbGVhckxvZ0J5VHlwZSh0eXBlKSB7XG4gICAgICAgIC8vVE9ETzogcXVlcnkgY2xlYXIgbG9nIG9uIGVsYXN0aWNzZWFyY2hcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaW5kZXggPSBjb25maWcuZWxhc3RpY1NlYXJjaC5pbmRleDtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gZWxhc3RpYy5idWlsZFF1ZXJ5KGluZGV4LCB0eXBlLCAwLCB7fSwgW10sIFtdLCBmYWxzZSwgMTAwMDAsIG51bGwpO1xuICAgICAgICBlbGFzdGljLnNlYXJjaChxdWVyeSwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWxldGVCeVF1ZXJ5KGRhdGEsIGluZGV4LCB0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjbGVhciBsb2cgdGhlbyB0eXBlIMSR4buLbmggbmdoxKlhIHPhurVuXG4gICAgICovXG4gICAgY2xlYXJMb2coKSB7XG4gICAgICAgIC8vVE9ETzogcXVlcnkgY2xlYXIgbG9nIG9uIGVsYXN0aWNzZWFyY2hcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaW5kZXggPSBjb25maWcuZWxhc3RpY1NlYXJjaC5pbmRleDtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIENvbnN0YW50cy50YWJsZXNfbmFtZSkge1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBcImxvZ19cIiArIENvbnN0YW50cy50YWJsZXNfbmFtZVtrZXldO1xuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gZWxhc3RpYy5idWlsZFF1ZXJ5KGluZGV4LCB0eXBlLCAwLCB7fSwgW10sIFtdLCBmYWxzZSwgMTAwMDAsIG51bGwpO1xuICAgICAgICAgICAgZWxhc3RpYy5zZWFyY2gocXVlcnksIGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlQnlRdWVyeShkYXRhLCBpbmRleCwgdHlwZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aeG6v24gaMOgbmggZGVsZXRlIGLhurFuZyBlbGFzdGljIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YSBcbiAgICAgKiBAcGFyYW0geyp9IGluZGV4IFxuICAgICAqIEBwYXJhbSB7Kn0gdHlwZSBcbiAgICAgKi9cbiAgICBkZWxldGVCeVF1ZXJ5KGRhdGEsIGluZGV4LCB0eXBlKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoTGlicy5pc0FycmF5RGF0YShkYXRhKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgIGxldCB0aW1lID0gc2VsZi5jb252ZXJ0RXZlbnRUaW1lKGl0ZW0uZXZlbnRfdGltZSk7XG4gICAgICAgICAgICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsodGltZSkgJiYgbm93LmdldFRpbWUoKSAtIExpYnMuY29udmVydERhdGVUb01pbGxpc2Vjb25kcyh0aW1lKSA+IGNvbmZpZy5lbGFzdGljU2VhcmNoLmxvZ0V4cGlyZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGVsZXRlUXVlcnkgPSBzZWxmLmJ1aWxkRGVsZXRlUXVlcnkodHlwZSwgaXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGVsYXN0aWMuZGVsZXRlQnlRdWVyeShpbmRleCwgdHlwZSwgZGVsZXRlUXVlcnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNodXnhu4NuIGV2ZW50X3RpbWUgbOG6pXkgdOG7qyBlbGFzdGljIMSR4buDIHNvIHPDoW5oIHbhu5tpIG5nw6B5IGhp4buHbiB04bqhaVxuICAgICAqIEBwYXJhbSB7Kn0gZXZlbnRUaW1lIFxuICAgICAqL1xuICAgIGNvbnZlcnRFdmVudFRpbWUoZXZlbnRUaW1lKSB7XG4gICAgICAgIGlmIChMaWJzLmlzQmxhbmsoZXZlbnRUaW1lKSkgcmV0dXJuIG51bGw7XG4gICAgICAgIGxldCBkYXkgPSBldmVudFRpbWUuc3Vic3RyaW5nKDYsIDgpO1xuICAgICAgICBsZXQgbW9udGggPSBldmVudFRpbWUuc3Vic3RyaW5nKDQsIDYpO1xuICAgICAgICBsZXQgeWVhciA9IGV2ZW50VGltZS5zdWJzdHJpbmcoMCwgNCk7XG4gICAgICAgIGxldCBob3VyID0gZXZlbnRUaW1lLnN1YnN0cmluZyg4LCAxMCk7XG4gICAgICAgIGxldCBtaW4gPSBldmVudFRpbWUuc3Vic3RyaW5nKDEwLCAxMik7XG4gICAgICAgIGxldCBzZWMgPSBldmVudFRpbWUuc3Vic3RyaW5nKDEyKTtcbiAgICAgICAgbGV0IHRpbWUgPSB5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgZGF5O1xuICAgICAgICB0aW1lICs9IFwiIFwiICsgaG91ciArIFwiOlwiICsgbWluO1xuICAgICAgICByZXR1cm4gdGltZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBidWlsZCBkZWxldGUgcXVlcnkgY2hvIGVsYXN0aWNcbiAgICAgKiBAcGFyYW0geyp9IHR5cGUgXG4gICAgICogQHBhcmFtIHsqfSBpZCBcbiAgICAgKi9cbiAgICBidWlsZERlbGV0ZVF1ZXJ5KHR5cGUsIGlkKSB7XG4gICAgICAgIGxldCBkZWxldGVRdWVyeSA9IHtcbiAgICAgICAgICAgIFwiYm9vbFwiOiB7XG4gICAgICAgICAgICAgICAgXCJtdXN0XCI6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXJtXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIl90eXBlXCI6IHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXJtXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIl9pZFwiOiBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWxldGVRdWVyeTtcbiAgICB9XG59Il19