Civicrm = function() {

  this.getEntityData = (z, bundle, entity, customParams = {}) => {
    const defaultParams = {
      limit: 1
    };

    const params = Object.assign({}, defaultParams, customParams);
    const baseUrl = bundle.authData.baseUrl.replace(/\/+$/, '');

    const formEncodedParams = `params=${encodeURIComponent(JSON.stringify(params))}`;

    const options = {
      url: `${baseUrl}/civicrm/ajax/api4/${entity}/get`,
      method: 'POST',
      body: formEncodedParams,
      headers: {
        'X-Civi-Auth': 'Bearer ' + bundle.authData.api_key,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    return z.request(options).then(response => {
      if (response.json && response.json.values) {
        const { count, countFetched, values } = response.json;
        // Check if the count returned is greater than the limit
        if (count > params.limit || countFetched > params.limit) {
          throw new Error(`API returned more results than expected. Count: ${count}, Count Fetched: ${countFetched}`);
        }
        return values;
      }
      else {
        throw new Error(`Unexpected response format: ${JSON.stringify(response.json)}`);
      }
    });
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

  this.create = (z, entity, bundle) => {
    inputData = bundle.inputData
    if (!inputData || Object.keys(inputData).length === 0) {
      throw new Error('Error: No fields have been mapped. Please ensure you have selected values for at least one field(s).');
    }

    const baseUrl = bundle.authData.baseUrl.replace(/\/+$/, '')
    const action = 'create'


    const url = `${baseUrl}/civicrm/ajax/api4/${entity}/${action}`
    const params = {
      values: inputData
    };
    const apiparams = `params=${encodeURIComponent(JSON.stringify(params))}&index=0`

    const responsePromise = z.request({
      method: 'POST',
      headers: {
        'X-Civi-Auth': 'Bearer ' + bundle.authData.api_key,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      url: url,
      body: apiparams
    });

    return responsePromise.then(response => JSON.parse(response.content));
  };

  this.fetchCreateFields = (z, bundle, entity) => {
    const baseUrl = bundle.authData.baseUrl.replace(/\/+$/, '')
    const field_url = `${baseUrl}/civicrm/ajax/api4/${entity}/getFields`;
    const params = {
      action: 'create',
      select: ['required', 'label', 'name', 'description']
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
    }).then(response => response.json.values.map(value => ({
      key: value.name,
      label: value.label,
      required: value.required,
      helpText: value.description,
    })));
  };

};

module.exports = Civicrm;
