const fs = require("fs");
const xmldom = require("xmldom");
const htmldom = require("htmldom");
const s = require("string");
const moment = require("moment");
const util = require("util");
const logger=FLLogger.getLogger("FLReportTemplateRender");
const decode = require('unescape');
class SqlCommand {
    constructor() {
        this.sql = "";
        this.parameters = [];
    }
    addParameter(value) {
        this.parameters.push(value);
    }
}
class No {
    constructor() {
        this.children = [];
    }
    add(no) {
        this.children.push(no);
    }
    removeAll(){
        this.children=[];
    }
    getSql(sqlcommand, data) {
        for (const prop in this.children) {
            if (prop in this.children) {
                const noson = this.children[prop];
                noson.getSql(sqlcommand, data);
            }
        }
        return sqlcommand;
    }
    getValue(data, path) {
        for (let i = 0; typeof data === "object" && i < path.length; ++i) {
            if (data) {
                data = data[path[i]];
            }
        }
        return data;
    }
    processexpression(expression, sqlcommand, data) {
        let myArray;
        //sửa bug không phân tích được paramer từ 2 trở lên ví dụ #{param1},{#param2}
        const newexpression = expression;
        const regex = new RegExp("#{([a-z.A-Z0-9_|]+)}", "ig");
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
            const stretch = myArray[0];
            const property = myArray[1].replace(data + ".", "");
            const fields = property.split("|");

            let propertyvalue = this.getValue(data, fields[0].split("."));
            propertyvalue = propertyvalue?propertyvalue:"";
            var format = "";
            if(fields.length>=2){
                //có format
                format = fields[1].trim();
            }
            if(!Libs.isBlank(format)){
                var value = propertyvalue;
                if("date"==format){
                    value = moment(propertyvalue).format(Constants.data.format.date);
                }else if("datetime"==format){
                    value = moment(propertyvalue).format(Constants.data.format.datetime)
                }else if("numeric"==format){
                    value = Libs.formatNum(value,Constants.data.format.numeric);
                }
                expression = expression.replace(stretch, value);
                sqlcommand.addParameter(value);
            }else {
                //if (propertyvalue == null || typeof propertyvalue == "number" || typeof propertyvalue == "string" || typeof propertyvalue == "boolean") {
                expression = expression.replace(stretch, propertyvalue);
                sqlcommand.addParameter(propertyvalue);
            }
            
        }
        return expression;
    }
}
class NoString extends No {
    constructor(text) {
        super();
        this.text = text.trim();
    }
    getSql(sqlcommand, data) {
        sqlcommand.sql += super.processexpression(this.text, sqlcommand, data) + " ";
    }
}

