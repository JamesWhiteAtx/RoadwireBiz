/*
RoadwireBiz Costco App
(c) 2014 Roadwire, Inc.
*/

var costco = angular.module('costco', ['ngRoute', 'routeStyles', 'ngAnimate', 'ui.bootstrap',
    'roadwire.directives', 'roadwire.services', 'costco.services', 'costco.directives'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/test', {
            title: 'test',
            templateUrl: '/Partial/Costco/Test',
            controller: "TestCtrl"
        });

        $routeProvider.when('/leather', {
            title: 'leather',
            templateUrl: '/Partial/Costco/Leather',
            controller: "LeaCtrl"
        });
        $routeProvider.when('/install', {
            title: 'install',
            templateUrl: '/Partial/Costco/install',
            controller: "InstCtrl"
        });
        $routeProvider.when('/confirm', {
            title: 'confirm',
            templateUrl: '/Partial/Costco/Confirm',
            controller: "ConfirmCtrl"
        });
        $routeProvider.when('/map', {
            title: 'map',
            templateUrl: '/Partial/Costco/Map',
            controller: 'MapCtrl',
            css: '/Content/roadwire/map.css',
            resolve: {
                gglMaps: function ($q, LoadGglMaps) {
                    return LoadGglMaps();
                }
            }
        });

        $routeProvider.otherwise({ redirectTo: '/leather' });
    }])
;

costco.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.$$route) {
            document.title = current.$$route.title;
        }
    });

}])
;


