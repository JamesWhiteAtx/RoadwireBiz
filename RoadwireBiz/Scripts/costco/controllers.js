/*
Roadwire Costco 
(c) 2014 Roadwire, Inc.
*/
costco
.controller('CostcoCtrl', ['$rootScope', '$scope', '$location', 'WhyInstDlg', function ($rootScope, $scope, $location, WhyInstDlg) {
    $scope.routeLea = function () {
        $location.path('/leather');
    };
    $scope.routeHtr = function () {
        $location.path('/heaters');
    };
    $scope.routeInst = function () {
        $location.path('/install');
    };
    $scope.routeConfirm = function () {
        $location.path('/confirm');
    };

    $scope.whyInstall = function () {
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

.controller('LeaCtrl', ['$scope', 'WidgetData', 'Product', function ($scope, WidgetData, Product) {
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
            return Product.leaPrice($scope.ptrn.obj.rowsid);
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

.controller('HtrCtrl', ['$scope', 'WidgetData', 'Product', function ($scope, WidgetData, Product) {

    var dispPrc = function (disp, price) {
        return { checked: false, disp: disp, price: price };
    }

    $scope.heater1 = dispPrc(Product.htrDisp(1), Product.htrPrice(1));
    $scope.heater2 = dispPrc(Product.htrDisp(2), Product.htrPrice(1));
    $scope.discount = dispPrc(Product.htrDiscDisp(2), Product.htrDisc(2) * -1);
    

    var calcHeaters = function () {
        if ($scope.heater1.checked) {
            if ($scope.heater2.checked) {
                data.heaters = 2;
            } else {
                data.heaters = 1;
            };
        } else {
            $scope.heater2.checked = false;
            data.heaters = 0;
        };
        
        $scope.total = Product.htrPrice(data.heaters);
        $scope.heaters = data.heaters;
    };

    $scope.$watch('heater1.checked', function (newVal, oldVal) {
        if (newVal === oldVal) { return; };
        calcHeaters();
    });
    $scope.$watch('heater2.checked', function (newVal, oldVal) {
        if (newVal === oldVal) { return; };
        calcHeaters();
    });

    var data = WidgetData();

    $scope.heaters = data.heaters;

    if (data.heaters > 0) {
        $scope.heater1.checked = true;
        if (data.heaters > 1) {
            $scope.heater2.checked = true;
        };
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
    var data;
    
    var addLine = function (title, installed, url, edtFcn, delFcn) {
        var line = {
            title: title,
            installed: installed,
            url: url,
            items: [],
            edtFcn: edtFcn, 
            delFcn: delFcn
        };

        line.item = function (descr, total) {
            line.items.push({descr: descr, total: total});
            return line;
        };

        $scope.lines.push(line);
        return line;
    };

    var calcTotal = function () {
        $scope.total = 0;
        angular.forEach($scope.lines, function (line) {
            angular.forEach(line.items, function (item) {
                if (angular.isNumber(item.total)) {
                    $scope.total += item.total;
                };
            });
        });
    };

    var delLine = function (idx) {
        $scope.lines.splice(idx, 1);
        calcTotal();
    };

    var delLea = function (idx) {
        data.order.clearLea();
        delLine(idx);
    };
    var delHea = function (idx) {
        data.clearHtrs();
        delLine(idx);
    };

    $scope.hasProd = function () {
        return data.order.hasProd();
    };
    $scope.hasMember = function () {
        return data.member.complete();
    };

    $scope.confirmable = function () {
        return data.confirmable();
    };
    
    var objProp = function (str, obj, nm) {
        str = str || '';
        nm = nm || 'name';
        if (obj && obj[nm]) {
            str = str + ' ' + obj[nm];
        };
        return str.trim();
    };

    data = WidgetData();

    //if (data.selector.kitSelected()) {
        data.order.loadSlctr()
        data.order.loadHtrs();
    //} else {
    //    data.order.car.make = { id: '1', name: 'CODA' };
    //    data.order.car.year = { id: '2', name: '2012' };
    //    data.order.car.model = { id: '3', name: 'ELECTRIC' };
    //    data.order.car.body = { id: '4', name: 'BODY' };
    //    data.order.car.trim = { id: '5', name: 'Base' };
    //    data.order.car.car = { id: '6', name: 'coda electri base' };
    //    data.order.car.int = { id: '8', name: 'Green' };

    //    data.order.lea.ptrn = { id: '7', name: '123231' };
    //    data.order.lea.kit = { id: '9', name: '123232-PT' };
    //    data.order.lea.color = '122 Quick Silver';
    //    data.order.lea.dispUrl = 'https://system.sandbox.netsuite.com//core/media/media.nl?id=224&c=801095&h=b2c9a5bec52d11efe3b5';
    //    data.order.lea.price = 1299;

    //    data.heaters = 2;
    //    data.order.loadHtrs();
    //};

    var descr = '';

    if (data.order.hasCar()) {
        descr = objProp('', data.order.car.make);
        descr = objProp(descr, data.order.car.year);
        descr = objProp(descr, data.order.car.model);
        descr = objProp(descr, data.order.car.car);
        addLine('Your Vehicle', false, null, function () { $scope.routeLea(); }).item(descr);
    };

    if (data.order.hasLea()) {
        var leaLine = addLine('Leather Seat', true, data.order.lea.dispUrl, function () { $scope.routeLea(); }, delLea);

        leaLine.item(data.order.lea.rowsDisp, data.order.lea.price);

        descr = objProp('Color: ', data.order.lea, 'color');
        leaLine.item(descr);

        descr = objProp('Part Number: ', data.order.lea.kit);
        leaLine.item(descr);

        descr = objProp('Pattern: ', data.order.lea.ptrn);
        leaLine.item(descr);
    };

    if (data.order.hasHtrs()) {
        var heatLine = addLine('Seat Heaters', true, null, function () { $scope.routeHtr(); }, delHea)
            .item(data.order.htrs.drv.disp, data.order.htrs.drv.price);

        if (data.order.htrs.psg) {
            heatLine.item(data.order.htrs.psg.disp, data.order.htrs.psg.price);
        }
        if (data.order.htrs.disc) {
            heatLine.item(data.order.htrs.disc.disp, data.order.htrs.disc.price * -1);
        }
    };

    calcTotal();
    
    $scope.alerts = [];
    var addAlert = function (quest, info, yes, addFcn) {
        var alert = { quest: quest, info: info, yes: yes, addFcn: addFcn };
        $scope.alerts.push(alert);
    };

    if (!data.order.hasLea()) {
        addAlert('Interested in adding Leather Seat Covers?', 'Roadwire offers the finest leather interiors in the business. Take a look at our excellent offers!', 'Shop for Leather Seat Covers', $scope.routeLea);
    };

    if (!data.order.hasHtrs()) {
        addAlert('Interested in adding Seat Heaters?', 'Roadwire offers the finest seat heating systems in the business. Take a look at our excellent offers!', 'Shop for Seat Heaters', $scope.routeHtr);
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