import { computeAttributes } from './computeAttributes';
import { BeginMode } from './BeginMode';
import { Primitive } from './Primitive';

describe("computeAttributes", function () {
    /*
     * 2-----3
     * |     |
     * |     |
     * 0-----1
     */
    const primitive: Primitive = {
        attributes: {
            "aPosition": {
                values: [
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    1,
                    0,
                    1,
                    1,
                    0
                ],
                size: 3
            },
            "aNormal": {
                values: [
                    0,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    1
                ],
                size: 3
            }
        },
        mode: BeginMode.LINES,
        indices: [
            0,
            1,
            0,
            2,
            2,
            3,
            1,
            3
        ]
    };
    describe("using ['aPosition']", function () {
        const attributes = computeAttributes(primitive.attributes, ['aPosition']);
        it("should have 24 values", function () {
            expect(attributes.length).toBe(12);
        });
    });
    describe("['aPosition', 'aNormal']", function () {
        const attributes = computeAttributes(primitive.attributes, ['aPosition', 'aNormal']);
        it("should have 24 values", function () {
            expect(attributes.length).toBe(24);
        });
    });
});
