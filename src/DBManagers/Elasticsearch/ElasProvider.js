/**
 * http://usejsdoc.org/
 */
// gọi thư viện elasticsearch
var elasticsearch = require('elasticsearch');
var elas = function (config) {
};
elas.connect = function (config) {
	//  this.logger.error(config);
	this.elasClient = new elasticsearch.Client(config);
	this.logger = FLLogger.getLogger("elasticsearch.log");
}

/**
 * get array result data
 */
// elas.initPromise = function (query) {
// 	try {
// 		let self = this;
// 		return new Promise(function (resolve, reject) {
//             self.elasClient.search(query, function (error, response) {
// 				try{
// 					if (error) {
// 						reject(error);
// 						return;
// 					}
// 					var records = convertDataListObj(response);
// 					var aggregations = response.aggregations;
// 					if (null != aggregations && typeof aggregations !== 'undefined') {
// 						for (var aggs in aggregations) {
// 							var agg = aggregations[aggs];
// 							var value = agg['value'];
// 							if (null != value && typeof value !== 'undefined') {
// 								records[aggs] = value;
// 							}
// 						}
// 					}
// 					resolve(records);
// 				}catch(e){
// 					 this.logger.error(e);
// 				}
// 			});
//         })

// 	} catch (e) {
// 		 this.logger.error(e);
// 	}
// }
/**
 * get array result data
 */
elas.search = function (query, callback) {
	try {
		this.elasClient.search(query, function (error, response) {
			if (error) {
				return callback(true, error);
			}
			if (response) {
				var records = convertDataListObj(response);
				var aggregations = response.aggregations;
				if (null != aggregations && typeof aggregations !== 'undefined') {
					for (var aggs in aggregations) {
						var agg = aggregations[aggs];
						var value = agg['value'];
						if (null != value && typeof value !== 'undefined') {
							records[aggs] = value;
						}
					}
				}
				if (typeof callback === 'function') {
					callback(false, records);
				}
			} else {
				if (typeof callback === 'function') {
					callback(true, error);
				}
			}
		});
	} catch (e) {
		this.logger.error(e);
		callback(e, true);
	}
}

elas.searchAsync = async function (query) {
	try {
		var response = await this.elasClient.search(query);
		if (response) {
			var records = convertDataListObj(response);
			var aggregations = response.aggregations;
			if (null != aggregations && typeof aggregations !== 'undefined') {
				for (var aggs in aggregations) {
					var agg = aggregations[aggs];
					var value = agg['value'];
					if (null != value && typeof value !== 'undefined') {
						records[aggs] = value;
					}
				}
			}
			return records;
		} else {
			return false;
		}
	} catch (e) {
		this.logger.error(e);
		return false;
	}
}

elas.getAsync = async function (index, type, id, version) {
	try {
		let query = this.buildQueryGet(index, type, id);
		let exist = await this.elasClient.exists(query);
		if (!exist) {
			return false;
		}
		if (!Libs.isBlank(version)) {
			query.version = version;
		}
		let response = await this.elasClient.get(query);
		let data = convertDataObj(response);
		return data;
	} catch (error) {
		this.logger.error("ElasProvider.elas.getAsync:", error);
		return false;
	}
}


/**
 * get array result data
 */
// elas.searchAsync = async function (query, callback) {
// 	var initializePromise = await this.initPromise(query);
// 	 this.logger.error("initializePromise: ",initializePromise)
//     return initializePromise.data;
// }

elas.count = function (query, callback) {
	if (!callback && typeof callback !== 'function') {
		return;
	}
	try {
		this.elasClient.count(query, function (error, response) {
			if (error) {
				return callback(true, error);
			}
			if (response) {
				callback(false, response);
			} else {
				callback(true, error);
			}
		});
	} catch (e) {
		this.logger.error(e);
		callback(e, true);
	}
}

elas.countAsync = async function (query) {
	try {
		let response = await this.elasClient.count(query);
		if (response) {
			return response.count;
		}
		return 0;
	} catch (e) {
		this.logger.error("ElasProvider.elas.countAsync:", e);
		return 0;
	}
}


elas.del = function (_index, _type, _id, callBack) {
	this.elasClient.delete({ index: _index, type: _type, id: _id }, function (error, response) {
		callBack(error, response);
	});
}

