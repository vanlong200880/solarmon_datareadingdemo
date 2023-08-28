var url = require("url");
var querystring = require("querystring");
var fs = require('fs');
const getProtocol = function (req) {
	var proto = req.connection.encrypted ? 'https' : 'http';
	proto = req.headers['x-forwarded-proto'] || proto;
	return proto.split(/\s*,\s*/)[0];
}
import EmployeeService from '../services/EmployeeService';
function route(req, resp) {

	i18n.setLocale(config.i18n.defaultLocale);
	var curUrl = url.parse(req.url);
	var pathname = curUrl.pathname.replace(config.server.context_path+"/","");

	let public_path_idx = config.server.public_path.indexOf(pathname);
	var query = curUrl.query;
	var protocol = getProtocol(req)
	var pathSplit = pathname.split("/");
	let host = Libs.toLowerCase(req.hostname);
	if(req.headers.origin){
		host = req.headers.origin.replace(/(^\w+:|^)\/\//, '');
	}
	host = host.replace(/[:]{1}\d*/,'');
	let hostPartLength = (host.match(/\./g) || []).length;
	let referDomain = host;
	if(hostPartLength>=2){
		referDomain = host.replace(new RegExp('^[a-z0-9]*\.'),'');
	}
	/** check domain cho phep truy cap*/
	if(public_path_idx<0 && ( !config.server.domain || config.server.domain.indexOf(referDomain)<0) && (req.hostname != host)){
		resp.status(401).send(Libs.returnJsonResult(false, i18n.__('AUTH_FALSE'), {}, 0));
		return;
	}

	let splitHost = host.match(new RegExp('^[a-z0-9]*\.'));
	if(!splitHost || splitHost.length <0){
		resp.status(401).send(Libs.returnJsonResult(false, i18n.__('AUTH_FALSE'), {}, 0));
		return;
	}
	let subHost = splitHost[0].replace('.', '') ;
	if (Libs.isBlank(pathSplit[1])) {
		// pathSplit[1] = defaultController;
		log.info("No request function found for " + method);
		resp.writeHead(404, {
			"Content-Type": "text/plain"
		});
		resp.write("404 request handler Not found");
		resp.end();
		return;
	}
	

	var handleRequest = function (req, resp, handle, method) {
		try {
			if (typeof handle[method] === 'function') {
				var postData = "";
				req.addListener("data", function (postDataChunk) {
					postData += postDataChunk;
				});
				req.addListener("end", async function () {
					var data = {};
					var isJson = true;
					try {
						data = JSON.parse(postData);
					} catch (e) {
						isJson = false;
						log.error(e);
					}

					if (!isJson) {
						if (!Libs.isBlank(query)) {
							postData = query + "&" + postData;
						}
						data = querystring.parse(postData);
					}
					let token = req.headers['x-access-token'];
					let userE = Libs.decodeTokenCrypto(token);
					if (null != userE) {
						try {
							
							let employee = new EmployeeService();
							userE.permissions = await employee.getCachePermission(userE);


							let expiresTime = userE['expiresTime'];
							let now = new Date().getTime();
							if (now > expiresTime) {
								resp.writeHead(401, {
									"Content-Type": "text/plain"
								});
								resp.end();
							}
							handle.userE = userE;
							data.currentUser = userE.email;
						} catch (e) {
							console.log(e)
						}
					}
					handle.headers = req.headers;
					handle.baseUrl = protocol+"://" + req.headers.host;
					if(config.server.context_path){
						handle.baseUrl+=`/${config.server.context_path}`;
					}

					data.action = method;
					data.lang = i18n.getLocale();
					data.lang_default = i18n.getLocale();
					if (typeof req.headers.lang != 'undefined' && req.headers.lang != '') {
						data.lang = req.headers.lang;
						i18n.setLocale(req.headers.lang);
					}
					
					if(!Libs.isInArray(pathname, Constants.public_api) && public_path_idx < 0){
					// if(pathname !== Constants.public_api.login && public_path_idx < 0){
						let pathReferer = route.checkPathReferer(req);

						handle.pathReferer = pathReferer;
						

						if(!pathReferer){
							// console.log("thêm 'req_path' vào header");
							resp.status(511).send(Libs.returnJsonResult(false, i18n.__('AUTH_REQUIRE'), {}, 0));
							return;
						}
						if(typeof handle['checkPermission'] === 'function'){
							let auth = handle['checkPermission'](Constants.auth_mode.VIEW);
							if(!auth){
								resp.status(401).send(Libs.returnJsonResult(false, i18n.__('AUTH_FALSE'), {}, 0));
								return;
							}
						}
						if(typeof handle['checkPermissions'] === 'function'){
							let auth = handle['checkPermissions'](method, data);
							if(!auth){
								resp.send(Libs.returnJsonResult(false, i18n.__('AUTH_FALSE'), {}, 0));
								return;
							}
						} 
					}
					if(userE){
						let logE = Object.assign({},data);
						logE.key = userE.email;
						logE.event_time = Libs.getCurrentDateFormat('yyyyMMddHHmmss');
						event.emit('log', Constants.type_log.request, {table_name: null,content:logE});
					}
					handle[method](resp, data);
				});

			} else {
				log.info("No request function found for " + method);
				resp.writeHead(404, {
					"Content-Type": "text/plain"
				});
				resp.write("404 request handler Not found");
				resp.end();
			}
		} catch (e) {
			console.log(e)
		}
	};
	var controller = Libs.capitalize(pathSplit[1]) + "Controller";
	var handle = null;
	if (Libs.checkFileExits(controlPath, controller + '.js')) {

		var cls = require(controlPath + controller);
		handle = new cls['default']();
		if (Libs.isBlank(pathSplit[2])) {
			// pathSplit[2] = defaultFunction;
			log.info("No request function found for " + method);
			resp.writeHead(404, {
				"Content-Type": "text/plain"
			});
			resp.write("404 request handler Not found");
			resp.end();
			return;
		}
		var method = pathSplit[2];
		handleRequest(req, resp, handle, method);
	} else {
		var rQCtrName = controller.toLowerCase() + '.js';
		var files = fs.readdirSync(controlPath);
		var controllerNew = null;
		files.forEach(file => {
			var lowerFileName = file.toLowerCase();
			if (lowerFileName === rQCtrName) {
				controllerNew = file;
				return true;
			}
		});
		if (controllerNew != null) {
			var cls = require(controlPath + controllerNew);
			handle = new cls['default']();
			if (Libs.isBlank(pathSplit[2])) {
				// pathSplit[2] = defaultFunction;
				log.info("No request function found for " + method);
				resp.writeHead(404, {
					"Content-Type": "text/plain"
				});
				resp.write("404 request handler Not found");
				resp.end();
				return;
			}
			var method = pathSplit[2];
			// var method = action;
			handleRequest(req, resp, handle, method);
		} else {
			log.info("No request file found for " + pathname);
			resp.writeHead(404, {
				"Content-Type": "text/plain"
			});
			resp.write("404 request handler Not found");
			resp.end();
		}
	}
}

route.checkPathReferer = (req) =>{
	try{
		let req_path = req.headers['req-path'];
		let referer = false;
		let pathReferer = false;
		if(req_path){
			referer = req_path
		}else{
			referer = req.headers.referer
		}
		if(referer){
			pathReferer = url.parse(referer, false).pathname;
		}
		return pathReferer;
	}catch(ex){
		console.log("checkPathReferer error:", ex);
		return null;
	}
	
}
exports.route = route;