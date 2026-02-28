/**
 * Pattern Memory System
 * Tracks recurring mistake types across multiple questions
 */
class PatternMemory {
  constructor() {
    // In-memory storage (use Redis/DB in production)
    this.userPatterns = new Map();
  }

  trackMistake(userId, questionId, mistakeType, conceptTags) {
    if (!this.userPatterns.has(userId)) {
      this.userPatterns.set(userId, {
        mistakes: [],
        conceptExposure: new Map(),
        repeatedConcepts: new Set()
      });
    }

    const userPattern = this.userPatterns.get(userId);

    // Record mistake
    userPattern.mistakes.push({
      questionId,
      mistakeType,
      conceptTags,
      timestamp: new Date().toISOString()
    });

    // Track concept exposure and repetition
    for (const concept of conceptTags) {
      const exposureCount = (userPattern.conceptExposure.get(concept) || 0) + 1;
      userPattern.conceptExposure.set(concept, exposureCount);

      // If exposed to concept multiple times and still failing
      if (exposureCount >= 2) {
        userPattern.repeatedConcepts.add(concept);
      }
    }

    return this.calculatePatternScore(userId);
  }

  calculatePatternScore(userId) {
    const userPattern = this.userPatterns.get(userId);
    if (!userPattern) {
      return {
        mistakePatternScore: 0,
        repeatedConceptCount: 0,
        totalMistakes: 0,
        conceptualWeaknesses: []
      };
    }

    const totalMistakes = userPattern.mistakes.length;
    const repeatedConceptCount = userPattern.repeatedConcepts.size;

    // Calculate pattern score (0-100, higher = more problematic patterns)
    let patternScore = 0;

    // Base score from total mistakes
    patternScore += Math.min(totalMistakes * 5, 30);

    // Heavy penalty for repeated conceptual mistakes
    patternScore += repeatedConceptCount * 15;

    // Check for mistake clustering (same mistakes in short time)
    const recentMistakes = this._getRecentMistakes(userPattern.mistakes, 5);
    const mistakeTypes = recentMistakes.map(m => m.mistakeType);
    const uniqueTypes = new Set(mistakeTypes);
    
    if (mistakeTypes.length > 0 && uniqueTypes.size < mistakeTypes.length) {
      patternScore += 20; // Clustering penalty
    }

    return {
      mistakePatternScore: Math.min(patternScore, 100),
      repeatedConceptCount,
      totalMistakes,
      conceptualWeaknesses: Array.from(userPattern.repeatedConcepts),
      isLearning: this._detectLearningProgress(userPattern)
    };
  }

  _getRecentMistakes(mistakes, count) {
    return mistakes.slice(-count);
  }

  _detectLearningProgress(userPattern) {
    if (userPattern.mistakes.length < 5) return true;

    // Compare first half vs second half mistake rate
    const midpoint = Math.floor(userPattern.mistakes.length / 2);
    const firstHalf = userPattern.mistakes.slice(0, midpoint);
    const secondHalf = userPattern.mistakes.slice(midpoint);

    const firstHalfRate = firstHalf.length / midpoint;
    const secondHalfRate = secondHalf.length / (userPattern.mistakes.length - midpoint);

    return secondHalfRate < firstHalfRate; // Improving if rate decreased
  }

  getUserPattern(userId) {
    return this.calculatePatternScore(userId);
  }

  clearUserPattern(userId) {
    this.userPatterns.delete(userId);
  }
}

module.exports = new PatternMemory();
