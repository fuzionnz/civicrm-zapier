const Civicrm = require('../civicrm');
const civicrm = new Civicrm();

const getEmailFields = async (z, bundle) => {
  return civicrm.fetchCreateFields(z, bundle, 'Email');
};

const createEmail = async (z, bundle) => {
  // Avoid create if email already exists on this contact.
  const params = {
    select: ['id'],
    where: [
      ['contact_id', '=', bundle.inputData.contact_id],
      ['location_type_id', '=', bundle.inputData.location_type_id],
      ['email', '=', bundle.inputData.email]
    ],
  };

  try {
    // Fetch existing email
    const existingEmailResponse = await civicrm.getEntityData(z, bundle, 'Email', params);

    // Check if the response has the expected structure
    if (existingEmailResponse && existingEmailResponse.length > 0) {
      const existingEmails = existingEmailResponse;

      if (existingEmails.length > 0) {
        // Email already exists
        // Todo: Make an update call instead of error.
        throw new Error('Email already exists for this contact with the same location type and email address.');
      }
    }

    // Create new email if no existing email is found
    const createResponse = await civicrm.create(z, 'Email', bundle);

    return createResponse;
  } catch (error) {
    z.console.error("Error creating email:", error);
    throw error;
  }
};


module.exports = {
  key: 'email',
  noun: 'Email',

  display: {
    // What the user will see in the Zap Editor when selecting an action
    label: 'Create or Update Email',
    description: 'Add a new email on a contact or update an existing one based on the provided ID.'
  },

  operation: {
   // Data users will be asked to set in the Zap Editor
    inputFields: [
      getEmailFields
    ],
    perform: createEmail,
    // Sample data that the user will see if they skip the test
    // step in the Zap Editor
    sample: {
      contact_id: 1,
      location_type_id: 1,
      email: 'john.doe@example.com',
      is_primary: true,
    }
  }
}
