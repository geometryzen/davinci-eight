import { Ray } from './Ray';
import { Vector3 } from './Vector3';

/**
 * @hidden
 */
export interface Raycastable {
    visible: boolean;
    distance: number;
    raycast(raycaster: Raycaster, intersects: Raycastable[]): void;
    children: Raycastable[];
}

//    linePrecision: 1,

/**
 * @hidden
 */
function ascSort(a: Raycastable, b: Raycastable): number {
    return a.distance - b.distance;
}

/**
 * @hidden
 */
function intersectObject(object: Raycastable, raycaster: Raycaster, intersects: Raycastable[], recursive: boolean) {

    if (object.visible === false) return;
    object.raycast(raycaster, intersects);
    if (recursive === true) {
        const children = object.children;
        for (let i = 0, l = children.length; i < l; i++) {
            intersectObject(children[i], raycaster, intersects, true);
        }
    }
}

/**
 * @hidden
 */
export class Raycaster {
    ray: Ray;
    near: number;
    far: number;
    params: { Mesh: {}; Line: {}; LOD: {}; Points: {}; Sprite: {} };

    constructor(origin?: Vector3, direction?: Vector3, near?: number, far?: number) {

        this.ray = new Ray(origin, direction);
        // direction is assumed to be normalized (for accurate distance calculations)

        this.near = near || 0;
        this.far = far || Infinity;

        this.params = {
            Mesh: {},
            Line: {},
            LOD: {},
            Points: { threshold: 1 },
            Sprite: {}
        };

        Object.defineProperties(this.params, {
            PointCloud: {
                get: function () {
                    console.warn('THREE.Raycaster: params.PointCloud has been renamed to params.Points.');
                    return this.Points;
                }
            }
        });

    }
    set(origin: Vector3, direction: Vector3): void {
        // direction is assumed to be normalized (for accurate distance calculations)
        this.ray.set(origin, direction);
    }
    /*
    setFromCamera(coords, camera) {
        if ((camera && camera.isPerspectiveCamera)) {
            this.ray.origin.setFromMatrixPosition(camera.matrixWorld);
            this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();

        } else if ((camera && camera.isOrthographicCamera)) {
            this.ray.origin.set(coords.x, coords.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera); // set origin in plane of camera
            this.ray.direction.set(0, 0, - 1).transformDirection(camera.matrixWorld);
        } else {
            console.error('THREE.Raycaster: Unsupported camera type.');
        }
    }
    */
    intersectObject(object: Raycastable, recursive: boolean): Raycastable[] {
        const intersects: Raycastable[] = [];
        intersectObject(object, this, intersects, recursive);
        intersects.sort(ascSort);
        return intersects;
    }
    intersectObjects(objects: Raycastable[], recursive: boolean): Raycastable[] {
        const intersects: Raycastable[] = [];
        if (Array.isArray(objects) === false) {
            console.warn('Raycaster.intersectObjects: objects is not an Array.');
            return intersects;
        }
        for (let i = 0, l = objects.length; i < l; i++) {
            intersectObject(objects[i], this, intersects, recursive);
        }
        intersects.sort(ascSort);
        return intersects;
    }
}
