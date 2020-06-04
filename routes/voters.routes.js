const express = require('express');
const router = express.Router();

const voters = require('../controllers/voters.controller');

router.get('/voters', voters.load);
router.post('/voters/:id', voters.add);

module.exports = router;

