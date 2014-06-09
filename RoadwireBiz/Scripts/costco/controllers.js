/*
Roadwire Costco Linkout
(c) 2014 Roadwire, Inc.
*/
costco
.controller('CostcoCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
    $scope.routeCar = function () {
        $location.path('/car');
    };
}])
.controller('CarCtrl', ['$scope', function ($scope) {
    $scope.make = {
        obj: {},
        list: [{ name: "ac" }, { name: "hon" }, { name: "toy" }]
    };
}])
;