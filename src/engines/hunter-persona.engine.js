/**
 * Hunter Persona Layer
 * Defines persona traits that bias strategy selection and influence mood/tone
 */

class HunterPersonaEngine {
  constructor() {
    this.personas = {
      analytical: {
        name: 'The Analyst',
        traits: {
          patience: 80,
          aggression: 30,
          adaptability: 70,
          precision: 90
        },
        strategyBias: {
          probe: 1.5,
          exploit: 1.0,
          overwhelm: 0.5,
          sustain: 1.3,
          pivot: 1.4,
          retreat: 0.8
        },
        moodTendency: 'analytical',
        toneBias: 'clinical',
        description: 'Methodical and data-driven, prefers sustained observation'
      },
      aggressive: {
        name: 'The Predator',
        traits: {
          patience: 30,
          aggression: 90,
          adaptability: 50,
          precision: 60
        },
        strategyBias: {
          probe: 0.7,
          exploit: 1.8,
          overwhelm: 2.0,
          sustain: 0.8,
          pivot: 0.6,
          retreat: 0.3
        },
        moodTendency: 'focused',
        toneBias: 'aggressive',
        description: 'Relentless pressure, seeks rapid exploitation'
      },
      adaptive: {
        name: 'The Chameleon',
        traits: {
          patience: 60,
          aggression: 60,
          adaptability: 95,
          precision: 70
        },
        strategyBias: {
          probe: 1.2,
          exploit: 1.2,
          overwhelm: 1.0,
          sustain: 1.1,
          pivot: 1.8,
          retreat: 1.5
        },
        moodTendency: 'calculating',
        toneBias: 'adaptive',
        description: 'Highly flexible, constantly adjusts approach'
      },
      patient: {
        name: 'The Strategist',
        traits: {
          patience: 95,
          aggression: 40,
          adaptability: 75,
          precision: 85
        },
        strategyBias: {
          probe: 1.8,
          exploit: 1.1,
          overwhelm: 0.6,
          sustain: 1.7,
          pivot: 1.3,
          retreat: 1.2
        },
        moodTendency: 'patient',
        toneBias: 'measured',
        description: 'Long-term planning, waits for optimal moment'
      }
    };
    
    this.defaultPersona = 'analytical';
  }

  /**
   * Initialize persona state
   */
  initializePersona(personaType = null) {
    const type = personaType || this.defaultPersona;
    const persona = this.personas[type] || this.personas[this.defaultPersona];
    
    return {
      type,
      name: persona.name,
      traits: { ...persona.traits },
      strategyBias: { ...persona.strategyBias },
      moodTendency: persona.moodTendency,
      toneBias: persona.toneBias,
      description: persona.description,
      state: {
        currentMood: persona.moodTendency,
        frustrationLevel: 0,
        confidenceLevel: 70,
        adaptationCount: 0
      }
    };
  }

  /**
   * Update persona state based on session results
   */
  updatePersonaState(personaState, sessionResult) {
    const { exploitability, resistance, momentum, success } = sessionResult;
    
    // Update frustration (increases with resistance)
    if (resistance > 60) {
      personaState.state.frustrationLevel = Math.min(100, personaState.state.frustrationLevel + 10);
    } else {
      personaState.state.frustrationLevel = Math.max(0, personaState.state.frustrationLevel - 5);
    }
    
    // Update confidence (increases with high exploitability)
    if (exploitability > 70) {
      personaState.state.confidenceLevel = Math.min(100, personaState.state.confidenceLevel + 10);
    } else if (exploitability < 30) {
      personaState.state.confidenceLevel = Math.max(0, personaState.state.confidenceLevel - 10);
    }
    
    // Update mood based on state
    personaState.state.currentMood = this._determineMood(personaState);
    
    // Track adaptations
    if (sessionResult.strategyChanged) {
      personaState.state.adaptationCount++;
    }
    
    return personaState;
  }

