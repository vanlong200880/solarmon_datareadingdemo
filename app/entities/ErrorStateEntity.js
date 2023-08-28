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

var ErrorStateEntity = function (_BaseEntity) {
	_inherits(ErrorStateEntity, _BaseEntity);

	function ErrorStateEntity() {
		_classCallCheck(this, ErrorStateEntity);

		var _this = _possibleConstructorReturn(this, (ErrorStateEntity.__proto__ || Object.getPrototypeOf(ErrorStateEntity)).call(this));

		_this.id = null;
		_this.status = 1;
		_this.created_date = null;
		_this.created_by = null;
		_this.updated_date = null;
		_this.updated_by = null;
		return _this;
	}

	return ErrorStateEntity;
}(_BaseEntity3.default);

exports.default = ErrorStateEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9FcnJvclN0YXRlRW50aXR5LmpzIl0sIm5hbWVzIjpbIkVycm9yU3RhdGVFbnRpdHkiLCJpZCIsInN0YXR1cyIsImNyZWF0ZWRfZGF0ZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2RhdGUiLCJ1cGRhdGVkX2J5IiwiQmFzZUVudGl0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUVNQSxnQjs7O0FBQ0wsNkJBQWM7QUFBQTs7QUFBQTs7QUFFYixRQUFLQyxFQUFMLEdBQVUsSUFBVjtBQUNBLFFBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQVBhO0FBUWI7OztFQVQ2QkMsb0I7O2tCQVdoQlAsZ0IiLCJmaWxlIjoiRXJyb3JTdGF0ZUVudGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRW50aXR5IGZyb20gJy4vQmFzZUVudGl0eSc7XG5cbmNsYXNzIEVycm9yU3RhdGVFbnRpdHkgZXh0ZW5kcyBCYXNlRW50aXR5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLmlkID0gbnVsbDtcblx0XHR0aGlzLnN0YXR1cyA9IDE7XG5cdFx0dGhpcy5jcmVhdGVkX2RhdGUgPSBudWxsO1xuXHRcdHRoaXMuY3JlYXRlZF9ieSA9IG51bGw7XG5cdFx0dGhpcy51cGRhdGVkX2RhdGUgPSBudWxsO1xuXHRcdHRoaXMudXBkYXRlZF9ieSA9IG51bGw7XG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IEVycm9yU3RhdGVFbnRpdHk7Il19