/* global test, describe, expect, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';
import https from 'https';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe('Connect to PubNub', () => {
  let pubNubClient = null;

  beforeEach(() => {
    const uuid = PubNub.generateUUID();
    pubNubClient = new PubNub({ uuid, subscribeKey, publishKey });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

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
      subscribeKey,
      publishKey,
    });
    // end::CON-2[]

    expect(pubnub).toBeDefined();
    expect(pubnub.getUUID()).toBeDefined();
  });

  test('Setting a UUID for each user', () => {
    // tag::CON-3[]
    const uuid = PubNub.generateUUID();

    const pubnub = new PubNub({
      subscribeKey,
      publishKey,
      uuid,
    });
    // end::CON-3[]

    expect(uuid).toBeDefined();
    expect(pubnub).toBeDefined();
    expect(pubnub.getUUID()).toEqual(uuid);
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
        // handle state setting response
        // tag::ignore[]
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
    const uuid = PubNub.generateUUID();
    const observerClient = new PubNub({ uuid, subscribeKey, publishKey });
    const pubnub = pubNubClient;

    observerClient.subscribe({
      channels: ['room-1'],
      withPresence: true,
    });

    observerClient.addListener({
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
          // tag::CON-6[]
          pubnub.unsubscribeAll();
          // end::CON-6[]
        }
      },
    });
  });

  test('Reconnecting Manually', () => {
    const pubnub = pubNubClient;

    // tag::CON-7[]
    pubnub.reconnect();
    // end::CON-7[]
  });
});
