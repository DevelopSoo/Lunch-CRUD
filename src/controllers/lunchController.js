const lunchService = require('../services/lunchService');

// 전체 리스트 표출 - 미완성
const lunchList = async (req, res) => {
	const rows = await lunchService.lunchList();
	
	const result = [];

	for (i=0; i<rows.length; i++) {
		pair = {};
		pair["name"] = rows[i].name;
		pair["food"] = rows[i].food;
		result.push(pair);
	};
	return res.status(200).json(result);
}

const lunchInput = async (req, res) => {
	const name = req.body.name;
	const food = req.body.food;
	
	const data = {
		"name": name,
		"food": food
	};
	lunchService.lunchInput(data);

	return res.status(201).json({"message": "INSERT SUCCESS"})
};

module.exports = {
	lunchList,
	lunchInput
};