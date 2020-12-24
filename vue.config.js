const context = process.env.CONTEXT; 
if (context === 'npm') {
  module.exports = require('./npmbulid');
} else {
  module.exports = {
  }
}
