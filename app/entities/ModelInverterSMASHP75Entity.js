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

var ModelInverterSMASHP75Entity = function (_BaseEntity) {
	_inherits(ModelInverterSMASHP75Entity, _BaseEntity);

	function ModelInverterSMASHP75Entity() {
		_classCallCheck(this, ModelInverterSMASHP75Entity);

		var _this = _possibleConstructorReturn(this, (ModelInverterSMASHP75Entity.__proto__ || Object.getPrototypeOf(ModelInverterSMASHP75Entity)).call(this));

		_this.time = null;
		_this.id_device = null;
		_this.acCurrent = null;
		_this.currentPhaseA = null;
		_this.currentPhaseB = null;
		_this.currentPhaseC = null;
		_this.voltagePhaseA = null;
		_this.voltagePhaseB = null;
		_this.voltagePhaseC = null;
		_this.activePower = null;
		_this.powerFrequency = null;
		_this.apparentPower = null;
		_this.reactivePower = null;
		_this.powerFactor = null;
		_this.activeEnergy = null;
		_this.dcCurrent = null;
		_this.dcVoltage = null;
		_this.dcPower = null;
		_this.internalTemperature = null;
		_this.heatSinkTemperature = null;
		_this.transformerTemperature = null;
		return _this;
	}

	return ModelInverterSMASHP75Entity;
}(_BaseEntity3.default);

exports.default = ModelInverterSMASHP75Entity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9Nb2RlbEludmVydGVyU01BU0hQNzVFbnRpdHkuanMiXSwibmFtZXMiOlsiTW9kZWxJbnZlcnRlclNNQVNIUDc1RW50aXR5IiwidGltZSIsImlkX2RldmljZSIsImFjQ3VycmVudCIsImN1cnJlbnRQaGFzZUEiLCJjdXJyZW50UGhhc2VCIiwiY3VycmVudFBoYXNlQyIsInZvbHRhZ2VQaGFzZUEiLCJ2b2x0YWdlUGhhc2VCIiwidm9sdGFnZVBoYXNlQyIsImFjdGl2ZVBvd2VyIiwicG93ZXJGcmVxdWVuY3kiLCJhcHBhcmVudFBvd2VyIiwicmVhY3RpdmVQb3dlciIsInBvd2VyRmFjdG9yIiwiYWN0aXZlRW5lcmd5IiwiZGNDdXJyZW50IiwiZGNWb2x0YWdlIiwiZGNQb3dlciIsImludGVybmFsVGVtcGVyYXR1cmUiLCJoZWF0U2lua1RlbXBlcmF0dXJlIiwidHJhbnNmb3JtZXJUZW1wZXJhdHVyZSIsIkJhc2VFbnRpdHkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFFTUEsMkI7OztBQUNMLHdDQUFjO0FBQUE7O0FBQUE7O0FBRWIsUUFBS0MsSUFBTCxHQUFZLElBQVo7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsUUFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFFBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxRQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxRQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxRQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxRQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsUUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxRQUFLQyxtQkFBTCxHQUEyQixJQUEzQjtBQUNBLFFBQUtDLG1CQUFMLEdBQTJCLElBQTNCO0FBQ0EsUUFBS0Msc0JBQUwsR0FBOEIsSUFBOUI7QUF0QmE7QUF1QmI7OztFQXhCd0NDLG9COztrQkEwQjNCdEIsMkIiLCJmaWxlIjoiTW9kZWxJbnZlcnRlclNNQVNIUDc1RW50aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VFbnRpdHkgZnJvbSAnLi9CYXNlRW50aXR5JztcblxuY2xhc3MgTW9kZWxJbnZlcnRlclNNQVNIUDc1RW50aXR5IGV4dGVuZHMgQmFzZUVudGl0eSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy50aW1lID0gbnVsbDtcblx0XHR0aGlzLmlkX2RldmljZSA9IG51bGw7XG5cdFx0dGhpcy5hY0N1cnJlbnQgPSBudWxsO1xuXHRcdHRoaXMuY3VycmVudFBoYXNlQSA9IG51bGw7XG5cdFx0dGhpcy5jdXJyZW50UGhhc2VCID0gbnVsbDtcblx0XHR0aGlzLmN1cnJlbnRQaGFzZUMgPSBudWxsO1xuXHRcdHRoaXMudm9sdGFnZVBoYXNlQSA9IG51bGw7XG5cdFx0dGhpcy52b2x0YWdlUGhhc2VCID0gbnVsbDtcblx0XHR0aGlzLnZvbHRhZ2VQaGFzZUMgPSBudWxsO1xuXHRcdHRoaXMuYWN0aXZlUG93ZXIgPSBudWxsO1xuXHRcdHRoaXMucG93ZXJGcmVxdWVuY3kgPSBudWxsO1xuXHRcdHRoaXMuYXBwYXJlbnRQb3dlciA9IG51bGw7XG5cdFx0dGhpcy5yZWFjdGl2ZVBvd2VyID0gbnVsbDtcblx0XHR0aGlzLnBvd2VyRmFjdG9yID0gbnVsbDtcblx0XHR0aGlzLmFjdGl2ZUVuZXJneSA9IG51bGw7XG5cdFx0dGhpcy5kY0N1cnJlbnQgPSBudWxsO1xuXHRcdHRoaXMuZGNWb2x0YWdlID0gbnVsbDtcblx0XHR0aGlzLmRjUG93ZXIgPSBudWxsO1xuXHRcdHRoaXMuaW50ZXJuYWxUZW1wZXJhdHVyZSA9IG51bGw7XG5cdFx0dGhpcy5oZWF0U2lua1RlbXBlcmF0dXJlID0gbnVsbDtcblx0XHR0aGlzLnRyYW5zZm9ybWVyVGVtcGVyYXR1cmUgPSBudWxsO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBNb2RlbEludmVydGVyU01BU0hQNzVFbnRpdHk7Il19