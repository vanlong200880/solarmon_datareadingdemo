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

var ModelTechedgeEntity = function (_BaseEntity) {
	_inherits(ModelTechedgeEntity, _BaseEntity);

	function ModelTechedgeEntity() {
		_classCallCheck(this, ModelTechedgeEntity);

		var _this = _possibleConstructorReturn(this, (ModelTechedgeEntity.__proto__ || Object.getPrototypeOf(ModelTechedgeEntity)).call(this));

		_this.time = null;
		_this.id_device = null;
		_this.memPercent = null;
		_this.memTotal = null;
		_this.memUsed = null;
		_this.memAvail = null;
		_this.memFree = null;
		_this.diskPercent = null;
		_this.diskTotal = null;
		_this.diskUsed = null;
		_this.diskFree = null;
		_this.cpuTemp = null;
		_this.upTime = null;
		return _this;
	}

	return ModelTechedgeEntity;
}(_BaseEntity3.default);

exports.default = ModelTechedgeEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9Nb2RlbFRlY2hlZGdlRW50aXR5LmpzIl0sIm5hbWVzIjpbIk1vZGVsVGVjaGVkZ2VFbnRpdHkiLCJ0aW1lIiwiaWRfZGV2aWNlIiwibWVtUGVyY2VudCIsIm1lbVRvdGFsIiwibWVtVXNlZCIsIm1lbUF2YWlsIiwibWVtRnJlZSIsImRpc2tQZXJjZW50IiwiZGlza1RvdGFsIiwiZGlza1VzZWQiLCJkaXNrRnJlZSIsImNwdVRlbXAiLCJ1cFRpbWUiLCJCYXNlRW50aXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRU1BLG1COzs7QUFDTCxnQ0FBYztBQUFBOztBQUFBOztBQUViLFFBQUtDLElBQUwsR0FBWSxJQUFaO0FBQ0EsUUFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxRQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsUUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxRQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsUUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxRQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsUUFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFFBQUtDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxRQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsUUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxRQUFLQyxNQUFMLEdBQWMsSUFBZDtBQWRhO0FBZWI7OztFQWhCZ0NDLG9COztrQkFrQm5CZCxtQiIsImZpbGUiOiJNb2RlbFRlY2hlZGdlRW50aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VFbnRpdHkgZnJvbSAnLi9CYXNlRW50aXR5JztcblxuY2xhc3MgTW9kZWxUZWNoZWRnZUVudGl0eSBleHRlbmRzIEJhc2VFbnRpdHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMudGltZSA9IG51bGw7XG5cdFx0dGhpcy5pZF9kZXZpY2UgPSBudWxsO1xuXHRcdHRoaXMubWVtUGVyY2VudCA9IG51bGw7XG5cdFx0dGhpcy5tZW1Ub3RhbCA9IG51bGw7XG5cdFx0dGhpcy5tZW1Vc2VkID0gbnVsbDtcblx0XHR0aGlzLm1lbUF2YWlsID0gbnVsbDtcblx0XHR0aGlzLm1lbUZyZWUgPSBudWxsO1xuXHRcdHRoaXMuZGlza1BlcmNlbnQgPSBudWxsO1xuXHRcdHRoaXMuZGlza1RvdGFsID0gbnVsbDtcblx0XHR0aGlzLmRpc2tVc2VkID0gbnVsbDtcblx0XHR0aGlzLmRpc2tGcmVlID0gbnVsbDtcblx0XHR0aGlzLmNwdVRlbXAgPSBudWxsO1xuXHRcdHRoaXMudXBUaW1lID0gbnVsbDtcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgTW9kZWxUZWNoZWRnZUVudGl0eTsiXX0=