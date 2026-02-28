/**
 * Strategic Intent Engine
 * Defines short-term and mid-term objectives for the Hunter
 * Drives trap selection through strategic planning rather than reactive weakness matching
 */
class StrategicIntent {
  constructor() {
    this.userStrategies = new Map();
    
    this.strategyTypes = {
      PROBE: {
        name: 'probe',
        description: 'Gather intelligence on user capabilities',
        duration: 'short-term',
        objectives: ['identify-weaknesses', 'establish-baseline', 'test-boundaries']
      },
      EXPLOIT: {
        name: 'exploit',
        description: 'Target known vulnerabilities systematically',
        duration: 'mid-term',
        objectives: ['maximize-pressure', 'force-mistakes', 'break-confidence']
      },
      OVERWHELM: {
        name: 'overwhelm',
        description: 'Apply multi-vector cognitive pressure',
        duration: 'short-term',
        objectives: ['cognitive-overload', 'induce-panic', 'force-surrender']
      },
      SUSTAIN: {
        name: 'sustain',
        description: 'Maintain pressure without recovery windows',
        duration: 'mid-term',
        objectives: ['prevent-adaptation', 'exhaust-resources', 'maintain-dominance']
      },
      PIVOT: {
        name: 'pivot',
        description: 'Change attack vector due to resistance',
        duration: 'short-term',
        objectives: ['bypass-defenses', 'find-new-weakness', 'surprise-attack']
      },
      RETREAT: {
        name: 'retreat',
        description: 'Reduce pressure to avoid user burnout',
        duration: 'short-term',
        objectives: ['prevent-fatigue', 'maintain-engagement', 'strategic-pause']
      }
    };
  }

  /**
   * Determine strategic intent based on system state
   */
  determineStrategy(userId, systemState) {
    const {
      exploitability,
      vulnerability,
      escalation,
      metaCognitive,
      counterAdaptation,
      fairnessGovernor
    } = systemState;

    const currentStrategy = this.userStrategies.get(userId) || null;

    // Check if strategy pivot is forced
    if (counterAdaptation?.resistanceLevel > 70) {
      return this._createStrategy('PIVOT', systemState, 'high-resistance-detected');
    }

    // Check if retreat is needed (fairness)
    if (fairnessGovernor?.fatigueIndex > 75 || fairnessGovernor?.overloadRisk > 80) {
      return this._createStrategy('RETREAT', systemState, 'cognitive-overload-prevention');
    }

    // Determine strategy based on escalation stage and state
    const strategyType = this._selectStrategyType(
      escalation.stage,
      exploitability.score,
      metaCognitive.adaptationScore,
      vulnerability.tier,
      currentStrategy
    );

    const strategy = this._createStrategy(strategyType, systemState, 'strategic-decision');

    // Store strategy
    this.userStrategies.set(userId, strategy);

    return strategy;
  }

  /**
   * Select strategy type based on system state
   */
  _selectStrategyType(stage, exploitability, adaptationScore, vulnerabilityTier, currentStrategy) {
    // Initial sessions - always probe
    if (!currentStrategy) {
      return 'PROBE';
    }

    // High adaptation - pivot
    if (adaptationScore > 70) {
      return 'PIVOT';
    }

    // Stage-based strategy selection
    switch (stage) {
      case 'OBSERVE':
        return 'PROBE';

      case 'PRESSURE':
        // If vulnerability is high, exploit
        if (vulnerabilityTier === 'high' || vulnerabilityTier === 'critical') {
          return 'EXPLOIT';
        }
        return 'PROBE';

      case 'DOMINATE':
        // If exploitability is very high, overwhelm
        if (exploitability >= 75) {
          return 'OVERWHELM';
        }
        return 'EXPLOIT';

      case 'CLINICAL':
        // Sustain pressure at clinical stage
        return 'SUSTAIN';

      default:
        return 'PROBE';
    }
  }

