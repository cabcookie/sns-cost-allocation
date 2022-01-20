// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var topicArn = require('../secrets/topic-arn.json').topic;

// Set region
AWS.config.update({region: 'eu-west-1'});

// Create publish parameters
var params = {
  Message: 'This is a test message to a topic',
  TopicArn: topicArn,
};

// Create promise and SNS service object
var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

// Handle promise's fulfilled/rejected states
publishTextPromise.then(
  function(data) {
    console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
    console.log("MessageID is " + data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
