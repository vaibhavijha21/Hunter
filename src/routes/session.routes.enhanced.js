const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller.enhanced');

// Main analysis endpoint
router.post('/analyze', sessionController.analyzeSession.bind(sessionController));

// Get user profile
router.get('/profile/:userId', sessionController.getUserProfile.bind(sessionController));

// Reset user (for testing)
router.delete('/reset/:userId', sessionController.resetUser.bind(sessionController));

// Simulation Infrastructure endpoints
router.get('/replay/:userId', sessionController.getSessionReplay.bind(sessionController));
router.get('/personas', sessionController.getPersonas.bind(sessionController));
router.post('/persona/:userId', sessionController.setPersona.bind(sessionController));

module.exports = router;
