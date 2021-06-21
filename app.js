const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const lunchController = require('./src/controllers/lunchController');

/**
 * 화면으로 보여준다고 가정할 시 사용하기
 */
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`start!`);
});

app.get('/', (req, res) => {
  res.send('API SERVER OK');
});


app.get('/menus', lunchController.lunchList);
app.get('/menus/:id', lunchController.lunchView);
app.post('/menus', lunchController.lunchInput);
app.put('/menus/:id', lunchController.lunchUpdate);
