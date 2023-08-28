'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require('./BaseService');

var _BaseService3 = _interopRequireDefault(_BaseService2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LanguageService = function (_BaseService) {
	_inherits(LanguageService, _BaseService);

	function LanguageService() {
		_classCallCheck(this, LanguageService);

		return _possibleConstructorReturn(this, (LanguageService.__proto__ || Object.getPrototypeOf(LanguageService)).call(this));
	}

	/**
     * @description Get list
     * @author Long.Pham
     * @since 30/07/2019
     * @param {Object Language} data
     * @param {function callback} callback 
     */


	_createClass(LanguageService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Language.getList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}
	}]);

	return LanguageService;
}(_BaseService3.default);

exports.default = LanguageService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9MYW5ndWFnZVNlcnZpY2UuanMiXSwibmFtZXMiOlsiTGFuZ3VhZ2VTZXJ2aWNlIiwiZGF0YSIsImNhbGxiYWNrIiwiTGlicyIsImlzQmxhbmsiLCJjdXJyZW50X3JvdyIsIm1heF9yZWNvcmQiLCJDb25zdGFudHMiLCJjb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcCIsImRiIiwibXlTcUxEQiIsInF1ZXJ5Rm9yTGlzdCIsImUiLCJjb25zb2xlIiwibG9nIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxlOzs7QUFDTCw0QkFBYztBQUFBOztBQUFBO0FBR2I7O0FBRUQ7Ozs7Ozs7Ozs7OzBCQU9RQyxJLEVBQU1DLFEsRUFBVTtBQUN2QixPQUFJO0FBQ0gsUUFBSSxDQUFDQyxLQUFLQyxPQUFMLENBQWFILElBQWIsQ0FBTCxFQUF5QjtBQUN4QkEsVUFBS0ksV0FBTCxHQUFvQixPQUFPSixLQUFLSSxXQUFaLElBQTJCLFdBQTVCLEdBQTJDLENBQTNDLEdBQStDSixLQUFLSSxXQUF2RTtBQUNBSixVQUFLSyxVQUFMLEdBQWtCQyxVQUFVTixJQUFWLENBQWVLLFVBQWpDO0FBQ0E7QUFDREwsV0FBT0UsS0FBS0ssMEJBQUwsQ0FBZ0NQLElBQWhDLENBQVA7QUFDQSxRQUFJUSxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHRSxZQUFILENBQWdCLGtCQUFoQixFQUFvQ1YsSUFBcEMsRUFBMENDLFFBQTFDO0FBQ0EsSUFSRCxDQVFFLE9BQU9VLENBQVAsRUFBVTtBQUNYQyxZQUFRQyxHQUFSLENBQVlGLENBQVo7QUFDQSxXQUFPVixTQUFTLEtBQVQsRUFBZ0JVLENBQWhCLENBQVA7QUFDQTtBQUNEOzs7O0VBMUI0QkcscUI7O2tCQTRCZmYsZSIsImZpbGUiOiJMYW5ndWFnZVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmNsYXNzIExhbmd1YWdlU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG4gICAgICogQHBhcmFtIHtPYmplY3QgTGFuZ3VhZ2V9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG4gICAgICovXHJcblx0Z2V0TGlzdChkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YSkpIHtcclxuXHRcdFx0XHRkYXRhLmN1cnJlbnRfcm93ID0gKHR5cGVvZiBkYXRhLmN1cnJlbnRfcm93ID09ICd1bmRlZmluZWQnKSA/IDAgOiBkYXRhLmN1cnJlbnRfcm93O1xyXG5cdFx0XHRcdGRhdGEubWF4X3JlY29yZCA9IENvbnN0YW50cy5kYXRhLm1heF9yZWNvcmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIkxhbmd1YWdlLmdldExpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgTGFuZ3VhZ2VTZXJ2aWNlO1xyXG4iXX0=