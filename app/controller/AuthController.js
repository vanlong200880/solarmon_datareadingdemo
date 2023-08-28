'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _EmployeeService = require('../services/EmployeeService');

var _EmployeeService2 = _interopRequireDefault(_EmployeeService);

var _AuthValidate = require('../validator/AuthValidate');

var _AuthValidate2 = _interopRequireDefault(_AuthValidate);

var _EmployeeEntity = require('../entities/EmployeeEntity');

var _EmployeeEntity2 = _interopRequireDefault(_EmployeeEntity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AuthController = function (_BaseController) {
	_inherits(AuthController, _BaseController);

	function AuthController() {
		_classCallCheck(this, AuthController);

		return _possibleConstructorReturn(this, (AuthController.__proto__ || Object.getPrototypeOf(AuthController)).call(this));
	}
	/**
  * action login
  * @author Long.Pham
  * @param {Object} res 
  * @param {Object} postData 
  */


	_createClass(AuthController, [{
		key: 'login',
		value: function login(res, postData) {
			try {
				this.logger.info('start');
				var rs = {};
				if (Libs.isObjectEmpty(postData)) {
					rs = Libs.returnJsonResult(false, i18n.__('MSG_LOGIN'), "");
					res.send(rs);
					return;
				}
				var v = new _AuthValidate2.default();
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
						var service = new _EmployeeService2.default();
						// settingS = new SettingService();
						var entity = Object.assign({}, new _EmployeeEntity2.default(), postData);
						service.checkLogin(entity, async function (err, userE) {
							try {
								if (userE == null || typeof userE == "undefined") {
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
								var decryptFromDatabase = Libs.decodePassWord(userE.password, userE.salt);
								// decode from postData 
								// let takaDecodePostPassword  = Libs.takaDecode(postData.password);

								if (postData.password != decryptFromDatabase) {
									rs = Libs.returnJsonResult(false, i18n.__('PASSWORD_INCORRECT'), "");
									res.send(rs);
									return;
								}
								// Lấy quyền truy cập của  employee
								try {
									var permissions = [];
									permissions = await service.getEmployeePermissions(userE);

									// await elastic.getAsync(_index, _type, code_id);
									permissions = service.buildPermission(permissions);
									if (!service.setCachePermission(userE, permissions)) {
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
									var timeout = tokenParam.timeout;
									if (typeof timeout == 'undefined' || timeout <= 0) {
										timeout = 1440;
									}
									timeout = timeout * 60 * 1000;
									userE.gennerateTime = curTime.getTime();
									userE.expiresTime = curTime.getTime() + timeout;
									var token = Libs.generateTokenCrypto(userE);

									var languages = [];
									languages = await service.getListLanguage(userE);

									var data = {
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
	}, {
		key: 'logout',
		value: function logout(res, postData) {
			rs = Libs.returnJsonResult(true, i18n.__('MSG_LOGOUT'), "", 0);
			res.send(rs);
		}
	}]);

	return AuthController;
}(_BaseController3.default);

exports.default = AuthController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0F1dGhDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkF1dGhDb250cm9sbGVyIiwicmVzIiwicG9zdERhdGEiLCJsb2dnZXIiLCJpbmZvIiwicnMiLCJMaWJzIiwiaXNPYmplY3RFbXB0eSIsInJldHVybkpzb25SZXN1bHQiLCJpMThuIiwiX18iLCJzZW5kIiwidiIsIkF1dGhWYWxpZGF0ZSIsInZhbGlkYXRpb25BbGwiLCJlcnIiLCJrZXkiLCJtZXNzYWdlIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJzZXJ2aWNlIiwiRW1wbG95ZWVTZXJ2aWNlIiwiZW50aXR5IiwiT2JqZWN0IiwiYXNzaWduIiwiRW1wbG95ZWVFbnRpdHkiLCJjaGVja0xvZ2luIiwidXNlckUiLCJsYW5nIiwiaXNCbGFuayIsImlkX3JvbGVzIiwic3BsaXQiLCJkZWNyeXB0RnJvbURhdGFiYXNlIiwiZGVjb2RlUGFzc1dvcmQiLCJwYXNzd29yZCIsInNhbHQiLCJwZXJtaXNzaW9ucyIsImdldEVtcGxveWVlUGVybWlzc2lvbnMiLCJidWlsZFBlcm1pc3Npb24iLCJzZXRDYWNoZVBlcm1pc3Npb24iLCJjdXJUaW1lIiwiRGF0ZSIsInRva2VuUGFyYW0iLCJjb25maWciLCJzZXJ2ZXIiLCJ0b2tlbl9wYXJhbSIsInRpbWVvdXQiLCJnZW5uZXJhdGVUaW1lIiwiZ2V0VGltZSIsImV4cGlyZXNUaW1lIiwidG9rZW4iLCJnZW5lcmF0ZVRva2VuQ3J5cHRvIiwibGFuZ3VhZ2VzIiwiZ2V0TGlzdExhbmd1YWdlIiwiZGF0YSIsImlkX2VtcGxveWVlIiwiZW1haWwiLCJmaXJzdF9uYW1lIiwibGFzdF9uYW1lIiwiZnVsbF9uYW1lIiwiYXZhdGFyIiwiQmFzZUNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNNQSxjOzs7QUFDTCwyQkFBYztBQUFBOztBQUFBO0FBRWI7QUFDRDs7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dGVudCI6WyJpbXBvcnQgQmFzZUNvbnRyb2xsZXIgZnJvbSAnLi4vY29yZS9CYXNlQ29udHJvbGxlcic7XG5pbXBvcnQgRW1wbG95ZWVTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL0VtcGxveWVlU2VydmljZSc7XG5pbXBvcnQgQXV0aFZhbGlkYXRlIGZyb20gJy4uL3ZhbGlkYXRvci9BdXRoVmFsaWRhdGUnO1xuaW1wb3J0IEVtcGxveWVlRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL0VtcGxveWVlRW50aXR5JztcbmNsYXNzIEF1dGhDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXIge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cdC8qKlxuXHQgKiBhY3Rpb24gbG9naW5cblx0ICogQGF1dGhvciBMb25nLlBoYW1cblx0ICogQHBhcmFtIHtPYmplY3R9IHJlcyBcblx0ICogQHBhcmFtIHtPYmplY3R9IHBvc3REYXRhIFxuXHQgKi9cblx0bG9naW4ocmVzLCBwb3N0RGF0YSkge1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmxvZ2dlci5pbmZvKCdzdGFydCcpO1xuXHRcdFx0dmFyIHJzID0ge307XG5cdFx0XHRpZiAoTGlicy5pc09iamVjdEVtcHR5KHBvc3REYXRhKSkge1xuXHRcdFx0XHRycyA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnTVNHX0xPR0lOJyksIFwiXCIpO1xuXHRcdFx0XHRyZXMuc2VuZChycyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciB2ID0gbmV3IEF1dGhWYWxpZGF0ZSgpO1xuXHRcdFx0di52YWxpZGF0aW9uQWxsKHBvc3REYXRhLCBmdW5jdGlvbiAoZXJyLCBrZXkpIHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRycyA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX0xPR0lOJyksIGVyci5tZXNzYWdlKTtcblx0XHRcdFx0XHRcdHJlcy5zZW5kKHJzKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRsZXQgc2VydmljZSA9IG5ldyBFbXBsb3llZVNlcnZpY2UoKTtcblx0XHRcdFx0XHQvLyBzZXR0aW5nUyA9IG5ldyBTZXR0aW5nU2VydmljZSgpO1xuXHRcdFx0XHRcdGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgRW1wbG95ZWVFbnRpdHkoKSwgcG9zdERhdGEpO1xuXHRcdFx0XHRcdHNlcnZpY2UuY2hlY2tMb2dpbihlbnRpdHksIGFzeW5jIGZ1bmN0aW9uIChlcnIsIHVzZXJFKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRpZiAodXNlckUgPT0gbnVsbCB8fCB0eXBlb2YgKHVzZXJFKSA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0cnMgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ1VTRVJfSU5DT1JSRUNUJyksIFwiXCIpO1xuXHRcdFx0XHRcdFx0XHRcdHJlcy5zZW5kKHJzKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dXNlckUubGFuZyA9IGVudGl0eS5sYW5nO1xuXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKHVzZXJFLmlkX3JvbGVzKSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpZF9yb2xlcyA9IHVzZXJFLmlkX3JvbGVzO1xuXHRcdFx0XHRcdFx0XHRcdHVzZXJFLmlkX3JvbGVzID0gaWRfcm9sZXMuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQvLyBsZXQgc2FsdCA9IExpYnMuU0hBMyhMaWJzLmdlbmVyYXRlU3RyUmFuZG9tKDI0KSk7XG5cdFx0XHRcdFx0XHRcdC8vIGxldCBwYXNzID0gTGlicy5BRVNFbmNyeXB0KHBvc3REYXRhLnBhc3N3b3JkLCBwcyk7XG5cdFx0XHRcdFx0XHRcdC8vIGxldCBwYXNzID0gTGlicy5lbmNvZGVQYXNzV29yZChwb3N0RGF0YS5wYXNzd29yZCwgc2FsdCk7XG5cdFx0XHRcdFx0XHRcdC8vIGxldCBkZXBhc3MgPSBMaWJzLmRlY29kZVBhc3NXb3JkKHBhc3MsIHNhbHQpO1xuXHRcdFx0XHRcdFx0XHQvLyBUYWthIGRlY29kZSBmcm9tIGRhdGFiYXNlXG5cdFx0XHRcdFx0XHRcdC8vIGxldCB0YWthRGVjb2RlUGFzc3dvcmQgPSBMaWJzLnRha2FEZWNvZGUodXNlckUucGFzc3dvcmQpO1xuXHRcdFx0XHRcdFx0XHRsZXQgZGVjcnlwdEZyb21EYXRhYmFzZSA9IExpYnMuZGVjb2RlUGFzc1dvcmQodXNlckUucGFzc3dvcmQsIHVzZXJFLnNhbHQpO1xuXHRcdFx0XHRcdFx0XHQvLyBkZWNvZGUgZnJvbSBwb3N0RGF0YSBcblx0XHRcdFx0XHRcdFx0Ly8gbGV0IHRha2FEZWNvZGVQb3N0UGFzc3dvcmQgID0gTGlicy50YWthRGVjb2RlKHBvc3REYXRhLnBhc3N3b3JkKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAocG9zdERhdGEucGFzc3dvcmQgIT0gZGVjcnlwdEZyb21EYXRhYmFzZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJzID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdQQVNTV09SRF9JTkNPUlJFQ1QnKSwgXCJcIik7XG5cdFx0XHRcdFx0XHRcdFx0cmVzLnNlbmQocnMpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQvLyBM4bqleSBxdXnhu4FuIHRydXkgY+G6rXAgY+G7p2EgIGVtcGxveWVlXG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHBlcm1pc3Npb25zID0gW107XG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBhd2FpdCBzZXJ2aWNlLmdldEVtcGxveWVlUGVybWlzc2lvbnModXNlckUpO1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdC8vIGF3YWl0IGVsYXN0aWMuZ2V0QXN5bmMoX2luZGV4LCBfdHlwZSwgY29kZV9pZCk7XG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBzZXJ2aWNlLmJ1aWxkUGVybWlzc2lvbihwZXJtaXNzaW9ucyk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoIXNlcnZpY2Uuc2V0Q2FjaGVQZXJtaXNzaW9uKHVzZXJFLCBwZXJtaXNzaW9ucykpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzLnNlbmQoTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfTE9HSU4nKSwge30pKTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0Ly8gdmFyIGNhY2hlID0gc2VydmljZS5zZXRDYWNoZVBlcm1pc3Npb24odXNlckUsIHBlcm1pc3Npb25zKTtcblx0XHRcdFx0XHRcdFx0XHQvLyB2YXIgcmVkaXMgPSBuZXcgcmVkaXMoKTtcblx0XHRcdFx0XHRcdFx0XHQvLyByZWRpcy5zZXRTaW5nbGUoXCJzdGFmZlwiLCAnc2VydmVyIHJlZGlzJyk7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gdmFyIHNldENhY2hlID0gTm9kZUNhY2hlLnNldENhY2hlKExpYnMubWQ1KCdzdGFmZl8nK3VzZXJFLmlkKSwgcGVybWlzc2lvbnMpO1xuXHRcdFx0XHRcdFx0XHRcdC8vIGlmKCFzZXRDYWNoZSl7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRyZXMuc2VuZChMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9MT0dJTicpLCB7fSkpO1xuXHRcdFx0XHRcdFx0XHRcdC8vIFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdC8vIH1cblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgdXNlckUucGFzc3dvcmQ7XG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIHVzZXJFLnNhbHQ7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGN1clRpbWUgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdHZhciB0b2tlblBhcmFtID0gY29uZmlnLnNlcnZlci50b2tlbl9wYXJhbTtcblx0XHRcdFx0XHRcdFx0XHRsZXQgdGltZW91dCA9IHRva2VuUGFyYW0udGltZW91dDtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHRpbWVvdXQgPT0gJ3VuZGVmaW5lZCcgfHwgdGltZW91dCA8PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aW1lb3V0ID0gMTQ0MDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0dGltZW91dCA9ICh0aW1lb3V0ICogNjAgKiAxMDAwKTtcblx0XHRcdFx0XHRcdFx0XHR1c2VyRS5nZW5uZXJhdGVUaW1lID0gY3VyVGltZS5nZXRUaW1lKCk7XG5cdFx0XHRcdFx0XHRcdFx0dXNlckUuZXhwaXJlc1RpbWUgPSAoY3VyVGltZS5nZXRUaW1lKCkgKyB0aW1lb3V0KTtcblx0XHRcdFx0XHRcdFx0XHRsZXQgdG9rZW4gPSBMaWJzLmdlbmVyYXRlVG9rZW5DcnlwdG8odXNlckUpO1xuXG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgbGFuZ3VhZ2VzID0gW107XG5cdFx0XHRcdFx0XHRcdFx0bGFuZ3VhZ2VzID0gYXdhaXQgc2VydmljZS5nZXRMaXN0TGFuZ3VhZ2UodXNlckUpO1xuXG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdHRva2VuOiB0b2tlbixcblx0XHRcdFx0XHRcdFx0XHRcdHRpbWVvdXQ6IHVzZXJFLmV4cGlyZXNUaW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZW1wbG95ZWU6IHVzZXJFLmlkX2VtcGxveWVlLCBcblx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiB1c2VyRS5lbWFpbCxcblx0XHRcdFx0XHRcdFx0XHRcdGZpcnN0X25hbWU6IHVzZXJFLmZpcnN0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRsYXN0X25hbWU6IHVzZXJFLmxhc3RfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogdXNlckUuZnVsbF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0YXZhdGFyOiB1c2VyRS5hdmF0YXIsXG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9uczogcGVybWlzc2lvbnMsXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9yb2xlczogdXNlckUuaWRfcm9sZXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRsYW5ndWFnZXM6IGxhbmd1YWdlc1xuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0Ly8gbG9nXG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHR1c2VyRS5ldmVudF90aW1lID0gTGlicy5nZXRDdXJyZW50RGF0ZUZvcm1hdCgneXl5eU1NZGRISG1tc3MnKTtcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGV2ZW50LmVtaXQoJ2xvZycsIENvbnN0YW50cy50eXBlX2xvZy5sb2dpbiwge3RhYmxlX25hbWU6IG51bGwsY29udGVudDp1c2VyRX0pO1xuXHRcdFx0XHRcdFx0XHRcdHJzID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ01TR19MT0dJTicpLCBkYXRhKTtcblx0XHRcdFx0XHRcdFx0XHRyZXMuc2VuZChycyk7XG5cblxuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRcdFx0cnMgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnRVJSX0xPR0lOJyksIGUpO1xuXHRcdFx0XHRcdFx0XHRcdHJlcy5zZW5kKHJzKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdFx0XHRcdFx0cmVzLnNlbmQoTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfTE9HSU4nKSwgZSkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cmVzLnNlbmQoTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfTE9HSU4nKSwgZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdHJlcy5zZW5kKExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX0xPR0lOJyksIGUpKTtcblx0XHR9XG5cdH1cblx0bG9nb3V0KHJlcywgcG9zdERhdGEpIHtcblx0XHRycyA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdNU0dfTE9HT1VUJyksIFwiXCIsIDApO1xuXHRcdHJlcy5zZW5kKHJzKTtcblx0fVxuXG59XG5leHBvcnQgZGVmYXVsdCBBdXRoQ29udHJvbGxlcjsiXX0=