"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require("fs");
var xmldom = require("xmldom");
var htmldom = require("htmldom");
var s = require("string");
var moment = require("moment");
var util = require("util");
var logger = FLLogger.getLogger("FLReportTemplateRender");
var decode = require('unescape');

var SqlCommand = function () {
    function SqlCommand() {
        _classCallCheck(this, SqlCommand);

        this.sql = "";
        this.parameters = [];
    }

    _createClass(SqlCommand, [{
        key: "addParameter",
        value: function addParameter(value) {
            this.parameters.push(value);
        }
    }]);

    return SqlCommand;
}();

var No = function () {
    function No() {
        _classCallCheck(this, No);

        this.children = [];
    }

    _createClass(No, [{
        key: "add",
        value: function add(no) {
            this.children.push(no);
        }
    }, {
        key: "removeAll",
        value: function removeAll() {
            this.children = [];
        }
    }, {
        key: "getSql",
        value: function getSql(sqlcommand, data) {
            for (var prop in this.children) {
                if (prop in this.children) {
                    var noson = this.children[prop];
                    noson.getSql(sqlcommand, data);
                }
            }
            return sqlcommand;
        }
    }, {
        key: "getValue",
        value: function getValue(data, path) {
            for (var i = 0; (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" && i < path.length; ++i) {
                if (data) {
                    data = data[path[i]];
                }
            }
            return data;
        }
    }, {
        key: "processexpression",
        value: function processexpression(expression, sqlcommand, data) {
            var myArray = void 0;
            //sửa bug không phân tích được paramer từ 2 trở lên ví dụ #{param1},{#param2}
            var newexpression = expression;
            var regex = new RegExp("#{([a-z.A-Z0-9_|]+)}", "ig");
            while ((myArray = regex.exec(newexpression)) !== null) {
                // const stretch = myArray[0];
                // const propertyvalue = this.getValue(data, myArray[1].split("."));
                // if (propertyvalue == null || typeof propertyvalue === "number" || typeof propertyvalue === "boolean" || typeof propertyvalue === "string") {
                //     expression = expression.replace(stretch, propertyvalue);
                //     sqlcommand.addParameter(propertyvalue);
                // }
                // else if (util.isDate(propertyvalue)) {
                //     //const value = moment(propertyvalue).format("YYYY-MM-DD HH:mm:ss");
                //     const value = moment(propertyvalue).format(Constants.format.datetime);

                //     expression = expression.replace(stretch, propertyvalue);
                //     sqlcommand.addParameter(value);
                // }
                // else if (util.isArray(propertyvalue)) {
                //     logger.error("Can not translate snippet " + stretch + " by collection: " + propertyvalue);
                //     throw new Error("Can not translate snippet " + stretch + " by collection: " + propertyvalue);
                // }
                var stretch = myArray[0];
                var property = myArray[1].replace(data + ".", "");
                var fields = property.split("|");

                var propertyvalue = this.getValue(data, fields[0].split("."));
                propertyvalue = propertyvalue ? propertyvalue : "";
                var format = "";
                if (fields.length >= 2) {
                    //có format
                    format = fields[1].trim();
                }
                if (!Libs.isBlank(format)) {
                    var value = propertyvalue;
                    if ("date" == format) {
                        value = moment(propertyvalue).format(Constants.data.format.date);
                    } else if ("datetime" == format) {
                        value = moment(propertyvalue).format(Constants.data.format.datetime);
                    } else if ("numeric" == format) {
                        value = Libs.formatNum(value, Constants.data.format.numeric);
                    }
                    expression = expression.replace(stretch, value);
                    sqlcommand.addParameter(value);
                } else {
                    //if (propertyvalue == null || typeof propertyvalue == "number" || typeof propertyvalue == "string" || typeof propertyvalue == "boolean") {
                    expression = expression.replace(stretch, propertyvalue);
                    sqlcommand.addParameter(propertyvalue);
                }
            }
            return expression;
        }
    }]);

    return No;
}();

var NoString = function (_No) {
    _inherits(NoString, _No);

    function NoString(text) {
        _classCallCheck(this, NoString);

        var _this = _possibleConstructorReturn(this, (NoString.__proto__ || Object.getPrototypeOf(NoString)).call(this));

        _this.text = text.trim();
        return _this;
    }

    _createClass(NoString, [{
        key: "getSql",
        value: function getSql(sqlcommand, data) {
            sqlcommand.sql += _get(NoString.prototype.__proto__ || Object.getPrototypeOf(NoString.prototype), "processexpression", this).call(this, this.text, sqlcommand, data) + " ";
        }
    }]);

    return NoString;
}(No);

var NoChoose = function (_No2) {
    _inherits(NoChoose, _No2);

    function NoChoose() {
        _classCallCheck(this, NoChoose);

        return _possibleConstructorReturn(this, (NoChoose.__proto__ || Object.getPrototypeOf(NoChoose)).call(this));
    }

    _createClass(NoChoose, [{
        key: "add",
        value: function add(no) {
            _get(NoChoose.prototype.__proto__ || Object.getPrototypeOf(NoChoose.prototype), "add", this).call(this, no);
            if (no instanceof NoOtherwise) {
                this.noOtherwise = no;
            }
        }
    }, {
        key: "getSql",
        value: function getSql(sqlcommand, data) {
            for (var i in this.children) {
                var no = this.children[i];
                if (no instanceof NoWhen) {
                    var nowhen = no;
                    var expression = nowhen.expressionTest.replace("#{", "data.").replace("}", "");
                    try {
                        eval("if( " + expression + " ) data.valueExpression = true; else data.valueExpression = false;");
                    } catch (err) {
                        data.valueExpression = false;
                    }
                    if (data.valueExpression) {
                        return nowhen.getSql(sqlcommand, data);
                    }
                }
            }
            if (this.noOtherwise) {
                return this.noOtherwise.getSql(sqlcommand, data);
            }
            return "";
        }
    }]);

    return NoChoose;
}(No);

var NoWhen = function (_No3) {
    _inherits(NoWhen, _No3);

    function NoWhen(expressionTest, text) {
        _classCallCheck(this, NoWhen);

        var _this3 = _possibleConstructorReturn(this, (NoWhen.__proto__ || Object.getPrototypeOf(NoWhen)).call(this));

        _this3.expressionTest = expressionTest;
        _this3.text = text;

        //const regex = new RegExp("[_a-zA-Z][_a-zA-Z0-9]{0,30}", "ig");
        var regex = new RegExp("[a-z.A-Z0-9_][_a-z.A-Z0-9]{0,30}", "ig");
        var identifiers = [];
        var myArray = [];
        while ((myArray = regex.exec(expressionTest)) !== null) {
            var identifier = myArray[0];

            if (identifier == "null" || identifier == "true" || identifier == "false" || identifier == "and") {
                continue;
            }
            identifiers.push(identifier);
            _this3.expressionTest = _this3.expressionTest.replace(identifier, "data." + identifier);
        }
        _this3.expressionTest = s(_this3.expressionTest).replaceAll("and", "&&").toString();
        return _this3;
    }

    return NoWhen;
}(No);

var NoForEach = function (_No4) {
    _inherits(NoForEach, _No4);

    function NoForEach(item, index, separator, opening, closure, text, collection) {
        _classCallCheck(this, NoForEach);

        var _this4 = _possibleConstructorReturn(this, (NoForEach.__proto__ || Object.getPrototypeOf(NoForEach)).call(this));

        _this4.item = item;
        _this4.index = index;
        _this4.separator = separator;
        _this4.opening = opening;
        _this4.closure = closure;
        _this4.collection = collection;
        _this4.text = text.trim();
        return _this4;
    }

    _createClass(NoForEach, [{
        key: "getSql",
        value: function getSql(sqlcommand, data) {
            var text = [];
            var collection = data[this.collection];

            if (collection == null) {
                if (util.isArray(data)) {
                    collection = data;
                } else {
                    return this.opening + this.closure;
                }
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    var _myArray = void 0;
                    //thay the regex, regex này không thể lọc được param có dấu _ hoặc số
                    //const regex = new RegExp("#{([a-z.A-Z]+)}", "ig");
                    //const regex = new RegExp("#{([a-z.A-Z0-9_]+)}", "ig");
                    var _regex = new RegExp("#{([a-z.A-Z0-9_|]+)}", "ig");
                    var expression = this.text;
                    var newexpression = expression;
                    while ((_myArray = _regex.exec(expression)) !== null) {
                        // const stretch = myArray[0];
                        // const property = myArray[1].replace(this.item + ".", "");
                        // const propertyvalue = this.getValue(item, property.split("."));
                        // var month = moment().month();
                        // if (typeof propertyvalue == "number" || typeof propertyvalue == "string" || typeof propertyvalue == "boolean") {
                        //     newexpression = newexpression.replace(stretch, propertyvalue);
                        //     sqlcommand.addParameter(propertyvalue);
                        // }
                        var stretch = _myArray[0];
                        var property = _myArray[1].replace(this.item + ".", "");
                        var fields = property.split("|");

                        var propertyvalue = this.getValue(item, fields[0].split("."));
                        var format = "";
                        if (fields.length >= 2) {
                            //có format
                            format = fields[1].trim();
                        }
                        if (!Libs.isBlank(format)) {
                            var value = propertyvalue;
                            if ("date" == format) {
                                value = moment(propertyvalue).format(Constants.data.format.date);
                            } else if ("datetime" == format) {
                                value = moment(propertyvalue).format(Constants.data.format.datetime);
                            } else if ("numeric" == format) {
                                value = Libs.formatNum(value, Constants.data.format.numeric);
                            }
                            newexpression = newexpression.replace(stretch, value);
                            sqlcommand.addParameter(value);
                        } else {
                            //if (propertyvalue == null || typeof propertyvalue == "number" || typeof propertyvalue == "string" || typeof propertyvalue == "boolean") {
                            newexpression = newexpression.replace(stretch, propertyvalue);
                            sqlcommand.addParameter(propertyvalue);
                        }
                    }
                    text.push(newexpression);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var sql = this.opening + text.join(this.separator) + this.closure;
            sqlcommand.sql += sql;
            return sqlcommand;
        }
    }]);

    return NoForEach;
}(No);

var NoIf = function (_No5) {
    _inherits(NoIf, _No5);

    function NoIf(expressionTest, text) {
        _classCallCheck(this, NoIf);

        var _this5 = _possibleConstructorReturn(this, (NoIf.__proto__ || Object.getPrototypeOf(NoIf)).call(this));

        _this5.expressionTest = expressionTest;
        _this5.text = text;
        //const regex = new RegExp("[_a-zA-Z][_a-zA-Z0-9]{0,30}", "ig");
        var regex = new RegExp("[a-z.A-Z0-9_][_a-z.A-Z0-9]{0,30}", "ig");

        var identifiers = [];
        var myArray = [];

        while ((myArray = regex.exec(expressionTest)) !== null) {
            var identifier = myArray[0];
            if (identifier == "null") {
                continue;
            }
            identifiers.push(identifier);
            _this5.expressionTest = _this5.expressionTest.replace(identifier, "data." + identifier);
        }
        return _this5;
    }

    _createClass(NoIf, [{
        key: "getSql",
        value: function getSql(sqlcommand, data) {
            var expression = this.expressionTest.replace("#{", "data.").replace("}", "");
            try {
                if (expression) {

                    eval("if( " + expression + " ) data.valueExpression = true; else data.valueExpression = false;");
                }
            } catch (err) {
                data.valueExpression = false;
            }
            if (data.valueExpression == false) {
                return "";
            }
            _get(NoIf.prototype.__proto__ || Object.getPrototypeOf(NoIf.prototype), "getSql", this).call(this, sqlcommand, data) + " ";
        }
    }]);

    return NoIf;
}(No);

var NoOtherwise = function (_No6) {
    _inherits(NoOtherwise, _No6);

    function NoOtherwise(text) {
        _classCallCheck(this, NoOtherwise);

        var _this6 = _possibleConstructorReturn(this, (NoOtherwise.__proto__ || Object.getPrototypeOf(NoOtherwise)).call(this));

        _this6.text = text;
        return _this6;
    }

    _createClass(NoOtherwise, [{
        key: "getSql",
        value: function getSql(sqlcommand, data) {
            var myArray = void 0;
            //const regex = new RegExp("#{([a-z.A-Z]+)}", "ig");
            //thay the regex, regex này không thể lọc được param có dấu _ hoặc số
            var regex = new RegExp("#{([a-z.A-Z0-9_|]+)}", "ig");
            var expression = this.text;
            while ((myArray = regex.exec(this.text)) !== null) {
                // const stretch = myArray[0];
                // const propertyvalue = this.getValue(data, myArray[1].split("."));
                // if (typeof propertyvalue == "number" || typeof propertyvalue == "string" || typeof propertyvalue == "boolean") {
                //     expression = expression.replace(stretch, propertyvalue);
                //     sqlcommand.addParameter(propertyvalue);
                // }
                var stretch = myArray[0];
                var property = myArray[1].replace(data + ".", "");
                var fields = property.split("|");

                var propertyvalue = this.getValue(data, fields[0].split("."));
                var format = "";
                if (fields.length >= 2) {
                    //có format
                    format = fields[1].trim();
                }
                if (!Libs.isBlank(format)) {
                    var value = propertyvalue;
                    if ("date" == format) {
                        value = moment(propertyvalue).format(Constants.data.format.date);
                    } else if ("datetime" == format) {
                        value = moment(propertyvalue).format(Constants.data.format.datetime);
                    } else if ("numeric" == format) {
                        value = Libs.formatNum(value, Constants.data.format.numeric);
                    }
                    expression = expression.replace(stretch, value);
                    sqlcommand.addParameter(value);
                } else {
                    expression = expression.replace(stretch, propertyvalue);
                    sqlcommand.addParameter(propertyvalue);
                }
            }
            sqlcommand.sql += expression + " ";
        }
    }]);

    return NoOtherwise;
}(No);

var FLReportTemplateRender = function () {
    function FLReportTemplateRender() {
        _classCallCheck(this, FLReportTemplateRender);
    }

    _createClass(FLReportTemplateRender, [{
        key: "read",
        value: function read(gchild, incharge, data) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Array.from(gchild.childNodes)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var no = _step2.value;

                    if (no.nodeName == "choose") {
                        this.readChoose(no, incharge);
                    } else if (no.nodeName == "if") {
                        this.readIf(no, incharge);
                    } else if (no.nodeName == "foreach") {
                        this.readForEach(no, incharge);
                    } else {
                        if (no.hasChildNodes() == false) {
                            if (no.nodeName != "#comment") {
                                var _noString = new NoString(no.toString());
                                incharge.add(_noString);
                            }
                        } else {
                            var childIncharge = new No();
                            this.read(no, childIncharge, data);
                            var _sqlcommand = new SqlCommand();
                            childIncharge.getSql(_sqlcommand, data);
                            var sql = _sqlcommand.sql;
                            no.textContent = sql;

                            var html = decode(no.toString());

                            var _noString2 = new NoString(html);
                            incharge.add(_noString2);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var sqlcommand = new SqlCommand();
            incharge.getSql(sqlcommand, data);
            var sql = sqlcommand.sql;
            incharge.removeAll();
            var noString = new NoString(sql);
            incharge.add(noString);
        }
    }, {
        key: "readForEach",
        value: function readForEach(no, nomain, mapping) {
            var valueSeparador = "";
            if (no.getAttributeNode("separator")) {
                valueSeparador = no.getAttributeNode("separator").value;
            }
            var valueAverage = "";
            if (no.getAttributeNode("open")) {
                valueAverage = no.getAttributeNode("open").value;
            }
            var closingvalue = "";
            if (no.getAttributeNode("close")) {
                closingvalue = no.getAttributeNode("close").value;
            }
            var valueIndex = "";
            if (no.getAttributeNode("index")) {
                valueIndex = no.getAttributeNode("index").value;
            }
            var valueCollection = "";
            if (no.getAttributeNode("collection")) {
                valueCollection = no.getAttributeNode("collection").value;
            }
            var noday = new NoForEach(no.getAttributeNode("item").value, valueIndex, valueSeparador, valueAverage, closingvalue, no.childNodes.toString(), valueCollection, mapping);

            nomain.add(noday);
        }
    }, {
        key: "readIf",
        value: function readIf(no, nomain, mapping) {
            var noIf = new NoIf(no.getAttributeNode("test").value, no.childNodes[0].toString(), mapping);
            for (var i = 0; i < no.childNodes.length; i++) {
                var noson = no.childNodes[i];
                if (noson.nodeName == "choose") {
                    this.readChoose(noson, noIf, mapping);
                } else if (noson.nodeName == "if") {
                    this.readIf(noson, noIf, mapping);
                } else if (noson.nodeName == "foreach") {
                    this.readForEach(noson, noIf, mapping);
                } else {
                    if (noson.hasChildNodes() == false) {
                        if (noson.nodeName != "#comment") {
                            //const noString = new NoString(noson.textContent, mapping);
                            var noString = new NoString(noson.toString());
                            noIf.add(noString);
                        }
                    } else {
                        //1 element, trường hợp này không cho phép thêm nữa
                        var _noString3 = new NoString(noson.toString());
                        noIf.add(_noString3);
                    }
                }
            }
            nomain.add(noIf);
        }
    }, {
        key: "readChoose",
        value: function readChoose(no, nomain) {
            var nohead = new NoChoose();
            for (var i = 0; i < no.childNodes.length; i++) {
                var noson = no.childNodes[i];
                if (noson.nodeName == "when") {
                    nohead.add(this.readNoWhen(noson, no));
                } else if (noson.nodeName == "otherwise") {
                    nohead.add(new NoOtherwise(noson.childNodes[0].toString()));
                }
            }
            nomain.add(nohead);
        }
    }, {
        key: "readNoWhen",
        value: function readNoWhen(no, noPrivate) {
            var expressionTest = no.getAttributeNode("test").value;
            var data = "";
            if (no.childNodes.length > 0) {
                data = no.childNodes[0].toString(); //nen thay toString()
            }
            var nowhen = new NoWhen(expressionTest, data);

            for (var i = 0; i < no.childNodes.length; i++) {
                var noson = no.childNodes[i];

                if (noson.nodeName == "choose") {
                    this.readChoose(noson, nowhen);
                } else if (noson.nodeName == "if") {
                    this.readIf(noson, nowhen);
                } else if (noson.nodeName == "foreach") {
                    this.readForEach(noson, nowhen);
                } else if (noson.hasChildNodes() == false) {
                    if (noson.nodeName != "#comment") {
                        //const noString = new NoString(noson.textContent);

                        var noString = new NoString(noson.toString());
                        nowhen.add(noString);
                    }
                } else {
                    //1 element, trường hợp này không cho phép thêm nữa
                    var _noString4 = new NoString(noson.toString());
                    nowhen.add(_noString4);
                }
            }
            return nowhen;
        }
        /**
         * render html template with data
         *
         * @param {*} filename
         * @param {*} data
         * @returns
         * @memberof FLReportTemplateRender
         */

    }, {
        key: "render",
        value: function render(filename, data) {
            try {
                var dir = config.server.report_dir;
                var ext = config.server.report_ext;
                filename = appPath + dir + filename + ext;
                if (fs.lstatSync(filename).isDirectory()) {
                    return null;
                }
                var htmlContents = fs.readFileSync(filename).toString();
                htmlContents = this.renderContent(htmlContents, data);
                return htmlContents;
            } catch (err) {
                logger.error(err);
                return false;
            }
        }
        /**
         * render html contents
         * @param {HTML String} htmlContents 
         * @param {Array or object} data 
         */

    }, {
        key: "renderContent",
        value: function renderContent(htmlContents, data) {
            if (Libs.isBlank(htmlContents)) return false;
            try {
                var xmlDoc = new xmldom.DOMParser().parseFromString(htmlContents);
                if (xmlDoc.documentElement.nodeName != "html") {
                    return null;
                }
                var we = xmlDoc.documentElement.childNodes;
                var incharge = new No();
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = Array.from(we)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var noXml = _step3.value;

                        if (noXml.nodeName == "body") {
                            this.read(noXml, incharge, data);
                            var sqlcommand = new SqlCommand();
                            incharge.getSql(sqlcommand, data);
                            noXml.textContent = sqlcommand.sql;
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                htmlContents = decode(xmlDoc.toString());
                return htmlContents;
            } catch (err) {
                logger.error(err);
                return false;
            }
        }
    }]);

    return FLReportTemplateRender;
}();

exports.default = FLReportTemplateRender;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9GTFJlcG9ydFRlbXBsYXRlUmVuZGVyLmJrLmpzIl0sIm5hbWVzIjpbImZzIiwicmVxdWlyZSIsInhtbGRvbSIsImh0bWxkb20iLCJzIiwibW9tZW50IiwidXRpbCIsImxvZ2dlciIsIkZMTG9nZ2VyIiwiZ2V0TG9nZ2VyIiwiZGVjb2RlIiwiU3FsQ29tbWFuZCIsInNxbCIsInBhcmFtZXRlcnMiLCJ2YWx1ZSIsInB1c2giLCJObyIsImNoaWxkcmVuIiwibm8iLCJzcWxjb21tYW5kIiwiZGF0YSIsInByb3AiLCJub3NvbiIsImdldFNxbCIsInBhdGgiLCJpIiwibGVuZ3RoIiwiZXhwcmVzc2lvbiIsIm15QXJyYXkiLCJuZXdleHByZXNzaW9uIiwicmVnZXgiLCJSZWdFeHAiLCJleGVjIiwic3RyZXRjaCIsInByb3BlcnR5IiwicmVwbGFjZSIsImZpZWxkcyIsInNwbGl0IiwicHJvcGVydHl2YWx1ZSIsImdldFZhbHVlIiwiZm9ybWF0IiwidHJpbSIsIkxpYnMiLCJpc0JsYW5rIiwiQ29uc3RhbnRzIiwiZGF0ZSIsImRhdGV0aW1lIiwiZm9ybWF0TnVtIiwibnVtZXJpYyIsImFkZFBhcmFtZXRlciIsIk5vU3RyaW5nIiwidGV4dCIsIk5vQ2hvb3NlIiwiTm9PdGhlcndpc2UiLCJub090aGVyd2lzZSIsIk5vV2hlbiIsIm5vd2hlbiIsImV4cHJlc3Npb25UZXN0IiwiZXZhbCIsImVyciIsInZhbHVlRXhwcmVzc2lvbiIsImlkZW50aWZpZXJzIiwiaWRlbnRpZmllciIsInJlcGxhY2VBbGwiLCJ0b1N0cmluZyIsIk5vRm9yRWFjaCIsIml0ZW0iLCJpbmRleCIsInNlcGFyYXRvciIsIm9wZW5pbmciLCJjbG9zdXJlIiwiY29sbGVjdGlvbiIsImlzQXJyYXkiLCJqb2luIiwiTm9JZiIsIkZMUmVwb3J0VGVtcGxhdGVSZW5kZXIiLCJnY2hpbGQiLCJpbmNoYXJnZSIsIkFycmF5IiwiZnJvbSIsImNoaWxkTm9kZXMiLCJub2RlTmFtZSIsInJlYWRDaG9vc2UiLCJyZWFkSWYiLCJyZWFkRm9yRWFjaCIsImhhc0NoaWxkTm9kZXMiLCJub1N0cmluZyIsImFkZCIsImNoaWxkSW5jaGFyZ2UiLCJyZWFkIiwidGV4dENvbnRlbnQiLCJodG1sIiwicmVtb3ZlQWxsIiwibm9tYWluIiwibWFwcGluZyIsInZhbHVlU2VwYXJhZG9yIiwiZ2V0QXR0cmlidXRlTm9kZSIsInZhbHVlQXZlcmFnZSIsImNsb3Npbmd2YWx1ZSIsInZhbHVlSW5kZXgiLCJ2YWx1ZUNvbGxlY3Rpb24iLCJub2RheSIsIm5vSWYiLCJub2hlYWQiLCJyZWFkTm9XaGVuIiwibm9Qcml2YXRlIiwiZmlsZW5hbWUiLCJkaXIiLCJjb25maWciLCJzZXJ2ZXIiLCJyZXBvcnRfZGlyIiwiZXh0IiwicmVwb3J0X2V4dCIsImFwcFBhdGgiLCJsc3RhdFN5bmMiLCJpc0RpcmVjdG9yeSIsImh0bWxDb250ZW50cyIsInJlYWRGaWxlU3luYyIsInJlbmRlckNvbnRlbnQiLCJlcnJvciIsInhtbERvYyIsIkRPTVBhcnNlciIsInBhcnNlRnJvbVN0cmluZyIsImRvY3VtZW50RWxlbWVudCIsIndlIiwibm9YbWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLEtBQUtDLFFBQVEsSUFBUixDQUFYO0FBQ0EsSUFBTUMsU0FBU0QsUUFBUSxRQUFSLENBQWY7QUFDQSxJQUFNRSxVQUFVRixRQUFRLFNBQVIsQ0FBaEI7QUFDQSxJQUFNRyxJQUFJSCxRQUFRLFFBQVIsQ0FBVjtBQUNBLElBQU1JLFNBQVNKLFFBQVEsUUFBUixDQUFmO0FBQ0EsSUFBTUssT0FBT0wsUUFBUSxNQUFSLENBQWI7QUFDQSxJQUFNTSxTQUFPQyxTQUFTQyxTQUFULENBQW1CLHdCQUFuQixDQUFiO0FBQ0EsSUFBTUMsU0FBU1QsUUFBUSxVQUFSLENBQWY7O0lBQ01VLFU7QUFDRiwwQkFBYztBQUFBOztBQUNWLGFBQUtDLEdBQUwsR0FBVyxFQUFYO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQixFQUFsQjtB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O0FBQ0gsYUFqQkQsQ0FpQkMsT0FBTXpELEdBQU4sRUFBVTtBQUNOcEQsdUJBQU9nSCxLQUFQLENBQWE1RCxHQUFiO0FBQ0QsdUJBQU8sS0FBUDtBQUNIO0FBQ0o7Ozs7OztrQkFyTWdCZ0Isc0IiLCJmaWxlIjoiRkxSZXBvcnRUZW1wbGF0ZVJlbmRlci5iay5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgeG1sZG9tID0gcmVxdWlyZShcInhtbGRvbVwiKTtcbmNvbnN0IGh0bWxkb20gPSByZXF1aXJlKFwiaHRtbGRvbVwiKTtcbmNvbnN0IHMgPSByZXF1aXJlKFwic3RyaW5nXCIpO1xuY29uc3QgbW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcbmNvbnN0IHV0aWwgPSByZXF1aXJlKFwidXRpbFwiKTtcbmNvbnN0IGxvZ2dlcj1GTExvZ2dlci5nZXRMb2dnZXIoXCJGTFJlcG9ydFRlbXBsYXRlUmVuZGVyXCIpO1xuY29uc3QgZGVjb2RlID0gcmVxdWlyZSgndW5lc2NhcGUnKTtcbmNsYXNzIFNxbENvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNxbCA9IFwiXCI7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IFtdO1xuICAgIH1cbiAgICBhZGRQYXJhbWV0ZXIodmFsdWUpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnB1c2godmFsdWUpO1xuICAgIH1cbn1cbmNsYXNzIE5vIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIH1cbiAgICBhZGQobm8pIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKG5vKTtcbiAgICB9XG4gICAgcmVtb3ZlQWxsKCl7XG4gICAgICAgIHRoaXMuY2hpbGRyZW49W107XG4gICAgfVxuICAgIGdldFNxbChzcWxjb21tYW5kLCBkYXRhKSB7XG4gICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm9zb24gPSB0aGlzLmNoaWxkcmVuW3Byb3BdO1xuICAgICAgICAgICAgICAgIG5vc29uLmdldFNxbChzcWxjb21tYW5kLCBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3FsY29tbWFuZDtcbiAgICB9XG4gICAgZ2V0VmFsdWUoZGF0YSwgcGF0aCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgJiYgaSA8IHBhdGgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGFbcGF0aFtpXV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIHByb2Nlc3NleHByZXNzaW9uKGV4cHJlc3Npb24sIHNxbGNvbW1hbmQsIGRhdGEpIHtcbiAgICAgICAgbGV0IG15QXJyYXk7XG4gICAgICAgIC8vc+G7rWEgYnVnIGtow7RuZyBwaMOibiB0w61jaCDEkcaw4bujYyBwYXJhbWVyIHThu6sgMiB0cuG7nyBsw6puIHbDrSBk4bulICN7cGFyYW0xfSx7I3BhcmFtMn1cbiAgICAgICAgY29uc3QgbmV3ZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChcIiN7KFthLXouQS1aMC05X3xdKyl9XCIsIFwiaWdcIik7XG4gICAgICAgIHdoaWxlICgobXlBcnJheSA9IHJlZ2V4LmV4ZWMobmV3ZXhwcmVzc2lvbikpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBjb25zdCBzdHJldGNoID0gbXlBcnJheVswXTtcbiAgICAgICAgICAgIC8vIGNvbnN0IHByb3BlcnR5dmFsdWUgPSB0aGlzLmdldFZhbHVlKGRhdGEsIG15QXJyYXlbMV0uc3BsaXQoXCIuXCIpKTtcbiAgICAgICAgICAgIC8vIGlmIChwcm9wZXJ0eXZhbHVlID09IG51bGwgfHwgdHlwZW9mIHByb3BlcnR5dmFsdWUgPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHByb3BlcnR5dmFsdWUgPT09IFwiYm9vbGVhblwiIHx8IHR5cGVvZiBwcm9wZXJ0eXZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAvLyAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ucmVwbGFjZShzdHJldGNoLCBwcm9wZXJ0eXZhbHVlKTtcbiAgICAgICAgICAgIC8vICAgICBzcWxjb21tYW5kLmFkZFBhcmFtZXRlcihwcm9wZXJ0eXZhbHVlKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGVsc2UgaWYgKHV0aWwuaXNEYXRlKHByb3BlcnR5dmFsdWUpKSB7XG4gICAgICAgICAgICAvLyAgICAgLy9jb25zdCB2YWx1ZSA9IG1vbWVudChwcm9wZXJ0eXZhbHVlKS5mb3JtYXQoXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpO1xuICAgICAgICAgICAgLy8gICAgIGNvbnN0IHZhbHVlID0gbW9tZW50KHByb3BlcnR5dmFsdWUpLmZvcm1hdChDb25zdGFudHMuZm9ybWF0LmRhdGV0aW1lKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5yZXBsYWNlKHN0cmV0Y2gsIHByb3BlcnR5dmFsdWUpO1xuICAgICAgICAgICAgLy8gICAgIHNxbGNvbW1hbmQuYWRkUGFyYW1ldGVyKHZhbHVlKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGVsc2UgaWYgKHV0aWwuaXNBcnJheShwcm9wZXJ0eXZhbHVlKSkge1xuICAgICAgICAgICAgLy8gICAgIGxvZ2dlci5lcnJvcihcIkNhbiBub3QgdHJhbnNsYXRlIHNuaXBwZXQgXCIgKyBzdHJldGNoICsgXCIgYnkgY29sbGVjdGlvbjogXCIgKyBwcm9wZXJ0eXZhbHVlKTtcbiAgICAgICAgICAgIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gbm90IHRyYW5zbGF0ZSBzbmlwcGV0IFwiICsgc3RyZXRjaCArIFwiIGJ5IGNvbGxlY3Rpb246IFwiICsgcHJvcGVydHl2YWx1ZSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBjb25zdCBzdHJldGNoID0gbXlBcnJheVswXTtcbiAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5ID0gbXlBcnJheVsxXS5yZXBsYWNlKGRhdGEgKyBcIi5cIiwgXCJcIik7XG4gICAgICAgICAgICBjb25zdCBmaWVsZHMgPSBwcm9wZXJ0eS5zcGxpdChcInxcIik7XG5cbiAgICAgICAgICAgIGxldCBwcm9wZXJ0eXZhbHVlID0gdGhpcy5nZXRWYWx1ZShkYXRhLCBmaWVsZHNbMF0uc3BsaXQoXCIuXCIpKTtcbiAgICAgICAgICAgIHByb3BlcnR5dmFsdWUgPSBwcm9wZXJ0eXZhbHVlP3Byb3BlcnR5dmFsdWU6XCJcIjtcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBcIlwiO1xuICAgICAgICAgICAgaWYoZmllbGRzLmxlbmd0aD49Mil7XG4gICAgICAgICAgICAgICAgLy9jw7MgZm9ybWF0XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZmllbGRzWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFMaWJzLmlzQmxhbmsoZm9ybWF0KSl7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcHJvcGVydHl2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZihcImRhdGVcIj09Zm9ybWF0KXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtb21lbnQocHJvcGVydHl2YWx1ZSkuZm9ybWF0KENvbnN0YW50cy5kYXRhLmZvcm1hdC5kYXRlKTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihcImRhdGV0aW1lXCI9PWZvcm1hdCl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbW9tZW50KHByb3BlcnR5dmFsdWUpLmZvcm1hdChDb25zdGFudHMuZGF0YS5mb3JtYXQuZGF0ZXRpbWUpXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoXCJudW1lcmljXCI9PWZvcm1hdCl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gTGlicy5mb3JtYXROdW0odmFsdWUsQ29uc3RhbnRzLmRhdGEuZm9ybWF0Lm51bWVyaWMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5yZXBsYWNlKHN0cmV0Y2gsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBzcWxjb21tYW5kLmFkZFBhcmFtZXRlcih2YWx1ZSk7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9pZiAocHJvcGVydHl2YWx1ZSA9PSBudWxsIHx8IHR5cGVvZiBwcm9wZXJ0eXZhbHVlID09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHByb3BlcnR5dmFsdWUgPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgcHJvcGVydHl2YWx1ZSA9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2Uoc3RyZXRjaCwgcHJvcGVydHl2YWx1ZSk7XG4gICAgICAgICAgICAgICAgc3FsY29tbWFuZC5hZGRQYXJhbWV0ZXIocHJvcGVydHl2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgICB9XG59XG5jbGFzcyBOb1N0cmluZyBleHRlbmRzIE5vIHtcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQudHJpbSgpO1xuICAgIH1cbiAgICBnZXRTcWwoc3FsY29tbWFuZCwgZGF0YSkge1xuICAgICAgICBzcWxjb21tYW5kLnNxbCArPSBzdXBlci5wcm9jZXNzZXhwcmVzc2lvbih0aGlzLnRleHQsIHNxbGNvbW1hbmQsIGRhdGEpICsgXCIgXCI7XG4gICAgfVxufVxuXG5jbGFzcyBOb0Nob29zZSBleHRlbmRzIE5vIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgYWRkKG5vKSB7XG4gICAgICAgIHN1cGVyLmFkZChubyk7XG4gICAgICAgIGlmIChubyBpbnN0YW5jZW9mIE5vT3RoZXJ3aXNlKSB7XG4gICAgICAgICAgICB0aGlzLm5vT3RoZXJ3aXNlID0gbm87XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0U3FsKHNxbGNvbW1hbmQsIGRhdGEpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IG5vID0gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChubyBpbnN0YW5jZW9mIE5vV2hlbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vd2hlbiA9IG5vO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBub3doZW4uZXhwcmVzc2lvblRlc3QucmVwbGFjZShcIiN7XCIsIFwiZGF0YS5cIikucmVwbGFjZShcIn1cIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZXZhbChcImlmKCBcIiArIGV4cHJlc3Npb24gKyBcIiApIGRhdGEudmFsdWVFeHByZXNzaW9uID0gdHJ1ZTsgZWxzZSBkYXRhLnZhbHVlRXhwcmVzc2lvbiA9IGZhbHNlO1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlRXhwcmVzc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZUV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vd2hlbi5nZXRTcWwoc3FsY29tbWFuZCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm5vT3RoZXJ3aXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub090aGVyd2lzZS5nZXRTcWwoc3FsY29tbWFuZCwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxufVxuY2xhc3MgTm9XaGVuIGV4dGVuZHMgTm8ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb25UZXN0LCB0ZXh0KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvblRlc3QgPSBleHByZXNzaW9uVGVzdDtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICAgICBcbiAgICAgICAgLy9jb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXCJbX2EtekEtWl1bX2EtekEtWjAtOV17MCwzMH1cIiwgXCJpZ1wiKTtcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKFwiW2Etei5BLVowLTlfXVtfYS16LkEtWjAtOV17MCwzMH1cIiwgXCJpZ1wiKTtcbiAgICAgICAgY29uc3QgaWRlbnRpZmllcnMgPSBbXTtcbiAgICAgICAgbGV0IG15QXJyYXkgPSBbXTtcbiAgICAgICAgd2hpbGUgKChteUFycmF5ID0gcmVnZXguZXhlYyhleHByZXNzaW9uVGVzdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gbXlBcnJheVswXTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciA9PSBcIm51bGxcIiB8fCBpZGVudGlmaWVyID09IFwidHJ1ZVwiIHx8IGlkZW50aWZpZXIgPT0gXCJmYWxzZVwiIHx8IGlkZW50aWZpZXIgPT0gXCJhbmRcIikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvblRlc3QgPSB0aGlzLmV4cHJlc3Npb25UZXN0LnJlcGxhY2UoaWRlbnRpZmllciwgXCJkYXRhLlwiICsgaWRlbnRpZmllcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5leHByZXNzaW9uVGVzdCA9IHModGhpcy5leHByZXNzaW9uVGVzdCkucmVwbGFjZUFsbChcImFuZFwiLCBcIiYmXCIpLnRvU3RyaW5nKCk7XG4gICAgfVxufVxuY2xhc3MgTm9Gb3JFYWNoIGV4dGVuZHMgTm8ge1xuICAgIGNvbnN0cnVjdG9yKGl0ZW0sIGluZGV4LCBzZXBhcmF0b3IsIG9wZW5pbmcsIGNsb3N1cmUsIHRleHQsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLnNlcGFyYXRvciA9IHNlcGFyYXRvcjtcbiAgICAgICAgdGhpcy5vcGVuaW5nID0gb3BlbmluZztcbiAgICAgICAgdGhpcy5jbG9zdXJlID0gY2xvc3VyZTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dC50cmltKCk7XG4gICAgfVxuICAgIGdldFNxbChzcWxjb21tYW5kLCBkYXRhKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBbXTtcbiAgICAgICAgbGV0IGNvbGxlY3Rpb24gPSBkYXRhW3RoaXMuY29sbGVjdGlvbl07XG4gICAgICAgIFxuICAgICAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodXRpbC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuaW5nICsgdGhpcy5jbG9zdXJlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBsZXQgbXlBcnJheTtcbiAgICAgICAgICAgIC8vdGhheSB0aGUgcmVnZXgsIHJlZ2V4IG7DoHkga2jDtG5nIHRo4buDIGzhu41jIMSRxrDhu6NjIHBhcmFtIGPDsyBk4bqldSBfIGhv4bq3YyBz4buRXG4gICAgICAgICAgICAvL2NvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChcIiN7KFthLXouQS1aXSspfVwiLCBcImlnXCIpO1xuICAgICAgICAgICAgLy9jb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXCIjeyhbYS16LkEtWjAtOV9dKyl9XCIsIFwiaWdcIik7XG4gICAgICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXCIjeyhbYS16LkEtWjAtOV98XSspfVwiLCBcImlnXCIpO1xuICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHRoaXMudGV4dDtcbiAgICAgICAgICAgIGxldCBuZXdleHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgICAgd2hpbGUgKChteUFycmF5ID0gcmVnZXguZXhlYyhleHByZXNzaW9uKSkgIT09IG51bGwpIHsgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbnN0IHN0cmV0Y2ggPSBteUFycmF5WzBdO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IHByb3BlcnR5ID0gbXlBcnJheVsxXS5yZXBsYWNlKHRoaXMuaXRlbSArIFwiLlwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBwcm9wZXJ0eXZhbHVlID0gdGhpcy5nZXRWYWx1ZShpdGVtLCBwcm9wZXJ0eS5zcGxpdChcIi5cIikpO1xuICAgICAgICAgICAgICAgIC8vIHZhciBtb250aCA9IG1vbWVudCgpLm1vbnRoKCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHR5cGVvZiBwcm9wZXJ0eXZhbHVlID09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHByb3BlcnR5dmFsdWUgPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgcHJvcGVydHl2YWx1ZSA9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgICAgIC8vICAgICBuZXdleHByZXNzaW9uID0gbmV3ZXhwcmVzc2lvbi5yZXBsYWNlKHN0cmV0Y2gsIHByb3BlcnR5dmFsdWUpO1xuICAgICAgICAgICAgICAgIC8vICAgICBzcWxjb21tYW5kLmFkZFBhcmFtZXRlcihwcm9wZXJ0eXZhbHVlKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RyZXRjaCA9IG15QXJyYXlbMF07XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHkgPSBteUFycmF5WzFdLnJlcGxhY2UodGhpcy5pdGVtICsgXCIuXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkcyA9IHByb3BlcnR5LnNwbGl0KFwifFwiKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5dmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW0sIGZpZWxkc1swXS5zcGxpdChcIi5cIikpO1xuICAgICAgICAgICAgICAgIHZhciBmb3JtYXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGlmKGZpZWxkcy5sZW5ndGg+PTIpe1xuICAgICAgICAgICAgICAgICAgICAvL2PDsyBmb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZmllbGRzWzFdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICBpZighTGlicy5pc0JsYW5rKGZvcm1hdCkpe1xuICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHByb3BlcnR5dmFsdWU7XG4gICAgICAgICAgICAgICAgICAgaWYoXCJkYXRlXCI9PWZvcm1hdCl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbW9tZW50KHByb3BlcnR5dmFsdWUpLmZvcm1hdChDb25zdGFudHMuZGF0YS5mb3JtYXQuZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoXCJkYXRldGltZVwiPT1mb3JtYXQpe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG1vbWVudChwcm9wZXJ0eXZhbHVlKS5mb3JtYXQoQ29uc3RhbnRzLmRhdGEuZm9ybWF0LmRhdGV0aW1lKVxuICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKFwibnVtZXJpY1wiPT1mb3JtYXQpe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IExpYnMuZm9ybWF0TnVtKHZhbHVlLENvbnN0YW50cy5kYXRhLmZvcm1hdC5udW1lcmljKTtcbiAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld2V4cHJlc3Npb24gPSBuZXdleHByZXNzaW9uLnJlcGxhY2Uoc3RyZXRjaCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBzcWxjb21tYW5kLmFkZFBhcmFtZXRlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgLy9pZiAocHJvcGVydHl2YWx1ZSA9PSBudWxsIHx8IHR5cGVvZiBwcm9wZXJ0eXZhbHVlID09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHByb3BlcnR5dmFsdWUgPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgcHJvcGVydHl2YWx1ZSA9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgICAgICAgICBuZXdleHByZXNzaW9uID0gbmV3ZXhwcmVzc2lvbi5yZXBsYWNlKHN0cmV0Y2gsIHByb3BlcnR5dmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBzcWxjb21tYW5kLmFkZFBhcmFtZXRlcihwcm9wZXJ0eXZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXh0LnB1c2gobmV3ZXhwcmVzc2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3FsID0gdGhpcy5vcGVuaW5nICsgdGV4dC5qb2luKHRoaXMuc2VwYXJhdG9yKSArIHRoaXMuY2xvc3VyZTtcbiAgICAgICAgc3FsY29tbWFuZC5zcWwgKz0gc3FsO1xuICAgICAgICByZXR1cm4gc3FsY29tbWFuZDtcbiAgICB9XG59XG5jbGFzcyBOb0lmIGV4dGVuZHMgTm8ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb25UZXN0LCB0ZXh0KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvblRlc3QgPSBleHByZXNzaW9uVGVzdDtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICAgICAgLy9jb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXCJbX2EtekEtWl1bX2EtekEtWjAtOV17MCwzMH1cIiwgXCJpZ1wiKTtcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKFwiW2Etei5BLVowLTlfXVtfYS16LkEtWjAtOV17MCwzMH1cIiwgXCJpZ1wiKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXJzID0gW107XG4gICAgICAgIGxldCBteUFycmF5ID0gW107XG4gICAgICAgIFxuICAgICAgICB3aGlsZSAoKG15QXJyYXkgPSByZWdleC5leGVjKGV4cHJlc3Npb25UZXN0KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBteUFycmF5WzBdO1xuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgPT0gXCJudWxsXCIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25UZXN0ID0gdGhpcy5leHByZXNzaW9uVGVzdC5yZXBsYWNlKGlkZW50aWZpZXIsIFwiZGF0YS5cIiArIGlkZW50aWZpZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldFNxbChzcWxjb21tYW5kLCBkYXRhKSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB0aGlzLmV4cHJlc3Npb25UZXN0LnJlcGxhY2UoXCIje1wiLCBcImRhdGEuXCIpLnJlcGxhY2UoXCJ9XCIsIFwiXCIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGV2YWwoXCJpZiggXCIgKyBleHByZXNzaW9uICsgXCIgKSBkYXRhLnZhbHVlRXhwcmVzc2lvbiA9IHRydWU7IGVsc2UgZGF0YS52YWx1ZUV4cHJlc3Npb24gPSBmYWxzZTtcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGF0YS52YWx1ZUV4cHJlc3Npb24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS52YWx1ZUV4cHJlc3Npb24gPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmdldFNxbChzcWxjb21tYW5kLCBkYXRhKSArIFwiIFwiO1xuICAgIH1cbn1cbmNsYXNzIE5vT3RoZXJ3aXNlIGV4dGVuZHMgTm8ge1xuICAgIGNvbnN0cnVjdG9yKHRleHQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICB9XG4gICAgZ2V0U3FsKHNxbGNvbW1hbmQsIGRhdGEpIHtcbiAgICAgICAgbGV0IG15QXJyYXk7XG4gICAgICAgIC8vY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKFwiI3soW2Etei5BLVpdKyl9XCIsIFwiaWdcIik7XG4gICAgICAgIC8vdGhheSB0aGUgcmVnZXgsIHJlZ2V4IG7DoHkga2jDtG5nIHRo4buDIGzhu41jIMSRxrDhu6NjIHBhcmFtIGPDsyBk4bqldSBfIGhv4bq3YyBz4buRXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChcIiN7KFthLXouQS1aMC05X3xdKyl9XCIsIFwiaWdcIik7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0gdGhpcy50ZXh0O1xuICAgICAgICB3aGlsZSAoKG15QXJyYXkgPSByZWdleC5leGVjKHRoaXMudGV4dCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBjb25zdCBzdHJldGNoID0gbXlBcnJheVswXTtcbiAgICAgICAgICAgIC8vIGNvbnN0IHByb3BlcnR5dmFsdWUgPSB0aGlzLmdldFZhbHVlKGRhdGEsIG15QXJyYXlbMV0uc3BsaXQoXCIuXCIpKTtcbiAgICAgICAgICAgIC8vIGlmICh0eXBlb2YgcHJvcGVydHl2YWx1ZSA9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBwcm9wZXJ0eXZhbHVlID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHByb3BlcnR5dmFsdWUgPT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIC8vICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5yZXBsYWNlKHN0cmV0Y2gsIHByb3BlcnR5dmFsdWUpO1xuICAgICAgICAgICAgLy8gICAgIHNxbGNvbW1hbmQuYWRkUGFyYW1ldGVyKHByb3BlcnR5dmFsdWUpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgY29uc3Qgc3RyZXRjaCA9IG15QXJyYXlbMF07XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IG15QXJyYXlbMV0ucmVwbGFjZShkYXRhICsgXCIuXCIsIFwiXCIpO1xuICAgICAgICAgICAgY29uc3QgZmllbGRzID0gcHJvcGVydHkuc3BsaXQoXCJ8XCIpO1xuXG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eXZhbHVlID0gdGhpcy5nZXRWYWx1ZShkYXRhLCBmaWVsZHNbMF0uc3BsaXQoXCIuXCIpKTtcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBcIlwiO1xuICAgICAgICAgICAgaWYoZmllbGRzLmxlbmd0aD49Mil7XG4gICAgICAgICAgICAgICAgLy9jw7MgZm9ybWF0XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZmllbGRzWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFMaWJzLmlzQmxhbmsoZm9ybWF0KSl7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcHJvcGVydHl2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZihcImRhdGVcIj09Zm9ybWF0KXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtb21lbnQocHJvcGVydHl2YWx1ZSkuZm9ybWF0KENvbnN0YW50cy5kYXRhLmZvcm1hdC5kYXRlKTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihcImRhdGV0aW1lXCI9PWZvcm1hdCl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbW9tZW50KHByb3BlcnR5dmFsdWUpLmZvcm1hdChDb25zdGFudHMuZGF0YS5mb3JtYXQuZGF0ZXRpbWUpXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoXCJudW1lcmljXCI9PWZvcm1hdCl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gTGlicy5mb3JtYXROdW0odmFsdWUsQ29uc3RhbnRzLmRhdGEuZm9ybWF0Lm51bWVyaWMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5yZXBsYWNlKHN0cmV0Y2gsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBzcWxjb21tYW5kLmFkZFBhcmFtZXRlcih2YWx1ZSk7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ucmVwbGFjZShzdHJldGNoLCBwcm9wZXJ0eXZhbHVlKTtcbiAgICAgICAgICAgICAgICBzcWxjb21tYW5kLmFkZFBhcmFtZXRlcihwcm9wZXJ0eXZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzcWxjb21tYW5kLnNxbCArPSBleHByZXNzaW9uICsgXCIgXCI7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRkxSZXBvcnRUZW1wbGF0ZVJlbmRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuICAgIHJlYWQoIGdjaGlsZCxpbmNoYXJnZSxkYXRhKSB7XG4gICAgICAgIGZvciAoY29uc3Qgbm8gb2YgQXJyYXkuZnJvbShnY2hpbGQuY2hpbGROb2RlcykpIHtcbiAgICAgICAgICAgIGlmIChuby5ub2RlTmFtZSA9PSBcImNob29zZVwiKSB7XG4gICAgICAgICAgICAgICB0aGlzLnJlYWRDaG9vc2Uobm8sIGluY2hhcmdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5vLm5vZGVOYW1lID09IFwiaWZcIikge1xuICAgICAgICAgICAgICAgdGhpcy5yZWFkSWYobm8sIGluY2hhcmdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5vLm5vZGVOYW1lID09IFwiZm9yZWFjaFwiKSB7XG4gICAgICAgICAgICAgICB0aGlzLnJlYWRGb3JFYWNoKG5vLCBpbmNoYXJnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobm8uaGFzQ2hpbGROb2RlcygpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuby5ub2RlTmFtZSAhPSBcIiNjb21tZW50XCIpe1xuICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub1N0cmluZyA9IG5ldyBOb1N0cmluZyhuby50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2hhcmdlLmFkZChub1N0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkSW5jaGFyZ2UgPSBuZXcgTm8oKTsgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIHRoaXMucmVhZChubyxjaGlsZEluY2hhcmdlLGRhdGEpO1xuICAgICAgICAgICAgICAgICAgY29uc3Qgc3FsY29tbWFuZCA9IG5ldyBTcWxDb21tYW5kKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZEluY2hhcmdlLmdldFNxbChzcWxjb21tYW5kLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgIHZhciBzcWwgPSBzcWxjb21tYW5kLnNxbDtcbiAgICAgICAgICAgICAgICAgIG5vLnRleHRDb250ZW50ID1zcWw7XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gZGVjb2RlKG5vLnRvU3RyaW5nKCkpXG5cbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5vU3RyaW5nID0gbmV3IE5vU3RyaW5nKGh0bWwpO1xuICAgICAgICAgICAgICAgICAgaW5jaGFyZ2UuYWRkKG5vU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzcWxjb21tYW5kID0gbmV3IFNxbENvbW1hbmQoKTtcbiAgICAgICAgaW5jaGFyZ2UuZ2V0U3FsKHNxbGNvbW1hbmQsIGRhdGEpO1xuICAgICAgICB2YXIgc3FsID0gc3FsY29tbWFuZC5zcWw7XG4gICAgICAgIGluY2hhcmdlLnJlbW92ZUFsbCgpO1xuICAgICAgICBjb25zdCBub1N0cmluZyA9IG5ldyBOb1N0cmluZyhzcWwpO1xuICAgICAgICBpbmNoYXJnZS5hZGQobm9TdHJpbmcpOyAgICAgIFxuICAgIH1cbiAgICByZWFkRm9yRWFjaChubywgbm9tYWluLCBtYXBwaW5nKSB7XG4gICAgICAgIGxldCB2YWx1ZVNlcGFyYWRvciA9IFwiXCI7XG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKFwic2VwYXJhdG9yXCIpKSB7XG4gICAgICAgICAgICB2YWx1ZVNlcGFyYWRvciA9IG5vLmdldEF0dHJpYnV0ZU5vZGUoXCJzZXBhcmF0b3JcIikudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHZhbHVlQXZlcmFnZSA9IFwiXCI7XG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKFwib3BlblwiKSkge1xuICAgICAgICAgICAgdmFsdWVBdmVyYWdlID0gbm8uZ2V0QXR0cmlidXRlTm9kZShcIm9wZW5cIikudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNsb3Npbmd2YWx1ZSA9IFwiXCI7XG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKFwiY2xvc2VcIikpIHtcbiAgICAgICAgICAgIGNsb3Npbmd2YWx1ZSA9IG5vLmdldEF0dHJpYnV0ZU5vZGUoXCJjbG9zZVwiKS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdmFsdWVJbmRleCA9IFwiXCI7XG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKFwiaW5kZXhcIikpIHtcbiAgICAgICAgICAgIHZhbHVlSW5kZXggPSBuby5nZXRBdHRyaWJ1dGVOb2RlKFwiaW5kZXhcIikudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHZhbHVlQ29sbGVjdGlvbiA9IFwiXCI7XG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKFwiY29sbGVjdGlvblwiKSkge1xuICAgICAgICAgICAgdmFsdWVDb2xsZWN0aW9uID0gbm8uZ2V0QXR0cmlidXRlTm9kZShcImNvbGxlY3Rpb25cIikudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kYXkgPSBuZXcgTm9Gb3JFYWNoKG5vLmdldEF0dHJpYnV0ZU5vZGUoXCJpdGVtXCIpLnZhbHVlLCB2YWx1ZUluZGV4LCB2YWx1ZVNlcGFyYWRvciwgdmFsdWVBdmVyYWdlLCBjbG9zaW5ndmFsdWUsIG5vLmNoaWxkTm9kZXMudG9TdHJpbmcoKSwgdmFsdWVDb2xsZWN0aW9uLCBtYXBwaW5nKTtcbiAgICAgICAgXG4gICAgICAgIG5vbWFpbi5hZGQobm9kYXkpO1xuICAgIH1cbiAgICByZWFkSWYobm8sIG5vbWFpbiwgbWFwcGluZykge1xuICAgICAgICBjb25zdCBub0lmID0gbmV3IE5vSWYobm8uZ2V0QXR0cmlidXRlTm9kZShcInRlc3RcIikudmFsdWUsIG5vLmNoaWxkTm9kZXNbMF0udG9TdHJpbmcoKSwgbWFwcGluZyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm8uY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgbm9zb24gPSBuby5jaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKG5vc29uLm5vZGVOYW1lID09IFwiY2hvb3NlXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWRDaG9vc2Uobm9zb24sIG5vSWYsIG1hcHBpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm9zb24ubm9kZU5hbWUgPT0gXCJpZlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkSWYobm9zb24sIG5vSWYsIG1hcHBpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm9zb24ubm9kZU5hbWUgPT0gXCJmb3JlYWNoXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWRGb3JFYWNoKG5vc29uLCBub0lmLCBtYXBwaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChub3Nvbi5oYXNDaGlsZE5vZGVzKCkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vc29uLm5vZGVOYW1lICE9IFwiI2NvbW1lbnRcIil7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc3Qgbm9TdHJpbmcgPSBuZXcgTm9TdHJpbmcobm9zb24udGV4dENvbnRlbnQsIG1hcHBpbmcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBub1N0cmluZyA9IG5ldyBOb1N0cmluZyhub3Nvbi50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgbm9JZi5hZGQobm9TdHJpbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIC8vMSBlbGVtZW50LCB0csaw4budbmcgaOG7o3AgbsOgeSBraMO0bmcgY2hvIHBow6lwIHRow6ptIG7hu69hXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vU3RyaW5nID0gbmV3IE5vU3RyaW5nKG5vc29uLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICBub0lmLmFkZChub1N0cmluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5vbWFpbi5hZGQobm9JZik7XG4gICAgfVxuICAgIHJlYWRDaG9vc2Uobm8sIG5vbWFpbikge1xuICAgICAgICBjb25zdCBub2hlYWQgPSBuZXcgTm9DaG9vc2UoKTtcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8IG5vLmNoaWxkTm9kZXMubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgY29uc3Qgbm9zb24gPSBuby5jaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKG5vc29uLm5vZGVOYW1lID09IFwid2hlblwiKSB7XG4gICAgICAgICAgICAgICAgbm9oZWFkLmFkZCh0aGlzLnJlYWROb1doZW4obm9zb24sIG5vKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChub3Nvbi5ub2RlTmFtZSA9PSBcIm90aGVyd2lzZVwiKSB7XG4gICAgICAgICAgICAgICAgbm9oZWFkLmFkZChuZXcgTm9PdGhlcndpc2Uobm9zb24uY2hpbGROb2Rlc1swXS50b1N0cmluZygpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbm9tYWluLmFkZChub2hlYWQpO1xuICAgIH1cbiAgICByZWFkTm9XaGVuKG5vLCBub1ByaXZhdGUpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvblRlc3QgPSBuby5nZXRBdHRyaWJ1dGVOb2RlKFwidGVzdFwiKS52YWx1ZTtcbiAgICAgICAgdmFyIGRhdGEgPSBcIlwiO1xuICAgICAgICBpZihuby5jaGlsZE5vZGVzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgZGF0YT1uby5jaGlsZE5vZGVzWzBdLnRvU3RyaW5nKCk7Ly9uZW4gdGhheSB0b1N0cmluZygpXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm93aGVuID0gbmV3IE5vV2hlbihleHByZXNzaW9uVGVzdCwgZGF0YSk7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGxldCBpPTA7aTwgbm8uY2hpbGROb2Rlcy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICBjb25zdCBub3NvbiA9IG5vLmNoaWxkTm9kZXNbaV07XG5cbiAgICAgICAgICAgIGlmIChub3Nvbi5ub2RlTmFtZSA9PSBcImNob29zZVwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkQ2hvb3NlKG5vc29uLCBub3doZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm9zb24ubm9kZU5hbWUgPT0gXCJpZlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkSWYobm9zb24sIG5vd2hlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChub3Nvbi5ub2RlTmFtZSA9PSBcImZvcmVhY2hcIikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZEZvckVhY2gobm9zb24sIG5vd2hlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChub3Nvbi5oYXNDaGlsZE5vZGVzKCkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9zb24ubm9kZU5hbWUgIT0gXCIjY29tbWVudFwiKXtcbiAgICAgICAgICAgICAgICAvL2NvbnN0IG5vU3RyaW5nID0gbmV3IE5vU3RyaW5nKG5vc29uLnRleHRDb250ZW50KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG5vU3RyaW5nID0gbmV3IE5vU3RyaW5nKG5vc29uLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIG5vd2hlbi5hZGQobm9TdHJpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIC8vMSBlbGVtZW50LCB0csaw4budbmcgaOG7o3AgbsOgeSBraMO0bmcgY2hvIHBow6lwIHRow6ptIG7hu69hXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9TdHJpbmcgPSBuZXcgTm9TdHJpbmcobm9zb24udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbm93aGVuLmFkZChub1N0cmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vd2hlbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVuZGVyIGh0bWwgdGVtcGxhdGUgd2l0aCBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IGZpbGVuYW1lXG4gICAgICogQHBhcmFtIHsqfSBkYXRhXG4gICAgICogQHJldHVybnNcbiAgICAgKiBAbWVtYmVyb2YgRkxSZXBvcnRUZW1wbGF0ZVJlbmRlclxuICAgICAqL1xuICAgIHJlbmRlcihmaWxlbmFtZSxkYXRhKSB7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGxldCBkaXIgPSBjb25maWcuc2VydmVyLnJlcG9ydF9kaXI7XG4gICAgICAgICAgICBsZXQgZXh0ID0gY29uZmlnLnNlcnZlci5yZXBvcnRfZXh0O1xuICAgICAgICAgICAgZmlsZW5hbWUgPSBhcHBQYXRoICsgZGlyICsgZmlsZW5hbWUgKyBleHQ7XG4gICAgICAgICAgICBpZiAoZnMubHN0YXRTeW5jKCBmaWxlbmFtZSkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGh0bWxDb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGh0bWxDb250ZW50cyA9IHRoaXMucmVuZGVyQ29udGVudChodG1sQ29udGVudHMsZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gaHRtbENvbnRlbnRzO1xuICAgICAgICB9Y2F0Y2goZXJyKXtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlbmRlciBodG1sIGNvbnRlbnRzXG4gICAgICogQHBhcmFtIHtIVE1MIFN0cmluZ30gaHRtbENvbnRlbnRzIFxuICAgICAqIEBwYXJhbSB7QXJyYXkgb3Igb2JqZWN0fSBkYXRhIFxuICAgICAqL1xuICAgIHJlbmRlckNvbnRlbnQoaHRtbENvbnRlbnRzLGRhdGEpIHtcbiAgICAgICAgaWYoTGlicy5pc0JsYW5rKGh0bWxDb250ZW50cykpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgY29uc3QgeG1sRG9jID0gbmV3ICB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGh0bWxDb250ZW50cyk7XG4gICAgICAgICAgICBpZiAoeG1sRG9jLmRvY3VtZW50RWxlbWVudC5ub2RlTmFtZSAhPSBcImh0bWxcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgd2UgPSB4bWxEb2MuZG9jdW1lbnRFbGVtZW50LmNoaWxkTm9kZXM7XG4gICAgICAgICAgICBjb25zdCBpbmNoYXJnZSA9IG5ldyBObygpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBub1htbCBvZiBBcnJheS5mcm9tKHdlKSkge1xuICAgICAgICAgICAgICAgIGlmIChub1htbC5ub2RlTmFtZSA9PSBcImJvZHlcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlYWQobm9YbWwsaW5jaGFyZ2UsZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNxbGNvbW1hbmQgPSBuZXcgU3FsQ29tbWFuZCgpO1xuICAgICAgICAgICAgICAgICAgICBpbmNoYXJnZS5nZXRTcWwoc3FsY29tbWFuZCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIG5vWG1sLnRleHRDb250ZW50ID0gc3FsY29tbWFuZC5zcWwgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaHRtbENvbnRlbnRzID0gZGVjb2RlKHhtbERvYy50b1N0cmluZygpKTtcbiAgICAgICAgICAgIHJldHVybiBodG1sQ29udGVudHM7XG4gICAgICAgIH1jYXRjaChlcnIpe1xuICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufVxuIl19