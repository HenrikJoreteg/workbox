import assert from '../utils/assert';
import logHelper from '../utils/logHelper';

export default class WorkboxCore {
  get INTERNAL() {
    if (this._internal) {
      return this._internal;
    }

    this._internal = {
      logHelper,
    };

    if (process.env.NODE_ENV !== 'production') {
      this._internal.assert = assert;
    }

    return this._internal;
  }
}
