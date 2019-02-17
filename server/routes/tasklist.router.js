const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

router.get('/', (req, res) => {
    pool.query(`SELECT * FROM "task" ORDER BY "priority"`)
        .then((result) => {
            tasks = result.rows;
            res.send(tasks);
        }).catch((error) => {
            console.log('errors with task select', error);
            res.sendStatus(500);
        })
})

router.post('/', (req, res) => {
    console.log('task POST route was hit', req.body);
    
    pool.query(`INSERT INTO "task" (task, category, priority, deadline, date_created, completed) VALUES ($1,$2,$3,$4,$5,$6);`, [req.body.task, req.body.category, req.body.priority, req.body.deadline, req.body.date_created, req.body.completed]).then(() => {
        res.sendStatus(201);
    }).catch((error) => {
        console.log('errors with category insert', error);
        res.sendStatus(500);
    })
})

router.put('/:id', (req, res) => {
    console.log('/task PUT request was hit');
    console.log('req.params', req.params);
    pool.query(`UPDATE "task" SET "completed"=$1 WHERE "id"=$2;`, [req.body.completed, req.params.id]).then(() => {
        res.sendStatus(204); // successful update
    }).catch((error) => {
        console.log('errors with restaurant update query', error);
        res.sendStatus(500);
    })
});



module.exports = router;