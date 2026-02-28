/**
 * Long-Term User Memory System
 * Maintains historical cognitive patterns across multiple sessions
 */
class LongTermMemory {
  constructor() {
    // In production, use Redis/Database
    this.userMemory = new Map();
  }

  /**
   * Store session data in long-term memory
   */
  recordSession(userId, sessionData) {
    if (!this.userMemory.has(userId)) {
      this.userMemory.set(userId, {
        sessions: [],
        conceptHistory: new Map(),
        vulnerabilityBaseline: null,
        firstSessionTimestamp: new Date().toISOString(),
        totalSessions: 0
      });
    }

    const memory = this.userMemory.get(userId);
    
    // Add session
    memory.sessions.push({
      ...sessionData,
      timestamp: new Date().toISOString()
    });

    // Keep last 50 sessions
    if (memory.sessions.length > 50) {
      memory.sessions.shift();
    }

    memory.totalSessions++;

    // Update concept history
    if (sessionData.conceptTags) {
      sessionData.conceptTags.forEach(concept => {
        if (!memory.conceptHistory.has(concept)) {
          memory.conceptHistory.set(concept, {
            attempts: 0,
            successes: 0,
            failures: 0,
            firstSeen: new Date().toISOString(),
            lastSeen: new Date().toISOString()
          });
        }

        const conceptData = memory.conceptHistory.get(concept);
        conceptData.attempts++;
        conceptData.lastSeen = new Date().toISOString();

        if (sessionData.incorrectAttempts <= 1 && !sessionData.edgeCaseFailures) {
          conceptData.successes++;
        } else {
          conceptData.failures++;
        }
      });
    }

    // Update vulnerability baseline (first 5 sessions average)
    if (memory.totalSessions <= 5) {
      this._updateVulnerabilityBaseline(userId);
    }

    return this.getProfile(userId);
  }

  /**
   * Get comprehensive user profile
   */
  getProfile(userId) {
    const memory = this.userMemory.get(userId);
    if (!memory) {
      return null;
    }

    const improvementRate = this._calculateImprovementRate(memory.sessions);
    const conceptPersistence = this._calculateConceptPersistence(memory.conceptHistory);
    const vulnerabilityBaseline = memory.vulnerabilityBaseline || 50;

    return {
      userId,
      totalSessions: memory.totalSessions,
      improvementRate,
      conceptPersistence,
      vulnerabilityBaseline,
      recentPerformance: this._getRecentPerformance(memory.sessions),
      conceptMastery: this._getConceptMastery(memory.conceptHistory),
      sessionHistory: memory.sessions.slice(-10) // Last 10 sessions
    };
  }

  /**
   * Calculate improvement rate over time
   */
  _calculateImprovementRate(sessions) {
    if (sessions.length < 3) {
      return { rate: 0, trend: 'insufficient-data' };
    }

    const recentSessions = sessions.slice(-10);
    const midpoint = Math.floor(recentSessions.length / 2);
    
    const firstHalf = recentSessions.slice(0, midpoint);
    const secondHalf = recentSessions.slice(midpoint);

    const firstHalfScore = this._calculateAveragePerformance(firstHalf);
    const secondHalfScore = this._calculateAveragePerformance(secondHalf);

    const improvementRate = ((secondHalfScore - firstHalfScore) / firstHalfScore) * 100;

    let trend = 'stable';
    if (improvementRate > 15) trend = 'improving';
    else if (improvementRate < -15) trend = 'declining';

    return {
      rate: Math.round(improvementRate),
      trend,
      firstHalfAvg: Math.round(firstHalfScore),
      secondHalfAvg: Math.round(secondHalfScore)
    };
  }

  _calculateAveragePerformance(sessions) {
    if (sessions.length === 0) return 50;

    const scores = sessions.map(s => {
      let score = 100;
      score -= (s.incorrectAttempts || 0) * 10;
      score -= (s.hintUsage || 0) * 8;
      score -= (s.edgeCaseFailures || 0) * 12;
      score -= (s.repeatedMistakes || 0) * 15;
      score -= (s.panicUnderTimer ? 20 : 0);
      return Math.max(0, score);
    });

    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  /**
   * Calculate concept persistence (how well concepts stick)
   */
  _calculateConceptPersistence(conceptHistory) {
    if (conceptHistory.size === 0) {
      return { score: 0, status: 'no-data' };
    }

    let totalPersistence = 0;
    let conceptCount = 0;

    for (const [concept, data] of conceptHistory.entries()) {
      if (data.attempts >= 2) {
        const successRate = data.successes / data.attempts;
        totalPersistence += successRate * 100;
        conceptCount++;
      }
    }

    if (conceptCount === 0) {
      return { score: 0, status: 'insufficient-exposure' };
    }

    const avgPersistence = totalPersistence / conceptCount;
    
    let status = 'moderate';
    if (avgPersistence >= 70) status = 'high';
    else if (avgPersistence < 40) status = 'low';

    return {
      score: Math.round(avgPersistence),
      status,
      conceptsTracked: conceptCount
    };
  }

  /**
   * Update vulnerability baseline (first 5 sessions)
   */
  _updateVulnerabilityBaseline(userId) {
    const memory = this.userMemory.get(userId);
    if (!memory || memory.sessions.length === 0) return;

    const baselineSessions = memory.sessions.slice(0, 5);
    const avgPerformance = this._calculateAveragePerformance(baselineSessions);
    
    // Invert to vulnerability (lower performance = higher vulnerability)
    memory.vulnerabilityBaseline = Math.round(100 - avgPerformance);
  }

  /**
   * Get recent performance summary
   */
  _getRecentPerformance(sessions) {
    const recent = sessions.slice(-5);
    if (recent.length === 0) return null;

    const avgTime = recent.reduce((sum, s) => sum + (s.timeTaken || 0), 0) / recent.length;
    const avgAttempts = recent.reduce((sum, s) => sum + (s.incorrectAttempts || 0), 0) / recent.length;
    const panicRate = recent.filter(s => s.panicUnderTimer).length / recent.length;

    return {
      avgTimeTaken: Math.round(avgTime),
      avgIncorrectAttempts: Math.round(avgAttempts * 10) / 10,
      panicRate: Math.round(panicRate * 100)
    };
  }

  /**
   * Get concept mastery levels
   */
  _getConceptMastery(conceptHistory) {
    const mastery = {
      mastered: [],
      learning: [],
      struggling: []
    };

    for (const [concept, data] of conceptHistory.entries()) {
      if (data.attempts < 2) continue;

      const successRate = data.successes / data.attempts;

      if (successRate >= 0.8) {
        mastery.mastered.push({ concept, successRate: Math.round(successRate * 100) });
      } else if (successRate >= 0.5) {
        mastery.learning.push({ concept, successRate: Math.round(successRate * 100) });
      } else {
        mastery.struggling.push({ concept, successRate: Math.round(successRate * 100) });
      }
    }

    return mastery;
  }

  /**
   * Clear user memory (for testing)
   */
  clearUser(userId) {
    this.userMemory.delete(userId);
  }
}

module.exports = new LongTermMemory();
