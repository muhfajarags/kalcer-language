// Kalcer comparison operators
const kalcerCompare = {
  // Basic comparisons with consistent behavior
  'nyampe': '>=',           // Greater than or equal to
  'ga nyampe': '<',         // Less than
  'belum nyampe': '<',      // Less than (alias)
  'lebih gede': '>',        // Greater than
  'lebih kecil': '<',       // Less than
  'sama dengan': '===',     // Strict equality
  'beda sama': '!==',       // Strict inequality
  
  // Complex comparisons with fixed behavior
  'belum nyampe minimal': '<',     // Less than (for else-if)
  'udah nyampe minimal': '>=',     // Greater than or equal to
  'masih dibawah': '<',           // Less than (alias)
  'diatas': '>',                  // Greater than (alias)
  'dibawah': '<',                // Less than (alias)
  'pas': '===',                  // Strict equality (alias)
  
  // Additional operators for more expressive conditions
  'sama persis': '===',          // Strict equality (alias)
  'beda total': '!=='           // Strict inequality (alias)
};

module.exports = kalcerCompare; 