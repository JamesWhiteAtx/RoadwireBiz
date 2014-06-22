/*
RoadwireBiz Utils Contollers
(c) 2014 Roadwire, Inc.
*/
utils
.controller('UtilsCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.routeMenu = function () {
        $location.path('/menu');
    };
}])

.controller('MenuCtrl', ['$scope', function ($scope) {
}])

.controller('MapCtrl', ['$scope', 'gglMap', 'InstMap', function ($scope, gglMaps, InstMap) {
    //'UsaMap', 'InstMarkers', 'MarkersProx', // , UsaMap, InstMarkers, MarkersProx
    //$scope.srchloc;// = '44709';
    $scope.gglmaps = gglMaps;
    
    //var map;
    //InstMap('map-canvas', gglMaps).then(function (gMap) {
    //    map = gMap;

    //    var ctrlDiv = document.getElementById('srchform');
    //    ctrlDiv.index = 1;

    //    map.controls[google.maps.ControlPosition.TOP_LEFT].push(ctrlDiv);
    //    //ctrlDiv.style.display = 'block';
    //    $scope.loadInstallers = function () {
    //        map.proxInstallers($scope.srchloc);
    //    };
    //    $scope.reset = function () {
    //        map.reset();
    //    };
    //})
    
    //UsaMap('map-canvas', gglMaps)
    //.then(function (gMap) {
    //    map = gMap;

    //    map.locMarker.setDraggable(true);
    //    map.locMarker.setVisible(true);

    //    gglMaps.event.addListener(map.locMarker, 'dragend', function (event) {
    //        console.log('lat: '+this.getPosition().lat());
    //        console.log('lng: ' + this.getPosition().lng());

    //        $scope.poss.push(this.getPosition());
    //        $scope.$apply();
    //    });

    //});

}])

;