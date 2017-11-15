(function () {


    function templateHelper($element) {
        var template = $element[0].innerHTML;

        return template.replace(/[\r\n]/g, "").replace(/"/g, "\\\"").replace(/\{\{task\.([^\}]+)\}\}/g, function (match, prop) {
            if (prop.indexOf("|") != -1) {
                var parts = prop.split("|");
                return "\"+gantt.aFilter('" + (parts[1]).trim() + "')(task." + (parts[0]).trim() + ")+\"";
            }
            return '"+task.' + prop + '+"';
        });
    }
    angular.module('onlineProjectManagement').directive('ganttTemplate', ['$filter', function ($filter) {
            gantt.aFilter = $filter;

            return {
                restrict: 'AE',
                terminal: true,
                link: function ($scope, $element, $attrs, $controller) {
                    var template = '';
                    if ($attrs.templateFn) {
                        template = $scope[$attrs.templateFn];
                    } else {
                        template = Function('sd', 'ed', 'task', 'return "' + templateHelper($element) + '"');
                    }
                    gantt.templates[$attrs.ganttTemplate] = template;
                }
            };
        }]);

})();