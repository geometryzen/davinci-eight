define(["require", "exports"], function (require, exports) {
    function compG2Get(m, index) {
        switch (index) {
            case 0: {
                return m.w;
            }
            case 1: {
                return m.x;
            }
            case 2: {
                return m.y;
            }
            case 3: {
                return m.xy;
            }
            default: {
                throw new Error("index => " + index);
            }
        }
    }
    return compG2Get;
});
