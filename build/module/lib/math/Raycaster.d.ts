import { Ray } from './Ray';
import { Vector3 } from './Vector3';
export interface Raycastable {
    visible: boolean;
    distance: number;
    raycast(raycaster: Raycaster, intersects: Raycastable[]): void;
    children: Raycastable[];
}
export declare class Raycaster {
    ray: Ray;
    near: number;
    far: number;
    params: {
        Mesh: {};
        Line: {};
        LOD: {};
        Points: {};
        Sprite: {};
    };
    constructor(origin?: Vector3, direction?: Vector3, near?: number, far?: number);
    set(origin: Vector3, direction: Vector3): void;
    intersectObject(object: Raycastable, recursive: boolean): Raycastable[];
    intersectObjects(objects: Raycastable[], recursive: boolean): Raycastable[];
}
