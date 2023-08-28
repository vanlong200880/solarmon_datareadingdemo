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

var DeviceEntity = function (_BaseEntity) {
	_inherits(DeviceEntity, _BaseEntity);

	function DeviceEntity() {
		_classCallCheck(this, DeviceEntity);

		var _this = _possibleConstructorReturn(this, (DeviceEntity.__proto__ || Object.getPrototypeOf(DeviceEntity)).call(this));

		_this.id = null;
		_this.id_device = null;
		_this.id_project = null;
		_this.id_device_type = null;
		_this.name = null;
		_this.model = null;
		_this.serial_number = null;
		_this.manufacturer = null;
		_this.installed_at = null;
		_this.description = null;
		_this.status = 1;
		_this.is_virtual = 1;
		_this.created_date = null;
		_this.created_by = null;
		_this.updated_date = null;
		_this.updated_by = null;
		return _this;
	}

	return DeviceEntity;
}(_BaseEntity3.default);

exports.default = DeviceEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9EZXZpY2VFbnRpdHkuanMiXSwibmFtZXMiOlsiRGV2aWNlRW50aXR5IiwiaWQiLCJpZF9kZXZpY2UiLCJpZF9wcm9qZWN0IiwiaWRfZGV2aWNlX3R5cGUiLCJuYW1lIiwibW9kZWwiLCJzZXJpYWxfbnVtYmVyIiwibWFudWZhY3R1cmVyIiwiaW5zdGFsbGVkX2F0IiwiZGVzY3JpcHRpb24iLCJzdGF0dXMiLCJpc192aXJ0dWFsIiwiY3JlYXRlZF9kYXRlIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfZGF0ZSIsInVwZGF0ZWRfYnkiLCJCYXNlRW50aXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRU1BLFk7OztBQUNMLHlCQUFjO0FBQUE7O0FBQUE7O0FBRWIsUUFBS0MsRUFBTCxHQUFVLElBQVY7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxRQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLFFBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUNBLFFBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixDQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFqQmE7QUFrQmI7OztFQW5CeUJDLG9COztrQkFxQlpqQixZIiwiZmlsZSI6IkRldmljZUVudGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRW50aXR5IGZyb20gJy4vQmFzZUVudGl0eSc7XG5cbmNsYXNzIERldmljZUVudGl0eSBleHRlbmRzIEJhc2VFbnRpdHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuaWQgPSBudWxsO1xuXHRcdHRoaXMuaWRfZGV2aWNlID0gbnVsbDtcblx0XHR0aGlzLmlkX3Byb2plY3QgPSBudWxsO1xuXHRcdHRoaXMuaWRfZGV2aWNlX3R5cGUgPSBudWxsO1xuXHRcdHRoaXMubmFtZSA9IG51bGw7XG5cdFx0dGhpcy5tb2RlbCA9IG51bGw7XG5cdFx0dGhpcy5zZXJpYWxfbnVtYmVyID0gbnVsbDtcblx0XHR0aGlzLm1hbnVmYWN0dXJlciA9IG51bGw7XG5cdFx0dGhpcy5pbnN0YWxsZWRfYXQgPSBudWxsO1xuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBudWxsO1xuXHRcdHRoaXMuc3RhdHVzID0gMTtcblx0XHR0aGlzLmlzX3ZpcnR1YWwgPSAxO1xuXHRcdHRoaXMuY3JlYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLmNyZWF0ZWRfYnkgPSBudWxsO1xuXHRcdHRoaXMudXBkYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLnVwZGF0ZWRfYnkgPSBudWxsO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBEZXZpY2VFbnRpdHk7Il19