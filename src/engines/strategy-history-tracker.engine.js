/**
 * Strategy History Tracker
 * Logs which strategies worked and adjusts future escalation curves
 */
class StrategyHistoryTracker {
  constructor() {
    this.userStrategyHistory = new Map();
  }

  /**
   * Record strategy execution and outcome
   */
  recordStrategy(userId, strategy, outcome, systemState) {
    if (!this.userStrategyHistory.has(userId)) {
      this.userStrategyHistory.set(userId, {
        strategies: [],
        successRates: new Map(),
        escalationCurve: this._getDefaultEscalationCurve()
      });
    }

    const history = this.userStrategyHistory.get(userId);

    const strategyRecord = {
      type: strategy.type,
      timestamp: new Date().toISOString(),
      outcome: outcome,
      exploitabilityBefore: systemState.exploitabilityBefore || 0,
      exploitabilityAfter: systemState.exploitability.score,
      vulnerabilityTier: systemState.vulnerability.tier,
      success: this._evaluateSuccess(strategy, outcome, systemState)
    };

    history.strategies.push(strategyRecord);

    // Keep last 50 strategies
    if (history.strategies.length > 50) {
      history.strategies.shift();
    }

    // Update success rates
    this._updateSuccessRates(history, strategyRecord);

    // Adjust escalation curve
    this._adjustEscalationCurve(history, strategyRecord);

    this.userStrategyHistory.set(userId, history);

    return this.getAnalysis(userId);
  }

  /**
   * Get strategy analysis
   */
  getAnalysis(userId) {
    const history = this.userStrategyHistory.get(userId);
    if (!history || history.strategies.length === 0) {
      return {
        totalStrategies: 0,
        successRates: {},
        mostEffective: null,
        leastEffective: null,
        escalationCurve: this._getDefaultEscalationCurve(),
        recommendations: ['insufficient-data']
      };
    }

    const successRates = this._calculateSuccessRates(history);
    const mostEffective = this._findMostEffective(successRates);
    const leastEffective = this._findLeastEffective(successRates);
    const recommendations = this._generateRecommendations(history, successRates);

    return {
      totalStrategies: history.strategies.length,
      successRates,
      mostEffective,
      leastEffective,
      escalationCurve: history.escalationCurve,
      recommendations,
      recentPerformance: this._getRecentPerformance(history)
    };
  }

  /**
   * Evaluate if strategy was successful
   */
  _evaluateSuccess(strategy, outcome, systemState) {
    const { exploitabilityBefore = 0, exploitability, profile, counterAdaptation, fairnessGovernor } = systemState;
    const exploitabilityChange = exploitability.score - exploitabilityBefore;

    // Strategy-specific success criteria
    switch (strategy.type) {
      case 'probe':
        // Success if identified weaknesses
        return profile && profile.weaknessTags && profile.weaknessTags.length > 1;

      case 'exploit':
        // Success if exploitability increased
        return exploitabilityChange > 10;

      case 'overwhelm':
        // Success if reached high exploitability
        return exploitability.score > 75;

      case 'sustain':
        // Success if maintained high pressure
        return exploitability.score > 60 && Math.abs(exploitabilityChange) < 15;

      case 'pivot':
        // Success if broke resistance
        return exploitabilityChange > 5 || (counterAdaptation && counterAdaptation.resistanceLevel < 50);

      case 'retreat':
        // Success if reduced fatigue
        return fairnessGovernor && fairnessGovernor.pressureFatigueIndex < 50;

      default:
        return false;
    }
  }

  /**
   * Update success rates
   */
  _updateSuccessRates(history, strategyRecord) {
    const { type, success } = strategyRecord;

    if (!history.successRates.has(type)) {
      history.successRates.set(type, { successes: 0, total: 0 });
    }

    const rates = history.successRates.get(type);
    rates.total++;
    if (success) rates.successes++;
  }

