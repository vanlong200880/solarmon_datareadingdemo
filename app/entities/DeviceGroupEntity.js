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

var DeviceGroupEntity = function (_BaseEntity) {
	_inherits(DeviceGroupEntity, _BaseEntity);

	function DeviceGroupEntity() {
		_classCallCheck(this, DeviceGroupEntity);

		var _this = _possibleConstructorReturn(this, (DeviceGroupEntity.__proto__ || Object.getPrototypeOf(DeviceGroupEntity)).call(this));

		_this.id = null;
		_this.name = null;
		_this.table_name = null;
		_this.code_prefix = null;
		_this.status = 1;
		_this.created_date = null;
		_this.created_by = null;
		_this.updated_date = null;
		_this.updated_by = null;

		return _this;
	}

	return DeviceGroupEntity;
}(_BaseEntity3.default);

exports.default = DeviceGroupEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9EZXZpY2VHcm91cEVudGl0eS5qcyJdLCJuYW1lcyI6WyJEZXZpY2VHcm91cEVudGl0eSIsImlkIiwibmFtZSIsInRhYmxlX25hbWUiLCJjb2RlX3ByZWZpeCIsInN0YXR1cyIsImNyZWF0ZWRfZGF0ZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2RhdGUiLCJ1cGRhdGVkX2J5IiwiQmFzZUVudGl0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUVNQSxpQjs7O0FBQ0wsOEJBQWM7QUFBQTs7QUFBQTs7QUFFYixRQUFLQyxFQUFMLEdBQVUsSUFBVjtBQUNBLFFBQUtDLElBQUwsR0FBWSxJQUFaO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxRQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7O0FBVmE7QUFZYjs7O0VBYjhCQyxvQjs7a0JBZWpCVixpQiIsImZpbGUiOiJEZXZpY2VHcm91cEVudGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRW50aXR5IGZyb20gJy4vQmFzZUVudGl0eSc7XG5cbmNsYXNzIERldmljZUdyb3VwRW50aXR5IGV4dGVuZHMgQmFzZUVudGl0eSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5pZCA9IG51bGw7XG5cdFx0dGhpcy5uYW1lID0gbnVsbDtcblx0XHR0aGlzLnRhYmxlX25hbWUgPSBudWxsO1xuXHRcdHRoaXMuY29kZV9wcmVmaXggPSBudWxsO1xuXHRcdHRoaXMuc3RhdHVzID0gMTtcblx0XHR0aGlzLmNyZWF0ZWRfZGF0ZSA9IG51bGw7XG5cdFx0dGhpcy5jcmVhdGVkX2J5ID0gbnVsbDtcblx0XHR0aGlzLnVwZGF0ZWRfZGF0ZSA9IG51bGw7XG5cdFx0dGhpcy51cGRhdGVkX2J5ID0gbnVsbDtcblx0XHRcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgRGV2aWNlR3JvdXBFbnRpdHk7Il19