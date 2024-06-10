const ContactCreatedTrigger = require('./triggers/contactCreated');
const UpdateParticipantTrigger = require('./triggers/updateParticipant');

const getMembershipCreated = require("./triggers/membership_created");

const contactCreate = require('./creates/contact');
const emailCreate = require('./creates/email');

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: require('./authentication'),
  triggers: {
    [ContactCreatedTrigger.key]: ContactCreatedTrigger,
    [UpdateParticipantTrigger.key]: UpdateParticipantTrigger,
    [getMembershipCreated.key]: getMembershipCreated
  },
  creates: {
    [contactCreate.key]: contactCreate,
    [emailCreate.key]: emailCreate
  },
};

module.exports = App;