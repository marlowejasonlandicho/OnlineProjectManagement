(function () {
    angular.module('onlineProjectManagement')
            .directive('dhxGantt', ['Department', 'Status', '$rootScope',
                function (Department, Status, $rootScope) {
                    return {
                        restrict: 'A',
                        scope: false,
                        transclude: true,
                        template: '<div ng-transclude></div>',
                        link: function ($scope, $element, $attrs, $controller) {

                            //watch data collection, reload on changes
                            $scope.$watch($attrs.data, function (collection) {
                                if (angular.isDefined(collection)) {
                                    gantt.clearAll();
                                    gantt.parse(collection, 'json');
                                    gantt.render();
                                }
                            }, true);

                            $scope.$watch(function () {
                                return $element[0].offsetWidth + '.' + $element[0].offsetHeight;
                            }, function () {
                                gantt.setSizes();
                            });

                            $scope.$on('tasks-loaded', function (event, args) {
                                gantt.render();
                            });

                            gantt.config.grid_resize = true;
                            gantt.config.grid_width = '600';
                            gantt.config.drag_move = false;
                            gantt.config.drag_progress = false;
                            gantt.config.drag_resize = false;
                            gantt.config.min_column_width = 100;
                            gantt.config.autofit = false;
                            gantt.config.readonly = true;
                            gantt.config.api_date = '%m/%d/%Y';
                            gantt.config.scale_unit = "month";
                            gantt.config.step = 1;
                            gantt.config.date_scale = "%F, %Y";
                            gantt.config.scale_height = 60;

                            var weekScaleTemplate = function (date) {
                                var dateToStr = gantt.date.date_to_str("%d %M");
                                var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
                                return dateToStr(date) + " - " + dateToStr(endDate);
                            };
                            var currentScale = 2;
                            var pageX = 0;

                            gantt.config.subscales = [
                                {unit: "week", step: 1, template: weekScaleTemplate}
                            ];

                            gantt.templates.date_scale = weekScaleTemplate;

                            gantt.templates.task_cell_class = function (task, date) {
                                if (!gantt.isWorkTime(date))
                                    return 'week_end';
                                return '';
                            };

                            gantt.templates.tooltip_text = function (start, end, task) {
                                var statusContent = '';

                                if (task.parent > 0) {
                                    if (task.weeklyStatus && task.weeklyStatus.length) {
                                        if (currentScale === 2) {
                                            if ($('div[task_id="' + task.id + '"]') &&
                                                    $('div[task_id="' + task.id + '"] > div.gantt_task_content').offset() &&
                                                    $('div[task_id="' + task.id + '"] > div.gantt_task_content').offset().left) {

                                                var taskLeftPos = (pageX - $('div[task_id="' + task.id + '"] > div.gantt_task_content').offset().left) + $(window).scrollLeft();
                                                var chartIncrement = Math.floor((taskLeftPos / 100));

                                                if (task.weeklyStatus[chartIncrement] && task.weeklyStatus[chartIncrement].statustext) {
                                                    var styleWidth = '';
                                                    var statusText = task.weeklyStatus[chartIncrement].statustext;
                                                    if (statusText.length > 50) {
                                                        styleWidth += 'width:200px;';
                                                    }
                                                    statusContent +=
                                                            '<span class="list-group-item">' +
                                                            '<b><p class="list-group-item-text">Week #' + task.weeklyStatus[chartIncrement].periodnumber + '</p></b>' +
                                                            '<p style="' + styleWidth + 'word-break: break-all;white-space:normal;" class="list-group-item-text" >' + statusText + '</p>' +
                                                            '</span>';
                                                }
                                            }
                                        } else if (currentScale === 3) {
                                            if ($('div[task_id=' + task.id + ']') &&
                                                    $('div[task_id="' + task.id + '"] > div.gantt_task_content').offset() &&
                                                    $('div[task_id="' + task.id + '"] > div.gantt_task_content').offset().left) {

                                                var taskLeftPos = (pageX - $('div[task_id="' + task.id + '"] > div.gantt_task_content').offset().left) + $(window).scrollLeft();
                                                var chartIncrement = Math.floor((taskLeftPos / 100));

                                                if (task.monthlyStatus[chartIncrement] && task.monthlyStatus[chartIncrement].statustext) {
                                                    var styleWidth = '';
                                                    var statusText = task.monthlyStatus[chartIncrement].statustext;
                                                    if (statusText.length > 50) {
                                                        styleWidth += 'width:200px;';
                                                    }
                                                    statusContent +=
                                                            '<span class="list-group-item">' +
                                                            '<b><p class="list-group-item-text">Month #' + task.monthlyStatus[chartIncrement].periodnumber + '</p></b>' +
                                                            '<p style="' + styleWidth + 'word-break: break-all;white-space:normal;" class="list-group-item-text" >' + statusText + '</p>' +
                                                            '</span>';
                                                }
                                            }
                                        }
                                        return statusContent;
                                    }
                                }
                            };

                            gantt.setScaleConfig = function (value) {
                                switch (value) {
                                    case "1":
                                        gantt.config.scale_unit = "day";
                                        gantt.config.date_scale = "%d %M";
                                        gantt.config.subscales = [
                                            {unit: 'month', step: 1, date: '%F, %Y'}
                                        ];
                                        currentScale = 1;
                                        break;
                                    case "2":
                                        gantt.config.scale_unit = "month";
                                        gantt.config.date_scale = "%F, %Y";

                                        var weekScaleTemplate = function (date) {
                                            var dateToStr = gantt.date.date_to_str("%d %M");
                                            var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
                                            return dateToStr(date) + " - " + dateToStr(endDate);
                                        };

                                        gantt.config.subscales = [
                                            {unit: "week", step: 1, template: weekScaleTemplate}
                                        ];
                                        currentScale = 2;

                                        break;
                                    case "3":
                                        gantt.config.scale_unit = "year";
                                        gantt.config.date_scale = "%Y";
                                        var monthScaleTemplate = function (date) {
                                            var dateToStr = gantt.date.date_to_str("%d %M");
                                            var endDate = gantt.date.add(gantt.date.add(date, 1, "month"), -1, "day");
                                            return dateToStr(date) + " - " + dateToStr(endDate);
                                        };
                                        gantt.templates.date_scale = monthScaleTemplate;
                                        gantt.config.subscales = [
                                            {unit: 'month', step: 1, date: '%F, %Y'}
                                        ];
                                        currentScale = 3;

                                        break;
                                }
                            };

                            gantt.attachEvent("onGanttRender", function () {
                                gantt.eachTask(function (task) {
                                    if (task.parent > 0) {
//                                        $('div[task_id="' + task.id + '"] > div.gantt_task_content')
                                        $(document)
                                                .on('mousemove',
                                                        function (event) {
//                                                            posX = event.screenX;
                                                            pageX = event.pageX;
//                                                            posY = event.screenY;

                                                        });
                                        $('div[task_id="' + task.id + '"] > div.gantt_task_content')
                                                .attr('id', task.id);
                                    }
                                });
                            });

                            //init gantt
                            gantt.init($element[0]);
                        }
                    };
                }]);
})();