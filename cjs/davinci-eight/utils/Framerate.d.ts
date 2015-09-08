declare class Framerate {
    private renderTime;
    private framerates;
    private numFramerates;
    private framerateUpdateInterval;
    private id;
    constructor(id: string);
    updateFramerate(): void;
    snapshot(): void;
}
export = Framerate;
