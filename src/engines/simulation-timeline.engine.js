/**
 * Simulation Timeline Engine
 * Manages simulation ticks, phase progression, and micro-phase transitions
 */

class SimulationTimelineEngine {
  constructor() {
    this.phases = ['observe', 'probe', 'escalate', 'stabilize'];
    this.phaseThresholds = {
      observe: { minTicks: 1, maxTicks: 3, exploitabilityThreshold: 30 },
      probe: { minTicks: 2, maxTicks: 5, exploitabilityThreshold: 50 },
      escalate: { minTicks: 3, maxTicks: 8, exploitabilityThreshold: 70 },
      stabilize: { minTicks: 2, maxTicks: 4, exploitabilityThreshold: 40 }
    };
  }

  /**
   * Initialize or update timeline state
   */
  updateTimeline(userId, exploitabilityIndex, momentum, existingTimeline = null) {
    const timeline = existingTimeline || this._initializeTimeline(userId);
    
    // Increment tick
    timeline.currentTick++;
    timeline.ticksInCurrentPhase++;
    
    // Check for phase transition
    const transitionResult = this._evaluatePhaseTransition(
      timeline,
      exploitabilityIndex,
      momentum
    );
    
    if (transitionResult.shouldTransition) {
      timeline.previousPhase = timeline.currentPhase;
      timeline.currentPhase = transitionResult.nextPhase;
      timeline.ticksInCurrentPhase = 0;
      timeline.phaseTransitions.push({
        tick: timeline.currentTick,
        from: timeline.previousPhase,
        to: timeline.currentPhase,
        reason: transitionResult.reason
      });
    }
    
    // Update phase metadata
    timeline.phaseMetadata = this._getPhaseMetadata(timeline.currentPhase);
    
    return timeline;
  }

  /**
   * Initialize timeline for new user
   */
  _initializeTimeline(userId) {
    return {
      userId,
      currentTick: 0,
      currentPhase: 'observe',
      previousPhase: null,
      ticksInCurrentPhase: 0,
      phaseTransitions: [],
      phaseMetadata: this._getPhaseMetadata('observe'),
      startedAt: new Date().toISOString()
    };
  }

  /**
   * Evaluate if phase transition should occur
   */
  _evaluatePhaseTransition(timeline, exploitabilityIndex, momentum) {
    const currentPhase = timeline.currentPhase;
    const thresholds = this.phaseThresholds[currentPhase];
    const ticksInPhase = timeline.ticksInCurrentPhase;
    
    // Minimum ticks requirement
    if (ticksInPhase < thresholds.minTicks) {
      return { shouldTransition: false };
    }
    
    // Force transition if max ticks reached
    if (ticksInPhase >= thresholds.maxTicks) {
      return {
        shouldTransition: true,
        nextPhase: this._getNextPhase(currentPhase, exploitabilityIndex, momentum),
        reason: 'max_ticks_reached'
      };
    }
    
    // Exploitability-based transition
    if (currentPhase === 'observe' && exploitabilityIndex >= thresholds.exploitabilityThreshold) {
      return {
        shouldTransition: true,
        nextPhase: 'probe',
        reason: 'exploitability_threshold_met'
      };
    }
    
    if (currentPhase === 'probe' && exploitabilityIndex >= thresholds.exploitabilityThreshold) {
      return {
        shouldTransition: true,
        nextPhase: 'escalate',
        reason: 'high_exploitability_detected'
      };
    }
    
    if (currentPhase === 'escalate' && exploitabilityIndex < 40) {
      return {
        shouldTransition: true,
        nextPhase: 'stabilize',
        reason: 'exploitability_decreased'
      };
    }
    
    // Momentum-based transition
    if (momentum && momentum.momentumIndex > 70 && currentPhase !== 'escalate') {
      return {
        shouldTransition: true,
        nextPhase: 'escalate',
        reason: 'high_momentum_detected'
      };
    }
    
    if (momentum && momentum.momentumIndex < 20 && currentPhase === 'escalate') {
      return {
        shouldTransition: true,
        nextPhase: 'stabilize',
        reason: 'momentum_loss'
      };
    }
    
    return { shouldTransition: false };
  }

  /**
   * Determine next phase based on current state
   */
  _getNextPhase(currentPhase, exploitabilityIndex, momentum) {
    if (exploitabilityIndex >= 70) return 'escalate';
    if (exploitabilityIndex >= 50) return 'probe';
    if (exploitabilityIndex < 30) return 'stabilize';
    
    // Cycle through phases
    const currentIndex = this.phases.indexOf(currentPhase);
    return this.phases[(currentIndex + 1) % this.phases.length];
  }

  /**
   * Get metadata for current phase
   */
  _getPhaseMetadata(phase) {
    const metadata = {
      observe: {
        description: 'Gathering baseline cognitive patterns',
        intensity: 'low',
        primaryGoal: 'data_collection',
        allowedStrategies: ['probe']
      },
      probe: {
        description: 'Testing vulnerability boundaries',
        intensity: 'medium',
        primaryGoal: 'weakness_identification',
        allowedStrategies: ['probe', 'exploit']
      },
      escalate: {
        description: 'Applying maximum cognitive pressure',
        intensity: 'high',
        primaryGoal: 'exploitation',
        allowedStrategies: ['exploit', 'overwhelm']
      },
      stabilize: {
        description: 'Maintaining pressure without overload',
        intensity: 'medium',
        primaryGoal: 'sustained_pressure',
        allowedStrategies: ['sustain', 'pivot']
      }
    };
    
    return metadata[phase] || metadata.observe;
  }

  /**
   * Get current timeline state
   */
  getTimelineState(timeline) {
    return {
      currentTick: timeline.currentTick,
      currentPhase: timeline.currentPhase,
      previousPhase: timeline.previousPhase,
      ticksInCurrentPhase: timeline.ticksInCurrentPhase,
      phaseMetadata: timeline.phaseMetadata,
      totalPhaseTransitions: timeline.phaseTransitions.length,
      lastTransition: timeline.phaseTransitions[timeline.phaseTransitions.length - 1] || null
    };
  }
}

module.exports = new SimulationTimelineEngine();
