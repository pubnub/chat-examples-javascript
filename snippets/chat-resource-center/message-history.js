/* global test, describe, expect, jasmine, beforeEach, afterEach */
import BigNumber from 'bignumber.js';
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

const publishMessage = (pubnub, channel, completion) => {
  const message = {
    senderId: 'user123',
    text: `${Date.now() / 1000} Hello, hoomans!`,
  };

  pubnub.publish({
    message,
    channel,
  }, (status, response) => {
    expect(status.error).toBeFalsy();
    expect(response.timetoken).toBeDefined();

    let timetoken = response.timetoken;
    if (typeof response.timetoken === 'string') {
      timetoken = Number(response.timetoken);
    }

    completion(timetoken);
  });
};

const publishMultipleMessages = (pubnub, channel, count, completion) => {
  let publishedMessages = 0;
  const timetokens = [];

  const handleMessagePublish = (timetoken) => {
    timetokens.push(timetoken);
    publishedMessages += 1;

    if (publishedMessages < count) {
      setTimeout(() => {
        publishMessage(pubnub, channel, handleMessagePublish);
      }, 100);
    } else {
      completion(timetokens);
    }
  };

  publishMessage(pubnub, channel, handleMessagePublish);
};

describe('Message history', () => {
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

  test('Retrieving message counts', (done) => {
    const expectedChannels = [PubNub.generateUUID(), PubNub.generateUUID()];
    const pubnub = pubNubClient;
    let timetoken = null;

    const fetchMessagesCount = () => {
      // tag::HIST-1[]
      pubnub.messageCounts({
        // tag::ignore[]
        channels: expectedChannels,
        channelTimetokens: [timetoken],
        /**
        // end::ignore[]
        channels: ['channel-1', 'channel-2'],
        channelTimetokens: ['15518041524300251'],
        // tag::ignore[]
         */
        // end::ignore[]
      }, (status, results) => {
        console.log(status);
        console.log(results);
        // tag::ignore[]

        expect(results.channels[expectedChannels[0]]).toEqual(1);
        expect(results.channels[expectedChannels[1]]).toEqual(1);

        done();
        // end::ignore[]
      });
      // end::HIST-1[]
    };

    publishMessage(pubnub, expectedChannels[0], (messageTimetoken) => {
      timetoken = BigNumber(messageTimetoken).minus(1).toFixed();

      publishMessage(pubnub, expectedChannels[1], () => {
        setTimeout(() => {
          fetchMessagesCount();
        }, 2000);
      });
    });
  });

  test('Retrieving past messages from history', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const pubnub = pubNubClient;
    let timetoken = null;

    const fetchMessagesHistory = () => {
      // tag::HIST-2[]
      pubnub.history({
        // tag::ignore[]
        channel: expectedChannel,
        end: timetoken,
        /**
        // end::ignore[]
        channel: 'room-1',
        count: 50, // how many items to fetch
        end: '13827485876355504', // timetoken of the last message
        // tag::ignore[]
         */
        // end::ignore[]
        stringifiedTimeToken: true,
        reverse: false,
      }, (status, response) => {
        // handle status, response
        // tag::ignore[]

        expect(status.error).toBeFalsy();
        expect(response.messages).toBeDefined();
        expect(response.messages.length).toEqual(2);

        done();
        // end::ignore[]
      });
      // end::HIST-2[]
    };

    publishMessage(pubnub, expectedChannel, () => {
      publishMessage(pubnub, expectedChannel, (messageTimetoken) => {
        timetoken = BigNumber(messageTimetoken).minus(1).toFixed();

        publishMessage(pubnub, expectedChannel, () => {
          setTimeout(() => {
            fetchMessagesHistory();
          }, 2000);
        });
      });
    });
  });

  test('Retrieving more than 100 messages from history', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const pubnub = pubNubClient;
    let historyCallsCount = 0;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

    // tag::HIST-3[]
    const getAllMessages = (timetoken) => {
      pubnub.history({
        // tag::ignore[]
        channel: expectedChannel,
        end: timetoken,
        /**
        // end::ignore[]
        channel: 'history_test',
        // tag::ignore[]
         */
        // end::ignore[]
        stringifiedTimeToken: true, // false is the default
        start: timetoken, // start time token to fetch
      }, (status, response) => {
        const messages = response.messages;
        const start = response.startTimeToken;
        const end = response.endTimeToken;

        // if 'messages' were retrieved, do something useful with them
        if (messages !== undefined && messages.length > 0) {
          console.log(messages.length);
          console.log('start:', start);
          console.log('end:', end);
        }

        /**
         * if 100 'messages' were retrieved, there might be more, call
         * history again
         */
        if (messages.length === 100) {
          getAllMessages(start);
        }

        // tag::ignore[]
        historyCallsCount += 1;
        if (historyCallsCount === 2) {
          done();
        }
        // end::ignore[]
      });
    };

    // Usage examples:
    // getAllMessages();
    // getAllMessages(null);
    // end::HIST-3[]

    publishMultipleMessages(pubnub, expectedChannel, 150, () => {
      getAllMessages(null);
    });
  });

  test('Retrieving messages on multiple chat rooms', (done) => {
    const expectedChannels = [
      PubNub.generateUUID(), PubNub.generateUUID(), PubNub.generateUUID(),
    ];
    const pubnub = pubNubClient;
    const timetokens = {};

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

    const fetchMultipleHistory = () => {
      const startTimetokens = timetokens[expectedChannels[0]];
      const endTimetokens = timetokens[expectedChannels[2]];
      // tag::HIST-4[]
      pubnub.fetchMessages({
        // tag::ignore[]
        channels: expectedChannels,
        start: startTimetokens[Math.floor(startTimetokens.length * 0.1)],
        end: endTimetokens[Math.floor(endTimetokens.length * 0.8)],
        /**
        // end::ignore[]
        channels: ['ch1', 'ch2', 'ch3'],
        start: '15343325214676133',
        end: '15343325004275466',
        // tag::ignore[]
         */
        // end::ignore[]
        count: 15,
      }, (status, response) => {
        // handle response
        // tag::ignore[]
        const channelsList = Object.keys(response.channels);
        expect(status.error).toBeFalsy();
        expect(channelsList.length).toEqual(3);
        expect(response.channels[channelsList[0]].length).toBeGreaterThan(10);
        expect(response.channels[channelsList[1]].length).toBeGreaterThan(10);
        expect(response.channels[channelsList[2]].length).toBeGreaterThan(10);

        done();
        // end::ignore[]
      });
    };
    // end::HIST-4[]

    const handleMessagesPublish = (channel, messageTimetokens) => {
      timetokens[channel] = messageTimetokens;

      if (Object.keys(timetokens).length === 3) {
        fetchMultipleHistory();
      }
    };

    publishMultipleMessages(pubnub, expectedChannels[0], 40, (messageTimetokens) => {
      handleMessagesPublish(expectedChannels[0], messageTimetokens);
    });
    publishMultipleMessages(pubnub, expectedChannels[1], 40, (messageTimetokens) => {
      handleMessagesPublish(expectedChannels[1], messageTimetokens);
    });
    publishMultipleMessages(pubnub, expectedChannels[2], 40, (messageTimetokens) => {
      handleMessagesPublish(expectedChannels[2], messageTimetokens);
    });
  });
});