elas.deleteByDocIdAsync = async function (_index, _type, _id) {
	try {
		var response = this.elasClient.delete({ index: _index, type: _type, id: _id });
		if (!response) {
			return false;
		}
		return response;
	} catch (error) {
		this.logger.error("ElasProvider.elas.deleteByDocIdAsync:", error);
		return false;
	}
}

elas.deleteByQuery = function (_index, _type, _query, callBack) {
	var body = { query: _query };
	this.elasClient.deleteByQuery({ index: _index, type: _type, body: body }, function (error, response) {
		if (typeof callback === 'function') {
			callBack(error, response);
		}
	});
}

elas.set = function (_index, _type, data, callback) {
	var record = { index: _index, type: _type, body: data };
	if (typeof data === 'object' && typeof data !== 'String') {
		var id = data['id'];
		if (id != null && typeof id !== 'undefined') {
			record.id = id;
		}
	}
	this.elasClient.index(record, function (error, response) {
		if (response) {
			if (typeof callback == 'function') {
				callback(false, response);
			}
		} else {
			if (typeof callback == 'function') {
				callback(true, error);
			}
		}
	});
}

elas.setAsync = async function (_index, _type, data, parameters) {
	try {
		var record = { index: _index, type: _type, body: data };
		if (typeof data === 'object' && typeof data !== 'String') {
			var id = data['id'];
			if (id != null && typeof id !== 'undefined') {
				record.id = id;
			}
		}
		if (parameters && Object.keys(parameters).length > 0) {
			Object.assign(record, parameters);
		}
		var response = await this.elasClient.index(record);
		return response;
	} catch (error) {
		this.logger.error("ElasProvider.setAsync:", error);
		return false;
	}
}

/**
 * Use for log event
 * @param {String} _index 
 * @param {String} _type 
 * @param {any} data 
 * @param {function} callback 
 */
elas.setIgnoreIdKey = function (_index, _type, data, callback) {
	var record = { index: _index, type: _type, body: data };
	if (typeof data === 'object' && typeof data !== 'String') {
		var key = data['key'];
		if (key != null && typeof key !== 'undefined') {
			record.id = key;
		}
	}
	this.elasClient.index(record, function (error, response) {
		if (response) {
			if (typeof callback == 'function') {
				callback(false, response);
			}
		} else {
			if (typeof callback == 'function') {
				callback(true, error);
			}
		}
	});
}
elas.setId = function (_index, _type, _id, data, callback) {
	this.elasClient.index({
		index: _index,
		type: _type,
		id: _id,
		body: data
	}, function (error, response) {
		if (response) {
			callback(false, response);
		} else {
			callback(true, error);
		}
	});
}
elas.setIdAsync = async function (_index, _type, _id, data) {
	try {
		var record = {
			index: _index,
			type: _type,
			id: _id,
			body: data
		};
		if (typeof data === 'object' && typeof data !== 'String') {
			var id = data['id'];
			if (id != null && typeof id !== 'undefined') {
				record.id = id;
			}
		}
		var response = await this.elasClient.index(record);
		return response;
	} catch (error) {
		this.logger.error("ElasProvider.setIdAsync:", error);
		return false;
	}
}
elas.buildSort = function (field, isReversed) {
	var sortField = {};
	var order = isReversed ? "desc" : "asc";
	sortField[field] = {
		"order": order
	};
	return sortField;
}

elas.buildFilterExists = function (arFields) {
	var exists = [];
	for (var field in arFields) {
		var field = { field: arFields[field] }
		var exist = { exists: field }
		exists.push(exist);
	}
	return exists;
}

elas.buildFilterMissing = function (field) {
	var missing = {};
	// must_not
	missing.missing = {
		field: field,
		existence: true,
		null_value: true
	}
	return missing;
}

elas.buildFilterMust = function (arFields) {
	var musts = [];
	for (var field in arFields) {
		var term = { [field]: arFields[field] }
		var must = { term: term }
		musts.push(must);
	}
	// for (var key in musts) {
	// 	 this.logger.error(key, ": ", musts[key]);
	// }
	return musts;
}

elas.buildFilterMatch = function (field, val) {
	var match = {};
	match[field] = val
	return { match: match };
	//	var matchs = [];
	//	for ( var field in arFields) {
	//		var match = {};
	//		match[field] = arFields[field];
	//		matchs.push(match);
	//	}
	//	return matchs;
}

