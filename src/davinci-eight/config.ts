class Eight {
    GITHUB: string;
    LAST_MODIFIED: string;
    NAMESPACE: string;
    VERSION: string;

    constructor() {
        this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
        this.LAST_MODIFIED = '2016-08-12';
        this.NAMESPACE = 'EIGHT';
        this.VERSION = '2.295.0';
    }

    log(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.log(message)
    }

    info(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.info(message)
    }

    warn(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.warn(message)
    }

    error(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.error(message)
    }
}

/**
 *
 */
const config = new Eight()

export default config;
