export function uuid4() {

    const maxFromBits = function (bits: number): number {
        return Math.pow(2, bits);
    };

    const limitUI06 = maxFromBits(6);
    const limitUI08 = maxFromBits(8);
    const limitUI12 = maxFromBits(12);
    const limitUI16 = maxFromBits(16);
    const limitUI32 = maxFromBits(32);

    const getRandomInt = function (min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const randomUI06 = function () {
        return getRandomInt(0, limitUI06 - 1);
    };

    const randomUI08 = function () {
        return getRandomInt(0, limitUI08 - 1);
    };

    const randomUI12 = function () {
        return getRandomInt(0, limitUI12 - 1);
    };

    const randomUI16 = function () {
        return getRandomInt(0, limitUI16 - 1);
    };

    const randomUI32 = function () {
        return getRandomInt(0, limitUI32 - 1);
    };

    const randomUI48 = function () {
        return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30);
    };

    const paddedString = function (str: string, length: number, z?: string) {
        str = String(str);
        z = (!z) ? '0' : z;
        var i = length - str.length;
        for (; i > 0; i >>>= 1, z += z) {
            if (i & 1) {
                str = z + str;
            }
        }
        return str;
    };

    const fromParts = function (timeLow: number, timeMid: number, timeHiAndVersion: number, clockSeqHiAndReserved: number, clockSeqLow: number, node: number) {
        const hex = paddedString(timeLow.toString(16), 8) +
            '-' +
            paddedString(timeMid.toString(16), 4) +
            '-' +
            paddedString(timeHiAndVersion.toString(16), 4) +
            '-' +
            paddedString(clockSeqHiAndReserved.toString(16), 2) +
            paddedString(clockSeqLow.toString(16), 2) +
            '-' +
            paddedString(node.toString(16), 12);
        return hex;
    };

    return {
        generate: function () {
            return fromParts(
                randomUI32(),
                randomUI16(),
                0x4000 | randomUI12(),
                0x80 | randomUI06(),
                randomUI08(),
                randomUI48()
            );
        },

        // addition by Ka-Jan to test for validity
        // Based on: http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
        validate: function (uuid: string) {
            const testPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return testPattern.test(uuid);
        }
    };
}
