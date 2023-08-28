/**
 * @author ydr.me
 * @create 2015-08-20 15:30
 */

'use strict';

var lang = {
    minLength: {
        input: '${1}không được nhỏ hơn ${2} ký tự',
        select: '${1} ít nhất phải chọn ${2} mục'
    },
    maxLength: {
        input: '${1} không được lớn hơn ${2} ký tự',
        select: '${1} nhiều nhất chỉ có thể chọn ${2} mục '
    },
    least: '${1} ít nhất phải chọn ${2} mục',
    most: '${1}nhiều nhất chỉ có thể chọn ${2} mục',
    type: {
        array: '${1} bắt buộc phải là giá trị Array ',
        number: '${1} phải là số ',
        integer: '${1} phải là số chẳn.',
        mobile: '${1} phải là format số điện thoại ',
        email: '${1}phải là format email ',
        url: '${1} phải là địa chỉ website ',
        date: '${1} invalid date',
        numreicAllowZero: '${1} invalid'
    },
    required: '${1} không được rỗng.',
    equal: '${1} và ${2} phải giống nhau.',
    min: '${1} không nhỏ hơn ${2}',
    max: '${1} không lớn hơn ${2}',
    step: '${1} giá trị kế tiếp là ${2}'
};

/**
 * @param type
 * @param [category]
 * @returns {*}
 */
exports.get = function (type, category) {
    var la = lang[type];

    if (!category) {
        return la;
    }

    return la && la[category] || '';
};

/**
 * 设置 lang
 * @param type
 * @param msg
 * @param [category]
 */
