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

var FLReportRender = function () {
    function FLReportRender() {
        _classCallCheck(this, FLReportRender);
    }

    _createClass(FLReportRender, [{
        key: "render",
        value: function render(filename, data) {
            var templateRender = new FLReportTemplateRender();
            return templateRender.render(filename, data);
        }
    }, {
        key: "renderContent",
        value: function renderContent(htmlContents, data) {
            var templateRender = new FLReportTemplateRender();
            return templateRender.renderContent(htmlContents, data);
        }
    }]);

    return FLReportRender;
}();

exports.default = FLReportRender;

var No = function () {
    function No(render) {
        _classCallCheck(this, No);

        this.children = [];
        this.renderClass = render;
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
        key: "getCompiledContent",
        value: function getCompiledContent() {
            for (var prop in this.children) {
                if (prop in this.children) {
                    var noson = this.children[prop];
                    noson.getCompiledContent();
                }
            }
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
        value: function processexpression(expression, data) {
            try {
                var myArray = void 0;
                //sửa bug không phân tích được paramer từ 2 trở lên ví dụ #{param1},{#param2}
                var newexpression = expression;
                //const regex = new RegExp("#{([a-z.A-Z0-9_|()]+)}", "ig");
                //chấp nhận công thức trong expresstion
                var regex = new RegExp("#{([a-z.A-Z0-9_|()\"'+*\\-\\/\\%=? ;.#,:]+)}", "ig");

                while ((myArray = regex.exec(newexpression)) !== null) {

                    var stretch = myArray[0];
                    var property = myArray[1].replace(data + ".", "");
                    var fields = property.split("|");
                    var fieldExpression = fields[0];
                    var expArray = [];
                    //phân tích công thức trong biểu thức
                    var regexExp = new RegExp("([a-z.A-Z0-9_]+)", "ig");
                    var subFieldExpress = fieldExpression;
                    var field = "";
                    while ((expArray = regexExp.exec(fieldExpression)) !== null) {
                        //giu nguyen ham thu vien
                        var newField = expArray[0];
                        var value = "";
                        if (!Libs.isNumber(newField)) {
                            value = this.getValue(data, newField.split("."));
                            if (typeof value === "undefined") {
                                //nghi ngờ là hàm thư viện nên giữa nguyên
                                value = newField;
                                if (!Libs.isBlank(value) && !Libs.isNumber(value) && value.indexOf("this.") >= 0) {
                                    value = value.replace("this.", "this.renderClass.");
                                }
                            } else {
                                //trường hợp có giá trị
                                //đã tìm thấy có giá trị trong collection data
                                value = "data." + newField;
                            }
                        } else {
                            value = newField;
                        }
                        var express = subFieldExpress.substring(0, subFieldExpress.indexOf(newField) + newField.length + 1);
                        field += express.replace(newField, value);
                        subFieldExpress = subFieldExpress.substring(subFieldExpress.indexOf(newField) + newField.length + 1);
                    }
                    var propertyvalue = "";
                    field += subFieldExpress;
                    //thuc thi ham thu vien neu co
                    // var libExe = fields[0].replace(childExpression, propertyvalue);

                    try {
                        if (!Libs.isBlank(field) && field.indexOf("=") >= 0) {
                            eval(field);
                            propertyvalue = "";
                        } else {
                            propertyvalue = eval(field);
                        }

                        if (typeof propertyvalue == 'undefined') {
                            propertyvalue = "";
                        }
                    } catch (err) {
                        propertyvalue = "";
                    }
                    propertyvalue = this.formatValue(propertyvalue, fields);
                    expression = expression.replace(stretch, propertyvalue);
                    // var format = "";
                    // if (fields.length >= 2) {
                    //     //có format
                    //     format = fields[1].trim();
                    // }
                    // if (!Libs.isBlank(format)) {
                    //     var value = propertyvalue;
                    //     if ("date" == format) {
                    //         value = moment(propertyvalue).format(Constants.data.format.date);
                    //     } else if ("datetime" == format) {
                    //         value = moment(propertyvalue).format(Constants.data.format.datetime)
                    //     } else if ("numeric" == format) {

                    //         value = Libs.formatNum(value, Constants.data.format.numeric);
                    //     }
                    //     expression = expression.replace(stretch, value);
                    // } else {
                    //     expression = expression.replace(stretch, propertyvalue);
                    // }
                }
                return expression;
            } catch (err) {
                logger.error(err);
                return "";
            }
        }
        /**
         * 
         * @param {String} value giá trị ban đầu của field
         * @param {Array} formatArr bắt đầu từ 1 trở đi là format, tùy theo là numeric, date hoặc datetime
         */

    }, {
        key: "formatValue",
        value: function formatValue(value, formatArr) {

            if (Libs.isBlank(value)) {
                return "";
            }
            var format = "";
            if (formatArr && formatArr.length >= 2) {
                //có format
                format = formatArr[1].trim();
            }
            if (Libs.isBlank(format)) {
                //khong có format nào thì trả về giá trị nguyên thủy
                return value;
            }

            //lấy format
            format = format.toLowerCase();

            //lấy format option 
            var firstFormatOtion = "";
            if (formatArr.length > 2) {
                firstFormatOtion = formatArr[2];
                if (!Libs.isBlank(firstFormatOtion) && firstFormatOtion.indexOf("this.") >= 0) {
                    firstFormatOtion = firstFormatOtion.replace("this.", "this.renderClass.");
                }
                try {
                    firstFormatOtion = eval(firstFormatOtion);
                } catch (e) {}
            }
            var secondFormatOption = "";
            //nếu là date hoặc datetime thì nếu không có format thứ 2 thì format đầu là format đến
            // nếu không có format 2 thì format đầu là đích đến
            if (formatArr.length > 3) {
                secondFormatOption = formatArr[3];
                if (!Libs.isBlank(secondFormatOption) && secondFormatOption.indexOf("this.") >= 0) {
                    secondFormatOption = secondFormatOption.replace("this.", "this.renderClass.");
                }
                try {
                    secondFormatOption = eval(secondFormatOption);
                } catch (e) {}
            }
            if (format == "numberic" || format == "numeric") {
                if (Libs.isBlank(firstFormatOtion)) {
                    value = Libs.formatNum(value);
                } else {
                    if (Libs.isBlank(secondFormatOption)) {
                        value = Libs.formatNum(value, eval(firstFormatOtion));
                    } else {
                        value = Libs.formatNum(value, firstFormatOtion, secondFormatOption);
                    }
                }
            } else if (format.indexOf("date") >= 0) {

                //nếu không có format thì phải phân biệt date hay datetime
                //ngược lại thì không, format dựa vào pattern truyền vào
                if (firstFormatOtion == "" && secondFormatOption == "") {
                    if (format == "date") {
                        firstFormatOtion = Constants.data.format.date.toUpperCase();
                    } else if (format == "datetime") {
                        firstFormatOtion = Constants.data.format.datetime;
                    }
                }
                //nếu không có format thứ 2 thì format đầu là format đến
                var formatFrom = "",
                    formatTo = firstFormatOtion;
                if (secondFormatOption != "") {
                    //nếu có format thứ 2 thì format thứ 2 là format đến
                    formatFrom = firstFormatOtion;
                    formatTo = secondFormatOption;
                }
                value = Libs.dateFormat(value, formatTo, formatFrom);
            }

            return value;
        }
    }]);

    return No;
}();

var NoString = function (_No) {
    _inherits(NoString, _No);

    function NoString(curNode, data, render) {
        _classCallCheck(this, NoString);

        var _this = _possibleConstructorReturn(this, (NoString.__proto__ || Object.getPrototypeOf(NoString)).call(this, render));

        _this.node = curNode;
        _this.data = data;
        return _this;
    }

    _createClass(NoString, [{
        key: "getCompiledContent",
        value: function getCompiledContent() {
            try {
                _get(NoString.prototype.__proto__ || Object.getPrototypeOf(NoString.prototype), "getCompiledContent", this).call(this);
                var text = _get(NoString.prototype.__proto__ || Object.getPrototypeOf(NoString.prototype), "processexpression", this).call(this, this.node.toString(), this.data) + "";
                //replace node hiện tại bằng node mới đã biên dịch
                if (this.node && this.node.parentNode) {
                    if (!Libs.isBlank(text)) {
                        var newNode = new xmldom.DOMParser().parseFromString(decode(text));
                        this.node.parentNode.replaceChild(newNode, this.node);
                    } else {
                        //không có remove luôn
                        this.node.parentNode.removeChild(this.node);
                    }
                }
            } catch (err) {
                //xẫy ra lỗi remove ra luôn
                if (this.node && this.node.parentNode) {
                    this.node.parentNode.removeChild(this.node);
                }
                logger.error(err);
            }
        }
    }]);

    return NoString;
}(No);

var NoChoose = function (_No2) {
    _inherits(NoChoose, _No2);

    function NoChoose(curNode, data, render) {
        _classCallCheck(this, NoChoose);

        var _this2 = _possibleConstructorReturn(this, (NoChoose.__proto__ || Object.getPrototypeOf(NoChoose)).call(this, render));

        _this2.node = curNode;
        _this2.data = data;
        return _this2;
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
        key: "getCompiledContent",
        value: function getCompiledContent() {
            var data = this.data;
            var text = "";
            var valueExpression = false;
            for (var i in this.children) {
                var no = this.children[i];
                if (no instanceof NoWhen) {
                    var nowhen = no;
                    var expression = nowhen.expressionTest.replace("#{", "data.").replace("}", "");
                    try {
                        eval("if( " + expression + " ) valueExpression = true; else valueExpression = false;");
                    } catch (err) {
                        valueExpression = false;
                    }
                    if (valueExpression) {
                        nowhen.getCompiledContent();
                        text = nowhen.node.childNodes.toString();
                        break;
                    }
                }
            }
            if (!valueExpression && this.noOtherwise) {
                this.noOtherwise.getCompiledContent();
                text = this.noOtherwise.node.childNodes.toString();
            }
            if (this.node && this.node.parentNode) {
                var newNode = new xmldom.DOMParser().parseFromString(decode(text));
                this.node.parentNode.replaceChild(newNode, this.node);
            }
        }
    }]);

    return NoChoose;
}(No);

