/* global test, describe, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe.skip('Encryption', () => {
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

  test('Enabling SSL/TLS encryption', () => {
    // tag::ENCR-1[]
    // end::ENCR-1[]
  });

  test('Encrypting message payloads (using AES-256)', () => {
    // tag::ENCR-2[]
    // end::ENCR-2[]
  });
});
