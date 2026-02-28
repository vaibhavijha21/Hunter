/**
 * Meta-Cognitive Feedback Engine
 * Detects adaptation, recovery, and stabilization patterns
 */
class MetaCognitiveFeedback {
  /**
   * Analyze meta-cognitive patterns
   */
  analyze(longTermProfile, exploitabilityData, escalationData) {
    if (!longTermProfile || longTermProfile.totalSessions < 3) {
      return {
        adaptationScore: 0,
        recoveryDetected: false,
        stabilizationDetected: false,
        adaptationStatus: 'insufficient-data',
        feedback: 'Gathering baseline data'
      };
    }

    const adaptationScore = this._calculateAdaptationScore(longTermProfile, exploitabilityData);
    const recoveryDetected = this._detectRecovery(longTermProfile, exploitabilityData);
    const stabilizationDetected = this._detectStabilization(longTermProfile, escalationData);

    return {
      adaptationScore,
      recoveryDetected,
      stabilizationDetected,
      adaptationStatus: this._determineAdaptationStatus(adaptationScore),
      feedback: this._generateFeedback(adaptationScore, recoveryDetected, stabilizationDetected),
      adaptationBreakdown: this._getAdaptationBreakdown(longTermProfile, exploitabilityData)
    };
  }

  /**
   * Calculate adaptation score (0-100)
   * Higher score = better adaptation to pressure
   */
  _calculateAdaptationScore(longTermProfile, exploitabilityData) {
    let score = 0;

    // Improvement rate component (40%)
    const improvementRate = longTermProfile.improvementRate?.rate || 0;
    if (improvementRate > 20) score += 40;
    else if (improvementRate > 10) score += 30;
    else if (improvementRate > 0) score += 20;
    else if (improvementRate > -10) score += 10;

    // Concept persistence component (30%)
    const conceptPersistence = longTermProfile.conceptPersistence?.score || 0;
    score += (conceptPersistence / 100) * 30;

    // Exploitability trend component (20%)
    const trend = exploitabilityData.trend;
    if (trend === 'decreasing') score += 20;
    else if (trend === 'stable') score += 10;

    // Volatility component (10%) - lower volatility = better adaptation
    const volatility = exploitabilityData.volatility || 0;
    if (volatility < 10) score += 10;
    else if (volatility < 20) score += 5;

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Detect recovery from vulnerable state
   */
  _detectRecovery(longTermProfile, exploitabilityData) {
    const { vulnerabilityBaseline } = longTermProfile;
    const currentExploitability = exploitabilityData.score;
    const trend = exploitabilityData.trend;
    const improvementRate = longTermProfile.improvementRate?.rate || 0;

    // Recovery conditions:
    // 1. Current exploitability significantly below baseline
    // 2. Positive improvement trend
    // 3. Decreasing exploitability trend

    const isSignificantlyBetter = currentExploitability < (vulnerabilityBaseline - 15);
    const isImproving = improvementRate > 10;
    const isTrendingDown = trend === 'decreasing';

    return isSignificantlyBetter && (isImproving || isTrendingDown);
  }

  /**
   * Detect stabilization (consistent performance)
   */
  _detectStabilization(longTermProfile, escalationData) {
    const { improvementRate, recentPerformance } = longTermProfile;
    const { sessionsSinceChange } = escalationData;

    // Stabilization conditions:
    // 1. Improvement rate near zero (stable)
    // 2. Same escalation stage for multiple sessions
    // 3. Low volatility in recent performance

    const isStableImprovement = Math.abs(improvementRate?.rate || 0) < 10;
    const isStableEscalation = sessionsSinceChange >= 5;
    const hasConsistentPerformance = recentPerformance?.avgIncorrectAttempts < 2;

    return isStableImprovement && isStableEscalation && hasConsistentPerformance;
  }

  /**
   * Determine adaptation status
   */
  _determineAdaptationStatus(adaptationScore) {
    if (adaptationScore >= 75) return 'highly-adaptive';
    if (adaptationScore >= 50) return 'adaptive';
    if (adaptationScore >= 25) return 'struggling';
    return 'non-adaptive';
  }

  /**
   * Generate adaptive feedback message
   */
  _generateFeedback(adaptationScore, recoveryDetected, stabilizationDetected) {
    if (recoveryDetected) {
      return 'User showing strong recovery from initial vulnerabilities. Adaptation mechanisms active.';
    }

    if (stabilizationDetected) {
      return 'User has stabilized performance. Consistent patterns detected.';
    }

    if (adaptationScore >= 75) {
      return 'User demonstrates high adaptability. Pressure strategies may need escalation.';
    }

    if (adaptationScore >= 50) {
      return 'User is adapting to pressure. Moderate resistance detected.';
    }

    if (adaptationScore >= 25) {
      return 'User struggling to adapt. Vulnerabilities remain exploitable.';
    }

    return 'User showing minimal adaptation. High vulnerability maintained.';
  }

  /**
   * Get detailed adaptation breakdown
   */
  _getAdaptationBreakdown(longTermProfile, exploitabilityData) {
    return {
      improvementComponent: this._scoreComponent(longTermProfile.improvementRate?.rate || 0, 'improvement'),
      persistenceComponent: this._scoreComponent(longTermProfile.conceptPersistence?.score || 0, 'persistence'),
      trendComponent: this._scoreComponent(exploitabilityData.trend, 'trend'),
      volatilityComponent: this._scoreComponent(exploitabilityData.volatility || 0, 'volatility')
    };
  }

  _scoreComponent(value, type) {
    switch (type) {
      case 'improvement':
        if (value > 20) return { score: 40, status: 'excellent' };
        if (value > 10) return { score: 30, status: 'good' };
        if (value > 0) return { score: 20, status: 'moderate' };
        return { score: 10, status: 'poor' };

      case 'persistence':
        if (value >= 70) return { score: 30, status: 'high' };
        if (value >= 50) return { score: 20, status: 'moderate' };
        return { score: 10, status: 'low' };

      case 'trend':
        if (value === 'decreasing') return { score: 20, status: 'improving' };
        if (value === 'stable') return { score: 10, status: 'stable' };
        return { score: 0, status: 'worsening' };

      case 'volatility':
        if (value < 10) return { score: 10, status: 'low' };
        if (value < 20) return { score: 5, status: 'moderate' };
        return { score: 0, status: 'high' };

      default:
        return { score: 0, status: 'unknown' };
    }
  }
}

module.exports = new MetaCognitiveFeedback();
