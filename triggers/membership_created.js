const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('membership_created', 'Triggers when the membership is created');


const listMemberships = (z, bundle) => {
  return [bundle.cleanedRequest];
};

const getFallbackRealMembership = (z, bundle) => {
  return triggerHelper.getEntityData(z, bundle, 'Membership');
};

const getMembershipFields = (z, bundle) => {
  return triggerHelper.fetchFields(z, bundle, 'Membership');
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#triggerschema
  key: 'membership_created',
  noun: 'Create Membership',

  display: {
    label: 'Create Membership',
    description: 'Triggers when the membership is created.',
  },

  operation: {
    type: 'hook',
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
    perform: listMemberships,
    performList: getFallbackRealMembership,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      "id": 1,
      "contact_id": 6,
      "membership_type_id": 1,
      "join_date": "2023-10-05",
      "start_date": "2023-10-05",
      "end_date": "2025-10-04",
      "source": null,
      "status_id": 2,
      "is_override": false,
      "status_override_end_date": null,
      "owner_membership_id": null,
      "max_related": null,
      "is_test": false,
      "is_pay_later": false,
      "contribution_recur_id": null,
      "campaign_id": null
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      getMembershipFields
    ]
  }
};
