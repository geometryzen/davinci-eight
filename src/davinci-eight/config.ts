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
        this.LAST_MODIFIED = '2016-07-05';
        this.NAMESPACE = 'EIGHT';
        this.VERSION = '2.256.0';
    }

    get errorMode() {
        return this._errorMode
    }
    set errorMode(errorMode: ErrorMode) {
        switch (errorMode) {
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

    log(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.log(message)
    }

    info(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.info(message)
    }

    warn(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.warn(message)
    }

    error(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.error(message)
    }
}

/**
 *
 */
const config = new Eight()

export default config;
