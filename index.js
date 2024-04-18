const ContactCreatedTrigger = require('./triggers/contactCreated');
const UpdateParticipantTrigger = require('./triggers/updateParticipant');

const getMembershipCreated = require("./triggers/membership_created");

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: require('./authentication'),
  triggers: {
    [ContactCreatedTrigger.key]: ContactCreatedTrigger,
    [UpdateParticipantTrigger.key]: UpdateParticipantTrigger,
    [getMembershipCreated.key]: getMembershipCreated
  },
};

module.exports = App;