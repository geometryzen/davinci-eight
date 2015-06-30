define(['davinci-eight/glsl/Scope'], function(Scope)
{
    describe("Scope", function() {
        describe("constructor", function() {
            it("numer matches construction argument", function() {
                var scope = new Scope();
                expect(scope.find('foo')).toBeNull();
            });
        });
    });
});