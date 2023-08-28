'use strict';

var urllib = require('url');
var sax = require('sax');
var request = require('miniget');
var qs = require('querystring');

var VIDEO_URL = 'https://www.youtube.com/watch?v=';
var FORMATS = { 5: { container: "flv", resolution: "240p", encoding: "Sorenson H.283", profile: null, bitrate: "0.25", audioEncoding: "mp3", audioBitrate: 64 }, 6: { container: "flv", resolution: "270p", encoding: "Sorenson H.263", profile: null, bitrate: "0.8", audioEncoding: "mp3", audioBitrate: 64 }, 13: { container: "3gp", resolution: null, encoding: "MPEG-4 Visual", profile: null, bitrate: "0.5", audioEncoding: "aac", audioBitrate: null }, 17: { container: "3gp", resolution: "144p", encoding: "MPEG-4 Visual", profile: "simple", bitrate: "0.05", audioEncoding: "aac", audioBitrate: 24 }, 18: { container: "mp4", resolution: "360p", encoding: "H.264", profile: "baseline", bitrate: "0.5", audioEncoding: "aac", audioBitrate: 96 }, 22: { container: "mp4", resolution: "720p", encoding: "H.264", profile: "high", bitrate: "2-3", audioEncoding: "aac", audioBitrate: 192 }, 34: { container: "flv", resolution: "360p", encoding: "H.264", profile: "main", bitrate: "0.5", audioEncoding: "aac", audioBitrate: 128 }, 35: { container: "flv", resolution: "480p", encoding: "H.264", profile: "main", bitrate: "0.8-1", audioEncoding: "aac", audioBitrate: 128 }, 36: { container: "3gp", resolution: "240p", encoding: "MPEG-4 Visual", profile: "simple", bitrate: "0.175", audioEncoding: "aac", audioBitrate: 32 }, 37: { container: "mp4", resolution: "1080p", encoding: "H.264", profile: "high", bitrate: "3-5.9", audioEncoding: "aac", audioBitrate: 192 }, 38: { container: "mp4", resolution: "3072p", encoding: "H.264", profile: "high", bitrate: "3.5-5", audioEncoding: "aac", audioBitrate: 192 }, 43: { container: "webm", resolution: "360p", encoding: "VP8", profile: null, bitrate: "0.5-0.75", audioEncoding: "vorbis", audioBitrate: 128 }, 44: { container: "webm", resolution: "480p", encoding: "VP8", profile: null, bitrate: "1", audioEncoding: "vorbis", audioBitrate: 128 }, 45: { container: "webm", resolution: "720p", encoding: "VP8", profile: null, bitrate: "2", audioEncoding: "vorbis", audioBitrate: 192 }, 46: { container: "webm", resolution: "1080p", encoding: "vp8", profile: null, bitrate: null, audioEncoding: "vorbis", audioBitrate: 192 }, 82: { container: "mp4", resolution: "360p", encoding: "H.264", profile: "3d", bitrate: "0.5", audioEncoding: "aac", audioBitrate: 96 }, 83: { container: "mp4", resolution: "240p", encoding: "H.264", profile: "3d", bitrate: "0.5", audioEncoding: "aac", audioBitrate: 96 }, 84: { container: "mp4", resolution: "720p", encoding: "H.264", profile: "3d", bitrate: "2-3", audioEncoding: "aac", audioBitrate: 192 }, 85: { container: "mp4", resolution: "1080p", encoding: "H.264", profile: "3d", bitrate: "3-4", audioEncoding: "aac", audioBitrate: 192 }, 100: { container: "webm", resolution: "360p", encoding: "VP8", profile: "3d", bitrate: null, audioEncoding: "vorbis", audioBitrate: 128 }, 101: { container: "webm", resolution: "360p", encoding: "VP8", profile: "3d", bitrate: null, audioEncoding: "vorbis", audioBitrate: 192 }, 102: { container: "webm", resolution: "720p", encoding: "VP8", profile: "3d", bitrate: null, audioEncoding: "vorbis", audioBitrate: 192 }, 133: { container: "mp4", resolution: "240p", encoding: "H.264", profile: "main", bitrate: "0.2-0.3", audioEncoding: null, audioBitrate: null }, 134: { container: "mp4", resolution: "360p", encoding: "H.264", profile: "main", bitrate: "0.3-0.4", audioEncoding: null, audioBitrate: null }, 135: { container: "mp4", resolution: "480p", encoding: "H.264", profile: "main", bitrate: "0.5-1", audioEncoding: null, audioBitrate: null }, 136: { container: "mp4", resolution: "720p", encoding: "H.264", profile: "main", bitrate: "1-1.5", audioEncoding: null, audioBitrate: null }, 137: { container: "mp4", resolution: "1080p", encoding: "H.264", profile: "high", bitrate: "2.5-3", audioEncoding: null, audioBitrate: null }, 138: { container: "mp4", resolution: "4320p", encoding: "H.264", profile: "high", bitrate: "13.5-25", audioEncoding: null, audioBitrate: null }, 160: { container: "mp4", resolution: "144p", encoding: "H.264", profile: "main", bitrate: "0.1", audioEncoding: null, audioBitrate: null }, 242: { container: "webm", resolution: "240p", encoding: "VP9", profile: "profile 0", bitrate: "0.1-0.2", audioEncoding: null, audioBitrate: null }, 243: { container: "webm", resolution: "360p", encoding: "VP9", profile: "profile 0", bitrate: "0.25", audioEncoding: null, audioBitrate: null }, 244: { container: "webm", resolution: "480p", encoding: "VP9", profile: "profile 0", bitrate: "0.5", audioEncoding: null, audioBitrate: null }, 247: { container: "webm", resolution: "720p", encoding: "VP9", profile: "profile 0", bitrate: "0.7-0.8", audioEncoding: null, audioBitrate: null }, 248: { container: "webm", resolution: "1080p", encoding: "VP9", profile: "profile 0", bitrate: "1.5", audioEncoding: null, audioBitrate: null }, 264: { container: "mp4", resolution: "1440p", encoding: "H.264", profile: "high", bitrate: "4-4.5", audioEncoding: null, audioBitrate: null }, 266: { container: "mp4", resolution: "2160p", encoding: "H.264", profile: "high", bitrate: "12.5-16", audioEncoding: null, audioBitrate: null }, 271: { container: "webm", resolution: "1440p", encoding: "VP9", profile: "profle 0", bitrate: "9", audioEncoding: null, audioBitrate: null }, 272: { container: "webm", resolution: "4320p", encoding: "VP9", profile: "profile 0", bitrate: "20-25", audioEncoding: null, audioBitrate: null }, 278: { container: "webm", resolution: "144p 15fps", encoding: "VP9", profile: "profile 0", bitrate: "0.08", audioEncoding: null, audioBitrate: null }, 298: { container: "mp4", resolution: "720p", encoding: "H.264", profile: "main", bitrate: "3-3.5", audioEncoding: null, audioBitrate: null }, 299: { container: "mp4", resolution: "1080p", encoding: "H.264", profile: "high", bitrate: "5.5", audioEncoding: null, audioBitrate: null }, 302: { container: "webm", resolution: "720p HFR", encoding: "VP9", profile: "profile 0", bitrate: "2.5", audioEncoding: null, audioBitrate: null }, 303: { container: "webm", resolution: "1080p HFR", encoding: "VP9", profile: "profile 0", bitrate: "5", audioEncoding: null, audioBitrate: null }, 308: { container: "webm", resolution: "1440p HFR", encoding: "VP9", profile: "profile 0", bitrate: "10", audioEncoding: null, audioBitrate: null }, 313: { container: "webm", resolution: "2160p", encoding: "VP9", profile: "profile 0", bitrate: "13-15", audioEncoding: null, audioBitrate: null }, 315: { container: "webm", resolution: "2160p HFR", encoding: "VP9", profile: "profile 0", bitrate: "20-25", audioEncoding: null, audioBitrate: null }, 330: { container: "webm", resolution: "144p HDR, HFR", encoding: "VP9", profile: "profile 2", bitrate: "0.08", audioEncoding: null, audioBitrate: null }, 331: { container: "webm", resolution: "240p HDR, HFR", encoding: "VP9", profile: "profile 2", bitrate: "0.1-0.15", audioEncoding: null, audioBitrate: null }, 332: { container: "webm", resolution: "360p HDR, HFR", encoding: "VP9", profile: "profile 2", bitrate: "0.25", audioEncoding: null, audioBitrate: null }, 333: { container: "webm", resolution: "240p HDR, HFR", encoding: "VP9", profile: "profile 2", bitrate: "0.5", audioEncoding: null, audioBitrate: null }, 334: { container: "webm", resolution: "720p HDR, HFR", encoding: "VP9", profile: "profile 2", bitrate: "1", audioEncoding: null, audioBitrate: null }, 335: { container: "webm", resolution: "1080p HDR, HFR", encoding: "VP9", profile: "profile 2", bitrate: "1.5-2", audioEncoding: null, audioBitrate: null }, 336: { container: "webm", resolution: "1440p HDR, HFR", encoding: "VP9", profile: "profile 2", bitrate: "5-7", audioEncoding: null, audioBitrate: null }, 337: { container: "webm", resolution: "2160p HDR, HFR", encoding: "VP9", profile: "profile 2", bitrate: "12-14", audioEncoding: null, audioBitrate: null }, 139: { container: "mp4", resolution: null, encoding: null, profile: null, bitrate: null, audioEncoding: "aac", audioBitrate: 48 }, 140: { container: "m4a", resolution: null, encoding: null, profile: null, bitrate: null, audioEncoding: "aac", audioBitrate: 128 }, 141: { container: "mp4", resolution: null, encoding: null, profile: null, bitrate: null, audioEncoding: "aac", audioBitrate: 256 }, 171: { container: "webm", resolution: null, encoding: null, profile: null, bitrate: null, audioEncoding: "vorbis", audioBitrate: 128 }, 172: { container: "webm", resolution: null, encoding: null, profile: null, bitrate: null, audioEncoding: "vorbis", audioBitrate: 192 }, 249: { container: "webm", resolution: null, encoding: null, profile: null, bitrate: null, audioEncoding: "opus", audioBitrate: 48 }, 250: { container: "webm", resolution: null, encoding: null, profile: null, bitrate: null, audioEncoding: "opus", audioBitrate: 64 }, 251: { container: "webm", resolution: null, encoding: null, profile: null, bitrate: null, audioEncoding: "opus", audioBitrate: 160 }, 91: { container: "ts", resolution: "144p", encoding: "H.264", profile: "main", bitrate: "0.1", audioEncoding: "aac", audioBitrate: 48 }, 92: { container: "ts", resolution: "240p", encoding: "H.264", profile: "main", bitrate: "0.15-0.3", audioEncoding: "aac", audioBitrate: 48 }, 93: { container: "ts", resolution: "360p", encoding: "H.264", profile: "main", bitrate: "0.5-1", audioEncoding: "aac", audioBitrate: 128 }, 94: { container: "ts", resolution: "480p", encoding: "H.264", profile: "main", bitrate: "0.8-1.25", audioEncoding: "aac", audioBitrate: 128 }, 95: { container: "ts", resolution: "720p", encoding: "H.264", profile: "main", bitrate: "1.5-3", audioEncoding: "aac", audioBitrate: 256 }, 96: { container: "ts", resolution: "1080p", encoding: "H.264", profile: "high", bitrate: "2.5-6", audioEncoding: "aac", audioBitrate: 256 }, 120: { container: "flv", resolution: "720p", encoding: "H.264", profile: "Main@L3.1", bitrate: "2", audioEncoding: "aac", audioBitrate: 128 }, 127: { container: "ts", resolution: null, encoding: null, profile: null, bitrate: null, audioEncoding: "aac", audioBitrate: 96 }, 128: { container: "ts", resolution: null, encoding: null, profile: null, bitrate: null, audioEncoding: "aac", audioBitrate: 96 }, 132: { container: "ts", resolution: "240p", encoding: "H.264", profile: "baseline", bitrate: "0.15-0.2", audioEncoding: "aac", audioBitrate: 48 }, 151: { container: "ts", resolution: "720p", encoding: "H.264", profile: "baseline", bitrate: "0.05", audioEncoding: "aac", audioBitrate: 24 } };

// Use these to help sort formats, higher is better.
var audioEncodingRanks = {
    mp3: 1,
    vorbis: 2,
    aac: 3,
    opus: 4,
    flac: 5
};
var videoEncodingRanks = {
    'Sorenson H.283': 1,
    'MPEG-4 Visual': 2,
    'VP8': 3,
    'VP9': 4,
    'H.264': 5
};
var utils = {};
/**
 * Sort formats from highest quality to lowest.
 * By resolution, then video bitrate, then audio bitrate.
 *
 * @param {Object} a
 * @param {Object} b
 */
utils.sortFormats = function (a, b) {
    var ares = a.resolution ? parseInt(a.resolution.slice(0, -1), 10) : 0;
    var bres = b.resolution ? parseInt(b.resolution.slice(0, -1), 10) : 0;
    var afeats = ~~!!ares * 2 + ~~!!a.audioBitrate;
    var bfeats = ~~!!bres * 2 + ~~!!b.audioBitrate;

    function getBitrate(c) {
        if (c.bitrate) {
            var s = c.bitrate.split('-');
            return parseFloat(s[s.length - 1], 10);
        } else {
            return 0;
        }
    }

    function audioScore(c) {
        var abitrate = c.audioBitrate || 0;
        var aenc = audioEncodingRanks[c.audioEncoding] || 0;
        return abitrate + aenc / 10;
    }

    if (afeats === bfeats) {
        if (ares === bres) {
            var avbitrate = getBitrate(a);
            var bvbitrate = getBitrate(b);
            if (avbitrate === bvbitrate) {
                var aascore = audioScore(a);
                var bascore = audioScore(b);
                if (aascore === bascore) {
                    var avenc = videoEncodingRanks[a.encoding] || 0;
                    var bvenc = videoEncodingRanks[b.encoding] || 0;
                    return bvenc - avenc;
                } else {
                    return bascore - aascore;
                }
            } else {
                return bvbitrate - avbitrate;
            }
        } else {
            return bres - ares;
        }
    } else {
        return bfeats - afeats;
    }
};

/**
 * Extract string inbetween another.
 *
 * @param {String} haystack
 * @param {String} left
 * @param {String} right
 * @return {String}
 */
utils.between = function (haystack, left, right) {
    var pos;
    pos = haystack.indexOf(left);
    if (pos === -1) {
        return '';
    }
    haystack = haystack.slice(pos + left.length);
    pos = haystack.indexOf(right);
    if (pos === -1) {
        return '';
    }
    haystack = haystack.slice(0, pos);
    return haystack;
};

/**
 * Get video ID.
 *
 * There are a few type of video URL formats.
 *  - http://www.youtube.com/watch?v=VIDEO_ID
 *  - http://m.youtube.com/watch?v=VIDEO_ID
 *  - http://youtu.be/VIDEO_ID
 *  - http://www.youtube.com/v/VIDEO_ID
 *  - http://www.youtube.com/embed/VIDEO_ID
 *
 * @param {String} link
 * @return {String}
 */
