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

> **NOTE** The pull-request process makes things efficient, and allows 
the whole team to participate. If a pull request doesn’t work for you,
just email Craig or Serhii and they will create one for you.

## Coding Standards

Repository bundled with ESLint configuration (`.eslintrc`) which will
warn about any coding style inconsistency with standards defined by
Airbnb's shared configuration.  
Make sure to resolve all warnings before open merge pull request.


## Making a Pull Request

### Before you Start

Please ensure that any work is initially branched off `master`, and 
rebased often.

### After you Done

Please, make sure to follow this [commit message guideline](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
when commit changes which should be pushed with merge pull request. 

### Content

#### Snippets

Snippets organized in form of _integration tests_, where each example 
should be tested to work.  
Snippets used by Docusaurus `include` plugin which will render them 
instead of placeholders. Each `include` directive rely on _tag_ names
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

If test suite methods became part of snippet, they can be removed by
enclosing them into special `ignore` tag:  

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
