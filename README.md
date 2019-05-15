# PubNub JavaScript Chat

[![Build Status](https://travis-ci.com/pubnub/chat-examples-javascript.svg?token=ey6rVJnpqsBKpxXy2fYF&branch=master)](https://travis-ci.com/pubnub/chat-examples-javascript)

This repository contains sample code from the [Chat Resource Center](https://www.pubnub.com/developers/chat-resource-center/).

## Repository structure

| Directory  | Description |
|:----------:| ----------- |
| `examples` | Sample applications which show how to implement chat functionality using the PubNub SDK. |
| `examples > react` | Source files for the Animal Forest Chat application. The complete tutorial can be found [here](https://www.pubnub.com/developers/chat-resource-center/docs/getting-started/react/).|
| `snippets` | Verified and tested code snippets used in documentation.<br>Snippets from `chat-resource-center/` are used in the [Chat Resource Center](https://www.pubnub.com/developers/chat-resource-center/). |


# Animal Forest Chat Application

## Requirements

* [Node.js](https://nodejs.org/en/)
* [Gulp](https://gulpjs.com) - required to install project dependencies.

## Prerequisites

### Sign Up for a PubNub Account

If you don't already have an account, you can create one for free [here](https://dashboard.pubnub.com/).

1. Sign in to your PubNub [Admin Dashboard](https://dashboard.pubnub.com/), click Create New App, and give your app a name.

1. Select your new app, then click its keyset. Copy the Publish and Subscribe keys. You'll need these keys to include in this project.

1. Scroll down on the Key Options page and enable the following add-on features: [Presence](https://www.pubnub.com/products/presence/), [Storage & Playback](https://www.pubnub.com/products/realtime-messaging/), and [Stream Controller](https://www.pubnub.com/products/realtime-messaging/).

1. Click Save Changes, and you're done!

### Using your PubNub keys

Add your PubNub keys to the keys file in the config folder:

```bash
cd examples/react/
vi src/config/keys.js
```

The file should look like the following:

```js
var publishKey = 'YOUR_PUBLISH_KEY';
var subscribeKey = 'YOUR_SUBSCRIBE_KEY';

export { publishKey, subscribeKey }
```

## Building the project

1. Navigate to the react project directory:

```bash
cd examples/react/
npm install
```

2. Run the app in development mode:

```bash
$ npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Further Information

For more information about this project, or how to create your own chat app using PubNub, please check out the [React tutorial](https://www.pubnub.com/developers/chat-resource-center/docs/getting-started/react/) in the [Chat Resource Center](https://www.pubnub.com/developers/chat-resource-center/).

