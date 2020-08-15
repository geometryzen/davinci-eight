import { mustBeWebGLContextId } from "./mustBeWebGLContextId";

describe("mustBeWebGLContextId", function () {
    it("('webgl2') returns 'webgl2'", function () {
        expect(mustBeWebGLContextId('contextId', 'webgl2')).toBe('webgl2');
    });
    it("('webgl') returns 'webgl'", function () {
        expect(mustBeWebGLContextId('contextId', 'webgl')).toBe('webgl');
    });
    it("('foo') throws 'webgl'", function () {
        try {
            mustBeWebGLContextId('contextId', 'foo');
            fail();
        }
        catch (e) {
            expect(e.message).toBe("contextId must be 'webgl2' or 'webgl'.");
        }
    });
});
