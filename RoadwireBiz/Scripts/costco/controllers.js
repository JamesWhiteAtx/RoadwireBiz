/*
Roadwire Costco 
(c) 2014 Roadwire, Inc.
*/
costco
.controller('CostcoCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
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

.controller('LeaCtrl', ['$scope', 'WidgetData', function ($scope, WidgetData) {
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

.controller('MapCtrl', ['$scope', '$log', 'Installers', 'InstMap', 'InstMarkers', 'MarkersProx',
    function ($scope, $log, Installers, InstMap, InstMarkers, MarkersProx) {
    //$scope.map = "the map goes here";

    var map = InstMap("map-canvas");

    var markers = InstMarkers(function (marker) {
        marker.setMap(map);

        google.maps.event.addListener(marker, 'click', function () {
            var html = '<div><p>' + marker.title + '</p>';
            if (marker.distance) {
                html += '<p>' + marker.distance + '</p>';
            };
            html += '</div>';

            marker.infowindow.content = html;
            marker.infowindow.open(map, marker, map.locMarker);
        });
    });

    $scope.zipcode = null;
    $scope.loadInstallers = function () {
        MarkersProx($scope.zipcode, markers, function(markers, ltlgAddr) {

            map.locMarker.setPosition(ltlgAddr);
            map.locMarker.setVisible(true);

            var bounds = new google.maps.LatLngBounds();
            angular.forEach(markers, function (marker, idx) {
                if (idx < 5) {
                    marker.setVisible(true);
                    bounds.extend(marker.position);
                } else {
                    marker.setVisible(false);
                };
            });
            bounds.extend(map.locMarker.position);

            map.fitBounds(bounds);
        });
    };
    
    $scope.reset = function () {
        angular.forEach(markers, function (marker) {
            marker.setVisible(true);
        });
        map.reset();
    };

    /*
    var ltlgCenter = new google.maps.LatLng(38.50, -93.40);

    var mapProp = {
        center: ltlgCenter,
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapProp);

    var infowindow = new google.maps.InfoWindow({
        content: "Big Ray's Trim Shop"
    });

    var locMarker = new google.maps.Marker({
        position: ltlgCenter,
        title: 'location marker',
        icon: 'http://maps.google.com/mapfiles/ms/icons/yellow.png'
    });
    
    google.maps.event.addListener(locMarker, 'click', function () {
        infowindow.content = 'Your current position';
        infowindow.open(map, locMarker);
    });

    $scope.locations = [];
    Installers()
    .then(function (locs) {
        $scope.locations = locs;
        _.each($scope.locations, function (location, idx) {

            var latLng = new google.maps.LatLng(location.latitude, location.longitude);
            var marker = new google.maps.Marker({
                position: latLng,
                title: location.title
            });
            marker.setMap(map);

            location.marker = marker;

            google.maps.event.addListener(marker, 'click', function () {
                var html = '<div><p>'+marker.title+'</p>';
                if (marker.distance) {
                    html += '<p>' + marker.distance + '</p>';
                };
                html += '</div>';

                infowindow.content = html;
                infowindow.open(map, marker);
            });

        });
    }, function (reason) {
        alert(reason);
    });
    */
    // Zoom to 9 when clicking on marker
    //google.maps.event.addListener(marker,'click',function() {
    //    map.setZoom(9);
    //    map.setCenter(marker.getPosition());
    //});
/*
    var deci = function (num) {
        return parseFloat(Math.round(num * 100) / 100).toFixed(2);
    };

    $scope.zipcode = null;
    $scope.loadInstallers = function () {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: $scope.zipcode },
            function (results_array, status) {
                if (status != "OK") {
                    alert("Sorry - error");
                };

                var ltlgZip = new google.maps.LatLng(
                    results_array[0].geometry.location.lat(),
                    results_array[0].geometry.location.lng());

                locMarker.setPosition(ltlgZip);
                locMarker.setMap(map);

                _.each($scope.locations, function (location, idx) {
                    var marker = location.marker;

                    var ltlgShop = marker.position;
                    var proximitymeter = google.maps.geometry.spherical.computeDistanceBetween(ltlgZip, ltlgShop);
                    var proximitymiles = proximitymeter * 0.000621371192;

                    marker.proximitymiles = proximitymiles;
                    marker.distance = 'distance: ' + deci(proximitymiles) + ' miles';
                });

                $scope.locations.sort(function (a, b) { return a.marker.proximitymiles - b.marker.proximitymiles });

                var bounds = new google.maps.LatLngBounds();
                _.each($scope.locations, function (location, idx) {
                    if (idx < 5) {
                        location.marker.setMap(map);
                        bounds.extend(location.marker.position);
                    } else {
                        location.marker.setMap(null);
                    };
                });
                map.fitBounds(bounds);
            });
    };
*/

}])

;