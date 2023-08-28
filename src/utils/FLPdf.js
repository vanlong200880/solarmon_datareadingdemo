var fs = require('fs');
var base64 = require('file-base64');
var uuid = require('node-uuid');
var FLPdf = function () { };
module.exports = FLPdf;
// FLPdf.phantom = function (res, url, postData, customHeaders, callBack) {
//     var phantom = require('phantom')
//     customHeaders.Accept = "application/pdf";
//     delete customHeaders['content-type'];
//     let referer = customHeaders.referer;
//     if (typeof referer === 'undefined') {
//         referer = customHeaders.req_path;
//     }
//     let settings = {
//         operation: "POST",
//         encoding: "utf8",
//         headers: {
//             "Content-Type": customHeaders['content-type'],
//             "lang": customHeaders['lang'],
//             "x-access-token": customHeaders['x-access-token'],
//             "headquarter": customHeaders['headquarter'],
//             "req_path": referer
//         },
//         data: JSON.stringify(postData)
//     };
//     phantom.create().then(function (ph) {
//         ph.createPage().then(function (page) {
//             page.open(url, settings).then(function (status) {
//                 var filename = postData.filename;
//                 if (Libs.isBlank(postData.filename)) {
//                     filename = uuid.v4() + ".pdf";
//                 }
//                 let file = config.server.tmp_dir + filename;
//                 page.render(file, { format: "pdf" }).then(function () {
//                     try {
//                         fs.readFile(file, function (err, data) {
//                             if (err) {
//                                 callBack(false, err)
//                                 return;
//                             }
//                             res.contentType("application/pdf");
//                             res.send(data);
//                             page.close();
//                             ph.exit();
//                             //xoa file khi read xong
//                             fs.unlink(file, function (error) {
//                                 if (error) {
//                                     throw error;
//                                 }
//                                 console.log('Delete ' + file + '!!');
//                             });
//                         });
//                     } catch (e) {
//                         console.log(e)
//                     }
//                 });
//             });
//         });
//     });
// }
FLPdf.phantom = async function (res, url, postData, customHeaders, callBack, pageSize = "A4", orientation = "Portrait") {
    try{
        let rs = await this.toPdfFromUrl(res, url, postData, customHeaders, pageSize, orientation);
        callBack(rs,null);
    }catch(err){
        callBack(false,err);
    }
}
FLPdf.base64 = function (res, url, filename, callBack) {
    var phantom = require('phantom')
    phantom.create().then(function (ph) {
        ph.createPage().then(function (page) {
            page.open(url).then(function (status) {
                if (Libs.isBlank(filename)) {
                    filename = uuid.v4() + ".pdf";
                }
                let file = config.server.tmp_dir + filename;
                page.render(file).then(function () {
                    try {
                        fs.readFile(file, function (err, data) {
                            if (err) {
                                // var resData = {};
                                // resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), err, 0);
                                callBack(false, err)
                                return;
                            }
                            base64.encode(file, function (err, base64String) {
                                console.log("base64String:", base64String);
                                let rs = Libs.returnJsonResult(true, "", { "pdf": base64String }, 0);
                                res.send(rs);
                                //xoa file khi read xong
                                fs.unlink(file, function (error) {
                                    if (error) {
                                        throw error;
                                    }
                                    console.log('Delete ' + file + '!!');
                                });
                            });

                            // callBack(true, data)
                        });
                    } catch (e) {
                        console.log("Error: ", e)
                    }
                    ph.exit();
                });
            });
        });
    });
}
FLPdf.wkhtml = function (res, url, filename, callBack) {
    try {
        var wkhtmltopdf = require('wkhtmltopdf');
        wkhtmltopdf('http://apple.com/', { output: 'out.pdf' });
        // wkhtmltopdf('http://google.com/', { pageSize: 'letter' })
        // .pipe(fs.createWriteStream('aout.pdf'));
        // Optional callback
        // wkhtmltopdf(url, { output: 'tmp/out.pdf' }, function (err, stream) {
        //     try {
        //         // do whatever with the stream
        //         // if (err) {
        //         //     // var resData = {};
        //         //     // resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), err, 0);
        //         //     callBack(false, err)
        //         //     return;
        //         // }
        //         // res.contentType("application/pdf");
        //         // res.send(stream);
        //         // callBack(true, stream)
        //         // let file = fs.createWriteStream('./big.pdf');
        //         console.log('stream:',stream,", err:",err);
        //     } catch (e) {
        //         console.log(e)
        //     }
        // });
    } catch (e) {
        console.log(e)
    }

}

