/* global test */
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe.skip('Messages', () => {
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

    test('Sending messages', () => {
        // tag::MSG-1[]
        // end::MSG-1[]
    });

    test('Receiving messages', () => {
        // tag::MSG-2[]
        // end::MSG-2[]
    });

    test('Sending images and files', () => {
        // tag::MSG-3[]
        // end::MSG-3[]
    });

    test('Sending typing indicators', () => {
        // tag::MSG-4[]
        // end::MSG-4[]
    });

    test('Showing sender details and timestamp in the message', () => {
        // tag::MSG-7[]
        // end::MSG-7[]
    });

    test('Updating messages', () => {
        // tag::MSG-8[]
        // end::MSG-8[]
    });

    test('Updating messages', () => {
        // tag::MSG-9[]
        // end::MSG-9[]
    });
});
