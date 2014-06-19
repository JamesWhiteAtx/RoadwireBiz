/*
RoadwireBiz Utils App 
(c) 2014 Roadwire, Inc.
*/

var utils = angular.module('utils', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/menu', {
            title: 'menu',
            templateUrl: '/Partial/Utils/Menu',
            controller: 'MenuCtrl',
            resolve: {
                one: function ($q) {
                    var deferred = $q.defer();
                    deferred.resolve(11);
                    return deferred.promise;
                },
                two: function ($q) {
                    return 2;
                }
            }
        });
        $routeProvider.when('/map', {
            title: 'map',
            templateUrl: '/Partial/Utils/Map',
            controller: 'MapCtrl'
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


