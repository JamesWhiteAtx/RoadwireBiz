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

.controller('MapCtrl', ['$scope', 'gglMap', 'InstMap', 'UsaMap', 'InstMarkers', 'MarkersProx', function ($scope, gglMaps, InstMap, UsaMap, InstMarkers, MarkersProx) {
    $scope.ggl = gglMaps;

    var map;
    InstMap('map-canvas', gglMaps).then(function (gMap) {
        map = gMap;
    })

    //UsaMap('map-canvas', gglMaps)
    //.then(function (gMap) {
    //    map = gMap;

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