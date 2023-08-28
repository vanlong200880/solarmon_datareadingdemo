var CronJob = require('cron').CronJob;
import JobClearLog from './JobClearLog';

export default class Jobs {
    start() {
        new CronJob('* * * */10 * *', function () {
            let job = new JobClearLog();
            job.clearLogByType("log_request");
        }, null, true, '');
        new CronJob('* * * */10 * *', function () {
            let job = new JobClearLog();
            job.clearLogByType("log_login");
        }, null, true, '');
        new CronJob('* * * */5 * *', function () {
            let job = new JobClearLog();
            job.clearLog();
        }, null, true, '');
    }
}