class Eight {
    safemode: boolean;
    strict: boolean;
    GITHUB: string;
    LAST_MODIFIED: string;
    NAMESPACE: string;
    verbose: boolean;
    VERSION: string;
    logging: { [name: string]: number };

    constructor() {
        this.safemode = true;
        this.strict = false;
        this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
        this.LAST_MODIFIED = '2016-02-21';
        this.NAMESPACE = 'EIGHT';
        this.verbose = false;
        this.VERSION = '2.193.0';
        this.logging = {};
    }
}

/**
 *
 */
const core = new Eight()

export default core;
