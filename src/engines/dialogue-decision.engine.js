/**
 * Dialogue Decision Engine (Enhanced)
 * Psychological tone shifting based on vulnerability profile
 */
class DialogueDecision {
  decide(severityLevel, weaknessTags, vulnerabilityProfile = null) {
    // Filter out 'stable' tag
    const activeWeaknesses = weaknessTags.filter(tag => tag !== 'stable');

    // Enhanced decision with vulnerability profile
    if (vulnerabilityProfile) {
      return this._decideWithProfile(vulnerabilityProfile, activeWeaknesses);
    }

    // Fallback to basic decision
    if (activeWeaknesses.length === 0) {
      return {
        dialogueKey: 'stable-encouragement',
        tone: 'neutral',
        message: 'You seem stable. Let me test that theory.',
        psychologicalPressure: 'minimal'
      };
    }

    const primaryWeakness = activeWeaknesses[0];
    const dialogueKey = this._generateDialogueKey(severityLevel, primaryWeakness);
    const tone = this._determineTone(severityLevel);
    const message = this._generateMessage(severityLevel, primaryWeakness, activeWeaknesses.length);

    return {
      dialogueKey,
      tone,
      message,
      targetedWeakness: primaryWeakness,
      weaknessCount: activeWeaknesses.length,
      psychologicalPressure: this._determinePressure(severityLevel)
    };
  }

  _decideWithProfile(vulnerabilityProfile, activeWeaknesses) {
    const { overallScore, tier, dimensions, criticalWeaknesses } = vulnerabilityProfile;

    // Determine tone based on vulnerability tier
    const tone = this._determineToneFromTier(tier, dimensions);
    
    // Generate psychologically targeted message
    const message = this._generateProfiledMessage(tier, dimensions, criticalWeaknesses);

    // Determine psychological pressure level
    const psychologicalPressure = this._calculatePsychologicalPressure(tier, dimensions);

    // Select manipulation tactic
    const manipulationTactic = this._selectManipulationTactic(dimensions);

    return {
      dialogueKey: `${tier}-vulnerability-${dimensions.psychological.mentalState}`,
      tone,
      message,
      psychologicalPressure,
      manipulationTactic,
      targetedDimensions: this._identifyTargetDimensions(dimensions),
      criticalWeaknesses,
      vulnerabilityScore: overallScore
    };
  }

  _determineToneFromTier(tier, dimensions) {
    const mentalState = dimensions.psychological.mentalState;

    if (tier === 'critical') return 'cold-analytical';
    if (tier === 'high' && mentalState === 'defensive') return 'clinical-detached';
    if (tier === 'high') return 'probing-invasive';
    if (tier === 'moderate') return 'calculated-observant';
    return 'neutral-observant';
  }

  _generateProfiledMessage(tier, dimensions, criticalWeaknesses) {
    const messages = {
      critical: [
        `Your cognitive patterns are completely transparent. ${this._formatWeaknesses(criticalWeaknesses)}`,
        `I've mapped your vulnerabilities. There's no uncertainty left.`,
        `Every decision you make follows a predictable pattern. You're an open book.`,
        `Your defenses are non-existent. This will be trivial.`
      ],
      high: [
        `I'm detecting significant exploitable patterns in your approach.`,
        `Your ${dimensions.behavioral.classifications[0]} behavior makes you predictable.`,
        `You've exposed ${criticalWeaknesses.length} critical weaknesses. I will use them.`,
        `The data suggests you're highly vulnerable to targeted pressure.`
      ],
      moderate: [
        `Interesting patterns emerging. You're more predictable than you think.`,
        `I'm beginning to understand your cognitive blind spots.`,
        `Your behavior reveals exploitable tendencies.`,
        `There are cracks in your approach. Let me probe deeper.`
      ],
      low: [
        `You're showing resilience, but everyone has weaknesses.`,
        `Your defenses are adequate. For now.`,
        `I'm still gathering data on your patterns.`,
        `You're cautious. That's wise. But not enough.`
      ]
    };

    const tierMessages = messages[tier] || messages.low;
    const index = Math.floor(Math.random() * tierMessages.length);
    return tierMessages[index];
  }

