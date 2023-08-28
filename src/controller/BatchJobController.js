import BaseController from '../core/BaseController';
import BatchJobService from '../services/BatchJobService';

class BatchJobController extends BaseController {
    constructor() {
        super();
    }


    /**
     * @description run batch job no communication
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    runNoCommunication(res, postData) {
        try {
            var service = new BatchJobService();
            service.runNoCommunication({}, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                }
                res.send(resData);
            });
        } catch (e) {
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }


    
    /**
     * @description run batch job reset energy today
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
     resetTodayEnergy(res, postData) {
        try {
            var service = new BatchJobService();
            service.resetTodayEnergy({}, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                }
                res.send(resData);
            });
        } catch (e) {
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }


    /**
     * @description run batch job reset power now
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
     resetPowerNow(res, postData) {
        try {
            var service = new BatchJobService();
            service.resetPowerNow({}, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                }
                res.send(resData);
            });
        } catch (e) {
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }


    
    /**
     * @description run batch job reset power now
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
     updatedDevicePlant(res, postData) {
        try {
            var service = new BatchJobService();
            service.updatedDevicePlant({}, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                }
                res.send(resData);
            });
        } catch (e) {
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }

    /**
     * @description Get detail item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    getDetail(res, postData) {

    }




    /**
     * @description Save action
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    async saveAction(res, postData) {

    }



    /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getList(res, postData) {


    }


    /**
     * @description Delete item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    deleteAction(res, postData) {

    }


}
export default BatchJobController;