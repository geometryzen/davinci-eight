class Eight {
    /**
     * The GitHub URL of the repository.
     */
    GITHUB: string;
    /**
     * The last modification date in YYYY-MM-DD format.
     */
    LAST_MODIFIED: string;
    /**
     * The namespace used for traditional JavaScript module loading.
     */
    NAMESPACE: string;
    /**
     * The semantic version number of this library, i.e., (major.minor.patch) format.
     */
    VERSION: string;

    constructor() {
        this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
        this.LAST_MODIFIED = '2017-04-21';
        this.NAMESPACE = 'EIGHT';
        this.VERSION = '6.0.10';
    }

    log(message?: any): void {
        // This should allow us to unit test and run in environments without a console.
        console.log(message);
    }

    info(message?: any): void {
        // This should allow us to unit test and run in environments without a console.
        console.log(message);
    }

    warn(message?: any): void {
        // This should allow us to unit test and run in environments without a console.
        console.warn(message);
    }

    error(message?: any): void {
        // This should allow us to unit test and run in environments without a console.
        console.error(message);
    }
}

/**
 *
 */
const config = new Eight();

export default config;
