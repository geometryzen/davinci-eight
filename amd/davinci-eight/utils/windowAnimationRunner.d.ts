declare var windowAnimationRunner: (tick: (time: number) => void, terminate: (time: number) => void, setUp: () => void, tearDown: (ex: any) => void, win?: Window) => {
    start: () => void;
    stop: () => void;
};
export = windowAnimationRunner;
