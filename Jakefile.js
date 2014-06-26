// This file contains the build logic for davinci-eight.

var fs = require("fs");
var path = require("path");

// We are using the reference feature to create the ordered closure of source files.
var compilerSources = [
    "src/eight.ts"
];

function ES5(xs) {
    return ['--target ES5'].concat(xs);
}

function AMD(xs) {
    return ['--module amd'].concat(xs);
}

function removeComments(xs) {
    return ['--removeComments'].concat(xs);
}

var args = removeComments(AMD(ES5(compilerSources)));

// The --out option does not apply when doing module code generation.
// If we want concatenation then we must use something like almond.
// The outFile parameter below is not currently used.
desc("Builds the full libraries");
task('compile', {async:true}, function(target, outFile, options) {
    var cmd = "tsc " + options.join(" ");

    // console.log(cmd + "\n");
    var ex = jake.createExec([cmd]);

    // Add listeners for output and error
    ex.addListener("stdout", function(output) {
        process.stdout.write(output);
    });
    ex.addListener("stderr", function(error) {
        process.stderr.write(error);
    });
    ex.addListener("cmdEnd", function() {
        var time = new Date();
        var stamp = time.toLocaleTimeString();
        console.log(stamp + " done creating " + target + ".");
        complete();
    });
    ex.addListener("error", function() {
        fs.unlinkSync(outFile);
        console.log("Compilation of " + target + " unsuccessful.");
    });
    ex.run();
});

// Set the default task
task("default", function() {
   jake.Task['compile'].invoke("JavaScript", "dist/davinci-eight.js", args);
   jake.Task['compile'].invoke("d.ts files", "dist/davinci-eight.d.ts", ['--declaration'].concat(args));
});
