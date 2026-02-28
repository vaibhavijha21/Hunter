/**
 * Adaptive Trap Engine (Strategic)
 * Strategy-driven question selection with tactical objectives
 * No longer just weakness-matching - executes strategic intent
 */
const QuestionBank = require('../data/question-bank');

class AdaptiveTrap {
  /**
   * Select question based on strategy (primary) and weaknesses (secondary)
   */
  selectQuestion(weaknessTags = [], previousQuestions = [], exploitabilityScore = 0, vulnerabilityProfile = null, hunterStrategy = null) {
    const questions = QuestionBank.getAll();

    if (questions.length === 0) {
      return null;
    }

    // Filter out previously asked questions
    const availableQuestions = questions.filter(
      q => !previousQuestions.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      return null;
    }

    // Strategy-driven selection (if strategy provided)
    if (hunterStrategy) {
      return this._selectStrategicQuestion(
        availableQuestions,
        hunterStrategy,
        weaknessTags,
        exploitabilityScore,
        vulnerabilityProfile
      );
    }

    // Fallback to weakness-based selection
    return this._selectWeaknessBasedQuestion(
      availableQuestions,
      weaknessTags,
        exploitabilityScore,
      vulnerabilityProfile
    );
  }

  /**
   * Strategy-driven question selection
   */
  _selectStrategicQuestion(questions, strategy, weaknessTags, exploitabilityScore, vulnerabilityProfile) {
    const { type, tacticalApproach, objectives } = strategy;

    // Score questions based on strategic fit
    const scoredQuestions = questions.map(question => {
      const strategicScore = this._calculateStrategicScore(question, strategy, weaknessTags);
      const tacticalScore = this._calculateTacticalScore(question, tacticalApproach);
      const objectiveScore = this._calculateObjectiveScore(question, objectives.shortTerm);
      
      const finalScore = (strategicScore * 0.5) + (tacticalScore * 0.3) + (objectiveScore * 0.2);
      
      return { question, strategicScore, tacticalScore, objectiveScore, finalScore };
    });

    // Sort by final score
    scoredQuestions.sort((a, b) => b.finalScore - a.finalScore);

    const selected = scoredQuestions[0];
    
    return {
      ...selected.question,
      trapMetadata: {
        intensity: this._mapStrategyToIntensity(type),
        matchScore: Math.round(selected.finalScore),
        targetWeaknesses: weaknessTags,
        exploitabilityThreshold: exploitabilityScore,
        strategyType: type,
        strategicAlignment: Math.round(selected.strategicScore),
        tacticalApproach: tacticalApproach.questionSelection
      }
    };
  }

  /**
   * Calculate strategic score based on strategy type
   */
  _calculateStrategicScore(question, strategy, weaknessTags) {
    let score = 0;

    switch (strategy.type) {
      case 'probe':
        // Diverse coverage - prefer questions with different tags
        score += question.tags.length * 10;
        break;

      case 'exploit':
        // Weakness-focused - prefer questions matching weaknesses
        score += this._calculateMatchScore(question.tags, weaknessTags);
        break;

      case 'overwhelm':
        // Multi-weakness - prefer questions with multiple weakness matches
        const matchCount = question.tags.filter(t => weaknessTags.includes(t)).length;
        score += matchCount * 15;
        break;

      case 'sustain':
        // Sustained pressure - prefer hard questions
        if (question.difficulty === 'hard') score += 30;
        else if (question.difficulty === 'medium') score += 15;
        break;

      case 'pivot':
        // Alternative vector - prefer questions with non-matched tags
        const nonMatchCount = question.tags.filter(t => !weaknessTags.includes(t)).length;
        score += nonMatchCount * 12;
        break;

      case 'retreat':
        // Recovery-friendly - prefer easier questions
        if (question.difficulty === 'easy') score += 30;
        else if (question.difficulty === 'medium') score += 15;
        break;
    }

    return score;
  }

  /**
   * Calculate tactical score
   */
  _calculateTacticalScore(question, tacticalApproach) {
    let score = 0;

    const { questionSelection, intensityProgression } = tacticalApproach;

    // Question selection approach
    if (questionSelection === 'diverse-coverage') {
      score += question.tags.length * 5;
    } else if (questionSelection === 'weakness-focused') {
      score += 10; // Handled in strategic score
    }

    // Intensity progression
    const intensityScores = {
      gradual: { easy: 20, medium: 10, hard: 0 },
      targeted: { easy: 5, medium: 20, hard: 10 },
      aggressive: { easy: 0, medium: 10, hard: 25 },
      reduced: { easy: 25, medium: 15, hard: 5 }
    };

    const difficultyScores = intensityScores[intensityProgression] || intensityScores.gradual;
    score += difficultyScores[question.difficulty] || 0;

    return score;
  }

