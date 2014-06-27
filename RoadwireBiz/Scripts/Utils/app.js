/*
RoadwireBiz Utils App 
(c) 2014 Roadwire, Inc.
*/

var utils = angular.module('utils', ['ngRoute', 'routeStyles', 'roadwire.services', 'roadwire.directives', 'util.services'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/menu', {
            title: 'menu',
            templateUrl: '/Partial/Utils/Menu',
            controller: 'MenuCtrl'
        });
        $routeProvider.when('/map', {
            title: 'map',
            templateUrl: '/Partial/Utils/Map',
            controller: 'MapCtrl',
            css: ['/Content/roadwire/map.css', '/Content/utils/map.css'],
            resolve: {
                gglMaps: function ($q, LoadGglMaps) {
                    return LoadGglMaps();
                }
            }
        });

        $routeProvider.when('/ccpages', {
            title: 'Costco Pages',
            templateUrl: '/Partial/Utils/CcPages',
            controller: 'CcPagesCtrl',
            css: '/Content/utils/ccpages.css'
        });
        $routeProvider.when('/ccshop', {
            title: 'Costco Shopping',
            templateUrl: '/Partial/Utils/CcShop',
            controller: 'CcShopCtrl',
            css: '/Content/utils/ccpages.css'
        });

        $routeProvider.when('/test', {
            title: 'test',
            templateUrl: '/Partial/Utils/Test',
            controller: 'TestCtrl',
            css: '/Content/utils/test.css'
        });

        $routeProvider.otherwise({ redirectTo: '/menu' });
    }])
;

utils.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.$$route) {
            $rootScope.title = current.$$route.title;
            document.title = $rootScope.title;
        }
    });
}])
;


