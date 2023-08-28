"use strict";

var _Libs = require("./Libs");

var _Libs2 = _interopRequireDefault(_Libs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import qs from 'qs';
// import axios from 'axios';
// "use strict";
var nodemailer = require('nodemailer'); // import Constants from "./Constants";


var SentMail = function SentMail() {};
module.exports = SentMail;
/**
 * sent mail 
 * @param plaintext 
 * @return string
 */

SentMail.SentMailHTML = function (from, to, subject, contentHtml) {
    if (_Libs2.default.isBlank(from)) {
        from = config.server.fromEmailConfig;
    };
    if (!_Libs2.default.isBlank(to)) {
        to = to;
    } else {
        to = config.server.toEmailConfig;
    };
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: config.server.smtpConfig.host,
        port: config.server.smtpConfig.port,
        secure: config.server.smtpConfig.secureConnection, // true for 465, false for other ports
        auth: {
            user: config.server.smtpConfig.auth.user,
            pass: config.server.smtpConfig.auth.pass
        }
    });

    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: contentHtml
    };

    return transporter.sendMail(mailOptions).then(function (info) {
        // console.log('infoL: ', info);
        // console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9TZW50TWFpbC5qcyJdLCJuYW1lcyI6WyJub2RlbWFpbGVyIiwicmVxdWlyZSIsIlNlbnRNYWlsIiwibW9kdWxlIiwiZXhwb3J0cyIsIlNlbnRNYWlsSFRNTCIsImZyb20iLCJ0byIsInN1YmplY3QiLCJjb250ZW50SHRtbCIsIkxpYnMiLCJpc0JsYW5rIiwiY29uZmlnIiwic2VydmVyIiwiZnJvbUVtYWlsQ29uZmlnIiwidG9FbWFpbENvbmZpZyIsInRyYW5zcG9ydGVyIiwiY3JlYXRlVHJhbnNwb3J0IiwiaG9zdCIsInNtdHBDb25maWciLCJwb3J0Iiwic2VjdXJlIiwic2VjdXJlQ29ubmVjdGlvbiIsImF1dGgiLCJ1c2VyIiwicGFzcyIsIm1haWxPcHRpb25zIiwiaHRtbCIsInNlbmRNYWlsIiwidGhlbiJdLCJtYXBwaW5ncyI6Ijs7QUFDQTs7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSUEsYUFBYUMsUUFBUSxZQUFSLENBQWpCLEMsQ0FMQTs7O0FBUUEsSUFBSUMsV0FBVyxTQUFYQSxRQUFXLEdBQVksQ0FDMUIsQ0FERDtBQUVBQyxPQUFPQyxPQUFQLEdBQWlCRixRQUFqQjtBQUNBOzs7Ozs7QUFNQUEsU0FBU0csWUFBVCxHQUF3QixVQUFVQyxJQUFWLEVBQWdCQyxFQUFoQixFQUFvQkMsT0FBcEIsRUFBNkJDLFdBQTdCLEVBQTBDO0FBQzlELFFBQUlDLGVBQUtDLE9BQUwsQ0FBYUwsSUFBYixDQUFKLEVBQXdCO0FBQUVBLGVBQU9NLE9BQU9DLE1BQVAsQ0FBY0MsZUFBckI7QUFBc0M7QUFDaEUsUUFBSSxDQUFDSixlQUFLQyxPQUFMLENBQWFKLEVBQWIsQ0FBTCxFQUF1QjtBQUNuQkEsYUFBS0EsRUFBTDtBQUNILEtBRkQsTUFFTztBQUNIQSxhQUFLSyxPQUFPQyxNQUFQLENBQWNFLGFBQW5CO0FBQ0g7QUFDRDtBQUNBLFFBQUlDLGNBQWNoQixXQUFXaUIsZUFBWCxDQUEyQjtBQUN6Q0MsY0FBTU4sT0FBT0MsTUFBUCxDQUFjTSxVQUFkLENBQXlCRCxJQURVO0FBRXpDRSxjQUFNUixPQUFPQyxNQUFQLENBQWNNLFVBQWQsQ0FBeUJDLElBRlU7QUFHekNDLGdCQUFRVCxPQUFPQyxNQUFQLENBQWNNLFVBQWQsQ0FBeUJHLGdCQUhRLEVBR1U7QUFDbkRDLGNBQU07QUFDRkMsa0JBQU1aLE9BQU9DLE1BQVAsQ0FBY00sVUFBZCxDQUF5QkksSUFBekIsQ0FBOEJDLElBRGxDO0FBRUZDLGtCQUFNYixPQUFPQyxNQUFQLENBQWNNLFVBQWQsQ0FBeUJJLElBQXpCLENBQThCRTtBQUZsQztBQUptQyxLQUEzQixDQUFsQjs7QUFVQSxRQUFJQyxjQUFjO0FBQ2RwQixjQUFNQSxJQURRO0FBRWRDLFlBQUlBLEVBRlU7QUFHZEMsaUJBQVNBLE9BSEs7QUFJZG1CLGNBQU1sQjtBQUpRLEtBQWxCOztBQU9BLFdBQU9PLFlBQVlZLFFBQVosQ0FBcUJGLFdBQXJCLEVBQWtDRyxJQUFsQyxDQUF1QyxnQkFBUTtBQUNsRDtBQUNBO0FBQ0gsS0FITSxDQUFQO0FBSUgsQ0E3QkQiLCJmaWxlIjoiU2VudE1haWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgQ29uc3RhbnRzIGZyb20gXCIuL0NvbnN0YW50c1wiO1xuaW1wb3J0IExpYnMgZnJvbSBcIi4vTGlic1wiO1xuLy8gaW1wb3J0IHFzIGZyb20gJ3FzJztcbi8vIGltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG4vLyBcInVzZSBzdHJpY3RcIjtcbnZhciBub2RlbWFpbGVyID0gcmVxdWlyZSgnbm9kZW1haWxlcicpO1xuXG5cbnZhciBTZW50TWFpbCA9IGZ1bmN0aW9uICgpIHtcbn1cbm1vZHVsZS5leHBvcnRzID0gU2VudE1haWw7XG4vKipcbiAqIHNlbnQgbWFpbCBcbiAqIEBwYXJhbSBwbGFpbnRleHQgXG4gKiBAcmV0dXJuIHN0cmluZ1xuICovXG4gXG5TZW50TWFpbC5TZW50TWFpbEhUTUwgPSBmdW5jdGlvbiAoZnJvbSwgdG8sIHN1YmplY3QsIGNvbnRlbnRIdG1sKSB7XG4gICAgaWYgKExpYnMuaXNCbGFuayhmcm9tKSkgeyBmcm9tID0gY29uZmlnLnNlcnZlci5mcm9tRW1haWxDb25maWcgfTtcbiAgICBpZiAoIUxpYnMuaXNCbGFuayh0bykpIHsgXG4gICAgICAgIHRvID0gdG87XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdG8gPSBjb25maWcuc2VydmVyLnRvRW1haWxDb25maWc7XG4gICAgfTtcbiAgICAvLyBjcmVhdGUgcmV1c2FibGUgdHJhbnNwb3J0ZXIgb2JqZWN0IHVzaW5nIHRoZSBkZWZhdWx0IFNNVFAgdHJhbnNwb3J0XG4gICAgbGV0IHRyYW5zcG9ydGVyID0gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQoe1xuICAgICAgICBob3N0OiBjb25maWcuc2VydmVyLnNtdHBDb25maWcuaG9zdCxcbiAgICAgICAgcG9ydDogY29uZmlnLnNlcnZlci5zbXRwQ29uZmlnLnBvcnQsXG4gICAgICAgIHNlY3VyZTogY29uZmlnLnNlcnZlci5zbXRwQ29uZmlnLnNlY3VyZUNvbm5lY3Rpb24sIC8vIHRydWUgZm9yIDQ2NSwgZmFsc2UgZm9yIG90aGVyIHBvcnRzXG4gICAgICAgIGF1dGg6IHtcbiAgICAgICAgICAgIHVzZXI6IGNvbmZpZy5zZXJ2ZXIuc210cENvbmZpZy5hdXRoLnVzZXIsXG4gICAgICAgICAgICBwYXNzOiBjb25maWcuc2VydmVyLnNtdHBDb25maWcuYXV0aC5wYXNzXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBtYWlsT3B0aW9ucyA9IHtcbiAgICAgICAgZnJvbTogZnJvbSxcbiAgICAgICAgdG86IHRvLFxuICAgICAgICBzdWJqZWN0OiBzdWJqZWN0LFxuICAgICAgICBodG1sOiBjb250ZW50SHRtbFxuICAgIH07XG5cbiAgICByZXR1cm4gdHJhbnNwb3J0ZXIuc2VuZE1haWwobWFpbE9wdGlvbnMpLnRoZW4oaW5mbyA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmZvTDogJywgaW5mbyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdQcmV2aWV3IFVSTDogJyArIG5vZGVtYWlsZXIuZ2V0VGVzdE1lc3NhZ2VVcmwoaW5mbykpO1xuICAgIH0pO1xufVxuXG5cbiJdfQ==