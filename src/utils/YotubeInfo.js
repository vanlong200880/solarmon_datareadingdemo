const urllib = require('url');
const sax = require('sax');
const request = require('miniget');
const qs = require('querystring');

const VIDEO_URL = 'https://www.youtube.com/watch?v=';
const FORMATS = {5:{container:"flv",resolution:"240p",encoding:"Sorenson H.283",profile:null,bitrate:"0.25",audioEncoding:"mp3",audioBitrate:64},6:{container:"flv",resolution:"270p",encoding:"Sorenson H.263",profile:null,bitrate:"0.8",audioEncoding:"mp3",audioBitrate:64},13:{container:"3gp",resolution:null,encoding:"MPEG-4 Visual",profile:null,bitrate:"0.5",audioEncoding:"aac",audioBitrate:null},17:{container:"3gp",resolution:"144p",encoding:"MPEG-4 Visual",profile:"simple",bitrate:"0.05",audioEncoding:"aac",audioBitrate:24},18:{container:"mp4",resolution:"360p",encoding:"H.264",profile:"baseline",bitrate:"0.5",audioEncoding:"aac",audioBitrate:96},22:{container:"mp4",resolution:"720p",encoding:"H.264",profile:"high",bitrate:"2-3",audioEncoding:"aac",audioBitrate:192},34:{container:"flv",resolution:"360p",encoding:"H.264",profile:"main",bitrate:"0.5",audioEncoding:"aac",audioBitrate:128},35:{container:"flv",resolution:"480p",encoding:"H.264",profile:"main",bitrate:"0.8-1",audioEncoding:"aac",audioBitrate:128},36:{container:"3gp",resolution:"240p",encoding:"MPEG-4 Visual",profile:"simple",bitrate:"0.175",audioEncoding:"aac",audioBitrate:32},37:{container:"mp4",resolution:"1080p",encoding:"H.264",profile:"high",bitrate:"3-5.9",audioEncoding:"aac",audioBitrate:192},38:{container:"mp4",resolution:"3072p",encoding:"H.264",profile:"high",bitrate:"3.5-5",audioEncoding:"aac",audioBitrate:192},43:{container:"webm",resolution:"360p",encoding:"VP8",profile:null,bitrate:"0.5-0.75",audioEncoding:"vorbis",audioBitrate:128},44:{container:"webm",resolution:"480p",encoding:"VP8",profile:null,bitrate:"1",audioEncoding:"vorbis",audioBitrate:128},45:{container:"webm",resolution:"720p",encoding:"VP8",profile:null,bitrate:"2",audioEncoding:"vorbis",audioBitrate:192},46:{container:"webm",resolution:"1080p",encoding:"vp8",profile:null,bitrate:null,audioEncoding:"vorbis",audioBitrate:192},82:{container:"mp4",resolution:"360p",encoding:"H.264",profile:"3d",bitrate:"0.5",audioEncoding:"aac",audioBitrate:96},83:{container:"mp4",resolution:"240p",encoding:"H.264",profile:"3d",bitrate:"0.5",audioEncoding:"aac",audioBitrate:96},84:{container:"mp4",resolution:"720p",encoding:"H.264",profile:"3d",bitrate:"2-3",audioEncoding:"aac",audioBitrate:192},85:{container:"mp4",resolution:"1080p",encoding:"H.264",profile:"3d",bitrate:"3-4",audioEncoding:"aac",audioBitrate:192},100:{container:"webm",resolution:"360p",encoding:"VP8",profile:"3d",bitrate:null,audioEncoding:"vorbis",audioBitrate:128},101:{container:"webm",resolution:"360p",encoding:"VP8",profile:"3d",bitrate:null,audioEncoding:"vorbis",audioBitrate:192},102:{container:"webm",resolution:"720p",encoding:"VP8",profile:"3d",bitrate:null,audioEncoding:"vorbis",audioBitrate:192},133:{container:"mp4",resolution:"240p",encoding:"H.264",profile:"main",bitrate:"0.2-0.3",audioEncoding:null,audioBitrate:null},134:{container:"mp4",resolution:"360p",encoding:"H.264",profile:"main",bitrate:"0.3-0.4",audioEncoding:null,audioBitrate:null},135:{container:"mp4",resolution:"480p",encoding:"H.264",profile:"main",bitrate:"0.5-1",audioEncoding:null,audioBitrate:null},136:{container:"mp4",resolution:"720p",encoding:"H.264",profile:"main",bitrate:"1-1.5",audioEncoding:null,audioBitrate:null},137:{container:"mp4",resolution:"1080p",encoding:"H.264",profile:"high",bitrate:"2.5-3",audioEncoding:null,audioBitrate:null},138:{container:"mp4",resolution:"4320p",encoding:"H.264",profile:"high",bitrate:"13.5-25",audioEncoding:null,audioBitrate:null},160:{container:"mp4",resolution:"144p",encoding:"H.264",profile:"main",bitrate:"0.1",audioEncoding:null,audioBitrate:null},242:{container:"webm",resolution:"240p",encoding:"VP9",profile:"profile 0",bitrate:"0.1-0.2",audioEncoding:null,audioBitrate:null},243:{container:"webm",resolution:"360p",encoding:"VP9",profile:"profile 0",bitrate:"0.25",audioEncoding:null,audioBitrate:null},244:{container:"webm",resolution:"480p",encoding:"VP9",profile:"profile 0",bitrate:"0.5",audioEncoding:null,audioBitrate:null},247:{container:"webm",resolution:"720p",encoding:"VP9",profile:"profile 0",bitrate:"0.7-0.8",audioEncoding:null,audioBitrate:null},248:{container:"webm",resolution:"1080p",encoding:"VP9",profile:"profile 0",bitrate:"1.5",audioEncoding:null,audioBitrate:null},264:{container:"mp4",resolution:"1440p",encoding:"H.264",profile:"high",bitrate:"4-4.5",audioEncoding:null,audioBitrate:null},266:{container:"mp4",resolution:"2160p",encoding:"H.264",profile:"high",bitrate:"12.5-16",audioEncoding:null,audioBitrate:null},271:{container:"webm",resolution:"1440p",encoding:"VP9",profile:"profle 0",bitrate:"9",audioEncoding:null,audioBitrate:null},272:{container:"webm",resolution:"4320p",encoding:"VP9",profile:"profile 0",bitrate:"20-25",audioEncoding:null,audioBitrate:null},278:{container:"webm",resolution:"144p 15fps",encoding:"VP9",profile:"profile 0",bitrate:"0.08",audioEncoding:null,audioBitrate:null},298:{container:"mp4",resolution:"720p",encoding:"H.264",profile:"main",bitrate:"3-3.5",audioEncoding:null,audioBitrate:null},299:{container:"mp4",resolution:"1080p",encoding:"H.264",profile:"high",bitrate:"5.5",audioEncoding:null,audioBitrate:null},302:{container:"webm",resolution:"720p HFR",encoding:"VP9",profile:"profile 0",bitrate:"2.5",audioEncoding:null,audioBitrate:null},303:{container:"webm",resolution:"1080p HFR",encoding:"VP9",profile:"profile 0",bitrate:"5",audioEncoding:null,audioBitrate:null},308:{container:"webm",resolution:"1440p HFR",encoding:"VP9",profile:"profile 0",bitrate:"10",audioEncoding:null,audioBitrate:null},313:{container:"webm",resolution:"2160p",encoding:"VP9",profile:"profile 0",bitrate:"13-15",audioEncoding:null,audioBitrate:null},315:{container:"webm",resolution:"2160p HFR",encoding:"VP9",profile:"profile 0",bitrate:"20-25",audioEncoding:null,audioBitrate:null},330:{container:"webm",resolution:"144p HDR, HFR",encoding:"VP9",profile:"profile 2",bitrate:"0.08",audioEncoding:null,audioBitrate:null},331:{container:"webm",resolution:"240p HDR, HFR",encoding:"VP9",profile:"profile 2",bitrate:"0.1-0.15",audioEncoding:null,audioBitrate:null},332:{container:"webm",resolution:"360p HDR, HFR",encoding:"VP9",profile:"profile 2",bitrate:"0.25",audioEncoding:null,audioBitrate:null},333:{container:"webm",resolution:"240p HDR, HFR",encoding:"VP9",profile:"profile 2",bitrate:"0.5",audioEncoding:null,audioBitrate:null},334:{container:"webm",resolution:"720p HDR, HFR",encoding:"VP9",profile:"profile 2",bitrate:"1",audioEncoding:null,audioBitrate:null},335:{container:"webm",resolution:"1080p HDR, HFR",encoding:"VP9",profile:"profile 2",bitrate:"1.5-2",audioEncoding:null,audioBitrate:null},336:{container:"webm",resolution:"1440p HDR, HFR",encoding:"VP9",profile:"profile 2",bitrate:"5-7",audioEncoding:null,audioBitrate:null},337:{container:"webm",resolution:"2160p HDR, HFR",encoding:"VP9",profile:"profile 2",bitrate:"12-14",audioEncoding:null,audioBitrate:null},139:{container:"mp4",resolution:null,encoding:null,profile:null,bitrate:null,audioEncoding:"aac",audioBitrate:48},140:{container:"m4a",resolution:null,encoding:null,profile:null,bitrate:null,audioEncoding:"aac",audioBitrate:128},141:{container:"mp4",resolution:null,encoding:null,profile:null,bitrate:null,audioEncoding:"aac",audioBitrate:256},171:{container:"webm",resolution:null,encoding:null,profile:null,bitrate:null,audioEncoding:"vorbis",audioBitrate:128},172:{container:"webm",resolution:null,encoding:null,profile:null,bitrate:null,audioEncoding:"vorbis",audioBitrate:192},249:{container:"webm",resolution:null,encoding:null,profile:null,bitrate:null,audioEncoding:"opus",audioBitrate:48},250:{container:"webm",resolution:null,encoding:null,profile:null,bitrate:null,audioEncoding:"opus",audioBitrate:64},251:{container:"webm",resolution:null,encoding:null,profile:null,bitrate:null,audioEncoding:"opus",audioBitrate:160},91:{container:"ts",resolution:"144p",encoding:"H.264",profile:"main",bitrate:"0.1",audioEncoding:"aac",audioBitrate:48},92:{container:"ts",resolution:"240p",encoding:"H.264",profile:"main",bitrate:"0.15-0.3",audioEncoding:"aac",audioBitrate:48},93:{container:"ts",resolution:"360p",encoding:"H.264",profile:"main",bitrate:"0.5-1",audioEncoding:"aac",audioBitrate:128},94:{container:"ts",resolution:"480p",encoding:"H.264",profile:"main",bitrate:"0.8-1.25",audioEncoding:"aac",audioBitrate:128},95:{container:"ts",resolution:"720p",encoding:"H.264",profile:"main",bitrate:"1.5-3",audioEncoding:"aac",audioBitrate:256},96:{container:"ts",resolution:"1080p",encoding:"H.264",profile:"high",bitrate:"2.5-6",audioEncoding:"aac",audioBitrate:256},120:{container:"flv",resolution:"720p",encoding:"H.264",profile:"Main@L3.1",bitrate:"2",audioEncoding:"aac",audioBitrate:128},127:{container:"ts",resolution:null,encoding:null,profile:null,bitrate:null,audioEncoding:"aac",audioBitrate:96},128:{container:"ts",resolution:null,encoding:null,profile:null,bitrate:null,audioEncoding:"aac",audioBitrate:96},132:{container:"ts",resolution:"240p",encoding:"H.264",profile:"baseline",bitrate:"0.15-0.2",audioEncoding:"aac",audioBitrate:48},151:{container:"ts",resolution:"720p",encoding:"H.264",profile:"baseline",bitrate:"0.05",audioEncoding:"aac",audioBitrate:24}};

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
    if (parsed.hostname === 'youtu.be' ||
        (parsed.hostname === 'youtube.com' ||
            parsed.hostname === 'www.youtube.com') && !id) {
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
        formats = formats
            .concat(info.url_encoded_fmt_stream_map.split(','));
    }
    if (info.adaptive_fmts) {
        formats = formats.concat(info.adaptive_fmts.split(','));
    }

    formats = formats
        .map(function (format) {
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
    "set": function (key, value) {
        this.store[key] = value;
    },

    /**
     * @param {String} key
     * @return {Object}
     */
    "get": function (key) {
        return this.store[key];
    },

    /**
     * Empties the cache.
     */
    "reset": function () {
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
    var rs = /(?:html5)?player[-_]([a-zA-Z0-9\-_]+)(?:\.js|\/)/
        .exec(html5playerfile);
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
var reverseStr = ':function\\(a\\)\\{' +
    '(?:return )?a\\.reverse\\(\\)' +
    '\\}';
var sliceStr = ':function\\(a,b\\)\\{' +
    'return a\\.slice\\(b\\)' +
    '\\}';
var spliceStr = ':function\\(a,b\\)\\{' +
    'a\\.splice\\(0,b\\)' +
    '\\}';
var swapStr = ':function\\(a,b\\)\\{' +
    'var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b\\]=c(?:;return a)?' +
    '\\}';
var actionsObjRegexp = new RegExp(
    'var (' + jsVarStr + ')=\\{((?:(?:' +
    jsKeyStr + reverseStr + '|' +
    jsKeyStr + sliceStr + '|' +
    jsKeyStr + spliceStr + '|' +
    jsKeyStr + swapStr +
    '),?\\n?)+)\\};'
);
var actionsFuncRegexp = new RegExp('function(?: ' + jsVarStr + ')?\\(a\\)\\{' +
    'a=a\\.split\\(' + jsEmptyStr + '\\);\\s*' +
    '((?:(?:a=)?' + jsVarStr +
    jsPropStr +
    '\\(a,\\d+\\);)+)' +
    'return a\\.join\\(' + jsEmptyStr + '\\)' +
    '\\}'
);
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
    var reverseKey = result && result[1]
        .replace(/\$/g, '\\$')
        .replace(/\$|^'|^"|'$|"$/g, '');
    result = sliceRegexp.exec(objBody);
    var sliceKey = result && result[1]
        .replace(/\$/g, '\\$')
        .replace(/\$|^'|^"|'$|"$/g, '');
    result = spliceRegexp.exec(objBody);
    var spliceKey = result && result[1]
        .replace(/\$/g, '\\$')
        .replace(/\$|^'|^"|'$|"$/g, '');
    result = swapRegexp.exec(objBody);
    var swapKey = result && result[1]
        .replace(/\$/g, '\\$')
        .replace(/\$|^'|^"|'$|"$/g, '');

    var keys = '(' + [reverseKey, sliceKey, spliceKey, swapKey].join('|') + ')';
    var myreg = '(?:a=)?' + obj +
        '(?:\\.' + keys + '|\\[\'' + keys + '\'\\]|\\["' + keys + '"\\])' +
        '\\(a,(\\d+)\\)';
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
        options = {'quality': 0};
    } else if (!options) {
        options = {'quality': 0};
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
        var checkVideoContainer = function (format) {
            return ['mp4', '3gp'].indexOf(format.container) >= 0;
        };
        var checkAudioContainer = function (format) {
            return ['m4a', 'mp3'].indexOf(format.container) >= 0;
        };
        var hashCheckQuality = {
            'video_0': function (format) {
                return 'hd720'.localeCompare(format.quality) === 0;
            },
            'video_1': function (format) {
                return 'medium'.localeCompare(format.quality) === 0;
            },
            'video_2': function (format) {
                return 'small'.localeCompare(format.quality) === 0;
            },
            'videoOnly_0': function (format) {
                return '720p'.localeCompare(format.quality_label) === 0;
            },
            'videoOnly_1': function (format) {
                return '480p'.localeCompare(format.quality_label) === 0;
            },
            'videoOnly_2': function (format) {
                return '360p'.localeCompare(format.quality_label) === 0;
            },
            'audio_0': function (format) {
                return format.audioBitrate > 128;
            },
            'audio_1': function (format) {
                return format.audioBitrate <= 128 && format.audioBitrate >= 96;
            },
            'audio_2': function (format) {
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
            currentFormat = {itag: itag};
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
        body
            .split('\n')
            .filter(function (line) {
                return /https?:\/\//.test(line);
            })
            .forEach(function (line) {
                var itag = line.match(/\/itag\/(\d+)\//)[1];
                formats[itag] = {itag: itag, url: line};
            });
        callback(null, formats);
    });
}