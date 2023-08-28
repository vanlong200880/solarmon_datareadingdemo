'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * http://usejsdoc.org/
 */
// gọi thư viện elasticsearch
var elasticsearch = require('elasticsearch');
var elas = function elas(config) {};
elas.connect = function (config) {
	//  this.logger.error(config);
	this.elasClient = new elasticsearch.Client(config);
	this.logger = FLLogger.getLogger("elasticsearch.log");
};

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
};

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
};

elas.getAsync = async function (index, type, id, version) {
	try {
		var query = this.buildQueryGet(index, type, id);
		var exist = await this.elasClient.exists(query);
		if (!exist) {
			return false;
		}
		if (!Libs.isBlank(version)) {
			query.version = version;
		}
		var response = await this.elasClient.get(query);
		var data = convertDataObj(response);
		return data;
	} catch (error) {
		this.logger.error("ElasProvider.elas.getAsync:", error);
		return false;
	}
};

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
};

elas.countAsync = async function (query) {
	try {
		var response = await this.elasClient.count(query);
		if (response) {
			return response.count;
		}
		return 0;
	} catch (e) {
		this.logger.error("ElasProvider.elas.countAsync:", e);
		return 0;
	}
};

elas.del = function (_index, _type, _id, callBack) {
	this.elasClient.delete({ index: _index, type: _type, id: _id }, function (error, response) {
		callBack(error, response);
	});
};

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
};

elas.deleteByQuery = function (_index, _type, _query, callBack) {
	var body = { query: _query };
	this.elasClient.deleteByQuery({ index: _index, type: _type, body: body }, function (error, response) {
		if (typeof callback === 'function') {
			callBack(error, response);
		}
	});
};

elas.set = function (_index, _type, data, callback) {
	var record = { index: _index, type: _type, body: data };
	if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && typeof data !== 'String') {
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
};

elas.setAsync = async function (_index, _type, data, parameters) {
	try {
		var record = { index: _index, type: _type, body: data };
		if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && typeof data !== 'String') {
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
};

/**
 * Use for log event
 * @param {String} _index 
 * @param {String} _type 
 * @param {any} data 
 * @param {function} callback 
 */
elas.setIgnoreIdKey = function (_index, _type, data, callback) {
	var record = { index: _index, type: _type, body: data };
	if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && typeof data !== 'String') {
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
};
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
};
elas.setIdAsync = async function (_index, _type, _id, data) {
	try {
		var record = {
			index: _index,
			type: _type,
			id: _id,
			body: data
		};
		if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && typeof data !== 'String') {
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
};
elas.buildSort = function (field, isReversed) {
	var sortField = {};
	var order = isReversed ? "desc" : "asc";
	sortField[field] = {
		"order": order
	};
	return sortField;
};

elas.buildFilterExists = function (arFields) {
	var exists = [];
	for (var field in arFields) {
		var field = { field: arFields[field] };
		var exist = { exists: field };
		exists.push(exist);
	}
	return exists;
};

elas.buildFilterMissing = function (field) {
	var missing = {};
	// must_not
	missing.missing = {
		field: field,
		existence: true,
		null_value: true
	};
	return missing;
};

elas.buildFilterMust = function (arFields) {
	var musts = [];
	for (var field in arFields) {
		var term = _defineProperty({}, field, arFields[field]);
		var must = { term: term };
		musts.push(must);
	}
	// for (var key in musts) {
	// 	 this.logger.error(key, ": ", musts[key]);
	// }
	return musts;
};

elas.buildFilterMatch = function (field, val) {
	var match = {};
	match[field] = val;
	return { match: match };
	//	var matchs = [];
	//	for ( var field in arFields) {
	//		var match = {};
	//		match[field] = arFields[field];
	//		matchs.push(match);
	//	}
	//	return matchs;
};

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
	};
	return q;
};

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
};

elas.buildFilterGreater = function (key, gt) {
	var rangeField = {};
	var range = {};
	range[key] = {};

	range[key]["gt"] = gt;
	rangeField["range"] = range;
	return rangeField;
};

elas.buildFilterLess = function (key, lt) {
	var rangeField = {};
	var range = {};
	range[key] = {};

	range[key]["lt"] = lt;
	rangeField["range"] = range;
	return rangeField;
};

elas.buildQuery = function (index, type, from, filters, sorts, selectFields) {
	var getDocVersion = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
	var size = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 20;
	var script = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : null;


	try {
		var boolQueryTypes = ["must", "filter", "should", "must_not"];
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
		query.bool = {};
		for (var key in boolQueryTypes) {
			var boolQueryType = boolQueryTypes[key];
			if (typeof filters[boolQueryType] !== 'undefined' && typeof filters[boolQueryType] !== 'undefined') {
				query.bool[boolQueryType] = filters[boolQueryType];
			}
		}
		if (Libs.isObjectEmpty(query.bool)) {}

		var body = {};
		if (Array.isArray(sorts) && sorts.length > 0) {
			body.sort = sorts;
		}
		if (getDocVersion === true) {
			body.version = true; // set các document đều có version
		}

		body.query = query;
		if ((typeof script === 'undefined' ? 'undefined' : _typeof(script)) === 'object' && script != null) {
			body.script = script;
		}
		wrap.body = body;
		//		JSON.stringify(body);
		return wrap;
	} catch (e) {
		return false;
	}
};

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
};

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
};

elas.buildUpdateDoc = function (index, type, id, doc, parameters) {
	try {
		var wrap = {};
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
};

elas.buildDoc = function (fields) {
	var obj = {};
	for (var field in fields) {
		obj[field] = fields[field];
	}
	return obj;
};

elas.updateByDoc = function (_index, _type, id, doc, callback) {
	var query = elas.buildUpdateDoc(_index, _type, id, doc);
	this.elasClient.update(query, function (error, response) {
		return callback(error, response);
	});
};

elas.updateByDocAsync = async function (_index, _type, id, doc, parameters) {
	try {
		var query = elas.buildUpdateDoc(_index, _type, id, doc, parameters),
		    response = await this.elasClient.update(query);
		return { status: true, response: response, messeage: "" };
	} catch (error) {
		this.logger.error("ElasProvider.updateByDocAsync:", error);
		return { status: false, response: error, messeage: error.messeage };
	}
};

elas.updateByQuery = function (_index, _type, body, callback) {
	var query = elas.buildUpdateByQuery(_index, _type, body);
	this.elasClient.updateByQuery(query, function (error, response) {
		return callback(error, response);
	});
};

elas.updateByQueryAsync = async function (source) {
	try {
		return await this.elasClient.updateByQuery(source);
	} catch (error) {
		this.logger.error("ElasProvider.updateByQueryAsync:", error);
		return false;
	}
};

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
};

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
};
elas.get = function (index, type, id, callBack) {
	var self = this;
	var query = this.buildQueryGet(index, type, id);
	var elasFunc = function elasFunc(resolve, reject) {
		self.elasClient.get(query, function (error, response) {
			try {
				if (error) {
					if (typeof callBack === 'function') {
						callBack(false, convertDataObj(response));
					} else {
						reject(error);
					}
					return;
				}
				if (typeof callBack === 'function') {
					callBack(false, convertDataObj(response));
				} else {
					resolve(convertDataObj(response));
				}
			} catch (e) {
				self.logger.error(e);
				reject(error);
			}
		});
	};
	if (typeof callback === 'function') {
		elasFunc();
		return;
	}
	return new Promise(function (resolve, reject) {
		elasFunc(resolve, reject);
	});
};

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
};

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
};

