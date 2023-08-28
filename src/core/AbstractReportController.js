import BaseAbstractController from "./BaseAbstractController";
class AbstractReportController extends BaseAbstractController {
	constructor() {
		super();
		if (this.constructor === AbstractReportController) {
			throw new TypeError("Can not construct abstract class.");
		}
		if (this.getList === AbstractReportController.prototype.getList) {
			throw new TypeError("Please implement abstract method getList.");
		}

		if (this.printAction === AbstractReportController.prototype.printAction) {
			throw new TypeError("Please implement abstract method printAction.");
		}

		if (this.exportExcel === AbstractReportController.prototype.exportExcel) {
			throw new TypeError("Please implement abstract method getList.");
		}

		if (this.exportPdf === AbstractReportController.prototype.exportPdf) {
			throw new TypeError("Please implement abstract method getList.");
		}

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
	checkPermission(action) {
		if (this.userE == null) {
			console.log("null user")
		  return false;
		}
		let permission = this.userE.permissions;
		if (permission == null) {
			console.log("null permission")
		  return false;
		}
		let auth = permission[this.pathReferer];
		//console.log("auth: ",auth)
		return Libs.checkBitOnOff(auth, action);
	}
	checkPermissions(method,postData){
		if(Libs.isBlank(method)){
			return false;
		}
		switch(method){
			case "exportPdf":
				return this.checkPermission(Constants.auth_mode.PDF);
			case "exportExcel":
				return this.checkPermission(Constants.auth_mode.EXCEL);
			case "printAction":
				return this.checkPermission(Constants.auth_mode.PRINT);
			default:
				return true;
		}
	}
}
export default AbstractReportController;