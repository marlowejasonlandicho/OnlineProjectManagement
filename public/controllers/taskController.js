(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .controller('TaskController',
                    ['$scope', '$rootScope', '$window', '$filter', '$uibModal', 'Task', 'CompletedTask', 'Status',
                        function ($scope, $rootScope, $window, $filter, $uibModal, Task, CompletedTask, Status) {
                            var DAY_IN_MILLIS = 1000 * 60 * 60 * 24;
                            $scope.noOfWeeks = 1;
                            $scope.noOfMonths = 1;
                            $scope.mode = 'CREATE';
                            $scope.taskId = '';
                            $scope.task = {};
                            $scope.startDate = new Date();
                            $scope.dueDate = new Date($scope.startDate.getTime() + (1000 * 60 * 60 * 24));
                            $scope.assignedTo = '';
                            $scope.department = 0;
                            $scope.progress = 0;
                            $scope.startDate.opened = false;
                            $scope.dueDate.opened = false;
                            $scope.completedTasks = [];
                            $scope.weeklyStatusList = {};
                            $scope.monthlyStatusList = {};
                            $scope.users = {};
                            $scope.departmentOptions = {};
                            $scope.progressOptions = {};
                            $scope.userOptions = [];
                            $scope.dateFormat = 'MM/dd/yyyy';
                            $scope.dateOptions = {
                                formatYear: 'yy',
                                maxDate: new Date(2020, 5, 22),
                                startingDay: 1
                            };

                            $rootScope.$on('users-loaded', function (event, args) {
                                $scope.userOptions = $rootScope.globals.users;
                                $scope.departmentOptions = $rootScope.globals.departments;
                            });

                            var setProgressValues = function () {
                                $scope.progressOptions['0'] = {key: 0, label: 'Not started'};
                                $scope.progressOptions['0.1'] = {key: 0.1, label: '10%'};
                                $scope.progressOptions['0.2'] = {key: 0.2, label: '20%'};
                                $scope.progressOptions['0.3'] = {key: 0.3, label: '30%'};
                                $scope.progressOptions['0.4'] = {key: 0.4, label: '40%'};
                                $scope.progressOptions['0.5'] = {key: 0.5, label: '50%'};
                                $scope.progressOptions['0.6'] = {key: 0.6, label: '60%'};
                                $scope.progressOptions['0.7'] = {key: 0.7, label: '70%'};
                                $scope.progressOptions['0.8'] = {key: 0.8, label: '80%'};
                                $scope.progressOptions['0.9'] = {key: 0.9, label: '90%'};
                                $scope.progressOptions['1'] = {key: 1, label: 'Complete'};
                            };

                            var resetFields = function () {
                                $scope.noOfWeeks = 1;
                                $scope.noOfMonths = 1;
                                $scope.taskName = '';

                                $scope.startDate = new Date();
                                $scope.dueDate = new Date($scope.startDate.getTime() + DAY_IN_MILLIS);
                                $scope.taskDetails = '';

                                $('#progress').val(0);
                                $('#assignedto').val('');
                                $('#department').val(0);

                                $scope.progress = 0;
                                $scope.assignedTo = '';
                                $scope.department = 0;

                                $scope.weeklyStatusList = {};
                                $scope.monthlyStatusList = {};
                            };

                            setProgressValues();

                            CompletedTask.getCompletedTasks().then(function (completedTasks) {
                                $scope.completedTasks = completedTasks.data;
                            });

                            $scope.openStartDate = function () {
                                $scope.startDate.opened = true;
                            };
                            $scope.openDueDate = function () {
                                $scope.dueDate.opened = true;
                            };
                            $scope.exportToExcel = function () {
                                CompletedTask.exportToExcel($scope.completedTasks).then(function (data) {
                                    $window.open(data.data);
                                });
                            };
                            var validTask = function () {
                                if ($scope.taskName === undefined || $scope.taskName === '') {
                                    gantt.message({type: 'error', text: 'Task name is required'});
                                    return false;
                                }
                                if ($scope.department === 0) {
                                    gantt.message({type: 'error', text: 'Department is required'});
                                    return false;
                                }
                                if ($scope.assignedTo === '') {
                                    gantt.message({type: 'error', text: 'Task Assigned To is required'});
                                    return false;
                                }
                                return true;
                            };

                            $scope.saveTask = function () {
                                if ($scope.mode === 'CREATE') {
                                    if (validTask()) {
                                        var task = new Task(
                                                {
                                                    taskname: $scope.taskName,
                                                    assignedto: $scope.assignedTo,
                                                    departmentid: $scope.department,
                                                    startdate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
                                                    duedate: $filter('date')($scope.dueDate, 'yyyy-MM-dd'),
                                                    progress: $scope.progress,
                                                    details: $scope.taskDetails,
                                                    creator: $rootScope.globals.currentUser.username,
                                                    datecompleted: ($scope.progress >= 1 ? $filter('date')(new Date(), 'yyyy-MM-dd') : null)
                                                }
                                        );

                                        task.$save(
                                                function (response) {
                                                    resetFields();
                                                    setProgressValues();
                                                    gantt.message('Successfully saved Task!');
                                                    angular.element($('#opmGanttChart')).scope().init();
                                                },
                                                function (errorResponse) {
                                                    $scope.error = errorResponse.data.message;
                                                    gantt.message({type: 'error', text: errorResponse.data.message});
                                                }
                                        );
                                    }

                                } else if ($scope.mode === 'EDIT') {
                                    Task.update({taskId: $scope.taskId},
                                            {
                                                taskid: $scope.taskId,
                                                assignedto: $('#assignedto').val(),
                                                departmentid: $('#department').val(),
                                                progress: $('#progress').val(),
                                                datecompleted: ($scope.progress >= 1 ? $filter('date')(new Date(), 'yyyy-MM-dd') : null)
                                            },
                                            function (response) {
                                                resetFields();
                                                setProgressValues();
                                                gantt.message('Successfully updated Task!');
                                                angular.element($('#opmGanttChart')).scope().init();
                                            },
                                            function (errorResponse) {
                                                $scope.error = errorResponse.data.message;
                                                gantt.message({type: 'error', text: errorResponse.data.message});
                                            }
                                    );
                                }
                            };

                            $scope.saveStatusText = function (prefix, unitNumber, type) {
                                var status = new Status({
                                    statustext: $('#' + prefix + unitNumber).val(),
                                    taskid: $scope.taskId,
                                    type: type,
                                    creator: $rootScope.globals.currentUser.userid,
                                    periodnumber: unitNumber
                                });
                                status.$save(
                                        function (response) {
                                            $scope.setScopeValues({_id: $scope.taskId});
                                            gantt.message('Successfully updated Status!');
                                            angular.element($('#opmGanttChart')).scope().init();
                                        },
                                        function (errorResponse) {
                                        }
                                );
                            };

                            $scope.createNew = function () {
                                resetFields();
                                setProgressValues();
                                $scope.taskId = '';
                                $scope.mode = 'CREATE';
                            };

                            $scope.deleteTask = function () {
                                Task.delete({
                                    taskId: $scope.taskId
                                }, function (task) {
                                    resetFields();
                                    setProgressValues();
                                    $scope.taskId = '';
                                    $scope.mode = 'CREATE';
                                    gantt.message('Successfully deleted Task!');
                                    angular.element($('#opmGanttChart')).scope().init();
                                });
                            };

                            $scope.setScopeValues = function (ganttTask) {
                                resetFields();
                                $scope.taskId = ganttTask._id;
                                $scope.mode = 'EDIT';
                                $scope.userOptions = $rootScope.globals.users;
                                setProgressValues();

                                var task = Task.get({
                                    taskId: ganttTask._id
                                }, function (task) {
                                    $scope.taskName = task.taskname;
                                    $scope.startDate = new Date(task.startdate);
                                    $scope.dueDate = new Date(task.duedate);
                                    $scope.taskDetails = task.details;

                                    $('#department').val(task.departmentid);
                                    $('#progress').val(task.progress);
                                    $('#assignedto').val(task.assignedto);

                                    var optionElements = $('#progress option');

                                    angular.forEach(optionElements,
                                            function (optionValue, index) {
                                                if (parseFloat(task.progress) > parseFloat(optionValue.value) ||
                                                        isNaN(optionValue.value)) {
                                                    $('#progress option[value="' + optionValue.value + '"]').remove();
                                                }
                                            });

                                    var calculateNoOfWeekends = function (date1, date2) {
                                        var now = new Date();
                                        var d1 = new Date(date1),
                                                d2 = new Date(date2);
                                        while (d1 < d2 && d1 < now) {
                                            var day = d1.getDay();
                                            if (day === 5) {
                                                $scope.noOfWeeks++;
                                            }
                                            d1.setDate(d1.getDate() + 1);
                                        }
                                    };
                                    var calculateNoOfMonths = function (date1, date2) {
                                        var now = new Date();
                                        var d1 = new Date(date1),
                                                d2 = new Date(date2);
                                        d1.setMonth(d1.getMonth() + 1);
                                        while (d1 < d2 && d1 < now) {
                                            $scope.noOfMonths++;
                                            d1.setMonth(d1.getMonth() + 1);
                                        }
                                    };
                                    calculateNoOfWeekends($scope.startDate, $scope.dueDate);
                                    calculateNoOfMonths($scope.startDate, $scope.dueDate);
                                    for (var weekNo = 1; weekNo <= $scope.noOfWeeks; weekNo++) {
                                        $scope.weeklyStatusList[weekNo] = {periodnumber: weekNo, statustext: ''};
                                    }

                                    for (var monthNo = 1; monthNo <= $scope.noOfMonths; monthNo++) {
                                        $scope.monthlyStatusList[monthNo] = {periodnumber: monthNo, statustext: ''};
                                    }

                                    for (var weekNo = 1; weekNo <= $scope.noOfWeeks; weekNo++) {
                                        Status.query(
                                                {
                                                    taskid: ganttTask._id,
                                                    periodnumber: weekNo,
                                                    type: 'WEEKLY'
                                                })
                                                .$promise.then(
                                                        function (status) {
                                                            if (status.length > 0) {
                                                                $scope.weeklyStatusList[status[0].periodnumber] = status[0];
                                                            }
                                                        }
                                                );
                                    }

                                    for (var monthNo = 1; monthNo <= $scope.noOfMonths; monthNo++) {
                                        Status.query(
                                                {
                                                    taskid: ganttTask._id,
                                                    periodnumber: monthNo,
                                                    type: 'MONTHLY'
                                                })
                                                .$promise.then(
                                                        function (status) {
                                                            if (status.length > 0) {
                                                                $scope.monthlyStatusList[status[0].periodnumber] = status[0];
                                                            }
                                                        }
                                                );
                                    }
                                }
                                );
                            };
                        }
                    ]);
})();