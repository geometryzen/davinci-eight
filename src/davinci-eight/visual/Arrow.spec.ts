import Arrow from './Arrow';
import ArrowOptions from './ArrowOptions';
import { ds } from './Defaults';
import Engine from '../core/Engine';
import refChange from '../core/refChange';

describe("Arrow", function () {
    it("new-release", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const arrow = new Arrow(engine);
        expect(arrow.isZombie()).toBe(false);
        arrow.release();
        engine.release();
        expect(arrow.isZombie()).toBe(true);
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
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
