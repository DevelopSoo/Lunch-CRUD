const lunchService = require('../services/lunchService');
const formatISO9075 = require('date-fns/formatISO9075')
const sub = require('date-fns/sub');

/**
 * 전체 리스트 표출
*/
const lunchList = async (req, res) => {
	let startDate = "";
	let endDate = "";

	// 확인 시작 날짜, 시간에서 끝 날짜, 시간 확인 (query parameter)
	if (req.query.start_date && req.query.end_date) {
		startDate = req.query.start_date;
		endDate = req.query.end_date;
	} else {
	// query parameter로 날짜 값이 들어오지 않았을 경우, 오늘 12시부터 어제 12시 검색
		// date-fns 모듈 사용하기
		endDate = new Date();
		// 현재 시간(endDate)에서 24시간 빼기
		startDate = sub(endDate, {hours:24});
		// 데이터 포매팅 'yyyy-mm-dd hh:mm:ss'
		endDate = formatISO9075(endDate);
		startDate = formatISO9075(startDate);
	};

	const rows = await lunchService.lunchList(startDate, endDate);
	const result = [];

	for (i=0; i<rows.length; i++) {
		data = {};
		data["id"] = rows[i].id;
		data["name"] = rows[i].name;
		data["food"] = rows[i].food;
		data["created_at"] = formatISO9075(rows[i].created_at);
		data["updated_at"] = formatISO9075(rows[i].updated_at);
		result.push(data);
	};
	return res.status(200).json(result);
};

/**
 * 단건 메뉴 확인
*/
const lunchView = async (req, res) => {
	// path parameter로 id를 받아 확인
	const id = req.params.id;
	const rows = await lunchService.lunchView(id);	

	let result = {}
	// 정보를 가져올 경우 (해당 row가 있을 때)
	if (rows.length !== 0) {
		result["id"] = rows[0].id;
		result["name"] = rows[0].name;
		result["food"] = rows[0].food;
		result["created_at"] = formatISO9075(rows[0].created_at);
		result["updated_at"] = formatISO9075(rows[0].updated_at);
	} else {
	// 정보가 없을 경우 (해당 row가 없을 때)
		return res.status(400).json({"message": "No data in database"});
	};
	return res.status(200).json(result);
};

/**
 * 점심 메뉴 입력
*/
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

/**
 * 점심 메뉴 수정
*/
const lunchUpdate = async (req, res) => {
	const id = req.params.id;
	const name = req.body.name;
	const food = req.body.food;

	const dateTime = new Date();
	const data = {
		"id": id,
		"name": name,
		"food": food,
	};
	await lunchService.lunchUpdate(data);
	return res.status(200).json({"message": "Update Success"});
};

/**
 * 점심 메뉴 삭제
*/
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