/**
 * Decision Trace Logger
 * Logs structured reasoning from each engine for transparency and debugging
 */

class DecisionTraceLogger {
  constructor() {
    this.traces = new Map(); // userId -> traces
  }

  /**
   * Initialize trace for a session
   */
  initializeTrace(userId, sessionId) {
    const traceId = `${userId}_${sessionId}_${Date.now()}`;
    
    return {
      traceId,
      userId,
      sessionId,
      timestamp: new Date().toISOString(),
      entries: [],
      summary: null
    };
  }

  /**
   * Log decision from an engine
   */
  logDecision(trace, engineName, decision) {
    const entry = {
      engine: engineName,
      timestamp: Date.now(),
      decision: decision.decision || decision.result || 'no_decision',
      reasoning: decision.reasoning || decision.explanation || 'no_reasoning_provided',
      confidence: decision.confidence || null,
      inputs: decision.inputs || {},
      outputs: decision.outputs || {},
      metadata: decision.metadata || {}
    };
    
    trace.entries.push(entry);
    return trace;
  }

  /**
   * Log behavior analysis
   */
  logBehaviorAnalysis(trace, behavior, profile) {
    return this.logDecision(trace, 'BehaviorTracker', {
      decision: 'behavior_analyzed',
      reasoning: `Tracked ${Object.keys(behavior).length} behavioral metrics`,
      inputs: { questionId: behavior.questionId, userId: behavior.userId },
      outputs: { 
        timeTaken: behavior.timeTaken,
        incorrectAttempts: behavior.incorrectAttempts,
        panicDetected: behavior.panicUnderTimer
      },
      metadata: { timestamp: behavior.timestamp }
    });
  }

  /**
   * Log cognitive profiling
   */
  logCognitiveProfile(trace, profile) {
    return this.logDecision(trace, 'CognitiveProfiler', {
      decision: 'profile_generated',
      reasoning: `Identified ${profile.weaknessTags.length} weaknesses with ${profile.severityLevel} severity`,
      outputs: {
        weaknessTags: profile.weaknessTags,
        stabilityScore: profile.stabilityScore,
        severityLevel: profile.severityLevel
      },
      confidence: profile.stabilityScore
    });
  }

  /**
   * Log strategic intent
   */
  logStrategicIntent(trace, strategy) {
    return this.logDecision(trace, 'StrategicIntent', {
      decision: strategy.strategyType,
      reasoning: strategy.reasoning || `Selected ${strategy.strategyType} strategy based on current state`,
      outputs: {
        strategyType: strategy.strategyType,
        objective: strategy.objective,
        confidence: strategy.confidence
      },
      confidence: strategy.confidence
    });
  }

  /**
   * Log escalation decision
   */
  logEscalation(trace, escalation) {
    return this.logDecision(trace, 'HunterEscalation', {
      decision: escalation.stage,
      reasoning: `Escalated to ${escalation.stage} (level ${escalation.stageLevel}) - ${escalation.description}`,
      outputs: {
        stage: escalation.stage,
        stageLevel: escalation.stageLevel,
        canEscalate: escalation.canEscalate
      },
      metadata: {
        sessionsSinceChange: escalation.sessionsSinceChange
      }
    });
  }

  /**
   * Log adaptive trap selection
   */
  logTrapSelection(trace, question, trapMetadata) {
    return this.logDecision(trace, 'AdaptiveTrap', {
      decision: 'question_selected',
      reasoning: `Selected ${question.id} with ${trapMetadata.intensity} intensity (match: ${trapMetadata.matchScore})`,
      outputs: {
        questionId: question.id,
        difficulty: question.difficulty,
        intensity: trapMetadata.intensity,
        matchScore: trapMetadata.matchScore,
        strategyType: trapMetadata.strategyType
      },
      confidence: trapMetadata.matchScore
    });
  }

