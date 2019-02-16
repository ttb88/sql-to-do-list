const express = require('express');
const bodyParser = require('body-parser');
const tasklistRouter = require('./routes/tasklist.router');

const app = express();
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/task', tasklistRouter);
app.listen(PORT, () => {
    console.log('listening on port', PORT)
});