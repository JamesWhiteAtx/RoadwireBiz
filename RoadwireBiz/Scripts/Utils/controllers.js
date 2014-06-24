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

.controller('TestCtrl', ['$scope', function ($scope) {

    var arrOfSets = [
        ['1Row', '2Row', '3Row'],
        ['1Heater', '2Heater'],        ['Prod1']
    ];
    var setCount = arrOfSets.length;
    var results = [];//[['a', 'b', 'c'], ['e', 'f', 'g'], ['h', 'i', 'j']];
   
    var fcn = function (sets, setIdx, rowArr) {
        setIdx = setIdx || 0;
        rowArr = rowArr || [];

        var addItem = function (item) {
            var row = [];

            angular.forEach(rowArr, function (rowVal, rowIdx) {
                row[rowIdx] = rowVal;
            });

            row[setIdx] = item;

            fcn(sets, setIdx + 1, row);
        };

        if (sets.length == setIdx) {
            results.push(rowArr);
            return;
        };

        var set = sets[setIdx];
        if (set.length < 1) {
            addItem(null);
            return;
        }

        angular.forEach(set, function (item) {
            addItem(item);
        });
    };

    var combos = Math.pow(2, arrOfSets.length);
    for (c = 1; c < combos; c++) {
        var sets = [];
        for (b = 0; b < setCount; b++) {
            var x = (c >> b) & 1;
            var set = (x ? arrOfSets[b] : []);
            sets.push(set);
        };
        fcn(sets);
    };
   
    $scope.sets = arrOfSets;
    $scope.results = results;
}])

;