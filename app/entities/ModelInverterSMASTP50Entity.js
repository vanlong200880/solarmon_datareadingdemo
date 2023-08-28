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

var ModelInverterSMASTP50Entity = function (_BaseEntity) {
	_inherits(ModelInverterSMASTP50Entity, _BaseEntity);

	function ModelInverterSMASTP50Entity() {
		_classCallCheck(this, ModelInverterSMASTP50Entity);

		var _this = _possibleConstructorReturn(this, (ModelInverterSMASTP50Entity.__proto__ || Object.getPrototypeOf(ModelInverterSMASTP50Entity)).call(this));

		_this.time = null;
		_this.id_device = null;
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
		_this.dailyEnergy = null;
		_this.dcCurrent = null;
		_this.dcVoltage = null;
		_this.dcPower = null;
		_this.internalTemperature = null;
		_this.mppt1Current = null;
		_this.mppt1Voltage = null;
		_this.mppt1Power = null;
		_this.mppt2Current = null;
		_this.mppt2Voltage = null;
		_this.mppt2Power = null;
		_this.mppt3Current = null;
		_this.mppt3Voltage = null;
		_this.mppt3Power = null;
		_this.mppt4Current = null;
		_this.mppt4Voltage = null;
		_this.mppt4Power = null;
		_this.mppt5Current = null;
		_this.mppt5Voltage = null;
		_this.mppt5Power = null;
		_this.mppt6Current = null;
		_this.mppt6Voltage = null;
		_this.mppt6Power = null;
		return _this;
	}

	return ModelInverterSMASTP50Entity;
}(_BaseEntity3.default);

