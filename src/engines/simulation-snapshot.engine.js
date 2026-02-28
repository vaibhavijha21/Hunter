/**
 * Simulation Snapshot History
 * Stores tick-by-tick state for session replay
 */

class SimulationSnapshotEngine {
  constructor() {
    this.snapshots = new Map(); // userId -> snapshots array
    this.maxSnapshotsPerUser = 100; // Limit storage
  }

  /**
   * Create snapshot of current state
   */
  createSnapshot(userId, tick, state) {
    const snapshotId = `${userId}_tick_${tick}_${Date.now()}`;
    
    const snapshot = {
      snapshotId,
      userId,
      tick,
      timestamp: new Date().toISOString(),
      state: {
        // Core metrics
        exploitabilityIndex: state.exploitability?.score || 0,
        vulnerabilityTier: state.vulnerability?.tier || 'unknown',
        escalationStage: state.escalation?.stage || 'OBSERVE',
        
        // Strategic layer
        strategyType: state.strategicIntent?.strategyType || 'probe',
        resistanceLevel: state.counterAdaptation?.resistanceLevel || 0,
        fatigueIndex: state.fairnessGovernor?.pressureFatigueIndex || 0,
        overloadRisk: state.fairnessGovernor?.cognitiveOverloadRisk || 0,
        
        // Timeline
        phase: state.timeline?.currentPhase || 'observe',
        ticksInPhase: state.timeline?.ticksInCurrentPhase || 0,
        
        // Momentum
        momentumIndex: state.momentum?.momentumIndex || 50,
        momentumDirection: state.momentum?.direction || 'stable',
        
        // Cognitive profile
        weaknessTags: state.profile?.weaknessTags || [],
        stabilityScore: state.profile?.stabilityScore || 100,
        severityLevel: state.profile?.severityLevel || 'low',
        
        // Behavior
        timeTaken: state.behavior?.timeTaken || 0,
        incorrectAttempts: state.behavior?.incorrectAttempts || 0,
        panicDetected: state.behavior?.panicUnderTimer || false,
        
        // Question
        questionId: state.behavior?.questionId || null,
        adaptiveQuestionId: state.adaptiveQuestion?.id || null,
        trapIntensity: state.adaptiveQuestion?.trapMetadata?.intensity || 'subtle',
        
        // Meta
        adaptationScore: state.metaCognitive?.adaptationScore || 0,
        adaptationStatus: state.metaCognitive?.adaptationStatus || 'unknown'
      },
      metadata: {
        sessionId: state.sessionId || null,
        traceId: state.traceId || null
      }
    };
    
    // Store snapshot
    this._storeSnapshot(userId, snapshot);
    
    return snapshot;
  }

  /**
   * Store snapshot in history
   */
  _storeSnapshot(userId, snapshot) {
    if (!this.snapshots.has(userId)) {
      this.snapshots.set(userId, []);
    }
    
    const userSnapshots = this.snapshots.get(userId);
    userSnapshots.push(snapshot);
    
    // Limit storage
    if (userSnapshots.length > this.maxSnapshotsPerUser) {
      userSnapshots.shift(); // Remove oldest
    }
  }

  /**
   * Get all snapshots for user
   */
  getSnapshots(userId) {
    return this.snapshots.get(userId) || [];
  }

  /**
   * Get snapshot by ID
   */
  getSnapshotById(snapshotId) {
    for (const [userId, snapshots] of this.snapshots.entries()) {
      const snapshot = snapshots.find(s => s.snapshotId === snapshotId);
      if (snapshot) return snapshot;
    }
    return null;
  }

  /**
   * Get snapshots in tick range
   */
  getSnapshotsByTickRange(userId, startTick, endTick) {
    const snapshots = this.getSnapshots(userId);
    return snapshots.filter(s => s.tick >= startTick && s.tick <= endTick);
  }

  /**
   * Get latest snapshot
   */
  getLatestSnapshot(userId) {
    const snapshots = this.getSnapshots(userId);
    return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  }

  /**
   * Generate session replay data
   */
  generateReplay(userId, startTick = 0, endTick = null) {
    const snapshots = this.getSnapshots(userId);
    
    if (snapshots.length === 0) {
      return {
        userId,
        totalTicks: 0,
        snapshots: [],
        summary: null
      };
    }
    
    // Filter by tick range
    let filteredSnapshots = snapshots.filter(s => s.tick >= startTick);
    if (endTick !== null) {
      filteredSnapshots = filteredSnapshots.filter(s => s.tick <= endTick);
    }
    
    // Generate summary
    const summary = this._generateReplaySummary(filteredSnapshots);
    
    return {
      userId,
      totalTicks: filteredSnapshots.length,
      startTick: filteredSnapshots[0]?.tick || 0,
      endTick: filteredSnapshots[filteredSnapshots.length - 1]?.tick || 0,
      snapshots: filteredSnapshots,
      summary
    };
  }

  /**
   * Generate replay summary
   */
  _generateReplaySummary(snapshots) {
    if (snapshots.length === 0) return null;
    
    const phases = {};
    const strategies = {};
    let maxExploitability = 0;
    let maxMomentum = 0;
    let phaseTransitions = 0;
    let strategyChanges = 0;
    
    let previousPhase = null;
    let previousStrategy = null;
    
    snapshots.forEach(snapshot => {
      const state = snapshot.state;
      
      // Track phases
      phases[state.phase] = (phases[state.phase] || 0) + 1;
      if (previousPhase && previousPhase !== state.phase) {
        phaseTransitions++;
      }
      previousPhase = state.phase;
      
      // Track strategies
      strategies[state.strategyType] = (strategies[state.strategyType] || 0) + 1;
      if (previousStrategy && previousStrategy !== state.strategyType) {
        strategyChanges++;
      }
      previousStrategy = state.strategyType;
      
      // Track maximums
      maxExploitability = Math.max(maxExploitability, state.exploitabilityIndex);
      maxMomentum = Math.max(maxMomentum, state.momentumIndex);
    });
    
    const firstSnapshot = snapshots[0].state;
    const lastSnapshot = snapshots[snapshots.length - 1].state;
    
    return {
      duration: snapshots.length,
      phaseDistribution: phases,
      strategyDistribution: strategies,
      phaseTransitions,
      strategyChanges,
      maxExploitability,
      maxMomentum,
      progression: {
        start: {
          phase: firstSnapshot.phase,
          strategy: firstSnapshot.strategyType,
          exploitability: firstSnapshot.exploitabilityIndex
        },
        end: {
          phase: lastSnapshot.phase,
          strategy: lastSnapshot.strategyType,
          exploitability: lastSnapshot.exploitabilityIndex
        }
      }
    };
  }

  /**
   * Clear snapshots for user
   */
  clearSnapshots(userId) {
    this.snapshots.delete(userId);
  }

  /**
   * Get snapshot statistics
   */
  getStatistics(userId) {
    const snapshots = this.getSnapshots(userId);
    
    if (snapshots.length === 0) {
      return { totalSnapshots: 0, oldestTick: null, newestTick: null };
    }
    
    return {
      totalSnapshots: snapshots.length,
      oldestTick: snapshots[0].tick,
      newestTick: snapshots[snapshots.length - 1].tick,
      storageUsed: `${snapshots.length}/${this.maxSnapshotsPerUser}`
    };
  }
}

module.exports = new SimulationSnapshotEngine();
