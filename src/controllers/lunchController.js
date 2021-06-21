const lunchService = require('../services/lunchService');
const dateFormatter = require('../../utils/formatter');

// 전체 리스트 표출 - 미완성
const lunchList = async (req, res) => {
	let startDate = "";
	let endDate = "";
	if (req.query.start_date && req.query.end_date) {
		startDate = req.query.start_date;
		endDate = req.query.end_date;
	} else {
		// dateTime을 수정할 것이기 때문에 let으로 둔다. --> const로 둬도 큰 문제 없는데 뭘까
		let dateTime = new Date();

		endDate = dateFormatter(dateTime);
		// 24시간 전으로 돌리기
		dateTime.setHours(dateTime.getHours() - 24);
		startDate = dateFormatter(dateTime);
	};

	const rows = await lunchService.lunchList(startDate, endDate);
	const result = [];

	for (i=0; i<rows.length; i++) {
		pair = {};
		pair["startDate"] = startDate;
		pair["endDate"] = endDate;
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