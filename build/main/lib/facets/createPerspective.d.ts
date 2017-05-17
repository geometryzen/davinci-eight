import { Perspective } from './Perspective';
export declare function createPerspective(options?: {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    projectionMatrixName?: string;
    viewMatrixName?: string;
}): Perspective;
