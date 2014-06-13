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

    $scope.trimHasOpts = function () {
        return ($scope.trim) && ($scope.trim.list) && ($scope.trim.list.length > 1)
        || ($scope.car) && ($scope.car.list) && ($scope.car.list.length > 1)
        || ($scope.ptrn) && ($scope.ptrn.list) && ($scope.ptrn.list.length > 1);
    };

    $scope.intHasOpts = function () {
        return ($scope.int) && ($scope.int.list) && ($scope.int.list.length > 1);
    };

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
    //$scope.map = "the map goes here";

    //var mapProp = {
    //    center: new google.maps.LatLng(51.508742, -0.120850),
    //    zoom: 5,
    //    mapTypeId: google.maps.MapTypeId.ROADMAP
    //};

    //var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    //var myCenter = new google.maps.LatLng(51.508742, -0.120850);
    //var marker = new google.maps.Marker({
    //    position: myCenter,
    //    //animation: google.maps.Animation.BOUNCE
    //    bonez: 'tugz'
    //});
    //marker.setMap(map);

    // Zoom to 9 when clicking on marker
    //google.maps.event.addListener(marker,'click',function() {
    //    map.setZoom(9);
    //    map.setCenter(marker.getPosition());
    //});

    //Open an InfoWindow When Clicking on The Marker
    //var infowindow = new google.maps.InfoWindow({
    //    content: "Big Ray's Trim Shop"
    //});

    //google.maps.event.addListener(marker, 'click', function () {
    //    infowindow.open(map, marker);
    //});

    //////////////////////////////////////////////////////
    var allMarkers = [
        {
            title: 'Seattle',
            latitude: 47.62,
            longitude: -122.36,
        },
        {
            title: 'Portland',
            latitude: 45.54,
            longitude: -122.67,
        },
        {
            title: 'San Francisco',
            latitude: 37.67,
            longitude: -122.40 ,
        },
        {
            title: 'Los Angeles',
            latitude: 33.97,
            longitude: -118.27,
        },
        {
            title: 'Denver',
            latitude: 39.76,
            longitude: -104.96,
        },
        {
            title: 'Kansas City',
            latitude: 39.05,
            longitude: -94.59,
        },
        {
            title: 'Chicago',
            latitude: 41.86,
            longitude: -87.56
        },

        {
            title: 'St Louis',
            latitude: 38.64,
            longitude: -90.24,
        },
        {
            title: 'Dallas',
            latitude: 32.72,
            longitude: -96.83,
        },
        {
            title: 'Austin',
            latitude: 30.26,
            longitude: -97.71,
        },
        {
            title: 'San Antonio',
            latitude: 29.41,
            longitude: -98.48,
        },
        {
            title: 'Houston',
            latitude: 29.79,
            longitude: -95.44,
        },
        {
            title: 'Midland',
            latitude: 31.99,
            longitude: -102.08,
        },
        {
            title: 'Pittsburgh',
            latitude: 40.41,
            longitude: -79.96 
        },
        {
            title: 'Trenton',
            latitude: 40.25,
            longitude: -74.75
        },
        {
            title: 'Atlanta',
            latitude: 33.73,
            longitude: -84.42
        },
        {
            title: 'Orlando',
            latitude: 28.55,
            longitude: -81.34
        },
        {
            title: 'Brimingham',
            latitude: 33.55,
            longitude: -86.83
        },
        {
            title: 'Boston',
            latitude: 42.35,
            longitude: -71.06 
        }

    ];

    $scope.map = {
        control: {},
        center: {
            latitude: 38.50,
            longitude: -93.40
        },
        zoom: 4,
        fit: false,
        markers: allMarkers,
        zipMarkers: []
    };

    var onMarkerClicked = function (marker) {
        marker.showWindow = true;
        $scope.$apply();
    };

    var infowindow = new google.maps.InfoWindow({
        content: "Big Ray's Trim Shop"
    });

    var myMarker = new google.maps.Marker({
        position: new google.maps.LatLng(51.508742, -0.120850),
        bonez: 'tugz'
    });

    _.each($scope.map.markers, function (marker, idx) {

        marker.id = idx;
        marker.showWindow = false;
        marker.distance = null;

        marker.closeClick = function () {
            marker.showWindow = false;
            $scope.$apply();
        };
        marker.onClicked = function () {
            $scope.map.fit = false;
            onMarkerClicked(marker);
            //var map = $scope.map.control.getGMap();
            //infowindow.open(map, myMarker);

        };
    });

    var deci = function (num) {
        return parseFloat(Math.round(num * 100) / 100).toFixed(2);
    };

    var zipMarker = {
        coords: {
            latitude: 0,
            longitude: 0
        },
        icon: 'http://maps.google.com/mapfiles/ms/icons/yellow.png',
        options: { draggable: true },
        events: {
            dragend: function (marker, eventName, args) {
                $log.log('marker dragend');
                $log.log('latitude: ' + deci(marker.getPosition().lat() ));
                $log.log('longitude: ' + deci(marker.getPosition().lng() ));
            }
        }
    };
    $scope.searchLocationMarker = zipMarker;

    $scope.zipcode = null;
    $scope.loadInstallers = function () {
        $scope.map.fit = false;
        //$scope.searchLocationMarker = zipMarker;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: $scope.zipcode },
            function (results_array, status) {
                if (status != "OK") {
                    alert("Sorry - error");
                };

                var zipCord = new google.maps.LatLng(
                    results_array[0].geometry.location.lat(),
                    results_array[0].geometry.location.lng());

                $scope.searchLocationMarker.coords.latitude = results_array[0].geometry.location.lat();
                $scope.searchLocationMarker.coords.longitude = results_array[0].geometry.location.lng();

                $scope.search = '';
                _.each(allMarkers, function (marker, idx) {
                    var shopCord = new google.maps.LatLng(
                        marker.latitude,
                        marker.longitude);
                    var proximitymeter = google.maps.geometry.spherical.computeDistanceBetween(zipCord, shopCord);
                    var proximitymiles = proximitymeter * 0.000621371192;
                    
                    marker.proximitymiles = proximitymiles;
                    marker.distance = 'distance: ' + deci(proximitymiles) + ' miles';

                    //if (proximitymiles <= 100) {
                    //    closest.push(marker);
                    //    $scope.search = $scope.search + ', ' + marker.title + ' ' + deci(proximitymiles);
                    //};
                });

                allMarkers.sort(function (a, b) { return a.proximitymiles - b.proximitymiles });
                $scope.map.markers = [];
                for (var i = 0; i < 3; i++) {
                    $scope.map.markers.push(allMarkers[i]);
                }
                $scope.map.fit = true;

                $scope.$apply();
            });
    };

    $scope.reset = function () {
        //$scope.searchLocationMarker = null;
        $scope.map.markers = allMarkers;
        $scope.map.fit = true;
    };

}])

;