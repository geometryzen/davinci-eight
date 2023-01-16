import { config } from '../config';
import { ShareableBase } from '../core/ShareableBase';

/**
 * Displays details about EIGHT to the console.
 * @hidden
 */
export class EIGHTLogger extends ShareableBase {

    constructor() {
        super();
        this.setLoggingName('EIGHTLogger');
    }

    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }

    contextFree(): void {
        // Does nothing.
    }

    /**
     * Logs the namespace, version, GitHub URL, and last modified date to the console.
     */
    contextGain(): void {
        console.log(`${config.MARKETING_NAME} (${config.GITHUB})`);
    }

    contextLost(): void {
        // Do nothing.
    }
}
