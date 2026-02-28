/**
 * Hunter Escalation Model
 * Defines escalation stages based on exploitability and predictability
 * Stages: OBSERVE → PRESSURE → DOMINATE → CLINICAL
 */
class HunterEscalation {
  constructor() {
    this.userEscalationState = new Map();
    
    this.stages = {
      OBSERVE: {
        level: 1,
        description: 'Gathering data, minimal intervention',
        pressureMultiplier: 0.5,
        trapIntensityBase: 'subtle'
      },
      PRESSURE: {
        level: 2,
        description: 'Applying targeted pressure on weaknesses',
        pressureMultiplier: 1.0,
        trapIntensityBase: 'moderate'
      },
      DOMINATE: {
        level: 3,
        description: 'Exploiting vulnerabilities aggressively',
        pressureMultiplier: 1.5,
        trapIntensityBase: 'aggressive'
      },
      CLINICAL: {
        level: 4,
        description: 'Maximum exploitation, surgical precision',
        pressureMultiplier: 2.0,
        trapIntensityBase: 'aggressive'
      }
    };
  }

  /**
   * Determine escalation stage
   */
  determineEscalation(userId, exploitabilityData, predictabilityData, longTermProfile) {
    const currentState = this.userEscalationState.get(userId) || {
      stage: 'OBSERVE',
      stageHistory: [],
      sessionsSinceChange: 0
    };

    const { score: exploitabilityScore, trend } = exploitabilityData;
    const { predictabilityLevel } = predictabilityData;
    const improvementRate = longTermProfile?.improvementRate?.rate || 0;

    // Calculate escalation score
    const escalationScore = this._calculateEscalationScore(
      exploitabilityScore,
      trend,
      predictabilityLevel,
      improvementRate,
      currentState
    );

    // Determine new stage
    const newStage = this._mapScoreToStage(escalationScore);

    // Check for downgrade conditions
    const shouldDowngrade = this._checkDowngradeConditions(
      improvementRate,
      exploitabilityScore,
      trend,
      currentState
    );

    let finalStage = newStage;
    if (shouldDowngrade) {
      finalStage = this._downgradeStage(currentState.stage);
    }

    // Update state
    if (finalStage !== currentState.stage) {
      currentState.stageHistory.push({
        stage: currentState.stage,
        timestamp: new Date().toISOString(),
        sessionCount: currentState.sessionsSinceChange
      });
      currentState.sessionsSinceChange = 0;
    } else {
      currentState.sessionsSinceChange++;
    }

    currentState.stage = finalStage;
    this.userEscalationState.set(userId, currentState);

    return {
      stage: finalStage,
      stageLevel: this.stages[finalStage].level,
      description: this.stages[finalStage].description,
      pressureMultiplier: this.stages[finalStage].pressureMultiplier,
      trapIntensityBase: this.stages[finalStage].trapIntensityBase,
      escalationScore,
      canEscalate: this._canEscalate(finalStage),
      canDowngrade: this._canDowngrade(finalStage),
      sessionsSinceChange: currentState.sessionsSinceChange,
      stageHistory: currentState.stageHistory.slice(-5)
    };
  }

  /**
   * Calculate escalation score (0-100)
   */
  _calculateEscalationScore(exploitabilityScore, trend, predictabilityLevel, improvementRate, currentState) {
    let score = 0;

    // Base score from exploitability
    score += exploitabilityScore * 0.5;

    // Trend bonus/penalty
    if (trend === 'increasing') score += 15;
    else if (trend === 'decreasing') score -= 15;

    // Predictability bonus
    const predictabilityBonus = {
      high: 20,
      medium: 10,
      low: 0
    };
    score += predictabilityBonus[predictabilityLevel] || 0;

    // Improvement rate penalty
    if (improvementRate > 20) score -= 20;
    else if (improvementRate > 10) score -= 10;
    else if (improvementRate < -10) score += 10;

    // Stage momentum (prevent rapid oscillation)
    const currentLevel = this.stages[currentState.stage].level;
    if (currentState.sessionsSinceChange < 3) {
      // Bias towards current stage if recently changed
      score += (currentLevel - 2) * 5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Map escalation score to stage
   */
  _mapScoreToStage(score) {
    if (score >= 75) return 'CLINICAL';
    if (score >= 55) return 'DOMINATE';
    if (score >= 35) return 'PRESSURE';
    return 'OBSERVE';
  }

  /**
   * Check if should downgrade
   */
  _checkDowngradeConditions(improvementRate, exploitabilityScore, trend, currentState) {
    // Strong improvement
    if (improvementRate > 25) return true;

    // Low exploitability with improving trend
    if (exploitabilityScore < 30 && trend === 'decreasing') return true;

    // Stabilization after long period
    if (currentState.sessionsSinceChange > 10 && trend === 'stable') {
      return exploitabilityScore < 50;
    }

    return false;
  }

  /**
   * Downgrade stage by one level
   */
  _downgradeStage(currentStage) {
    const stageOrder = ['OBSERVE', 'PRESSURE', 'DOMINATE', 'CLINICAL'];
    const currentIndex = stageOrder.indexOf(currentStage);
    
    if (currentIndex > 0) {
      return stageOrder[currentIndex - 1];
    }
    
    return currentStage;
  }

  _canEscalate(stage) {
    return stage !== 'CLINICAL';
  }

  _canDowngrade(stage) {
    return stage !== 'OBSERVE';
  }

  /**
   * Get user escalation state
   */
  getUserState(userId) {
    return this.userEscalationState.get(userId) || null;
  }

  /**
   * Reset user escalation
   */
  resetUser(userId) {
    this.userEscalationState.delete(userId);
  }
}

module.exports = new HunterEscalation();
