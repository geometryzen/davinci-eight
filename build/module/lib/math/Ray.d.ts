import { Matrix4 } from './Matrix4';
import { Vector3 } from './Vector3';
import { VectorE3 } from './VectorE3';
export declare class Ray {
    origin: Vector3;
    direction: Vector3;
    constructor(origin?: Vector3, direction?: Vector3);
    set(origin: Vector3, direction: Vector3): Ray;
    clone(): Ray;
    copy(ray: Ray): Ray;
    at(t: number, optionalTarget: Vector3): Vector3;
    lookAt(v: VectorE3): Ray;
    recast(t: number): Ray;
    closestPointToPoint(point: VectorE3, optionalTarget: Vector3): Vector3;
    distanceToPoint(point: VectorE3): number;
    distanceSqToPoint(point: VectorE3): number;
    distanceSqToSegment(v0: Vector3, v1: VectorE3, optionalPointOnRay: Vector3, optionalPointOnSegment: Vector3): number;
    intersectSphere(sphere: {
        center: VectorE3;
        radius: number;
    }, optionalTarget: Vector3): Vector3;
    intersectsSphere(sphere: {
        center: VectorE3;
        radius: number;
    }): boolean;
    distanceToPlane(plane: {
        normal: Vector3;
        distanceToPoint: (point: VectorE3) => number;
        constant: number;
    }): number;
    intersectPlane(plane: {
        normal: Vector3;
        distanceToPoint: (point: VectorE3) => number;
        constant: number;
    }, optionalTarget: Vector3): Vector3;
    intersectsPlane(plane: {
        normal: Vector3;
        distanceToPoint: (point: VectorE3) => number;
        constant: number;
    }): boolean;
    intersectBox(box: {
        min: VectorE3;
        max: VectorE3;
    }, optionalTarget: Vector3): Vector3;
    intersectsBox(box: {
        min: VectorE3;
        max: VectorE3;
    }): boolean;
    intersectTriangle(a: VectorE3, b: VectorE3, c: VectorE3, backfaceCulling: boolean, optionalTarget: Vector3): Vector3;
    applyMatrix4(matrix4: Matrix4): Ray;
    equals(ray: Ray): boolean;
}