var NoWhen = function (_No3) {
    _inherits(NoWhen, _No3);

    function NoWhen(curNode, data, render, expressionTest) {
        _classCallCheck(this, NoWhen);

        var _this3 = _possibleConstructorReturn(this, (NoWhen.__proto__ || Object.getPrototypeOf(NoWhen)).call(this, render));

        _this3.expressionTest = expressionTest;
        _this3.node = curNode;
        _this3.data = data;
        //const regex = new RegExp("[_a-zA-Z][_a-zA-Z0-9]{0,30}", "ig");
        var regex = new RegExp("[a-z.A-Z0-9_][_a-z.A-Z0-9]{0,30}", "ig");
        var identifiers = [];
        var myArray = [];
        _this3.expressionTest = s(_this3.expressionTest).replaceAll("and", "&&").toString();
        _this3.expressionTest = s(_this3.expressionTest).replaceAll("or", "||").toString();
        var newexpressionTest = _this3.expressionTest;
        while ((myArray = regex.exec(newexpressionTest)) !== null) {
            var identifier = myArray[0];

            if (identifier == "null" || identifier == "true" || identifier == "false" || identifier == "and") {
                continue;
            }
            identifiers.push(identifier);
            if (!Libs.isNumber(identifier)) {
                if (identifier.indexOf("this.") >= 0) {
                    var newIdentifier = identifier.replace("this.", "this.renderClass.");
                    _this3.expressionTest = _this3.expressionTest.replace(identifier, newIdentifier);
                } else {
                    var value = _this3.getValue(_this3.data, identifier.split("."));
                    if (typeof value == "undefined") {
                        //giữ nguyên

                    } else {
                        _this3.expressionTest = _this3.expressionTest.replace(identifier, "data." + identifier);
                    }
                }
            }
        }

        return _this3;
    }

    return NoWhen;
}(No);

var NoForEach = function (_No4) {
    _inherits(NoForEach, _No4);

    function NoForEach(curNode, data, render, item, index, separator, opening, closure, foreachNode, collection, parentClass) {
        _classCallCheck(this, NoForEach);

        var _this4 = _possibleConstructorReturn(this, (NoForEach.__proto__ || Object.getPrototypeOf(NoForEach)).call(this, render));

        _this4.node = curNode;
        _this4.data = data;
        _this4.item = item;
        _this4.index = index;
        _this4.separator = separator;
        _this4.opening = opening;
        _this4.closure = closure;
        _this4.collection = collection;
        _this4.foreachNode = foreachNode;
        _this4.parentClass = parentClass;
        return _this4;
    }

    _createClass(NoForEach, [{
        key: "getCompiledContent",
        value: function getCompiledContent() {
            try {
                var data = this.data;
                var text = [];
                var collection = data[this.collection];

                if (collection == null) {
                    if (util.isArray(data)) {
                        collection = data;
                    } else {
                        return this.opening + this.closure;
                    }
                }
                var rowIndex = 0;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        var textContent = "";
                        if (this.foreachNode.hasChildNodes()) {
                            //đọc tiếp để lấy ra nội dung trong foreach
                            var incharge = new No();
                            var childData = {};

                            eval("childData." + this.item + "=item");
                            eval("childData." + this.index + "=" + rowIndex);
                            //copy node ra không nó sẽ bị replace
                            var foreachNodeCopyed = this.foreachNode.cloneNode(true);
                            this.parentClass.read(foreachNodeCopyed, incharge, childData);
                            incharge.getCompiledContent();

                            textContent = foreachNodeCopyed.childNodes.toString();
                        } else {
                            textContent = this.foreachNode.textContent;
                        }
                        var newexpression = decode(textContent);
                        // láy giá trị nếu có

                        newexpression = _get(NoForEach.prototype.__proto__ || Object.getPrototypeOf(NoForEach.prototype), "processexpression", this).call(this, newexpression, item) + " ";

                        text.push(newexpression);
                        rowIndex++;
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

                //replace node hiện tại bằng node mới đã biên dịch
                if (this.node && this.node.parentNode) {
                    if (!Libs.isBlank(sql)) {
                        var newNode = new xmldom.DOMParser().parseFromString(decode(sql));
                        this.node.parentNode.replaceChild(newNode, this.node);
                    } else {
                        this.node.parentNode.removeChild(this.node);
                    }
                }
            } catch (err) {
                if (this.node && this.node.parentNode) {
                    this.node.parentNode.removeChild(this.node);
                }
                logger.error(err);
            }
        }
    }]);

    return NoForEach;
}(No);

var NoIf = function (_No5) {
    _inherits(NoIf, _No5);

    function NoIf(curNode, data, render, expressionTest) {
        _classCallCheck(this, NoIf);

        var _this5 = _possibleConstructorReturn(this, (NoIf.__proto__ || Object.getPrototypeOf(NoIf)).call(this, render));

        _this5.expressionTest = expressionTest;
        _this5.node = curNode;
        _this5.data = data;
        //const regex = new RegExp("[_a-zA-Z][_a-zA-Z0-9]{0,30}", "ig");
        var regex = new RegExp("[a-z.A-Z0-9_()][_a-z.A-Z0-9()]{0,30}", "ig");

        var identifiers = [];
        var myArray = [];
        while ((myArray = regex.exec(expressionTest)) !== null) {
            var identifier = myArray[0];
            if (identifier == "null" || identifier.toLowerCase() == "and" || identifier.toLowerCase() == "or" || Libs.isNumber(identifier)) {
                continue;
            }
            if (identifiers.indexOf(identifier) >= 0) {
                //da thay roi khong thay nua
                continue;
            }
            identifiers.push(identifier);
            //this.expressionTest = this.expressionTest.replace(identifier, "data." + identifier);

            var regex1 = /\(.*?\)/;
            var paramRegex = new RegExp(regex1, "g");
            var my1Array = [];
            var newIdentifier = identifier;
            while ((my1Array = paramRegex.exec(identifier)) !== null) {
                //giu nguyen ham thu vien
                var field = my1Array[0];
                //giu nguyen ham thu vien
                field = field.replace("(", "");
                field = field.replace(")", "");
                var re = new RegExp(field, 'g');

                //replace this. to this.renderClass.
                if (!Libs.isBlank(newIdentifier) && newIdentifier.indexOf("this.") >= 0) {
                    newIdentifier = newIdentifier.replace(/this./gi, "this.renderClass.");
                } else {
                    newIdentifier = newIdentifier.replace(re, "data." + field);
                }
            }
            var re = new RegExp(identifier, 'gi');
            if (newIdentifier == identifier) {

                //replace this. to this.renderClass.
                if (!Libs.isBlank(newIdentifier) && newIdentifier.indexOf("this.") >= 0) {
                    _this5.expressionTest = expressionTest.replace(/this./gi, "this.renderClass.");
                } else {
                    _this5.expressionTest = _this5.expressionTest.replace(re, "data." + identifier);
                }
            } else {
                _this5.expressionTest = _this5.expressionTest.replace(identifier, newIdentifier);
            }
        }
        return _this5;
    }

    _createClass(NoIf, [{
        key: "getCompiledContent",
        value: function getCompiledContent() {
            try {
                var data = this.data;
                var expression = this.expressionTest.replace("#{", "data.").replace("}", "");
                if (expression.indexOf("item.expired_date") >= 0) {
                    logger.error("vo debug");
                }
                try {
                    expression = expression.replace(/ and /gi, ' && ');
                    expression = expression.replace(/ or /gi, ' || ');

                    // replace == to === for strict evaluate
                    expression = expression.replace(/==/g, "===");
                    expression = expression.replace(/!=/g, "!==");

                    if (expression) {

                        eval("if( " + expression + " ) data.valueExpression = true; else data.valueExpression = false;");
                    }
                } catch (err) {
                    data.valueExpression = false;
                }
                if (data.valueExpression == false) {
                    //bỏ if
                    if (this.node && this.node.parentNode) {
                        this.node.parentNode.removeChild(this.node);
                    }
                    return;
                }
                _get(NoIf.prototype.__proto__ || Object.getPrototypeOf(NoIf.prototype), "getCompiledContent", this).call(this);
                //chỉ lấy bên trong
                if (this.node) {
                    var childNodeContents = this.node.childNodes.toString();
                    var newNode = new xmldom.DOMParser().parseFromString(decode(childNodeContents));
                    this.node.parentNode.replaceChild(newNode, this.node);
                }
            } catch (err) {
                if (this.node && this.node.parentNode) {
                    this.node.parentNode.removeChild(this.node);
                }
                logger.error(err);
            }
        }
    }]);

    return NoIf;
}(No);

