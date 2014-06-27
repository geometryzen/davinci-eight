/**
 * @const
 * @type {string}
 */
var EVENT_NAME_RESIZE = 'resize';

/**
 * @const
 * @type {string}
 */
var TAG_NAME_CANVAS = 'canvas';

function removeElementsByTagName(doc: Document, tagname: string) {
    var elements = doc.getElementsByTagName(tagname);
    for (var i = elements.length - 1; i >= 0; i--) {
        var e = elements[i];
        e.parentNode.removeChild(e);
    }
}

var workbench3D = function(canvas: HTMLCanvasElement, renderer, camera: { aspect: number; }, win: Window = window) {
    var doc = win.document;

    function syncToWindow() {
        var width = win.innerWidth;
        var height = win.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
    }

    var onWindowResize = function(event) { syncToWindow(); };

    var that =
        {
            setUp: function() {
                doc.body.insertBefore(canvas, doc.body.firstChild);
                win.addEventListener(EVENT_NAME_RESIZE, onWindowResize, false);
                syncToWindow();
            },
            tearDown: function() {
                win.removeEventListener(EVENT_NAME_RESIZE, onWindowResize, false);
                removeElementsByTagName(doc, TAG_NAME_CANVAS);
            }
        };

    return that;
};

export = workbench3D;
