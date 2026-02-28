/**
 * Hunter Stability Guard
 * Prevents over-aggressive trap escalation and deterministic loops
 */
class HunterStabilityGuard {
  constructor() {
    this.userGuardState = new Map();
    
    this.limits = {
      maxExploitabilitySpike: 30,
      maxConsecutiveAggressiveTraps: 3,
      minSessionsBetweenEscalation: 2,
      maxPressureLevel: 95
    };
  }

  /**
   * Apply stability guards to system outputs
   */
  applyGuards(userId, proposedOutputs, sessionHistory) {
    const guardState = this._getOrCreateGuardState(userId);
    const guards = {
      exploitabilityCapped: false,
      trapIntensityReduced: false,
      pressureCapped: false,
      escalationBlocked: false
    };

    let { exploitabilityScore, trapIntensity, psychologicalPressure, escalationStage } = proposedOutputs;

    // Guard 1: Cap exploitability spikes
    const spikeGuard = this._guardExploitabilitySpike(
      exploitabilityScore,
      guardState.lastExploitability
    );
    if (spikeGuard.capped) {
      exploitabilityScore = spikeGuard.cappedValue;
      guards.exploitabilityCapped = true;
    }

    // Guard 2: Prevent excessive aggressive traps
    const trapGuard = this._guardTrapIntensity(trapIntensity, guardState);
    if (trapGuard.reduced) {
      trapIntensity = trapGuard.reducedIntensity;
      guards.trapIntensityReduced = true;
    }

    // Guard 3: Cap psychological pressure
    if (psychologicalPressure > this.limits.maxPressureLevel) {
      psychologicalPressure = this.limits.maxPressureLevel;
      guards.pressureCapped = true;
    }

    // Guard 4: Block rapid escalation
    const escalationGuard = this._guardEscalation(escalationStage, guardState);
    if (escalationGuard.blocked) {
      escalationStage = escalationGuard.allowedStage;
      guards.escalationBlocked = true;
    }

    // Guard 5: Detect deterministic loops
    const loopDetected = this._detectDeterministicLoop(sessionHistory);
    if (loopDetected) {
      trapIntensity = this._breakLoop(trapIntensity);
      guards.loopBroken = true;
    }

    // Update guard state
    guardState.lastExploitability = exploitabilityScore;
    guardState.lastTrapIntensity = trapIntensity;
    guardState.lastEscalationStage = escalationStage;
    guardState.sessionCount++;

    if (trapIntensity === 'aggressive') {
      guardState.consecutiveAggressiveTraps++;
    } else {
      guardState.consecutiveAggressiveTraps = 0;
    }

    this.userGuardState.set(userId, guardState);

    return {
      guardedOutputs: {
        exploitabilityScore,
        trapIntensity,
        psychologicalPressure,
        escalationStage
      },
      guardsApplied: guards,
      guardState: {
        consecutiveAggressiveTraps: guardState.consecutiveAggressiveTraps,
        sessionsSinceEscalation: guardState.sessionsSinceLastEscalation
      }
    };
  }

  _getOrCreateGuardState(userId) {
    if (!this.userGuardState.has(userId)) {
      this.userGuardState.set(userId, {
        lastExploitability: 0,
        lastTrapIntensity: 'subtle',
        lastEscalationStage: 'OBSERVE',
        consecutiveAggressiveTraps: 0,
        sessionsSinceLastEscalation: 0,
        sessionCount: 0
      });
    }
    return this.userGuardState.get(userId);
  }

  _guardExploitabilitySpike(currentScore, lastScore) {
    const spike = currentScore - lastScore;
    
    if (spike > this.limits.maxExploitabilitySpike) {
      return {
        capped: true,
        cappedValue: lastScore + this.limits.maxExploitabilitySpike,
        originalSpike: spike
      };
    }

    return { capped: false };
  }

  _guardTrapIntensity(intensity, guardState) {
    if (intensity === 'aggressive' && 
        guardState.consecutiveAggressiveTraps >= this.limits.maxConsecutiveAggressiveTraps) {
      return {
        reduced: true,
        reducedIntensity: 'moderate',
        reason: 'max-consecutive-aggressive-reached'
      };
    }

    return { reduced: false };
  }

  _guardEscalation(proposedStage, guardState) {
    const stageOrder = ['OBSERVE', 'PRESSURE', 'DOMINATE', 'CLINICAL'];
    const currentIndex = stageOrder.indexOf(guardState.lastEscalationStage);
    const proposedIndex = stageOrder.indexOf(proposedStage);

    // Block if trying to escalate too quickly
    if (proposedIndex > currentIndex && 
        guardState.sessionsSinceLastEscalation < this.limits.minSessionsBetweenEscalation) {
      return {
        blocked: true,
        allowedStage: guardState.lastEscalationStage,
        reason: 'escalation-too-rapid'
      };
    }

    if (proposedIndex > currentIndex) {
      guardState.sessionsSinceLastEscalation = 0;
    } else {
      guardState.sessionsSinceLastEscalation++;
    }

    return { blocked: false };
  }

  _detectDeterministicLoop(sessionHistory) {
    if (!sessionHistory || sessionHistory.length < 6) return false;

    const recent = sessionHistory.slice(-6);
    
    // Check for repeating patterns in question selection
    const questionIds = recent.map(s => s.questionId);
    const uniqueQuestions = new Set(questionIds);

    // Loop detected if same 2-3 questions repeating
    if (uniqueQuestions.size <= 2) return true;

    return false;
  }

  _breakLoop(currentIntensity) {
    // Reduce intensity to break loop
    const intensityMap = {
      'aggressive': 'moderate',
      'moderate': 'subtle',
      'subtle': 'subtle'
    };

    return intensityMap[currentIntensity] || 'subtle';
  }

  resetUser(userId) {
    this.userGuardState.delete(userId);
  }
}

module.exports = new HunterStabilityGuard();
