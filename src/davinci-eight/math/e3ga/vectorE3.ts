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
