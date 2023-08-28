"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var excel = require('node-excel-export');
var Constants = require(appPath + "/utils/Constants");
var FLExcel = function FLExcel() {};
module.exports = FLExcel;
/**
 * @param columnGroups : group header
 * @param rightParams: thông tin hiện thị phí trên bên phải report
 * @param centerParams: thông tin hiện thị phía dưới report title
 */
FLExcel.export = function (sheetNane, company, title, merges, columns, dataSource) {
    var columnGroups = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var rightParams = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
    var centerParams = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : null;
    var hideNo = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : false;
    var is_total = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : false;
    var is_group = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : false;
    var groupName = arguments[12];

    /*Số cột merge param bên phải */
    try {
        var mergeRightColumnCount = 3;
        // You can define styles as json object
        var styles = Constants.common_excel_cell_style;
        var countColumns = 0;
        for (var index = 0; index < dataSource.length; index++) {
            var _item = dataSource[index];
            _item.no = index + 1;
        }
        var columnsNo = [];
        if (hideNo !== true) {
            countColumns = 1;
            columnsNo["no"] = {
                displayName: "#",
                headerStyle: styles.theader,
                cellStyle: styles.tbody,
                width: 50
            };
        }

        for (var key in columns) {
            if (columns.hasOwnProperty(key)) {
                columnsNo[key] = columns[key];
                countColumns++;
                var element = columns[key];
                element.headerStyle = styles.theader;
                if (_typeof(element.cellStyle) === 'object') {
                    element.cellStyle = Object.assign({}, element.cellStyle, styles.tbody);
                } else if (_typeof(element.cellStyle) !== 'object' && typeof element.cellStyle !== 'function') {
                    element.cellStyle = Object.assign({}, styles.tbody);
                }
                if (typeof element.cellFormat !== 'function') {
                    element.cellFormat = function (value, row) {
                        return value == null || value == '' ? ' ' : value;
                    };
                }
            }
        }
        columns = columnsNo;

        //Array of objects representing heading rows (very top)
        var heading = [];
        var url_logo = "";
        if (!Libs.isBlank(company)) {
            var id = company.id,
                url = company.url,
                logo = company.logo,
                name = company.name,
                phone = company.phone,
                email = company.email,
                address = company.address,
                address_full = company.address_full,
                iso_code = company.iso_code;

            var header = "";
            // if (!Libs.isBlank(logo)) {
            // url_logo = url + "/system/showImageAction?file_name=" + logo + "&headquarter_id=" + id;
            // url_logo = "http://localhost:3001/assets/images/login-background.png";
            // header +="<img src ='"+url_logo+"'/> \n";
            // heading.push([{ value: header, style: styles.thead }]);
            // }
            if (!Libs.isBlank(name)) {
                header += name + "\n";
                heading.push([{ value: name, style: styles.thead }]);
            }
            if (!Libs.isBlank(address_full)) {
                header += i18n.__('print.address') + ': ' + address_full + "\n";
                heading.push([{ value: i18n.__('print.address') + ': ' + address_full, style: styles.thead }]);
            }
            if (!Libs.isBlank(phone)) {
                header += i18n.__('print.phone') + ': ' + phone + "\n";
                heading.push([{
                    value: i18n.__('print.phone') + ': ' + phone,
                    style: styles.thead
                }]);
            }
            if (!Libs.isBlank(email)) {
                header += i18n.__('print.email') + ': ' + email + "\n";
                heading.push([{
                    value: i18n.__('print.email') + ': ' + email,
                    style: styles.thead
                }]);
            }
            // if (!Libs.isBlank(website)) {
            //     header += i18n.__('headquarter.website') + ': ' + website + "\n";
            //     heading.push([{
            //         value: i18n.__('headquarter.website') + ': ' + website
            //         , style: styles.thead
            //     }
            //     ]);
            // }
        }

        var countColumns1 = countColumns;
        var rightParamsLength = 0;
        /*Kiểm tra nếu có thông tin hiện phía trên, bên  phải thì merges header trừ đi 3 cột */
        if (rightParams != null && rightParams.length > 0) {
            countColumns1 = countColumns - mergeRightColumnCount;
            if (countColumns1 < 2) {
                countColumns1 = 2;
            }
            rightParamsLength = rightParams.length;
            /*Thêm phần param bên phải vào*/
            for (var _i = 0; _i < rightParamsLength; _i++) {
                if (_i < heading.length) {
                    var arr = heading[_i];
                    for (var j = 0; j < countColumns1 - 1; j++) {
                        arr.push({ value: ' ' });
                    }
                    arr.push({ value: rightParams[_i].name + ':' + rightParams[_i].value, style: styles.thead });
                } else {
                    var _arr = [];
                    for (var _j = 0; _j < countColumns1; _j++) {
                        _arr.push({ value: ' ' });
                    }
                    _arr.push({ value: rightParams[_i].name + ':' + rightParams[_i].value, style: styles.thead });
                    heading.push(_arr);
                }
            }
        }

        if (!Libs.isBlank(title))
            /*TITLE report */
            heading.push([{ value: title.toUpperCase(), style: styles.header }]);
        /*Phía dưới Title*/
        if (Array.isArray(centerParams) && centerParams.length > 0) {
            var center = centerParams.filter(function (item) {
                return item.type != 1;
            }),
                main = centerParams.filter(function (item) {
                return item.type == 1;
            });
            for (var _i2 = 0; _i2 < center.length; _i2++) {
                heading.push([{ value: center[_i2].value, style: styles.bottom_header }]);
            }
            for (var _key in main) {
                var _item2 = main[_key],
                    _i3 = { value: _item2.value };
                _item2.style = _item2.style ? _item2.style : styles.left_header;
                Object.assign(_i3, { style: _item2.style });
                heading.push([_i3]);
            }
        }
        merges = [];
        // let logo_img = { start: { row: 1, column: 1 }, end: { row: heading.length - 1, column: 1 } }
        // merges.push(logo_img);
        var i = 1;
        for (var _key2 in heading) {
            var mergeColumns = countColumns;
            if (i <= rightParamsLength) {
                mergeColumns = countColumns1;
            }
            var item = { start: { row: _key2 * 1 + 1, column: 1 }, end: { row: _key2 * 1 + 1, column: mergeColumns } };
            merges.push(item);
            i++;
        }
        /*Thêm phần param bên phải vào*/
        for (var _i4 = 0; _i4 < rightParamsLength; _i4++) {
            var item = { start: { row: _i4 + 1, column: countColumns1 + 1 }, end: { row: _i4 + 1, column: countColumns } };
            merges.push(item);
        }
        var headingLenght = heading.length;
        if (columnGroups != null && columnGroups.data && columnGroups.data.length > 0) {
            for (var _i5 = 0; _i5 < columnGroups.data.length; _i5++) {
                var _item3 = columnGroups.data[_i5];
                for (var _j2 = 0; _j2 < _item3.length; _j2++) {
                    _item3[_j2].style = styles.theader;
                }
                heading.push(_item3);
            }
        }
        if (columnGroups != null && columnGroups.merges && columnGroups.merges.length > 0) {
            for (var _i6 = 0; _i6 < columnGroups.merges.length; _i6++) {
                var _item4 = columnGroups.merges[_i6];
                _item4.start.row = _item4.start.row + headingLenght;
                _item4.end.row = _item4.end.row + headingLenght;
                merges.push(_item4);
            }
        }
        // if (is_total) {
        //     // khi báo cáo có tổng số tiền
        //     let dataSource_temp = []

        //     dataSource_temp = dataSource.filter(data => {
        //         // if(data.is_total !== 1){
        //             return data.is_total !== 1
        //         // }
        //         // return data.m_level !== 5
        //     })
        //     dataSource.map(data => {
        //         if (data.is_total === 1 
        //             // || data.m_level === 5
        //             ) {
        //             let data_temp = {}
        //             data_temp.is_total = data.is_total
        //             data_temp.payment_money = data.payment_money
        //             if (data.quantity) {
        //                 data_temp.quantity = data.quantity
        //             }
        //             data_temp.material_name = data.material_name
        //             data_temp.no = i18n.__('total') + i18n.__('colon')
        //             dataSource_temp.push(data_temp)
        //             return
        //         }
        //         return
        //     })
        //     dataSource = dataSource_temp
        // }

        // if(is_group) {
        //     let data_temp = []
        //     let index = 1
        //     dataSource.map(data => {
        //         if (data.has_child) {
        //             data.no = data[groupName]
        //             data_temp.push(data)
        //         } else if (data.is_total) {
        //             data_temp.push(data)
        //         } else {
        //             data.no = index++ 
        //             data_temp.push(data)
        //         }
        //     })
        //     dataSource = data_temp
        // }

        var report = excel.buildExport([// <- Notice that this is an array. Pass multiple sheets to create multi sheet report
        {
            name: sheetNane, // <- Specify sheet name (optional)
            heading: heading,
            merges: merges,
            specification: columns, // <- Report specification
            data: dataSource // <-- Report data
        }]);
        return report;
    } catch (ex) {
        console.log('ex', ex);
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9GTEV4Y2VsLmpzIl0sIm5hbWVzIjpbImV4Y2VsIiwicmVxdWlyZSIsIkNvbnN0YW50cyIsImFwcFBhdGgiLCJGTEV4Y2VsIiwibW9kdWxlIiwiZXhwb3J0cyIsImV4cG9ydCIsInNoZWV0TmFuZSIsImNvbXBhbnkiLCJ0aXRsZSIsIm1lcmdlcyIsImNvbHVtbnMiLCJkYXRhU291cmNlIiwiY29sdW1uR3JvdXBzIiwicmlnaHRQYXJhbXMiLCJjZW50ZXJQYXJhbXMiLCJoaWRlTm8iLCJpc190b3RhbCIsImlzX2dyb3VwIiwiZ3JvdXBOYW1lIiwibWVyZ2VSaWdodENvbHVtbkNvdW50Iiwic3R5bGVzIiwiY29tbW9uX2V4Y2VsX2NlbGxfc3R5bGUiLCJjb3VudENvbHVtbnMiLCJpbmRleCIsImxlbmd0aCIsIml0ZW0iLCJubyIsImNvbHVtbnNObyIsImRpc3BsYXlOYW1lIiwiaGVhZGVyU3R5bGUiLCJ0aGVhZGVyIiwiY2VsbFN0eWxlIiwidGJvZHkiLCJ3aWR0aCIsImtleSIsImhhc093blByb3BlcnR5IiwiZWxlbWVudCIsIk9iamVjdCIsImFzc2lnbiIsImNlbGxGb3JtYXQiLCJ2YWx1ZSIsInJvdyIsImhlYWRpbmciLCJ1cmxfbG9nbyIsIkxpYnMiLCJpc0JsYW5rIiwiaWQiLCJ1cmwiLCJsb2dvIiwibmFtZSIsInBob25lIiwiZW1haWwiLCJhZGRyZXNzIiwiYWRkcmVzc19mdWxsIiwiaXNvX2NvZGUiLCJoZWFkZXIiLCJwdXNoIiwic3R5bGUiLCJ0aGVhZCIsImkxOG4iLCJfXyIsImNvdW50Q29sdW1uczEiLCJyaWdodFBhcmFtc0xlbmd0aCIsImkiLCJhcnIiLCJqIiwidG9VcHBlckNhc2UiLCJBcnJheSIsImlzQXJyYXkiLCJjZW50ZXIiLCJmaWx0ZXIiLCJ0eXBlIiwibWFpbiIsImJvdHRvbV9oZWFkZXIiLCJsZWZ0X2hlYWRlciIsIm1lcmdlQ29sdW1ucyIsInN0YXJ0IiwiY29sdW1uIiwiZW5kIiwiaGVhZGluZ0xlbmdodCIsImRhdGEiLCJyZXBvcnQiLCJidWlsZEV4cG9ydCIsInNwZWNpZmljYXRpb24iLCJleCIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLG1CQUFSLENBQVo7QUFDQSxJQUFJQyxZQUFZRCxRQUFRRSxVQUFVLGtCQUFsQixDQUFoQjtBQUNBLElBQUlDLFVBQVUsU0FBVkEsT0FBVSxHQUFZLENBQUcsQ0FBN0I7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkYsT0FBakI7QUFDQTs7Ozs7QUFLQUEsUUFBUUcsTUFBUixHQUFpQixVQUFVQyxTQUFWLEVBQXFCQyxPQUFyQixFQUE4QkMsS0FBOUIsRUFBcUNDLE1BQXJDLEVBQTZDQyxPQUE3QyxFQUFzREMsVUFBdEQsRUFBK0w7QUFBQSxRQUE3SEMsWUFBNkgsdUVBQTlHLElBQThHO0FBQUEsUUFBeEdDLFdBQXdHLHVFQUExRixJQUEwRjtBQUFBLFFBQXBGQyxZQUFvRix1RUFBckUsSUFBcUU7QUFBQSxRQUEvREMsTUFBK0QsdUVBQXRELEtBQXNEO0FBQUEsUUFBL0NDLFFBQStDLDBFQUFwQyxLQUFvQztBQUFBLFFBQTdCQyxRQUE2QiwwRUFBbEIsS0FBa0I7QUFBQSxRQUFYQyxTQUFXOztBQUM1TTtBQUNBLFFBQUk7QUFDQSxZQUFNQyx3QkFBd0IsQ0FBOUI7QUFDQTtBQUNBLFlBQU1DLFNBQVNwQixVQUFVcUIsdUJBQXpCO0FBQ0EsWUFBSUMsZUFBZSxDQUFuQjtBQUNBLGFBQUssSUFBSUMsUUFBUSxDQUFqQixFQUFvQkEsUUFBUVosV0FBV2EsTUFBdkMsRUFBK0NELE9BQS9DLEVBQXdEO0FBQ3BELGdCQUFJRSxRQUFPZCxXQUFXWSxLQUFYLENBQVg7QUFDQUUsa0JBQUtDLEVBQUwsR0FBVUgsUUFBUSxDQUFsQjtBQUNIO0FBQ0QsWUFBSUksWUFBWSxFQUFoQjtBQUNBLFlBQUlaLFdBQVcsSUFBZixFQUFxQjtBQUNqQk8sMkJBQWUsQ0FBZjtBQUNBSyxzQkFBVSxJQUFWLElBQWtCO0FBQ2RDLDZCQUFhLEdBREM7QUFFZEMsNkJBQWFULE9BQU9VLE9BRk47QUFHZEMsMkJBQVdYLE9BQU9ZLEtBSEo7QUFJZEMsdUJBQU87QUFKTyxhQUFsQjtBQU1IOztBQUVELGFBQUssSUFBTUMsR0FBWCxJQUFrQnhCLE9BQWxCLEVBQTJCO0FBQ3ZCLGdCQUFJQSxRQUFReUIsY0FBUixDQUF1QkQsR0FBdkIsQ0FBSixFQUFpQztBQUM3QlAsMEJBQVVPLEdBQVYsSUFBaUJ4QixRQUFRd0IsR0FBUixDQUFqQjtBQUNBWjtBQUNBLG9CQUFNYyxVQUFVMUIsUUFBUXdCLEdBQVIsQ0FBaEI7QUFDQUUsd0JBQVFQLFdBQVIsR0FBc0JULE9BQU9VLE9BQTdCO0FBQ0Esb0JBQUksUUFBT00sUUFBUUwsU0FBZixNQUE2QixRQUFqQyxFQUEyQztBQUN2Q0ssNEJBQVFMLFNBQVIsR0FBb0JNLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCRixRQUFRTCxTQUExQixFQUFxQ1gsT0FBT1ksS0FBNUMsQ0FBcEI7QUFDSCxpQkFGRCxNQUVPLElBQUksUUFBT0ksUUFBUUwsU0FBZixNQUE2QixRQUE3QixJQUF5QyxPQUFPSyxRQUFRTCxTQUFmLEtBQTZCLFVBQTFFLEVBQXNGO0FBQ3pGSyw0QkFBUUwsU0FBUixHQUFvQk0sT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JsQixPQUFPWSxLQUF6QixDQUFwQjtBQUNIO0FBQ0Qsb0JBQUksT0FBT0ksUUFBUUcsVUFBZixLQUE4QixVQUFsQyxFQUE4QztBQUMxQ0gsNEJBQVFHLFVBQVIsR0FBcUIsVUFBVUMsS0FBVixFQUFpQkMsR0FBakIsRUFBc0I7QUFDdkMsK0JBQVFELFNBQVMsSUFBVCxJQUFpQkEsU0FBUyxFQUEzQixHQUFpQyxHQUFqQyxHQUF1Q0EsS0FBOUM7QUFDSCxxQkFGRDtBQUdIO0FBQ0o7QUFDSjtBQUNEOUIsa0JBQVVpQixTQUFWOztBQUVBO0FBQ0EsWUFBSWUsVUFBVSxFQUFkO0FBQ0EsWUFBSUMsV0FBVyxFQUFmO0FBQ0EsWUFBSSxDQUFDQyxLQUFLQyxPQUFMLENBQWF0QyxPQUFiLENBQUwsRUFBNEI7QUFBQSxnQkFDbEJ1QyxFQURrQixHQUNxRHZDLE9BRHJELENBQ2xCdUMsRUFEa0I7QUFBQSxnQkFDZEMsR0FEYyxHQUNxRHhDLE9BRHJELENBQ2R3QyxHQURjO0FBQUEsZ0JBQ1RDLElBRFMsR0FDcUR6QyxPQURyRCxDQUNUeUMsSUFEUztBQUFBLGdCQUNIQyxJQURHLEdBQ3FEMUMsT0FEckQsQ0FDSDBDLElBREc7QUFBQSxnQkFDR0MsS0FESCxHQUNxRDNDLE9BRHJELENBQ0cyQyxLQURIO0FBQUEsZ0JBQ1VDLEtBRFYsR0FDcUQ1QyxPQURyRCxDQUNVNEMsS0FEVjtBQUFBLGdCQUNpQkMsT0FEakIsR0FDcUQ3QyxPQURyRCxDQUNpQjZDLE9BRGpCO0FBQUEsZ0JBQzBCQyxZQUQxQixHQUNxRDlDLE9BRHJELENBQzBCOEMsWUFEMUI7QUFBQSxnQkFDd0NDLFFBRHhDLEdBQ3FEL0MsT0FEckQsQ0FDd0MrQyxRQUR4Qzs7QUFFeEIsZ0JBQUlDLFNBQVMsRUFBYjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBLGdCQUFJLENBQUNYLEtBQUtDLE9BQUwsQ0FBYUksSUFBYixDQUFMLEVBQXlCO0FBQ3JCTSwwQkFBVU4sT0FBTyxJQUFqQjtBQUNBUCx3QkFBUWMsSUFBUixDQUFhLENBQUMsRUFBRWhCLE9BQU9TLElBQVQsRUFBZVEsT0FBT3JDLE9BQU9zQyxLQUE3QixFQUFELENBQWI7QUFDSDtBQUNELGdCQUFJLENBQUNkLEtBQUtDLE9BQUwsQ0FBYVEsWUFBYixDQUFMLEVBQWlDO0FBQzdCRSwwQkFBVUksS0FBS0MsRUFBTCxDQUFRLGVBQVIsSUFBMkIsSUFBM0IsR0FBa0NQLFlBQWxDLEdBQWlELElBQTNEO0FBQ0FYLHdCQUFRYyxJQUFSLENBQWEsQ0FBQyxFQUFFaEIsT0FBT21CLEtBQUtDLEVBQUwsQ0FBUSxlQUFSLElBQTJCLElBQTNCLEdBQWtDUCxZQUEzQyxFQUF5REksT0FBT3JDLE9BQU9zQyxLQUF2RSxFQUFELENBQWI7QUFDSDtBQUNELGdCQUFJLENBQUNkLEtBQUtDLE9BQUwsQ0FBYUssS0FBYixDQUFMLEVBQTBCO0FBQ3RCSywwQkFBVUksS0FBS0MsRUFBTCxDQUFRLGFBQVIsSUFBeUIsSUFBekIsR0FBZ0NWLEtBQWhDLEdBQXVDLElBQWpEO0FBQ0FSLHdCQUFRYyxJQUFSLENBQWEsQ0FBQztBQUNWaEIsMkJBQU9tQixLQUFLQyxFQUFMLENBQVEsYUFBUixJQUF5QixJQUF6QixHQUFnQ1YsS0FEN0I7QUFFUk8sMkJBQU9yQyxPQUFPc0M7QUFGTixpQkFBRCxDQUFiO0FBS0g7QUFDRCxnQkFBSSxDQUFDZCxLQUFLQyxPQUFMLENBQWFNLEtBQWIsQ0FBTCxFQUEwQjtBQUN0QkksMEJBQVVJLEtBQUtDLEVBQUwsQ0FBUSxhQUFSLElBQXlCLElBQXpCLEdBQWdDVCxLQUFoQyxHQUF3QyxJQUFsRDtBQUNBVCx3QkFBUWMsSUFBUixDQUFhLENBQUM7QUFDVmhCLDJCQUFPbUIsS0FBS0MsRUFBTCxDQUFRLGFBQVIsSUFBeUIsSUFBekIsR0FBZ0NULEtBRDdCO0FBRVJNLDJCQUFPckMsT0FBT3NDO0FBRk4saUJBQUQsQ0FBYjtBQUtIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUdELFlBQUlHLGdCQUFnQnZDLFlBQXBCO0FBQ0EsWUFBSXdDLG9CQUFvQixDQUF4QjtBQUNBO0FBQ0EsWUFBSWpELGVBQWUsSUFBZixJQUF1QkEsWUFBWVcsTUFBWixHQUFxQixDQUFoRCxFQUFtRDtBQUMvQ3FDLDRCQUFnQnZDLGVBQWVILHFCQUEvQjtBQUNBLGdCQUFJMEMsZ0JBQWdCLENBQXBCLEVBQXVCO0FBQ25CQSxnQ0FBZ0IsQ0FBaEI7QUFDSDtBQUNEQyxnQ0FBb0JqRCxZQUFZVyxNQUFoQztBQUNBO0FBQ0EsaUJBQUssSUFBSXVDLEtBQUksQ0FBYixFQUFnQkEsS0FBSUQsaUJBQXBCLEVBQXVDQyxJQUF2QyxFQUE0QztBQUN4QyxvQkFBSUEsS0FBSXJCLFFBQVFsQixNQUFoQixFQUF3QjtBQUNwQix3QkFBSXdDLE1BQU10QixRQUFRcUIsRUFBUixDQUFWO0FBQ0EseUJBQUssSUFBSUUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSixnQkFBZ0IsQ0FBcEMsRUFBdUNJLEdBQXZDLEVBQTRDO0FBQ3hDRCw0QkFBSVIsSUFBSixDQUFTLEVBQUVoQixPQUFPLEdBQVQsRUFBVDtBQUNIO0FBQ0R3Qix3QkFBSVIsSUFBSixDQUFTLEVBQUVoQixPQUFPM0IsWUFBWWtELEVBQVosRUFBZWQsSUFBZixHQUFzQixHQUF0QixHQUE0QnBDLFlBQVlrRCxFQUFaLEVBQWV2QixLQUFwRCxFQUEyRGlCLE9BQU9yQyxPQUFPc0MsS0FBekUsRUFBVDtBQUNILGlCQU5ELE1BTU87QUFDSCx3QkFBSU0sT0FBTSxFQUFWO0FBQ0EseUJBQUssSUFBSUMsS0FBSSxDQUFiLEVBQWdCQSxLQUFJSixhQUFwQixFQUFtQ0ksSUFBbkMsRUFBd0M7QUFDcENELDZCQUFJUixJQUFKLENBQVMsRUFBRWhCLE9BQU8sR0FBVCxFQUFUO0FBQ0g7QUFDRHdCLHlCQUFJUixJQUFKLENBQVMsRUFBRWhCLE9BQU8zQixZQUFZa0QsRUFBWixFQUFlZCxJQUFmLEdBQXNCLEdBQXRCLEdBQTRCcEMsWUFBWWtELEVBQVosRUFBZXZCLEtBQXBELEVBQTJEaUIsT0FBT3JDLE9BQU9zQyxLQUF6RSxFQUFUO0FBQ0FoQiw0QkFBUWMsSUFBUixDQUFhUSxJQUFiO0FBQ0g7QUFFSjtBQUNKOztBQUVELFlBQUcsQ0FBQ3BCLEtBQUtDLE9BQUwsQ0FBYXJDLEtBQWIsQ0FBSjtBQUNBO0FBQ0lrQyxvQkFBUWMsSUFBUixDQUFhLENBQUMsRUFBRWhCLE9BQU9oQyxNQUFNMEQsV0FBTixFQUFULEVBQThCVCxPQUFPckMsT0FBT21DLE1BQTVDLEVBQUQsQ0FBYjtBQUNKO0FBQ0EsWUFBSVksTUFBTUMsT0FBTixDQUFjdEQsWUFBZCxLQUErQkEsYUFBYVUsTUFBYixHQUFzQixDQUF6RCxFQUE0RDtBQUN4RCxnQkFBSTZDLFNBQVN2RCxhQUFhd0QsTUFBYixDQUFvQixnQkFBUTtBQUFFLHVCQUFRN0MsS0FBSzhDLElBQUwsSUFBYSxDQUFyQjtBQUF5QixhQUF2RCxDQUFiO0FBQUEsZ0JBQ0lDLE9BQU8xRCxhQUFhd0QsTUFBYixDQUFvQixnQkFBUTtBQUFFLHVCQUFRN0MsS0FBSzhDLElBQUwsSUFBYSxDQUFyQjtBQUF5QixhQUF2RCxDQURYO0FBRUEsaUJBQUssSUFBSVIsTUFBSSxDQUFiLEVBQWdCQSxNQUFJTSxPQUFPN0MsTUFBM0IsRUFBbUN1QyxLQUFuQyxFQUF3QztBQUNwQ3JCLHdCQUFRYyxJQUFSLENBQWEsQ0FBQyxFQUFFaEIsT0FBTzZCLE9BQU9OLEdBQVAsRUFBVXZCLEtBQW5CLEVBQTBCaUIsT0FBT3JDLE9BQU9xRCxhQUF4QyxFQUFELENBQWI7QUFDSDtBQUNELGlCQUFLLElBQUl2QyxJQUFULElBQWdCc0MsSUFBaEIsRUFBc0I7QUFDbEIsb0JBQUkvQyxTQUFPK0MsS0FBS3RDLElBQUwsQ0FBWDtBQUFBLG9CQUNJNkIsTUFBSSxFQUFFdkIsT0FBT2YsT0FBS2UsS0FBZCxFQURSO0FBRUFmLHVCQUFLZ0MsS0FBTCxHQUFjaEMsT0FBS2dDLEtBQU4sR0FBZWhDLE9BQUtnQyxLQUFwQixHQUE0QnJDLE9BQU9zRCxXQUFoRDtBQUNBckMsdUJBQU9DLE1BQVAsQ0FBY3lCLEdBQWQsRUFBaUIsRUFBRU4sT0FBT2hDLE9BQUtnQyxLQUFkLEVBQWpCO0FBQ0FmLHdCQUFRYyxJQUFSLENBQWEsQ0FBQ08sR0FBRCxDQUFiO0FBQ0g7QUFDSjtBQUNEdEQsaUJBQVMsRUFBVDtBQUNBO0FBQ0E7QUFDQSxZQUFJc0QsSUFBSSxDQUFSO0FBQ0EsYUFBSyxJQUFJN0IsS0FBVCxJQUFnQlEsT0FBaEIsRUFBeUI7QUFDckIsZ0JBQUlpQyxlQUFlckQsWUFBbkI7QUFDQSxnQkFBSXlDLEtBQUtELGlCQUFULEVBQTRCO0FBQ3hCYSwrQkFBZWQsYUFBZjtBQUNIO0FBQ0QsZ0JBQUlwQyxPQUFPLEVBQUVtRCxPQUFPLEVBQUVuQyxLQUFNUCxRQUFNLENBQU4sR0FBVSxDQUFsQixFQUFzQjJDLFFBQVEsQ0FBOUIsRUFBVCxFQUE0Q0MsS0FBSyxFQUFFckMsS0FBTVAsUUFBTSxDQUFOLEdBQVUsQ0FBbEIsRUFBc0IyQyxRQUFRRixZQUE5QixFQUFqRCxFQUFYO0FBQ0FsRSxtQkFBTytDLElBQVAsQ0FBWS9CLElBQVo7QUFDQXNDO0FBQ0g7QUFDRDtBQUNBLGFBQUssSUFBSUEsTUFBSSxDQUFiLEVBQWdCQSxNQUFJRCxpQkFBcEIsRUFBdUNDLEtBQXZDLEVBQTRDO0FBQ3hDLGdCQUFJdEMsT0FBTyxFQUFFbUQsT0FBTyxFQUFFbkMsS0FBTXNCLE1BQUksQ0FBWixFQUFnQmMsUUFBUWhCLGdCQUFnQixDQUF4QyxFQUFULEVBQXNEaUIsS0FBSyxFQUFFckMsS0FBTXNCLE1BQUksQ0FBWixFQUFnQmMsUUFBUXZELFlBQXhCLEVBQTNELEVBQVg7QUFDQWIsbUJBQU8rQyxJQUFQLENBQVkvQixJQUFaO0FBQ0g7QUFDRCxZQUFJc0QsZ0JBQWdCckMsUUFBUWxCLE1BQTVCO0FBQ0EsWUFBSVosZ0JBQWdCLElBQWhCLElBQXdCQSxhQUFhb0UsSUFBckMsSUFBNkNwRSxhQUFhb0UsSUFBYixDQUFrQnhELE1BQWxCLEdBQTJCLENBQTVFLEVBQStFO0FBQzNFLGlCQUFLLElBQUl1QyxNQUFJLENBQWIsRUFBZ0JBLE1BQUluRCxhQUFhb0UsSUFBYixDQUFrQnhELE1BQXRDLEVBQThDdUMsS0FBOUMsRUFBbUQ7QUFDL0Msb0JBQUl0QyxTQUFPYixhQUFhb0UsSUFBYixDQUFrQmpCLEdBQWxCLENBQVg7QUFDQSxxQkFBSyxJQUFJRSxNQUFJLENBQWIsRUFBZ0JBLE1BQUl4QyxPQUFLRCxNQUF6QixFQUFpQ3lDLEtBQWpDLEVBQXNDO0FBQ2xDeEMsMkJBQUt3QyxHQUFMLEVBQVFSLEtBQVIsR0FBZ0JyQyxPQUFPVSxPQUF2QjtBQUNIO0FBQ0RZLHdCQUFRYyxJQUFSLENBQWEvQixNQUFiO0FBQ0g7QUFDSjtBQUNELFlBQUliLGdCQUFnQixJQUFoQixJQUF3QkEsYUFBYUgsTUFBckMsSUFBK0NHLGFBQWFILE1BQWIsQ0FBb0JlLE1BQXBCLEdBQTZCLENBQWhGLEVBQW1GO0FBQy9FLGlCQUFLLElBQUl1QyxNQUFJLENBQWIsRUFBZ0JBLE1BQUluRCxhQUFhSCxNQUFiLENBQW9CZSxNQUF4QyxFQUFnRHVDLEtBQWhELEVBQXFEO0FBQ2pELG9CQUFJdEMsU0FBT2IsYUFBYUgsTUFBYixDQUFvQnNELEdBQXBCLENBQVg7QUFDQXRDLHVCQUFLbUQsS0FBTCxDQUFXbkMsR0FBWCxHQUFpQmhCLE9BQUttRCxLQUFMLENBQVduQyxHQUFYLEdBQWlCc0MsYUFBbEM7QUFDQXRELHVCQUFLcUQsR0FBTCxDQUFTckMsR0FBVCxHQUFlaEIsT0FBS3FELEdBQUwsQ0FBU3JDLEdBQVQsR0FBZXNDLGFBQTlCO0FBQ0F0RSx1QkFBTytDLElBQVAsQ0FBWS9CLE1BQVo7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFlBQU13RCxTQUFTbkYsTUFBTW9GLFdBQU4sQ0FDWCxDQUFFO0FBQ0U7QUFDSWpDLGtCQUFNM0MsU0FEVixFQUNxQjtBQUNqQm9DLHFCQUFTQSxPQUZiO0FBR0lqQyxvQkFBUUEsTUFIWjtBQUlJMEUsMkJBQWV6RSxPQUpuQixFQUk0QjtBQUN4QnNFLGtCQUFNckUsVUFMVixDQUtxQjtBQUxyQixTQURKLENBRFcsQ0FBZjtBQVdBLGVBQU9zRSxNQUFQO0FBQ0gsS0FyT0QsQ0FzT0EsT0FBT0csRUFBUCxFQUFXO0FBQ1BDLGdCQUFRQyxHQUFSLENBQVksSUFBWixFQUFrQkYsRUFBbEI7QUFDSDtBQUNKLENBM09EIiwiZmlsZSI6IkZMRXhjZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhjZWwgPSByZXF1aXJlKCdub2RlLWV4Y2VsLWV4cG9ydCcpO1xudmFyIENvbnN0YW50cyA9IHJlcXVpcmUoYXBwUGF0aCArIFwiL3V0aWxzL0NvbnN0YW50c1wiKTtcbnZhciBGTEV4Y2VsID0gZnVuY3Rpb24gKCkgeyB9O1xubW9kdWxlLmV4cG9ydHMgPSBGTEV4Y2VsO1xuLyoqXG4gKiBAcGFyYW0gY29sdW1uR3JvdXBzIDogZ3JvdXAgaGVhZGVyXG4gKiBAcGFyYW0gcmlnaHRQYXJhbXM6IHRow7RuZyB0aW4gaGnhu4duIHRo4buLIHBow60gdHLDqm4gYsOqbiBwaOG6o2kgcmVwb3J0XG4gKiBAcGFyYW0gY2VudGVyUGFyYW1zOiB0aMO0bmcgdGluIGhp4buHbiB0aOG7iyBwaMOtYSBkxrDhu5tpIHJlcG9ydCB0aXRsZVxuICovXG5GTEV4Y2VsLmV4cG9ydCA9IGZ1bmN0aW9uIChzaGVldE5hbmUsIGNvbXBhbnksIHRpdGxlLCBtZXJnZXMsIGNvbHVtbnMsIGRhdGFTb3VyY2UsIGNvbHVtbkdyb3VwcyA9IG51bGwsIHJpZ2h0UGFyYW1zID0gbnVsbCwgY2VudGVyUGFyYW1zID0gbnVsbCwgaGlkZU5vID0gZmFsc2UsIGlzX3RvdGFsID0gZmFsc2UsIGlzX2dyb3VwID0gZmFsc2UsIGdyb3VwTmFtZSkge1xuICAgIC8qU+G7kSBj4buZdCBtZXJnZSBwYXJhbSBiw6puIHBo4bqjaSAqL1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1lcmdlUmlnaHRDb2x1bW5Db3VudCA9IDM7XG4gICAgICAgIC8vIFlvdSBjYW4gZGVmaW5lIHN0eWxlcyBhcyBqc29uIG9iamVjdFxuICAgICAgICBjb25zdCBzdHlsZXMgPSBDb25zdGFudHMuY29tbW9uX2V4Y2VsX2NlbGxfc3R5bGU7XG4gICAgICAgIHZhciBjb3VudENvbHVtbnMgPSAwO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZGF0YVNvdXJjZS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gZGF0YVNvdXJjZVtpbmRleF07XG4gICAgICAgICAgICBpdGVtLm5vID0gaW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjb2x1bW5zTm8gPSBbXTtcbiAgICAgICAgaWYgKGhpZGVObyAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgY291bnRDb2x1bW5zID0gMTtcbiAgICAgICAgICAgIGNvbHVtbnNOb1tcIm5vXCJdID0ge1xuICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIiNcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJTdHlsZTogc3R5bGVzLnRoZWFkZXIsXG4gICAgICAgICAgICAgICAgY2VsbFN0eWxlOiBzdHlsZXMudGJvZHksXG4gICAgICAgICAgICAgICAgd2lkdGg6IDUwXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29sdW1ucykge1xuICAgICAgICAgICAgaWYgKGNvbHVtbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbHVtbnNOb1trZXldID0gY29sdW1uc1trZXldO1xuICAgICAgICAgICAgICAgIGNvdW50Q29sdW1ucysrO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBjb2x1bW5zW2tleV07XG4gICAgICAgICAgICAgICAgZWxlbWVudC5oZWFkZXJTdHlsZSA9IHN0eWxlcy50aGVhZGVyO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5jZWxsU3R5bGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2VsbFN0eWxlID0gT2JqZWN0LmFzc2lnbih7fSwgZWxlbWVudC5jZWxsU3R5bGUsIHN0eWxlcy50Ym9keSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZWxlbWVudC5jZWxsU3R5bGUgIT09ICdvYmplY3QnICYmIHR5cGVvZiBlbGVtZW50LmNlbGxTdHlsZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNlbGxTdHlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHN0eWxlcy50Ym9keSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5jZWxsRm9ybWF0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2VsbEZvcm1hdCA9IGZ1bmN0aW9uICh2YWx1ZSwgcm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT0gJycpID8gJyAnIDogdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29sdW1ucyA9IGNvbHVtbnNObztcblxuICAgICAgICAvL0FycmF5IG9mIG9iamVjdHMgcmVwcmVzZW50aW5nIGhlYWRpbmcgcm93cyAodmVyeSB0b3ApXG4gICAgICAgIHZhciBoZWFkaW5nID0gW107XG4gICAgICAgIHZhciB1cmxfbG9nbyA9IFwiXCI7XG4gICAgICAgIGlmICghTGlicy5pc0JsYW5rKGNvbXBhbnkpKSB7XG4gICAgICAgICAgICB2YXIgeyBpZCwgdXJsLCBsb2dvLCBuYW1lLCBwaG9uZSwgZW1haWwsIGFkZHJlc3MsIGFkZHJlc3NfZnVsbCwgaXNvX2NvZGUgfSA9IGNvbXBhbnk7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gXCJcIjtcbiAgICAgICAgICAgIC8vIGlmICghTGlicy5pc0JsYW5rKGxvZ28pKSB7XG4gICAgICAgICAgICAgICAgLy8gdXJsX2xvZ28gPSB1cmwgKyBcIi9zeXN0ZW0vc2hvd0ltYWdlQWN0aW9uP2ZpbGVfbmFtZT1cIiArIGxvZ28gKyBcIiZoZWFkcXVhcnRlcl9pZD1cIiArIGlkO1xuICAgICAgICAgICAgICAgIC8vIHVybF9sb2dvID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDEvYXNzZXRzL2ltYWdlcy9sb2dpbi1iYWNrZ3JvdW5kLnBuZ1wiO1xuICAgICAgICAgICAgICAgIC8vIGhlYWRlciArPVwiPGltZyBzcmMgPSdcIit1cmxfbG9nbytcIicvPiBcXG5cIjtcbiAgICAgICAgICAgICAgICAvLyBoZWFkaW5nLnB1c2goW3sgdmFsdWU6IGhlYWRlciwgc3R5bGU6IHN0eWxlcy50aGVhZCB9XSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhuYW1lKSkge1xuICAgICAgICAgICAgICAgIGhlYWRlciArPSBuYW1lICsgXCJcXG5cIjtcbiAgICAgICAgICAgICAgICBoZWFkaW5nLnB1c2goW3sgdmFsdWU6IG5hbWUsIHN0eWxlOiBzdHlsZXMudGhlYWQgfV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoYWRkcmVzc19mdWxsKSkge1xuICAgICAgICAgICAgICAgIGhlYWRlciArPSBpMThuLl9fKCdwcmludC5hZGRyZXNzJykgKyAnOiAnICsgYWRkcmVzc19mdWxsICsgXCJcXG5cIjtcbiAgICAgICAgICAgICAgICBoZWFkaW5nLnB1c2goW3sgdmFsdWU6IGkxOG4uX18oJ3ByaW50LmFkZHJlc3MnKSArICc6ICcgKyBhZGRyZXNzX2Z1bGwsIHN0eWxlOiBzdHlsZXMudGhlYWQgfV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsocGhvbmUpKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVyICs9IGkxOG4uX18oJ3ByaW50LnBob25lJykgKyAnOiAnICsgcGhvbmUrIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgaGVhZGluZy5wdXNoKFt7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpMThuLl9fKCdwcmludC5waG9uZScpICsgJzogJyArIHBob25lXG4gICAgICAgICAgICAgICAgICAgICwgc3R5bGU6IHN0eWxlcy50aGVhZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGVtYWlsKSkge1xuICAgICAgICAgICAgICAgIGhlYWRlciArPSBpMThuLl9fKCdwcmludC5lbWFpbCcpICsgJzogJyArIGVtYWlsICsgXCJcXG5cIjtcbiAgICAgICAgICAgICAgICBoZWFkaW5nLnB1c2goW3tcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGkxOG4uX18oJ3ByaW50LmVtYWlsJykgKyAnOiAnICsgZW1haWxcbiAgICAgICAgICAgICAgICAgICAgLCBzdHlsZTogc3R5bGVzLnRoZWFkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgKCFMaWJzLmlzQmxhbmsod2Vic2l0ZSkpIHtcbiAgICAgICAgICAgIC8vICAgICBoZWFkZXIgKz0gaTE4bi5fXygnaGVhZHF1YXJ0ZXIud2Vic2l0ZScpICsgJzogJyArIHdlYnNpdGUgKyBcIlxcblwiO1xuICAgICAgICAgICAgLy8gICAgIGhlYWRpbmcucHVzaChbe1xuICAgICAgICAgICAgLy8gICAgICAgICB2YWx1ZTogaTE4bi5fXygnaGVhZHF1YXJ0ZXIud2Vic2l0ZScpICsgJzogJyArIHdlYnNpdGVcbiAgICAgICAgICAgIC8vICAgICAgICAgLCBzdHlsZTogc3R5bGVzLnRoZWFkXG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gICAgIF0pO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgY291bnRDb2x1bW5zMSA9IGNvdW50Q29sdW1ucztcbiAgICAgICAgbGV0IHJpZ2h0UGFyYW1zTGVuZ3RoID0gMDtcbiAgICAgICAgLypLaeG7g20gdHJhIG7hur91IGPDsyB0aMO0bmcgdGluIGhp4buHbiBwaMOtYSB0csOqbiwgYsOqbiAgcGjhuqNpIHRow6wgbWVyZ2VzIGhlYWRlciB0cuG7qyDEkWkgMyBj4buZdCAqL1xuICAgICAgICBpZiAocmlnaHRQYXJhbXMgIT0gbnVsbCAmJiByaWdodFBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb3VudENvbHVtbnMxID0gY291bnRDb2x1bW5zIC0gbWVyZ2VSaWdodENvbHVtbkNvdW50O1xuICAgICAgICAgICAgaWYgKGNvdW50Q29sdW1uczEgPCAyKSB7XG4gICAgICAgICAgICAgICAgY291bnRDb2x1bW5zMSA9IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodFBhcmFtc0xlbmd0aCA9IHJpZ2h0UGFyYW1zLmxlbmd0aDtcbiAgICAgICAgICAgIC8qVGjDqm0gcGjhuqduIHBhcmFtIGLDqm4gcGjhuqNpIHbDoG8qL1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByaWdodFBhcmFtc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBoZWFkaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXJyID0gaGVhZGluZ1tpXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb3VudENvbHVtbnMxIC0gMTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCh7IHZhbHVlOiAnICcgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goeyB2YWx1ZTogcmlnaHRQYXJhbXNbaV0ubmFtZSArICc6JyArIHJpZ2h0UGFyYW1zW2ldLnZhbHVlLCBzdHlsZTogc3R5bGVzLnRoZWFkIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhcnIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb3VudENvbHVtbnMxOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgdmFsdWU6ICcgJyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCh7IHZhbHVlOiByaWdodFBhcmFtc1tpXS5uYW1lICsgJzonICsgcmlnaHRQYXJhbXNbaV0udmFsdWUsIHN0eWxlOiBzdHlsZXMudGhlYWQgfSk7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRpbmcucHVzaChhcnIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoIUxpYnMuaXNCbGFuayh0aXRsZSkpXG4gICAgICAgIC8qVElUTEUgcmVwb3J0ICovXG4gICAgICAgICAgICBoZWFkaW5nLnB1c2goW3sgdmFsdWU6IHRpdGxlLnRvVXBwZXJDYXNlKCksIHN0eWxlOiBzdHlsZXMuaGVhZGVyIH1dKTtcbiAgICAgICAgLypQaMOtYSBkxrDhu5tpIFRpdGxlKi9cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2VudGVyUGFyYW1zKSAmJiBjZW50ZXJQYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IGNlbnRlciA9IGNlbnRlclBhcmFtcy5maWx0ZXIoaXRlbSA9PiB7IHJldHVybiAoaXRlbS50eXBlICE9IDEpIH0pLFxuICAgICAgICAgICAgICAgIG1haW4gPSBjZW50ZXJQYXJhbXMuZmlsdGVyKGl0ZW0gPT4geyByZXR1cm4gKGl0ZW0udHlwZSA9PSAxKSB9KTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2VudGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaGVhZGluZy5wdXNoKFt7IHZhbHVlOiBjZW50ZXJbaV0udmFsdWUsIHN0eWxlOiBzdHlsZXMuYm90dG9tX2hlYWRlciB9XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbWFpbikge1xuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gbWFpbltrZXldLFxuICAgICAgICAgICAgICAgICAgICBpID0geyB2YWx1ZTogaXRlbS52YWx1ZSB9O1xuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUgPSAoaXRlbS5zdHlsZSkgPyBpdGVtLnN0eWxlIDogc3R5bGVzLmxlZnRfaGVhZGVyO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaSwgeyBzdHlsZTogaXRlbS5zdHlsZSB9KTtcbiAgICAgICAgICAgICAgICBoZWFkaW5nLnB1c2goW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtZXJnZXMgPSBbXTtcbiAgICAgICAgLy8gbGV0IGxvZ29faW1nID0geyBzdGFydDogeyByb3c6IDEsIGNvbHVtbjogMSB9LCBlbmQ6IHsgcm93OiBoZWFkaW5nLmxlbmd0aCAtIDEsIGNvbHVtbjogMSB9IH1cbiAgICAgICAgLy8gbWVyZ2VzLnB1c2gobG9nb19pbWcpO1xuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBoZWFkaW5nKSB7XG4gICAgICAgICAgICBsZXQgbWVyZ2VDb2x1bW5zID0gY291bnRDb2x1bW5zO1xuICAgICAgICAgICAgaWYgKGkgPD0gcmlnaHRQYXJhbXNMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtZXJnZUNvbHVtbnMgPSBjb3VudENvbHVtbnMxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB7IHN0YXJ0OiB7IHJvdzogKGtleSAqIDEgKyAxKSwgY29sdW1uOiAxIH0sIGVuZDogeyByb3c6IChrZXkgKiAxICsgMSksIGNvbHVtbjogbWVyZ2VDb2x1bW5zIH0gfVxuICAgICAgICAgICAgbWVyZ2VzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgLypUaMOqbSBwaOG6p24gcGFyYW0gYsOqbiBwaOG6o2kgdsOgbyovXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmlnaHRQYXJhbXNMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB7IHN0YXJ0OiB7IHJvdzogKGkgKyAxKSwgY29sdW1uOiBjb3VudENvbHVtbnMxICsgMSB9LCBlbmQ6IHsgcm93OiAoaSArIDEpLCBjb2x1bW46IGNvdW50Q29sdW1ucyB9IH1cbiAgICAgICAgICAgIG1lcmdlcy5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBoZWFkaW5nTGVuZ2h0ID0gaGVhZGluZy5sZW5ndGg7XG4gICAgICAgIGlmIChjb2x1bW5Hcm91cHMgIT0gbnVsbCAmJiBjb2x1bW5Hcm91cHMuZGF0YSAmJiBjb2x1bW5Hcm91cHMuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbkdyb3Vwcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBjb2x1bW5Hcm91cHMuZGF0YVtpXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGl0ZW0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVtqXS5zdHlsZSA9IHN0eWxlcy50aGVhZGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBoZWFkaW5nLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbHVtbkdyb3VwcyAhPSBudWxsICYmIGNvbHVtbkdyb3Vwcy5tZXJnZXMgJiYgY29sdW1uR3JvdXBzLm1lcmdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbkdyb3Vwcy5tZXJnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGNvbHVtbkdyb3Vwcy5tZXJnZXNbaV07XG4gICAgICAgICAgICAgICAgaXRlbS5zdGFydC5yb3cgPSBpdGVtLnN0YXJ0LnJvdyArIGhlYWRpbmdMZW5naHQ7XG4gICAgICAgICAgICAgICAgaXRlbS5lbmQucm93ID0gaXRlbS5lbmQucm93ICsgaGVhZGluZ0xlbmdodDtcbiAgICAgICAgICAgICAgICBtZXJnZXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBpZiAoaXNfdG90YWwpIHtcbiAgICAgICAgLy8gICAgIC8vIGtoaSBiw6FvIGPDoW8gY8OzIHThu5VuZyBz4buRIHRp4buBblxuICAgICAgICAvLyAgICAgbGV0IGRhdGFTb3VyY2VfdGVtcCA9IFtdXG4gICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIGRhdGFTb3VyY2VfdGVtcCA9IGRhdGFTb3VyY2UuZmlsdGVyKGRhdGEgPT4ge1xuICAgICAgICAvLyAgICAgICAgIC8vIGlmKGRhdGEuaXNfdG90YWwgIT09IDEpe1xuICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gZGF0YS5pc190b3RhbCAhPT0gMVxuICAgICAgICAvLyAgICAgICAgIC8vIH1cbiAgICAgICAgLy8gICAgICAgICAvLyByZXR1cm4gZGF0YS5tX2xldmVsICE9PSA1XG4gICAgICAgIC8vICAgICB9KVxuICAgICAgICAvLyAgICAgZGF0YVNvdXJjZS5tYXAoZGF0YSA9PiB7XG4gICAgICAgIC8vICAgICAgICAgaWYgKGRhdGEuaXNfdG90YWwgPT09IDEgXG4gICAgICAgIC8vICAgICAgICAgICAgIC8vIHx8IGRhdGEubV9sZXZlbCA9PT0gNVxuICAgICAgICAvLyAgICAgICAgICAgICApIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgbGV0IGRhdGFfdGVtcCA9IHt9XG4gICAgICAgIC8vICAgICAgICAgICAgIGRhdGFfdGVtcC5pc190b3RhbCA9IGRhdGEuaXNfdG90YWxcbiAgICAgICAgLy8gICAgICAgICAgICAgZGF0YV90ZW1wLnBheW1lbnRfbW9uZXkgPSBkYXRhLnBheW1lbnRfbW9uZXlcbiAgICAgICAgLy8gICAgICAgICAgICAgaWYgKGRhdGEucXVhbnRpdHkpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGRhdGFfdGVtcC5xdWFudGl0eSA9IGRhdGEucXVhbnRpdHlcbiAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICBkYXRhX3RlbXAubWF0ZXJpYWxfbmFtZSA9IGRhdGEubWF0ZXJpYWxfbmFtZVxuICAgICAgICAvLyAgICAgICAgICAgICBkYXRhX3RlbXAubm8gPSBpMThuLl9fKCd0b3RhbCcpICsgaTE4bi5fXygnY29sb24nKVxuICAgICAgICAvLyAgICAgICAgICAgICBkYXRhU291cmNlX3RlbXAucHVzaChkYXRhX3RlbXApXG4gICAgICAgIC8vICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICByZXR1cm5cbiAgICAgICAgLy8gICAgIH0pXG4gICAgICAgIC8vICAgICBkYXRhU291cmNlID0gZGF0YVNvdXJjZV90ZW1wXG4gICAgICAgIC8vIH1cbiAgICAgICAgXG4gICAgICAgIC8vIGlmKGlzX2dyb3VwKSB7XG4gICAgICAgIC8vICAgICBsZXQgZGF0YV90ZW1wID0gW11cbiAgICAgICAgLy8gICAgIGxldCBpbmRleCA9IDFcbiAgICAgICAgLy8gICAgIGRhdGFTb3VyY2UubWFwKGRhdGEgPT4ge1xuICAgICAgICAvLyAgICAgICAgIGlmIChkYXRhLmhhc19jaGlsZCkge1xuICAgICAgICAvLyAgICAgICAgICAgICBkYXRhLm5vID0gZGF0YVtncm91cE5hbWVdXG4gICAgICAgIC8vICAgICAgICAgICAgIGRhdGFfdGVtcC5wdXNoKGRhdGEpXG4gICAgICAgIC8vICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmlzX3RvdGFsKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIGRhdGFfdGVtcC5wdXNoKGRhdGEpXG4gICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgZGF0YS5ubyA9IGluZGV4KysgXG4gICAgICAgIC8vICAgICAgICAgICAgIGRhdGFfdGVtcC5wdXNoKGRhdGEpXG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgLy8gICAgIGRhdGFTb3VyY2UgPSBkYXRhX3RlbXBcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNvbnN0IHJlcG9ydCA9IGV4Y2VsLmJ1aWxkRXhwb3J0KFxuICAgICAgICAgICAgWyAvLyA8LSBOb3RpY2UgdGhhdCB0aGlzIGlzIGFuIGFycmF5LiBQYXNzIG11bHRpcGxlIHNoZWV0cyB0byBjcmVhdGUgbXVsdGkgc2hlZXQgcmVwb3J0XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzaGVldE5hbmUsIC8vIDwtIFNwZWNpZnkgc2hlZXQgbmFtZSAob3B0aW9uYWwpXG4gICAgICAgICAgICAgICAgICAgIGhlYWRpbmc6IGhlYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgIG1lcmdlczogbWVyZ2VzLFxuICAgICAgICAgICAgICAgICAgICBzcGVjaWZpY2F0aW9uOiBjb2x1bW5zLCAvLyA8LSBSZXBvcnQgc3BlY2lmaWNhdGlvblxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhU291cmNlIC8vIDwtLSBSZXBvcnQgZGF0YVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJlcG9ydDtcbiAgICB9XG4gICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdleCcsIGV4KTtcbiAgICB9XG59XG4iXX0=