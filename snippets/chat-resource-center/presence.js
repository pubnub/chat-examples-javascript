/* global test, describe, expect, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe('Presence', () => {
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

  test('Receiving presence events', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const pubnub = pubNubClient;

    // tag::PRE-1[]
    pubnub.subscribe({
      // tag::ignore[]
      channels: [expectedChannel],
      /**
      // end::ignore[]
      channels: ['room-1'],
      // tag::ignore[]
       */
      // end::ignore[]
      withPresence: true,
    });
    // end::PRE-1[]

    pubnub.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.category === 'PNConnectedCategory') {
          observerPubNubClient.subscribe({
            channels: [expectedChannel],
          });
        }
      },
      presence: (presenceEvent) => {
        if (presenceEvent.action === 'join'
          && presenceEvent.uuid === observerPubNubClient.getUUID()) {
          done();
        }
      },
    });
  });

  test('Requesting on-demand presence status', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const pubnub = pubNubClient;

    observerPubNubClient.subscribe({
      channels: [expectedChannel],
    });

    observerPubNubClient.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.category === 'PNConnectedCategory') {
          // tag::PRE-2[]
          pubnub.hereNow({
            // tag::ignore[]
            channels: [expectedChannel],
            /**
            // end::ignore[]
            channels: ['room-1'],
            // tag::ignore[]
             */
            // end::ignore[]
            includeUUIDs: true,
            includeState: true,
          }, (status, response) => {
            // handle state setting response
            // tag::ignore[]
            expect(status.error).toBeFalsy();
            expect(response.totalOccupancy).toEqual(1);
            expect(response.channels[expectedChannel]).toBeDefined();
            expect(response.channels[expectedChannel].occupancy).toEqual(1);

            const occupants = response.channels[expectedChannel].occupants;
            expect(occupants).toBeDefined();
            expect(occupants[0].uuid).toEqual(observerPubNubClient.getUUID());
            expect(occupants[0].state).not.toBeDefined();

            done();
            // end::ignore[]
          });
          // end::PRE-2[]
        }
      },
    });
  });

  test('Showing the last online timestamp for a user', () => {
    // tag::PRE-3[]
    // TODO: need a sample here
    // end::PRE-3[]
  });
});
