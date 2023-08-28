"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var moment = require("moment");
var path = require("path");
var s = require("string");
var util = require("util");
var xmldom_1 = require("xmldom");
var Context_1 = require("./Context");
var logger = FLLogger.getLogger("SQLMapperLog");

var Main = function () {
    function Main(pool) {
        _classCallCheck(this, Main);

        this.pool = pool;
        // this.context = new Context_1.default();
    }
    /**
     * process xml mapping file
     * Build sqls
     *
     * @param {Array} dir_xml Array xml mapping files
     * @returns
     * @memberof Main
     */


    _createClass(Main, [{
        key: "process",
        value: function process(dir_xml) {
            //const templateManager = new TemplateMapManager(this.context, this.pool);
            var templateManager = new TemplateMapManager(this.pool);
            var stats = fs.statSync(dir_xml);

            if (stats.isFile()) {
                templateManager.mybatisMapper.createMapper([dir_xml]);
                return templateManager;
            } else if (stats.isDirectory()) {
                var files = fs.readdirSync(dir_xml);
                var xmlMappingFiles = [];
                for (var prop in files) {
                    var archive = files[prop];
                    xmlMappingFiles.push(path.resolve(dir_xml, archive));
                }
                templateManager.mybatisMapper.createMapper(xmlMappingFiles);
                return templateManager;
            }
        }
    }]);

    return Main;
}();

exports.Main = Main;
exports.domainMiddleware = Context_1.domainMiddleware;
exports.middlewareOnError = Context_1.middlewareOnError;
/**
 * Template mapper, define insert, update, delete, query
 *
 * @class TemplateMapManager
 */

