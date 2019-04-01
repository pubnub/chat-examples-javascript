/* global test, describe, expect, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';

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
  });

  test('Setting a unique ID for each user', () => {
    // tag::CON-1[]
    const uuid = PubNub.generateUUID();

    const pubnub = new PubNub({
      subscribeKey,
      publishKey,
      uuid,
    });
    // end::CON-1[]

    expect(uuid).toBeDefined();
    expect(pubnub).toBeDefined();
    expect(pubnub.getUUID()).toEqual(uuid);
  });

  test.skip('Connecting with a user', () => {
    // tag::CON-2[]
    /**
     * There is actually no thing like 'Connect to PubNub'.
     *
     * Connection in ChatEngine was a set of actions:
     *   - grant access
     *   - add channels to groups
     *   - subscribe on channel groups.
     *
     * Should we explain all this here, or remove this case,
     * since we have 'Manage Channels' where explained how to
     * subscribe / unsubscribe?
     */
    // end::CON-2[]
  });

  test('Set metadata for a user', (done) => {
    const pubnub = pubNubClient;
    const expectedState = { mood: 'grumpy' };

    // tag::CON-3[]
    /**
     * There is no thing like 'Meta' for particular user or
     * channel. Should we rename this test case to
     * 'Set state for a user' or it is expected to get some new
     * API?
     */
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
      done();
      // end::ignore[]
    });
    // end::CON-3[]
  });

  test('Disconnecting from PubNub', () => {
    const pubnub = pubNubClient;

    // tag::CON-4[]
    /**
     * There is actually no thing like 'Disconnect from PubNub'.
     *
     * Should we remove this case, since we have 'Manage Channels'
     * where explained how to subscribe / unsubscribe?
     * Or is it unsubscribe from all?
     */
    pubnub.unsubscribeAll();
    // end::CON-4[]
  });

  test('Reconnecting to PubNub', (done) => {
    const pubnub = pubNubClient;
    const expectedChannels = ['room-1'];

    // tag::CON-5[]
    /**
     * There is actually no thing like 'Reconnect from PubNub'.
     *
     * Should it be shown as sequence of unsubscribe -> subscribe
     * calls here or we better to move it to 'Manage Channels' as
     * new use case?
     */
    pubnub.subscribe({
      channels: ['room-1'],
    });

    // tag::ignore[]
    pubnub.addListener({
      status: (status) => {
        expect(status.affectedChannels).toEqual(expectedChannels);

        if (status.operation === 'PNSubscribeOperation') {
          // end::ignore[]
          pubnub.unsubscribe({
            channels: ['room-1'],
          });
          // tag::ignore[]
        } else if (status.operation === 'PNUnsubscribeOperation') {
          done();
        }
      },
    });
    // end::ignore[]
    // end::CON-5[]
  });
});
