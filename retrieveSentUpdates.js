const Responses = require('./common/API_Responses');
const AWS = require('aws-sdk');
const AthenaExpress = require("athena-express");

const athena = new AthenaExpress({ aws: AWS });

exports.handler = async event => {
    console.log('event', event);

    const body = JSON.parse(event.body);

    if (!body || !body.phoneNumber) {
        return Responses._400({ message: 'Missing or incomplete body' });
    }

    const query = `SELECT phonenumber, message, timestamp FROM "sms_log_db"."sms_table" WHERE "phonenumber" = '${body.phoneNumber}';`;

    try {
        results = await athena.query(query);
        console.log(results)

        return Responses._200({ 
            message: 'Query succesful',
            results: results.Items
        });
    } catch (error) {
        console.log('error', error);
        return Responses._400({ message: 'Query failed' });
    }
};