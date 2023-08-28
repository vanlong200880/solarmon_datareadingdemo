"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid");
var domain = require('domain');

var Context = function () {
    function Context() {
        _classCallCheck(this, Context);

        this.callbacks = [];
        this.id = uuid.v4();
    }

    _createClass(Context, [{
        key: "uploaded",
        value: function uploaded(connection) {
            this.connection = connection;
            this.loading = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var callback = _step.value;

                    callback(this.connection);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "getConnected",
        value: function getConnected(callback, pool) {
            var _this = this;

            if (this.connection) {
                return callback(this.connection);
            }
            this.callbacks.push(callback);
            if (this.loading === true) {
                return;
            }
            this.loading = true;
            pool.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                _this.uploaded(connection);
            });
        }
    }, {
        key: "initiationTransaction",
        value: function initiationTransaction(callback, pool) {
            var _this2 = this;

            var withchange = function withchange(callback) {
                _this2.connection.beginTransaction(function () {
                    return callback(_this2.connection, function (success, error) {
                        _this2.commit(success);
                    });
                });
            };
            if (this.connection) {
                return withchange(callback);
            }
            this.getConnected(function (connection) {
                withchange(callback);
            }, pool);
        }
    }, {
        key: "release",
        value: function release() {
            if (this.connection) {
                this.connection.release();
            }
        }
    }, {
        key: "commit",
        value: function commit(callback) {
            var _this3 = this;

            if (!this.connection) {
                return;
            }
            this.connection.commit(function (result, err) {
                if (err) {
                    _this3.connection.rollback(function () {
                        if (callback) {
                            callback(false);
                        }
                    });
                } else if (callback) {
                    callback(true);
                }
            });
        }
    }, {
        key: "rollback",
        value: function rollback() {
            if (!this.connection) {
                return;
            }
            this.connection.rollback();
        }
    }]);

    return Context;
}();

function domainMiddleware(req, res, next) {
    var reqDomain = domain.create();

    reqDomain.add(req);
    reqDomain.add(res);

    reqDomain.id = uuid.v4();
    reqDomain.context = new Context();

    res.on('close', function () {
        //reqDomain.dispose();
    });

    res.on('finish', function () {
        if (reqDomain.context) {
            console.log('release db connection:' + reqDomain.id);
            reqDomain.context.release();
            reqDomain.context = null;
            reqDomain.id = null;

            //reqDomain.dispose();
        }
    });

    reqDomain.on('error', function (er) {
        try {

            if (reqDomain.context) reqDomain.context.release();

            if (req.xhr) {
                res.json({ status: false, mess: 'Có lỗi trong quá trình xử lý!' });
            } else {
                res.writeHead(500);
                console.log('Có lỗi trong quá trình xử lý!');
                res.end();
            }
        } catch (er) {
            // console.error('Error sending 500', er, req.url);
        }
    });

    reqDomain.run(next);
};

function middlewareOnError(err, req, res, next) {
    var reqDomain = domain.active;

    if (reqDomain.contexto) {
        reqDomain.contexto.release();
        reqDomain.contexto = null;
    }

    reqDomain.id = null;

    next(err);
}