exports.set = function (type, msg, category) {
    if (category) {
        lang[type] = lang[type] || {};
        lang[type][category] = msg;
    } else {
        lang[type] = msg;
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWxpZGF0b3IvbGlicy9fdmFsaWRhdGlvbi1sYW5nLmpzIl0sIm5hbWVzIjpbImxhbmciLCJtaW5MZW5ndGgiLCJpbnB1dCIsInNlbGVjdCIsIm1heExlbmd0aCIsImxlYXN0IiwibW9zdCIsInR5cGUiLCJhcnJheSIsIm51bWJlciIsImludGVnZXIiLCJtb2JpbGUiLCJlbWFpbCIsInVybCIsImRhdGUiLCJudW1yZWljQWxsb3daZXJvIiwicmVxdWlyZWQiLCJlcXVhbCIsIm1pbiIsIm1heCIsInN0ZXAiLCJleHBvcnRzIiwiZ2V0IiwiY2F0ZWdvcnkiLCJsYSIsInNldCIsIm1zZyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBT0E7O0FBRUEsSUFBSUEsT0FBTztBQUNQQyxlQUFXO0FBQ1BDLGVBQU8sbUNBREE7QUFFUEMsZ0JBQVE7QUFGRCxLQURKO0FBS1BDLGVBQVc7QUFDUEYsZUFBTyxvQ0FEQTtBQUVQQyxnQkFBUTtBQUZELEtBTEo7QUFTUEUsV0FBTyxpQ0FUQTtBQVVQQyxVQUFNLHlDQVZDO0FBV1BDLFVBQU07QUFDRkMsZUFBTyxzQ0FETDtBQUVGQyxnQkFBUSxrQkFGTjtBQUdGQyxpQkFBUyx1QkFIUDtBQUlGQyxnQkFBUSxvQ0FKTjtBQUtGQyxlQUFPLDJCQUxMO0FBTUZDLGFBQUssK0JBTkg7QUFPRkMsY0FBTSxtQkFQSjtBQVFGQywwQkFBa0I7QUFSaEIsS0FYQztBQXFCUEMsY0FBVSx1QkFyQkg7QUFzQlBDLFdBQU8sK0JBdEJBO0FBdUJQQyxTQUFLLHlCQXZCRTtBQXdCUEMsU0FBSyx5QkF4QkU7QUF5QlBDLFVBQU07QUF6QkMsQ0FBWDs7QUE2QkE7Ozs7O0FBS0FDLFFBQVFDLEdBQVIsR0FBYyxVQUFVZixJQUFWLEVBQWdCZ0IsUUFBaEIsRUFBMEI7QUFDcEMsUUFBSUMsS0FBS3hCLEtBQUtPLElBQUwsQ0FBVDs7QUFFQSxRQUFJLENBQUNnQixRQUFMLEVBQWU7QUFDWCxlQUFPQyxFQUFQO0FBQ0g7O0FBRUQsV0FBT0EsTUFBTUEsR0FBR0QsUUFBSCxDQUFOLElBQXNCLEVBQTdCO0FBQ0gsQ0FSRDs7QUFXQTs7Ozs7O0FBTUFGLFFBQVFJLEdBQVIsR0FBYyxVQUFVbEIsSUFBVixFQUFnQm1CLEdBQWhCLEVBQXFCSCxRQUFyQixFQUErQjtBQUN6QyxRQUFJQSxRQUFKLEVBQWM7QUFDVnZCLGFBQUtPLElBQUwsSUFBYVAsS0FBS08sSUFBTCxLQUFjLEVBQTNCO0FBQ0FQLGFBQUtPLElBQUwsRUFBV2dCLFFBQVgsSUFBdUJHLEdBQXZCO0FBQ0gsS0FIRCxNQUdPO0FBQ0gxQixhQUFLTyxJQUFMLElBQWFtQixHQUFiO0FBQ0g7QUFDSixDQVBEIiwiZmlsZSI6Il92YWxpZGF0aW9uLWxhbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3IgeWRyLm1lXG4gKiBAY3JlYXRlIDIwMTUtMDgtMjAgMTU6MzBcbiAqL1xuXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbGFuZyA9IHtcbiAgICBtaW5MZW5ndGg6IHtcbiAgICAgICAgaW5wdXQ6ICckezF9a2jDtG5nIMSRxrDhu6NjIG5o4buPIGjGoW4gJHsyfSBrw70gdOG7sScsXG4gICAgICAgIHNlbGVjdDogJyR7MX0gw610IG5o4bqldCBwaOG6o2kgY2jhu41uICR7Mn0gbeG7pWMnXG4gICAgfSxcbiAgICBtYXhMZW5ndGg6IHtcbiAgICAgICAgaW5wdXQ6ICckezF9IGtow7RuZyDEkcaw4bujYyBs4bubbiBoxqFuICR7Mn0ga8O9IHThu7EnLFxuICAgICAgICBzZWxlY3Q6ICckezF9IG5oaeG7gXUgbmjhuqV0IGNo4buJIGPDsyB0aOG7gyBjaOG7jW4gJHsyfSBt4bulYyAnXG4gICAgfSxcbiAgICBsZWFzdDogJyR7MX0gw610IG5o4bqldCBwaOG6o2kgY2jhu41uICR7Mn0gbeG7pWMnLFxuICAgIG1vc3Q6ICckezF9bmhp4buBdSBuaOG6pXQgY2jhu4kgY8OzIHRo4buDIGNo4buNbiAkezJ9IG3hu6VjJyxcbiAgICB0eXBlOiB7XG4gICAgICAgIGFycmF5OiAnJHsxfSBi4bqvdCBideG7mWMgcGjhuqNpIGzDoCBnacOhIHRy4buLIEFycmF5ICcsXG4gICAgICAgIG51bWJlcjogJyR7MX0gcGjhuqNpIGzDoCBz4buRICcsXG4gICAgICAgIGludGVnZXI6ICckezF9IHBo4bqjaSBsw6Agc+G7kSBjaOG6s24uJyxcbiAgICAgICAgbW9iaWxlOiAnJHsxfSBwaOG6o2kgbMOgIGZvcm1hdCBz4buRIMSRaeG7h24gdGhv4bqhaSAnLFxuICAgICAgICBlbWFpbDogJyR7MX1waOG6o2kgbMOgIGZvcm1hdCBlbWFpbCAnLFxuICAgICAgICB1cmw6ICckezF9IHBo4bqjaSBsw6AgxJHhu4thIGNo4buJIHdlYnNpdGUgJyxcbiAgICAgICAgZGF0ZTogJyR7MX0gaW52YWxpZCBkYXRlJyxcbiAgICAgICAgbnVtcmVpY0FsbG93WmVybzogJyR7MX0gaW52YWxpZCdcbiAgICB9LFxuICAgIHJlcXVpcmVkOiAnJHsxfSBraMO0bmcgxJHGsOG7o2MgcuG7l25nLicsXG4gICAgZXF1YWw6ICckezF9IHbDoCAkezJ9IHBo4bqjaSBnaeG7kW5nIG5oYXUuJyxcbiAgICBtaW46ICckezF9IGtow7RuZyBuaOG7jyBoxqFuICR7Mn0nLFxuICAgIG1heDogJyR7MX0ga2jDtG5nIGzhu5tuIGjGoW4gJHsyfScsXG4gICAgc3RlcDogJyR7MX0gZ2nDoSB0cuG7iyBr4bq/IHRp4bq/cCBsw6AgJHsyfSdcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gdHlwZVxuICogQHBhcmFtIFtjYXRlZ29yeV1cbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnRzLmdldCA9IGZ1bmN0aW9uICh0eXBlLCBjYXRlZ29yeSkge1xuICAgIHZhciBsYSA9IGxhbmdbdHlwZV07XG5cbiAgICBpZiAoIWNhdGVnb3J5KSB7XG4gICAgICAgIHJldHVybiBsYTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGEgJiYgbGFbY2F0ZWdvcnldIHx8ICcnO1xufTtcblxuXG4vKipcbiAqIOiuvue9riBsYW5nXG4gKiBAcGFyYW0gdHlwZVxuICogQHBhcmFtIG1zZ1xuICogQHBhcmFtIFtjYXRlZ29yeV1cbiAqL1xuZXhwb3J0cy5zZXQgPSBmdW5jdGlvbiAodHlwZSwgbXNnLCBjYXRlZ29yeSkge1xuICAgIGlmIChjYXRlZ29yeSkge1xuICAgICAgICBsYW5nW3R5cGVdID0gbGFuZ1t0eXBlXSB8fCB7fTtcbiAgICAgICAgbGFuZ1t0eXBlXVtjYXRlZ29yeV0gPSBtc2c7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGFuZ1t0eXBlXSA9IG1zZztcbiAgICB9XG59O1xuIl19