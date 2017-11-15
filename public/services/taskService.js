(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .factory('Task', ['$http', '$resource', 'serviceURL',
                function ($http, $resource, serviceURL) {
                    return $resource(
                            'api/tasks/:taskId',
                            {
                                taskId: '@taskid'
                            },
                            {
                                update: {
                                    method: 'PUT'
                                }
                            });
                }]);
})();