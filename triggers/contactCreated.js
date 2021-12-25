const subscribeHook = async (z, bundle) => {

  const data = {
    webhookUrl: bundle.targetUrl,
    name: 'Triggers when the contact is created.',
    description: 'Created via Zapier',
    triggers: ['create_contact']
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

const listContacts = (z, bundle) => {

  const contact = {
    id: bundle.cleanedRequest.id,
    first_name: bundle.cleanedRequest.first_name,
    last_name: bundle.cleanedRequest.last_name,
    email: bundle.cleanedRequest.email,
  };

  return [contact];

};

const getFallbackRealContact = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  const options = {
    url: bundle.authData.baseUrl + '/civicrm/zapier/contacts',
  };

  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'create_contact',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Create Contact',
  display: {
    label: 'New Contact',
    description: 'Triggers when a new contact is added.',
  },

  // `operation` is where the business logic goes.
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    // `inputFields` can define the fields a user could provide,
    // we'll pass them in as `bundle.inputData` later.
    perform: listContacts,
    performList: getFallbackRealContact,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@domain.com',
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
      { key: 'id', label: 'Contact ID' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'email', label: 'Email Address' },
    ],
  },
};