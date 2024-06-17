import { Engine } from "../core/Engine";
import { refChange } from "../core/refChange";
import { vec } from "../math/R3";
// import { Spinor3 } from '../math/Spinor3';
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";
import {
    computeSphereVerticesAndCoordinates,
    DEFAULT_AZIMUTH_LENGTH,
    DEFAULT_AZIMUTH_SEGMENTS,
    DEFAULT_AZIMUTH_START,
    DEFAULT_ELEVATION_LENGTH,
    DEFAULT_ELEVATION_SEGMENTS,
    DEFAULT_ELEVATION_START,
    DEFAULT_MERIDIAN,
    DEFAULT_OFFSET,
    DEFAULT_STRESS,
    DEFAULT_TILT,
    DEFAULT_ZENITH,
    SphereGeometry
} from "./SphereGeometry";
import { SphereGeometryOptions } from "./SphereGeometryOptions";

// import Spinor3 from '../math/Spinor3';
// import Vector3 from '../math/Vector3';

// const e2 = Vector3.vector(0, 1, 0);
// const e3 = Vector3.vector(0, 0, 1);

/**
 * The decimal place up to which the numbers should agree.
 * Make this as large as possible while avoiding rounding errors.
 */
/**
 * @hidden
 */
const PRECISION = 13;
/**
 * @hidden
 */
const MATHEMATICS_ZENITH = vec(0, 0, 1);
/**
 * @hidden
 */
const MATHEMATICS_MERIDIAN = vec(1, 0, 0);
/**
 * @hidden
 */
const MATHEMATICS_NADIR = vec(0, 0, -1);

