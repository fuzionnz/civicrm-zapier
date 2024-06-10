const Civicrm = require('../civicrm');
const civicrm = new Civicrm();

const getContactFields = async (z, bundle) => {
  return civicrm.fetchCreateFields(z, bundle, 'Contact');
};

const createContact = async (z, bundle) => {
  return civicrm.create(z, 'Contact', bundle);
};

module.exports = {
  key: 'contact',
  noun: 'Contact',

  display: {
    // What the user will see in the Zap Editor when selecting an action
    label: 'Create Contact',
    description: 'Creates a new contact.'
  },

  operation: {
   // Data users will be asked to set in the Zap Editor
    inputFields: [
      getContactFields
    ],
    perform: createContact,
    // Sample data that the user will see if they skip the test
    // step in the Zap Editor
    sample: {
      first_name: 'John',
      last_name: 'Doe',
      source: 'Zapier',
    }
  }
}
