const Civicrm = require('../civicrm');
const civicrm = new Civicrm();

const getEntityTagFields = async (z, bundle) => {
  return civicrm.fetchCreateFields(z, bundle, 'EntityTag');
};

const createEntityTag = async (z, bundle) => {
  const result = await civicrm.create(z, 'EntityTag', bundle);
  if (!result.success) {
      z.console.error('EntityTag creation failed:', result.error);
  }
  return result;
};

module.exports = {
  key: 'EntityTag',
  noun: 'EntityTag',

  display: {
    // What the user will see in the Zap Editor when selecting an action
    label: 'Assign Tag to Contacts, Activities, Etc',
    description: 'EntityTag - links tags to contacts, activities, etc.'
  },

  operation: {
   // Data users will be asked to set in the Zap Editor
    inputFields: [
      getEntityTagFields
    ],
    perform: createEntityTag,
    // Sample data that the user will see if they skip the test
    // step in the Zap Editor
    sample: {
      entity_id: '1',
      tag_id: '1',
      entity_table: 'civicrm_contact',
    }
  }
}
