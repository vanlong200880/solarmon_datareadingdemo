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

var AuthValidate = function (_BaseValidate) {
    _inherits(AuthValidate, _BaseValidate);

    function AuthValidate() {
        _classCallCheck(this, AuthValidate);

        return _possibleConstructorReturn(this, (AuthValidate.__proto__ || Object.getPrototypeOf(AuthValidate)).call(this));
    }

    _createClass(AuthValidate, [{
        key: 'setRule',
        value: function setRule() {
            this.addRuleForField('email', 'trim', true);
            this.addRuleForField('email', 'required', false, i18n.__('required'));
            this.addRuleForField('email', 'type', 'email', i18n.__('type_email'));
            this.addRuleForField('email', 'maxLength', 100, i18n.__('maxLength_input'));

            this.addRuleForField('id_company', 'trim', true);
            this.addRuleForField('id_company', 'required', false, i18n.__('required'));
            this.addRuleForField('id_company', 'maxLength', 100, i18n.__('maxLength_input'));

            this.v.addRule('password', 'trim', true);
            this.v.addRule('password', 'required', true);
            this.v.setMsg('password', 'required', i18n.__('required'));
            this.v.addRule('password', 'minLength', 3);
            this.v.setMsg('password', 'minLength', i18n.__('minLength_input'));
        }
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({
                email: i18n.__('email'),
                password: i18n.__('password'),
                id_company: i18n.__('id_company')
            });
        }
    }]);

    return AuthValidate;
}(_BaseValidate3.default);

exports.default = AuthValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvQXV0aFZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbIkF1dGhWYWxpZGF0ZSIsImFkZFJ1bGVGb3JGaWVsZCIsImkxOG4iLCJfXyIsInYiLCJhZGRSdWxlIiwic2V0TXNnIiwic2V0QWxpYXMiLCJlbWFpbCIsInBhc3N3b3JkIiwiaWRfY29tcGFueSIsIkJhc2VWYWxpZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLFk7OztBQUNGLDRCQUFhO0FBQUE7O0FBQUE7QUFFWjs7OztrQ0FDUTtBQUNMLGlCQUFLQyxlQUFMLENBQXFCLE9BQXJCLEVBQThCLE1BQTlCLEVBQXNDLElBQXRDO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsVUFBOUIsRUFBMEMsS0FBMUMsRUFBaURDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQWpEO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsTUFBOUIsRUFBc0MsT0FBdEMsRUFBK0NDLEtBQUtDLEVBQUwsQ0FBUSxZQUFSLENBQS9DO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsV0FBOUIsRUFBMkMsR0FBM0MsRUFBZ0RDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUFoRDs7QUFHQSxpQkFBS0YsZUFBTCxDQUFxQixZQUFyQixFQUFtQyxNQUFuQyxFQUEyQyxJQUEzQztBQUNBLGlCQUFLQSxlQUFMLENBQXFCLFlBQXJCLEVBQW1DLFVBQW5DLEVBQStDLEtBQS9DLEVBQXNEQyxLQUFLQyxFQUFMLENBQVEsVUFBUixDQUF0RDtBQUNBLGlCQUFLRixlQUFMLENBQXFCLFlBQXJCLEVBQW1DLFdBQW5DLEVBQWdELEdBQWhELEVBQXFEQyxLQUFLQyxFQUFMLENBQVEsaUJBQVIsQ0FBckQ7O0FBR0EsaUJBQUtDLENBQUwsQ0FBT0MsT0FBUCxDQUFlLFVBQWYsRUFBMkIsTUFBM0IsRUFBbUMsSUFBbkM7QUFDQSxpQkFBS0QsQ0FBTCxDQUFPQyxPQUFQLENBQWUsVUFBZixFQUEyQixVQUEzQixFQUF1QyxJQUF2QztBQUNBLGlCQUFLRCxDQUFMLENBQU9FLE1BQVAsQ0FBYyxVQUFkLEVBQTBCLFVBQTFCLEVBQXNDSixLQUFLQyxFQUFMLENBQVEsVUFBUixDQUF0QztBQUNBLGlCQUFLQyxDQUFMLENBQU9DLE9BQVAsQ0FBZSxVQUFmLEVBQTJCLFdBQTNCLEVBQXdDLENBQXhDO0FBQ0EsaUJBQUtELENBQUwsQ0FBT0UsTUFBUCxDQUFjLFVBQWQsRUFBMEIsV0FBMUIsRUFBdUNKLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUF2QztBQUNIOzs7bUNBQ1M7QUFDTixpQkFBS0MsQ0FBTCxDQUFPRyxRQUFQLENBQWdCO0FBQ1pDLHVCQUFPTixLQUFLQyxFQUFMLENBQVEsT0FBUixDQURLO0FBRVpNLDBCQUFVUCxLQUFLQyxFQUFMLENBQVEsVUFBUixDQUZFO0FBR1pPLDRCQUFZUixLQUFLQyxFQUFMLENBQVEsWUFBUjtBQUhBLGFBQWhCO0FBS0g7Ozs7RUE1QnNCUSxzQjs7a0JBOEJaWCxZIiwiZmlsZSI6IkF1dGhWYWxpZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlVmFsaWRhdGUgZnJvbSAnLi9CYXNlVmFsaWRhdGUnO1xuY2xhc3MgQXV0aFZhbGlkYXRlIGV4dGVuZHMgQmFzZVZhbGlkYXRle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHNldFJ1bGUoKXtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2VtYWlsJywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2VtYWlsJywgJ3JlcXVpcmVkJywgZmFsc2UsIGkxOG4uX18oJ3JlcXVpcmVkJykpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnZW1haWwnLCAndHlwZScsICdlbWFpbCcsIGkxOG4uX18oJ3R5cGVfZW1haWwnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdlbWFpbCcsICdtYXhMZW5ndGgnLCAxMDAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcblxuXG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpZF9jb21wYW55JywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2lkX2NvbXBhbnknLCAncmVxdWlyZWQnLCBmYWxzZSwgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpZF9jb21wYW55JywgJ21heExlbmd0aCcsIDEwMCwgaTE4bi5fXygnbWF4TGVuZ3RoX2lucHV0JykpO1xuXG4gICAgICAgIFxuICAgICAgICB0aGlzLnYuYWRkUnVsZSgncGFzc3dvcmQnLCAndHJpbScsIHRydWUpO1xuICAgICAgICB0aGlzLnYuYWRkUnVsZSgncGFzc3dvcmQnLCAncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgdGhpcy52LnNldE1zZygncGFzc3dvcmQnLCAncmVxdWlyZWQnLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy52LmFkZFJ1bGUoJ3Bhc3N3b3JkJywgJ21pbkxlbmd0aCcsIDMpO1xuICAgICAgICB0aGlzLnYuc2V0TXNnKCdwYXNzd29yZCcsICdtaW5MZW5ndGgnLCBpMThuLl9fKCdtaW5MZW5ndGhfaW5wdXQnKSk7XG4gICAgfVxuICAgIHNldEFsaWFzKCl7XG4gICAgICAgIHRoaXMudi5zZXRBbGlhcyh7XG4gICAgICAgICAgICBlbWFpbDogaTE4bi5fXygnZW1haWwnKSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBpMThuLl9fKCdwYXNzd29yZCcpLFxuICAgICAgICAgICAgaWRfY29tcGFueTogaTE4bi5fXygnaWRfY29tcGFueScpXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEF1dGhWYWxpZGF0ZTsiXX0=