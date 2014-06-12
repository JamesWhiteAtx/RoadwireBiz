/*
Roadwire Costco 
(c) 2014 Roadwire, Inc.
*/

var costco = angular.module('costco', ['ngRoute', 'costco.services', 'costco.directives'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/car', {
            title: 'car',
            templateUrl: '/Partial/Costco/Car',
            controller: "CarCtrl"
        });
        $routeProvider.when('/map', {
            title: 'map',
            templateUrl: '/Partial/Costco/Map',
            controller: "MapCtrl"
        });

        $routeProvider.otherwise({ redirectTo: '/car' });
    }])
;

costco.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.$$route) {
            $rootScope.heading = null;

            $rootScope.loading = false;

            $rootScope.title = current.$$route.title;
            document.title = $rootScope.title;
        }
    });

}])
;


