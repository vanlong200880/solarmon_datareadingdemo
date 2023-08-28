import BaseAbstractController from "./BaseAbstractController";
class AbstractManagerController extends BaseAbstractController {
	constructor() {
		super();
		if (this.constructor === AbstractManagerController) {
			// Error Type 1. Abstract class can not be constructed.
			throw new TypeError("Can not construct abstract class.");
		}
		// else (called from child)
		// Check if all instance methods are implemented.
		if (this.deleteAction === AbstractManagerController.prototype.deleteAction) {
			// Error Type 4. Child has not implemented this abstract method.
			throw new TypeError("Please implement abstract method deleteAction.");
		}
		if (this.saveAction === AbstractManagerController.prototype.saveAction) {
			// Error Type 4. Child has not implemented this abstract method.
			throw new TypeError("Please implement abstract method saveAction.");
		}

		if (this.getList === AbstractManagerController.prototype.getList) {
			// Error Type 4. Child has not implemented this abstract method.
			throw new TypeError("Please implement abstract method getList.");
		}

		if (this.getDetail === AbstractManagerController.prototype.getDetail) {
			// Error Type 4. Child has not implemented this abstract method.
			throw new TypeError("Please implement abstract method getDetail.");
		}
	}
	validate() {

	}

	/**
	 * ActionForward deleteAction
	 * @param httprespone res
	 * @param postData
	 */
	deleteAction(res, postData) {
		throw new TypeError("Do not call abstract method deleteAction from child.");
	}
	/**
	   * ActionForward saveAction
	   * @param httprespone res
	   * @param postData
	   */
	saveAction(res, postData) {
		throw new TypeError("Do not call abstract method saveAction from child.");
	}

	/**
	 * ActionForward printAction
	 * @param httprespone res
	 * @param postData
	 */
	printAction(res, postData) {
		throw new TypeError("Do not call abstract method printAction from child.");
	}
	/**
	 * ActionForward exportExcel
	 * @param httprespone res
	 * @param postData
	 */
	exportExcel(res, postData) {
		throw new TypeError("Do not call abstract method exportExcel from child.");
	}
	/**
	 * ActionForward exportPdf
	 * @param httprespone res
	 * @param postData
	 */
	exportPdf(res, postData) {
		throw new TypeError("Do not call abstract method exportPdf from child.");
	}
	/**
	   * function getList
	   * @param objE
	   */
	getList(objE) {
		throw new TypeError("Do not call abstract method getList from child.");
	}
	/**
	   * function getDetail
	   * @param objE
	   */
	getDetail(objE) {
		throw new TypeError("Do not call abstract method getObject from child.");
	}
	checkPermission(action) {
		try {
			if (this.userE == null) {
				return false;
			}
			let permission = JSON.parse(this.userE.permissions.permissions);

			if (permission == null) {
				return false;
			}

			var pathReferer = this.pathReferer;
			var projectPath = this.pathReferer.substr(0, 9);
			if(projectPath === '/project/'){
				pathReferer = projectPath + ":id";
			} else if(projectPath === '/private/'){
				pathReferer = projectPath + ":id";
			}
			
			let auth = permission[pathReferer];
			return Libs.checkBitOnOff(auth.auth, action);
		} catch (e) {
			return false;
		}
	}
	checkPermissions(method, postData) {
		if (Libs.isBlank(method)) {
			return false;
		}
		switch (method) {
			case "exportPdf":
				return this.checkPermission(Constants.auth_mode.PDF);
			case "exportExcel":
				return this.checkPermission(Constants.auth_mode.EXCEL);
			case "printAction":
				return this.checkPermission(Constants.auth_mode.PRINT);
			// case "deleteAction":
			// 	return this.checkPermission(Constants.auth_mode.DEL);
			// case "saveAction":
			// console.log("postData.screen_mode: ", postData.screen_mode)
			// 	if (postData.hasOwnProperty('screen_mode') && postData.screen_mode == Constants.screen_mode.insert) {
			// 		return this.checkPermission(Constants.auth_mode.NEW);
			// 	}else if(postData.hasOwnProperty('screen_mode') && postData.screen_mode == Constants.screen_mode.update){
			// 		return this.checkPermission(Constants.auth_mode.EDIT);
			// 	}else{
			// 		return false;
			// 	}
			default:
				return true;
		}
	}
}
export default AbstractManagerController;