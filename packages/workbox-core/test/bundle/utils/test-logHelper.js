import chai from 'chai';
import sinon from 'sinon';

import logHelper from '../../../src/utils/logHelper';

const expect = chai.expect;

describe(`logHelper [${process.env.NODE_ENV}]`, function() {
  let stubs = [];

  afterEach(function() {
    stubs.forEach((stub) => {
      stub.restore();
    });

    stubs = [];
  });

  describe(`LOG_LEVELS`, function() {
    it(`should expose the valid LOG_LEVELS`, function() {
      expect(logHelper.LOG_LEVELS).to.exist;
    });

    it(`should expose the expected LOG_LEVELS`, function() {
      expect(logHelper.LOG_LEVELS.verbose).to.exist;
      expect(logHelper.LOG_LEVELS.debug).to.exist;
      expect(logHelper.LOG_LEVELS.warning).to.exist;
      expect(logHelper.LOG_LEVELS.error).to.exist;
    });
  });

  /**
   * Why .calledWithMatch()?
   *
   * This method on sinon spies will ensure that the spied method was called
   * "with matching arguments (and possibly others)." This means logHelper
   * can add a prefix to the log and still pass the assertion.
   */

  describe('.log()', function() {
    it('should work without input', function() {
      const stub = sinon.spy(console, 'log');
      stubs.push(stub);

      logHelper.log();

      expect(console.log.callCount).to.equal(1);
      expect(console.log.calledWithMatch()).to.equal(true);
    });

    it('should work several inputs', function() {
      const stub = sinon.spy(console, 'log');
      stubs.push(stub);

      logHelper.log('', 'test', null, undefined, [], {});

      expect(console.log.callCount).to.equal(1);
      expect(console.log.calledWithMatch('', 'test', null, undefined, [], {})).to.equal(true);
    });

    it('should not log with debug log level', function() {
      const stub = sinon.spy(console, 'log');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.debug;
      logHelper.log('test');

      expect(console.log.callCount).to.equal(0);
    });

    it('should not log with warning log level', function() {
      const stub = sinon.spy(console, 'log');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.warning;
      logHelper.log('test');

      expect(console.log.callCount).to.equal(0);
    });

    it('should not log with error log level', function() {
      const stub = sinon.spy(console, 'log');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.error;
      logHelper.log('test');

      expect(console.log.callCount).to.equal(0);
    });
  });
});
