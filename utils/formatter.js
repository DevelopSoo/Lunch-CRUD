const dateFormatter = (dateTime) => {
	const year = dateTime.getFullYear();
	const months = ("0" + (dateTime.getMonth() + 1)).slice(-2);
	const date = ("0" + dateTime.getDate()).slice(-2);
	const hours = ("0" + dateTime.getHours()).slice(-2);
	const minutes = ("0" + dateTime.getMinutes()).slice(-2);
	const seconds = ("0" + dateTime.getSeconds()).slice(-2);

	return `${year}-${months}-${date} ${hours}:${minutes}:${seconds}`;
}

module.exports = dateFormatter;