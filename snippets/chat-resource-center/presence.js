/* global test */
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe.skip('Presence', () => {
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

    test('Displaying online/offline status for users', () => {
        // tag::PRE-1[]
        // end::PRE-1[]
    });

    test('Showing occupancy of members', () => {
        // tag::PRE-2[]
        // end::PRE-2[]
    });

    test('Presence web-hooks', () => {
        // tag::PRE-4[]
        // end::PRE-4[]
    });
});
