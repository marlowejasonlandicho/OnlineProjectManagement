(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .controller('LoginController',
                    ['$scope', '$rootScope', '$location', '$http', 'AuthenticationService', '$window',
                        function ($scope, $rootScope, $location, $http, AuthenticationService, $window) {
                            // reset login status
                            AuthenticationService.ClearCredentials();

                            $scope.goToLogin = function () {
                                $window.location.href = '/login';
                            };

                            $scope.login = function () {
                                $scope.dataLoading = true;
                                AuthenticationService.Login($scope.username, $scope.password,
                                        function (response) {
                                            if (response.statusText === 'OK') {
                                                if (response.data.success) {
                                                    var userDetails = response.data;
                                                    AuthenticationService.SetCredentials(userDetails, $scope.password);
                                                    $window.location.href = '/main';

                                                } else if (response.data.length > 0) {
                                                    var userDetails = response.data[0];
                                                    AuthenticationService.SetCredentials(userDetails, $scope.password);
                                                    $window.location.href = '/main';
                                                } else {
                                                    $scope.error = response.data.message;
                                                    $scope.dataLoading = false;
                                                }
                                            } else {
                                                $scope.error = response.data.message;
                                                $scope.dataLoading = false;
                                            }
                                        });
                            };
                        }]);
})();