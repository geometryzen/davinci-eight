class Eight {
    fastPath: boolean;
    strict: boolean;
    GITHUB: string;
    LAST_MODIFIED: string;
    NAMESPACE: string;
    verbose: boolean;
    VERSION: string;
    logging: { [name: string]: number };

    constructor() {
        this.fastPath = false;
        this.strict = false;
        this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
        this.LAST_MODIFIED = '2016-02-06';
        this.NAMESPACE = 'EIGHT';
        this.verbose = false;
        this.VERSION = '2.177.0';
        this.logging = {};
    }
}

/**
 *
 */
const core = new Eight()

export default core;
