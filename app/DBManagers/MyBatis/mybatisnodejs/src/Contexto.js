'use strict';

var uuid = require('node-uuid');
var domain = require('domain');

function Contexto() {
    this.callbacks = [];
    this.id = uuid.v4();
}

Contexto.prototype = {

    carregou: function carregou(connection) {
        this.conexao = connection;
        this.carregando = false;
        for (var i = 0; i < this.callbacks.length; i++) {
            this.callbacks[i](this.conexao);
        }
    },

    obtenhaConexao: function obtenhaConexao(callback) {
        var me = this;

        if (this.conexao) {
            return callback(this.conexao);
        }

        this.callbacks.push(callback);

        if (this.carregando == true) return;

        this.carregando = true;
        pool.getConnection(function (err, connection) {
            me.carregou(connection);
        });
    },

    inicieTransacao: function inicieTransacao(callback) {
        var me = this;

        var dominio = require('domain').active;

        function comTransacao(callback) {
            me.conexao.beginTransaction(dominio.intercept(function () {
                return callback(me.conexao, function (success, error) {
                    me.commit(success);
                });
            }));
        }

        if (this.conexao) return comTransacao(callback);

        this.obtenhaConexao(function (conexao) {
            comTransacao(callback);
        });
    },

    release: function release() {
        if (this.conexao) {

            this.conexao.release();
        }
    },

    commit: function commit(callback) {
        if (!this.conexao) return;

        var me = this;

        var dominio = require('domain').active;

        me.conexao.commit(dominio.intercept(function (result, err) {
            if (err) {
                me.conexao.rollback(function () {
                    if (callback) callback(false);
                });
            } else if (callback) callback(true);
        }));
    },

    roolback: function roolback() {
        if (!this.conexao) return;

        this.conexao.rollback(function () {});
    }

};

