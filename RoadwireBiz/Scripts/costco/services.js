'use strict';

angular.module('costco.services', []) // 'ngResource'
.value('version', '0.1')

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
                    if ((item.rowsid == 1) || (item.rowsid == 2) || (item.rowsid == 3)) {
                        item.ptrnname = item.name;
                        item.name = item.seldescr;
                        return item;
                    }
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
                    if ((item.isspecial === true) || (item.isclearance === true)) {
                        return null
                    };
                    item.partno = item.name;
                    NsUrl('imgbase')
                        .then(function (url) {
                            item.mainimgurl = imgUrl(url, item.storeimgurl);
                            item.colorurl = imgUrl(url, item.swatchimgurl);
                            item.displayUrl = item.colorurl;
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

.factory('WidgetData', ['SelectorList', 'Pricer', function (SelectorList, Pricer) {
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
            var selector = {};

            data.walkLevels(function (lvlDefn) {
                selector[lvlDefn.name] = lvlDefn;
            });

            selector.kitSelected = function () {
                return (selector.kit.obj && selector.kit.obj.id);
            }

            data.selector = selector;
        };

        if (!data.heaters) {
            data.heaters = 0;
        };

        if (!data.member) {
            var member = {
                email:'',
                lastname:'',
                postal:'',
                phone:''
            };

            member.complete = function () {
                return (member.email) && (member.lastname) && (member.postal) && (member.phone);
            };

            data.member = member;
        };

        if (!data.order) {
            var order = {
                car: {},
                lea: {},
                heat: {}
            };

            order.clearCar = function () {
                order.car = {};
            };
            order.clearLea = function () {
                order.lea = {};
            };
            order.clearHeat = function () {
                order.heat = {};
            };

            order.loadSlctr = function () {
                var car = {};
                var lea = {};

                data.walkLevels(function (lvlDefn) {
                    car[lvlDefn.name] = {};
                    var obj = data.selector[lvlDefn.name].obj;
                    if (obj) {
                        car[lvlDefn.name] = { id: obj.id, name: obj.name };
                    };
                });

                lea.ptrn = car.ptrn;
                lea.kit = car.kit;
                lea.color = data.selector.kit.obj ? data.selector.kit.obj.leacolorname : null;
                lea.dispUrl = data.selector.kit.obj ? data.selector.kit.obj.displayUrl : null;
                lea.price = data.selector.ptrn.obj ? Pricer.leaRows(data.selector.ptrn.obj.rowsid) : 0;

                order.car = car;
                order.lea = lea;
            };

            order.loadHeat = function () {
                var heat = {
                    qty: data.heaters,
                    driver: 0,
                    pass: 0,
                    disc: 0
                };

                if (heat.qty > 0) {
                    heat.driver = Pricer.heaters(1);
                    if (heat.qty == 2) {
                        heat.pass = Pricer.heaters(1);
                        heat.disc = Pricer.heatDisc(2);
                    };
                };

                order.heat = heat;
            };

            order.hasCar = function () {
                return ((order.car.car) && (order.car.car.id));
            };
            order.hasLea = function () {
                return ((order.lea.kit) && (order.lea.kit.id));
            };
            order.hasHeat = function () {
                return (order.heat.qty);
            };

            order.hasProd = function () {
                return (order.hasLea() || order.hasHeat());
            };

            data.order = order;
        };

        data.clearHeat = function () {
            data.heaters = 0;
            data.order.clearHeat();
        };

        data.confirmable = function () {
            return data.order.hasProd() && data.member.complete();
        };

        return data;
    };
}])

.factory('Pricer', [function () {

    var leaRows = function (rowid) {
        if (rowid == 1) {
            return 799.00;
        } else if (rowid == 2) {
            return 1299.00;
        } else if (rowid == 3) {
            return 1799.00;
        } else {
            return null;
        }
    };

    var heaters = function (qty) {
        if (qty == 1) {
            return 249.00;
        } else if (qty == 2) {
            return 449.00;
        } else {
            return null;
        }
    };

    var heatDisc = function (qty) {
        if (qty == 1) {
            return 0;
        } else if (qty == 2) {
            return (heaters(1) * 2) - heaters(1);
        } else {
            return null;
        }
    };

    return {
        leaRows: leaRows,
        heaters: heaters,
        heatDisc: heatDisc
    }
}])

;