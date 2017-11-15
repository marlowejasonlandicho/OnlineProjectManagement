(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .controller('QuickStatusUpdateController',
                    ['$scope', '$rootScope', '$location', 'Task', 'Status', '$uibModal', 'AuthenticationService',
                        function ($scope, $rootScope, $location, Task, Status, $uibModal, AuthenticationService) {

                            var queryStringValue = $location.search();
                            var taskId = queryStringValue.taskid;
                            var periodnumber = queryStringValue.periodnumber;
                            var type = queryStringValue.type;

                            $scope.progressOptions = {};
                            $scope.progressOptions['0'] = {key: '0', label: 'Not started'};
                            $scope.progressOptions['0.1'] = {key: '0.1', label: '10%'};
                            $scope.progressOptions['0.2'] = {key: '0.2', label: '20%'};
                            $scope.progressOptions['0.3'] = {key: '0.3', label: '30%'};
                            $scope.progressOptions['0.4'] = {key: '0.4', label: '40%'};
                            $scope.progressOptions['0.5'] = {key: '0.5', label: '50%'};
                            $scope.progressOptions['0.6'] = {key: '0.6', label: '60%'};
                            $scope.progressOptions['0.7'] = {key: '0.7', label: '70%'};
                            $scope.progressOptions['0.8'] = {key: '0.8', label: '80%'};
                            $scope.progressOptions['0.9'] = {key: '0.9', label: '90%'};
                            $scope.progressOptions['1'] = {key: '1', label: 'Complete'};

                            var task = Task.get(
                                    {
                                        taskId: taskId
                                    },
                                    function (task) {
                                        $scope.taskId = task.taskid;
                                        $scope.taskName = task.taskname;
                                        $scope.assignedTo = task.assignedto;
                                        $scope.departmentId = task.departmentid;
                                        $('#progress').val(task.progress);
                                    });

                            $scope.submit = function () {

                                Task.update({taskId: $scope.taskId},
                                        {
                                            taskid: $scope.taskId,
                                            assignedto: $scope.assignedTo,
                                            departmentid: $scope.departmentId,
                                            progress: $('#progress').val(),
                                            datecompleted: ($('#progress').val() >= 1 ? $filter('date')(new Date(), 'yyyy-MM-dd') : null)
                                        },
                                        function (response) {

                                            var status = new Status({
                                                statustext: $scope.status,
                                                taskid: $scope.taskId,
                                                type: type,
                                                creator: $scope.assignedTo,
                                                periodnumber: periodnumber
                                            });

                                            status.$save(
                                                    function (response) {
                                                        $uibModal.open({
                                                            animation: true,
                                                            ariaLabelledBy: 'modal-title',
                                                            ariaDescribedBy: 'modal-body',
                                                            templateUrl: '../../views/modal/opmModalContent.html',
                                                            size: 'sm',
                                                            controller: function ($scope) {
                                                                $scope.title = 'Status Update';
                                                                $scope.message = 'Successfully updated Task!';
                                                                $scope.close = function () {
                                                                    AuthenticationService.ClearCredentials();
                                                                    this.$close();
                                                                };
                                                            }
                                                        });
                                                    },
                                                    function (errorResponse) {
                                                        $scope.error = errorResponse.data.message;
                                                        $uibModal.open({
                                                            animation: true,
                                                            ariaLabelledBy: 'modal-title',
                                                            ariaDescribedBy: 'modal-body',
                                                            templateUrl: '../../views/modal/opmModalContent.html',
                                                            size: 'sm',
                                                            controller: function ($scope) {
                                                                $scope.title = 'Save Task';
                                                                $scope.message = $scope.error;
                                                                $scope.close = function () {
                                                                    this.$close();
                                                                };
                                                            }
                                                        });
                                                    }
                                            );
                                        },
                                        function (errorResponse) {
                                            $scope.error = errorResponse.data.message;
                                            $uibModal.open({
                                                animation: true,
                                                ariaLabelledBy: 'modal-title',
                                                ariaDescribedBy: 'modal-body',
                                                templateUrl: '../../views/modal/opmModalContent.html',
                                                size: 'sm',
                                                controller: function ($scope) {
                                                    $scope.title = 'Save Task';
                                                    $scope.message = $scope.error;
                                                    $scope.close = function () {
                                                        this.$close();
                                                    };
                                                }
                                            });
                                        }
                                );

                            };
                        }]);
})();