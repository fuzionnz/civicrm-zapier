const subscribeHook = async (z, bundle) => {

  const data = {
    webhookUrl: bundle.targetUrl,
    name: 'Triggers when the participant is updated.',
    description: 'Created via Zapier',
    triggers: ['update_participant']
  };

  const options = {
    url: bundle.authData.baseUrl + '/civicrm/zaphooks/new',
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    }
  };

  return z.request(options).then(response => response.json);
};


const unsubscribeHook = (z, bundle) => {
  // bundle.subscribeData contains the parsed response JSON from the subscribe
  // request made initially.
  const hookId = bundle.subscribeData.hook.id;

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: bundle.authData.baseUrl + '/civicrm/zaphooks/new?hook='+hookId+'&delete=1',
    method: 'DELETE',
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

const listParticipants = (z, bundle) => {

  const participant = {
    id: bundle.cleanedRequest.id,
    contact_id: bundle.cleanedRequest.contact_id,
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
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
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
    outputFields: [
      { key: 'id', label: 'Participant ID' },
      { key: 'contact_id', label: 'Participant Name' },
      { key: 'event_id', label: 'Event Name' },
      { key: 'status_id', label: 'Status' },
      { key: 'role_id', label: 'Role' },
      { key: 'source', label: 'Source' },
      { key: 'fee_amount', label: 'Fee Amount' },
    ],
  },
};