  /**
   * Calculate objective alignment score
   */
  _calculateObjectiveScore(question, shortTermObjectives) {
    let score = 0;

    // Check if question helps achieve objectives
    shortTermObjectives.forEach(objective => {
      if (objective.includes('time pressure') && question.timeLimit < 360) {
        score += 10;
      }
      if (objective.includes('incorrect attempts') && question.difficulty === 'hard') {
        score += 10;
      }
      if (objective.includes('baseline') && question.difficulty === 'medium') {
        score += 10;
      }
    });

    return score;
  }

  /**
   * Map strategy type to trap intensity
   */
  _mapStrategyToIntensity(strategyType) {
    const mapping = {
      probe: 'subtle',
      exploit: 'moderate',
      overwhelm: 'aggressive',
      sustain: 'aggressive',
      pivot: 'moderate',
      retreat: 'subtle'
    };

    return mapping[strategyType] || 'moderate';
  }

  /**
   * Fallback: Weakness-based selection
   */
  _selectWeaknessBasedQuestion(questions, weaknessTags, exploitabilityScore, vulnerabilityProfile) {
    const trapIntensity = this._determineTrapIntensity(exploitabilityScore, vulnerabilityProfile);

    if (weaknessTags.length === 0 || weaknessTags.includes('stable')) {
      return this._selectBaseline(questions, trapIntensity);
    }

    const scoredQuestions = questions.map(question => {
      const matchScore = this._calculateMatchScore(question.tags, weaknessTags);
      const intensityScore = this._calculateIntensityScore(question, trapIntensity);
      const finalScore = matchScore + intensityScore;
      
      return { question, matchScore, intensityScore, finalScore };
    });

    scoredQuestions.sort((a, b) => b.finalScore - a.finalScore);

    const selected = scoredQuestions[0];
    return {
      ...selected.question,
      trapMetadata: {
        intensity: trapIntensity,
        matchScore: selected.matchScore,
        targetWeaknesses: weaknessTags,
        exploitabilityThreshold: exploitabilityScore
      }
    };
  }

  _determineTrapIntensity(exploitabilityScore, vulnerabilityProfile) {
    // Aggressive traps only when highly exploitable
    if (exploitabilityScore >= 75) {
      return 'aggressive';
    }

    // Check vulnerability profile for additional context
    if (vulnerabilityProfile) {
      const { tier, dimensions } = vulnerabilityProfile;
      
      if (tier === 'critical') return 'aggressive';
      if (tier === 'high' && dimensions.pattern.learningResistance === 'high') {
        return 'aggressive';
      }
      if (tier === 'high') return 'moderate';
    }

    // Moderate traps for medium exploitability
    if (exploitabilityScore >= 40) {
      return 'moderate';
    }

    // Subtle traps for low exploitability
    return 'subtle';
  }

  _calculateIntensityScore(question, trapIntensity) {
    const difficultyScores = {
      easy: 10,
      medium: 20,
      hard: 30
    };

    const baseScore = difficultyScores[question.difficulty] || 15;

    // Intensity multipliers
    const intensityMultipliers = {
      subtle: 0.5,
      moderate: 1.0,
      aggressive: 1.5
    };

    return baseScore * (intensityMultipliers[trapIntensity] || 1.0);
  }

  _calculateMatchScore(questionTags, weaknessTags) {
    let score = 0;

    for (const weaknessTag of weaknessTags) {
      if (questionTags.includes(weaknessTag)) {
        score += 10; // Direct match
      }

      // Related tag matching
      const relatedTags = this._getRelatedTags(weaknessTag);
      for (const relatedTag of relatedTags) {
        if (questionTags.includes(relatedTag)) {
          score += 5; // Related match
        }
      }
    }

    return score;
  }

  _getRelatedTags(tag) {
    const relations = {
      'time-pressure': ['complexity-struggle', 'hasty-solver'],
      'pattern-blindness': ['trial-error-dependent', 'complexity-struggle'],
      'edge-case-weak': ['complexity-struggle', 'hasty-solver'],
      'trial-error-dependent': ['pattern-blindness', 'hint-dependent'],
      'hint-dependent': ['trial-error-dependent', 'slow-solver'],
      'slow-solver': ['complexity-struggle', 'hint-dependent'],
      'hasty-solver': ['edge-case-weak', 'trial-error-dependent'],
      'complexity-struggle': ['edge-case-weak', 'pattern-blindness']
    };

    return relations[tag] || [];
  }

  _selectBaseline(questions, trapIntensity) {
    // Select baseline based on intensity
    const difficultyMap = {
      subtle: 'easy',
      moderate: 'medium',
      aggressive: 'hard'
    };

    const targetDifficulty = difficultyMap[trapIntensity] || 'medium';
    const baseline = questions.find(q => q.difficulty === targetDifficulty);
    
    return baseline || questions[0];
  }
}

module.exports = new AdaptiveTrap();
