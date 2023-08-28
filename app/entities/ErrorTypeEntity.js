'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _BaseEntity2 = require('./BaseEntity');

var _BaseEntity3 = _interopRequireDefault(_BaseEntity2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorTypeEntity = function (_BaseEntity) {
	_inherits(ErrorTypeEntity, _BaseEntity);

	function ErrorTypeEntity() {
		_classCallCheck(this, ErrorTypeEntity);

		var _this = _possibleConstructorReturn(this, (ErrorTypeEntity.__proto__ || Object.getPrototypeOf(ErrorTypeEntity)).call(this));

		_this.id = null;
		_this.thumbnail = null;
		_this.status = 1;
		_this.created_date = null;
		_this.created_by = null;
		_this.updated_date = null;
		_this.updated_by = null;
		return _this;
	}

	return ErrorTypeEntity;
}(_BaseEntity3.default);

exports.default = ErrorTypeEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9FcnJvclR5cGVFbnRpdHkuanMiXSwibmFtZXMiOlsiRXJyb3JUeXBlRW50aXR5IiwiaWQiLCJ0aHVtYm5haWwiLCJzdGF0dXMiLCJjcmVhdGVkX2RhdGUiLCJjcmVhdGVkX2J5IiwidXBkYXRlZF9kYXRlIiwidXBkYXRlZF9ieSIsIkJhc2VFbnRpdHkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFFTUEsZTs7O0FBQ0wsNEJBQWM7QUFBQTs7QUFBQTs7QUFFYixRQUFLQyxFQUFMLEdBQVUsSUFBVjtBQUNBLFFBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxRQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFSYTtBQVNiOzs7RUFWNEJDLG9COztrQkFZZlIsZSIsImZpbGUiOiJFcnJvclR5cGVFbnRpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUVudGl0eSBmcm9tICcuL0Jhc2VFbnRpdHknO1xuXG5jbGFzcyBFcnJvclR5cGVFbnRpdHkgZXh0ZW5kcyBCYXNlRW50aXR5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLmlkID0gbnVsbDtcblx0XHR0aGlzLnRodW1ibmFpbCA9IG51bGw7XG5cdFx0dGhpcy5zdGF0dXMgPSAxO1xuXHRcdHRoaXMuY3JlYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLmNyZWF0ZWRfYnkgPSBudWxsO1xuXHRcdHRoaXMudXBkYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLnVwZGF0ZWRfYnkgPSBudWxsO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBFcnJvclR5cGVFbnRpdHk7Il19