const lunchService = require('../services/lunchService');
//const dateFormatter = require('../../utils/formatter');
const formatISO9075 = require('date-fns/formatISO9075')
const sub = require('date-fns/sub');

// 전체 리스트 표출 - 미완성
const lunchList = async (req, res) => {
	let startDate = "";
	let endDate = "";
	if (req.query.start_date && req.query.end_date) {
		startDate = req.query.start_date;
		endDate = req.query.end_date;
	} else {
		// dateTime을 수정할 것이기 때문에 let으로 둔다. 
    // --> const로 둬도 큰 문제 없는데 뭘까
		// let dateTime = new Date();
		// endDate = dateFormatter(dateTime);
		// setHours() => 날짜 혹은 시간 수정 메소드 (24시간 전으로 돌리기)
		// dateTime.setHours(dateTime.getHours() - 24);
		// startDate = dateFormatter(dateTime);

		// date-fns 모듈 사용하기
		endDate = new Date();
		startDate = sub(endDate, {hours:24});
		endDate = formatISO9075(endDate);
		startDate = formatISO9075(startDate);
	};

	const rows = await lunchService.lunchList(startDate, endDate);
	const result = [];

	for (i=0; i<rows.length; i++) {
		pair = {};
		pair["id"] = rows[i].id;
		pair["name"] = rows[i].name;
		pair["food"] = rows[i].food;
		// pair["created_at"] = dateFormatter(rows[i].created_at);
		// pair["updated_at"] = dateFormatter(rows[i].updated_at);
		pair["created_at"] = formatISO9075(rows[i].created_at);
		pair["updated_at"] = formatISO9075(rows[i].updated_at);
		result.push(pair);
	};
	return res.status(200).json(result);
};

// 단건 메뉴 확인
const lunchView = async (req, res) => {
	const id = req.params.id;

	const rows = await lunchService.lunchView(id);	

	let result = {}
	if (rows) {
		result["id"] = rows[0].id;
		result["name"] = rows[0].name;
		result["food"] = rows[0].food;
		result["created_at"] = formatISO9075(rows[0].created_at);
		result["updated_at"] = formatISO9075(rows[0].updated_at);
	};

	return res.status(200).json(result);
};

// 점심메뉴 입력
const lunchInput = async (req, res) => {
	const name = req.body.name;
	const food = req.body.food;
	
	const data = {
		"name": name,
		"food": food
	};
	await lunchService.lunchInput(data);

	return res.status(201).json({"message": "INSERT SUCCESS"})
};

// 점심메뉴 수정
const lunchUpdate = async (req, res) => {
	const id = req.params.id;
	const name = req.body.name;
	const food = req.body.food;

	const dateTime = new Date();
	// const endDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 12, 00, 0);
	// const startDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()-1, 12, 00, 00);
	const data = {
		"id": id,
		"name": name,
		"food": food,
		// "startDate": startDate,
		// "endDate": endDate
	};
	await lunchService.lunchUpdate(data);
	
	return res.status(200).json({"message": "Update Success"});
};

// 점심메뉴 삭제
const lunchDelete = async (req, res) => {
	const id = req.params.id;

	await lunchService.lunchDelete(id);

	return res.status(200).json({"message": "Delete Success"});
};

module.exports = {
	lunchList,
	lunchView,
	lunchInput,
	lunchUpdate,
	lunchDelete
};