exports.default = ModelInverterSMASTP50Entity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9Nb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHkuanMiXSwibmFtZXMiOlsiTW9kZWxJbnZlcnRlclNNQVNUUDUwRW50aXR5IiwidGltZSIsImlkX2RldmljZSIsImN1cnJlbnRQaGFzZUEiLCJjdXJyZW50UGhhc2VCIiwiY3VycmVudFBoYXNlQyIsInZvbHRhZ2VQaGFzZUEiLCJ2b2x0YWdlUGhhc2VCIiwidm9sdGFnZVBoYXNlQyIsImFjdGl2ZVBvd2VyIiwicG93ZXJGcmVxdWVuY3kiLCJhcHBhcmVudFBvd2VyIiwicmVhY3RpdmVQb3dlciIsInBvd2VyRmFjdG9yIiwiYWN0aXZlRW5lcmd5IiwiZGFpbHlFbmVyZ3kiLCJkY0N1cnJlbnQiLCJkY1ZvbHRhZ2UiLCJkY1Bvd2VyIiwiaW50ZXJuYWxUZW1wZXJhdHVyZSIsIm1wcHQxQ3VycmVudCIsIm1wcHQxVm9sdGFnZSIsIm1wcHQxUG93ZXIiLCJtcHB0MkN1cnJlbnQiLCJtcHB0MlZvbHRhZ2UiLCJtcHB0MlBvd2VyIiwibXBwdDNDdXJyZW50IiwibXBwdDNWb2x0YWdlIiwibXBwdDNQb3dlciIsIm1wcHQ0Q3VycmVudCIsIm1wcHQ0Vm9sdGFnZSIsIm1wcHQ0UG93ZXIiLCJtcHB0NUN1cnJlbnQiLCJtcHB0NVZvbHRhZ2UiLCJtcHB0NVBvd2VyIiwibXBwdDZDdXJyZW50IiwibXBwdDZWb2x0YWdlIiwibXBwdDZQb3dlciIsIkJhc2VFbnRpdHkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFFTUEsMkI7OztBQUNMLHdDQUFjO0FBQUE7O0FBQUE7O0FBRWIsUUFBS0MsSUFBTCxHQUFZLElBQVo7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxRQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxRQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsUUFBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUNBLFFBQUtDLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxRQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUNBLFFBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsUUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxRQUFLQyxtQkFBTCxHQUEyQixJQUEzQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQXRDYTtBQXVDYjs7O0VBeEN3Q0Msb0I7O2tCQTBDM0J0QywyQiIsImZpbGUiOiJNb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUVudGl0eSBmcm9tICcuL0Jhc2VFbnRpdHknO1xuXG5jbGFzcyBNb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHkgZXh0ZW5kcyBCYXNlRW50aXR5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnRpbWUgPSBudWxsO1xuXHRcdHRoaXMuaWRfZGV2aWNlID0gbnVsbDtcblx0XHR0aGlzLmN1cnJlbnRQaGFzZUEgPSBudWxsO1xuXHRcdHRoaXMuY3VycmVudFBoYXNlQiA9IG51bGw7XG5cdFx0dGhpcy5jdXJyZW50UGhhc2VDID0gbnVsbDtcblx0XHR0aGlzLnZvbHRhZ2VQaGFzZUEgPSBudWxsO1xuXHRcdHRoaXMudm9sdGFnZVBoYXNlQiA9IG51bGw7XG5cdFx0dGhpcy52b2x0YWdlUGhhc2VDID0gbnVsbDtcblx0XHR0aGlzLmFjdGl2ZVBvd2VyID0gbnVsbDtcblx0XHR0aGlzLnBvd2VyRnJlcXVlbmN5ID0gbnVsbDtcblx0XHR0aGlzLmFwcGFyZW50UG93ZXIgPSBudWxsO1xuXHRcdHRoaXMucmVhY3RpdmVQb3dlciA9IG51bGw7XG5cdFx0dGhpcy5wb3dlckZhY3RvciA9IG51bGw7XG5cdFx0dGhpcy5hY3RpdmVFbmVyZ3kgPSBudWxsO1xuXHRcdHRoaXMuZGFpbHlFbmVyZ3kgPSBudWxsO1xuXHRcdHRoaXMuZGNDdXJyZW50ID0gbnVsbDtcblx0XHR0aGlzLmRjVm9sdGFnZSA9IG51bGw7XG5cdFx0dGhpcy5kY1Bvd2VyID0gbnVsbDtcblx0XHR0aGlzLmludGVybmFsVGVtcGVyYXR1cmUgPSBudWxsO1xuXHRcdHRoaXMubXBwdDFDdXJyZW50ID0gbnVsbDtcblx0XHR0aGlzLm1wcHQxVm9sdGFnZSA9IG51bGw7XG5cdFx0dGhpcy5tcHB0MVBvd2VyID0gbnVsbDtcblx0XHR0aGlzLm1wcHQyQ3VycmVudCA9IG51bGw7XG5cdFx0dGhpcy5tcHB0MlZvbHRhZ2UgPSBudWxsO1xuXHRcdHRoaXMubXBwdDJQb3dlciA9IG51bGw7XG5cdFx0dGhpcy5tcHB0M0N1cnJlbnQgPSBudWxsO1xuXHRcdHRoaXMubXBwdDNWb2x0YWdlID0gbnVsbDtcblx0XHR0aGlzLm1wcHQzUG93ZXIgPSBudWxsO1xuXHRcdHRoaXMubXBwdDRDdXJyZW50ID0gbnVsbDtcblx0XHR0aGlzLm1wcHQ0Vm9sdGFnZSA9IG51bGw7XG5cdFx0dGhpcy5tcHB0NFBvd2VyID0gbnVsbDtcblx0XHR0aGlzLm1wcHQ1Q3VycmVudCA9IG51bGw7XG5cdFx0dGhpcy5tcHB0NVZvbHRhZ2UgPSBudWxsO1xuXHRcdHRoaXMubXBwdDVQb3dlciA9IG51bGw7XG5cdFx0dGhpcy5tcHB0NkN1cnJlbnQgPSBudWxsO1xuXHRcdHRoaXMubXBwdDZWb2x0YWdlID0gbnVsbDtcblx0XHR0aGlzLm1wcHQ2UG93ZXIgPSBudWxsO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBNb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHk7Il19