import { ShareableBase } from '../core/ShareableBase';
/**
 * Displays details about EIGHT to the console.
 */
export declare class EIGHTLogger extends ShareableBase {
    constructor();
    protected destructor(levelUp: number): void;
    contextFree(): void;
    /**
     * Logs the namespace, version, GitHub URL, and last modified date to the console.
     */
    contextGain(): void;
    contextLost(): void;
}
