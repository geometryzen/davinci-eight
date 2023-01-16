/**
 * @hidden
 */
export class Eight {
    /**
     * The GitHub URL of the repository.
     */
    readonly GITHUB: string;
    /**
     * The name used for marketing purposes.
     */
    readonly MARKETING_NAME: string;

    constructor() {
        this.GITHUB = "https://github.com/geometryzen/davinci-eight";
        this.MARKETING_NAME = "DaVinci Eight";
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
