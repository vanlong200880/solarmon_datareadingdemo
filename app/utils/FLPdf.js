'use strict';

var fs = require('fs');
var base64 = require('file-base64');
var uuid = require('node-uuid');
var FLPdf = function FLPdf() {};
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
FLPdf.phantom = async function (res, url, postData, customHeaders, callBack) {
    var pageSize = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "A4";
    var orientation = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "Portrait";

    try {
        var rs = await this.toPdfFromUrl(res, url, postData, customHeaders, pageSize, orientation);
        callBack(rs, null);
    } catch (err) {
        callBack(false, err);
    }
};
FLPdf.base64 = function (res, url, filename, callBack) {
    var phantom = require('phantom');
    phantom.create().then(function (ph) {
        ph.createPage().then(function (page) {
            page.open(url).then(function (status) {
                if (Libs.isBlank(filename)) {
                    filename = uuid.v4() + ".pdf";
                }
                var file = config.server.tmp_dir + filename;
                page.render(file).then(function () {
                    try {
                        fs.readFile(file, function (err, data) {
                            if (err) {
                                // var resData = {};
                                // resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), err, 0);
                                callBack(false, err);
                                return;
                            }
                            base64.encode(file, function (err, base64String) {
                                console.log("base64String:", base64String);
                                var rs = Libs.returnJsonResult(true, "", { "pdf": base64String }, 0);
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
                        console.log("Error: ", e);
                    }
                    ph.exit();
                });
            });
        });
    });
};
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
        console.log(e);
    }
};

FLPdf.post = function (url, postData, customHeaders) {
    return new Promise(function (resolve, reject) {
        try {
            var post_data = postData;
            var request = require('request');
            var referer = customHeaders.referer;
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
            };

            request(options, function (err, res, body) {
                if (err) {
                    console.log('Error :', err);
                    reject(err);
                    return;
                }
                //console.log(' Body :', body)
                resolve(body);
            });
        } catch (err) {
            reject(err);
        }
    });
};

/**
  * convert html to pdf từ url và tiến hành download tới client
  * @param {request} res http request
  * @param {String} url đường dẫn url
  * @param {String} postData data post tới trang
  * @param {String} customHeaders header
  * @param {String} pageSize mặc định là A4, truyền vào A5, A3,...
  * @param {String} orientation in dọc(Portrait) và ngang(Landscape) mặc định là Portrait
  */
FLPdf.toPdfFromUrl = function (res, url, postData, customHeaders) {
    var pageSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "A4";
    var orientation = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "Portrait";

    return new Promise(async function (resolve, reject) {
        try {
            var wkhtmltopdf = require('wkhtmltopdf');
            // var wkhtmltopdf = require('C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe');
            //nếu là window thì trỏ tới file C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe
            //nếu khác thì trỏ tới folder
            //wkhtmltopdf.command = "";//đường dẫn tới api có sẵn không cần cài khi deploy
            wkhtmltopdf.command = config.server.wkhtmltopdf_command;
            var dateTime = Libs.dateFormat(new Date(), "DD/MM/YYYY HH:mm:ss", "utc");
            var options = {
                // marginBottom: 20,
                // javascriptDelay: 2000,
                // encoding: 'UTF-8',
                // footerLine: "",
                footerLeft: dateTime,
                footerRight: "Page: [page] of [topage]",
                footerFontSize: "10",
                footerFontName: "Times New Roman",
                // footerSpacing: 10,
                // debugStdOut:true,
                pageSize: pageSize,
                orientation: orientation
            };
            var data = await FLPdf.post(url, postData, customHeaders);
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*'
            });
            var pdfDoc = wkhtmltopdf(data, options);
            pdfDoc.pipe(res);
            resolve(true);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
/**
  * convert html to pdf từ htmlString và tiến hành download tới client
  * @param {request} res http request
  * @param {String} htmlString nội dung html cần convert
  * @param {String} pageSize mặc định là A4, truyền vào A5, A3,...
  * @param {String} orientation in dọc(Portrait) và ngang(Landscape) mặc định là Portrait
  */
FLPdf.toPdfFromString = function (res, htmlString) {
    var pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "A4";
    var orientation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Portrait";

    return new Promise(async function (resolve, reject) {
        try {
            if (Libs.isBlank(htmlString)) {
                reject(false);
                return;
            }
            var wkhtmltopdf = require('wkhtmltopdf');
            //nếu là window thì trỏ tới file C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe
            //nếu khác thì trỏ tới folder
            //wkhtmltopdf.command = "";//đường dẫn tới api có sẵn không cần cài khi deploy
            wkhtmltopdf.command = config.server.wkhtmltopdf_command;
            var dateTime = Libs.dateFormat(new Date(), "DD/MM/YYYY HH:mm:ss", "utc");
            var options = {
                // marginBottom: 20,
                // javascriptDelay: 2000,
                // encoding: 'UTF-8',
                // footerLine: "",
                footerLeft: dateTime,
                footerRight: "Page: [page] of [topage]",
                footerFontSize: "10",
                footerFontName: "Times New Roman",
                // footerSpacing: 10,
                // debugStdOut:true,
                pageSize: pageSize,
                orientation: orientation
            };
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*'
            });

            // wkhtmltopdf(htmlString,options).pipe(res);
            var pdfDoc = wkhtmltopdf(htmlString, options);
            pdfDoc.pipe(res);
            resolve(true);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9GTFBkZi5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJiYXNlNjQiLCJ1dWlkIiwiRkxQZGYiLCJtb2R1bGUiLCJleHBvcnRzIiwicGhhbnRvbSIsInJlcyIsInVybCIsInBvc3REYXRhIiwiY3VzdG9tSGVhZGVycyIsImNhbGxCYWNrIiwicGFnZVNpemUiLCJvcmllbnRhdGlvbiIsInJzIiwidG9QZGZGcm9tVXJsIiwiZXJyIiwiZmlsZW5hbWUiLCJjcmVhdGUiLCJ0aGVuIiwicGgiLCJjcmVhdGVQYWdlIiwicGFnZSIsIm9wZW4iLCJzdGF0dXMiLCJMaWJzIiwiaXNCbGFuayIsInY0IiwiZmlsZSIsImNvbmZpZyIsInNlcnZlciIsInRtcF9kaXIiLCJyZW5kZXIiLCJyZWFkRmlsZSIsImRhdGEiLCJlbmNvZGUiLCJiYXNlNjRTdHJpbmciLCJjb25zb2xlIiwibG9nIiwicmV0dXJuSnNvblJlc3VsdCIsInNlbmQiLCJ1bmxpbmsiLCJlcnJvciIsImUiLCJleGl0Iiwid2todG1sIiwid2todG1sdG9wZGYiLCJvdXRwdXQiLCJwb3N0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwb3N0X2RhdGEiLCJyZXF1ZXN0IiwicmVmZXJlciIsInJlcV9wYXRoIiwib3B0aW9ucyIsIm1ldGhvZCIsImJvZHkiLCJqc29uIiwiaGVhZGVycyIsImNvbW1hbmQiLCJ3a2h0bWx0b3BkZl9jb21tYW5kIiwiZGF0ZVRpbWUiLCJkYXRlRm9ybWF0IiwiRGF0ZSIsImZvb3RlckxlZnQiLCJmb290ZXJSaWdodCIsImZvb3RlckZvbnRTaXplIiwiZm9vdGVyRm9udE5hbWUiLCJ3cml0ZUhlYWQiLCJwZGZEb2MiLCJwaXBlIiwidG9QZGZGcm9tU3RyaW5nIiwiaHRtbFN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxLQUFLQyxRQUFRLElBQVIsQ0FBVDtBQUNBLElBQUlDLFNBQVNELFFBQVEsYUFBUixDQUFiO0FBQ0EsSUFB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QSxnQkFBSUMsV0FBV3RDLEtBQUt1QyxVQUFMLENBQWdCLElBQUlDLElBQUosRUFBaEIsRUFBMkIscUJBQTNCLEVBQWlELEtBQWpELENBQWY7QUFDQSxnQkFBSVQsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0FVLDRCQUFZSCxRQUxGO0FBTVZJLDZCQUFhLDBCQU5IO0FBT1ZDLGdDQUFnQixJQVBOO0FBUVZDLGdDQUFpQixpQkFSUDtBQVNWO0FBQ0Q7QUFDQXpELDBCQUFVQSxRQVhDO0FBWVhDLDZCQUFhQTtBQVpGLGFBQWQ7QUFjQU4sZ0JBQUkrRCxTQUFKLENBQWMsR0FBZCxFQUFtQjtBQUNmLGdDQUFnQixpQkFERDtBQUVmLCtDQUErQjtBQUZoQixhQUFuQjs7QUFLQTtBQUNBLGdCQUFJQyxTQUFTekIsWUFBWTRCLFVBQVosRUFBd0JsQixPQUF4QixDQUFiO0FBQ0FlLG1CQUFPQyxJQUFQLENBQVlqRSxHQUFaO0FBQ0EyQyxvQkFBUSxJQUFSO0FBRUgsU0FuQ0QsQ0FtQ0UsT0FBT1AsQ0FBUCxFQUFVO0FBQ1JOLG9CQUFRQyxHQUFSLENBQVlLLENBQVo7QUFDQVEsbUJBQU9SLENBQVA7QUFDSDtBQUVKLEtBekNNLENBQVA7QUEwQ0gsQ0EzQ0QiLCJmaWxlIjoiRkxQZGYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2ZpbGUtYmFzZTY0Jyk7XG52YXIgdXVpZCA9IHJlcXVpcmUoJ25vZGUtdXVpZCcpO1xudmFyIEZMUGRmID0gZnVuY3Rpb24gKCkgeyB9O1xubW9kdWxlLmV4cG9ydHMgPSBGTFBkZjtcbi8vIEZMUGRmLnBoYW50b20gPSBmdW5jdGlvbiAocmVzLCB1cmwsIHBvc3REYXRhLCBjdXN0b21IZWFkZXJzLCBjYWxsQmFjaykge1xuLy8gICAgIHZhciBwaGFudG9tID0gcmVxdWlyZSgncGhhbnRvbScpXG4vLyAgICAgY3VzdG9tSGVhZGVycy5BY2NlcHQgPSBcImFwcGxpY2F0aW9uL3BkZlwiO1xuLy8gICAgIGRlbGV0ZSBjdXN0b21IZWFkZXJzWydjb250ZW50LXR5cGUnXTtcbi8vICAgICBsZXQgcmVmZXJlciA9IGN1c3RvbUhlYWRlcnMucmVmZXJlcjtcbi8vICAgICBpZiAodHlwZW9mIHJlZmVyZXIgPT09ICd1bmRlZmluZWQnKSB7XG4vLyAgICAgICAgIHJlZmVyZXIgPSBjdXN0b21IZWFkZXJzLnJlcV9wYXRoO1xuLy8gICAgIH1cbi8vICAgICBsZXQgc2V0dGluZ3MgPSB7XG4vLyAgICAgICAgIG9wZXJhdGlvbjogXCJQT1NUXCIsXG4vLyAgICAgICAgIGVuY29kaW5nOiBcInV0ZjhcIixcbi8vICAgICAgICAgaGVhZGVyczoge1xuLy8gICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogY3VzdG9tSGVhZGVyc1snY29udGVudC10eXBlJ10sXG4vLyAgICAgICAgICAgICBcImxhbmdcIjogY3VzdG9tSGVhZGVyc1snbGFuZyddLFxuLy8gICAgICAgICAgICAgXCJ4LWFjY2Vzcy10b2tlblwiOiBjdXN0b21IZWFkZXJzWyd4LWFjY2Vzcy10b2tlbiddLFxuLy8gICAgICAgICAgICAgXCJoZWFkcXVhcnRlclwiOiBjdXN0b21IZWFkZXJzWydoZWFkcXVhcnRlciddLFxuLy8gICAgICAgICAgICAgXCJyZXFfcGF0aFwiOiByZWZlcmVyXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKVxuLy8gICAgIH07XG4vLyAgICAgcGhhbnRvbS5jcmVhdGUoKS50aGVuKGZ1bmN0aW9uIChwaCkge1xuLy8gICAgICAgICBwaC5jcmVhdGVQYWdlKCkudGhlbihmdW5jdGlvbiAocGFnZSkge1xuLy8gICAgICAgICAgICAgcGFnZS5vcGVuKHVybCwgc2V0dGluZ3MpLnRoZW4oZnVuY3Rpb24gKHN0YXR1cykge1xuLy8gICAgICAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IHBvc3REYXRhLmZpbGVuYW1lO1xuLy8gICAgICAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsocG9zdERhdGEuZmlsZW5hbWUpKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gdXVpZC52NCgpICsgXCIucGRmXCI7XG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgIGxldCBmaWxlID0gY29uZmlnLnNlcnZlci50bXBfZGlyICsgZmlsZW5hbWU7XG4vLyAgICAgICAgICAgICAgICAgcGFnZS5yZW5kZXIoZmlsZSwgeyBmb3JtYXQ6IFwicGRmXCIgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBmcy5yZWFkRmlsZShmaWxlLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsQmFjayhmYWxzZSwgZXJyKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5jb250ZW50VHlwZShcImFwcGxpY2F0aW9uL3BkZlwiKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChkYXRhKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlLmNsb3NlKCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGguZXhpdCgpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8veG9hIGZpbGUga2hpIHJlYWQgeG9uZ1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLnVubGluayhmaWxlLCBmdW5jdGlvbiAoZXJyb3IpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRGVsZXRlICcgKyBmaWxlICsgJyEhJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbi8vICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH0pO1xuLy8gICAgIH0pO1xuLy8gfVxuRkxQZGYucGhhbnRvbSA9IGFzeW5jIGZ1bmN0aW9uIChyZXMsIHVybCwgcG9zdERhdGEsIGN1c3RvbUhlYWRlcnMsIGNhbGxCYWNrLCBwYWdlU2l6ZSA9IFwiQTRcIiwgb3JpZW50YXRpb24gPSBcIlBvcnRyYWl0XCIpIHtcbiAgICB0cnl7XG4gICAgICAgIGxldCBycyA9IGF3YWl0IHRoaXMudG9QZGZGcm9tVXJsKHJlcywgdXJsLCBwb3N0RGF0YSwgY3VzdG9tSGVhZGVycywgcGFnZVNpemUsIG9yaWVudGF0aW9uKTtcbiAgICAgICAgY2FsbEJhY2socnMsbnVsbCk7XG4gICAgfWNhdGNoKGVycil7XG4gICAgICAgIGNhbGxCYWNrKGZhbHNlLGVycik7XG4gICAgfVxufVxuRkxQZGYuYmFzZTY0ID0gZnVuY3Rpb24gKHJlcywgdXJsLCBmaWxlbmFtZSwgY2FsbEJhY2spIHtcbiAgICB2YXIgcGhhbnRvbSA9IHJlcXVpcmUoJ3BoYW50b20nKVxuICAgIHBoYW50b20uY3JlYXRlKCkudGhlbihmdW5jdGlvbiAocGgpIHtcbiAgICAgICAgcGguY3JlYXRlUGFnZSgpLnRoZW4oZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgICAgIHBhZ2Uub3Blbih1cmwpLnRoZW4oZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoZmlsZW5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gdXVpZC52NCgpICsgXCIucGRmXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBmaWxlID0gY29uZmlnLnNlcnZlci50bXBfZGlyICsgZmlsZW5hbWU7XG4gICAgICAgICAgICAgICAgcGFnZS5yZW5kZXIoZmlsZSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5yZWFkRmlsZShmaWxlLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIGVyciwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxCYWNrKGZhbHNlLCBlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZTY0LmVuY29kZShmaWxlLCBmdW5jdGlvbiAoZXJyLCBiYXNlNjRTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJiYXNlNjRTdHJpbmc6XCIsIGJhc2U2NFN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBycyA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBcIlwiLCB7IFwicGRmXCI6IGJhc2U2NFN0cmluZyB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3hvYSBmaWxlIGtoaSByZWFkIHhvbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMudW5saW5rKGZpbGUsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRGVsZXRlICcgKyBmaWxlICsgJyEhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbEJhY2sodHJ1ZSwgZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiwgZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwaC5leGl0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5GTFBkZi53a2h0bWwgPSBmdW5jdGlvbiAocmVzLCB1cmwsIGZpbGVuYW1lLCBjYWxsQmFjaykge1xuICAgIHRyeSB7XG4gICAgICAgIHZhciB3a2h0bWx0b3BkZiA9IHJlcXVpcmUoJ3draHRtbHRvcGRmJyk7XG4gICAgICAgIHdraHRtbHRvcGRmKCdodHRwOi8vYXBwbGUuY29tLycsIHsgb3V0cHV0OiAnb3V0LnBkZicgfSk7XG4gICAgICAgIC8vIHdraHRtbHRvcGRmKCdodHRwOi8vZ29vZ2xlLmNvbS8nLCB7IHBhZ2VTaXplOiAnbGV0dGVyJyB9KVxuICAgICAgICAvLyAucGlwZShmcy5jcmVhdGVXcml0ZVN0cmVhbSgnYW91dC5wZGYnKSk7XG4gICAgICAgIC8vIE9wdGlvbmFsIGNhbGxiYWNrXG4gICAgICAgIC8vIHdraHRtbHRvcGRmKHVybCwgeyBvdXRwdXQ6ICd0bXAvb3V0LnBkZicgfSwgZnVuY3Rpb24gKGVyciwgc3RyZWFtKSB7XG4gICAgICAgIC8vICAgICB0cnkge1xuICAgICAgICAvLyAgICAgICAgIC8vIGRvIHdoYXRldmVyIHdpdGggdGhlIHN0cmVhbVxuICAgICAgICAvLyAgICAgICAgIC8vIGlmIChlcnIpIHtcbiAgICAgICAgLy8gICAgICAgICAvLyAgICAgLy8gdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgLy8gICAgICAgICAvLyAgICAgLy8gcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCBlcnIsIDApO1xuICAgICAgICAvLyAgICAgICAgIC8vICAgICBjYWxsQmFjayhmYWxzZSwgZXJyKVxuICAgICAgICAvLyAgICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vICAgICAgICAgLy8gfVxuICAgICAgICAvLyAgICAgICAgIC8vIHJlcy5jb250ZW50VHlwZShcImFwcGxpY2F0aW9uL3BkZlwiKTtcbiAgICAgICAgLy8gICAgICAgICAvLyByZXMuc2VuZChzdHJlYW0pO1xuICAgICAgICAvLyAgICAgICAgIC8vIGNhbGxCYWNrKHRydWUsIHN0cmVhbSlcbiAgICAgICAgLy8gICAgICAgICAvLyBsZXQgZmlsZSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKCcuL2JpZy5wZGYnKTtcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnc3RyZWFtOicsc3RyZWFtLFwiLCBlcnI6XCIsZXJyKTtcbiAgICAgICAgLy8gICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuXG59XG5cbkZMUGRmLnBvc3QgPSBmdW5jdGlvbiAodXJsLCBwb3N0RGF0YSxjdXN0b21IZWFkZXJzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBwb3N0X2RhdGEgPSBwb3N0RGF0YTtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xuICAgICAgICAgICAgbGV0IHJlZmVyZXIgPSBjdXN0b21IZWFkZXJzLnJlZmVyZXI7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlZmVyZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlciA9IGN1c3RvbUhlYWRlcnMucmVxX3BhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICBib2R5OiBwb3N0X2RhdGEsIC8vIEphdmFzY3JpcHQgb2JqZWN0XG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZSwgLy8gVXNlLElmIHlvdSBhcmUgc2VuZGluZyBKU09OIGRhdGFcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNwZWNpZnkgaGVhZGVycywgSWYgYW55XG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IGN1c3RvbUhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLFxuICAgICAgICAgICAgICAgICAgICBcImxhbmdcIjogY3VzdG9tSGVhZGVyc1snbGFuZyddLFxuICAgICAgICAgICAgICAgICAgICBcIngtYWNjZXNzLXRva2VuXCI6IGN1c3RvbUhlYWRlcnNbJ3gtYWNjZXNzLXRva2VuJ10sXG4gICAgICAgICAgICAgICAgICAgIFwiaGVhZHF1YXJ0ZXJcIjogY3VzdG9tSGVhZGVyc1snaGVhZHF1YXJ0ZXInXSxcbiAgICAgICAgICAgICAgICAgICAgXCJyZXFfcGF0aFwiOiByZWZlcmVyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXF1ZXN0KG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIHJlcywgYm9keSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIDonLCBlcnIpXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnIEJvZHkgOicsIGJvZHkpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShib2R5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICAqIGNvbnZlcnQgaHRtbCB0byBwZGYgdOG7qyB1cmwgdsOgIHRp4bq/biBow6BuaCBkb3dubG9hZCB04bubaSBjbGllbnRcbiAgKiBAcGFyYW0ge3JlcXVlc3R9IHJlcyBodHRwIHJlcXVlc3RcbiAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIMSRxrDhu51uZyBk4bqrbiB1cmxcbiAgKiBAcGFyYW0ge1N0cmluZ30gcG9zdERhdGEgZGF0YSBwb3N0IHThu5tpIHRyYW5nXG4gICogQHBhcmFtIHtTdHJpbmd9IGN1c3RvbUhlYWRlcnMgaGVhZGVyXG4gICogQHBhcmFtIHtTdHJpbmd9IHBhZ2VTaXplIG3hurdjIMSR4buLbmggbMOgIEE0LCB0cnV54buBbiB2w6BvIEE1LCBBMywuLi5cbiAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZW50YXRpb24gaW4gZOG7jWMoUG9ydHJhaXQpIHbDoCBuZ2FuZyhMYW5kc2NhcGUpIG3hurdjIMSR4buLbmggbMOgIFBvcnRyYWl0XG4gICovXG5GTFBkZi50b1BkZkZyb21VcmwgPSBmdW5jdGlvbiAocmVzLCB1cmwsIHBvc3REYXRhLGN1c3RvbUhlYWRlcnMscGFnZVNpemU9XCJBNFwiLG9yaWVudGF0aW9uPVwiUG9ydHJhaXRcIikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgd2todG1sdG9wZGYgPSByZXF1aXJlKCd3a2h0bWx0b3BkZicpO1xuICAgICAgICAgICAgLy8gdmFyIHdraHRtbHRvcGRmID0gcmVxdWlyZSgnQzpcXFxcUHJvZ3JhbSBGaWxlc1xcXFx3a2h0bWx0b3BkZlxcXFxiaW5cXFxcd2todG1sdG9wZGYuZXhlJyk7XG4gICAgICAgICAgICAvL27hur91IGzDoCB3aW5kb3cgdGjDrCB0cuG7jyB04bubaSBmaWxlIEM6XFxcXFByb2dyYW0gRmlsZXNcXFxcd2todG1sdG9wZGZcXFxcYmluXFxcXHdraHRtbHRvcGRmLmV4ZVxuICAgICAgICAgICAgLy9u4bq/dSBraMOhYyB0aMOsIHRy4buPIHThu5tpIGZvbGRlclxuICAgICAgICAgICAgLy93a2h0bWx0b3BkZi5jb21tYW5kID0gXCJcIjsvL8SRxrDhu51uZyBk4bqrbiB04bubaSBhcGkgY8OzIHPhurVuIGtow7RuZyBj4bqnbiBjw6BpIGtoaSBkZXBsb3lcbiAgICAgICAgICAgIHdraHRtbHRvcGRmLmNvbW1hbmQgPSBjb25maWcuc2VydmVyLndraHRtbHRvcGRmX2NvbW1hbmQ7XG4gICAgICAgICAgICBsZXQgZGF0ZVRpbWUgPSBMaWJzLmRhdGVGb3JtYXQobmV3IERhdGUoKSxcIkREL01NL1lZWVkgSEg6bW06c3NcIixcInV0Y1wiKTtcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vIG1hcmdpbkJvdHRvbTogMjAsXG4gICAgICAgICAgICAgICAgLy8gamF2YXNjcmlwdERlbGF5OiAyMDAwLFxuICAgICAgICAgICAgICAgIC8vIGVuY29kaW5nOiAnVVRGLTgnLFxuICAgICAgICAgICAgICAgIC8vIGZvb3RlckxpbmU6IFwiXCIsXG4gICAgICAgICAgICAgICAgZm9vdGVyTGVmdDogZGF0ZVRpbWUsXG4gICAgICAgICAgICAgICAgZm9vdGVyUmlnaHQ6IFwiUGFnZTogW3BhZ2VdIG9mIFt0b3BhZ2VdXCIsXG4gICAgICAgICAgICAgICAgZm9vdGVyRm9udFNpemU6IFwiMTBcIixcbiAgICAgICAgICAgICAgICBmb290ZXJGb250TmFtZSA6IFwiVGltZXMgTmV3IFJvbWFuXCIsXG4gICAgICAgICAgICAgICAgLy8gZm9vdGVyU3BhY2luZzogMTAsXG4gICAgICAgICAgICAgICAvLyBkZWJ1Z1N0ZE91dDp0cnVlLFxuICAgICAgICAgICAgICAgcGFnZVNpemU6IHBhZ2VTaXplLFxuICAgICAgICAgICAgICAgb3JpZW50YXRpb246IG9yaWVudGF0aW9uXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCBGTFBkZi5wb3N0KHVybCwgcG9zdERhdGEsY3VzdG9tSGVhZGVycyk7XG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vcGRmJyxcbiAgICAgICAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGV0IHBkZkRvYyA9IHdraHRtbHRvcGRmKGRhdGEsb3B0aW9ucyk7XG4gICAgICAgICAgICBwZGZEb2MucGlwZShyZXMpO1xuICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG5cbiAgICB9KTtcbn1cbi8qKlxuICAqIGNvbnZlcnQgaHRtbCB0byBwZGYgdOG7qyBodG1sU3RyaW5nIHbDoCB0aeG6v24gaMOgbmggZG93bmxvYWQgdOG7m2kgY2xpZW50XG4gICogQHBhcmFtIHtyZXF1ZXN0fSByZXMgaHR0cCByZXF1ZXN0XG4gICogQHBhcmFtIHtTdHJpbmd9IGh0bWxTdHJpbmcgbuG7mWkgZHVuZyBodG1sIGPhuqduIGNvbnZlcnRcbiAgKiBAcGFyYW0ge1N0cmluZ30gcGFnZVNpemUgbeG6t2MgxJHhu4tuaCBsw6AgQTQsIHRydXnhu4FuIHbDoG8gQTUsIEEzLC4uLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBvcmllbnRhdGlvbiBpbiBk4buNYyhQb3J0cmFpdCkgdsOgIG5nYW5nKExhbmRzY2FwZSkgbeG6t2MgxJHhu4tuaCBsw6AgUG9ydHJhaXRcbiAgKi9cbkZMUGRmLnRvUGRmRnJvbVN0cmluZyA9IGZ1bmN0aW9uIChyZXMsaHRtbFN0cmluZyxwYWdlU2l6ZT1cIkE0XCIsb3JpZW50YXRpb249XCJQb3J0cmFpdFwiKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmKExpYnMuaXNCbGFuayhodG1sU3RyaW5nKSkge1xuICAgICAgICAgICAgICAgIHJlamVjdChmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHdraHRtbHRvcGRmID0gcmVxdWlyZSgnd2todG1sdG9wZGYnKTtcbiAgICAgICAgICAgIC8vbuG6v3UgbMOgIHdpbmRvdyB0aMOsIHRy4buPIHThu5tpIGZpbGUgQzpcXFxcUHJvZ3JhbSBGaWxlc1xcXFx3a2h0bWx0b3BkZlxcXFxiaW5cXFxcd2todG1sdG9wZGYuZXhlXG4gICAgICAgICAgICAvL27hur91IGtow6FjIHRow6wgdHLhu48gdOG7m2kgZm9sZGVyXG4gICAgICAgICAgICAvL3draHRtbHRvcGRmLmNvbW1hbmQgPSBcIlwiOy8vxJHGsOG7nW5nIGThuqtuIHThu5tpIGFwaSBjw7Mgc+G6tW4ga2jDtG5nIGPhuqduIGPDoGkga2hpIGRlcGxveVxuICAgICAgICAgICAgd2todG1sdG9wZGYuY29tbWFuZCA9IGNvbmZpZy5zZXJ2ZXIud2todG1sdG9wZGZfY29tbWFuZDtcbiAgICAgICAgICAgIGxldCBkYXRlVGltZSA9IExpYnMuZGF0ZUZvcm1hdChuZXcgRGF0ZSgpLFwiREQvTU0vWVlZWSBISDptbTpzc1wiLFwidXRjXCIpO1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgLy8gbWFyZ2luQm90dG9tOiAyMCxcbiAgICAgICAgICAgICAgICAvLyBqYXZhc2NyaXB0RGVsYXk6IDIwMDAsXG4gICAgICAgICAgICAgICAgLy8gZW5jb2Rpbmc6ICdVVEYtOCcsXG4gICAgICAgICAgICAgICAgLy8gZm9vdGVyTGluZTogXCJcIixcbiAgICAgICAgICAgICAgICBmb290ZXJMZWZ0OiBkYXRlVGltZSxcbiAgICAgICAgICAgICAgICBmb290ZXJSaWdodDogXCJQYWdlOiBbcGFnZV0gb2YgW3RvcGFnZV1cIixcbiAgICAgICAgICAgICAgICBmb290ZXJGb250U2l6ZTogXCIxMFwiLFxuICAgICAgICAgICAgICAgIGZvb3RlckZvbnROYW1lIDogXCJUaW1lcyBOZXcgUm9tYW5cIixcbiAgICAgICAgICAgICAgICAvLyBmb290ZXJTcGFjaW5nOiAxMCxcbiAgICAgICAgICAgICAgIC8vIGRlYnVnU3RkT3V0OnRydWUsXG4gICAgICAgICAgICAgICBwYWdlU2l6ZTogcGFnZVNpemUsXG4gICAgICAgICAgICAgICBvcmllbnRhdGlvbjogb3JpZW50YXRpb25cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vcGRmJyxcbiAgICAgICAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHdraHRtbHRvcGRmKGh0bWxTdHJpbmcsb3B0aW9ucykucGlwZShyZXMpO1xuICAgICAgICAgICAgbGV0IHBkZkRvYyA9IHdraHRtbHRvcGRmKGh0bWxTdHJpbmcsIG9wdGlvbnMpO1xuICAgICAgICAgICAgcGRmRG9jLnBpcGUocmVzKTtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cblxuICAgIH0pO1xufSJdfQ==