/* global test, expect */
import PubNub from 'pubnub';

describe('Basic use cases', () => {

    test('Should initialize PubNub client', () => {
        // tag::pubnub-init[]
        let pubnub = new PubNub({
            publishKey: 'demo-36',
            subscribeKey: 'demo-36'
        });
        // end::pubnub-init[]

        expect(pubnub).toBeDefined();
    });
});
