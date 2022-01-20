// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var phoneNumber = require('../secrets/phone.json')['phone-number'];

// Set region
AWS.config.update({region: 'eu-west-1'});

// Create publish parameters
var params = {
  Message: 'This is a test text message', /* required */
  PhoneNumber: phoneNumber,
};

// Create promise and SNS service object
var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

// Handle promise's fulfilled/rejected states
publishTextPromise.then(
  function(data) {
    console.log("MessageID is " + data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