  /**
   * Determine current mood
   */
  _determineMood(personaState) {
    const { frustrationLevel, confidenceLevel } = personaState.state;
    const { aggression, patience } = personaState.traits;
    
    // High confidence + high aggression = focused
    if (confidenceLevel > 70 && aggression > 60) {
      return 'focused';
    }
    
    // High frustration + high aggression = aggressive
    if (frustrationLevel > 60 && aggression > 60) {
      return 'aggressive';
    }
    
    // High patience + low frustration = patient
    if (patience > 70 && frustrationLevel < 40) {
      return 'patient';
    }
    
    // High confidence + low frustration = calculating
    if (confidenceLevel > 60 && frustrationLevel < 40) {
      return 'calculating';
    }
    
    // Default to tendency
    return personaState.moodTendency;
  }

  /**
   * Apply persona bias to strategy selection
   */
  applyStrategyBias(personaState, strategyScores) {
    const biasedScores = {};
    
    for (const [strategy, score] of Object.entries(strategyScores)) {
      const bias = personaState.strategyBias[strategy] || 1.0;
      biasedScores[strategy] = score * bias;
    }
    
    return biasedScores;
  }

  /**
   * Get dialogue tone based on persona
   */
  getDialogueTone(personaState, vulnerabilityLevel) {
    const { toneBias } = personaState;
    const { currentMood, frustrationLevel, confidenceLevel } = personaState.state;
    
    // Persona influences base tone
    let tone = toneBias;
    
    // Mood modifies tone
    if (currentMood === 'aggressive' && vulnerabilityLevel === 'high') {
      tone = 'dominating';
    } else if (currentMood === 'patient' && vulnerabilityLevel === 'low') {
      tone = 'observational';
    } else if (currentMood === 'calculating') {
      tone = 'analytical';
    }
    
    // Frustration can override
    if (frustrationLevel > 80) {
      tone = 'aggressive';
    }
    
    return {
      tone,
      intensity: this._calculateToneIntensity(personaState, vulnerabilityLevel),
      personaInfluence: toneBias
    };
  }

  /**
   * Calculate tone intensity
   */
  _calculateToneIntensity(personaState, vulnerabilityLevel) {
    const { aggression } = personaState.traits;
    const { frustrationLevel, confidenceLevel } = personaState.state;
    
    let intensity = 50;
    
    // Aggression trait increases intensity
    intensity += (aggression - 50) * 0.3;
    
    // Frustration increases intensity
    intensity += frustrationLevel * 0.2;
    
    // High confidence increases intensity
    if (confidenceLevel > 70) {
      intensity += 10;
    }
    
    // Vulnerability level influences intensity
    if (vulnerabilityLevel === 'high') {
      intensity += 15;
    } else if (vulnerabilityLevel === 'low') {
      intensity -= 10;
    }
    
    return Math.max(0, Math.min(100, Math.round(intensity)));
  }

  /**
   * Should persona trigger strategy change?
   */
  shouldTriggerStrategyChange(personaState, currentStrategy, sessionsSinceChange) {
    const { adaptability, patience } = personaState.traits;
    const { frustrationLevel } = personaState.state;
    
    // High adaptability = change more frequently
    const adaptabilityThreshold = 100 - adaptability;
    
    // Low patience = change quickly when frustrated
    const patienceThreshold = patience / 10;
    
    if (frustrationLevel > 70 && sessionsSinceChange > patienceThreshold) {
      return { shouldChange: true, reason: 'frustration_threshold' };
    }
    
    if (sessionsSinceChange > adaptabilityThreshold / 10) {
      return { shouldChange: true, reason: 'adaptability_trigger' };
    }
    
    return { shouldChange: false };
  }

  /**
   * Get persona summary
   */
  getPersonaSummary(personaState) {
    return {
      type: personaState.type,
      name: personaState.name,
      currentMood: personaState.state.currentMood,
      frustration: personaState.state.frustrationLevel,
      confidence: personaState.state.confidenceLevel,
      adaptations: personaState.state.adaptationCount,
      traits: personaState.traits
    };
  }

  /**
   * Get available personas
   */
  getAvailablePersonas() {
    return Object.keys(this.personas).map(key => ({
      type: key,
      name: this.personas[key].name,
      description: this.personas[key].description
    }));
  }
}

module.exports = new HunterPersonaEngine();
