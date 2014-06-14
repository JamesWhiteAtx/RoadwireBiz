'use strict';

angular.module('costco.services', ['ngResource'])
.value('version', '0.1')

.factory('installers', ['$http', function ($http) {
    return function () {
        return $http.get('/content/installers.json')
            .then(function (result) {
                return result.data;
            }, function (reason) {
                return reason;
            });
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

    return function () {
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
            name: kitNm, title: 'Leather Color', type: 'ptrnrecs', list: 'kits', parms: kitParms,
            listFcn: function (list) {
                return $.map(list, function (item) {
                    item.sku = item.name;
                    item.name = item.leacolorname;
                    NsUrl('imgbase')
                        .then(function (url) {
                            item.colorurl = url + item.swatchimgurl;
                        }, function (reason) {
                            item.colorurl = '/Content/Images/img_not_avail.png';
                        });
                    return item;
                });
            }
        });

        return mkLvl;
    };
}])

;