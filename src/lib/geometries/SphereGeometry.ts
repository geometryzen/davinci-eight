import { arc3 } from '../geometries/arc3';
import { ContextManager } from '../core/ContextManager';
import { Geometric3 } from '../math/Geometric3';
import { GeometryElements } from '../core/GeometryElements';
import { GeometryMode } from './GeometryMode';
import { isInteger } from '../checks/isInteger';
import { isNumber } from '../checks/isNumber';
import { isUndefined } from '../checks/isUndefined';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Primitive } from '../core/Primitive';
import { vec } from '../math/R3';
import { SphereGeometryOptions } from './SphereGeometryOptions';
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { SimplexMode } from './SimplexMode';
import { Spinor3 } from '../math/Spinor3';
import { SpinorE3 } from '../math/SpinorE3';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';

const DEFAULT_MERIDIAN = vec(0, 0, 1);
const DEFAULT_ZENITH = vec(0, 1, 0);
const DEFAULT_AZIMUTH_START = 0;
const DEFAULT_AZIMUTH_LENGTH = 2 * Math.PI;
const DEFAULT_AZIMUTH_SEGMENTS = 20;
const DEFAULT_ELEVATION_START = 0;
const DEFAULT_ELEVATION_LENGTH = Math.PI;
const DEFAULT_ELEVATION_SEGMENTS = 10;
const DEFAULT_RADIUS = 1;

function computeVertices(
    stress: VectorE3,
    tilt: SpinorE3,
    offset: VectorE3,
    azimuthStart: number,
    azimuthLength: number,
    azimuthSegments: number,
    elevationStart: number,
    elevationLength: number,
    elevationSegments: number,
    points: Vector3[],
    uvs: Vector2[]
) {

    const generator: SpinorE3 = Spinor3.dual(DEFAULT_ZENITH, false);
    const iLength = elevationSegments + 1;
    const jLength = azimuthSegments + 1;

    for (let i = 0; i < iLength; i++) {
        const v = i / elevationSegments;

        const θ: number = elevationStart + v * elevationLength;
        const arcRadius = Math.sin(θ);
        const R = Geometric3.fromSpinor(generator).scale(-azimuthStart / 2).exp();
        const begin = Geometric3.fromVector(DEFAULT_MERIDIAN).rotate(R).scale(arcRadius);

        const arcPoints: Vector3[] = arc3(begin, azimuthLength, generator, azimuthSegments);
        /**
         * Displacement that we need to add (in the axis direction) to each arc point to get the
         * distance position parallel to the axis correct.
         */
        const cosθ = Math.cos(θ);
        const displacement = cosθ;

        for (let j = 0; j < jLength; j++) {
            const point = arcPoints[j].add(DEFAULT_ZENITH, displacement).stress(stress).rotate(tilt).add(offset);
            points.push(point);
            const u = j / azimuthSegments;
            uvs.push(new Vector2([u, v]));
        }
    }
}

function quadIndex(i: number, j: number, innerSegments: number): number {
    return i * (innerSegments + 1) + j;
}

function vertexIndex(qIndex: number, n: number, innerSegments: number): number {
    switch (n) {
        case 0: return qIndex + 1;
        case 1: return qIndex;
        case 2: return qIndex + innerSegments + 1;
        case 3: return qIndex + innerSegments + 2;
    }
    throw new Error(`n must be in the range [0, 3]`);
}

function makeTriangles(points: Vector3[], uvs: Vector2[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexPrimitivesBuilder) {
    for (let i = 0; i < heightSegments; i++) {
        for (let j = 0; j < widthSegments; j++) {
            const qIndex = quadIndex(i, j, widthSegments);
            // Form a quadrilateral. v0 through v3 give the indices into the points array.
            const v0: number = vertexIndex(qIndex, 0, widthSegments);
            const v1: number = vertexIndex(qIndex, 1, widthSegments);
            const v2: number = vertexIndex(qIndex, 2, widthSegments);
            const v3: number = vertexIndex(qIndex, 3, widthSegments);

            // The normal vectors for the sphere are simply the normalized position vectors.
            const n0: Vector3 = Vector3.copy(points[v0]).normalize();
            const n1: Vector3 = Vector3.copy(points[v1]).normalize();
            const n2: Vector3 = Vector3.copy(points[v2]).normalize();
            const n3: Vector3 = Vector3.copy(points[v3]).normalize();

            // Grab the uv coordinates too.
            const uv0: Vector2 = uvs[v0].clone();
            const uv1: Vector2 = uvs[v1].clone();
            const uv2: Vector2 = uvs[v2].clone();
            const uv3: Vector2 = uvs[v3].clone();

            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            /*
            if (Math.abs(points[v0].y) === radius) {
              uv0.x = (uv0.x + uv1.x) / 2;
              geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (Math.abs(points[v2].y) === radius) {
              uv2.x = (uv2.x + uv3.x) / 2;
              geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
              // The other patches create two triangles.
              geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3])
              geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1])
            }
            */
            geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3]);
            geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1]);
        }
    }
}

