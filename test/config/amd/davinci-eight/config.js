// test/config/amd/davinci-eight/config.js
// TODO: automate generation of this file.
require([
    'davinci-eight/math/gauss',
    'davinci-eight/math/QQ'
], function(){ require([
    'test/amd/gauss_test.js',
    'test/amd/QQ_test.js'
], function() {
    window.initializeJasmine();
});});