class NoChoose extends No {
    constructor() {
        super();
    }
    add(no) {
        super.add(no);
        if (no instanceof NoOtherwise) {
            this.noOtherwise = no;
        }
    }
    getSql(sqlcommand, data) {
        for (const i in this.children) {
            const no = this.children[i];
            if (no instanceof NoWhen) {
                const nowhen = no;
                const expression = nowhen.expressionTest.replace("#{", "data.").replace("}", "");
                try {
                    eval("if( " + expression + " ) data.valueExpression = true; else data.valueExpression = false;");
                }
                catch (err) {
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
}
class NoWhen extends No {
    constructor(expressionTest, text) {
        super();
        this.expressionTest = expressionTest;
        this.text = text;
       
        //const regex = new RegExp("[_a-zA-Z][_a-zA-Z0-9]{0,30}", "ig");
        const regex = new RegExp("[a-z.A-Z0-9_][_a-z.A-Z0-9]{0,30}", "ig");
        const identifiers = [];
        let myArray = [];
        while ((myArray = regex.exec(expressionTest)) !== null) {
            const identifier = myArray[0];
           
            if (identifier == "null" || identifier == "true" || identifier == "false" || identifier == "and") {
                continue;
            }
            identifiers.push(identifier);
            this.expressionTest = this.expressionTest.replace(identifier, "data." + identifier);
        }
        this.expressionTest = s(this.expressionTest).replaceAll("and", "&&").toString();
    }
}
class NoForEach extends No {
    constructor(item, index, separator, opening, closure, text, collection) {
        super();
        this.item = item;
        this.index = index;
        this.separator = separator;
        this.opening = opening;
        this.closure = closure;
        this.collection = collection;
        this.text = text.trim();
    }
    getSql(sqlcommand, data) {
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
        for (const item of collection) {
            let myArray;
            //thay the regex, regex này không thể lọc được param có dấu _ hoặc số
            //const regex = new RegExp("#{([a-z.A-Z]+)}", "ig");
            //const regex = new RegExp("#{([a-z.A-Z0-9_]+)}", "ig");
            const regex = new RegExp("#{([a-z.A-Z0-9_|]+)}", "ig");
            const expression = this.text;
            let newexpression = expression;
           while ((myArray = regex.exec(expression)) !== null) {     
                // const stretch = myArray[0];
                // const property = myArray[1].replace(this.item + ".", "");
                // const propertyvalue = this.getValue(item, property.split("."));
                // var month = moment().month();
                // if (typeof propertyvalue == "number" || typeof propertyvalue == "string" || typeof propertyvalue == "boolean") {
                //     newexpression = newexpression.replace(stretch, propertyvalue);
                //     sqlcommand.addParameter(propertyvalue);
                // }
                const stretch = myArray[0];
                const property = myArray[1].replace(this.item + ".", "");
                const fields = property.split("|");

                const propertyvalue = this.getValue(item, fields[0].split("."));
                var format = "";
                if(fields.length>=2){
                    //có format
                    format = fields[1].trim();
                }
               if(!Libs.isBlank(format)){
                   var value = propertyvalue;
                   if("date"==format){
                    value = moment(propertyvalue).format(Constants.data.format.date);
                   }else if("datetime"==format){
                    value = moment(propertyvalue).format(Constants.data.format.datetime)
                   }else if("numeric"==format){
                    value = Libs.formatNum(value,Constants.data.format.numeric);
                   }
                    newexpression = newexpression.replace(stretch, value);
                    sqlcommand.addParameter(value);
               }else {
                   //if (propertyvalue == null || typeof propertyvalue == "number" || typeof propertyvalue == "string" || typeof propertyvalue == "boolean") {
                    newexpression = newexpression.replace(stretch, propertyvalue);
                    sqlcommand.addParameter(propertyvalue);
                }
            }
            text.push(newexpression);
        }
        const sql = this.opening + text.join(this.separator) + this.closure;
        sqlcommand.sql += sql;
        return sqlcommand;
    }
}
class NoIf extends No {
    constructor(expressionTest, text) {
        super();
        this.expressionTest = expressionTest;
        this.text = text;
        //const regex = new RegExp("[_a-zA-Z][_a-zA-Z0-9]{0,30}", "ig");
        const regex = new RegExp("[a-z.A-Z0-9_][_a-z.A-Z0-9]{0,30}", "ig");
        
        const identifiers = [];
        let myArray = [];
        
        while ((myArray = regex.exec(expressionTest)) !== null) {
            const identifier = myArray[0];
            if (identifier == "null") {
                continue;
            }
            identifiers.push(identifier);
            this.expressionTest = this.expressionTest.replace(identifier, "data." + identifier);
        }
    }
    getSql(sqlcommand, data) {
        const expression = this.expressionTest.replace("#{", "data.").replace("}", "");
        try {
            if (expression) {
               
                eval("if( " + expression + " ) data.valueExpression = true; else data.valueExpression = false;");
            }
        }
        catch (err) {
            data.valueExpression = false;
        }
        if (data.valueExpression == false) {
            return "";
        }
        super.getSql(sqlcommand, data) + " ";
    }
}
class NoOtherwise extends No {
    constructor(text) {
        super();
        this.text = text;
    }
    getSql(sqlcommand, data) {
        let myArray;
        //const regex = new RegExp("#{([a-z.A-Z]+)}", "ig");
        //thay the regex, regex này không thể lọc được param có dấu _ hoặc số
        const regex = new RegExp("#{([a-z.A-Z0-9_|]+)}", "ig");
        let expression = this.text;
        while ((myArray = regex.exec(this.text)) !== null) {
            // const stretch = myArray[0];
            // const propertyvalue = this.getValue(data, myArray[1].split("."));
            // if (typeof propertyvalue == "number" || typeof propertyvalue == "string" || typeof propertyvalue == "boolean") {
            //     expression = expression.replace(stretch, propertyvalue);
            //     sqlcommand.addParameter(propertyvalue);
            // }
            const stretch = myArray[0];
            const property = myArray[1].replace(data + ".", "");
            const fields = property.split("|");

            const propertyvalue = this.getValue(data, fields[0].split("."));
            var format = "";
            if(fields.length>=2){
                //có format
                format = fields[1].trim();
            }
            if(!Libs.isBlank(format)){
                var value = propertyvalue;
                if("date"==format){
                    value = moment(propertyvalue).format(Constants.data.format.date);
                }else if("datetime"==format){
                    value = moment(propertyvalue).format(Constants.data.format.datetime)
                }else if("numeric"==format){
                    value = Libs.formatNum(value,Constants.data.format.numeric);
                }
                expression = expression.replace(stretch, value);
                sqlcommand.addParameter(value);
            }else {
                expression = expression.replace(stretch, propertyvalue);
                sqlcommand.addParameter(propertyvalue);
            }
        }
        sqlcommand.sql += expression + " ";
    }
}
export default class FLReportTemplateRender {
    constructor() {
    }
    read( gchild,incharge,data) {
        for (const no of Array.from(gchild.childNodes)) {
            if (no.nodeName == "choose") {
               this.readChoose(no, incharge);
            }
            else if (no.nodeName == "if") {
               this.readIf(no, incharge);
            }
            else if (no.nodeName == "foreach") {
               this.readForEach(no, incharge);
            }
            else {
                if (no.hasChildNodes() == false) {
                    if (no.nodeName != "#comment"){
                       const noString = new NoString(no.toString());
                        incharge.add(noString);
                    }
                }else{
                  const childIncharge = new No();                  
                  this.read(no,childIncharge,data);
                  const sqlcommand = new SqlCommand();
                  childIncharge.getSql(sqlcommand, data);
                  var sql = sqlcommand.sql;
                  no.textContent =sql;
                  
                  var html = decode(no.toString())

                  const noString = new NoString(html);
                  incharge.add(noString);
                  
                }
            }
        }
        const sqlcommand = new SqlCommand();
        incharge.getSql(sqlcommand, data);
        var sql = sqlcommand.sql;
        incharge.removeAll();
        const noString = new NoString(sql);
        incharge.add(noString);      
    }
    readForEach(no, nomain, mapping) {
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
        const noday = new NoForEach(no.getAttributeNode("item").value, valueIndex, valueSeparador, valueAverage, closingvalue, no.childNodes.toString(), valueCollection, mapping);
        
        nomain.add(noday);
    }
    readIf(no, nomain, mapping) {
        const noIf = new NoIf(no.getAttributeNode("test").value, no.childNodes[0].toString(), mapping);
        for (let i = 0; i < no.childNodes.length; i++) {
            const noson = no.childNodes[i];
            if (noson.nodeName == "choose") {
                this.readChoose(noson, noIf, mapping);
            }
            else if (noson.nodeName == "if") {
                this.readIf(noson, noIf, mapping);
            }
            else if (noson.nodeName == "foreach") {
                this.readForEach(noson, noIf, mapping);
            }
            else {
                if (noson.hasChildNodes() == false) {
                    if (noson.nodeName != "#comment"){
                    //const noString = new NoString(noson.textContent, mapping);
                    const noString = new NoString(noson.toString());
                    noIf.add(noString);
                    }
                }else{
                    //1 element, trường hợp này không cho phép thêm nữa
                    const noString = new NoString(noson.toString());
                    noIf.add(noString);
                }
            }
        }
        nomain.add(noIf);
    }
    readChoose(no, nomain) {
        const nohead = new NoChoose();
        for (let i=0;i< no.childNodes.length;i++) {
            const noson = no.childNodes[i];
            if (noson.nodeName == "when") {
                nohead.add(this.readNoWhen(noson, no));
            }
            else if (noson.nodeName == "otherwise") {
                nohead.add(new NoOtherwise(noson.childNodes[0].toString()));
            }
        }
        nomain.add(nohead);
    }
    readNoWhen(no, noPrivate) {
        const expressionTest = no.getAttributeNode("test").value;
        var data = "";
        if(no.childNodes.length>0){
           data=no.childNodes[0].toString();//nen thay toString()
        }
        const nowhen = new NoWhen(expressionTest, data);
        
        for (let i=0;i< no.childNodes.length;i++) {
            const noson = no.childNodes[i];

            if (noson.nodeName == "choose") {
                this.readChoose(noson, nowhen);
            }
            else if (noson.nodeName == "if") {
                this.readIf(noson, nowhen);
            }
            else if (noson.nodeName == "foreach") {
                this.readForEach(noson, nowhen);
            }
            else if (noson.hasChildNodes() == false) {
                if (noson.nodeName != "#comment"){
                //const noString = new NoString(noson.textContent);

                const noString = new NoString(noson.toString());
                nowhen.add(noString);
                }
            }else{
                //1 element, trường hợp này không cho phép thêm nữa
                const noString = new NoString(noson.toString());
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
    render(filename,data) {
        try{
            let dir = config.server.report_dir;
            let ext = config.server.report_ext;
            filename = appPath + dir + filename + ext;
            if (fs.lstatSync( filename).isDirectory()) {
                return null;
            }
            var htmlContents = fs.readFileSync(filename).toString();
            htmlContents = this.renderContent(htmlContents,data);
            return htmlContents;
        }catch(err){
            logger.error(err);
            return false;
        }
    }
    /**
     * render html contents
     * @param {HTML String} htmlContents 
     * @param {Array or object} data 
     */
    renderContent(htmlContents,data) {
        if(Libs.isBlank(htmlContents)) return false;
        try{
            const xmlDoc = new  xmldom.DOMParser().parseFromString(htmlContents);
            if (xmlDoc.documentElement.nodeName != "html") {
                return null;
            }
            const we = xmlDoc.documentElement.childNodes;
            const incharge = new No();
            for (const noXml of Array.from(we)) {
                if (noXml.nodeName == "body") {
                    this.read(noXml,incharge,data);
                    const sqlcommand = new SqlCommand();
                    incharge.getSql(sqlcommand, data);
                    noXml.textContent = sqlcommand.sql 
                }
            }
            htmlContents = decode(xmlDoc.toString());
            return htmlContents;
        }catch(err){
             logger.error(err);
            return false;
        }
    }
    
}
