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
        this.GITHUB = "https://github.com/geometryzen/g3o";
        this.MARKETING_NAME = "g30";
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
