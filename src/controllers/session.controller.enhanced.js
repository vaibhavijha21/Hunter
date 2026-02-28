/**
 * Enhanced Session Controller (Simulation Infrastructure)
 * Integrates all 22 Cognitive Hunter System engines including simulation layer
 */
const BehaviorTracker = require('../engines/behavior-tracker.engine');
const CognitiveProfiler = require('../engines/cognitive-profiler.engine');
const ExploitabilityIndex = require('../engines/exploitability-index.engine');
const DialogueDecision = require('../engines/dialogue-decision.engine');
const PatternMemory = require('../engines/pattern-memory.engine');
const PredictabilityModel = require('../engines/predictability-model.engine');
const VulnerabilityMatrix = require('../engines/vulnerability-matrix.engine');
const LongTermMemory = require('../engines/long-term-memory.engine');
const HunterEscalation = require('../engines/hunter-escalation.engine');
const MetaCognitiveFeedback = require('../engines/meta-cognitive-feedback.engine');
const HunterStabilityGuard = require('../engines/hunter-stability-guard.engine');
const HunterTelemetry = require('../engines/hunter-telemetry.engine');
const AdaptiveTrap = require('../engines/adaptive-trap.engine');
const StrategicIntent = require('../engines/strategic-intent.engine');
const CounterAdaptation = require('../engines/counter-adaptation.engine');
const CognitiveFairnessGovernor = require('../engines/cognitive-fairness-governor.engine');
const StrategyHistoryTracker = require('../engines/strategy-history-tracker.engine');

// Simulation Infrastructure Engines
const SimulationTimeline = require('../engines/simulation-timeline.engine');
const PsychologicalMomentum = require('../engines/psychological-momentum.engine');
const DecisionTraceLogger = require('../engines/decision-trace-logger.engine');
const SimulationSnapshot = require('../engines/simulation-snapshot.engine');
const HunterPersona = require('../engines/hunter-persona.engine');

