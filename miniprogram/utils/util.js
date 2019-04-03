// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
function formatDate(date, fmt) {
	var o = {
		"M+": date.getMonth() + 1,                 //月份   
		"d+": date.getDate(),                    //日   
		"h+": date.getHours(),                   //小时   
		"m+": date.getMinutes(),                 //分   
		"s+": date.getSeconds(),                 //秒   
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
		"S": date.getMilliseconds()             //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	const hour = parseInt(time / 3600, 10)
	time %= 3600
	const minute = parseInt(time / 60, 10)
	time = parseInt(time % 60, 10)
	const second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

function fib(n) {
	if (n < 1) return 0
	if (n <= 2) return 1
	return fib(n - 1) + fib(n - 2)
}

function formatLeadingZeroNumber(n, digitNum = 2) {
	n = n.toString()
	const needNum = Math.max(digitNum - n.length, 0)
	return new Array(needNum).fill(0).join('') + n
}

function formatDateTime(date, withMs = false) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	const ms = date.getMilliseconds()

	let ret = [year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-') +
		' ' + [hour, minute, second].map(value => formatLeadingZeroNumber(value, 2)).join(':')
	if (withMs) {
		ret += '.' + formatLeadingZeroNumber(ms, 3)
	}
	return ret
}

module.exports = {
	formatDate,
	formatTime,
	formatLocation,
	fib,
	formatDateTime
}