var idRegex = /^[a-zA-Z0-9-_]{11}$/;
utils.getVideoID = function (link) {
    if (idRegex.test(link)) {
        return link;
    }
    var parsed = urllib.parse(link, true);
    var id = parsed.query.v;
    if (parsed.hostname === 'youtu.be' || (parsed.hostname === 'youtube.com' || parsed.hostname === 'www.youtube.com') && !id) {
        var s = parsed.pathname.split('/');
        id = s[s.length - 1];
    }
    if (!id) {
        return new Error('No video id found: ' + link);
    }
    if (!idRegex.test(id)) {
        return new Error('Video id (' + id + ') does not match expected format (' + idRegex.toString() + ')');
    }
    return id;
};

/**
 * @param {Object} info
 * @return {Array.<Object>}
 */
utils.parseFormats = function (info) {
    var formats = [];
    if (info.url_encoded_fmt_stream_map) {
        formats = formats.concat(info.url_encoded_fmt_stream_map.split(','));
    }
    if (info.adaptive_fmts) {
        formats = formats.concat(info.adaptive_fmts.split(','));
    }

    formats = formats.map(function (format) {
        return qs.parse(format);
    });
    delete info.url_encoded_fmt_stream_map;
    delete info.adaptive_fmts;

    return formats;
};

/**
 * @param {Object} format
 */
utils.addFormatMeta = function (format) {
    var meta = FORMATS[format.itag];
    for (var key in meta) {
        format[key] = meta[key];
    }

    if (/\/live\/1\//.test(format.url)) {
        format.live = true;
    }
};

/**
 * @param {Array.<Function>} funcs
 * @param {Function(!Error, Array.<Object>)} callback
 */
utils.parallel = function (funcs, callback) {
    var funcsDone = 0;
    var len = funcs.length;
    var errGiven = false;
    var results = [];

    function checkDone(index, err, result) {
        if (errGiven) {
            return;
        }
        if (err) {
            errGiven = true;
            callback(err);
            return;
        }
        results[index] = result;
        if (++funcsDone === len) {
            callback(null, results);
        }
    }

    if (len > 0) {
        for (var i = 0; i < len; i++) {
            funcs[i](checkDone.bind(null, i));
        }
    } else {
        callback(null, results);
    }
};

// A cache to keep track of html5player tokens, so that we don't request
// these static files from Youtube and parse them every time a video
// needs the same one.
//
// The cache is very simplistic, shared, and it only needs get and set.
var cache = {
    "store": {},
    /**
     * @param {String} key
     * @param {Object} value
     */
    "set": function set(key, value) {
        this.store[key] = value;
    },

    /**
     * @param {String} key
     * @return {Object}
     */
    "get": function get(key) {
        return this.store[key];
    },

    /**
     * Empties the cache.
     */
    "reset": function reset() {
        this.store = {};
    }
};
var sig = {};
/**
 * Extract signature deciphering tokens from html5player file.
 *
 * @param {String} html5playerfile
 * @param {Object} options
 * @param {Function(!Error, Array.<String>)} callback
 */
sig.getTokens = function (html5playerfile, options, callback) {
    var key, cachedTokens;
    var rs = /(?:html5)?player[-_]([a-zA-Z0-9\-_]+)(?:\.js|\/)/.exec(html5playerfile);
    if (rs) {
        key = rs[1];
        cachedTokens = cache.get(key);
    } else {
        console.warn('Could not extract html5player key:', html5playerfile);
    }
    if (cachedTokens) {
        callback(null, cachedTokens);
    } else {
        request(html5playerfile, options.requestOptions, function (err, res, body) {
            if (err) return callback(err);

            var tokens = sig.extractActions(body);
            if (key && (!tokens || !tokens.length)) {
                callback(new Error('Could not extract signature deciphering actions'));
                return;
            }

            cache.set(key, tokens);
            callback(null, tokens);
        });
    }
};

/**
 * Decipher a signature based on action tokens.
 *
 * @param {Array.<String>} tokens
 * @param {String} signature
 * @return {String}
 */
sig.decipher = function (tokens, signature) {
    signature = signature.split('');
    var pos;
    for (var i = 0, len = tokens.length; i < len; i++) {
        var token = tokens[i];
        switch (token[0]) {
            case 'r':
                signature = signature.reverse();
                break;
            case 'w':
                pos = ~~token.slice(1);
                signature = swapHeadAndPosition(signature, pos);
                break;
            case 's':
                pos = ~~token.slice(1);
                signature = signature.slice(pos);
                break;
            case 'p':
                pos = ~~token.slice(1);
                signature.splice(0, pos);
                break;
        }
    }
    return signature.join('');
};

/**
 * Swaps the first element of an array with one of given position.
 *
 * @param {Array.<Object>} arr
 * @param {Number} position
 * @return {Array.<Object>}
 */
function swapHeadAndPosition(arr, position) {
    var first = arr[0];
    arr[0] = arr[position % arr.length];
    arr[position] = first;
    return arr;
}

var jsVarStr = '[a-zA-Z_\\$][a-zA-Z_0-9]*';
var jsSingleQuoteStr = '\'[^\'\\\\]*(:?\\\\[\\s\\S][^\'\\\\]*)*\'';
var jsDoubleQuoteStr = '"[^"\\\\]*(:?\\\\[\\s\\S][^"\\\\]*)*"';
var jsQuoteStr = '(?:' + jsSingleQuoteStr + '|' + jsDoubleQuoteStr + ')';
var jsKeyStr = '(?:' + jsVarStr + '|' + jsQuoteStr + ')';
var jsPropStr = '(?:\\.' + jsVarStr + '|\\[' + jsQuoteStr + '\\])';
var jsEmptyStr = '(?:\'\'|"")';
var reverseStr = ':function\\(a\\)\\{' + '(?:return )?a\\.reverse\\(\\)' + '\\}';
var sliceStr = ':function\\(a,b\\)\\{' + 'return a\\.slice\\(b\\)' + '\\}';
var spliceStr = ':function\\(a,b\\)\\{' + 'a\\.splice\\(0,b\\)' + '\\}';
var swapStr = ':function\\(a,b\\)\\{' + 'var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b\\]=c(?:;return a)?' + '\\}';
var actionsObjRegexp = new RegExp('var (' + jsVarStr + ')=\\{((?:(?:' + jsKeyStr + reverseStr + '|' + jsKeyStr + sliceStr + '|' + jsKeyStr + spliceStr + '|' + jsKeyStr + swapStr + '),?\\n?)+)\\};');
var actionsFuncRegexp = new RegExp('function(?: ' + jsVarStr + ')?\\(a\\)\\{' + 'a=a\\.split\\(' + jsEmptyStr + '\\);\\s*' + '((?:(?:a=)?' + jsVarStr + jsPropStr + '\\(a,\\d+\\);)+)' + 'return a\\.join\\(' + jsEmptyStr + '\\)' + '\\}');
var reverseRegexp = new RegExp('(?:^|,)(' + jsKeyStr + ')' + reverseStr, 'm');
var sliceRegexp = new RegExp('(?:^|,)(' + jsKeyStr + ')' + sliceStr, 'm');
var spliceRegexp = new RegExp('(?:^|,)(' + jsKeyStr + ')' + spliceStr, 'm');
var swapRegexp = new RegExp('(?:^|,)(' + jsKeyStr + ')' + swapStr, 'm');

/**
 * Extracts the actions that should be taken to decipher a signature.
 *
 * This searches for a function that performs string manipulations on
 * the signature. We already know what the 3 possible changes to a signature
 * are in order to decipher it. There is
 *
 * * Reversing the string.
 * * Removing a number of characters from the beginning.
 * * Swapping the first character with another position.
 *
 * Note, `Array#slice()` used to be used instead of `Array#splice()`,
 * it's kept in case we encounter any older html5player files.
 *
 * After retrieving the function that does this, we can see what actions
 * it takes on a signature.
 *
 * @param {String} body
 * @return {Array.<String>}
 */
