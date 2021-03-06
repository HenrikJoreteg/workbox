/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/* eslint-env mocha, browser */
/* global chai */

import BackgroundSyncQueue from '../../src/lib/background-sync-queue.js';
import {defaultQueueName, maxAge} from '../../src/lib/constants.js';

function delay(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), timeout);
  });
}

describe(`background sync queue test`, function() {
  let responseAchieved = 0;
  function onRes() {
    responseAchieved = responseAchieved + 1;
  }
  function onRetryFail() {}

  const QUEUE_NAME = 'QUEUE_NAME';
  const MAX_AGE = 6;
  const CALLBACKS = {
    onResponse: onRes,
    onRetryFail: onRetryFail,
  };

  let backgroundSyncQueue;

  beforeEach(async function() {
    responseAchieved = 0;
    backgroundSyncQueue = new BackgroundSyncQueue({
      maxRetentionTime: MAX_AGE,
      callbacks: CALLBACKS,
    });
  });

  afterEach(async function() {
    // replay queue so that further tests are not affected
    try {
      await backgroundSyncQueue.replayRequests();
    } catch (e) {
      // do nothing as this is just a cleanup exercise
    }
    await backgroundSyncQueue.cleanupQueue();
  });

  it(`check defaults`, function() {
    const bgSyncQueue = new BackgroundSyncQueue({});
    chai.assert.isObject(bgSyncQueue._queue);
    chai.assert.isObject(bgSyncQueue._requestManager);
    chai.assert.equal(bgSyncQueue._queue._config.maxAge, maxAge);
    chai.assert.match(
        bgSyncQueue._queue._queueName,
        new RegExp(defaultQueueName + '_\\d+'));
    chai.assert.equal(
        JSON.stringify(bgSyncQueue._requestManager._globalCallbacks),
        JSON.stringify({}));
  });

  it(`check parameterised constructor`, function() {
    backgroundSyncQueue = new BackgroundSyncQueue({
      maxRetentionTime: MAX_AGE,
      queueName: QUEUE_NAME,
      callbacks: CALLBACKS,
    });
    chai.assert.isObject(backgroundSyncQueue._queue);
    chai.assert.isObject(backgroundSyncQueue._requestManager);
    chai.assert.equal(backgroundSyncQueue._queue._queueName, QUEUE_NAME);
    chai.assert.equal(backgroundSyncQueue._queue._config.maxAge, MAX_AGE);
    chai.assert.equal(backgroundSyncQueue._requestManager._globalCallbacks,
      CALLBACKS);
  });

  it(`check push proxy`, async function() {
    await backgroundSyncQueue.pushIntoQueue({
      request: new Request('/__echo/counter'),
    });
    chai.assert.equal(backgroundSyncQueue._queue.queue.length, 1);
  });

  it(`check replay`, async function() {
    await backgroundSyncQueue.pushIntoQueue({
      request: new Request('/__echo/counter'),
    });
    await backgroundSyncQueue.pushIntoQueue({
      request: new Request('/__echo/counter'),
    });
    chai.assert.equal(backgroundSyncQueue._queue.queue.length, 2);
    await backgroundSyncQueue.replayRequests();
    chai.assert.equal(responseAchieved, 2);
  });

  it(`check replay failure with rejected promise`, async function() {
    await backgroundSyncQueue.pushIntoQueue({
      request: new Request('/__echo/counter'),
    });
    await backgroundSyncQueue.pushIntoQueue({
      request: new Request('/__test/404'),
    });
    try {
      await backgroundSyncQueue.replayRequests();
      throw new Error('Replay should have failed because of invalid URL');
    } catch (err) {
      chai.assert.equal(404, err[0].status);
    }
  });

  it(`test queue cleanup`, async function() {
    // code for clearing everything from IDB.
    const backgroundSyncQueue = new BackgroundSyncQueue({
      maxRetentionTime: 1,
    });

    const backgroundSyncQueue2 = new BackgroundSyncQueue({
      maxRetentionTime: 10000,
      dbName: 'Queue2',
    });

    await backgroundSyncQueue.cleanupQueue();
    await backgroundSyncQueue2.cleanupQueue();
    await backgroundSyncQueue.pushIntoQueue({
      request: new Request('/__echo/counter'),
    });
    await backgroundSyncQueue.pushIntoQueue({
      request: new Request('/__echo/counter'),
    });
    await backgroundSyncQueue2.pushIntoQueue({
      request: new Request('/__echo/counter'),
    });
    const queue1Keys = await backgroundSyncQueue._queue._idbQDb.getAllKeys();
    const queue2Keys = await backgroundSyncQueue2._queue._idbQDb.getAllKeys();
    await delay(100);
    await backgroundSyncQueue.cleanupQueue();
    await backgroundSyncQueue2.cleanupQueue();
    chai.assert.equal(
        queue1Keys.length,
        (await backgroundSyncQueue._queue._idbQDb.getAllKeys()).length + 2);
    chai.assert.equal(
        queue2Keys.length,
        (await backgroundSyncQueue2._queue._idbQDb.getAllKeys()).length);
  });
});
