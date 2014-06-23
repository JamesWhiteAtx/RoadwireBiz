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

.controller('MapCtrl', ['$scope', 'gglMap', function ($scope, gglMaps) {
    //'UsaMap', 'InstMarkers', 'MarkersProx', 'InstMap', // , UsaMap, InstMarkers, MarkersProx, InstMap
    //$scope.srchloc;// = '44709';
    $scope.gglmaps = gglMaps;
}])    
;