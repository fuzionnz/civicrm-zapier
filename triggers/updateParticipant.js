const Civicrm = require('../civicrm');
const civicrm = new Civicrm();

const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('update_participant', 'Triggers when the participant is updated');

const listParticipants = (z, bundle) => {
  return [bundle.cleanedRequest];
};

const getFallbackRealParticipant = (z, bundle) => {
  const params = {
    'select': ['*', 'custom.*', 'contact_id.*', 'event_id.*'],
  };
  return civicrm.getEntityData(z, bundle, 'Participant', params);
};

const getParticipantFields = async (z, bundle) => {
  const entities = [
    { entity: 'Contact', prefix: 'contact_id.', label: ' (Participant Contact)' },
    { entity: 'Event', prefix: 'event_id.', label: ' (Participant Event)' },
  ];
  return civicrm.fetchFieldsForEntities(z, bundle, entities, 'Participant');
};

module.exports = {
  key: 'update_participant',
  noun: 'Update Participant',
  display: {
    label: 'Update Participant',
    description: 'Triggers when a participant is updated.',
  },
  operation: {
    type: 'hook',
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
    perform: listParticipants,
    performList: getFallbackRealParticipant,
    sample: {
      id: 1,
      contact_id: 'John Doe',
      contact_first_name: 'John',
      contact_last_name: 'Doe',
      contact_email: 'john.doe@example.com',
      event_id: 'Fall Fundraiser Dinner',
      participant_status: 'Registered',
      participant_role: 'Volunteer',
      participant_source: 'Created from Zapier',
      participant_fee_amount: '100',
    },
    outputFields: [getParticipantFields],
  },
};