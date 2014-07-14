/*
RoadwireBiz CcAdmin App 
(c) 2014 Roadwire, Inc.
*/

var ccAdmin = angular.module('ccAdmin', ['ngRoute', 'roadwire.services'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/menu', {
            title: 'menu',
            templateUrl: '/Partial/ccadmin/Menu',
            controller: 'MenuCtrl'
        });

        $routeProvider.when('/products', {
            title: 'products',
            templateUrl: '/Partial/ccadmin/Products',
            controller: 'ProductsCtrl'
        });

        $routeProvider.otherwise({ redirectTo: '/menu' });
    }])
;

ccAdmin.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.$$route) {
            $rootScope.title = current.$$route.title;
            document.title = $rootScope.title;
        }
    });
}])
;


