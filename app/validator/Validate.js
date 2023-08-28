'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseValidate2 = require('./BaseValidate');

var _BaseValidate3 = _interopRequireDefault(_BaseValidate2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CurrencyValidate = function (_BaseValidate) {
    _inherits(CurrencyValidate, _BaseValidate);

    function CurrencyValidate() {
        _classCallCheck(this, CurrencyValidate);

        return _possibleConstructorReturn(this, (CurrencyValidate.__proto__ || Object.getPrototypeOf(CurrencyValidate)).call(this));
    }

    _createClass(CurrencyValidate, [{
        key: 'setRule',
        value: function setRule() {}
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({});
        }
    }]);

    return CurrencyValidate;
}(_BaseValidate3.default);

exports.default = CurrencyValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvVmFsaWRhdGUuanMiXSwibmFtZXMiOlsiQ3VycmVuY3lWYWxpZGF0ZSIsInYiLCJzZXRBbGlhcyIsIkJhc2VWYWxpZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLGdCOzs7QUFDRixnQ0FBYztBQUFBOztBQUFBO0FBRWI7Ozs7a0NBQ1MsQ0FFVDs7O21DQUNVO0FBQ1AsaUJBQUtDLENBQUwsQ0FBT0MsUUFBUCxDQUFnQixFQUFoQjtBQUVIOzs7O0VBVjBCQyxzQjs7a0JBWWhCSCxnQiIsImZpbGUiOiJWYWxpZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlVmFsaWRhdGUgZnJvbSAnLi9CYXNlVmFsaWRhdGUnO1xuY2xhc3MgQ3VycmVuY3lWYWxpZGF0ZSBleHRlbmRzIEJhc2VWYWxpZGF0ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHNldFJ1bGUoKSB7XG5cbiAgICB9XG4gICAgc2V0QWxpYXMoKSB7XG4gICAgICAgIHRoaXMudi5zZXRBbGlhcyh7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEN1cnJlbmN5VmFsaWRhdGU7Il19