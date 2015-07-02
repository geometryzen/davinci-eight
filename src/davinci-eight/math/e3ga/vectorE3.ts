//
// vectorE3.ts
//
/// <amd-dependency path="davinci-blade/Euclidean3" name="Euclidean3"/>
//xxx/ <referenceXXX path="../../../../vendor/davinci-blade/amd/davinci-blade/Euclidean3.d.ts" />
//xxx/ <referenceXXX path="../../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
declare var Euclidean3: any;

/**
 * Constructs and returns a Euclidean 3D vector from its cartesian components.
 * @param x The x component of the vector.
 * @param y The y component of the vector.
 * @param z The z component of the vector.
 */ 
var vectorE3 = function(x: number, y: number, z: number): blade.Euclidean3 {
    return new Euclidean3(0, x, y, z, 0, 0, 0, 0);
};
export = vectorE3;

// Remarks
// 1. The amd-dependency causes the correct AMD dependency array and variable name.
// 2. The declare var just keeps the TypeScript compiler happy beacuse this code does not know about Euclidean3.
// 3. The 'any' is required because specifying blade.Euclidean3 does not seem to describe the constructor.
// With the aforementioned, we get a clean compile.