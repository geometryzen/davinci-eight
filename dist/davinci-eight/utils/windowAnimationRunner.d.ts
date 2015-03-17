declare var windowAnimationRunner: (tick: (t: number) => void, terminate: (t: number) => void, setUp: () => void, tearDown: (ex: any) => void, win?: Window) => {
    start: () => void;
    stop: () => void;
};
export = windowAnimationRunner;
