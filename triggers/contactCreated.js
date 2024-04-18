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
  return triggerHelper.fetchFieldsForEntities(z, bundle, entities, 'Contact');
};

module.exports = {
  key: 'create_contact',
  noun: 'Create Contact',
  display: {
    label: 'New Contact',
    description: 'Triggers when a new contact is added.',
  },
  operation: {
    type: 'hook',
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
    perform: listContacts,
    performList: getFallbackRealContact,
    sample: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@domain.com',
    },
    outputFields: [getContactFields],
  },
};