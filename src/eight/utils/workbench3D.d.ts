declare var workbench3D: (canvas: HTMLCanvasElement, renderer: any, camera: {
    aspect: number;
}, win?: Window) => {
    setUp: () => void;
    tearDown: () => void;
};
export = workbench3D;
