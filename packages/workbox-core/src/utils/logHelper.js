class LogHelper {
  constructor() {
    // TODO: Set initial log level
    this.logLevel = this.LOG_LEVELS.verbose;
  }

  get LOG_LEVELS() {
    return {
      verbose: 0,
      debug: 1,
      warning: 2,
      error: 3,
    };
  }

  log() {
    console.log(...arguments);
  }

  warn() {
    console.warn(...arguments);
  }

  error() {
    console.error(...arguments);
  }
}

export default new LogHelper();
