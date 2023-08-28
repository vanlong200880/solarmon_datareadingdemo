class BaseController {
  constructor() {
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

}
export default BaseController;