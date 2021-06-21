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

// 점심메뉴 입력
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

// 점심메뉴 수정
const lunchUpdate = async (req, res) => {
	const id = req.params.id;
	const name = req.body.name;
	const food = req.body.food;

	const data = {
		"id": id,
		"name": name,
		"food": food,
	};
	lunchService.lunchUpdate(data);
	
	return res.status(200).json({"message": "Update Success"});
};

module.exports = {
	lunchList,
	lunchInput,
	lunchUpdate
};