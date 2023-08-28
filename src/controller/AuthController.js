import BaseController from '../core/BaseController';
import EmployeeService from '../services/EmployeeService';
import AuthValidate from '../validator/AuthValidate';
import EmployeeEntity from '../entities/EmployeeEntity';
class AuthController extends BaseController {
	constructor() {
		super();
	}
	/**
	 * action login
	 * @author Long.Pham
	 * @param {Object} res 
	 * @param {Object} postData 
	 */
	login(res, postData) {
		try {
			this.logger.info('start');
			var rs = {};
			if (Libs.isObjectEmpty(postData)) {
				rs = Libs.returnJsonResult(false, i18n.__('MSG_LOGIN'), "");
				res.send(rs);
				return;
			}
			var v = new AuthValidate();
			v.validationAll(postData, function (err, key) {
				if (err) {
					try {
						rs = Libs.returnJsonResult(false, i18n.__('ERR_LOGIN'), err.message);
						res.send(rs);
						return;
					} catch (e) {
						console.log(e);
					}
				}
				try {
					let service = new EmployeeService();
					// settingS = new SettingService();
					let entity = Object.assign({}, new EmployeeEntity(), postData);
					service.checkLogin(entity, async function (err, userE) {
						try {
							if (userE == null || typeof (userE) == "undefined") {
								rs = Libs.returnJsonResult(false, i18n.__('USER_INCORRECT'), "");
								res.send(rs);
								return;
							}
							userE.lang = entity.lang;

							if (!Libs.isBlank(userE.id_roles)) {
								var id_roles = userE.id_roles;
								userE.id_roles = id_roles.split(",");
							}
							
							// let salt = Libs.SHA3(Libs.generateStrRandom(24));
							// let pass = Libs.AESEncrypt(postData.password, ps);
							// let pass = Libs.encodePassWord(postData.password, salt);
							// let depass = Libs.decodePassWord(pass, salt);
							// Taka decode from database
							// let takaDecodePassword = Libs.takaDecode(userE.password);
							let decryptFromDatabase = Libs.decodePassWord(userE.password, userE.salt);
							// decode from postData 
							// let takaDecodePostPassword  = Libs.takaDecode(postData.password);

							if (postData.password != decryptFromDatabase) {
								rs = Libs.returnJsonResult(false, i18n.__('PASSWORD_INCORRECT'), "");
								res.send(rs);
								return;
							}
							// Lấy quyền truy cập của  employee
							try {
								let permissions = [];
								permissions = await service.getEmployeePermissions(userE);
								
								// await elastic.getAsync(_index, _type, code_id);
								permissions = service.buildPermission(permissions);
								if(!service.setCachePermission(userE, permissions)){
									res.send(Libs.returnJsonResult(false, i18n.__('ERR_LOGIN'), {}));
									return;
								}
								
								// var cache = service.setCachePermission(userE, permissions);
								// var redis = new redis();
								// redis.setSingle("staff", 'server redis');
								// var setCache = NodeCache.setCache(Libs.md5('staff_'+userE.id), permissions);
								// if(!setCache){
								// 	res.send(Libs.returnJsonResult(false, i18n.__('ERR_LOGIN'), {}));
								// 	return;
								// }
								delete userE.password;
								delete userE.salt;
								var curTime = new Date();
								var tokenParam = config.server.token_param;
								let timeout = tokenParam.timeout;
								if (typeof timeout == 'undefined' || timeout <= 0) {
									timeout = 1440;
								}
								timeout = (timeout * 60 * 1000);
								userE.gennerateTime = curTime.getTime();
								userE.expiresTime = (curTime.getTime() + timeout);
								let token = Libs.generateTokenCrypto(userE);


								let languages = [];
								languages = await service.getListLanguage(userE);


								let data = {
									token: token,
									timeout: userE.expiresTime,
									id_employee: userE.id_employee, 
									email: userE.email,
									first_name: userE.first_name,
									last_name: userE.last_name,
									full_name: userE.full_name,
									avatar: userE.avatar,
									permissions: permissions,
									id_roles: userE.id_roles,
									languages: languages
								};
								// log
								
								// 	userE.event_time = Libs.getCurrentDateFormat('yyyyMMddHHmmss');
								// 	event.emit('log', Constants.type_log.login, {table_name: null,content:userE});
								rs = Libs.returnJsonResult(true, i18n.__('MSG_LOGIN'), data);
								res.send(rs);


							} catch (e) {
								rs = Libs.returnJsonResult(true, i18n.__('ERR_LOGIN'), e);
								res.send(rs);
							}
						} catch (e) {
							console.log(e);
							res.send(Libs.returnJsonResult(false, i18n.__('ERR_LOGIN'), e));
						}
					});
				} catch (e) {
					res.send(Libs.returnJsonResult(false, i18n.__('ERR_LOGIN'), e));
				}
			});
		} catch (e) {
			console.log(e);
			res.send(Libs.returnJsonResult(false, i18n.__('ERR_LOGIN'), e));
		}
	}
	logout(res, postData) {
		rs = Libs.returnJsonResult(true, i18n.__('MSG_LOGOUT'), "", 0);
		res.send(rs);
	}

}
export default AuthController;