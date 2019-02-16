const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

router.get('/', (req, res) => {
    pool.query(`SELECT * FROM "category" ORDER BY "category" DESC`)
        .then((result) => {
            categories = result.rows;
            res.send(categories);
        }).catch((error) => {
            console.log('errors with category select', error);
            res.sendStatus(500);
        })
})

router.post('/', (req, res) => {
    pool.query(`INSERT INTO "category" (category) VALUES ($1);`, [req.body.category]).then(() => {
        res.sendStatus(201);
    }).catch((error) => {
            console.log('errors with category insert', error);
            res.sendStatus(500);
        })
})


module.exports = router;