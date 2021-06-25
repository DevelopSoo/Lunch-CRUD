const lunchService = require('../services/lunchService');
const formatISO9075 = require('date-fns/formatISO9075');
const dateSub = require('date-fns/sub');

/**
 * 전체 리스트 표출
*/
const lunchList = async (req, res) => {
	try {
		let startDate = "";
		let endDate = "";

		// 확인 시작 날짜, 시간에서 끝 날짜, 시간 확인 (query parameter)
		if (req.query.startDate && req.query.endDate) {
			startDate = req.query.startDate;
			endDate = req.query.endDate;
		} else {
		// query parameter로 날짜 값이 들어오지 않았을 경우, 오늘 12시부터 어제 12시 검색
			// date-fns 모듈 사용하기
			endDate = new Date();
			// 현재 시간(endDate)에서 24시간 빼기
			startDate = dateSub(endDate, {hours:24});
			// 데이터 포매팅 'yyyy-mm-dd hh:mm:ss'
			endDate = formatISO9075(endDate);
			startDate = formatISO9075(startDate);
		};

		const rows = await lunchService.lunchList(startDate, endDate);

		for (i=0; i<rows.length; i++) {
			rows[i].createdAt = formatISO9075(rows[i].createdAt);
			rows[i].updatedAt = formatISO9075(rows[i].updatedAt);
		};
		return res.status(200).json({"result": rows});
	} catch (e) {
		return res.json({"error_message": e.message});
	};
};

/**
 * 단건 메뉴 확인
*/
const lunchView = async (req, res) => {
	try {
		const rows = await lunchService.lunchView(req.params.id);	
		// 정보를 가져올 경우 (해당 row가 있을 때)
		for (i=0; i<rows.length; i++) {
			rows[0].createdAt = formatISO9075(rows[0].createdAt);
			rows[0].updatedAt = formatISO9075(rows[0].updatedAt);
		};	
		return res.json({"result": rows[0]});
	} catch (e) {
		return res.json({"error_message": e.message});
	};
};


/**
 * 점심 메뉴 입력
*/
const lunchInput = async (req, res) => {
	try {
		const affectedRows = await lunchService.lunchInput(req.body.name, req.body.food);
		if (affectedRows === 0) {
			return res.status(200).json({"message": "Nothing has Input"});
		};
		return res.status(201).json({"message": "INSERT SUCCESS"});
	} catch (e) {
		return res.json({"error_message": e.message});
	};
};

/**
 * 점심 메뉴 수정
*/
const lunchUpdate = async (req, res) => {
	try {
		const affectedRows = await lunchService.lunchUpdate(req.params.id, req.body.name, req.body.food);
		if (affectedRows === 0) {
			return res.status(200).json({"message": "Nothing has changed"});
		};
		return res.status(200).json({"message": "Update Success"});
	} catch (e) {
		return res.json({"error_message": e.message});
	};
};

/**
 * 점심 메뉴 삭제
*/
const lunchDelete = async (req, res) => {
	try {
		const affectedRows = await lunchService.lunchDelete(req.params.id);
		if (affectedRows === 0) {
			return res.status(200).json({"message": "Nothing has deleted"});
		};
		return res.status(200).json({"message": "Delete Success"});
	} catch (e) {
		return res.json({"error_message": e.message});
	};
};


module.exports = {
	lunchList,
	lunchView,
	lunchInput,
	lunchUpdate,
	lunchDelete
};