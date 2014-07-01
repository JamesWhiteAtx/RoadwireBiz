/*
Roadwire Costco 
(c) 2014 Roadwire, Inc.
*/
costco
.controller('DialogController', ['$scope', 'dialog', function ($scope, dialog) {
    $scope.close = function (result) {
        dialog.close(result);
    };
}])
.controller('CostcoCtrl', ['$rootScope', '$scope', '$location', '$dialog', function ($rootScope, $scope, $location, $dialog) {

    var t =
        '<div class="modal-header">' +
        '<h3>Why Professional Installation?</h3>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div class="pull-left"> ' +
        '<img alt="" src="\/Content\/images\/testimonials.png" class="img-polaroid"/>' +
        '</div>' +
        '<p>There is nothing quite as satisfying as building or fixing something yourself. However, there are some things that are better left to the professionals. While Roadwire\'s products help deliver the ultimate driving experience, the greatest and most long-lasting enjoyment comes when they are properly installed.</p>' +
        '<p>For this reason, Roadwire has bundled professional installation into all of its product packages. Roadwire has partnered with InstallerNet, the largest independent installation network in the country, to match you with qualified, top-rated, local restylers that can help you get the most out of your Roadwire products. When you make a purchase on Costco, you will receive an InstallCard. Simply visit the website on the back of the card or call the number, enter the code, and schedule your install. It is that easy. If you run in to any problems, InstallerNet\'s friendly installation coordinators can assist you with any questions you may have.</p>' +
        '<p>Now, Roadwire and InstallerNet have removed the hassle from buying products on Costco. We have bundled the product, professional installation, free shipping, and our industry-leading 3 year/36,000 mile warranty into one low price. Buy with confidence knowing you are getting the best deal, direct from the manufacturer to you!</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button ng-click="close(result)" class="btn btn-primary" >Close</button>' +
        '</div>';

    $scope.opts = {
        backdrop: true,
        backdropFade: true,
        dialogFade: true,
        keyboard: true,
        backdropClick: true,
        template: t,
        controller: 'DialogController'
    };

    $scope.installInfo = function () {
        var d = $dialog.dialog($scope.opts);
        d.open().then(function (result) {
            if (result) {
                //alert('dialog closed with result: ' + result);
            }
        });
    };



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
        $scope.routeInst();
    };

    $scope.price = function () {
        if ($scope.ptrn && $scope.ptrn.obj) {
            return LeaPrice($scope.ptrn.obj.rowsid);
        };
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