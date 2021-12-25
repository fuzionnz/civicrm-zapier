const ContactCreatedTrigger = require('./triggers/contactCreated');
const UpdateParticipantTrigger = require('./triggers/updateParticipant');

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: require('./authentication'),
  triggers: {
    [ContactCreatedTrigger.key]: ContactCreatedTrigger,
    [UpdateParticipantTrigger.key]: UpdateParticipantTrigger,
  },
};

module.exports = App;