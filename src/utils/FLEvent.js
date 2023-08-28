const EventEmitter = require('events');
const LOGTYPE = {
    login: 1,
    request: 2,
    insert: 3,
    update: 4,
    delete: 5,
    export: 6,
    print: 7,
}
import LoggerEntity from '../entities/LoggerEntity'
export default class FLEvent extends EventEmitter {
    constructor(){
        super()
    }
    log(logType, param){
        try{
            let type = this.getElasTypeLog(logType, param.table_name)
            if(param.content){
                param.content.log_type = logType;
            }
            elastic.setIgnoreIdKey(config.elasticSearch.index, type,param.content);
        }catch(ex){
            console.trace(ex);
        }
    }
    getElasTypeLog(logType, tableName){
        if(Libs.isBlank(tableName)){
            if(logType==LOGTYPE.login){
                return "log_login";
            }
            return "log_request";
        }
        return "log_"+tableName;
    }
}
// const ev = new FLEvent();
// /**
//  * @param {interger} logType
//  * @param {LoggerEntity} param
//  */
// ev.on('log', (logType, param)=>{
//     ev.log(logType,param);
// })
// ev.emit('log', 'a', 'bien ban');
