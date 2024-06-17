import { Engine } from "../core/Engine";
import { Tetrahedron } from "./Tetrahedron";

describe("Tetrahedron", function () {
    it("new-release", function () {
        const engine = new Engine();
        const arrow = new Tetrahedron(engine);
        expect(arrow.isZombie()).toBe(false);
        arrow.release();
        engine.release();
        expect(arrow.isZombie()).toBe(true);
    });
});
