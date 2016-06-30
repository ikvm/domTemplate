/**
 * 扩展函数
 */
(function ($) {

    "use strict";

    function dateFormat(date, fmt) {
        date = new Date(date);
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }


    //自定义dateFormat函数
    $.domTemplate.registerHelper('dateFormat', function (value, pattern) {
        pattern = pattern || 'yyyy-MM-dd';
        return dateFormat(value,pattern);
    });

    function isArray(arr) {
        return Object.prototype.toString.apply(arr) === '[object Array]';
    }

    $.domTemplate.registerHelper('toList', function (obj) {
        if(typeof obj==="undefined"){
            return [];
        }else if(isArray(obj)){
            return obj;
        }else{
            return [obj];
        }
    });

    $.domTemplate.registerHelper('defaultIsEmpty', function (value,defaultStr) {
        if(typeof value==="undefined"||defaultStr==''){
            return defaultStr;
        }else{
            return value;
        }
    });

})($);