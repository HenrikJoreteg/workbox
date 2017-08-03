import chai from 'chai';
import sinon from 'sinon';

import logHelper from '../../../src/utils/logHelper';

const expect = chai.expect;

describe(`logHelper [${process.env.NODE_ENV}]`, function() {
  let stubs = [];

  beforeEach(function() {
    logHelper.logLevel = logHelper.LOG_LEVELS.verbose;
  });

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

  describe(`.logLevel (setter)`, function() {
    it(`should allow valid log levels`, function() {
      expect(() => {
        logHelper.logLevel = logHelper.LOG_LEVELS.verbose;
        logHelper.logLevel = logHelper.LOG_LEVELS.debug;
        logHelper.logLevel = logHelper.LOG_LEVELS.warning;
        logHelper.logLevel = logHelper.LOG_LEVELS.error;
      }).to.not.throw();
    });

    // TODO: Catch WorkboxError with error code
    it(`should not allow log level less than verbose`, function() {
      expect(() => {
        logHelper.logLevel = logHelper.LOG_LEVELS.verbose - 1;
      }).to.throw();
    });

    // TODO: Catch WorkboxError with error code
    it(`should not allow log level greater than error`, function() {
      expect(() => {
        logHelper.logLevel = logHelper.LOG_LEVELS.error + 1;
      }).to.throw();
    });

    // TODO: Catch WorkboxError with error code
    it(`should not allow non-number log levels`, function() {
      expect(() => {
        logHelper.logLevel = undefined;
      }).to.throw();

      expect(() => {
        logHelper.logLevel = null;
      }).to.throw();

      expect(() => {
        logHelper.logLevel = '';
      }).to.throw();

      expect(() => {
        logHelper.logLevel = [];
      }).to.throw();

      expect(() => {
        logHelper.logLevel = {};
      }).to.throw();
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

    it('should log with verbose log level', function() {
      const stub = sinon.spy(console, 'log');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.verbose;
      logHelper.log('test');

      expect(console.log.callCount).to.equal(1);
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

  describe('.debug()', function() {
    it('should work without input', function() {
      const stub = sinon.spy(console, 'debug');
      stubs.push(stub);

      logHelper.debug();

      expect(console.debug.callCount).to.equal(1);
      expect(console.debug.calledWithMatch()).to.equal(true);
    });

    it('should work several inputs', function() {
      const stub = sinon.spy(console, 'debug');
      stubs.push(stub);

      logHelper.debug('', 'test', null, undefined, [], {});

      expect(console.debug.callCount).to.equal(1);
      expect(console.debug.calledWithMatch('', 'test', null, undefined, [], {})).to.equal(true);
    });

    it('should log with verbose log level', function() {
      const stub = sinon.spy(console, 'debug');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.verbose;
      logHelper.debug('test');

      expect(console.debug.callCount).to.equal(1);
    });

    it('should log with debug log level', function() {
      const stub = sinon.spy(console, 'debug');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.debug;
      logHelper.debug('test');

      expect(console.debug.callCount).to.equal(1);
    });

    it('should not log with warning log level', function() {
      const stub = sinon.spy(console, 'debug');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.warning;
      logHelper.debug('test');

      expect(console.debug.callCount).to.equal(0);
    });

    it('should not log with error log level', function() {
      const stub = sinon.spy(console, 'debug');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.error;
      logHelper.debug('test');

      expect(console.debug.callCount).to.equal(0);
    });
  });

  describe('.warn()', function() {
    it('should work without input', function() {
      const stub = sinon.spy(console, 'warn');
      stubs.push(stub);

      logHelper.warn();

      expect(console.warn.callCount).to.equal(1);
      expect(console.warn.calledWithMatch()).to.equal(true);
    });

    it('should work several inputs', function() {
      const stub = sinon.spy(console, 'warn');
      stubs.push(stub);

      logHelper.warn('', 'test', null, undefined, [], {});

      expect(console.warn.callCount).to.equal(1);
      expect(console.warn.calledWithMatch('', 'test', null, undefined, [], {})).to.equal(true);
    });

    it('should log with verbose log level', function() {
      const stub = sinon.spy(console, 'warn');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.verbose;
      logHelper.warn('test');

      expect(console.warn.callCount).to.equal(1);
    });

    it('should log with debug log level', function() {
      const stub = sinon.spy(console, 'warn');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.debug;
      logHelper.warn('test');

      expect(console.warn.callCount).to.equal(1);
    });

    it('should log with warning log level', function() {
      const stub = sinon.spy(console, 'warn');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.warning;
      logHelper.warn('test');

      expect(console.warn.callCount).to.equal(1);
    });

    it('should not log with error log level', function() {
      const stub = sinon.spy(console, 'warn');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.error;
      logHelper.warn('test');

      expect(console.warn.callCount).to.equal(0);
    });
  });

  describe('.error()', function() {
    it('should work without input', function() {
      const stub = sinon.spy(console, 'error');
      stubs.push(stub);

      logHelper.error();

      expect(console.error.callCount).to.equal(1);
      expect(console.error.calledWithMatch()).to.equal(true);
    });

    it('should work several inputs', function() {
      const stub = sinon.spy(console, 'error');
      stubs.push(stub);

      logHelper.error('', 'test', null, undefined, [], {});

      expect(console.error.callCount).to.equal(1);
      expect(console.error.calledWithMatch('', 'test', null, undefined, [], {})).to.equal(true);
    });

    it('should log with verbose log level', function() {
      const stub = sinon.spy(console, 'error');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.verbose;
      logHelper.error('test');

      expect(console.error.callCount).to.equal(1);
    });

    it('should log with error log level', function() {
      const stub = sinon.spy(console, 'error');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.debug;
      logHelper.error('test');

      expect(console.error.callCount).to.equal(1);
    });

    it('should log with warning log level', function() {
      const stub = sinon.spy(console, 'error');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.warning;
      logHelper.error('test');

      expect(console.error.callCount).to.equal(1);
    });

    it('should log with error log level', function() {
      const stub = sinon.spy(console, 'error');
      stubs.push(stub);

      logHelper.logLevel = logHelper.LOG_LEVELS.error;
      logHelper.error('test');

      expect(console.error.callCount).to.equal(1);
    });
  });
});
