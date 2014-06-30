/*
RoadwireBiz Utils Services
(c) 2014 Roadwire, Inc.
*/

'use strict';

angular.module('util.services', []) // 'ngResource'
.value('version', '0.1')

.factory('CcPagesData', [function () {
    var data;

    var makeOpt = function (opt, prc) {
        var option = {
            name: 'Option',
            price: 1
        };
        option.setName = function (nm) {
            if (angular.isString(nm)) {
                option.name = nm;
            };
        };
        option.setPrice = function (pr) {
            if (angular.isNumber(pr)) {
                option.price = pr;
            };
        };

        if (angular.isString(opt)) {
            option.setName(opt);
        } else if (angular.isObject(opt)) {
            option.setName(opt.name);
            option.setPrice(opt.price);
        };
        option.setPrice(prc);

        return option;
    }

    var makeProd = function (name, selector, options) {
        var prod = {
            name: 'Product' + data.prods.length.toString(),
            options: []
        };
        prod.addOpt = function (opt) {
            var newOpt = makeOpt(opt);
            prod.options.push(newOpt);
            return newOpt;
        };
        prod.delOpt = function (idx) {
            prod.options.splice(idx, 1);
        };

        if (name) {
            prod.name = name;
        };
        prod.selector = selector;
        angular.forEach(options, function (opt) {
            prod.addOpt(opt);
        });

        if (prod.options.length == 0) {
            prod.addOpt(prod.name);
        };

        return prod;
    }

    var addProd = function (name, slctr, opts) {
        var prod = makeProd(name, slctr, opts);
        data.prods.push(prod);
        return prod;
    };

    var delProd = function (idx) {
        data.prods.splice(idx, 1);
    }

    var makeSlctr = function (name) {
        var slctr = {
            name: name || 'Selector' + data.selectors.length.toString(),
            prods: []
        };
        return slctr;
    };

    var addSlctr = function (name) {
        var slctr = makeSlctr(name);
        data.selectors.push(slctr);
        return slctr;
    };

    var delSlctr = function (idx) {
        data.selectors.splice(idx, 1);
    };

    var combProdOpts = function (pages, prods, prodIdx, rowArr) {
        prodIdx = prodIdx || 0;
        rowArr = rowArr || [];

        var addOpt = function (opt) {
            var row = [];

            angular.forEach(rowArr, function (rowOpt, rowIdx) {
                row[rowIdx] = rowOpt;
            });

            row[prodIdx] = opt;

            combProdOpts(pages, prods, prodIdx + 1, row);
        };

        if (prods.length == prodIdx) {
            var row = { opts: rowArr };

            var price = 0;
            angular.forEach(row.opts, function (opt) {
                if (opt) {
                    price += opt.price;
                };
            });
            row.price = price;

            var name = '';
            angular.forEach(row.opts, function (opt) {
                if (opt) {
                    name = name + opt.name + ' ';
                };
            });
            row.name = name.trim();

            pages.push(row);
            return;
        };

        var prod = prods[prodIdx];

        if (!prod) {
            addOpt(null);
            return;
        }

        angular.forEach(prod.options, function (opt) {
            addOpt(opt);
        });
    };

    // segregate selector from regular
    var segrProds = function () {
        data.regProds = [];

        angular.forEach(data.selectors, function (slctr) {
            slctr.prods = [];
        });

        angular.forEach(data.prods, function (prod) {
            if (prod.options.length == 1) {
                prod.options[0].name = prod.name;
            };
            if (prod.selector) {
                prod.selector.prods.push(prod);
            } else {
                data.regProds.push(prod);
            };
        });
    };

    // calculate selector page combinations
    var calcSlctrs = function () {
        angular.forEach(data.selectors, function (slctr) {
            calcSlctrPages(slctr);
        });
    };

    var calcSlctrPages = function (slctr) {
        var pages = [];

        var prodCnt = slctr.prods.length;
        var combos = Math.pow(2, prodCnt);
        var c;
        for (c = 1; c < combos; c++) {
            var prods = [];
            var b;
            for (b = 0; b < prodCnt; b++) {
                var x = (c >> b) & 1;
                var prod = (x ? slctr.prods[b] : null);
                prods.push(prod);
            };
            combProdOpts(pages, prods);
        };

        slctr.pages = pages;
    };

    //regular pages
    var calcReg = function () {
        var regPages = [];
        angular.forEach(data.regProds, function (prod) {
            var prfx = '';
            if (prod.options.length > 1) {
                prfx = prod.name + '-';
            };
            angular.forEach(prod.options, function (opt) {
                regPages.push(makeOpt(prfx + opt.name, opt.price));
            });
        });
        data.regPages = regPages;
    };

    var calcResults = function () {
        // segregate selector from regular
        segrProds();

        // calculate selector page combinations
        calcSlctrs();

        //regular pages
        calcReg();

        var totReg = data.regPages.length;
        var totLand = 0;
        var totHid = 0;
        angular.forEach(data.selectors, function (slctr) {
            var pgs = slctr.pages.length;
            if (pgs > 0) {
                totLand ++;
            }
            totHid += pgs;
        });

        data.totalReg = totReg;
        data.totalLand = totLand;
        data.totalHid = totHid;
    };

    return function () {
        if (!data) {
            data = {
                selectors: [],
                prods: [],
                regProds: [],
                regPages: [],
                addSlctr: addSlctr,
                delSlctr: delSlctr,
                addProd: addProd,
                delProd: delProd,
                calcResults: calcResults
            };

            var slctrLea = addSlctr('Leather');
            addProd('Leather Kit', slctrLea, [{ name: '1Row', price: 799 }, { name: '2Row', price: 1299 }, { name: '3Row', price: 1799 }]);
            addProd('Heaters', slctrLea, [{ name: '1Heater', price: 249 }, { name: '2Heater', price: 449 }]);
            addProd('Bug Guard', null, [{ name: '1Heater', price: 55.99 }]);
        };

        return data;
    };
}])
;