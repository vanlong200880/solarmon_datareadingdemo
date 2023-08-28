import Constants from "./Constants";
import Libs from "./Libs";
import qs from 'qs';
import axios from 'axios';
export default class FLHttp {
    // constructor(header){
    //     this.header = header;
    // }
    initialize(url, data) {
        var self = this;
        // Setting URL and headers for request
        // var json = JSON.stringify(data);
        var json = data;
        let header = this.header;
        // Return new promise 
        return new Promise(function (resolve, reject) {
            // Do async job
            axios.post(url, json, header)
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    console.log("error:",error)
                    reject(error);
                });
        })
    }
    post(url, params, callBack) {
        let self = this;
        var initializePromise = this.initialize(url, params);
        initializePromise.then(function (result) {
            if (result.status != 200) {
                callBack(false, {});
                return;
            }
            if (result != null) {
                callBack(true, result);
                return;
            } else {
                callBack(false, {});
            }
        }, function (status, err) {
            callBack(false, err);
        });
    }
    get(url, callBack) {
        let self = this;
        let header = this.header;
        axios.get(url, header)
        .then(function (response) {
            callBack(true, response);
        })
        .catch(function (error) {
            console.log("error:",error)
            callBack(false, error);
        });
    }
    
    setHeader({ authStr, contentType, method, timeout=180000}) {
        let headers = {
            'Content-Type': contentType,
            'Authorization': "Basic "+authStr,
            'method': method
        }
        this.header = { headers: headers,timeout: timeout };
    }
}

