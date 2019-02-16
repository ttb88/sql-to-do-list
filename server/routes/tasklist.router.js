const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

router.get('/', (req, res) => {
    pool.query(`SELECT * FROM "restaurants" ORDER BY "id"`)
        .then((result) => {
            restaurants = result.rows;
            res.send(restaurants);
        }).catch((error) => {
            console.log('errors with restaurant select', error);
            res.sendStatus(500);
        })
})



module.exports = router;