  /**
   * Adjust escalation curve based on strategy outcomes
   */
  _adjustEscalationCurve(history, strategyRecord) {
    const curve = history.escalationCurve;

    // If aggressive strategies failing, slow down escalation
    if (strategyRecord.type === 'overwhelm' && !strategyRecord.success) {
      curve.aggressiveness = Math.max(0.5, curve.aggressiveness - 0.1);
      curve.sessionsBetweenEscalation = Math.min(5, curve.sessionsBetweenEscalation + 1);
    }

    // If probe strategies succeeding, can escalate faster
    if (strategyRecord.type === 'probe' && strategyRecord.success) {
      curve.aggressiveness = Math.min(2.0, curve.aggressiveness + 0.05);
    }

    // If pivot strategies needed frequently, increase adaptability
    if (strategyRecord.type === 'pivot') {
      curve.adaptability = Math.min(1.0, curve.adaptability + 0.1);
    }

    // If retreat strategies needed, reduce aggressiveness
    if (strategyRecord.type === 'retreat') {
      curve.aggressiveness = Math.max(0.5, curve.aggressiveness - 0.15);
      curve.recoveryWindowFrequency = Math.min(0.4, curve.recoveryWindowFrequency + 0.05);
    }
  }

  /**
   * Calculate success rates
   */
  _calculateSuccessRates(history) {
    const rates = {};

    for (const [type, data] of history.successRates.entries()) {
      rates[type] = {
        successRate: data.total > 0 ? Math.round((data.successes / data.total) * 100) : 0,
        successes: data.successes,
        total: data.total
      };
    }

    return rates;
  }

  /**
   * Find most effective strategy
   */
  _findMostEffective(successRates) {
    let maxRate = 0;
    let mostEffective = null;

    for (const [type, data] of Object.entries(successRates)) {
      if (data.total >= 2 && data.successRate > maxRate) {
        maxRate = data.successRate;
        mostEffective = { type, successRate: data.successRate };
      }
    }

    return mostEffective;
  }

  /**
   * Find least effective strategy
   */
  _findLeastEffective(successRates) {
    let minRate = 100;
    let leastEffective = null;

    for (const [type, data] of Object.entries(successRates)) {
      if (data.total >= 2 && data.successRate < minRate) {
        minRate = data.successRate;
        leastEffective = { type, successRate: data.successRate };
      }
    }

    return leastEffective;
  }

  /**
   * Generate recommendations
   */
  _generateRecommendations(history, successRates) {
    const recommendations = [];

    // Recommend most effective strategy
    const mostEffective = this._findMostEffective(successRates);
    if (mostEffective && mostEffective.successRate > 70) {
      recommendations.push(`favor-${mostEffective.type}-strategy`);
    }

    // Warn about least effective
    const leastEffective = this._findLeastEffective(successRates);
    if (leastEffective && leastEffective.successRate < 30) {
      recommendations.push(`avoid-${leastEffective.type}-strategy`);
    }

    // Check escalation curve
    if (history.escalationCurve.aggressiveness < 0.7) {
      recommendations.push('escalation-too-slow');
    } else if (history.escalationCurve.aggressiveness > 1.5) {
      recommendations.push('escalation-too-aggressive');
    }

    return recommendations;
  }

  /**
   * Get recent performance
   */
  _getRecentPerformance(history) {
    const recent = history.strategies.slice(-5);
    if (recent.length === 0) return null;

    const successCount = recent.filter(s => s.success).length;
    const avgExploitabilityChange = recent.reduce((sum, s) => 
      sum + (s.exploitabilityAfter - s.exploitabilityBefore), 0) / recent.length;

    return {
      recentSuccessRate: Math.round((successCount / recent.length) * 100),
      avgExploitabilityChange: Math.round(avgExploitabilityChange),
      trend: avgExploitabilityChange > 5 ? 'improving' : avgExploitabilityChange < -5 ? 'declining' : 'stable'
    };
  }

  /**
   * Get default escalation curve
   */
  _getDefaultEscalationCurve() {
    return {
      aggressiveness: 1.0,
      sessionsBetweenEscalation: 2,
      adaptability: 0.5,
      recoveryWindowFrequency: 0.2
    };
  }

  resetUser(userId) {
    this.userStrategyHistory.delete(userId);
  }
}

module.exports = new StrategyHistoryTracker();
