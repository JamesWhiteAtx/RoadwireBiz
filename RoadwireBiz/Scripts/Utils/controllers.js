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
    $scope.sets = [];
    $scope.hidSets = [];
    $scope.regSets = [];

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

    var makeSet = function (name, hidden, options) {
        var set = { 
            name: 'Product' + $scope.sets.length.toString(),
            options: []
        };
        set.addOpt = function (opt) {
            var newOpt = makeOpt(opt);
            set.options.push(newOpt);
            return newOpt;
        };
        set.delOpt = function (idx) {
            set.options.splice(idx, 1);
        };

        if (name) {
            set.name = name;
        };
        set.hidden = (hidden === true);
        angular.forEach(options, function (opt) {
            set.addOpt(opt);
        });

        return set;
    }

    var addSet = function (name, hdn, opts) {
        var set = makeSet(name, hdn, opts);
        $scope.sets.push(set);
        return set;
    };
    
    addSet('Leather', true, [{ name: '1Row', price: 799 }, { name: '2Row', price: 1299 }, { name: '3Row', price: 1799 }]);
    addSet('Heathers', true, [{ name: '1Heater', price: 249 }, { name: '2Heater', price: 449 }]);
    //addSet('Jeep Top', ['Jeep Top']);

   
    var combHidSets = function (sets, setIdx, rowArr) {
        setIdx = setIdx || 0;
        rowArr = rowArr || [];

        var addOpt = function (opt) {
            var row = [];

            angular.forEach(rowArr, function (rowOpt, rowIdx) {
                row[rowIdx] = rowOpt;
            });

            row[setIdx] = opt;

            combHidSets(sets, setIdx + 1, row);
        };

        if (sets.length == setIdx) {
            row = { opts: rowArr };

            var price = 0;
            angular.forEach(row.opts, function (opt) {
                if (opt) {
                    price += opt.price;
                };
            });
            row.price = price;

            hidPages.push(row);
            return;
        };

        var set = sets[setIdx];

        if (!set) {
            addOpt(null);
            return;
        }

        angular.forEach(set.options, function (opt) {
            addOpt(opt);
        });
    };

    $scope.calcResults = function () {
        $scope.hidSets = [];
        $scope.regSets = [];

        // segregate hidden from regular
        angular.forEach($scope.sets, function (set) {
            if (set.options.length == 1) {
                set.options[0].name = set.name;
            };
            if (set.hidden) {
                $scope.hidSets.push(set);
            } else {
                $scope.regSets.push(set);
            };
        });

        // calculate hidden page combinations
        hidPages = [];

        var setCnt = $scope.hidSets.length;
        var combos = Math.pow(2, setCnt);
        for (c = 1; c < combos; c++) {
            var sets = [];
            for (b = 0; b < setCnt; b++) {
                var x = (c >> b) & 1;
                var set = (x ? $scope.hidSets[b] : null);
                sets.push(set);
            };
            combHidSets(sets);
        };

        $scope.hidPages = hidPages;

        //regular pages
        var regPages = [];

        angular.forEach($scope.regSets, function (set) {
            angular.forEach(set.options, function (opt) {
                regPages.push(opt)
            });
        });

        $scope.regPages = regPages;
    };

    $scope.newSet = function () {
        addSet().addOpt();
    };

    $scope.delSet = function (idx) {
        $scope.sets.splice(idx, 1);
    }

    $scope.calcResults()
}])

.controller('TestCtrl', ['$scope', function ($scope) {
}])

;