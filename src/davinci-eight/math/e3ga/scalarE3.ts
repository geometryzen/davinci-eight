//
// scalarE3.ts
//
/// <amd-dependency path="davinci-blade/Euclidean3" name="Euclidean3"/>
declare var Euclidean3: any;

var scalarE3 = function(w: number): blade.Euclidean3 {
    return new Euclidean3(w, 0, 0, 0, 0, 0, 0, 0);
};
export = scalarE3;
