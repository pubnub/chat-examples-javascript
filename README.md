# PubNub Javascript Chat

[![Build Status](https://travis-ci.com/pubnub/chat-examples-javascript.svg?token=ey6rVJnpqsBKpxXy2fYF&branch=master)](https://travis-ci.com/pubnub/chat-examples-javascript)

Source files for JavaScript based chat example apps and document code 
samples live here.

## Repository structure

| Directory  | Description |
|:----------:| ----------- |
| `examples` | Location where gathered applications which explain how to solve tasks related to _chat_ using PubNub SDK. |
| `examples > react` | Location where the animal chat application is stored. The complete tutorial can be found [here](https://www.pubnub.com/developers/chat-resource-center/docs/getting-started/javascript/)|
| `snippets` | Location where verified and tested code snippets are stored.<br>Snippets from `chat-resource-center` can be found inside of [Chat Resource Center](https://pubnub.github.io/chat-resource-center/). |


# Animal Forest Chat Application

## Requirements

* [Node.js](https://nodejs.org/en/)
* [Gulp](https://gulpjs.com) - required to install project dependencies.

## Prerequisites

### Sign Up for a PubNub Account

If you don't already have an account, you can create one for free [here](https://dashboard.pubnub.com/).

* Login to your PubNub Account
* Select Your Project > Your Key. Click on Key Info and copy your `Publish Key` and `Subscribe Key`
* Enable the following add-on features on your key: Presence, Storage & Playback, Stream Controller

### Using your PubNub keys

Add your PubNub keys to the keys file in the config folder.
```bash
cd examples/react/
vi src/config/keys.js
```
The file should look as below:
```js
var publishKey = 'YOUR_PUBLISH_KEY';
var subscribeKey = 'YOUR_SUBSCRIBE_KEY';

export { publishKey, subscribeKey }
```

## Building the project

1. Navigate to the react project directory
```bash
cd examples/react/
npm install
```

2. Run the app in development mode.
```bash
$ npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Further Information

For more information about this project, or how to create your own chat app using PubNub, please check out our [tutorial](https://www.pubnub.com/developers/chat-resource-center/docs/getting-started/javascript/).
