var path = require('path');
var fs = require('fs');
var yaml = require('js-yaml');
global.rootPath = __dirname;
global.appPath = rootPath + "/app/";
global.publicPath = rootPath + "/uploads/";

global.controlPath = appPath + "controller/";

global.fs = fs;
var config = {};
try {
    var hasConfigLocal = false;
    try {
        hasConfigLocal = fs.statSync(path.join(__dirname, './Config.local.yml')).isFile()
    } catch (error) {
        hasConfigLocal = false;
    }
    if (hasConfigLocal) {
        config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './Config.local.yml'), 'utf8'));
    } else {
        config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './Config.yml'), 'utf8'));
    }
} catch (e) {
    console.log(e);
    process.exit(1);
}
global.config = config;

var FLLogger = require(appPath + "utils/FLLogger");
global.FLLogger = FLLogger;
global.Libs = require(appPath + "utils/Libs");
global.SentMail = require(appPath + "utils/SentMail");
const constants = require(appPath + "utils/Constants");
global.Constants = constants;

global.Crypto = require(appPath + "utils/Crypto");
// global.defaultController = "hello";
// global.defaultFunction = "index";
global.log = FLLogger.getLogger("main");

var router = require(appPath + "core/Router");
var server = require(appPath + "core/Server");
var i18n = require("i18n");
config.i18n.directory = path.join(__dirname, config.i18n.directory);
i18n.configure(config.i18n);
global.i18n = i18n;

var FLReportTemplateRender = require(appPath + "utils/FLReportTemplateRender");
global.reportRender = new FLReportTemplateRender.default();

var messages = {};
try {
    messages = yaml.safeLoad(fs.readFileSync(appPath + 'lang/message.yml', 'utf8'));
} catch (e) {
    console.log(e);
    process.exit(1);
}
global.messages = messages;
// defined gender object
global.genders = {
    1: i18n.__("gender.male"),
    2: i18n.__("gender.female"),
    3: i18n.__("gender.unknown")
};
log.info('Main start: ', config.server.listenPort);
server.start(router, config.server.listenPort);



