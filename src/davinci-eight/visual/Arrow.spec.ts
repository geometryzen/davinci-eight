import { Engine } from '../core/Engine';
import { Arrow } from './Arrow';
import ArrowOptions from './ArrowOptions';
import { ds } from './Defaults';
import { Geometric3 } from '../math/Geometric3';
import refChange from '../core/refChange';

const e1: Geometric3 = Geometric3.e1();
const e2: Geometric3 = Geometric3.e2();
// const e3: Geometric3 = Geometric3.e3()

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
    describe("position", function () {
        it("should be initialized to zero", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            expect(arrow.X.isZero()).toBe(true);
            arrow.release();
            engine.release();
        });
    });
    describe("attitude", function () {
        it("should be initialized to unity", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            expect(arrow.R.isOne()).toBe(true);
            arrow.release();
            engine.release();
        });
    });
    describe("h", function () {
        it("should default to default axis", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            expect(arrow.h.x).toBe(ds.axis.x);
            expect(arrow.h.y).toBe(ds.axis.y);
            expect(arrow.h.z).toBe(ds.axis.z);
            arrow.release();
            engine.release();
        });
        it("should be an alias for axis", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            arrow.axis.x = Math.random();
            arrow.axis.y = Math.random();
            arrow.axis.z = Math.random();
            expect(arrow.h.x).toBe(arrow.axis.x);
            expect(arrow.h.y).toBe(arrow.axis.y);
            expect(arrow.h.z).toBe(arrow.axis.z);
            arrow.release();
            engine.release();
        });

        // The length property has been made private.
        // Updates are expected to happen through the 
        describe("changing the length property", function () {
            describe("from the default", function () {
                xit("should update the h property", function () {
                    const engine = new Engine();
                    const arrow = new Arrow(engine);
                    // arrow.length = 2
                    expect(arrow.h.equals(e2.clone().scale(2))).toBe(true);
                    arrow.release();
                    engine.release();
                });
                xit("should update the length property", function () {
                    const engine = new Engine();
                    const arrow = new Arrow(engine);
                    // arrow.length = 2
                    // expect(arrow.length).toBe(2)
                    arrow.release();
                    engine.release();
                });
                xit("should NOT update the attitude property", function () {
                    const engine = new Engine();
                    const arrow = new Arrow(engine);
                    // arrow.length = 2
                    expect(arrow.R.isOne()).toBe(true);
                    arrow.release();
                    engine.release();
                });
            });
        });

        describe("changing the h property", function () {
            describe("from the default", function () {
                it("should update the h property", function () {
                    const engine = new Engine();
                    const arrow = new Arrow(engine);
                    arrow.h = e1.clone().scale(2);
                    expect(arrow.h.equals(e1.clone().scale(2))).toBe(true);
                    arrow.release();
                    engine.release();
                });
                xit("should update the length property", function () {
                    const engine = new Engine();
                    const arrow = new Arrow(engine);
                    arrow.h = e1.clone().scale(2);
                    expect(arrow.h).toBe(2);
                    arrow.release();
                    engine.release();
                });
                it("should update the attitude property", function () {
                    const engine = new Engine();
                    const arrow = new Arrow(engine);
                    arrow.h = e1.clone().scale(2);
                    expect(arrow.R.equals(Geometric3.rotorFromDirections(ds.axis, e1))).toBe(true);
                    arrow.release();
                    engine.release();
                });
            });
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
        it("should be an alias for h", function () {
            const engine = new Engine();
            const arrow = new Arrow(engine);
            arrow.h.x = Math.random();
            arrow.h.y = Math.random();
            arrow.h.z = Math.random();
            expect(arrow.axis.x).toBe(arrow.h.x);
            expect(arrow.axis.y).toBe(arrow.h.y);
            expect(arrow.axis.z).toBe(arrow.h.z);
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
