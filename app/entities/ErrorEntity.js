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

var ErrorEntity = function (_BaseEntity) {
	_inherits(ErrorEntity, _BaseEntity);

	function ErrorEntity() {
		_classCallCheck(this, ErrorEntity);

		var _this = _possibleConstructorReturn(this, (ErrorEntity.__proto__ || Object.getPrototypeOf(ErrorEntity)).call(this));

		_this.id = null;
		_this.id_error_level = null;
		_this.id_error_type = null;
		_this.id_device_group = null;
		_this.id_error_state = null;
		_this.status = 1;
		_this.error_code = null;
		_this.created_date = null;
		_this.created_by = null;
		_this.updated_date = null;
		_this.updated_by = null;

		return _this;
	}

	return ErrorEntity;
}(_BaseEntity3.default);

exports.default = ErrorEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9FcnJvckVudGl0eS5qcyJdLCJuYW1lcyI6WyJFcnJvckVudGl0eSIsImlkIiwiaWRfZXJyb3JfbGV2ZWwiLCJpZF9lcnJvcl90eXBlIiwiaWRfZGV2aWNlX2dyb3VwIiwiaWRfZXJyb3Jfc3RhdGUiLCJzdGF0dXMiLCJlcnJvcl9jb2RlIiwiY3JlYXRlZF9kYXRlIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfZGF0ZSIsInVwZGF0ZWRfYnkiLCJCYXNlRW50aXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRU1BLFc7OztBQUNMLHdCQUFjO0FBQUE7O0FBQUE7O0FBRWIsUUFBS0MsRUFBTCxHQUFVLElBQVY7QUFDQSxRQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxRQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsUUFBS0MsTUFBTCxHQUFjLENBQWQ7QUFDQSxRQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjs7QUFaYTtBQWNiOzs7RUFmd0JDLG9COztrQkFpQlhaLFciLCJmaWxlIjoiRXJyb3JFbnRpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUVudGl0eSBmcm9tICcuL0Jhc2VFbnRpdHknO1xuXG5jbGFzcyBFcnJvckVudGl0eSBleHRlbmRzIEJhc2VFbnRpdHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuaWQgPSBudWxsO1xuXHRcdHRoaXMuaWRfZXJyb3JfbGV2ZWwgPSBudWxsO1xuXHRcdHRoaXMuaWRfZXJyb3JfdHlwZSA9IG51bGw7XG5cdFx0dGhpcy5pZF9kZXZpY2VfZ3JvdXAgPSBudWxsO1xuXHRcdHRoaXMuaWRfZXJyb3Jfc3RhdGUgPSBudWxsO1xuXHRcdHRoaXMuc3RhdHVzID0gMTtcblx0XHR0aGlzLmVycm9yX2NvZGUgPSBudWxsO1xuXHRcdHRoaXMuY3JlYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLmNyZWF0ZWRfYnkgPSBudWxsO1xuXHRcdHRoaXMudXBkYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLnVwZGF0ZWRfYnkgPSBudWxsO1xuXHRcdFxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBFcnJvckVudGl0eTsiXX0=