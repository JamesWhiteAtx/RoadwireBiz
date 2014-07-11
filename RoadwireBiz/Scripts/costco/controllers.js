/*
Roadwire Costco 
(c) 2014 Roadwire, Inc.
*/
costco
.controller('CostcoCtrl', ['$rootScope', '$scope', '$location', 'WhyInstDlg', function ($rootScope, $scope, $location, WhyInstDlg) {
    $scope.routeLea = function () {
        $location.path('/leather');
    };
    $scope.routeInst = function () {
        $location.path('/install');
    };
    $scope.routeConfirm = function () {
        $location.path('/confirm');
    };

    $scope.WhyInstall = function () {
        WhyInstDlg();
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

.controller('LeaCtrl', ['$scope', 'WidgetData', 'LeaPrice', function ($scope, WidgetData, LeaPrice) {
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
        $scope.routeConfirm();
    };

    $scope.price = function () {
        if ($scope.ptrn && $scope.ptrn.obj) {
            return LeaPrice($scope.ptrn.obj.rowsid);
        };
    };

    $scope.lightbkg = true;

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

.controller('ConfirmCtrl', ['$scope', 'WidgetData', function ($scope, WidgetData) {
    $scope.lines = [];
    
    var addLine = function (title, url) {
        var line = {
            title: title, 
            items: [], 
            url: url
        };

        line.item = function(descr, total) {
            line.items.push({descr: descr, total: total});
            return line;
        };

        $scope.lines.push(line);
        return line;
    };

    var data = WidgetData();

    if (data.selector.kit.obj) {
        //addItm("Vehicle", data.selector.make.obj.name);
        //addItm("Sku", data.selector.kit.obj.sku);
    } else {
        addLine('Leather Seat', 'https://system.sandbox.netsuite.com//core/media/media.nl?id=224&c=801095&h=b2c9a5bec52d11efe3b5')
            .item('122 Quick Silver ELECTRIC BASE', 1299)
            .item('Part Number: 633386')
            .item('Pattern: ELECTRIC BASE');
        
        addLine('Seat Heaters')
            .item('Driver Side Seat Heater', 249.00)
            .item('Passenger Side Seat Heater', 249.00)
            .item('Multi Heaters Discount', -49.00);

        addLine('Total').item('', 1749.00);
        
        addLine('Your Car').item('CODA 2012 ELECTRIC COD 12-12 ELECTRIC BASE SEDAN');
    };

    $scope.member = data.member;

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