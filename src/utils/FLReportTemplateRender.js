const fs = require("fs");
const xmldom = require("xmldom");
const htmldom = require("htmldom");
const s = require("string");
const moment = require("moment");
const util = require("util");
const logger = FLLogger.getLogger("FLReportTemplateRender");
const decode = require('unescape');

export default class FLReportRender {
    constructor() {
    }
    render(filename, data) {
        const templateRender = new FLReportTemplateRender();
        return templateRender.render(filename, data);
    }
    renderContent(htmlContents, data) {
        const templateRender = new FLReportTemplateRender();
        return templateRender.renderContent(htmlContents, data);
    }
}

class No {
    constructor(render) {
        this.children = [];
        this.renderClass = render;
    }
    add(no) {
        this.children.push(no);
    }
    removeAll() {
        this.children = [];
    }
    getCompiledContent() {
        for (const prop in this.children) {
            if (prop in this.children) {
                const noson = this.children[prop];
                noson.getCompiledContent();
            }
        }
    }
    getValue(data, path) {
        for (let i = 0; typeof data === "object" && i < path.length; ++i) {
            if (data) {
                data = data[path[i]];
            }
        }
        return data;
    }
    processexpression(expression, data) {
        try {
            let myArray;
            //sửa bug không phân tích được paramer từ 2 trở lên ví dụ #{param1},{#param2}
            const newexpression = expression;
            //const regex = new RegExp("#{([a-z.A-Z0-9_|()]+)}", "ig");
            //chấp nhận công thức trong expresstion
            const regex = new RegExp("#{([a-z.A-Z0-9_|()\"'+*\\-\\/\\%=? ;.#,:]+)}", "ig");

            while ((myArray = regex.exec(newexpression)) !== null) {

                const stretch = myArray[0];
                const property = myArray[1].replace(data + ".", "");
                const fields = property.split("|");
                const fieldExpression = fields[0];
                var expArray = [];
                //phân tích công thức trong biểu thức
                const regexExp = new RegExp("([a-z.A-Z0-9_]+)", "ig");
                let subFieldExpress = fieldExpression;
                let field = "";
                while ((expArray = regexExp.exec(fieldExpression)) !== null) {
                    //giu nguyen ham thu vien
                    let newField = expArray[0];
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
                    let express = subFieldExpress.substring(0, subFieldExpress.indexOf(newField) + newField.length + 1);
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
                        propertyvalue = eval(field)
                    }

                    if (typeof propertyvalue == 'undefined') {
                        propertyvalue = "";
                    }
                } catch (err) {
                    propertyvalue = "";
                }
                propertyvalue = this.formatValue(propertyvalue,fields);
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
    formatValue(value, formatArr) {

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
        let firstFormatOtion = "";
        if (formatArr.length > 2) {
            firstFormatOtion = formatArr[2];
            if (!Libs.isBlank(firstFormatOtion) && firstFormatOtion.indexOf("this.") >= 0) {
                firstFormatOtion = firstFormatOtion.replace("this.", "this.renderClass.");
            }
            try{
                firstFormatOtion = eval(firstFormatOtion);
            }catch(e){

            }
        }
        let secondFormatOption = "";
        //nếu là date hoặc datetime thì nếu không có format thứ 2 thì format đầu là format đến
        // nếu không có format 2 thì format đầu là đích đến
        if (formatArr.length > 3) {
            secondFormatOption = formatArr[3];
            if (!Libs.isBlank(secondFormatOption) && secondFormatOption.indexOf("this.") >= 0) {
                secondFormatOption = secondFormatOption.replace("this.", "this.renderClass.");
            }
            try{
                secondFormatOption = eval(secondFormatOption);
            }catch(e){
                
            }
        }
        if (format == "numberic" || format == "numeric") {
            if(Libs.isBlank(firstFormatOtion)){
                value = Libs.formatNum(value);
            }else{
                if(Libs.isBlank(secondFormatOption)){
                    value = Libs.formatNum(value, eval(firstFormatOtion));
                }else{
                    value = Libs.formatNum(value, firstFormatOtion,secondFormatOption);
                }
            }
            
        }
        else if (format.indexOf("date") >= 0) {
            
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
            var formatFrom = "", formatTo = firstFormatOtion;
            if (secondFormatOption != "") {
                //nếu có format thứ 2 thì format thứ 2 là format đến
                formatFrom = firstFormatOtion;
                formatTo = secondFormatOption;
            }
            value = Libs.dateFormat(value, formatTo, formatFrom);
        }

        return value;
    }
}
class NoString extends No {
    constructor(curNode, data, render) {
        super(render);
        this.node = curNode;
        this.data = data;
    }
    getCompiledContent() {
        try {
            super.getCompiledContent();
            let text = super.processexpression(this.node.toString(), this.data) + "";
            //replace node hiện tại bằng node mới đã biên dịch
            if (this.node && this.node.parentNode) {
                if (!Libs.isBlank(text)) {
                    const newNode = new xmldom.DOMParser().parseFromString(decode(text));
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
            logger.error(err)
        }
    }
}

class NoChoose extends No {
    constructor(curNode, data, render) {
        super(render);
        this.node = curNode;
        this.data = data;
    }
    add(no) {
        super.add(no);
        if (no instanceof NoOtherwise) {
            this.noOtherwise = no;
        }
    }
    getCompiledContent() {
        let data = this.data;
        let text = "";
        let valueExpression = false;
        for (const i in this.children) {
            const no = this.children[i];
            if (no instanceof NoWhen) {
                const nowhen = no;
                const expression = nowhen.expressionTest.replace("#{", "data.").replace("}", "");
                try {
                    eval("if( " + expression + " ) valueExpression = true; else valueExpression = false;");
                }
                catch (err) {
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
            const newNode = new xmldom.DOMParser().parseFromString(decode(text));
            this.node.parentNode.replaceChild(newNode, this.node);
        }
    }
}
class NoWhen extends No {
    constructor(curNode, data, render, expressionTest) {
        super(render);
        this.expressionTest = expressionTest;
        this.node = curNode;
        this.data = data;
        //const regex = new RegExp("[_a-zA-Z][_a-zA-Z0-9]{0,30}", "ig");
        const regex = new RegExp("[a-z.A-Z0-9_][_a-z.A-Z0-9]{0,30}", "ig");
        const identifiers = [];
        let myArray = [];
        this.expressionTest = s(this.expressionTest).replaceAll("and", "&&").toString();
        this.expressionTest = s(this.expressionTest).replaceAll("or", "||").toString();
        const newexpressionTest = this.expressionTest;
        while ((myArray = regex.exec(newexpressionTest)) !== null) {
            const identifier = myArray[0];

            if (identifier == "null" || identifier == "true" || identifier == "false" || identifier == "and") {
                continue;
            }
            identifiers.push(identifier);
            if (!Libs.isNumber(identifier)) {
                if (identifier.indexOf("this.") >= 0) {
                    let newIdentifier = identifier.replace("this.", "this.renderClass.")
                    this.expressionTest = this.expressionTest.replace(identifier, newIdentifier);
                } else {
                    let value = this.getValue(this.data, identifier.split("."));
                    if (typeof value == "undefined") {
                        //giữ nguyên

                    } else {
                        this.expressionTest = this.expressionTest.replace(identifier, "data." + identifier);
                    }
                }
            }
        }

    }
}
class NoForEach extends No {
    constructor(curNode, data, render, item, index, separator, opening, closure, foreachNode, collection, parentClass) {
        super(render);
        this.node = curNode;
        this.data = data;
        this.item = item;
        this.index = index;
        this.separator = separator;
        this.opening = opening;
        this.closure = closure;
        this.collection = collection;
        this.foreachNode = foreachNode;
        this.parentClass = parentClass;
    }
    getCompiledContent() {
        try {
            let data = this.data;
            const text = [];
            let collection = data[this.collection];

            if (collection == null) {
                if (util.isArray(data)) {
                    collection = data;
                }
                else {
                    return this.opening + this.closure;
                }
            }
            let rowIndex = 0;
            for (const item of collection) {
                let textContent = "";
                if (this.foreachNode.hasChildNodes()) {
                    //đọc tiếp để lấy ra nội dung trong foreach
                    const incharge = new No();
                    let childData = {};

                    eval("childData." + this.item + "=item");
                    eval("childData." + this.index + "=" + rowIndex);
                    //copy node ra không nó sẽ bị replace
                    let foreachNodeCopyed = this.foreachNode.cloneNode(true);
                    this.parentClass.read(foreachNodeCopyed, incharge, childData);
                    incharge.getCompiledContent();

                    textContent = foreachNodeCopyed.childNodes.toString();
                } else {
                    textContent = this.foreachNode.textContent;
                }
                let newexpression = decode(textContent);
                // láy giá trị nếu có

                newexpression = super.processexpression(newexpression, item) + " ";

                text.push(newexpression);
                rowIndex++;
            }
            const sql = this.opening + text.join(this.separator) + this.closure;

            //replace node hiện tại bằng node mới đã biên dịch
            if (this.node && this.node.parentNode) {
                if (!Libs.isBlank(sql)) {
                    const newNode = new xmldom.DOMParser().parseFromString(decode(sql));
                    this.node.parentNode.replaceChild(newNode, this.node);
                } else {
                    this.node.parentNode.removeChild(this.node);
                }
            }
        } catch (err) {
            if (this.node && this.node.parentNode) {
                this.node.parentNode.removeChild(this.node);
            }
            logger.error(err)
        }
    }
}
class NoIf extends No {
    constructor(curNode, data, render, expressionTest) {
        super(render);
        this.expressionTest = expressionTest;
        this.node = curNode;
        this.data = data;
        //const regex = new RegExp("[_a-zA-Z][_a-zA-Z0-9]{0,30}", "ig");
        const regex = new RegExp("[a-z.A-Z0-9_()][_a-z.A-Z0-9()]{0,30}", "ig");

        const identifiers = [];
        let myArray = [];
        while ((myArray = regex.exec(expressionTest)) !== null) {
            const identifier = myArray[0];
            if (identifier == "null" || identifier.toLowerCase() == "and"
                || identifier.toLowerCase() == "or" || Libs.isNumber(identifier)) {
                continue;
            }
            if (identifiers.indexOf(identifier) >= 0) {
                //da thay roi khong thay nua
                continue;
            }
            identifiers.push(identifier);
            //this.expressionTest = this.expressionTest.replace(identifier, "data." + identifier);

            var regex1 = /\(.*?\)/;
            const paramRegex = new RegExp(regex1, "g");
            let my1Array = [];
            let newIdentifier = identifier;
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
                    this.expressionTest = expressionTest.replace(/this./gi, "this.renderClass.");
                } else {
                    this.expressionTest = this.expressionTest.replace(re, "data." + identifier);
                }
            } else {
                this.expressionTest = this.expressionTest.replace(identifier, newIdentifier);
            }

        }
    }
    getCompiledContent() {
        try {
            let data = this.data;
            let expression = this.expressionTest.replace("#{", "data.").replace("}", "");
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
            }
            catch (err) {
                data.valueExpression = false;
            }
            if (data.valueExpression == false) {
                //bỏ if
                if (this.node && this.node.parentNode) {
                    this.node.parentNode.removeChild(this.node);
                }
                return;
            }
            super.getCompiledContent();
            //chỉ lấy bên trong
            if (this.node) {
                let childNodeContents = this.node.childNodes.toString();
                const newNode = new xmldom.DOMParser().parseFromString(decode(childNodeContents));
                this.node.parentNode.replaceChild(newNode, this.node);
            }
        } catch (err) {
            if (this.node && this.node.parentNode) {
                this.node.parentNode.removeChild(this.node);
            }
            logger.error(err)
        }
    }
}
class NoOtherwise extends No {
    constructor(curNode, data, render) {
        super(render);
        this.node = curNode;
        this.data = data;
    }
    getCompiledContent() {
        try {
            let text = super.processexpression(this.node.childNodes.toString(), this.data);
            if (this.node && this.node.parentNode) {
                if (!Libs.isBlank(text)) {
                    const newNode = new xmldom.DOMParser().parseFromString(decode(text));
                    this.node.parentNode.replaceChild(newNode, this.node);
                } else {
                    this.node.parentNode.removeChild(this.node);
                }
            }
        } catch (err) {
            if (this.node && this.node.parentNode) {
                this.node.parentNode.removeChild(this.node);
            }
            logger.error(err)
        }
    }
}
class FLReportTemplateRender {
    constructor() {
    }
    read(gchild, incharge, data) {
        if (!gchild) return;
        if (!gchild.childNodes) {
            if (gchild.nodeName != "#comment") {
                let noString = new NoString(gchild, data, this);
                incharge.add(noString);
            }
            return;
        }
        for (const no of Array.from(gchild.childNodes)) {

            if (no.nodeName == "choose") {
                this.readChoose(no, incharge, data);
            }
            else if (no.nodeName == "if") {
                this.readIf(no, incharge, data);
            }
            else if (no.nodeName == "foreach") {
                this.readForEach(no, incharge, data);
            }
            else {
                if (no.hasChildNodes() == false) {
                    if (no.nodeName != "#comment") {
                        let noString = new NoString(no, data, this);
                        incharge.add(noString);
                    }
                } else {
                    const childIncharge = new NoString(no, data, this);
                    this.read(no, childIncharge, data);
                    incharge.add(childIncharge);

                }
            }
        }
    }
    readForEach(no, nomain, data) {
        let valueSeparador = "";
        if (no.getAttributeNode("separator")) {
            valueSeparador = no.getAttributeNode("separator").value;
        }
        let valueAverage = "";
        if (no.getAttributeNode("open")) {
            valueAverage = no.getAttributeNode("open").value;
        }
        let closingvalue = "";
        if (no.getAttributeNode("close")) {
            closingvalue = no.getAttributeNode("close").value;
        }
        let valueIndex = "";
        if (no.getAttributeNode("index")) {
            valueIndex = no.getAttributeNode("index").value;
        }
        let valueCollection = "";
        if (no.getAttributeNode("collection")) {
            valueCollection = no.getAttributeNode("collection").value;
        }
        const noday = new NoForEach(no, data, this, no.getAttributeNode("item").value, valueIndex, valueSeparador, valueAverage, closingvalue, no, valueCollection, this);
        nomain.add(noday);
    }
    readIf(no, nomain, data) {
        const noIf = new NoIf(no, data, this, no.getAttributeNode("test").value);
        if (no.hasChildNodes()) {
            this.read(no, noIf, data);

        } else {
            noIf.text = no.textContent;
        }

        nomain.add(noIf);
    }
    readChoose(no, nomain, data) {
        const nohead = new NoChoose(no, data, this);
        for (let i = 0; i < no.childNodes.length; i++) {
            const noson = no.childNodes[i];
            if (noson.nodeName == "when") {
                nohead.add(this.readNoWhen(noson, data));
            }
            else if (noson.nodeName == "otherwise") {
                nohead.add(new NoOtherwise(noson, data, this));
            }
        }
        nomain.add(nohead);
    }
    readNoWhen(no, data) {
        const expressionTest = no.getAttributeNode("test").value;
        const nowhen = new NoWhen(no, data, this, expressionTest);

        for (let i = 0; i < no.childNodes.length; i++) {
            const noson = no.childNodes[i];

            if (noson.nodeName == "choose") {
                this.readChoose(noson, nowhen, data);
            }
            else if (noson.nodeName == "if") {
                this.readIf(noson, nowhen, data);
            }
            else if (noson.nodeName == "foreach") {
                this.readForEach(noson, nowhen, data);
            }
            else if (noson.hasChildNodes() == false) {
                if (noson.nodeName != "#comment") {
                    const noString = new NoString(noson, data, this);
                    nowhen.add(noString);
                }
            } else {
                //1 element, trường hợp này không cho phép thêm nữa
                const noString = new NoString(noson, data, this);
                nowhen.add(noString);
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
    render(filename, data) {
        try {
            let dir = config.server.report_dir;
            let ext = config.server.report_ext;
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
    renderContent(htmlContents, data) {
        if (Libs.isBlank(htmlContents)) return false;
        try {
            //tạo global variable để xử lý

            const xmlDoc = new xmldom.DOMParser().parseFromString(htmlContents);
            // if (xmlDoc.documentElement.nodeName != "html" && xmlDoc.documentElement.nodeName != "table") {
            //     return null;
            // }
            //const we = xmlDoc.documentElement.childNodes;
            const incharge = new No();
            for (const no of Array.from(xmlDoc.childNodes)) {
                this.read(no, incharge, data);
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

}
