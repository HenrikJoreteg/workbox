import chai from 'chai';

import logHelper from '../../../src/utils/logHelper';

const expect = chai.expect;

describe(`logHelper - ${process.env.NODE_ENV}`, function() {
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

  describe('.log()', function() {

    it('should work without input', function() {
      logHelper.log();
    });

    it('should work several inputs', function() {
      logHelper.log('', 'test', null, undefined, [], {});
    });
  });
});
