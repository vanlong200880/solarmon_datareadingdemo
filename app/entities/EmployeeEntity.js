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

var EmployeeEntity = function (_BaseEntity) {
	_inherits(EmployeeEntity, _BaseEntity);

	function EmployeeEntity() {
		_classCallCheck(this, EmployeeEntity);

		var _this = _possibleConstructorReturn(this, (EmployeeEntity.__proto__ || Object.getPrototypeOf(EmployeeEntity)).call(this));

		_this.id = null;
		_this.first_name = null;
		_this.last_name = null;
		_this.full_name = null;
		_this.phone = null;
		_this.email = null;
		_this.password = null;
		_this.salt = null;
		_this.birthday = null;
		_this.avatar = null;
		_this.token = null;
		_this.status = null;
		_this.gender = null;
		return _this;
	}

	return EmployeeEntity;
}(_BaseEntity3.default);

exports.default = EmployeeEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9FbXBsb3llZUVudGl0eS5qcyJdLCJuYW1lcyI6WyJFbXBsb3llZUVudGl0eSIsImlkIiwiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSIsImZ1bGxfbmFtZSIsInBob25lIiwiZW1haWwiLCJwYXNzd29yZCIsInNhbHQiLCJiaXJ0aGRheSIsImF2YXRhciIsInRva2VuIiwic3RhdHVzIiwiZ2VuZGVyIiwiQmFzZUVudGl0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUVNQSxjOzs7QUFDTCwyQkFBYztBQUFBOztBQUFBOztBQUViLFFBQUtDLEVBQUwsR0FBVSxJQUFWO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsUUFBS0MsS0FBTCxHQUFhLElBQWI7QUFDQSxRQUFLQyxLQUFMLEdBQWEsSUFBYjtBQUNBLFFBQUtDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxRQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLFFBQUtDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxRQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNBLFFBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsUUFBS0MsTUFBTCxHQUFjLElBQWQ7QUFDQSxRQUFLQyxNQUFMLEdBQWMsSUFBZDtBQWRhO0FBZWI7OztFQWhCMkJDLG9COztrQkFrQmRkLGMiLCJmaWxlIjoiRW1wbG95ZWVFbnRpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUVudGl0eSBmcm9tICcuL0Jhc2VFbnRpdHknO1xuXG5jbGFzcyBFbXBsb3llZUVudGl0eSBleHRlbmRzIEJhc2VFbnRpdHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuaWQgPSBudWxsO1xuXHRcdHRoaXMuZmlyc3RfbmFtZSA9IG51bGw7XG5cdFx0dGhpcy5sYXN0X25hbWUgPSBudWxsO1xuXHRcdHRoaXMuZnVsbF9uYW1lID0gbnVsbDtcblx0XHR0aGlzLnBob25lID0gbnVsbDtcblx0XHR0aGlzLmVtYWlsID0gbnVsbDtcblx0XHR0aGlzLnBhc3N3b3JkID0gbnVsbDtcblx0XHR0aGlzLnNhbHQgPSBudWxsO1xuXHRcdHRoaXMuYmlydGhkYXkgPSBudWxsO1xuXHRcdHRoaXMuYXZhdGFyID0gbnVsbDtcblx0XHR0aGlzLnRva2VuID0gbnVsbDtcblx0XHR0aGlzLnN0YXR1cyA9IG51bGw7XG5cdFx0dGhpcy5nZW5kZXIgPSBudWxsO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBFbXBsb3llZUVudGl0eTsiXX0=