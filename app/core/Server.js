'use strict';

var _FLEvent = require('../utils/FLEvent');

var _FLEvent2 = _interopRequireDefault(_FLEvent);

var _Jobs = require('../batchJob/Jobs');

var _Jobs2 = _interopRequireDefault(_Jobs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * http://usejsdoc.org/
 */
var http = require("http");
var https = require('https');
var sio = require('socket.io');
var cluster = require('cluster');
var os = require('os');
var compression = require('compression');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var dbmanagers = require(appPath + 'DBManagers/DatabaseLoader.js');
var logger = FLLogger.getLogger("server");

/**
 * register event
 */
var event = new _FLEvent2.default();
/**
 * @param {interger} logType
 * @param {LoggerEntity} param
 */
event.on('log', function (logType, param) {
    event.log(logType, param);
});
global.event = event;
var ios = [];
function start(router, port) {
    var job = new _Jobs2.default();
    job.start();
    var processApp = function processApp() {
        process.on('uncaughtException', function (err) {
            console.log(" [UNCAUGHT EXCEPTION] ", err.stack || err.message);
            process.exit();
        });
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        process.setMaxListeners(0);

        var app = express();
        app.set('views', appPath + "views");
        app.set('view engine', "ejs");
        app.use(compression());
        // set index.html path
        app.use(express.static(appPath));
        app.use(serveStatic(appPath + "views", { 'index': ['index.html', 'index.htm'] }));

        // app.use(express.static("/uploads",__dirname+ "/uploads"));
        // app.use(serveStatic(path.join(__dirname, 'public')));
        app.use('/uploads', express.static('uploads'));

        // load db managers 
        dbmanagers.use(app);
        app.all('*', function (req, res) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', "PUT,POST,GET,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, Content-Type, x-access-token, X-Requested-With, lang, Content-range, req-path");
            // res.header("X-Powered-By", ' 3.2.1')
            // res.header("Content-Type", "application/json;charset=utf-8");
            if (req.method === "OPTIONS") {
                // console.log("req.method: ",req.method, "; headers: ",req.headers);
                res.status(200).send("200");
            } else {
                // if(req.headers.range==="bytes=0-1"){
                //     // res.status(206).send("206");
                //     // return;
                // }
                router.route(req, res);
            }
        });
        // start server
        var PORT = process.env.PORT || config.server.listenPort;
        var server = app.listen(PORT, function () {
            logger.info('Production Express server running at:' + PORT);
        });
        if (cluster.isWorker) {
            var worker_id = cluster.worker.id;
            ios[worker_id] = sio.listen(server, {
                serveClient: true,
                pingInterval: 40000,
                pingTimeout: 60000,
                upgradeTimeout: 21000, // default value is 10000ms, try changing it to 20k or more
                agent: false,
                cookie: false,
                rejectUnauthorized: false,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000
            });
            initSocketListen(ios[worker_id]);
        }
        if (config.server.use_ssl) {
            var HTTPS_PORT = process.env.HTTPS_PORT || config.server.ssl_option.listenPort;
            var privateKey = fs.readFileSync(config.server.ssl_option.privateKey, 'utf8');
            var certificate = fs.readFileSync(config.server.ssl_option.certificate, 'utf8');
            var httpsServer = https.createServer({
                key: privateKey,
                cert: certificate
            }, app).listen(HTTPS_PORT, function () {
                logger.info('Production Express server running at:' + HTTPS_PORT);
            });
            // if (cluster.isWorker) {
            //     var worker_id = cluster.worker.id;
            //     ios[worker_id] = require('socket.io').listen(httpsServer);
            //     initSocketListen(ios[worker_id]);
            // }
            // else{
            //     ios = require('socket.io').listen(httpsServer);
            //     initSocketListen(ios);
            // }
        } else {
                // if (cluster.isWorker) {
                //     var worker_id = cluster.worker.id;
                //     ios[worker_id] = require('socket.io').listen(server);
                //     initSocketListen(ios[worker_id]);
                // }
                // else{
                //     ios = require('socket.io').listen(server);
                //     initSocketListen(ios);
                // }
            }
    };
    if (config.server.use_cluster) {
        if (cluster.isMaster) {
            for (var i = 0, n = os.cpus().length; i < n; i += 1) {
                cluster.fork();
            }
            cluster.on('online', function (worker) {});
            cluster.on('listening', function (worker, address) {});

            cluster.on('exit', function (worker, code, signal) {
                cluster.fork();
            });
        } else {
            processApp();
        }
    } else {
        processApp();
    }
}
/**
 *  khởi tạo socket lắng nghe 
 * @param {SocketIO} io 
 */
