/**
 *
 */
export interface WindowAnimationRunner {

    /**
     * @method start
     * @return {void}
     */
    start(): void;

    /**
     * @method stop
     * @return {void}
     */
    stop(): void;

    /**
     * @method reset
     * @return {void}
     */
    reset(): void;

    /**
     * @method lap
     * @return {void}
     */
    lap(): void;

    /**
     * @property time
     * @type number
     * @readOnly
     */
    time: number;

    /**
     * @property isRunning
     * @type boolean
     * @readOnly
     */
    isRunning: boolean;

    /**
     * @property isPaused
     * @type boolean
     * @readOnly
     */
    isPaused: boolean;
}
