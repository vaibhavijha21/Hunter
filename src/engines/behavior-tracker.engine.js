/**
 * Behavior Tracking Engine
 * Logs and normalizes user behavior metrics
 */
class BehaviorTracker {
  track(rawData) {
    const {
      timeTaken = 0,
      incorrectAttempts = 0,
      hintUsage = 0,
      edgeCaseFailures = 0,
      repeatedMistakes = 0,
      panicUnderTimer = false,
      questionId = null,
      userId = null
    } = rawData;

    // Validate required fields
    if (!questionId) {
      throw new Error('questionId is required');
    }

    return {
      questionId,
      userId,
      timeTaken: Math.max(0, timeTaken),
      incorrectAttempts: Math.max(0, incorrectAttempts),
      hintUsage: Math.max(0, hintUsage),
      edgeCaseFailures: Math.max(0, edgeCaseFailures),
      repeatedMistakes: Math.max(0, repeatedMistakes),
      panicUnderTimer: Boolean(panicUnderTimer),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Aggregate multiple session behaviors
   */
  aggregate(behaviors) {
    if (!behaviors || behaviors.length === 0) {
      return null;
    }

    const total = behaviors.length;
    const sum = behaviors.reduce((acc, b) => ({
      timeTaken: acc.timeTaken + b.timeTaken,
      incorrectAttempts: acc.incorrectAttempts + b.incorrectAttempts,
      hintUsage: acc.hintUsage + b.hintUsage,
      edgeCaseFailures: acc.edgeCaseFailures + b.edgeCaseFailures,
      repeatedMistakes: acc.repeatedMistakes + b.repeatedMistakes,
      panicCount: acc.panicCount + (b.panicUnderTimer ? 1 : 0)
    }), {
      timeTaken: 0,
      incorrectAttempts: 0,
      hintUsage: 0,
      edgeCaseFailures: 0,
      repeatedMistakes: 0,
      panicCount: 0
    });

    return {
      avgTimeTaken: sum.timeTaken / total,
      avgIncorrectAttempts: sum.incorrectAttempts / total,
      avgHintUsage: sum.hintUsage / total,
      avgEdgeCaseFailures: sum.edgeCaseFailures / total,
      avgRepeatedMistakes: sum.repeatedMistakes / total,
      panicRate: sum.panicCount / total
    };
  }
}

module.exports = new BehaviorTracker();