var NoOtherwise = function (_No6) {
    _inherits(NoOtherwise, _No6);

    function NoOtherwise(curNode, data, render) {
        _classCallCheck(this, NoOtherwise);

        var _this6 = _possibleConstructorReturn(this, (NoOtherwise.__proto__ || Object.getPrototypeOf(NoOtherwise)).call(this, render));

        _this6.node = curNode;
        _this6.data = data;
        return _this6;
    }

    _createClass(NoOtherwise, [{
        key: "getCompiledContent",
        value: function getCompiledContent() {
            try {
                var text = _get(NoOtherwise.prototype.__proto__ || Object.getPrototypeOf(NoOtherwise.prototype), "processexpression", this).call(this, this.node.childNodes.toString(), this.data);
                if (this.node && this.node.parentNode) {
                    if (!Libs.isBlank(text)) {
                        var newNode = new xmldom.DOMParser().parseFromString(decode(text));
                        this.node.parentNode.replaceChild(newNode, this.node);
                    } else {
                        this.node.parentNode.removeChild(this.node);
                    }
                }
            } catch (err) {
                if (this.node && this.node.parentNode) {
                    this.node.parentNode.removeChild(this.node);
                }
                logger.error(err);
            }
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
            if (!gchild) return;
            if (!gchild.childNodes) {
                if (gchild.nodeName != "#comment") {
                    var noString = new NoString(gchild, data, this);
                    incharge.add(noString);
                }
                return;
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Array.from(gchild.childNodes)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var no = _step2.value;


                    if (no.nodeName == "choose") {
                        this.readChoose(no, incharge, data);
                    } else if (no.nodeName == "if") {
                        this.readIf(no, incharge, data);
                    } else if (no.nodeName == "foreach") {
                        this.readForEach(no, incharge, data);
                    } else {
                        if (no.hasChildNodes() == false) {
                            if (no.nodeName != "#comment") {
                                var _noString = new NoString(no, data, this);
                                incharge.add(_noString);
                            }
                        } else {
                            var childIncharge = new NoString(no, data, this);
                            this.read(no, childIncharge, data);
                            incharge.add(childIncharge);
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
        }
    }, {
        key: "readForEach",
        value: function readForEach(no, nomain, data) {
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
            var noday = new NoForEach(no, data, this, no.getAttributeNode("item").value, valueIndex, valueSeparador, valueAverage, closingvalue, no, valueCollection, this);
            nomain.add(noday);
        }
    }, {
        key: "readIf",
        value: function readIf(no, nomain, data) {
            var noIf = new NoIf(no, data, this, no.getAttributeNode("test").value);
            if (no.hasChildNodes()) {
                this.read(no, noIf, data);
            } else {
                noIf.text = no.textContent;
            }

            nomain.add(noIf);
        }
    }, {
        key: "readChoose",
        value: function readChoose(no, nomain, data) {
            var nohead = new NoChoose(no, data, this);
            for (var i = 0; i < no.childNodes.length; i++) {
                var noson = no.childNodes[i];
                if (noson.nodeName == "when") {
                    nohead.add(this.readNoWhen(noson, data));
                } else if (noson.nodeName == "otherwise") {
                    nohead.add(new NoOtherwise(noson, data, this));
                }
            }
            nomain.add(nohead);
        }
    }, {
        key: "readNoWhen",
        value: function readNoWhen(no, data) {
            var expressionTest = no.getAttributeNode("test").value;
            var nowhen = new NoWhen(no, data, this, expressionTest);

            for (var i = 0; i < no.childNodes.length; i++) {
                var noson = no.childNodes[i];

                if (noson.nodeName == "choose") {
                    this.readChoose(noson, nowhen, data);
                } else if (noson.nodeName == "if") {
                    this.readIf(noson, nowhen, data);
                } else if (noson.nodeName == "foreach") {
                    this.readForEach(noson, nowhen, data);
                } else if (noson.hasChildNodes() == false) {
                    if (noson.nodeName != "#comment") {
                        var noString = new NoString(noson, data, this);
                        nowhen.add(noString);
                    }
                } else {
                    //1 element, trường hợp này không cho phép thêm nữa
                    var _noString2 = new NoString(noson, data, this);
                    nowhen.add(_noString2);
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
                //tạo global variable để xử lý

                var xmlDoc = new xmldom.DOMParser().parseFromString(htmlContents);
                // if (xmlDoc.documentElement.nodeName != "html" && xmlDoc.documentElement.nodeName != "table") {
                //     return null;
                // }
                //const we = xmlDoc.documentElement.childNodes;
                var incharge = new No();
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = Array.from(xmlDoc.childNodes)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var no = _step3.value;

                        this.read(no, incharge, data);
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

                incharge.getCompiledContent();
                // for (const noXml of Array.from(we)) {
                //     // if (noXml.nodeName == "body" || noXml.nodeName == "head" || noXml.nodeName == "tbody" || noXml.nodeName == "tr") {
                //     if (noXml.nodeName != "#comment" && noXml.nodeName != "#text") {
                //         try {
                //             this.read(noXml, incharge, data);
                //             incharge.getCompiledContent();
                //             if (noXml.parentNode) {
                //                 let newNode = new xmldom.DOMParser().parseFromString(noXml.toString());
                //                 noXml.parentNode.replaceChild(newNode, noXml);
                //             }
                //         } catch (err) {
                //             logger.error("err");
                //         }

                //     }
                // }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9GTFJlcG9ydFRlbXBsYXRlUmVuZGVyLmpzIl0sIm5hbWVzIjpbImZzIiwicmVxdWlyZSIsInhtbGRvbSIsImh0bWxkb20iLCJzIiwibW9tZW50IiwidXRpbCIsImxvZ2dlciIsIkZMTG9nZ2VyIiwiZ2V0TG9nZ2VyIiwiZGVjb2RlIiwiRkxSZXBvcnRSZW5kZXIiLCJmaWxlbmFtZSIsImRhdGEiLCJ0ZW1wbGF0ZVJlbmRlciIsIkZMUmVwb3J0VGVtcGxhdGVSZW5kZXIiLCJyZW5kZXIiLCJodG1sQ29udGVudHMiLCJyZW5kZXJDb250ZW50IiwiTm8iLCJjaGlsZHJlbiIsInJlbmRlckNsYXNzIiwibm8iLCJwdXNoIiwicHJvcCIsIm5vc29uIiwiZ2V0Q29tcGlsZWRDb250ZW50IiwicGF0aCIsImkiLCJsZW5ndGgiLCJleHByZXNzaW9uIiwibXlBcnJheSIsIm5ld2V4cHJlc3Npb24iLCJyZWdleCIsIlJlZ0V4cCIsImV4ZWMiLCJzdHJldGNoIiwicHJvcGVydHkiLCJyZXBsYWNlIiwiZmllbGRzIiwic3BsaXQiLCJmaWVsZEV4cHJlc3Npb24iLCJleHBBcnJheSIsInJlZ2V4RXhwIiwic3ViRmllbGRFeHByZXNzIiwiZmllbGQiLCJuZXdGaWVsZCIsInZhbHVlIiwiTGlicyIsImlzTnVtYmVyIiwiZ2V0VmFsdWUiLCJpc0JsYW5rIiwiaW5kZXhPZiIsImV4cHJlc3MiLCJzdWJzdHJpbmciLCJwcm9wZXJ0eXZhbHVlIiwiZXZhbCIsImVyciIsImZvcm1hdFZhbHVlIiwiZXJyb3IiLCJmb3JtYXRBcnIiLCJmb3JtYXQiLCJ0cmltIiwidG9Mb3dlckNhc2UiLCJmaXJzdEZvcm1hdE90aW9uIiwiZSIsInNlY29uZEZvcm1hdE9wdGlvbiIsImZvcm1hdE51bSIsIkNvbnN0YW50cyIsImRhdGUiLCJ0b1VwcGVyQ2FzZSIsImRhdGV0aW1lIiwiZm9ybWF0RnJvbSIsImZvcm1hdFRvIiwiZGF0ZUZvcm1hdCIsIk5vU3RyaW5nIiwiY3VyTm9kZSIsIm5vZGUiLCJ0ZXh0IiwidG9TdHJpbmciLCJwYXJlbnROb2RlIiwibmV3Tm9kZSIsIkRPTVBhcnNlciIsInBhcnNlRnJvbVN0cmluZyIsInJlcGxhY2VDaGlsZCIsInJlbW92ZUNoaWxkIiwiTm9DaG9vc2UiLCJOb090aGVyd2lzZSIsIm5vT3RoZXJ3aXNlIiwidmFsdWVFeHByZXNzaW9uIiwiTm9XaGVuIiwibm93aGVuIiwiZXhwcmVzc2lvblRlc3QiLCJjaGlsZE5vZGVzIiwiaWRlbnRpZmllcnMiLCJyZXBsYWNlQWxsIiwibmV3ZXhwcmVzc2lvblRlc3QiLCJpZGVudGlmaWVyIiwibmV3SWRlbnRpZmllciIsIk5vRm9yRWFjaCIsIml0ZW0iLCJpbmRleCIsInNlcGFyYXRvciIsIm9wZW5pbmciLCJjbG9zdXJlIiwiZm9yZWFjaE5vZGUiLCJjb2xsZWN0aW9uIiwicGFyZW50Q2xhc3MiLCJpc0FycmF5Iiwicm93SW5kZXgiLCJ0ZXh0Q29udGVudCIsImhhc0NoaWxkTm9kZXMiLCJpbmNoYXJnZSIsImNoaWxkRGF0YSIsImZvcmVhY2hOb2RlQ29weWVkIiwiY2xvbmVOb2RlIiwicmVhZCIsInNxbCIsImpvaW4iLCJOb0lmIiwicmVnZXgxIiwicGFyYW1SZWdleCIsIm15MUFycmF5IiwicmUiLCJjaGlsZE5vZGVDb250ZW50cyIsImdjaGlsZCIsIm5vZGVOYW1lIiwibm9TdHJpbmciLCJhZGQiLCJBcnJheSIsImZyb20iLCJyZWFkQ2hvb3NlIiwicmVhZElmIiwicmVhZEZvckVhY2giLCJjaGlsZEluY2hhcmdlIiwibm9tYWluIiwidmFsdWVTZXBhcmFkb3IiLCJnZXRBdHRyaWJ1dGVOb2RlIiwidmFsdWVBdmVyYWdlIiwiY2xvc2luZ3ZhbHVlIiwidmFsdWVJbmRleCIsInZhbHVlQ29sbGVjdGlvbiIsIm5vZGF5Iiwibm9JZiIsIm5vaGVhZCIsInJlYWROb1doZW4iLCJkaXIiLCJjb25maWciLCJzZXJ2ZXIiLCJyZXBvcnRfZGlyIiwiZXh0IiwicmVwb3J0X2V4dCIsImFwcFBhdGgiLCJs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QUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBWUFtRyx5QkFBU3RGLGtCQUFUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBVCwrQkFBZVAsT0FBT2tKLE9BQU83RSxRQUFQLEVBQVAsQ0FBZjtBQUNBLHVCQUFPOUQsWUFBUDtBQUNILGFBL0JELENBK0JFLE9BQU93QyxHQUFQLEVBQVk7QUFDVmxELHVCQUFPb0QsS0FBUCxDQUFhRixHQUFiO0FBQ0EsdUJBQU8sS0FBUDtBQUNIO0FBQ0oiLCJmaWxlIjoiRkxSZXBvcnRUZW1wbGF0ZVJlbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgeG1sZG9tID0gcmVxdWlyZShcInhtbGRvbVwiKTtcbmNvbnN0IGh0bWxkb20gPSByZXF1aXJlKFwiaHRtbGRvbVwiKTtcbmNvbnN0IHMgPSByZXF1aXJlKFwic3RyaW5nXCIpO1xuY29uc3QgbW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcbmNvbnN0IHV0aWwgPSByZXF1aXJlKFwidXRpbFwiKTtcbmNvbnN0IGxvZ2dlciA9IEZMTG9nZ2VyLmdldExvZ2dlcihcIkZMUmVwb3J0VGVtcGxhdGVSZW5kZXJcIik7XG5jb25zdCBkZWNvZGUgPSByZXF1aXJlKCd1bmVzY2FwZScpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGTFJlcG9ydFJlbmRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuICAgIHJlbmRlcihmaWxlbmFtZSwgZGF0YSkge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZVJlbmRlciA9IG5ldyBGTFJlcG9ydFRlbXBsYXRlUmVuZGVyKCk7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZVJlbmRlci5yZW5kZXIoZmlsZW5hbWUsIGRhdGEpO1xuICAgIH1cbiAgICByZW5kZXJDb250ZW50KGh0bWxDb250ZW50cywgZGF0YSkge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZVJlbmRlciA9IG5ldyBGTFJlcG9ydFRlbXBsYXRlUmVuZGVyKCk7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZVJlbmRlci5yZW5kZXJDb250ZW50KGh0bWxDb250ZW50cywgZGF0YSk7XG4gICAgfVxufVxuXG5jbGFzcyBObyB7XG4gICAgY29uc3RydWN0b3IocmVuZGVyKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5yZW5kZXJDbGFzcyA9IHJlbmRlcjtcbiAgICB9XG4gICAgYWRkKG5vKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChubyk7XG4gICAgfVxuICAgIHJlbW92ZUFsbCgpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIH1cbiAgICBnZXRDb21waWxlZENvbnRlbnQoKSB7XG4gICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm9zb24gPSB0aGlzLmNoaWxkcmVuW3Byb3BdO1xuICAgICAgICAgICAgICAgIG5vc29uLmdldENvbXBpbGVkQ29udGVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGdldFZhbHVlKGRhdGEsIHBhdGgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiICYmIGkgPCBwYXRoLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhW3BhdGhbaV1dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBwcm9jZXNzZXhwcmVzc2lvbihleHByZXNzaW9uLCBkYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgbXlBcnJheTtcbiAgICAgICAgICAgIC8vc+G7rWEgYnVnIGtow7RuZyBwaMOibiB0w61jaCDEkcaw4bujYyBwYXJhbWVyIHThu6sgMiB0cuG7nyBsw6puIHbDrSBk4bulICN7cGFyYW0xfSx7I3BhcmFtMn1cbiAgICAgICAgICAgIGNvbnN0IG5ld2V4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICAgICAgLy9jb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXCIjeyhbYS16LkEtWjAtOV98KCldKyl9XCIsIFwiaWdcIik7XG4gICAgICAgICAgICAvL2No4bqlcCBuaOG6rW4gY8O0bmcgdGjhu6ljIHRyb25nIGV4cHJlc3N0aW9uXG4gICAgICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXCIjeyhbYS16LkEtWjAtOV98KClcXFwiJysqXFxcXC1cXFxcL1xcXFwlPT8gOy4jLDpdKyl9XCIsIFwiaWdcIik7XG5cbiAgICAgICAgICAgIHdoaWxlICgobXlBcnJheSA9IHJlZ2V4LmV4ZWMobmV3ZXhwcmVzc2lvbikpICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdHJldGNoID0gbXlBcnJheVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IG15QXJyYXlbMV0ucmVwbGFjZShkYXRhICsgXCIuXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkcyA9IHByb3BlcnR5LnNwbGl0KFwifFwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZEV4cHJlc3Npb24gPSBmaWVsZHNbMF07XG4gICAgICAgICAgICAgICAgdmFyIGV4cEFycmF5ID0gW107XG4gICAgICAgICAgICAgICAgLy9waMOibiB0w61jaCBjw7RuZyB0aOG7qWMgdHJvbmcgYmnhu4N1IHRo4bupY1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4RXhwID0gbmV3IFJlZ0V4cChcIihbYS16LkEtWjAtOV9dKylcIiwgXCJpZ1wiKTtcbiAgICAgICAgICAgICAgICBsZXQgc3ViRmllbGRFeHByZXNzID0gZmllbGRFeHByZXNzaW9uO1xuICAgICAgICAgICAgICAgIGxldCBmaWVsZCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgd2hpbGUgKChleHBBcnJheSA9IHJlZ2V4RXhwLmV4ZWMoZmllbGRFeHByZXNzaW9uKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9naXUgbmd1eWVuIGhhbSB0aHUgdmllblxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3RmllbGQgPSBleHBBcnJheVswXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzTnVtYmVyKG5ld0ZpZWxkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGRhdGEsIG5ld0ZpZWxkLnNwbGl0KFwiLlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9uZ2hpIG5n4budIGzDoCBow6BtIHRoxrAgdmnhu4duIG7Dqm4gZ2nhu69hIG5ndXnDqm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld0ZpZWxkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKHZhbHVlKSAmJiAhTGlicy5pc051bWJlcih2YWx1ZSkgJiYgdmFsdWUuaW5kZXhPZihcInRoaXMuXCIpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKFwidGhpcy5cIiwgXCJ0aGlzLnJlbmRlckNsYXNzLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdHLGsOG7nW5nIGjhu6NwIGPDsyBnacOhIHRy4buLXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/EkcOjIHTDrG0gdGjhuqV5IGPDsyBnacOhIHRy4buLIHRyb25nIGNvbGxlY3Rpb24gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gXCJkYXRhLlwiICsgbmV3RmllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbmV3RmllbGQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGV4cHJlc3MgPSBzdWJGaWVsZEV4cHJlc3Muc3Vic3RyaW5nKDAsIHN1YkZpZWxkRXhwcmVzcy5pbmRleE9mKG5ld0ZpZWxkKSArIG5ld0ZpZWxkLmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSBleHByZXNzLnJlcGxhY2UobmV3RmllbGQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc3ViRmllbGRFeHByZXNzID0gc3ViRmllbGRFeHByZXNzLnN1YnN0cmluZyhzdWJGaWVsZEV4cHJlc3MuaW5kZXhPZihuZXdGaWVsZCkgKyBuZXdGaWVsZC5sZW5ndGggKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5dmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZpZWxkICs9IHN1YkZpZWxkRXhwcmVzcztcbiAgICAgICAgICAgICAgICAvL3RodWMgdGhpIGhhbSB0aHUgdmllbiBuZXUgY29cbiAgICAgICAgICAgICAgICAvLyB2YXIgbGliRXhlID0gZmllbGRzWzBdLnJlcGxhY2UoY2hpbGRFeHByZXNzaW9uLCBwcm9wZXJ0eXZhbHVlKTtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGZpZWxkKSAmJiBmaWVsZC5pbmRleE9mKFwiPVwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmFsKGZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5dmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHl2YWx1ZSA9IGV2YWwoZmllbGQpXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5dmFsdWUgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5dmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5dmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcm9wZXJ0eXZhbHVlID0gdGhpcy5mb3JtYXRWYWx1ZShwcm9wZXJ0eXZhbHVlLGZpZWxkcyk7XG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ucmVwbGFjZShzdHJldGNoLCBwcm9wZXJ0eXZhbHVlKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgZm9ybWF0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAvLyBpZiAoZmllbGRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIC8vY8OzIGZvcm1hdFxuICAgICAgICAgICAgICAgIC8vICAgICBmb3JtYXQgPSBmaWVsZHNbMV0udHJpbSgpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAvLyBpZiAoIUxpYnMuaXNCbGFuayhmb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHZhciB2YWx1ZSA9IHByb3BlcnR5dmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gICAgIGlmIChcImRhdGVcIiA9PSBmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHZhbHVlID0gbW9tZW50KHByb3BlcnR5dmFsdWUpLmZvcm1hdChDb25zdGFudHMuZGF0YS5mb3JtYXQuZGF0ZSk7XG4gICAgICAgICAgICAgICAgLy8gICAgIH0gZWxzZSBpZiAoXCJkYXRldGltZVwiID09IGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgdmFsdWUgPSBtb21lbnQocHJvcGVydHl2YWx1ZSkuZm9ybWF0KENvbnN0YW50cy5kYXRhLmZvcm1hdC5kYXRldGltZSlcbiAgICAgICAgICAgICAgICAvLyAgICAgfSBlbHNlIGlmIChcIm51bWVyaWNcIiA9PSBmb3JtYXQpIHtcblxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgdmFsdWUgPSBMaWJzLmZvcm1hdE51bSh2YWx1ZSwgQ29uc3RhbnRzLmRhdGEuZm9ybWF0Lm51bWVyaWMpO1xuICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2Uoc3RyZXRjaCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2Uoc3RyZXRjaCwgcHJvcGVydHl2YWx1ZSk7XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBnacOhIHRy4buLIGJhbiDEkeG6p3UgY+G7p2EgZmllbGRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBmb3JtYXRBcnIgYuG6r3QgxJHhuqd1IHThu6sgMSB0cuG7nyDEkWkgbMOgIGZvcm1hdCwgdMO5eSB0aGVvIGzDoCBudW1lcmljLCBkYXRlIGhv4bq3YyBkYXRldGltZVxuICAgICAqL1xuICAgIGZvcm1hdFZhbHVlKHZhbHVlLCBmb3JtYXRBcnIpIHtcblxuICAgICAgICBpZiAoTGlicy5pc0JsYW5rKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZvcm1hdCA9IFwiXCI7XG4gICAgICAgIGlmIChmb3JtYXRBcnIgJiYgZm9ybWF0QXJyLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAvL2PDsyBmb3JtYXRcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdEFyclsxXS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKExpYnMuaXNCbGFuayhmb3JtYXQpKSB7XG4gICAgICAgICAgICAvL2tob25nIGPDsyBmb3JtYXQgbsOgbyB0aMOsIHRy4bqjIHbhu4EgZ2nDoSB0cuG7iyBuZ3V5w6puIHRo4buneVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9s4bqleSBmb3JtYXRcbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgLy9s4bqleSBmb3JtYXQgb3B0aW9uIFxuICAgICAgICBsZXQgZmlyc3RGb3JtYXRPdGlvbiA9IFwiXCI7XG4gICAgICAgIGlmIChmb3JtYXRBcnIubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgZmlyc3RGb3JtYXRPdGlvbiA9IGZvcm1hdEFyclsyXTtcbiAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGZpcnN0Rm9ybWF0T3Rpb24pICYmIGZpcnN0Rm9ybWF0T3Rpb24uaW5kZXhPZihcInRoaXMuXCIpID49IDApIHtcbiAgICAgICAgICAgICAgICBmaXJzdEZvcm1hdE90aW9uID0gZmlyc3RGb3JtYXRPdGlvbi5yZXBsYWNlKFwidGhpcy5cIiwgXCJ0aGlzLnJlbmRlckNsYXNzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICBmaXJzdEZvcm1hdE90aW9uID0gZXZhbChmaXJzdEZvcm1hdE90aW9uKTtcbiAgICAgICAgICAgIH1jYXRjaChlKXtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBzZWNvbmRGb3JtYXRPcHRpb24gPSBcIlwiO1xuICAgICAgICAvL27hur91IGzDoCBkYXRlIGhv4bq3YyBkYXRldGltZSB0aMOsIG7hur91IGtow7RuZyBjw7MgZm9ybWF0IHRo4bupIDIgdGjDrCBmb3JtYXQgxJHhuqd1IGzDoCBmb3JtYXQgxJHhur9uXG4gICAgICAgIC8vIG7hur91IGtow7RuZyBjw7MgZm9ybWF0IDIgdGjDrCBmb3JtYXQgxJHhuqd1IGzDoCDEkcOtY2ggxJHhur9uXG4gICAgICAgIGlmIChmb3JtYXRBcnIubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgc2Vjb25kRm9ybWF0T3B0aW9uID0gZm9ybWF0QXJyWzNdO1xuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoc2Vjb25kRm9ybWF0T3B0aW9uKSAmJiBzZWNvbmRGb3JtYXRPcHRpb24uaW5kZXhPZihcInRoaXMuXCIpID49IDApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRGb3JtYXRPcHRpb24gPSBzZWNvbmRGb3JtYXRPcHRpb24ucmVwbGFjZShcInRoaXMuXCIsIFwidGhpcy5yZW5kZXJDbGFzcy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgc2Vjb25kRm9ybWF0T3B0aW9uID0gZXZhbChzZWNvbmRGb3JtYXRPcHRpb24pO1xuICAgICAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT0gXCJudW1iZXJpY1wiIHx8IGZvcm1hdCA9PSBcIm51bWVyaWNcIikge1xuICAgICAgICAgICAgaWYoTGlicy5pc0JsYW5rKGZpcnN0Rm9ybWF0T3Rpb24pKXtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IExpYnMuZm9ybWF0TnVtKHZhbHVlKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKExpYnMuaXNCbGFuayhzZWNvbmRGb3JtYXRPcHRpb24pKXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBMaWJzLmZvcm1hdE51bSh2YWx1ZSwgZXZhbChmaXJzdEZvcm1hdE90aW9uKSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gTGlicy5mb3JtYXROdW0odmFsdWUsIGZpcnN0Rm9ybWF0T3Rpb24sc2Vjb25kRm9ybWF0T3B0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZihcImRhdGVcIikgPj0gMCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL27hur91IGtow7RuZyBjw7MgZm9ybWF0IHRow6wgcGjhuqNpIHBow6JuIGJp4buHdCBkYXRlIGhheSBkYXRldGltZVxuICAgICAgICAgICAgLy9uZ8aw4bujYyBs4bqhaSB0aMOsIGtow7RuZywgZm9ybWF0IGThu7FhIHbDoG8gcGF0dGVybiB0cnV54buBbiB2w6BvXG4gICAgICAgICAgICBpZiAoZmlyc3RGb3JtYXRPdGlvbiA9PSBcIlwiICYmIHNlY29uZEZvcm1hdE9wdGlvbiA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdCA9PSBcImRhdGVcIikge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdEZvcm1hdE90aW9uID0gQ29uc3RhbnRzLmRhdGEuZm9ybWF0LmRhdGUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PSBcImRhdGV0aW1lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RGb3JtYXRPdGlvbiA9IENvbnN0YW50cy5kYXRhLmZvcm1hdC5kYXRldGltZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL27hur91IGtow7RuZyBjw7MgZm9ybWF0IHRo4bupIDIgdGjDrCBmb3JtYXQgxJHhuqd1IGzDoCBmb3JtYXQgxJHhur9uXG4gICAgICAgICAgICB2YXIgZm9ybWF0RnJvbSA9IFwiXCIsIGZvcm1hdFRvID0gZmlyc3RGb3JtYXRPdGlvbjtcbiAgICAgICAgICAgIGlmIChzZWNvbmRGb3JtYXRPcHRpb24gIT0gXCJcIikge1xuICAgICAgICAgICAgICAgIC8vbuG6v3UgY8OzIGZvcm1hdCB0aOG7qSAyIHRow6wgZm9ybWF0IHRo4bupIDIgbMOgIGZvcm1hdCDEkeG6v25cbiAgICAgICAgICAgICAgICBmb3JtYXRGcm9tID0gZmlyc3RGb3JtYXRPdGlvbjtcbiAgICAgICAgICAgICAgICBmb3JtYXRUbyA9IHNlY29uZEZvcm1hdE9wdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gTGlicy5kYXRlRm9ybWF0KHZhbHVlLCBmb3JtYXRUbywgZm9ybWF0RnJvbSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxufVxuY2xhc3MgTm9TdHJpbmcgZXh0ZW5kcyBObyB7XG4gICAgY29uc3RydWN0b3IoY3VyTm9kZSwgZGF0YSwgcmVuZGVyKSB7XG4gICAgICAgIHN1cGVyKHJlbmRlcik7XG4gICAgICAgIHRoaXMubm9kZSA9IGN1ck5vZGU7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuICAgIGdldENvbXBpbGVkQ29udGVudCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHN1cGVyLmdldENvbXBpbGVkQ29udGVudCgpO1xuICAgICAgICAgICAgbGV0IHRleHQgPSBzdXBlci5wcm9jZXNzZXhwcmVzc2lvbih0aGlzLm5vZGUudG9TdHJpbmcoKSwgdGhpcy5kYXRhKSArIFwiXCI7XG4gICAgICAgICAgICAvL3JlcGxhY2Ugbm9kZSBoaeG7h24gdOG6oWkgYuG6sW5nIG5vZGUgbeG7m2kgxJHDoyBiacOqbiBk4buLY2hcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUgJiYgdGhpcy5ub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayh0ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdOb2RlID0gbmV3IHhtbGRvbS5ET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoZGVjb2RlKHRleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld05vZGUsIHRoaXMubm9kZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9raMO0bmcgY8OzIHJlbW92ZSBsdcO0blxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvL3jhuqt5IHJhIGzhu5dpIHJlbW92ZSByYSBsdcO0blxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZSAmJiB0aGlzLm5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMubm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBOb0Nob29zZSBleHRlbmRzIE5vIHtcbiAgICBjb25zdHJ1Y3RvcihjdXJOb2RlLCBkYXRhLCByZW5kZXIpIHtcbiAgICAgICAgc3VwZXIocmVuZGVyKTtcbiAgICAgICAgdGhpcy5ub2RlID0gY3VyTm9kZTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG4gICAgYWRkKG5vKSB7XG4gICAgICAgIHN1cGVyLmFkZChubyk7XG4gICAgICAgIGlmIChubyBpbnN0YW5jZW9mIE5vT3RoZXJ3aXNlKSB7XG4gICAgICAgICAgICB0aGlzLm5vT3RoZXJ3aXNlID0gbm87XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0Q29tcGlsZWRDb250ZW50KCkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgbGV0IHRleHQgPSBcIlwiO1xuICAgICAgICBsZXQgdmFsdWVFeHByZXNzaW9uID0gZmFsc2U7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjb25zdCBubyA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAobm8gaW5zdGFuY2VvZiBOb1doZW4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub3doZW4gPSBubztcbiAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gbm93aGVuLmV4cHJlc3Npb25UZXN0LnJlcGxhY2UoXCIje1wiLCBcImRhdGEuXCIpLnJlcGxhY2UoXCJ9XCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGV2YWwoXCJpZiggXCIgKyBleHByZXNzaW9uICsgXCIgKSB2YWx1ZUV4cHJlc3Npb24gPSB0cnVlOyBlbHNlIHZhbHVlRXhwcmVzc2lvbiA9IGZhbHNlO1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZUV4cHJlc3Npb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBub3doZW4uZ2V0Q29tcGlsZWRDb250ZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSBub3doZW4ubm9kZS5jaGlsZE5vZGVzLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbHVlRXhwcmVzc2lvbiAmJiB0aGlzLm5vT3RoZXJ3aXNlKSB7XG4gICAgICAgICAgICB0aGlzLm5vT3RoZXJ3aXNlLmdldENvbXBpbGVkQ29udGVudCgpO1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMubm9PdGhlcndpc2Uubm9kZS5jaGlsZE5vZGVzLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm9kZSAmJiB0aGlzLm5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgY29uc3QgbmV3Tm9kZSA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGRlY29kZSh0ZXh0KSk7XG4gICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgdGhpcy5ub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIE5vV2hlbiBleHRlbmRzIE5vIHtcbiAgICBjb25zdHJ1Y3RvcihjdXJOb2RlLCBkYXRhLCByZW5kZXIsIGV4cHJlc3Npb25UZXN0KSB7XG4gICAgICAgIHN1cGVyKHJlbmRlcik7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvblRlc3QgPSBleHByZXNzaW9uVGVzdDtcbiAgICAgICAgdGhpcy5ub2RlID0gY3VyTm9kZTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgLy9jb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXCJbX2EtekEtWl1bX2EtekEtWjAtOV17MCwzMH1cIiwgXCJpZ1wiKTtcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKFwiW2Etei5BLVowLTlfXVtfYS16LkEtWjAtOV17MCwzMH1cIiwgXCJpZ1wiKTtcbiAgICAgICAgY29uc3QgaWRlbnRpZmllcnMgPSBbXTtcbiAgICAgICAgbGV0IG15QXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uVGVzdCA9IHModGhpcy5leHByZXNzaW9uVGVzdCkucmVwbGFjZUFsbChcImFuZFwiLCBcIiYmXCIpLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvblRlc3QgPSBzKHRoaXMuZXhwcmVzc2lvblRlc3QpLnJlcGxhY2VBbGwoXCJvclwiLCBcInx8XCIpLnRvU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IG5ld2V4cHJlc3Npb25UZXN0ID0gdGhpcy5leHByZXNzaW9uVGVzdDtcbiAgICAgICAgd2hpbGUgKChteUFycmF5ID0gcmVnZXguZXhlYyhuZXdleHByZXNzaW9uVGVzdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gbXlBcnJheVswXTtcblxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgPT0gXCJudWxsXCIgfHwgaWRlbnRpZmllciA9PSBcInRydWVcIiB8fCBpZGVudGlmaWVyID09IFwiZmFsc2VcIiB8fCBpZGVudGlmaWVyID09IFwiYW5kXCIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gICAgICAgICAgICBpZiAoIUxpYnMuaXNOdW1iZXIoaWRlbnRpZmllcikpIHtcbiAgICAgICAgICAgICAgICBpZiAoaWRlbnRpZmllci5pbmRleE9mKFwidGhpcy5cIikgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SWRlbnRpZmllciA9IGlkZW50aWZpZXIucmVwbGFjZShcInRoaXMuXCIsIFwidGhpcy5yZW5kZXJDbGFzcy5cIilcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uVGVzdCA9IHRoaXMuZXhwcmVzc2lvblRlc3QucmVwbGFjZShpZGVudGlmaWVyLCBuZXdJZGVudGlmaWVyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKHRoaXMuZGF0YSwgaWRlbnRpZmllci5zcGxpdChcIi5cIikpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZ2nhu68gbmd1ecOqblxuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25UZXN0ID0gdGhpcy5leHByZXNzaW9uVGVzdC5yZXBsYWNlKGlkZW50aWZpZXIsIFwiZGF0YS5cIiArIGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59XG5jbGFzcyBOb0ZvckVhY2ggZXh0ZW5kcyBObyB7XG4gICAgY29uc3RydWN0b3IoY3VyTm9kZSwgZGF0YSwgcmVuZGVyLCBpdGVtLCBpbmRleCwgc2VwYXJhdG9yLCBvcGVuaW5nLCBjbG9zdXJlLCBmb3JlYWNoTm9kZSwgY29sbGVjdGlvbiwgcGFyZW50Q2xhc3MpIHtcbiAgICAgICAgc3VwZXIocmVuZGVyKTtcbiAgICAgICAgdGhpcy5ub2RlID0gY3VyTm9kZTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLnNlcGFyYXRvciA9IHNlcGFyYXRvcjtcbiAgICAgICAgdGhpcy5vcGVuaW5nID0gb3BlbmluZztcbiAgICAgICAgdGhpcy5jbG9zdXJlID0gY2xvc3VyZTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbiAgICAgICAgdGhpcy5mb3JlYWNoTm9kZSA9IGZvcmVhY2hOb2RlO1xuICAgICAgICB0aGlzLnBhcmVudENsYXNzID0gcGFyZW50Q2xhc3M7XG4gICAgfVxuICAgIGdldENvbXBpbGVkQ29udGVudCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IFtdO1xuICAgICAgICAgICAgbGV0IGNvbGxlY3Rpb24gPSBkYXRhW3RoaXMuY29sbGVjdGlvbl07XG5cbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodXRpbC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub3BlbmluZyArIHRoaXMuY2xvc3VyZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcm93SW5kZXggPSAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBsZXQgdGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcmVhY2hOb2RlLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICAvL8SR4buNYyB0aeG6v3AgxJHhu4MgbOG6pXkgcmEgbuG7mWkgZHVuZyB0cm9uZyBmb3JlYWNoXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluY2hhcmdlID0gbmV3IE5vKCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZERhdGEgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBldmFsKFwiY2hpbGREYXRhLlwiICsgdGhpcy5pdGVtICsgXCI9aXRlbVwiKTtcbiAgICAgICAgICAgICAgICAgICAgZXZhbChcImNoaWxkRGF0YS5cIiArIHRoaXMuaW5kZXggKyBcIj1cIiArIHJvd0luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb3B5IG5vZGUgcmEga2jDtG5nIG7DsyBz4bq9IGLhu4sgcmVwbGFjZVxuICAgICAgICAgICAgICAgICAgICBsZXQgZm9yZWFjaE5vZGVDb3B5ZWQgPSB0aGlzLmZvcmVhY2hOb2RlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRDbGFzcy5yZWFkKGZvcmVhY2hOb2RlQ29weWVkLCBpbmNoYXJnZSwgY2hpbGREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgaW5jaGFyZ2UuZ2V0Q29tcGlsZWRDb250ZW50KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGV4dENvbnRlbnQgPSBmb3JlYWNoTm9kZUNvcHllZC5jaGlsZE5vZGVzLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dENvbnRlbnQgPSB0aGlzLmZvcmVhY2hOb2RlLnRleHRDb250ZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgbmV3ZXhwcmVzc2lvbiA9IGRlY29kZSh0ZXh0Q29udGVudCk7XG4gICAgICAgICAgICAgICAgLy8gbMOheSBnacOhIHRy4buLIG7hur91IGPDs1xuXG4gICAgICAgICAgICAgICAgbmV3ZXhwcmVzc2lvbiA9IHN1cGVyLnByb2Nlc3NleHByZXNzaW9uKG5ld2V4cHJlc3Npb24sIGl0ZW0pICsgXCIgXCI7XG5cbiAgICAgICAgICAgICAgICB0ZXh0LnB1c2gobmV3ZXhwcmVzc2lvbik7XG4gICAgICAgICAgICAgICAgcm93SW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHNxbCA9IHRoaXMub3BlbmluZyArIHRleHQuam9pbih0aGlzLnNlcGFyYXRvcikgKyB0aGlzLmNsb3N1cmU7XG5cbiAgICAgICAgICAgIC8vcmVwbGFjZSBub2RlIGhp4buHbiB04bqhaSBi4bqxbmcgbm9kZSBt4bubaSDEkcOjIGJpw6puIGThu4tjaFxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZSAmJiB0aGlzLm5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKHNxbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Tm9kZSA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGRlY29kZShzcWwpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld05vZGUsIHRoaXMubm9kZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKHRoaXMubm9kZSAmJiB0aGlzLm5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMubm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKVxuICAgICAgICB9XG4gICAgfVxufVxuY2xhc3MgTm9JZiBleHRlbmRzIE5vIHtcbiAgICBjb25zdHJ1Y3RvcihjdXJOb2RlLCBkYXRhLCByZW5kZXIsIGV4cHJlc3Npb25UZXN0KSB7XG4gICAgICAgIHN1cGVyKHJlbmRlcik7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvblRlc3QgPSBleHByZXNzaW9uVGVzdDtcbiAgICAgICAgdGhpcy5ub2RlID0gY3VyTm9kZTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgLy9jb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXCJbX2EtekEtWl1bX2EtekEtWjAtOV17MCwzMH1cIiwgXCJpZ1wiKTtcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKFwiW2Etei5BLVowLTlfKCldW19hLXouQS1aMC05KCldezAsMzB9XCIsIFwiaWdcIik7XG5cbiAgICAgICAgY29uc3QgaWRlbnRpZmllcnMgPSBbXTtcbiAgICAgICAgbGV0IG15QXJyYXkgPSBbXTtcbiAgICAgICAgd2hpbGUgKChteUFycmF5ID0gcmVnZXguZXhlYyhleHByZXNzaW9uVGVzdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gbXlBcnJheVswXTtcbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyID09IFwibnVsbFwiIHx8IGlkZW50aWZpZXIudG9Mb3dlckNhc2UoKSA9PSBcImFuZFwiXG4gICAgICAgICAgICAgICAgfHwgaWRlbnRpZmllci50b0xvd2VyQ2FzZSgpID09IFwib3JcIiB8fCBMaWJzLmlzTnVtYmVyKGlkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllcnMuaW5kZXhPZihpZGVudGlmaWVyKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgLy9kYSB0aGF5IHJvaSBraG9uZyB0aGF5IG51YVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIC8vdGhpcy5leHByZXNzaW9uVGVzdCA9IHRoaXMuZXhwcmVzc2lvblRlc3QucmVwbGFjZShpZGVudGlmaWVyLCBcImRhdGEuXCIgKyBpZGVudGlmaWVyKTtcblxuICAgICAgICAgICAgdmFyIHJlZ2V4MSA9IC9cXCguKj9cXCkvO1xuICAgICAgICAgICAgY29uc3QgcGFyYW1SZWdleCA9IG5ldyBSZWdFeHAocmVnZXgxLCBcImdcIik7XG4gICAgICAgICAgICBsZXQgbXkxQXJyYXkgPSBbXTtcbiAgICAgICAgICAgIGxldCBuZXdJZGVudGlmaWVyID0gaWRlbnRpZmllcjtcbiAgICAgICAgICAgIHdoaWxlICgobXkxQXJyYXkgPSBwYXJhbVJlZ2V4LmV4ZWMoaWRlbnRpZmllcikpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy9naXUgbmd1eWVuIGhhbSB0aHUgdmllblxuICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IG15MUFycmF5WzBdO1xuICAgICAgICAgICAgICAgIC8vZ2l1IG5ndXllbiBoYW0gdGh1IHZpZW5cbiAgICAgICAgICAgICAgICBmaWVsZCA9IGZpZWxkLnJlcGxhY2UoXCIoXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGZpZWxkID0gZmllbGQucmVwbGFjZShcIilcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cChmaWVsZCwgJ2cnKTtcblxuICAgICAgICAgICAgICAgIC8vcmVwbGFjZSB0aGlzLiB0byB0aGlzLnJlbmRlckNsYXNzLlxuICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKG5ld0lkZW50aWZpZXIpICYmIG5ld0lkZW50aWZpZXIuaW5kZXhPZihcInRoaXMuXCIpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SWRlbnRpZmllciA9IG5ld0lkZW50aWZpZXIucmVwbGFjZSgvdGhpcy4vZ2ksIFwidGhpcy5yZW5kZXJDbGFzcy5cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SWRlbnRpZmllciA9IG5ld0lkZW50aWZpZXIucmVwbGFjZShyZSwgXCJkYXRhLlwiICsgZmllbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAoaWRlbnRpZmllciwgJ2dpJyk7XG4gICAgICAgICAgICBpZiAobmV3SWRlbnRpZmllciA9PSBpZGVudGlmaWVyKSB7XG5cbiAgICAgICAgICAgICAgICAvL3JlcGxhY2UgdGhpcy4gdG8gdGhpcy5yZW5kZXJDbGFzcy5cbiAgICAgICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhuZXdJZGVudGlmaWVyKSAmJiBuZXdJZGVudGlmaWVyLmluZGV4T2YoXCJ0aGlzLlwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvblRlc3QgPSBleHByZXNzaW9uVGVzdC5yZXBsYWNlKC90aGlzLi9naSwgXCJ0aGlzLnJlbmRlckNsYXNzLlwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25UZXN0ID0gdGhpcy5leHByZXNzaW9uVGVzdC5yZXBsYWNlKHJlLCBcImRhdGEuXCIgKyBpZGVudGlmaWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvblRlc3QgPSB0aGlzLmV4cHJlc3Npb25UZXN0LnJlcGxhY2UoaWRlbnRpZmllciwgbmV3SWRlbnRpZmllcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRDb21waWxlZENvbnRlbnQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgIGxldCBleHByZXNzaW9uID0gdGhpcy5leHByZXNzaW9uVGVzdC5yZXBsYWNlKFwiI3tcIiwgXCJkYXRhLlwiKS5yZXBsYWNlKFwifVwiLCBcIlwiKTtcbiAgICAgICAgICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoXCJpdGVtLmV4cGlyZWRfZGF0ZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwidm8gZGVidWdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UoLyBhbmQgL2dpLCAnICYmICcpO1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UoLyBvciAvZ2ksICcgfHwgJyk7XG5cbiAgICAgICAgICAgICAgICAvLyByZXBsYWNlID09IHRvID09PSBmb3Igc3RyaWN0IGV2YWx1YXRlXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ucmVwbGFjZSgvPT0vZywgXCI9PT1cIik7XG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ucmVwbGFjZSgvIT0vZywgXCIhPT1cIik7XG5cblxuICAgICAgICAgICAgICAgIGlmIChleHByZXNzaW9uKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZXZhbChcImlmKCBcIiArIGV4cHJlc3Npb24gKyBcIiApIGRhdGEudmFsdWVFeHByZXNzaW9uID0gdHJ1ZTsgZWxzZSBkYXRhLnZhbHVlRXhwcmVzc2lvbiA9IGZhbHNlO1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZGF0YS52YWx1ZUV4cHJlc3Npb24gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhLnZhbHVlRXhwcmVzc2lvbiA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIC8vYuG7jyBpZlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGUgJiYgdGhpcy5ub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VwZXIuZ2V0Q29tcGlsZWRDb250ZW50KCk7XG4gICAgICAgICAgICAvL2No4buJIGzhuqV5IGLDqm4gdHJvbmdcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGROb2RlQ29udGVudHMgPSB0aGlzLm5vZGUuY2hpbGROb2Rlcy50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld05vZGUgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhkZWNvZGUoY2hpbGROb2RlQ29udGVudHMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgdGhpcy5ub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlICYmIHRoaXMubm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBOb090aGVyd2lzZSBleHRlbmRzIE5vIHtcbiAgICBjb25zdHJ1Y3RvcihjdXJOb2RlLCBkYXRhLCByZW5kZXIpIHtcbiAgICAgICAgc3VwZXIocmVuZGVyKTtcbiAgICAgICAgdGhpcy5ub2RlID0gY3VyTm9kZTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG4gICAgZ2V0Q29tcGlsZWRDb250ZW50KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHRleHQgPSBzdXBlci5wcm9jZXNzZXhwcmVzc2lvbih0aGlzLm5vZGUuY2hpbGROb2Rlcy50b1N0cmluZygpLCB0aGlzLmRhdGEpO1xuICAgICAgICAgICAgaWYgKHRoaXMubm9kZSAmJiB0aGlzLm5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKHRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld05vZGUgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhkZWNvZGUodGV4dCkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgdGhpcy5ub2RlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlICYmIHRoaXMubm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBGTFJlcG9ydFRlbXBsYXRlUmVuZGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG4gICAgcmVhZChnY2hpbGQsIGluY2hhcmdlLCBkYXRhKSB7XG4gICAgICAgIGlmICghZ2NoaWxkKSByZXR1cm47XG4gICAgICAgIGlmICghZ2NoaWxkLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChnY2hpbGQubm9kZU5hbWUgIT0gXCIjY29tbWVudFwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5vU3RyaW5nID0gbmV3IE5vU3RyaW5nKGdjaGlsZCwgZGF0YSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgaW5jaGFyZ2UuYWRkKG5vU3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IG5vIG9mIEFycmF5LmZyb20oZ2NoaWxkLmNoaWxkTm9kZXMpKSB7XG5cbiAgICAgICAgICAgIGlmIChuby5ub2RlTmFtZSA9PSBcImNob29zZVwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkQ2hvb3NlKG5vLCBpbmNoYXJnZSwgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuby5ub2RlTmFtZSA9PSBcImlmXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWRJZihubywgaW5jaGFyZ2UsIGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm8ubm9kZU5hbWUgPT0gXCJmb3JlYWNoXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWRGb3JFYWNoKG5vLCBpbmNoYXJnZSwgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobm8uaGFzQ2hpbGROb2RlcygpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuby5ub2RlTmFtZSAhPSBcIiNjb21tZW50XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub1N0cmluZyA9IG5ldyBOb1N0cmluZyhubywgZGF0YSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNoYXJnZS5hZGQobm9TdHJpbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRJbmNoYXJnZSA9IG5ldyBOb1N0cmluZyhubywgZGF0YSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVhZChubywgY2hpbGRJbmNoYXJnZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGluY2hhcmdlLmFkZChjaGlsZEluY2hhcmdlKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZWFkRm9yRWFjaChubywgbm9tYWluLCBkYXRhKSB7XG4gICAgICAgIGxldCB2YWx1ZVNlcGFyYWRvciA9IFwiXCI7XG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKFwic2VwYXJhdG9yXCIpKSB7XG4gICAgICAgICAgICB2YWx1ZVNlcGFyYWRvciA9IG5vLmdldEF0dHJpYnV0ZU5vZGUoXCJzZXBhcmF0b3JcIikudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHZhbHVlQXZlcmFnZSA9IFwiXCI7XG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKFwib3BlblwiKSkge1xuICAgICAgICAgICAgdmFsdWVBdmVyYWdlID0gbm8uZ2V0QXR0cmlidXRlTm9kZShcIm9wZW5cIikudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNsb3Npbmd2YWx1ZSA9IFwiXCI7XG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKFwiY2xvc2VcIikpIHtcbiAgICAgICAgICAgIGNsb3Npbmd2YWx1ZSA9IG5vLmdldEF0dHJpYnV0ZU5vZGUoXCJjbG9zZVwiKS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdmFsdWVJbmRleCA9IFwiXCI7XG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKFwiaW5kZXhcIikpIHtcbiAgICAgICAgICAgIHZhbHVlSW5kZXggPSBuby5nZXRBdHRyaWJ1dGVOb2RlKFwiaW5kZXhcIikudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHZhbHVlQ29sbGVjdGlvbiA9IFwiXCI7XG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKFwiY29sbGVjdGlvblwiKSkge1xuICAgICAgICAgICAgdmFsdWVDb2xsZWN0aW9uID0gbm8uZ2V0QXR0cmlidXRlTm9kZShcImNvbGxlY3Rpb25cIikudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kYXkgPSBuZXcgTm9Gb3JFYWNoKG5vLCBkYXRhLCB0aGlzLCBuby5nZXRBdHRyaWJ1dGVOb2RlKFwiaXRlbVwiKS52YWx1ZSwgdmFsdWVJbmRleCwgdmFsdWVTZXBhcmFkb3IsIHZhbHVlQXZlcmFnZSwgY2xvc2luZ3ZhbHVlLCBubywgdmFsdWVDb2xsZWN0aW9uLCB0aGlzKTtcbiAgICAgICAgbm9tYWluLmFkZChub2RheSk7XG4gICAgfVxuICAgIHJlYWRJZihubywgbm9tYWluLCBkYXRhKSB7XG4gICAgICAgIGNvbnN0IG5vSWYgPSBuZXcgTm9JZihubywgZGF0YSwgdGhpcywgbm8uZ2V0QXR0cmlidXRlTm9kZShcInRlc3RcIikudmFsdWUpO1xuICAgICAgICBpZiAobm8uaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICB0aGlzLnJlYWQobm8sIG5vSWYsIGRhdGEpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub0lmLnRleHQgPSBuby50ZXh0Q29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vbWFpbi5hZGQobm9JZik7XG4gICAgfVxuICAgIHJlYWRDaG9vc2Uobm8sIG5vbWFpbiwgZGF0YSkge1xuICAgICAgICBjb25zdCBub2hlYWQgPSBuZXcgTm9DaG9vc2Uobm8sIGRhdGEsIHRoaXMpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5vc29uID0gbm8uY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgICAgIGlmIChub3Nvbi5ub2RlTmFtZSA9PSBcIndoZW5cIikge1xuICAgICAgICAgICAgICAgIG5vaGVhZC5hZGQodGhpcy5yZWFkTm9XaGVuKG5vc29uLCBkYXRhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChub3Nvbi5ub2RlTmFtZSA9PSBcIm90aGVyd2lzZVwiKSB7XG4gICAgICAgICAgICAgICAgbm9oZWFkLmFkZChuZXcgTm9PdGhlcndpc2Uobm9zb24sIGRhdGEsIHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBub21haW4uYWRkKG5vaGVhZCk7XG4gICAgfVxuICAgIHJlYWROb1doZW4obm8sIGRhdGEpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvblRlc3QgPSBuby5nZXRBdHRyaWJ1dGVOb2RlKFwidGVzdFwiKS52YWx1ZTtcbiAgICAgICAgY29uc3Qgbm93aGVuID0gbmV3IE5vV2hlbihubywgZGF0YSwgdGhpcywgZXhwcmVzc2lvblRlc3QpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm8uY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgbm9zb24gPSBuby5jaGlsZE5vZGVzW2ldO1xuXG4gICAgICAgICAgICBpZiAobm9zb24ubm9kZU5hbWUgPT0gXCJjaG9vc2VcIikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZENob29zZShub3Nvbiwgbm93aGVuLCBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5vc29uLm5vZGVOYW1lID09IFwiaWZcIikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZElmKG5vc29uLCBub3doZW4sIGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm9zb24ubm9kZU5hbWUgPT0gXCJmb3JlYWNoXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWRGb3JFYWNoKG5vc29uLCBub3doZW4sIGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm9zb24uaGFzQ2hpbGROb2RlcygpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vc29uLm5vZGVOYW1lICE9IFwiI2NvbW1lbnRcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBub1N0cmluZyA9IG5ldyBOb1N0cmluZyhub3NvbiwgZGF0YSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIG5vd2hlbi5hZGQobm9TdHJpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8xIGVsZW1lbnQsIHRyxrDhu51uZyBo4bujcCBuw6B5IGtow7RuZyBjaG8gcGjDqXAgdGjDqm0gbuG7r2FcbiAgICAgICAgICAgICAgICBjb25zdCBub1N0cmluZyA9IG5ldyBOb1N0cmluZyhub3NvbiwgZGF0YSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgbm93aGVuLmFkZChub1N0cmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vd2hlbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVuZGVyIGh0bWwgdGVtcGxhdGUgd2l0aCBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IGZpbGVuYW1lXG4gICAgICogQHBhcmFtIHsqfSBkYXRhXG4gICAgICogQHJldHVybnNcbiAgICAgKiBAbWVtYmVyb2YgRkxSZXBvcnRUZW1wbGF0ZVJlbmRlclxuICAgICAqL1xuICAgIHJlbmRlcihmaWxlbmFtZSwgZGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGRpciA9IGNvbmZpZy5zZXJ2ZXIucmVwb3J0X2RpcjtcbiAgICAgICAgICAgIGxldCBleHQgPSBjb25maWcuc2VydmVyLnJlcG9ydF9leHQ7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGFwcFBhdGggKyBkaXIgKyBmaWxlbmFtZSArIGV4dDtcbiAgICAgICAgICAgIGlmIChmcy5sc3RhdFN5bmMoZmlsZW5hbWUpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBodG1sQ29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBodG1sQ29udGVudHMgPSB0aGlzLnJlbmRlckNvbnRlbnQoaHRtbENvbnRlbnRzLCBkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiBodG1sQ29udGVudHM7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVuZGVyIGh0bWwgY29udGVudHNcbiAgICAgKiBAcGFyYW0ge0hUTUwgU3RyaW5nfSBodG1sQ29udGVudHMgXG4gICAgICogQHBhcmFtIHtBcnJheSBvciBvYmplY3R9IGRhdGEgXG4gICAgICovXG4gICAgcmVuZGVyQ29udGVudChodG1sQ29udGVudHMsIGRhdGEpIHtcbiAgICAgICAgaWYgKExpYnMuaXNCbGFuayhodG1sQ29udGVudHMpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvL3ThuqFvIGdsb2JhbCB2YXJpYWJsZSDEkeG7gyB44butIGzDvVxuXG4gICAgICAgICAgICBjb25zdCB4bWxEb2MgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhodG1sQ29udGVudHMpO1xuICAgICAgICAgICAgLy8gaWYgKHhtbERvYy5kb2N1bWVudEVsZW1lbnQubm9kZU5hbWUgIT0gXCJodG1sXCIgJiYgeG1sRG9jLmRvY3VtZW50RWxlbWVudC5ub2RlTmFtZSAhPSBcInRhYmxlXCIpIHtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vY29uc3Qgd2UgPSB4bWxEb2MuZG9jdW1lbnRFbGVtZW50LmNoaWxkTm9kZXM7XG4gICAgICAgICAgICBjb25zdCBpbmNoYXJnZSA9IG5ldyBObygpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBubyBvZiBBcnJheS5mcm9tKHhtbERvYy5jaGlsZE5vZGVzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZChubywgaW5jaGFyZ2UsIGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5jaGFyZ2UuZ2V0Q29tcGlsZWRDb250ZW50KCk7XG4gICAgICAgICAgICAvLyBmb3IgKGNvbnN0IG5vWG1sIG9mIEFycmF5LmZyb20od2UpKSB7XG4gICAgICAgICAgICAvLyAgICAgLy8gaWYgKG5vWG1sLm5vZGVOYW1lID09IFwiYm9keVwiIHx8IG5vWG1sLm5vZGVOYW1lID09IFwiaGVhZFwiIHx8IG5vWG1sLm5vZGVOYW1lID09IFwidGJvZHlcIiB8fCBub1htbC5ub2RlTmFtZSA9PSBcInRyXCIpIHtcbiAgICAgICAgICAgIC8vICAgICBpZiAobm9YbWwubm9kZU5hbWUgIT0gXCIjY29tbWVudFwiICYmIG5vWG1sLm5vZGVOYW1lICE9IFwiI3RleHRcIikge1xuICAgICAgICAgICAgLy8gICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5yZWFkKG5vWG1sLCBpbmNoYXJnZSwgZGF0YSk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBpbmNoYXJnZS5nZXRDb21waWxlZENvbnRlbnQoKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlmIChub1htbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgbGV0IG5ld05vZGUgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhub1htbC50b1N0cmluZygpKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBub1htbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdOb2RlLCBub1htbCk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiZXJyXCIpO1xuICAgICAgICAgICAgLy8gICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sQ29udGVudHMgPSBkZWNvZGUoeG1sRG9jLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgcmV0dXJuIGh0bWxDb250ZW50cztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIl19