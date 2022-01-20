// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set region
AWS.config.update({region: 'eu-west-1'});

// Create SMS Attribute parameters
var params = {
  attributes: { /* required */
    'DefaultSMSType': 'Transactional', /* highest reliability */
    //'DefaultSMSType': 'Promotional', /* lowest cost */
    'DefaultSenderID': 'CABCOOKIE',
  }
};

// Create promise and SNS service object
var setSMSTypePromise = new AWS.SNS({apiVersion: '2010-03-31'}).setSMSAttributes(params).promise();

// Handle promise's fulfilled/rejected states
setSMSTypePromise.then(
  function(data) {
    console.log(data);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
