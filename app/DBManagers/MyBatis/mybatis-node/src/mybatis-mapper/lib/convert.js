'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var convertChildren = function convertChildren(children, param, namespace, myBatisMapper) {
  if (param == null) {
    param = {};
  }
  if (!isDict(param)) {
    throw new Error("Parameter argument should be Key-Value type or Null.");
  }

  if (children.type == 'text') {
    // Convert Parameters
    return convertParameters(children, param);
  } else if (children.type == 'tag') {
    switch (children.name.toLowerCase()) {
      case 'if':
        return convertIf(children, param);
        break;
      case 'choose':
        return convertChoose(children, param);
        break;
      case 'trim':
      case 'where':
        return convertTrimWhere(children, param);
        break;
      case 'set':
        return convertSet(children, param);
        break;
      case 'foreach':
        return convertForeach(children, param);
        break;
      case 'bind':
        param = convertBind(children, param);
        return '';
        break;
      case 'include':
        return convertInclude(children, param, namespace, myBatisMapper);
      default:
        throw new Error("XML is not well-formed character or markup. Consider using CDATA section.");
        break;
    }
  } else {
    return '';
  }
};

var convertParameters = function convertParameters(children, param) {
  var convertString = children.content;

  try {
    var keyString = '';
    if (param !== null && Object.keys(param).length != 0) {
      convertString = recursiveParameters(convertString, param, keyString);
    }
  } catch (err) {
    throw new Error("Error occurred during convert parameters.");
  }

  try {
    // convert CDATA string
    convertString = convertString.replace(/(\&amp\;)/g, '&');
    convertString = convertString.replace(/(\&lt\;)/g, '<');
    convertString = convertString.replace(/(\&gt\;)/g, '>');
    convertString = convertString.replace(/(\&quot\;)/g, '"');
  } catch (err) {
    throw new Error("Error occurred during convert CDATA section.");
  }

  return convertString;
};

var recursiveParameters = function recursiveParameters(convertString, param, keyString) {
  var keyDict = Object.keys(param);

  for (var i = 0, key; key = keyDict[i]; i++) {
    if (isDict(param[key])) {
      var nextKeyString = keyString + key + '\\.';
      convertString = recursiveParameters(convertString, param[key], nextKeyString);
    } else {
      if (param[key] == null || param[key] == undefined) {
        var reg = new RegExp('\\#{' + (keyString + key) + '}', 'g');

        var tempParamKey = 'NULL';
        convertString = convertString.replace(reg, tempParamKey);
      } else {
        var reg = new RegExp('\\#{' + (keyString + key) + '}', 'g');

        // var tempParamKey = (param[key] + '').replace(/"/g, '\\\"');
        // tempParamKey = tempParamKey.replace(/'/g, '\\\'');     
        var tempParamKey = pool.escape(param[key]);
        // convertString = convertString.replace(reg, "'" + tempParamKey + "'");
        convertString = convertString.replace(reg, tempParamKey);
      }

      var reg = new RegExp('\\${' + (keyString + key) + '}', 'g');
      var tempParamKey = param[key] + '';
      // var tempParamKey = pool.escape(param[key]);
      convertString = convertString.replace(reg, tempParamKey);
    }
  }

  return convertString;
};