  _formatWeaknesses(weaknesses) {
    if (weaknesses.length === 0) return '';
    if (weaknesses.length === 1) return `Weakness identified: ${weaknesses[0]}.`;
    if (weaknesses.length === 2) return `Weaknesses: ${weaknesses[0]} and ${weaknesses[1]}.`;
    return `Multiple weaknesses detected: ${weaknesses.slice(0, 2).join(', ')}, and more.`;
  }

  _calculatePsychologicalPressure(tier, dimensions) {
    const tierPressure = { critical: 90, high: 70, moderate: 45, low: 20 };
    let pressure = tierPressure[tier] || 20;

    if (dimensions.psychological.mentalState === 'defensive') pressure += 10;
    if (dimensions.psychological.mentalState === 'adaptive') pressure -= 10;

    return Math.min(100, Math.max(0, pressure));
  }

  _selectManipulationTactic(dimensions) {
    const tactics = [];

    if (dimensions.behavioral.predictability === 'high') {
      tactics.push('predictive-exploitation');
    }
    if (dimensions.pattern.learningResistance === 'high') {
      tactics.push('repetitive-failure-induction');
    }
    if (dimensions.psychological.avoidedConcepts.length > 0) {
      tactics.push('forced-confrontation');
    }
    if (dimensions.cognitive.weaknessCount >= 3) {
      tactics.push('multi-vector-attack');
    }

    return tactics.length > 0 ? tactics : ['baseline-testing'];
  }

  _identifyTargetDimensions(dimensions) {
    const targets = [];

    if (dimensions.cognitive.score > 60) targets.push('cognitive');
    if (dimensions.behavioral.score > 60) targets.push('behavioral');
    if (dimensions.pattern.score > 60) targets.push('pattern');
    if (dimensions.psychological.score > 60) targets.push('psychological');

    return targets.length > 0 ? targets : ['exploratory'];
  }

  _generateDialogueKey(severity, weakness) {
    return `${severity}-${weakness}`;
  }

  _determineTone(severity) {
    const tones = { low: 'observant', medium: 'probing', high: 'aggressive' };
    return tones[severity] || 'neutral';
  }

  _determinePressure(severity) {
    const pressure = { low: 'minimal', medium: 'moderate', high: 'intense' };
    return pressure[severity] || 'minimal';
  }

  _generateMessage(severity, weakness, weaknessCount) {
    const messages = {
      low: {
        'time-pressure': 'I notice you hesitate under time constraints.',
        'pattern-blindness': 'Patterns seem to elude you.',
        'edge-case-weak': 'Edge cases are your blind spot.',
        'trial-error-dependent': 'You rely on trial and error.',
        'hint-dependent': 'You lean on hints quite often.',
        'slow-solver': 'You take your time... perhaps too much.',
        'hasty-solver': 'Speed without accuracy is just noise.',
        'complexity-struggle': 'Complexity makes you uncomfortable.'
      },
      medium: {
        'time-pressure': 'The clock is your enemy. Let me exploit that.',
        'pattern-blindness': 'You miss patterns. I will use that against you.',
        'edge-case-weak': 'Edge cases will be your downfall.',
        'trial-error-dependent': 'Guessing won\'t save you here.',
        'hint-dependent': 'No hints this time. Let\'s see how you fare.',
        'slow-solver': 'Time is running out. Can you keep up?',
        'hasty-solver': 'Your haste will cost you.',
        'complexity-struggle': 'Let me increase the complexity.'
      },
      high: {
        'time-pressure': 'Panic is setting in. I can feel it.',
        'pattern-blindness': 'You\'re blind to the pattern. This will be easy.',
        'edge-case-weak': 'I\'ve found your weakness. Edge cases will destroy you.',
        'trial-error-dependent': 'Random attempts won\'t work. You\'re trapped.',
        'hint-dependent': 'No safety net. You\'re on your own.',
        'slow-solver': 'Too slow. The trap is closing.',
        'hasty-solver': 'Your carelessness is my advantage.',
        'complexity-struggle': 'Maximum complexity. Let\'s see you break.'
      }
    };

    const baseMessage = messages[severity]?.[weakness] || 'Interesting behavior detected.';
    
    if (weaknessCount > 3) {
      return `${baseMessage} Multiple weaknesses detected. You\'re vulnerable.`;
    }

    return baseMessage;
  }
}

module.exports = new DialogueDecision();
