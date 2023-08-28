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

var ModelEmeterGelexEmicME41Entity = function (_BaseEntity) {
	_inherits(ModelEmeterGelexEmicME41Entity, _BaseEntity);

	function ModelEmeterGelexEmicME41Entity() {
		_classCallCheck(this, ModelEmeterGelexEmicME41Entity);

		var _this = _possibleConstructorReturn(this, (ModelEmeterGelexEmicME41Entity.__proto__ || Object.getPrototypeOf(ModelEmeterGelexEmicME41Entity)).call(this));

		_this.time = null;
		_this.id_device = null;
		_this.activeEnergy = null;
		_this.activeEnergyExport = null;
		_this.activeEnergyExportRate1 = null;
		_this.activeEnergyExportRate2 = null;
		_this.activeEnergyExportRate3 = null;
		_this.activeEnergyImport = null;
		_this.activeEnergyImportRate1 = null;
		_this.activeEnergyImportRate2 = null;
		_this.activeEnergyImportRate3 = null;
		_this.reactiveEnergyExport = null;
		_this.reactiveEnergyImport = null;
		_this.voltagePhaseA = null;
		_this.voltagePhaseB = null;
		_this.voltagePhaseC = null;
		_this.currentPhaseA = null;
		_this.currentPhaseB = null;
		_this.currentPhaseC = null;
		_this.powerFactor = null;
		_this.activePower = null;
		return _this;
	}

	return ModelEmeterGelexEmicME41Entity;
}(_BaseEntity3.default);

exports.default = ModelEmeterGelexEmicME41Entity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9Nb2RlbEVtZXRlckdlbGV4RW1pY01FNDFFbnRpdHkuanMiXSwibmFtZXMiOlsiTW9kZWxFbWV0ZXJHZWxleEVtaWNNRTQxRW50aXR5IiwidGltZSIsImlkX2RldmljZSIsImFjdGl2ZUVuZXJneSIsImFjdGl2ZUVuZXJneUV4cG9ydCIsImFjdGl2ZUVuZXJneUV4cG9ydFJhdGUxIiwiYWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTIiLCJhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMyIsImFjdGl2ZUVuZXJneUltcG9ydCIsImFjdGl2ZUVuZXJneUltcG9ydFJhdGUxIiwiYWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTIiLCJhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMyIsInJlYWN0aXZlRW5lcmd5RXhwb3J0IiwicmVhY3RpdmVFbmVyZ3lJbXBvcnQiLCJ2b2x0YWdlUGhhc2VBIiwidm9sdGFnZVBoYXNlQiIsInZvbHRhZ2VQaGFzZUMiLCJjdXJyZW50UGhhc2VBIiwiY3VycmVudFBoYXNlQiIsImN1cnJlbnRQaGFzZUMiLCJwb3dlckZhY3RvciIsImFjdGl2ZVBvd2VyIiwiQmFzZUVudGl0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUVNQSw4Qjs7O0FBQ0wsMkNBQWM7QUFBQTs7QUFBQTs7QUFFYixRQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLFFBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0Msa0JBQUwsR0FBMEIsSUFBMUI7QUFDQSxRQUFLQyx1QkFBTCxHQUErQixJQUEvQjtBQUNBLFFBQUtDLHVCQUFMLEdBQStCLElBQS9CO0FBQ0EsUUFBS0MsdUJBQUwsR0FBK0IsSUFBL0I7QUFDQSxRQUFLQyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFFBQUtDLHVCQUFMLEdBQStCLElBQS9CO0FBQ0EsUUFBS0MsdUJBQUwsR0FBK0IsSUFBL0I7QUFDQSxRQUFLQyx1QkFBTCxHQUErQixJQUEvQjtBQUNBLFFBQUtDLG9CQUFMLEdBQTRCLElBQTVCO0FBQ0EsUUFBS0Msb0JBQUwsR0FBNEIsSUFBNUI7QUFDQSxRQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxRQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxRQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsUUFBS0MsV0FBTCxHQUFtQixJQUFuQjtBQXRCYTtBQXVCYjs7O0VBeEIyQ0Msb0I7O2tCQTBCOUJ0Qiw4QiIsImZpbGUiOiJNb2RlbEVtZXRlckdlbGV4RW1pY01FNDFFbnRpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUVudGl0eSBmcm9tICcuL0Jhc2VFbnRpdHknO1xuXG5jbGFzcyBNb2RlbEVtZXRlckdlbGV4RW1pY01FNDFFbnRpdHkgZXh0ZW5kcyBCYXNlRW50aXR5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnRpbWUgPSBudWxsO1xuXHRcdHRoaXMuaWRfZGV2aWNlID0gbnVsbDtcblx0XHR0aGlzLmFjdGl2ZUVuZXJneSA9IG51bGw7XG5cdFx0dGhpcy5hY3RpdmVFbmVyZ3lFeHBvcnQgPSBudWxsO1xuXHRcdHRoaXMuYWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTEgPSBudWxsO1xuXHRcdHRoaXMuYWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTIgPSBudWxsO1xuXHRcdHRoaXMuYWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTMgPSBudWxsO1xuXHRcdHRoaXMuYWN0aXZlRW5lcmd5SW1wb3J0ID0gbnVsbDtcblx0XHR0aGlzLmFjdGl2ZUVuZXJneUltcG9ydFJhdGUxID0gbnVsbDtcblx0XHR0aGlzLmFjdGl2ZUVuZXJneUltcG9ydFJhdGUyID0gbnVsbDtcblx0XHR0aGlzLmFjdGl2ZUVuZXJneUltcG9ydFJhdGUzID0gbnVsbDtcblx0XHR0aGlzLnJlYWN0aXZlRW5lcmd5RXhwb3J0ID0gbnVsbDtcblx0XHR0aGlzLnJlYWN0aXZlRW5lcmd5SW1wb3J0ID0gbnVsbDtcblx0XHR0aGlzLnZvbHRhZ2VQaGFzZUEgPSBudWxsO1xuXHRcdHRoaXMudm9sdGFnZVBoYXNlQiA9IG51bGw7XG5cdFx0dGhpcy52b2x0YWdlUGhhc2VDID0gbnVsbDtcblx0XHR0aGlzLmN1cnJlbnRQaGFzZUEgPSBudWxsO1xuXHRcdHRoaXMuY3VycmVudFBoYXNlQiA9IG51bGw7XG5cdFx0dGhpcy5jdXJyZW50UGhhc2VDID0gbnVsbDtcblx0XHR0aGlzLnBvd2VyRmFjdG9yID0gbnVsbDtcblx0XHR0aGlzLmFjdGl2ZVBvd2VyID0gbnVsbDtcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgTW9kZWxFbWV0ZXJHZWxleEVtaWNNRTQxRW50aXR5OyJdfQ==