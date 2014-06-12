/*
Roadwire Costco 
(c) 2014 Roadwire, Inc.
*/
costco
.controller('CostcoCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
    $scope.routeCar = function () {
        $location.path('/car');
    };
}])
.controller('CarCtrl', ['$scope', 'SlctLevel', 'SelectorList', function ($scope, SlctLevel, SelectorList) {

    $scope.click = function () {
        $scope.year.shouldFocus = true;
        //angular.element('#slct-year').trigger('focus');
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

    var mkLvl = SelectorList();
    var lvl = mkLvl;
    while (lvl) {
        assgnSlctLevel(lvl);
        lvl = lvl.getNextLvl();
    };

    $scope.make.loadLvl();
}])

.controller('MapCtrl', ['$scope', '$log', function ($scope, $log) {
    $scope.map = "the map goes here";

    var mapProp = {
        center: new google.maps.LatLng(51.508742, -0.120850),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    var myCenter = new google.maps.LatLng(51.508742, -0.120850);
    var marker = new google.maps.Marker({
        position: myCenter,
        //animation: google.maps.Animation.BOUNCE
        bonez: 'tugz'
    });
    marker.setMap(map);

    // Zoom to 9 when clicking on marker
    //google.maps.event.addListener(marker,'click',function() {
    //    map.setZoom(9);
    //    map.setCenter(marker.getPosition());
    //});

    //Open an InfoWindow When Clicking on The Marker
    var infowindow = new google.maps.InfoWindow({
        content: "Big Ray's Trim Shop"
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });

    //////////////////////////////////////////////////////
    //$scope.map = {
    //    center: {
    //        latitude: 38.50,
    //        longitude: -93.40
    //    },
    //    zoom: 4,
    //    markers: [
    //    {
    //        id: 1,
    //        latitude: 45,
    //        longitude: -74,
    //        showWindow: false,
    //        title: 'Marker 2'
    //    },
    //    {
    //        id: 2,
    //        latitude: 38.22433924449191,
    //        longitude: -117.30624999999998,
    //        showWindow: false,
    //        title: 'Marker 2'
    //    },
    //    {
    //        id: 3,
    //        latitude: 37,
    //        longitude: -122,
    //        showWindow: false,
    //        title: 'Plane'
    //    }
    //    ],
    //};

    //var onMarkerClicked = function (marker) {
    //    marker.showWindow = true;
    //    $scope.$apply();
    //};

    //_.each($scope.map.markers, function (marker) {
    //    marker.closeClick = function () {
    //        marker.showWindow = false;
    //        $scope.$apply();
    //    };
    //    marker.onClicked = function () {
    //        onMarkerClicked(marker);
    //    };
    //});

    //$scope.searchLocationMarker = {
    //    coords: {
    //        latitude: 38.50,
    //        longitude: -93.40
    //    },
    //    options: { draggable: true },
    //    events: {
    //        dragend: function (marker, eventName, args) {
    //            $log.log('marker dragend');
    //            $log.log(marker.getPosition().lat());
    //            $log.log(marker.getPosition().lng());
    //        }
    //    }
    //};



}])

;