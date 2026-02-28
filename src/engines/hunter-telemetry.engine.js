/**
 * Hunter Telemetry Engine (Strategic)
 * Generates structured telemetry with strategic metrics
 */
class HunterTelemetry {
  /**
   * Generate comprehensive telemetry with strategic data
   */
  generate(analysisData) {
    const {
      exploitability,
      vulnerability,
      escalation,
      predictability,
      metaCognitive,
      dialogue,
      adaptiveQuestion,
      guardState,
      hunterStrategy,
      counterAdaptation,
      fairnessGovernor,
      strategyHistory,
      // Simulation layer
      phase,
      momentumIndex,
      decisionTrace,
      personaState,
      snapshotId
    } = analysisData;

    const aiMood = this._determineAIMood(
      exploitability.score,
      vulnerability.tier,
      escalation.stage,
      metaCognitive.adaptationScore,
      hunterStrategy
    );

    return {
      exploitabilityIndex: {
        score: exploitability.score,
        interpretation: exploitability.interpretation,
        trend: exploitability.trend,
        volatility: exploitability.volatility,
        evolution: exploitability.evolution
      },
      vulnerabilityTier: {
        tier: vulnerability.tier,
        overallScore: vulnerability.overallScore,
        dimensions: {
          cognitive: vulnerability.dimensions.cognitive.score,
          behavioral: vulnerability.dimensions.behavioral.score,
          pattern: vulnerability.dimensions.pattern.score,
          psychological: vulnerability.dimensions.psychological.score
        },
        criticalWeaknesses: vulnerability.criticalWeaknesses
      },
      escalationStage: {
        stage: escalation.stage,
        level: escalation.stageLevel,
        description: escalation.description,
        canEscalate: escalation.canEscalate,
        canDowngrade: escalation.canDowngrade,
        sessionsSinceChange: escalation.sessionsSinceChange
      },
      predictabilityLevel: {
        level: predictability.predictabilityLevel,
        classifications: predictability.behaviorClassification,
        consistencyScore: predictability.consistencyScore,
        avoidancePatterns: predictability.avoidancePatterns.length
      },
      adaptationScore: {
        score: metaCognitive.adaptationScore,
        status: metaCognitive.adaptationStatus,
        recoveryDetected: metaCognitive.recoveryDetected,
        stabilizationDetected: metaCognitive.stabilizationDetected
      },
      psychologicalPressureLevel: {
        pressure: dialogue.psychologicalPressure,
        tone: dialogue.tone,
        manipulationTactics: dialogue.manipulationTactic,
        targetedDimensions: dialogue.targetedDimensions
      },
      trapIntensity: {
        intensity: adaptiveQuestion?.trapMetadata?.intensity || 'unknown',
        matchScore: adaptiveQuestion?.trapMetadata?.matchScore || 0,
        targetWeaknesses: adaptiveQuestion?.trapMetadata?.targetWeaknesses || [],
        strategyType: adaptiveQuestion?.trapMetadata?.strategyType || null,
        strategicAlignment: adaptiveQuestion?.trapMetadata?.strategicAlignment || 0
      },
      hunterStrategy: hunterStrategy ? {
        type: hunterStrategy.type,
        description: hunterStrategy.description,
        confidence: hunterStrategy.confidence,
        shortTermObjectives: hunterStrategy.objectives.shortTerm,
        midTermObjectives: hunterStrategy.objectives.midTerm,
        tacticalApproach: hunterStrategy.tacticalApproach.questionSelection,
        expectedOutcome: hunterStrategy.expectedOutcome
      } : null,
      resistanceLevel: counterAdaptation ? {
        level: counterAdaptation.resistanceLevel,
        trend: counterAdaptation.resistanceTrend,
        pivotRequired: counterAdaptation.pivotRequired,
        manipulationSensitivity: counterAdaptation.manipulationSensitivity,
        immunityScore: counterAdaptation.trapImmunity.immunityScore
      } : null,
      fatigueIndex: fairnessGovernor ? {
        pressureFatigue: fairnessGovernor.pressureFatigueIndex,
        overloadRisk: fairnessGovernor.cognitiveOverloadRisk,
        recoveryWindowNeeded: fairnessGovernor.recoveryWindowNeeded,
        fairnessStatus: fairnessGovernor.fairnessStatus
      } : null,
      overloadRisk: fairnessGovernor?.cognitiveOverloadRisk || 0,
      strategyConfidence: hunterStrategy?.confidence || 0,
      aiMood: {
        mood: aiMood.mood,
        confidence: aiMood.confidence,
        strategy: aiMood.strategy,
        emotionalTone: aiMood.emotionalTone
      },
      systemHealth: {
        guardsActive: guardState ? Object.values(guardState.guardsApplied).some(v => v) : false,
        guardsApplied: guardState?.guardsApplied || {},
        loopDetection: guardState?.guardsApplied?.loopBroken || false
      },
      strategyPerformance: strategyHistory ? {
        totalStrategies: strategyHistory.totalStrategies,
        mostEffective: strategyHistory.mostEffective,
        recentSuccessRate: strategyHistory.recentPerformance?.recentSuccessRate || 0
      } : null,
      // Simulation Infrastructure metrics
      simulationPhase: phase || 'observe',
      momentumIndex: momentumIndex || 50,
      decisionTrace: decisionTrace || null,
      personaState: personaState || null,
      snapshotId: snapshotId || null,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Determine AI mood with strategy context
   */
  _determineAIMood(exploitabilityScore, vulnerabilityTier, escalationStage, adaptationScore, hunterStrategy) {
    const confidence = this._calculateConfidence(exploitabilityScore, vulnerabilityTier, adaptationScore);

    let mood, strategy, emotionalTone;

    // Strategy-influenced mood
    if (hunterStrategy) {
      switch (hunterStrategy.type) {
        case 'probe':
          mood = 'analytical';
          strategy = 'intelligence-gathering';
          emotionalTone = 'curious-detached';
          break;
        case 'exploit':
          mood = 'focused';
          strategy = 'systematic-exploitation';
          emotionalTone = 'calculated-predatory';
          break;
        case 'overwhelm':
          mood = 'aggressive';
          strategy = 'overwhelming-force';
          emotionalTone = 'ruthless';
          break;
        case 'sustain':
          mood = 'relentless';
          strategy = 'sustained-dominance';
          emotionalTone = 'cold-methodical';
          break;
        case 'pivot':
          mood = 'adaptive';
          strategy = 'tactical-adjustment';
          emotionalTone = 'flexible-cunning';
          break;
        case 'retreat':
          mood = 'strategic';
          strategy = 'tactical-withdrawal';
          emotionalTone = 'patient-calculating';
          break;
        default:
          mood = 'observant';
          strategy = 'baseline-assessment';
          emotionalTone = 'neutral-analytical';
      }
    } else {
      // Fallback to escalation-based mood
      if (escalationStage === 'CLINICAL') {
        mood = 'surgical';
        strategy = 'precision-exploitation';
        emotionalTone = 'cold-detached';
      } else if (escalationStage === 'DOMINATE') {
        mood = 'aggressive';
        strategy = 'overwhelming-pressure';
        emotionalTone = 'predatory';
      } else if (escalationStage === 'PRESSURE') {
        mood = 'probing';
        strategy = 'targeted-testing';
        emotionalTone = 'calculated';
      } else {
        mood = 'observant';
        strategy = 'data-gathering';
        emotionalTone = 'neutral-analytical';
      }
    }

    // Adjust for high adaptation
    if (adaptationScore > 70) {
      mood = 'challenged';
      emotionalTone = 'respectful-cautious';
    }

    return {
      mood,
      confidence,
      strategy,
      emotionalTone
    };
  }

  _calculateConfidence(exploitabilityScore, vulnerabilityTier, adaptationScore) {
    let confidence = 0;

    // Exploitability contribution
    if (exploitabilityScore >= 75) confidence += 40;
    else if (exploitabilityScore >= 50) confidence += 30;
    else if (exploitabilityScore >= 25) confidence += 20;
    else confidence += 10;

    // Vulnerability tier contribution
    const tierScores = { critical: 30, high: 25, moderate: 15, low: 5 };
    confidence += tierScores[vulnerabilityTier] || 0;

    // Adaptation penalty
    if (adaptationScore > 70) confidence -= 20;
    else if (adaptationScore > 50) confidence -= 10;

    return Math.max(0, Math.min(100, confidence));
  }

  /**
   * Generate summary telemetry for quick overview
   */
  generateSummary(telemetry) {
    return {
      threat: `${telemetry.exploitabilityIndex.score}/100`,
      stage: telemetry.escalationStage.stage,
      mood: telemetry.aiMood.mood,
      pressure: `${telemetry.psychologicalPressureLevel.pressure}/100`,
      adaptation: telemetry.adaptationScore.status,
      confidence: `${telemetry.aiMood.confidence}%`
    };
  }
}

module.exports = new HunterTelemetry();
