/**
 * Creates and returns a workbench3D thing.
 * @param canvas An HTML canvas element to be inserted.
 * TODO: We should remove the camera as being too opinionated, replace with a callback providing
 */
declare var workbench3D: (canvas: HTMLCanvasElement, renderer: any, camera: {
    aspect: number;
}, win?: Window) => {
    setUp: () => void;
    tearDown: () => void;
};
export = workbench3D;
