const test = (z, bundle) => {

  return z.request({
      url: bundle.authData.baseUrl + '/civicrm/zapierauth?apiKey='+ bundle.authData.api_key +'&key=' + bundle.authData.key,
    }).then((response) => {
      return response;
    });
};

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'baseUrl',
      type: 'string',
      required: true,
      helpText: 'The base URL for the API. eg https://example.com',
    },
    {
      key: 'api_key',
      type: 'string',
      required: true,
      helpText: 'API of user 1. You can use the extension https://civicrm.org/extensions/api-key to create/view API key of any user',
    },
    {
      key: 'key',
      type: 'string',
      required: true,
      helpText: 'Site Key found in civicrm.settings.php. For more information, see https://docs.civicrm.org/sysadmin/en/latest/setup/secret-keys/#civicrm_site_key',
    },
  ],

  test: test,

};



// const addApiKeyToHeader = (request, z, bundle) => {
//   request.headers['X-baseUrl'] = bundle.authData.baseUrl;
//   const basicHash = Buffer.from(`${bundle.authData.api_key}:x`).toString(
//     'base64'
//   );
//   request.headers.Authorization = `Basic ${basicHash}`;
//   return request;
// };

// const App = {
//   // ...
//   authentication: authentication,
//   // beforeRequest: [addApiKeyToHeader],
//   // ...
// };