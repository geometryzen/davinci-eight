var glwin = window.open("", "", "width=800, height=600");

var popUpEnabled = false;

if (glwin) {
    popUpEnabled = true;
}
else {
    console.log("Pop-ups are currently blocked. You'll get more FPS in a Pop-up!");
    glwin = window;
}

glwin.document.body.style.backgroundColor = "202020";
glwin.document.body.style.overflow = "hidden";
glwin.document.title = "Visualizing Geometric Algebra with WebGL";

var scene = eight.scene();

var camera = eight.perspective(45, 1.0, 0.1, 100);

var renderer = eight.renderer();

var box = eight.mesh(eight.box());
scene.add(box);
box.position = eight.vectorE3(-1.0, -0.5, -5.0);
var prism = eight.mesh(eight.prism());
scene.add(prism);
prism.position = eight.vectorE3(0.0, 0.0, -5.0);

var workbench = eight.workbench(renderer.canvas, renderer, camera, glwin);

function setUp() {
    workbench.setUp();
    monitor.start();
}

var B = eight.bivectorE3(0, 0, 1);
var angle = 0;

var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
glwin.document.body.appendChild(stats.domElement);
function tick(t) {
    stats.begin();
    var c = eight.scalarE3(Math.cos(angle / 2));
    var s = eight.scalarE3(Math.sin(angle / 2));
    var R = c.sub(B.mul(s));
    box.attitude = R;
    prism.attitude = R;

    renderer.render(scene, camera);
    angle += 0.01;
    stats.end();
}

function terminate(t) {
    return false;
}

function tearDown(e) {
    monitor.stop();
    if (popUpEnabled) {
        glwin.close();
    }
    if (e) {
        console.log("Error during animation: " + e);
    } else {
        console.log("Goodbye!");
        workbench.tearDown();
        scene.tearDown();
    }
}

var runner = eight.animationRunner(tick, terminate, setUp, tearDown, glwin);

function onContextLoss() {
    runner.stop();
    renderer.onContextLoss();
    scene.onContextLoss();
}

function onContextGain(gl) {
    scene.onContextGain(gl);
    renderer.onContextGain(gl);
    renderer.context.clearColor(32 / 256, 32 / 256, 32 / 256, 1);
    runner.start();
}

var monitor = eight.contextMonitor(renderer.canvas, onContextLoss, onContextGain);

onContextGain(renderer.context);
