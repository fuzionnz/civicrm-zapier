TriggerHelper = function(triggerType, hookDescription) {
  this.type = triggerType;
  this.hookDescription = hookDescription;

  this.getEntityData = (z, bundle, entity, customParams = {}) => {
    const defaultParams = {
      limit: 1
    };

    const params = Object.assign({}, defaultParams, customParams);

    const options = {
      url: bundle.authData.baseUrl + '/civicrm/ajax/api4/' + entity + '/get',
      method: 'GET',
      body: {
        params: JSON.stringify(params)
      },
      headers: {
        'X-Civi-Auth': 'Bearer ' + bundle.authData.api_key
      }
    };

    return z.request(options).then(response => response.json.values);
  };

  this.fetchFields = (z, bundle, entity, key_prefix = '', val_suffix = '') => {
    const field_url = bundle.authData.baseUrl + '/civicrm/ajax/api4/' + entity + '/getFields';
    const params = {
      select: ['title', 'label', 'name']
    };

    return z.request({
      method: 'GET',
      url: field_url,
      headers: {
        'X-Civi-Auth': 'Bearer ' + bundle.authData.api_key
      },
      body: {
        params: JSON.stringify(params)
      }
    }).then(response => response.json.values.map(value => ({ key: key_prefix + value.name, label: value.title + val_suffix })));
  };

  this.fetchFieldsForEntities = async (z, bundle, entities, entityName) => {
    const promises = entities.map(({ entity, prefix, label }) => this.fetchFields(z, bundle, entity, prefix, label));
    const fieldLists = await Promise.all(promises);
    const mergedFields = fieldLists.reduce((accumulator, currentList) => accumulator.concat(currentList), []);
    const entityFields = await this.fetchFields(z, bundle, entityName);
    return [...mergedFields, ...entityFields];
  };

  this.unsubscribeHook = (z, bundle) => {
    // bundle.subscribeData contains the parsed response JSON from the subscribe
    // request made initially.
    const hookId = bundle.subscribeData.hook.id;

    // You can build requests and our client will helpfully inject all the variables
    // you need to complete. You can also register middleware to control this.
    const options = {
      url: bundle.authData.baseUrl + '/civicrm/zaphooks/new?hook=' + hookId + '&delete=1',
      method: 'DELETE',
    };

    // You may return a promise or a normal data structure from any perform method.
    return z.request(options)
      .then((response) => JSON.parse(response.content));
  };

  this.subscribeHook = (z, bundle) => {

    // bundle.targetUrl has the Hook URL this app should call when a recipe is created.
    const data = {
      webhookUrl: bundle.targetUrl,
      name: this.hookDescription,
      description: 'Created via Zapier',
      triggers: [this.type]
    };

    // You can build requests and our client will helpfully inject all the variables
    // you need to complete. You can also register middleware to control this.
    const options = {
      url: bundle.authData.baseUrl + '/civicrm/zaphooks/new?body=' + encodeURIComponent(JSON.stringify(data)),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // You may return a promise or a normal data structure from any perform method.
    return z.request(options).then(response => response.json);
  };

};

module.exports = TriggerHelper;
