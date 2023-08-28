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

var DeviceParameterEntity = function (_BaseEntity) {
	_inherits(DeviceParameterEntity, _BaseEntity);

	function DeviceParameterEntity() {
		_classCallCheck(this, DeviceParameterEntity);

		var _this = _possibleConstructorReturn(this, (DeviceParameterEntity.__proto__ || Object.getPrototypeOf(DeviceParameterEntity)).call(this));

		_this.id = null;
		_this.id_device_group = null;
		_this.name = null;
		_this.slug = null;
		_this.unit = null;
		_this.status = 1;
		_this.error_code = null;
		_this.created_date = null;
		_this.created_by = null;
		_this.updated_date = null;
		_this.updated_by = null;

		return _this;
	}

	return DeviceParameterEntity;
}(_BaseEntity3.default);

exports.default = DeviceParameterEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9EZXZpY2VQYXJhbWV0ZXJFbnRpdHkuanMiXSwibmFtZXMiOlsiRGV2aWNlUGFyYW1ldGVyRW50aXR5IiwiaWQiLCJpZF9kZXZpY2VfZ3JvdXAiLCJuYW1lIiwic2x1ZyIsInVuaXQiLCJzdGF0dXMiLCJlcnJvcl9jb2RlIiwiY3JlYXRlZF9kYXRlIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfZGF0ZSIsInVwZGF0ZWRfYnkiLCJCYXNlRW50aXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRU1BLHFCOzs7QUFDTCxrQ0FBYztBQUFBOztBQUFBOztBQUViLFFBQUtDLEVBQUwsR0FBVSxJQUFWO0FBQ0EsUUFBS0MsZUFBTCxHQUF1QixJQUF2QjtBQUNBLFFBQUtDLElBQUwsR0FBWSxJQUFaO0FBQ0EsUUFBS0MsSUFBTCxHQUFZLElBQVo7QUFDQSxRQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLFFBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7O0FBWmE7QUFjYjs7O0VBZmtDQyxvQjs7a0JBaUJyQloscUIiLCJmaWxlIjoiRGV2aWNlUGFyYW1ldGVyRW50aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VFbnRpdHkgZnJvbSAnLi9CYXNlRW50aXR5JztcblxuY2xhc3MgRGV2aWNlUGFyYW1ldGVyRW50aXR5IGV4dGVuZHMgQmFzZUVudGl0eSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5pZCA9IG51bGw7XG5cdFx0dGhpcy5pZF9kZXZpY2VfZ3JvdXAgPSBudWxsO1xuXHRcdHRoaXMubmFtZSA9IG51bGw7XG5cdFx0dGhpcy5zbHVnID0gbnVsbDtcblx0XHR0aGlzLnVuaXQgPSBudWxsO1xuXHRcdHRoaXMuc3RhdHVzID0gMTtcblx0XHR0aGlzLmVycm9yX2NvZGUgPSBudWxsO1xuXHRcdHRoaXMuY3JlYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLmNyZWF0ZWRfYnkgPSBudWxsO1xuXHRcdHRoaXMudXBkYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLnVwZGF0ZWRfYnkgPSBudWxsO1xuXHRcdFxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBEZXZpY2VQYXJhbWV0ZXJFbnRpdHk7Il19