FLPdf.post = function (url, postData,customHeaders) {
    return new Promise(function (resolve, reject) {
        try {
            var post_data = postData;
            var request = require('request');
            let referer = customHeaders.referer;
            if (typeof referer === 'undefined') {
                referer = customHeaders.req_path;
            }
            var options = {
                method: 'post',
                body: post_data, // Javascript object
                json: true, // Use,If you are sending JSON data
                url: url,
                headers: {
                    // Specify headers, If any
                    "Content-Type": customHeaders['content-type'],
                    "lang": customHeaders['lang'],
                    "x-access-token": customHeaders['x-access-token'],
                    "headquarter": customHeaders['headquarter'],
                    "req_path": referer
                }
            }

            request(options, function (err, res, body) {
                if (err) {
                    console.log('Error :', err)
                    reject(err);
                    return
                }
                //console.log(' Body :', body)
                resolve(body);
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
  * convert html to pdf từ url và tiến hành download tới client
  * @param {request} res http request
  * @param {String} url đường dẫn url
  * @param {String} postData data post tới trang
  * @param {String} customHeaders header
  * @param {String} pageSize mặc định là A4, truyền vào A5, A3,...
  * @param {String} orientation in dọc(Portrait) và ngang(Landscape) mặc định là Portrait
  */
FLPdf.toPdfFromUrl = function (res, url, postData,customHeaders,pageSize="A4",orientation="Portrait") {
    return new Promise(async function (resolve, reject) {
        try {
            var wkhtmltopdf = require('wkhtmltopdf');
            // var wkhtmltopdf = require('C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe');
            //nếu là window thì trỏ tới file C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe
            //nếu khác thì trỏ tới folder
            //wkhtmltopdf.command = "";//đường dẫn tới api có sẵn không cần cài khi deploy
            wkhtmltopdf.command = config.server.wkhtmltopdf_command;
            let dateTime = Libs.dateFormat(new Date(),"DD/MM/YYYY HH:mm:ss","utc");
            let options = {
                // marginBottom: 20,
                // javascriptDelay: 2000,
                // encoding: 'UTF-8',
                // footerLine: "",
                footerLeft: dateTime,
                footerRight: "Page: [page] of [topage]",
                footerFontSize: "10",
                footerFontName : "Times New Roman",
                // footerSpacing: 10,
               // debugStdOut:true,
               pageSize: pageSize,
               orientation: orientation
            };
            let data = await FLPdf.post(url, postData,customHeaders);
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*',
                });
            let pdfDoc = wkhtmltopdf(data,options);
            pdfDoc.pipe(res);
             resolve(true);
        } catch (e) {
            console.log(e);
            reject(e);
        }

    });
}
/**
  * convert html to pdf từ htmlString và tiến hành download tới client
  * @param {request} res http request
  * @param {String} htmlString nội dung html cần convert
  * @param {String} pageSize mặc định là A4, truyền vào A5, A3,...
  * @param {String} orientation in dọc(Portrait) và ngang(Landscape) mặc định là Portrait
  */
FLPdf.toPdfFromString = function (res,htmlString,pageSize="A4",orientation="Portrait") {
    return new Promise(async function (resolve, reject) {
        try {
            if(Libs.isBlank(htmlString)) {
                reject(false);
                return;
            }
            var wkhtmltopdf = require('wkhtmltopdf');
            //nếu là window thì trỏ tới file C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe
            //nếu khác thì trỏ tới folder
            //wkhtmltopdf.command = "";//đường dẫn tới api có sẵn không cần cài khi deploy
            wkhtmltopdf.command = config.server.wkhtmltopdf_command;
            let dateTime = Libs.dateFormat(new Date(),"DD/MM/YYYY HH:mm:ss","utc");
            let options = {
                // marginBottom: 20,
                // javascriptDelay: 2000,
                // encoding: 'UTF-8',
                // footerLine: "",
                footerLeft: dateTime,
                footerRight: "Page: [page] of [topage]",
                footerFontSize: "10",
                footerFontName : "Times New Roman",
                // footerSpacing: 10,
               // debugStdOut:true,
               pageSize: pageSize,
               orientation: orientation
            };
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*',
                });
           
            // wkhtmltopdf(htmlString,options).pipe(res);
            let pdfDoc = wkhtmltopdf(htmlString, options);
            pdfDoc.pipe(res);
            resolve(true);

        } catch (e) {
            console.log(e);
            reject(e);
        }

    });
}