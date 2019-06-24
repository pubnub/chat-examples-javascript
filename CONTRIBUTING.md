# Contributing to the JavaScript Chat Examples

Your contributions to this project are very much welcome! Here are a 
few tips to make things work efficiently.

## General information

All contributions — edits _and_ new content — should be in the form of
pull requests. This keeps everyone from stepping on each others' toes,
and allows us all to discuss the change and make suggestions for 
improvement.

When you create your PR, please tag _Craig Baumgarten_ or 
_Serhii Mamontov_ as a reviewer.

> **NOTE** The pull request process makes things efficient, and allows 
the whole team to participate. If a pull request doesn’t work for you,
just email Craig or Serhii and they will create one for you.

## Coding Standards

The repository is bundled with an ESLint configuration (`.eslintrc`) which will
warn you of any coding style inconsistency with standards defined by
Airbnb's shared configuration.  
Make sure to resolve all warnings before opening a pull request.

You can use one of the following commands to check your changes for errors with eslint at any time.
```
npm run lint # lints all the files
npm run lint-examples # only lint files in /examples
npm run lint-snippets # only lint files in /snippets
```


## Making a Pull Request

### Before you Start

Please ensure that any work is initially branched off `master`, and 
rebased often.

### After you're Done

Please, make sure to follow these [commit message guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
when committing changes as part of a pull request. 

If editing the snippets, make sure to [run the tests](#testing-snippets) before committing.

### Content

#### Snippets

Snippets are organized in the form of _integration tests_, where each example 
should be tested to work.  
Snippets are used by the Docusaurus `include` plugin, which will render them 
instead of placeholders. Each `include` directive relies on _tag_ names
which should be placed around snippet code:  

```js
// tag::CON-1[]
const uuid = PubNub.generateUUID();

const pubnub = new PubNub({
  subscribeKey,
  publishKey,
  uuid,
});
// end::CON-1[]
```

If test suite methods became part of the snippet, they can be removed by
enclosing them into a special `ignore` tag:  

```js
// tag::CON-5[]
pubnub.subscribe({
  channels: ['room-1'],
});

// tag::ignore[]
pubnub.addListener({
  status: (status) => {
    expect(status.affectedChannels).toEqual(expectedChannels);

    if (status.operation === 'PNSubscribeOperation') {
      // end::ignore[]
      pubnub.unsubscribe({
        channels: ['room-1'],
      });
      // tag::ignore[]
    } else if (status.operation === 'PNUnsubscribeOperation') {
      done();
    }
  },
});
// end::ignore[]
// end::CON-5[]
```

#### Testing Snippets
Before you can run the integration tests, you'll need a set of PubNub keys for testing.

1. Login to your [admin dashboard](https://admin.pubnub.com) and create a _new_ app.

1. Click the app and create a _second_ keyset named `PAM`.

1. In the root directory of the repository, create `.env` to hold your keys

```
# from PAM keyset
PAM_PUBLISH_KEY=pub-c-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
PAM_SUBSCRIBE_KEY=sub-c-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
PAM_SECRET_KEY=sec-c-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# from demo keyset
PUBLISH_KEY=pub-c-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
SUBSCRIBE_KEY=sub-c-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

1. For the `PAM` keyset, enable Storage & Playback, Stream Controller, and Access Manager, then save the changes.
   Replace `PAM_PUBLISH_KEY`, `PAM_SUBSCRIBE_KEY`, and `PAM_SECRET_KEY` in `.env` with the Publish Key, Subscribe Key, and 
   Secret Key from the admin dashboard.

1. For the default `Demo Keyset`, enable Presence, Storage & Playback, and Stream Controller, then save the changes.
   Replace `PUBLISH_KEY` and `SUBSCRIBE_KEY`, in `.env` with the Publish Key and Subscribe Key from the admin dashboard.

```
npm run test-snippets
```
This will run the integration tests for the snippets with Jest. 
When testing locally, tests for push notifications _will_ be skipped so 
that you do not have to provide push certificates.
These tests will run normally on Travis when you make your pull request.

> **Note** There is a known issue where some tests unexpectedly fail after 
a timeout. When this occurs, re-running the tests should resolve the issue.