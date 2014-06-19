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
    //$scope.aa = one;
    //$scope.bb = two;
}])

.controller('MapCtrl', ['$scope', function ($scope) {
}])

;