function domainMiddleware(req, res, next) {
    var reqDomain = domain.create();

    reqDomain.add(req);
    reqDomain.add(res);

    reqDomain.id = uuid.v4();
    reqDomain.contexto = new Contexto();

    res.on('close', function () {
        //reqDomain.dispose();
    });

    res.on('finish', function () {
        if (reqDomain.contexto) {
            console.log('release db connection:' + reqDomain.id);
            reqDomain.contexto.release();
            reqDomain.contexto = null;
            reqDomain.id = null;

            //reqDomain.dispose();
        }
    });

    reqDomain.on('error', function (er) {
        try {

            if (reqDomain.contexto) reqDomain.contexto.release();

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

module.exports = Contexto;
module.exports.domainMiddleware = domainMiddleware;
module.exports.middlewareOnError = middlewareOnError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9EQk1hbmFnZXJzL015QmF0aXMvbXliYXRpc25vZGVqcy9zcmMvQ29udGV4dG8uanMiXSwibmFtZXMiOlsidXVpZCIsInJlcXVpcmUiLCJkb21haW4iLCJDb250ZXh0byIsImNhbGxiYWNrcyIsImlkIiwidjQiLCJwcm90b3R5cGUiLCJjYXJyZWdvdSIsImNvbm5lY3Rpb24iLCJjb25leGFvIiwiY2FycmVnYW5kbyIsImkiLCJsZW5ndGgiLCJvYnRlbmhhQ29uZXhhbyIsImNhbGxiYWNrIiwibWUiLCJwdXNoIiwicG9vbCIsImdldENvbm5lY3Rpb24iLCJlcnIiLCJpbmljaWVUcmFuc2FjYW8iLCJkb21pbmlvIiwiYWN0aXZlIiwiY29tVHJhbnNhY2FvIiwiYmVnaW5UcmFuc2FjdGlvbiIsImludGVyY2VwdCIsInN1Y2Nlc3MiLCJlcnJvciIsImNvbW1pdCIsInJlbGVhc2UiLCJyZXN1bHQiLCJyb2xsYmFjayIsInJvb2xiYWNrIiwiZG9tYWluTWlkZGxld2FyZSIsInJlcSIsInJlcyIsIm5leHQiLCJyZXFEb21haW4iLCJjcmVhdGUiLCJhZGQiLCJjb250ZXh0byIsIm9uIiwiY29uc29sZSIsImxvZyIsImVyIiwieGhyIiwianNvbiIsInN0YXR1cyIsIm1lc3MiLCJ3cml0ZUhlYWQiLCJlbmQiLCJydW4iLCJtaWRkbGV3YXJlT25FcnJvciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxXQUFSLENBQVg7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLFFBQVIsQ0FBYjs7QUFHQSxTQUFTRSxRQUFULEdBQW9CO0FBQ2hCLFNBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxTQUFLQyxFQUFMLEdBQVVMLEtBQUtNLEVBQUwsRUFBVjtBQUNIOztBQUVESCxTQUFTSSxTQUFULEdBQXFCOztBQUVqQkMsY0FBVSxrQkFBU0MsVUFBVCxFQUFvQjtBQUMxQixhQUFLQyxPQUFMLEdBQWVE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O0FBQ0g7O0FBRURILGNBQVVqQyxFQUFWLEdBQWUsSUFBZjs7QUFFQWdDLFNBQUtqQixHQUFMO0FBQ0g7O0FBRURrQyxPQUFPQyxPQUFQLEdBQWlCcEQsUUFBakI7QUFDQW1ELE9BQU9DLE9BQVAsQ0FBZXJCLGdCQUFmLEdBQWtDQSxnQkFBbEM7QUFDQW9CLE9BQU9DLE9BQVAsQ0FBZUYsaUJBQWYsR0FBbUNBLGlCQUFuQyIsImZpbGUiOiJDb250ZXh0by5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB1dWlkID0gcmVxdWlyZSgnbm9kZS11dWlkJyk7XHJcbnZhciBkb21haW4gPSByZXF1aXJlKCdkb21haW4nKTtcclxuXHJcblxyXG5mdW5jdGlvbiBDb250ZXh0bygpIHtcclxuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XHJcbiAgICB0aGlzLmlkID0gdXVpZC52NCgpO1xyXG59XHJcblxyXG5Db250ZXh0by5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgY2FycmVnb3UgOmZ1bmN0aW9uKGNvbm5lY3Rpb24pe1xyXG4gICAgICAgIHRoaXMuY29uZXhhbyA9IGNvbm5lY3Rpb24gO1xyXG4gICAgICAgIHRoaXMuY2FycmVnYW5kbyA9IGZhbHNlO1xyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrc1tpXSh0aGlzLmNvbmV4YW8pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb2J0ZW5oYUNvbmV4YW86IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNvbmV4YW8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuY29uZXhhbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuY2FycmVnYW5kbyA9PXRydWUpIHJldHVybjtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuY2FycmVnYW5kbyA9IHRydWU7XHJcbiAgICAgICAgcG9vbC5nZXRDb25uZWN0aW9uKGZ1bmN0aW9uIChlcnIsIGNvbm5lY3Rpb24pIHtcclxuICAgICAgICAgICAgbWUuY2FycmVnb3UoY29ubmVjdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaWNpZVRyYW5zYWNhbyA6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgZG9taW5pbyA9IHJlcXVpcmUoJ2RvbWFpbicpLmFjdGl2ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY29tVHJhbnNhY2FvKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgbWUuY29uZXhhby5iZWdpblRyYW5zYWN0aW9uKGRvbWluaW8uaW50ZXJjZXB0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG1lLmNvbmV4YW8sIGZ1bmN0aW9uKHN1Y2Nlc3MsZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZS5jb21taXQoc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25leGFvKVxyXG4gICAgICAgICAgICByZXR1cm4gY29tVHJhbnNhY2FvKGNhbGxiYWNrKVxyXG5cclxuICAgICAgICB0aGlzLm9idGVuaGFDb25leGFvKGZ1bmN0aW9uKGNvbmV4YW8pe1xyXG4gICAgICAgICAgICBjb21UcmFuc2FjYW8oY2FsbGJhY2spO1xyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICByZWxlYXNlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYodGhpcy5jb25leGFvKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29uZXhhby5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgY29tbWl0OmZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBpZighdGhpcy5jb25leGFvKSByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBkb21pbmlvID0gcmVxdWlyZSgnZG9tYWluJykuYWN0aXZlO1xyXG5cclxuICAgICAgICBtZS5jb25leGFvLmNvbW1pdChkb21pbmlvLmludGVyY2VwdChmdW5jdGlvbihyZXN1bHQsZXJyKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIG1lLmNvbmV4YW8ucm9sbGJhY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY2FsbGJhY2spIGNhbGxiYWNrKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgIGlmKGNhbGxiYWNrKSBjYWxsYmFjayh0cnVlKTtcclxuXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfSxcclxuXHJcbiAgICByb29sYmFjazpmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKCF0aGlzLmNvbmV4YW8pIHJldHVyblxyXG5cclxuICAgICAgICB0aGlzLmNvbmV4YW8ucm9sbGJhY2soZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gZG9tYWluTWlkZGxld2FyZShyZXEsIHJlcywgbmV4dCkge1xyXG4gICAgdmFyIHJlcURvbWFpbiA9IGRvbWFpbi5jcmVhdGUoKTtcclxuXHJcbiAgICByZXFEb21haW4uYWRkKHJlcSk7XHJcbiAgICByZXFEb21haW4uYWRkKHJlcyk7XHJcblxyXG4gICAgcmVxRG9tYWluLmlkID0gdXVpZC52NCgpO1xyXG4gICAgcmVxRG9tYWluLmNvbnRleHRvID0gbmV3IENvbnRleHRvKCk7XHJcblxyXG4gICAgcmVzLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvL3JlcURvbWFpbi5kaXNwb3NlKCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgcmVzLm9uKCdmaW5pc2gnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYoIHJlcURvbWFpbi5jb250ZXh0byApIHtcclxuICAgICAgICBcdGNvbnNvbGUubG9nKCdyZWxlYXNlIGRiIGNvbm5lY3Rpb246JyArIHJlcURvbWFpbi5pZCk7XHJcbiAgICAgICAgICAgIHJlcURvbWFpbi5jb250ZXh0by5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgIHJlcURvbWFpbi5jb250ZXh0byA9IG51bGw7XHJcbiAgICAgICAgICAgIHJlcURvbWFpbi5pZCA9IG51bGw7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL3JlcURvbWFpbi5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHJlcURvbWFpbi5vbignZXJyb3InLCBmdW5jdGlvbiAoZXIpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYocmVxRG9tYWluLmNvbnRleHRvIClcclxuICAgICAgICAgICAgICAgIHJlcURvbWFpbi5jb250ZXh0by5yZWxlYXNlKCk7XHJcblxyXG4gICAgICAgICAgICBpZihyZXEueGhyKXtcclxuICAgICAgICAgICAgICAgIHJlcy5qc29uKHtzdGF0dXM6ZmFsc2UsbWVzczonQ8OzIGzhu5dpIHRyb25nIHF1w6EgdHLDrG5oIHjhu60gbMO9ISd9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNTAwKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDw7MgbOG7l2kgdHJvbmcgcXXDoSB0csOsbmggeOG7rSBsw70hJylcclxuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGNhdGNoIChlcikge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdFcnJvciBzZW5kaW5nIDUwMCcsIGVyLCByZXEudXJsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgcmVxRG9tYWluLnJ1bihuZXh0KTtcclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBtaWRkbGV3YXJlT25FcnJvcihlcnIsIHJlcSwgcmVzLCBuZXh0KSB7XHJcbiAgICB2YXIgcmVxRG9tYWluID0gZG9tYWluLmFjdGl2ZTtcclxuXHJcbiAgICBpZiggcmVxRG9tYWluLmNvbnRleHRvICkge1xyXG4gICAgICAgIHJlcURvbWFpbi5jb250ZXh0by5yZWxlYXNlKCk7XHJcbiAgICAgICAgcmVxRG9tYWluLmNvbnRleHRvID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICByZXFEb21haW4uaWQgPSBudWxsO1xyXG5cclxuICAgIG5leHQoZXJyKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0bztcclxubW9kdWxlLmV4cG9ydHMuZG9tYWluTWlkZGxld2FyZSA9IGRvbWFpbk1pZGRsZXdhcmU7XHJcbm1vZHVsZS5leHBvcnRzLm1pZGRsZXdhcmVPbkVycm9yID0gbWlkZGxld2FyZU9uRXJyb3I7XHJcblxyXG5cclxuXHJcbiJdfQ==