var TemplateMapManager = function () {
    // constructor(context, pool) {
    //     this.mybatisMapper = require('./mybatis-mapper');
    //     this.context = context;
    //     this.pool = pool;
    // }
    function TemplateMapManager(pool) {
        _classCallCheck(this, TemplateMapManager);

        this.mybatisMapper = require('./mybatis-mapper');
        this.pool = pool;
    }
    /**
     * Make an Insert call to DB Method Name: insert 
     *
     * @param {String} fullname include namespace and sqlid
     * @param {Object} object paramter
     * @returns
     * @memberof TemplateMapManager
     */


    _createClass(TemplateMapManager, [{
        key: "insert",
        value: function insert(fullname, object) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var nameArr = fullname.split(".");
                var nameNamespace = nameArr[0];
                var sqlId = nameArr[1];
                if (Libs.isBlank(nameNamespace)) {
                    var err = "namespace is required!";
                    logger.error(err);
                    reject(err);
                    return;
                }
                if (Libs.isBlank(sqlId)) {
                    var _err = "sqlId is required!";
                    logger.error(_err);
                    reject(_err);
                    return;
                }
                // Get SQL Statement
                var format = { language: 'sql', indent: '  ' };
                var query = self.mybatisMapper.getStatement(nameNamespace, sqlId, object, format);
                logger.info("[sqlId:" + fullname + "]", query);
                logger.info("param:", object);
                self.connection(function (connection) {
                    connection.query(query, function (err, rows, fields) {
                        if (err) {
                            logger.error(err);
                            reject(err);
                            return;
                        }
                        if (object.hasOwnProperty("id") && rows.insertId) {
                            object.id = rows.insertId;
                        }
                        resolve(rows);
                    });
                });
            });
        }
        /**
         *Make an Update call to DB Method Name: update
         *
         * @param {String} fullname include namespace and sqlid
         * @param {Object} object paramter
         * @returns
         * @memberof TemplateMapManager
         */

    }, {
        key: "update",
        value: function update(fullname, object) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var nameArr = fullname.split(".");
                var nameNamespace = nameArr[0];
                var sqlId = nameArr[1];
                if (Libs.isBlank(nameNamespace)) {
                    var err = "namespace is required!";
                    logger.error(err);
                    reject(err);
                    return;
                }
                if (Libs.isBlank(sqlId)) {
                    var _err2 = "sqlId is required!";
                    logger.error(_err2);
                    reject(_err2);
                    return;
                }
                // Get SQL Statement
                var format = { language: 'sql', indent: '  ' };
                var query = self.mybatisMapper.getStatement(nameNamespace, sqlId, object, format);
                logger.info("[sqlId:" + fullname + "]", query);
                logger.info("param:", object);
                self.connection(function (connection) {
                    connection.query(query, function (err, rows, fields) {
                        if (err) {
                            console.log(err);
                            logger.error(err);
                            reject(err);
                            return;
                        }
                        resolve(rows.affectedRows);
                    });
                });
            });
        }
        /**
         * Make an Delete call to DB Method Name: delete
         *
         * @param {String} fullname include namespace and sqlid
         * @param {Object} object paramter
         * @returns
         * @memberof TemplateMapManager
         */

    }, {
        key: "remove",
        value: function remove(fullname, object) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var nameArr = fullname.split(".");
                var nameNamespace = nameArr[0];
                var sqlId = nameArr[1];
                if (Libs.isBlank(nameNamespace)) {
                    var err = "namespace is required!";
                    logger.error(err);
                    reject(err);
                    return;
                }
                if (Libs.isBlank(sqlId)) {
                    var _err3 = "sqlId is required!";
                    logger.error(_err3);
                    reject(_err3);
                    return;
                }
                // Get SQL Statement
                var format = { language: 'sql', indent: '  ' };
                var query = self.mybatisMapper.getStatement(nameNamespace, sqlId, object, format);
                logger.info("[sqlId:" + fullname + "]", query);
                logger.info("param:", object);
                self.connection(function (connection) {
                    connection.query(query, function (err, rows, fields) {
                        if (err) {
                            console.log(err);
                            logger.error(err);
                            reject(err);
                            return;
                        }
                        resolve(rows.affectedRows);
                    });
                });
            });
        }
        /**
         * execute an select query and return a row of result
         *
         * @param {String} fullname include namespace and sqlid
         * @param {Object} data paramter
         * @returns
         * @memberof TemplateMapManager
         */

    }, {
        key: "selectOne",
        value: async function selectOne(fullname, data) {
            try {
                var objects = await this.selectList(fullname, data);
                if (objects && objects.length == 1) {
                    return objects[0];
                }
            } catch (err) {
                console.log(err);
                logger.error(err);
                throw err;
            }
            return null;
        }
        /**
         * execute an select query and return rows of result
         * 
         * @param {String} fullname include namespace and sqlid
         * @param {Object} data paramter
         * @returns
         * @memberof TemplateMapManager
         */

    }, {
        key: "selectList",
        value: function selectList(fullname, data) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var nameArr = fullname.split(".");
                var nameNamespace = nameArr[0];
                var sqlId = nameArr[1];
                if (Libs.isBlank(nameNamespace)) {
                    var err = "namespace is required!";
                    logger.error(err);
                    reject(err);
                    return;
                }
                if (Libs.isBlank(sqlId)) {
                    var _err4 = "sqlId is required!";
                    logger.error(_err4);
                    reject(_err4);
                    return;
                }
                // Get SQL Statement
                var format = { language: 'sql', indent: '  ' };
                var query = self.mybatisMapper.getStatement(nameNamespace, sqlId, data, format);
                logger.info("[sqlId:" + fullname + "]", query);
                logger.info("param:", data);
                self.connection(function (connection) {
                    connection.query(query, function (err, rows, fields) {
                        if (err) {
                            console.log(err);
                            logger.error(err);
                            reject(err);
                            return;
                        }
                        resolve(rows);
                    });
                });
            });
        }
        /**
         * run a sql query
         *
         * @param {String} sql a query select or delete or insert or update
         * @param {Object} param object parameter
         * @returns
         * @memberof TemplateMapManager
         */

    }, {
        key: "query",
        value: function (_query) {
            function query(_x, _x2) {
                return _query.apply(this, arguments);
            }

            query.toString = function () {
                return _query.toString();
            };

            return query;
        }(function (sql, param) {
            var self = this;
            return new Promise(function (resolve, reject) {

                logger.info("sql:", sql);
                logger.info("param:", param);
                self.connection(function (connection) {
                    connection.query(query, param, function (err, rows, fields) {
                        if (err) {
                            console.log(err);
                            logger.error(err);
                            reject(err);
                            return;
                        }
                        resolve(rows);
                    });
                });
            });
        })

        /**
         * lấy context được đăng ký trên domain
         *
         * @returns
         * @memberof TemplateMapManager
         */

    }, {
        key: "context",
        value: function context() {
            try {
                var domain = require('domain').active;
                return domain.context;
            } catch (err) {
                console.log(err);
                logger.error(err);
                throw err;
            }
        }

        /**
         * get a connection to mysql db
         *
         * @param {function} callback
         * @returns
         * @memberof TemplateMapManager
         */

    }, {
        key: "connection",
        value: function connection(callback) {

            //return this.context.getConnected(callback, this.pool);

            try {
                return this.context().getConnected(callback, this.pool);
            } catch (err) {
                console.log(err);
                logger.error(err);
                throw err;
            }
        }
        /**
         * begin open a transation
         * have to use commit or rollback after execute insert, update, delete
         *
         * @param {*} callback
         * @returns
         * @memberof TemplateMapManager
         */

    }, {
        key: "transaction",
        value: function transaction(callback) {
            //return this.context.initiationTransaction(callback, this.pool);
            return this.context().initiationTransaction(callback, this.pool);
        }
    }]);

    return TemplateMapManager;
}();

