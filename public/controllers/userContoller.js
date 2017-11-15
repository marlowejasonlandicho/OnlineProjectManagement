(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .controller('UserController',
                    ['$scope', '$uibModal', 'SettingsInquiry', 'Department', 'User',
                        function ($scope, $uibModal, SettingsInquiry, Department, User) {

                            $scope.departments = [];
                            $scope.roles = [];
                            $scope.users = [];
                            $scope.departmentMode = 'CREATE';
                            $scope.roleOptions = [{roleid: 1, label: 'ADMIN'}, {roleid: 2, label: 'DEFAULT'}];
                            $scope.roles[1] = {roleid: 1, label: 'ADMIN'};
                            $scope.roles[2] = {roleid: 2, label: 'DEFAULT'};

                            $scope.listUsers = function () {
                                $scope.users = [];
                                Department.query().$promise.then(function (departments) {
                                    $scope.departmentOptions = departments;
                                    angular.forEach(departments, function (department, key) {
                                        $scope.departments[department.departmentid] = department;
                                    });
                                    User.query()
                                            .$promise.then(function (users) {
                                                angular.forEach(users, function (user, key) {
                                                    user.department = $scope.departments[user.departmentid];
                                                    user.role = $scope.roles[user.roleid];
                                                    user.editMode = false;
                                                    $scope.users.push(user);
                                                });
                                            });
                                });

                            };

                            $scope.synchUsers = function () {
                                SettingsInquiry.listADUsers().then(function (response) {
                                    $uibModal.open({
                                        animation: true,
                                        ariaLabelledBy: 'modal-title',
                                        ariaDescribedBy: 'modal-body',
                                        templateUrl: '../../views/modal/opmModalContent.html',
                                        size: 'sm',
                                        controller: function ($scope) {
                                            $scope.title = 'Synch Users';
                                            $scope.message = 'Retrieving Users... Kindly hit refresh buttton to view results';
                                            $scope.close = function () {
                                                this.$close();
                                            };
                                        }
                                    });
                                });
                            };

                            $scope.editUser = function (user) {
                                user.editMode = true;
                            };

                            $scope.deleteUser = function (user) {
                                User.remove({
                                    userId: user.userid
                                }, function () {
                                    $scope.listUsers();
                                    gantt.message('Successfully deleted User!');
                                });
                            };

                            $scope.saveUser = function (user) {
                                User.update({
                                    userId: user.userid
                                },
                                        user,
                                        function (response) {
                                            $scope.listUsers();
                                            gantt.message('Successfully updated User!');
                                        });
                            };

                        }]);
})();