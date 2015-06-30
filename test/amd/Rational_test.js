define(['davinci-blade/Rational'], function(Rational)
{
    describe("Rational", function() {
        describe("constructor", function() {
            it("numer matches construction argument", function() {
                var x = new Rational(3,5);
                expect(x.numer).toBe(3);
            });
        });
    });
});