var initSocketListen = function initSocketListen(io) {
    var app = io.on('connection', function (socket) {
        socket.auth = false;
        socket.on('authenticate', function (data) {
            var rs = Libs.returnJsonResult(true, "joined", "");
            socket.emit('join', rs);
            // socket.disconnect('unauthorized');
            //check the auth data sent by the client
            // checkAuthToken(data.token, function(err, success){
            // if (!err && success){
            //     console.log("Authenticated socket ", socket.id);
            //     socket.auth = true;
            // }
        });
        var sockets = io.sockets.clients();
        //gửi cấu hình javascipt cho client
        var clientIp = socket.request.connection.remoteAddress;
        // iniSocketSync(socket, controlPath + "AppSioCtrl/", '/');
        // var rs = Libs.returnJsonResult(true, "", "");
        // socket.emit('join', rs);
        // socket.emit('notify', rs);
        //socket disconnect
        socket.on('disconnect', function (data) {});
    });
    // var web = io.of('/web').on('hello', function (data) {
    //     console.log('web socket connection....')
    //     var rs = Libs.returnJsonResult(true, data);
    //     socket.emit('join', rs);
    // });
};
var iniSocketSync = function iniSocketSync(socket, dir, base_url) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir, 'utf8');
    files.forEach(function (file) {
        // bo .js
        var file_no_ext = file.replace(".js", "");
        var controller = file_no_ext.replace("Socket", "");
        // doi thanh chu thuong
        controller = controller.toLowerCase();
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            base_url = base_url + controller + "/";
            iniSocketSync(socket, dir + '/' + file, base_url);
        } else {
            var ctr = require(dir + "/" + file_no_ext);
            for (var actFun in ctr) {
                try {
                    var action = "";
                    var folders = base_url.split("/");
                    if (folders[folders.length - 2] != controller) {
                        action = controller + "/" + actFun;
                    } else action = actFun;
                    var registerAction = action.replace(/\//g, ".");
                    logger.info("Start:" + registerAction);
                    var pathArr = action.split("/");
                    if (Libs.isBlank(pathArr[pathArr.length - 1])) {
                        callAction = pathArr[pathArr.length - 2];
                    } else callAction = pathArr[pathArr.length - 1];

                    socket.on(registerAction, ctr[callAction]);
                } catch (e) {
                    console.log("socket Error start:" + action + ": " + e);
                    logger.error("socket Error start:" + action + ": " + e);
                }
            }
        }
    });
};
exports.start = start;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL1NlcnZlci5qcyJdLCJuYW1lcyI6WyJodHRwIiwicmVxdWlyZSIsImh0dHBzIiwic2lvIiwiY2x1c3RlciIsIm9zIiwiY29tcHJlc3Npb24iLCJleHByZXNzIiwic2VydmVTdGF0aWMiLCJwYXRoIiwiZGJtYW5hZ2VycyIsImFwcFBhdGgiLCJsb2dnZXIiLCJGTExvZ2dlciIsImdldExvZ2dlciIsImV2ZW50IiwiRkxFdmVudCIsIm9uIiwibG9nVHlwZSIsInBhcmFtIiwibG9nIiwiZ2xvYmFsIiwiaW9zIiwic3RhcnQiLCJyb3V0ZXIiLCJwb3J0Iiwiam9iIiwiSm9icyIsInByb2Nlc3NBcHAiLCJwcm9jZXNzIiwiZXJyIiwiY29uc29sZSIsInN0YWNrIiwibWVzc2FnZSIsImV4aXQiLCJlbnYiLCJzZXRNYXhMaXN0ZW5lcnMiLCJhcHAiLCJzZXQiLCJ1c2UiLCJzdGF0aWMiLCJhbGwiLCJyZXEiLCJyZXMiLCJoZWFkZXIiLCJtZXRob2QiLCJzdGF0dXMiLCJzZW5kIiwicm91dGUiLCJQT1JUIiwiY29uZmlnIiwic2VydmVyIiwibGlzdGVuUG9ydCIsImxpc3RlbiIsImluZm8iLCJpc1dvcmtlciIsIndvcmtlcl9pZCIsIndvcmtlciIsImlkIiwic2VydmVDbGllbnQiLCJwaW5nSW50ZXJ2YWwiLCJwaW5nVGltZW91dCIsInVwZ3JhZGVUaW1lb3V0IiwiYWdlbnQiLCJjb29raWUiLCJyZWplY3RVbmF1dGhvcml6ZWQiLCJyZWNvbm5lY3Rpb25EZWxheSIsInJlY29ubmVjdGlvbkRlbGF5TWF4IiwiaW5pdFNvY2tldExpc3RlbiIsInVzZV9zc2wiLCJIVFRQU19QT1JUIiwic3NsX29wdGlvbiIsInByaXZhdGVLZXkiLCJmcyIsInJlYWRGaWxlU3luYyIsImNlcnRpZmljYXRlIiwiaHR0cHNTZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJrZXkiLCJjZXJ0IiwidXNlX2NsdXN0ZXIiLCJpc01hc3RlciIsImkiLCJuIiwiY3B1cyIsImxlbmd0aCIsImZvcmsiLCJhZGRyZXNzIiwiY29kZSIsInNpZ25hbCIsImlvIiwic29ja2V0IiwiYXV0aCIsImRhdGEiLCJycyIsIkxpYnMiLCJyZXR1cm5Kc29uUmVzdWx0IiwiZW1pdCIsInNvY2tldHMiLCJjbGllbnRzIiwiY2xpZW50SXAiLCJyZXF1ZXN0IiwiY29ubmVjdGlvbiIsInJlbW90ZUFkZHJlc3MiLCJpbmlTb2NrZXRTeW5jIiwiZGlyIiwiYmFzZV91cmwiLCJmaWxlcyIsInJlYWRkaXJTeW5jIiwiZm9yRWFjaCIsImZpbGUiLCJmaWxlX25vX2V4dCIsInJlcGxhY2UiLCJjb250cm9sbGVyIiwidG9Mb3dlckNhc2UiLCJzdGF0U3luYyIsImlzRGlyZWN0b3J5IiwiY3RyIiwiYWN0RnVuIiwiYWN0aW9uIiwiZm9sZGVycyIsInNwbGl0IiwicmVnaXN0ZXJBY3Rpb24iLCJwYXRoQXJyIiwiaXNCbGFuayIsImNhbGxBY3Rpb24iLCJlIiwiZXJyb3IiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQWNBOzs7O0FBQ0E7Ozs7OztBQWZBOzs7QUFHQSxJQUFJQSxPQUFPQyxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlDLFFBQVFELFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSUUsTUFBTUYsUUFBUSxXQUFSLENBQVY7QUFDQSxJQUFJRyxVQUFVSCxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlJLEtBQUtKLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUssY0FBY0wsUUFBUSxhQUFSLENBQWxCO0FBQ0EsSUFBSU0sVUFBVU4sUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFJTyxjQUFjUCxRQUFRLGNBQVIsQ0FBbEI7QUFDQSxJQUFJUSxPQUFPUixRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlTLGFBQWFULFFBQVFVLFVBQVUsOEJBQWxCLENBQWpCO0FBQ0EsSUFBSUMsU0FBU0MsU0FBU0MsU0FBVCxDQUFtQixRQUFuQixDQUFiOztBQUdBOzs7QUFHQSxJQUFNQyxRQUFRLElBQUlDLGlCQUFKLEVBQWQ7QUFDQTs7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QXJCO0FBQ0FwRywyQkFBTzBDLElBQVAsQ0FBWSxXQUFXb0UsY0FBdkI7QUFDQSx3QkFBSUMsVUFBVUosT0FBT0UsS0FBUCxDQUFhLEdBQWIsQ0FBZDtBQUNBLHdCQUFJMUIsS0FBSzZCLE9BQUwsQ0FBYUQsUUFBUUEsUUFBUXRDLE1BQVIsR0FBaUIsQ0FBekIsQ0FBYixDQUFKLEVBQStDO0FBQzNDd0MscUNBQWFGLFFBQVFBLFFBQVF0QyxNQUFSLEdBQWlCLENBQXpCLENBQWI7QUFDSCxxQkFGRCxNQUVPd0MsYUFBYUYsUUFBUUEsUUFBUXRDLE1BQVIsR0FBaUIsQ0FBekIsQ0FBYjs7QUFFUE0sMkJBQU8xRSxFQUFQLENBQVV5RyxjQUFWLEVBQTBCTCxJQUFJUSxVQUFKLENBQTFCO0FBQ0gsaUJBZkQsQ0FlRSxPQUFPQyxDQUFQLEVBQVU7QUFDUi9GLDRCQUFRWCxHQUFSLENBQVksd0JBQXdCbUcsTUFBeEIsR0FBaUMsSUFBakMsR0FBd0NPLENBQXBEO0FBQ0FsSCwyQkFBT21ILEtBQVAsQ0FBYSx3QkFBd0JSLE1BQXhCLEdBQWlDLElBQWpDLEdBQXdDTyxDQUFyRDtBQUNIO0FBQ0o7QUFDSjtBQUNKLEtBakNEO0FBa0NILENBckNEO0FBc0NBRSxRQUFRekcsS0FBUixHQUFnQkEsS0FBaEIiLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBodHRwOi8vdXNlanNkb2Mub3JnL1xuICovXG52YXIgaHR0cCA9IHJlcXVpcmUoXCJodHRwXCIpO1xudmFyIGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbnZhciBzaW8gPSByZXF1aXJlKCdzb2NrZXQuaW8nKTtcbnZhciBjbHVzdGVyID0gcmVxdWlyZSgnY2x1c3RlcicpO1xudmFyIG9zID0gcmVxdWlyZSgnb3MnKTtcbnZhciBjb21wcmVzc2lvbiA9IHJlcXVpcmUoJ2NvbXByZXNzaW9uJyk7XG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbnZhciBzZXJ2ZVN0YXRpYyA9IHJlcXVpcmUoJ3NlcnZlLXN0YXRpYycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgZGJtYW5hZ2VycyA9IHJlcXVpcmUoYXBwUGF0aCArICdEQk1hbmFnZXJzL0RhdGFiYXNlTG9hZGVyLmpzJyk7XG52YXIgbG9nZ2VyID0gRkxMb2dnZXIuZ2V0TG9nZ2VyKFwic2VydmVyXCIpO1xuaW1wb3J0IEZMRXZlbnQgZnJvbSAnLi4vdXRpbHMvRkxFdmVudCdcbmltcG9ydCBKb2JzIGZyb20gJy4uL2JhdGNoSm9iL0pvYnMnXG4vKipcbiAqIHJlZ2lzdGVyIGV2ZW50XG4gKi9cbmNvbnN0IGV2ZW50ID0gbmV3IEZMRXZlbnQoKTtcbi8qKlxuICogQHBhcmFtIHtpbnRlcmdlcn0gbG9nVHlwZVxuICogQHBhcmFtIHtMb2dnZXJFbnRpdHl9IHBhcmFtXG4gKi9cbmV2ZW50Lm9uKCdsb2cnLCAobG9nVHlwZSwgcGFyYW0pPT57XG4gICAgZXZlbnQubG9nKGxvZ1R5cGUscGFyYW0pO1xufSlcbmdsb2JhbC5ldmVudCA9IGV2ZW50O1xudmFyIGlvcyA9IFtdO1xuZnVuY3Rpb24gc3RhcnQocm91dGVyLCBwb3J0KSB7XG4gICAgbGV0IGpvYiA9IG5ldyBKb2JzKCk7XG4gICAgam9iLnN0YXJ0KCk7XG4gICAgdmFyIHByb2Nlc3NBcHAgPSBmdW5jdGlvbigpe1xuICAgICAgICBwcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIGZ1bmN0aW9uKGVycikgeyBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIiBbVU5DQVVHSFQgRVhDRVBUSU9OXSBcIixlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UgKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvY2Vzcy5lbnZbJ05PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQnXSA9ICcwJztcbiAgICAgICAgcHJvY2Vzcy5zZXRNYXhMaXN0ZW5lcnMoMCk7XG4gICAgICAgIFxuXG4gICAgICAgIHZhciBhcHAgPSBleHByZXNzKCk7XG4gICAgICAgIGFwcC5zZXQoJ3ZpZXdzJyxhcHBQYXRoK1widmlld3NcIik7XG4gICAgICAgIGFwcC5zZXQoJ3ZpZXcgZW5naW5lJywgXCJlanNcIik7XG4gICAgICAgIGFwcC51c2UoY29tcHJlc3Npb24oKSk7XG4gICAgICAgIC8vIHNldCBpbmRleC5odG1sIHBhdGhcbiAgICAgICAgYXBwLnVzZShleHByZXNzLnN0YXRpYyhhcHBQYXRoKSk7XG4gICAgICAgIGFwcC51c2Uoc2VydmVTdGF0aWMoYXBwUGF0aCArIFwidmlld3NcIiwgeydpbmRleCc6IFsnaW5kZXguaHRtbCcsICdpbmRleC5odG0nXX0pKTtcblxuICAgICAgICAvLyBhcHAudXNlKGV4cHJlc3Muc3RhdGljKFwiL3VwbG9hZHNcIixfX2Rpcm5hbWUrIFwiL3VwbG9hZHNcIikpO1xuICAgICAgICAvLyBhcHAudXNlKHNlcnZlU3RhdGljKHBhdGguam9pbihfX2Rpcm5hbWUsICdwdWJsaWMnKSkpO1xuICAgICAgICBhcHAudXNlKCcvdXBsb2FkcycsIGV4cHJlc3Muc3RhdGljKCd1cGxvYWRzJykpO1xuXG4gICAgICAgIC8vIGxvYWQgZGIgbWFuYWdlcnMgXG4gICAgICAgIGRibWFuYWdlcnMudXNlKGFwcCk7XG4gICAgICAgIGFwcC5hbGwoJyonLCBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICAgICAgICAgIHJlcy5oZWFkZXIoXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiwgXCIqXCIpO1xuICAgICAgICAgICAgcmVzLmhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsIFwiUFVULFBPU1QsR0VULERFTEVURSxPUFRJT05TXCIpO1xuICAgICAgICAgICAgcmVzLmhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIiwgXCJPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIEFjY2VwdCwgQ29udGVudC1UeXBlLCB4LWFjY2Vzcy10b2tlbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgbGFuZywgQ29udGVudC1yYW5nZSwgcmVxLXBhdGhcIik7XG4gICAgICAgICAgICAvLyByZXMuaGVhZGVyKFwiWC1Qb3dlcmVkLUJ5XCIsICcgMy4yLjEnKVxuICAgICAgICAgICAgLy8gcmVzLmhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOFwiKTtcbiAgICAgICAgICAgIGlmIChyZXEubWV0aG9kID09PSBcIk9QVElPTlNcIikge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVxLm1ldGhvZDogXCIscmVxLm1ldGhvZCwgXCI7IGhlYWRlcnM6IFwiLHJlcS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChcIjIwMFwiKTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBpZihyZXEuaGVhZGVycy5yYW5nZT09PVwiYnl0ZXM9MC0xXCIpe1xuICAgICAgICAgICAgICAgIC8vICAgICAvLyByZXMuc3RhdHVzKDIwNikuc2VuZChcIjIwNlwiKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICByb3V0ZXIucm91dGUocmVxLCByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAvLyBzdGFydCBzZXJ2ZXJcbiAgICAgICAgdmFyIFBPUlQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IGNvbmZpZy5zZXJ2ZXIubGlzdGVuUG9ydDtcbiAgICAgICAgdmFyIHNlcnZlciA9IGFwcC5saXN0ZW4oUE9SVCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2R1Y3Rpb24gRXhwcmVzcyBzZXJ2ZXIgcnVubmluZyBhdDonICsgUE9SVClcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKGNsdXN0ZXIuaXNXb3JrZXIpIHtcbiAgICAgICAgICAgIHZhciB3b3JrZXJfaWQgPSBjbHVzdGVyLndvcmtlci5pZDtcbiAgICAgICAgICAgIGlvc1t3b3JrZXJfaWRdID0gc2lvLmxpc3RlbihzZXJ2ZXIse1xuICAgICAgICAgICAgICAgIHNlcnZlQ2xpZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgIHBpbmdJbnRlcnZhbDogNDAwMDAsXG4gICAgICAgICAgICAgICAgcGluZ1RpbWVvdXQ6IDYwMDAwLFxuICAgICAgICAgICAgICAgIHVwZ3JhZGVUaW1lb3V0OiAyMTAwMCwgLy8gZGVmYXVsdCB2YWx1ZSBpcyAxMDAwMG1zLCB0cnkgY2hhbmdpbmcgaXQgdG8gMjBrIG9yIG1vcmVcbiAgICAgICAgICAgICAgICBhZ2VudDogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29va2llOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZWplY3RVbmF1dGhvcml6ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5OiAxMDAwLFxuICAgICAgICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5TWF4OiA1MDAwXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaW5pdFNvY2tldExpc3Rlbihpb3Nbd29ya2VyX2lkXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY29uZmlnLnNlcnZlci51c2Vfc3NsKXtcbiAgICAgICAgICAgIHZhciBIVFRQU19QT1JUID0gcHJvY2Vzcy5lbnYuSFRUUFNfUE9SVCB8fCBjb25maWcuc2VydmVyLnNzbF9vcHRpb24ubGlzdGVuUG9ydDtcbiAgICAgICAgICAgIHZhciBwcml2YXRlS2V5ICA9IGZzLnJlYWRGaWxlU3luYyhjb25maWcuc2VydmVyLnNzbF9vcHRpb24ucHJpdmF0ZUtleSwgJ3V0ZjgnKTtcbiAgICAgICAgICAgIHZhciBjZXJ0aWZpY2F0ZSA9IGZzLnJlYWRGaWxlU3luYyhjb25maWcuc2VydmVyLnNzbF9vcHRpb24uY2VydGlmaWNhdGUsICd1dGY4Jyk7XG4gICAgICAgICAgICB2YXIgaHR0cHNTZXJ2ZXIgPSBodHRwcy5jcmVhdGVTZXJ2ZXIoe1xuICAgICAgICAgICAgICAgIGtleTogcHJpdmF0ZUtleSxcbiAgICAgICAgICAgICAgICBjZXJ0OiBjZXJ0aWZpY2F0ZVxuICAgICAgICAgICAgfSwgYXBwKVxuICAgICAgICAgICAgLmxpc3RlbihIVFRQU19QT1JULCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2R1Y3Rpb24gRXhwcmVzcyBzZXJ2ZXIgcnVubmluZyBhdDonICsgSFRUUFNfUE9SVClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyBpZiAoY2x1c3Rlci5pc1dvcmtlcikge1xuICAgICAgICAgICAgLy8gICAgIHZhciB3b3JrZXJfaWQgPSBjbHVzdGVyLndvcmtlci5pZDtcbiAgICAgICAgICAgIC8vICAgICBpb3Nbd29ya2VyX2lkXSA9IHJlcXVpcmUoJ3NvY2tldC5pbycpLmxpc3RlbihodHRwc1NlcnZlcik7XG4gICAgICAgICAgICAvLyAgICAgaW5pdFNvY2tldExpc3Rlbihpb3Nbd29ya2VyX2lkXSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBlbHNle1xuICAgICAgICAgICAgLy8gICAgIGlvcyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpLmxpc3RlbihodHRwc1NlcnZlcik7XG4gICAgICAgICAgICAvLyAgICAgaW5pdFNvY2tldExpc3Rlbihpb3MpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIC8vIGlmIChjbHVzdGVyLmlzV29ya2VyKSB7XG4gICAgICAgICAgICAvLyAgICAgdmFyIHdvcmtlcl9pZCA9IGNsdXN0ZXIud29ya2VyLmlkO1xuICAgICAgICAgICAgLy8gICAgIGlvc1t3b3JrZXJfaWRdID0gcmVxdWlyZSgnc29ja2V0LmlvJykubGlzdGVuKHNlcnZlcik7XG4gICAgICAgICAgICAvLyAgICAgaW5pdFNvY2tldExpc3Rlbihpb3Nbd29ya2VyX2lkXSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBlbHNle1xuICAgICAgICAgICAgLy8gICAgIGlvcyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpLmxpc3RlbihzZXJ2ZXIpO1xuICAgICAgICAgICAgLy8gICAgIGluaXRTb2NrZXRMaXN0ZW4oaW9zKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZihjb25maWcuc2VydmVyLnVzZV9jbHVzdGVyKXtcbiAgICAgICAgaWYgKGNsdXN0ZXIuaXNNYXN0ZXIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gb3MuY3B1cygpLmxlbmd0aDsgaSA8IG47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGNsdXN0ZXIuZm9yaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2x1c3Rlci5vbignb25saW5lJywgZnVuY3Rpb24gKHdvcmtlcikgeyB9KTtcbiAgICAgICAgICAgIGNsdXN0ZXIub24oJ2xpc3RlbmluZycsIGZ1bmN0aW9uICh3b3JrZXIsIGFkZHJlc3MpIHsgfSk7XG5cbiAgICAgICAgICAgIGNsdXN0ZXIub24oJ2V4aXQnLCBmdW5jdGlvbiAod29ya2VyLCBjb2RlLCBzaWduYWwpIHtcbiAgICAgICAgICAgICAgICBjbHVzdGVyLmZvcmsoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvY2Vzc0FwcCgpO1xuICAgICAgICB9XG4gICAgfWVsc2V7XG4gICAgICAgIHByb2Nlc3NBcHAoKTtcbiAgICB9XG59XG4vKipcbiAqICBraOG7n2kgdOG6oW8gc29ja2V0IGzhuq9uZyBuZ2hlIFxuICogQHBhcmFtIHtTb2NrZXRJT30gaW8gXG4gKi9cbnZhciBpbml0U29ja2V0TGlzdGVuID0gZnVuY3Rpb24gKGlvKXtcbiAgICB2YXIgYXBwID0gaW8ub24oJ2Nvbm5lY3Rpb24nLCBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICAgIHNvY2tldC5hdXRoID0gZmFsc2U7XG4gICAgICAgIHNvY2tldC5vbignYXV0aGVudGljYXRlJywgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICB2YXIgcnMgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgXCJqb2luZWRcIiwgXCJcIik7XG4gICAgICAgICAgICBzb2NrZXQuZW1pdCgnam9pbicsIHJzKTtcbiAgICAgICAgICAgIC8vIHNvY2tldC5kaXNjb25uZWN0KCd1bmF1dGhvcml6ZWQnKTtcbiAgICAgICAgLy9jaGVjayB0aGUgYXV0aCBkYXRhIHNlbnQgYnkgdGhlIGNsaWVudFxuICAgICAgICAgICAgLy8gY2hlY2tBdXRoVG9rZW4oZGF0YS50b2tlbiwgZnVuY3Rpb24oZXJyLCBzdWNjZXNzKXtcbiAgICAgICAgICAgIC8vIGlmICghZXJyICYmIHN1Y2Nlc3Mpe1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRlZCBzb2NrZXQgXCIsIHNvY2tldC5pZCk7XG4gICAgICAgICAgICAvLyAgICAgc29ja2V0LmF1dGggPSB0cnVlO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHNvY2tldHMgPSBpby5zb2NrZXRzLmNsaWVudHMoKTtcbiAgICAgICAgLy9n4butaSBj4bqldSBow6xuaCBqYXZhc2NpcHQgY2hvIGNsaWVudFxuICAgICAgICB2YXIgY2xpZW50SXAgPSBzb2NrZXQucmVxdWVzdC5jb25uZWN0aW9uLnJlbW90ZUFkZHJlc3M7XG4gICAgICAgIC8vIGluaVNvY2tldFN5bmMoc29ja2V0LCBjb250cm9sUGF0aCArIFwiQXBwU2lvQ3RybC9cIiwgJy8nKTtcbiAgICAgICAgLy8gdmFyIHJzID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIFwiXCIsIFwiXCIpO1xuICAgICAgICAvLyBzb2NrZXQuZW1pdCgnam9pbicsIHJzKTtcbiAgICAgICAgLy8gc29ja2V0LmVtaXQoJ25vdGlmeScsIHJzKTtcbiAgICAgICAgLy9zb2NrZXQgZGlzY29ubmVjdFxuICAgICAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfSk7XG4gICAgLy8gdmFyIHdlYiA9IGlvLm9mKCcvd2ViJykub24oJ2hlbGxvJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coJ3dlYiBzb2NrZXQgY29ubmVjdGlvbi4uLi4nKVxuICAgIC8vICAgICB2YXIgcnMgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgZGF0YSk7XG4gICAgLy8gICAgIHNvY2tldC5lbWl0KCdqb2luJywgcnMpO1xuICAgIC8vIH0pO1xufVxudmFyIGluaVNvY2tldFN5bmMgPSBmdW5jdGlvbiAoc29ja2V0LCBkaXIsIGJhc2VfdXJsKSB7XG4gICAgdmFyIGZzID0gZnMgfHwgcmVxdWlyZSgnZnMnKSxcbiAgICAgICAgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhkaXIsICd1dGY4Jyk7XG4gICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICAvLyBibyAuanNcbiAgICAgICAgdmFyIGZpbGVfbm9fZXh0ID0gZmlsZS5yZXBsYWNlKFwiLmpzXCIsIFwiXCIpO1xuICAgICAgICB2YXIgY29udHJvbGxlciA9IGZpbGVfbm9fZXh0LnJlcGxhY2UoXCJTb2NrZXRcIiwgXCJcIik7XG4gICAgICAgIC8vIGRvaSB0aGFuaCBjaHUgdGh1b25nXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChmcy5zdGF0U3luYyhkaXIgKyAnLycgKyBmaWxlKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBiYXNlX3VybCA9IGJhc2VfdXJsICsgY29udHJvbGxlciArIFwiL1wiO1xuICAgICAgICAgICAgaW5pU29ja2V0U3luYyhzb2NrZXQsIGRpciArICcvJyArIGZpbGUsIGJhc2VfdXJsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjdHIgPSByZXF1aXJlKGRpciArIFwiL1wiICsgZmlsZV9ub19leHQpO1xuICAgICAgICAgICAgZm9yICh2YXIgYWN0RnVuIGluIGN0cikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm9sZGVycyA9IGJhc2VfdXJsLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvbGRlcnNbZm9sZGVycy5sZW5ndGggLSAyXSAhPSBjb250cm9sbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSBjb250cm9sbGVyICsgXCIvXCIgKyBhY3RGdW47XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gYWN0RnVuO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVnaXN0ZXJBY3Rpb24gPSBhY3Rpb24ucmVwbGFjZSgvXFwvL2csIFwiLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJTdGFydDpcIiArIHJlZ2lzdGVyQWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGhBcnIgPSBhY3Rpb24uc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKHBhdGhBcnJbcGF0aEFyci5sZW5ndGggLSAxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxBY3Rpb24gPSBwYXRoQXJyW3BhdGhBcnIubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBjYWxsQWN0aW9uID0gcGF0aEFycltwYXRoQXJyLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgICAgICAgICAgIHNvY2tldC5vbihyZWdpc3RlckFjdGlvbiwgY3RyW2NhbGxBY3Rpb25dKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic29ja2V0IEVycm9yIHN0YXJ0OlwiICsgYWN0aW9uICsgXCI6IFwiICsgZSk7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcInNvY2tldCBFcnJvciBzdGFydDpcIiArIGFjdGlvbiArIFwiOiBcIiArIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcbmV4cG9ydHMuc3RhcnQgPSBzdGFydDsiXX0=