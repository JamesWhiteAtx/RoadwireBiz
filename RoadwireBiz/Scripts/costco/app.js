/*
RoadwireBiz Costco 
(c) 2014 Roadwire, Inc.
*/

var costco = angular.module('costco', ['ngRoute', 'ngAnimate', 'costco.services', 'costco.directives'])

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
        $routeProvider.when('/order', {
            title: 'order',
            templateUrl: '/Partial/Costco/Order',
            controller: "OrderCtrl"
        });
        $routeProvider.when('/map', {
            title: 'map',
            templateUrl: '/Partial/Costco/Map',
            controller: "MapCtrl"
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


