const lunchService = require('../services/lunchService');

const lunchList = async (req, res) => {
	const rows = await lunchService.lunchList();
	const result = [];
	for (i=0; i<rows.length; i++) {
		pair = {};
		pair["name"] = rows[i].name;
		pair["food"] = rows[i].food;
		result.push(pair);
	}
	return res.status(200).json(result);
}

module.exports = {
	lunchList
}