var convertIf = function convertIf(children, param) {
  try {
    var evalString = children.attrs.test;

    // Create Evaluate string
    evalString = replaceEvalString(evalString, param);

    evalString = evalString.replace(/ and /gi, ' && ');
    evalString = evalString.replace(/ or /gi, ' || ');

    // replace == to === for strict evaluate
    evalString = evalString.replace(/==/g, "===");
    evalString = evalString.replace(/!=/g, "!==");
  } catch (err) {
    throw new Error("Error occurred during convert <if> element.");
  }

  // Execute Evaluate string
  try {
    if (eval(evalString)) {
      var convertString = '';
      for (var i = 0, nextChildren; nextChildren = children['children'][i]; i++) {
        convertString += convertChildren(nextChildren, param);
      }
      return convertString;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
};

var convertForeach = function convertForeach(children, param) {
  try {
    var collection = eval('param.' + children.attrs.collection);
    var item = children.attrs.item;
    var open = children.attrs.open == null ? '' : children.attrs.open;
    var close = children.attrs.close == null ? '' : children.attrs.close;
    var separator = children.attrs.separator == null ? '' : children.attrs.separator;

    var foreachTexts = [];
    for (var j = 0, coll; coll = collection[j]; j++) {
      var foreachParam = param;
      foreachParam[item] = coll;

      var foreachText = '';
      for (var k = 0, nextChildren; nextChildren = children.children[k]; k++) {
        var fText = convertChildren(nextChildren, foreachParam);
        fText = fText.replace(/^\s*$/g, '');

        if (fText != null && fText.length > 0) {
          foreachText += fText;
        }
      }

      if (foreachText != null && foreachText.length > 0) {
        foreachTexts.push(foreachText);
      }
    }

    return open + foreachTexts.join(separator) + close;
  } catch (err) {
    throw new Error("Error occurred during convert <foreach> element.");
  }
};

var convertChoose = function convertChoose(children, param) {
  try {
    for (var i = 0, whenChildren; whenChildren = children.children[i]; i++) {
      if (whenChildren.type == 'tag' && whenChildren.name.toLowerCase() == 'when') {
        var evalString = whenChildren.attrs.test;

        // Create Evaluate string
        evalString = replaceEvalString(evalString, param);

        evalString = evalString.replace(/ and /gi, ' && ');
        evalString = evalString.replace(/ or /gi, ' || ');

        // Execute Evaluate string
        try {
          if (eval(evalString)) {
            // If <when> condition is true, do it.
            var convertString = '';
            for (var k = 0, nextChildren; nextChildren = whenChildren.children[k]; k++) {
              convertString += convertChildren(nextChildren, param);
            }
            return convertString;
          } else {
            continue;
          }
        } catch (e) {
          continue;
        }
      } else if (whenChildren.type == 'tag' && whenChildren.name.toLowerCase() == 'otherwise') {
        // If reached <otherwise> tag, do it.
        var convertString = '';
        for (var k = 0, nextChildren; nextChildren = whenChildren.children[k]; k++) {
          convertString += convertChildren(nextChildren, param);
        }
        return convertString;
      }
    }

    // If there is no suitable when and otherwise, just return null.
    return '';
  } catch (err) {
    throw new Error("Error occurred during convert <choose> element.");
  }
};

var convertTrimWhere = function convertTrimWhere(children, param) {
  var convertString = '';
  var prefix = null;
  var prefixOverrides = null;
  var globalSet = null;

  try {
    switch (children.name.toLowerCase()) {
      case 'trim':
        prefix = children.attrs.prefix;
        prefixOverrides = children.attrs.prefixOverrides;
        globalSet = 'g';
        break;
      case 'where':
        prefix = 'WHERE';
        prefixOverrides = 'and|or';
        globalSet = 'gi';
        break;
      default:
        throw new Error("Error occurred during convert <trim/where> element.");
        break;
    }

    // Convert children first.
    for (var j = 0, nextChildren; nextChildren = children.children[j]; j++) {
      convertString += convertChildren(nextChildren, param);
    }

    // Remove prefixOverrides
    var trimRegex = new RegExp('(^)([\\s]*?)(' + prefixOverrides + ')', globalSet);
    convertString = convertString.replace(trimRegex, '');

    if (children.name.toLowerCase() != 'trim') {
      var trimRegex = new RegExp('(' + prefixOverrides + ')([\\s]*?)($)', globalSet);
      convertString = convertString.replace(trimRegex, '');
    }

    // Add Prefix if String is not empty.
    var trimRegex = new RegExp('([a-zA-Z])', 'g');
    var w = convertString.match(trimRegex);

    if (w != null && w.length > 0) {
      convertString = prefix + ' ' + convertString;
    }

    // Remove comma(,) before WHERE
    if (children.name.toLowerCase() != 'where') {
      var regex = new RegExp('(,)([\\s]*?)(where)', 'gi');
      convertString = convertString.replace(regex, ' WHERE ');
    }

    return convertString;
  } catch (err) {
    throw new Error("Error occurred during convert <" + children.name.toLowerCase() + "> element.");
  }
};

var convertSet = function convertSet(children, param) {
  var convertString = '';

  try {
    // Convert children first.
    for (var j = 0, nextChildren; nextChildren = children.children[j]; j++) {
      convertString += convertChildren(nextChildren, param);
    }

    // Remove comma repeated more than 2.
    var regex = new RegExp('(,)(,|\\s){2,}', 'g');
    convertString = convertString.replace(regex, ',\n');

    // Remove first comma if exists.
    var regex = new RegExp('(^)([\\s]*?)(,)', 'g');
    convertString = convertString.replace(regex, '');

    // Remove last comma if exists.
    regex = new RegExp('(,)([\\s]*?)($)', 'g');
    convertString = convertString.replace(regex, '');

    convertString = ' SET ' + convertString;
    return convertString;
  } catch (err) {
    throw new Error("Error occurred during convert <set> element.");
  }
};

var convertBind = function convertBind(children, param) {
  var evalString = children.attrs.value;

  // Create Evaluate string
  evalString = replaceEvalString(evalString, param);

  param[children.attrs.name] = eval(evalString);

  return param;
};

var convertInclude = function convertInclude(children, param, namespace, myBatisMapper) {

  try {
    // Add Properties to param
    for (var j = 0, nextChildren; nextChildren = children.children[j]; j++) {
      if (nextChildren.type == 'tag' && nextChildren.name == 'property') {
        param[nextChildren.attrs['name']] = nextChildren.attrs['value'];
      }
    }
  } catch (err) {
    throw new Error("Error occurred during read <property> element in <include> element.");
  }

  try {
    // Convert refid
    var refid = recursiveParameters(children['attrs']['refid'], param, '');

    var statement = '';
    for (var i = 0, children; children = myBatisMapper[namespace][refid][i]; i++) {
      statement += convertChildren(children, param, namespace, myBatisMapper);
    }
  } catch (err) {
    throw new Error("Error occurred during convert 'refid' attribute in <include> element.");
  }

  return statement;
};

var isDict = function isDict(v) {
  return (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);
};

var replaceEvalString = function replaceEvalString(evalString, param) {
  var keys = Object.keys(param);

  for (var i = 0; i < keys.length; i++) {
    var replacePrefix = '';
    var replacePostfix = '';
    var paramRegex = null;

    if (isDict(param[keys[i]])) {
      replacePrefix = ' param.';
      replacePostfix = '';

      paramRegex = new RegExp('(^|[^a-zA-Z0-9_])(' + keys[i] + '\\.)([a-zA-Z0-9_]+)', 'g');
    } else {
      replacePrefix = ' param.';
      replacePostfix = ' ';

      paramRegex = new RegExp('(^|[^a-zA-Z0-9_])(' + keys[i] + ')($|[^a-zA-Z0-9_])', 'g');
    }

    evalString = evalString.replace(paramRegex, "$1" + replacePrefix + "$2" + replacePostfix + "$3");
  }

  return evalString;
};

module.exports = {
  convertChildren: convertChildren,
  convertParameters: convertParameters,
  convertIf: convertIf,
  convertTrimWhere: convertTrimWhere,
  convertSet: convertSet,
  convertForeach: convertForeach,
  convertChoose: convertChoose,
  convertBind: convertBind
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9EQk1hbmFnZXJzL015QmF0aXMvbXliYXRpcy1ub2RlL3NyYy9teWJhdGlzLW1hcHBlci9saWIvY29udmVydC5qcyJdLCJuYW1lcyI6WyJjb252ZXJ0Q2hpbGRyZW4iLCJjaGlsZHJlbiIsInBhcmFtIiwibmFtZXNwYWNlIiwibXlCYXRpc01hcHBlciIsImlzRGljdCIsIkVycm9yIiwidHlwZSIsImNvbnZlcnRQYXJhbWV0ZXJzIiwibmFtZSIsInRvTG93ZXJDYXNlIiwiY29udmVydElmIiwiY29udmVydENob29zZSIsImNvbnZlcnRUcmltV2hlcmUiLCJjb252ZXJ0U2V0IiwiY29udmVydEZvcmVhY2giLCJjb252ZXJ0QmluZCIsImNvbnZlcnRJbmNsdWRlIiwiY29udmVydFN0cmluZyIsImNvbnRlbnQiLCJrZXlTdHJpbmciLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwicmVjdXJzaXZlUGFyYW1ldGVycyIsImVyciIsInJlcGxhY2UiLCJrZXlEaWN0IiwiaSIsImtleSIsIm5leHRLZXlTdHJpbmciLCJ1bmRlZmluZWQiLCJyZWciLCJSZWdFeHAiLCJ0ZW1wUGFyYW1LZXkiLCJwb29sIiwiZXNjYXBlIiwiZXZhbFN0cmluZyIsImF0dHJzIiwidGVzdCIsInJlcGxhY2VFdmFsU3RyaW5nIiwiZXZhbCIsIm5leHRDaGlsZHJlbiIsImUiLCJjb2xsZWN0aW9uIiwiaXRlbSIsIm9wZW4iLCJjbG9zZSIsInNlcGFyYXRvciIsImZvcmVhY2hUZXh0cyIsImoiLCJjb2xsIiwiZm9yZWFjaFBhcmFtIiwiZm9yZWFjaFRleHQiLCJrIiwiZlRleHQiLCJwdXNoIiwiam9pbiIsIndoZW5DaGlsZHJlbiIsInByZWZpeCIsInByZWZpeE92ZXJyaWRlcyIsImdsb2JhbFNldCIsInRyaW1SZWdleCIsInciLCJtYXRjaCIsInJlZ2V4IiwidmFsdWUiLCJyZWZpZCIsInN0YXRlbWVudCIsInYiLCJBcnJheSIsIkRhdGUiLCJyZXBs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MUI0QyxzQkFBZ0IsU0FBaEI7QUFDQUMsdUJBQWlCLEVBQWpCOztBQUVBQyxtQkFBYSxJQUFJekMsTUFBSixDQUFXLHVCQUF1QlgsS0FBS00sQ0FBTCxDQUF2QixHQUFpQyxxQkFBNUMsRUFBbUUsR0FBbkUsQ0FBYjtBQUNELEtBTEQsTUFLTztBQUNMNEMsc0JBQWdCLFNBQWhCO0FBQ0FDLHVCQUFpQixHQUFqQjs7QUFFQUMsbUJBQWEsSUFBSXpDLE1BQUosQ0FBVyx1QkFBdUJYLEtBQUtNLENBQUwsQ0FBdkIsR0FBaUMsb0JBQTVDLEVBQWtFLEdBQWxFLENBQWI7QUFDRDs7QUFFRFMsaUJBQWFBLFdBQVdYLE9BQVgsQ0FBbUJnRCxVQUFuQixFQUFnQyxPQUFPRixhQUFQLEdBQXVCLElBQXZCLEdBQThCQyxjQUE5QixHQUErQyxJQUEvRSxDQUFiO0FBQ0Q7O0FBRUQsU0FBT3BDLFVBQVA7QUFDRCxDQXhCRDs7QUEwQkFzQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2Y1RSxrQ0FEZTtBQUVmUSxzQ0FGZTtBQUdmRyxzQkFIZTtBQUlmRSxvQ0FKZTtBQUtmQyx3QkFMZTtBQU1mQyxnQ0FOZTtBQU9mSCw4QkFQZTtBQVFmSTtBQVJlLENBQWpCIiwiZmlsZSI6ImNvbnZlcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29udmVydENoaWxkcmVuID0gZnVuY3Rpb24oY2hpbGRyZW4sIHBhcmFtLCBuYW1lc3BhY2UsIG15QmF0aXNNYXBwZXIpIHtcclxuICBpZiAocGFyYW0gPT0gbnVsbCkge1xyXG4gICAgcGFyYW0gPSB7fTtcclxuICB9XHJcbiAgaWYgKCFpc0RpY3QocGFyYW0pKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIlBhcmFtZXRlciBhcmd1bWVudCBzaG91bGQgYmUgS2V5LVZhbHVlIHR5cGUgb3IgTnVsbC5cIik7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChjaGlsZHJlbi50eXBlID09ICd0ZXh0Jykge1xyXG4gICAgLy8gQ29udmVydCBQYXJhbWV0ZXJzXHJcbiAgICByZXR1cm4gY29udmVydFBhcmFtZXRlcnMoY2hpbGRyZW4sIHBhcmFtKTtcclxuXHJcbiAgfSBlbHNlIGlmIChjaGlsZHJlbi50eXBlID09ICd0YWcnKSB7XHJcbiAgICBzd2l0Y2ggKGNoaWxkcmVuLm5hbWUudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgY2FzZSAnaWYnOlxyXG4gICAgICByZXR1cm4gY29udmVydElmKGNoaWxkcmVuLCBwYXJhbSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnY2hvb3NlJzpcclxuICAgICAgcmV0dXJuIGNvbnZlcnRDaG9vc2UoY2hpbGRyZW4sIHBhcmFtKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICd0cmltJzpcclxuICAgIGNhc2UgJ3doZXJlJzpcclxuICAgICAgcmV0dXJuIGNvbnZlcnRUcmltV2hlcmUoY2hpbGRyZW4sIHBhcmFtKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdzZXQnOlxyXG4gICAgICByZXR1cm4gY29udmVydFNldChjaGlsZHJlbiwgcGFyYW0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2ZvcmVhY2gnOlxyXG4gICAgICByZXR1cm4gY29udmVydEZvcmVhY2goY2hpbGRyZW4sIHBhcmFtKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdiaW5kJzpcclxuICAgICAgcGFyYW0gPSBjb252ZXJ0QmluZChjaGlsZHJlbiwgcGFyYW0pO1xyXG4gICAgICByZXR1cm4gJyc7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnaW5jbHVkZSc6XHJcbiAgICAgIHJldHVybiBjb252ZXJ0SW5jbHVkZShjaGlsZHJlbiwgcGFyYW0sIG5hbWVzcGFjZSwgbXlCYXRpc01hcHBlcik7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJYTUwgaXMgbm90IHdlbGwtZm9ybWVkIGNoYXJhY3RlciBvciBtYXJrdXAuIENvbnNpZGVyIHVzaW5nIENEQVRBIHNlY3Rpb24uXCIpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGNvbnZlcnRQYXJhbWV0ZXJzID0gZnVuY3Rpb24oY2hpbGRyZW4sIHBhcmFtKSB7XHJcbiAgdmFyIGNvbnZlcnRTdHJpbmcgPSBjaGlsZHJlbi5jb250ZW50O1xyXG5cclxuICB0cnl7XHJcbiAgICB2YXIga2V5U3RyaW5nID0gJyc7ICBcclxuICAgIGlmIChwYXJhbSAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyhwYXJhbSkubGVuZ3RoICE9IDApIHtcclxuICAgICAgY29udmVydFN0cmluZyA9IHJlY3Vyc2l2ZVBhcmFtZXRlcnMoY29udmVydFN0cmluZywgcGFyYW0sIGtleVN0cmluZyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciBvY2N1cnJlZCBkdXJpbmcgY29udmVydCBwYXJhbWV0ZXJzLlwiKTtcclxuICB9XHJcbiAgXHJcbiAgdHJ5e1xyXG4gICAgLy8gY29udmVydCBDREFUQSBzdHJpbmdcclxuICAgIGNvbnZlcnRTdHJpbmcgPSBjb252ZXJ0U3RyaW5nLnJlcGxhY2UoLyhcXCZhbXBcXDspL2csJyYnKTtcclxuICAgIGNvbnZlcnRTdHJpbmcgPSBjb252ZXJ0U3RyaW5nLnJlcGxhY2UoLyhcXCZsdFxcOykvZywnPCcpO1xyXG4gICAgY29udmVydFN0cmluZyA9IGNvbnZlcnRTdHJpbmcucmVwbGFjZSgvKFxcJmd0XFw7KS9nLCc+Jyk7XHJcbiAgICBjb252ZXJ0U3RyaW5nID0gY29udmVydFN0cmluZy5yZXBsYWNlKC8oXFwmcXVvdFxcOykvZywnXCInKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yIG9jY3VycmVkIGR1cmluZyBjb252ZXJ0IENEQVRBIHNlY3Rpb24uXCIpO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gY29udmVydFN0cmluZztcclxufVxyXG5cclxudmFyIHJlY3Vyc2l2ZVBhcmFtZXRlcnMgPSBmdW5jdGlvbihjb252ZXJ0U3RyaW5nLCBwYXJhbSwga2V5U3RyaW5nKSB7XHJcbiAgdmFyIGtleURpY3QgPSBPYmplY3Qua2V5cyhwYXJhbSk7ICBcclxuICBcclxuICBmb3IgKHZhciBpPTAsIGtleTsga2V5PWtleURpY3RbaV07IGkrKykge1xyXG4gICAgaWYgKGlzRGljdChwYXJhbVtrZXldKSl7XHJcbiAgICAgIHZhciBuZXh0S2V5U3RyaW5nID0ga2V5U3RyaW5nICsga2V5ICsgJ1xcXFwuJztcclxuICAgICAgY29udmVydFN0cmluZyA9IHJlY3Vyc2l2ZVBhcmFtZXRlcnMoY29udmVydFN0cmluZywgcGFyYW1ba2V5XSwgbmV4dEtleVN0cmluZyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocGFyYW1ba2V5XSA9PSBudWxsIHx8IHBhcmFtW2tleV0gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ1xcXFwjeycgKyAoa2V5U3RyaW5nICsga2V5KSArICd9JywgJ2cnKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgdGVtcFBhcmFtS2V5ID0gKCdOVUxMJylcclxuICAgICAgICBjb252ZXJ0U3RyaW5nID0gY29udmVydFN0cmluZy5yZXBsYWNlKHJlZywgdGVtcFBhcmFtS2V5KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXFxcXCN7JyArIChrZXlTdHJpbmcgKyBrZXkpICsgJ30nLCAnZycpO1xyXG5cclxuICAgICAgICAvLyB2YXIgdGVtcFBhcmFtS2V5ID0gKHBhcmFtW2tleV0gKyAnJykucmVwbGFjZSgvXCIvZywgJ1xcXFxcXFwiJyk7XHJcbiAgICAgICAgLy8gdGVtcFBhcmFtS2V5ID0gdGVtcFBhcmFtS2V5LnJlcGxhY2UoLycvZywgJ1xcXFxcXCcnKTsgICAgIFxyXG4gICAgICAgIHZhciB0ZW1wUGFyYW1LZXkgPSBwb29sLmVzY2FwZShwYXJhbVtrZXldKTtcclxuICAgICAgICAvLyBjb252ZXJ0U3RyaW5nID0gY29udmVydFN0cmluZy5yZXBsYWNlKHJlZywgXCInXCIgKyB0ZW1wUGFyYW1LZXkgKyBcIidcIik7XHJcbiAgICAgICAgY29udmVydFN0cmluZyA9IGNvbnZlcnRTdHJpbmcucmVwbGFjZShyZWcsdGVtcFBhcmFtS2V5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ1xcXFwkeycgKyAoa2V5U3RyaW5nICsga2V5KSArICd9JywgJ2cnKTtcclxuICAgICAgdmFyIHRlbXBQYXJhbUtleSA9IChwYXJhbVtrZXldICsgJycpXHJcbiAgICAgLy8gdmFyIHRlbXBQYXJhbUtleSA9IHBvb2wuZXNjYXBlKHBhcmFtW2tleV0pO1xyXG4gICAgICBjb252ZXJ0U3RyaW5nID0gY29udmVydFN0cmluZy5yZXBsYWNlKHJlZywgdGVtcFBhcmFtS2V5KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIGNvbnZlcnRTdHJpbmc7XHJcbn1cclxuXHJcbnZhciBjb252ZXJ0SWYgPSBmdW5jdGlvbihjaGlsZHJlbiwgcGFyYW0pIHtcclxuICB0cnl7XHJcbiAgICB2YXIgZXZhbFN0cmluZyA9IGNoaWxkcmVuLmF0dHJzLnRlc3Q7XHJcbiAgICBcclxuICAgIC8vIENyZWF0ZSBFdmFsdWF0ZSBzdHJpbmdcclxuICAgIGV2YWxTdHJpbmcgPSByZXBsYWNlRXZhbFN0cmluZyhldmFsU3RyaW5nLCBwYXJhbSk7XHJcbiAgICBcclxuICAgIGV2YWxTdHJpbmcgPSBldmFsU3RyaW5nLnJlcGxhY2UoLyBhbmQgL2dpLCAnICYmICcpO1xyXG4gICAgZXZhbFN0cmluZyA9IGV2YWxTdHJpbmcucmVwbGFjZSgvIG9yIC9naSwgJyB8fCAnKTtcclxuICAgIFxyXG4gICAgLy8gcmVwbGFjZSA9PSB0byA9PT0gZm9yIHN0cmljdCBldmFsdWF0ZVxyXG4gICAgZXZhbFN0cmluZyA9IGV2YWxTdHJpbmcucmVwbGFjZSgvPT0vZywgXCI9PT1cIik7XHJcbiAgICBldmFsU3RyaW5nID0gZXZhbFN0cmluZy5yZXBsYWNlKC8hPS9nLCBcIiE9PVwiKTtcclxuICAgIFxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3Igb2NjdXJyZWQgZHVyaW5nIGNvbnZlcnQgPGlmPiBlbGVtZW50LlwiKVxyXG4gIH1cclxuICBcclxuICAvLyBFeGVjdXRlIEV2YWx1YXRlIHN0cmluZ1xyXG4gIHRyeSB7XHJcbiAgICBpZiAoZXZhbChldmFsU3RyaW5nKSkge1xyXG4gICAgICB2YXIgY29udmVydFN0cmluZyA9ICcnO1xyXG4gICAgICBmb3IgKHZhciBpPTAsIG5leHRDaGlsZHJlbjsgbmV4dENoaWxkcmVuPWNoaWxkcmVuWydjaGlsZHJlbiddW2ldOyBpKyspe1xyXG4gICAgICAgIGNvbnZlcnRTdHJpbmcgKz0gY29udmVydENoaWxkcmVuKG5leHRDaGlsZHJlbiwgcGFyYW0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb252ZXJ0U3RyaW5nO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgY29udmVydEZvcmVhY2ggPSBmdW5jdGlvbiAoY2hpbGRyZW4sIHBhcmFtKSB7XHJcbiAgdHJ5e1xyXG4gICAgdmFyIGNvbGxlY3Rpb24gPSBldmFsKCdwYXJhbS4nICsgY2hpbGRyZW4uYXR0cnMuY29sbGVjdGlvbik7XHJcbiAgICB2YXIgaXRlbSA9IGNoaWxkcmVuLmF0dHJzLml0ZW07XHJcbiAgICB2YXIgb3BlbiA9IChjaGlsZHJlbi5hdHRycy5vcGVuID09IG51bGwpPyAnJyA6IGNoaWxkcmVuLmF0dHJzLm9wZW47XHJcbiAgICB2YXIgY2xvc2UgPSAoY2hpbGRyZW4uYXR0cnMuY2xvc2UgPT0gbnVsbCk/ICcnIDogY2hpbGRyZW4uYXR0cnMuY2xvc2U7XHJcbiAgICB2YXIgc2VwYXJhdG9yID0gKGNoaWxkcmVuLmF0dHJzLnNlcGFyYXRvciA9PSBudWxsKT8gJycgOiBjaGlsZHJlbi5hdHRycy5zZXBhcmF0b3I7XHJcbiAgICBcclxuICAgIHZhciBmb3JlYWNoVGV4dHMgPSBbXTtcclxuICAgIGZvciAodmFyIGo9MCwgY29sbDsgY29sbD1jb2xsZWN0aW9uW2pdOyBqKyspe1xyXG4gICAgICB2YXIgZm9yZWFjaFBhcmFtID0gcGFyYW07XHJcbiAgICAgIGZvcmVhY2hQYXJhbVtpdGVtXSA9IGNvbGw7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgZm9yZWFjaFRleHQgPSAnJztcclxuICAgICAgZm9yICh2YXIgaz0wLCBuZXh0Q2hpbGRyZW47IG5leHRDaGlsZHJlbj1jaGlsZHJlbi5jaGlsZHJlbltrXTsgaysrKXtcclxuICAgICAgICB2YXIgZlRleHQgPSBjb252ZXJ0Q2hpbGRyZW4obmV4dENoaWxkcmVuLCBmb3JlYWNoUGFyYW0pO1xyXG4gICAgICAgIGZUZXh0ID0gZlRleHQucmVwbGFjZSgvXlxccyokL2csICcnKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZlRleHQgIT0gbnVsbCAmJiBmVGV4dC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgIGZvcmVhY2hUZXh0ICs9IGZUZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgaWYgKGZvcmVhY2hUZXh0ICE9IG51bGwgJiYgZm9yZWFjaFRleHQubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgZm9yZWFjaFRleHRzLnB1c2goZm9yZWFjaFRleHQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiAob3BlbiArIGZvcmVhY2hUZXh0cy5qb2luKHNlcGFyYXRvcikgKyBjbG9zZSk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciBvY2N1cnJlZCBkdXJpbmcgY29udmVydCA8Zm9yZWFjaD4gZWxlbWVudC5cIik7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgY29udmVydENob29zZSA9IGZ1bmN0aW9uIChjaGlsZHJlbiwgcGFyYW0pIHtcclxuICB0cnl7XHJcbiAgICBmb3IgKHZhciBpPTAsIHdoZW5DaGlsZHJlbjsgd2hlbkNoaWxkcmVuPWNoaWxkcmVuLmNoaWxkcmVuW2ldO2krKyl7XHJcbiAgICAgIGlmICh3aGVuQ2hpbGRyZW4udHlwZSA9PSAndGFnJyAmJiB3aGVuQ2hpbGRyZW4ubmFtZS50b0xvd2VyQ2FzZSgpID09ICd3aGVuJyl7XHJcbiAgICAgICAgdmFyIGV2YWxTdHJpbmcgPSB3aGVuQ2hpbGRyZW4uYXR0cnMudGVzdDtcclxuICAgICAgICBcclxuICAgICAgICAvLyBDcmVhdGUgRXZhbHVhdGUgc3RyaW5nXHJcbiAgICAgICAgZXZhbFN0cmluZyA9IHJlcGxhY2VFdmFsU3RyaW5nKGV2YWxTdHJpbmcsIHBhcmFtKTtcclxuICAgICAgICBcclxuICAgICAgICBldmFsU3RyaW5nID0gZXZhbFN0cmluZy5yZXBsYWNlKC8gYW5kIC9naSwgJyAmJiAnKTtcclxuICAgICAgICBldmFsU3RyaW5nID0gZXZhbFN0cmluZy5yZXBsYWNlKC8gb3IgL2dpLCAnIHx8ICcpO1xyXG5cclxuICAgICAgICAvLyBFeGVjdXRlIEV2YWx1YXRlIHN0cmluZ1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBpZiAoZXZhbChldmFsU3RyaW5nKSkge1xyXG4gICAgICAgICAgICAvLyBJZiA8d2hlbj4gY29uZGl0aW9uIGlzIHRydWUsIGRvIGl0LlxyXG4gICAgICAgICAgICB2YXIgY29udmVydFN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrPTAsIG5leHRDaGlsZHJlbjsgbmV4dENoaWxkcmVuPXdoZW5DaGlsZHJlbi5jaGlsZHJlbltrXTsgaysrKXtcclxuICAgICAgICAgICAgICBjb252ZXJ0U3RyaW5nICs9IGNvbnZlcnRDaGlsZHJlbihuZXh0Q2hpbGRyZW4sIHBhcmFtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29udmVydFN0cmluZztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh3aGVuQ2hpbGRyZW4udHlwZSA9PSAndGFnJyAmJiB3aGVuQ2hpbGRyZW4ubmFtZS50b0xvd2VyQ2FzZSgpID09ICdvdGhlcndpc2UnKSB7XHJcbiAgICAgICAgLy8gSWYgcmVhY2hlZCA8b3RoZXJ3aXNlPiB0YWcsIGRvIGl0LlxyXG4gICAgICAgIHZhciBjb252ZXJ0U3RyaW5nID0gJyc7XHJcbiAgICAgICAgZm9yICh2YXIgaz0wLCBuZXh0Q2hpbGRyZW47IG5leHRDaGlsZHJlbj13aGVuQ2hpbGRyZW4uY2hpbGRyZW5ba107IGsrKyl7XHJcbiAgICAgICAgICBjb252ZXJ0U3RyaW5nICs9IGNvbnZlcnRDaGlsZHJlbihuZXh0Q2hpbGRyZW4sIHBhcmFtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRTdHJpbmc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gc3VpdGFibGUgd2hlbiBhbmQgb3RoZXJ3aXNlLCBqdXN0IHJldHVybiBudWxsLlxyXG4gICAgcmV0dXJuICcnO1xyXG4gICAgXHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciBvY2N1cnJlZCBkdXJpbmcgY29udmVydCA8Y2hvb3NlPiBlbGVtZW50LlwiKTtcclxuICB9XHJcbn1cclxuXHJcbnZhciBjb252ZXJ0VHJpbVdoZXJlID0gZnVuY3Rpb24oY2hpbGRyZW4sIHBhcmFtKSB7ICBcclxuICB2YXIgY29udmVydFN0cmluZyA9ICcnO1xyXG4gIHZhciBwcmVmaXggPSBudWxsO1xyXG4gIHZhciBwcmVmaXhPdmVycmlkZXMgPSBudWxsO1xyXG4gIHZhciBnbG9iYWxTZXQgPSBudWxsO1xyXG4gIFxyXG4gIHRyeXtcclxuICAgIHN3aXRjaCAoY2hpbGRyZW4ubmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICBjYXNlICd0cmltJzpcclxuICAgICAgcHJlZml4ID0gY2hpbGRyZW4uYXR0cnMucHJlZml4O1xyXG4gICAgICBwcmVmaXhPdmVycmlkZXMgPSBjaGlsZHJlbi5hdHRycy5wcmVmaXhPdmVycmlkZXM7XHJcbiAgICAgIGdsb2JhbFNldCA9ICdnJztcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICd3aGVyZSc6ICAgIFxyXG4gICAgICBwcmVmaXggPSAnV0hFUkUnO1xyXG4gICAgICBwcmVmaXhPdmVycmlkZXMgPSAnYW5kfG9yJztcclxuICAgICAgZ2xvYmFsU2V0ID0gJ2dpJztcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciBvY2N1cnJlZCBkdXJpbmcgY29udmVydCA8dHJpbS93aGVyZT4gZWxlbWVudC5cIik7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBDb252ZXJ0IGNoaWxkcmVuIGZpcnN0LlxyXG4gICAgZm9yICh2YXIgaj0wLCBuZXh0Q2hpbGRyZW47IG5leHRDaGlsZHJlbj1jaGlsZHJlbi5jaGlsZHJlbltqXTsgaisrKXtcclxuICAgICAgY29udmVydFN0cmluZyArPSBjb252ZXJ0Q2hpbGRyZW4obmV4dENoaWxkcmVuLCBwYXJhbSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFJlbW92ZSBwcmVmaXhPdmVycmlkZXNcclxuICAgIHZhciB0cmltUmVnZXggPSBuZXcgUmVnRXhwKCcoXikoW1xcXFxzXSo/KSgnICsgcHJlZml4T3ZlcnJpZGVzICsgJyknLCBnbG9iYWxTZXQpO1xyXG4gICAgY29udmVydFN0cmluZyA9IGNvbnZlcnRTdHJpbmcucmVwbGFjZSh0cmltUmVnZXgsICcnKTtcclxuICAgIFxyXG4gICAgaWYgKGNoaWxkcmVuLm5hbWUudG9Mb3dlckNhc2UoKSAhPSAndHJpbScpe1xyXG4gICAgICB2YXIgdHJpbVJlZ2V4ID0gbmV3IFJlZ0V4cCgnKCcgKyBwcmVmaXhPdmVycmlkZXMgKyAnKShbXFxcXHNdKj8pKCQpJywgZ2xvYmFsU2V0KTtcclxuICAgICAgY29udmVydFN0cmluZyA9IGNvbnZlcnRTdHJpbmcucmVwbGFjZSh0cmltUmVnZXgsICcnKTtcclxuICAgIH0gXHJcbiAgICBcclxuICAgIC8vIEFkZCBQcmVmaXggaWYgU3RyaW5nIGlzIG5vdCBlbXB0eS5cclxuICAgIHZhciB0cmltUmVnZXggPSBuZXcgUmVnRXhwKCcoW2EtekEtWl0pJywgJ2cnKTtcclxuICAgIHZhciB3ID0gY29udmVydFN0cmluZy5tYXRjaCh0cmltUmVnZXgpO1xyXG4gIFxyXG4gICAgaWYgKHcgIT0gbnVsbCAmJiB3Lmxlbmd0aCA+IDApIHtcclxuICAgICAgY29udmVydFN0cmluZyA9IHByZWZpeCArICcgJysgY29udmVydFN0cmluZztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gUmVtb3ZlIGNvbW1hKCwpIGJlZm9yZSBXSEVSRVxyXG4gICAgaWYgKGNoaWxkcmVuLm5hbWUudG9Mb3dlckNhc2UoKSAhPSAnd2hlcmUnKXtcclxuICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnKCwpKFtcXFxcc10qPykod2hlcmUpJywgJ2dpJyk7XHJcbiAgICAgIGNvbnZlcnRTdHJpbmcgPSBjb252ZXJ0U3RyaW5nLnJlcGxhY2UocmVnZXgsICcgV0hFUkUgJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBjb252ZXJ0U3RyaW5nO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3Igb2NjdXJyZWQgZHVyaW5nIGNvbnZlcnQgPFwiICsgY2hpbGRyZW4ubmFtZS50b0xvd2VyQ2FzZSgpICsgXCI+IGVsZW1lbnQuXCIpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGNvbnZlcnRTZXQgPSBmdW5jdGlvbihjaGlsZHJlbiwgcGFyYW0pIHtcclxuICB2YXIgY29udmVydFN0cmluZyA9ICcnO1xyXG4gIFxyXG4gIHRyeXtcclxuICAgIC8vIENvbnZlcnQgY2hpbGRyZW4gZmlyc3QuXHJcbiAgICBmb3IgKHZhciBqPTAsIG5leHRDaGlsZHJlbjsgbmV4dENoaWxkcmVuPWNoaWxkcmVuLmNoaWxkcmVuW2pdOyBqKyspe1xyXG4gICAgICBjb252ZXJ0U3RyaW5nICs9IGNvbnZlcnRDaGlsZHJlbihuZXh0Q2hpbGRyZW4sIHBhcmFtKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gUmVtb3ZlIGNvbW1hIHJlcGVhdGVkIG1vcmUgdGhhbiAyLlxyXG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnKCwpKCx8XFxcXHMpezIsfScsICdnJyk7XHJcbiAgICBjb252ZXJ0U3RyaW5nID0gY29udmVydFN0cmluZy5yZXBsYWNlKHJlZ2V4LCAnLFxcbicpO1xyXG4gIFxyXG4gICAgLy8gUmVtb3ZlIGZpcnN0IGNvbW1hIGlmIGV4aXN0cy5cclxuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJyheKShbXFxcXHNdKj8pKCwpJywgJ2cnKTtcclxuICAgIGNvbnZlcnRTdHJpbmcgPSBjb252ZXJ0U3RyaW5nLnJlcGxhY2UocmVnZXgsICcnKTtcclxuICBcclxuICAgIC8vIFJlbW92ZSBsYXN0IGNvbW1hIGlmIGV4aXN0cy5cclxuICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnKCwpKFtcXFxcc10qPykoJCknLCAnZycpO1xyXG4gICAgY29udmVydFN0cmluZyA9IGNvbnZlcnRTdHJpbmcucmVwbGFjZShyZWdleCwgJycpO1xyXG4gICAgXHJcbiAgICBjb252ZXJ0U3RyaW5nID0gJyBTRVQgJyArIGNvbnZlcnRTdHJpbmc7XHJcbiAgICByZXR1cm4gY29udmVydFN0cmluZztcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yIG9jY3VycmVkIGR1cmluZyBjb252ZXJ0IDxzZXQ+IGVsZW1lbnQuXCIpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGNvbnZlcnRCaW5kID0gZnVuY3Rpb24oY2hpbGRyZW4sIHBhcmFtKSB7XHJcbiAgdmFyIGV2YWxTdHJpbmcgPSBjaGlsZHJlbi5hdHRycy52YWx1ZTtcclxuICBcclxuICAvLyBDcmVhdGUgRXZhbHVhdGUgc3RyaW5nXHJcbiAgZXZhbFN0cmluZyA9IHJlcGxhY2VFdmFsU3RyaW5nKGV2YWxTdHJpbmcsIHBhcmFtKTtcclxuICBcclxuICBwYXJhbVtjaGlsZHJlbi5hdHRycy5uYW1lXSA9IGV2YWwoZXZhbFN0cmluZyk7XHJcblxyXG4gIHJldHVybiBwYXJhbTtcclxufVxyXG5cclxudmFyIGNvbnZlcnRJbmNsdWRlID0gZnVuY3Rpb24oY2hpbGRyZW4sIHBhcmFtLCBuYW1lc3BhY2UsIG15QmF0aXNNYXBwZXIpIHtcclxuICBcclxuICB0cnl7XHJcbiAgICAvLyBBZGQgUHJvcGVydGllcyB0byBwYXJhbVxyXG4gICAgZm9yICh2YXIgaj0wLCBuZXh0Q2hpbGRyZW47IG5leHRDaGlsZHJlbj1jaGlsZHJlbi5jaGlsZHJlbltqXTsgaisrKXtcclxuICAgICAgaWYgKG5leHRDaGlsZHJlbi50eXBlID09ICd0YWcnICYmIG5leHRDaGlsZHJlbi5uYW1lID09ICdwcm9wZXJ0eScpe1xyXG4gICAgICAgIHBhcmFtW25leHRDaGlsZHJlbi5hdHRyc1snbmFtZSddXSA9IG5leHRDaGlsZHJlbi5hdHRyc1sndmFsdWUnXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3Igb2NjdXJyZWQgZHVyaW5nIHJlYWQgPHByb3BlcnR5PiBlbGVtZW50IGluIDxpbmNsdWRlPiBlbGVtZW50LlwiKTtcclxuICB9XHJcbiAgXHJcbiAgdHJ5e1xyXG4gICAgLy8gQ29udmVydCByZWZpZFxyXG4gICAgdmFyIHJlZmlkID0gcmVjdXJzaXZlUGFyYW1ldGVycyhjaGlsZHJlblsnYXR0cnMnXVsncmVmaWQnXSwgcGFyYW0sICcnKTtcclxuXHJcbiAgICB2YXIgc3RhdGVtZW50ID0gJyc7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgY2hpbGRyZW47IGNoaWxkcmVuID0gbXlCYXRpc01hcHBlcltuYW1lc3BhY2VdW3JlZmlkXVtpXTsgaSsrKSB7ICAgICAgXHJcbiAgICAgIHN0YXRlbWVudCArPSBjb252ZXJ0Q2hpbGRyZW4oY2hpbGRyZW4sIHBhcmFtLCBuYW1lc3BhY2UsIG15QmF0aXNNYXBwZXIpO1xyXG4gICAgfSAgXHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciBvY2N1cnJlZCBkdXJpbmcgY29udmVydCAncmVmaWQnIGF0dHJpYnV0ZSBpbiA8aW5jbHVkZT4gZWxlbWVudC5cIik7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBzdGF0ZW1lbnQ7XHJcbn1cclxuXHJcbnZhciBpc0RpY3QgPSBmdW5jdGlvbih2KSB7XHJcbiAgcmV0dXJuIHR5cGVvZiB2PT09J29iamVjdCcgJiYgdiE9PW51bGwgJiYgISh2IGluc3RhbmNlb2YgQXJyYXkpICYmICEodiBpbnN0YW5jZW9mIERhdGUpO1xyXG59XHJcblxyXG52YXIgcmVwbGFjZUV2YWxTdHJpbmcgPSBmdW5jdGlvbihldmFsU3RyaW5nLCBwYXJhbSkge1xyXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMocGFyYW0pO1xyXG5cclxuICBmb3IgKHZhciBpPTA7IGk8a2V5cy5sZW5ndGg7IGkrKyl7XHJcbiAgICB2YXIgcmVwbGFjZVByZWZpeCA9ICcnO1xyXG4gICAgdmFyIHJlcGxhY2VQb3N0Zml4ID0gJyc7XHJcbiAgICB2YXIgcGFyYW1SZWdleCA9IG51bGw7XHJcbiAgICBcclxuICAgIGlmIChpc0RpY3QocGFyYW1ba2V5c1tpXV0pKSB7XHJcbiAgICAgIHJlcGxhY2VQcmVmaXggPSAnIHBhcmFtLic7XHJcbiAgICAgIHJlcGxhY2VQb3N0Zml4ID0gJyc7XHJcbiAgICAgIFxyXG4gICAgICBwYXJhbVJlZ2V4ID0gbmV3IFJlZ0V4cCgnKF58W15hLXpBLVowLTlfXSkoJyArIGtleXNbaV0gKyAnXFxcXC4pKFthLXpBLVowLTlfXSspJywgJ2cnKTtcclxuICAgIH0gZWxzZSB7ICAgICAgXHJcbiAgICAgIHJlcGxhY2VQcmVmaXggPSAnIHBhcmFtLic7XHJcbiAgICAgIHJlcGxhY2VQb3N0Zml4ID0gJyAnO1xyXG4gICAgICBcclxuICAgICAgcGFyYW1SZWdleCA9IG5ldyBSZWdFeHAoJyhefFteYS16QS1aMC05X10pKCcgKyBrZXlzW2ldICsgJykoJHxbXmEtekEtWjAtOV9dKScsICdnJyk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBldmFsU3RyaW5nID0gZXZhbFN0cmluZy5yZXBsYWNlKHBhcmFtUmVnZXgsIChcIiQxXCIgKyByZXBsYWNlUHJlZml4ICsgXCIkMlwiICsgcmVwbGFjZVBvc3RmaXggKyBcIiQzXCIpKTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIGV2YWxTdHJpbmc7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGNvbnZlcnRDaGlsZHJlbixcclxuICBjb252ZXJ0UGFyYW1ldGVycyxcclxuICBjb252ZXJ0SWYsXHJcbiAgY29udmVydFRyaW1XaGVyZSxcclxuICBjb252ZXJ0U2V0LFxyXG4gIGNvbnZlcnRGb3JlYWNoLFxyXG4gIGNvbnZlcnRDaG9vc2UsXHJcbiAgY29udmVydEJpbmRcclxufTsiXX0=