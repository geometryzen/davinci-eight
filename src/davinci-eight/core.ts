import ErrorMode from './core/ErrorMode'

class Eight {
    errorMode: ErrorMode;
    strict: boolean;
    GITHUB: string;
    LAST_MODIFIED: string;
    NAMESPACE: string;
    VERSION: string;
    logging: { [name: string]: number };

    constructor() {
        this.errorMode = ErrorMode.STRICT;
        this.strict = false;
        this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
        this.LAST_MODIFIED = '2016-03-03';
        this.NAMESPACE = 'EIGHT';
        this.VERSION = '2.205.0';
        this.logging = {};
    }
}

/**
 *
 */
const core = new Eight()

export default core;
