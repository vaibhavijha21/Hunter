const AdaptiveTrap = require('../engines/adaptive-trap.engine');
const QuestionBank = require('../data/question-bank');

class QuestionController {
  getAdaptiveQuestion(req, res) {
    try {
      const { 
        weaknessTags, 
        userId, 
        previousQuestions,
        exploitabilityScore,
        vulnerabilityTier 
      } = req.query;

      const tags = weaknessTags ? weaknessTags.split(',') : [];
      const previous = previousQuestions ? previousQuestions.split(',') : [];
      const exploitability = exploitabilityScore ? parseInt(exploitabilityScore) : 0;

      // Build vulnerability profile if tier provided
      let vulnerabilityProfile = null;
      if (vulnerabilityTier) {
        vulnerabilityProfile = { tier: vulnerabilityTier };
      }

      // Get adaptive question with enhanced parameters
      const question = AdaptiveTrap.selectQuestion(
        tags, 
        previous, 
        exploitability,
        vulnerabilityProfile
      );

      if (!question) {
        return res.status(404).json({ 
          success: false, 
          error: 'No suitable question found' 
        });
      }

      res.json({
        success: true,
        question: question
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new QuestionController();
