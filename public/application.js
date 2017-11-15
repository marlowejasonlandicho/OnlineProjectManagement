(function () {
    'use strict';
    angular.module('onlineProjectManagement',
            ['ngRoute', 'ngResource', 'ngCookies', 'ngSanitize', 'ui.bootstrap', 'ngMaterial'])
            .config(['$routeProvider', '$locationProvider',
                function ($routeProvider, $locationProvider) {
                    $routeProvider
                            .when('/', {
                                controller: 'LoginController',
                                templateUrl: 'views/login.html'
                            })
                            .when('/login', {
                                controller: 'LoginController',
                                templateUrl: 'views/login.html'
                            })
                            .when('/main', {
                                controller: 'ChartController',
                                templateUrl: 'views/main.html'
                            })
                            .when('/quickStatusUpdate', {
                                controller: 'LoginController',
                                templateUrl: 'views/quickStatusUpdate.html'
                            })

                            .otherwise({redirectTo: '/login'});
                    $locationProvider.html5Mode(true);
                }])

            .config(['$httpProvider',
                function ($httpProvider) {
                    $httpProvider.interceptors.push('httpRequestInterceptor');
                }])

            .run(['$rootScope', '$location', '$cookieStore', '$http', '$window',
                function ($rootScope, $location, $cookieStore, $http, $window) {
                    // keep user logged in after page refresh
                    $rootScope.globals = $cookieStore.get('globals') || {};
                    if ($rootScope.globals.currentUser && $rootScope.globals.token) {
                        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.token; // jshint ignore:line
                    }

                    $rootScope.$on('$locationChangeStart', function (event, next, current) {
                        // redirect to login page if not logged in

                        if ($location.path() === '/' && $rootScope.globals.currentUser) {
                            $window.location.href = '/main';
                        }
                        if ($location.path() === '/login' && $rootScope.globals.currentUser) {
                            $window.location.href = '/main';
                        }
                        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
//                            $location.url('/login');
                            if ($location.path() === '/quickStatusUpdate') {
                                $location.path('/quickStatusUpdate');
                            } else {
                                $window.location.href = '/login';
                            }
                        } else if ($location.path() !== '/login' && $rootScope.globals.currentUser) {
                            $location.path('/main');
                        }
                    });
                }]);
})();