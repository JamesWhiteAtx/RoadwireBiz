/*
Roadwire Costco 
(c) 2014 Roadwire, Inc.
*/
costco
.controller('CostcoCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
    $scope.routeLea = function () {
        $location.path('/leather');
    };
    $scope.routeInst = function () {
        $location.path('/install');
    };
    $scope.routeOrder = function () {
        $location.path('/order');
    };
}])

.controller('TestCtrl', ['$scope', function ($scope) {
    $scope.test = "test";

    $scope.show2 = false;
    $scope.show3 = false;
    $scope.show4 = false;

    $scope.toggle2 = function () {
        $scope.show2 = !$scope.show2;
    };
    $scope.toggle3 = function () {
        $scope.show3 = !$scope.show3;
    };
    $scope.toggle4 = function () {
        $scope.show4 = !$scope.show4;
    };
}])

.controller('LeaCtrl', ['$scope', 'WidgetData', function ($scope, WidgetData) {
    $scope.trimIsLoading = function () {
        return (($scope.trim) && ($scope.trim.isLoading))
        || (($scope.car) && ($scope.car.isLoading))
        || (($scope.ptrn) && ($scope.ptrn.isLoading));
    }
    $scope.trimHasOpts = function () {
        return (($scope.trim) && ($scope.trim.list) && ($scope.trim.list.length > 1))
        || (($scope.car) && ($scope.car.list) && ($scope.car.list.length > 1))
        || (($scope.ptrn) && ($scope.ptrn.list) && ($scope.ptrn.list.length > 1));
    };
    $scope.trimShowLoading = function () {
        return $scope.trimIsLoading() && !$scope.trimHasOpts();
    };
    $scope.trimShowOpts = function () {
        return $scope.trimHasOpts();
    };


    $scope.intIsLoading = function () {
        return ($scope.int) && (($scope.int.isLoading));
    };
    $scope.intHasOpts = function () {
        return ($scope.int) && (($scope.int.list) && ($scope.int.list.length > 1));
    };
    $scope.intShowLoading = function () {
        return $scope.intIsLoading() && !$scope.intHasOpts();
    };
    $scope.intShowOpts = function () {
        return $scope.intHasOpts();
    };

    $scope.kitHasOpts = function () {
        return ($scope.kit) && (($scope.kit.list) && ($scope.kit.list.length > 0));
    };

    $scope.kitShowLoading = function () {
        $scope.kit.isloading && !$scope.kitHasOpts();
    };
    $scope.kitShowOpts = function () { 
        return $scope.kitHasOpts() || $scope.kit.isloading;
    };

    $scope.pickKit = function (idx) {
        $scope.kit.obj = $scope.kit.list[idx];
        $scope.routeInst();
    };

    function isUndefinedOrNull(val) {
        return (angular.isUndefined(val) || val == null);
    };

    function sameVals(newVal, oldVal) {
        return (newVal === oldVal) || (isUndefinedOrNull(newVal) && isUndefinedOrNull(oldVal));
    };

    var assgnSlctLevel = function (lvlDefn) {
        $scope[lvlDefn.name] = lvlDefn;

        var watchStr = lvlDefn.name + '.obj';
        $scope.$watch(watchStr, function (newVal, oldVal) {
            if (sameVals(newVal, oldVal)) { return; };

            if (!isUndefinedOrNull(lvlDefn.obj)) {
                lvlDefn.loadNextLvl();
            } else {
                lvlDefn.clearNextLvl();
            };
            //$scope.levelChanged();
        });

        return lvlDefn;
    };

    var data = WidgetData();

    data.walkLevels(assgnSlctLevel);

    if ($scope.make.list.length < 1) {
        $scope.make.loadLvl();
    };
}])

.controller('InstCtrl', ['$scope', 'WidgetData', 'Installers', function ($scope, WidgetData, Installers) {
    var data = WidgetData();

    $scope.installers = [];

    Installers()
    .then(function (locs) {
        $scope.installers = locs;
    });
}])

.controller('OrderCtrl', ['$scope', 'WidgetData', function ($scope, WidgetData) {
    var data = WidgetData();
    $scope.items = [];
    
    var addItm = function (name, defn) {
        $scope.items.push({name: name, defn: defn});
    };

    if (data.selector.kit.obj) {
        addItm("Vehicle", data.selector.make.obj.name);
        addItm("Sku", data.selector.kit.obj.sku);
    } else {
        addItm("Vehicle", "geegee");
        addItm("Sku", "skoodio");
    };
}])

.controller('MapCtrl', ['$scope', 'gglMaps', function ($scope, gglMaps) {

    $scope.gglMaps = gglMaps;

    $scope.clicky = function ()
    {
        var z = $scope.map;
        alert('clicky');
    }
    /*
    var map = InstMap("map-canvas");
    $scope.zipcode = null;
    $scope.loadInstallers = function () {
        map.proxInstallers($scope.zipcode);
    };
    $scope.reset = function () {
        map.reset();
    };
    */
}])

;