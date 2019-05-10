/* global test, describe, expect, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';

const subscribeKey = process.env.SUBSCRIBE_KEY || 'demo';
const publishKey = process.env.PUBLISH_KEY || 'demo';

describe.skip('Encryption', () => {
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
  });

  test('Enabling SSL/TLS encryption', () => {
    const myUUID = PubNub.generateUUID();

    // tag::ENCR-1[]
    const pubnub = new PubNub({
      subscribeKey: 'mySubscribeKey',
      publishKey: 'myPublishKey',
      uuid: myUUID,
      ssl: true,
    });
    // end::ENCR-1[]

    expect(pubnub).toBeDefined();
    expect(pubnub.getUUID()).toEqual(myUUID);
  });

  test('Encrypting message payloads (using AES-256)', () => {
    // tag::ENCR-2[]
    const pubnub = new PubNub({
      subscribeKey: 'mySubscribeKey',
      publishKey: 'myPublishKey',
      cipherKey: 'myCipherKey',
    });
    // end::ENCR-2[]

    expect(pubnub).toBeDefined();
  });
});
