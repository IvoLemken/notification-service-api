const Responses = require('./common/API_Responses');
const AWS = require('aws-sdk');

const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });
const fireHose = new AWS.Firehose();

exports.handler = async event => {
    console.log('event', event);

    const body = JSON.parse(event.body);

    if (!body || !body.phoneNumber || !body.message) {
        return Responses._400({ message: 'Missing or incomplete body' });
    }

    const attributeParams = {
        attributes: {
            DefaultSMSType: 'Promotional',
        },
    };

    const messageParams = {
        Message: body.message,
        PhoneNumber: body.phoneNumber,
    };

    const loggingParams = {
        Record: {Data: Buffer.from(JSON.stringify({
            Message: body.message,
            PhoneNumber: body.phoneNumber,
            Timestamp: event.requestContext.requestTime,
            Sender: event.requestContext.identity
        }))},
        DeliveryStreamName: process.env.FIREHOSE_NAME
    };

    try {
        await SNS.setSMSAttributes(attributeParams).promise();
        await SNS.publish(messageParams).promise();
        await fireHose.putRecord(loggingParams, function (error, data) {
            if (error) {
                console.error("Could not log this message", error.stack);
            }
            else {
                console.log("Message was logged");
                console.log(data);
            }
        }).promise();
        return Responses._200({ message: 'Message sent' });
    } catch (error) {
        console.log('error', error);
        return Responses._400({ message: 'Message failed to send' });
    }
};