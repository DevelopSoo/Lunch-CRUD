const lunchService = require('../services/lunchService');
const formatISO9075 = require('date-fns/formatISO9075');
const dateSub = require('date-fns/sub');
const Slack = require('slack-node'); // 여기
const config = require('../../config') // 컨트롤러(slack 연결), 서비스(db연결)


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

const slackSendLunchTodayList = async () => {
	let endDate = new Date();
	let startDate = dateSub(endDate, {hours:24});
	endDate = formatISO9075(endDate);
  startDate = formatISO9075(startDate);
	const rows = await lunchService.slackGetTodayLunchList(startDate, endDate);

	// 슬랙에 이름과 음식을 표출하기 위한 작업
	const lunchArray = []
	for (i=0; i<rows.length; i++) {
		lunchArray.push(
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": `이름: ${rows[i].name}\n음식: ${rows[i].food}`
				}       
			});
	};

	// webhook의 attachments의 block 모양을 맞추기 위해 앞,뒤에 다음과 같이 정보를 삽입
	lunchArray.push({"type": "divider"}); // divider선
	lunchArray.unshift({"type": "divider"}); 
	lunchArray.unshift({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*오늘의 점심 리스트입니다.*"}
	}); // 알림 맨 위에 나오는 메시지

	// webhook url로 slack 연결
	const webhookUri = config.webhookUri;
	const slack = new Slack();
	slack.setWebhook(webhookUri);

  slack.webhook({
    channel: "#개발",
    username: "slack bot",
    attachments: [
      {
        "color": "#f2c744",
        "blocks": lunchArray
      }
    ]
  }, (err, response) => {
    console.log(response);
  });
};

const slackSendLunchInputAlarm = async () => {
	const webhookUri = config.webhookUri;
	const slack = new Slack();
	slack.setWebhook(webhookUri);

	slack.webhook({
		channel: "#개발",
		username: "slack bot",
		attachments: [
		{
			"color": "#f2c744",
			"blocks": [
				{
					"type": "section",
					"text": {
						"type": "mrkdwn",
						"text": "*오늘 점심을 선택해주세요!!*"}
				}
			]
		}
		]
	}, (err, response) => {
		console.log(response);
	});
};


module.exports = {
	lunchList,
	lunchView,
	lunchInput,
	lunchUpdate,
	lunchDelete,
	slackSendLunchTodayList,
	slackSendLunchInputAlarm
};