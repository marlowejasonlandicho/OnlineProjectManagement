(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .factory('httpRequestInterceptor', function ($cookieStore, $rootScope) {
                return {
                    request: function (config) {
                        if ($rootScope.globals && $rootScope.globals.token) {
                            config.headers.Authorization = 'Bearer ' + $rootScope.globals.token;
                        }
                        return config;
                    }
                };
            });
})();