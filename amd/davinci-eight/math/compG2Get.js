define(["require", "exports"], function (require, exports) {
    function compG2Get(m, index) {
        switch (index) {
            case 0: {
                return m.α;
            }
            case 1: {
                return m.x;
            }
            case 2: {
                return m.y;
            }
            case 3: {
                return m.β;
            }
            default: {
                throw new Error("index => " + index);
            }
        }
    }
    return compG2Get;
});