function makeLineSegments(points: Vector3[], uvs: Vector2[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexPrimitivesBuilder) {
    for (let i = 0; i < heightSegments; i++) {
        for (let j = 0; j < widthSegments; j++) {
            const qIndex = quadIndex(i, j, widthSegments);
            const v0: number = vertexIndex(qIndex, 0, widthSegments);
            const v1: number = vertexIndex(qIndex, 1, widthSegments);
            const v2: number = vertexIndex(qIndex, 2, widthSegments);
            const v3: number = vertexIndex(qIndex, 3, widthSegments);

            // The normal vectors for the sphere are simply the normalized position vectors.
            const n0: Vector3 = Vector3.copy(points[v0]).normalize();
            const n1: Vector3 = Vector3.copy(points[v1]).normalize();
            const n2: Vector3 = Vector3.copy(points[v2]).normalize();
            const n3: Vector3 = Vector3.copy(points[v3]).normalize();

            // Grab the uv coordinates too.
            const uv0: Vector2 = uvs[v0].clone();
            const uv1: Vector2 = uvs[v1].clone();
            const uv2: Vector2 = uvs[v2].clone();
            const uv3: Vector2 = uvs[v3].clone();

            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            /*
            if (Math.abs(points[v0].y) === radius) {
              uv0.x = (uv0.x + uv1.x) / 2;
              geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (Math.abs(points[v2].y) === radius) {
              uv2.x = (uv2.x + uv3.x) / 2;
              geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
              geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1])
              geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2])
              geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3])
              geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0])
            }
            */
            geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1]);
            geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2]);
            geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3]);
            geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0]);
        }
    }
}

