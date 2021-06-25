const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const lunchController = require('./src/controllers/lunchController');

// ----------------------------------------
const Slack = require('slack-node');
const schedule = require('node-schedule');
const config = require('./config')
// 
const dateSub = require('date-fns/sub');
const formatISO9075 = require('date-fns/formatISO9075');

const webhookUri = config.webhookUri;

const slack = new Slack();
slack.setWebhook(webhookUri);

const slackSend = async(message) => {
  const pool = config.pool
  let endDate = new Date()
  let startDate = dateSub(endDate, {hours:24});
  endDate = formatISO9075(endDate);
  startDate = formatISO9075(startDate);
	const connection = await pool.getConnection(async conn => conn);
	const [rows] = await connection.query("SELECT name, food FROM lunch WHERE updatedAt BETWEEN ? AND ?", [startDate, endDate])

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
  lunchArray.unshift({"type": "divider"}) // divider선
  lunchArray.push({"type": "divider"}) 
  lunchArray.unshift({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*오늘의 점심 리스트입니다.*"}
    }) // 알림 맨 위에 나오는 메시지

  console.log(lunchArray)

  slack.webhook({
    channel: "#개발",
    username: "slack bot",
    // text: "오늘의 점심 리스트입니다.",
    "attachments": [
      {
        "color": "#f2c744",
        "blocks": lunchArray
      }
    ]
  }, function(err, response) {
    console.log(response)
  });
}; 

schedule.scheduleJob('32 * * * *', () => {
  slackSend("병수");
});

// ----------------------------------------
/**
 * 화면으로 보여준다고 가`정할 시 사용하기
 */
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`port ${port} start!`);
});

app.get('/', (req, res) => {
  res.send('API SERVER OK');
});


app.get('/menus', lunchController.lunchList);
app.get('/menus/:id', lunchController.lunchView);
app.post('/menus', lunchController.lunchInput);
app.put('/menus/:id', lunchController.lunchUpdate);
app.delete('/menus/:id', lunchController.lunchDelete);

