const BehaviorTracker = require('../engines/behavior-tracker.engine');
const CognitiveProfiler = require('../engines/cognitive-profiler.engine');
const ExploitabilityIndex = require('../engines/exploitability-index.engine');
const DialogueDecision = require('../engines/dialogue-decision.engine');
const PatternMemory = require('../engines/pattern-memory.engine');
const PredictabilityModel = require('../engines/predictability-model.engine');
const VulnerabilityMatrix = require('../engines/vulnerability-matrix.engine');

class SessionController {
  analyzeSession(req, res) {
    try {
      const behaviorData = req.body;
      const { userId, conceptTags = [] } = behaviorData;

      // Step 1: Track behavior
      const trackedBehavior = BehaviorTracker.track(behaviorData);

      // Step 2: Track mistake patterns
      let patternMemoryData = null;
      if (trackedBehavior.incorrectAttempts > 0 || trackedBehavior.edgeCaseFailures > 0) {
        const mistakeType = determineMistakeType(trackedBehavior);
        patternMemoryData = PatternMemory.trackMistake(
          userId,
          trackedBehavior.questionId,
          mistakeType,
          conceptTags
        );
      } else {
        patternMemoryData = PatternMemory.getUserPattern(userId);
      }

      // Step 3: Generate cognitive profile
      const cognitiveProfile = CognitiveProfiler.profile(trackedBehavior);

      // Step 4: Analyze predictability (requires session history)
      const sessionHistory = [{ ...trackedBehavior, conceptTags }];
      const predictabilityData = PredictabilityModel.analyze(userId, sessionHistory);

      // Step 5: Calculate enhanced exploitability index
      const exploitabilityScore = ExploitabilityIndex.calculate(
        cognitiveProfile,
        patternMemoryData,
        predictabilityData
      );

      // Step 6: Generate vulnerability matrix
      const vulnerabilityMatrix = VulnerabilityMatrix.generate(
        cognitiveProfile,
        predictabilityData,
        patternMemoryData
      );

      // Step 7: Determine enhanced dialogue
      const dialogue = DialogueDecision.decide(
        cognitiveProfile.severityLevel,
        cognitiveProfile.weaknessTags,
        vulnerabilityMatrix.vulnerabilityProfile
      );

      // Response
      res.json({
        success: true,
        analysis: {
          behavior: trackedBehavior,
          profile: cognitiveProfile,
          patternMemory: patternMemoryData,
          predictability: predictabilityData,
          exploitability: exploitabilityScore,
          vulnerability: vulnerabilityMatrix.vulnerabilityProfile,
          dialogue: dialogue
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

function determineMistakeType(behavior) {
  if (behavior.edgeCaseFailures > 0) return 'edge-case-failure';
  if (behavior.repeatedMistakes > 0) return 'repeated-conceptual-error';
  if (behavior.incorrectAttempts >= 3) return 'trial-error-failure';
  if (behavior.panicUnderTimer) return 'time-pressure-failure';
  return 'general-mistake';
}

module.exports = new SessionController();
