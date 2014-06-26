declare var perspectiveCamera: (fov?: number, aspect?: number, near?: number, far?: number) => {
    position: Euclidean3;
    attitude: Euclidean3;
    aspect: number;
    updateProjectionMatrix: () => void;
};
export = perspectiveCamera;
