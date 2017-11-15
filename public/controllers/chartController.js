(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .controller('ChartController', ['$scope', '$rootScope', '$filter', 'Task', 'Status',
                function ($scope, $rootScope, $filter, Task, Status) {
                    var DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

                    $scope.startDateFn = function (task) {
                        if (!task.parent) {
                            return '';
                        } else {
                            return task.start_date;
                        }
                    };
                    $scope.dueDateFn = function (task) {
                        if (!task.parent) {
                            return '';
                        } else {
                            return task.end_date;
                        }
                    };
                    $scope.progressFn = function (task) {
                        if (!task.parent) {
                            return '';
                        } else {
                            return task.progress * 100 + '%';
                        }
                    };
                    $scope.colummnAddFn = function (task) {
                        if (task.parent) {
                            return '';
                        }
                    };
                    $scope.taskClassFn = function (start, end, task) {
                        var now = new Date();
                        var weekFromNow = new Date(now.getTime() + (7 * DAY_IN_MILLIS));

                        ///Remove department bars...
                        if (!task.parent) {
                            return "none";
                        }
                        if (task.progress === 1) {
                            return "low";
                        }
                        if (now.getTime() > end.getTime()) {
                            return "high";
                        } else if (end.getTime() >= now.getTime() && end.getTime() <= weekFromNow.getTime()) {
                            return "medium";
                        } else if (now.getTime() < end.getTime()) {
                            return "low";
                        }
                    };

                    $scope.cellWeekendClassFn = function (date) {
                        if (date.getDay() === 0 || date.getDay() === 6) {
                            return "weekend";
                        }
                    };

                    $scope.taskCellWeekendClassFn = function (item, date) {
                        if (date.getDay() === 0 || date.getDay() === 6) {
                            return "weekend";
                        }
                    };

                    $scope.init = function () {
                        $scope.tasks = {};
                        $scope.users = {};
                        $scope.ganttTasks = {};
                        $scope.ganttTasks.data = [];
                        $scope.departments = $rootScope.globals.departmentMap;

                        var param = {};
                        if ($rootScope.globals.currentUser.rolename === 'DEFAULT') {
                            param.departmentid = $rootScope.globals.currentUser.departmentid;
                        }

                        angular.forEach($rootScope.globals.departments, function (department, key) {
                            $scope.ganttTasks.data.push(
                                    {
                                        id: department.departmentid,
                                        name: department.departmentName,
                                        text: department.departmentName,
                                        assigned_to: '',
                                        department_head: '',
                                        start_date: new Date(),
                                        progress: 0,
                                        open: true
                                    });
                        });
                        Task.query(param).$promise.then(function (tasks) {
                            angular.forEach(tasks, function (task, key) {

                                if (!$scope.tasks[task.taskid]) {
                                    $scope.tasks[task.taskid] = task;
                                    $scope.tasks[task.taskid].weeklyStatus = [];
                                    $scope.tasks[task.taskid].monthlyStatus = [];
                                }

                                if (task.type) {
                                    var statusObj = {
                                        periodnumber: task.periodnumber,
                                        statusid: task.statusid,
                                        statustext: task.statustext,
                                        taskid: task.taskid,
                                        type: task.typetype
                                    };

                                    if (task.type === 'WEEKLY') {
                                        $scope.tasks[task.taskid].weeklyStatus.push(statusObj);
                                    } else if (task.type === 'MONTHLY') {
                                        $scope.tasks[task.taskid].monthlyStatus.push(statusObj);
                                    }
                                }
                            });

                            angular.forEach($scope.tasks, function (task, key) {
                                var ganttTask =
                                        {
                                            _id: task.taskid,
                                            name: task.taskname,
                                            text: task.description,
                                            assigned_to: $rootScope.globals.userMap[task.assignedto].fullname,
                                            start_date: new Date(task.startdate),
                                            end_date: new Date(task.duedate),
                                            department_head: $scope.departments[task.departmentid].departmentHead,
                                            progress: task.progress,
                                            parent: task.departmentid
                                        };
                                ganttTask.weeklyStatus = task.weeklyStatus;
                                ganttTask.monthlyStatus = task.monthlyStatus;
                                $scope.ganttTasks.data.push(ganttTask);
                            });

                            $scope.$broadcast('tasks-loaded');

                        });
                    };

                    $rootScope.$on('users-loaded', function (event, args) {
                        $scope.init();
                    });
                }
            ]);
})();