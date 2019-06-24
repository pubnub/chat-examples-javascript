/* global test, describe, expect, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';
import https from 'https';
import loadEnvironment from '../load-env';

loadEnvironment();

const subscribeKey = process.env.SUBSCRIBE_KEY || 'demo';
const publishKey = process.env.PUBLISH_KEY || 'demo';

describe('Connect to PubNub', () => {
  let observerPubNubClient = null;
  let pubNubClient = null;

  beforeEach(() => {
    let uuid = PubNub.generateUUID();
    pubNubClient = new PubNub({ uuid, subscribeKey, publishKey });

    uuid = PubNub.generateUUID();
    observerPubNubClient = new PubNub({ uuid, subscribeKey, publishKey });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    observerPubNubClient.removeAllListeners();
    observerPubNubClient.unsubscribeAll();
    pubNubClient.removeAllListeners();
    pubNubClient.unsubscribeAll();
    pubNubClient.stop();
  });

  test('Setup', (done) => {
    /**
    // tag::CON-1[]
    <script src="https://cdn.pubnub.com/sdk/javascript/pubnub.4.23.0.js"></script>
    // end::CON-1[]
    */
    https.get('https://cdn.pubnub.com/sdk/javascript/pubnub.4.23.0.js', (response) => {
      expect(response.statusCode)
        .toEqual(200);
      expect(parseInt(response.headers['content-length'], 10))
        .toBeGreaterThan(0);
      done();
    });
  });

  test('Initializing PubNub', () => {
    // tag::CON-2[]
    const pubnub = new PubNub({
      subscribeKey: 'mySubscribeKey',
      publishKey: 'myPublishKey',
    });
    // end::CON-2[]

    expect(pubnub).toBeDefined();
    expect(pubnub.getUUID()).toBeDefined();
  });

  test('Setting a UUID for each user', () => {
    const myUUID = PubNub.generateUUID();

    // tag::CON-3[]
    const pubnub = new PubNub({
      subscribeKey: 'mySubscribeKey',
      publishKey: 'myPublishKey',
      uuid: myUUID,
    });
    // end::CON-3[]

    expect(myUUID).toBeDefined();
    expect(pubnub).toBeDefined();
    expect(pubnub.getUUID()).toEqual(myUUID);
  });

  test('Setting state for a user', (done) => {
    const pubnub = pubNubClient;
    const expectedState = { mood: 'grumpy' };

    // tag::CON-4[]
    pubnub.setState({
      state: {
        mood: 'grumpy',
      },
      channels: ['room-1'],
    }, (status, response) => {
      // handle state setting response
      // tag::ignore[]

      if (status.error) {
        console.log('ERROR:', status);
      }

      expect(status).toBeDefined();
      expect(status.error).toBeFalsy();
      expect(response.state).toEqual(expectedState);
      // end::ignore[]
    });
    // end::CON-4[]

    setTimeout(() => {
      // tag::CON-5[]
      pubnub.getState({
        channels: ['room-1'],
      }, (status, response) => {
        // handle state getting response
        // tag::ignore[]

        if (status.error) {
          console.log('ERROR:', status);
        }

        expect(status).toBeDefined();
        expect(status.error).toBeFalsy();
        expect(response.channels['room-1'].mood).toEqual(expectedState.mood);
        done();
        // end::ignore[]
      });
      // end::CON-5[]
    }, 2000);
  });

  test('Disconnecting from PubNub', (done) => {
    const pubnub = pubNubClient;

    observerPubNubClient.subscribe({
      channels: ['room-1'],
      withPresence: true,
    });

    observerPubNubClient.addListener({
      status: (status) => {
        if (status.operation === 'PNSubscribeOperation') {
          pubnub.subscribe({
            channels: ['room-1'],
          });
        }
      },
      presence: (presenceEvent) => {
        if (presenceEvent.action === 'leave'
          && presenceEvent.uuid === pubnub.getUUID()) {
          done();
        }
      },
    });

    pubnub.addListener({
      status: (status) => {
        if (status.operation === 'PNSubscribeOperation') {
          setTimeout(() => {
            // tag::CON-6[]
            pubnub.unsubscribeAll();
            // end::CON-6[]
          }, 2000);
        }
      },
    });
  });

  test('Reconnecting to PubNub', () => {
    // tag::CON-7.1[]
    const pubnub = new PubNub({
      subscribeKey: 'mySubscribeKey',
      publishKey: 'myPublishKey',
      // enable for non-browser environment automatic reconnection
      autoNetworkDetection: true,
      // enable catchup on missed messages
      restore: true,
    });
    // end::CON-7.1[]

    // tag::CON-7.2[]
    /**
     * If connection availability check will be done in other way,
     * then use this  function to reconnect to PubNub.
     */
    pubnub.reconnect();
    // end::CON-7.2[]

    expect(pubnub).toBeDefined();
  });
});
