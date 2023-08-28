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

var AlertEntity = function (_BaseEntity) {
	_inherits(AlertEntity, _BaseEntity);

	function AlertEntity() {
		_classCallCheck(this, AlertEntity);

		var _this = _possibleConstructorReturn(this, (AlertEntity.__proto__ || Object.getPrototypeOf(AlertEntity)).call(this));

		_this.id = null;
		_this.id_device = null;
		_this.id_error = null;
		_this.start_date = null;
		_this.end_date = null;
		_this.note = null;
		_this.id_alert_state = null;
		_this.status = null;
		_this.created_date = null;
		_this.created_by = null;
		_this.updated_date = null;
		_this.updated_by = null;
		return _this;
	}

	return AlertEntity;
}(_BaseEntity3.default);

exports.default = AlertEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9BbGVydEVudGl0eS5qcyJdLCJuYW1lcyI6WyJBbGVydEVudGl0eSIsImlkIiwiaWRfZGV2aWNlIiwiaWRfZXJyb3IiLCJzdGFydF9kYXRlIiwiZW5kX2RhdGUiLCJub3RlIiwiaWRfYWxlcnRfc3RhdGUiLCJzdGF0dXMiLCJjcmVhdGVkX2RhdGUiLCJjcmVhdGVkX2J5IiwidXBkYXRlZF9kYXRlIiwidXBkYXRlZF9ieSIsIkJhc2VFbnRpdHkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFFTUEsVzs7O0FBQ0wsd0JBQWM7QUFBQTs7QUFBQTs7QUFFYixRQUFLQyxFQUFMLEdBQVUsSUFBVjtBQUNBLFFBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxRQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxRQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLFFBQUtDLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxRQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFiYTtBQWNiOzs7RUFmd0JDLG9COztrQkFpQlhiLFciLCJmaWxlIjoiQWxlcnRFbnRpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUVudGl0eSBmcm9tICcuL0Jhc2VFbnRpdHknO1xuXG5jbGFzcyBBbGVydEVudGl0eSBleHRlbmRzIEJhc2VFbnRpdHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuaWQgPSBudWxsO1xuXHRcdHRoaXMuaWRfZGV2aWNlID0gbnVsbDtcblx0XHR0aGlzLmlkX2Vycm9yID0gbnVsbDtcblx0XHR0aGlzLnN0YXJ0X2RhdGUgPSBudWxsO1xuXHRcdHRoaXMuZW5kX2RhdGUgPSBudWxsO1xuXHRcdHRoaXMubm90ZSA9IG51bGw7XG5cdFx0dGhpcy5pZF9hbGVydF9zdGF0ZSA9IG51bGw7XG5cdFx0dGhpcy5zdGF0dXMgPSBudWxsO1xuXHRcdHRoaXMuY3JlYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLmNyZWF0ZWRfYnkgPSBudWxsO1xuXHRcdHRoaXMudXBkYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLnVwZGF0ZWRfYnkgPSBudWxsO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBBbGVydEVudGl0eTsiXX0=