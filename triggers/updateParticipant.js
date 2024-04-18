const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('update_participant', 'Triggers when the participant is updated');

const listParticipants = (z, bundle) => {
  return [bundle.cleanedRequest];
};

const getFallbackRealParticipant = (z, bundle) => {
  const params = {
    'select': ['*', 'custom.*', 'contact_id.*', 'event_id.*'],
  };
  return triggerHelper.getEntityData(z, bundle, 'Participant', params);
};

const getParticipantFields = async (z, bundle) => {
  const entities = [
    { entity: 'Contact', prefix: 'contact_id.', label: ' (Participant Contact)' },
    { entity: 'Event', prefix: 'event_id.', label: ' (Participant Event)' },
  ];

  const promises = entities.map(({ entity, prefix, label }) => triggerHelper.fetchFields(z, bundle, entity, prefix, label));

  const fieldLists = await Promise.all(promises);
  const mergedFields = fieldLists.reduce((accumulator, currentList) => accumulator.concat(currentList), []);
  const participantFields = await triggerHelper.fetchFields(z, bundle, 'Participant');

  return [...mergedFields, ...participantFields];
};

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'update_participant',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Update Participant',
  display: {
    label: 'Update Participant',
    description: 'Triggers when a participant is updated.',
  },

  // `operation` is where the business logic goes.
  operation: {
    type: 'hook',
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
    // `inputFields` can define the fields a user could provide,
    // we'll pass them in as `bundle.inputData` later.
    perform: listParticipants,
    performList: getFallbackRealParticipant,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
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

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    //   outputFields: [
    //    () => { return []; }
    //   ]
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform-cli#customdynamic-fields.
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [getParticipantFields],
  },
};