# The Hunter Protocol – Intelligence Layer (Enhanced)

Production-ready Node.js backend for adaptive DSA learning with psychological profiling.

## Architecture

```
src/
├── server.js                 # Express server setup
├── routes/                   # API route definitions
│   ├── session.routes.js
│   └── question.routes.js
├── controllers/              # Request handlers
│   ├── session.controller.js
│   └── question.controller.js
├── engines/                  # Core intelligence engines
│   ├── behavior-tracker.engine.js
│   ├── cognitive-profiler.engine.js
│   ├── pattern-memory.engine.js          # NEW
│   ├── predictability-model.engine.js    # NEW
│   ├── vulnerability-matrix.engine.js    # NEW
│   ├── exploitability-index.engine.js    # ENHANCED
│   ├── adaptive-trap.engine.js           # ENHANCED
│   └── dialogue-decision.engine.js       # ENHANCED
└── data/
    └── question-bank.js      # Tagged DSA questions
```

## Enhanced Engines

### 1. Pattern Memory System
Tracks recurring mistake types across multiple questions:
- Detects if user repeats same conceptual mistakes
- Stores `mistakePatternScore` (0-100)
- Identifies `conceptualWeaknesses`
- Monitors learning progress over time

### 2. Predictability Model (Deterministic)
Classifies user behavior patterns:
- **Impulsive**: Quick but incorrect repeatedly
- **Dependent**: Heavy hint usage but eventual solving
- **Methodical**: Slow but accurate
- **Panic-prone**: Struggles under time pressure
- **Erratic**: Inconsistent performance
- Outputs `predictabilityLevel` (low | medium | high)
- Detects avoidance behavior for specific concepts

### 3. Vulnerability Matrix
Combines multiple profiling dimensions:
- **Cognitive**: Weakness tags + severity + stability
- **Behavioral**: Classifications + predictability
- **Pattern**: Mistake patterns + learning resistance
- **Psychological**: Avoidance + mental state
- Outputs comprehensive `vulnerabilityProfile` with tier (critical | high | moderate | low)
- Generates exploitation strategies

### 4. Enhanced Exploitability Index
Evolving weighted scoring system:
- Incorporates pattern memory + predictability
- Tracks score evolution over time
- Calculates trend (increasing | decreasing | stable)
- Measures volatility
- Score adapts based on historical performance

### 5. Enhanced Adaptive Trap Engine
Intelligent question selection with intensity levels:
- **Subtle**: Low exploitability (< 40)
- **Moderate**: Medium exploitability (40-74)
- **Aggressive**: High exploitability (≥ 75)
- Matches questions to weakness tags
- Adjusts difficulty based on vulnerability tier
- Provides trap metadata with each question

### 6. Enhanced Dialogue Engine
Psychological tone shifting:
- **Cold-analytical**: Critical vulnerability
- **Clinical-detached**: High vulnerability + defensive state
- **Probing-invasive**: High vulnerability
- **Calculated-observant**: Moderate vulnerability
- **Neutral-observant**: Low vulnerability
- Selects manipulation tactics based on vulnerability dimensions
- Calculates psychological pressure (0-100)

## API Endpoints

### POST /session/analyze
Comprehensive psychological profiling of user session.

**Request:**
```json
{
  "questionId": "q001",
  "userId": "user123",
  "timeTaken": 450,
  "incorrectAttempts": 2,
  "hintUsage": 1,
  "edgeCaseFailures": 1,
  "repeatedMistakes": 0,
  "panicUnderTimer": false,
  "conceptTags": ["arrays", "two-pointer"]
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "behavior": { ... },
    "profile": {
      "weaknessTags": ["trial-error-dependent"],
      "stabilityScore": 68,
      "severityLevel": "low"
    },
    "patternMemory": {
      "mistakePatternScore": 25,
      "repeatedConceptCount": 0,
      "totalMistakes": 1,
      "conceptualWeaknesses": [],
      "isLearning": true
    },
    "predictability": {
      "behaviorClassification": ["stable"],
      "predictabilityLevel": "low",
      "avoidancePatterns": [],
      "consistencyScore": 50
    },
    "exploitability": {
      "score": 42,
      "breakdown": { ... },
      "interpretation": "slightly-exploitable",
      "evolution": {
        "trend": "stable",
        "volatility": 5,
        "changeRate": 2
      }
    },
    "vulnerability": {
      "overallScore": 35,
      "tier": "moderate",
      "dimensions": {
        "cognitive": { ... },
        "behavioral": { ... },
        "pattern": { ... },
        "psychological": { ... }
      },
      "exploitationStrategy": [ ... ],
      "criticalWeaknesses": [],
      "defenseMechanisms": ["adaptive-learning"]
    },
    "dialogue": {
      "dialogueKey": "moderate-vulnerability-neutral",
      "tone": "calculated-observant",
      "message": "Interesting patterns emerging...",
      "psychologicalPressure": 45,
      "manipulationTactic": ["baseline-testing"],
      "vulnerabilityScore": 35
    }
  }
}
```

### GET /question/adaptive
Gets next adaptive question with trap intensity.

**Query Params:**
- `weaknessTags` (comma-separated)
- `previousQuestions` (comma-separated IDs)
- `exploitabilityScore` (0-100)
- `vulnerabilityTier` (low | moderate | high | critical)

**Response:**
```json
{
  "success": true,
  "question": {
    "id": "q006",
    "title": "Container With Most Water",
    "difficulty": "medium",
    "tags": ["trial-error-dependent", "complexity-struggle"],
    "timeLimit": 420,
    "trapMetadata": {
      "intensity": "moderate",
      "matchScore": 15,
      "targetWeaknesses": ["trial-error-dependent"],
      "exploitabilityThreshold": 42
    }
  }
}
```

## Setup

```bash
npm install
cp .env.example .env
npm start
```

## Development

```bash
npm run dev
```

## Key Features

✅ Deterministic algorithms (no ML)
✅ Psychological profiling system
✅ Pattern memory tracking
✅ Predictability modeling
✅ Multi-dimensional vulnerability assessment
✅ Adaptive trap intensity
✅ Dynamic dialogue tone shifting
✅ Evolving exploitability scoring
✅ Production-ready architecture
✅ Modular engine design

## Design Philosophy

The system psychologically profiles users through:
- Behavioral pattern recognition
- Cognitive weakness identification
- Predictability analysis
- Vulnerability matrix generation
- Adaptive trap deployment
- Psychological dialogue manipulation

All algorithms are deterministic and rule-based, ensuring consistent and explainable results without ML dependencies.
