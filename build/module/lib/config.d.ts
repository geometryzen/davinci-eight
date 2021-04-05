/**
 * @hidden
 */
export declare class Eight {
    /**
     * The GitHub URL of the repository.
     */
    readonly GITHUB: string;
    /**
     * The last modification date in YYYY-MM-DD format.
     */
    readonly LAST_MODIFIED: string;
    /**
     * The name used for marketing purposes.
     */
    readonly MARKETING_NAME: string;
    /**
     * The semantic version number of this library, i.e., (major.minor.patch) format.
     */
    readonly VERSION: string;
    constructor();
    log(message?: any): void;
    info(message?: any): void;
    warn(message?: any): void;
    error(message?: any): void;
}
/**
 * @hidden
 */
export declare const config: Eight;
