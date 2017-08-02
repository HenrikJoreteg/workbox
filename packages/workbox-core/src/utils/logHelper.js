class LogHelper {
  constructor() {
    // TODO: Set initial log level
    this.logLevel = this.LOG_LEVELS.verbose;
  }

  get LOG_LEVELS() {
    return {
      verbose: 0,
      warning: 1,
      error: 2,
    };
  }

  log() {
    if (this.logLevel > this.LOG_LEVELS.version) {
      return;
    }

    console.log(...arguments);
  }

  warn() {
    if (this.logLevel > this.LOG_LEVELS.warning) {
      return;
    }

    console.warn(...arguments);
  }

  error() {
    console.error(...arguments);
  }
}

export default new LogHelper();
