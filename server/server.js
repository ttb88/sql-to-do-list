const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const tasklistRouter = require('./routes/tasklist.router');
const categoryRouter = require('./routes/category.router');
const PORT = process.env.PORT || 5000;

/** ---------- MIDDLEWARE ---------- **/
app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));

/** ---------- EXPRESS ROUTES ---------- **/
app.use('/task', tasklistRouter);
app.use('/category', categoryRouter);

/** ---------- START SERVER ---------- **/
app.listen(PORT, () => {
    console.log('listening on port', PORT)
});