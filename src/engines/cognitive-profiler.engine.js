/**
 * Cognitive Profiling Engine
 * Analyzes behavior to generate weakness tags, stability score, and severity level
 */
class CognitiveProfiler {
  profile(behaviorData) {
    const weaknessTags = this._generateWeaknessTags(behaviorData);
    const stabilityScore = this._calculateStabilityScore(behaviorData);
    const severityLevel = this._determineSeverityLevel(stabilityScore, weaknessTags);

    return {
      weaknessTags,
      stabilityScore,
      severityLevel,
      timestamp: new Date().toISOString()
    };
  }

  _generateWeaknessTags(behavior) {
    const tags = [];

    // Time pressure weakness
    if (behavior.panicUnderTimer) {
      tags.push('time-pressure');
    }

    // Pattern recognition issues
    if (behavior.repeatedMistakes >= 2) {
      tags.push('pattern-blindness');
    }

    // Edge case handling
    if (behavior.edgeCaseFailures >= 2) {
      tags.push('edge-case-weak');
    }

    // Trial and error dependency
    if (behavior.incorrectAttempts >= 3) {
      tags.push('trial-error-dependent');
    }

    // Hint dependency
    if (behavior.hintUsage >= 2) {
      tags.push('hint-dependent');
    }

    // Slow problem solving
    if (behavior.timeTaken > 600) { // 10 minutes
      tags.push('slow-solver');
    }

    // Fast but inaccurate
    if (behavior.timeTaken < 120 && behavior.incorrectAttempts >= 2) {
      tags.push('hasty-solver');
    }

    // Complexity struggle
    if (behavior.incorrectAttempts >= 2 && behavior.edgeCaseFailures >= 1) {
      tags.push('complexity-struggle');
    }

    return tags.length > 0 ? tags : ['stable'];
  }

  _calculateStabilityScore(behavior) {
    // Lower score = less stable = more exploitable
    let score = 100;

    // Deduct points for various weaknesses
    score -= behavior.incorrectAttempts * 8;
    score -= behavior.hintUsage * 10;
    score -= behavior.edgeCaseFailures * 12;
    score -= behavior.repeatedMistakes * 15;
    score -= behavior.panicUnderTimer ? 20 : 0;

    // Time factor (normalized to 10 minutes)
    const timeScore = Math.min(behavior.timeTaken / 600, 1) * 10;
    score -= timeScore;

    return Math.max(0, Math.min(100, score));
  }

  _determineSeverityLevel(stabilityScore, weaknessTags) {
    const tagCount = weaknessTags.filter(tag => tag !== 'stable').length;

    if (stabilityScore >= 70 && tagCount <= 1) {
      return 'low';
    } else if (stabilityScore >= 40 && tagCount <= 3) {
      return 'medium';
    } else {
      return 'high';
    }
  }
}

module.exports = new CognitiveProfiler();
