// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var phoneNumber = require('./my-secret-phone-number.json')['phone-number'];

// Set region
AWS.config.update({region: 'eu-west-1'});

// Create promise and SNS service object
var phonenumPromise = new AWS.SNS({apiVersion: '2010-03-31'}).checkIfPhoneNumberIsOptedOut({phoneNumber: phoneNumber}).promise();

// Handle promise's fulfilled/rejected states
phonenumPromise.then(
  function(data) {
    console.log("Phone Opt Out is " + data.isOptedOut);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
