/**
 * Psychological Momentum Model
 * Tracks pressure momentum and adaptation momentum using moving averages
 */

class PsychologicalMomentumEngine {
  constructor() {
    this.windowSize = 5; // Moving average window
  }

  /**
   * Compute momentum index
   */
  computeMomentum(userId, currentExploitability, currentAdaptation, history = []) {
    // Add current state to history
    const updatedHistory = [...history, {
      tick: history.length + 1,
      exploitability: currentExploitability,
      adaptation: currentAdaptation,
      timestamp: Date.now()
    }];
    
    // Keep only recent window
    const recentHistory = updatedHistory.slice(-this.windowSize);
    
    // Compute pressure momentum (exploitability trend)
    const pressureMomentum = this._computePressureMomentum(recentHistory);
    
    // Compute adaptation momentum (user's adaptation trend)
    const adaptationMomentum = this._computeAdaptationMomentum(recentHistory);
    
    // Overall momentum index (weighted combination)
    const momentumIndex = this._computeMomentumIndex(
      pressureMomentum,
      adaptationMomentum,
      currentExploitability
    );
    
    // Momentum direction
    const direction = this._determineMomentumDirection(
      pressureMomentum,
      adaptationMomentum
    );
    
    return {
      momentumIndex,
      pressureMomentum,
      adaptationMomentum,
      direction,
      trend: this._getTrendDescription(momentumIndex, direction),
      history: updatedHistory,
      confidence: this._computeConfidence(recentHistory.length)
    };
  }

  /**
   * Compute pressure momentum (how exploitability is changing)
   */
  _computePressureMomentum(history) {
    if (history.length < 2) return 50; // Neutral
    
    const exploitabilityValues = history.map(h => h.exploitability);
    const movingAvg = this._movingAverage(exploitabilityValues);
    const trend = this._computeTrend(exploitabilityValues);
    
    // Pressure momentum: 0-100
    // High if exploitability is increasing
    let momentum = 50 + (trend * 50);
    
    // Boost if current value is high
    if (exploitabilityValues[exploitabilityValues.length - 1] > 70) {
      momentum += 10;
    }
    
    return Math.max(0, Math.min(100, momentum));
  }

  /**
   * Compute adaptation momentum (how user is adapting)
   */
  _computeAdaptationMomentum(history) {
    if (history.length < 2) return 50; // Neutral
    
    const adaptationValues = history.map(h => h.adaptation);
    const trend = this._computeTrend(adaptationValues);
    
    // Adaptation momentum: 0-100
    // High if user is adapting (improving)
    let momentum = 50 + (trend * 50);
    
    return Math.max(0, Math.min(100, momentum));
  }

  /**
   * Compute overall momentum index
   */
  _computeMomentumIndex(pressureMomentum, adaptationMomentum, currentExploitability) {
    // Weighted combination
    // If pressure is high and adaptation is low → high momentum (hunter advantage)
    // If adaptation is high and pressure is low → low momentum (user recovering)
    
    const pressureWeight = 0.6;
    const adaptationWeight = 0.4;
    
    // Inverse adaptation (low adaptation = high momentum for hunter)
    const inverseAdaptation = 100 - adaptationMomentum;
    
    let momentum = (pressureMomentum * pressureWeight) + (inverseAdaptation * adaptationWeight);
    
    // Boost if exploitability is very high
    if (currentExploitability > 80) {
      momentum = Math.min(100, momentum + 15);
    }
    
    return Math.round(momentum);
  }

  /**
   * Determine momentum direction
   */
  _determineMomentumDirection(pressureMomentum, adaptationMomentum) {
    const netMomentum = pressureMomentum - adaptationMomentum;
    
    if (netMomentum > 20) return 'accelerating'; // Hunter gaining advantage
    if (netMomentum < -20) return 'decelerating'; // User recovering
    return 'stable'; // Balanced
  }

  /**
   * Get trend description
   */
  _getTrendDescription(momentumIndex, direction) {
    if (momentumIndex > 75) {
      return direction === 'accelerating' ? 'explosive_pressure' : 'high_sustained_pressure';
    }
    if (momentumIndex > 50) {
      return direction === 'accelerating' ? 'building_pressure' : 'moderate_pressure';
    }
    if (momentumIndex > 25) {
      return direction === 'decelerating' ? 'pressure_declining' : 'low_pressure';
    }
    return 'minimal_pressure';
  }

  /**
   * Compute moving average
   */
  _movingAverage(values) {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  /**
   * Compute trend (-1 to 1)
   */
  _computeTrend(values) {
    if (values.length < 2) return 0;
    
    // Simple linear regression slope
    const n = values.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Normalize to -1 to 1
    return Math.max(-1, Math.min(1, slope / 20));
  }

  /**
   * Compute confidence based on history length
   */
  _computeConfidence(historyLength) {
    if (historyLength >= this.windowSize) return 100;
    return Math.round((historyLength / this.windowSize) * 100);
  }

  /**
   * Check if momentum should influence escalation
   */
  shouldInfluenceEscalation(momentum) {
    return {
      shouldEscalate: momentum.momentumIndex > 70 && momentum.direction === 'accelerating',
      shouldDeescalate: momentum.momentumIndex < 30 && momentum.direction === 'decelerating',
      recommendation: this._getEscalationRecommendation(momentum)
    };
  }

  /**
   * Get escalation recommendation
   */
  _getEscalationRecommendation(momentum) {
    if (momentum.momentumIndex > 80) return 'aggressive_escalation';
    if (momentum.momentumIndex > 60) return 'moderate_escalation';
    if (momentum.momentumIndex > 40) return 'maintain_pressure';
    if (momentum.momentumIndex > 20) return 'reduce_pressure';
    return 'recovery_window';
  }
}

module.exports = new PsychologicalMomentumEngine();
