const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

// will return all items from "task" table on database ordered ascending by "priority id" --> "deadline" --> "category"
router.get('/', (req, res) => {
    pool.query(`SELECT * FROM "task" ORDER BY "priority_id" ASC, "deadline", "category"`)
        .then((result) => {
            tasks = result.rows;
            res.send(tasks);
        }).catch((error) => {
            console.log('errors with task select', error);
            res.sendStatus(500);
        })
})

// will receive new task content and insert into the applicable fields on "task" table in database
router.post('/', (req, res) => {
    console.log('task POST route was hit', req.body);
    pool.query(`INSERT INTO "task" (task, category, priority, priority_id, deadline, date_created, completed, note) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`, [req.body.task, req.body.category, req.body.priority, req.body.priority_id, req.body.deadline, req.body.date_created, req.body.completed, req.body.note]).then(() => {
        res.sendStatus(201);
    }).catch((error) => {
        console.log('errors with task insert', error);
        res.sendStatus(500);
    })
})

// if checkbox is checked or unchecked on DOM, the "completed" and "priority_id" fields on "task" table will be updated on database
// "completed"- (checked="checked" / unchecked = "")
// "priority_id"- (checked="5" / unchecked = [original value])
router.put('/:id', (req, res) => {
    console.log('/task PUT request was hit');
    // console.log('req.params', req.params);
    pool.query(`UPDATE "task" SET "completed"=$1, "priority_id"=$2 WHERE "id"=$3;`, [req.body.completed, req.body.priority_id, req.params.id]).then(() => {
        res.sendStatus(204); 
    }).catch((error) => {
        console.log('errors with task update query', error);
        res.sendStatus(500);
    })
});

// capture all updates from edit form on DOM and update the applicable fields on "task" table in database 
router.put('/update/:id', (req, res) => {
    console.log('/task PUT request was hit');
    // console.log('req.params', req.params);
    pool.query(`UPDATE "task" SET "task"=$1, "category"=$2, "priority"=$3, "priority_id"=$4, "deadline"=$5, "note"=$6 WHERE "id"=$7;`, [req.body.task, req.body.category, req.body.priority, req.body.priority_id, req.body.deadline, req.body.note, req.params.id]).then(() => {
        res.sendStatus(204); 
    }).catch((error) => {
        console.log('errors with task update query', error);
        res.sendStatus(500);
    })
});

// delete selected row on DOM from database
router.delete('/:id', (req, res) => {
    // console.log('req.params', req.params);
    pool.query(`DELETE FROM "task" WHERE "id"=$1;`, [req.params.id]).then(() => {
        res.sendStatus(204); 
    }).catch((error) => {
        console.log('errors with task delete query', error);
        res.sendStatus(500);
    })
});


module.exports = router;