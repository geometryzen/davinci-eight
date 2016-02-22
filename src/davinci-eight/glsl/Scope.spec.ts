import Scope from './Scope'

describe("glsl/Scope", function() {
    describe("constructor", function() {
        it("find symbol that does not exist returns null", function() {
            const scope = new Scope([]);
            expect(scope.find('foo')).toBeNull();
        });
    });
});