sig.extractActions = function (body) {
    var objResult = actionsObjRegexp.exec(body);
    var funcResult = actionsFuncRegexp.exec(body);
    objResult && delete objResult.input;
    funcResult && delete funcResult.input;
    if (!objResult || !funcResult) {
        return null;
    }

    var obj = objResult[1].replace(/\$/g, '\\$');
    var objBody = objResult[2].replace(/\$/g, '\\$');
    var funcbody = funcResult[1].replace(/\$/g, '\\$');

    var result = reverseRegexp.exec(objBody);
    var reverseKey = result && result[1].replace(/\$/g, '\\$').replace(/\$|^'|^"|'$|"$/g, '');
    result = sliceRegexp.exec(objBody);
    var sliceKey = result && result[1].replace(/\$/g, '\\$').replace(/\$|^'|^"|'$|"$/g, '');
    result = spliceRegexp.exec(objBody);
    var spliceKey = result && result[1].replace(/\$/g, '\\$').replace(/\$|^'|^"|'$|"$/g, '');
    result = swapRegexp.exec(objBody);
    var swapKey = result && result[1].replace(/\$/g, '\\$').replace(/\$|^'|^"|'$|"$/g, '');

    var keys = '(' + [reverseKey, sliceKey, spliceKey, swapKey].join('|') + ')';
    var myreg = '(?:a=)?' + obj + '(?:\\.' + keys + '|\\[\'' + keys + '\'\\]|\\["' + keys + '"\\])' + '\\(a,(\\d+)\\)';
    var tokenizeRegexp = new RegExp(myreg, 'g');
    var tokens = [];
    while ((result = tokenizeRegexp.exec(funcbody)) !== null) {
        var key = result[1] || result[2] || result[3];
        switch (key) {
            case swapKey:
                tokens.push('w' + result[4]);
                break;
            case reverseKey:
                tokens.push('r');
                break;
            case sliceKey:
                tokens.push('s' + result[4]);
                break;
            case spliceKey:
                tokens.push('p' + result[4]);
                break;
        }
    }
    return tokens;
};

/**
 * @param {Object} format
 * @param {String} signature
 * @param {Boolean} debug
 */
sig.setDownloadURL = function (format, signature, debug) {
    var decodedUrl;
    if (format.url) {
        decodedUrl = format.url;
    } else {
        if (debug) {
            console.warn('Download url not found for itag ' + format.itag);
        }
        return;
    }

    try {
        decodedUrl = decodeURIComponent(decodedUrl);
    } catch (err) {
        if (debug) {
            console.warn('Could not decode url: ' + err.message);
        }
        return;
    }

    // Make some adjustments to the final url.
    var parsedUrl = urllib.parse(decodedUrl, true);

    // Deleting the `search` part is necessary otherwise changes to
    // `query` won't reflect when running `url.format()`
    delete parsedUrl.search;

    var query = parsedUrl.query;

    // This is needed for a speedier download.
    // See https://github.com/fent/node-ytdl-core/issues/127
    query.ratebypass = 'yes';
    if (signature) {
        query.signature = signature;
    }

    format.url = urllib.format(parsedUrl);
};

/**
 * Applies `sig.decipher()` to all format URL's.
 *
 * @param {Array.<Object>} formats
 * @param {Array.<String>} tokens
 * @param {Boolean} debug
 */
sig.decipherFormats = function (formats, tokens, debug) {
    formats.forEach(function (format) {
        var signature = tokens && format.s ? sig.decipher(tokens, format.s) : null;
        sig.setDownloadURL(format, signature, debug);
    });
};

/**
 * Gets info from a video.
 *
 * @param {String} link
 * @param {Object} options
 * @param {Function(Error, Object)} callback
 */
module.exports.getInfo = function (link, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = { 'quality': 0 };
    } else if (!options) {
        options = { 'quality': 0 };
    }

    if (!options.quality) {
        options.quality = 0;
    }
    var id = utils.getVideoID(link);
    if (id instanceof Error) return callback(id);

    // Try getting config from the video page first.
    var url = VIDEO_URL + id + '&hl=' + (options.lang || 'en');

    request(url, options.requestOptions, function (err, res, body) {
        if (err) return callback(err);

        // Check if there are any errors with this video page.
        // var unavailableMsg = utils.between(body, '<div id="player-unavailable"', '>');
        // if (unavailableMsg && !/\bhid\b/.test(utils.between(unavailableMsg, 'class="', '"'))) {
        //     // Ignore error about age restriction.
        //     if (body.indexOf('<div id="watch7-player-age-gate-content"') < 0) {
        //         return callback(new Error(utils.between(body,
        //             '<h1 id="unavailable-message" class="message">', '</h1>').trim()));
        //     }
        // }
        gotConfig(options, utils.between(body, 'ytplayer.config = ', ';ytplayer.load'), callback);
    });
};

/**
 * @param {Object} options
 * @param {Object} config
 * @param {Function(Error, Object)} callback
 */
function gotConfig(options, config, callback) {
    if (!config) {
        return callback(new Error('Could not find player config'));
    }
    try {
        config = JSON.parse(config);
    } catch (err) {
        return callback(new Error('Error parsing config: ' + err.message));
    }
    if (options.debug) {
        console.log('config:', JSON.stringify(config));
    }
    var info = config.args;
    info.formats = utils.parseFormats(info);

    if (info.formats.some(function (f) {
        return !!f.s;
    }) || config.args.dashmpd || info.dashmpd || info.hlsvp) {
        var html5playerfile = urllib.resolve(VIDEO_URL, config.assets.js);
        sig.getTokens(html5playerfile, options, function (err, tokens) {
            if (err) return callback(err);

            sig.decipherFormats(info.formats, tokens, options.debug);

            var funcs = [];
            var dashmpd;
            if (config.args.dashmpd) {
                dashmpd = decipherURL(config.args.dashmpd, tokens);
                funcs.push(getDashManifest.bind(null, dashmpd, options));
            }

            if (info.dashmpd && info.dashmpd !== config.args.dashmpd) {
                dashmpd = decipherURL(info.dashmpd, tokens);
                funcs.push(getDashManifest.bind(null, dashmpd, options));
            }

            if (info.hlsvp) {
                info.hlsvp = decipherURL(info.hlsvp, tokens);
                funcs.push(getM3U8.bind(null, info.hlsvp, options));
            }

            utils.parallel(funcs, function (err, results) {
                if (err) return callback(err);
                if (results[0]) {
                    mergeFormats(info, results[0]);
                }
                if (results[1]) {
                    mergeFormats(info, results[1]);
                }
                if (results[2]) {
                    mergeFormats(info, results[2]);
                }
                if (!info.formats.length) {
                    callback(new Error('No formats found'));
                    return;
                }
                gotFormats();
            });
        });
    } else {
        if (!info.formats.length) {
            callback(new Error('This video is unavailable'));
            return;
        }
        sig.decipherFormats(info.formats, null, options.debug);
        gotFormats();
    }

    function gotFormats() {
        info.formats.forEach(utils.addFormatMeta);
        info.formats.sort(utils.sortFormats);
        getUrlByQuality();
        callback(null, info);
    }

    function getUrlByQuality() {
        var checkVideoContainer = function checkVideoContainer(format) {
            return ['mp4', '3gp'].indexOf(format.container) >= 0;
        };
        var checkAudioContainer = function checkAudioContainer(format) {
            return ['m4a', 'mp3'].indexOf(format.container) >= 0;
        };
        var hashCheckQuality = {
            'video_0': function video_0(format) {
                return 'hd720'.localeCompare(format.quality) === 0;
            },
            'video_1': function video_1(format) {
                return 'medium'.localeCompare(format.quality) === 0;
            },
            'video_2': function video_2(format) {
                return 'small'.localeCompare(format.quality) === 0;
            },
            'videoOnly_0': function videoOnly_0(format) {
                return '720p'.localeCompare(format.quality_label) === 0;
            },
            'videoOnly_1': function videoOnly_1(format) {
                return '480p'.localeCompare(format.quality_label) === 0;
            },
            'videoOnly_2': function videoOnly_2(format) {
                return '360p'.localeCompare(format.quality_label) === 0;
            },
            'audio_0': function audio_0(format) {
                return format.audioBitrate > 128;
            },
            'audio_1': function audio_1(format) {
                return format.audioBitrate <= 128 && format.audioBitrate >= 96;
            },
            'audio_2': function audio_2(format) {
                return format.audioBitrate < 96;
            }
        };
        info.videoUrl = null;
        info.videoOnlyUrl = null;
        info.audioUrl = null;
        info.videos = [];
        info.audios = [];
        info.videosOnly = [];
        var video = null;
        var videoOnly = null;
        var audio = null;
        var quality = options.quality;
        info.formats.forEach(function (format) {
            if (format.encoding != null) {
                if (format.audioEncoding != null) {
                    info.videos.push(format);
                    if (checkVideoContainer(format)) {
                        if (video == null) {
                            video = format;
                        }
                        if (info.videoUrl == null && hashCheckQuality['video_' + quality](format)) {
                            info.videoUrl = format.url;
                        }
                    }
                } else {
                    info.videosOnly.push(format);
                    if (checkVideoContainer(format)) {
                        if (videoOnly == null) {
                            videoOnly = format;
                        }
                        if (info.videoOnlyUrl == null && hashCheckQuality['videoOnly_' + quality](format)) {
                            info.videoOnlyUrl = format.url;
                        }
                    }
                }
            } else {
                info.audios.push(format);
                if (checkAudioContainer(format)) {
                    if (audio == null) {
                        audio = format;
                    }
                    if (info.audioUrl == null && hashCheckQuality['audio_' + quality](format)) {
                        info.audioUrl = format.url;
                    }
                }
            }
        });
        if (info.videoUrl == null) {
            if (video != null) {
                info.videoUrl = video.url;
            } else if (info.videos.length > 0) {
                info.videoUrl = info.videos[0].url;
            }
        }
        if (info.videoOnlyUrl == null) {
            if (videoOnly != null) {
                info.videoOnlyUrl = videoOnly.url;
            } else if (info.videosOnly.length > 0) {
                info.videoOnlyUrl = info.videosOnly[0].url;
            }
        }
        if (info.audioUrl == null && audio != null) {
            if (audio != null) {
                info.audioUrl = audio.url;
            } else if (info.audios.length > 0) {
                info.audioUrl = info.audios[0].url;
            }
        }
    }
}

/**
 * @param {String} url
 * @param {Array.<String>} tokens
 */
function decipherURL(url, tokens) {
    return url.replace(/\/s\/([a-fA-F0-9\.]+)/, function (_, s) {
        return '/signature/' + sig.decipher(tokens, s);
    });
}

/**
 * Merges formats from DASH or M3U8 with formats from video info page.
 *
 * @param {Object} info
 * @param {Object} formatsMap
 */
function mergeFormats(info, formatsMap) {
    info.formats.forEach(function (f) {
        var cf = formatsMap[f.itag];
        if (cf) {
            for (var key in f) {
                cf[key] = f[key];
            }
        } else {
            formatsMap[f.itag] = f;
        }
    });
    info.formats = [];
    for (var itag in formatsMap) {
        info.formats.push(formatsMap[itag]);
    }
}

/**
 * Gets additional DASH formats.
 *
 * @param {String} url
 * @param {Object} options
 * @param {Function(!Error, Array.<Object>)} callback
 */
function getDashManifest(url, options, callback) {
    var formats = {};
    var currentFormat = null;
    var expectUrl = false;

    var parser = sax.parser(false);
    parser.onerror = callback;
    parser.onopentag = function (node) {
        if (node.name === 'REPRESENTATION') {
            var itag = node.attributes.ID;
            currentFormat = { itag: itag };
            formats[itag] = currentFormat;
        }
        expectUrl = node.name === 'BASEURL';
    };
    parser.ontext = function (text) {
        if (expectUrl) {
            currentFormat.url = text;
        }
    };
    parser.onend = function () {
        callback(null, formats);
    };

    var req = request(urllib.resolve(VIDEO_URL, url), options.requestOptions);
    req.on('error', callback);
    req.setEncoding('utf8');
    req.on('error', callback);
    req.on('data', function (chunk) {
        parser.write(chunk);
    });
    req.on('end', parser.close.bind(parser));
}

/**
 * Gets additional formats.
 *
 * @param {String} url
 * @param {Object} options
 * @param {Function(!Error, Array.<Object>)} callback
 */
function getM3U8(url, options, callback) {
    url = urllib.resolve(VIDEO_URL, url);
    request(url, options.requestOptions, function (err, res, body) {
        if (err) return callback(err);

        var formats = {};
        body.split('\n').filter(function (line) {
            return (/https?:\/\//.test(line)
            );
        }).forEach(function (line) {
            var itag = line.match(/\/itag\/(\d+)\//)[1];
            formats[itag] = { itag: itag, url: line };
        });
        callback(null, formats);
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9Zb3R1YmVJbmZvLmpzIl0sIm5hbWVzIjpbInVybGxpYiIsInJlcXVpcmUiLCJzYXgiLCJyZXF1ZXN0IiwicXMiLCJWSURFT19VUkwiLCJGT1JNQVRTIiwiY29udGFpbmVyIiwicmVzb2x1dGlvbiIsImVuY29kaW5nIiwicHJvZmlsZSIsImJpdHJhdGUiLCJhdWRpb0VuY29kaW5nIiwiYXVkaW9CaXRyYXRlIiwiYXVkaW9FbmNvZGluZ1JhbmtzIiwibXAzIiwidm9yYmlzIiwiYWFjIiwib3B1cyIsImZsYWMiLCJ2aWRlb0VuY29kaW5nUmFua3MiLCJ1dGlscyIsInNvcnRGb3JtYXRzIiwiYSIsImIiLCJhcmVzIiwicGFyc2VJbnQiLCJzbGljZSIsImJyZXMiLCJhZmVhdHMiLCJiZmVhdHMiLCJnZXRCaXRyYXRlIiwiYyIsInMiLCJzcGxpdCIsInBhcnNlRmxvYXQiLCJsZW5ndGgiLCJhdWRpb1Njb3JlIiwiYWJpdHJhdGUiLCJhZW5jIiwiYXZiaXRyYXRlIiwiYnZiaXRyYXRlIiwiYWFzY29yZSIsImJhc2NvcmUiLCJhdmVuYyIsImJ2ZW5jIiwiYmV0d2VlbiIsImhheXN0YWNrIiwibGVmdCIsInJpZ2h0IiwicG9zIiwiaW5kZXhPZiIsImlkUmVnZXgiLCJnZXRWaWRlb0lEIiwibGluayIsInRlc3QiLCJwYXJzZWQiLCJwYXJzZSIsImlkIiwicXVlcnkiLCJ2IiwiaG9zdG5hbWUiLCJwYXRobmFtZSIsIkVycm9yIiwidG9TdHJpbmciLCJwYXJzZUZvcm1hdHMiLCJpbmZvIiwiZm9ybWF0cyIsInVybF9lbmNvZGVkX2ZtdF9zdHJlYW1fbWFwIiwiY29uY2F0IiwiYWRhcHRpdmVfZm10cyIsIm1hcCIsImZvcm1hdCIsImFkZEZvcm1hdE1ldGEiLCJtZXRhIiwiaXRhZyIsImtleSIsInVybCIsImxpdmUiLCJwYXJhbGxlbCIsImZ1bmNzIiwiY2FsbGJhY2siLCJmdW5jc0RvbmUiLCJsZW4iLCJlcnJHaXZlbiIsInJlc3VsdHMiLCJjaGVja0RvbmUiLCJpbmRleCIsImVyciIsInJlc3VsdCIsImkiLCJiaW5kIiwiY2FjaGUiLCJ2YWx1ZSIsInN0b3JlIiwic2lnIiwiZ2V0VG9rZW5zIiwiaHRtbDVwbGF5ZXJmaWxlIiwib3B0aW9ucyIsImNhY2hlZFRva2VucyIsInJzIiwiZXhlYyIsImdldCIsImNvbnNvbGUiLCJ3YXJuIiwicmVxdWVzdE9wdGlvbnMiLCJyZXMiLCJib2R5IiwidG9rZW5zIiwiZXh0cmFjdEFjdGlvbnMiLCJzZXQiLCJkZWNpcGhlciIsInNpZ25hdHVyZSIsInRva2VuIiwicmV2ZXJzZSIsInN3YXBIZWFkQW5kUG9zaXRpb24iLCJzcGxpY2UiLCJqb2luIiwiYXJyIiwicG9zaXRpb24iLCJmaXJzdCIsImpzVmFyU3RyIiwianNTaW5nbGVRdW90ZVN0ciIsImpzRG91YmxlUXVvdGVTdHIiLCJqc1F1b3RlU3RyIiwianNLZXlTdHIiLCJqc1Byb3BTdHIiLCJqc0VtcHR5U3RyIiwicmV2ZXJzZVN0ciIsInNsaWNlU3RyIiwic3BsaWNlU3RyIiwic3dhcFN0ciIsImFjdGlvbnNPYmpSZWdleHAiLCJSZWdFeHAiLCJhY3Rpb25zRnVuY1JlZ2V4cCIsInJldmVyc2VSZWdleHAiLCJzbGljZVJlZ2V4cCIsInNwbGljZVJlZ2V4cCIsInN3YXBSZWdleHAiLCJvYmpSZXN1bHQiLCJmdW5jUmVzdWx0IiwiaW5wdXQiLCJvYmoiLCJyZXBsYWNlIiwib2JqQm9keSIsImZ1bmNib2R5IiwicmV2ZXJzZUtleSIsInNsaWNlS2V5Iiwic3BsaWNlS2V5Iiwic3dhcEtleSIsImtleXMiLCJteXJlZyIsInRva2VuaXplUmVnZXhwIiwicHVzaCIsInNldERvd25sb2FkVVJMIiwiZGVidWciLCJkZWNvZGVkVXJsIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwibWVzc2FnZSIsInBhcnNlZFVybCIsInNlYXJjaCIsInJhdGVieXBhc3MiLCJkZWNpcGhlckZvcm1hdHMiLCJmb3JFYWNoIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEluZm8iLCJxdWFsaXR5IiwibGFuZyIsImdvdENvbmZpZyIsImNvbmZpZyIsIkpTT04iLCJsb2ciLCJzdHJpbmdpZnkiLCJhcmdzIiwic29tZSIsImYiLCJkYXNobXBkIiwiaGxzdnAiLCJyZXNvbHZlIiwiYXNzZXRzIiwianMiLCJkZWNpcGhlclVSTCIsImdldERhc2hNYW5pZmVzdCIsImdldE0zVTgiLCJtZXJnZUZvcm1hdHMiLCJnb3RGb3JtYXRzIiwic29ydCIsImdldFVybEJ5UXVhbGl0eSIsImNoZWNrVmlkZW9Db250YWluZXIiLCJjaGVja0F1ZGlvQ29udGFpbmVyIiwiaGFzaENoZWNrUXVhbGl0eSIsImxvY2FsZUNvbXBhcmUiLCJxdWFsaXR5X2xhYmVsIiwidmlkZW9VcmwiLCJ2aWRlb09ubHlVcmwiLCJhdWRpb1VybCIsInZpZGVvcyIsImF1ZGlvcyIsInZpZGVvc09ubHkiLCJ2aWRlbyIsInZpZGVvT25seSIsImF1ZGlvIiwiXyIsImZvcm1hdHNNYXAiLCJjZiIsImN1cnJlbnRGb3JtYXQiLCJleHBlY3RVcmwiLCJwYXJzZXIiLCJvbmVycm9yIiwib25vcGVudGFnIiwibm9kZSIsIm5hbWUiLCJhdHRyaWJ1dGVzIiwiSUQiLCJvbnRleHQiLCJ0ZXh0Iiwib25lbmQiLCJyZXEiLCJvbiIsInNldEVuY29kaW5nIiwiY2h1bmsiLCJ3cml0ZSIsImNsb3NlIiwiZmlsdGVyIiwibGluZSIsIm1hdGNoIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFNBQVNDLFFBQVEsS0FBUixDQUFmO0FBQ0EsSUFBTUMsTUFBTUQsUUFBUSxLQUFSLENBQVo7QUFDQSxJQUFNRSxVQUFVRixRQUFRLFNBQVIsQ0FBaEI7QUFDQSxJQUFNRyxLQUFLSCxRQUFRLGFBQVIsQ0FBWDs7QUFFQSxJQUFNSSxZQUFZLGtDQUFsQjtBQUNBLElBQU1DLFVBQVUsRUFBQyxHQUFFLEVBQUNDLFdBQVUsS0FBWCxFQUFpQkMsWUFBVyxNQUE1QixFQUFtQ0MsVUFBUyxnQkFBNUMsRUFBNkRDLFNBQVEsSUFBckUsRUFBMEVDLFNBQVEsTUFBbEYsRUFB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LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdXJsbGliID0gcmVxdWlyZSgndXJsJyk7XG5jb25zdCBzYXggPSByZXF1aXJlKCdzYXgnKTtcbmNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdtaW5pZ2V0Jyk7XG5jb25zdCBxcyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XG5cbmNvbnN0IFZJREVPX1VSTCA9ICdodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PSc7XG5jb25zdCBGT1JNQVRTID0gezU6e2NvbnRhaW5lcjpcImZsdlwiLHJlc29sdXRpb246XCIyNDBwXCIsZW5jb2Rpbmc6XCJTb3JlbnNvbiBILjI4M1wiLHByb2ZpbGU6bnVsbCxiaXRyYXRlOlwiMC4yNVwiLGF1ZGlvRW5jb2Rpbmc6XCJtcDNcIixhdWRpb0JpdHJhdGU6NjR9LDY6e2NvbnRhaW5lcjpcImZsdlwiLHJlc29sdXRpb246XCIyNzBwXCIsZW5jb2Rpbmc6XCJTb3JlbnNvbiBILjI2M1wiLHByb2ZpbGU6bnVsbCxiaXRyYXRlOlwiMC44XCIsYXVkaW9FbmNvZGluZzpcIm1wM1wiLGF1ZGlvQml0cmF0ZTo2NH0sMTM6e2NvbnRhaW5lcjpcIjNncFwiLHJlc29sdXRpb246bnVsbCxlbmNvZGluZzpcIk1QRUctNCBWaXN1YWxcIixwcm9maWxlOm51bGwsYml0cmF0ZTpcIjAuNVwiLGF1ZGlvRW5jb2Rpbmc6XCJhYWNcIixhdWRpb0JpdHJhdGU6bnVsbH0sMTc6e2NvbnRhaW5lcjpcIjNncFwiLHJlc29sdXRpb246XCIxNDRwXCIsZW5jb2Rpbmc6XCJNUEVHLTQgVmlzdWFsXCIscHJvZmlsZTpcInNpbXBsZVwiLGJpdHJhdGU6XCIwLjA1XCIsYXVkaW9FbmNvZGluZzpcImFhY1wiLGF1ZGlvQml0cmF0ZToyNH0sMTg6e2NvbnRhaW5lcjpcIm1wNFwiLHJlc29sdXRpb246XCIzNjBwXCIsZW5jb2Rpbmc6XCJILjI2NFwiLHByb2ZpbGU6XCJiYXNlbGluZVwiLGJpdHJhdGU6XCIwLjVcIixhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjk2fSwyMjp7Y29udGFpbmVyOlwibXA0XCIscmVzb2x1dGlvbjpcIjcyMHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcImhpZ2hcIixiaXRyYXRlOlwiMi0zXCIsYXVkaW9FbmNvZGluZzpcImFhY1wiLGF1ZGlvQml0cmF0ZToxOTJ9LDM0Ontjb250YWluZXI6XCJmbHZcIixyZXNvbHV0aW9uOlwiMzYwcFwiLGVuY29kaW5nOlwiSC4yNjRcIixwcm9maWxlOlwibWFpblwiLGJpdHJhdGU6XCIwLjVcIixhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjEyOH0sMzU6e2NvbnRhaW5lcjpcImZsdlwiLHJlc29sdXRpb246XCI0ODBwXCIsZW5jb2Rpbmc6XCJILjI2NFwiLHByb2ZpbGU6XCJtYWluXCIsYml0cmF0ZTpcIjAuOC0xXCIsYXVkaW9FbmNvZGluZzpcImFhY1wiLGF1ZGlvQml0cmF0ZToxMjh9LDM2Ontjb250YWluZXI6XCIzZ3BcIixyZXNvbHV0aW9uOlwiMjQwcFwiLGVuY29kaW5nOlwiTVBFRy00IFZpc3VhbFwiLHByb2ZpbGU6XCJzaW1wbGVcIixiaXRyYXRlOlwiMC4xNzVcIixhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjMyfSwzNzp7Y29udGFpbmVyOlwibXA0XCIscmVzb2x1dGlvbjpcIjEwODBwXCIsZW5jb2Rpbmc6XCJILjI2NFwiLHByb2ZpbGU6XCJoaWdoXCIsYml0cmF0ZTpcIjMtNS45XCIsYXVkaW9FbmNvZGluZzpcImFhY1wiLGF1ZGlvQml0cmF0ZToxOTJ9LDM4Ontjb250YWluZXI6XCJtcDRcIixyZXNvbHV0aW9uOlwiMzA3MnBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcImhpZ2hcIixiaXRyYXRlOlwiMy41LTVcIixhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjE5Mn0sNDM6e2NvbnRhaW5lcjpcIndlYm1cIixyZXNvbHV0aW9uOlwiMzYwcFwiLGVuY29kaW5nOlwiVlA4XCIscHJvZmlsZTpudWxsLGJpdHJhdGU6XCIwLjUtMC43NVwiLGF1ZGlvRW5jb2Rpbmc6XCJ2b3JiaXNcIixhdWRpb0JpdHJhdGU6MTI4fSw0NDp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCI0ODBwXCIsZW5jb2Rpbmc6XCJWUDhcIixwcm9maWxlOm51bGwsYml0cmF0ZTpcIjFcIixhdWRpb0VuY29kaW5nOlwidm9yYmlzXCIsYXVkaW9CaXRyYXRlOjEyOH0sNDU6e2NvbnRhaW5lcjpcIndlYm1cIixyZXNvbHV0aW9uOlwiNzIwcFwiLGVuY29kaW5nOlwiVlA4XCIscHJvZmlsZTpudWxsLGJpdHJhdGU6XCIyXCIsYXVkaW9FbmNvZGluZzpcInZvcmJpc1wiLGF1ZGlvQml0cmF0ZToxOTJ9LDQ2Ontjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpcIjEwODBwXCIsZW5jb2Rpbmc6XCJ2cDhcIixwcm9maWxlOm51bGwsYml0cmF0ZTpudWxsLGF1ZGlvRW5jb2Rpbmc6XCJ2b3JiaXNcIixhdWRpb0JpdHJhdGU6MTkyfSw4Mjp7Y29udGFpbmVyOlwibXA0XCIscmVzb2x1dGlvbjpcIjM2MHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcIjNkXCIsYml0cmF0ZTpcIjAuNVwiLGF1ZGlvRW5jb2Rpbmc6XCJhYWNcIixhdWRpb0JpdHJhdGU6OTZ9LDgzOntjb250YWluZXI6XCJtcDRcIixyZXNvbHV0aW9uOlwiMjQwcFwiLGVuY29kaW5nOlwiSC4yNjRcIixwcm9maWxlOlwiM2RcIixiaXRyYXRlOlwiMC41XCIsYXVkaW9FbmNvZGluZzpcImFhY1wiLGF1ZGlvQml0cmF0ZTo5Nn0sODQ6e2NvbnRhaW5lcjpcIm1wNFwiLHJlc29sdXRpb246XCI3MjBwXCIsZW5jb2Rpbmc6XCJILjI2NFwiLHByb2ZpbGU6XCIzZFwiLGJpdHJhdGU6XCIyLTNcIixhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjE5Mn0sODU6e2NvbnRhaW5lcjpcIm1wNFwiLHJlc29sdXRpb246XCIxMDgwcFwiLGVuY29kaW5nOlwiSC4yNjRcIixwcm9maWxlOlwiM2RcIixiaXRyYXRlOlwiMy00XCIsYXVkaW9FbmNvZGluZzpcImFhY1wiLGF1ZGlvQml0cmF0ZToxOTJ9LDEwMDp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCIzNjBwXCIsZW5jb2Rpbmc6XCJWUDhcIixwcm9maWxlOlwiM2RcIixiaXRyYXRlOm51bGwsYXVkaW9FbmNvZGluZzpcInZvcmJpc1wiLGF1ZGlvQml0cmF0ZToxMjh9LDEwMTp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCIzNjBwXCIsZW5jb2Rpbmc6XCJWUDhcIixwcm9maWxlOlwiM2RcIixiaXRyYXRlOm51bGwsYXVkaW9FbmNvZGluZzpcInZvcmJpc1wiLGF1ZGlvQml0cmF0ZToxOTJ9LDEwMjp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCI3MjBwXCIsZW5jb2Rpbmc6XCJWUDhcIixwcm9maWxlOlwiM2RcIixiaXRyYXRlOm51bGwsYXVkaW9FbmNvZGluZzpcInZvcmJpc1wiLGF1ZGlvQml0cmF0ZToxOTJ9LDEzMzp7Y29udGFpbmVyOlwibXA0XCIscmVzb2x1dGlvbjpcIjI0MHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcIm1haW5cIixiaXRyYXRlOlwiMC4yLTAuM1wiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMTM0Ontjb250YWluZXI6XCJtcDRcIixyZXNvbHV0aW9uOlwiMzYwcFwiLGVuY29kaW5nOlwiSC4yNjRcIixwcm9maWxlOlwibWFpblwiLGJpdHJhdGU6XCIwLjMtMC40XCIsYXVkaW9FbmNvZGluZzpudWxsLGF1ZGlvQml0cmF0ZTpudWxsfSwxMzU6e2NvbnRhaW5lcjpcIm1wNFwiLHJlc29sdXRpb246XCI0ODBwXCIsZW5jb2Rpbmc6XCJILjI2NFwiLHByb2ZpbGU6XCJtYWluXCIsYml0cmF0ZTpcIjAuNS0xXCIsYXVkaW9FbmNvZGluZzpudWxsLGF1ZGlvQml0cmF0ZTpudWxsfSwxMzY6e2NvbnRhaW5lcjpcIm1wNFwiLHJlc29sdXRpb246XCI3MjBwXCIsZW5jb2Rpbmc6XCJILjI2NFwiLHByb2ZpbGU6XCJtYWluXCIsYml0cmF0ZTpcIjEtMS41XCIsYXVkaW9FbmNvZGluZzpudWxsLGF1ZGlvQml0cmF0ZTpudWxsfSwxMzc6e2NvbnRhaW5lcjpcIm1wNFwiLHJlc29sdXRpb246XCIxMDgwcFwiLGVuY29kaW5nOlwiSC4yNjRcIixwcm9maWxlOlwiaGlnaFwiLGJpdHJhdGU6XCIyLjUtM1wiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMTM4Ontjb250YWluZXI6XCJtcDRcIixyZXNvbHV0aW9uOlwiNDMyMHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcImhpZ2hcIixiaXRyYXRlOlwiMTMuNS0yNVwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMTYwOntjb250YWluZXI6XCJtcDRcIixyZXNvbHV0aW9uOlwiMTQ0cFwiLGVuY29kaW5nOlwiSC4yNjRcIixwcm9maWxlOlwibWFpblwiLGJpdHJhdGU6XCIwLjFcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDI0Mjp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCIyNDBwXCIsZW5jb2Rpbmc6XCJWUDlcIixwcm9maWxlOlwicHJvZmlsZSAwXCIsYml0cmF0ZTpcIjAuMS0wLjJcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDI0Mzp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCIzNjBwXCIsZW5jb2Rpbmc6XCJWUDlcIixwcm9maWxlOlwicHJvZmlsZSAwXCIsYml0cmF0ZTpcIjAuMjVcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDI0NDp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCI0ODBwXCIsZW5jb2Rpbmc6XCJWUDlcIixwcm9maWxlOlwicHJvZmlsZSAwXCIsYml0cmF0ZTpcIjAuNVwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMjQ3Ontjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpcIjcyMHBcIixlbmNvZGluZzpcIlZQOVwiLHByb2ZpbGU6XCJwcm9maWxlIDBcIixiaXRyYXRlOlwiMC43LTAuOFwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMjQ4Ontjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpcIjEwODBwXCIsZW5jb2Rpbmc6XCJWUDlcIixwcm9maWxlOlwicHJvZmlsZSAwXCIsYml0cmF0ZTpcIjEuNVwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMjY0Ontjb250YWluZXI6XCJtcDRcIixyZXNvbHV0aW9uOlwiMTQ0MHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcImhpZ2hcIixiaXRyYXRlOlwiNC00LjVcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDI2Njp7Y29udGFpbmVyOlwibXA0XCIscmVzb2x1dGlvbjpcIjIxNjBwXCIsZW5jb2Rpbmc6XCJILjI2NFwiLHByb2ZpbGU6XCJoaWdoXCIsYml0cmF0ZTpcIjEyLjUtMTZcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDI3MTp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCIxNDQwcFwiLGVuY29kaW5nOlwiVlA5XCIscHJvZmlsZTpcInByb2ZsZSAwXCIsYml0cmF0ZTpcIjlcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDI3Mjp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCI0MzIwcFwiLGVuY29kaW5nOlwiVlA5XCIscHJvZmlsZTpcInByb2ZpbGUgMFwiLGJpdHJhdGU6XCIyMC0yNVwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMjc4Ontjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpcIjE0NHAgMTVmcHNcIixlbmNvZGluZzpcIlZQOVwiLHByb2ZpbGU6XCJwcm9maWxlIDBcIixiaXRyYXRlOlwiMC4wOFwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMjk4Ontjb250YWluZXI6XCJtcDRcIixyZXNvbHV0aW9uOlwiNzIwcFwiLGVuY29kaW5nOlwiSC4yNjRcIixwcm9maWxlOlwibWFpblwiLGJpdHJhdGU6XCIzLTMuNVwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMjk5Ontjb250YWluZXI6XCJtcDRcIixyZXNvbHV0aW9uOlwiMTA4MHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcImhpZ2hcIixiaXRyYXRlOlwiNS41XCIsYXVkaW9FbmNvZGluZzpudWxsLGF1ZGlvQml0cmF0ZTpudWxsfSwzMDI6e2NvbnRhaW5lcjpcIndlYm1cIixyZXNvbHV0aW9uOlwiNzIwcCBIRlJcIixlbmNvZGluZzpcIlZQOVwiLHByb2ZpbGU6XCJwcm9maWxlIDBcIixiaXRyYXRlOlwiMi41XCIsYXVkaW9FbmNvZGluZzpudWxsLGF1ZGlvQml0cmF0ZTpudWxsfSwzMDM6e2NvbnRhaW5lcjpcIndlYm1cIixyZXNvbHV0aW9uOlwiMTA4MHAgSEZSXCIsZW5jb2Rpbmc6XCJWUDlcIixwcm9maWxlOlwicHJvZmlsZSAwXCIsYml0cmF0ZTpcIjVcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDMwODp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCIxNDQwcCBIRlJcIixlbmNvZGluZzpcIlZQOVwiLHByb2ZpbGU6XCJwcm9maWxlIDBcIixiaXRyYXRlOlwiMTBcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDMxMzp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCIyMTYwcFwiLGVuY29kaW5nOlwiVlA5XCIscHJvZmlsZTpcInByb2ZpbGUgMFwiLGJpdHJhdGU6XCIxMy0xNVwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMzE1Ontjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpcIjIxNjBwIEhGUlwiLGVuY29kaW5nOlwiVlA5XCIscHJvZmlsZTpcInByb2ZpbGUgMFwiLGJpdHJhdGU6XCIyMC0yNVwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMzMwOntjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpcIjE0NHAgSERSLCBIRlJcIixlbmNvZGluZzpcIlZQOVwiLHByb2ZpbGU6XCJwcm9maWxlIDJcIixiaXRyYXRlOlwiMC4wOFwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMzMxOntjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpcIjI0MHAgSERSLCBIRlJcIixlbmNvZGluZzpcIlZQOVwiLHByb2ZpbGU6XCJwcm9maWxlIDJcIixiaXRyYXRlOlwiMC4xLTAuMTVcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDMzMjp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCIzNjBwIEhEUiwgSEZSXCIsZW5jb2Rpbmc6XCJWUDlcIixwcm9maWxlOlwicHJvZmlsZSAyXCIsYml0cmF0ZTpcIjAuMjVcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDMzMzp7Y29udGFpbmVyOlwid2VibVwiLHJlc29sdXRpb246XCIyNDBwIEhEUiwgSEZSXCIsZW5jb2Rpbmc6XCJWUDlcIixwcm9maWxlOlwicHJvZmlsZSAyXCIsYml0cmF0ZTpcIjAuNVwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMzM0Ontjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpcIjcyMHAgSERSLCBIRlJcIixlbmNvZGluZzpcIlZQOVwiLHByb2ZpbGU6XCJwcm9maWxlIDJcIixiaXRyYXRlOlwiMVwiLGF1ZGlvRW5jb2Rpbmc6bnVsbCxhdWRpb0JpdHJhdGU6bnVsbH0sMzM1Ontjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpcIjEwODBwIEhEUiwgSEZSXCIsZW5jb2Rpbmc6XCJWUDlcIixwcm9maWxlOlwicHJvZmlsZSAyXCIsYml0cmF0ZTpcIjEuNS0yXCIsYXVkaW9FbmNvZGluZzpudWxsLGF1ZGlvQml0cmF0ZTpudWxsfSwzMzY6e2NvbnRhaW5lcjpcIndlYm1cIixyZXNvbHV0aW9uOlwiMTQ0MHAgSERSLCBIRlJcIixlbmNvZGluZzpcIlZQOVwiLHByb2ZpbGU6XCJwcm9maWxlIDJcIixiaXRyYXRlOlwiNS03XCIsYXVkaW9FbmNvZGluZzpudWxsLGF1ZGlvQml0cmF0ZTpudWxsfSwzMzc6e2NvbnRhaW5lcjpcIndlYm1cIixyZXNvbHV0aW9uOlwiMjE2MHAgSERSLCBIRlJcIixlbmNvZGluZzpcIlZQOVwiLHByb2ZpbGU6XCJwcm9maWxlIDJcIixiaXRyYXRlOlwiMTItMTRcIixhdWRpb0VuY29kaW5nOm51bGwsYXVkaW9CaXRyYXRlOm51bGx9LDEzOTp7Y29udGFpbmVyOlwibXA0XCIscmVzb2x1dGlvbjpudWxsLGVuY29kaW5nOm51bGwscHJvZmlsZTpudWxsLGJpdHJhdGU6bnVsbCxhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjQ4fSwxNDA6e2NvbnRhaW5lcjpcIm00YVwiLHJlc29sdXRpb246bnVsbCxlbmNvZGluZzpudWxsLHByb2ZpbGU6bnVsbCxiaXRyYXRlOm51bGwsYXVkaW9FbmNvZGluZzpcImFhY1wiLGF1ZGlvQml0cmF0ZToxMjh9LDE0MTp7Y29udGFpbmVyOlwibXA0XCIscmVzb2x1dGlvbjpudWxsLGVuY29kaW5nOm51bGwscHJvZmlsZTpudWxsLGJpdHJhdGU6bnVsbCxhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjI1Nn0sMTcxOntjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpudWxsLGVuY29kaW5nOm51bGwscHJvZmlsZTpudWxsLGJpdHJhdGU6bnVsbCxhdWRpb0VuY29kaW5nOlwidm9yYmlzXCIsYXVkaW9CaXRyYXRlOjEyOH0sMTcyOntjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpudWxsLGVuY29kaW5nOm51bGwscHJvZmlsZTpudWxsLGJpdHJhdGU6bnVsbCxhdWRpb0VuY29kaW5nOlwidm9yYmlzXCIsYXVkaW9CaXRyYXRlOjE5Mn0sMjQ5Ontjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpudWxsLGVuY29kaW5nOm51bGwscHJvZmlsZTpudWxsLGJpdHJhdGU6bnVsbCxhdWRpb0VuY29kaW5nOlwib3B1c1wiLGF1ZGlvQml0cmF0ZTo0OH0sMjUwOntjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpudWxsLGVuY29kaW5nOm51bGwscHJvZmlsZTpudWxsLGJpdHJhdGU6bnVsbCxhdWRpb0VuY29kaW5nOlwib3B1c1wiLGF1ZGlvQml0cmF0ZTo2NH0sMjUxOntjb250YWluZXI6XCJ3ZWJtXCIscmVzb2x1dGlvbjpudWxsLGVuY29kaW5nOm51bGwscHJvZmlsZTpudWxsLGJpdHJhdGU6bnVsbCxhdWRpb0VuY29kaW5nOlwib3B1c1wiLGF1ZGlvQml0cmF0ZToxNjB9LDkxOntjb250YWluZXI6XCJ0c1wiLHJlc29sdXRpb246XCIxNDRwXCIsZW5jb2Rpbmc6XCJILjI2NFwiLHByb2ZpbGU6XCJtYWluXCIsYml0cmF0ZTpcIjAuMVwiLGF1ZGlvRW5jb2Rpbmc6XCJhYWNcIixhdWRpb0JpdHJhdGU6NDh9LDkyOntjb250YWluZXI6XCJ0c1wiLHJlc29sdXRpb246XCIyNDBwXCIsZW5jb2Rpbmc6XCJILjI2NFwiLHByb2ZpbGU6XCJtYWluXCIsYml0cmF0ZTpcIjAuMTUtMC4zXCIsYXVkaW9FbmNvZGluZzpcImFhY1wiLGF1ZGlvQml0cmF0ZTo0OH0sOTM6e2NvbnRhaW5lcjpcInRzXCIscmVzb2x1dGlvbjpcIjM2MHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcIm1haW5cIixiaXRyYXRlOlwiMC41LTFcIixhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjEyOH0sOTQ6e2NvbnRhaW5lcjpcInRzXCIscmVzb2x1dGlvbjpcIjQ4MHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcIm1haW5cIixiaXRyYXRlOlwiMC44LTEuMjVcIixhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjEyOH0sOTU6e2NvbnRhaW5lcjpcInRzXCIscmVzb2x1dGlvbjpcIjcyMHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcIm1haW5cIixiaXRyYXRlOlwiMS41LTNcIixhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjI1Nn0sOTY6e2NvbnRhaW5lcjpcInRzXCIscmVzb2x1dGlvbjpcIjEwODBwXCIsZW5jb2Rpbmc6XCJILjI2NFwiLHByb2ZpbGU6XCJoaWdoXCIsYml0cmF0ZTpcIjIuNS02XCIsYXVkaW9FbmNvZGluZzpcImFhY1wiLGF1ZGlvQml0cmF0ZToyNTZ9LDEyMDp7Y29udGFpbmVyOlwiZmx2XCIscmVzb2x1dGlvbjpcIjcyMHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcIk1haW5ATDMuMVwiLGJpdHJhdGU6XCIyXCIsYXVkaW9FbmNvZGluZzpcImFhY1wiLGF1ZGlvQml0cmF0ZToxMjh9LDEyNzp7Y29udGFpbmVyOlwidHNcIixyZXNvbHV0aW9uOm51bGwsZW5jb2Rpbmc6bnVsbCxwcm9maWxlOm51bGwsYml0cmF0ZTpudWxsLGF1ZGlvRW5jb2Rpbmc6XCJhYWNcIixhdWRpb0JpdHJhdGU6OTZ9LDEyODp7Y29udGFpbmVyOlwidHNcIixyZXNvbHV0aW9uOm51bGwsZW5jb2Rpbmc6bnVsbCxwcm9maWxlOm51bGwsYml0cmF0ZTpudWxsLGF1ZGlvRW5jb2Rpbmc6XCJhYWNcIixhdWRpb0JpdHJhdGU6OTZ9LDEzMjp7Y29udGFpbmVyOlwidHNcIixyZXNvbHV0aW9uOlwiMjQwcFwiLGVuY29kaW5nOlwiSC4yNjRcIixwcm9maWxlOlwiYmFzZWxpbmVcIixiaXRyYXRlOlwiMC4xNS0wLjJcIixhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjQ4fSwxNTE6e2NvbnRhaW5lcjpcInRzXCIscmVzb2x1dGlvbjpcIjcyMHBcIixlbmNvZGluZzpcIkguMjY0XCIscHJvZmlsZTpcImJhc2VsaW5lXCIsYml0cmF0ZTpcIjAuMDVcIixhdWRpb0VuY29kaW5nOlwiYWFjXCIsYXVkaW9CaXRyYXRlOjI0fX07XG5cbi8vIFVzZSB0aGVzZSB0byBoZWxwIHNvcnQgZm9ybWF0cywgaGlnaGVyIGlzIGJldHRlci5cbnZhciBhdWRpb0VuY29kaW5nUmFua3MgPSB7XG4gICAgbXAzOiAxLFxuICAgIHZvcmJpczogMixcbiAgICBhYWM6IDMsXG4gICAgb3B1czogNCxcbiAgICBmbGFjOiA1XG59O1xudmFyIHZpZGVvRW5jb2RpbmdSYW5rcyA9IHtcbiAgICAnU29yZW5zb24gSC4yODMnOiAxLFxuICAgICdNUEVHLTQgVmlzdWFsJzogMixcbiAgICAnVlA4JzogMyxcbiAgICAnVlA5JzogNCxcbiAgICAnSC4yNjQnOiA1XG59O1xudmFyIHV0aWxzID0ge307XG4vKipcbiAqIFNvcnQgZm9ybWF0cyBmcm9tIGhpZ2hlc3QgcXVhbGl0eSB0byBsb3dlc3QuXG4gKiBCeSByZXNvbHV0aW9uLCB0aGVuIHZpZGVvIGJpdHJhdGUsIHRoZW4gYXVkaW8gYml0cmF0ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqL1xudXRpbHMuc29ydEZvcm1hdHMgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgIHZhciBhcmVzID0gYS5yZXNvbHV0aW9uID8gcGFyc2VJbnQoYS5yZXNvbHV0aW9uLnNsaWNlKDAsIC0xKSwgMTApIDogMDtcbiAgICB2YXIgYnJlcyA9IGIucmVzb2x1dGlvbiA/IHBhcnNlSW50KGIucmVzb2x1dGlvbi5zbGljZSgwLCAtMSksIDEwKSA6IDA7XG4gICAgdmFyIGFmZWF0cyA9IH5+ISFhcmVzICogMiArIH5+ISFhLmF1ZGlvQml0cmF0ZTtcbiAgICB2YXIgYmZlYXRzID0gfn4hIWJyZXMgKiAyICsgfn4hIWIuYXVkaW9CaXRyYXRlO1xuXG4gICAgZnVuY3Rpb24gZ2V0Qml0cmF0ZShjKSB7XG4gICAgICAgIGlmIChjLmJpdHJhdGUpIHtcbiAgICAgICAgICAgIHZhciBzID0gYy5iaXRyYXRlLnNwbGl0KCctJyk7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChzW3MubGVuZ3RoIC0gMV0sIDEwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXVkaW9TY29yZShjKSB7XG4gICAgICAgIHZhciBhYml0cmF0ZSA9IGMuYXVkaW9CaXRyYXRlIHx8IDA7XG4gICAgICAgIHZhciBhZW5jID0gYXVkaW9FbmNvZGluZ1JhbmtzW2MuYXVkaW9FbmNvZGluZ10gfHwgMDtcbiAgICAgICAgcmV0dXJuIGFiaXRyYXRlICsgYWVuYyAvIDEwO1xuICAgIH1cblxuICAgIGlmIChhZmVhdHMgPT09IGJmZWF0cykge1xuICAgICAgICBpZiAoYXJlcyA9PT0gYnJlcykge1xuICAgICAgICAgICAgdmFyIGF2Yml0cmF0ZSA9IGdldEJpdHJhdGUoYSk7XG4gICAgICAgICAgICB2YXIgYnZiaXRyYXRlID0gZ2V0Qml0cmF0ZShiKTtcbiAgICAgICAgICAgIGlmIChhdmJpdHJhdGUgPT09IGJ2Yml0cmF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBhYXNjb3JlID0gYXVkaW9TY29yZShhKTtcbiAgICAgICAgICAgICAgICB2YXIgYmFzY29yZSA9IGF1ZGlvU2NvcmUoYik7XG4gICAgICAgICAgICAgICAgaWYgKGFhc2NvcmUgPT09IGJhc2NvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF2ZW5jID0gdmlkZW9FbmNvZGluZ1JhbmtzW2EuZW5jb2RpbmddIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBidmVuYyA9IHZpZGVvRW5jb2RpbmdSYW5rc1tiLmVuY29kaW5nXSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnZlbmMgLSBhdmVuYztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzY29yZSAtIGFhc2NvcmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYnZiaXRyYXRlIC0gYXZiaXRyYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGJyZXMgLSBhcmVzO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGJmZWF0cyAtIGFmZWF0cztcbiAgICB9XG59O1xuXG4vKipcbiAqIEV4dHJhY3Qgc3RyaW5nIGluYmV0d2VlbiBhbm90aGVyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoYXlzdGFja1xuICogQHBhcmFtIHtTdHJpbmd9IGxlZnRcbiAqIEBwYXJhbSB7U3RyaW5nfSByaWdodFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG51dGlscy5iZXR3ZWVuID0gZnVuY3Rpb24gKGhheXN0YWNrLCBsZWZ0LCByaWdodCkge1xuICAgIHZhciBwb3M7XG4gICAgcG9zID0gaGF5c3RhY2suaW5kZXhPZihsZWZ0KTtcbiAgICBpZiAocG9zID09PSAtMSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGhheXN0YWNrID0gaGF5c3RhY2suc2xpY2UocG9zICsgbGVmdC5sZW5ndGgpO1xuICAgIHBvcyA9IGhheXN0YWNrLmluZGV4T2YocmlnaHQpO1xuICAgIGlmIChwb3MgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaGF5c3RhY2sgPSBoYXlzdGFjay5zbGljZSgwLCBwb3MpO1xuICAgIHJldHVybiBoYXlzdGFjaztcbn07XG5cbi8qKlxuICogR2V0IHZpZGVvIElELlxuICpcbiAqIFRoZXJlIGFyZSBhIGZldyB0eXBlIG9mIHZpZGVvIFVSTCBmb3JtYXRzLlxuICogIC0gaHR0cDovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PVZJREVPX0lEXG4gKiAgLSBodHRwOi8vbS55b3V0dWJlLmNvbS93YXRjaD92PVZJREVPX0lEXG4gKiAgLSBodHRwOi8veW91dHUuYmUvVklERU9fSURcbiAqICAtIGh0dHA6Ly93d3cueW91dHViZS5jb20vdi9WSURFT19JRFxuICogIC0gaHR0cDovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9WSURFT19JRFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5rXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbnZhciBpZFJlZ2V4ID0gL15bYS16QS1aMC05LV9dezExfSQvO1xudXRpbHMuZ2V0VmlkZW9JRCA9IGZ1bmN0aW9uIChsaW5rKSB7XG4gICAgaWYgKGlkUmVnZXgudGVzdChsaW5rKSkge1xuICAgICAgICByZXR1cm4gbGluaztcbiAgICB9XG4gICAgdmFyIHBhcnNlZCA9IHVybGxpYi5wYXJzZShsaW5rLCB0cnVlKTtcbiAgICB2YXIgaWQgPSBwYXJzZWQucXVlcnkudjtcbiAgICBpZiAocGFyc2VkLmhvc3RuYW1lID09PSAneW91dHUuYmUnIHx8XG4gICAgICAgIChwYXJzZWQuaG9zdG5hbWUgPT09ICd5b3V0dWJlLmNvbScgfHxcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0bmFtZSA9PT0gJ3d3dy55b3V0dWJlLmNvbScpICYmICFpZCkge1xuICAgICAgICB2YXIgcyA9IHBhcnNlZC5wYXRobmFtZS5zcGxpdCgnLycpO1xuICAgICAgICBpZCA9IHNbcy5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgaWYgKCFpZCkge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdObyB2aWRlbyBpZCBmb3VuZDogJyArIGxpbmspO1xuICAgIH1cbiAgICBpZiAoIWlkUmVnZXgudGVzdChpZCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignVmlkZW8gaWQgKCcgKyBpZCArICcpIGRvZXMgbm90IG1hdGNoIGV4cGVjdGVkIGZvcm1hdCAoJyArIGlkUmVnZXgudG9TdHJpbmcoKSArICcpJyk7XG4gICAgfVxuICAgIHJldHVybiBpZDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGluZm9cbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG51dGlscy5wYXJzZUZvcm1hdHMgPSBmdW5jdGlvbiAoaW5mbykge1xuICAgIHZhciBmb3JtYXRzID0gW107XG4gICAgaWYgKGluZm8udXJsX2VuY29kZWRfZm10X3N0cmVhbV9tYXApIHtcbiAgICAgICAgZm9ybWF0cyA9IGZvcm1hdHNcbiAgICAgICAgICAgIC5jb25jYXQoaW5mby51cmxfZW5jb2RlZF9mbXRfc3RyZWFtX21hcC5zcGxpdCgnLCcpKTtcbiAgICB9XG4gICAgaWYgKGluZm8uYWRhcHRpdmVfZm10cykge1xuICAgICAgICBmb3JtYXRzID0gZm9ybWF0cy5jb25jYXQoaW5mby5hZGFwdGl2ZV9mbXRzLnNwbGl0KCcsJykpO1xuICAgIH1cblxuICAgIGZvcm1hdHMgPSBmb3JtYXRzXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgcmV0dXJuIHFzLnBhcnNlKGZvcm1hdCk7XG4gICAgICAgIH0pO1xuICAgIGRlbGV0ZSBpbmZvLnVybF9lbmNvZGVkX2ZtdF9zdHJlYW1fbWFwO1xuICAgIGRlbGV0ZSBpbmZvLmFkYXB0aXZlX2ZtdHM7XG5cbiAgICByZXR1cm4gZm9ybWF0cztcbn07XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZvcm1hdFxuICovXG51dGlscy5hZGRGb3JtYXRNZXRhID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgIHZhciBtZXRhID0gRk9STUFUU1tmb3JtYXQuaXRhZ107XG4gICAgZm9yICh2YXIga2V5IGluIG1ldGEpIHtcbiAgICAgICAgZm9ybWF0W2tleV0gPSBtZXRhW2tleV07XG4gICAgfVxuXG4gICAgaWYgKC9cXC9saXZlXFwvMVxcLy8udGVzdChmb3JtYXQudXJsKSkge1xuICAgICAgICBmb3JtYXQubGl2ZSA9IHRydWU7XG4gICAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5LjxGdW5jdGlvbj59IGZ1bmNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9uKCFFcnJvciwgQXJyYXkuPE9iamVjdD4pfSBjYWxsYmFja1xuICovXG51dGlscy5wYXJhbGxlbCA9IGZ1bmN0aW9uIChmdW5jcywgY2FsbGJhY2spIHtcbiAgICB2YXIgZnVuY3NEb25lID0gMDtcbiAgICB2YXIgbGVuID0gZnVuY3MubGVuZ3RoO1xuICAgIHZhciBlcnJHaXZlbiA9IGZhbHNlO1xuICAgIHZhciByZXN1bHRzID0gW107XG5cbiAgICBmdW5jdGlvbiBjaGVja0RvbmUoaW5kZXgsIGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChlcnJHaXZlbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGVyckdpdmVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0c1tpbmRleF0gPSByZXN1bHQ7XG4gICAgICAgIGlmICgrK2Z1bmNzRG9uZSA9PT0gbGVuKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGZ1bmNzW2ldKGNoZWNrRG9uZS5iaW5kKG51bGwsIGkpKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuICAgIH1cbn07XG5cblxuLy8gQSBjYWNoZSB0byBrZWVwIHRyYWNrIG9mIGh0bWw1cGxheWVyIHRva2Vucywgc28gdGhhdCB3ZSBkb24ndCByZXF1ZXN0XG4vLyB0aGVzZSBzdGF0aWMgZmlsZXMgZnJvbSBZb3V0dWJlIGFuZCBwYXJzZSB0aGVtIGV2ZXJ5IHRpbWUgYSB2aWRlb1xuLy8gbmVlZHMgdGhlIHNhbWUgb25lLlxuLy9cbi8vIFRoZSBjYWNoZSBpcyB2ZXJ5IHNpbXBsaXN0aWMsIHNoYXJlZCwgYW5kIGl0IG9ubHkgbmVlZHMgZ2V0IGFuZCBzZXQuXG52YXIgY2FjaGUgPSB7XG4gICAgXCJzdG9yZVwiOiB7fSxcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlXG4gICAgICovXG4gICAgXCJzZXRcIjogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdG9yZVtrZXldID0gdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgXCJnZXRcIjogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVtrZXldO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFbXB0aWVzIHRoZSBjYWNoZS5cbiAgICAgKi9cbiAgICBcInJlc2V0XCI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIH1cbn07XG52YXIgc2lnID0ge307XG4vKipcbiAqIEV4dHJhY3Qgc2lnbmF0dXJlIGRlY2lwaGVyaW5nIHRva2VucyBmcm9tIGh0bWw1cGxheWVyIGZpbGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWw1cGxheWVyZmlsZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb24oIUVycm9yLCBBcnJheS48U3RyaW5nPil9IGNhbGxiYWNrXG4gKi9cbnNpZy5nZXRUb2tlbnMgPSBmdW5jdGlvbiAoaHRtbDVwbGF5ZXJmaWxlLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciBrZXksIGNhY2hlZFRva2VucztcbiAgICB2YXIgcnMgPSAvKD86aHRtbDUpP3BsYXllclstX10oW2EtekEtWjAtOVxcLV9dKykoPzpcXC5qc3xcXC8pL1xuICAgICAgICAuZXhlYyhodG1sNXBsYXllcmZpbGUpO1xuICAgIGlmIChycykge1xuICAgICAgICBrZXkgPSByc1sxXTtcbiAgICAgICAgY2FjaGVkVG9rZW5zID0gY2FjaGUuZ2V0KGtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDb3VsZCBub3QgZXh0cmFjdCBodG1sNXBsYXllciBrZXk6JywgaHRtbDVwbGF5ZXJmaWxlKTtcbiAgICB9XG4gICAgaWYgKGNhY2hlZFRva2Vucykge1xuICAgICAgICBjYWxsYmFjayhudWxsLCBjYWNoZWRUb2tlbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3QoaHRtbDVwbGF5ZXJmaWxlLCBvcHRpb25zLnJlcXVlc3RPcHRpb25zLCBmdW5jdGlvbiAoZXJyLCByZXMsIGJvZHkpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpO1xuXG4gICAgICAgICAgICB2YXIgdG9rZW5zID0gc2lnLmV4dHJhY3RBY3Rpb25zKGJvZHkpO1xuICAgICAgICAgICAgaWYgKGtleSAmJiAoIXRva2VucyB8fCAhdG9rZW5zLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ0NvdWxkIG5vdCBleHRyYWN0IHNpZ25hdHVyZSBkZWNpcGhlcmluZyBhY3Rpb25zJykpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FjaGUuc2V0KGtleSwgdG9rZW5zKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRva2Vucyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qKlxuICogRGVjaXBoZXIgYSBzaWduYXR1cmUgYmFzZWQgb24gYWN0aW9uIHRva2Vucy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxTdHJpbmc+fSB0b2tlbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBzaWduYXR1cmVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuc2lnLmRlY2lwaGVyID0gZnVuY3Rpb24gKHRva2Vucywgc2lnbmF0dXJlKSB7XG4gICAgc2lnbmF0dXJlID0gc2lnbmF0dXJlLnNwbGl0KCcnKTtcbiAgICB2YXIgcG9zO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0b2tlbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICBzd2l0Y2ggKHRva2VuWzBdKSB7XG4gICAgICAgICAgICBjYXNlICdyJzpcbiAgICAgICAgICAgICAgICBzaWduYXR1cmUgPSBzaWduYXR1cmUucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndyc6XG4gICAgICAgICAgICAgICAgcG9zID0gfn50b2tlbi5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICBzaWduYXR1cmUgPSBzd2FwSGVhZEFuZFBvc2l0aW9uKHNpZ25hdHVyZSwgcG9zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgIHBvcyA9IH5+dG9rZW4uc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgc2lnbmF0dXJlID0gc2lnbmF0dXJlLnNsaWNlKHBvcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdwJzpcbiAgICAgICAgICAgICAgICBwb3MgPSB+fnRva2VuLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIHNpZ25hdHVyZS5zcGxpY2UoMCwgcG9zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2lnbmF0dXJlLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBTd2FwcyB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheSB3aXRoIG9uZSBvZiBnaXZlbiBwb3NpdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBhcnJcbiAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvblxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbmZ1bmN0aW9uIHN3YXBIZWFkQW5kUG9zaXRpb24oYXJyLCBwb3NpdGlvbikge1xuICAgIHZhciBmaXJzdCA9IGFyclswXTtcbiAgICBhcnJbMF0gPSBhcnJbcG9zaXRpb24gJSBhcnIubGVuZ3RoXTtcbiAgICBhcnJbcG9zaXRpb25dID0gZmlyc3Q7XG4gICAgcmV0dXJuIGFycjtcbn1cblxudmFyIGpzVmFyU3RyID0gJ1thLXpBLVpfXFxcXCRdW2EtekEtWl8wLTldKic7XG52YXIganNTaW5nbGVRdW90ZVN0ciA9ICdcXCdbXlxcJ1xcXFxcXFxcXSooOj9cXFxcXFxcXFtcXFxcc1xcXFxTXVteXFwnXFxcXFxcXFxdKikqXFwnJztcbnZhciBqc0RvdWJsZVF1b3RlU3RyID0gJ1wiW15cIlxcXFxcXFxcXSooOj9cXFxcXFxcXFtcXFxcc1xcXFxTXVteXCJcXFxcXFxcXF0qKSpcIic7XG52YXIganNRdW90ZVN0ciA9ICcoPzonICsganNTaW5nbGVRdW90ZVN0ciArICd8JyArIGpzRG91YmxlUXVvdGVTdHIgKyAnKSc7XG52YXIganNLZXlTdHIgPSAnKD86JyArIGpzVmFyU3RyICsgJ3wnICsganNRdW90ZVN0ciArICcpJztcbnZhciBqc1Byb3BTdHIgPSAnKD86XFxcXC4nICsganNWYXJTdHIgKyAnfFxcXFxbJyArIGpzUXVvdGVTdHIgKyAnXFxcXF0pJztcbnZhciBqc0VtcHR5U3RyID0gJyg/OlxcJ1xcJ3xcIlwiKSc7XG52YXIgcmV2ZXJzZVN0ciA9ICc6ZnVuY3Rpb25cXFxcKGFcXFxcKVxcXFx7JyArXG4gICAgJyg/OnJldHVybiApP2FcXFxcLnJldmVyc2VcXFxcKFxcXFwpJyArXG4gICAgJ1xcXFx9JztcbnZhciBzbGljZVN0ciA9ICc6ZnVuY3Rpb25cXFxcKGEsYlxcXFwpXFxcXHsnICtcbiAgICAncmV0dXJuIGFcXFxcLnNsaWNlXFxcXChiXFxcXCknICtcbiAgICAnXFxcXH0nO1xudmFyIHNwbGljZVN0ciA9ICc6ZnVuY3Rpb25cXFxcKGEsYlxcXFwpXFxcXHsnICtcbiAgICAnYVxcXFwuc3BsaWNlXFxcXCgwLGJcXFxcKScgK1xuICAgICdcXFxcfSc7XG52YXIgc3dhcFN0ciA9ICc6ZnVuY3Rpb25cXFxcKGEsYlxcXFwpXFxcXHsnICtcbiAgICAndmFyIGM9YVxcXFxbMFxcXFxdO2FcXFxcWzBcXFxcXT1hXFxcXFtiJWFcXFxcLmxlbmd0aFxcXFxdO2FcXFxcW2JcXFxcXT1jKD86O3JldHVybiBhKT8nICtcbiAgICAnXFxcXH0nO1xudmFyIGFjdGlvbnNPYmpSZWdleHAgPSBuZXcgUmVnRXhwKFxuICAgICd2YXIgKCcgKyBqc1ZhclN0ciArICcpPVxcXFx7KCg/Oig/OicgK1xuICAgIGpzS2V5U3RyICsgcmV2ZXJzZVN0ciArICd8JyArXG4gICAganNLZXlTdHIgKyBzbGljZVN0ciArICd8JyArXG4gICAganNLZXlTdHIgKyBzcGxpY2VTdHIgKyAnfCcgK1xuICAgIGpzS2V5U3RyICsgc3dhcFN0ciArXG4gICAgJyksP1xcXFxuPykrKVxcXFx9Oydcbik7XG52YXIgYWN0aW9uc0Z1bmNSZWdleHAgPSBuZXcgUmVnRXhwKCdmdW5jdGlvbig/OiAnICsganNWYXJTdHIgKyAnKT9cXFxcKGFcXFxcKVxcXFx7JyArXG4gICAgJ2E9YVxcXFwuc3BsaXRcXFxcKCcgKyBqc0VtcHR5U3RyICsgJ1xcXFwpO1xcXFxzKicgK1xuICAgICcoKD86KD86YT0pPycgKyBqc1ZhclN0ciArXG4gICAganNQcm9wU3RyICtcbiAgICAnXFxcXChhLFxcXFxkK1xcXFwpOykrKScgK1xuICAgICdyZXR1cm4gYVxcXFwuam9pblxcXFwoJyArIGpzRW1wdHlTdHIgKyAnXFxcXCknICtcbiAgICAnXFxcXH0nXG4pO1xudmFyIHJldmVyc2VSZWdleHAgPSBuZXcgUmVnRXhwKCcoPzpefCwpKCcgKyBqc0tleVN0ciArICcpJyArIHJldmVyc2VTdHIsICdtJyk7XG52YXIgc2xpY2VSZWdleHAgPSBuZXcgUmVnRXhwKCcoPzpefCwpKCcgKyBqc0tleVN0ciArICcpJyArIHNsaWNlU3RyLCAnbScpO1xudmFyIHNwbGljZVJlZ2V4cCA9IG5ldyBSZWdFeHAoJyg/Ol58LCkoJyArIGpzS2V5U3RyICsgJyknICsgc3BsaWNlU3RyLCAnbScpO1xudmFyIHN3YXBSZWdleHAgPSBuZXcgUmVnRXhwKCcoPzpefCwpKCcgKyBqc0tleVN0ciArICcpJyArIHN3YXBTdHIsICdtJyk7XG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIGFjdGlvbnMgdGhhdCBzaG91bGQgYmUgdGFrZW4gdG8gZGVjaXBoZXIgYSBzaWduYXR1cmUuXG4gKlxuICogVGhpcyBzZWFyY2hlcyBmb3IgYSBmdW5jdGlvbiB0aGF0IHBlcmZvcm1zIHN0cmluZyBtYW5pcHVsYXRpb25zIG9uXG4gKiB0aGUgc2lnbmF0dXJlLiBXZSBhbHJlYWR5IGtub3cgd2hhdCB0aGUgMyBwb3NzaWJsZSBjaGFuZ2VzIHRvIGEgc2lnbmF0dXJlXG4gKiBhcmUgaW4gb3JkZXIgdG8gZGVjaXBoZXIgaXQuIFRoZXJlIGlzXG4gKlxuICogKiBSZXZlcnNpbmcgdGhlIHN0cmluZy5cbiAqICogUmVtb3ZpbmcgYSBudW1iZXIgb2YgY2hhcmFjdGVycyBmcm9tIHRoZSBiZWdpbm5pbmcuXG4gKiAqIFN3YXBwaW5nIHRoZSBmaXJzdCBjaGFyYWN0ZXIgd2l0aCBhbm90aGVyIHBvc2l0aW9uLlxuICpcbiAqIE5vdGUsIGBBcnJheSNzbGljZSgpYCB1c2VkIHRvIGJlIHVzZWQgaW5zdGVhZCBvZiBgQXJyYXkjc3BsaWNlKClgLFxuICogaXQncyBrZXB0IGluIGNhc2Ugd2UgZW5jb3VudGVyIGFueSBvbGRlciBodG1sNXBsYXllciBmaWxlcy5cbiAqXG4gKiBBZnRlciByZXRyaWV2aW5nIHRoZSBmdW5jdGlvbiB0aGF0IGRvZXMgdGhpcywgd2UgY2FuIHNlZSB3aGF0IGFjdGlvbnNcbiAqIGl0IHRha2VzIG9uIGEgc2lnbmF0dXJlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBib2R5XG4gKiBAcmV0dXJuIHtBcnJheS48U3RyaW5nPn1cbiAqL1xuc2lnLmV4dHJhY3RBY3Rpb25zID0gZnVuY3Rpb24gKGJvZHkpIHtcbiAgICB2YXIgb2JqUmVzdWx0ID0gYWN0aW9uc09ialJlZ2V4cC5leGVjKGJvZHkpO1xuICAgIHZhciBmdW5jUmVzdWx0ID0gYWN0aW9uc0Z1bmNSZWdleHAuZXhlYyhib2R5KTtcbiAgICBvYmpSZXN1bHQgJiYgZGVsZXRlIG9ialJlc3VsdC5pbnB1dDtcbiAgICBmdW5jUmVzdWx0ICYmIGRlbGV0ZSBmdW5jUmVzdWx0LmlucHV0O1xuICAgIGlmICghb2JqUmVzdWx0IHx8ICFmdW5jUmVzdWx0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBvYmogPSBvYmpSZXN1bHRbMV0ucmVwbGFjZSgvXFwkL2csICdcXFxcJCcpO1xuICAgIHZhciBvYmpCb2R5ID0gb2JqUmVzdWx0WzJdLnJlcGxhY2UoL1xcJC9nLCAnXFxcXCQnKTtcbiAgICB2YXIgZnVuY2JvZHkgPSBmdW5jUmVzdWx0WzFdLnJlcGxhY2UoL1xcJC9nLCAnXFxcXCQnKTtcblxuICAgIHZhciByZXN1bHQgPSByZXZlcnNlUmVnZXhwLmV4ZWMob2JqQm9keSk7XG4gICAgdmFyIHJldmVyc2VLZXkgPSByZXN1bHQgJiYgcmVzdWx0WzFdXG4gICAgICAgIC5yZXBsYWNlKC9cXCQvZywgJ1xcXFwkJylcbiAgICAgICAgLnJlcGxhY2UoL1xcJHxeJ3xeXCJ8JyR8XCIkL2csICcnKTtcbiAgICByZXN1bHQgPSBzbGljZVJlZ2V4cC5leGVjKG9iakJvZHkpO1xuICAgIHZhciBzbGljZUtleSA9IHJlc3VsdCAmJiByZXN1bHRbMV1cbiAgICAgICAgLnJlcGxhY2UoL1xcJC9nLCAnXFxcXCQnKVxuICAgICAgICAucmVwbGFjZSgvXFwkfF4nfF5cInwnJHxcIiQvZywgJycpO1xuICAgIHJlc3VsdCA9IHNwbGljZVJlZ2V4cC5leGVjKG9iakJvZHkpO1xuICAgIHZhciBzcGxpY2VLZXkgPSByZXN1bHQgJiYgcmVzdWx0WzFdXG4gICAgICAgIC5yZXBsYWNlKC9cXCQvZywgJ1xcXFwkJylcbiAgICAgICAgLnJlcGxhY2UoL1xcJHxeJ3xeXCJ8JyR8XCIkL2csICcnKTtcbiAgICByZXN1bHQgPSBzd2FwUmVnZXhwLmV4ZWMob2JqQm9keSk7XG4gICAgdmFyIHN3YXBLZXkgPSByZXN1bHQgJiYgcmVzdWx0WzFdXG4gICAgICAgIC5yZXBsYWNlKC9cXCQvZywgJ1xcXFwkJylcbiAgICAgICAgLnJlcGxhY2UoL1xcJHxeJ3xeXCJ8JyR8XCIkL2csICcnKTtcblxuICAgIHZhciBrZXlzID0gJygnICsgW3JldmVyc2VLZXksIHNsaWNlS2V5LCBzcGxpY2VLZXksIHN3YXBLZXldLmpvaW4oJ3wnKSArICcpJztcbiAgICB2YXIgbXlyZWcgPSAnKD86YT0pPycgKyBvYmogK1xuICAgICAgICAnKD86XFxcXC4nICsga2V5cyArICd8XFxcXFtcXCcnICsga2V5cyArICdcXCdcXFxcXXxcXFxcW1wiJyArIGtleXMgKyAnXCJcXFxcXSknICtcbiAgICAgICAgJ1xcXFwoYSwoXFxcXGQrKVxcXFwpJztcbiAgICB2YXIgdG9rZW5pemVSZWdleHAgPSBuZXcgUmVnRXhwKG15cmVnLCAnZycpO1xuICAgIHZhciB0b2tlbnMgPSBbXTtcbiAgICB3aGlsZSAoKHJlc3VsdCA9IHRva2VuaXplUmVnZXhwLmV4ZWMoZnVuY2JvZHkpKSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIga2V5ID0gcmVzdWx0WzFdIHx8IHJlc3VsdFsyXSB8fCByZXN1bHRbM107XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICBjYXNlIHN3YXBLZXk6XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2goJ3cnICsgcmVzdWx0WzRdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgcmV2ZXJzZUtleTpcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCgncicpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBzbGljZUtleTpcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCgncycgKyByZXN1bHRbNF0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBzcGxpY2VLZXk6XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2goJ3AnICsgcmVzdWx0WzRdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9rZW5zO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gZm9ybWF0XG4gKiBAcGFyYW0ge1N0cmluZ30gc2lnbmF0dXJlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRlYnVnXG4gKi9cbnNpZy5zZXREb3dubG9hZFVSTCA9IGZ1bmN0aW9uIChmb3JtYXQsIHNpZ25hdHVyZSwgZGVidWcpIHtcbiAgICB2YXIgZGVjb2RlZFVybDtcbiAgICBpZiAoZm9ybWF0LnVybCkge1xuICAgICAgICBkZWNvZGVkVXJsID0gZm9ybWF0LnVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRG93bmxvYWQgdXJsIG5vdCBmb3VuZCBmb3IgaXRhZyAnICsgZm9ybWF0Lml0YWcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICBkZWNvZGVkVXJsID0gZGVjb2RlVVJJQ29tcG9uZW50KGRlY29kZWRVcmwpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQ291bGQgbm90IGRlY29kZSB1cmw6ICcgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE1ha2Ugc29tZSBhZGp1c3RtZW50cyB0byB0aGUgZmluYWwgdXJsLlxuICAgIHZhciBwYXJzZWRVcmwgPSB1cmxsaWIucGFyc2UoZGVjb2RlZFVybCwgdHJ1ZSk7XG5cbiAgICAvLyBEZWxldGluZyB0aGUgYHNlYXJjaGAgcGFydCBpcyBuZWNlc3Nhcnkgb3RoZXJ3aXNlIGNoYW5nZXMgdG9cbiAgICAvLyBgcXVlcnlgIHdvbid0IHJlZmxlY3Qgd2hlbiBydW5uaW5nIGB1cmwuZm9ybWF0KClgXG4gICAgZGVsZXRlIHBhcnNlZFVybC5zZWFyY2g7XG5cbiAgICB2YXIgcXVlcnkgPSBwYXJzZWRVcmwucXVlcnk7XG5cbiAgICAvLyBUaGlzIGlzIG5lZWRlZCBmb3IgYSBzcGVlZGllciBkb3dubG9hZC5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZlbnQvbm9kZS15dGRsLWNvcmUvaXNzdWVzLzEyN1xuICAgIHF1ZXJ5LnJhdGVieXBhc3MgPSAneWVzJztcbiAgICBpZiAoc2lnbmF0dXJlKSB7XG4gICAgICAgIHF1ZXJ5LnNpZ25hdHVyZSA9IHNpZ25hdHVyZTtcbiAgICB9XG5cbiAgICBmb3JtYXQudXJsID0gdXJsbGliLmZvcm1hdChwYXJzZWRVcmwpO1xufTtcblxuLyoqXG4gKiBBcHBsaWVzIGBzaWcuZGVjaXBoZXIoKWAgdG8gYWxsIGZvcm1hdCBVUkwncy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBmb3JtYXRzXG4gKiBAcGFyYW0ge0FycmF5LjxTdHJpbmc+fSB0b2tlbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVidWdcbiAqL1xuc2lnLmRlY2lwaGVyRm9ybWF0cyA9IGZ1bmN0aW9uIChmb3JtYXRzLCB0b2tlbnMsIGRlYnVnKSB7XG4gICAgZm9ybWF0cy5mb3JFYWNoKGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgdmFyIHNpZ25hdHVyZSA9IHRva2VucyAmJiBmb3JtYXQucyA/IHNpZy5kZWNpcGhlcih0b2tlbnMsIGZvcm1hdC5zKSA6IG51bGw7XG4gICAgICAgIHNpZy5zZXREb3dubG9hZFVSTChmb3JtYXQsIHNpZ25hdHVyZSwgZGVidWcpO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBHZXRzIGluZm8gZnJvbSBhIHZpZGVvLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5rXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtGdW5jdGlvbihFcnJvciwgT2JqZWN0KX0gY2FsbGJhY2tcbiAqL1xubW9kdWxlLmV4cG9ydHMuZ2V0SW5mbyA9IGZ1bmN0aW9uIChsaW5rLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICAgIG9wdGlvbnMgPSB7J3F1YWxpdHknOiAwfTtcbiAgICB9IGVsc2UgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7J3F1YWxpdHknOiAwfTtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMucXVhbGl0eSkge1xuICAgICAgICBvcHRpb25zLnF1YWxpdHkgPSAwO1xuICAgIH1cbiAgICB2YXIgaWQgPSB1dGlscy5nZXRWaWRlb0lEKGxpbmspO1xuICAgIGlmIChpZCBpbnN0YW5jZW9mIEVycm9yKSByZXR1cm4gY2FsbGJhY2soaWQpO1xuXG4gICAgLy8gVHJ5IGdldHRpbmcgY29uZmlnIGZyb20gdGhlIHZpZGVvIHBhZ2UgZmlyc3QuXG4gICAgdmFyIHVybCA9IFZJREVPX1VSTCArIGlkICsgJyZobD0nICsgKG9wdGlvbnMubGFuZyB8fCAnZW4nKTtcblxuICAgIHJlcXVlc3QodXJsLCBvcHRpb25zLnJlcXVlc3RPcHRpb25zLCBmdW5jdGlvbiAoZXJyLCByZXMsIGJvZHkpIHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycik7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSBlcnJvcnMgd2l0aCB0aGlzIHZpZGVvIHBhZ2UuXG4gICAgICAgIC8vIHZhciB1bmF2YWlsYWJsZU1zZyA9IHV0aWxzLmJldHdlZW4oYm9keSwgJzxkaXYgaWQ9XCJwbGF5ZXItdW5hdmFpbGFibGVcIicsICc+Jyk7XG4gICAgICAgIC8vIGlmICh1bmF2YWlsYWJsZU1zZyAmJiAhL1xcYmhpZFxcYi8udGVzdCh1dGlscy5iZXR3ZWVuKHVuYXZhaWxhYmxlTXNnLCAnY2xhc3M9XCInLCAnXCInKSkpIHtcbiAgICAgICAgLy8gICAgIC8vIElnbm9yZSBlcnJvciBhYm91dCBhZ2UgcmVzdHJpY3Rpb24uXG4gICAgICAgIC8vICAgICBpZiAoYm9keS5pbmRleE9mKCc8ZGl2IGlkPVwid2F0Y2g3LXBsYXllci1hZ2UtZ2F0ZS1jb250ZW50XCInKSA8IDApIHtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHV0aWxzLmJldHdlZW4oYm9keSxcbiAgICAgICAgLy8gICAgICAgICAgICAgJzxoMSBpZD1cInVuYXZhaWxhYmxlLW1lc3NhZ2VcIiBjbGFzcz1cIm1lc3NhZ2VcIj4nLCAnPC9oMT4nKS50cmltKCkpKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICBnb3RDb25maWcob3B0aW9ucywgdXRpbHMuYmV0d2Vlbihib2R5LCAneXRwbGF5ZXIuY29uZmlnID0gJywgJzt5dHBsYXllci5sb2FkJyksIGNhbGxiYWNrKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEBwYXJhbSB7RnVuY3Rpb24oRXJyb3IsIE9iamVjdCl9IGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIGdvdENvbmZpZyhvcHRpb25zLCBjb25maWcsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFjb25maWcpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgcGxheWVyIGNvbmZpZycpKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgY29uZmlnID0gSlNPTi5wYXJzZShjb25maWcpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdFcnJvciBwYXJzaW5nIGNvbmZpZzogJyArIGVyci5tZXNzYWdlKSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb25maWc6JywgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7XG4gICAgfVxuICAgIHZhciBpbmZvID0gY29uZmlnLmFyZ3M7XG4gICAgaW5mby5mb3JtYXRzID0gdXRpbHMucGFyc2VGb3JtYXRzKGluZm8pO1xuXG4gICAgaWYgKGluZm8uZm9ybWF0cy5zb21lKGZ1bmN0aW9uIChmKSB7XG4gICAgICAgICAgICByZXR1cm4gISFmLnM7XG4gICAgICAgIH0pIHx8IGNvbmZpZy5hcmdzLmRhc2htcGQgfHwgaW5mby5kYXNobXBkIHx8IGluZm8uaGxzdnApIHtcbiAgICAgICAgdmFyIGh0bWw1cGxheWVyZmlsZSA9IHVybGxpYi5yZXNvbHZlKFZJREVPX1VSTCwgY29uZmlnLmFzc2V0cy5qcyk7XG4gICAgICAgIHNpZy5nZXRUb2tlbnMoaHRtbDVwbGF5ZXJmaWxlLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyLCB0b2tlbnMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpO1xuXG4gICAgICAgICAgICBzaWcuZGVjaXBoZXJGb3JtYXRzKGluZm8uZm9ybWF0cywgdG9rZW5zLCBvcHRpb25zLmRlYnVnKTtcblxuICAgICAgICAgICAgdmFyIGZ1bmNzID0gW107XG4gICAgICAgICAgICB2YXIgZGFzaG1wZDtcbiAgICAgICAgICAgIGlmIChjb25maWcuYXJncy5kYXNobXBkKSB7XG4gICAgICAgICAgICAgICAgZGFzaG1wZCA9IGRlY2lwaGVyVVJMKGNvbmZpZy5hcmdzLmRhc2htcGQsIHRva2Vucyk7XG4gICAgICAgICAgICAgICAgZnVuY3MucHVzaChnZXREYXNoTWFuaWZlc3QuYmluZChudWxsLCBkYXNobXBkLCBvcHRpb25zKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbmZvLmRhc2htcGQgJiYgaW5mby5kYXNobXBkICE9PSBjb25maWcuYXJncy5kYXNobXBkKSB7XG4gICAgICAgICAgICAgICAgZGFzaG1wZCA9IGRlY2lwaGVyVVJMKGluZm8uZGFzaG1wZCwgdG9rZW5zKTtcbiAgICAgICAgICAgICAgICBmdW5jcy5wdXNoKGdldERhc2hNYW5pZmVzdC5iaW5kKG51bGwsIGRhc2htcGQsIG9wdGlvbnMpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluZm8uaGxzdnApIHtcbiAgICAgICAgICAgICAgICBpbmZvLmhsc3ZwID0gZGVjaXBoZXJVUkwoaW5mby5obHN2cCwgdG9rZW5zKTtcbiAgICAgICAgICAgICAgICBmdW5jcy5wdXNoKGdldE0zVTguYmluZChudWxsLCBpbmZvLmhsc3ZwLCBvcHRpb25zKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWxzLnBhcmFsbGVsKGZ1bmNzLCBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VGb3JtYXRzKGluZm8sIHJlc3VsdHNbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0c1sxXSkge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZUZvcm1hdHMoaW5mbywgcmVzdWx0c1sxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRzWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlRm9ybWF0cyhpbmZvLCByZXN1bHRzWzJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFpbmZvLmZvcm1hdHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignTm8gZm9ybWF0cyBmb3VuZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBnb3RGb3JtYXRzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFpbmZvLmZvcm1hdHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ1RoaXMgdmlkZW8gaXMgdW5hdmFpbGFibGUnKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2lnLmRlY2lwaGVyRm9ybWF0cyhpbmZvLmZvcm1hdHMsIG51bGwsIG9wdGlvbnMuZGVidWcpO1xuICAgICAgICBnb3RGb3JtYXRzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ290Rm9ybWF0cygpIHtcbiAgICAgICAgaW5mby5mb3JtYXRzLmZvckVhY2godXRpbHMuYWRkRm9ybWF0TWV0YSk7XG4gICAgICAgIGluZm8uZm9ybWF0cy5zb3J0KHV0aWxzLnNvcnRGb3JtYXRzKTtcbiAgICAgICAgZ2V0VXJsQnlRdWFsaXR5KCk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIGluZm8pO1xuICAgIH1cblxuXHRmdW5jdGlvbiBnZXRVcmxCeVF1YWxpdHkoKSB7XG4gICAgICAgIHZhciBjaGVja1ZpZGVvQ29udGFpbmVyID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgcmV0dXJuIFsnbXA0JywgJzNncCddLmluZGV4T2YoZm9ybWF0LmNvbnRhaW5lcikgPj0gMDtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGNoZWNrQXVkaW9Db250YWluZXIgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICByZXR1cm4gWydtNGEnLCAnbXAzJ10uaW5kZXhPZihmb3JtYXQuY29udGFpbmVyKSA+PSAwO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgaGFzaENoZWNrUXVhbGl0eSA9IHtcbiAgICAgICAgICAgICd2aWRlb18wJzogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnaGQ3MjAnLmxvY2FsZUNvbXBhcmUoZm9ybWF0LnF1YWxpdHkpID09PSAwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd2aWRlb18xJzogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnbWVkaXVtJy5sb2NhbGVDb21wYXJlKGZvcm1hdC5xdWFsaXR5KSA9PT0gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndmlkZW9fMic6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3NtYWxsJy5sb2NhbGVDb21wYXJlKGZvcm1hdC5xdWFsaXR5KSA9PT0gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndmlkZW9Pbmx5XzAnOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICc3MjBwJy5sb2NhbGVDb21wYXJlKGZvcm1hdC5xdWFsaXR5X2xhYmVsKSA9PT0gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndmlkZW9Pbmx5XzEnOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICc0ODBwJy5sb2NhbGVDb21wYXJlKGZvcm1hdC5xdWFsaXR5X2xhYmVsKSA9PT0gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndmlkZW9Pbmx5XzInOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICczNjBwJy5sb2NhbGVDb21wYXJlKGZvcm1hdC5xdWFsaXR5X2xhYmVsKSA9PT0gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnYXVkaW9fMCc6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0LmF1ZGlvQml0cmF0ZSA+IDEyODtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnYXVkaW9fMSc6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0LmF1ZGlvQml0cmF0ZSA8PSAxMjggJiYgZm9ybWF0LmF1ZGlvQml0cmF0ZSA+PSA5NjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnYXVkaW9fMic6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0LmF1ZGlvQml0cmF0ZSA8IDk2O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpbmZvLnZpZGVvVXJsID0gbnVsbDtcbiAgICAgICAgaW5mby52aWRlb09ubHlVcmwgPSBudWxsO1xuICAgICAgICBpbmZvLmF1ZGlvVXJsID0gbnVsbDtcbiAgICAgICAgaW5mby52aWRlb3MgPSBbXTtcbiAgICAgICAgaW5mby5hdWRpb3MgPSBbXTtcbiAgICAgICAgaW5mby52aWRlb3NPbmx5ID0gW107XG4gICAgICAgIHZhciB2aWRlbyA9IG51bGw7XG4gICAgICAgIHZhciB2aWRlb09ubHkgPSBudWxsO1xuICAgICAgICB2YXIgYXVkaW8gPSBudWxsO1xuICAgICAgICB2YXIgcXVhbGl0eSA9IG9wdGlvbnMucXVhbGl0eTtcbiAgICAgICAgaW5mby5mb3JtYXRzLmZvckVhY2goZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgaWYgKGZvcm1hdC5lbmNvZGluZyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5hdWRpb0VuY29kaW5nICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5mby52aWRlb3MucHVzaChmb3JtYXQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tWaWRlb0NvbnRhaW5lcihmb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmlkZW8gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZGVvID0gZm9ybWF0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8udmlkZW9VcmwgPT0gbnVsbCAmJiBoYXNoQ2hlY2tRdWFsaXR5Wyd2aWRlb18nICsgcXVhbGl0eV0oZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8udmlkZW9VcmwgPSBmb3JtYXQudXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5mby52aWRlb3NPbmx5LnB1c2goZm9ybWF0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrVmlkZW9Db250YWluZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZpZGVvT25seSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlkZW9Pbmx5ID0gZm9ybWF0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8udmlkZW9Pbmx5VXJsID09IG51bGwgJiYgaGFzaENoZWNrUXVhbGl0eVsndmlkZW9Pbmx5XycgKyBxdWFsaXR5XShmb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mby52aWRlb09ubHlVcmwgPSBmb3JtYXQudXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmZvLmF1ZGlvcy5wdXNoKGZvcm1hdCk7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrQXVkaW9Db250YWluZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXVkaW8gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXVkaW8gPSBmb3JtYXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8uYXVkaW9VcmwgPT0gbnVsbCAmJiBoYXNoQ2hlY2tRdWFsaXR5WydhdWRpb18nICsgcXVhbGl0eV0oZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5hdWRpb1VybCA9IGZvcm1hdC51cmw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaW5mby52aWRlb1VybCA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodmlkZW8gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGluZm8udmlkZW9VcmwgPSB2aWRlby51cmw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGluZm8udmlkZW9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpbmZvLnZpZGVvVXJsID0gaW5mby52aWRlb3NbMF0udXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmZvLnZpZGVvT25seVVybCA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodmlkZW9Pbmx5ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpbmZvLnZpZGVvT25seVVybCA9IHZpZGVvT25seS51cmw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGluZm8udmlkZW9zT25seS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaW5mby52aWRlb09ubHlVcmwgPSBpbmZvLnZpZGVvc09ubHlbMF0udXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmZvLmF1ZGlvVXJsID09IG51bGwgJiYgYXVkaW8gIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGF1ZGlvICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpbmZvLmF1ZGlvVXJsID0gYXVkaW8udXJsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmZvLmF1ZGlvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaW5mby5hdWRpb1VybCA9IGluZm8uYXVkaW9zWzBdLnVybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge0FycmF5LjxTdHJpbmc+fSB0b2tlbnNcbiAqL1xuZnVuY3Rpb24gZGVjaXBoZXJVUkwodXJsLCB0b2tlbnMpIHtcbiAgICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcL3NcXC8oW2EtZkEtRjAtOVxcLl0rKS8sIGZ1bmN0aW9uIChfLCBzKSB7XG4gICAgICAgIHJldHVybiAnL3NpZ25hdHVyZS8nICsgc2lnLmRlY2lwaGVyKHRva2Vucywgcyk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogTWVyZ2VzIGZvcm1hdHMgZnJvbSBEQVNIIG9yIE0zVTggd2l0aCBmb3JtYXRzIGZyb20gdmlkZW8gaW5mbyBwYWdlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbmZvXG4gKiBAcGFyYW0ge09iamVjdH0gZm9ybWF0c01hcFxuICovXG5mdW5jdGlvbiBtZXJnZUZvcm1hdHMoaW5mbywgZm9ybWF0c01hcCkge1xuICAgIGluZm8uZm9ybWF0cy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XG4gICAgICAgIHZhciBjZiA9IGZvcm1hdHNNYXBbZi5pdGFnXTtcbiAgICAgICAgaWYgKGNmKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZikge1xuICAgICAgICAgICAgICAgIGNmW2tleV0gPSBmW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtYXRzTWFwW2YuaXRhZ10gPSBmO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaW5mby5mb3JtYXRzID0gW107XG4gICAgZm9yICh2YXIgaXRhZyBpbiBmb3JtYXRzTWFwKSB7XG4gICAgICAgIGluZm8uZm9ybWF0cy5wdXNoKGZvcm1hdHNNYXBbaXRhZ10pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBHZXRzIGFkZGl0aW9uYWwgREFTSCBmb3JtYXRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Z1bmN0aW9uKCFFcnJvciwgQXJyYXkuPE9iamVjdD4pfSBjYWxsYmFja1xuICovXG5mdW5jdGlvbiBnZXREYXNoTWFuaWZlc3QodXJsLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciBmb3JtYXRzID0ge307XG4gICAgdmFyIGN1cnJlbnRGb3JtYXQgPSBudWxsO1xuICAgIHZhciBleHBlY3RVcmwgPSBmYWxzZTtcblxuICAgIHZhciBwYXJzZXIgPSBzYXgucGFyc2VyKGZhbHNlKTtcbiAgICBwYXJzZXIub25lcnJvciA9IGNhbGxiYWNrO1xuICAgIHBhcnNlci5vbm9wZW50YWcgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5uYW1lID09PSAnUkVQUkVTRU5UQVRJT04nKSB7XG4gICAgICAgICAgICB2YXIgaXRhZyA9IG5vZGUuYXR0cmlidXRlcy5JRDtcbiAgICAgICAgICAgIGN1cnJlbnRGb3JtYXQgPSB7aXRhZzogaXRhZ307XG4gICAgICAgICAgICBmb3JtYXRzW2l0YWddID0gY3VycmVudEZvcm1hdDtcbiAgICAgICAgfVxuICAgICAgICBleHBlY3RVcmwgPSBub2RlLm5hbWUgPT09ICdCQVNFVVJMJztcbiAgICB9O1xuICAgIHBhcnNlci5vbnRleHQgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgICAgICBpZiAoZXhwZWN0VXJsKSB7XG4gICAgICAgICAgICBjdXJyZW50Rm9ybWF0LnVybCA9IHRleHQ7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHBhcnNlci5vbmVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgZm9ybWF0cyk7XG4gICAgfTtcblxuICAgIHZhciByZXEgPSByZXF1ZXN0KHVybGxpYi5yZXNvbHZlKFZJREVPX1VSTCwgdXJsKSwgb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyk7XG4gICAgcmVxLm9uKCdlcnJvcicsIGNhbGxiYWNrKTtcbiAgICByZXEuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgICByZXEub24oJ2Vycm9yJywgY2FsbGJhY2spO1xuICAgIHJlcS5vbignZGF0YScsIGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgICBwYXJzZXIud3JpdGUoY2h1bmspO1xuICAgIH0pO1xuICAgIHJlcS5vbignZW5kJywgcGFyc2VyLmNsb3NlLmJpbmQocGFyc2VyKSk7XG59XG5cbi8qKlxuICogR2V0cyBhZGRpdGlvbmFsIGZvcm1hdHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb24oIUVycm9yLCBBcnJheS48T2JqZWN0Pil9IGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIGdldE0zVTgodXJsLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHVybCA9IHVybGxpYi5yZXNvbHZlKFZJREVPX1VSTCwgdXJsKTtcbiAgICByZXF1ZXN0KHVybCwgb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucywgZnVuY3Rpb24gKGVyciwgcmVzLCBib2R5KSB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpO1xuXG4gICAgICAgIHZhciBmb3JtYXRzID0ge307XG4gICAgICAgIGJvZHlcbiAgICAgICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gL2h0dHBzPzpcXC9cXC8vLnRlc3QobGluZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRhZyA9IGxpbmUubWF0Y2goL1xcL2l0YWdcXC8oXFxkKylcXC8vKVsxXTtcbiAgICAgICAgICAgICAgICBmb3JtYXRzW2l0YWddID0ge2l0YWc6IGl0YWcsIHVybDogbGluZX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgZm9ybWF0cyk7XG4gICAgfSk7XG59Il19