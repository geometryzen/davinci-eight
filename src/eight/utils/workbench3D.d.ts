declare var workbench3D: (canvas: HTMLCanvasElement, renderer: any, camera: {
    aspect: number;
    updateProjectionMatrix: () => void;
}, win?: Window) => {
    setUp: () => void;
    tearDown: () => void;
};
export = workbench3D;
