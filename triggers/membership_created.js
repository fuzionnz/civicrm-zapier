const Civicrm = require('../civicrm');
const civicrm = new Civicrm();

const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('membership_created', 'Triggers when the membership is created');

const listMemberships = (z, bundle) => {
  return [bundle.cleanedRequest];
};

const getFallbackRealMembership = (z, bundle) => {
  return civicrm.getEntityData(z, bundle, 'Membership');
};

const getMembershipFields = (z, bundle) => {
  const entities = [
    { entity: 'Contact', prefix: 'contact_id.', label: ' (Membership Contact)' },
  ];
  return civicrm.fetchFieldsForEntities(z, bundle, entities, 'Membership');
};

module.exports = {
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

    outputFields: [getMembershipFields]
  }
};
