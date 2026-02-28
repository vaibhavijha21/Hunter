/**
 * Question Bank
 * Tagged DSA questions for adaptive selection
 */
class QuestionBank {
  constructor() {
    this.questions = [
      {
        id: 'q001',
        title: 'Two Sum',
        difficulty: 'easy',
        tags: ['trial-error-dependent', 'hasty-solver'],
        description: 'Find two numbers that add up to a target',
        timeLimit: 300,
        category: 'arrays'
      },
      {
        id: 'q002',
        title: 'Valid Parentheses',
        difficulty: 'easy',
        tags: ['pattern-blindness', 'edge-case-weak'],
        description: 'Check if parentheses are balanced',
        timeLimit: 240,
        category: 'stacks'
      },
      {
        id: 'q003',
        title: 'Merge Two Sorted Lists',
        difficulty: 'easy',
        tags: ['edge-case-weak', 'slow-solver'],
        description: 'Merge two sorted linked lists',
        timeLimit: 360,
        category: 'linked-lists'
      },
      {
        id: 'q004',
        title: 'Binary Search',
        difficulty: 'medium',
        tags: ['pattern-blindness', 'edge-case-weak'],
        description: 'Implement binary search algorithm',
        timeLimit: 300,
        category: 'searching'
      },
      {
        id: 'q005',
        title: 'Longest Substring Without Repeating',
        difficulty: 'medium',
        tags: ['complexity-struggle', 'pattern-blindness'],
        description: 'Find longest substring without repeating characters',
        timeLimit: 480,
        category: 'strings'
      },
      {
        id: 'q006',
        title: 'Container With Most Water',
        difficulty: 'medium',
        tags: ['trial-error-dependent', 'complexity-struggle'],
        description: 'Find container that holds most water',
        timeLimit: 420,
        category: 'arrays'
      },
      {
        id: 'q007',
        title: 'Validate BST',
        difficulty: 'medium',
        tags: ['edge-case-weak', 'pattern-blindness'],
        description: 'Validate if tree is a valid binary search tree',
        timeLimit: 480,
        category: 'trees'
      },
      {
        id: 'q008',
        title: 'Course Schedule',
        difficulty: 'medium',
        tags: ['complexity-struggle', 'hint-dependent'],
        description: 'Detect cycle in directed graph',
        timeLimit: 600,
        category: 'graphs'
      },
      {
        id: 'q009',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'hard',
        tags: ['complexity-struggle', 'time-pressure', 'edge-case-weak'],
        description: 'Find median of two sorted arrays',
        timeLimit: 720,
        category: 'arrays'
      },
      {
        id: 'q010',
        title: 'Trapping Rain Water',
        difficulty: 'hard',
        tags: ['pattern-blindness', 'complexity-struggle'],
        description: 'Calculate trapped rainwater',
        timeLimit: 600,
        category: 'arrays'
      },
      {
        id: 'q011',
        title: 'Word Ladder',
        difficulty: 'hard',
        tags: ['complexity-struggle', 'time-pressure', 'hint-dependent'],
        description: 'Find shortest transformation sequence',
        timeLimit: 720,
        category: 'graphs'
      },
      {
        id: 'q012',
        title: 'Serialize and Deserialize Binary Tree',
        difficulty: 'hard',
        tags: ['edge-case-weak', 'complexity-struggle'],
        description: 'Serialize and deserialize a binary tree',
        timeLimit: 600,
        category: 'trees'
      }
    ];
  }

  getAll() {
    return this.questions;
  }

  getById(id) {
    return this.questions.find(q => q.id === id);
  }

  getByTags(tags) {
    return this.questions.filter(q => 
      tags.some(tag => q.tags.includes(tag))
    );
  }

  getByDifficulty(difficulty) {
    return this.questions.filter(q => q.difficulty === difficulty);
  }
}

module.exports = new QuestionBank();
