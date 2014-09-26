

(function() {
    var IS_DEV = false;
    var d = IS_DEV ? alert : function(line) { console.log(line); };

    var isIos = function() {
        return !!navigator.userAgent.match(/iPhone|iPod|webmate|iPad/);
    };

    var isAndroid = function() {
        return !!navigator.userAgent.match(/Android|dream|CUPCAKE/);
    };

    var defaultParams = {
        width : 640,
        onAdjustment : function(scale) { }
    };

    var merge = function(base, right) {
        var result = {};
        for (var key in base) {
            result[key] = base[key];
            if (key in right) {
                result[key] = right[key];
            }
        }
        return result;
    };

    var zoom = function(ratio) {
        if (document.body) {
            if ("OTransform" in document.body.style) {
                document.body.style.OTransform = "scale(" + ratio + ")";
                document.body.style.OTransformOrigin = "top left";
                document.body.style.width = Math.round(window.innerWidth / ratio) + "px";
            } else if ("MozTransform" in document.body.style) {
                document.body.style.MozTransform = "scale(" + ratio + ")";
                document.body.style.MozTransformOrigin = "top left";
                document.body.style.width = Math.round(window.innerWidth / ratio) + "px";
            } else {
                document.body.style.zoom = ratio;
            }
        }
    };

    if (isIos()) {
        window.viewport = function(params) {
            d("iOS is detected");
            params = merge(defaultParams, params);
            document.write('<meta name="viewport" content="width=' + params.width + ', user-scalable=no" />');
d(params.width);
            window.viewport.adjust = function() {};
        };
    } else if (isAndroid()) {
        window.viewport = function(params) {
            d("Android is detected");
            params = merge(defaultParams, params);

            document.write('<meta name="viewport" content="width=device-width,target-densitydpi=device-dpi, user-scalable=no" />');

            window.viewport.adjust = function() {
                var scale = window.innerWidth / params.width;
                window.viewport.scale = scale;
                zoom(scale);
                params.onAdjustment(scale);
            };

            var orientationChanged = (function() {
                var wasPortrait = window.innerWidth < window.innerHeight;
                return function() {
                    var isPortrait = window.innerWidth < window.innerHeight;
                    var result = isPortrait != wasPortrait;
                    wasPortrait = isPortrait;
                    return result;
                };
            })();

            var aspectRatioChanged = (function() {
                var oldAspect = window.innerWidth / window.innerHeight;
                return function() {
                    var aspect = window.innerWidth / window.innerHeight;
                    var changed = Math.abs(aspect - oldAspect) > 0.0001;
                    oldAspect = aspect;

                    d("aspect ratio changed");
                    return changed;
                };
            });

            window.addEventListener("resize", function() {
                var left = orientationChanged();
                var right = aspectRatioChanged();

                if (left || right) {
                    window.viewport.adjust();
                }
            }, false);
            document.addEventListener('DOMContentLoaded', function() {
                window.viewport.adjust();
            });
        };
    } else {
        window.viewport = function(params) {
            params = merge(defaultParams, params);
            d("PC browser is detected");

            window.viewport.adjust = function() {
                var width = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
                var scale = width / params.width;
                zoom(width / params.width);
                params.onAdjustment(scale);
            };

            window.addEventListener("resize", function() {
                window.viewport.adjust();
            }, false);
            document.addEventListener("DOMContentLoaded", function() {
                window.viewport.adjust();
            });
        };
    }

    window.viewport.isIos = isIos;
    window.viewport.isAndroid = isAndroid;
    window.viewport.isPCBrowser = function() {
        return !isIos() && !isAndroid();
    };
    window.viewport.adjust = function() { };
})();
