/*
RoadwireBiz CcAdmin Contollers
(c) 2014 Roadwire, Inc.
*/

ccAdmin
.controller('CcAdminCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.routeMenu = function () {
        $location.path('/menu');
    };
}])

.controller('MenuCtrl', ['$scope', function ($scope) {
}])

.controller('ProductsCtrl', ['$scope', 'CcProducts', function ($scope, CcProducts) {
    var unWatches = [];
    var resetVars = function () {
        $scope.prods = null;
        $scope.prodChanges = false;
        $scope.hash = {};
        $scope.invalidForms = [];
    };

    $scope.addInvalidForm = function (id) {
        var idx = $scope.invalidForms.indexOf(id);
        if (idx == -1) {
            $scope.invalidForms.push(id);
        }
    }
    $scope.delInvalidForm = function (id) {
        var idx = $scope.invalidForms.indexOf(id);
        if (idx != -1) {
            $scope.invalidForms.splice(idx, 1);
        }
    }
    $scope.anyInvalidForms = function () {
        return (($scope.invalidForms) && ($scope.invalidForms.length > 0));
    }

    var load = function () {
        return CcProducts({ cache: false })
            .then(function (data) {
                $scope.prods = data;
                return $scope.prods;
            }, function (err) {
                $scope.err = err;
                return $scope.err;
            });
    };

    $scope.reload = function() {
        resetVars();
        angular.forEach(unWatches, function (unwatch) {
            if (angular.isFunction(unwatch)) {
                unwatch();
            }
        });
        unWatches = [];
        load()
            .then(function (data) {
                var unwatch;
                angular.forEach($scope.prods, function (prod) {

                    $scope.hash[prod.Code] = prod;
                    //var nm = 'hash.' + prod.Code;
                    unwatch = $scope.$watch(
                        function () { return $scope.hash[prod.Code]; },
                        function (newValue, oldValue) {
                            if (!angular.equals(newValue, oldValue)) {
                                if (newValue && (!newValue.changed)) {
                                    newValue.changed = true;
                                    $scope.prodChanges = true;
                                }
                            };
                       
                        },
                        true
                    );
                    unWatches.push(unwatch);
                });
            }, function (err) {
            });
    };

    $scope.saveChanges = function () {
        angular.forEach($scope.prods, function (prod) {
            if (prod.changed) {
                alert(prod.Code);
            };
        });
    }

    $scope.reload();
}])

.controller('ProdController', ['$scope', function ($scope) {
    $scope.$watch(
        function () { return { description: $scope.p.Description, price: $scope.p.Price }; },
        function (newVal, oldVal) {
            if ($scope.prodForm.$valid) {
                $scope.delInvalidForm($scope.p.id);
            } else {
                $scope.addInvalidForm($scope.p.id);
            }
        },
        true
    );
}])

;