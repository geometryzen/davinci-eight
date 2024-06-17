import { Arrow } from "./Arrow";
import { ArrowOptions } from "./ArrowOptions";
import { ds } from "./Defaults";
import { Engine } from "../core/Engine";
import { vectorCopy, vectorFromCoords } from "../math/R3";
import { refChange } from "../core/refChange";

describe("Arrow", function () {
    it("new-release", function () {
        refChange("quiet");
        refChange("reset");
        refChange("quiet");
        refChange("start");
        const engine = new Engine();
        const arrow = new Arrow(engine);
        expect(arrow.isZombie()).toBe(false);
        arrow.release();
        engine.release();
        expect(arrow.isZombie()).toBe(true);
        refChange("stop");
        const outstanding = refChange("dump");
        expect(outstanding).toBe(0);
        refChange("quiet");
        refChange("reset");
    });
    describe("X", function () {
        it("should be initialized to zero", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            expect(arrow.X.isZero()).toBe(true);
            arrow.release();
            engine.release();
        });
    });
    describe("position", function () {
        it("should be initialized to zero", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            expect(arrow.position.isZero()).toBe(true);
            arrow.release();
            engine.release();
        });
    });
    describe("R", function () {
        it("should be initialized to unity", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            expect(arrow.R.isOne()).toBe(true);
            arrow.release();
            engine.release();
        });
    });
    describe("attitude", function () {
        it("should be initialized to unity", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            expect(arrow.attitude.isOne()).toBe(true);
            arrow.release();
            engine.release();
        });
    });
    describe("axis", function () {
        it("should default to the default axis", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            expect(arrow.axis.x).toBe(ds.axis.x);
            expect(arrow.axis.y).toBe(ds.axis.y);
            expect(arrow.axis.z).toBe(ds.axis.z);
            arrow.release();
            engine.release();
        });
        it("should not scale with length (its a unit vector)", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            arrow.length = 2 * arrow.length;
            expect(arrow.axis.x).toBe(ds.axis.x);
            expect(arrow.axis.y).toBe(ds.axis.y);
            expect(arrow.axis.z).toBe(ds.axis.z);
            arrow.release();
            engine.release();
        });
        it("should not affect length (its a unit vector)", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            arrow.axis = vectorCopy(arrow.axis).scale(3);
            expect(arrow.length).toBe(1);
            expect(arrow.axis.x).toBe(ds.axis.x);
            expect(arrow.axis.y).toBe(ds.axis.y);
            expect(arrow.axis.z).toBe(ds.axis.z);
            arrow.release();
            engine.release();
        });
    });
    describe("vector", function () {
        it("should default to the default axis", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            expect(arrow.axis.x).toBe(ds.axis.x);
            expect(arrow.axis.y).toBe(ds.axis.y);
            expect(arrow.axis.z).toBe(ds.axis.z);
            arrow.release();
            engine.release();
        });
        it("should scale with length", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            arrow.length = 2 * arrow.length;
            expect(arrow.vector.x).toBe(2 * ds.axis.x);
            expect(arrow.vector.y).toBe(2 * ds.axis.y);
            expect(arrow.vector.z).toBe(2 * ds.axis.z);
            arrow.release();
            engine.release();
        });
        it("should affect length", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            arrow.vector = vectorCopy(arrow.axis).scale(3);
            expect(arrow.length).toBeCloseTo(3, 10);
            expect(arrow.vector.x).toBeCloseTo(3 * ds.axis.x, 10);
            expect(arrow.vector.y).toBeCloseTo(3 * ds.axis.y, 10);
            expect(arrow.vector.z).toBeCloseTo(3 * ds.axis.z, 10);
            arrow.release();
            engine.release();
        });
    });
    describe("length", function () {
        it("should default to 1", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            expect(arrow.length).toBe(1);
            arrow.release();
            engine.release();
        });
        it("should be independent of axis magnitude", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            const axis = vectorFromCoords(Math.random(), Math.random(), Math.random());
            arrow.axis = axis;
            expect(arrow.length).toBeCloseTo(1, 6);
            arrow.release();
            engine.release();
        });
        it("should scale with vector", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            const vector = vectorFromCoords(Math.random(), Math.random(), Math.random());
            arrow.vector = vector;
            expect(arrow.length).toBeCloseTo(vector.magnitude(), 6);
            arrow.release();
            engine.release();
        });
        it("should not affect axis", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            const L = Math.random();
            arrow.length = L;
            const axis = vectorCopy(arrow.axis);
            expect(axis.magnitude()).toBeCloseTo(1, 6);
            arrow.release();
            engine.release();
        });
        it("should affect vector", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            const L = Math.random();
            arrow.length = L;
            const vector = vectorCopy(arrow.vector);
            expect(vector.magnitude()).toBeCloseTo(L, 6);
            arrow.release();
            engine.release();
        });
    });
    describe("options", function () {
        it("should be initialized to unity", function () {
            const engine = new Engine();
            const options: ArrowOptions = {};
            const arrow = new Arrow(engine, options);
            expect(arrow.X.isZero()).toBe(true);
            expect(arrow.R.isOne()).toBe(true);
            arrow.release();
            engine.release();
        });
    });
});
