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

var ModelSensorRT1Entity = function (_BaseEntity) {
	_inherits(ModelSensorRT1Entity, _BaseEntity);

	function ModelSensorRT1Entity() {
		_classCallCheck(this, ModelSensorRT1Entity);

		var _this = _possibleConstructorReturn(this, (ModelSensorRT1Entity.__proto__ || Object.getPrototypeOf(ModelSensorRT1Entity)).call(this));

		_this.time = null;
		_this.id_device = null;
		_this.deviceType = null;
		_this.dataModel = null;
		_this.softwareVersion = null;
		_this.hardwareVersion = null;
		_this.batchNumber = null;
		_this.serialNumber = null;
		_this.modbusUnitID = null;
		_this.sensor1Data = null;
		_this.internalTemperature = null;
		_this.externalVoltage = null;
		return _this;
	}

	return ModelSensorRT1Entity;
}(_BaseEntity3.default);

exports.default = ModelSensorRT1Entity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9Nb2RlbFNlbnNvclJUMUVudGl0eS5qcyJdLCJuYW1lcyI6WyJNb2RlbFNlbnNvclJUMUVudGl0eSIsInRpbWUiLCJpZF9kZXZpY2UiLCJkZXZpY2VUeXBlIiwiZGF0YU1vZGVsIiwic29mdHdhcmVWZXJzaW9uIiwiaGFyZHdhcmVWZXJzaW9uIiwiYmF0Y2hOdW1iZXIiLCJzZXJpYWxOdW1iZXIiLCJtb2RidXNVbml0SUQiLCJzZW5zb3IxRGF0YSIsImludGVybmFsVGVtcGVyYXR1cmUiLCJleHRlcm5hbFZvbHRhZ2UiLCJCYXNlRW50aXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRU1BLG9COzs7QUFDTCxpQ0FBYztBQUFBOztBQUFBOztBQUViLFFBQUtDLElBQUwsR0FBWSxJQUFaO0FBQ0EsUUFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsUUFBS0MsZUFBTCxHQUF1QixJQUF2QjtBQUNBLFFBQUtDLGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxRQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsUUFBS0MsbUJBQUwsR0FBMkIsSUFBM0I7QUFDQSxRQUFLQyxlQUFMLEdBQXVCLElBQXZCO0FBYmE7QUFjYjs7O0VBZmlDQyxvQjs7a0JBaUJwQmIsb0IiLCJmaWxlIjoiTW9kZWxTZW5zb3JSVDFFbnRpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUVudGl0eSBmcm9tICcuL0Jhc2VFbnRpdHknO1xuXG5jbGFzcyBNb2RlbFNlbnNvclJUMUVudGl0eSBleHRlbmRzIEJhc2VFbnRpdHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMudGltZSA9IG51bGw7XG5cdFx0dGhpcy5pZF9kZXZpY2UgPSBudWxsO1xuXHRcdHRoaXMuZGV2aWNlVHlwZSA9IG51bGw7XG5cdFx0dGhpcy5kYXRhTW9kZWwgPSBudWxsO1xuXHRcdHRoaXMuc29mdHdhcmVWZXJzaW9uID0gbnVsbDtcblx0XHR0aGlzLmhhcmR3YXJlVmVyc2lvbiA9IG51bGw7XG5cdFx0dGhpcy5iYXRjaE51bWJlciA9IG51bGw7XG5cdFx0dGhpcy5zZXJpYWxOdW1iZXIgPSBudWxsO1xuXHRcdHRoaXMubW9kYnVzVW5pdElEID0gbnVsbDtcblx0XHR0aGlzLnNlbnNvcjFEYXRhID0gbnVsbDtcblx0XHR0aGlzLmludGVybmFsVGVtcGVyYXR1cmUgPSBudWxsO1xuXHRcdHRoaXMuZXh0ZXJuYWxWb2x0YWdlID0gbnVsbDtcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgTW9kZWxTZW5zb3JSVDFFbnRpdHk7Il19