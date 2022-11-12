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
      helpText: 'Website Base URL.',
    },
    {
      key: 'api_key',
      type: 'string',
      required: true,
      helpText: 'API Key of user 1.',
    },
    {
      key: 'key',
      type: 'string',
      required: true,
      helpText: 'Site Key found in civicrm.settings.php.',
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