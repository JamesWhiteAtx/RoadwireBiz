/*
Roadwire Costco Linkout
(c) 2014 Roadwire, Inc.
*/
costco
.controller('CostcoCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
    $scope.routeCar = function () {
        $location.path('/car');
    };
}])
.controller('CarCtrl', ['$scope', 'SlctLevel', 'SelectorList', function ($scope, SlctLevel, SelectorList) {

    $scope.make = {
        obj: {},
        list: [{ name: "ac" }, { name: "hon" }, { name: "toy" }]
    };

    function isUndefinedOrNull(val) {
        return (angular.isUndefined(val) || val == null);
    };

    function sameVals(newVal, oldVal) {
        return (newVal === oldVal) || (isUndefinedOrNull(newVal) && isUndefinedOrNull(oldVal));
    };

    $scope.levelChanged = function () {
        if ($scope.kit.obj) {
            $scope.kitsAvailable = true;
            $scope.ebaylisturl = $scope.kit.obj.ebaylisturl;
        } else {
            $scope.kitsAvailable = false;
            $scope.ebaylisturl = undefined;
        }
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

            $scope.levelChanged();
        });

        return lvlDefn;
    };

    //makeLevels($scope);
    //assgnSlctLevel(

    var mkLvl = SelectorList();
    var lvl = mkLvl;
    while (lvl) {
        assgnSlctLevel(lvl);
        lvl = lvl.getNextLvl();
    };

    $scope.make.loadLvl();

}])
;