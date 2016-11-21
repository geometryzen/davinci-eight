import { Engine } from '../core/Engine';
import ArrowGeometry from './ArrowGeometry';

describe("ArrowGeometry", function () {
    describe("constructor", function () {
        describe("getPrincipalScale", function () {
            it("length", function () {
                const engine = new Engine();
                const arrow = new ArrowGeometry(engine);
                expect(arrow.getPrincipalScale('length')).toBe(1);
                arrow.release();
                engine.release();
            });
        });
        describe("setPrincipalScale", function () {
            it("length", function () {
                const engine = new Engine();
                const arrow = new ArrowGeometry(engine);
                arrow.setPrincipalScale('length', 2);
                expect(arrow.getPrincipalScale('length')).toBe(2);
                arrow.release();
                engine.release();
            });
        });
        describe("scaling", function () {
            it("length", function () {
                const engine = new Engine();
                const arrow = new ArrowGeometry(engine);
                const scaling = arrow.scaling;
                expect(scaling.getElement(0, 0)).toBe(1);
                arrow.release();
                engine.release();
            });
        });
    });
});