//# sourceMappingURL=No.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9EQk1hbmFnZXJzL015QmF0aXMvbXliYXRpcy1ub2RlL3NyYy9Oby5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsImZzIiwicmVxdWlyZSIsIm1vbWVudCIsInBhdGgiLCJzIiwidXRpbCIsInhtbGRvbV8xIiwiQ29udGV4dF8xIiwibG9nZ2VyIiwiRkxMb2dnZXIiLCJnZXRMb2dnZXIiLCJNYWluIiwicG9vbCIsImRpcl94bWwiLCJ0ZW1wbGF0ZU1hbmFnZXIiLCJUZW1wbGF0ZU1hcE1hbmFnZXIiLCJzdGF0cyIsInN0YXRTeW5jIiwiaXNGaWxlIiwibXliYXRpc01hcHBlciIsImNyZWF0ZU1hcHBlciIsImlzRGlyZWN0b3J5IiwiZmlsZXMiLCJyZWFkZGlyU3luYyIsInhtbE1hcHBpbmdGaWxlcyIsInByb3AiLCJhcmNoaXZlIiwicHVzaCIsInJlc29sdmUiLCJkb21haW5NaWRkbGV3YXJlIiwibWlkZGxld2FyZU9uRXJyb3IiLCJmdWxsbmFtZSIsIm9iamVjdCIsInNlbGYiLCJQcm9taXNlIiwicmVqZWN0IiwibmFtZUFyciIsInNwbGl0IiwibmFtZU5hbWVzcGFjZSIsInNxbElkIiwiTGlicyIsImlzQmxhbmsiLCJlcnIiLCJlcnJvciIsImZvcm1hdCIsImxhbmd1YWdlIiwiaW5kZW50IiwicXVlcnkiLCJnZXRTdGF0ZW1lbnQiLCJpbmZvIiwiY29ubmVjdGlvbiIsInJvd3MiLCJmaWVsZHMiLCJoYXNPd25Qcm9wZXJ0eSIsImluc2VydElkIiwiaWQiLCJjb25zb2xlIiwibG9nIiwiYWZmZWN0ZWRSb3dzIiwiZGF0YSIsIm9iamVjdHMiLCJzZWxlY3RMaXN0IiwibGVuZ3RoIiwic3FsIiwicGFyYW0iLCJkb21haW4iLCJhY3RpdmUiLCJjb250ZXh0IiwiY2FsbGJhY2siLCJnZXRDb25uZWN0ZWQiLCJpbml0aWF0aW9uVHJhbnNhY3Rpb24iXSwibWFwcGluZ3Mi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QWI7QUFDQVAsbUNBQU9PLEdBQVA7QUFDQTtBQUNIO0FBQ0RkLGdDQUFRdUIsSUFBUjtBQUNILHFCQVJEO0FBU0gsaUJBVkQ7QUFXSCxhQWZNLENBQVA7QUFnQkgsUzs7QUFFRDs7Ozs7Ozs7O2tDQU1TO0FBQ0wsZ0JBQUc7QUFDQyxvQkFBSWMsU0FBVWhFLFFBQVEsUUFBUixFQUFrQmlFLE1BQWhDO0FBQ0EsdUJBQU9ELE9BQU9FLE9BQWQ7QUFDSCxhQUhELENBR0MsT0FBTXpCLEdBQU4sRUFBVTtBQUNQYyx3QkFBUUMsR0FBUixDQUFZZixHQUFaO0FBQ0FsQyx1QkFBT21DLEtBQVAsQ0FBYUQsR0FBYjtBQUNBLHNCQUFNQSxHQUFOO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7OzttQ0FPVzBCLFEsRUFBVTs7QUFFakI7O0FBRUEsZ0JBQUc7QUFDQyx1QkFBTyxLQUFLRCxPQUFMLEdBQWVFLFlBQWYsQ0FBNEJELFFBQTVCLEVBQXNDLEtBQUt4RCxJQUEzQyxDQUFQO0FBQ0gsYUFGRCxDQUVDLE9BQU04QixHQUFOLEVBQVU7QUFDUGMsd0JBQVFDLEdBQVIsQ0FBWWYsR0FBWjtBQUNBbEMsdUJBQU9tQyxLQUFQLENBQWFELEdBQWI7QUFDQSxzQkFBTUEsR0FBTjtBQUNIO0FBQ0o7QUFDRDs7Ozs7Ozs7Ozs7b0NBUVkwQixRLEVBQVU7QUFDbEI7QUFDQSxtQkFBTyxLQUFLRCxPQUFMLEdBQWVHLHFCQUFmLENBQXFDRixRQUFyQyxFQUErQyxLQUFLeEQsSUFBcEQsQ0FBUDtBQUNIOzs7Ozs7QUFHTCIsImZpbGUiOiJOby5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCBtb21lbnQgPSByZXF1aXJlKFwibW9tZW50XCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuY29uc3QgcyA9IHJlcXVpcmUoXCJzdHJpbmdcIik7XG5jb25zdCB1dGlsID0gcmVxdWlyZShcInV0aWxcIik7XG5jb25zdCB4bWxkb21fMSA9IHJlcXVpcmUoXCJ4bWxkb21cIik7XG5jb25zdCBDb250ZXh0XzEgPSByZXF1aXJlKFwiLi9Db250ZXh0XCIpO1xuY29uc3QgbG9nZ2VyPUZMTG9nZ2VyLmdldExvZ2dlcihcIlNRTE1hcHBlckxvZ1wiKTtcbmNsYXNzIE1haW4ge1xuICAgIGNvbnN0cnVjdG9yKHBvb2wpIHtcbiAgICAgICAgdGhpcy5wb29sID0gcG9vbDtcbiAgICAgICAvLyB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dF8xLmRlZmF1bHQoKTtcbiAgICB9XG4gICAvKipcbiAgICAqIHByb2Nlc3MgeG1sIG1hcHBpbmcgZmlsZVxuICAgICogQnVpbGQgc3Fsc1xuICAgICpcbiAgICAqIEBwYXJhbSB7QXJyYXl9IGRpcl94bWwgQXJyYXkgeG1sIG1hcHBpbmcgZmlsZXNcbiAgICAqIEByZXR1cm5zXG4gICAgKiBAbWVtYmVyb2YgTWFpblxuICAgICovXG4gICBwcm9jZXNzKGRpcl94bWwpIHtcbiAgICAgICAgLy9jb25zdCB0ZW1wbGF0ZU1hbmFnZXIgPSBuZXcgVGVtcGxhdGVNYXBNYW5hZ2VyKHRoaXMuY29udGV4dCwgdGhpcy5wb29sKTtcbiAgICAgICAgY29uc3QgdGVtcGxhdGVNYW5hZ2VyID0gbmV3IFRlbXBsYXRlTWFwTWFuYWdlciggdGhpcy5wb29sKTtcbiAgICAgICAgY29uc3Qgc3RhdHMgPSBmcy5zdGF0U3luYyhkaXJfeG1sKTtcbiAgICAgICAgIFxuICAgICAgICBpZiAoc3RhdHMuaXNGaWxlKCkpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlTWFuYWdlci5teWJhdGlzTWFwcGVyLmNyZWF0ZU1hcHBlcihbZGlyX3htbF0pO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlTWFuYWdlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKGRpcl94bWwpO1xuICAgICAgICAgICAgY29uc3QgeG1sTWFwcGluZ0ZpbGVzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gZmlsZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcmNoaXZlID0gZmlsZXNbcHJvcF07XG4gICAgICAgICAgICAgICAgeG1sTWFwcGluZ0ZpbGVzLnB1c2gocGF0aC5yZXNvbHZlKGRpcl94bWwsIGFyY2hpdmUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBsYXRlTWFuYWdlci5teWJhdGlzTWFwcGVyLmNyZWF0ZU1hcHBlcih4bWxNYXBwaW5nRmlsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlTWFuYWdlcjtcbiAgICAgICAgfVxuICAgIH1cbiAgIFxufVxuZXhwb3J0cy5NYWluID0gTWFpbjtcbmV4cG9ydHMuZG9tYWluTWlkZGxld2FyZSA9IENvbnRleHRfMS5kb21haW5NaWRkbGV3YXJlO1xuZXhwb3J0cy5taWRkbGV3YXJlT25FcnJvciA9IENvbnRleHRfMS5taWRkbGV3YXJlT25FcnJvcjtcbi8qKlxuICogVGVtcGxhdGUgbWFwcGVyLCBkZWZpbmUgaW5zZXJ0LCB1cGRhdGUsIGRlbGV0ZSwgcXVlcnlcbiAqXG4gKiBAY2xhc3MgVGVtcGxhdGVNYXBNYW5hZ2VyXG4gKi9cbmNsYXNzIFRlbXBsYXRlTWFwTWFuYWdlciB7XG4gICAgLy8gY29uc3RydWN0b3IoY29udGV4dCwgcG9vbCkge1xuICAgIC8vICAgICB0aGlzLm15YmF0aXNNYXBwZXIgPSByZXF1aXJlKCcuL215YmF0aXMtbWFwcGVyJyk7XG4gICAgLy8gICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgLy8gICAgIHRoaXMucG9vbCA9IHBvb2w7XG4gICAgLy8gfVxuICAgIGNvbnN0cnVjdG9yKHBvb2wpIHtcbiAgICAgICAgdGhpcy5teWJhdGlzTWFwcGVyID0gcmVxdWlyZSgnLi9teWJhdGlzLW1hcHBlcicpO1xuICAgICAgICB0aGlzLnBvb2wgPSBwb29sO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYWtlIGFuIEluc2VydCBjYWxsIHRvIERCIE1ldGhvZCBOYW1lOiBpbnNlcnQgXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZnVsbG5hbWUgaW5jbHVkZSBuYW1lc3BhY2UgYW5kIHNxbGlkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBwYXJhbXRlclxuICAgICAqIEByZXR1cm5zXG4gICAgICogQG1lbWJlcm9mIFRlbXBsYXRlTWFwTWFuYWdlclxuICAgICAqL1xuICAgIGluc2VydChmdWxsbmFtZSwgb2JqZWN0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVBcnI9ZnVsbG5hbWUuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgY29uc3QgbmFtZU5hbWVzcGFjZSA9IG5hbWVBcnJbMF07XG4gICAgICAgICAgICBjb25zdCBzcWxJZCA9IG5hbWVBcnJbMV07XG4gICAgICAgICAgICBpZihMaWJzLmlzQmxhbmsobmFtZU5hbWVzcGFjZSkpe1xuICAgICAgICAgICAgICAgIGxldCBlcnIgPSBcIm5hbWVzcGFjZSBpcyByZXF1aXJlZCFcIjtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihMaWJzLmlzQmxhbmsoc3FsSWQpKXtcbiAgICAgICAgICAgICAgICBsZXQgZXJyID0gXCJzcWxJZCBpcyByZXF1aXJlZCFcIjtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBHZXQgU1FMIFN0YXRlbWVudFxuICAgICAgICAgICAgdmFyIGZvcm1hdCA9IHtsYW5ndWFnZTogJ3NxbCcsIGluZGVudDogJyAgJ307XG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBzZWxmLm15YmF0aXNNYXBwZXIuZ2V0U3RhdGVtZW50KG5hbWVOYW1lc3BhY2UsIHNxbElkLCBvYmplY3QsIGZvcm1hdCk7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhcIltzcWxJZDpcIiArIGZ1bGxuYW1lICsgXCJdXCIsIHF1ZXJ5KTtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwicGFyYW06XCIsIG9iamVjdCk7XG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24oKGNvbm5lY3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLnF1ZXJ5KHF1ZXJ5LCAoZXJyLCByb3dzLCBmaWVsZHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZihvYmplY3QuaGFzT3duUHJvcGVydHkoXCJpZFwiKSAmJiByb3dzLmluc2VydElkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5pZCA9IHJvd3MuaW5zZXJ0SWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyb3dzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpNYWtlIGFuIFVwZGF0ZSBjYWxsIHRvIERCIE1ldGhvZCBOYW1lOiB1cGRhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmdWxsbmFtZSBpbmNsdWRlIG5hbWVzcGFjZSBhbmQgc3FsaWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IHBhcmFtdGVyXG4gICAgICogQHJldHVybnNcbiAgICAgKiBAbWVtYmVyb2YgVGVtcGxhdGVNYXBNYW5hZ2VyXG4gICAgICovXG4gICAgdXBkYXRlKGZ1bGxuYW1lLCBvYmplY3QpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmFtZUFycj1mdWxsbmFtZS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICBjb25zdCBuYW1lTmFtZXNwYWNlID0gbmFtZUFyclswXTtcbiAgICAgICAgICAgIGNvbnN0IHNxbElkID0gbmFtZUFyclsxXTtcbiAgICAgICAgICAgIGlmKExpYnMuaXNCbGFuayhuYW1lTmFtZXNwYWNlKSl7XG4gICAgICAgICAgICAgICAgbGV0IGVyciA9IFwibmFtZXNwYWNlIGlzIHJlcXVpcmVkIVwiO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKExpYnMuaXNCbGFuayhzcWxJZCkpe1xuICAgICAgICAgICAgICAgIGxldCBlcnIgPSBcInNxbElkIGlzIHJlcXVpcmVkIVwiO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEdldCBTUUwgU3RhdGVtZW50XG4gICAgICAgICAgICB2YXIgZm9ybWF0ID0ge2xhbmd1YWdlOiAnc3FsJywgaW5kZW50OiAnICAnfTtcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IHNlbGYubXliYXRpc01hcHBlci5nZXRTdGF0ZW1lbnQobmFtZU5hbWVzcGFjZSwgc3FsSWQsIG9iamVjdCwgZm9ybWF0KTtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiW3NxbElkOlwiICsgZnVsbG5hbWUgKyBcIl1cIiwgcXVlcnkpO1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJwYXJhbTpcIiwgb2JqZWN0KTtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbigoY29ubmVjdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24ucXVlcnkocXVlcnksIGZ1bmN0aW9uIChlcnIsIHJvd3MsIGZpZWxkcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJvd3MuYWZmZWN0ZWRSb3dzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFrZSBhbiBEZWxldGUgY2FsbCB0byBEQiBNZXRob2QgTmFtZTogZGVsZXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZnVsbG5hbWUgaW5jbHVkZSBuYW1lc3BhY2UgYW5kIHNxbGlkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBwYXJhbXRlclxuICAgICAqIEByZXR1cm5zXG4gICAgICogQG1lbWJlcm9mIFRlbXBsYXRlTWFwTWFuYWdlclxuICAgICAqL1xuICAgIHJlbW92ZShmdWxsbmFtZSwgb2JqZWN0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVBcnI9ZnVsbG5hbWUuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgY29uc3QgbmFtZU5hbWVzcGFjZSA9IG5hbWVBcnJbMF07XG4gICAgICAgICAgICBjb25zdCBzcWxJZCA9IG5hbWVBcnJbMV07XG4gICAgICAgICAgICBpZihMaWJzLmlzQmxhbmsobmFtZU5hbWVzcGFjZSkpe1xuICAgICAgICAgICAgICAgIGxldCBlcnIgPSBcIm5hbWVzcGFjZSBpcyByZXF1aXJlZCFcIjtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihMaWJzLmlzQmxhbmsoc3FsSWQpKXtcbiAgICAgICAgICAgICAgICBsZXQgZXJyID0gXCJzcWxJZCBpcyByZXF1aXJlZCFcIjtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBHZXQgU1FMIFN0YXRlbWVudFxuICAgICAgICAgICAgdmFyIGZvcm1hdCA9IHtsYW5ndWFnZTogJ3NxbCcsIGluZGVudDogJyAgJ307XG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBzZWxmLm15YmF0aXNNYXBwZXIuZ2V0U3RhdGVtZW50KG5hbWVOYW1lc3BhY2UsIHNxbElkLCBvYmplY3QsIGZvcm1hdCk7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhcIltzcWxJZDpcIiArIGZ1bGxuYW1lICsgXCJdXCIsIHF1ZXJ5KTtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwicGFyYW06XCIsIG9iamVjdCk7XG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24oKGNvbm5lY3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLnF1ZXJ5KHF1ZXJ5LCAoZXJyLCByb3dzLCBmaWVsZHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyb3dzLmFmZmVjdGVkUm93cyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGV4ZWN1dGUgYW4gc2VsZWN0IHF1ZXJ5IGFuZCByZXR1cm4gYSByb3cgb2YgcmVzdWx0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZnVsbG5hbWUgaW5jbHVkZSBuYW1lc3BhY2UgYW5kIHNxbGlkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgcGFyYW10ZXJcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqIEBtZW1iZXJvZiBUZW1wbGF0ZU1hcE1hbmFnZXJcbiAgICAgKi9cbiAgICBhc3luYyBzZWxlY3RPbmUoZnVsbG5hbWUsIGRhdGEpIHtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0cyA9IGF3YWl0IHRoaXMuc2VsZWN0TGlzdChmdWxsbmFtZSwgZGF0YSk7XG4gICAgICAgICAgICBpZiAob2JqZWN0cyAmJiBvYmplY3RzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdHNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1jYXRjaChlcnIpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBleGVjdXRlIGFuIHNlbGVjdCBxdWVyeSBhbmQgcmV0dXJuIHJvd3Mgb2YgcmVzdWx0XG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZ1bGxuYW1lIGluY2x1ZGUgbmFtZXNwYWNlIGFuZCBzcWxpZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIHBhcmFtdGVyXG4gICAgICogQHJldHVybnNcbiAgICAgKiBAbWVtYmVyb2YgVGVtcGxhdGVNYXBNYW5hZ2VyXG4gICAgICovXG4gICAgc2VsZWN0TGlzdChmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYW1lQXJyPWZ1bGxuYW1lLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVOYW1lc3BhY2UgPSBuYW1lQXJyWzBdO1xuICAgICAgICAgICAgY29uc3Qgc3FsSWQgPSBuYW1lQXJyWzFdO1xuICAgICAgICAgICAgaWYoTGlicy5pc0JsYW5rKG5hbWVOYW1lc3BhY2UpKXtcbiAgICAgICAgICAgICAgICBsZXQgZXJyID0gXCJuYW1lc3BhY2UgaXMgcmVxdWlyZWQhXCI7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoTGlicy5pc0JsYW5rKHNxbElkKSl7XG4gICAgICAgICAgICAgICAgbGV0IGVyciA9IFwic3FsSWQgaXMgcmVxdWlyZWQhXCI7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gR2V0IFNRTCBTdGF0ZW1lbnRcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSB7bGFuZ3VhZ2U6ICdzcWwnLCBpbmRlbnQ6ICcgICd9O1xuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gc2VsZi5teWJhdGlzTWFwcGVyLmdldFN0YXRlbWVudChuYW1lTmFtZXNwYWNlLCBzcWxJZCwgZGF0YSwgZm9ybWF0KTtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiW3NxbElkOlwiICsgZnVsbG5hbWUgKyBcIl1cIiwgcXVlcnkpO1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJwYXJhbTpcIiwgZGF0YSk7XG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24oY29ubmVjdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbi5xdWVyeShxdWVyeSwgKGVyciwgcm93cywgZmllbGRzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocm93cyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJ1biBhIHNxbCBxdWVyeVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNxbCBhIHF1ZXJ5IHNlbGVjdCBvciBkZWxldGUgb3IgaW5zZXJ0IG9yIHVwZGF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBvYmplY3QgcGFyYW1ldGVyXG4gICAgICogQHJldHVybnNcbiAgICAgKiBAbWVtYmVyb2YgVGVtcGxhdGVNYXBNYW5hZ2VyXG4gICAgICovXG4gICAgcXVlcnkoc3FsLCBwYXJhbSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7ICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwic3FsOlwiLCBzcWwpO1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJwYXJhbTpcIiwgcGFyYW0pO1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uKGNvbm5lY3Rpb24gPT4ge1xuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24ucXVlcnkocXVlcnkscGFyYW0sIChlcnIsIHJvd3MsIGZpZWxkcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJvd3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGzhuqV5IGNvbnRleHQgxJHGsOG7o2MgxJHEg25nIGvDvSB0csOqbiBkb21haW5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zXG4gICAgICogQG1lbWJlcm9mIFRlbXBsYXRlTWFwTWFuYWdlclxuICAgICAqL1xuICAgIGNvbnRleHQoKXtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgdmFyIGRvbWFpbiAgPSByZXF1aXJlKCdkb21haW4nKS5hY3RpdmU7XG4gICAgICAgICAgICByZXR1cm4gZG9tYWluLmNvbnRleHQ7XG4gICAgICAgIH1jYXRjaChlcnIpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IGEgY29ubmVjdGlvbiB0byBteXNxbCBkYlxuICAgICAqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqIEBtZW1iZXJvZiBUZW1wbGF0ZU1hcE1hbmFnZXJcbiAgICAgKi9cbiAgICBjb25uZWN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIFxuICAgICAgICAvL3JldHVybiB0aGlzLmNvbnRleHQuZ2V0Q29ubmVjdGVkKGNhbGxiYWNrLCB0aGlzLnBvb2wpO1xuICAgICAgICBcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dCgpLmdldENvbm5lY3RlZChjYWxsYmFjaywgdGhpcy5wb29sKTtcbiAgICAgICAgfWNhdGNoKGVycil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogYmVnaW4gb3BlbiBhIHRyYW5zYXRpb25cbiAgICAgKiBoYXZlIHRvIHVzZSBjb21taXQgb3Igcm9sbGJhY2sgYWZ0ZXIgZXhlY3V0ZSBpbnNlcnQsIHVwZGF0ZSwgZGVsZXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IGNhbGxiYWNrXG4gICAgICogQHJldHVybnNcbiAgICAgKiBAbWVtYmVyb2YgVGVtcGxhdGVNYXBNYW5hZ2VyXG4gICAgICovXG4gICAgdHJhbnNhY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5jb250ZXh0LmluaXRpYXRpb25UcmFuc2FjdGlvbihjYWxsYmFjaywgdGhpcy5wb29sKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dCgpLmluaXRpYXRpb25UcmFuc2FjdGlvbihjYWxsYmFjaywgdGhpcy5wb29sKTtcbiAgICB9XG59XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU5vLmpzLm1hcCJdfQ==