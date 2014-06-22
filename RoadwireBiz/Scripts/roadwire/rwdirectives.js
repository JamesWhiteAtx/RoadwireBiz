angular.module('roadwire.directives', [])
.directive('instMap', ['InstMap', function (InstMap) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            gglMaps: '=gglMaps'
        },
        template:
            '<div id="map-container">'+
                '<form ng-submit="loadInstallers()" id="srchform" name="srchform" novalidate="novalidate">' +
                '<label for="locaddr">Location</label>'+
                '<input type="text" placeholder="current location" title="Enter Location (zip code)" name="locaddr" id="locaddr" ng-model="srchloc" required>'+
                '<button type="submit" id="btnfind" title="Find Locations" ng-disabled="srchform.locaddr.$error.required">'+
                    '<span class="glyphicon glyphicon-search"></span>'+
                    'Find Locations'+
                '</button>'+
                '<button type="button" id="btnreset" title="Reset Map" ng-click="reset()">'+
                    '<span class="glyphicon glyphicon-refresh"></span>'+
                '</button>'+
                '</form>' +
                '<div id="map-canvas">map-canvas</div>'+
            '</div>',

        link: function (scope, element) {
            var map;
            var ctrlDiv = document.getElementById('srchform');
            ctrlDiv.style.display = 'none';
            InstMap('map-canvas', scope.gglMaps).then(function (gMap) {
                map = gMap;
                ctrlDiv.index = 1;
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(ctrlDiv);
                //ctrlDiv.style.display = 'block';
                scope.loadInstallers = function () {
                    map.proxInstallers(scope.srchloc);
                };
                scope.reset = function () {
                    map.reset();
                };
                ctrlDiv.style.display = 'block';
                google.maps.event.addListenerOnce(map, "idle", function () {
                    google.maps.event.trigger(map, 'resize');
                    map.reset();
                });
                //google.maps.event.trigger(map, 'resize');
                //scope.initialize();
                //map.checkResize();
            })
        }
    };
}])