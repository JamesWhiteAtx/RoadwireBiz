/*
RoadwireBiz Utils App 
(c) 2014 Roadwire, Inc.
*/

var utils = angular.module('utils', ['ngRoute', 'routeStyles', 'roadwire.services', 'util.services'])
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
            css: '/Content/utils/map.css',
            resolve: {
                gglMap: function ($q, LoadGglMaps) {
                    return LoadGglMaps();
                }
            }
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


