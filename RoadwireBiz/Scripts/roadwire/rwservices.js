/*
RoadwireBiz Roadwire Services
(c) 2014 Roadwire, Inc.
*/
'use strict';

angular.module('roadwire.services', []) // 'ngResource'

.factory('LoadGglMaps', ['$http', '$window', '$q', function ($http, $window, $q) {
    return function (gglMps) {
        // thanks to Neil Soult https://gist.github.com/neilsoult/7255583

        function load_script() {
            var s = document.createElement('script'); // use global document since Angular's $document is weak
            s.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyBvV2XB3ToYVHeUNMbTrr2Otq7ngt5pHD8&sensor=true&libraries=geometry&callback=gglsrvccallback';
            document.body.appendChild(s);
        }

        function lazyLoadApi(key) {
            var deferred = $q.defer();
            $window.gglsrvccallback = function () {
                if ($window.google && $window.google.maps) {
                    deferred.resolve($window.google.maps);
                } else {
                    deferred.reject('gmaps not loaded');
                }
                $window.gglsrvccallback = undefined;
            };
            // thanks to Emil Stenström: http://friendlybit.com/js/lazy-loading-asyncronous-javascript/
            if ($window.attachEvent) {
                $window.attachEvent('onload', load_script);
            } else {
                $window.addEventListener('load', load_script, false);
            }
            return deferred.promise;
        }

        if (gglMps && $window.google && (gglMps == $window.google.maps)) {
            return $q.when(gglMps);
        } else if ($window.google && $window.google.maps) {
            return $q.when($window.google.maps);
        } else {
            return lazyLoadApi().then(function (gglMps) {
                return gglMps;
            });
        };

    };
}])

.factory('Installers', ['$http', function ($http) {
    return function () {
        return $http.get('/content/installers.json', { cache: true })
            .then(function (result) {
                return result.data;
            }, function (reason) {
                return reason;
            });
    };
}])

.factory('InstMarkers', ['$q', 'Installers', 'LoadGglMaps', function ($q, Installers, LoadGglMaps) {

    var makeMarkers = function (fcn, gglMps) {
        var infowindow = new gglMps.InfoWindow({
            content: "Installer Location"
        });

        return Installers()
            .then(function (locs) {
                var markers = [];
                angular.forEach(locs, function (location) {
                    var latLng = new gglMps.LatLng(location.latitude, location.longitude);
                    var marker = new gglMps.Marker({
                        position: latLng,
                        title: location.title
                    });

                    markers.push(marker);
                    marker.location = location;
                    marker.infowindow = infowindow;

                    if (angular.isFunction(fcn)) {
                        fcn(marker);
                    }
                });
                return markers;
            });
    };

    var cacheMarkers;

    return function (fcn, gglMps) {
        if (cacheMarkers) {
            if (angular.isFunction(fcn)) {
                angular.forEach(cacheMarkers, function (marker) {
                    fcn(marker);
                });
            };
            return $q.when(cacheMarkers);
        } else {
            return LoadGglMaps(gglMps).then(function (gglMps) {
                return makeMarkers(fcn, gglMps).then(function (markers) {
                    cacheMarkers = markers;
                    return cacheMarkers;
                });
            });
        };
    };
}])

.factory('MarkersProx', ['$q', 'LoadGglMaps', function ($q, LoadGglMaps) {

    var deci = function (num) {
        return parseFloat(Math.round(num * 100) / 100).toFixed(2);
    };

    var sortProx = function (address, markers, fcn, gglMps) {
        var deferred = $q.defer();
        var geocoder = new gglMps.Geocoder();
        geocoder.geocode({ address: address },
            function (results_array, status) {
                if (status != gglMps.GeocoderStatus.OK) {
                    alert("Sorry - error");
                    return;
                };

                var ltlgAddr = new gglMps.LatLng(
                    results_array[0].geometry.location.lat(),
                    results_array[0].geometry.location.lng());

                angular.forEach(markers, function (marker, idx) {
                    var ltlgShop = marker.position;
                    var proximitymeter = gglMps.geometry.spherical.computeDistanceBetween(ltlgAddr, ltlgShop);
                    var proximitymiles = proximitymeter * 0.000621371192;

                    marker.proximitymiles = proximitymiles;
                    marker.distance = 'distance: ' + deci(proximitymiles) + ' miles';
                });

                markers.sort(function (a, b) { return a.proximitymiles - b.proximitymiles });

                if (angular.isFunction(fcn)) {
                    fcn(markers, ltlgAddr);
                };
                deferred.resolve(markers);
            });
        return deferred.promise;
    };

    return function (address, markers, fcn, gglMps) {
        return LoadGglMaps(gglMps).then(function (gglMps) {
            return sortProx(address, markers, fcn, gglMps);
        });
    };
}])

