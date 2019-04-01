/* global test, describe, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe.skip('Manage channels', () => {
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

  test('Subscribing to channels', () => {
    // tag::CHAN-1[]
    // end::CHAN-1[]
  });

  test('Unsubscribing from channels', () => {
    // tag::CHAN-2[]
    // end::CHAN-2[]
  });

  test('Managing channel groups', () => {
    // tag::CHAN-3[]
    // end::CHAN-3[]
  });
});
