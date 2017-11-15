(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .controller('MainController',
                    ['$scope', '$rootScope', '$location', '$window', 'AuthenticationService', 'User', 'Department',
                        function ($scope, $rootScope, $location, $window, AuthenticationService, User, Department) {
                            $scope.ganttChartURL = '/views/ganttChart.html';
                            $scope.tasksURL = '/views/tasks.html';
                            $scope.completedTasksURL = '/views/completedTasks.html';
                            $scope.analyticsURL = '/views/analytics.html';
                            $scope.settingsURL = '/views/settings.html';
                            $scope.userMaintenanceURL = '/views/userMaintenance.html';
                            $scope.departmentMaintenanceURL = '/views/departmentMaintenance.html';
                            $scope.isOpen = false;
                            $scope.selectedView = 'Week View';
                            $scope.active = 0;

                            var param = {};
                            if ($rootScope.globals.currentUser.rolename === 'DEFAULT') {
                                param.departmentid = $rootScope.globals.currentUser.departmentid;
                            }

                            if (!$rootScope.globals.users) {
                                Department.query(param).$promise.then(function (departments) {
                                    $rootScope.globals.departments = departments;
                                    $rootScope.globals.departmentMap = {};
                                    angular.forEach(departments, function (department, key) {
                                        $rootScope.globals.departmentMap[department.departmentid] = department;
                                    });
                                    User.query(param).$promise.then(function (users) {
                                        $rootScope.globals.users = users;
                                        $rootScope.globals.userMap = {};

                                        angular.forEach(users, function (user, key) {
                                            $rootScope.globals.userMap[user.userid] = user;
                                        });
                                        $rootScope.$broadcast('users-loaded');
                                    });
                                });
                            }

                            $scope.reloadGanttChart = function () {
                                gantt.render();
                            };

                            $scope.setGanttScaleConfig = function (value) {
                                gantt.setScaleConfig(value);
                                gantt.render();

                                switch (value) {
                                    case '1':
                                        $scope.selectedView = 'Day View';
                                        break;
                                    case '2' :
                                        $scope.selectedView = 'Week View';
                                        break;
                                    case '3' :
                                        $scope.selectedView = 'Month View';
                                        break;
                                    default:
                                        $scope.selectedView = 'Day View';
                                }

                                $scope.isOpen = !$scope.isOpen;
                            };

                            $scope.logout = function () {
                                AuthenticationService.ClearCredentials();
                                $window.location.href = '/login';
                            };

                            $scope.setActiveTab = function (tabIndex) {
                                $scope.active = tabIndex;
                            };
                        }]);
})();