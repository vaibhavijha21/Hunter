/**
 * Cognitive Fairness Governor
 * Tracks pressure fatigue and cognitive overload risk
 * Prevents over-escalation and inserts recovery windows
 */
class CognitiveFairnessGovernor {
  constructor() {
    this.userFairnessState = new Map();
    
    this.thresholds = {
      fatigueCritical: 80,
      fatigueHigh: 60,
      overloadCritical: 85,
      overloadHigh: 65,
      recoveryWindowTrigger: 70
    };
  }

  /**
   * Assess cognitive fairness and user wellbeing
   */
  assess(userId, systemState, longTermProfile) {
    const fairnessState = this._getOrCreateState(userId);

    const pressureFatigueIndex = this._calculatePressureFatigue(
      systemState,
      longTermProfile,
      fairnessState
    );

    const cognitiveOverloadRisk = this._calculateOverloadRisk(
      systemState,
      longTermProfile,
      fairnessState
    );

    const recoveryWindowNeeded = this._checkRecoveryWindowNeed(
      pressureFatigueIndex,
      cognitiveOverloadRisk,
      fairnessState
    );

    const escalationBlock = this._shouldBlockEscalation(
      pressureFatigueIndex,
      cognitiveOverloadRisk
    );

    // Update state
    fairnessState.fatigueHistory.push(pressureFatigueIndex);
    fairnessState.overloadHistory.push(cognitiveOverloadRisk);

    // Keep last 20 entries
    if (fairnessState.fatigueHistory.length > 20) {
      fairnessState.fatigueHistory.shift();
    }
    if (fairnessState.overloadHistory.length > 20) {
      fairnessState.overloadHistory.shift();
    }

    if (recoveryWindowNeeded && !fairnessState.inRecoveryWindow) {
      fairnessState.inRecoveryWindow = true;
      fairnessState.recoveryWindowStart = new Date().toISOString();
      fairnessState.recoveryWindowCount++;
    }

    this.userFairnessState.set(userId, fairnessState);

    return {
      pressureFatigueIndex,
      cognitiveOverloadRisk,
      recoveryWindowNeeded,
      escalationBlock,
      inRecoveryWindow: fairnessState.inRecoveryWindow,
      recoveryWindowCount: fairnessState.recoveryWindowCount,
      fairnessStatus: this._determineFairnessStatus(pressureFatigueIndex, cognitiveOverloadRisk),
      recommendations: this._generateRecommendations(
        pressureFatigueIndex,
        cognitiveOverloadRisk,
        recoveryWindowNeeded
      )
    };
  }

  /**
   * Calculate pressure fatigue index (0-100)
   * Higher = more fatigued from sustained pressure
   */
  _calculatePressureFatigue(systemState, longTermProfile, fairnessState) {
    let fatigueIndex = 0;

    // Sustained high pressure increases fatigue
    const { escalation, exploitability } = systemState;

    // Stage-based fatigue
    const stageFatigue = {
      OBSERVE: 0,
      PRESSURE: 15,
      DOMINATE: 30,
      CLINICAL: 45
    };
    fatigueIndex += stageFatigue[escalation.stage] || 0;

    // Sessions at high stages increase fatigue
    if (escalation.sessionsSinceChange > 5 && escalation.stage !== 'OBSERVE') {
      fatigueIndex += escalation.sessionsSinceChange * 3;
    }

    // High exploitability sustained
    if (exploitability.score > 70 && exploitability.trend !== 'decreasing') {
      fatigueIndex += 20;
    }

    // Long-term session count
    if (longTermProfile && longTermProfile.totalSessions > 15) {
      fatigueIndex += 10;
    }

    // Historical fatigue accumulation
    if (fairnessState.fatigueHistory.length > 0) {
      const avgHistoricalFatigue = fairnessState.fatigueHistory.reduce((a, b) => a + b, 0) / 
                                    fairnessState.fatigueHistory.length;
      fatigueIndex += avgHistoricalFatigue * 0.2; // 20% carry-over
    }

    return Math.round(Math.max(0, Math.min(100, fatigueIndex)));
  }

