const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const lunchController = require('./src/controllers/lunchController');

const Slack = require('slack-node');
const schedule = require('node-schedule');
const { subBusinessDays } = require('date-fns');

const webhookUri = "https://hooks.slack.com/services/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"

const slack = new Slack();
slack.setWebhook(webhookUri);

const send = async(message) => {
  slack.webhook({
    channel: "#개발",
    username: "slack bot",
    text: `h1 ${message}!`
  }, function(err, response) {
    console.log(response)
  })
  
} 

schedule.scheduleJob('9 * * * *', function() {
  send("병수");
})
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

