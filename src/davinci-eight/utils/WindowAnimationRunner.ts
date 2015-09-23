/**
 * @class WindowAnimationRunner
 */
interface WindowAnimationRunner
{
    /**
     * The `start` method puts the animation runner into the running state.
     * @method start
     * @return {void}
     */
    start(): void;
    /**
     * The `stop` method pauses the animation runner from the running state.
     * @method stop
     * @return {void}
     */
    stop(): void;
    /**
     * The `reset` method sets the time to zero from the paused state.
     * @method reset
     * @return {void}
     */
    reset(): void;
    /**
     * The `lap` method records the time in the running state.
     * @method lap
     * @return {void}
     */
    lap(): void;
    /**
     * The readonly `time` property contains the elapsed time on the animation runner.
     * @property time
     * @type {number}
     */
    time: number;
    /**
     * The readonly `isRunning` property determines whether the animation runner is running.
     * @property isRunning
     * @type {boolean}
     */
    isRunning: boolean;
    /**
     * The readonly `isPaused` property determines whether the animation runner as been paused.
     * @property isPaused
     * @type {boolean}
     */
    isPaused: boolean;
}

export = WindowAnimationRunner;