exports.default = Context;
exports.domainMiddleware = domainMiddleware;
exports.middlewareOnError = middlewareOnError;
//# sourceMappingURL=Context.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9EQk1hbmFnZXJzL015QmF0aXMvbXliYXRpcy1ub2RlL3NyYy9Db250ZXh0LmpzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwidXVpZCIsInJlcXVpcmUiLCJkb21haW4iLCJDb250ZXh0IiwiY2FsbGJhY2tzIiwiaWQiLCJ2NCIsImNvbm5lY3Rpb24iLCJsb2FkaW5nIiwiY2FsbGJhY2siLCJwb29sIiwicHVzaCIsImdldENvbm5lY3Rpb24iLCJlcnIiLCJ1cGxvYWRlZCIsIndpdGhjaGFuZ2UiLCJiZWdpblRyYW5zYWN0aW9uIiwic3VjY2VzcyIsImVycm9yIiwiY29tbWl0IiwiZ2V0Q29ubmVjdGVkIiwicmVsZWFzZSIsInJlc3VsdCIsInJvbGxiYWNrIiwiZG9tYWluTWlkZGxld2FyZSIsInJlcSIsInJlcyIsIm5leHQiLCJyZXFEb21haW4iLCJjcmVhdGUiLCJhZGQiLCJjb250ZXh0Iiwib24iLCJjb25zb2xlIiwibG9nIiwiZXIiLCJ4aHIiLCJqc29uIiwic3RhdHVzIiwibWVzcyIsIndyaXRlSGVhZCIsImVuZCIsInJ1biIsIm1pZGRsZXdhcmVPbkVycm9yIiwiYWN0aXZlIiwiY29udGV4dG8iLCJkZWZhdWx0Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBQ0FBLE9BQU9DLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDLEVBQUVDLE9BQU8sSUFBVCxFQUE3QztBQUNBLElBQU1DLE9BQU9DLFFBQVEsTUFBUixDQUFiO0FBQ0EsSUFBTUMsU0FBU0QsUUFBUSxRQUFSLENBQWY7O0lBRU1FLE87QUFDRix1QkFBYztBQUFBOztBQUNWLGFBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFLQyxFQUFMLEdBQVVMLEtBQUtNLEVBQUwsRUFBVjtBQUNIOzs7O2lDQUNRQyxVLEVBQVk7QUFDakIsaUJBQUtBLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0Es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QkFBUixHQUE0QkEsaUJBQTVCO0FBQ0EiLCJmaWxlIjoiQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdXVpZCA9IHJlcXVpcmUoXCJ1dWlkXCIpO1xuY29uc3QgZG9tYWluID0gcmVxdWlyZSgnZG9tYWluJyk7XG5cbmNsYXNzIENvbnRleHQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLmlkID0gdXVpZC52NCgpO1xuICAgIH1cbiAgICB1cGxvYWRlZChjb25uZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICBjYWxsYmFjayh0aGlzLmNvbm5lY3Rpb24pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldENvbm5lY3RlZChjYWxsYmFjaywgcG9vbCkge1xuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5jb25uZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgaWYgKHRoaXMubG9hZGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgICAgIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb25uZWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGxvYWRlZChjb25uZWN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRpYXRpb25UcmFuc2FjdGlvbihjYWxsYmFjaywgcG9vbCkge1xuICAgICAgICBjb25zdCB3aXRoY2hhbmdlID0gKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uYmVnaW5UcmFuc2FjdGlvbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuY29ubmVjdGlvbiwgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tbWl0KHN1Y2Nlc3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB3aXRoY2hhbmdlKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdldENvbm5lY3RlZCgoY29ubmVjdGlvbikgPT4ge1xuICAgICAgICAgICAgd2l0aGNoYW5nZShjYWxsYmFjayk7XG4gICAgICAgIH0sIHBvb2wpO1xuICAgIH1cbiAgICByZWxlYXNlKCkge1xuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24ucmVsZWFzZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbW1pdChjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRoaXMuY29ubmVjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5jb21taXQoKHJlc3VsdCwgZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLnJvbGxiYWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByb2xsYmFjaygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ucm9sbGJhY2soKTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gZG9tYWluTWlkZGxld2FyZShyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciByZXFEb21haW4gPSBkb21haW4uY3JlYXRlKCk7XG5cbiAgICByZXFEb21haW4uYWRkKHJlcSk7XG4gICAgcmVxRG9tYWluLmFkZChyZXMpO1xuXG4gICAgcmVxRG9tYWluLmlkID0gdXVpZC52NCgpO1xuICAgIHJlcURvbWFpbi5jb250ZXh0ID0gbmV3IENvbnRleHQoKTtcblxuICAgIHJlcy5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vcmVxRG9tYWluLmRpc3Bvc2UoKTtcbiAgICB9KTtcblxuXG4gICAgcmVzLm9uKCdmaW5pc2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmKCByZXFEb21haW4uY29udGV4dCApIHtcbiAgICAgICAgXHRjb25zb2xlLmxvZygncmVsZWFzZSBkYiBjb25uZWN0aW9uOicgKyByZXFEb21haW4uaWQpO1xuICAgICAgICAgICAgcmVxRG9tYWluLmNvbnRleHQucmVsZWFzZSgpO1xuICAgICAgICAgICAgcmVxRG9tYWluLmNvbnRleHQgPSBudWxsO1xuICAgICAgICAgICAgcmVxRG9tYWluLmlkID0gbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9yZXFEb21haW4uZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJlcURvbWFpbi5vbignZXJyb3InLCBmdW5jdGlvbiAoZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYocmVxRG9tYWluLmNvbnRleHQgKVxuICAgICAgICAgICAgICAgIHJlcURvbWFpbi5jb250ZXh0LnJlbGVhc2UoKTtcblxuICAgICAgICAgICAgaWYocmVxLnhocil7XG4gICAgICAgICAgICAgICAgcmVzLmpzb24oe3N0YXR1czpmYWxzZSxtZXNzOidDw7MgbOG7l2kgdHJvbmcgcXXDoSB0csOsbmggeOG7rSBsw70hJ30pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0PDsyBs4buXaSB0cm9uZyBxdcOhIHRyw6xuaCB44butIGzDvSEnKVxuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlcikge1xuICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcignRXJyb3Igc2VuZGluZyA1MDAnLCBlciwgcmVxLnVybCk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgcmVxRG9tYWluLnJ1bihuZXh0KTtcblxufTtcblxuZnVuY3Rpb24gbWlkZGxld2FyZU9uRXJyb3IoZXJyLCByZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciByZXFEb21haW4gPSBkb21haW4uYWN0aXZlO1xuXG4gICAgaWYoIHJlcURvbWFpbi5jb250ZXh0byApIHtcbiAgICAgICAgcmVxRG9tYWluLmNvbnRleHRvLnJlbGVhc2UoKTtcbiAgICAgICAgcmVxRG9tYWluLmNvbnRleHRvID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXFEb21haW4uaWQgPSBudWxsOyAgICBcblxuICAgIG5leHQoZXJyKTtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gQ29udGV4dDtcbmV4cG9ydHMuZG9tYWluTWlkZGxld2FyZSA9IGRvbWFpbk1pZGRsZXdhcmU7XG5leHBvcnRzLm1pZGRsZXdhcmVPbkVycm9yID0gbWlkZGxld2FyZU9uRXJyb3I7ICBcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbnRleHQuanMubWFwIl19