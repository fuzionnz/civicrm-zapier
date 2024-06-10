TriggerHelper = function(triggerType, hookDescription) {
  this.type = triggerType;
  this.hookDescription = hookDescription;

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
