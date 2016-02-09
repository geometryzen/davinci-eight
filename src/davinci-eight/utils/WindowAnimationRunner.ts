interface WindowAnimationRunner {
    start(): void;
    stop(): void;
    reset(): void;
    lap(): void;
    time: number;
    isRunning: boolean;
    isPaused: boolean;
}

export default WindowAnimationRunner;