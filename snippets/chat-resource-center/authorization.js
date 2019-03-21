/* global test */
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe.skip('Authorization', () => {
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

    test('Setting up secure channels', () => {
        // tag::PAM-1[]
        // end::PAM-1[]
    });

    test('Granting read/write access for users', () => {
        // tag::PAM-2[]
        // end::PAM-2[]
    });

    test('Extending access for users', () => {
        // tag::PAM-4[]
        // end::PAM-4[]
    });

    test('Revoking access for users', () => {
        // tag::PAM-4[]
        // end::PAM-4[]
    });

    test('Banning and kicking users', () => {
        // tag::PAM-4[]
        // end::PAM-4[]
    });
});