  /**
   * Create strategy object
   */
  _createStrategy(strategyType, systemState, reason) {
    const strategyDef = this.strategyTypes[strategyType];
    
    const shortTermObjectives = this._defineShortTermObjectives(strategyType, systemState);
    const midTermObjectives = this._defineMidTermObjectives(strategyType, systemState);
    const tacticalApproach = this._defineTacticalApproach(strategyType, systemState);

    return {
      type: strategyDef.name,
      description: strategyDef.description,
      reason,
      objectives: {
        shortTerm: shortTermObjectives,
        midTerm: midTermObjectives,
        primary: strategyDef.objectives
      },
      tacticalApproach,
      confidence: this._calculateStrategyConfidence(strategyType, systemState),
      expectedOutcome: this._predictOutcome(strategyType, systemState),
      fallbackStrategy: this._determineFallback(strategyType),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Define short-term objectives (1-2 sessions)
   */
  _defineShortTermObjectives(strategyType, systemState) {
    const objectives = {
      PROBE: [
        'Identify top 3 cognitive weaknesses',
        'Establish performance baseline',
        'Test time pressure tolerance'
      ],
      EXPLOIT: [
        'Target primary weakness with 2 consecutive questions',
        'Force 3+ incorrect attempts',
        'Induce hint dependency'
      ],
      OVERWHELM: [
        'Apply multi-dimensional pressure',
        'Trigger panic response',
        'Achieve 80+ exploitability score'
      ],
      SUSTAIN: [
        'Maintain current pressure level',
        'Prevent adaptation windows',
        'Block recovery attempts'
      ],
      PIVOT: [
        'Identify alternative attack vector',
        'Bypass current defenses',
        'Re-establish dominance'
      ],
      RETREAT: [
        'Reduce pressure by 30%',
        'Allow partial recovery',
        'Maintain engagement'
      ]
    };

    return objectives[strategyType] || objectives.PROBE;
  }

  /**
   * Define mid-term objectives (3-5 sessions)
   */
  _defineMidTermObjectives(strategyType, systemState) {
    const objectives = {
      PROBE: [
        'Complete vulnerability mapping',
        'Establish predictability patterns',
        'Prepare exploitation strategy'
      ],
      EXPLOIT: [
        'Achieve 70+ exploitability score',
        'Establish pattern of failure',
        'Break user confidence'
      ],
      OVERWHELM: [
        'Force escalation to CLINICAL stage',
        'Achieve critical vulnerability tier',
        'Establish complete dominance'
      ],
      SUSTAIN: [
        'Maintain CLINICAL stage for 5+ sessions',
        'Prevent any recovery',
        'Maximize long-term pressure'
      ],
      PIVOT: [
        'Establish new exploitation pattern',
        'Overcome resistance mechanisms',
        'Return to EXPLOIT strategy'
      ],
      RETREAT: [
        'Prevent user burnout',
        'Maintain system engagement',
        'Prepare for re-escalation'
      ]
    };

    return objectives[strategyType] || objectives.PROBE;
  }

  /**
   * Define tactical approach
   */
  _defineTacticalApproach(strategyType, systemState) {
    const approaches = {
      PROBE: {
        questionSelection: 'diverse-coverage',
        intensityProgression: 'gradual',
        pressureApplication: 'minimal',
        dialogueTone: 'neutral-observant'
      },
      EXPLOIT: {
        questionSelection: 'weakness-focused',
        intensityProgression: 'targeted',
        pressureApplication: 'moderate-high',
        dialogueTone: 'probing-invasive'
      },
      OVERWHELM: {
        questionSelection: 'multi-weakness',
        intensityProgression: 'aggressive',
        pressureApplication: 'maximum',
        dialogueTone: 'aggressive-predatory'
      },
      SUSTAIN: {
        questionSelection: 'sustained-pressure',
        intensityProgression: 'consistent-high',
        pressureApplication: 'high-sustained',
        dialogueTone: 'cold-clinical'
      },
      PIVOT: {
        questionSelection: 'alternative-vector',
        intensityProgression: 'adaptive',
        pressureApplication: 'variable',
        dialogueTone: 'calculated-shifting'
      },
      RETREAT: {
        questionSelection: 'recovery-friendly',
        intensityProgression: 'reduced',
        pressureApplication: 'low',
        dialogueTone: 'neutral-supportive'
      }
    };

    return approaches[strategyType] || approaches.PROBE;
  }

  /**
   * Calculate strategy confidence (0-100)
   */
  _calculateStrategyConfidence(strategyType, systemState) {
    let confidence = 50; // Base confidence

    const { exploitability, vulnerability, metaCognitive } = systemState;

    // High exploitability increases confidence
    if (exploitability.score > 70) confidence += 20;
    else if (exploitability.score > 50) confidence += 10;

    // High vulnerability increases confidence
    if (vulnerability.tier === 'critical') confidence += 20;
    else if (vulnerability.tier === 'high') confidence += 15;
    else if (vulnerability.tier === 'moderate') confidence += 5;

    // Low adaptation increases confidence
    if (metaCognitive.adaptationScore < 30) confidence += 15;
    else if (metaCognitive.adaptationScore > 70) confidence -= 20;

    // Strategy-specific adjustments
    if (strategyType === 'PROBE') confidence += 10; // Always confident in probing
    if (strategyType === 'RETREAT') confidence -= 10; // Less confident in retreat

    return Math.max(0, Math.min(100, confidence));
  }

  /**
   * Predict outcome
   */
  _predictOutcome(strategyType, systemState) {
    const outcomes = {
      PROBE: 'weakness-identification',
      EXPLOIT: 'vulnerability-exploitation',
      OVERWHELM: 'cognitive-breakdown',
      SUSTAIN: 'maintained-dominance',
      PIVOT: 'defense-bypass',
      RETREAT: 'engagement-preservation'
    };

    return outcomes[strategyType] || 'unknown';
  }

  /**
   * Determine fallback strategy
   */
  _determineFallback(strategyType) {
    const fallbacks = {
      PROBE: 'EXPLOIT',
      EXPLOIT: 'PIVOT',
      OVERWHELM: 'SUSTAIN',
      SUSTAIN: 'RETREAT',
      PIVOT: 'PROBE',
      RETREAT: 'PROBE'
    };

    return fallbacks[strategyType] || 'PROBE';
  }

  /**
   * Get user's current strategy
   */
  getUserStrategy(userId) {
    return this.userStrategies.get(userId) || null;
  }

  /**
   * Reset user strategy
   */
  resetUser(userId) {
    this.userStrategies.delete(userId);
  }
}

module.exports = new StrategicIntent();
