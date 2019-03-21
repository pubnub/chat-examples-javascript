/* global test */
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe.skip('Message history', () => {
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

    test('Retrieving message counts', () => {
        // tag::HIST-1[]
        // end::HIST-1[]
    });

    test('Retrieving past messages', () => {
        // tag::HIST-2[]
        // end::HIST-2[]
    });
});
