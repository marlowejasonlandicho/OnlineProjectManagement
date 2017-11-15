(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .controller('DepartmentController', ['$scope', '$uibModal', 'Department',
                function ($scope, $uibModal, Department) {

                    $scope.departmentMode = 'CREATE';

                    $scope.listDepartments = function () {
                        $scope.departments = Department.query();
                    };

                    $scope.selectDepartment = function (departmentid, departmentname, departmenthead) {
                        $scope.departmentId = departmentid;
                        $scope.departmentName = departmentname;
                        $scope.departmentHead = departmenthead;
                        $scope.departmentMode = 'EDIT';
                    };

                    $scope.editDepartment = function () {
                        Department.update({
                            departmentId: $scope.departmentId
                        }, {
                            departmentid: $scope.departmentId,
                            departmentName: $scope.departmentName,
                            departmentHead: $scope.departmentHead
                        }, function (response) {
                            $scope.listDepartments();
                            $scope.clearDepartment();
                            gantt.message('Successfully updated Department!');
                        });
                    };

                    $scope.deleteDepartment = function (departmentid, departmentname, departmenthead) {
                        Department.remove({
                            departmentId: departmentid
                        }, function () {
                            $scope.listDepartments();
                            $scope.clearDepartment();
                            gantt.message('Successfully deleted Department!');
                        });
                    };

                    $scope.addDepartment = function () {
                        var department = new Department({
                            departmentName: $scope.departmentName,
                            departmentHead: $scope.departmentHead
                        });

                        department.$save(
                                function (response) {
                                    $scope.listDepartments();
                                    $scope.clearDepartment();
                                    gantt.message('Successfully added Department!');
                                },
                                function (errorResponse) {
                                    $scope.error = errorResponse.data.message;
                                }
                        );
                    };

                    $scope.clearDepartment = function () {
                        $scope.departmentMode = 'CREATE';
                        $scope.departmentId = '';
                        $scope.departmentName = '';
                        $scope.departmentHead = '';
                    };
                }
            ]);
})();