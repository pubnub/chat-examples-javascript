/* global test, describe, expect, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe('Manage channels', () => {
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

  test('Subscribing to channels', (done) => {
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
          // tag::CHAN-1[]
          pubnub.subscribe({
            channels: ['room-1'],
          });
          // end::CHAN-1[]
        }
      },
      presence: (presenceEvent) => {
        if (presenceEvent.action === 'join'
          && presenceEvent.uuid === pubnub.getUUID()) {
          done();
        }
      },
    });
  });

  test('Joining multiple channels', (done) => {
    const uuid = PubNub.generateUUID();
    const observerClient = new PubNub({ uuid, subscribeKey, publishKey });
    const channelsToJoin = ['room-1', 'room-2', 'room-3'];
    const pubnub = pubNubClient;

    observerClient.subscribe({
      channels: ['room-1', 'room-2', 'room-3'],
      withPresence: true,
    });

    observerClient.addListener({
      status: (status) => {
        if (status.operation === 'PNSubscribeOperation') {
          // tag::CHAN-2[]
          pubnub.subscribe({
            channels: ['room-1', 'room-2', 'room-3'],
          });
          // end::CHAN-2[]
        }
      },
      presence: (presenceEvent) => {
        if (presenceEvent.action === 'join'
          && presenceEvent.uuid === pubnub.getUUID()) {
          const channelIdx = channelsToJoin.indexOf(presenceEvent.channel);

          if (channelIdx >= 0) {
            channelsToJoin.splice(channelIdx, 1);
          }

          if (channelsToJoin.length === 0) {
            done();
          }
        }
      },
    });
  });

  test('Leaving a channel', (done) => {
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
          // tag::CHAN-3[]
          pubnub.unsubscribe({
            channels: ['room-1'],
          });
          // end::CHAN-3[]
        }
      },
    });
  });

  test('Joining a channel group', (done) => {
    const uuid = PubNub.generateUUID();
    const observerClient = new PubNub({ uuid, subscribeKey, publishKey });
    const pubnub = pubNubClient;

    observerClient.subscribe({
      channels: ['daughter'],
      withPresence: true,
    });

    observerClient.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.operation === 'PNSubscribeOperation') {
          pubnub.channelGroups.addChannels({
            channels: ['son', 'daughter'],
            channelGroup: 'family',
          },
          (status) => {
            expect(status.error).toBeFalsy();
            // tag::CHAN-4[]
            pubnub.subscribe({
              channelGroups: ['family'],
            });
            // end::CHAN-4[]
          });
        }
      },
      presence: (presenceEvent) => {
        if (presenceEvent.action === 'join'
          && presenceEvent.uuid === pubnub.getUUID()) {
          done();
        }
      },
    });
  });

  test('Adding channels to channel groups', () => {
    const pubnub = pubNubClient;

    // tag::CHAN-5[]
    pubnub.channelGroups.addChannels({
      channels: ['son', 'daughter'],
      channelGroup: 'family',
    },
    (status) => {
      // tag::ignore[]
      expect(status.error).toBeFalsy();
      // end::ignore[]
      if (status.error) {
        console.log('operation failed w/ status: ', status);
      } else {
        console.log('operation done!');
      }
    });
    // end::CHAN-5[]
  });

  test('Removing channels from channel groups', () => {
    const pubnub = pubNubClient;

    // tag::CHAN-6[]
    // assuming an initialized PubNub instance already exists
    pubnub.channelGroups.removeChannels({
      channels: ['son'],
      channelGroup: 'family',
    },
    (status) => {
      // tag::ignore[]
      expect(status.error).toBeFalsy();
      // end::ignore[]
      if (status.error) {
        console.log('operation failed w/ error:', status);
      } else {
        console.log('operation done!');
      }
    });
    // end::CHAN-6[]
  });

  test('Listing channels in a channel group', () => {
    const pubnub = pubNubClient;

    pubnub.channelGroups.addChannels({
      channels: ['son', 'daughter'],
      channelGroup: 'family',
    },
    (addSstatus) => {
      expect(addSstatus.error).toBeFalsy();

      // tag::CHAN-7[]
      // assuming an initialized PubNub instance already exists
      pubnub.channelGroups.listChannels({
        channelGroup: 'family',
      }, (status, response) => {
        if (status.error) {
          console.log('operation failed w/ error:', status);
          return;
        }

        // tag::ignore[]
        expect(response.channels).toContain('son');
        expect(response.channels).toContain('daughter');
        // end::ignore[]
        console.log('listing push channel for device');
        response.channels.forEach((channel) => {
          console.log(channel);
        });
      });
      // end::CHAN-7[]
    });
  });

  test('Leaving a channel group', (done) => {
    const uuid = PubNub.generateUUID();
    const observerClient = new PubNub({ uuid, subscribeKey, publishKey });
    const pubnub = pubNubClient;

    observerClient.subscribe({
      channels: ['daughter'],
      withPresence: true,
    });

    observerClient.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.operation === 'PNSubscribeOperation') {
          pubnub.channelGroups.addChannels({
            channels: ['son', 'daughter'],
            channelGroup: 'family',
          },
          (status) => {
            expect(status.error).toBeFalsy();
            pubnub.subscribe({
              channelGroups: ['family'],
            });
          });
        }
      },
      presence: (presenceEvent) => {
        if (presenceEvent.uuid === pubnub.getUUID()) {
          if (presenceEvent.action === 'join') {
            // tag::CHAN-8[]
            // assuming an initialized PubNub instance already exists
            pubnub.unsubscribe({
              channelGroups: ['family'],
            });
            // end::CHAN-8[]
          } else if (presenceEvent.action === 'leave') {
            done();
          }
        }
      },
    });
  });
});
