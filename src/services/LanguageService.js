import BaseService from './BaseService';
class LanguageService extends BaseService {
	constructor() {
		super();

	}

	/**
     * @description Get list
     * @author Long.Pham
     * @since 30/07/2019
     * @param {Object Language} data
     * @param {function callback} callback 
     */
	getList(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
				data.max_record = Constants.data.max_record;
			}
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Language.getList", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}
}
export default LanguageService;
