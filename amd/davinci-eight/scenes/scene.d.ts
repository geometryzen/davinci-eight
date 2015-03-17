declare var scene: () => {
    children: {
        onContextGain: (gl: WebGLRenderingContext) => void;
        onContextLoss: () => void;
        tearDown: () => void;
    }[];
    onContextGain: (gl: WebGLRenderingContext) => void;
    onContextLoss: () => void;
    tearDown: () => void;
    add: (child: {
        onContextGain: (gl: WebGLRenderingContext) => void;
        onContextLoss: () => void;
        tearDown: () => void;
    }) => void;
};
export = scene;
