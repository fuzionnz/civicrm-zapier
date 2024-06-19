const Civicrm = require('../civicrm');
const civicrm = new Civicrm();

const getGroupContactFields = async (z, bundle) => {
  return civicrm.fetchCreateFields(z, bundle, 'GroupContact');
};

const createGroupContact = async (z, bundle) => {
  const result = await civicrm.create(z, 'GroupContact', bundle);
  if (!result.success) {
    z.console.error('GroupContact creation failed:', result.error);
  }
  return result;
};

module.exports = {
  key: 'GroupContact',
  noun: 'GroupContact',

  display: {
    // What the user will see in the Zap Editor when selecting an action
    label: 'Add Contact to Group',
    description: 'A contact can either be "Added" "Removed" or "Pending" in a group. CiviCRM only considers them to be "in" a group if their status is "Added".'
  },

  operation: {
   // Data users will be asked to set in the Zap Editor
    inputFields: [
      getGroupContactFields
    ],
    perform: createGroupContact,
    // Sample data that the user will see if they skip the test
    // step in the Zap Editor
    sample: {
      group_id: '1',
      contact_id: '1',
      status: 'Added',
    }
  }
}
