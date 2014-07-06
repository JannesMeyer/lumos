var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function padZero(number) {
	var str = number.toString();
	return str.length < 2 ? '0' + str : str;
}

export function toString(d) {
	return `${padZero(d.day)}.${padZero(d.month)}.${d.year}`;
	// return d.monthName + ' ' + d.day + ', ' + d.year;
}

export function create(year, month, day) {
	if (year === undefined || month === undefined || day === undefined) {
		throw new Error('Needs more arguments');
	}

	return { year, month, day };
}

export function createFromDate(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	return { year, month, day };
}

export function today() {
	return createFromDate(new Date());
}

export function getMonthName(d) {
	return monthNames[d.month - 1];
}

// export function timeAsString(t) {
// 	return padZero(t.hours) + ':' + padZero(t.minutes);
// }

/**
 * ISO 8601
 * Well, this actually doesn't adhere to the standard at all, because
 * it allows the omission of the year to mean the current year.
 * (or the omission of the current year and month)
 * It also doesn't check if the month and the day are within reasonable
 * bounds.
 */
var isoDateRegex = /^(?:(?:([\d]{4})-)?(0?[1-9]|1[0-2])-)?(0?[1-9]|[12][0-9]|3[01])$/;

export function parseIsoDate(date) {
	var result = isoDateRegex.exec(date);
	if (!result) {
		throw new Error('Could not parse the date');
	}

	var d = today();
	if (result[1]) {
		d.year = result[1];
	}
	if (result[2]) {
		d.month = result[2];
	}
	d.day = result[3];
	return d;
}