var excel = require('node-excel-export');
var Constants = require(appPath + "/utils/Constants");
var FLExcel = function () { };
module.exports = FLExcel;
/**
 * @param columnGroups : group header
 * @param rightParams: thông tin hiện thị phí trên bên phải report
 * @param centerParams: thông tin hiện thị phía dưới report title
 */
FLExcel.export = function (sheetNane, company, title, merges, columns, dataSource, columnGroups = null, rightParams = null, centerParams = null, hideNo = false, is_total = false, is_group = false, groupName) {
    /*Số cột merge param bên phải */
    try {
        const mergeRightColumnCount = 3;
        // You can define styles as json object
        const styles = Constants.common_excel_cell_style;
        var countColumns = 0;
        for (let index = 0; index < dataSource.length; index++) {
            let item = dataSource[index];
            item.no = index + 1;
        }
        let columnsNo = [];
        if (hideNo !== true) {
            countColumns = 1;
            columnsNo["no"] = {
                displayName: "#",
                headerStyle: styles.theader,
                cellStyle: styles.tbody,
                width: 50
            };
        }

        for (const key in columns) {
            if (columns.hasOwnProperty(key)) {
                columnsNo[key] = columns[key];
                countColumns++;
                const element = columns[key];
                element.headerStyle = styles.theader;
                if (typeof element.cellStyle === 'object') {
                    element.cellStyle = Object.assign({}, element.cellStyle, styles.tbody);
                } else if (typeof element.cellStyle !== 'object' && typeof element.cellStyle !== 'function') {
                    element.cellStyle = Object.assign({}, styles.tbody);
                }
                if (typeof element.cellFormat !== 'function') {
                    element.cellFormat = function (value, row) {
                        return (value == null || value == '') ? ' ' : value;
                    }
                }
            }
        }
        columns = columnsNo;

        //Array of objects representing heading rows (very top)
        var heading = [];
        var url_logo = "";
        if (!Libs.isBlank(company)) {
            var { id, url, logo, name, phone, email, address, address_full, iso_code } = company;
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
                header += i18n.__('print.phone') + ': ' + phone+ "\n";
                heading.push([{
                    value: i18n.__('print.phone') + ': ' + phone
                    , style: styles.thead
                }
                ]);
            }
            if (!Libs.isBlank(email)) {
                header += i18n.__('print.email') + ': ' + email + "\n";
                heading.push([{
                    value: i18n.__('print.email') + ': ' + email
                    , style: styles.thead
                }
                ]);
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


        let countColumns1 = countColumns;
        let rightParamsLength = 0;
        /*Kiểm tra nếu có thông tin hiện phía trên, bên  phải thì merges header trừ đi 3 cột */
        if (rightParams != null && rightParams.length > 0) {
            countColumns1 = countColumns - mergeRightColumnCount;
            if (countColumns1 < 2) {
                countColumns1 = 2;
            }
            rightParamsLength = rightParams.length;
            /*Thêm phần param bên phải vào*/
            for (let i = 0; i < rightParamsLength; i++) {
                if (i < heading.length) {
                    let arr = heading[i];
                    for (let j = 0; j < countColumns1 - 1; j++) {
                        arr.push({ value: ' ' });
                    }
                    arr.push({ value: rightParams[i].name + ':' + rightParams[i].value, style: styles.thead });
                } else {
                    let arr = [];
                    for (let j = 0; j < countColumns1; j++) {
                        arr.push({ value: ' ' });
                    }
                    arr.push({ value: rightParams[i].name + ':' + rightParams[i].value, style: styles.thead });
                    heading.push(arr);
                }

            }
        }

        if(!Libs.isBlank(title))
        /*TITLE report */
            heading.push([{ value: title.toUpperCase(), style: styles.header }]);
        /*Phía dưới Title*/
        if (Array.isArray(centerParams) && centerParams.length > 0) {
            let center = centerParams.filter(item => { return (item.type != 1) }),
                main = centerParams.filter(item => { return (item.type == 1) });
            for (let i = 0; i < center.length; i++) {
                heading.push([{ value: center[i].value, style: styles.bottom_header }]);
            }
            for (let key in main) {
                let item = main[key],
                    i = { value: item.value };
                item.style = (item.style) ? item.style : styles.left_header;
                Object.assign(i, { style: item.style });
                heading.push([i]);
            }
        }
        merges = [];
        // let logo_img = { start: { row: 1, column: 1 }, end: { row: heading.length - 1, column: 1 } }
        // merges.push(logo_img);
        let i = 1;
        for (let key in heading) {
            let mergeColumns = countColumns;
            if (i <= rightParamsLength) {
                mergeColumns = countColumns1;
            }
            var item = { start: { row: (key * 1 + 1), column: 1 }, end: { row: (key * 1 + 1), column: mergeColumns } }
            merges.push(item);
            i++;
        }
        /*Thêm phần param bên phải vào*/
        for (let i = 0; i < rightParamsLength; i++) {
            var item = { start: { row: (i + 1), column: countColumns1 + 1 }, end: { row: (i + 1), column: countColumns } }
            merges.push(item);
        }
        let headingLenght = heading.length;
        if (columnGroups != null && columnGroups.data && columnGroups.data.length > 0) {
            for (let i = 0; i < columnGroups.data.length; i++) {
                let item = columnGroups.data[i];
                for (let j = 0; j < item.length; j++) {
                    item[j].style = styles.theader;
                }
                heading.push(item);
            }
        }
        if (columnGroups != null && columnGroups.merges && columnGroups.merges.length > 0) {
            for (let i = 0; i < columnGroups.merges.length; i++) {
                let item = columnGroups.merges[i];
                item.start.row = item.start.row + headingLenght;
                item.end.row = item.end.row + headingLenght;
                merges.push(item);
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

        const report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                    name: sheetNane, // <- Specify sheet name (optional)
                    heading: heading,
                    merges: merges,
                    specification: columns, // <- Report specification
                    data: dataSource // <-- Report data
                }
            ]
        );
        return report;
    }
    catch (ex) {
        console.log('ex', ex);
    }
}
