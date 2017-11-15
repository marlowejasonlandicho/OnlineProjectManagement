(function () {

    function templateHelper($element) {
        var template = $element[0].innerHTML;

        return template.replace(/[\r\n]/g, "").replace(/"/g, "\\\"").replace(/\{\{task\.([^\}]+)\}\}/g,
                function (match, prop) {
                    if (prop.indexOf("|") >= 0) {
                        var parts = prop.split("|");
                        var param = parts[1].trim().split(":");
                        if (param) {
                            return "\"+gantt.aFilter('" + param[0].trim() + "')(task." + parts[0].trim() + "," + param[1].trim() + ")+\"";
                        } else {
                            return "\"+gantt.aFilter('" + parts[1].trim() + "')(task." + parts[0].trim() + ")+\"";
                        }
                    }
                    return '"+task.' + prop + '+"';
                });
    }

    angular.module('onlineProjectManagement')
            .directive('ganttColumn', ['$filter',
                function ($filter) {
                    gantt.aFilter = $filter;
                    return {
                        restrict: 'AE',
                        terminal: true,
                        link: function ($scope, $element, $attrs, $controller) {
                            var label = $attrs.label || " ";
                            var width = $attrs.width || "*";
//                    var width = $attrs.width;
                            var align = $attrs.align || "left";
                            var resize = $attrs.resize || true;
                            var elementVal = $element;

                            var template = '';
                            if ($attrs.templateFn) {
                                template = $scope[$attrs.templateFn];
                            } else {
                                template = template = Function('task', 'return "' + templateHelper(elementVal) + '"');
                            }

                            var config = {
                                template: template,
                                label: label,
                                width: width,
                                align: align,
                                resize: resize
                            };

                            if (!gantt.config.columnsSet)
                                gantt.config.columnsSet = gantt.config.columns = [];

                            if (!gantt.config.columns.length)
                                config.tree = true;
                            gantt.config.columns.push(config);

                        }
                    };
                }]);

})();