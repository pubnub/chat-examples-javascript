
# Animal Forest Chat React Application

[![Build Status](https://travis-ci.com/pubnub/chat-examples-javascript.svg?token=ey6rVJnpqsBKpxXy2fYF&branch=master)](https://travis-ci.com/pubnub/chat-examples-javascript)

Source files for React based chat example apps live here.

## Requirements

* [Node.js](https://nodejs.org/en/)
* [Gulp](https://gulpjs.com) - required to install project dependencies.

## Prerequisites

### Sign Up for a PubNub Account

If you don't already have an account, you can create one for free [here](https://dashboard.pubnub.com/).

* Login to your PubNub Account
* Select Your Project > Your Key. Click on Key Info and copy your `Publish Key` and `Subscribe Key`
* Enable the following add-on features on your key: Presence, Storage & Playback, Stream Controller

## Building the project

1. Navigate to the react project directory
```bash
cd examples/react/
npm install
```

1. Create a file in the config folder to hold your PubNub Account keys

```bash
vi src/config/keys.js
```

The file should look as below.

```js
var publishKey = 'YOUR_PUBLISH_KEY';
var subscribeKey = 'YOUR_SUBSCRIBE_KEY';

export { publishKey, subscribeKey }
```

1. Run the app in development mode.

```bash
$ npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## Further Information

For more information about this project, or how to create your own chat app using PubNub, please check out our [tutorial](https://www.pubnub.com/developers/chat-resource-center/docs/getting-started/javascript/).
