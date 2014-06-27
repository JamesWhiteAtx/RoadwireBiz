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

.controller('MapCtrl', ['$scope', 'gglMaps', function ($scope, gglMaps) {
    $scope.gglmaps = gglMaps;
}])

.controller('CcPagesCtrl', ['$scope', function ($scope) {
    $scope.selectors = [];
    $scope.prods = [];
    $scope.hidProds = [];
    $scope.regProds = [];

    var hidPages = [];
    $scope.hidPages = [];
    var regPages = [];
    $scope.regPages = [];

    var makeOpt = function(opt, prc) {
        var option = {
            name: 'Option',
            price: 1
        };
        option.setName = function (nm) {
            if (angular.isString(nm)) {
                option.name = nm;
            };
        };
        option.setPrice = function (pr) {
            if (angular.isNumber(pr)) {
                option.price = pr;
            };
        };

        if (angular.isString(opt)) {
            option.setName(opt);
        } else if (angular.isObject(opt)) {
            option.setName(opt.name);
            option.setPrice(opt.price);
        };
        option.setPrice(prc);

        return option;
    }

    var makeProd = function (name, selector, options) {
        var prod = { 
            name: 'Product' + $scope.prods.length.toString(),
            options: []
        };
        prod.addOpt = function (opt) {
            var newOpt = makeOpt(opt);
            prod.options.push(newOpt);
            return newOpt;
        };
        prod.delOpt = function (idx) {
            prod.options.splice(idx, 1);
        };

        if (name) {
            prod.name = name;
        };
        prod.selector = selector;
        angular.forEach(options, function (opt) {
            prod.addOpt(opt);
        });

        return prod;
    }

    var addProd = function (name, slctr, opts) {
        var prod = makeProd(name, slctr, opts);
        $scope.prods.push(prod);
        return prod;
    };
    
    var makeSlctr = function (name) {
        var slctr = {
            name: name || 'Selector' + $scope.selectors.length.toString(),
            prods: []
        };
        return slctr;
    };

    var addSlctr = function (name) {
        var slctr = makeSlctr(name);
        $scope.selectors.push(slctr);
        return slctr;
    };

    var combProdOpts = function (pages, prods, prodIdx, rowArr) {
        prodIdx = prodIdx || 0;
        rowArr = rowArr || [];

        var addOpt = function (opt) {
            var row = [];

            angular.forEach(rowArr, function (rowOpt, rowIdx) {
                row[rowIdx] = rowOpt;
            });

            row[prodIdx] = opt;

            combProdOpts(pages, prods, prodIdx + 1, row);
        };

        if (prods.length == prodIdx) {
            row = { opts: rowArr };

            var price = 0;
            angular.forEach(row.opts, function (opt) {
                if (opt) {
                    price += opt.price;
                };
            });
            row.price = price;

            pages.push(row);
            return;
        };

        var prod = prods[prodIdx];

        if (!prod) {
            addOpt(null);
            return;
        }

        angular.forEach(prod.options, function (opt) {
            addOpt(opt);
        });
    };

    // segregate selector from regular
    var segrProds = function () {
        $scope.regProds = [];
        $scope.hidProds = [];

        angular.forEach($scope.selectors, function (slctr) {
            slctr.prods = [];
        });

        angular.forEach($scope.prods, function (prod) {
            if (prod.options.length == 1) {
                prod.options[0].name = prod.name;
            };
            if (prod.selector) {
                prod.selector.prods.push(prod);
                $scope.hidProds.push(prod);
            } else {
                $scope.regProds.push(prod);
            };
        });
    };

    //regular pages
    var calcReg = function () {
        var regPages = [];
        angular.forEach($scope.regProds, function (prod) {
            var prfx = '';
            if (prod.options.length > 1) {
                prfx = prod.name + '-';
            };
            angular.forEach(prod.options, function (opt) {
                regPages.push(makeOpt(prfx + opt.name, opt.price));
            });
        });
        $scope.regPages = regPages;
    };

    // calculate selector page combinations
    var calcSlctrs = function () {
        angular.forEach($scope.selectors, function (slctr) {
            calcSlctrPages(slctr);
        });
    };

    var calcSlctrPages = function (slctr) {
        var pages = [];

        var prodCnt = slctr.prods.length;
        var combos = Math.pow(2, prodCnt);
        for (c = 1; c < combos; c++) {
            var prods = [];
            for (b = 0; b < prodCnt; b++) {
                var x = (c >> b) & 1;
                var prod = (x ? slctr.prods[b] : null);
                prods.push(prod);
            };
            combProdOpts(pages, prods);
        };

        slctr.pages = pages;
    };

    $scope.calcResults = function () {
        // segregate selector from regular
        segrProds();

        // calculate selector page combinations
        calcSlctrs();

        //regular pages
        calcReg();

        var totReg = $scope.regPages.length;
        var totHid = 0;
        angular.forEach($scope.selectors, function (slctr) {
            totHid += slctr.pages.length;
        });

        $scope.totalReg = totReg;
        $scope.totalHid = totHid;
    };

    $scope.newSlctr = function () {
        return addSlctr()
    };

    $scope.delSlctr = function (idx) {
        $scope.selectors.splice(idx, 1);
    };

    $scope.newProd = function () {
        addProd().addOpt();
    };

    $scope.delProd = function (idx) {
        $scope.prods.splice(idx, 1);
    }

    var slctrLea = addSlctr('Leather');

    addProd('Leather Kit', slctrLea, [{ name: '1Row', price: 799 }, { name: '2Row', price: 1299 }, { name: '3Row', price: 1799 }]);
    addProd('Heaters', slctrLea, [{ name: '1Heater', price: 249 }, { name: '2Heater', price: 449 }]);
    //addProd('Jeep Top', ['Jeep Top']);

    $scope.calcResults()
}])

.controller('TestCtrl', ['$scope', function ($scope) {
}])

;