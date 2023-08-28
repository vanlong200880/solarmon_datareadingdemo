export default class ClearLog {

    /**
     * clear log theo type truyền vào
     * @param {*} type 
     */
    clearLogByType(type) {
        //TODO: query clear log on elasticsearch
        var self = this;
        var index = config.elasticSearch.index;
        var query = elastic.buildQuery(index, type, 0, {}, [], [], false, 10000, null);
        elastic.search(query, function (err, res) {
            if (!err) {
                let data = res.data;
                self.deleteByQuery(data, index, type);
            }
        });

    }

    /**
     * clear log theo type định nghĩa sẵn
     */
    clearLog() {
        //TODO: query clear log on elasticsearch
        var self = this;
        var index = config.elasticSearch.index;
        for (var key in Constants.tables_name) {
            let type = "log_" + Constants.tables_name[key];
            var query = elastic.buildQuery(index, type, 0, {}, [], [], false, 10000, null);
            elastic.search(query, function (err, res) {
                if (!err) {
                    let data = res.data;
                    self.deleteByQuery(data, index, type);
                }
            });
        }
    }

    /**
     * tiến hành delete bằng elastic search
     * @param {*} data 
     * @param {*} index 
     * @param {*} type 
     */
    deleteByQuery(data, index, type){
        var self = this;
        if (Libs.isArrayData(data)) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let time = self.convertEventTime(item.event_time);
                let now = new Date();
                if (!Libs.isBlank(time) && now.getTime() - Libs.convertDateToMilliseconds(time) > config.elasticSearch.logExpire) {
                    let deleteQuery = self.buildDeleteQuery(type, item.id);
                    elastic.deleteByQuery(index, type, deleteQuery);
                }
            }
        }
    }

    /**
     * chuyển event_time lấy từ elastic để so sánh với ngày hiện tại
     * @param {*} eventTime 
     */
    convertEventTime(eventTime) {
        if (Libs.isBlank(eventTime)) return null;
        let day = eventTime.substring(6, 8);
        let month = eventTime.substring(4, 6);
        let year = eventTime.substring(0, 4);
        let hour = eventTime.substring(8, 10);
        let min = eventTime.substring(10, 12);
        let sec = eventTime.substring(12);
        let time = year + "-" + month + "-" + day;
        time += " " + hour + ":" + min;
        return time;
    }

    /**
     * build delete query cho elastic
     * @param {*} type 
     * @param {*} id 
     */
    buildDeleteQuery(type, id) {
        let deleteQuery = {
            "bool": {
                "must": [
                    {
                        "term": {
                            "_type": type
                        }
                    },
                    {
                        "term": {
                            "_id": id
                        }
                    }
                ]
            }
        }
        return deleteQuery;
    }
}