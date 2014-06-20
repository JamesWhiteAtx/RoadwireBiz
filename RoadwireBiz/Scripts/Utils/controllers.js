﻿/*
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

.controller('MapCtrl', ['$scope', 'gglMap', 'InstMap', 'UsaMap', 'InstMarkers', 'MarkersProx', function ($scope, gglMaps, InstMap, UsaMap, InstMarkers, MarkersProx) {

    var map;
    InstMap('map-canvas', gglMaps).then(function (gMap) {
        map = gMap;
    })

    $scope.zipcode = '44709';
    $scope.bound = function () {
        map.proxInstallers($scope.zipcode);
    };
    $scope.reset = function () {
        map.reset();
    };

    //UsaMap('map-canvas', gglMaps)
    //.then(function (gMap) {
    //    map = gMap;

    //    map.locMarker.setDraggable(true);
    //    map.locMarker.setVisible(true);

    //    gglMaps.event.addListener(map.locMarker, 'dragend', function (event) {
    //        console.log('lat: '+this.getPosition().lat());
    //        console.log('lng: ' + this.getPosition().lng());

    //        $scope.poss.push(this.getPosition());
    //        $scope.$apply();
    //    });

    //});

    //$scope.zipcode;
    //$scope.bound = function ()
    //{
        //map.recenter();
        //var bounds = new gglMaps.LatLngBounds(new gglMaps.LatLng(49.38, -124.39), new gglMaps.LatLng(25.82, -66.94));

        //angular.forEach($scope.poss, function (pos, idx) {
            //bounds.extend(pos);
        //});

        //bounds.extend(new gglMaps.LatLng(46.0, -97.0));
        //bounds.extend(new gglMaps.LatLng(40.0, -76.0));
        //bounds.extend(new gglMaps.LatLng(30.0, -98.0));
        //bounds.extend(new gglMaps.LatLng(40.0, -117.0));

        //map.fitBounds(bounds);

        //$scope.poss = [];
    //}

    //    return InstMarkers(function (marker) {
    //        marker.setMap(map);

    //        gglMaps.event.addListener(marker, 'click', function () {
    //            var html = '<div><p>' + marker.title + '</p>';
    //            if (marker.distance) {
    //                html += '<p>' + marker.distance + '</p>';
    //            };
    //            html += '</div>';

    //            marker.infowindow.content = html;
    //            marker.infowindow.open(map, marker, map.locMarker);
    //        });
    //    },
    //    gglMaps);
    //})
    //.then(function (markers) {
    //    $scope.markers = markers;
    //    return MarkersProx('44709', markers, function (markers, ltlgAddr) {

    //        map.locMarker.setPosition(ltlgAddr);
    //        map.locMarker.setVisible(true);

    //        var bounds = new gglMaps.LatLngBounds();
    //        angular.forEach(markers, function (marker, idx) {
    //            if (idx < 5) {
    //                marker.setVisible(true);
    //                bounds.extend(marker.position);
    //            } else {
    //                marker.setVisible(false);
    //            };
    //        });
    //        bounds.extend(map.locMarker.position);

    //        map.fitBounds(bounds);

    //    },
    //    gglMaps);
    //})
    //.then(function (markers) {
    //    var x = markers;
    //})
    //.catch(function (reason) {
    //    alert(reason);
    //});


}])

;