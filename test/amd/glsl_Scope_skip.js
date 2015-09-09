define(['davinci-eight/glsl/Scope'], function(Scope)
{
    describe("Scope", function() {
        describe("constructor", function() {
            it("find symbol that does not exist returns null", function() {
                var scope = new Scope();
                expect(scope.find('foo')).toBeNull();
            });
        });
    });
});