.factory('UsaMap', ['LoadGglMaps', function (LoadGglMaps) {
    var makeMap = function (mapDiv, gglMps) {
        var map;

        var ltlgCenter = new gglMps.LatLng(38.50, -93.40);
        var boundsUsa = new gglMps.LatLngBounds(new gglMps.LatLng(49.38, -124.39), new gglMps.LatLng(25.82, -66.94));

        var geocoder = new gglMps.Geocoder();
        geocoder.geocode({ address: 'USA' }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                ltlgCenter = results[0].geometry.location;
                boundsUsa = results[0].geometry.viewport;

                if (map && map.recenter) {
                    map.recenter();
                };
            }
        });

        var mapProp = {
            center: ltlgCenter,
            bounds: boundsUsa,
            zoom: 5,
            mapTypeId: gglMps.MapTypeId.ROADMAP
        };

        map = new gglMps.Map(document.getElementById(mapDiv), mapProp);

        var infowindow = new gglMps.InfoWindow({
            content: "Location"
        });

        var locMarker = new gglMps.Marker({
            position: ltlgCenter,
            title: 'location marker',
            icon: 'http://maps.google.com/mapfiles/ms/icons/yellow.png',
            visible: false
        });
        locMarker.setMap(map);

        gglMps.event.addListener(locMarker, 'click', function () {
            infowindow.content = 'Your current position';
            infowindow.open(map, locMarker);
        });

        var recenter = function () {
            map.setCenter(ltlgCenter);
            map.fitBounds(boundsUsa);
        };

        map.infowindow = infowindow;
        map.locMarker = locMarker;
        map.recenter = recenter;

        return map;
    };

    return function (mapDiv, gglMps) {
        return LoadGglMaps(gglMps).then(function (gglMps) {
            return makeMap(mapDiv, gglMps);
        });
    };
}])

.factory('InstMap', ['LoadGglMaps', 'UsaMap', 'InstMarkers', 'MarkersProx', function (LoadGglMaps, UsaMap, InstMarkers, MarkersProx) {
    return function (mapDiv, gglMps) {
        var map;
        return LoadGglMaps(gglMps)
            .then(function (gglmps) {
                // after google maps aquired, create map object
                return UsaMap(mapDiv, gglMps);
            })
            .then(function (gMap) {
                map = gMap;
                return map;
            })
            .then(function (map) {
                // after map object made, define extra functions
                map.proxInstallers = function (addr) {
                    return MarkersProx(addr, map.markers, function (markers, ltlgAddr) {
                        map.locMarker.setPosition(ltlgAddr);
                        map.locMarker.setVisible(true);

                        var bounds = new gglMps.LatLngBounds();
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
                    },
                    gglMps);
                };

                map.reset = function () {
                    if (map.markers) {
                        angular.forEach(map.markers, function (marker) {
                            marker.setVisible(true);
                        });
                    };
                    map.recenter();
                };

                return map;
            })
            .then(function (map) {
                // after core map defined, assign installer markers to map
                return InstMarkers(function (marker) {
                    marker.setMap(map);

                    gglMps.event.addListener(marker, 'click', function () {
                        var html = '<div><p>' + marker.title + '</p>';
                        if (marker.distance) {
                            html += '<p>' + marker.distance + '</p>';
                        };
                        html += '</div>';

                        marker.infowindow.content = html;
                        marker.infowindow.open(map, marker, map.locMarker);
                    });
                },
                gglMps);
            })
            .then(function (markers) {
                // markers are assigned, set map property 
                map.markers = markers;
                // after all setup, return promise resolve to map to caller
                return map;
            })
        ;
    };

    //return function (mapDiv) {
    //    var map = UsaMap(mapDiv);

    //    var markers = InstMarkers(function (marker) {
    //        marker.setMap(map);

    //        google.maps.event.addListener(marker, 'click', function () {
    //            var html = '<div><p>' + marker.title + '</p>';
    //            if (marker.distance) {
    //                html += '<p>' + marker.distance + '</p>';
    //            };
    //            html += '</div>';

    //            marker.infowindow.content = html;
    //            marker.infowindow.open(map, marker, map.locMarker);
    //        });
    //    });

    //    var proxInstallers = function (addr) {
    //        MarkersProx(addr, markers, function (markers, ltlgAddr) {

    //            map.locMarker.setPosition(ltlgAddr);
    //            map.locMarker.setVisible(true);

    //            var bounds = new google.maps.LatLngBounds();
    //            angular.forEach(markers, function (marker, idx) {
    //                if (idx < 5) {
    //                    marker.setVisible(true);
    //                    bounds.extend(marker.position);
    //                } else {
    //                    marker.setVisible(false);
    //                };
    //            });
    //            bounds.extend(map.locMarker.position);

    //            map.fitBounds(bounds);
    //        });
    //    };

    //    var reset = function () {
    //        angular.forEach(markers, function (marker) {
    //            marker.setVisible(true);
    //        });
    //        map.recenter();
    //    };

    //    map.proxInstallers = proxInstallers;
    //    map.markers = markers;
    //    map.reset = reset;

    //    return map;
    //};
}])

;
