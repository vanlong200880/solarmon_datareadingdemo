import BaseController from './BaseController';
class BaseAbstractController extends BaseController {
  constructor() {
    super();
    if (this.constructor === BaseAbstractController) {
      // Error Type 1. Abstract class can not be constructed.
      throw new TypeError("Can not construct abstract class.");
    }
    // Check if all instance methods are implemented.
    // if (this.checkPermission === BaseAbstractController.prototype.checkPermission) {
    //   throw new TypeError("Please implement abstract method checkPermission.");
    // }
    // if (this.pageLoadAction === BaseAbstractController.prototype.pageLoadAction) {
    //     throw new TypeError("Please implement abstract method pageLoadAction.");
    //   }
  }

  /**
   * ActionForward onload page 
   * @param httprespone res
   * @param postData
   */
  pageLoadAction(res, postData){
	  throw new TypeError("Do not call abstract method pageLoadAction from child.");
  }
}
export default BaseAbstractController;