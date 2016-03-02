import ErrorMode from './core/ErrorMode'
class Eight {
    errorMode: ErrorMode;
    safemode: boolean;
    strict: boolean;
    GITHUB: string;
    LAST_MODIFIED: string;
    NAMESPACE: string;
    verbose: boolean;
    VERSION: string;
    logging: { [name: string]: number };

    constructor() {
        this.errorMode = ErrorMode.STRICT;
        this.safemode = true;
        this.strict = false;
        this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
        this.LAST_MODIFIED = '2016-03-02';
        this.NAMESPACE = 'EIGHT';
        this.verbose = false;
        this.VERSION = '2.204.0';
        this.logging = {};
    }
}

/**
 *
 */
const core = new Eight()

export default core;
