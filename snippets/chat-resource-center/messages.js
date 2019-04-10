/* global test, describe, expect, jasmine, beforeEach, afterEach */
import PubNub from 'pubnub';

const subscribeKey = 'demo-36';
const publishKey = 'demo-36';

describe('Messages', () => {
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

  test('Sending messages', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const expectedUUID = pubNubClient.getUUID();
    const expectedMessage = 'Hello, hoomans!';
    const expectedSenderID = 'user123';
    const pubnub = pubNubClient;

    observerPubNubClient.subscribe({
      channels: [expectedChannel],
    });

    observerPubNubClient.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.category === 'PNConnectedCategory') {
          // tag::MSG-1[]
          pubnub.publish({
            message: {
              senderId: 'user123',
              text: 'Hello, hoomans!',
            },
            // tag::ignore[]
            channel: expectedChannel,
            /**
            // end::ignore[]
            channel: 'room-1',
            // tag::ignore[]
             */
            // end::ignore[]
          }, (status, response) => {
            // handle status, response
            // tag::ignore[]

            expect(status.error).toBeFalsy();
            expect(response.timetoken).toBeDefined();
            // end::ignore[]
          });
          // end::MSG-1[]
        }
      },
      message: (message) => {
        expect(message.publisher).toEqual(expectedUUID);
        expect(message.channel).toEqual(expectedChannel);
        expect(message.message.senderId).toEqual(expectedSenderID);
        expect(message.message.text).toEqual(expectedMessage);
        done();
      },
    });
  });

  test('Receiving messages', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const pubnub = pubNubClient;
    let presenceReceived = false;
    let messageReceived = false;

    pubnub.subscribe({
      channels: [expectedChannel],
      withPresence: true,
    });

    const handleMessage = () => {
      messageReceived = true;

      if (messageReceived && presenceReceived) {
        done();
      }
    };

    const handlePresence = () => {
      presenceReceived = true;

      if (messageReceived && presenceReceived) {
        done();
      }
    };

    const publishSampleMessage = () => {
      pubnub.publish({
        message: {
          senderId: 'user123',
          title: 'Message',
          description: 'Testing message handling',
        },
        channel: expectedChannel,
      }, (status, response) => {
        expect(status.error).toBeFalsy();
        expect(response.timetoken).toBeDefined();
      });
    };

    // tag::MSG-2[]
    pubnub.addListener({
      status: (statusEvent) => {
        if (statusEvent.category === 'PNConnectedCategory') {
          publishSampleMessage();
        }
      },
      message: (msg) => {
        console.log(msg.message.title);
        console.log(msg.message.description);
        // tag::ignore[]
        expect(msg.publisher).toEqual(pubnub.getUUID());

        handleMessage();
        // end::ignore[]
      },
      presence: (presenceEvent) => {
        // handle presence
        // tag::ignore[]
        expect(presenceEvent.action).toEqual('join');
        expect(presenceEvent.uuid).toEqual(pubnub.getUUID());

        handlePresence();
        // end::ignore[]
      },
    });
    // end::MSG-2[]
  });

  test.skip('Sending images and files', () => {
    // tag::MSG-3[]
    // TODO: need a sample here
    // end::MSG-3[]
  });

  test('Sending typing indicators', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const expectedUUID = pubNubClient.getUUID();
    const expectedSenderID = 'user123';
    const pubnub = pubNubClient;

    observerPubNubClient.subscribe({
      channels: [expectedChannel],
    });

    const fetchHistory = () => {
      setTimeout(() => {
        observerPubNubClient.history({
          channel: expectedChannel,
        }, (status, response) => {
          expect(status.error).toBeFalsy();
          expect(response.messages.length).toEqual(0);
          done();
        });
      }, 2000);
    };

    const publishMessage = () => {
      // tag::MSG-4[]
      pubnub.publish({
        message: {
          senderId: 'user123',
          isTyping: true, // indicates typing
        },
        // tag::ignore[]
        channel: expectedChannel,
        /**
        // end::ignore[]
        channel: 'room-1',
        // tag::ignore[]
         */
        // end::ignore[]
        storeInHistory: false, // override default storage options
      }, (status, response) => {
        // handle status, response
        // tag::ignore[]

        expect(status.error).toBeFalsy();
        expect(response.timetoken).toBeDefined();
        // end::ignore[]
      });
      // end::MSG-4[]
    };

    observerPubNubClient.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.category === 'PNConnectedCategory') {
          publishMessage();
        }
      },
      message: (message) => {
        expect(message.publisher).toEqual(expectedUUID);
        expect(message.channel).toEqual(expectedChannel);
        expect(message.message.senderId).toEqual(expectedSenderID);
        expect(message.message.isTyping).toBeTruthy();

        fetchHistory();
      },
    });
  });

  test('Showing timestamp in the message', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const pubnub = pubNubClient;

    pubnub.subscribe({
      channels: [expectedChannel],
    });

    // tag::MSG-5[]
    pubnub.addListener({
      // tag::ignore[]
      status: (subscribeStatus) => {
        if (subscribeStatus.category === 'PNConnectedCategory') {
          pubnub.publish({
            message: {
              senderId: 'user123',
              text: 'Hello, hoomans!',
            },
            channel: expectedChannel,
          }, (status, response) => {
            expect(status.error).toBeFalsy();
            expect(response.timetoken).toBeDefined();
          });
        }
      },
      // end::ignore[]
      message: (message) => {
        const unixTimestamp = message.timetoken / 10000000;
        const gmtDate = new Date(unixTimestamp * 1000);
        const localeDateTime = gmtDate.toLocaleString();
        // tag::ignore[]
        expect(message.timetoken.length).toEqual(17);
        expect(gmtDate).toBeInstanceOf(Date);
        expect(localeDateTime).toBeDefined();
        expect(localeDateTime.length).toBeGreaterThan(0);
        done();
        // end::ignore[]
      },
    });
    // end::MSG-5[]
  });

  test('Updating and deleting messages', (done) => {
    const expectedText = 'Fixed. I had a typo earlier...';
    const expectedChannel = PubNub.generateUUID();
    let messageUpdateSent = false;
    const pubnub = pubNubClient;
    let messageTimetoken = null;
    const messagesList = {};
    const messageIDs = {};

    const handleMessage = (message) => {
      const messageId = message.timetoken;

      if (!messagesList[message.channel]) {
        messagesList[message.channel] = {};
      }

      if (!messageIDs[message.channel]) {
        messageIDs[message.channel] = [];
      }

      if (messageIDs[message.channel].indexOf(messageId) < 0) {
        messagesList[message.channel][messageId] = message;
        messageIDs[message.channel].push(messageId);
      } else if (message.message.deleted) {
        const messageIdIdx = messageIDs[message.channel].indexOf(messageId);

        if (messageIdIdx >= 0) {
          delete messagesList[message.channel][messageId];
          messageIDs[message.channel].splice(messageIdIdx, 1);
        } else {
          return;
        }
      } else {
        messagesList[message.channel][messageId] = message;
      }

      // update UI, update display content

      if (!messageUpdateSent) {
        messageTimetoken = messageId;
        messageUpdateSent = true;

        // tag::MSG-6.2[]
        pubnub.publish({
          // tag::ignore[]
          channel: expectedChannel,
          /**
          // end::ignore[]
          channel: 'room-1',
          // tag::ignore[]
          */
          // end::ignore[]
          message: {
            // tag::ignore[]
            timetoken: messageTimetoken,
            /**
            // end::ignore[]
            timetoken: '15343325214676133', // original message timetoken
            // tag::ignore[]
             */
            // end::ignore[]
            senderId: 'user123',
            text: 'Fixed. I had a typo earlier...',
          },
        }, (status, response) => {
          // handle status, response
          // tag::ignore[]
          expect(status.error).toBeFalsy();
          expect(response.timetoken).toBeDefined();
          // end::ignore[]
        });
        // end::MSG-6.2[]
      } else {
        const storedMessage = messagesList[message.channel][messageId];
        expect(storedMessage).toBeDefined();
        expect(storedMessage.message.timetoken).toEqual(messageTimetoken);
        expect(storedMessage.message.text).toEqual(expectedText);
        expect(messageIDs[message.channel]).toContain(messageId);

        done();
      }
    };

    pubnub.subscribe({
      channels: [expectedChannel],
    });

    pubnub.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.category === 'PNConnectedCategory') {
          // tag::MSG-6.1[]
          pubnub.publish({
            message: {
              senderId: 'user123',
              text: 'Hello, hoomans!',
            },
            // tag::ignore[]
            channel: expectedChannel,
            /**
            // end::ignore[]
            channel: 'room-1',
            // tag::ignore[]
             */
            // end::ignore[]
          }, (status, response) => {
            // handle status, response
            // tag::ignore[]

            expect(status.error).toBeFalsy();
            expect(response.timetoken).toBeDefined();
            // end::ignore[]
          });
          // end::MSG-6.1[]
        }
      },
      message: (message) => {
        handleMessage(message);
      },
    });
  });

  test('Sending announcements to all users', (done) => {
    const expectedChannel = PubNub.generateUUID();
    const expectedSenderID = 'user123';
    const pubnub = pubNubClient;

    observerPubNubClient.subscribe({
      channels: [expectedChannel],
    });

    observerPubNubClient.addListener({
      status: (subscribeStatus) => {
        if (subscribeStatus.category === 'PNConnectedCategory') {
          // tag::MSG-7[]
          pubnub.publish({
            message: {
              senderId: 'user123',
              text: 'Hello, this is an announcement',
            },
            // tag::ignore[]
            channel: expectedChannel,
            /**
            // end::ignore[]
            channel: 'room-1',
            // tag::ignore[]
             */
            // end::ignore[]
          }, (status, response) => {
            // handle status, response
            // tag::ignore[]

            expect(status.error).toBeFalsy();
            expect(response.timetoken).toBeDefined();
            // end::ignore[]
          });
          // end::MSG-7[]
        }
      },
      message: (message) => {
        expect(message.channel).toEqual(expectedChannel);
        expect(message.message.senderId).toEqual(expectedSenderID);

        done();
      },
    });
  });
});
