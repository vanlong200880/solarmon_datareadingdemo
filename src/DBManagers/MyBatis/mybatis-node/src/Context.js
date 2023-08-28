"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const domain = require('domain');

class Context {
    constructor() {
        this.callbacks = [];
        this.id = uuid.v4();
    }
    uploaded(connection) {
        this.connection = connection;
        this.loading = false;
        for (const callback of this.callbacks) {
            callback(this.connection);
        }
    }
    getConnected(callback, pool) {
        if (this.connection) {
            return callback(this.connection);
        }
        this.callbacks.push(callback);
        if (this.loading === true) {
            return;
        }
        this.loading = true;
        pool.getConnection((err, connection) => {
            if (err) {
                throw err;
            }
            this.uploaded(connection);
        });
    }
    initiationTransaction(callback, pool) {
        const withchange = (callback) => {
            this.connection.beginTransaction(() => {
                return callback(this.connection, (success, error) => {
                    this.commit(success);
                });
            });
        };
        if (this.connection) {
            return withchange(callback);
        }
        this.getConnected((connection) => {
            withchange(callback);
        }, pool);
    }
    release() {
        if (this.connection) {
            this.connection.release();
        }
    }
    commit(callback) {
        if (!this.connection) {
            return;
        }
        this.connection.commit((result, err) => {
            if (err) {
                this.connection.rollback(() => {
                    if (callback) {
                        callback(false);
                    }
                });
            }
            else if (callback) {
                callback(true);
            }
        });
    }
    rollback() {
        if (!this.connection) {
            return;
        }
        this.connection.rollback();
    }
}


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
        if( reqDomain.context ) {
        	console.log('release db connection:' + reqDomain.id);
            reqDomain.context.release();
            reqDomain.context = null;
            reqDomain.id = null;
            
            //reqDomain.dispose();
        }
    });


    reqDomain.on('error', function (er) {
        try {
            
            if(reqDomain.context )
                reqDomain.context.release();

            if(req.xhr){
                res.json({status:false,mess:'Có lỗi trong quá trình xử lý!'});
            } else {
                res.writeHead(500);
                console.log('Có lỗi trong quá trình xử lý!')
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

    if( reqDomain.contexto ) {
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