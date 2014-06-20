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

    function HomeControl(controlDiv, map) {

        // Set CSS styles for the DIV containing the control
        // Setting padding to 5 px will offset the control
        // from the edge of the map
        controlDiv.style.padding = '5px';

        // Set CSS for the control border
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderStyle = 'solid';
        controlUI.style.borderWidth = '2px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to set the map to Home';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior
        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '4px';
        controlText.style.paddingRight = '4px';
        controlText.innerHTML = '<b>Home</b>';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to
        // Chicago
        google.maps.event.addDomListener(controlUI, 'click', function () {
            map.setCenter(chicago)
        });
    };

    var map;
    UsaMap('map-canvas', gglMaps).then(function (gMap) {
        map = gMap;

        //var homeControlDiv = document.createElement('div');
        //var homeControl = new HomeControl(homeControlDiv, map);

        var homeControlDiv = document.getElementById('ctrlx');

        homeControlDiv.index = 1;
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(homeControlDiv);
        //homeControlDiv.style.display = 'block';

    })

    $scope.zipcode = '44709';
    $scope.loadInstallers = function () {
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