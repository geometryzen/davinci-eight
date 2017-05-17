export declare class Eight {
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
    constructor();
    log(message?: any): void;
    info(message?: any): void;
    warn(message?: any): void;
    error(message?: any): void;
}
/**
 *
 */
export declare const config: Eight;
