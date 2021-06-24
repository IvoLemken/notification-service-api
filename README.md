<!--
title: 'AWS Simple SMS function'
description: 'This is my take on a system to send sms updates to customers and log the messages that were sent.'
layout: Doc
framework: v2
platform: AWS
language: nodeJS
authorLink: 'https://github.com/IvoLemken'
authorName: 'Ivo Lemken'
-->

## Introduction

This is my take on a system to send sms updates to customers and log the messages that were sent. After setting your own unique bucket name and sourceIp (access to the APIs is restricted to the IPs in the list) in the serverless.yml file, the code can be deployed with the Serverless Framework, using the command below.

```
$ serverless deploy
```

After succesful deployment, you will get an output showing the basicApiKey and the newly created endpoints. 

## Invocation

Deploying the script will create two endpoints:

The send-update endpoint allows you to send an sms update using the following format:

```
{
    "phoneNumber": "+31612345678",
    "message": "Look at this amazing update."
}
```

You can get all messages (in JSON format) sent to a phoneNumber using the retrieve-sent-updates endpoint:

```
{
    "phoneNumber": "+31612345679"
}
```

## Possible improvements
- Data encryption in storage and communication
- More restrictive IAM roles per function
- Partitioning in the athena database for faster & cheaper data retrieval with large data collections