/**
 * @param {string: DSL query} query 
 * @param {string: elasticsearch type} type 
 * @param {Array: string[]} fields 
 * @param {string: and | or} operator 
 */
elas.buildMultiMatch = function (query, type, fields, operator) {
	var q = {};
	q.multi_match = {
		query: query,
		type: type,
		fields: fields,
		operator: operator
	}
	return q;
}

elas.buildFilterRange = function (key, gte, lte) {
	var rangeField = {};
	var range = {};
	range[key] = {};

	if (gte) {
		range[key]["gte"] = gte;
	}
	if (lte) {
		range[key]["lte"] = lte;
	}
	rangeField["range"] = range;
	return rangeField;
}

elas.buildFilterGreater = function (key, gt) {
	var rangeField = {};
	var range = {};
	range[key] = {};


	range[key]["gt"] = gt;
	rangeField["range"] = range;
	return rangeField;
}

elas.buildFilterLess = function (key, lt) {
	var rangeField = {};
	var range = {};
	range[key] = {};


	range[key]["lt"] = lt;
	rangeField["range"] = range;
	return rangeField;
}

elas.buildQuery = function (index, type, from, filters, sorts, selectFields, getDocVersion = false, size = 20, script = null) {

	try {
		const boolQueryTypes = ["must", "filter", "should", "must_not"];
		var wrap = {
			_source: selectFields
		};
		if (!Libs.isBlank(index)) {
			wrap.index = index;
		}
		if (!Libs.isBlank(type)) {
			wrap.type = type;
		}
		if (Array.isArray(selectFields) && selectFields.length > 0) {
			wrap._source = selectFields;
		}
		if (typeof from !== 'undefined' && from != null) {
			wrap.from = from;
			wrap.size = size;
		}
		var query = {};
		query.bool = {}
		for (let key in boolQueryTypes) {
			let boolQueryType = boolQueryTypes[key];
			if (typeof filters[boolQueryType] !== 'undefined' && typeof filters[boolQueryType] !== 'undefined') {
				query.bool[boolQueryType] = filters[boolQueryType];
			}
		}
		if (Libs.isObjectEmpty(query.bool)) {

		}

		var body = {};
		if (Array.isArray(sorts) && sorts.length > 0) {
			body.sort = sorts;
		}
		if (getDocVersion === true) {
			body.version = true; // set các document đều có version
		}

		body.query = query;
		if (typeof script === 'object' && script != null) {
			body.script = script;
		}
		wrap.body = body;
		//		JSON.stringify(body);
		return wrap;
	} catch (e) {
		return false;
	}
}

elas.buildCustomBody = function (index, type, from, conditions, selectFields) {

	try {
		var wrap = {
			_source: selectFields
		};
		if (!Libs.isBlank(index)) {
			wrap.index = index;
		}
		if (!Libs.isBlank(type)) {
			wrap.type = type;
		}
		if (Array.isArray(selectFields) && selectFields.length > 0) {
			wrap._source = selectFields;
		}
		if (typeof from !== 'undefined' && from != null) {
			wrap.from = from;
			wrap.size = 20;
		}
		var query = {};
		var body = {};
		if (Libs.isObjectEmpty(query.bool)) {
			if (!Libs.isObjectEmpty(conditions)) {
				body = Object.assign({}, body, conditions);
			}
		}
		body.version = true;
		wrap.body = body;
		return wrap;
	} catch (e) {
		this.logger.error("e", e);
		return false;
	}
}

elas.buildQueryGet = function (index, type, id, selectFields) {

	try {
		var wrap = {
			// _source: selectFields
		};
		if (!Libs.isBlank(index)) {
			wrap.index = index;
		}
		if (!Libs.isBlank(type)) {
			wrap.type = type;
		}
		if (Array.isArray(selectFields) && selectFields.length > 0) {
			wrap._source = selectFields;
		}
		wrap.id = id;
		return wrap;
	} catch (e) {
		return false;
	}
}


