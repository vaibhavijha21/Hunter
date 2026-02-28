/**
 * Predictability Model (Deterministic)
 * Classifies user behavior patterns and predicts future actions
 */
class PredictabilityModel {
  constructor() {
    this.userBehaviorHistory = new Map();
  }

  analyze(userId, sessionHistory) {
    if (!this.userBehaviorHistory.has(userId)) {
      this.userBehaviorHistory.set(userId, []);
    }

    const history = this.userBehaviorHistory.get(userId);
    history.push(...sessionHistory);

    // Keep last 20 sessions
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    const behaviorClassification = this._classifyBehavior(history);
    const predictabilityLevel = this._calculatePredictability(history, behaviorClassification);
    const avoidancePatterns = this._detectAvoidance(history);

    return {
      behaviorClassification,
      predictabilityLevel,
      avoidancePatterns,
      consistencyScore: this._calculateConsistency(history),
      timestamp: new Date().toISOString()
    };
  }

  _classifyBehavior(history) {
    const classifications = [];

    // Impulsive behavior detection
    const quickIncorrectCount = history.filter(
      s => s.timeTaken < 120 && s.incorrectAttempts >= 2
    ).length;

    if (quickIncorrectCount / history.length > 0.4) {
      classifications.push('impulsive');
    }

    // Dependent behavior detection
    const highHintUsage = history.filter(s => s.hintUsage >= 2).length;
    const eventualSolvers = history.filter(
      s => s.hintUsage >= 2 && s.incorrectAttempts <= 3
    ).length;

    if (highHintUsage / history.length > 0.5 && eventualSolvers > 0) {
      classifications.push('dependent');
    }

    // Methodical behavior
    const slowAccurate = history.filter(
      s => s.timeTaken > 300 && s.incorrectAttempts <= 1
    ).length;

    if (slowAccurate / history.length > 0.5) {
      classifications.push('methodical');
    }

    // Panic-prone behavior
    const panicCount = history.filter(s => s.panicUnderTimer).length;
    if (panicCount / history.length > 0.3) {
      classifications.push('panic-prone');
    }

    // Erratic behavior
    const timeVariance = this._calculateVariance(history.map(s => s.timeTaken));
    const attemptVariance = this._calculateVariance(history.map(s => s.incorrectAttempts));
    
    if (timeVariance > 10000 || attemptVariance > 4) {
      classifications.push('erratic');
    }

    return classifications.length > 0 ? classifications : ['stable'];
  }

  _calculatePredictability(history, classifications) {
    let predictabilityScore = 0;

    // Consistent behavior patterns increase predictability
    if (classifications.includes('methodical')) predictabilityScore += 30;
    if (classifications.includes('impulsive')) predictabilityScore += 25;
    if (classifications.includes('dependent')) predictabilityScore += 20;
    if (classifications.includes('panic-prone')) predictabilityScore += 15;

    // Erratic behavior decreases predictability
    if (classifications.includes('erratic')) predictabilityScore -= 20;

    // Consistency in metrics increases predictability
    const consistencyBonus = this._calculateConsistency(history) * 0.5;
    predictabilityScore += consistencyBonus;

    predictabilityScore = Math.max(0, Math.min(100, predictabilityScore));

    if (predictabilityScore >= 70) return 'high';
    if (predictabilityScore >= 40) return 'medium';
    return 'low';
  }

  _detectAvoidance(history) {
    const conceptAttempts = new Map();
    const conceptFailures = new Map();

    history.forEach(session => {
      if (session.conceptTags) {
        session.conceptTags.forEach(concept => {
          conceptAttempts.set(concept, (conceptAttempts.get(concept) || 0) + 1);
          
          if (session.incorrectAttempts >= 2 || session.edgeCaseFailures >= 1) {
            conceptFailures.set(concept, (conceptFailures.get(concept) || 0) + 1);
          }
        });
      }
    });

    const avoidedConcepts = [];
    
    // Detect concepts with high failure rate (potential avoidance)
    for (const [concept, attempts] of conceptAttempts.entries()) {
      const failures = conceptFailures.get(concept) || 0;
      const failureRate = failures / attempts;

      if (failureRate > 0.6 && attempts >= 2) {
        avoidedConcepts.push({
          concept,
          failureRate: Math.round(failureRate * 100),
          attempts
        });
      }
    }

    return avoidedConcepts;
  }

  _calculateConsistency(history) {
    if (history.length < 3) return 50;

    const timeConsistency = 100 - Math.min(
      this._calculateVariance(history.map(s => s.timeTaken)) / 100,
      100
    );

    const attemptConsistency = 100 - Math.min(
      this._calculateVariance(history.map(s => s.incorrectAttempts)) * 20,
      100
    );

    return (timeConsistency + attemptConsistency) / 2;
  }

  _calculateVariance(values) {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  getUserBehavior(userId) {
    const history = this.userBehaviorHistory.get(userId) || [];
    return this.analyze(userId, []);
  }
}

module.exports = new PredictabilityModel();
