/* global test, describe, expect, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';
import loadEnvironment from '../load-env';

loadEnvironment();

// only runs on Travis
const describeTravis = process.env.CI ? describe : describe.skip;

const subscribeKey = process.env.SUBSCRIBE_KEY || 'demo';
const publishKey = process.env.PUBLISH_KEY || 'demo';

describeTravis('Mobile Push Notifications', () => {
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

  test('Adding a device token to channels', (done) => {
    const expectedChannels = [PubNub.generateUUID(), PubNub.generateUUID()];
    let expectedDevice = PubNub.generateUUID().split('-').join('');
    expectedDevice = expectedDevice.repeat(2);
    const pubnub = pubNubClient;

    const handleChannelsAdd = (addStatus) => {
      if (addStatus.error) {
        console.log('ERROR:', addStatus);
      }

      expect(addStatus.error).toBeFalsy();

      pubnub.push.listChannels({
        device: expectedDevice, pushGateway: 'apns',
      }, (status, response) => {
        expect(response.channels.sort()).toEqual(expectedChannels.sort());

        done();
      });
    };

    // tag::PUSH-1[]
    pubnub.push.addChannels({
      // tag::ignore[]
      channels: expectedChannels,
      device: expectedDevice,
      /**
      // end::ignore[]
      channels: ['room-1', 'room-2'],
      device: 'myDevice',
      // tag::ignore[]
       */
      // end::ignore[]
      pushGateway: 'apns', // apns or gcm
    }, (status) => {
      // tag::ignore[]
      handleChannelsAdd(status);

      // end::ignore[]
      if (status.error) {
        console.log('operation failed w/ status: ', status);
      } else {
        console.log('operation done!');
      }
    });
    // end::PUSH-1[]
  });

  test('Removing a device token from channels', (done) => {
    const expectedChannels = [PubNub.generateUUID(), PubNub.generateUUID()];
    let expectedDevice = PubNub.generateUUID().split('-').join('');
    expectedDevice = expectedDevice.repeat(2);
    const pubnub = pubNubClient;

    const handleChannelsRemove = (removeStatus) => {
      if (removeStatus.error) {
        console.log('ERROR:', removeStatus);
      }

      expect(removeStatus.error).toBeFalsy();

      pubnub.push.listChannels({
        device: expectedDevice, pushGateway: 'apns',
      }, (status, response) => {
        expect(response.channels.sort()).toEqual([]);

        done();
      });
    };

    pubnub.push.addChannels({
      channels: expectedChannels, device: expectedDevice, pushGateway: 'apns',
    }, (addStatus) => {
      if (addStatus.error) {
        console.log('ERROR:', addStatus);
      }

      expect(addStatus.error).toBeFalsy();

      // tag::PUSH-2[]
      pubnub.push.removeChannels({
        // tag::ignore[]
        channels: expectedChannels,
        device: expectedDevice,
        /**
        // end::ignore[]
        channels: ['room-1', 'room-2'],
        device: 'myDevice',
        // tag::ignore[]
         */
        // end::ignore[]
        pushGateway: 'apns', // apns or gcm
      }, (status) => {
        // tag::ignore[]
        handleChannelsRemove(status);

        // end::ignore[]
        if (status.error) {
          console.log('operation failed w/ status: ', status);
        } else {
          console.log('operation done!');
        }
      });
      // end::PUSH-2[]
    });
  });

  test('Formatting your message payload for APNS and FCM', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const pubnub = pubNubClient;
    // tag::PUSH-3.1[]
    const messagePayload = {
      pn_apns: {
        aps: {
          alert: 'hi',
          badge: 2,
          sound: 'melody',
        },
        c: '3',
      },
      pn_gcm: {
        data: { summary: 'Game update 49ers touchdown' },
      },
      text: 'Hello, hoomans!',
    };

    // end::PUSH-3.1[]

    observerPubNubClient.subscribe({
      channels: [expectedChannel],
    });

    observerPubNubClient.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.category === 'PNConnectedCategory') {
          // tag::PUSH-3.2[]
          pubnub.publish({
            message: messagePayload,
            // tag::ignore[]
            channel: expectedChannel,
            /**
            // end::ignore[]
            channel: 'room-1',
            // tag::ignore[]
             */
            // end::ignore[]
          }, (status) => {
            // handle publish status.
            // tag::ignore[]

            if (status.error) {
              console.log('ERROR:', status);
            }

            expect(status.error).toBeFalsy();
            // end::ignore[]
          });
          // end::PUSH-3.2[]
        }
      },
      message: (message) => {
        expect(message.channel).toEqual(expectedChannel);
        expect(message.message).toEqual(messagePayload);

        done();
      },
    });
  });
});