elas.buildUpdateDoc = function (index, type, id, doc, parameters) {
	try {
		var wrap = {

		};
		if (!Libs.isBlank(index)) {
			wrap.index = index;
		}
		if (!Libs.isBlank(type)) {
			wrap.type = type;
		}

		if (!Libs.isBlank(id)) {
			wrap.id = id;
		}

		var body = {};
		body.doc = doc;
		if (parameters && Object.keys(parameters).length > 0) {
			Object.assign(wrap, parameters);
		}
		wrap.body = JSON.stringify(body);
		return wrap;
	} catch (e) {
		return false;
	}
}

elas.buildDoc = function (fields) {
	var obj = {};
	for (var field in fields) {
		obj[field] = fields[field];
	}
	return obj;
}

elas.updateByDoc = function (_index, _type, id, doc, callback) {
	var query = elas.buildUpdateDoc(_index, _type, id, doc);
	this.elasClient.update(query, function (error, response) {
		return callback(error, response);
	});
}

elas.updateByDocAsync = async function (_index, _type, id, doc, parameters) {
	try {
		var query = elas.buildUpdateDoc(_index, _type, id, doc, parameters),
			response = await this.elasClient.update(query);
		return { status: true, response: response, messeage: "" };
	} catch (error) {
		this.logger.error("ElasProvider.updateByDocAsync:", error);
		return { status: false, response: error, messeage: error.messeage };
	}
}

elas.updateByQuery = function (_index, _type, body, callback) {
	var query = elas.buildUpdateByQuery(_index, _type, body);
	this.elasClient.updateByQuery(query, function (error, response) {
		return callback(error, response);
	});
}

elas.updateByQueryAsync = async function (source) {
	try {
		return await this.elasClient.updateByQuery(source);
	} catch (error) {
		this.logger.error("ElasProvider.updateByQueryAsync:", error);
		return false;
	}
}

/**
* @param key
* @param values (mang object)
**/
elas.buildObjWithKey = function (key, values, isArrayValue) {
	var obj = {};
	if (isArrayValue) {
		obj[key] = [];
		for (var value in values) {
			obj[key].push(values[value]);
		}
	} else {
		obj[key] = values;
	}
	return obj;
}

elas.buildUpdateByQuery = function (index, type, body) {
	try {
		var wrap = {};
		if (!Libs.isBlank(index)) {
			wrap.index = index;
		}
		if (!Libs.isBlank(type)) {
			wrap.type = type;
		}
		wrap.body = body;
		return wrap;
	} catch (e) {
		return false;
	}
}
elas.get = function (index, type, id, callBack) {
	let self = this;
	var query = this.buildQueryGet(index, type, id);
	let elasFunc = function (resolve, reject) {
		self.elasClient.get(query, function (error, response) {
			try {
				if (error) {
					if (typeof callBack === 'function') {
						callBack(false, convertDataObj(response))
					} else {
						reject(error);
					}
					return;
				}
				if (typeof callBack === 'function') {
					callBack(false, convertDataObj(response))
				} else {
					resolve(convertDataObj(response));
				}
			} catch (e) {
				self.logger.error(e);
				reject(error);
			}
		});
	}
	if (typeof callback === 'function') {
		elasFunc();
		return;
	}
	return new Promise(function (resolve, reject) {
		elasFunc(resolve, reject)
	})
}

elas.bulkIndexAsync = async function (_index, _type, data) {
	try {
		var wrap = {};
		wrap.body = buildIndexBulkBody(_index, _type, data);
		var response = await this.elasClient.bulk(wrap);
		return response;
	} catch (error) {
		this.logger.error("ElasProvider.bulkIndexAsync:", error);
		return false;
	}
}

elas.bulkAsync = async function (body, parameters) {
	try {
		var wrap = {};
		wrap.body = body;
		if (parameters && Object.keys(parameters).length > 0) {
			Object.assign(wrap, parameters);
		}
		var response = await this.elasClient.bulk(wrap);
		return response;
	} catch (error) {
		this.logger.error("ElasProvider.bulkAsync:", error);
		return false;
	}
}

elas.multiSearchAsync = async function (body) {
	try {
		var response = await this.elasClient.msearch(body);

		if (response && Array.isArray(response.responses)) {
			let list = [],
				{ responses } = response;
			for (let key in responses) {
				let item = responses[key],
					records = convertDataListObj(item),
					aggregations = item.aggregations;
				if (null != aggregations && typeof aggregations !== 'undefined') {
					records["aggs"] = aggregations;
				}
				list.push(records);
			}
			return list;
		} else {
			return false;
		}
	} catch (error) {
		this.logger.error("ElasProvider.elas.multiSearchAsync:", error);
		return false;
	}
}

