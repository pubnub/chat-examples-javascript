# chat-examples-javascript

[![Build Status](https://travis-ci.com/pubnub/chat-examples-javascript.svg?token=ey6rVJnpqsBKpxXy2fYF&branch=master)](https://travis-ci.com/pubnub/chat-examples-javascript)

Source files for JavaScript based chat example apps and document code 
samples live here.  

Please follow [contributing](CONTRIBUTING.md) guide if you have 
something to share with us.


## Requirements

* [Node.js](https://nodejs.org/en/)


## Prerequisites

To able to use [Gulp](https://gulpjs.com) is required to install all
project dependencies:
  
```
npm install
```


## Repository structure

| Directory  | Description |
|:----------:| ----------- |
| `examples` | Location where gathered applications which explain how to solve tasks related to _chat_ using PubNub SDK. |
| `snippets` | Location where verified and tested code snippets are stored.<br>Snippets from `chat-resource-center` can be found inside of [Chat Resource Center](https://pubnub.github.io/chat-resource-center/). |


## Building the project

Project pre-configured with set of [Gulp](https://gulpjs.com) tasks.

| Task  | Purpose |
| ---------- | ----------- |
| `lint_examples` | Run linting for code in `examples` directory to check compliance with configured coding style requirements. |
| `lint_snippets` | Run linting for code in `snippets` directory to check compliance with configured coding style requirements. |
| `examples_tests` | Run any tests inside of `examples` directory (_integration_ and _unit_ if exist). |
| `snippets_tests` | Run any tests inside of `snippets` directory (_integration_). |
| `examples_full_test` | Perform full test with linting and tests for code in `examples` directory. |
| `snippets_full_test` | Perform full test with linting and tests for code in `snippets` directory. |
| `lint_all` | Run linting for code in `examples` and `snippets` directories to check compliance with configured coding style requirements. |
| `test_all` | Run any tests inside of `examples` and `snippets` directories (_integration_ and _unit_ if exist). |
| `full_test` | Perform full test with linting and tests for code in `examples`  and `snippets` directories. |

Travis CI use `examples_full_test` or `snippets_full_test` depending from 
current job configuration in test matrix.    

[Gulp](https://gulpjs.com) task can be called like this:  

```
gulp snippets_full_test
```
