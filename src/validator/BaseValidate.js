import Validation from './libs/validation';
class BaseValidate {
    constructor() {
        // Check if all instance methods are implemented.
        if (this.setRule === BaseValidate.prototype.setRule) {
            throw new TypeError("Please implement abstract method setRule.");
        }
        if (this.setAlias === BaseValidate.prototype.setAlias) {
            throw new TypeError("Please implement abstract method setAlias.");
        }
        this.v = new Validation();

    }
    validationAll(data, callBack) {
        try {
            // data = Libs.convertEmptyPropToNullProp(data);
            this.setAlias();
            this.setRule();
            let self = this
            return new Promise(function (resolve, reject) {
                self.v.validateAll(data, function (err, path) {
                    if (callBack && typeof (callBack) === 'function') {
                        callBack(err, path);
                        return;
                    }
                    if (err) {
                        resolve(err.message);
                    } else {
                        resolve(path);
                    }
                });
            });
        } catch (e) {
            console.log(e);
            callBack(e)
        }

    }

    /**
     * @description validate a field 
     * @author thanh.bay
     * @since 07/09/2018
     * @param {*} data 
     * @param {*} path 
     * @param {*} callBack 
     */
    validateOne(data, path, callBack) {
        this.setAlias();
        this.setRule();
        let self = this
        return new Promise(function (resolve, reject) {
            self.v.validateOne(data, path, function (err, rPath) {
                if (typeof (callBack) != "undefined" && typeof (callBack) === 'function') {
                    callBack(err, path);
                }
                if (err) {
                    resolve({ [path]: err.message });
                } else {
                    resolve({ [path]: null });
                }
            });
        });
    }

    /**
     * @description validate all data at the same time
     * @author thanh.bay
     * @since 06/09/2018
     * @param {*} data 
     */
    FLValidationAll(data, callBack) {
        try {
            // data = Libs.convertEmptyPropToNullProp(data);
            this.setAlias();
            this.setRule();
            let self = this
            return new Promise(function (resolve, reject) {
                self.v.FLValidateAll(data, function (errs) {
                    if (typeof (callBack) != "undefined" && typeof (callBack) === 'function') {
                        if (Object.keys(errs).length > 0) {
                            var count = 0;
                            for (let key in errs) {
                                let message = errs[key];
                                if (message == null) {
                                    count++;
                                }
                            }
                            if (count == Object.keys(errs).length) {
                                callBack(null);
                            } else {
                                callBack(errs);
                            }
                        } else {
                            callBack(null);
                        }
                    }
                    if (Object.keys(errs).length > 0) {
                        var count = 0;
                        for (let key in errs) {
                            let message = errs[key];
                            if (message == null) {
                                count++;
                            }
                        }
                        if (count == Object.keys(errs).length) {
                            resolve(null);
                        } else {
                            resolve(errs);
                        }
                    } else {
                        resolve(null);
                    }
                });
            });
        } catch (e) {
            console.log(e);
            callBack(e)
        }
    }

    setRule() {

    }
    setAlias() {

    }
    /**
     * @author khanh.le
     * @since 04-07-2018
     * @param {field name} field_name 
     * @param {rule name} rule_name 
     * @param {rule value } rule_value 
     * @param {key message} key_msg 
     */
    addRuleForField(field_name, rule_name, rule_value, key_msg) {
        this.v.addRule(field_name, rule_name, rule_value);
        if (key_msg != '') {
            this.v.setMsg(field_name, rule_name, key_msg);
        }
    }
}
export default BaseValidate;