// elas.refreshAsync = async function () {

// }

function buildIndexBulkBody(index, type, data) {
	var body = [],
		index = { index: { _index: index, _type: type } };
	if (!Array.isArray(data)) return body;
	for (let key in data) {
		let record = data[key];
		body.push(index);
		body.push(record);
	}
	return body;
}

function convertDataObj(response) {
	var record = {};
	var source = response._source;
	for (var property in source) {
		record[property] = source[property];
	}
	record.index = response._index;
	record.type = response._type;
	record.id = response._id;
	record.documentVersion = response._version;
	return record;
}
function convertDataListObj(response) {
	var hits = response.hits;
	var buckets = [];
	var aggregations = response.aggregations;
	if (aggregations && aggregations.unique_aggs && aggregations.unique_aggs.buckets) {
		buckets = response.aggregations.unique_aggs.buckets;
	}
	var total = hits.total;
	var total_distinct = 0;
	if (aggregations && aggregations.total && aggregations.total.value) {
		total_distinct = aggregations.total.value;
	}
	var records = { total: total, data: [], data_distinct: [], total_distinct: total_distinct };
	if (buckets) {
		for (var bucket in buckets) {
			var bucketsHits = buckets[bucket];
			if (bucketsHits) {
				var bukdata = bucketsHits.bukdata;
				if (!bukdata) break;
				var hits_buk = bukdata.hits;
				for (var hit in hits_buk.hits) {
					var obj = hits_buk.hits[hit];
					var record = {};
					var source = obj._source;
					record.index = hit._index;
					record.type = obj._type;
					record.id = obj._id;
					record.doc_id = obj._id;
					for (var property in source) {
						record[property] = source[property];
					}
					records.data_distinct.push(record);
				}
			}
		}

	}
	for (var hit in hits.hits) {
		var obj = hits.hits[hit];
		var record = {};
		var source = obj._source;
		record.documentVersion = (obj._version) ? obj._version : null;
		for (var property in source) {
			record[property] = source[property];
		}
		record.index = hit._index;
		record.type = obj._type;
		record.id = obj._id;
		record.doc_id = obj._id;
		records.data.push(record);
	}
	return records;
}
elas.buildQueryAggs = function (index, type, from, filters, sorts, selectFields, aggsFilter = "", getVersion = false) {

	try {
		const boolQueryTypes = ["must", "filter", "should", "must_not"];
		var wrap = {
			_source: selectFields
		};
		if (!Libs.isBlank(index)) {
			wrap.index = index;
		}
		if (!Libs.isBlank(type)) {
			wrap.type = type;
		}
		if (Array.isArray(selectFields) && selectFields.length > 0) {
			wrap._source = selectFields;
		}
		if (typeof from !== 'undefined' && from != null) {
			wrap.from = from;
			wrap.size = 20;
		}
		var query = {};
		query.bool = {}
		for (let key in boolQueryTypes) {
			let boolQueryType = boolQueryTypes[key];
			if (typeof filters[boolQueryType] !== 'undefined' && typeof filters[boolQueryType] !== 'undefined') {
				query.bool[boolQueryType] = filters[boolQueryType];
			}
		}
		if (Libs.isObjectEmpty(query.bool)) {

		}

		var body = {};
		if (Array.isArray(sorts) && sorts.length > 0) {
			body.sort = sorts;
		}
		if (getVersion === true) {
			body.version = true;
		}
		body.query = query;
		if (!Libs.isBlank(aggsFilter)) {
			body.aggs = {
				"unique_aggs": {
					"terms": {
						"field": aggsFilter,
						"size": 100
					},
					"aggs": {
						"bukdata": {
							"top_hits": {
								"size": 1,
								"sort": [
									{
										"created_date": {
											"order": "desc"
										}
									}
								]
							}
						}
					}
				},
				"total": {
					"cardinality": {
						"field": aggsFilter
					}
				}
			}
		}
		wrap.body = body;
		//		JSON.stringify(body);
		return wrap;
	} catch (e) {
		return false;
	}
}
module.exports = elas;
