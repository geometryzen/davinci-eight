/**
* Creates and returns a workbench3D thing.
* @param canvas An HTML canvas element to be inserted.
*/
declare var workbench3D: (canvas: HTMLCanvasElement, renderer: any, camera: {
    aspect: number;
}, win?: Window) => {
    setUp: () => void;
    tearDown: () => void;
};
export = workbench3D;
