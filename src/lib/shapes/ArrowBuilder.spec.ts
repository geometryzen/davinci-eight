import { BeginMode } from "../core/BeginMode";
import { Vector3 } from "../math/Vector3";
import { ArrowBuilder } from "./ArrowBuilder";

describe("ArrowBuilder", function () {
    describe("constructor", function () {
        it("should work", function () {
            const axis = new Vector3([0, 1, 0]);
            const cutLine = new Vector3([0, 0, 1]);
            const builder = new ArrowBuilder(axis, cutLine, false);
            expect(builder).toBeDefined();
        });
    });
    describe("defaults", function () {
        it("should be stable", function () {
            const axis = new Vector3([0, 1, 0]);
            const cutLine = new Vector3([0, 0, 1]);
            const builder = new ArrowBuilder(axis, cutLine, false);
            expect(builder.radiusCone).toBe(0.08);
            expect(builder.heightCone).toBe(0.2);
            expect(builder.radiusShaft).toBe(0.01);
            expect(builder.thetaSegments).toBe(16);
        });
    });
    describe("toPrimitive", function () {
        it("should work for defaults", function () {
            const axis = new Vector3([0, 1, 0]);
            const cutLine = new Vector3([0, 0, 1]);
            const builder = new ArrowBuilder(axis, cutLine, false);
            const primitive = builder.toPrimitive();
            expect(primitive).toBeDefined();
            expect(primitive.mode).toBe(BeginMode.TRIANGLE_STRIP);
            expect(primitive.indices.length).toBe(142);
            const attributes = primitive.attributes;
            expect(attributes).toBeDefined();
            const names = Object.keys(attributes).sort();
            expect(names.length).toBe(2);
            expect(names[0]).toBe("aNormal");
            expect(names[1]).toBe("aPosition");
            const aNormal = attributes["aNormal"];
            expect(aNormal).toBeDefined();
            expect(aNormal.size).toBe(3);
            expect(aNormal.values.length).toBe(408);
            const aPosition = attributes["aPosition"];
            expect(aPosition).toBeDefined();
            expect(aPosition.size).toBe(3);
            expect(aPosition.values.length).toBe(408);
        });
        it("should work for minimal thetaSegments", function () {
            const axis = new Vector3([0, 1, 0]);
            const cutLine = new Vector3([0, 0, 1]);
            const builder = new ArrowBuilder(axis, cutLine, false);
            builder.thetaSegments = 3;
            const primitive = builder.toPrimitive();
            expect(primitive).toBeDefined();
            expect(primitive.mode).toBe(BeginMode.TRIANGLE_STRIP);
            expect(primitive.indices.length).toBe(38);
            const attributes = primitive.attributes;
            expect(attributes).toBeDefined();
            const names = Object.keys(attributes).sort();
            expect(names.length).toBe(2);
            expect(names[0]).toBe("aNormal");
            expect(names[1]).toBe("aPosition");
            const aNormal = attributes["aNormal"];
            expect(aNormal).toBeDefined();
            expect(aNormal.size).toBe(3);
            expect(aNormal.values.length).toBe(96);
            const aPosition = attributes["aPosition"];
            expect(aPosition).toBeDefined();
            expect(aPosition.size).toBe(3);
            expect(aPosition.values.length).toBe(96);
        });
    });
});
