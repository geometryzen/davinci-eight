import ErrorMode from './core/ErrorMode'

class Eight {
    private _errorMode: ErrorMode;
    GITHUB: string;
    LAST_MODIFIED: string;
    NAMESPACE: string;
    VERSION: string;

    constructor() {
        this._errorMode = ErrorMode.STRICT;
        this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
        this.LAST_MODIFIED = '2016-03-07';
        this.NAMESPACE = 'EIGHT';
        this.VERSION = '2.214.0';
    }
    get errorMode() {
      return this._errorMode
    }
    set errorMode(errorMode: ErrorMode) {
      switch(errorMode) {
        case ErrorMode.IGNORE:
        case ErrorMode.STRICT:
        case ErrorMode.WARNME: {
          this._errorMode = errorMode
        }
        break;
        default: {
          throw new Error("errorMode must be one of IGNORE, STRICT, or WARNME.")
        }
      }
    }
}

/**
 *
 */
const core = new Eight()

export default core;
