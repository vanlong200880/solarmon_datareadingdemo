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

var LoggerEntity = function (_BaseEntity) {
	_inherits(LoggerEntity, _BaseEntity);

	function LoggerEntity() {
		_classCallCheck(this, LoggerEntity);

		var _this = _possibleConstructorReturn(this, (LoggerEntity.__proto__ || Object.getPrototypeOf(LoggerEntity)).call(this));

		_this.id = null;
		_this.table_name = null;
		_this.type = null;
		_this.user_id = null;
		_this.content = null;
		return _this;
	}

	return LoggerEntity;
}(_BaseEntity3.default);

exports.default = LoggerEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9Mb2dnZXJFbnRpdHkuanMiXSwibmFtZXMiOlsiTG9nZ2VyRW50aXR5IiwiaWQiLCJ0YWJsZV9uYW1lIiwidHlwZSIsInVzZXJfaWQiLCJjb250ZW50IiwiQmFzZUVudGl0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUVNQSxZOzs7QUFDTCx5QkFBYztBQUFBOztBQUFBOztBQUViLFFBQUtDLEVBQUwsR0FBVSxJQUFWO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLElBQUwsR0FBWSxJQUFaO0FBQ0EsUUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxRQUFLQyxPQUFMLEdBQWUsSUFBZjtBQU5hO0FBT2I7OztFQVJ5QkMsb0I7O2tCQVdaTixZIiwiZmlsZSI6IkxvZ2dlckVudGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRW50aXR5IGZyb20gJy4vQmFzZUVudGl0eSc7XG5cbmNsYXNzIExvZ2dlckVudGl0eSBleHRlbmRzIEJhc2VFbnRpdHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuaWQgPSBudWxsO1xuXHRcdHRoaXMudGFibGVfbmFtZSA9IG51bGw7XG5cdFx0dGhpcy50eXBlID0gbnVsbDtcblx0XHR0aGlzLnVzZXJfaWQgPSBudWxsO1xuXHRcdHRoaXMuY29udGVudCA9IG51bGw7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9nZ2VyRW50aXR5OyJdfQ==