define(['davinci-eight/glsl/literals'], function(literals)
{
    describe("glsl/literals", function() {
        it("does not contain jabberwocky", function() {
          expect(literals.indexOf('jabberwocky') >=0 ).toBe(false);
        });
        it("contains precision", function() {
          expect(literals.indexOf('precision') >= 0).toBe(true);
        });
        it("contains vec3", function() {
          expect(literals.indexOf('vec3') >= 0).toBe(true);
        });
    });
});