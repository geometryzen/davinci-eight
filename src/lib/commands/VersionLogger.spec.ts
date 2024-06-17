import { Engine } from "../core/Engine";
import { refChange } from "../core/refChange";
import { VersionLogger } from "./VersionLogger";

describe("VersionLogger", function () {
    it("new-release", function () {
        refChange("quiet");
        refChange("start");
        const engine = new Engine();
        const logger = new VersionLogger(engine);
        logger.release();
        engine.release();
        const outstanding = refChange("stop");
        expect(outstanding).toBe(0);
    });
});
