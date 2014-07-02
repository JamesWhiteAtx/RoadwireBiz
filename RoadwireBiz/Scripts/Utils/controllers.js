/*
RoadwireBiz Utils Contollers
(c) 2014 Roadwire, Inc.
*/
utils
.controller('UtilsCtrl', ['$scope', '$location', '$modal', 'WhyInstDlg', function ($scope, $location, $modal, WhyInstDlg) {
    $scope.routeMenu = function () {
        $location.path('/menu');
    };
    $scope.routeCcShop = function () {
        $location.path('/ccshop');
    };

    $scope.WhyInstall = function () {

        WhyInstDlg();

        //var modalInstance = $modal.open({
        //    templateUrl: '/Partial/Utils/WhyInstall', 
        //    controller: 'WhyInstCtrl',
        //    windowClass: 'why-install'
        //});
    };

}])

//.controller('WhyInstCtrl', ['$scope', '$modalInstance', 'FindInst', function ($scope, $modalInstance, FindInst) {
//    $scope.close = function () {
//        $modalInstance.close();
//    };

//    $scope.isloading = false;
//    $scope.srchAddr;
//    $scope.radius = 100;
//    $scope.proxLocs = [];

//    $scope.findInstallers = function (addr, radius) {
//        $scope.isloading = true;
//        $scope.srchAddr = null;
//        $scope.proxLocs = [];

//        var prom = FindInst(addr, radius)
//        prom.then(
//            function (result) {
//                $scope.srchAddr = result.srchAddr;
//                $scope.proxLocs = result.instLocs;
//            },
//            function (err) {
//                $scope.srchAddr = err;
//            }
//        );
//        prom['finally'](function (data) {
//            $scope.isloading = false;
//            $scope.$apply();
//        });
//    };

//    //$scope.findInstallers = function (addr, radius) {
//    //    $scope.srchAddr = null;
//    //    $scope.proxLocs = [];

//    //    $scope.isloading = true;
//    //    InstMarkers().then(function (markers) {
//    //        //alert('findInstallers');
//    //        MarkersProx(addr, markers, function (markers, result) {
//    //            $scope.srchAddr = result.formatted_address;
//    //        })
//    //        .then(
//    //            function (markers) {
//    //                var marker;
//    //                for (var i = 0, len = markers.length; i < len; i++) {
//    //                    marker = markers[i];

//    //                    if (angular.isNumber(radius)) {
//    //                        if (angular.isNumber(marker.proximitymiles) && (marker.proximitymiles > radius)) {
//    //                            break;
//    //                        }
//    //                    } else if (i > 10) {
//    //                        break;
//    //                    }
//    //                    if (angular.isNumber(marker.proximitymiles)) {
//    //                        $scope.proxLocs.push(marker);
//    //                    };

//    //                }
//    //            },
//    //            function (err) {
//    //                $scope.srchAddr = err;
//    //            }
//    //        )
//    //        ['finally'](function (xx) {
//    //            $scope.isloading = false;
//    //            $scope.$apply();
//    //        });
//    //    });
        
//    //};
//}])

.controller('MenuCtrl', ['$scope', function ($scope) {
}])

.controller('MapCtrl', ['$scope', 'gglMaps', function ($scope, gglMaps) {
    $scope.gglmaps = gglMaps;
}])

.controller('CcPagesCtrl', ['$scope', 'CcPagesData', function ($scope, CcPagesData) {
    $scope.selectors = [];
    $scope.prods = [];
    $scope.regProds = [];
    $scope.regPages = [];

    $scope.calcResults = function () {
        data.calcResults();

        $scope.selectors = data.selectors;
        $scope.prods = data.prods;
        $scope.regProds = data.regProds;
        $scope.regPages = data.regPages;

        $scope.totalReg = data.totalReg;
        $scope.totalLand = data.totalLand;
        $scope.totalHid = data.totalHid;
    };

    $scope.newSlctr = function () {
        return data.addSlctr()
    };

    $scope.delSlctr = function (idx) {
        data.delSlctr(idx);
    };

    $scope.newProd = function () {
        data.addProd();
    };

    $scope.delProd = function (idx) {
        $scope.prods.splice(idx, 1);
    }

    $scope.shopNow = function () {
        data.calcResults();
        $scope.routeCcShop();
    };

    var data = CcPagesData();
    $scope.calcResults();
}])

.controller('CcShopCtrl', ['$scope', 'CcPagesData', function ($scope, CcPagesData) {
    var data = CcPagesData();
    $scope.selectors = data.selectors;
    $scope.prods = data.prods;
    $scope.regProds = data.regProds;
    $scope.cart = data.cart || [];

    $scope.curProd;
    $scope.curSlctr;
    $scope.openSlctr = false;
    $scope.curPage;

    $scope.pickSlctr = function (prod) {
        $scope.curProd = prod;
        $scope.curSlctr = $scope.curProd.selector;
        $scope.openSlctr = true;
        $scope.curPage = null;
    };

    $scope.slctProd = function () {
        $scope.openSlctr = false;
    };

    $scope.pickPage = function (prod, opt) {
        $scope.curProd = prod;
        $scope.curSlctr = null;
        $scope.curPage = opt;
        $scope.curPage.qty = 1;
    }

    $scope.buyPage = function (page) {
        var item = {
            name: page.name,
            price: page.price,
            qty: page.qty,
        };
        $scope.cart.push(item);
    }
    $scope.delCart = function (idx) {
        $scope.cart.splice(idx, 1);
    }

    $scope.$watchCollection(
        "cart",
        function (newValue, oldValue) {
            var tot = 0;
            angular.forEach($scope.cart, function (item) {
                tot += item.qty * item.price;
            });
            $scope.cartTot = tot;
            data.cart = $scope.cart;
        }
    );
}])

.controller('TestCtrl', ['$scope', function ($scope) {

}])

;