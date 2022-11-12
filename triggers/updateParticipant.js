const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('update_participant', 'Triggers when the participant is updated');

const listParticipants = (z, bundle) => {

  const participant = {
    id: bundle.cleanedRequest.id,
    contact_id: bundle.cleanedRequest.contact_id,
    contact_first_name: bundle.cleanedRequest.contact_first_name,
    contact_last_name: bundle.cleanedRequest.contact_last_name,
    contact_email: bundle.cleanedRequest.contact_email,
    event_id: bundle.cleanedRequest.event_id,
    status_id: bundle.cleanedRequest.status_id,
    role_id: bundle.cleanedRequest.role_id,
    source: bundle.cleanedRequest.source,
    fee_amount: bundle.cleanedRequest.fee_amount,
  };

  return [participant];

};

const getFallbackRealParticipant = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  const options = {
    url: bundle.authData.baseUrl + '/civicrm/zapier/participants',
  };

  return z.request(options)
    .then((response) => JSON.parse(response.content));
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
      status_id: 'Registered',
      role_id: 'Volunteer',
      source: 'Created from Zapier',
      fee_amount: '100',
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    //   outputFields: [
    //    () => { return []; }
    //   ]
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform-cli#customdynamic-fields.
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    // Todo: Replace it with participant.getfields api.
    outputFields: [
      { key: 'id', label: 'Participant ID' },
      { key: 'contact_id', label: 'Participant Name' },
      { key: 'contact_first_name', label: 'Participant First Name' },
      { key: 'contact_last_name', label: 'Participant Last Name' },
      { key: 'contact_email', label: 'Participant Email ID' },
      { key: 'event_id', label: 'Event Name' },
      { key: 'status_id', label: 'Status' },
      { key: 'role_id', label: 'Role' },
      { key: 'source', label: 'Source' },
      { key: 'fee_amount', label: 'Fee Amount' },
    ],
  },
};