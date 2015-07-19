///////////////////////////////////////////////////////////////////////////////
// Autodesk.ADN.Viewing.Extension.API
// by Philippe Leefsma, October 2014
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.Kolbaska = function(viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer, options);

    var _self = this;

    _self.load = function () {

        console.log('LOADING...');

        Autodesk.Viewing.Viewer3D.prototype.getCurrentView =
            function (viewname) {
                var view = {
                    id: newGuid(),
                    name: viewname,
                    position: this.navigation.getPosition(),
                    target: this.navigation.getTarget(),
                    fov: this.getFOV(),
                    up: this.navigation.getCameraUpVector(),
                    worldUp: this.navigation.getWorldUpVector(),
                    explode: this.getExplodeScale()
                };

                return view;
            };

        Autodesk.Viewing.Viewer3D.prototype.setView =
            function (view) {
                viewer.explode(view.explode);
                this.navigation.setRequestTransitionWithUp(
                    true,
                    new THREE.Vector3(
                        view.position.x,
                        view.position.y,
                        view.position.z),
                    new THREE.Vector3(
                        view.target.x,
                        view.target.y,
                        view.target.z),
                    view.fov,
                    new THREE.Vector3(
                        view.up.x,
                        view.up.y,
                        view.up.z));

                this.resize();
            };

        Autodesk.Viewing.Viewer3D.prototype.getPropertyValue =

            function (dbId, displayName, callback) {

                function _cb(result) {

                    if (result.properties) {

                        for (var i = 0; i < result.properties.length; i++) {

                            var prop = result.properties[i];

                            if (prop.displayName === displayName) {

                                callback(prop.displayValue);
                                return;
                            }
                        }

                        callback('undefined');
                    }
                }

                this.getProperties(dbId, _cb);
            };

        Autodesk.Viewing.Viewer3D.prototype.getAllLeafComponents =

            function (callback) {

                function getLeafComponentsRec(parent) {

                    var components = [];

                    if (typeof parent.children !== "undefined") {

                        var children = parent.children;

                        for (var i = 0; i < children.length; i++) {

                            var child = children[i];

                            if (typeof child.children !== "undefined") {

                                var subComps = getLeafComponentsRec(child);

                                components.push.apply(components, subComps);
                            }
                            else {
                                components.push(child);
                            }
                        }
                    }

                    return components;
                }

                this.getObjectTree(function (result) {

                    var allLeafComponents = getLeafComponentsRec(result);

                    callback(allLeafComponents);
                });
            };

        Autodesk.Viewing.Viewer3D.prototype.startMotionLoop =

            function () {

                if (this.hasOwnProperty("motionLoop"))
                    return;

                var viewer = this;

                viewer.motionCallbacks = {};

                var watch = new Stopwatch();

                this.motionLoop = setInterval(function () {

                    var elapsed = watch.getElapsedMs();

                    for (var motion in viewer.motionCallbacks) {

                        var callback = viewer.motionCallbacks[motion];

                        callback(elapsed);
                    }

                }, 100);

            }

        Autodesk.Viewing.Viewer3D.prototype.startExplodeMotion =

            function (speed, min, max) {

                this.stopExplodeMotion();

                this.startMotionLoop();

                var viewer = this;

                var scale = min;

                var explodeMotion = function (elapsed) {

                    scale += speed * 0.001 * elapsed;

                    if (scale > max) {

                        scale = max;
                        speed = -speed;
                    }

                    else if (scale < min) {

                        scale = min;
                        speed = -speed;
                    }

                    viewer.explode(scale);
                }

                this.motionCallbacks['explode'] = explodeMotion;
            }

        Autodesk.Viewing.Viewer3D.prototype.stopExplodeMotion =

            function () {

                if (this.hasOwnProperty("motionLoop")) {

                    delete this.motionCallbacks['explode'];

                    this.explode(0);
                }
            }

        Autodesk.Viewing.Viewer3D.prototype.startRndMotion =

            function (speed, axis) {

                this.stopRndMotion();

                this.startRndLoop();

                var viewer = this;

                var rndMotion = function (elapsed) {

                    var view = viewer.getCurrentView('animate');

                    var position = new THREE.Vector3(
                        view.position.x,
                        view.position.y,
                        view.position.z
                    );

                    var rAxis = new THREE.Vector3(
                        axis.x, axis.y, axis.z
                    );

                    var plane = {
                        a: view.position.x,
                        b: view.position.y,
                        c: view.position.z,
                        d: rAxis.length
                    };

                    var normalVector = new THREE.Vector3(
                        plane.a,
                        plane.b,
                        plane.c
                    );
                    var vectorInPlane = new THREE.Vector3(
                        view.position.x,
                        view.position.y,
                        view.position.z
                    );

                    var newBasis = new THREE.Matrix4().makeRotationAxis(
                        normalVector,
                        speed * 0.001 * elapsed);
                    var rndPoint = new THREE.Vector3(
                        view.position.x,
                        view.position.y,
                        view.position.z
                    );
                    vectorInPlane = rndPoint.applyMatrix4(newBasis);
                    position = position.applyVector(vectorInPlane);

                    viewer.navigation.setPosition(position);
                };

                this.motionCallbacks['move'] = rndMotion;
            }

        Autodesk.Viewing.Viewer3D.prototype.stopRndMotion =

            function () {

                if (this.hasOwnProperty("moveLoop")) {

                    delete this.motionCallbacks['move'];
                }
            }

        Autodesk.Viewing.Viewer3D.prototype.startRotateMotion =

            function (speed, axis) {

                this.stopRotateMotion();

                this.startMotionLoop();

                var viewer = this;

                var rotateMotion = function (elapsed) {

                    var view = viewer.getCurrentView('animate');

                    var position = new THREE.Vector3(
                        view.position.x,
                        view.position.y,
                        view.position.z
                    );

                    var rAxis = new THREE.Vector3(
                        axis.x, axis.y, axis.z
                    );

                    var matrix = new THREE.Matrix4().makeRotationAxis(
                        rAxis,
                        speed * 0.001 * elapsed);

                    position.applyMatrix4(matrix);

                    viewer.navigation.setPosition(position);
                };

                this.motionCallbacks['rotate'] = rotateMotion;
            }

        Autodesk.Viewing.Viewer3D.prototype.stopRotateMotion =

            function () {

                if (this.hasOwnProperty("motionLoop")) {

                    delete this.motionCallbacks['rotate'];
                }
            }

        return true;
    };

    _self.unload = function () {

        console.log('Autodesk.ADN.Viewing.Extension.API unloaded');
        return true;
    };
};

Autodesk.ADN.Viewing.Extension.API.prototype =
    Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.API.prototype.constructor =
    Autodesk.ADN.Viewing.Extension.API;

Autodesk.Viewing.theExtensionManager.registerExtension(
    'Autodesk.ADN.Viewing.Extension.API',
    Autodesk.ADN.Viewing.Extension.API);