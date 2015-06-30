define(['davinci-eight/glsl/builtins'], function(builtins)
{
    describe("glsl/builtins", function() {
        it("does not contain jabberwocky", function() {
          expect(builtins.indexOf('jabberwocky') >=0 ).toBe(false);
        });
        it("contains gl_Position", function() {
          expect(builtins.indexOf('gl_Position') >= 0).toBe(true);
        });
        it("contains gl_PointSize", function() {
          expect(builtins.indexOf('gl_PointSize') >= 0).toBe(true);
        });
    });
});