const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');

router.post('/analyze', sessionController.analyzeSession);

module.exports = router;