elas.multiSearchAsync = async function (body) {
	try {
		var response = await this.elasClient.msearch(body);

		if (response && Array.isArray(response.responses)) {
			var list = [],
			    responses = response.responses;

			for (var key in responses) {
				var item = responses[key],
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
};

// elas.refreshAsync = async function () {

// }

function buildIndexBulkBody(index, type, data) {
	var body = [],
	    index = { index: { _index: index, _type: type } };
	if (!Array.isArray(data)) return body;
	for (var key in data) {
		var record = data[key];
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
		record.documentVersion = obj._version ? obj._version : null;
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
elas.buildQueryAggs = function (index, type, from, filters, sorts, selectFields) {
	var aggsFilter = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";
	var getVersion = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;


	try {
		var boolQueryTypes = ["must", "filter", "should", "must_not"];
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
		query.bool = {};
		for (var key in boolQueryTypes) {
			var boolQueryType = boolQueryTypes[key];
			if (typeof filters[boolQueryType] !== 'undefined' && typeof filters[boolQueryType] !== 'undefined') {
				query.bool[boolQueryType] = filters[boolQueryType];
			}
		}
		if (Libs.isObjectEmpty(query.bool)) {}

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
								"sort": [{
									"created_date": {
										"order": "desc"
									}
								}]
							}
						}
					}
				},
				"total": {
					"cardinality": {
						"field": aggsFilter
					}
				}
			};
		}
		wrap.body = body;
		//		JSON.stringify(body);
		return wrap;
	} catch (e) {
		return false;
	}
};
module.exports = elas;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9EQk1hbmFnZXJzL0VsYXN0aWNzZWFyY2gvRWxhc1Byb3ZpZGVyLmpzIl0sIm5hbWVzIjpbImVsYXN0aWNzZWFyY2giLCJyZXF1aXJlIiwiZWxhcyIsImNvbmZpZyIsImNvbm5lY3QiLCJlbGFzQ2xpZW50IiwiQ2xpZW50IiwibG9nZ2VyIiwiRkxMb2dnZXIiLCJnZXRMb2dnZXIiLCJzZWFyY2giLCJxdWVyeSIsImNhbGxiYWNrIiwiZXJyb3IiLCJyZXNwb25zZSIsInJlY29yZHMiLCJjb252ZXJ0RGF0YUxpc3RPYmoiLCJhZ2dyZWdhdGlvbnMiLCJhZ2dzIiwiYWdnIiwidmFsdWUiLCJlIiwic2VhcmNoQXN5bmMiLCJnZXRBc3luYyIsImluZGV4IiwidHlwZSIsImlkIiwidmVyc2lvbiIsImJ1aWxkUXVlcnlHZXQiLCJleGlzdCIsImV4aXN0cyIsIkxpYnMiLCJpc0JsYW5rIiwiZ2V0IiwiZGF0YSIsImNvbnZlcnREYXRhT2JqIiwiY291bnQiLCJjb3VudEFzeW5jIiwiZGVsIiwiX2luZGV4IiwiX3R5cGUiLCJfaWQiLCJjYWxsQmFjayIsImRlbGV0ZSIsImRlbGV0ZUJ5RG9jSWRBc3luYyIsImRlbGV0ZUJ5UXVlcnkiLCJfcXVlcnkiLCJib2R5Iiwic2V0IiwicmVjb3JkIiwic2V0QXN5bmMiLCJwYXJhbWV0ZXJzIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImFzc2lnbiIsInNldElnbm9yZUlkS2V5Iiwia2V5Iiwic2V0SWQiLCJzZXRJZEFzeW5jIiwiYnVpbGRTb3J0IiwiZmllbGQiLCJpc1JldmVyc2VkIiwic29ydEZpZWxkIiwib3JkZXIiLCJidWlsZEZpbHRlckV4aXN0cyIsImFyRmllbGRzIiwicHVzaCIsImJ1aWxkRmlsdGVyTWlzc2luZyIsIm1pc3NpbmciLCJleGlzdGVuY2UiLCJudWxsX3ZhbHVlIiwiYnVpbGRGaWx0ZXJNdXN0IiwibXVzdHMiLCJ0ZXJtIiwibXVzdCIsImJ1aWxkRmlsdGVyTWF0Y2giLCJ2YWwiLCJtYXRjaCIsImJ1aWxkTXVsdGlNYXRjaCIsImZpZWxkcyIsIm9wZXJhdG9yIiwicSIsIm11bHRpX21hdGNoIiwiYnVpbGRGaWx0ZXJSYW5nZSIsImd0ZSIsImx0ZSIsInJhbmdlRmllbGQiLCJyYW5nZSIsImJ1aWxkRmlsdGVyR3JlYXRlciIsImd0IiwiYnVpbGRGaWx0ZXJMZXNzIiwibHQiLCJidWlsZFF1ZXJ5IiwiZnJvbSIsImZpbHRlcnMiLCJzb3J0cyIsInNlbGVjdEZpZWxkcyIsImdldERvY1ZlcnNpb24iLCJzaXplIiwic2NyaXB0IiwiYm9vbFF1ZXJ5VHlwZXMiLCJ3cmFwIiwiX3NvdXJjZSIsIkFycmF5IiwiaXNBcnJheSIsImJvb2wiLCJib29sUXVlcnlUeXBlIiwiaXNPYmplY3RFbXB0eSIsInNvcnQiLCJidWlsZEN1c3RvbUJvZHkiLCJjb25kaXRpb25zIiwiYnVpbGRVcGRhdGVEb2MiLCJkb2MiLCJKU09OIiwic3RyaW5naWZ5IiwiYnVpbGREb2MiLCJvYmoiLCJ1cGRhdGVCeURvYyIsInVwZGF0ZSIsInVwZGF0ZUJ5RG9jQXN5bmMiLCJzdGF0dXMiLCJtZXNzZWFnZSIsInVwZGF0ZUJ5UXVlcnkiLCJidWlsZFVwZGF0ZUJ5UXVlcnkiLCJ1cGRhdGVCeVF1ZXJ5QXN5bmMiLCJzb3VyY2UiLCJidWlsZE9ialdpdGhLZXkiLCJ2YWx1ZXMiLCJpc0FycmF5VmFsdWUiLCJzZWxmIiwiZWxhc0Z1bmMiLCJyZXNvbHZlIiwicmVqZWN0IiwiUHJvbWlzZSIsImJ1bGtJbmRleEFzeW5jIiwiYnVpbGRJbmRleEJ1bGtCb2R5IiwiYnVsayIsImJ1bGtBc3luYyIsIm11bHRpU2VhcmNoQXN5bmMiLCJtc2VhcmNoIiwicmVzcG9uc2VzIiwiaXRlbSIsImxpc3QiLCJwcm9wZXJ0eSIsImRvY3VtZW50VmVyc2lvbiIsIl92ZXJzaW9uIiwiaGl0cyIsImJ1Y2tldHMiLCJ1bmlxdWVfYWdncyIsInRvdGFsIiwidG90YWxfZGlzdGluY3QiLCJkYXRhX2Rpc3RpbmN0IiwiYnVja2V0IiwiYnVja2V0c0hpdHMiLCJidWtkYXRhIiwiaGl0c19idWsiLCJoaXQiLCJkb2NfaWQiLCJidWlsZFF1ZXJ5QWdncyIsImFnZ3NGaWx0ZXIiLCJnZXRWZXJzaW9uIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7OztBQUdBO0FBQ0EsSUFBSUEsZ0JBQWdCQyxRQUFRLGVBQVIsQ0FBcEI7QUFDQSxJQUFJQyxPQUFPLFNBQVBBLElBQU8sQ0FBVUMsTUFBVixFQUFrQixDQUM1QixDQUREO0FBRUFELEtBQUtFLE9BQUwsR0FBZSxVQUFVRCxNQUFWLEVBQWtCO0FBQ2hDO0FBQ0EsTUFBS0UsVUFBTCxHQUFrQixJQUFJTCxjQUFjTSxNQUFsQixDQUF5QkgsTUFBekIsQ0FBbEI7QUFDQSxNQUFLSSxNQUFMLEdBQWNDLFNBQVNDLFNBQVQsQ0FBbUIsbUJBQW5CLENBQWQ7QUFDQSxDQUpEOztBQU1BOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0FQLEtBQUtRLE1BQUwsR0FBYyxVQUFVQyxLQUFWLEVBQWlCQyxRQUFqQixFQUEyQjtBQUN4QyxLQUFJO0FBQ0gsT0FBS1AsVUFBTCxDQUFnQkssTUFBaEIsQ0FBdUJDLEtBQXZCLEVBQThCLFVBQVVFLEtBQVYsRUFBaUJDLFFBQWpCLEVBQTJCO0FBQ3hELE9BQUlELEtBQUosRUFBVztBQUNWLFdBQU9ELFNBQVMsSUFBVCxFQUFlQyxLQUFmLENBQVA7QUFDQTtBQUNELE9BQUlDLFFBQUosRUFBYztBQUNiLFFBQUlDLFVBQVVDLG1CQUFtQkYsUUFBbkIsQ0FBZDtBQUNBLFFBQUlHLGVBQWVILFNBQVNHLFlBQTVCO0FBQ0EsUUFBSSxRQUFRQSxZQUFSLElBQXdCLE9BQU9BLFlBQVAsS0FBd0IsV0FBcEQsRUFBaUU7QUFDaEUsVUFBSyxJQUFJQyxJQUFULElBQWlCRCxZQUFqQixFQUErQjtBQUM5QixVQUFJRSxNQUFNRixhQUFhQyxJQUFiLENBQVY7QUFDQSxVQUFJRSxRQUFRRCxJQUFJLE9BQUosQ0FBWjtBQUNBLFVBQUksUUFBUUMsS0FBUixJQUFpQixPQUFPQSxLQUFQLEtBQWlCLFdBQXRDLEVBQW1EO0FBQ2xETCxlQUFRRyxJQUFSLElBQWdCRSxLQUFoQjtBQUNBO0FBQ0Q7QUFDRDtBQUNELFFBQUksT0FBT1IsUUFBUCxLQUFvQixVQUF4QixFQUFvQztBQUNuQ0EsY0FBUyxLQUFULEVBQWdCRyxPQUFoQjtBQUNBO0FBQ0QsSUFmRCxNQWVPO0FBQ04sUUFBSSxPQUFPSCxRQUFQLEtBQW9CLFVBQXhCLEVBQW9DO0FBQ25DQSxjQUFTLElBQVQsRUFBZUMsS0FBZjtBQUNBO0FBQ0Q7QUFDRCxHQXhCRDtBQXlCQSxFQTFCRCxDQTBCRSxPQUFPUSxDQUFQLEVBQVU7QUFDWCxPQUFLZCxNQUFMLENBQVlNLEtBQVosQ0FBa0JRLENBQWxCO0FBQ0FULFdBQVNTLENBQVQsRUFBWSxJQUFaO0FBQ0E7QUFDRCxDQS9CRDs7QUFpQ0FuQixLQUFLb0IsV0FBTCxHQUFtQixnQkFBZ0JYLEtBQWhCLEVBQXVCO0FBQ3pDLEtBQUk7QUFDSCxNQUFJRyxXQUFXLE1BQU0sS0FBS1QsVUFBTCxDQUFnQkssTUFBaEIsQ0FBdUJDLEtBQXZCLENBQXJCO0FBQ0EsTUFBSUcsUUFBSixFQUFjO0FBQ2IsT0FBSUMsVUFBVUMsbUJBQW1CRixRQUFuQixDQUFkO0FBQ0EsT0FBSUcsZUFBZUgsU0FBU0csWUFBNUI7QUFDQSxPQUFJLFFBQVFBLFlBQVIsSUFBd0IsT0FBT0EsWUFBUCxLQUF3QixXQUFwRCxFQUFpRTtBQUNoRSxTQUFLLElBQUlDLElBQVQsSUFBaUJELFlBQWpCLEVBQStCO0FBQzlCLFNBQUlFLE1BQU1GLGFBQWFDLElBQWIsQ0FBVjtBQUNBLFNBQUlFLFFBQVFELElBQUksT0FBSixDQUFaO0FBQ0EsU0FBSSxRQUFRQyxLQUFSLElBQWlCLE9BQU9BLEtBQVAsS0FBaUIsV0FBdEMsRUFBbUQ7QUFDbERMLGNBQVFHLElBQVIsSUFBZ0JFLEtBQWhCO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsVUFBT0wsT0FBUDtBQUNBLEdBYkQsTUFhTztBQUNOLFVBQU8sS0FBUDtBQUNBO0FBQ0QsRUFsQkQsQ0FrQkUsT0FBT00sQ0FBUCxFQUFVO0FBQ1gsT0FBS2QsTUFBTCxDQUFZTSxLQUFaLENBQWtCUSxDQUFsQjtBQUNBLFNBQU8sS0FBUDtBQUNBO0FBQ0QsQ0F2QkQ7O0FBeUJBbkIsS0FBS3FCLFFBQUwsR0FBZ0IsZ0JBQWdCQyxLQUFoQixFQUF1QkMsSUFBdkIsRUFBNkJDLEVBQTdCLEVBQWlDQyxPQUFqQyxFQUEwQztBQUN6RCxLQUFJO0FBQ0gsTUFBSWhCLFFBQVEsS0FBS2lCLGFBQUwsQ0FBbUJKLEtBQW5CLEVBQTBCQyxJQUExQixFQUFnQ0MsRUFBaEMsQ0FBWjtBQUNBLE1BQUlHLFFBQVEsTUFBTSxLQUFLeEIsVUFBTCxDQUFnQnlCLE1BQWhCLENBQXVCbkIsS0FBdkIsQ0FBbEI7QUFDQSxNQUFJLENBQUNrQixLQUFMLEVBQVk7QUFDWCxVQUFPLEtBQVA7QUFDQTtBQUNELE1BQUksQ0FBQ0UsS0FBS0MsT0FBTCxDQUFhTCxPQUFiLENBQUwsRUFBNEI7QUFDM0JoQixTQUFNZ0IsT0FBTixHQUFnQkEsT0FBaEI7QUFDQTtBQUNELE1BQUliLFdBQVcsTUFBTSxLQUFLVCxVQUFMLENBQWdCNEIsR0FBaEIsQ0FBb0J0QixLQUFwQixDQUFyQjtBQUNBLE1BQUl1QixPQUFPQyxlQUFlckIsUUFBZixDQUFYO0FBQ0EsU0FBT29CLElBQVA7QUFDQSxFQVpELENBWUUsT0FBT3JCLEtBQVAsRUFBYztBQUNmLE9BQUtOLE1BQUwsQ0FBWU0sS0FBWixDQUFrQiw2QkFBbEIsRUFBaURBLEtBQWpEO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7QUFDRCxDQWpCRDs7QUFvQkE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFYLEtBQUtrQyxLQUFMLEdBQWEsVUFBVXpCLEtBQVYsRUFBaUJDLFFBQWpCLEVBQTJCO0FBQ3ZDLEtBQUksQ0FBQ0EsUUFBRCxJQUFhLE9BQU9BLFFBQVAsS0FBb0IsVUFBckMsRUFBaUQ7QUFDaEQ7QUFDQTtBQUNELEtBQUk7QUFDSCxPQUFLUCxVQUFMLENBQWdCK0IsS0FBaEIsQ0FBc0J6QixLQUF0QixFQUE2QixVQUFVRSxLQUFWLEVBQWlCQyxRQUFqQixFQUEyQjtBQUN2RCxPQUFJRCxLQUFKLEVBQVc7QUFDVixXQUFPRCxTQUFTLElBQVQsRUFBZUMsS0FBZixDQUFQO0FBQ0E7QUFDRCxPQUFJQyxRQUFKLEVBQWM7QUFDYkYsYUFBUyxLQUFULEVBQWdCRSxRQUFoQjtBQUNBLElBRkQsTUFFTztBQUNORixhQUFTLElBQVQsRUFBZUMsS0FBZjtBQUNBO0FBQ0QsR0FURDtBQVVBLEVBWEQsQ0FXRSxPQUFPUSxDQUFQLEVBQVU7QUFDWCxPQUFLZCxNQUFMLENBQVlNLEtBQVosQ0FBa0JRLENBQWxCO0FBQ0FULFdBQVNTLENBQVQsRUFBWSxJQUFaO0FBQ0E7QUFDRCxDQW5CRDs7QUFxQkFuQixLQUFLbUMsVUFBTCxHQUFrQixnQkFBZ0IxQixLQUFoQixFQUF1QjtBQUN4QyxLQUFJO0FBQ0gsTUFBSUcsV0FBVyxNQUFNLEtBQUtULFVBQUwsQ0FBZ0IrQixLQUFoQixDQUFzQnpCLEtBQXRCLENBQXJCO0FBQ0EsTUFBSUcsUUFBSixFQUFjO0FBQ2IsVUFBT0EsU0FBU3NCLEtBQWhCO0FBQ0E7QUFDRCxTQUFPLENBQVA7QUFDQSxFQU5ELENBTUUsT0FBT2YsQ0FBUCxFQUFVO0FBQ1gsT0FBS2QsTUFBTCxDQUFZTSxLQUFaLENBQWtCLCtCQUFsQixFQUFtRFEsQ0FBbkQ7QUFDQSxTQUFPLENBQVA7QUFDQTtBQUNELENBWEQ7O0FBY0FuQixLQUFLb0MsR0FBTCxHQUFXLFVBQVVDLE1BQVYsRUFBa0JDLEtBQWxCLEVBQXlCQyxHQUF6QixFQUE4QkMsUUFBOUIsRUFBd0M7QUFDbEQsTUFBS3JDLFVBQUwsQ0FBZ0JzQyxNQUFoQixDQUF1QixFQUFFbkIsT0FBT2UsTUFBVCxFQUFpQmQsTUFBTWUsS0FBdkIsRUFBOEJkLElBQUllLEdBQWxDLEVBQXZCLEVBQWdFLFVBQVU1QixLQUFWLEVBQWlCQyxRQUFqQixFQUEyQjtBQUMxRjRCLFdBQVM3QixLQUFULEVBQWdCQyxRQUFoQjtBQUNBLEVBRkQ7QUFHQSxDQUpEOztBQU1BWixLQUFLMEMsa0JBQUwsR0FBMEIsZ0JBQWdCTCxNQUFoQixFQUF3QkMsS0FBeEIsRUFBK0JDLEdBQS9CLEVBQW9DO0FBQzdELEtBQUk7QUFDSCxNQUFJM0IsV0FBVyxLQUFLVCxVQUFMLENBQWdCc0MsTUFBaEIsQ0FBdUIsRUFBRW5CLE9BQU9lLE1BQVQsRUFBaUJkLE1BQU1lLEtBQXZCLEVBQThCZCxJQUFJZSxHQUFsQyxFQUF2QixDQUFmO0FBQ0EsTUFBSSxDQUFDM0IsUUFBTCxFQUFlO0FBQ2QsVUFBTyxLQUFQO0FBQ0E7QUFDRCxTQUFPQSxRQUFQO0FBQ0EsRUFORCxDQU1FLE9BQU9ELEtBQVAsRUFBYztBQUNmLE9BQUtOLE1BQUwsQ0FBWU0sS0FBWixDQUFrQix1Q0FBbEIsRUFBMkRBLEtBQTNEO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7QUFDRCxDQVhEOztBQWFBWCxLQUFLMkMsYUFBTCxHQUFxQixVQUFVTixNQUFWLEVBQWtCQyxLQUFsQixFQUF5Qk0sTUFBekIsRUFBaUNKLFFBQWpDLEVBQTJDO0FBQy9ELEtBQUlLLE9BQU8sRUFBRXBDLE9BQU9tQyxNQUFULEVBQVg7QUFDQSxNQUFLekMsVUFBTCxDQUFnQndDLGFBQWhCLENBQThCLEVBQUVyQixPQUFPZSxNQUFULEVBQWlCZCxNQUFNZSxLQUF2QixFQUE4Qk8sTUFBTUEsSUFBcEMsRUFBOUIsRUFBMEUsVUFBVWxDLEtBQVYsRUFBaUJDLFFBQWpCLEVBQTJCO0FBQ3BHLE1BQUksT0FBT0YsUUFBUCxLQUFvQixVQUF4QixFQUFvQztBQUNuQzhCLFlBQVM3QixLQUFULEVBQWdCQyxRQUFoQjtBQUNBO0FBQ0QsRUFKRDtBQUtBLENBUEQ7O0FBU0FaLEtBQUs4QyxHQUFMLEdBQVcsVUFBVVQsTUFBVixFQUFrQkMsS0FBbEIsRUFBeUJOLElBQXpCLEVBQStCdEIsUUFBL0IsRUFBeUM7QUFDbkQsS0FBSXFDLFNBQVMsRUFBRXpCLE9BQU9lLE1BQVQsRUFBaUJkLE1BQU1lLEtBQXZCLEVBQThCTyxNQUFNYixJQUFwQyxFQUFiO0FBQ0EsS0FBSSxRQUFPQSxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQWhCLElBQTRCLE9BQU9BLElBQVAsS0FBZ0IsUUFBaEQsRUFBMEQ7QUFDekQsTUFBSVIsS0FBS1EsS0FBSyxJQUFMLENBQVQ7QUFDQSxNQUFJUixNQUFNLElBQU4sSUFBYyxPQUFPQSxFQUFQLEtBQWMsV0FBaEMsRUFBNkM7QUFDNUN1QixVQUFPdkIsRUFBUCxHQUFZQSxFQUFaO0FBQ0E7QUFDRDtBQUNELE1BQUtyQixVQUFMLENBQWdCbUIsS0FBaEIsQ0FBc0J5QixNQUF0QixFQUE4QixVQUFVcEMsS0FBVixFQUFpQkMsUUFBakIsRUFBMkI7QUFDeEQsTUFBSUEsUUFBSixFQUFjO0FBQ2IsT0FBSSxPQUFPRixRQUFQLElBQW1CLFVBQXZCLEVBQW1DO0FBQ2xDQSxhQUFTLEtBQVQsRUFBZ0JFLFFBQWhCO0FBQ0E7QUFDRCxHQUpELE1BSU87QUFDTixPQUFJLE9BQU9GLFFBQVAsSUFBbUIsVUFBdkIsRUFBbUM7QUFDbENBLGFBQVMsSUFBVCxFQUFlQyxLQUFmO0FBQ0E7QUFDRDtBQUNELEVBVkQ7QUFXQSxDQW5CRDs7QUFxQkFYLEtBQUtnRCxRQUFMLEdBQWdCLGdCQUFnQlgsTUFBaEIsRUFBd0JDLEtBQXhCLEVBQStCTixJQUEvQixFQUFxQ2lCLFVBQXJDLEVBQWlEO0FBQ2hFLEtBQUk7QUFDSCxNQUFJRixTQUFTLEVBQUV6QixPQUFPZSxNQUFULEVBQWlCZCxNQUFNZSxLQUF2QixFQUE4Qk8sTUFBTWIsSUFBcEMsRUFBYjtBQUNBLE1BQUksUUFBT0EsSUFBUCx5Q0FBT0EsSUFBUCxPQUFnQixRQUFoQixJQUE0QixPQUFPQSxJQUFQLEtBQWdCLFFBQWhELEVBQTBEO0FBQ3pELE9BQUlSLEtBQUtRLEtBQUssSUFBTCxDQUFUO0FBQ0EsT0FBSVIsTUFBTSxJQUFOLElBQWMsT0FBT0EsRUFBUCxLQUFjLFdBQWhDLEVBQTZDO0FBQzVDdUIsV0FBT3ZCLEVBQVAsR0FBWUEsRUFBWjtBQUNBO0FBQ0Q7QUFDRCxNQUFJeUIsY0FBY0MsT0FBT0MsSUFBUCxDQUFZRixVQUFaLEVBQXdCRyxNQUF4QixHQUFpQyxDQUFuRCxFQUFzRDtBQUNyREYsVUFBT0csTUFBUCxDQUFjTixNQUFkLEVBQXNCRSxVQUF0QjtBQUNBO0FBQ0QsTUFBSXJDLFdBQVcsTUFBTSxLQUFLVCxVQUFMLENBQWdCbUIsS0FBaEIsQ0FBc0J5QixNQUF0QixDQUFyQjtBQUNBLFNBQU9uQyxRQUFQO0FBQ0EsRUFiRCxDQWFFLE9BQU9ELEtBQVAsRUFBYztBQUNmLE9BQUtOLE1BQUwsQ0FBWU0sS0FBWixDQUFrQix3QkFBbEIsRUFBNENBLEtBQTVDO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7QUFDRCxDQWxCRDs7QUFvQkE7Ozs7Ozs7QUFPQVgsS0FBS3NELGNBQUwsR0FBc0IsVUFBVWpCLE1BQVYsRUFBa0JDLEtBQWxCLEVBQXlCTixJQUF6QixFQUErQnRCLFFBQS9CLEVBQXlDO0FBQzlELEtBQUlxQyxTQUFTLEVBQUV6QixPQUFPZSxNQUFULEVBQWlCZCxNQUFNZSxLQUF2QixFQUE4Qk8sTUFBTWIsSUFBcEMsRUFBYjtBQUNBLEtBQUksUUFBT0EsSUFBUCx5Q0FBT0EsSUFBUCxPQUFnQixRQUFoQixJQUE0QixPQUFPQSxJQUFQLEtBQWdCLFFBQWhELEVBQTBEO0FBQ3pELE1BQUl1QixNQUFNdkIsS0FBSyxLQUFMLENBQVY7QUFDQSxNQUFJdUIsT0FBTyxJQUFQLElBQWUsT0FBT0EsR0FBUCxLQUFlLFdBQWxDLEVBQStDO0FBQzlDUixVQUFPdkIsRUFBUCxHQUFZK0IsR0FBWjtBQUNBO0FBQ0Q7QUFDRCxNQUFLcEQsVUFBTCxDQUFnQm1CLEtBQWhCLENBQXNCeUIsTUFBdEIsRUFBOEIsVUFBVXBDLEtBQVYsRUFBaUJDLFFBQWpCLEVBQTJCO0FBQ3hELE1BQUlBLFFBQUosRUFBYztBQUNiLE9BQUksT0FBT0YsUUFBUCxJQUFtQixVQUF2QixFQUFtQztBQUNsQ0EsYUFBUyxLQUFULEVBQWdCRSxRQUFoQjtBQUNBO0FBQ0QsR0FKRCxNQUlPO0FBQ04sT0FBSSxPQUFPRixRQUFQLElBQW1CLFVBQXZCLEVBQW1DO0FBQ2xDQSxhQUFTLElBQVQsRUFBZUMsS0FBZjtBQUNBO0FBQ0Q7QUFDRCxFQVZEO0FBV0EsQ0FuQkQ7QUFvQkFYLEtBQUt3RCxLQUFMLEdBQWEsVUFBVW5CLE1BQVYsRUFBa0JDLEtBQWxCLEVBQXlCQyxHQUF6QixFQUE4QlAsSUFBOUIsRUFBb0N0QixRQUFwQyxFQUE4QztBQUMxRCxNQUFLUCxVQUFMLENBQWdCbUIsS0FBaEIsQ0FBc0I7QUFDckJBLFNBQU9lLE1BRGM7QUFFckJkLFFBQU1lLEtBRmU7QUFHckJkLE1BQUllLEdBSGlCO0FBSXJCTSxRQUFNYjtBQUplLEVBQXRCLEVBS0csVUFBVXJCLEtBQVYsRUFBaUJDLFFBQWpCLEVBQTJCO0FBQzdCLE1BQUlBLFFBQUosRUFBYztBQUNiRixZQUFTLEtBQVQsRUFBZ0JFLFFBQWhCO0FBQ0EsR0FGRCxNQUVPO0FBQ05GLFlBQVMsSUFBVCxFQUFlQyxLQUFmO0FBQ0E7QUFDRCxFQVhEO0FBWUEsQ0FiRDtBQWNBWCxLQUFLeUQsVUFBTCxHQUFrQixnQkFBZ0JwQixNQUFoQixFQUF3QkMsS0FBeEIsRUFBK0JDLEdBQS9CLEVBQW9DUCxJQUFwQyxFQUEwQztBQUMzRCxLQUFJO0FBQ0gsTUFBSWUsU0FBUztBQUNaekIsVUFBT2UsTUFESztBQUVaZCxTQUFNZSxLQUZNO0FBR1pkLE9BQUllLEdBSFE7QUFJWk0sU0FBTWI7QUFKTSxHQUFiO0FBTUEsTUFBSSxRQUFPQSxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQWhCLElBQTRCLE9BQU9BLElBQVAsS0FBZ0IsUUFBaEQsRUFBMEQ7QUFDekQsT0FBSVIsS0FBS1EsS0FBSyxJQUFMLENBQVQ7QUFDQSxPQUFJUixNQUFNLElBQU4sSUFBYyxPQUFPQSxFQUFQLEtBQWMsV0FBaEMsRUFBNkM7QUFDNUN1QixXQUFPdkIsRUFBUCxHQUFZQSxFQUFaO0FBQ0E7QUFDRDtBQUNELE1BQUlaLFdBQVcsTUFBTSxLQUFLVCxVQUFMLENBQWdCbUIsS0FBaEIsQ0FBc0J5QixNQUF0QixDQUFyQjtBQUNBLFNBQU9uQyxRQUFQO0FBQ0EsRUFmRCxDQWVFLE9BQU9ELEtBQVAsRUFBYztBQUNmLE9BQUtOLE1BQUwsQ0FBWU0sS0FBWixDQUFrQiwwQkFBbEIsRUFBOENBLEtBQTlDO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7QUFDRCxDQXBCRDtBQXFCQVgsS0FBSzBELFNBQUwsR0FBaUIsVUFBVUMsS0FBVixFQUFpQkMsVUFBakIsRUFBNkI7QUFDN0MsS0FBSUMsWUFBWSxFQUFoQjtBQUNBLEtBQUlDLFFBQVFGLGFBQWEsTUFBYixHQUFzQixLQUFsQztBQUNBQyxXQUFVRixLQUFWLElBQW1CO0FBQ2xCLFdBQVNHO0FBRFMsRUFBbkI7QUFHQSxRQUFPRCxTQUFQO0FBQ0EsQ0FQRDs7QUFTQTdELEtBQUsrRCxpQkFBTCxHQUF5QixVQUFVQyxRQUFWLEVBQW9CO0FBQzVDLEtBQUlwQyxTQUFTLEVBQWI7QUFDQSxNQUFLLElBQUkrQixLQUFULElBQWtCSyxRQUFsQixFQUE0QjtBQUMzQixNQUFJTCxRQUFRLEVBQUVBLE9BQU9LLFNBQVNMLEtBQVQsQ0FBVCxFQUFaO0FBQ0EsTUFBSWhDLFFBQVEsRUFBRUMsUUFBUStCLEtBQVYsRUFBWjtBQUNBL0IsU0FBT3FDLElBQVAsQ0FBWXRDLEtBQVo7QUFDQTtBQUNELFFBQU9DLE1BQVA7QUFDQSxDQVJEOztBQVVBNUIsS0FBS2tFLGtCQUFMLEdBQTBCLFVBQVVQLEtBQVYsRUFBaUI7QUFDMUMsS0FBSVEsVUFBVSxFQUFkO0FBQ0E7QUFDQUEsU0FBUUEsT0FBUixHQUFrQjtBQUNqQlIsU0FBT0EsS0FEVTtBQUVqQlMsYUFBVyxJQUZNO0FBR2pCQyxjQUFZO0FBSEssRUFBbEI7QUFLQSxRQUFPRixPQUFQO0FBQ0EsQ0FURDs7QUFXQW5FLEtBQUtzRSxlQUFMLEdBQXVCLFVBQVVOLFFBQVYsRUFBb0I7QUFDMUMsS0FBSU8sUUFBUSxFQUFaO0FBQ0EsTUFBSyxJQUFJWixLQUFULElBQWtCSyxRQUFsQixFQUE0QjtBQUMzQixNQUFJUSwyQkFBVWIsS0FBVixFQUFrQkssU0FBU0wsS0FBVCxDQUFsQixDQUFKO0FBQ0EsTUFBSWMsT0FBTyxFQUFFRCxNQUFNQSxJQUFSLEVBQVg7QUFDQUQsUUFBTU4sSUFBTixDQUFXUSxJQUFYO0FBQ0E7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFPRixLQUFQO0FBQ0EsQ0FYRDs7QUFhQXZFLEtBQUswRSxnQkFBTCxHQUF3QixVQUFVZixLQUFWLEVBQWlCZ0IsR0FBakIsRUFBc0I7QUFDN0MsS0FBSUMsUUFBUSxFQUFaO0FBQ0FBLE9BQU1qQixLQUFOLElBQWVnQixHQUFmO0FBQ0EsUUFBTyxFQUFFQyxPQUFPQSxLQUFULEVBQVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBWEQ7O0FBYUE7Ozs7OztBQU1BNUUsS0FBSzZFLGVBQUwsR0FBdUIsVUFBVXBFLEtBQVYsRUFBaUJjLElBQWpCLEVBQXVCdUQsTUFBdkIsRUFBK0JDLFFBQS9CLEVBQXlDO0FBQy9ELEtBQUlDLElBQUksRUFBUjtBQUNBQSxHQUFFQyxXQUFGLEdBQWdCO0FBQ2Z4RSxTQUFPQSxLQURRO0FBRWZjLFFBQU1BLElBRlM7QUFHZnVELFVBQVFBLE1BSE87QUFJZkMsWUFBVUE7QUFKSyxFQUFoQjtBQU1BLFFBQU9DLENBQVA7QUFDQSxDQVREOztBQVdBaEYsS0FBS2tGLGdCQUFMLEdBQXdCLFVBQVUzQixHQUFWLEVBQWU0QixHQUFmLEVBQW9CQyxHQUFwQixFQUF5QjtBQUNoRCxLQUFJQyxhQUFhLEVBQWpCO0FBQ0EsS0FBSUMsUUFBUSxFQUFaO0FBQ0FBLE9BQU0vQixHQUFOLElBQWEsRUFBYjs7QUFFQSxLQUFJNEIsR0FBSixFQUFTO0FBQ1JHLFFBQU0vQixHQUFOLEVBQVcsS0FBWCxJQUFvQjRCLEdBQXBCO0FBQ0E7QUFDRCxLQUFJQyxHQUFKLEVBQVM7QUFDUkUsUUFBTS9CLEdBQU4sRUFBVyxLQUFYLElBQW9CNkIsR0FBcEI7QUFDQTtBQUNEQyxZQUFXLE9BQVgsSUFBc0JDLEtBQXRCO0FBQ0EsUUFBT0QsVUFBUDtBQUNBLENBYkQ7O0FBZUFyRixLQUFLdUYsa0JBQUwsR0FBMEIsVUFBVWhDLEdBQVYsRUFBZWlDLEVBQWYsRUFBbUI7QUFDNUMsS0FBSUgsYUFBYSxFQUFqQjtBQUNBLEtBQUlDLFFBQVEsRUFBWjtBQUNBQSxPQUFNL0IsR0FBTixJQUFhLEVBQWI7O0FBR0ErQixPQUFNL0IsR0FBTixFQUFXLElBQVgsSUFBbUJpQyxFQUFuQjtBQUNBSCxZQUFXLE9BQVgsSUFBc0JDLEtBQXRCO0FBQ0EsUUFBT0QsVUFBUDtBQUNBLENBVEQ7O0FBV0FyRixLQUFLeUYsZUFBTCxHQUF1QixVQUFVbEMsR0FBVixFQUFlbUMsRUFBZixFQUFtQjtBQUN6QyxLQUFJTCxhQUFhLEVBQWpCO0FBQ0EsS0FBSUMsUUFBUSxFQUFaO0FBQ0FBLE9BQU0vQixHQUFOLElBQWEsRUFBYjs7QUFHQStCLE9BQU0vQixHQUFOLEVBQVcsSUFBWCxJQUFtQm1DLEVBQW5CO0FBQ0FMLFlBQVcsT0FBWCxJQUFzQkMsS0FBdEI7QUFDQSxRQUFPRCxVQUFQO0FBQ0EsQ0FURDs7QUFXQXJGLEtBQUsyRixVQUFMLEdBQWtCLFVBQVVyRSxLQUFWLEVBQWlCQyxJQUFqQixFQUF1QnFFLElBQXZCLEVBQTZCQyxPQUE3QixFQUFzQ0MsS0FBdEMsRUFBNkNDLFlBQTdDLEVBQTRHO0FBQUEsS0FBakRDLGFBQWlELHVFQUFqQyxLQUFpQztBQUFBLEtBQTFCQyxJQUEwQix1RUFBbkIsRUFBbUI7QUFBQSxLQUFmQyxNQUFlLHVFQUFOLElBQU07OztBQUU3SCxLQUFJO0FBQ0gsTUFBTUMsaUJBQWlCLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsUUFBbkIsRUFBNkIsVUFBN0IsQ0FBdkI7QUFDQSxNQUFJQyxPQUFPO0FBQ1ZDLFlBQVNOO0FBREMsR0FBWDtBQUdBLE1BQUksQ0FBQ2xFLEtBQUtDLE9BQUwsQ0FBYVIsS0FBYixDQUFMLEVBQTBCO0FBQ3pCOEUsUUFBSzlFLEtBQUwsR0FBYUEsS0FBYjtBQUNBO0FBQ0QsTUFBSSxDQUFDTyxLQUFLQyxPQUFMLENBQWFQLElBQWIsQ0FBTCxFQUF5QjtBQUN4QjZFLFFBQUs3RSxJQUFMLEdBQVlBLElBQVo7QUFDQTtBQUNELE1BQUkrRSxNQUFNQyxPQUFOLENBQWNSLFlBQWQsS0FBK0JBLGFBQWEzQyxNQUFiLEdBQXNCLENBQXpELEVBQTREO0FBQzNEZ0QsUUFBS0MsT0FBTCxHQUFlTixZQUFmO0FBQ0E7QUFDRCxNQUFJLE9BQU9ILElBQVAsS0FBZ0IsV0FBaEIsSUFBK0JBLFFBQVEsSUFBM0MsRUFBaUQ7QUFDaERRLFFBQUtSLElBQUwsR0FBWUEsSUFBWjtBQUNBUSxRQUFLSCxJQUFMLEdBQVlBLElBQVo7QUFDQTtBQUNELE1BQUl4RixRQUFRLEVBQVo7QUFDQUEsUUFBTStGLElBQU4sR0FBYSxFQUFiO0FBQ0EsT0FBSyxJQUFJakQsR0FBVCxJQUFnQjRDLGNBQWhCLEVBQWdDO0FBQy9CLE9BQUlNLGdCQUFnQk4sZUFBZTVDLEdBQWYsQ0FBcEI7QUFDQSxPQUFJLE9BQU9zQyxRQUFRWSxhQUFSLENBQVAsS0FBa0MsV0FBbEMsSUFBaUQsT0FBT1osUUFBUVksYUFBUixDQUFQLEtBQWtDLFdBQXZGLEVBQW9HO0FBQ25HaEcsVUFBTStGLElBQU4sQ0FBV0MsYUFBWCxJQUE0QlosUUFBUVksYUFBUixDQUE1QjtBQUNBO0FBQ0Q7QUFDRCxNQUFJNUUsS0FBSzZFLGFBQUwsQ0FBbUJqRyxNQUFNK0YsSUFBekIsQ0FBSixFQUFvQyxDQUVuQzs7QUFFRCxNQUFJM0QsT0FBTyxFQUFYO0FBQ0EsTUFBSXlELE1BQU1DLE9BQU4sQ0FBY1QsS0FBZCxLQUF3QkEsTUFBTTFDLE1BQU4sR0FBZSxDQUEzQyxFQUE4QztBQUM3Q1AsUUFBSzhELElBQUwsR0FBWWIsS0FBWjtBQUNBO0FBQ0QsTUFBSUUsa0JBQWtCLElBQXRCLEVBQTRCO0FBQzNCbkQsUUFBS3BCLE9BQUwsR0FBZSxJQUFmLENBRDJCLENBQ047QUFDckI7O0FBRURvQixPQUFLcEMsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsTUFBSSxRQUFPeUYsTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQixRQUFsQixJQUE4QkEsVUFBVSxJQUE1QyxFQUFrRDtBQUNqRHJELFFBQUtxRCxNQUFMLEdBQWNBLE1BQWQ7QUFDQTtBQUNERSxPQUFLdkQsSUFBTCxHQUFZQSxJQUFaO0FBQ0E7QUFDQSxTQUFPdUQsSUFBUDtBQUNBLEVBN0NELENBNkNFLE9BQU9qRixDQUFQLEVBQVU7QUFDWCxTQUFPLEtBQVA7QUFDQTtBQUNELENBbEREOztBQW9EQW5CLEtBQUs0RyxlQUFMLEdBQXVCLFVBQVV0RixLQUFWLEVBQWlCQyxJQUFqQixFQUF1QnFFLElBQXZCLEVBQTZCaUIsVUFBN0IsRUFBeUNkLFlBQXpDLEVBQXVEOztBQUU3RSxLQUFJO0FBQ0gsTUFBSUssT0FBTztBQUNWQyxZQUFTTjtBQURDLEdBQVg7QUFHQSxNQUFJLENBQUNsRSxLQUFLQyxPQUFMLENBQWFSLEtBQWIsQ0FBTCxFQUEwQjtBQUN6QjhFLFFBQUs5RSxLQUFMLEdBQWFBLEtBQWI7QUFDQTtBQUNELE1BQUksQ0FBQ08sS0FBS0MsT0FBTCxDQUFhUCxJQUFiLENBQUwsRUFBeUI7QUFDeEI2RSxRQUFLN0UsSUFBTCxHQUFZQSxJQUFaO0FBQ0E7QUFDRCxNQUFJK0UsTUFBTUMsT0FBTixDQUFjUixZQUFkLEtBQStCQSxhQUFhM0MsTUFBYixHQUFzQixDQUF6RCxFQUE0RDtBQUMzRGdELFFBQUtDLE9BQUwsR0FBZU4sWUFBZjtBQUNBO0FBQ0QsTUFBSSxPQUFPSCxJQUFQLEtBQWdCLFdBQWhCLElBQStCQSxRQUFRLElBQTNDLEVBQWlEO0FBQ2hEUSxRQUFLUixJQUFMLEdBQVlBLElBQVo7QUFDQVEsUUFBS0gsSUFBTCxHQUFZLEVBQVo7QUFDQTtBQUNELE1BQUl4RixRQUFRLEVBQVo7QUFDQSxNQUFJb0MsT0FBTyxFQUFYO0FBQ0EsTUFBSWhCLEtBQUs2RSxhQUFMLENBQW1CakcsTUFBTStGLElBQXpCLENBQUosRUFBb0M7QUFDbkMsT0FBSSxDQUFDM0UsS0FBSzZFLGFBQUwsQ0FBbUJHLFVBQW5CLENBQUwsRUFBcUM7QUFDcENoRSxXQUFPSyxPQUFPRyxNQUFQLENBQWMsRUFBZCxFQUFrQlIsSUFBbEIsRUFBd0JnRSxVQUF4QixDQUFQO0FBQ0E7QUFDRDtBQUNEaEUsT0FBS3BCLE9BQUwsR0FBZSxJQUFmO0FBQ0EyRSxPQUFLdkQsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBT3VELElBQVA7QUFDQSxFQTNCRCxDQTJCRSxPQUFPakYsQ0FBUCxFQUFVO0FBQ1gsT0FBS2QsTUFBTCxDQUFZTSxLQUFaLENBQWtCLEdBQWxCLEVBQXVCUSxDQUF2QjtBQUNBLFNBQU8sS0FBUDtBQUNBO0FBQ0QsQ0FqQ0Q7O0FBbUNBbkIsS0FBSzBCLGFBQUwsR0FBcUIsVUFBVUosS0FBVixFQUFpQkMsSUFBakIsRUFBdUJDLEVBQXZCLEVBQTJCdUUsWUFBM0IsRUFBeUM7O0FBRTdELEtBQUk7QUFDSCxNQUFJSyxPQUFPO0FBQ1Y7QUFEVSxHQUFYO0FBR0EsTUFBSSxDQUFDdkUsS0FBS0MsT0FBTCxDQUFhUixLQUFiLENBQUwsRUFBMEI7QUFDekI4RSxRQUFLOUUsS0FBTCxHQUFhQSxLQUFiO0FBQ0E7QUFDRCxNQUFJLENBQUNPLEtBQUtDLE9BQUwsQ0FBYVAsSUFBYixDQUFMLEVBQXlCO0FBQ3hCNkUsUUFBSzdFLElBQUwsR0FBWUEsSUFBWjtBQUNBO0FBQ0QsTUFBSStFLE1BQU1DLE9BQU4sQ0FBY1IsWUFBZCxLQUErQkEsYUFBYTNDLE1BQWIsR0FBc0IsQ0FBekQsRUFBNEQ7QUFDM0RnRCxRQUFLQyxPQUFMLEdBQWVOLFlBQWY7QUFDQTtBQUNESyxPQUFLNUUsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsU0FBTzRFLElBQVA7QUFDQSxFQWZELENBZUUsT0FBT2pGLENBQVAsRUFBVTtBQUNYLFNBQU8sS0FBUDtBQUNBO0FBQ0QsQ0FwQkQ7O0FBdUJBbkIsS0FBSzhHLGNBQUwsR0FBc0IsVUFBVXhGLEtBQVYsRUFBaUJDLElBQWpCLEVBQXVCQyxFQUF2QixFQUEyQnVGLEdBQTNCLEVBQWdDOUQsVUFBaEMsRUFBNEM7QUFDakUsS0FBSTtBQUNILE1BQUltRCxPQUFPLEVBQVg7QUFHQSxNQUFJLENBQUN2RSxLQUFLQyxPQUFMLENBQWFSLEtBQWIsQ0FBTCxFQUEwQjtBQUN6QjhFLFFBQUs5RSxLQUFMLEdBQWFBLEtBQWI7QUFDQTtBQUNELE1BQUksQ0FBQ08sS0FBS0MsT0FBTCxDQUFhUCxJQUFiLENBQUwsRUFBeUI7QUFDeEI2RSxRQUFLN0UsSUFBTCxHQUFZQSxJQUFaO0FBQ0E7O0FBRUQsTUFBSSxDQUFDTSxLQUFLQyxPQUFMLENBQWFOLEVBQWIsQ0FBTCxFQUF1QjtBQUN0QjRFLFFBQUs1RSxFQUFMLEdBQVVBLEVBQVY7QUFDQTs7QUFFRCxNQUFJcUIsT0FBTyxFQUFYO0FBQ0FBLE9BQUtrRSxHQUFMLEdBQVdBLEdBQVg7QUFDQSxNQUFJOUQsY0FBY0MsT0FBT0MsSUFBUCxDQUFZRixVQUFaLEVBQXdCRyxNQUF4QixHQUFpQyxDQUFuRCxFQUFzRDtBQUNyREYsVUFBT0csTUFBUCxDQUFjK0MsSUFBZCxFQUFvQm5ELFVBQXBCO0FBQ0E7QUFDRG1ELE9BQUt2RCxJQUFMLEdBQVltRSxLQUFLQyxTQUFMLENBQWVwRSxJQUFmLENBQVo7QUFDQSxTQUFPdUQsSUFBUDtBQUNBLEVBdEJELENBc0JFLE9BQU9qRixDQUFQLEVBQVU7QUFDWCxTQUFPLEtBQVA7QUFDQTtBQUNELENBMUJEOztBQTRCQW5CLEtBQUtrSCxRQUFMLEdBQWdCLFVBQVVwQyxNQUFWLEVBQWtCO0FBQ2pDLEtBQUlxQyxNQUFNLEVBQVY7QUFDQSxNQUFLLElBQUl4RCxLQUFULElBQWtCbUIsTUFBbEIsRUFBMEI7QUFDekJxQyxNQUFJeEQsS0FBSixJQUFhbUIsT0FBT25CLEtBQVAsQ0FBYjtBQUNBO0FBQ0QsUUFBT3dELEdBQVA7QUFDQSxDQU5EOztBQVFBbkgsS0FBS29ILFdBQUwsR0FBbUIsVUFBVS9FLE1BQVYsRUFBa0JDLEtBQWxCLEVBQXlCZCxFQUF6QixFQUE2QnVGLEdBQTdCLEVBQWtDckcsUUFBbEMsRUFBNEM7QUFDOUQsS0FBSUQsUUFBUVQsS0FBSzhHLGNBQUwsQ0FBb0J6RSxNQUFwQixFQUE0QkMsS0FBNUIsRUFBbUNkLEVBQW5DLEVBQXVDdUYsR0FBdkMsQ0FBWjtBQUNBLE1BQUs1RyxVQUFMLENBQWdCa0gsTUFBaEIsQ0FBdUI1RyxLQUF2QixFQUE4QixVQUFVRSxLQUFWLEVBQWlCQyxRQUFqQixFQUEyQjtBQUN4RCxTQUFPRixTQUFTQyxLQUFULEVBQWdCQyxRQUFoQixDQUFQO0FBQ0EsRUFGRDtBQUdBLENBTEQ7O0FBT0FaLEtBQUtzSCxnQkFBTCxHQUF3QixnQkFBZ0JqRixNQUFoQixFQUF3QkMsS0FBeEIsRUFBK0JkLEVBQS9CLEVBQW1DdUYsR0FBbkMsRUFBd0M5RCxVQUF4QyxFQUFvRDtBQUMzRSxLQUFJO0FBQ0gsTUFBSXhDLFFBQVFULEtBQUs4RyxjQUFMLENBQW9CekUsTUFBcEIsRUFBNEJDLEtBQTVCLEVBQW1DZCxFQUFuQyxFQUF1Q3VGLEdBQXZDLEVBQTRDOUQsVUFBNUMsQ0FBWjtBQUFBLE1BQ0NyQyxXQUFXLE1BQU0sS0FBS1QsVUFBTCxDQUFnQmtILE1BQWhCLENBQXVCNUcsS0FBdkIsQ0FEbEI7QUFFQSxTQUFPLEVBQUU4RyxRQUFRLElBQVYsRUFBZ0IzRyxVQUFVQSxRQUExQixFQUFvQzRHLFVBQVUsRUFBOUMsRUFBUDtBQUNBLEVBSkQsQ0FJRSxPQUFPN0csS0FBUCxFQUFjO0FBQ2YsT0FBS04sTUFBTCxDQUFZTSxLQUFaLENBQWtCLGdDQUFsQixFQUFvREEsS0FBcEQ7QUFDQSxTQUFPLEVBQUU0RyxRQUFRLEtBQVYsRUFBaUIzRyxVQUFVRCxLQUEzQixFQUFrQzZHLFVBQVU3RyxNQUFNNkcsUUFBbEQsRUFBUDtBQUNBO0FBQ0QsQ0FURDs7QUFXQXhILEtBQUt5SCxhQUFMLEdBQXFCLFVBQVVwRixNQUFWLEVBQWtCQyxLQUFsQixFQUF5Qk8sSUFBekIsRUFBK0JuQyxRQUEvQixFQUF5QztBQUM3RCxLQUFJRCxRQUFRVCxLQUFLMEgsa0JBQUwsQ0FBd0JyRixNQUF4QixFQUFnQ0MsS0FBaEMsRUFBdUNPLElBQXZDLENBQVo7QUFDQSxNQUFLMUMsVUFBTCxDQUFnQnNILGFBQWhCLENBQThCaEgsS0FBOUIsRUFBcUMsVUFBVUUsS0FBVixFQUFpQkMsUUFBakIsRUFBMkI7QUFDL0QsU0FBT0YsU0FBU0MsS0FBVCxFQUFnQkMsUUFBaEIsQ0FBUDtBQUNBLEVBRkQ7QUFHQSxDQUxEOztBQU9BWixLQUFLMkgsa0JBQUwsR0FBMEIsZ0JBQWdCQyxNQUFoQixFQUF3QjtBQUNqRCxLQUFJO0FBQ0gsU0FBTyxNQUFNLEtBQUt6SCxVQUFMLENBQWdCc0gsYUFBaEIsQ0FBOEJHLE1BQTlCLENBQWI7QUFDQSxFQUZELENBRUUsT0FBT2pILEtBQVAsRUFBYztBQUNmLE9BQUtOLE1BQUwsQ0FBWU0sS0FBWixDQUFrQixrQ0FBbEIsRUFBc0RBLEtBQXREO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7QUFDRCxDQVBEOztBQVNBOzs7O0FBSUFYLEtBQUs2SCxlQUFMLEdBQXVCLFVBQVV0RSxHQUFWLEVBQWV1RSxNQUFmLEVBQXVCQyxZQUF2QixFQUFxQztBQUMzRCxLQUFJWixNQUFNLEVBQVY7QUFDQSxLQUFJWSxZQUFKLEVBQWtCO0FBQ2pCWixNQUFJNUQsR0FBSixJQUFXLEVBQVg7QUFDQSxPQUFLLElBQUlyQyxLQUFULElBQWtCNEcsTUFBbEIsRUFBMEI7QUFDekJYLE9BQUk1RCxHQUFKLEVBQVNVLElBQVQsQ0FBYzZELE9BQU81RyxLQUFQLENBQWQ7QUFDQTtBQUNELEVBTEQsTUFLTztBQUNOaUcsTUFBSTVELEdBQUosSUFBV3VFLE1BQVg7QUFDQTtBQUNELFFBQU9YLEdBQVA7QUFDQSxDQVhEOztBQWFBbkgsS0FBSzBILGtCQUFMLEdBQTBCLFVBQVVwRyxLQUFWLEVBQWlCQyxJQUFqQixFQUF1QnNCLElBQXZCLEVBQTZCO0FBQ3RELEtBQUk7QUFDSCxNQUFJdUQsT0FBTyxFQUFYO0FBQ0EsTUFBSSxDQUFDdkUsS0FBS0MsT0FBTCxDQUFhUixLQUFiLENBQUwsRUFBMEI7QUFDekI4RSxRQUFLOUUsS0FBTCxHQUFhQSxLQUFiO0FBQ0E7QUFDRCxNQUFJLENBQUNPLEtBQUtDLE9BQUwsQ0FBYVAsSUFBYixDQUFMLEVBQXlCO0FBQ3hCNkUsUUFBSzdFLElBQUwsR0FBWUEsSUFBWjtBQUNBO0FBQ0Q2RSxPQUFLdkQsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBT3VELElBQVA7QUFDQSxFQVZELENBVUUsT0FBT2pGLENBQVAsRUFBVTtBQUNYLFNBQU8sS0FBUDtBQUNBO0FBQ0QsQ0FkRDtBQWVBbkIsS0FBSytCLEdBQUwsR0FBVyxVQUFVVCxLQUFWLEVBQWlCQyxJQUFqQixFQUF1QkMsRUFBdkIsRUFBMkJnQixRQUEzQixFQUFxQztBQUMvQyxLQUFJd0YsT0FBTyxJQUFYO0FBQ0EsS0FBSXZILFFBQVEsS0FBS2lCLGFBQUwsQ0FBbUJKLEtBQW5CLEVBQTBCQyxJQUExQixFQUFnQ0MsRUFBaEMsQ0FBWjtBQUNBLEtBQUl5RyxXQUFXLFNBQVhBLFFBQVcsQ0FBVUMsT0FBVixFQUFtQkMsTUFBbkIsRUFBMkI7QUFDekNILE9BQUs3SCxVQUFMLENBQWdCNEIsR0FBaEIsQ0FBb0J0QixLQUFwQixFQUEyQixVQUFVRSxLQUFWLEVBQWlCQyxRQUFqQixFQUEyQjtBQUNyRCxPQUFJO0FBQ0gsUUFBSUQsS0FBSixFQUFXO0FBQ1YsU0FBSSxPQUFPNkIsUUFBUCxLQUFvQixVQUF4QixFQUFvQztBQUNuQ0EsZUFBUyxLQUFULEVBQWdCUCxlQUFlckIsUUFBZixDQUFoQjtBQUNBLE1BRkQsTUFFTztBQUNOdUgsYUFBT3hILEtBQVA7QUFDQTtBQUNEO0FBQ0E7QUFDRCxRQUFJLE9BQU82QixRQUFQLEtBQW9CLFVBQXhCLEVBQW9DO0FBQ25DQSxjQUFTLEtBQVQsRUFBZ0JQLGVBQWVyQixRQUFmLENBQWhCO0FBQ0EsS0FGRCxNQUVPO0FBQ05zSCxhQUFRakcsZUFBZXJCLFFBQWYsQ0FBUjtBQUNBO0FBQ0QsSUFkRCxDQWNFLE9BQU9PLENBQVAsRUFBVTtBQUNYNkcsU0FBSzNILE1BQUwsQ0FBWU0sS0FBWixDQUFrQlEsQ0FBbEI7QUFDQWdILFdBQU94SCxLQUFQO0FBQ0E7QUFDRCxHQW5CRDtBQW9CQSxFQXJCRDtBQXNCQSxLQUFJLE9BQU9ELFFBQVAsS0FBb0IsVUFBeEIsRUFBb0M7QUFDbkN1SDtBQUNBO0FBQ0E7QUFDRCxRQUFPLElBQUlHLE9BQUosQ0FBWSxVQUFVRixPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUM3Q0YsV0FBU0MsT0FBVCxFQUFrQkMsTUFBbEI7QUFDQSxFQUZNLENBQVA7QUFHQSxDQWhDRDs7QUFrQ0FuSSxLQUFLcUksY0FBTCxHQUFzQixnQkFBZ0JoRyxNQUFoQixFQUF3QkMsS0FBeEIsRUFBK0JOLElBQS9CLEVBQXFDO0FBQzFELEtBQUk7QUFDSCxNQUFJb0UsT0FBTyxFQUFYO0FBQ0FBLE9BQUt2RCxJQUFMLEdBQVl5RixtQkFBbUJqRyxNQUFuQixFQUEyQkMsS0FBM0IsRUFBa0NOLElBQWxDLENBQVo7QUFDQSxNQUFJcEIsV0FBVyxNQUFNLEtBQUtULFVBQUwsQ0FBZ0JvSSxJQUFoQixDQUFxQm5DLElBQXJCLENBQXJCO0FBQ0EsU0FBT3hGLFFBQVA7QUFDQSxFQUxELENBS0UsT0FBT0QsS0FBUCxFQUFjO0FBQ2YsT0FBS04sTUFBTCxDQUFZTSxLQUFaLENBQWtCLDhCQUFsQixFQUFrREEsS0FBbEQ7QUFDQSxTQUFPLEtBQVA7QUFDQTtBQUNELENBVkQ7O0FBWUFYLEtBQUt3SSxTQUFMLEdBQWlCLGdCQUFnQjNGLElBQWhCLEVBQXNCSSxVQUF0QixFQUFrQztBQUNsRCxLQUFJO0FBQ0gsTUFBSW1ELE9BQU8sRUFBWDtBQUNBQSxPQUFLdkQsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsTUFBSUksY0FBY0MsT0FBT0MsSUFBUCxDQUFZRixVQUFaLEVBQXdCRyxNQUF4QixHQUFpQyxDQUFuRCxFQUFzRDtBQUNyREYsVUFBT0csTUFBUCxDQUFjK0MsSUFBZCxFQUFvQm5ELFVBQXBCO0FBQ0E7QUFDRCxNQUFJckMsV0FBVyxNQUFNLEtBQUtULFVBQUwsQ0FBZ0JvSSxJQUFoQixDQUFxQm5DLElBQXJCLENBQXJCO0FBQ0EsU0FBT3hGLFFBQVA7QUFDQSxFQVJELENBUUUsT0FBT0QsS0FBUCxFQUFjO0FBQ2YsT0FBS04sTUFBTCxDQUFZTSxLQUFaLENBQWtCLHlCQUFsQixFQUE2Q0EsS0FBN0M7QUFDQSxTQUFPLEtBQVA7QUFDQTtBQUNELENBYkQ7O0FBZUFYLEtBQUt5SSxnQkFBTCxHQUF3QixnQkFBZ0I1RixJQUFoQixFQUFzQjtBQUM3QyxLQUFJO0FBQ0gsTUFBSWpDLFdBQVcsTUFBTSxLQUFLVCxVQUFMLENBQWdCdUksT0FBaEIsQ0FBd0I3RixJQUF4QixDQUFyQjs7QUFFQSxNQUFJakMsWUFBWTBGLE1BQU1DLE9BQU4sQ0FBYzNGLFNBQVMrSCxTQUF2QixDQUFoQixFQUFtRDtBQUM5QyxjQUFPLEVBQVA7QUFBQSxPQUNEQSxTQURDLEdBQ2EvSCxRQURiLENBQ0QrSCxTQURDOztBQUVKLFFBQUssSUFBSXBGLEdBQVQsSUFBZ0JvRixTQUFoQixFQUEyQjtBQUMxQixRQUFJQyxPQUFPRCxVQUFVcEYsR0FBVixDQUFYO0FBQUEsUUFDQzFDLFVBQVVDLG1CQUFtQjhILElBQW5CLENBRFg7QUFBQSxRQUVDN0gsZUFBZTZILEtBQUs3SCxZQUZyQjtBQUdBLFFBQUksUUFBUUEsWUFBUixJQUF3QixPQUFPQSxZQUFQLEtBQXdCLFdBQXBELEVBQWlFO0FBQ2hFRixhQUFRLE1BQVIsSUFBa0JFLFlBQWxCO0FBQ0E7QUFDRDhILFNBQUs1RSxJQUFMLENBQVVwRCxPQUFWO0FBQ0E7QUFDRCxVQUFPZ0ksSUFBUDtBQUNBLEdBYkQsTUFhTztBQUNOLFVBQU8sS0FBUDtBQUNBO0FBQ0QsRUFuQkQsQ0FtQkUsT0FBT2xJLEtBQVAsRUFBYztBQUNmLE9BQUtOLE1BQUwsQ0FBWU0sS0FBWixDQUFrQixxQ0FBbEIsRUFBeURBLEtBQXpEO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7QUFDRCxDQXhCRDs7QUEwQkE7O0FBRUE7O0FBRUEsU0FBUzJILGtCQUFULENBQTRCaEgsS0FBNUIsRUFBbUNDLElBQW5DLEVBQXlDUyxJQUF6QyxFQUErQztBQUM5QyxLQUFJYSxPQUFPLEVBQVg7QUFBQSxLQUNDdkIsUUFBUSxFQUFFQSxPQUFPLEVBQUVlLFFBQVFmLEtBQVYsRUFBaUJnQixPQUFPZixJQUF4QixFQUFULEVBRFQ7QUFFQSxLQUFJLENBQUMrRSxNQUFNQyxPQUFOLENBQWN2RSxJQUFkLENBQUwsRUFBMEIsT0FBT2EsSUFBUDtBQUMxQixNQUFLLElBQUlVLEdBQVQsSUFBZ0J2QixJQUFoQixFQUFzQjtBQUNyQixNQUFJZSxTQUFTZixLQUFLdUIsR0FBTCxDQUFiO0FBQ0FWLE9BQUtvQixJQUFMLENBQVUzQyxLQUFWO0FBQ0F1QixPQUFLb0IsSUFBTCxDQUFVbEIsTUFBVjtBQUNBO0FBQ0QsUUFBT0YsSUFBUDtBQUNBOztBQUVELFNBQVNaLGNBQVQsQ0FBd0JyQixRQUF4QixFQUFrQztBQUNqQyxLQUFJbUMsU0FBUyxFQUFiO0FBQ0EsS0FBSTZFLFNBQVNoSCxTQUFTeUYsT0FBdEI7QUFDQSxNQUFLLElBQUl5QyxRQUFULElBQXFCbEIsTUFBckIsRUFBNkI7QUFDNUI3RSxTQUFPK0YsUUFBUCxJQUFtQmxCLE9BQU9rQixRQUFQLENBQW5CO0FBQ0E7QUFDRC9GLFFBQU96QixLQUFQLEdBQWVWLFNBQVN5QixNQUF4QjtBQUNBVSxRQUFPeEIsSUFBUCxHQUFjWCxTQUFTMEIsS0FBdkI7QUFDQVMsUUFBT3ZCLEVBQVAsR0FBWVosU0FBUzJCLEdBQXJCO0FBQ0FRLFFBQU9nRyxlQUFQLEdBQXlCbkksU0FBU29JLFFBQWxDO0FBQ0EsUUFBT2pHLE1BQVA7QUFDQTtBQUNELFNBQVNqQyxrQkFBVCxDQUE0QkYsUUFBNUIsRUFBc0M7QUFDckMsS0FBSXFJLE9BQU9ySSxTQUFTcUksSUFBcEI7QUFDQSxLQUFJQyxVQUFVLEVBQWQ7QUFDQSxLQUFJbkksZUFBZUgsU0FBU0csWUFBNUI7QUFDQSxLQUFJQSxnQkFBZ0JBLGFBQWFvSSxXQUE3QixJQUE0Q3BJLGFBQWFvSSxXQUFiLENBQXlCRCxPQUF6RSxFQUFrRjtBQUNqRkEsWUFBVXRJLFNBQVNHLFlBQVQsQ0FBc0JvSSxXQUF0QixDQUFrQ0QsT0FBNUM7QUFDQTtBQUNELEtBQUlFLFFBQVFILEtBQUtHLEtBQWpCO0FBQ0EsS0FBSUMsaUJBQWlCLENBQXJCO0FBQ0EsS0FBSXRJLGdCQUFnQkEsYUFBYXFJLEtBQTdCLElBQXNDckksYUFBYXFJLEtBQWIsQ0FBbUJsSSxLQUE3RCxFQUFvRTtBQUNuRW1JLG1CQUFpQnRJLGFBQWFxSSxLQUFiLENBQW1CbEksS0FBcEM7QUFDQTtBQUNELEtBQUlMLFVBQVUsRUFBRXVJLE9BQU9BLEtBQVQsRUFBZ0JwSCxNQUFNLEVBQXRCLEVBQTBCc0gsZUFBZSxFQUF6QyxFQUE2Q0QsZ0JBQWdCQSxjQUE3RCxFQUFkO0FBQ0EsS0FBSUgsT0FBSixFQUFhO0FBQ1osT0FBSyxJQUFJSyxNQUFULElBQW1CTCxPQUFuQixFQUE0QjtBQUMzQixPQUFJTSxjQUFjTixRQUFRSyxNQUFSLENBQWxCO0FBQ0EsT0FBSUMsV0FBSixFQUFpQjtBQUNoQixRQUFJQyxVQUFVRCxZQUFZQyxPQUExQjtBQUNBLFFBQUksQ0FBQ0EsT0FBTCxFQUFjO0FBQ2QsUUFBSUMsV0FBV0QsUUFBUVIsSUFBdkI7QUFDQSxTQUFLLElBQUlVLEdBQVQsSUFBZ0JELFNBQVNULElBQXpCLEVBQStCO0FBQzlCLFNBQUk5QixNQUFNdUMsU0FBU1QsSUFBVCxDQUFjVSxHQUFkLENBQVY7QUFDQSxTQUFJNUcsU0FBUyxFQUFiO0FBQ0EsU0FBSTZFLFNBQVNULElBQUlkLE9BQWpCO0FBQ0F0RCxZQUFPekIsS0FBUCxHQUFlcUksSUFBSXRILE1BQW5CO0FBQ0FVLFlBQU94QixJQUFQLEdBQWM0RixJQUFJN0UsS0FBbEI7QUFDQVMsWUFBT3ZCLEVBQVAsR0FBWTJGLElBQUk1RSxHQUFoQjtBQUNBUSxZQUFPNkcsTUFBUCxHQUFnQnpDLElBQUk1RSxHQUFwQjtBQUNBLFVBQUssSUFBSXVHLFFBQVQsSUFBcUJsQixNQUFyQixFQUE2QjtBQUM1QjdFLGFBQU8rRixRQUFQLElBQW1CbEIsT0FBT2tCLFFBQVAsQ0FBbkI7QUFDQTtBQUNEakksYUFBUXlJLGFBQVIsQ0FBc0JyRixJQUF0QixDQUEyQmxCLE1BQTNCO0FBQ0E7QUFDRDtBQUNEO0FBRUQ7QUFDRCxNQUFLLElBQUk0RyxHQUFULElBQWdCVixLQUFLQSxJQUFyQixFQUEyQjtBQUMxQixNQUFJOUIsTUFBTThCLEtBQUtBLElBQUwsQ0FBVVUsR0FBVixDQUFWO0FBQ0EsTUFBSTVHLFNBQVMsRUFBYjtBQUNBLE1BQUk2RSxTQUFTVCxJQUFJZCxPQUFqQjtBQUNBdEQsU0FBT2dHLGVBQVAsR0FBMEI1QixJQUFJNkIsUUFBTCxHQUFpQjdCLElBQUk2QixRQUFyQixHQUFnQyxJQUF6RDtBQUNBLE9BQUssSUFBSUYsUUFBVCxJQUFxQmxCLE1BQXJCLEVBQTZCO0FBQzVCN0UsVUFBTytGLFFBQVAsSUFBbUJsQixPQUFPa0IsUUFBUCxDQUFuQjtBQUNBO0FBQ0QvRixTQUFPekIsS0FBUCxHQUFlcUksSUFBSXRILE1BQW5CO0FBQ0FVLFNBQU94QixJQUFQLEdBQWM0RixJQUFJN0UsS0FBbEI7QUFDQVMsU0FBT3ZCLEVBQVAsR0FBWTJGLElBQUk1RSxHQUFoQjtBQUNBUSxTQUFPNkcsTUFBUCxHQUFnQnpDLElBQUk1RSxHQUFwQjtBQUNBMUIsVUFBUW1CLElBQVIsQ0FBYWlDLElBQWIsQ0FBa0JsQixNQUFsQjtBQUNBO0FBQ0QsUUFBT2xDLE9BQVA7QUFDQTtBQUNEYixLQUFLNkosY0FBTCxHQUFzQixVQUFVdkksS0FBVixFQUFpQkMsSUFBakIsRUFBdUJxRSxJQUF2QixFQUE2QkMsT0FBN0IsRUFBc0NDLEtBQXRDLEVBQTZDQyxZQUE3QyxFQUFnRztBQUFBLEtBQXJDK0QsVUFBcUMsdUVBQXhCLEVBQXdCO0FBQUEsS0FBcEJDLFVBQW9CLHVFQUFQLEtBQU87OztBQUVySCxLQUFJO0FBQ0gsTUFBTTVELGlCQUFpQixDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLFFBQW5CLEVBQTZCLFVBQTdCLENBQXZCO0FBQ0EsTUFBSUMsT0FBTztBQUNWQyxZQUFTTjtBQURDLEdBQVg7QUFHQSxNQUFJLENBQUNsRSxLQUFLQyxPQUFMLENBQWFSLEtBQWIsQ0FBTCxFQUEwQjtBQUN6QjhFLFFBQUs5RSxLQUFMLEdBQWFBLEtBQWI7QUFDQTtBQUNELE1BQUksQ0FBQ08sS0FBS0MsT0FBTCxDQUFhUCxJQUFiLENBQUwsRUFBeUI7QUFDeEI2RSxRQUFLN0UsSUFBTCxHQUFZQSxJQUFaO0FBQ0E7QUFDRCxNQUFJK0UsTUFBTUMsT0FBTixDQUFjUixZQUFkLEtBQStCQSxhQUFhM0MsTUFBYixHQUFzQixDQUF6RCxFQUE0RDtBQUMzRGdELFFBQUtDLE9BQUwsR0FBZU4sWUFBZjtBQUNBO0FBQ0QsTUFBSSxPQUFPSCxJQUFQLEtBQWdCLFdBQWhCLElBQStCQSxRQUFRLElBQTNDLEVBQWlEO0FBQ2hEUSxRQUFLUixJQUFMLEdBQVlBLElBQVo7QUFDQVEsUUFBS0gsSUFBTCxHQUFZLEVBQVo7QUFDQTtBQUNELE1BQUl4RixRQUFRLEVBQVo7QUFDQUEsUUFBTStGLElBQU4sR0FBYSxFQUFiO0FBQ0EsT0FBSyxJQUFJakQsR0FBVCxJQUFnQjRDLGNBQWhCLEVBQWdDO0FBQy9CLE9BQUlNLGdCQUFnQk4sZUFBZTVDLEdBQWYsQ0FBcEI7QUFDQSxPQUFJLE9BQU9zQyxRQUFRWSxhQUFSLENBQVAsS0FBa0MsV0FBbEMsSUFBaUQsT0FBT1osUUFBUVksYUFBUixDQUFQLEtBQWtDLFdBQXZGLEVBQW9HO0FBQ25HaEcsVUFBTStGLElBQU4sQ0FBV0MsYUFBWCxJQUE0QlosUUFBUVksYUFBUixDQUE1QjtBQUNBO0FBQ0Q7QUFDRCxNQUFJNUUsS0FBSzZFLGFBQUwsQ0FBbUJqRyxNQUFNK0YsSUFBekIsQ0FBSixFQUFvQyxDQUVuQzs7QUFFRCxNQUFJM0QsT0FBTyxFQUFYO0FBQ0EsTUFBSXlELE1BQU1DLE9BQU4sQ0FBY1QsS0FBZCxLQUF3QkEsTUFBTTFDLE1BQU4sR0FBZSxDQUEzQyxFQUE4QztBQUM3Q1AsUUFBSzhELElBQUwsR0FBWWIsS0FBWjtBQUNBO0FBQ0QsTUFBSWlFLGVBQWUsSUFBbkIsRUFBeUI7QUFDeEJsSCxRQUFLcEIsT0FBTCxHQUFlLElBQWY7QUFDQTtBQUNEb0IsT0FBS3BDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLE1BQUksQ0FBQ29CLEtBQUtDLE9BQUwsQ0FBYWdJLFVBQWIsQ0FBTCxFQUErQjtBQUM5QmpILFFBQUs3QixJQUFMLEdBQVk7QUFDWCxtQkFBZTtBQUNkLGNBQVM7QUFDUixlQUFTOEksVUFERDtBQUVSLGNBQVE7QUFGQSxNQURLO0FBS2QsYUFBUTtBQUNQLGlCQUFXO0FBQ1YsbUJBQVk7QUFDWCxnQkFBUSxDQURHO0FBRVgsZ0JBQVEsQ0FDUDtBQUNDLHlCQUFnQjtBQUNmLG1CQUFTO0FBRE07QUFEakIsU0FETztBQUZHO0FBREY7QUFESjtBQUxNLEtBREo7QUFxQlgsYUFBUztBQUNSLG9CQUFlO0FBQ2QsZUFBU0E7QUFESztBQURQO0FBckJFLElBQVo7QUEyQkE7QUFDRDFELE9BQUt2RCxJQUFMLEdBQVlBLElBQVo7QUFDQTtBQUNBLFNBQU91RCxJQUFQO0FBQ0EsRUF0RUQsQ0FzRUUsT0FBT2pGLENBQVAsRUFBVTtBQUNYLFNBQU8sS0FBUDtBQUNBO0FBQ0QsQ0EzRUQ7QUE0RUE2SSxPQUFPQyxPQUFQLEdBQWlCakssSUFBakIiLCJmaWxlIjoiRWxhc1Byb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBodHRwOi8vdXNlanNkb2Mub3JnL1xuICovXG4vLyBn4buNaSB0aMawIHZp4buHbiBlbGFzdGljc2VhcmNoXG52YXIgZWxhc3RpY3NlYXJjaCA9IHJlcXVpcmUoJ2VsYXN0aWNzZWFyY2gnKTtcbnZhciBlbGFzID0gZnVuY3Rpb24gKGNvbmZpZykge1xufTtcbmVsYXMuY29ubmVjdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcblx0Ly8gIHRoaXMubG9nZ2VyLmVycm9yKGNvbmZpZyk7XG5cdHRoaXMuZWxhc0NsaWVudCA9IG5ldyBlbGFzdGljc2VhcmNoLkNsaWVudChjb25maWcpO1xuXHR0aGlzLmxvZ2dlciA9IEZMTG9nZ2VyLmdldExvZ2dlcihcImVsYXN0aWNzZWFyY2gubG9nXCIpO1xufVxuXG4vKipcbiAqIGdldCBhcnJheSByZXN1bHQgZGF0YVxuICovXG4vLyBlbGFzLmluaXRQcm9taXNlID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XG4vLyBcdHRyeSB7XG4vLyBcdFx0bGV0IHNlbGYgPSB0aGlzO1xuLy8gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4vLyAgICAgICAgICAgICBzZWxmLmVsYXNDbGllbnQuc2VhcmNoKHF1ZXJ5LCBmdW5jdGlvbiAoZXJyb3IsIHJlc3BvbnNlKSB7XG4vLyBcdFx0XHRcdHRyeXtcbi8vIFx0XHRcdFx0XHRpZiAoZXJyb3IpIHtcbi8vIFx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG4vLyBcdFx0XHRcdFx0XHRyZXR1cm47XG4vLyBcdFx0XHRcdFx0fVxuLy8gXHRcdFx0XHRcdHZhciByZWNvcmRzID0gY29udmVydERhdGFMaXN0T2JqKHJlc3BvbnNlKTtcbi8vIFx0XHRcdFx0XHR2YXIgYWdncmVnYXRpb25zID0gcmVzcG9uc2UuYWdncmVnYXRpb25zO1xuLy8gXHRcdFx0XHRcdGlmIChudWxsICE9IGFnZ3JlZ2F0aW9ucyAmJiB0eXBlb2YgYWdncmVnYXRpb25zICE9PSAndW5kZWZpbmVkJykge1xuLy8gXHRcdFx0XHRcdFx0Zm9yICh2YXIgYWdncyBpbiBhZ2dyZWdhdGlvbnMpIHtcbi8vIFx0XHRcdFx0XHRcdFx0dmFyIGFnZyA9IGFnZ3JlZ2F0aW9uc1thZ2dzXTtcbi8vIFx0XHRcdFx0XHRcdFx0dmFyIHZhbHVlID0gYWdnWyd2YWx1ZSddO1xuLy8gXHRcdFx0XHRcdFx0XHRpZiAobnVsbCAhPSB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4vLyBcdFx0XHRcdFx0XHRcdFx0cmVjb3Jkc1thZ2dzXSA9IHZhbHVlO1xuLy8gXHRcdFx0XHRcdFx0XHR9XG4vLyBcdFx0XHRcdFx0XHR9XG4vLyBcdFx0XHRcdFx0fVxuLy8gXHRcdFx0XHRcdHJlc29sdmUocmVjb3Jkcyk7XG4vLyBcdFx0XHRcdH1jYXRjaChlKXtcbi8vIFx0XHRcdFx0XHQgdGhpcy5sb2dnZXIuZXJyb3IoZSk7XG4vLyBcdFx0XHRcdH1cbi8vIFx0XHRcdH0pO1xuLy8gICAgICAgICB9KVxuXG4vLyBcdH0gY2F0Y2ggKGUpIHtcbi8vIFx0XHQgdGhpcy5sb2dnZXIuZXJyb3IoZSk7XG4vLyBcdH1cbi8vIH1cbi8qKlxuICogZ2V0IGFycmF5IHJlc3VsdCBkYXRhXG4gKi9cbmVsYXMuc2VhcmNoID0gZnVuY3Rpb24gKHF1ZXJ5LCBjYWxsYmFjaykge1xuXHR0cnkge1xuXHRcdHRoaXMuZWxhc0NsaWVudC5zZWFyY2gocXVlcnksIGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UpIHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sodHJ1ZSwgZXJyb3IpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHZhciByZWNvcmRzID0gY29udmVydERhdGFMaXN0T2JqKHJlc3BvbnNlKTtcblx0XHRcdFx0dmFyIGFnZ3JlZ2F0aW9ucyA9IHJlc3BvbnNlLmFnZ3JlZ2F0aW9ucztcblx0XHRcdFx0aWYgKG51bGwgIT0gYWdncmVnYXRpb25zICYmIHR5cGVvZiBhZ2dyZWdhdGlvbnMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgYWdncyBpbiBhZ2dyZWdhdGlvbnMpIHtcblx0XHRcdFx0XHRcdHZhciBhZ2cgPSBhZ2dyZWdhdGlvbnNbYWdnc107XG5cdFx0XHRcdFx0XHR2YXIgdmFsdWUgPSBhZ2dbJ3ZhbHVlJ107XG5cdFx0XHRcdFx0XHRpZiAobnVsbCAhPSB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRcdHJlY29yZHNbYWdnc10gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNhbGxiYWNrKGZhbHNlLCByZWNvcmRzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNhbGxiYWNrKHRydWUsIGVycm9yKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XG5cdFx0Y2FsbGJhY2soZSwgdHJ1ZSk7XG5cdH1cbn1cblxuZWxhcy5zZWFyY2hBc3luYyA9IGFzeW5jIGZ1bmN0aW9uIChxdWVyeSkge1xuXHR0cnkge1xuXHRcdHZhciByZXNwb25zZSA9IGF3YWl0IHRoaXMuZWxhc0NsaWVudC5zZWFyY2gocXVlcnkpO1xuXHRcdGlmIChyZXNwb25zZSkge1xuXHRcdFx0dmFyIHJlY29yZHMgPSBjb252ZXJ0RGF0YUxpc3RPYmoocmVzcG9uc2UpO1xuXHRcdFx0dmFyIGFnZ3JlZ2F0aW9ucyA9IHJlc3BvbnNlLmFnZ3JlZ2F0aW9ucztcblx0XHRcdGlmIChudWxsICE9IGFnZ3JlZ2F0aW9ucyAmJiB0eXBlb2YgYWdncmVnYXRpb25zICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRmb3IgKHZhciBhZ2dzIGluIGFnZ3JlZ2F0aW9ucykge1xuXHRcdFx0XHRcdHZhciBhZ2cgPSBhZ2dyZWdhdGlvbnNbYWdnc107XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gYWdnWyd2YWx1ZSddO1xuXHRcdFx0XHRcdGlmIChudWxsICE9IHZhbHVlICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdHJlY29yZHNbYWdnc10gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiByZWNvcmRzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9IGNhdGNoIChlKSB7XG5cdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbmVsYXMuZ2V0QXN5bmMgPSBhc3luYyBmdW5jdGlvbiAoaW5kZXgsIHR5cGUsIGlkLCB2ZXJzaW9uKSB7XG5cdHRyeSB7XG5cdFx0bGV0IHF1ZXJ5ID0gdGhpcy5idWlsZFF1ZXJ5R2V0KGluZGV4LCB0eXBlLCBpZCk7XG5cdFx0bGV0IGV4aXN0ID0gYXdhaXQgdGhpcy5lbGFzQ2xpZW50LmV4aXN0cyhxdWVyeSk7XG5cdFx0aWYgKCFleGlzdCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoIUxpYnMuaXNCbGFuayh2ZXJzaW9uKSkge1xuXHRcdFx0cXVlcnkudmVyc2lvbiA9IHZlcnNpb247XG5cdFx0fVxuXHRcdGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZWxhc0NsaWVudC5nZXQocXVlcnkpO1xuXHRcdGxldCBkYXRhID0gY29udmVydERhdGFPYmoocmVzcG9uc2UpO1xuXHRcdHJldHVybiBkYXRhO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRoaXMubG9nZ2VyLmVycm9yKFwiRWxhc1Byb3ZpZGVyLmVsYXMuZ2V0QXN5bmM6XCIsIGVycm9yKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuXG4vKipcbiAqIGdldCBhcnJheSByZXN1bHQgZGF0YVxuICovXG4vLyBlbGFzLnNlYXJjaEFzeW5jID0gYXN5bmMgZnVuY3Rpb24gKHF1ZXJ5LCBjYWxsYmFjaykge1xuLy8gXHR2YXIgaW5pdGlhbGl6ZVByb21pc2UgPSBhd2FpdCB0aGlzLmluaXRQcm9taXNlKHF1ZXJ5KTtcbi8vIFx0IHRoaXMubG9nZ2VyLmVycm9yKFwiaW5pdGlhbGl6ZVByb21pc2U6IFwiLGluaXRpYWxpemVQcm9taXNlKVxuLy8gICAgIHJldHVybiBpbml0aWFsaXplUHJvbWlzZS5kYXRhO1xuLy8gfVxuXG5lbGFzLmNvdW50ID0gZnVuY3Rpb24gKHF1ZXJ5LCBjYWxsYmFjaykge1xuXHRpZiAoIWNhbGxiYWNrICYmIHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybjtcblx0fVxuXHR0cnkge1xuXHRcdHRoaXMuZWxhc0NsaWVudC5jb3VudChxdWVyeSwgZnVuY3Rpb24gKGVycm9yLCByZXNwb25zZSkge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdHJldHVybiBjYWxsYmFjayh0cnVlLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0XHRpZiAocmVzcG9uc2UpIHtcblx0XHRcdFx0Y2FsbGJhY2soZmFsc2UsIHJlc3BvbnNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNhbGxiYWNrKHRydWUsIGVycm9yKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xuXHRcdGNhbGxiYWNrKGUsIHRydWUpO1xuXHR9XG59XG5cbmVsYXMuY291bnRBc3luYyA9IGFzeW5jIGZ1bmN0aW9uIChxdWVyeSkge1xuXHR0cnkge1xuXHRcdGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZWxhc0NsaWVudC5jb3VudChxdWVyeSk7XG5cdFx0aWYgKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuY291bnQ7XG5cdFx0fVxuXHRcdHJldHVybiAwO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0dGhpcy5sb2dnZXIuZXJyb3IoXCJFbGFzUHJvdmlkZXIuZWxhcy5jb3VudEFzeW5jOlwiLCBlKTtcblx0XHRyZXR1cm4gMDtcblx0fVxufVxuXG5cbmVsYXMuZGVsID0gZnVuY3Rpb24gKF9pbmRleCwgX3R5cGUsIF9pZCwgY2FsbEJhY2spIHtcblx0dGhpcy5lbGFzQ2xpZW50LmRlbGV0ZSh7IGluZGV4OiBfaW5kZXgsIHR5cGU6IF90eXBlLCBpZDogX2lkIH0sIGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UpIHtcblx0XHRjYWxsQmFjayhlcnJvciwgcmVzcG9uc2UpO1xuXHR9KTtcbn1cblxuZWxhcy5kZWxldGVCeURvY0lkQXN5bmMgPSBhc3luYyBmdW5jdGlvbiAoX2luZGV4LCBfdHlwZSwgX2lkKSB7XG5cdHRyeSB7XG5cdFx0dmFyIHJlc3BvbnNlID0gdGhpcy5lbGFzQ2xpZW50LmRlbGV0ZSh7IGluZGV4OiBfaW5kZXgsIHR5cGU6IF90eXBlLCBpZDogX2lkIH0pO1xuXHRcdGlmICghcmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3BvbnNlO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRoaXMubG9nZ2VyLmVycm9yKFwiRWxhc1Byb3ZpZGVyLmVsYXMuZGVsZXRlQnlEb2NJZEFzeW5jOlwiLCBlcnJvcik7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbmVsYXMuZGVsZXRlQnlRdWVyeSA9IGZ1bmN0aW9uIChfaW5kZXgsIF90eXBlLCBfcXVlcnksIGNhbGxCYWNrKSB7XG5cdHZhciBib2R5ID0geyBxdWVyeTogX3F1ZXJ5IH07XG5cdHRoaXMuZWxhc0NsaWVudC5kZWxldGVCeVF1ZXJ5KHsgaW5kZXg6IF9pbmRleCwgdHlwZTogX3R5cGUsIGJvZHk6IGJvZHkgfSwgZnVuY3Rpb24gKGVycm9yLCByZXNwb25zZSkge1xuXHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGNhbGxCYWNrKGVycm9yLCByZXNwb25zZSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZWxhcy5zZXQgPSBmdW5jdGlvbiAoX2luZGV4LCBfdHlwZSwgZGF0YSwgY2FsbGJhY2spIHtcblx0dmFyIHJlY29yZCA9IHsgaW5kZXg6IF9pbmRleCwgdHlwZTogX3R5cGUsIGJvZHk6IGRhdGEgfTtcblx0aWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgZGF0YSAhPT0gJ1N0cmluZycpIHtcblx0XHR2YXIgaWQgPSBkYXRhWydpZCddO1xuXHRcdGlmIChpZCAhPSBudWxsICYmIHR5cGVvZiBpZCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHJlY29yZC5pZCA9IGlkO1xuXHRcdH1cblx0fVxuXHR0aGlzLmVsYXNDbGllbnQuaW5kZXgocmVjb3JkLCBmdW5jdGlvbiAoZXJyb3IsIHJlc3BvbnNlKSB7XG5cdFx0aWYgKHJlc3BvbnNlKSB7XG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y2FsbGJhY2soZmFsc2UsIHJlc3BvbnNlKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGNhbGxiYWNrKHRydWUsIGVycm9yKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufVxuXG5lbGFzLnNldEFzeW5jID0gYXN5bmMgZnVuY3Rpb24gKF9pbmRleCwgX3R5cGUsIGRhdGEsIHBhcmFtZXRlcnMpIHtcblx0dHJ5IHtcblx0XHR2YXIgcmVjb3JkID0geyBpbmRleDogX2luZGV4LCB0eXBlOiBfdHlwZSwgYm9keTogZGF0YSB9O1xuXHRcdGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGRhdGEgIT09ICdTdHJpbmcnKSB7XG5cdFx0XHR2YXIgaWQgPSBkYXRhWydpZCddO1xuXHRcdFx0aWYgKGlkICE9IG51bGwgJiYgdHlwZW9mIGlkICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZWNvcmQuaWQgPSBpZDtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHBhcmFtZXRlcnMgJiYgT2JqZWN0LmtleXMocGFyYW1ldGVycykubGVuZ3RoID4gMCkge1xuXHRcdFx0T2JqZWN0LmFzc2lnbihyZWNvcmQsIHBhcmFtZXRlcnMpO1xuXHRcdH1cblx0XHR2YXIgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVsYXNDbGllbnQuaW5kZXgocmVjb3JkKTtcblx0XHRyZXR1cm4gcmVzcG9uc2U7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhpcy5sb2dnZXIuZXJyb3IoXCJFbGFzUHJvdmlkZXIuc2V0QXN5bmM6XCIsIGVycm9yKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuLyoqXG4gKiBVc2UgZm9yIGxvZyBldmVudFxuICogQHBhcmFtIHtTdHJpbmd9IF9pbmRleCBcbiAqIEBwYXJhbSB7U3RyaW5nfSBfdHlwZSBcbiAqIEBwYXJhbSB7YW55fSBkYXRhIFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgXG4gKi9cbmVsYXMuc2V0SWdub3JlSWRLZXkgPSBmdW5jdGlvbiAoX2luZGV4LCBfdHlwZSwgZGF0YSwgY2FsbGJhY2spIHtcblx0dmFyIHJlY29yZCA9IHsgaW5kZXg6IF9pbmRleCwgdHlwZTogX3R5cGUsIGJvZHk6IGRhdGEgfTtcblx0aWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgZGF0YSAhPT0gJ1N0cmluZycpIHtcblx0XHR2YXIga2V5ID0gZGF0YVsna2V5J107XG5cdFx0aWYgKGtleSAhPSBudWxsICYmIHR5cGVvZiBrZXkgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRyZWNvcmQuaWQgPSBrZXk7XG5cdFx0fVxuXHR9XG5cdHRoaXMuZWxhc0NsaWVudC5pbmRleChyZWNvcmQsIGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UpIHtcblx0XHRpZiAocmVzcG9uc2UpIHtcblx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRjYWxsYmFjayhmYWxzZSwgcmVzcG9uc2UpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y2FsbGJhY2sodHJ1ZSwgZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5lbGFzLnNldElkID0gZnVuY3Rpb24gKF9pbmRleCwgX3R5cGUsIF9pZCwgZGF0YSwgY2FsbGJhY2spIHtcblx0dGhpcy5lbGFzQ2xpZW50LmluZGV4KHtcblx0XHRpbmRleDogX2luZGV4LFxuXHRcdHR5cGU6IF90eXBlLFxuXHRcdGlkOiBfaWQsXG5cdFx0Ym9keTogZGF0YVxuXHR9LCBmdW5jdGlvbiAoZXJyb3IsIHJlc3BvbnNlKSB7XG5cdFx0aWYgKHJlc3BvbnNlKSB7XG5cdFx0XHRjYWxsYmFjayhmYWxzZSwgcmVzcG9uc2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjYWxsYmFjayh0cnVlLCBlcnJvcik7XG5cdFx0fVxuXHR9KTtcbn1cbmVsYXMuc2V0SWRBc3luYyA9IGFzeW5jIGZ1bmN0aW9uIChfaW5kZXgsIF90eXBlLCBfaWQsIGRhdGEpIHtcblx0dHJ5IHtcblx0XHR2YXIgcmVjb3JkID0ge1xuXHRcdFx0aW5kZXg6IF9pbmRleCxcblx0XHRcdHR5cGU6IF90eXBlLFxuXHRcdFx0aWQ6IF9pZCxcblx0XHRcdGJvZHk6IGRhdGFcblx0XHR9O1xuXHRcdGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGRhdGEgIT09ICdTdHJpbmcnKSB7XG5cdFx0XHR2YXIgaWQgPSBkYXRhWydpZCddO1xuXHRcdFx0aWYgKGlkICE9IG51bGwgJiYgdHlwZW9mIGlkICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZWNvcmQuaWQgPSBpZDtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIHJlc3BvbnNlID0gYXdhaXQgdGhpcy5lbGFzQ2xpZW50LmluZGV4KHJlY29yZCk7XG5cdFx0cmV0dXJuIHJlc3BvbnNlO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRoaXMubG9nZ2VyLmVycm9yKFwiRWxhc1Byb3ZpZGVyLnNldElkQXN5bmM6XCIsIGVycm9yKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cbmVsYXMuYnVpbGRTb3J0ID0gZnVuY3Rpb24gKGZpZWxkLCBpc1JldmVyc2VkKSB7XG5cdHZhciBzb3J0RmllbGQgPSB7fTtcblx0dmFyIG9yZGVyID0gaXNSZXZlcnNlZCA/IFwiZGVzY1wiIDogXCJhc2NcIjtcblx0c29ydEZpZWxkW2ZpZWxkXSA9IHtcblx0XHRcIm9yZGVyXCI6IG9yZGVyXG5cdH07XG5cdHJldHVybiBzb3J0RmllbGQ7XG59XG5cbmVsYXMuYnVpbGRGaWx0ZXJFeGlzdHMgPSBmdW5jdGlvbiAoYXJGaWVsZHMpIHtcblx0dmFyIGV4aXN0cyA9IFtdO1xuXHRmb3IgKHZhciBmaWVsZCBpbiBhckZpZWxkcykge1xuXHRcdHZhciBmaWVsZCA9IHsgZmllbGQ6IGFyRmllbGRzW2ZpZWxkXSB9XG5cdFx0dmFyIGV4aXN0ID0geyBleGlzdHM6IGZpZWxkIH1cblx0XHRleGlzdHMucHVzaChleGlzdCk7XG5cdH1cblx0cmV0dXJuIGV4aXN0cztcbn1cblxuZWxhcy5idWlsZEZpbHRlck1pc3NpbmcgPSBmdW5jdGlvbiAoZmllbGQpIHtcblx0dmFyIG1pc3NpbmcgPSB7fTtcblx0Ly8gbXVzdF9ub3Rcblx0bWlzc2luZy5taXNzaW5nID0ge1xuXHRcdGZpZWxkOiBmaWVsZCxcblx0XHRleGlzdGVuY2U6IHRydWUsXG5cdFx0bnVsbF92YWx1ZTogdHJ1ZVxuXHR9XG5cdHJldHVybiBtaXNzaW5nO1xufVxuXG5lbGFzLmJ1aWxkRmlsdGVyTXVzdCA9IGZ1bmN0aW9uIChhckZpZWxkcykge1xuXHR2YXIgbXVzdHMgPSBbXTtcblx0Zm9yICh2YXIgZmllbGQgaW4gYXJGaWVsZHMpIHtcblx0XHR2YXIgdGVybSA9IHsgW2ZpZWxkXTogYXJGaWVsZHNbZmllbGRdIH1cblx0XHR2YXIgbXVzdCA9IHsgdGVybTogdGVybSB9XG5cdFx0bXVzdHMucHVzaChtdXN0KTtcblx0fVxuXHQvLyBmb3IgKHZhciBrZXkgaW4gbXVzdHMpIHtcblx0Ly8gXHQgdGhpcy5sb2dnZXIuZXJyb3Ioa2V5LCBcIjogXCIsIG11c3RzW2tleV0pO1xuXHQvLyB9XG5cdHJldHVybiBtdXN0cztcbn1cblxuZWxhcy5idWlsZEZpbHRlck1hdGNoID0gZnVuY3Rpb24gKGZpZWxkLCB2YWwpIHtcblx0dmFyIG1hdGNoID0ge307XG5cdG1hdGNoW2ZpZWxkXSA9IHZhbFxuXHRyZXR1cm4geyBtYXRjaDogbWF0Y2ggfTtcblx0Ly9cdHZhciBtYXRjaHMgPSBbXTtcblx0Ly9cdGZvciAoIHZhciBmaWVsZCBpbiBhckZpZWxkcykge1xuXHQvL1x0XHR2YXIgbWF0Y2ggPSB7fTtcblx0Ly9cdFx0bWF0Y2hbZmllbGRdID0gYXJGaWVsZHNbZmllbGRdO1xuXHQvL1x0XHRtYXRjaHMucHVzaChtYXRjaCk7XG5cdC8vXHR9XG5cdC8vXHRyZXR1cm4gbWF0Y2hzO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nOiBEU0wgcXVlcnl9IHF1ZXJ5IFxuICogQHBhcmFtIHtzdHJpbmc6IGVsYXN0aWNzZWFyY2ggdHlwZX0gdHlwZSBcbiAqIEBwYXJhbSB7QXJyYXk6IHN0cmluZ1tdfSBmaWVsZHMgXG4gKiBAcGFyYW0ge3N0cmluZzogYW5kIHwgb3J9IG9wZXJhdG9yIFxuICovXG5lbGFzLmJ1aWxkTXVsdGlNYXRjaCA9IGZ1bmN0aW9uIChxdWVyeSwgdHlwZSwgZmllbGRzLCBvcGVyYXRvcikge1xuXHR2YXIgcSA9IHt9O1xuXHRxLm11bHRpX21hdGNoID0ge1xuXHRcdHF1ZXJ5OiBxdWVyeSxcblx0XHR0eXBlOiB0eXBlLFxuXHRcdGZpZWxkczogZmllbGRzLFxuXHRcdG9wZXJhdG9yOiBvcGVyYXRvclxuXHR9XG5cdHJldHVybiBxO1xufVxuXG5lbGFzLmJ1aWxkRmlsdGVyUmFuZ2UgPSBmdW5jdGlvbiAoa2V5LCBndGUsIGx0ZSkge1xuXHR2YXIgcmFuZ2VGaWVsZCA9IHt9O1xuXHR2YXIgcmFuZ2UgPSB7fTtcblx0cmFuZ2Vba2V5XSA9IHt9O1xuXG5cdGlmIChndGUpIHtcblx0XHRyYW5nZVtrZXldW1wiZ3RlXCJdID0gZ3RlO1xuXHR9XG5cdGlmIChsdGUpIHtcblx0XHRyYW5nZVtrZXldW1wibHRlXCJdID0gbHRlO1xuXHR9XG5cdHJhbmdlRmllbGRbXCJyYW5nZVwiXSA9IHJhbmdlO1xuXHRyZXR1cm4gcmFuZ2VGaWVsZDtcbn1cblxuZWxhcy5idWlsZEZpbHRlckdyZWF0ZXIgPSBmdW5jdGlvbiAoa2V5LCBndCkge1xuXHR2YXIgcmFuZ2VGaWVsZCA9IHt9O1xuXHR2YXIgcmFuZ2UgPSB7fTtcblx0cmFuZ2Vba2V5XSA9IHt9O1xuXG5cblx0cmFuZ2Vba2V5XVtcImd0XCJdID0gZ3Q7XG5cdHJhbmdlRmllbGRbXCJyYW5nZVwiXSA9IHJhbmdlO1xuXHRyZXR1cm4gcmFuZ2VGaWVsZDtcbn1cblxuZWxhcy5idWlsZEZpbHRlckxlc3MgPSBmdW5jdGlvbiAoa2V5LCBsdCkge1xuXHR2YXIgcmFuZ2VGaWVsZCA9IHt9O1xuXHR2YXIgcmFuZ2UgPSB7fTtcblx0cmFuZ2Vba2V5XSA9IHt9O1xuXG5cblx0cmFuZ2Vba2V5XVtcImx0XCJdID0gbHQ7XG5cdHJhbmdlRmllbGRbXCJyYW5nZVwiXSA9IHJhbmdlO1xuXHRyZXR1cm4gcmFuZ2VGaWVsZDtcbn1cblxuZWxhcy5idWlsZFF1ZXJ5ID0gZnVuY3Rpb24gKGluZGV4LCB0eXBlLCBmcm9tLCBmaWx0ZXJzLCBzb3J0cywgc2VsZWN0RmllbGRzLCBnZXREb2NWZXJzaW9uID0gZmFsc2UsIHNpemUgPSAyMCwgc2NyaXB0ID0gbnVsbCkge1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgYm9vbFF1ZXJ5VHlwZXMgPSBbXCJtdXN0XCIsIFwiZmlsdGVyXCIsIFwic2hvdWxkXCIsIFwibXVzdF9ub3RcIl07XG5cdFx0dmFyIHdyYXAgPSB7XG5cdFx0XHRfc291cmNlOiBzZWxlY3RGaWVsZHNcblx0XHR9O1xuXHRcdGlmICghTGlicy5pc0JsYW5rKGluZGV4KSkge1xuXHRcdFx0d3JhcC5pbmRleCA9IGluZGV4O1xuXHRcdH1cblx0XHRpZiAoIUxpYnMuaXNCbGFuayh0eXBlKSkge1xuXHRcdFx0d3JhcC50eXBlID0gdHlwZTtcblx0XHR9XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0RmllbGRzKSAmJiBzZWxlY3RGaWVsZHMubGVuZ3RoID4gMCkge1xuXHRcdFx0d3JhcC5fc291cmNlID0gc2VsZWN0RmllbGRzO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGZyb20gIT09ICd1bmRlZmluZWQnICYmIGZyb20gIT0gbnVsbCkge1xuXHRcdFx0d3JhcC5mcm9tID0gZnJvbTtcblx0XHRcdHdyYXAuc2l6ZSA9IHNpemU7XG5cdFx0fVxuXHRcdHZhciBxdWVyeSA9IHt9O1xuXHRcdHF1ZXJ5LmJvb2wgPSB7fVxuXHRcdGZvciAobGV0IGtleSBpbiBib29sUXVlcnlUeXBlcykge1xuXHRcdFx0bGV0IGJvb2xRdWVyeVR5cGUgPSBib29sUXVlcnlUeXBlc1trZXldO1xuXHRcdFx0aWYgKHR5cGVvZiBmaWx0ZXJzW2Jvb2xRdWVyeVR5cGVdICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZmlsdGVyc1tib29sUXVlcnlUeXBlXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0cXVlcnkuYm9vbFtib29sUXVlcnlUeXBlXSA9IGZpbHRlcnNbYm9vbFF1ZXJ5VHlwZV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChMaWJzLmlzT2JqZWN0RW1wdHkocXVlcnkuYm9vbCkpIHtcblxuXHRcdH1cblxuXHRcdHZhciBib2R5ID0ge307XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoc29ydHMpICYmIHNvcnRzLmxlbmd0aCA+IDApIHtcblx0XHRcdGJvZHkuc29ydCA9IHNvcnRzO1xuXHRcdH1cblx0XHRpZiAoZ2V0RG9jVmVyc2lvbiA9PT0gdHJ1ZSkge1xuXHRcdFx0Ym9keS52ZXJzaW9uID0gdHJ1ZTsgLy8gc2V0IGPDoWMgZG9jdW1lbnQgxJHhu4F1IGPDsyB2ZXJzaW9uXG5cdFx0fVxuXG5cdFx0Ym9keS5xdWVyeSA9IHF1ZXJ5O1xuXHRcdGlmICh0eXBlb2Ygc2NyaXB0ID09PSAnb2JqZWN0JyAmJiBzY3JpcHQgIT0gbnVsbCkge1xuXHRcdFx0Ym9keS5zY3JpcHQgPSBzY3JpcHQ7XG5cdFx0fVxuXHRcdHdyYXAuYm9keSA9IGJvZHk7XG5cdFx0Ly9cdFx0SlNPTi5zdHJpbmdpZnkoYm9keSk7XG5cdFx0cmV0dXJuIHdyYXA7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuZWxhcy5idWlsZEN1c3RvbUJvZHkgPSBmdW5jdGlvbiAoaW5kZXgsIHR5cGUsIGZyb20sIGNvbmRpdGlvbnMsIHNlbGVjdEZpZWxkcykge1xuXG5cdHRyeSB7XG5cdFx0dmFyIHdyYXAgPSB7XG5cdFx0XHRfc291cmNlOiBzZWxlY3RGaWVsZHNcblx0XHR9O1xuXHRcdGlmICghTGlicy5pc0JsYW5rKGluZGV4KSkge1xuXHRcdFx0d3JhcC5pbmRleCA9IGluZGV4O1xuXHRcdH1cblx0XHRpZiAoIUxpYnMuaXNCbGFuayh0eXBlKSkge1xuXHRcdFx0d3JhcC50eXBlID0gdHlwZTtcblx0XHR9XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0RmllbGRzKSAmJiBzZWxlY3RGaWVsZHMubGVuZ3RoID4gMCkge1xuXHRcdFx0d3JhcC5fc291cmNlID0gc2VsZWN0RmllbGRzO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGZyb20gIT09ICd1bmRlZmluZWQnICYmIGZyb20gIT0gbnVsbCkge1xuXHRcdFx0d3JhcC5mcm9tID0gZnJvbTtcblx0XHRcdHdyYXAuc2l6ZSA9IDIwO1xuXHRcdH1cblx0XHR2YXIgcXVlcnkgPSB7fTtcblx0XHR2YXIgYm9keSA9IHt9O1xuXHRcdGlmIChMaWJzLmlzT2JqZWN0RW1wdHkocXVlcnkuYm9vbCkpIHtcblx0XHRcdGlmICghTGlicy5pc09iamVjdEVtcHR5KGNvbmRpdGlvbnMpKSB7XG5cdFx0XHRcdGJvZHkgPSBPYmplY3QuYXNzaWduKHt9LCBib2R5LCBjb25kaXRpb25zKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ym9keS52ZXJzaW9uID0gdHJ1ZTtcblx0XHR3cmFwLmJvZHkgPSBib2R5O1xuXHRcdHJldHVybiB3cmFwO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0dGhpcy5sb2dnZXIuZXJyb3IoXCJlXCIsIGUpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5lbGFzLmJ1aWxkUXVlcnlHZXQgPSBmdW5jdGlvbiAoaW5kZXgsIHR5cGUsIGlkLCBzZWxlY3RGaWVsZHMpIHtcblxuXHR0cnkge1xuXHRcdHZhciB3cmFwID0ge1xuXHRcdFx0Ly8gX3NvdXJjZTogc2VsZWN0RmllbGRzXG5cdFx0fTtcblx0XHRpZiAoIUxpYnMuaXNCbGFuayhpbmRleCkpIHtcblx0XHRcdHdyYXAuaW5kZXggPSBpbmRleDtcblx0XHR9XG5cdFx0aWYgKCFMaWJzLmlzQmxhbmsodHlwZSkpIHtcblx0XHRcdHdyYXAudHlwZSA9IHR5cGU7XG5cdFx0fVxuXHRcdGlmIChBcnJheS5pc0FycmF5KHNlbGVjdEZpZWxkcykgJiYgc2VsZWN0RmllbGRzLmxlbmd0aCA+IDApIHtcblx0XHRcdHdyYXAuX3NvdXJjZSA9IHNlbGVjdEZpZWxkcztcblx0XHR9XG5cdFx0d3JhcC5pZCA9IGlkO1xuXHRcdHJldHVybiB3cmFwO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cblxuZWxhcy5idWlsZFVwZGF0ZURvYyA9IGZ1bmN0aW9uIChpbmRleCwgdHlwZSwgaWQsIGRvYywgcGFyYW1ldGVycykge1xuXHR0cnkge1xuXHRcdHZhciB3cmFwID0ge1xuXG5cdFx0fTtcblx0XHRpZiAoIUxpYnMuaXNCbGFuayhpbmRleCkpIHtcblx0XHRcdHdyYXAuaW5kZXggPSBpbmRleDtcblx0XHR9XG5cdFx0aWYgKCFMaWJzLmlzQmxhbmsodHlwZSkpIHtcblx0XHRcdHdyYXAudHlwZSA9IHR5cGU7XG5cdFx0fVxuXG5cdFx0aWYgKCFMaWJzLmlzQmxhbmsoaWQpKSB7XG5cdFx0XHR3cmFwLmlkID0gaWQ7XG5cdFx0fVxuXG5cdFx0dmFyIGJvZHkgPSB7fTtcblx0XHRib2R5LmRvYyA9IGRvYztcblx0XHRpZiAocGFyYW1ldGVycyAmJiBPYmplY3Qua2V5cyhwYXJhbWV0ZXJzKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRPYmplY3QuYXNzaWduKHdyYXAsIHBhcmFtZXRlcnMpO1xuXHRcdH1cblx0XHR3cmFwLmJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcblx0XHRyZXR1cm4gd3JhcDtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5lbGFzLmJ1aWxkRG9jID0gZnVuY3Rpb24gKGZpZWxkcykge1xuXHR2YXIgb2JqID0ge307XG5cdGZvciAodmFyIGZpZWxkIGluIGZpZWxkcykge1xuXHRcdG9ialtmaWVsZF0gPSBmaWVsZHNbZmllbGRdO1xuXHR9XG5cdHJldHVybiBvYmo7XG59XG5cbmVsYXMudXBkYXRlQnlEb2MgPSBmdW5jdGlvbiAoX2luZGV4LCBfdHlwZSwgaWQsIGRvYywgY2FsbGJhY2spIHtcblx0dmFyIHF1ZXJ5ID0gZWxhcy5idWlsZFVwZGF0ZURvYyhfaW5kZXgsIF90eXBlLCBpZCwgZG9jKTtcblx0dGhpcy5lbGFzQ2xpZW50LnVwZGF0ZShxdWVyeSwgZnVuY3Rpb24gKGVycm9yLCByZXNwb25zZSkge1xuXHRcdHJldHVybiBjYWxsYmFjayhlcnJvciwgcmVzcG9uc2UpO1xuXHR9KTtcbn1cblxuZWxhcy51cGRhdGVCeURvY0FzeW5jID0gYXN5bmMgZnVuY3Rpb24gKF9pbmRleCwgX3R5cGUsIGlkLCBkb2MsIHBhcmFtZXRlcnMpIHtcblx0dHJ5IHtcblx0XHR2YXIgcXVlcnkgPSBlbGFzLmJ1aWxkVXBkYXRlRG9jKF9pbmRleCwgX3R5cGUsIGlkLCBkb2MsIHBhcmFtZXRlcnMpLFxuXHRcdFx0cmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVsYXNDbGllbnQudXBkYXRlKHF1ZXJ5KTtcblx0XHRyZXR1cm4geyBzdGF0dXM6IHRydWUsIHJlc3BvbnNlOiByZXNwb25zZSwgbWVzc2VhZ2U6IFwiXCIgfTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aGlzLmxvZ2dlci5lcnJvcihcIkVsYXNQcm92aWRlci51cGRhdGVCeURvY0FzeW5jOlwiLCBlcnJvcik7XG5cdFx0cmV0dXJuIHsgc3RhdHVzOiBmYWxzZSwgcmVzcG9uc2U6IGVycm9yLCBtZXNzZWFnZTogZXJyb3IubWVzc2VhZ2UgfTtcblx0fVxufVxuXG5lbGFzLnVwZGF0ZUJ5UXVlcnkgPSBmdW5jdGlvbiAoX2luZGV4LCBfdHlwZSwgYm9keSwgY2FsbGJhY2spIHtcblx0dmFyIHF1ZXJ5ID0gZWxhcy5idWlsZFVwZGF0ZUJ5UXVlcnkoX2luZGV4LCBfdHlwZSwgYm9keSk7XG5cdHRoaXMuZWxhc0NsaWVudC51cGRhdGVCeVF1ZXJ5KHF1ZXJ5LCBmdW5jdGlvbiAoZXJyb3IsIHJlc3BvbnNlKSB7XG5cdFx0cmV0dXJuIGNhbGxiYWNrKGVycm9yLCByZXNwb25zZSk7XG5cdH0pO1xufVxuXG5lbGFzLnVwZGF0ZUJ5UXVlcnlBc3luYyA9IGFzeW5jIGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5lbGFzQ2xpZW50LnVwZGF0ZUJ5UXVlcnkoc291cmNlKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aGlzLmxvZ2dlci5lcnJvcihcIkVsYXNQcm92aWRlci51cGRhdGVCeVF1ZXJ5QXN5bmM6XCIsIGVycm9yKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuLyoqXG4qIEBwYXJhbSBrZXlcbiogQHBhcmFtIHZhbHVlcyAobWFuZyBvYmplY3QpXG4qKi9cbmVsYXMuYnVpbGRPYmpXaXRoS2V5ID0gZnVuY3Rpb24gKGtleSwgdmFsdWVzLCBpc0FycmF5VmFsdWUpIHtcblx0dmFyIG9iaiA9IHt9O1xuXHRpZiAoaXNBcnJheVZhbHVlKSB7XG5cdFx0b2JqW2tleV0gPSBbXTtcblx0XHRmb3IgKHZhciB2YWx1ZSBpbiB2YWx1ZXMpIHtcblx0XHRcdG9ialtrZXldLnB1c2godmFsdWVzW3ZhbHVlXSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdG9ialtrZXldID0gdmFsdWVzO1xuXHR9XG5cdHJldHVybiBvYmo7XG59XG5cbmVsYXMuYnVpbGRVcGRhdGVCeVF1ZXJ5ID0gZnVuY3Rpb24gKGluZGV4LCB0eXBlLCBib2R5KSB7XG5cdHRyeSB7XG5cdFx0dmFyIHdyYXAgPSB7fTtcblx0XHRpZiAoIUxpYnMuaXNCbGFuayhpbmRleCkpIHtcblx0XHRcdHdyYXAuaW5kZXggPSBpbmRleDtcblx0XHR9XG5cdFx0aWYgKCFMaWJzLmlzQmxhbmsodHlwZSkpIHtcblx0XHRcdHdyYXAudHlwZSA9IHR5cGU7XG5cdFx0fVxuXHRcdHdyYXAuYm9keSA9IGJvZHk7XG5cdFx0cmV0dXJuIHdyYXA7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cbmVsYXMuZ2V0ID0gZnVuY3Rpb24gKGluZGV4LCB0eXBlLCBpZCwgY2FsbEJhY2spIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHR2YXIgcXVlcnkgPSB0aGlzLmJ1aWxkUXVlcnlHZXQoaW5kZXgsIHR5cGUsIGlkKTtcblx0bGV0IGVsYXNGdW5jID0gZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdHNlbGYuZWxhc0NsaWVudC5nZXQocXVlcnksIGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgY2FsbEJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBjb252ZXJ0RGF0YU9iaihyZXNwb25zZSkpXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHlwZW9mIGNhbGxCYWNrID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGNvbnZlcnREYXRhT2JqKHJlc3BvbnNlKSlcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXNvbHZlKGNvbnZlcnREYXRhT2JqKHJlc3BvbnNlKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0c2VsZi5sb2dnZXIuZXJyb3IoZSk7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGVsYXNGdW5jKCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0ZWxhc0Z1bmMocmVzb2x2ZSwgcmVqZWN0KVxuXHR9KVxufVxuXG5lbGFzLmJ1bGtJbmRleEFzeW5jID0gYXN5bmMgZnVuY3Rpb24gKF9pbmRleCwgX3R5cGUsIGRhdGEpIHtcblx0dHJ5IHtcblx0XHR2YXIgd3JhcCA9IHt9O1xuXHRcdHdyYXAuYm9keSA9IGJ1aWxkSW5kZXhCdWxrQm9keShfaW5kZXgsIF90eXBlLCBkYXRhKTtcblx0XHR2YXIgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVsYXNDbGllbnQuYnVsayh3cmFwKTtcblx0XHRyZXR1cm4gcmVzcG9uc2U7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhpcy5sb2dnZXIuZXJyb3IoXCJFbGFzUHJvdmlkZXIuYnVsa0luZGV4QXN5bmM6XCIsIGVycm9yKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuZWxhcy5idWxrQXN5bmMgPSBhc3luYyBmdW5jdGlvbiAoYm9keSwgcGFyYW1ldGVycykge1xuXHR0cnkge1xuXHRcdHZhciB3cmFwID0ge307XG5cdFx0d3JhcC5ib2R5ID0gYm9keTtcblx0XHRpZiAocGFyYW1ldGVycyAmJiBPYmplY3Qua2V5cyhwYXJhbWV0ZXJzKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRPYmplY3QuYXNzaWduKHdyYXAsIHBhcmFtZXRlcnMpO1xuXHRcdH1cblx0XHR2YXIgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVsYXNDbGllbnQuYnVsayh3cmFwKTtcblx0XHRyZXR1cm4gcmVzcG9uc2U7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhpcy5sb2dnZXIuZXJyb3IoXCJFbGFzUHJvdmlkZXIuYnVsa0FzeW5jOlwiLCBlcnJvcik7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbmVsYXMubXVsdGlTZWFyY2hBc3luYyA9IGFzeW5jIGZ1bmN0aW9uIChib2R5KSB7XG5cdHRyeSB7XG5cdFx0dmFyIHJlc3BvbnNlID0gYXdhaXQgdGhpcy5lbGFzQ2xpZW50Lm1zZWFyY2goYm9keSk7XG5cblx0XHRpZiAocmVzcG9uc2UgJiYgQXJyYXkuaXNBcnJheShyZXNwb25zZS5yZXNwb25zZXMpKSB7XG5cdFx0XHRsZXQgbGlzdCA9IFtdLFxuXHRcdFx0XHR7IHJlc3BvbnNlcyB9ID0gcmVzcG9uc2U7XG5cdFx0XHRmb3IgKGxldCBrZXkgaW4gcmVzcG9uc2VzKSB7XG5cdFx0XHRcdGxldCBpdGVtID0gcmVzcG9uc2VzW2tleV0sXG5cdFx0XHRcdFx0cmVjb3JkcyA9IGNvbnZlcnREYXRhTGlzdE9iaihpdGVtKSxcblx0XHRcdFx0XHRhZ2dyZWdhdGlvbnMgPSBpdGVtLmFnZ3JlZ2F0aW9ucztcblx0XHRcdFx0aWYgKG51bGwgIT0gYWdncmVnYXRpb25zICYmIHR5cGVvZiBhZ2dyZWdhdGlvbnMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0cmVjb3Jkc1tcImFnZ3NcIl0gPSBhZ2dyZWdhdGlvbnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKHJlY29yZHMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGxpc3Q7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhpcy5sb2dnZXIuZXJyb3IoXCJFbGFzUHJvdmlkZXIuZWxhcy5tdWx0aVNlYXJjaEFzeW5jOlwiLCBlcnJvcik7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbi8vIGVsYXMucmVmcmVzaEFzeW5jID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuXG4vLyB9XG5cbmZ1bmN0aW9uIGJ1aWxkSW5kZXhCdWxrQm9keShpbmRleCwgdHlwZSwgZGF0YSkge1xuXHR2YXIgYm9keSA9IFtdLFxuXHRcdGluZGV4ID0geyBpbmRleDogeyBfaW5kZXg6IGluZGV4LCBfdHlwZTogdHlwZSB9IH07XG5cdGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkgcmV0dXJuIGJvZHk7XG5cdGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG5cdFx0bGV0IHJlY29yZCA9IGRhdGFba2V5XTtcblx0XHRib2R5LnB1c2goaW5kZXgpO1xuXHRcdGJvZHkucHVzaChyZWNvcmQpO1xuXHR9XG5cdHJldHVybiBib2R5O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0RGF0YU9iaihyZXNwb25zZSkge1xuXHR2YXIgcmVjb3JkID0ge307XG5cdHZhciBzb3VyY2UgPSByZXNwb25zZS5fc291cmNlO1xuXHRmb3IgKHZhciBwcm9wZXJ0eSBpbiBzb3VyY2UpIHtcblx0XHRyZWNvcmRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcblx0fVxuXHRyZWNvcmQuaW5kZXggPSByZXNwb25zZS5faW5kZXg7XG5cdHJlY29yZC50eXBlID0gcmVzcG9uc2UuX3R5cGU7XG5cdHJlY29yZC5pZCA9IHJlc3BvbnNlLl9pZDtcblx0cmVjb3JkLmRvY3VtZW50VmVyc2lvbiA9IHJlc3BvbnNlLl92ZXJzaW9uO1xuXHRyZXR1cm4gcmVjb3JkO1xufVxuZnVuY3Rpb24gY29udmVydERhdGFMaXN0T2JqKHJlc3BvbnNlKSB7XG5cdHZhciBoaXRzID0gcmVzcG9uc2UuaGl0cztcblx0dmFyIGJ1Y2tldHMgPSBbXTtcblx0dmFyIGFnZ3JlZ2F0aW9ucyA9IHJlc3BvbnNlLmFnZ3JlZ2F0aW9ucztcblx0aWYgKGFnZ3JlZ2F0aW9ucyAmJiBhZ2dyZWdhdGlvbnMudW5pcXVlX2FnZ3MgJiYgYWdncmVnYXRpb25zLnVuaXF1ZV9hZ2dzLmJ1Y2tldHMpIHtcblx0XHRidWNrZXRzID0gcmVzcG9uc2UuYWdncmVnYXRpb25zLnVuaXF1ZV9hZ2dzLmJ1Y2tldHM7XG5cdH1cblx0dmFyIHRvdGFsID0gaGl0cy50b3RhbDtcblx0dmFyIHRvdGFsX2Rpc3RpbmN0ID0gMDtcblx0aWYgKGFnZ3JlZ2F0aW9ucyAmJiBhZ2dyZWdhdGlvbnMudG90YWwgJiYgYWdncmVnYXRpb25zLnRvdGFsLnZhbHVlKSB7XG5cdFx0dG90YWxfZGlzdGluY3QgPSBhZ2dyZWdhdGlvbnMudG90YWwudmFsdWU7XG5cdH1cblx0dmFyIHJlY29yZHMgPSB7IHRvdGFsOiB0b3RhbCwgZGF0YTogW10sIGRhdGFfZGlzdGluY3Q6IFtdLCB0b3RhbF9kaXN0aW5jdDogdG90YWxfZGlzdGluY3QgfTtcblx0aWYgKGJ1Y2tldHMpIHtcblx0XHRmb3IgKHZhciBidWNrZXQgaW4gYnVja2V0cykge1xuXHRcdFx0dmFyIGJ1Y2tldHNIaXRzID0gYnVja2V0c1tidWNrZXRdO1xuXHRcdFx0aWYgKGJ1Y2tldHNIaXRzKSB7XG5cdFx0XHRcdHZhciBidWtkYXRhID0gYnVja2V0c0hpdHMuYnVrZGF0YTtcblx0XHRcdFx0aWYgKCFidWtkYXRhKSBicmVhaztcblx0XHRcdFx0dmFyIGhpdHNfYnVrID0gYnVrZGF0YS5oaXRzO1xuXHRcdFx0XHRmb3IgKHZhciBoaXQgaW4gaGl0c19idWsuaGl0cykge1xuXHRcdFx0XHRcdHZhciBvYmogPSBoaXRzX2J1ay5oaXRzW2hpdF07XG5cdFx0XHRcdFx0dmFyIHJlY29yZCA9IHt9O1xuXHRcdFx0XHRcdHZhciBzb3VyY2UgPSBvYmouX3NvdXJjZTtcblx0XHRcdFx0XHRyZWNvcmQuaW5kZXggPSBoaXQuX2luZGV4O1xuXHRcdFx0XHRcdHJlY29yZC50eXBlID0gb2JqLl90eXBlO1xuXHRcdFx0XHRcdHJlY29yZC5pZCA9IG9iai5faWQ7XG5cdFx0XHRcdFx0cmVjb3JkLmRvY19pZCA9IG9iai5faWQ7XG5cdFx0XHRcdFx0Zm9yICh2YXIgcHJvcGVydHkgaW4gc291cmNlKSB7XG5cdFx0XHRcdFx0XHRyZWNvcmRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVjb3Jkcy5kYXRhX2Rpc3RpbmN0LnB1c2gocmVjb3JkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cdGZvciAodmFyIGhpdCBpbiBoaXRzLmhpdHMpIHtcblx0XHR2YXIgb2JqID0gaGl0cy5oaXRzW2hpdF07XG5cdFx0dmFyIHJlY29yZCA9IHt9O1xuXHRcdHZhciBzb3VyY2UgPSBvYmouX3NvdXJjZTtcblx0XHRyZWNvcmQuZG9jdW1lbnRWZXJzaW9uID0gKG9iai5fdmVyc2lvbikgPyBvYmouX3ZlcnNpb24gOiBudWxsO1xuXHRcdGZvciAodmFyIHByb3BlcnR5IGluIHNvdXJjZSkge1xuXHRcdFx0cmVjb3JkW3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG5cdFx0fVxuXHRcdHJlY29yZC5pbmRleCA9IGhpdC5faW5kZXg7XG5cdFx0cmVjb3JkLnR5cGUgPSBvYmouX3R5cGU7XG5cdFx0cmVjb3JkLmlkID0gb2JqLl9pZDtcblx0XHRyZWNvcmQuZG9jX2lkID0gb2JqLl9pZDtcblx0XHRyZWNvcmRzLmRhdGEucHVzaChyZWNvcmQpO1xuXHR9XG5cdHJldHVybiByZWNvcmRzO1xufVxuZWxhcy5idWlsZFF1ZXJ5QWdncyA9IGZ1bmN0aW9uIChpbmRleCwgdHlwZSwgZnJvbSwgZmlsdGVycywgc29ydHMsIHNlbGVjdEZpZWxkcywgYWdnc0ZpbHRlciA9IFwiXCIsIGdldFZlcnNpb24gPSBmYWxzZSkge1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgYm9vbFF1ZXJ5VHlwZXMgPSBbXCJtdXN0XCIsIFwiZmlsdGVyXCIsIFwic2hvdWxkXCIsIFwibXVzdF9ub3RcIl07XG5cdFx0dmFyIHdyYXAgPSB7XG5cdFx0XHRfc291cmNlOiBzZWxlY3RGaWVsZHNcblx0XHR9O1xuXHRcdGlmICghTGlicy5pc0JsYW5rKGluZGV4KSkge1xuXHRcdFx0d3JhcC5pbmRleCA9IGluZGV4O1xuXHRcdH1cblx0XHRpZiAoIUxpYnMuaXNCbGFuayh0eXBlKSkge1xuXHRcdFx0d3JhcC50eXBlID0gdHlwZTtcblx0XHR9XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0RmllbGRzKSAmJiBzZWxlY3RGaWVsZHMubGVuZ3RoID4gMCkge1xuXHRcdFx0d3JhcC5fc291cmNlID0gc2VsZWN0RmllbGRzO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGZyb20gIT09ICd1bmRlZmluZWQnICYmIGZyb20gIT0gbnVsbCkge1xuXHRcdFx0d3JhcC5mcm9tID0gZnJvbTtcblx0XHRcdHdyYXAuc2l6ZSA9IDIwO1xuXHRcdH1cblx0XHR2YXIgcXVlcnkgPSB7fTtcblx0XHRxdWVyeS5ib29sID0ge31cblx0XHRmb3IgKGxldCBrZXkgaW4gYm9vbFF1ZXJ5VHlwZXMpIHtcblx0XHRcdGxldCBib29sUXVlcnlUeXBlID0gYm9vbFF1ZXJ5VHlwZXNba2V5XTtcblx0XHRcdGlmICh0eXBlb2YgZmlsdGVyc1tib29sUXVlcnlUeXBlXSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGZpbHRlcnNbYm9vbFF1ZXJ5VHlwZV0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHF1ZXJ5LmJvb2xbYm9vbFF1ZXJ5VHlwZV0gPSBmaWx0ZXJzW2Jvb2xRdWVyeVR5cGVdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoTGlicy5pc09iamVjdEVtcHR5KHF1ZXJ5LmJvb2wpKSB7XG5cblx0XHR9XG5cblx0XHR2YXIgYm9keSA9IHt9O1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHNvcnRzKSAmJiBzb3J0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRib2R5LnNvcnQgPSBzb3J0cztcblx0XHR9XG5cdFx0aWYgKGdldFZlcnNpb24gPT09IHRydWUpIHtcblx0XHRcdGJvZHkudmVyc2lvbiA9IHRydWU7XG5cdFx0fVxuXHRcdGJvZHkucXVlcnkgPSBxdWVyeTtcblx0XHRpZiAoIUxpYnMuaXNCbGFuayhhZ2dzRmlsdGVyKSkge1xuXHRcdFx0Ym9keS5hZ2dzID0ge1xuXHRcdFx0XHRcInVuaXF1ZV9hZ2dzXCI6IHtcblx0XHRcdFx0XHRcInRlcm1zXCI6IHtcblx0XHRcdFx0XHRcdFwiZmllbGRcIjogYWdnc0ZpbHRlcixcblx0XHRcdFx0XHRcdFwic2l6ZVwiOiAxMDBcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFwiYWdnc1wiOiB7XG5cdFx0XHRcdFx0XHRcImJ1a2RhdGFcIjoge1xuXHRcdFx0XHRcdFx0XHRcInRvcF9oaXRzXCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcInNpemVcIjogMSxcblx0XHRcdFx0XHRcdFx0XHRcInNvcnRcIjogW1xuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcImNyZWF0ZWRfZGF0ZVwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCJvcmRlclwiOiBcImRlc2NcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcInRvdGFsXCI6IHtcblx0XHRcdFx0XHRcImNhcmRpbmFsaXR5XCI6IHtcblx0XHRcdFx0XHRcdFwiZmllbGRcIjogYWdnc0ZpbHRlclxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHR3cmFwLmJvZHkgPSBib2R5O1xuXHRcdC8vXHRcdEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuXHRcdHJldHVybiB3cmFwO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGVsYXM7XG4iXX0=