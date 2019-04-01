'use strict';

const git = require('simple-git/promise');
const log = require('fancy-log');
const chalk = require('chalk');
const fs = require('fs');

// Extract information related to repository name and sample language.
const repositoryName = process.env['TRAVIS_REPO_SLUG'].split('/').pop();
const language = repositoryName.split('-').pop();
const localPath = 'chat-resource-center';
const codeSamplesPath = 'code-samples';
const currentRepositoryPath =  '.';

// CRC and submodule information.
const url = 'https://github.com/pubnub/chat-resource-center.git';
const submodulePath = `${codeSamplesPath}/${language}`;
let snippetsModificationCommits = [];
let changeStart = null;
let changeEnd = null;
let changeLog = null;

// Samples location.
const samplesPath = [currentRepositoryPath, 'snippets'].join('/');


// Update retry configuration.
const updateRetryCount = 3;
let retryCounter = 1;

/**
 *
 * @param {String} message - Message which explain what has been
 * performed before error has been created.
 * @param {Error} error - Object which hold information about recent
 * error.
 */
const logError = function (message, error) {
  log.error(chalk.red.bold(`${message}\n${error.message}`));

  if (retryCounter < updateRetryCount) {
    log.error(chalk.yellow.bold('Retrying submodule update ' +
        `(${retryCounter + 1}/${updateRetryCount})`));

    if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
    }

    retryCounter++;
    startUpdate();
  } else {
      log.error(chalk.red.bold('Submodule data update did fail.'));
    // There is no reason to continue.
    process.exit(100);
  }
};


/**
 * Push updated submodule back to CRC repository.
 */
const pushSubmoduleUpdate = function () {
  log.info(`Pushing changes to '${chalk.cyan.bold(url)}'...`);

  git(localPath)
      .push('origin', 'master')
      .then(() => {
        log.info(`'${chalk.cyan.bold(submodulePath)}' submodule information ` +
            `has been updated in ${chalk.cyan.bold(url)}`);
      })
      .catch((error) =>
          logError(`Unable to push changes to '${url}'.`, error)
      );
};

/**
 * Commit submodule changes into local CRC repository clone.
 */
const commitSubmoduleUpdate = function () {
  log.info(`Commit '${chalk.cyan.bold(submodulePath)}' submodule updated ` +
      'reference...');

  git(localPath)
      .commit(changeLog, [submodulePath])
      .then(pushSubmoduleUpdate)
      .catch((error) =>
          logError(`Unable to commit '${submodulePath}' submodule updated ` +
              'reference.', error)
      );
};

/**
 * Update reference in CRC submodule for sample repository to use
 * latest commit information.
 */
const updateSubmodule = function () {
  if (changeLog === null || changeLog.length === 0) {
    log.info(chalk.yellow('There is no changes in '+
        `'${chalk.cyan.bold(submodulePath)}'. ` +
        'Skip submodule update in CRC repository.'));
    return;
  }

  log.info(`Updating '${chalk.cyan.bold(submodulePath)}' submodule...`);

  git(localPath)
      .submoduleUpdate(['--remote', submodulePath])
      .then(commitSubmoduleUpdate)
      .catch((error) =>
          logError(`Unable to update '${submodulePath}' submodule.`, error)
      );
};

/**
 * Compose final change log basing on commits where snippets folder
 * content has been modified.
 */
const getChangeLogMessages = function () {
  log.info(`Creating change log for '${chalk.cyan.bold(samplesPath)}' ` +
      `content changes...`);

  git(currentRepositoryPath)
      .silent(true)
      .log({from: changeStart, to: changeEnd})
      .then(data => {
        let messages = [];

        data.all.reverse().forEach(line => {
          if (snippetsModificationCommits.indexOf(line.hash) !== -1) {
            let message = line.message;
            if (line.body.length) {
              message = [message, line.body].join('\n');
            }
            messages.push(message);
          }
        });

        changeLog = messages.join('\n\n');

        updateSubmodule();
      })
      .catch((error) =>
          logError(`Unable to create log for '${samplesPath}' content changes.`,
              error)
      );
};

/**
 * Gather hashes for commits, where tracked repository with snippets
 * has been changed.
 */
const getSnippetsModificationCommits = function () {
  const range = [changeStart, changeEnd].join('...');

  log.info(`Getting commits with '${chalk.cyan.bold(samplesPath)}' ` +
      `content changes in ${chalk.green.bold(range)} range...`);

  git(currentRepositoryPath)
      .raw(['log', range, '-p', samplesPath])
      .then(results => {
        const regEx = new RegExp('^commit (.*)','gm');
        let match;

        while ((match = regEx.exec(results)) !== null) {
          snippetsModificationCommits.push(match[1]);
        }

        getChangeLogMessages();
      })
      .catch((error) =>
          logError(`Unable to get commits with '${samplesPath}' content ` +
              'change.', error)
      );
};

/**
 * Retrieve latest commit from local repository at specified path.
 *
 * This function called twice in a row for code sample and CRC repo to
 * gather hash for commits between which script should gather change
 * log for commit with submodule hash update.
 *
 * @param {String} path - Relative path to repository for which latest
 * commit hash should be retrieved.
 */
const getLastCommitHash = function (path) {
  log.info(`Getting latest commit hash for '${chalk.cyan.bold(path)}'...`);

  git(path)
      .silent(true)
      .log()
      .then(data => {
        if (changeStart === null) {
          changeStart = data.latest.hash;

          getLastCommitHash(currentRepositoryPath)
        } else if (changeEnd === null) {
          changeEnd = data.latest.hash;

          getSnippetsModificationCommits();
        }
      })
      .catch((error) =>
          logError(`Unable to get latest commit hash '${path}'.`,
              error)
      );
};

/**
 * Pull out all submodules' code into cloned CRC repository.
 */
const initSubmodules = function () {
  log.info(`Initializing '${chalk.cyan.bold(codeSamplesPath)}' submodules...`);

  git(localPath)
      .silent(true)
      .subModule(['update', '--init', '--recursive'])
      .then(() => {
        getLastCommitHash([localPath, submodulePath].join('/'));
      })
      .catch((error) => {
        logError(`Unable to initialize '${codeSamplesPath}' submodules.`,
            error);
      });
};

/**
 * Start submodules update process.
 */
const startUpdate = function () {
  // Check whether repository already available locally or not.
  if (!fs.existsSync(localPath)) {
    log.info(`Cloning '${chalk.cyan.bold(url)}' to ` +
        `'${chalk.cyan.bold(localPath)}'...`);

    git()
        .silent(true)
        .clone(url, localPath)
        .then(initSubmodules)
        .catch(error => logError(`Unable to clone '${url}'.`, error));
  } else {
    initSubmodules();
  }
};

startUpdate();
