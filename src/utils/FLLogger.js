var fs = require('fs');
var log4js = require('log4js');
var FLLogger = function (logFileName) {  
	//ini log4js
	log4js.configure({
		  appenders: {
		    everything: {
		      type: 'multiFile', base: 'logs/', property: 'ext', extension: '.log',
		      maxLogSize: 10485760, backups: 3000, compress: true
		    }
		  },
		  categories: {
		    default: { appenders: [ 'everything' ], level: 'info'}
		  }
		});
	this.logger = log4js.getLogger(logFileName);
	this.logger.addContext('ext', logFileName); 
}
module.exports = FLLogger;

FLLogger.getLogger=function(fileLogName){
	return new FLLogger(fileLogName);
};
/**
 * write error log
 * @param err
 */
FLLogger.prototype.error=function(){
	  try {
			this.logger.error(arguments);
			if(config.server.env == "development"){
				console.log(arguments);
			}
	  } catch(error) {
	    console.error(error);
	    
	  }
}
/**
 * write info log
 * @param info
 */
FLLogger.prototype.info=function(){
	  try {
			this.logger.info.apply(this.logger,arguments);
			if(config.server.env == "development"){
				console.log(arguments);
			}
	  } catch(error) {
	    console.error(error);
	    
	  }
}
/**
 * write debug log
 * @param debug
 */
FLLogger.prototype.debug=function(){
	  try {
			if(config.server.env == "development"){
				console.log(arguments);
				this.logger.debug(arguments);
			}
		
	  } catch(error) {
	    console.error(error);
	    
	  }
}
/**
 * write warn log
 * @param warn
 */
FLLogger.prototype.warn=function(){
	  try {
			
			if(config.server.env == "development"){
				console.log(arguments);
				this.logger.warn(arguments);
			}
	  } catch(error) {
	    console.error(error);
	    
	  }
}

