/*
RoadwireBiz Utils Contollers
(c) 2014 Roadwire, Inc.
*/
utils
.controller('UtilsCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.routeMenu = function () {
        $location.path('/menu');
    };
    $scope.routeCcShop = function () {
        $location.path('/ccshop');
    };
}])

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
    $scope.curPage;

    $scope.pickSlctr = function (prod) {
        $scope.curProd = prod;
        $scope.curSlctr = $scope.curProd.selector;
        $scope.curPage = null;
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