describe("SphereGeometry", function () {
    it("new-release", function () {
        refChange("quiet");
        refChange("reset");
        refChange("quiet");
        refChange("start");
        const engine = new Engine();
        const geometry = new SphereGeometry(engine);
        expect(geometry.isZombie()).toBe(false);
        geometry.release();
        expect(geometry.isZombie()).toBe(true);
        engine.release();
        refChange("stop");
        const outstanding = refChange("dump");
        expect(outstanding).toBe(0);
        refChange("quiet");
        refChange("reset");
    });
    it("constructor-destructor", function () {
        refChange("quiet");
        refChange("reset");
        refChange("quiet");
        refChange("start");
        const engine = new Engine();
        const options: SphereGeometryOptions = {};
        const geometry = new SphereGeometry(engine, options);
        geometry.release();
        engine.release();
        expect(geometry.isZombie()).toBe(true);
        refChange("stop");
        refChange("dump");
    });
    it("resurrector-destructor", function () {
        refChange("quiet");
        refChange("reset");
        refChange("quiet");
        refChange("start");
        const engine = new Engine();
        const options: SphereGeometryOptions = {};
        const geometry = new SphereGeometry(engine, options);
        geometry.release();
        engine.release();
        refChange("stop");
        refChange("dump");
        refChange("reset");
        refChange("quiet");
        refChange("start");
        expect(geometry.isZombie()).toBe(true);
        geometry.addRef();
        geometry.release();
        refChange("stop");
        refChange("dump");
        refChange("reset");
    });
});
describe("computeVerticesAndPoints", function () {
    it("should produce 703 points and uvs for the default arguments", function () {
        const pts: Vector3[] = [];
        const uvs: Vector2[] = [];

        const zenith = DEFAULT_ZENITH;
        const meridian = DEFAULT_MERIDIAN;
        const stress = DEFAULT_STRESS;
        const tilt = DEFAULT_TILT;
        const offset = DEFAULT_OFFSET;

        const azimuthStart = DEFAULT_AZIMUTH_START;
        const azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        const azimuthSegments = DEFAULT_AZIMUTH_SEGMENTS;

        const elevationStart = DEFAULT_ELEVATION_START;
        const elevationLength = DEFAULT_ELEVATION_LENGTH;
        const elevationSegments = DEFAULT_ELEVATION_SEGMENTS;

        computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, pts, uvs);

        expect(pts.length).toBe(703);
        expect(uvs.length).toBe(703);

        const point = pts[0];
        expect(point.x).toBe(0);
        expect(point.y).toBe(1);
        expect(point.z).toBe(0);

        const uv = uvs[0];
        expect(uv.x).toBe(0);
        expect(uv.y).toBe(0);
    });
    it("should produce 19 points and uvs for the default arguments and zero azimuth segments", function () {
        const pts: Vector3[] = [];
        const uvs: Vector2[] = [];

        const zenith = DEFAULT_ZENITH;
        const meridian = DEFAULT_MERIDIAN;
        const stress = DEFAULT_STRESS;
        const tilt = DEFAULT_TILT;
        const offset = DEFAULT_OFFSET;

        const azimuthStart = DEFAULT_AZIMUTH_START;
        const azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        const azimuthSegments = 0;

        const elevationStart = DEFAULT_ELEVATION_START;
        const elevationLength = DEFAULT_ELEVATION_LENGTH;
        const elevationSegments = DEFAULT_ELEVATION_SEGMENTS;

        computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, pts, uvs);

        expect(pts.length).toBe(19);
        expect(uvs.length).toBe(19);

        const point = pts[0];
        expect(point.x).toBe(0);
        expect(point.y).toBe(1);
        expect(point.z).toBe(0);

        const uv = uvs[0];
        expect(uv.x).toBe(0);
        expect(uv.y).toBe(0);
    });
    it("should produce 37 points and uvs for the default arguments and zero elevation segments", function () {
        const pts: Vector3[] = [];
        const uvs: Vector2[] = [];

        const zenith = DEFAULT_ZENITH;
        const meridian = DEFAULT_MERIDIAN;
        const stress = DEFAULT_STRESS;
        const tilt = DEFAULT_TILT;
        const offset = DEFAULT_OFFSET;

        const azimuthStart = DEFAULT_AZIMUTH_START;
        const azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        const azimuthSegments = DEFAULT_AZIMUTH_SEGMENTS;

        const elevationStart = DEFAULT_ELEVATION_START;
        const elevationLength = DEFAULT_ELEVATION_LENGTH;
        const elevationSegments = 0;

        computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, pts, uvs);

        expect(pts.length).toBe(37);
        expect(uvs.length).toBe(37);

        const point = pts[0];
        expect(point.x).toBe(0);
        expect(point.y).toBe(1);
        expect(point.z).toBe(0);

        const uv = uvs[0];
        expect(uv.x).toBe(0);
        expect(uv.y).toBe(0);
    });
    it("should produce 1 point and uv for the default arguments and zero azimuth and zero elevation segments", function () {
        const pts: Vector3[] = [];
        const uvs: Vector2[] = [];

        const zenith = DEFAULT_ZENITH;
        const meridian = DEFAULT_MERIDIAN;
        const stress = DEFAULT_STRESS;
        const tilt = DEFAULT_TILT;
        const offset = DEFAULT_OFFSET;

        const azimuthStart = DEFAULT_AZIMUTH_START;
        const azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        const azimuthSegments = 0;

        const elevationStart = DEFAULT_ELEVATION_START;
        const elevationLength = DEFAULT_ELEVATION_LENGTH;
        const elevationSegments = 0;

        computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, pts, uvs);

        expect(pts.length).toBe(1);
        expect(uvs.length).toBe(1);

        const point = pts[0];
        expect(point.x).toBe(0);
        expect(point.y).toBe(1);
        expect(point.z).toBe(0);

        const uv = uvs[0];
        expect(uv.x).toBe(0);
        expect(uv.y).toBe(0);
    });
    it("single point tracks the zenith", function () {
        const pts: Vector3[] = [];
        const uvs: Vector2[] = [];

        const zenith = vec(0, 0, 1);
        const meridian = vec(1, 0, 0);
        const stress = DEFAULT_STRESS;
        const tilt = DEFAULT_TILT;
        const offset = DEFAULT_OFFSET;

        const azimuthStart = DEFAULT_AZIMUTH_START;
        const azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        const azimuthSegments = 0;

        const elevationStart = DEFAULT_ELEVATION_START;
        const elevationLength = DEFAULT_ELEVATION_LENGTH;
        const elevationSegments = 0;

        computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, pts, uvs);

        expect(pts.length).toBe(1);
        expect(uvs.length).toBe(1);

        const point = pts[0];
        expect(point.x).toBe(zenith.x);
        expect(point.y).toBe(zenith.y);
        expect(point.z).toBe(zenith.z);

        const uv = uvs[0];
        expect(uv.x).toBe(0);
        expect(uv.y).toBe(0);
    });
    it("two points tracks the meridian", function () {
        const pts: Vector3[] = [];
        const uvs: Vector2[] = [];

        const zenith = vec(0, 0, 1);
        const meridian = vec(1, 0, 0);
        const stress = DEFAULT_STRESS;
        const tilt = DEFAULT_TILT;
        const offset = DEFAULT_OFFSET;

        const azimuthStart = DEFAULT_AZIMUTH_START;
        const azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        const azimuthSegments = 0;

        const elevationStart = DEFAULT_ELEVATION_START;
        const elevationLength = DEFAULT_ELEVATION_LENGTH / 2;
        const elevationSegments = 1;

        computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, pts, uvs);

        expect(pts.length).toBe(2);
        expect(uvs.length).toBe(2);

        {
            const point = pts[0];
            expect(point.x).toBe(zenith.x);
            expect(point.y).toBe(zenith.y);
            expect(point.z).toBe(zenith.z);
        }

        {
            const point = pts[1];
            expect(point.x).toBeCloseTo(meridian.x, PRECISION);
            expect(point.y).toBeCloseTo(meridian.y, PRECISION);
            expect(point.z).toBeCloseTo(meridian.z, PRECISION);
        }

        {
            const uv = uvs[0];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(0);
        }
        {
            const uv = uvs[1];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(0.5);
        }
    });
    it("uv coordinates in graphics (default) convention (zenith=e2, meridian=e1)", function () {
        const pts: Vector3[] = [];
        const uvs: Vector2[] = [];

        const zenith = DEFAULT_ZENITH;
        const meridian = DEFAULT_MERIDIAN;
        const stress = DEFAULT_STRESS;
        const tilt = DEFAULT_TILT;
        const offset = DEFAULT_OFFSET;

        const azimuthStart = DEFAULT_AZIMUTH_START;
        const azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        const azimuthSegments = 4;

        const elevationStart = DEFAULT_ELEVATION_START;
        const elevationLength = DEFAULT_ELEVATION_LENGTH;
        const elevationSegments = 2;

        computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, pts, uvs);

        // The number of points shows that:
        // The points at the zenith are duplicated.
        // The points at the meridian are duplicated.
        // Points 0, 1, 2, 3, 4 are at the zenith pole.
        // Points 5, 6, 7, 8, 9 are on the equator, with 5 and 9 on the meridian.
        // Points 10, 11, 12, 13, 14 are at the nadir pole.
        expect(pts.length).toBe(15);
        expect(uvs.length).toBe(15);

        {
            for (let i = 0; i < 5; i++) {
                const point = pts[i];
                expect(point.x).toBe(0);
                expect(point.y).toBe(1);
                expect(point.z).toBe(0);
            }
        }

        {
            const point = pts[5];
            expect(point.x).toBeCloseTo(0, PRECISION);
            expect(point.y).toBeCloseTo(0, PRECISION);
            expect(point.z).toBeCloseTo(1, PRECISION);
        }

        {
            const point = pts[6];
            expect(point.x).toBeCloseTo(1, PRECISION);
            expect(point.y).toBeCloseTo(0, PRECISION);
            expect(point.z).toBeCloseTo(0, PRECISION);
        }

        {
            const point = pts[7];
            expect(point.x).toBeCloseTo(0, PRECISION);
            expect(point.y).toBeCloseTo(0, PRECISION);
            expect(point.z).toBeCloseTo(-1, PRECISION);
        }

        {
            const point = pts[8];
            expect(point.x).toBeCloseTo(-1, PRECISION);
            expect(point.y).toBeCloseTo(0, PRECISION);
            expect(point.z).toBeCloseTo(0, PRECISION);
        }

        {
            const point = pts[9];
            expect(point.x).toBeCloseTo(0, PRECISION);
            expect(point.y).toBeCloseTo(0, PRECISION);
            expect(point.z).toBeCloseTo(1, PRECISION);
        }

        {
            for (let i = 10; i < 15; i++) {
                const point = pts[i];
                expect(point.x).toBeCloseTo(0, PRECISION);
                expect(point.y).toBeCloseTo(-1, PRECISION);
                expect(point.z).toBeCloseTo(0, PRECISION);
            }
        }

        // The x-component of the uv coordinate varies from 0 at the meridian to 1 back at the meridian,
        // with the increasing sense given by a right-hand rule about the zenith.
        // The y-component of the uv coordinate varies from 0 at the zenith to 1 at the nadir.
        {
            const i = 0;
            const uv = uvs[i];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(0);
        }
        {
            const i = 1;
            const uv = uvs[i];
            expect(uv.x).toBe(0.25);
            expect(uv.y).toBe(0);
        }
        {
            const i = 2;
            const uv = uvs[i];
            expect(uv.x).toBe(0.5);
            expect(uv.y).toBe(0);
        }
        {
            const i = 3;
            const uv = uvs[i];
            expect(uv.x).toBe(0.75);
            expect(uv.y).toBe(0);
        }
        {
            const i = 4;
            const uv = uvs[i];
            expect(uv.x).toBe(1);
            expect(uv.y).toBe(0);
        }
        {
            const i = 5;
            const uv = uvs[i];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 6;
            const uv = uvs[i];
            expect(uv.x).toBe(0.25);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 7;
            const uv = uvs[i];
            expect(uv.x).toBe(0.5);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 8;
            const uv = uvs[i];
            expect(uv.x).toBe(0.75);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 9;
            const uv = uvs[i];
            expect(uv.x).toBe(1);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 10;
            const uv = uvs[i];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(1);
        }
        {
            const i = 11;
            const uv = uvs[i];
            expect(uv.x).toBe(0.25);
            expect(uv.y).toBe(1);
        }
        {
            const i = 12;
            const uv = uvs[i];
            expect(uv.x).toBe(0.5);
            expect(uv.y).toBe(1);
        }
        {
            const i = 13;
            const uv = uvs[i];
            expect(uv.x).toBe(0.75);
            expect(uv.y).toBe(1);
        }
        {
            const i = 14;
            const uv = uvs[i];
            expect(uv.x).toBe(1);
            expect(uv.y).toBe(1);
        }
    });
    it("uv coordinates in mathematics convention (zenith=e3, meridian=e1)", function () {
        const pts: Vector3[] = [];
        const uvs: Vector2[] = [];

        const zenith = MATHEMATICS_ZENITH;
        const meridian = MATHEMATICS_MERIDIAN;
        const stress = DEFAULT_STRESS;
        const tilt = DEFAULT_TILT;
        const offset = DEFAULT_OFFSET;

        const azimuthStart = DEFAULT_AZIMUTH_START;
        const azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        const azimuthSegments = 4;

        const elevationStart = DEFAULT_ELEVATION_START;
        const elevationLength = DEFAULT_ELEVATION_LENGTH;
        const elevationSegments = 2;

        computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, pts, uvs);

        // The number of points shows that:
        // The points at the zenith are duplicated.
        // The points at the meridian are duplicated.
        // Points 0, 1, 2, 3, 4 are at the zenith pole.
        // Points 5, 6, 7, 8, 9 are on the equator, with 5 and 9 on the meridian.
        // Points 10, 11, 12, 13, 14 are at the nadir pole.
        expect(pts.length).toBe(15);
        expect(uvs.length).toBe(15);

        {
            for (let i = 0; i < 5; i++) {
                const point = pts[i];
                expect(point.x).toBe(MATHEMATICS_ZENITH.x);
                expect(point.y).toBe(MATHEMATICS_ZENITH.y);
                expect(point.z).toBe(MATHEMATICS_ZENITH.z);
            }
        }

        {
            const point = pts[5];
            expect(point.x).toBeCloseTo(MATHEMATICS_MERIDIAN.x, PRECISION);
            expect(point.y).toBeCloseTo(MATHEMATICS_MERIDIAN.y, PRECISION);
            expect(point.z).toBeCloseTo(MATHEMATICS_MERIDIAN.z, PRECISION);
        }

        {
            const expected = MATHEMATICS_ZENITH.cross(MATHEMATICS_MERIDIAN);
            const point = pts[6];
            expect(point.x).toBeCloseTo(expected.x, PRECISION);
            expect(point.y).toBeCloseTo(expected.y, PRECISION);
            expect(point.z).toBeCloseTo(expected.z, PRECISION);
        }

        {
            const point = pts[7];
            expect(point.x).toBeCloseTo(-MATHEMATICS_MERIDIAN.x, PRECISION);
            expect(point.y).toBeCloseTo(-MATHEMATICS_MERIDIAN.y, PRECISION);
            expect(point.z).toBeCloseTo(-MATHEMATICS_MERIDIAN.z, PRECISION);
        }
        {
            const expected = MATHEMATICS_MERIDIAN.cross(MATHEMATICS_ZENITH);
            const point = pts[8];
            expect(point.x).toBeCloseTo(expected.x, PRECISION);
            expect(point.y).toBeCloseTo(expected.y, PRECISION);
            expect(point.z).toBeCloseTo(expected.z, PRECISION);
        }
        {
            const point = pts[9];
            expect(point.x).toBeCloseTo(MATHEMATICS_MERIDIAN.x, PRECISION);
            expect(point.y).toBeCloseTo(MATHEMATICS_MERIDIAN.y, PRECISION);
            expect(point.z).toBeCloseTo(MATHEMATICS_MERIDIAN.z, PRECISION);
        }

        {
            for (let i = 10; i < 15; i++) {
                const point = pts[i];
                expect(point.x).toBeCloseTo(MATHEMATICS_NADIR.x, PRECISION);
                expect(point.y).toBeCloseTo(MATHEMATICS_NADIR.y, PRECISION);
                expect(point.z).toBeCloseTo(MATHEMATICS_NADIR.z, PRECISION);
            }
        }

        // The x-component of the uv coordinate varies from 0 at the meridian to 1 back at the meridian,
        // with the increasing sense given by a right-hand rule about the zenith.
        // The y-component of the uv coordinate varies from 0 at the zenith to 1 at the nadir.
        /*
        {
            const i = 0;
            const uv = uvs[i];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(0);
        }
        {
            const i = 1;
            const uv = uvs[i];
            expect(uv.x).toBe(0.25);
            expect(uv.y).toBe(0);
        }
        {
            const i = 2;
            const uv = uvs[i];
            expect(uv.x).toBe(0.5);
            expect(uv.y).toBe(0);
        }
        {
            const i = 3;
            const uv = uvs[i];
            expect(uv.x).toBe(0.75);
            expect(uv.y).toBe(0);
        }
        {
            const i = 4;
            const uv = uvs[i];
            expect(uv.x).toBe(1);
            expect(uv.y).toBe(0);
        }
        {
            const i = 5;
            const uv = uvs[i];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 6;
            const uv = uvs[i];
            expect(uv.x).toBe(0.25);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 7;
            const uv = uvs[i];
            expect(uv.x).toBe(0.5);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 8;
            const uv = uvs[i];
            expect(uv.x).toBe(0.75);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 9;
            const uv = uvs[i];
            expect(uv.x).toBe(1);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 10;
            const uv = uvs[i];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(1);
        }
        {
            const i = 11;
            const uv = uvs[i];
            expect(uv.x).toBe(0.25);
            expect(uv.y).toBe(1);
        }
        {
            const i = 12;
            const uv = uvs[i];
            expect(uv.x).toBe(0.5);
            expect(uv.y).toBe(1);
        }
        {
            const i = 13;
            const uv = uvs[i];
            expect(uv.x).toBe(0.75);
            expect(uv.y).toBe(1);
        }
        {
            const i = 14;
            const uv = uvs[i];
            expect(uv.x).toBe(1);
            expect(uv.y).toBe(1);
        }
        */
    });
    it("uv coordinates, hemisphere, in graphics (default) convention (zenith=e2, meridian=e1)", function () {
        const pts: Vector3[] = [];
        const uvs: Vector2[] = [];

        const zenith = DEFAULT_ZENITH;
        const meridian = DEFAULT_MERIDIAN;
        const stress = DEFAULT_STRESS;
        const tilt = DEFAULT_TILT;
        const offset = DEFAULT_OFFSET;

        const azimuthStart = DEFAULT_AZIMUTH_START;
        const azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        const azimuthSegments = 4;

        const elevationStart = DEFAULT_ELEVATION_START;
        const elevationLength = Math.PI / 2;
        const elevationSegments = 1;

        computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, pts, uvs);

        // The number of points shows that:
        // The points at the zenith are duplicated.
        // The points at the meridian are duplicated.
        // Points 0, 1, 2, 3, 4 are at the zenith pole.
        // Points 5, 6, 7, 8, 9 are on the equator, with 5 and 9 on the meridian.
        expect(pts.length).toBe(10);
        expect(uvs.length).toBe(10);

        {
            for (let i = 0; i < 5; i++) {
                const point = pts[i];
                expect(point.x).toBe(0);
                expect(point.y).toBe(1);
                expect(point.z).toBe(0);
            }
        }

        {
            const point = pts[5];
            expect(point.x).toBeCloseTo(0, PRECISION);
            expect(point.y).toBeCloseTo(0, PRECISION);
            expect(point.z).toBeCloseTo(1, PRECISION);
        }

        {
            const point = pts[6];
            expect(point.x).toBeCloseTo(1, PRECISION);
            expect(point.y).toBeCloseTo(0, PRECISION);
            expect(point.z).toBeCloseTo(0, PRECISION);
        }

        {
            const point = pts[7];
            expect(point.x).toBeCloseTo(0, PRECISION);
            expect(point.y).toBeCloseTo(0, PRECISION);
            expect(point.z).toBeCloseTo(-1, PRECISION);
        }

        {
            const point = pts[8];
            expect(point.x).toBeCloseTo(-1, PRECISION);
            expect(point.y).toBeCloseTo(0, PRECISION);
            expect(point.z).toBeCloseTo(0, PRECISION);
        }

        {
            const point = pts[9];
            expect(point.x).toBeCloseTo(0, PRECISION);
            expect(point.y).toBeCloseTo(0, PRECISION);
            expect(point.z).toBeCloseTo(1, PRECISION);
        }

        // The x-component of the uv coordinate varies from 0 at the meridian to 1 back at the meridian,
        // with the increasing sense given by a right-hand rule about the zenith.
        // The y-component of the uv coordinate varies from 0 at the zenith to 1 at the nadir.

        {
            const i = 0;
            const uv = uvs[i];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(0);
        }
        {
            const i = 1;
            const uv = uvs[i];
            expect(uv.x).toBe(0.25);
            expect(uv.y).toBe(0);
        }
        {
            const i = 2;
            const uv = uvs[i];
            expect(uv.x).toBe(0.5);
            expect(uv.y).toBe(0);
        }
        {
            const i = 3;
            const uv = uvs[i];
            expect(uv.x).toBe(0.75);
            expect(uv.y).toBe(0);
        }
        {
            const i = 4;
            const uv = uvs[i];
            expect(uv.x).toBe(1);
            expect(uv.y).toBe(0);
        }
        {
            const i = 5;
            const uv = uvs[i];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 6;
            const uv = uvs[i];
            expect(uv.x).toBe(0.25);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 7;
            const uv = uvs[i];
            expect(uv.x).toBe(0.5);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 8;
            const uv = uvs[i];
            expect(uv.x).toBe(0.75);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 9;
            const uv = uvs[i];
            expect(uv.x).toBe(1);
            expect(uv.y).toBe(0.5);
        }
    });
    it("uv coordinates, quadrant, in graphics (default) convention (zenith=e2, meridian=e1)", function () {
        const pts: Vector3[] = [];
        const uvs: Vector2[] = [];

        const zenith = DEFAULT_ZENITH;
        const meridian = DEFAULT_MERIDIAN;
        const stress = DEFAULT_STRESS;
        const tilt = DEFAULT_TILT;
        const offset = DEFAULT_OFFSET;

        const azimuthStart = DEFAULT_AZIMUTH_START;
        const azimuthLength = Math.PI / 2;
        const azimuthSegments = 1;

        const elevationStart = DEFAULT_ELEVATION_START;
        const elevationLength = Math.PI / 2;
        const elevationSegments = 1;

        computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, pts, uvs);

        // 0 and 1 at the zenith.
        // 2 at meridian
        // 3 at zenith x meridian (cross)
        expect(pts.length).toBe(4);
        expect(uvs.length).toBe(4);
        {
            const point = pts[0];
            expect(point.x).toBeCloseTo(zenith.x, PRECISION);
            expect(point.y).toBeCloseTo(zenith.y, PRECISION);
            expect(point.z).toBeCloseTo(zenith.z, PRECISION);
        }
        {
            const point = pts[1];
            expect(point.x).toBeCloseTo(zenith.x, PRECISION);
            expect(point.y).toBeCloseTo(zenith.y, PRECISION);
            expect(point.z).toBeCloseTo(zenith.z, PRECISION);
        }
        {
            const point = pts[2];
            expect(point.x).toBeCloseTo(meridian.x, PRECISION);
            expect(point.y).toBeCloseTo(meridian.y, PRECISION);
            expect(point.z).toBeCloseTo(meridian.z, PRECISION);
        }
        {
            const expected = zenith.cross(meridian);
            const point = pts[3];
            expect(point.x).toBeCloseTo(expected.x, PRECISION);
            expect(point.y).toBeCloseTo(expected.y, PRECISION);
            expect(point.z).toBeCloseTo(expected.z, PRECISION);
        }

        // The x-component of the uv coordinate varies from 0 at the meridian to 1 back at the meridian,
        // with the increasing sense given by a right-hand rule about the zenith.
        // The y-component of the uv coordinate varies from 0 at the zenith to 1 at the nadir.
        {
            const i = 0;
            const uv = uvs[i];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(0);
        }
        {
            const i = 1;
            const uv = uvs[i];
            expect(uv.x).toBe(0.25);
            expect(uv.y).toBe(0);
        }
        {
            const i = 2;
            const uv = uvs[i];
            expect(uv.x).toBe(0);
            expect(uv.y).toBe(0.5);
        }
        {
            const i = 3;
            const uv = uvs[i];
            expect(uv.x).toBe(0.25);
            expect(uv.y).toBe(0.5);
        }
    });
});
