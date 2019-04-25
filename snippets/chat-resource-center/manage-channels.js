/* global test, describe, expect, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';

const subscribeKey = process.env.SUBSCRIBE_KEY || 'demo-36';
const publishKey = process.env.PUBLISH_KEY || 'demo-36';

describe('Manage channels', () => {
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

  test('Subscribing to channels', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const pubnub = pubNubClient;

    observerPubNubClient.subscribe({
      channels: [expectedChannel],
      withPresence: true,
    });

    observerPubNubClient.addListener({
      status: (status) => {
        if (status.operation === 'PNSubscribeOperation') {
          // tag::CHAN-1[]
          pubnub.subscribe({
            // tag::ignore[]
            channels: [expectedChannel],
            /**
            // end::ignore[]
            channels: ['room-1'],
            // tag::ignore[]
             */
            // end::ignore[]
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
    const channelsToJoin = [
      PubNub.generateUUID(), PubNub.generateUUID(), PubNub.generateUUID(),
    ];
    const pubnub = pubNubClient;

    observerPubNubClient.subscribe({
      channels: channelsToJoin,
      withPresence: true,
    });

    observerPubNubClient.addListener({
      status: (status) => {
        if (status.operation === 'PNSubscribeOperation') {
          // tag::CHAN-2[]
          pubnub.subscribe({
            // tag::ignore[]
            channels: channelsToJoin,
            /**
            // end::ignore[]
            channels: ['room-1', 'room-2', 'room-3'],
            // tag::ignore[]
             */
            // end::ignore[]
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
    const expectedChannel = PubNub.generateUUID();
    const pubnub = pubNubClient;

    observerPubNubClient.subscribe({
      channels: [expectedChannel],
      withPresence: true,
    });

    observerPubNubClient.addListener({
      status: (status) => {
        if (status.operation === 'PNSubscribeOperation') {
          pubnub.subscribe({
            channels: [expectedChannel],
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
            // tag::CHAN-3[]
            pubnub.unsubscribe({
              // tag::ignore[]
              channels: [expectedChannel],
              /**
              // end::ignore[]
              channels: ['room-1'],
              // tag::ignore[]
               */
              // end::ignore[]
            });
            // end::CHAN-3[]
          }, 2000);
        }
      },
    });
  });

  test('Joining a channel group', (done) => {
    const expectedChannels = [PubNub.generateUUID(), PubNub.generateUUID()];
    const expectedGroup = PubNub.generateUUID();
    const pubnub = pubNubClient;

    observerPubNubClient.subscribe({
      channels: [expectedChannels[0]],
      withPresence: true,
    });

    observerPubNubClient.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.operation === 'PNSubscribeOperation') {
          pubnub.channelGroups.addChannels({
            channels: expectedChannels,
            channelGroup: expectedGroup,
          }, (status) => {
            expect(status.error).toBeFalsy();

            // tag::CHAN-4[]
            pubnub.subscribe({
            // tag::ignore[]
              channelGroups: [expectedGroup],
            /**
            // end::ignore[]
              channelGroups: ['family'],
            // tag::ignore[]
             */
            // end::ignore[]
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

  test('Adding channels to channel groups', (done) => {
    const expectedChannels = [PubNub.generateUUID(), PubNub.generateUUID()];
    const expectedGroup = PubNub.generateUUID();
    const pubnub = pubNubClient;

    // tag::CHAN-5[]
    pubnub.channelGroups.addChannels({
      // tag::ignore[]
      channels: expectedChannels,
      channelGroup: expectedGroup,
      /**
      // end::ignore[]
      channels: ['son', 'daughter'],
      channelGroup: 'family',
      // tag::ignore[]
       */
      // end::ignore[]
    }, (status) => {
      // tag::ignore[]
      expect(status.error).toBeFalsy();

      // end::ignore[]
      if (status.error) {
        console.log('operation failed w/ status: ', status);
      } else {
        console.log('operation done!');
      }
      // tag::ignore[]

      done();
      // end::ignore[]
    });
    // end::CHAN-5[]
  });

  test('Removing channels from channel groups', (done) => {
    const expectedChannels = [PubNub.generateUUID(), PubNub.generateUUID()];
    const expectedGroup = PubNub.generateUUID();
    const pubnub = pubNubClient;

    // tag::CHAN-6[]
    pubnub.channelGroups.removeChannels({
      // tag::ignore[]
      channels: [expectedChannels[0]],
      channelGroup: expectedGroup,
      /**
      // end::ignore[]
      channels: ['son'],
      channelGroup: 'family',
      // tag::ignore[]
       */
      // end::ignore[]
    }, (status) => {
      // tag::ignore[]
      expect(status.error).toBeFalsy();

      // end::ignore[]
      if (status.error) {
        console.log('operation failed w/ error:', status);
      } else {
        console.log('operation done!');
      }
      // tag::ignore[]

      done();
      // end::ignore[]
    });
    // end::CHAN-6[]
  });

  test('Listing channels in a channel group', (done) => {
    const expectedChannels = [PubNub.generateUUID(), PubNub.generateUUID()];
    const expectedGroup = PubNub.generateUUID();
    const pubnub = pubNubClient;

    pubnub.channelGroups.addChannels({
      channels: expectedChannels,
      channelGroup: expectedGroup,
    }, (addStatus) => {
      expect(addStatus.error).toBeFalsy();

      // tag::CHAN-7[]
      pubnub.channelGroups.listChannels({
        // tag::ignore[]
        channelGroup: expectedGroup,
        /**
        // end::ignore[]
        channelGroup: 'family',
        // tag::ignore[]
         */
        // end::ignore[]
      }, (status, response) => {
        if (status.error) {
          console.log('operation failed w/ error:', status);
          return;
        }

        // tag::ignore[]
        expect(response.channels).toContain(expectedChannels[0]);
        expect(response.channels).toContain(expectedChannels[1]);
        // end::ignore[]
        console.log('listing push channel for device');
        response.channels.forEach((channel) => {
          console.log(channel);
        });
        // tag::ignore[]

        done();
        // end::ignore[]
      });
      // end::CHAN-7[]
    });
  });

  test('Leaving a channel group', (done) => {
    const expectedChannels = [PubNub.generateUUID(), PubNub.generateUUID()];
    const expectedGroup = PubNub.generateUUID();
    const pubnub = pubNubClient;

    observerPubNubClient.subscribe({
      channels: [expectedChannels[1]],
      withPresence: true,
    });

    observerPubNubClient.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.operation === 'PNSubscribeOperation') {
          pubnub.channelGroups.addChannels({
            channels: expectedChannels,
            channelGroup: expectedGroup,
          }, (status) => {
            expect(status.error).toBeFalsy();

            pubnub.subscribe({
              channelGroups: [expectedGroup],
            });
          });
        }
      },
      presence: (presenceEvent) => {
        if (presenceEvent.uuid === pubnub.getUUID()) {
          if (presenceEvent.action === 'join') {
            // tag::CHAN-8[]
            pubnub.unsubscribe({
              // tag::ignore[]
              channelGroups: [expectedGroup],
              /**
              // end::ignore[]
              channelGroups: ['family'],
              // tag::ignore[]
               */
              // end::ignore[]
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