function makePoints(points: Vector3[], uvs: Vector2[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexPrimitivesBuilder) {
    for (let i = 0; i < heightSegments; i++) {
        for (let j = 0; j < widthSegments; j++) {
            const qIndex = quadIndex(i, j, widthSegments);
            const v0: number = vertexIndex(qIndex, 0, widthSegments);
            const v1: number = vertexIndex(qIndex, 1, widthSegments);
            const v2: number = vertexIndex(qIndex, 2, widthSegments);
            const v3: number = vertexIndex(qIndex, 3, widthSegments);

            // The normal vectors for the sphere are simply the normalized position vectors.
            const n0: Vector3 = Vector3.copy(points[v0]).normalize();
            const n1: Vector3 = Vector3.copy(points[v1]).normalize();
            const n2: Vector3 = Vector3.copy(points[v2]).normalize();
            const n3: Vector3 = Vector3.copy(points[v3]).normalize();

            // Grab the uv coordinates too.
            const uv0: Vector2 = uvs[v0].clone();
            const uv1: Vector2 = uvs[v1].clone();
            const uv2: Vector2 = uvs[v2].clone();
            const uv3: Vector2 = uvs[v3].clone();

            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            /*
            if (Math.abs(points[v0].y) === radius) {
              uv0.x = (uv0.x + uv1.x) / 2;
              geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (Math.abs(points[v2].y) === radius) {
              uv2.x = (uv2.x + uv3.x) / 2;
              geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
              geometry.point([points[v0]], [n0], [uv0])
              geometry.point([points[v1]], [n1], [uv1])
              geometry.point([points[v2]], [n2], [uv2])
              geometry.point([points[v3]], [n3], [uv3])
            }
            */
            geometry.point([points[v0]], [n0], [uv0]);
            geometry.point([points[v1]], [n1], [uv1]);
            geometry.point([points[v2]], [n2], [uv2]);
            geometry.point([points[v3]], [n3], [uv3]);
        }
    }
}

class SphereSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
    public tilt = Spinor3.one.clone();
    public azimuthStart = DEFAULT_AZIMUTH_START;
    public azimuthLength = DEFAULT_AZIMUTH_LENGTH;
    public azimuthSegments = DEFAULT_AZIMUTH_SEGMENTS;
    public elevationStart = DEFAULT_ELEVATION_START;
    public elevationLength = DEFAULT_ELEVATION_LENGTH;
    public elevationSegments = DEFAULT_ELEVATION_SEGMENTS;

    constructor() {
        super();
        this.setModified(true);
        this.regenerate();
    }

    get radius(): number {
        return this.stress.x;
    }
    set radius(radius: number) {
        mustBeNumber('radius', radius);
        this.stress.x = radius;
        this.stress.y = radius;
        this.stress.z = radius;
    }
    public isModified(): boolean {
        return super.isModified();
    }
    public setModified(modified: boolean): this {
        super.setModified(modified);
        return this;
    }
    protected regenerate(): void {

        this.data = [];

        // Output. Could this be {[name:string]:VertexN<number>}[]
        const points: Vector3[] = [];
        const uvs: Vector2[] = [];

        computeVertices(
            this.stress, this.tilt, this.offset,
            this.azimuthStart, this.azimuthLength, this.azimuthSegments,
            this.elevationStart, this.elevationLength, this.elevationSegments,
            points, uvs);

        switch (this.k) {
            case SimplexMode.EMPTY: {
                makeTriangles(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            case SimplexMode.POINT: {
                makePoints(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            case SimplexMode.LINE: {
                makeLineSegments(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            case SimplexMode.TRIANGLE: {
                makeTriangles(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            default: {
                console.warn(this.k + "-simplex is not supported for geometry generation.");
            }
        }

        this.setModified(false);
    }
}

function spherePrimitive(options: SphereGeometryOptions = { kind: 'SphereGeometry' }): Primitive {

    const builder = new SphereSimplexPrimitivesBuilder();

    // Radius
    if (isNumber(options.radius)) {
        builder.radius = options.radius;
    }
    else if (isUndefined(options.radius)) {
        builder.radius = DEFAULT_RADIUS;
    }
    else {
        mustBeNumber('radius', options.radius);
    }

    if (isInteger(options.mode)) {
        switch (options.mode) {
            case GeometryMode.POINT: {
                builder.k = SimplexMode.POINT;
                break;
            }
            case GeometryMode.WIRE: {
                builder.k = SimplexMode.LINE;
                break;
            }
            case GeometryMode.MESH: {
                builder.k = SimplexMode.TRIANGLE;
                break;
            }
            default: {
                throw new Error(`options.mode must be POINT=${GeometryMode.POINT} or WIRE=${GeometryMode.WIRE} or MESH=${GeometryMode.MESH}.`);
            }
        }
    }
    else if (isUndefined(options.mode)) {
        builder.k = SimplexMode.TRIANGLE;
    }
    else {
        mustBeInteger('mode', options.mode);
    }

    // Azimuth Start
    if (isNumber(options.azimuthStart)) {
        builder.azimuthStart = options.azimuthStart;
    }
    else if (isUndefined(options.azimuthStart)) {
        builder.azimuthStart = DEFAULT_AZIMUTH_START;
    }
    else {
        mustBeNumber('azimuthStart', options.azimuthStart);
    }
    // Azimuth Length
    if (isNumber(options.azimuthLength)) {
        builder.azimuthLength = options.azimuthLength;
    }
    else if (isUndefined(options.azimuthLength)) {
        builder.azimuthLength = DEFAULT_AZIMUTH_LENGTH;
    }
    else {
        mustBeNumber('azimuthLength', options.azimuthLength);
    }
    // Azimuth Segments
    if (isInteger(options.azimuthSegments)) {
        builder.azimuthSegments = mustBeGE('azimuthSegements', options.azimuthSegments, 3);
    }
    else if (isUndefined(options.azimuthSegments)) {
        builder.azimuthSegments = DEFAULT_AZIMUTH_SEGMENTS;
    }
    else {
        mustBeInteger('azimuthSegments', options.azimuthSegments);
    }
    // Elevation Start
    if (isNumber(options.elevationStart)) {
        builder.elevationStart = options.elevationStart;
    }
    else if (isUndefined(options.elevationStart)) {
        builder.elevationStart = DEFAULT_ELEVATION_START;
    }
    else {
        mustBeNumber('elevationStart', options.elevationStart);
    }
    // Elevation Length
    if (isNumber(options.elevationLength)) {
        builder.elevationLength = options.elevationLength;
    }
    else if (isUndefined(options.elevationLength)) {
        builder.elevationLength = DEFAULT_ELEVATION_LENGTH;
    }
    else {
        mustBeNumber('elevationLength', options.elevationLength);
    }
    // Elevation Segments
    if (isInteger(options.elevationSegments)) {
        builder.elevationSegments = mustBeGE('elevationSegments', options.elevationSegments, 2);
    }
    else if (isUndefined(options.elevationSegments)) {
        builder.elevationSegments = DEFAULT_ELEVATION_SEGMENTS;
    }
    else {
        mustBeInteger('elevationSegments', options.elevationSegments);
    }
    if (options.stress) {
        builder.stress.copy(options.stress);
    }
    if (options.offset) {
        builder.offset.copy(options.offset);
    }
    const primitives = builder.toPrimitives();
    if (primitives.length === 1) {
        return primitives[0];
    }
    else {
        throw new Error("Expecting SphereSimplexPrimitivesBuilder to return one Primitive.");
    }
}

/**
 * A convenience class for creating a sphere.
 */
export class SphereGeometry extends GeometryElements {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: SphereGeometryOptions = { kind: 'SphereGeometry' }, levelUp = 0) {
        super(contextManager, spherePrimitive(options), options, levelUp + 1);
        this.setLoggingName('SphereGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('SphereGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