class EnhancedSessionController {
  /**
   * Comprehensive cognitive hunter analysis
   */
  analyzeSession(req, res) {
    try {
      const behaviorData = req.body;
      const { userId, conceptTags = [] } = behaviorData;

      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId is required' 
        });
      }

      // Step 1: Track behavior (pure function)
      const trackedBehavior = BehaviorTracker.track(behaviorData);

      // Step 2: Update long-term memory
      const longTermProfile = LongTermMemory.recordSession(userId, {
        ...trackedBehavior,
        conceptTags
      });

      // Step 3: Track mistake patterns
      const patternMemoryData = this._trackPatterns(
        userId,
        trackedBehavior,
        conceptTags
      );

      // Step 4: Generate cognitive profile (pure function)
      const cognitiveProfile = CognitiveProfiler.profile(trackedBehavior);

      // Step 5: Analyze predictability
      const sessionHistory = [{ ...trackedBehavior, conceptTags }];
      const predictabilityData = PredictabilityModel.analyze(userId, sessionHistory);

      // Step 6: Calculate exploitability index
      const exploitabilityScore = ExploitabilityIndex.calculate(
        cognitiveProfile,
        patternMemoryData,
        predictabilityData
      );

      // Step 7: Generate vulnerability matrix (pure function)
      const vulnerabilityMatrix = VulnerabilityMatrix.generate(
        cognitiveProfile,
        predictabilityData,
        patternMemoryData
      );

      // Step 8: Determine escalation stage
      const escalationData = HunterEscalation.determineEscalation(
        userId,
        exploitabilityScore,
        predictabilityData,
        longTermProfile
      );

      // Step 9: Meta-cognitive feedback (pure function)
      const metaCognitiveFeedback = MetaCognitiveFeedback.analyze(
        longTermProfile,
        exploitabilityScore,
        escalationData
      );

      // Step 10: Counter-adaptation analysis
      const counterAdaptation = CounterAdaptation.analyze(
        userId,
        {
          metaCognitive: metaCognitiveFeedback,
          exploitability: exploitabilityScore,
          escalation: escalationData,
          predictability: predictabilityData,
          profile: cognitiveProfile,
          patternMemory: patternMemoryData
        },
        longTermProfile
      );

      // Step 11: Cognitive fairness assessment
      const fairnessGovernor = CognitiveFairnessGovernor.assess(
        userId,
        {
          escalation: escalationData,
          exploitability: exploitabilityScore,
          dialogue: { psychologicalPressure: escalationData.pressureMultiplier * 50 },
          vulnerability: vulnerabilityMatrix.vulnerabilityProfile,
          profile: cognitiveProfile,
          patternMemory: patternMemoryData
        },
        longTermProfile
      );

      // Step 12: Determine strategic intent
      const hunterStrategy = StrategicIntent.determineStrategy(
        userId,
        {
          exploitability: exploitabilityScore,
          vulnerability: vulnerabilityMatrix.vulnerabilityProfile,
          escalation: escalationData,
          metaCognitive: metaCognitiveFeedback,
          counterAdaptation,
          fairnessGovernor
        }
      );

      // Step 13: Generate adaptive question (strategy-driven)
      const adaptiveQuestion = AdaptiveTrap.selectQuestion(
        cognitiveProfile.weaknessTags,
        [],
        exploitabilityScore.score,
        vulnerabilityMatrix.vulnerabilityProfile,
        hunterStrategy
      );

      // Step 14: Apply stability guards
      const guardedOutputs = HunterStabilityGuard.applyGuards(
        userId,
        {
          exploitabilityScore: exploitabilityScore.score,
          trapIntensity: adaptiveQuestion?.trapMetadata?.intensity || 'subtle',
          psychologicalPressure: escalationData.pressureMultiplier * 50,
          escalationStage: escalationData.stage
        },
        longTermProfile?.sessionHistory || []
      );

      // Step 15: Determine dialogue with guarded values (pure function)
      const dialogue = DialogueDecision.decide(
        cognitiveProfile.severityLevel,
        cognitiveProfile.weaknessTags,
        vulnerabilityMatrix.vulnerabilityProfile
      );

      // Override with guarded pressure
      dialogue.psychologicalPressure = guardedOutputs.guardedOutputs.psychologicalPressure;

      // Step 16: Record strategy execution
      const strategyHistory = StrategyHistoryTracker.recordStrategy(
        userId,
        hunterStrategy,
        {
          exploitabilityChange: exploitabilityScore.score - (exploitabilityScore.evolution.historicalAverage || 0)
        },
        {
          exploitabilityBefore: exploitabilityScore.evolution.historicalAverage || 0,
          exploitability: exploitabilityScore,
          vulnerability: vulnerabilityMatrix.vulnerabilityProfile,
          profile: cognitiveProfile,
          counterAdaptation,
          fairnessGovernor
        }
      );

      // ===== SIMULATION INFRASTRUCTURE LAYER =====
      
      // Step 17: Initialize/update hunter persona
      const personaState = this._getOrInitializePersona(userId);
      const updatedPersona = HunterPersona.updatePersonaState(personaState, {
        exploitability: exploitabilityScore.score,
        resistance: counterAdaptation.resistanceLevel,
        momentum: 50, // Will be updated with actual momentum
        success: exploitabilityScore.score > 60,
        strategyChanged: hunterStrategy.strategyType !== (strategyHistory.previousStrategy || 'probe')
      });
      this._storePersona(userId, updatedPersona);

      // Step 18: Compute psychological momentum
      const momentumHistory = this._getMomentumHistory(userId);
      const momentum = PsychologicalMomentum.computeMomentum(
        userId,
        exploitabilityScore.score,
        metaCognitiveFeedback.adaptationScore,
        momentumHistory
      );
      this._storeMomentumHistory(userId, momentum.history);

      // Step 19: Update simulation timeline
      const existingTimeline = this._getTimeline(userId);
      const timeline = SimulationTimeline.updateTimeline(
        userId,
        exploitabilityScore.score,
        momentum,
        existingTimeline
      );
      this._storeTimeline(userId, timeline);

      // Step 20: Initialize decision trace
      const sessionId = `session_${Date.now()}`;
      let decisionTrace = DecisionTraceLogger.initializeTrace(userId, sessionId);
      
      // Log all major decisions
      decisionTrace = DecisionTraceLogger.logBehaviorAnalysis(decisionTrace, trackedBehavior, cognitiveProfile);
      decisionTrace = DecisionTraceLogger.logCognitiveProfile(decisionTrace, cognitiveProfile);
      decisionTrace = DecisionTraceLogger.logStrategicIntent(decisionTrace, hunterStrategy);
      decisionTrace = DecisionTraceLogger.logEscalation(decisionTrace, escalationData);
      decisionTrace = DecisionTraceLogger.logTrapSelection(decisionTrace, adaptiveQuestion, adaptiveQuestion.trapMetadata);
      decisionTrace = DecisionTraceLogger.logFairnessIntervention(decisionTrace, fairnessGovernor);
      decisionTrace = DecisionTraceLogger.logCounterAdaptation(decisionTrace, counterAdaptation);
      decisionTrace = DecisionTraceLogger.logPhaseTransition(decisionTrace, timeline);
      decisionTrace = DecisionTraceLogger.logMomentum(decisionTrace, momentum);
      decisionTrace = DecisionTraceLogger.generateSummary(decisionTrace);

      // Step 21: Create simulation snapshot
      const snapshot = SimulationSnapshot.createSnapshot(userId, timeline.currentTick, {
        exploitability: exploitabilityScore,
        vulnerability: vulnerabilityMatrix,
        escalation: escalationData,
        strategicIntent: hunterStrategy,
        counterAdaptation,
        fairnessGovernor,
        timeline,
        momentum,
        profile: cognitiveProfile,
        behavior: trackedBehavior,
        adaptiveQuestion,
        metaCognitive: metaCognitiveFeedback,
        sessionId,
        traceId: decisionTrace.traceId
      });

      // Step 22: Generate enhanced telemetry with simulation data
      const telemetry = HunterTelemetry.generate({
        exploitability: exploitabilityScore,
        vulnerability: vulnerabilityMatrix.vulnerabilityProfile,
        escalation: escalationData,
        predictability: predictabilityData,
        metaCognitive: metaCognitiveFeedback,
        dialogue,
        adaptiveQuestion,
        guardState: guardedOutputs,
        hunterStrategy,
        counterAdaptation,
        fairnessGovernor,
        strategyHistory,
        // Simulation layer additions
        phase: timeline.currentPhase,
        momentumIndex: momentum.momentumIndex,
        decisionTrace: DecisionTraceLogger.getFormattedTrace(decisionTrace),
        personaState: HunterPersona.getPersonaSummary(updatedPersona),
        snapshotId: snapshot.snapshotId
      });

      // Response
      res.json({
        success: true,
        analysis: {
          behavior: trackedBehavior,
          profile: cognitiveProfile,
          patternMemory: patternMemoryData,
          predictability: predictabilityData,
          exploitability: exploitabilityScore,
          vulnerability: vulnerabilityMatrix.vulnerabilityProfile,
          escalation: escalationData,
          metaCognitive: metaCognitiveFeedback,
          counterAdaptation,
          fairnessGovernor,
          strategicIntent: hunterStrategy,
          strategyHistory,
          longTermProfile: {
            totalSessions: longTermProfile.totalSessions,
            improvementRate: longTermProfile.improvementRate,
            conceptPersistence: longTermProfile.conceptPersistence,
            vulnerabilityBaseline: longTermProfile.vulnerabilityBaseline
          },
          dialogue,
          adaptiveQuestion,
          stabilityGuards: guardedOutputs,
          // Simulation layer
          timeline: SimulationTimeline.getTimelineState(timeline),
          momentum,
          persona: HunterPersona.getPersonaSummary(updatedPersona),
          snapshot: {
            snapshotId: snapshot.snapshotId,
            tick: snapshot.tick
          }
        },
        telemetry,
        telemetrySummary: HunterTelemetry.generateSummary(telemetry),
        decisionTrace: DecisionTraceLogger.getFormattedTrace(decisionTrace)
      });
    } catch (error) {
      console.error('Session analysis error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Helper: Track patterns (pure logic)
   */
  _trackPatterns(userId, behavior, conceptTags) {
    if (behavior.incorrectAttempts > 0 || behavior.edgeCaseFailures > 0) {
      const mistakeType = this._determineMistakeType(behavior);
      return PatternMemory.trackMistake(
        userId,
        behavior.questionId,
        mistakeType,
        conceptTags
      );
    }
    return PatternMemory.getUserPattern(userId);
  }

  /**
   * Helper: Determine mistake type (pure function)
   */
  _determineMistakeType(behavior) {
    if (behavior.edgeCaseFailures > 0) return 'edge-case-failure';
    if (behavior.repeatedMistakes > 0) return 'repeated-conceptual-error';
    if (behavior.incorrectAttempts >= 3) return 'trial-error-failure';
    if (behavior.panicUnderTimer) return 'time-pressure-failure';
    return 'general-mistake';
  }

  /**
   * Get user's long-term profile
   */
  getUserProfile(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId is required' 
        });
      }

      const profile = LongTermMemory.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ 
          success: false, 
          error: 'User profile not found' 
        });
      }

      res.json({
        success: true,
        profile
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  /**
   * Reset user data (for testing)
   */
  resetUser(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId is required' 
        });
      }

      LongTermMemory.clearUser(userId);
      PatternMemory.clearUserPattern(userId);
      HunterEscalation.resetUser(userId);
      HunterStabilityGuard.resetUser(userId);
      StrategicIntent.resetUser(userId);
      CounterAdaptation.resetUser(userId);
      CognitiveFairnessGovernor.resetUser(userId);
      StrategyHistoryTracker.resetUser(userId);
      
      // Reset simulation infrastructure
      SimulationSnapshot.clearSnapshots(userId);
      this._clearPersona(userId);
      this._clearTimeline(userId);
      this._clearMomentumHistory(userId);

      res.json({
        success: true,
        message: `User ${userId} data reset successfully`
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  /**
   * Get session replay data
   */
  getSessionReplay(req, res) {
    try {
      const { userId } = req.params;
      const { startTick, endTick } = req.query;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId is required' 
        });
      }

      const replay = SimulationSnapshot.generateReplay(
        userId,
        startTick ? parseInt(startTick) : 0,
        endTick ? parseInt(endTick) : null
      );

      res.json({
        success: true,
        replay
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  /**
   * Get available personas
   */
  getPersonas(req, res) {
    try {
      const personas = HunterPersona.getAvailablePersonas();
      res.json({
        success: true,
        personas
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  /**
   * Set user persona
   */
  setPersona(req, res) {
    try {
      const { userId } = req.params;
      const { personaType } = req.body;
      
      if (!userId || !personaType) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId and personaType are required' 
        });
      }

      const persona = HunterPersona.initializePersona(personaType);
      this._storePersona(userId, persona);

      res.json({
        success: true,
        message: `Persona set to ${persona.name}`,
        persona: HunterPersona.getPersonaSummary(persona)
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  // ===== SIMULATION STATE MANAGEMENT =====
  
  constructor() {
    this.personaStore = new Map();
    this.timelineStore = new Map();
    this.momentumHistoryStore = new Map();
  }

  _getOrInitializePersona(userId) {
    if (!this.personaStore.has(userId)) {
      const persona = HunterPersona.initializePersona();
      this.personaStore.set(userId, persona);
    }
    return this.personaStore.get(userId);
  }

  _storePersona(userId, persona) {
    this.personaStore.set(userId, persona);
  }

  _clearPersona(userId) {
    this.personaStore.delete(userId);
  }

  _getTimeline(userId) {
    return this.timelineStore.get(userId) || null;
  }

  _storeTimeline(userId, timeline) {
    this.timelineStore.set(userId, timeline);
  }

  _clearTimeline(userId) {
    this.timelineStore.delete(userId);
  }

  _getMomentumHistory(userId) {
    return this.momentumHistoryStore.get(userId) || [];
  }

  _storeMomentumHistory(userId, history) {
    this.momentumHistoryStore.set(userId, history);
  }

  _clearMomentumHistory(userId) {
    this.momentumHistoryStore.delete(userId);
  }
}

module.exports = new EnhancedSessionController();