  /**
   * Calculate cognitive overload risk (0-100)
   * Higher = higher risk of cognitive breakdown
   */
  _calculateOverloadRisk(systemState, longTermProfile, fairnessState) {
    let overloadRisk = 0;

    const { vulnerability, dialogue, patternMemory } = systemState;

    // High vulnerability increases overload risk
    if (vulnerability.tier === 'critical') overloadRisk += 35;
    else if (vulnerability.tier === 'high') overloadRisk += 25;
    else if (vulnerability.tier === 'moderate') overloadRisk += 15;

    // High psychological pressure
    if (dialogue.psychologicalPressure > 80) overloadRisk += 25;
    else if (dialogue.psychologicalPressure > 60) overloadRisk += 15;

    // Multiple active weaknesses
    const weaknessCount = systemState.profile.weaknessTags.filter(t => t !== 'stable').length;
    overloadRisk += weaknessCount * 5;

    // Pattern memory showing high mistake rate
    if (patternMemory && patternMemory.mistakePatternScore > 60) {
      overloadRisk += 20;
    }

    // Recent performance degradation
    if (longTermProfile && longTermProfile.recentPerformance) {
      const { avgIncorrectAttempts, panicRate } = longTermProfile.recentPerformance;
      if (avgIncorrectAttempts > 3) overloadRisk += 15;
      if (panicRate > 60) overloadRisk += 20;
    }

    return Math.round(Math.max(0, Math.min(100, overloadRisk)));
  }

  /**
   * Check if recovery window is needed
   */
  _checkRecoveryWindowNeed(fatigueIndex, overloadRisk, fairnessState) {
    // Critical levels - immediate recovery needed
    if (fatigueIndex >= this.thresholds.fatigueCritical || 
        overloadRisk >= this.thresholds.overloadCritical) {
      return true;
    }

    // High levels - recovery needed
    if (fatigueIndex >= this.thresholds.fatigueHigh && 
        overloadRisk >= this.thresholds.overloadHigh) {
      return true;
    }

    // Combined threshold
    const combinedScore = (fatigueIndex + overloadRisk) / 2;
    if (combinedScore >= this.thresholds.recoveryWindowTrigger) {
      return true;
    }

    // Already in recovery window - check if should continue
    if (fairnessState.inRecoveryWindow) {
      // Continue recovery if still above moderate levels
      return fatigueIndex > 40 || overloadRisk > 40;
    }

    return false;
  }

  /**
   * Should block escalation
   */
  _shouldBlockEscalation(fatigueIndex, overloadRisk) {
    return fatigueIndex >= this.thresholds.fatigueCritical || 
           overloadRisk >= this.thresholds.overloadCritical;
  }

  /**
   * Determine fairness status
   */
  _determineFairnessStatus(fatigueIndex, overloadRisk) {
    const combinedScore = (fatigueIndex + overloadRisk) / 2;

    if (combinedScore >= 80) return 'critical';
    if (combinedScore >= 60) return 'concerning';
    if (combinedScore >= 40) return 'moderate';
    return 'healthy';
  }

  /**
   * Generate recommendations
   */
  _generateRecommendations(fatigueIndex, overloadRisk, recoveryWindowNeeded) {
    const recommendations = [];

    if (recoveryWindowNeeded) {
      recommendations.push('insert-recovery-window');
      recommendations.push('reduce-pressure-by-40-percent');
      recommendations.push('select-easier-questions');
    }

    if (fatigueIndex >= this.thresholds.fatigueCritical) {
      recommendations.push('immediate-pressure-reduction');
      recommendations.push('block-escalation');
      recommendations.push('provide-hints-proactively');
    }

    if (overloadRisk >= this.thresholds.overloadCritical) {
      recommendations.push('simplify-question-complexity');
      recommendations.push('reduce-time-pressure');
      recommendations.push('limit-multi-vector-attacks');
    }

    if (fatigueIndex < 30 && overloadRisk < 30) {
      recommendations.push('safe-to-escalate');
      recommendations.push('maintain-current-pressure');
    }

    return recommendations;
  }

  /**
   * End recovery window
   */
  endRecoveryWindow(userId) {
    const state = this.userFairnessState.get(userId);
    if (state) {
      state.inRecoveryWindow = false;
      state.recoveryWindowStart = null;
    }
  }

  _getOrCreateState(userId) {
    if (!this.userFairnessState.has(userId)) {
      this.userFairnessState.set(userId, {
        fatigueHistory: [],
        overloadHistory: [],
        inRecoveryWindow: false,
        recoveryWindowStart: null,
        recoveryWindowCount: 0
      });
    }
    return this.userFairnessState.get(userId);
  }

  resetUser(userId) {
    this.userFairnessState.delete(userId);
  }
}

module.exports = new CognitiveFairnessGovernor();
