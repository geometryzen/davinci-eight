var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../slideshow/Slide', '../checks/isDefined', '../collections/IUnknownArray', '../checks/mustBeDefined', '../checks/mustBeString', '../collections/NumberIUnknownMap', '../utils/Shareable', '../collections/StringIUnknownMap'], function (require, exports, Slide, isDefined, IUnknownArray, mustBeDefined, mustBeString, NumberIUnknownMap, Shareable, StringIUnknownMap) {
    /**
     * @class Director
     */
    var Director = (function (_super) {
        __extends(Director, _super);
        /**
         * @class Director
         * @constructor
         */
        function Director() {
            _super.call(this, 'Director');
            this.step = -1; // Position before the first slide.
            this.slides = new IUnknownArray([], 'Director.slides');
            this.contexts = new NumberIUnknownMap();
            this.scenes = new StringIUnknownMap('Director.scenes');
            this.drawables = new StringIUnknownMap('Director.drawables');
            this.geometries = new StringIUnknownMap('Director.geometries');
            this.facets = new StringIUnknownMap('Director.facets');
            this.sceneNamesByCanvasId = {};
            this.facetsByCanvasId = new NumberIUnknownMap();
        }
        Director.prototype.destructor = function () {
            this.slides.release();
            this.slides = void 0;
            this.contexts.forEach(function (canvasId, context) {
                context.stop();
            });
            this.contexts.release();
            this.contexts = void 0;
            this.scenes.release();
            this.scenes = void 0;
            this.drawables.release();
            this.drawables = void 0;
            this.geometries.release();
            this.geometries = void 0;
            this.facets.release();
            this.facets = void 0;
            this.facetsByCanvasId.release();
            this.facetsByCanvasId = void 0;
        };
        Director.prototype.addCanvas3D = function (context) {
            this.contexts.put(context.canvasId, context);
        };
        Director.prototype.getCanvas3D = function (canvasId) {
            return this.contexts.get(canvasId);
        };
        Director.prototype.removeCanvas3D = function (canvasId) {
            this.contexts.remove(canvasId);
        };
        Director.prototype.addDrawable = function (drawable, drawableName) {
            this.drawables.put(drawableName, drawable);
        };
        Director.prototype.getDrawable = function (drawableName) {
            if (isDefined(drawableName)) {
                mustBeString('drawableName', drawableName);
                return this.drawables.get(drawableName);
            }
            else {
                return void 0;
            }
        };
        Director.prototype.removeDrawable = function (drawableName) {
            return this.drawables.remove(drawableName);
        };
        Director.prototype.addFacet = function (facet, facetName) {
            this.facets.put(facetName, facet);
        };
        Director.prototype.getFacet = function (facetName) {
            return this.facets.get(facetName);
        };
        Director.prototype.removeFacet = function (facetName) {
            return this.facets.remove(facetName);
        };
        Director.prototype.addGeometry = function (name, geometry) {
            this.geometries.put(name, geometry);
        };
        Director.prototype.removeGeometry = function (name) {
            return this.geometries.remove(name);
        };
        Director.prototype.getGeometry = function (name) {
            return this.geometries.get(name);
        };
        Director.prototype.addScene = function (scene, sceneName) {
            this.scenes.put(sceneName, scene);
        };
        Director.prototype.getScene = function (sceneName) {
            return this.scenes.get(sceneName);
        };
        Director.prototype.removeScene = function (sceneName) {
            return this.scenes.remove(sceneName);
        };
        Director.prototype.isDrawableInScene = function (drawableName, sceneName) {
            mustBeString('drawableName', drawableName);
            mustBeString('sceneName', sceneName);
            var drawable = this.drawables.getWeakRef(drawableName);
            mustBeDefined(drawableName, drawable);
            var scene = this.scenes.getWeakRef(sceneName);
            mustBeDefined(sceneName, scene);
            return scene.containsDrawable(drawable);
        };
        Director.prototype.useDrawableInScene = function (drawableName, sceneName, confirm) {
            mustBeString('drawableName', drawableName);
            mustBeString('sceneName', sceneName);
            var drawable = this.drawables.getWeakRef(drawableName);
            mustBeDefined(drawableName, drawable);
            var scene = this.scenes.getWeakRef(sceneName);
            mustBeDefined(sceneName, scene);
            if (confirm) {
                scene.add(drawable);
            }
            else {
                scene.remove(drawable);
            }
        };
        Director.prototype.useSceneOnCanvas = function (sceneName, canvasId, confirm) {
            var names = this.sceneNamesByCanvasId[canvasId];
            if (names) {
                // TODO: Would be better to model this as a set<string>
                var index = names.indexOf(sceneName);
                if (index < 0) {
                    if (confirm) {
                        names.push(sceneName);
                    }
                    else {
                    }
                }
                else {
                    if (confirm) {
                    }
                    else {
                        names.splice(index, 1);
                        if (names.length === 0) {
                            delete this.sceneNamesByCanvasId[canvasId];
                        }
                    }
                }
            }
            else {
                if (confirm) {
                    this.sceneNamesByCanvasId[canvasId] = [sceneName];
                }
                else {
                }
            }
        };
        Director.prototype.useFacetOnCanvas = function (facetName, canvasId, confirm) {
            // FIXME: Verify that canvasId is a legitimate canvas.
            var facet = this.facets.get(facetName);
            if (facet) {
                try {
                    var facets = this.facetsByCanvasId.get(canvasId);
                    if (!facets) {
                        facets = new StringIUnknownMap('Director');
                        this.facetsByCanvasId.put(canvasId, facets);
                    }
                    facets.put(facetName, facet);
                    facets.release();
                }
                finally {
                    facet.release();
                }
            }
            else {
                console.warn(facetName + ' is not a recognized facet');
            }
        };
        /**
         * Creates a new Slide.
         * @method createSlide
         * @return {Slide}
         */
        Director.prototype.createSlide = function () {
            return new Slide();
        };
        Director.prototype.go = function (step, instant) {
            if (instant === void 0) { instant = false; }
            if (this.slides.length === 0) {
                return;
            }
            while (step < 0)
                step += this.slides.length + 1;
        };
        Director.prototype.forward = function (instant, delay) {
            if (instant === void 0) { instant = true; }
            if (delay === void 0) { delay = 0; }
            if (!this.canForward()) {
                return;
            }
            var slideLeaving = this.slides.getWeakRef(this.step);
            var slideEntering = this.slides.getWeakRef(this.step + 1);
            var self = this;
            var apply = function () {
                if (slideLeaving) {
                    slideLeaving.doEpilog(self, true);
                }
                if (slideEntering) {
                    slideEntering.doProlog(self, true);
                }
                self.step++;
            };
            if (delay) {
                setTimeout(apply, delay);
            }
            else {
                apply();
            }
        };
        Director.prototype.canForward = function () {
            return this.step < this.slides.length;
        };
        Director.prototype.backward = function (instant, delay) {
            if (instant === void 0) { instant = true; }
            if (delay === void 0) { delay = 0; }
            if (!this.canBackward()) {
                return;
            }
            var slideLeaving = this.slides.getWeakRef(this.step);
            var slideEntering = this.slides.getWeakRef(this.step - 1);
            var self = this;
            var apply = function () {
                if (slideLeaving) {
                    slideLeaving.undo(self);
                    slideLeaving.doProlog(self, false);
                }
                if (slideEntering) {
                    slideEntering.doEpilog(self, false);
                }
                self.step--;
            };
            if (delay) {
                setTimeout(apply, delay);
            }
            else {
                apply();
            }
        };
        Director.prototype.canBackward = function () {
            return this.step > -1;
        };
        Director.prototype.pushSlide = function (slide) {
            return this.slides.push(slide);
        };
        Director.prototype.advance = function (interval) {
            var slideIndex = this.step;
            if (slideIndex >= 0 && slideIndex < this.slides.length) {
                var slide = this.slides.get(slideIndex);
                if (slide) {
                    try {
                        slide.advance(interval);
                    }
                    finally {
                        slide.release();
                    }
                }
                else {
                    // This should never happen if we manage the index properly.
                    console.warn("No slide found at index " + this.step);
                }
            }
        };
        Director.prototype.render = function () {
            var director = this;
            var canvasIds = this.contexts.keys;
            for (var i = 0, iLength = canvasIds.length; i < iLength; i++) {
                var canvasId = canvasIds[i];
                var c3d = this.contexts.getWeakRef(canvasId);
                // prolog?
                var ambients = this.facetsByCanvasId.getWeakRef(canvasId);
                // FIXME: scenesByCanvasId
                var sceneNames = this.sceneNamesByCanvasId[canvasId];
                if (sceneNames) {
                    for (var j = 0, jLength = sceneNames.length; j < jLength; j++) {
                        var sceneName = sceneNames[j];
                        var scene = this.scenes.getWeakRef(sceneName);
                        scene.draw(ambients.values, canvasId);
                    }
                }
            }
        };
        return Director;
    })(Shareable);
    return Director;
});
