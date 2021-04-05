/**
 * @hidden
 */
export class Eight {
    /**
     * The GitHub URL of the repository.
     */
    readonly GITHUB: "https://github.com/geometryzen/davinci-eight";
    /**
     * The last modification date in YYYY-MM-DD format.
     */
    readonly LAST_MODIFIED: "2021-04-04";
    /**
     * The name used for marketing purposes.
     */
    readonly MARKETING_NAME: "DaVinci eight";
    /**
     * The semantic version number of this library, i.e., (major.minor.patch) format.
     */
    readonly VERSION: "8.4.13";

    constructor() {
        this.GITHUB = "https://github.com/geometryzen/davinci-eight";
        this.LAST_MODIFIED = "2021-04-04";
        this.MARKETING_NAME = "DaVinci eight";
        this.VERSION = "8.4.13";
    }

    log(message?: any): void {
        console.log(message);
    }

    info(message?: any): void {
        console.log(message);
    }

    warn(message?: any): void {
        console.warn(message);
    }

    error(message?: any): void {
        console.error(message);
    }
}

/**
 * @hidden
 */
export const config = new Eight();
