"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const s = require("string");
const util = require("util");
const xmldom_1 = require("xmldom");
const Context_1 = require("./Context");
const logger=FLLogger.getLogger("SQLMapperLog");
class Main {
    constructor(pool) {
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
   process(dir_xml) {
        //const templateManager = new TemplateMapManager(this.context, this.pool);
        const templateManager = new TemplateMapManager( this.pool);
        const stats = fs.statSync(dir_xml);
         
        if (stats.isFile()) {
            templateManager.mybatisMapper.createMapper([dir_xml]);
            return templateManager;
        }
        else if (stats.isDirectory()) {
            const files = fs.readdirSync(dir_xml);
            const xmlMappingFiles = [];
            for (const prop in files) {
                const archive = files[prop];
                xmlMappingFiles.push(path.resolve(dir_xml, archive));
            }
            templateManager.mybatisMapper.createMapper(xmlMappingFiles);
            return templateManager;
        }
    }
   
}
exports.Main = Main;
exports.domainMiddleware = Context_1.domainMiddleware;
exports.middlewareOnError = Context_1.middlewareOnError;
/**
 * Template mapper, define insert, update, delete, query
 *
 * @class TemplateMapManager
 */
class TemplateMapManager {
    // constructor(context, pool) {
    //     this.mybatisMapper = require('./mybatis-mapper');
    //     this.context = context;
    //     this.pool = pool;
    // }
    constructor(pool) {
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
    insert(fullname, object) {
        var self = this;
        return new Promise((resolve, reject) => {
            const nameArr=fullname.split(".");
            const nameNamespace = nameArr[0];
            const sqlId = nameArr[1];
            if(Libs.isBlank(nameNamespace)){
                let err = "namespace is required!";
                logger.error(err);
                reject(err);
                return;
            }
            if(Libs.isBlank(sqlId)){
                let err = "sqlId is required!";
                logger.error(err);
                reject(err);
                return;
            }
            // Get SQL Statement
            var format = {language: 'sql', indent: '  '};
            var query = self.mybatisMapper.getStatement(nameNamespace, sqlId, object, format);
            logger.info("[sqlId:" + fullname + "]", query);
            logger.info("param:", object);
            self.connection((connection) => {
                connection.query(query, (err, rows, fields) => {
                    if (err) {
                        logger.error(err);
                        reject(err);
                        return;
                    }
                    if(object.hasOwnProperty("id") && rows.insertId){
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
    update(fullname, object) {
        var self = this;
        return new Promise((resolve, reject) => {
            const nameArr=fullname.split(".");
            const nameNamespace = nameArr[0];
            const sqlId = nameArr[1];
            if(Libs.isBlank(nameNamespace)){
                let err = "namespace is required!";
                logger.error(err);
                reject(err);
                return;
            }
            if(Libs.isBlank(sqlId)){
                let err = "sqlId is required!";
                logger.error(err);
                reject(err);
                return;
            }
            // Get SQL Statement
            var format = {language: 'sql', indent: '  '};
            var query = self.mybatisMapper.getStatement(nameNamespace, sqlId, object, format);
            logger.info("[sqlId:" + fullname + "]", query);
            logger.info("param:", object);
            self.connection((connection) => {
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
    remove(fullname, object) {
        var self = this;
        return new Promise((resolve, reject) => {
            const nameArr=fullname.split(".");
            const nameNamespace = nameArr[0];
            const sqlId = nameArr[1];
            if(Libs.isBlank(nameNamespace)){
                let err = "namespace is required!";
                logger.error(err);
                reject(err);
                return;
            }
            if(Libs.isBlank(sqlId)){
                let err = "sqlId is required!";
                logger.error(err);
                reject(err);
                return;
            }
            // Get SQL Statement
            var format = {language: 'sql', indent: '  '};
            var query = self.mybatisMapper.getStatement(nameNamespace, sqlId, object, format);
            logger.info("[sqlId:" + fullname + "]", query);
            logger.info("param:", object);
            self.connection((connection) => {
                connection.query(query, (err, rows, fields) => {
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
    async selectOne(fullname, data) {
        try{
            const objects = await this.selectList(fullname, data);
            if (objects && objects.length == 1) {
                return objects[0];
            }
        }catch(err){
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
    selectList(fullname, data) {
        var self = this;
        return new Promise((resolve, reject) => {
            const nameArr=fullname.split(".");
            const nameNamespace = nameArr[0];
            const sqlId = nameArr[1];
            if(Libs.isBlank(nameNamespace)){
                let err = "namespace is required!";
                logger.error(err);
                reject(err);
                return;
            }
            if(Libs.isBlank(sqlId)){
                let err = "sqlId is required!";
                logger.error(err);
                reject(err);
                return;
            }
            // Get SQL Statement
            var format = {language: 'sql', indent: '  '};
            var query = self.mybatisMapper.getStatement(nameNamespace, sqlId, data, format);
            logger.info("[sqlId:" + fullname + "]", query);
            logger.info("param:", data);
            self.connection(connection => {
                connection.query(query, (err, rows, fields) => {
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
    query(sql, param) {
        var self = this;
        return new Promise((resolve, reject) => {            
            
            logger.info("sql:", sql);
            logger.info("param:", param);
            self.connection(connection => {
                connection.query(query,param, (err, rows, fields) => {
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
     * lấy context được đăng ký trên domain
     *
     * @returns
     * @memberof TemplateMapManager
     */
    context(){
        try{
            var domain  = require('domain').active;
            return domain.context;
        }catch(err){
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
    connection(callback) {
        
        //return this.context.getConnected(callback, this.pool);
        
        try{
            return this.context().getConnected(callback, this.pool);
        }catch(err){
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
    transaction(callback) {
        //return this.context.initiationTransaction(callback, this.pool);
        return this.context().initiationTransaction(callback, this.pool);
    }
}

//# sourceMappingURL=No.js.map