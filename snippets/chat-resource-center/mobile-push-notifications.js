/* global test, describe, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe.skip('Mobile Push Notifications', () => {
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

  test('Sending push notifications via GCM/FCM', () => {
    // tag::PUSH-1[]
    // end::PUSH-1[]
  });

  test('Sending push notifications via APNS', () => {
    // tag::PUSH-2[]
    // end::PUSH-2[]
  });
});
