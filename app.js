const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const lunchController = require('./src/controllers/lunchController');
const schedule = require('node-schedule');

// 먹고 싶은 점심 작성하라는 알람
schedule.scheduleJob('50 * * * *', () => {
  lunchController.slackSendLunchAlarm(); 
})
// 오늘의 점심 리스트 슬랙 알림 (매일 12시)
schedule.scheduleJob('* 12 * * *', () => {
  lunchController.slackSendList();
});

/**
 * 화면으로 보여준다고 가정할 시 사용하기
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

