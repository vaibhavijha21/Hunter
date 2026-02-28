/**
 * Counter-Adaptation Engine
 * Detects user resistance and trap immunity
 * Forces strategy pivot when resistance exceeds threshold
 */
class CounterAdaptation {
  constructor() {
    this.userResistanceState = new Map();
  }

  /**
   * Analyze user resistance and adaptation
   */
  analyze(userId, systemState, longTermProfile) {
    const resistanceState = this._getOrCreateState(userId);

    const userResistance = this._detectResistance(systemState, longTermProfile, resistanceState);
    const trapImmunity = this._detectTrapImmunity(systemState, longTermProfile, resistanceState);
    const resistanceLevel = this._calculateResistanceLevel(userResistance, trapImmunity);
    const manipulationSensitivity = this._calculateManipulationSensitivity(
      resistanceLevel,
      systemState,
      longTermProfile
    );

    // Update resistance state
    resistanceState.history.push({
      resistanceLevel,
      trapImmunity,
      timestamp: new Date().toISOString()
    });

    // Keep last 20 entries
    if (resistanceState.history.length > 20) {
      resistanceState.history.shift();
    }

    this.userResistanceState.set(userId, resistanceState);

    return {
      userResistance,
      trapImmunity,
      resistanceLevel,
      manipulationSensitivity,
      pivotRequired: resistanceLevel > 70,
      resistanceTrend: this._calculateResistanceTrend(resistanceState.history),
      counterMeasures: this._suggestCounterMeasures(resistanceLevel, trapImmunity)
    };
  }

  /**
   * Detect user resistance patterns
   */
  _detectResistance(systemState, longTermProfile, resistanceState) {
    const resistance = {
      adaptationResistance: false,
      pressureResistance: false,
      patternResistance: false,
      dialogueResistance: false,
      score: 0
    };

    const { metaCognitive, exploitability } = systemState;

    // Adaptation resistance - user is adapting despite pressure
    if (metaCognitive.adaptationScore > 60 && exploitability.score > 50) {
      resistance.adaptationResistance = true;
      resistance.score += 25;
    }

    // Pressure resistance - exploitability decreasing despite escalation
    if (exploitability.trend === 'decreasing' && systemState.escalation.stage !== 'OBSERVE') {
      resistance.pressureResistance = true;
      resistance.score += 30;
    }

    // Pattern resistance - user breaking out of predicted patterns
    if (systemState.predictability.predictabilityLevel === 'low') {
      resistance.patternResistance = true;
      resistance.score += 20;
    }

    // Dialogue resistance - user not affected by psychological pressure
    if (longTermProfile && longTermProfile.totalSessions > 5) {
      const recentPerformance = longTermProfile.recentPerformance;
      if (recentPerformance && recentPerformance.avgIncorrectAttempts < 1.5) {
        resistance.dialogueResistance = true;
        resistance.score += 25;
      }
    }

    return resistance;
  }

  /**
   * Detect trap immunity (user learning to avoid traps)
   */
  _detectTrapImmunity(systemState, longTermProfile, resistanceState) {
    const immunity = {
      weaknessImmunity: [],
      trapTypeImmunity: [],
      immunityScore: 0
    };

    if (!longTermProfile || longTermProfile.totalSessions < 3) {
      return immunity;
    }

    // Check concept mastery - if user mastered previously weak concepts
    const { conceptMastery } = longTermProfile;
    if (conceptMastery) {
      const masteredCount = conceptMastery.mastered.length;
      const strugglingCount = conceptMastery.struggling.length;

      if (masteredCount > strugglingCount) {
        immunity.weaknessImmunity = conceptMastery.mastered.map(c => c.concept);
        immunity.immunityScore += masteredCount * 10;
      }
    }

    // Check if same trap types are becoming less effective
    const { patternMemory } = systemState;
    if (patternMemory && patternMemory.isLearning) {
      immunity.trapTypeImmunity.push('repetitive-patterns');
      immunity.immunityScore += 20;
    }

    // Check improvement rate
    if (longTermProfile.improvementRate.rate > 20) {
      immunity.trapTypeImmunity.push('sustained-pressure');
      immunity.immunityScore += 25;
    }

    immunity.immunityScore = Math.min(100, immunity.immunityScore);

    return immunity;
  }

  /**
   * Calculate overall resistance level (0-100)
   */
  _calculateResistanceLevel(userResistance, trapImmunity) {
    const resistanceScore = userResistance.score;
    const immunityScore = trapImmunity.immunityScore;

    // Weighted combination
    const resistanceLevel = (resistanceScore * 0.6) + (immunityScore * 0.4);

    return Math.round(Math.max(0, Math.min(100, resistanceLevel)));
  }

  /**
   * Calculate manipulation sensitivity (0-100)
   * Lower = less sensitive to manipulation
   */
  _calculateManipulationSensitivity(resistanceLevel, systemState, longTermProfile) {
    let sensitivity = 100 - resistanceLevel; // Base: inverse of resistance

    // Adjust based on adaptation
    const adaptationScore = systemState.metaCognitive.adaptationScore;
    if (adaptationScore > 70) sensitivity -= 20;
    else if (adaptationScore < 30) sensitivity += 10;

    // Adjust based on predictability
    const predictability = systemState.predictability.predictabilityLevel;
    if (predictability === 'high') sensitivity += 15;
    else if (predictability === 'low') sensitivity -= 15;

    // Adjust based on session count
    if (longTermProfile && longTermProfile.totalSessions > 10) {
      sensitivity -= 10; // Experienced users less sensitive
    }

    return Math.round(Math.max(0, Math.min(100, sensitivity)));
  }

  /**
   * Calculate resistance trend
   */
  _calculateResistanceTrend(history) {
    if (history.length < 3) return 'insufficient-data';

    const recent = history.slice(-5);
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));

    const firstAvg = firstHalf.reduce((sum, h) => sum + h.resistanceLevel, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, h) => sum + h.resistanceLevel, 0) / secondHalf.length;

    const diff = secondAvg - firstAvg;

    if (diff > 15) return 'increasing';
    if (diff < -15) return 'decreasing';
    return 'stable';
  }

  /**
   * Suggest counter-measures
   */
  _suggestCounterMeasures(resistanceLevel, trapImmunity) {
    const measures = [];

    if (resistanceLevel > 70) {
      measures.push('immediate-strategy-pivot');
      measures.push('change-attack-vector');
    }

    if (resistanceLevel > 50) {
      measures.push('increase-unpredictability');
      measures.push('vary-trap-types');
    }

    if (trapImmunity.weaknessImmunity.length > 0) {
      measures.push('target-new-weaknesses');
      measures.push('avoid-mastered-concepts');
    }

    if (trapImmunity.trapTypeImmunity.length > 0) {
      measures.push('introduce-novel-patterns');
      measures.push('break-predictable-sequences');
    }

    if (measures.length === 0) {
      measures.push('maintain-current-strategy');
    }

    return measures;
  }

  _getOrCreateState(userId) {
    if (!this.userResistanceState.has(userId)) {
      this.userResistanceState.set(userId, {
        history: [],
        lastPivot: null
      });
    }
    return this.userResistanceState.get(userId);
  }

  resetUser(userId) {
    this.userResistanceState.delete(userId);
  }
}

module.exports = new CounterAdaptation();
