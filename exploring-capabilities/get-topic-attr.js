// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var topicArn = require('../secrets/topic-arn.json').topic;

// Set region
AWS.config.update({region: 'eu-west-1'});


// Create promise and SNS service object
var getTopicAttribsPromise = new AWS.SNS({apiVersion: '2010-03-31'}).getTopicAttributes({TopicArn: topicArn}).promise();

// Handle promise's fulfilled/rejected states
getTopicAttribsPromise.then(
  function(data) {
    console.log(data);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
