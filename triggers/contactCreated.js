const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('create_contact', 'Triggers when the contact is created');

const listContacts = (z, bundle) => {
  return [bundle.cleanedRequest];
};

const getFallbackRealContact = (z, bundle) => {
  const params = {
    'select': ['*', 'custom.*', 'address_primary.*', 'email_primary.*', 'phone_primary.*'],
  };
  return triggerHelper.getEntityData(z, bundle, 'Contact', params);
};

const getContactFields = async (z, bundle) => {
  const entities = [
    { entity: 'Address', prefix: 'address_primary.', label: ' (Primary Address)' },
    { entity: 'Email', prefix: 'email_primary.', label: ' (Primary Email)' },
    { entity: 'Phone', prefix: 'phone_primary.', label: ' (Primary Phone)' }
  ];

  const promises = entities.map(({ entity, prefix, label }) => triggerHelper.fetchFields(z, bundle, entity, prefix, label));

  const fieldLists = await Promise.all(promises);
  const mergedFields = fieldLists.reduce((accumulator, currentList) => accumulator.concat(currentList), []);
  const contactFields = await triggerHelper.fetchFields(z, bundle, 'Contact');

  return [...mergedFields, ...contactFields];
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
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
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
    outputFields: [getContactFields],
    // outputFields: [
    //   { key: 'id', label: 'Contact ID' },
    //   { key: 'first_name', label: 'First Name' },
    //   { key: 'last_name', label: 'Last Name' },
    //   { key: 'email', label: 'Email Address' },
    // ],
  },
};