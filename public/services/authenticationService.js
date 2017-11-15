(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .factory('AuthenticationService',
                    ['$http', '$cookieStore', '$rootScope', '$timeout',
                        function ($http, $cookieStore, $rootScope, $timeout) {
                            var service = {};

                            service.Login = function (username, password, callback) {

                                $http.post('/api/authenticate',
                                        {
                                            username: username,
                                            password: password
                                        })
                                        .then(
                                                function (response) {
                                                    if (response.status === 200 &&
                                                            (response.data && response.data.success)) {
                                                        $rootScope.globals.token = response.data.token;
                                                        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.token; // jshint ignore:line
                                                        $http.get('/api/users?username=' + username).then(
                                                                function (response) {
                                                                    callback(response);
                                                                }
                                                        );
                                                    } else {
                                                        callback(response);
                                                    }
                                                }
                                        );

                            };

                            service.SetCredentials = function (userDetails, password) {

                                $rootScope.globals.currentUser = {
                                    userid: userDetails.userid,
                                    username: userDetails.username,
                                    firstname: userDetails.firstname,
                                    lastname: userDetails.lastname,
                                    fullname: userDetails.fullname,
                                    email: userDetails.email,
                                    departmentid: userDetails.departmentid,
                                    rolename: userDetails.rolename
                                };

                                $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.token; // jshint ignore:line

                                $cookieStore.put('globals', $rootScope.globals);
                            };

                            service.ClearCredentials = function () {
                                $rootScope.globals = {};
                                $cookieStore.remove('globals');
                                $http.defaults.headers.common.Authorization = 'Bearer ';
                            };

                            return service;
                        }]);
})();