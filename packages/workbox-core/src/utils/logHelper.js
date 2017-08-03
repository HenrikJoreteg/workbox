import assert from './assert';

class LogHelper {
  constructor() {
    // TODO: Set initial log level
    this._logLevel = this.LOG_LEVELS.verbose;
  }

  get LOG_LEVELS() {
    return {
      verbose: 0,
      debug: 1,
      warning: 2,
      error: 3,
    };
  }

  set logLevel(newLevel) {
    assert.isNumber(newLevel, new Error(`logHelper.logLevel must be a number.`));

    if (newLevel > this.LOG_LEVELS.error ||
      newLevel < this.LOG_LEVELS.verbose) {
      // TODO: Throw workbox error + code
      throw new Error(`Invalid new level`);
    }

    this._logLevel = newLevel;
  }

  _print(logFunction, logArgs, minLevel) {
    if (this._logLevel > minLevel) {
      return;
    }

    logFunction(...logArgs);
  }
  log() {
    this._print(console.log, arguments, this.LOG_LEVELS.verbose);
  }

  debug() {
    this._print(console.debug, arguments, this.LOG_LEVELS.debug);
  }

  warn() {
    this._print(console.warn, arguments, this.LOG_LEVELS.warn);
  }

  error() {
    this._print(console.error, arguments, this.LOG_LEVELS.error);
  }
}

export default new LogHelper();
