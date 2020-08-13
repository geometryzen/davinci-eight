export class Eight {
    /**
     * The GitHub URL of the repository.
     */
    readonly GITHUB: "https://github.com/geometryzen/davinci-eight";
    /**
     * The last modification date in YYYY-MM-DD format.
     */
    readonly LAST_MODIFIED: "2020-08-13";
    /**
     * The name used for marketing purposes.
     */
    readonly MARKETING_NAME: "DaVinci eight";
    /**
     * The semantic version number of this library, i.e., (major.minor.patch) format.
     */
    readonly VERSION: "8.3.0";

    constructor() {
        this.GITHUB = "https://github.com/geometryzen/davinci-eight";
        this.LAST_MODIFIED = "2020-08-13";
        this.MARKETING_NAME = "DaVinci eight";
        this.VERSION = '8.3.0';
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
export const config = new Eight();
