const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

router.get('/adaptive', questionController.getAdaptiveQuestion);

module.exports = router;