  /**
   * Log fairness governor intervention
   */
  logFairnessIntervention(trace, fairness) {
    if (fairness.recoveryWindowRecommended) {
      return this.logDecision(trace, 'FairnessGovernor', {
        decision: 'recovery_window_recommended',
        reasoning: `Fatigue: ${fairness.pressureFatigueIndex}, Overload: ${fairness.cognitiveOverloadRisk}`,
        outputs: {
          status: fairness.status,
          fatigueIndex: fairness.pressureFatigueIndex,
          overloadRisk: fairness.cognitiveOverloadRisk
        },
        metadata: { intervention: true }
      });
    }
    return trace;
  }

  /**
   * Log counter-adaptation detection
   */
  logCounterAdaptation(trace, counterAdaptation) {
    if (counterAdaptation.pivotRecommended) {
      return this.logDecision(trace, 'CounterAdaptation', {
        decision: 'pivot_recommended',
        reasoning: `Resistance: ${counterAdaptation.resistanceLevel}, Trap immunity detected`,
        outputs: {
          resistanceLevel: counterAdaptation.resistanceLevel,
          trapImmunity: counterAdaptation.trapImmunity,
          manipulationSensitivity: counterAdaptation.manipulationSensitivity
        },
        metadata: { pivotRecommended: true }
      });
    }
    return trace;
  }

  /**
   * Log timeline phase transition
   */
  logPhaseTransition(trace, timeline) {
    if (timeline.phaseTransitions && timeline.phaseTransitions.length > 0) {
      const lastTransition = timeline.phaseTransitions[timeline.phaseTransitions.length - 1];
      return this.logDecision(trace, 'SimulationTimeline', {
        decision: 'phase_transition',
        reasoning: `Transitioned from ${lastTransition.from} to ${lastTransition.to}: ${lastTransition.reason}`,
        outputs: {
          currentPhase: timeline.currentPhase,
          tick: timeline.currentTick,
          ticksInPhase: timeline.ticksInCurrentPhase
        },
        metadata: lastTransition
      });
    }
    return trace;
  }

  /**
   * Log momentum calculation
   */
  logMomentum(trace, momentum) {
    return this.logDecision(trace, 'PsychologicalMomentum', {
      decision: momentum.direction,
      reasoning: `Momentum: ${momentum.momentumIndex} (${momentum.trend})`,
      outputs: {
        momentumIndex: momentum.momentumIndex,
        pressureMomentum: momentum.pressureMomentum,
        adaptationMomentum: momentum.adaptationMomentum,
        direction: momentum.direction
      },
      confidence: momentum.confidence
    });
  }

  /**
   * Generate trace summary
   */
  generateSummary(trace) {
    const engineCounts = {};
    let totalConfidence = 0;
    let confidenceCount = 0;
    
    trace.entries.forEach(entry => {
      engineCounts[entry.engine] = (engineCounts[entry.engine] || 0) + 1;
      if (entry.confidence !== null) {
        totalConfidence += entry.confidence;
        confidenceCount++;
      }
    });
    
    trace.summary = {
      totalDecisions: trace.entries.length,
      enginesInvolved: Object.keys(engineCounts).length,
      engineBreakdown: engineCounts,
      averageConfidence: confidenceCount > 0 ? Math.round(totalConfidence / confidenceCount) : null,
      duration: Date.now() - new Date(trace.timestamp).getTime()
    };
    
    return trace;
  }

  /**
   * Get formatted trace for API response
   */
  getFormattedTrace(trace) {
    return {
      traceId: trace.traceId,
      timestamp: trace.timestamp,
      summary: trace.summary,
      decisions: trace.entries.map(entry => ({
        engine: entry.engine,
        decision: entry.decision,
        reasoning: entry.reasoning,
        confidence: entry.confidence
      }))
    };
  }

  /**
   * Get detailed trace (for debugging)
   */
  getDetailedTrace(trace) {
    return trace;
  }
}

module.exports = new DecisionTraceLogger();
