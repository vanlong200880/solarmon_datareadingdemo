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
import FLEvent from '../utils/FLEvent'
import Jobs from '../batchJob/Jobs'
/**
 * register event
 */
const event = new FLEvent();
/**
 * @param {interger} logType
 * @param {LoggerEntity} param
 */
event.on('log', (logType, param)=>{
    event.log(logType,param);
})
global.event = event;
var ios = [];
function start(router, port) {
    let job = new Jobs();
    job.start();
    var processApp = function(){
        process.on('uncaughtException', function(err) { 
            console.log( " [UNCAUGHT EXCEPTION] ",err.stack || err.message );
            process.exit();
        });
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        process.setMaxListeners(0);
        

        var app = express();
        app.set('views',appPath+"views");
        app.set('view engine', "ejs");
        app.use(compression());
        // set index.html path
        app.use(express.static(appPath));
        app.use(serveStatic(appPath + "views", {'index': ['index.html', 'index.htm']}));

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
            }else {
                // if(req.headers.range==="bytes=0-1"){
                //     // res.status(206).send("206");
                //     // return;
                // }
                router.route(req, res);
            }
        })
        // start server
        var PORT = process.env.PORT || config.server.listenPort;
        var server = app.listen(PORT, function () {
            logger.info('Production Express server running at:' + PORT)
        })
        if (cluster.isWorker) {
            var worker_id = cluster.worker.id;
            ios[worker_id] = sio.listen(server,{
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
        if(config.server.use_ssl){
            var HTTPS_PORT = process.env.HTTPS_PORT || config.server.ssl_option.listenPort;
            var privateKey  = fs.readFileSync(config.server.ssl_option.privateKey, 'utf8');
            var certificate = fs.readFileSync(config.server.ssl_option.certificate, 'utf8');
            var httpsServer = https.createServer({
                key: privateKey,
                cert: certificate
            }, app)
            .listen(HTTPS_PORT, function () {
                logger.info('Production Express server running at:' + HTTPS_PORT)
            })
            // if (cluster.isWorker) {
            //     var worker_id = cluster.worker.id;
            //     ios[worker_id] = require('socket.io').listen(httpsServer);
            //     initSocketListen(ios[worker_id]);
            // }
            // else{
            //     ios = require('socket.io').listen(httpsServer);
            //     initSocketListen(ios);
            // }
        }else{
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
    }
    if(config.server.use_cluster){
        if (cluster.isMaster) {
            for (var i = 0, n = os.cpus().length; i < n; i += 1) {
                cluster.fork();
            }
            cluster.on('online', function (worker) { });
            cluster.on('listening', function (worker, address) { });

            cluster.on('exit', function (worker, code, signal) {
                cluster.fork();
            });
        } else {
            processApp();
        }
    }else{
        processApp();
    }
}
/**
 *  khởi tạo socket lắng nghe 
 * @param {SocketIO} io 
 */
var initSocketListen = function (io){
    var app = io.on('connection', function (socket) {
        socket.auth = false;
        socket.on('authenticate', function(data){
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
        socket.on('disconnect', function (data) {
        });
        
    });
    // var web = io.of('/web').on('hello', function (data) {
    //     console.log('web socket connection....')
    //     var rs = Libs.returnJsonResult(true, data);
    //     socket.emit('join', rs);
    // });
}
var iniSocketSync = function (socket, dir, base_url) {
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
                    } else
                        action = actFun;
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