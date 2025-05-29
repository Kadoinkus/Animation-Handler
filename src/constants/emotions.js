/**
 * Master two-letter codes mapping to full emotion names
 */
export const EMOTION_TABLE = {
  ha: 'happy',
  an: 'angry',
  sa: 'sad',
  af: 'afraid',
  ex: 'excited',
  sh: 'shy',
  sk: 'shocked',
  bo: 'bored',
  cu: 'curious',
  co: 'confused',
  fr: 'frustrated',
  pr: 'proud',
  pl: 'playful',
  ti: 'tired',
  rl: 'relaxed',
  em: 'embarrassed',
  su: 'surprised',
  th: 'thoughtful',
  di: 'disgusted',
  dp: 'disappointed',
  ho: 'hopeful',
  je: 'jealous',
  am: 'amused',
  ao: 'annoyed',
  ne: 'nervous',
  op: 'optimistic',
  pe: 'pessimistic',
  st: 'satisfied',
  sq: 'skeptical',
};

/**
 * State transition mapping
 */
export const STATE_TRANSITIONS = {
  sleep: ['wait'],
  wait: ['sleep', 'react'],
  react: ['type'],
  type: ['wait'],
};
