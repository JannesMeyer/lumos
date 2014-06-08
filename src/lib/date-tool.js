var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function dateInCustomFormat(date) {
	if (date === undefined) { return; }

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var monthName = monthNames[date.getMonth()];
	var day = date.getDate();
	return {year, month, monthName, day};
}

export function dayAsString(d) {
	return padZero(d.day) + '.' + padZero(d.month) + '.' + d.year;
	// return d.monthName + ' ' + d.day + ', ' + d.year;
}

export function timeAsString(t) {
	return padZero(t.hours) + ':' + padZero(t.minutes);
}

export function padZero(number) {
	var str = number.toString();
	return str.length < 2 ? '0' + str : str;
}