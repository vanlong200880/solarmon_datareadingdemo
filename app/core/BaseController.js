"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseController = function BaseController() {
  _classCallCheck(this, BaseController);

  this.logger = FLLogger.getLogger(this.constructor.name);
  // Check if all instance methods are implemented.
  // if (this.checkPermission === BaseAbstractController.prototype.checkPermission) {
  //   throw new TypeError("Please implement abstract method checkPermission.");
  // }
  // if (this.pageLoadAction === BaseAbstractController.prototype.pageLoadAction) {
  //     throw new TypeError("Please implement abstract method pageLoadAction.");
  //   }
}

// verifyToken(req, res, next) {
//   var token = req.headers['x-access-token'];
//   if (!token)
//     return res.status(403).send({ auth: false, message: 'No token provided.' });
//   jwt.verify(token, config.secret, function(err, decoded) {
//     if (err)
//     return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//     // if everything good, save to request for use in other routes
//     req.userId = decoded.id;
//     next();
//   });
// }
// checkPermission(action) {
//   if (this.userE == null) {
//     return false;
//   }
//   let permission = this.userE.permissions;
//   if (permission == null) {
//     return false;
//   }
//   let auth = permission[this.pathReferer];
//   return Libs.checkBitOnOff(auth, action);
// }

;

exports.default = BaseController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL0Jhc2VDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkJhc2VDb250cm9sbGVyIiwibG9nZ2VyIiwiRkxMb2dnZXIiLCJnZXRMb2dnZXIiLCJjb25zdHJ1Y3RvciIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQU1BLGMsR0FDSiwwQkFBYztBQUFBOztBQUNaLE9BQUtDLE1BQUwsR0FBY0MsU0FBU0MsU0FBVCxDQUFtQixLQUFLQyxXQUFMLENBQWlCQyxJQUFwQyxDQUFkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O2tCQUdhTCxjIiwiZmlsZSI6IkJhc2VDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQmFzZUNvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmxvZ2dlciA9IEZMTG9nZ2VyLmdldExvZ2dlcih0aGlzLmNvbnN0cnVjdG9yLm5hbWUpO1xuICAgIC8vIENoZWNrIGlmIGFsbCBpbnN0YW5jZSBtZXRob2RzIGFyZSBpbXBsZW1lbnRlZC5cbiAgICAvLyBpZiAodGhpcy5jaGVja1Blcm1pc3Npb24gPT09IEJhc2VBYnN0cmFjdENvbnRyb2xsZXIucHJvdG90eXBlLmNoZWNrUGVybWlzc2lvbikge1xuICAgIC8vICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlBsZWFzZSBpbXBsZW1lbnQgYWJzdHJhY3QgbWV0aG9kIGNoZWNrUGVybWlzc2lvbi5cIik7XG4gICAgLy8gfVxuICAgIC8vIGlmICh0aGlzLnBhZ2VMb2FkQWN0aW9uID09PSBCYXNlQWJzdHJhY3RDb250cm9sbGVyLnByb3RvdHlwZS5wYWdlTG9hZEFjdGlvbikge1xuICAgIC8vICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGxlYXNlIGltcGxlbWVudCBhYnN0cmFjdCBtZXRob2QgcGFnZUxvYWRBY3Rpb24uXCIpO1xuICAgIC8vICAgfVxuICB9XG5cbiAgLy8gdmVyaWZ5VG9rZW4ocmVxLCByZXMsIG5leHQpIHtcbiAgLy8gICB2YXIgdG9rZW4gPSByZXEuaGVhZGVyc1sneC1hY2Nlc3MtdG9rZW4nXTtcbiAgLy8gICBpZiAoIXRva2VuKVxuICAvLyAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHsgYXV0aDogZmFsc2UsIG1lc3NhZ2U6ICdObyB0b2tlbiBwcm92aWRlZC4nIH0pO1xuICAvLyAgIGp3dC52ZXJpZnkodG9rZW4sIGNvbmZpZy5zZWNyZXQsIGZ1bmN0aW9uKGVyciwgZGVjb2RlZCkge1xuICAvLyAgICAgaWYgKGVycilcbiAgLy8gICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuc2VuZCh7IGF1dGg6IGZhbHNlLCBtZXNzYWdlOiAnRmFpbGVkIHRvIGF1dGhlbnRpY2F0ZSB0b2tlbi4nIH0pO1xuICAvLyAgICAgLy8gaWYgZXZlcnl0aGluZyBnb29kLCBzYXZlIHRvIHJlcXVlc3QgZm9yIHVzZSBpbiBvdGhlciByb3V0ZXNcbiAgLy8gICAgIHJlcS51c2VySWQgPSBkZWNvZGVkLmlkO1xuICAvLyAgICAgbmV4dCgpO1xuICAvLyAgIH0pO1xuICAvLyB9XG4gIC8vIGNoZWNrUGVybWlzc2lvbihhY3Rpb24pIHtcbiAgLy8gICBpZiAodGhpcy51c2VyRSA9PSBudWxsKSB7XG4gIC8vICAgICByZXR1cm4gZmFsc2U7XG4gIC8vICAgfVxuICAvLyAgIGxldCBwZXJtaXNzaW9uID0gdGhpcy51c2VyRS5wZXJtaXNzaW9ucztcbiAgLy8gICBpZiAocGVybWlzc2lvbiA9PSBudWxsKSB7XG4gIC8vICAgICByZXR1cm4gZmFsc2U7XG4gIC8vICAgfVxuICAvLyAgIGxldCBhdXRoID0gcGVybWlzc2lvblt0aGlzLnBhdGhSZWZlcmVyXTtcbiAgLy8gICByZXR1cm4gTGlicy5jaGVja0JpdE9uT2ZmKGF1dGgsIGFjdGlvbik7XG4gIC8vIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgQmFzZUNvbnRyb2xsZXI7Il19