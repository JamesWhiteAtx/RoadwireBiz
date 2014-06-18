'use strict';

angular.module('costco.services', ['ngResource'])
.value('version', '0.1')

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

.factory('InstMarkers', ['$http', 'Installers', function ($http, Installers) {
    var markers;

    var makeMarkers = function (fcn) {
        var markers = [];
        var infowindow = new google.maps.InfoWindow({
            content: "Installer Location"
        });

        Installers()
        .then(function (locs) {
            angular.forEach(locs, function (location) {
                var latLng = new google.maps.LatLng(location.latitude, location.longitude);
                var marker = new google.maps.Marker({
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
        }, function (reason) {
            alert(reason);
        });

        return markers
    }

    return function (fcn) {
        if (!markers) {
            markers = makeMarkers(fcn);
        } else {
            if (angular.isFunction(fcn)) {
                angular.forEach(markers, function (marker) {
                    fcn(marker);
                });
            };
        };
        return markers;
    };

}])

.factory('MarkersProx', ['$http', function ($http) {

    var deci = function (num) {
        return parseFloat(Math.round(num * 100) / 100).toFixed(2);
    };

    return function (address, markers, fcn) {

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address },
            function (results_array, status) {
                if (status != "OK") {
                    alert("Sorry - error");
                    return;
                };

                var ltlgAddr = new google.maps.LatLng(
                    results_array[0].geometry.location.lat(),
                    results_array[0].geometry.location.lng());

                angular.forEach(markers, function (marker, idx) {
                    var ltlgShop = marker.position;
                    var proximitymeter = google.maps.geometry.spherical.computeDistanceBetween(ltlgAddr, ltlgShop);
                    var proximitymiles = proximitymeter * 0.000621371192;

                    marker.proximitymiles = proximitymiles;
                    marker.distance = 'distance: ' + deci(proximitymiles) + ' miles';
                });

                markers.sort(function (a, b) { return a.proximitymiles - b.proximitymiles });

                if (angular.isFunction(fcn)) {
                    fcn(markers, ltlgAddr);
                };
                
            });
    };
}])

.factory('InstMap', ['$http', function ($http) {
    return function (mapDiv) {
        var map;

        var ltlgCenter = new google.maps.LatLng(38.50, -93.40);
        var zoom = 4;

        var mapProp = {
            center: ltlgCenter,
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById(mapDiv), mapProp);

        var infowindow = new google.maps.InfoWindow({
            content: "Location"
        });

        var locMarker = new google.maps.Marker({
            position: ltlgCenter,
            title: 'location marker',
            icon: 'http://maps.google.com/mapfiles/ms/icons/yellow.png',
            visible: false
        });
        locMarker.setMap(map);

        google.maps.event.addListener(locMarker, 'click', function () {
            infowindow.content = 'Your current position';
            infowindow.open(map, locMarker);
        });

        var reset = function () {
            map.setCenter(ltlgCenter);
            map.setZoom(zoom);
        }

        map.infowindow = infowindow;
        map.locMarker = locMarker;
        map.reset = reset;

        return map;
    };
}])

.factory('NsUrl', ['$http', function ($http) {
    return function (type) {
        return $http.get('/netsuite/' + type, { cache: true })
            .then(function (result) {
                var url = result.data.url;
                return url;
            }, function (reason) {
                return reason;
            });
    };
}])

.factory('NsUrlJsonP', ['NsUrl', function (NsUrl) {
    return function (type) {
        return NsUrl(type)
            .then(function (url) {
                return url + "&callback=JSON_CALLBACK";
            }, function (reason) {
                return $q.reject(reason);
            });
    };
}])

.factory('Selector', ['$http', '$q', 'NsUrlJsonP', function ($http, $q, NsUrlJsonP) {
    return function (parmObj) {
        return NsUrlJsonP('leaslctr')
            .then(function (url) {
                return $http.jsonp(url, { params: parmObj });
            }, function (reason) {
                return $q.reject(reason);
            });
    };
}])

.factory('SlctLevel', ['$http', 'Selector', function ($http, Selector) {

    var makeSlctLevel = function(options) {
        var prevLvl = options.prev;
        var nextLvl;

        var lvlDefn = {
            name: options.name,
            title: options.title,
            type: options.type,
            listProp: options.list,
            parmsArr: options.parms,
            listFcn: options.listFcn,
            obj: undefined,
            list: []
        };

        lvlDefn.getPrevLvl = function () { return prevLvl; }
        lvlDefn.getNextLvl = function () { return nextLvl; }

        lvlDefn.makeNext = function (options) {
            options.prev = lvlDefn;
            nextLvl = makeSlctLevel(options);
            return nextLvl;
        };

        function isUndefinedOrNull(val) {
            return (angular.isUndefined(val) || val == null);
        };

        function sameVals(newVal, oldVal) {
            return (newVal === oldVal) || (isUndefinedOrNull(newVal) && isUndefinedOrNull(oldVal));
        };

        lvlDefn.loadNextLvl = function () {
            if (angular.isDefined(nextLvl)) {
                nextLvl.loadLvl();
            };
        };

        lvlDefn.clearLevel = function () {
            lvlDefn.list = [];
            lvlDefn.obj = undefined;
        };

        lvlDefn.clearNextLvl = function () {
            if (angular.isDefined(nextLvl)) {
                nextLvl.clearLevel();
                nextLvl.clearNextLvl();
            };
        };

        lvlDefn.makeParm = function () {
            var parm = { type: lvlDefn.type };

            if (angular.isArray(lvlDefn.parmsArr)) {
                var assigned = 0;
                var tot = lvlDefn.parmsArr.length;
                var prev = lvlDefn.getPrevLvl();
                while ((prev) && (assigned < tot)) {
                    $.each(lvlDefn.parmsArr, function (index, parmDfn) {
                        if ((prev.name == parmDfn.name) && (prev.obj) && (prev.obj.hasOwnProperty(parmDfn.prop))) {
                            parm[parmDfn.parm] = prev.obj[parmDfn.prop];
                            tot++;
                        }
                    });
                    prev = prev.getPrevLvl();
                };
            };
            return parm;
        };

        lvlDefn.preLoad = function () {
            lvlDefn.isLoading = true;
            lvlDefn.list = [];
            lvlDefn.obj = undefined;
        };

        lvlDefn.loadSuccess = function (data) {
            lvlDefn.list = data[lvlDefn.listProp];

            if (angular.isFunction(lvlDefn.listFcn)) {
                lvlDefn.list = lvlDefn.listFcn(lvlDefn.list);
            }

            lvlDefn.isLoading = false;
            if (lvlDefn.list.length === 1) {
                lvlDefn.obj = lvlDefn.list[0];
            } else {
                lvlDefn.shouldFocus = true;
            }
        };

        lvlDefn.loadFail = function () {
            lvlDefn.isLoading = false;
        };

        lvlDefn.loadLvl = function () {
            lvlDefn.preLoad();

            Selector(lvlDefn.makeParm())
                .then(function (result) {
                    if (result.data.success) {
                        lvlDefn.loadSuccess(result.data);
                    } else {
                        lvlDefn.loadFail();
                    };
                }, function (reason) {
                    lvlDefn.loadFail(reason);
                });

        };

        return lvlDefn;
    };

    return makeSlctLevel;
}])

.factory('Share', function () {
    var mkLvl;
    return function () {
        if (!mkLvl) {
            mkLvl = { x: "1" };
        };
        return mkLvl;
    };
})

.factory('SelectorList', ['SlctLevel', 'NsUrl', function (SlctLevel, NsUrl) {

    var defnParm = function (parm, name, prop) {
        return { parm: parm, name: name, prop: prop };
    }

    var makeNm = 'make';
    var yearNm = 'year';
    var modelNm = 'model';
    var bodyNm = 'body';
    var trimNm = 'trim';
    var carNm = 'car';
    var ptrnNm = 'ptrn';
    var intNm = 'int';
    var kitNm = 'kit';

    var yrParms = [defnParm('makeid', makeNm, 'id')]
    var mdParms = yrParms.concat([defnParm('year', yearNm, 'name')]);
    var bdParms = mdParms.concat([defnParm('modelid', modelNm, 'id')]);
    var trParms = bdParms.concat([defnParm('bodyid', bodyNm, 'id')]);
    var crParms = trParms.concat([defnParm('trimid', trimNm, 'id')]);
    var ptParms = [defnParm('carid', carNm, 'id')]
    var intParms = ptParms.concat([defnParm('ptrnid', ptrnNm, 'id')]);
    var kitParms = intParms.concat([defnParm('intcolid', intNm, 'id')]);

    var makeLevels = function () {
        var mkLvl = SlctLevel({ name: makeNm, title: 'Make', type: 'makes', list: 'makes' });
        var lvl = mkLvl.makeNext({ name: yearNm, title: 'Year', type: 'years', list: 'years', parms: yrParms });
        lvl = lvl.makeNext({ name: modelNm, title: 'Model', type: 'models', list: 'models', parms: mdParms });
        lvl = lvl.makeNext({ name: bodyNm, title: 'Body', type: 'bodies', list: 'bodies', parms: bdParms });
        lvl = lvl.makeNext({ name: trimNm, title: 'Trim', type: 'trims', list: 'trims', parms: trParms });
        lvl = lvl.makeNext({ name: carNm, title: 'Vehicle', type: 'cars', list: 'cars', parms: crParms });
        lvl = lvl.makeNext({
            name: ptrnNm, title: 'Configuration', type: 'carptrns', list: 'patterns', parms: ptParms,
            listFcn: function (list) {
                return $.map(list, function (item) {
                    item.ptrnname = item.name;
                    item.name = item.seldescr;
                    return item;
                });
            }
        });
        lvl = lvl.makeNext({ name: intNm, title: 'Interior Color', type: 'carintcols', list: 'intColors', parms: intParms });
        lvl = lvl.makeNext({
            name: kitNm, title: 'Leather Color', type: 'ptrnrecscostco', list: 'kits', parms: kitParms,
            listFcn: function (list) {

                var ntAvlUrl = '/Content/Images/img_not_avail.png';
                var imgUrl = function (base, rest) {
                    if ((base) && (rest)) {
                        return base + rest;
                    } else {
                        return ntAvlUrl;
                    }
                };

                return $.map(list, function (item) {
                    item.sku = item.name;
                    item.name = item.leacolorname;
                    NsUrl('imgbase')
                        .then(function (url) {
                            item.mainimgurl = imgUrl(url, item.storeimgurl);
                            item.colorurl = imgUrl(url, item.swatchimgurl);
                            if (item.storeimgurl) {
                                item.displayUrl = item.mainimgurl;
                            } else {
                                item.displayUrl = item.colorurl;
                            }
                        }, function (reason) {
                            item.mainimgurl = imgUrl(false);
                            item.colorurl = imgUrl(false);
                            item.displayUrl = imgUrl(false);
                        });
                    return item;
                });
            }
        });

        return mkLvl;
    };

    var rootLvl;
    return function () {
        if (!rootLvl) {
            rootLvl = makeLevels();
        };
        return rootLvl;
    };
}])

.factory('WidgetData', ['SelectorList', function (SelectorList) {
    var data;
    return function () {
        if (!data) {
            data = {};
        };
        if (!data.rootLvl) {
            data.rootLvl = SelectorList();
        };
        
        data.walkLevels = function (fcn) {
            var lvl = data.rootLvl;
            while (lvl) {
                if (angular.isFunction(fcn)) {
                    fcn(lvl);
                };
                lvl = lvl.getNextLvl();
            };
        };

        if (!data.selector) {
            data.selector = {};
            data.walkLevels(function (lvlDefn) {
                data.selector[lvlDefn.name] = lvlDefn;
            });
        };

        return data;
    };
}])

;